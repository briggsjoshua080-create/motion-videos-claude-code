#!/usr/bin/env python3
"""Synthesise the background music and sound effects for the GermanElection video.

Everything is generated from scratch with numpy (no samples, no licences needed):

  public/audio/german-election/music.mp3   quiet ambient bed; chords change on scene cuts
  public/audio/german-election/sfx-*.wav   short, soft one-shots (whoosh, pop, scribble, ...)

The chord changes follow src/compositions/german-election/timeline.json, so run
build_voice.py first. Usage:  python3 -I scripts/german-election/build_music_sfx.py
Requires: numpy, soundfile, ffmpeg on PATH.
"""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/audio/german-election"
TIMELINE = ROOT / "src/compositions/german-election/timeline.json"
SR = 44100
rng = np.random.default_rng(7)  # fixed seed: identical output on every run


def note(name: str) -> float:
    """'A4' -> 440.0, 'F#3' -> 185.0 ..."""
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    pitch, octave = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((names[pitch] + 12 * (octave + 1) - 69) / 12)


def one_pole_lowpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    """Gentle 6 dB/oct low-pass, applied in the frequency domain (fast, zero-phase)."""
    spec = np.fft.rfft(x, axis=0)
    f = np.fft.rfftfreq(x.shape[0], 1 / SR)
    h = 1 / np.sqrt(1 + (f / cutoff) ** 2)
    return np.fft.irfft(spec * (h[:, None] if x.ndim == 2 else h), n=x.shape[0], axis=0)


def fft_convolve(x: np.ndarray, ir: np.ndarray) -> np.ndarray:
    n = x.shape[0] + ir.shape[0] - 1
    size = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:n]


def reverb(stereo: np.ndarray, seconds=2.4, wet=0.35) -> np.ndarray:
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros((stereo.shape[0] + n - 1, 2))
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-t / (seconds / 6.5))
        ir = one_pole_lowpass(ir, 3500)
        ir /= np.sqrt(np.sum(ir**2))
        out[:, ch] = fft_convolve(stereo[:, ch], ir)
    dry = np.zeros_like(out)
    dry[: stereo.shape[0]] = stereo
    return dry * (1 - wet) + out * wet


# ---------------------------------------------------------------- music

def pad_voice(freq: float, length: int, attack: float, release: float) -> np.ndarray:
    t = np.arange(length) / SR
    tone = np.zeros((length, 2))
    for detune, pan in ((-4, 0.25), (0, 0.5), (4, 0.75)):  # cents, stereo position
        f = freq * 2 ** (detune / 1200)
        phase = rng.uniform(0, 2 * np.pi)
        w = np.sin(2 * np.pi * f * t + phase) + 0.25 * np.sin(4 * np.pi * f * t + phase) + 0.08 * np.sin(6 * np.pi * f * t)
        tone[:, 0] += w * np.cos(pan * np.pi / 2)
        tone[:, 1] += w * np.sin(pan * np.pi / 2)
    env = np.minimum(1, t / attack) * np.minimum(1, (t[-1] - t) / release)
    env = np.clip(env, 0, 1) ** 1.5
    return tone * env[:, None] / 3


def mallet(freq: float, velocity: float, pan: float) -> np.ndarray:
    length = int(1.6 * SR)
    t = np.arange(length) / SR
    w = (
        np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.55)
        + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / 0.18)
        + 0.08 * np.sin(2 * np.pi * freq * 4.01 * t) * np.exp(-t / 0.05)
    )
    w *= np.minimum(1, t / 0.004) * velocity
    return np.stack([w * np.cos(pan * np.pi / 2), w * np.sin(pan * np.pi / 2)], axis=1)


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
# Upper chord tones for the mallet line, one octave up.
ARP = {
    "Dadd9": ["F#5", "A5", "E5", "A5"], "Bm7": ["D5", "F#5", "B4", "F#5"], "Gmaj7": ["B4", "D5", "F#5", "D5"],
    "Em7": ["G4", "B4", "D5", "B4"], "A": ["C#5", "E5", "A4", "E5"], "Dmaj7": ["F#5", "A5", "C#5", "A5"],
    "F#m7": ["E5", "A5", "C#5", "A5"], "Asus4": ["D5", "E5", "A4", "E5"], "D": ["F#5", "A5", "D5", "A5"],
}


def build_music(tl: dict, length_s: float) -> np.ndarray:
    fps = tl["fps"]
    sc = {k: v["from"] / fps for k, v in tl["scenes"].items()}
    end = {k: (v["from"] + v["durationInFrames"]) / fps for k, v in tl["scenes"].items()}
    final_hit = tl["sentences"]["steinmeier"]["words"][1]["from"] / fps
    mid = lambda k: (sc[k] + end[k]) / 2  # noqa: E731
    plan = [
        (0.0, "Dadd9"), (sc["votes"], "Bm7"), (mid("votes"), "Gmaj7"),
        (sc["bundestag"], "Em7"), (mid("bundestag"), "A"),
        (sc["chancellor"], "Dmaj7"), (mid("chancellor"), "F#m7"),
        (sc["president"], "Gmaj7"), (mid("president"), "Asus4"), (final_hit, "D"),
    ]
    n = int(length_s * SR)
    mix = np.zeros((n + int(4 * SR), 2))
    for i, (start, chord) in enumerate(plan):
        stop = plan[i + 1][0] if i + 1 < len(plan) else length_s + 1.5
        a, b = int(start * SR), int((stop + 0.9) * SR)  # overlap = soft crossfade
        for name in CHORDS[chord]:
            mix[a:b] += 0.11 * pad_voice(note(name), b - a, attack=0.8 if i else 1.6, release=0.9)
        mix[a:b] += 0.16 * pad_voice(note(BASS[chord]), b - a, attack=0.6, release=0.9)

    # Sparse mallet line from the first cut onwards: one note every 0.75 s (80 bpm).
    step, t, k = 0.75, sc["votes"], 0
    while t < length_s - 1.2:
        chord = [c for s, c in plan if s <= t + 1e-6][-1]
        tones = ARP[chord]
        vel = (0.85, 0.55, 0.7, 0.5)[k % 4] * (0.9 + 0.2 * rng.random())
        hit = mallet(note(tones[k % 4]), vel, pan=0.35 + 0.3 * ((k * 7) % 5) / 4)
        a = int(t * SR)
        mix[a:a + len(hit)] += 0.07 * hit
        t += step
        k += 1
    # Final resolving note on the last name reveal.
    hit = mallet(note("D5"), 0.9, 0.5) + 0.6 * mallet(note("A5"), 0.8, 0.6)
    a = int(final_hit * SR)
    mix[a:a + len(hit)] += 0.08 * hit

    mix = one_pole_lowpass(mix, 2600)
    mix = reverb(mix, seconds=2.6, wet=0.4)[:n]
    t = np.arange(n) / SR
    fade = np.minimum(1, t / 1.0) * np.clip((length_s - t) / 1.4, 0, 1)
    mix *= fade[:, None]
    return mix / np.max(np.abs(mix)) * 10 ** (-3 / 20)


# ---------------------------------------------------------------- sound effects

def shaped_noise(length: int, centre_hz: np.ndarray, width_hz: float) -> np.ndarray:
    """Noise whose band follows centre_hz over time (STFT overlap-add)."""
    hop, win = 256, 1024
    noise = rng.standard_normal(length + win)
    out = np.zeros(length + win)
    window = np.hanning(win)
    freqs = np.fft.rfftfreq(win, 1 / SR)
    for start in range(0, length, hop):
        fc = centre_hz[min(start, length - 1)]
        spec = np.fft.rfft(noise[start:start + win] * window)
        spec *= np.exp(-0.5 * ((freqs - fc) / width_hz) ** 2)
        out[start:start + win] += np.fft.irfft(spec, n=win) * window
    return out[:length]


def env_ad(length: int, attack: float, decay_tau: float) -> np.ndarray:
    t = np.arange(length) / SR
    return np.minimum(1, t / attack) * np.exp(-np.maximum(0, t - attack) / decay_tau)


def normalise(x: np.ndarray, peak_db: float) -> np.ndarray:
    return x / np.max(np.abs(x)) * 10 ** (peak_db / 20)


def sfx_whoosh() -> np.ndarray:
    n = int(0.7 * SR)
    t = np.arange(n) / SR
    centre = 500 + 1700 * np.sin(np.pi * np.clip(t / 0.7, 0, 1)) ** 2
    x = shaped_noise(n, centre, 450)
    env = np.sin(np.pi * np.clip(t / 0.7, 0, 1)) ** 2.2
    x *= env
    pan = np.clip(t / 0.7, 0, 1)
    return normalise(np.stack([x * np.cos(pan * np.pi / 2), x * np.sin(pan * np.pi / 2)], 1), -6)


def sfx_pop() -> np.ndarray:
    n = int(0.18 * SR)
    t = np.arange(n) / SR
    f = 520 + 380 * np.exp(-t / 0.025)
    phase = 2 * np.pi * np.cumsum(f) / SR
    x = (np.sin(phase) + 0.2 * np.sin(2 * phase)) * env_ad(n, 0.003, 0.035)
    return normalise(np.stack([x, x], 1), -6)


def sfx_scribble() -> np.ndarray:
    """Two quick pen strokes (for the crosses on the ballot)."""
    n = int(0.26 * SR)
    t = np.arange(n) / SR
    x = shaped_noise(n, np.full(n, 3200.0), 900)
    strokes = np.exp(-0.5 * ((t - 0.06) / 0.025) ** 2) + 0.8 * np.exp(-0.5 * ((t - 0.17) / 0.028) ** 2)
    x *= strokes
    return normalise(np.stack([x, x], 1), -9)


def sfx_chime() -> np.ndarray:
    n = int(1.8 * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f0, amp in ((note("A5"), 1.0), (note("E6"), 0.55)):
        for ratio, rel, tau in ((1.0, 1.0, 0.9), (2.76, 0.3, 0.28), (5.4, 0.12, 0.09)):
            x += amp * rel * np.sin(2 * np.pi * f0 * ratio * t) * np.exp(-t / tau)
    x *= np.minimum(1, t / 0.004)
    stereo = reverb(np.stack([x, x], 1), seconds=1.6, wet=0.3)[:n]
    return normalise(stereo, -6)


def sfx_riser() -> np.ndarray:
    n = int(1.3 * SR)
    t = np.arange(n) / SR
    p = t / 1.3
    x = shaped_noise(n, 600 + 2600 * p**1.5, 700) * (np.sin(np.pi * p) ** 1.2)
    glide = 2 * np.pi * np.cumsum(220 * 2 ** p) / SR
    x = x + 0.25 * np.sin(glide) * np.sin(np.pi * p) ** 2 * np.max(np.abs(x))
    return normalise(np.stack([x, x], 1), -8)


def sfx_thud() -> np.ndarray:
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    f = 90 + 70 * np.exp(-t / 0.04)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(n, 0.004, 0.08)
    return normalise(np.stack([x, x], 1), -6)


def write_mp3(path: Path, audio: np.ndarray) -> None:
    wav = path.with_suffix(".tmp.wav")
    sf.write(wav, audio, SR, subtype="PCM_16")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "192k", str(path)], check=True)
    wav.unlink()


def main() -> None:
    tl = json.loads(TIMELINE.read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    write_mp3(OUT / "music.mp3", build_music(tl, tl["durationInFrames"] / tl["fps"]))
    for name, fn in {
        "whoosh": sfx_whoosh, "pop": sfx_pop, "scribble": sfx_scribble,
        "chime": sfx_chime, "riser": sfx_riser, "thud": sfx_thud,
    }.items():
        sf.write(OUT / f"sfx-{name}.wav", fn(), SR, subtype="PCM_16")
    print("wrote", ", ".join(sorted(p.name for p in OUT.iterdir())))


if __name__ == "__main__":
    main()
