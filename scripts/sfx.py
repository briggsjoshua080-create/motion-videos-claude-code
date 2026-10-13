#!/usr/bin/env python3
"""Shared, soft sound effects for every video, synthesised from scratch (no samples, no licences).

    .voice/venv/bin/python scripts/sfx.py      (or: npm run sfx)

Writes public/audio/sfx/{whoosh,pop,chime,scribble,thud}.wav. They are committed, so you only need to run
this again after changing a sound. Use them lightly (volume 0.12-0.3) on scene changes and reveals:
  whoosh: scene change     pop: an item appears     chime: a key fact lands
  scribble: a pen stroke   thud: a stamp / slam
Requires numpy and soundfile (both in the voice venv).
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio" / "sfx"
SR = 44100
rng = np.random.default_rng(7)  # fixed seed: identical output on every run


def normalise(x: np.ndarray, peak_db: float) -> np.ndarray:
    return x / np.max(np.abs(x)) * 10 ** (peak_db / 20)


def env_ad(length: int, attack: float, decay_tau: float) -> np.ndarray:
    t = np.arange(length) / SR
    return np.minimum(1, t / attack) * np.exp(-np.maximum(0, t - attack) / decay_tau)


def shaped_noise(length: int, centre_hz: np.ndarray, width_hz: float) -> np.ndarray:
    """Noise whose band follows centre_hz over time (STFT overlap-add)."""
    hop, win = 256, 1024
    noise = rng.standard_normal(length + win)
    out = np.zeros(length + win)
    window = np.hanning(win)
    freqs = np.fft.rfftfreq(win, 1 / SR)
    for start in range(0, length, hop):
        spec = np.fft.rfft(noise[start : start + win] * window)
        spec *= np.exp(-0.5 * ((freqs - centre_hz[min(start, length - 1)]) / width_hz) ** 2)
        out[start : start + win] += np.fft.irfft(spec, n=win) * window
    return out[:length]


def whoosh() -> np.ndarray:
    n = int(0.7 * SR)
    p = np.clip(np.arange(n) / SR / 0.7, 0, 1)
    x = shaped_noise(n, 500 + 1700 * np.sin(np.pi * p) ** 2, 450) * np.sin(np.pi * p) ** 2.2
    return normalise(np.stack([x * np.cos(p * np.pi / 2), x * np.sin(p * np.pi / 2)], 1), -6)


def pop() -> np.ndarray:
    n = int(0.18 * SR)
    t = np.arange(n) / SR
    phase = 2 * np.pi * np.cumsum(520 + 380 * np.exp(-t / 0.025)) / SR
    x = (np.sin(phase) + 0.2 * np.sin(2 * phase)) * env_ad(n, 0.003, 0.035)
    return normalise(np.stack([x, x], 1), -6)


def chime() -> np.ndarray:
    n = int(1.8 * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f0, amp in ((880.0, 1.0), (1318.5, 0.55)):  # A5 + E6
        for ratio, rel, tau in ((1.0, 1.0, 0.9), (2.76, 0.3, 0.28), (5.4, 0.12, 0.09)):
            x += amp * rel * np.sin(2 * np.pi * f0 * ratio * t) * np.exp(-t / tau)
    x *= np.minimum(1, t / 0.004)
    return normalise(np.stack([x, x], 1), -6)


def scribble() -> np.ndarray:
    """Two quick pen strokes (signatures, ticks, crosses)."""
    n = int(0.26 * SR)
    t = np.arange(n) / SR
    x = shaped_noise(n, np.full(n, 3200.0), 900)
    x *= np.exp(-0.5 * ((t - 0.06) / 0.025) ** 2) + 0.8 * np.exp(-0.5 * ((t - 0.17) / 0.028) ** 2)
    return normalise(np.stack([x, x], 1), -9)


def thud() -> np.ndarray:
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * np.cumsum(90 + 70 * np.exp(-t / 0.04)) / SR) * env_ad(n, 0.004, 0.08)
    return normalise(np.stack([x, x], 1), -6)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in {"whoosh": whoosh, "pop": pop, "chime": chime, "scribble": scribble, "thud": thud}.items():
        sf.write(OUT / f"{name}.wav", fn(), SR, subtype="PCM_16")
    print("Wrote", ", ".join(f"public/audio/sfx/{p.name}" for p in sorted(OUT.glob("*.wav"))))


if __name__ == "__main__":
    main()
