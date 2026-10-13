#!/usr/bin/env python3
"""Soft background music for any voice-over video, synthesised from scratch (no samples, no licences).

    .voice/venv/bin/python scripts/music.py src/voiceover/<name>.timing.json [--transpose N] [--tail S]
    (or: npm run music -- src/voiceover/<name>.timing.json)

Writes public/audio/<name>/music.mp3. The chords change exactly when each narration sentence
starts, a quiet mallet line carries the rhythm, and when the last sentence is a question the music
ends on an open, unresolved chord. The track runs `--tail` seconds past the voice; let the
composition fade it out. `--transpose` (semitones) gives each video its own colour.
Requires numpy, soundfile (both in the voice venv) and ffmpeg on PATH.
"""

from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
SR = 44100
rng = np.random.default_rng(7)  # fixed seed: identical output on every run

NAMES = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}

# Calm, hopeful progression in D major (transposable). One chord per sentence, cycling.
PROGRESSION = ["Dadd9", "Bm7", "Gmaj7", "A", "Dmaj7", "F#m7", "Gmaj7", "Em7", "A"]
CHORDS = {
    "Dadd9": ["D3", "A3", "E4", "F#4", "A4"],
    "Bm7": ["B2", "F#3", "A3", "D4", "F#4"],
    "Gmaj7": ["G2", "D3", "F#3", "B3", "D4"],
    "Em7": ["E2", "B2", "D3", "G3", "B3"],
    "A": ["A2", "E3", "A3", "C#4", "E4"],
    "Dmaj7": ["D3", "A3", "C#4", "F#4", "A4"],
    "F#m7": ["F#2", "C#3", "E3", "A3", "C#4"],
    "Asus4": ["A2", "E3", "A3", "D4", "E4"],
    "D": ["D3", "A3", "D4", "F#4", "A4"],
}
BASS = {"Dadd9": "D2", "Bm7": "B1", "Gmaj7": "G1", "Em7": "E2", "A": "A1", "Dmaj7": "D2", "F#m7": "F#1", "Asus4": "A1", "D": "D2"}
ARP = {
    "Dadd9": ["F#5", "A5", "E5", "A5"], "Bm7": ["D5", "F#5", "B4", "F#5"], "Gmaj7": ["B4", "D5", "F#5", "D5"],
    "Em7": ["G4", "B4", "D5", "B4"], "A": ["C#5", "E5", "A4", "E5"], "Dmaj7": ["F#5", "A5", "C#5", "A5"],
    "F#m7": ["E5", "A5", "C#5", "A5"], "Asus4": ["D5", "E5", "A4", "E5"], "D": ["F#5", "A5", "D5", "A5"],
}


def note(name: str, transpose: int) -> float:
    """'A4' -> 440 Hz (shifted by `transpose` semitones)."""
    pitch, octave = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((NAMES[pitch] + 12 * (octave + 1) - 69 + transpose) / 12)


def lowpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    """Gentle 6 dB/oct low-pass in the frequency domain (fast, zero-phase)."""
    spec = np.fft.rfft(x, axis=0)
    f = np.fft.rfftfreq(x.shape[0], 1 / SR)
    return np.fft.irfft(spec * (1 / np.sqrt(1 + (f / cutoff) ** 2))[:, None], n=x.shape[0], axis=0)


def reverb(stereo: np.ndarray, seconds: float = 2.6, wet: float = 0.4) -> np.ndarray:
    n = int(seconds * SR)
    t = np.arange(n) / SR
    size = 1 << (stereo.shape[0] + n - 2).bit_length()
    out = np.zeros((stereo.shape[0] + n - 1, 2))
    for ch in range(2):
        ir = lowpass((rng.standard_normal(n) * np.exp(-t / (seconds / 6.5)))[:, None], 3500)[:, 0]
        ir /= np.sqrt(np.sum(ir**2))
        out[:, ch] = np.fft.irfft(np.fft.rfft(stereo[:, ch], size) * np.fft.rfft(ir, size), size)[: out.shape[0]]
    dry = np.zeros_like(out)
    dry[: stereo.shape[0]] = stereo
    return dry * (1 - wet) + out * wet


def pad_voice(freq: float, length: int, attack: float, release: float) -> np.ndarray:
    """Three slightly detuned soft tones spread across the stereo field."""
    t = np.arange(length) / SR
    tone = np.zeros((length, 2))
    for detune, pan in ((-4, 0.25), (0, 0.5), (4, 0.75)):  # cents, stereo position
        f = freq * 2 ** (detune / 1200)
        phase = rng.uniform(0, 2 * np.pi)
        w = np.sin(2 * np.pi * f * t + phase) + 0.25 * np.sin(4 * np.pi * f * t + phase) + 0.08 * np.sin(6 * np.pi * f * t)
        tone[:, 0] += w * np.cos(pan * np.pi / 2)
        tone[:, 1] += w * np.sin(pan * np.pi / 2)
    env = np.clip(np.minimum(1, t / attack) * np.minimum(1, (t[-1] - t) / release), 0, 1) ** 1.5
    return tone * env[:, None] / 3


def mallet(freq: float, velocity: float, pan: float) -> np.ndarray:
    t = np.arange(int(1.6 * SR)) / SR
    w = (
        np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.55)
        + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / 0.18)
        + 0.08 * np.sin(2 * np.pi * freq * 4.01 * t) * np.exp(-t / 0.05)
    ) * np.minimum(1, t / 0.004) * velocity
    return np.stack([w * np.cos(pan * np.pi / 2), w * np.sin(pan * np.pi / 2)], axis=1)


def build(timing: dict, tail: float, transpose: int) -> np.ndarray:
    sentences = timing["sentences"]
    length = timing["durationInSeconds"] + tail
    ending = "Asus4" if sentences[-1]["text"].rstrip().endswith("?") else "D"
    plan = [(0.0 if i == 0 else s["start"], PROGRESSION[i % len(PROGRESSION)]) for i, s in enumerate(sentences[:-1])]
    plan.append((sentences[-1]["start"], ending))

    n = int(length * SR)
    mix = np.zeros((n + int(4 * SR), 2))
    for i, (start, chord) in enumerate(plan):
        stop = plan[i + 1][0] if i + 1 < len(plan) else length + 1.5
        a, b = int(start * SR), int((stop + 0.9) * SR)  # overlap = soft crossfade
        for name in CHORDS[chord]:
            mix[a:b] += 0.11 * pad_voice(note(name, transpose), b - a, attack=0.8 if i else 1.6, release=0.9)
        mix[a:b] += 0.16 * pad_voice(note(BASS[chord], transpose), b - a, attack=0.6, release=0.9)

    # Sparse mallet line from the second sentence on: one note every 0.75 s (80 bpm).
    t, k = plan[1][0] if len(plan) > 1 else 0.0, 0
    while t < length - 1.2:
        chord = [c for s, c in plan if s <= t + 1e-6][-1]
        vel = (0.85, 0.55, 0.7, 0.5)[k % 4] * (0.9 + 0.2 * rng.random())
        hit = mallet(note(ARP[chord][k % 4], transpose), vel, pan=0.35 + 0.3 * ((k * 7) % 5) / 4)
        a = int(t * SR)
        mix[a : a + len(hit)] += 0.07 * hit
        t += 0.75
        k += 1

    mix = reverb(lowpass(mix, 2600))[:n]
    t = np.arange(n) / SR
    mix *= (np.minimum(1, t / 1.0) * np.clip((length - t) / 1.4, 0, 1))[:, None]
    return mix / np.max(np.abs(mix)) * 10 ** (-3 / 20)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("timing", help="src/voiceover/<name>.timing.json from scripts/voiceover.py")
    parser.add_argument("--transpose", type=int, default=0, help="semitones up (+) or down (-)")
    parser.add_argument("--tail", type=float, default=2.5, help="seconds of music after the voice ends")
    args = parser.parse_args()

    timing_path = Path(args.timing).resolve()
    name = timing_path.name.removesuffix(".timing.json")
    out = ROOT / "public" / "audio" / name / "music.mp3"
    out.parent.mkdir(parents=True, exist_ok=True)

    audio = build(json.loads(timing_path.read_text()), args.tail, args.transpose)
    wav = out.with_suffix(".tmp.wav")
    sf.write(wav, audio, SR, subtype="PCM_16")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "192k", str(out)], check=True)
    wav.unlink()
    print(f"Wrote {out.relative_to(ROOT)} ({len(audio) / SR:.1f}s)")


if __name__ == "__main__":
    main()
