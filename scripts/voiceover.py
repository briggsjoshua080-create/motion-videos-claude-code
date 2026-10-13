#!/usr/bin/env python3
"""Make an AI voice-over (Kokoro TTS) plus word timings for subtitles.

    .voice/venv/bin/python scripts/voiceover.py src/voiceover/<name>.script.json

Writes public/voiceover/<name>.wav and src/voiceover/<name>.timing.json.
One-time setup is described in CLAUDE.md under "Making the voice-over".

Kokoro does not report when each word is spoken, so word timings are estimated:
the real pauses in the audio (at commas and full stops) anchor each phrase, and
inside a phrase the time is shared out by how many sounds each word has.
"""
import json
import sys
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
MODELS = ROOT / ".voice" / "models"
# Official model files of the kokoro-onnx project (Kokoro-82M, Apache-2.0).
MODEL_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"
MODEL_FILES = ["kokoro-v1.0.onnx", "voices-v1.0.bin"]

PUNCTUATION = ",.?!;:"
QUOTES = "\"'()"
FRAME = 0.01  # seconds per loudness frame
MIN_GAP = 0.08  # shortest silence that can count as a pause between phrases
EDGE_PAD = 0.03  # silence kept before the first and after the last sound
PAUSE_WEIGHT = 1.5  # an unheard pause at punctuation, counted in "sounds"
PEAK = 0.89  # loudest sample of the finished track (-1 dBFS), so the voice is phone-loud


def ensure_models() -> None:
    MODELS.mkdir(parents=True, exist_ok=True)
    for name in MODEL_FILES:
        target = MODELS / name
        if not target.exists():
            print(f"Downloading {name} ...")
            urllib.request.urlretrieve(MODEL_URL + name, target)


def split_token(token: str) -> tuple[str, str, str]:
    """'"twice?"' -> ('"', 'twice', '?"')"""
    start, end = 0, len(token)
    while start < end and token[start] in QUOTES:
        start += 1
    while end > start and token[end - 1] in PUNCTUATION + QUOTES:
        end -= 1
    return token[:start], token[start:end], token[end:]


def sound_count(phonemes: str) -> int:
    return max(1, sum(1 for ch in phonemes if ch.isalpha() or ch in "əɪʊɛɒʌɔæɑɜθðʃʒŋɹ"))


def loudness(samples: np.ndarray, sr: int) -> np.ndarray:
    hop = int(sr * FRAME)
    frames = len(samples) // hop
    chunks = samples[: frames * hop].reshape(frames, hop)
    return np.sqrt((chunks**2).mean(axis=1))


def find_pauses(rms: np.ndarray, first: int, last: int, threshold: float) -> list[tuple[int, int]]:
    """Silent runs (in frames) strictly inside the spoken part."""
    pauses, run_start = [], None
    for i in range(first, last + 1):
        if rms[i] < threshold:
            run_start = i if run_start is None else run_start
        elif run_start is not None:
            if (i - run_start) * FRAME >= MIN_GAP:
                pauses.append((run_start, i))
            run_start = None
    return pauses


def share_out(start: float, end: float, weights: list[float]) -> list[tuple[float, float]]:
    total = sum(weights)
    spans, t = [], start
    for w in weights:
        nxt = t + (end - start) * w / total
        spans.append((t, nxt))
        t = nxt
    return spans


def word_spans(start: float, end: float, words: list) -> list[tuple[float, float]]:
    """Share [start, end] between words by sound count, leaving a slot for each pause."""
    weights, owners = [], []
    for i, w in enumerate(words):
        weights.append(sound_count(w[1]))
        owners.append(i)
        if w[2] and i < len(words) - 1:
            weights.append(PAUSE_WEIGHT)
            owners.append(None)
    spans = share_out(start, end, weights)
    return [span for span, owner in zip(spans, owners) if owner is not None]


def align(words: list, pauses: list[tuple[float, float]], start: float, end: float) -> tuple[list, int]:
    """Word (start, end) times. A pause anchors a phrase break only if it sits near where
    the break is expected; other breaks are estimated."""
    breaks = [i for i, w in enumerate(words[:-1]) if w[2]]
    rough = word_spans(start, end, words)
    tolerance = max(0.3, 0.12 * (end - start))
    anchors, used = [], -1  # (word index the break follows, pause)
    for b in breaks:
        expected = rough[b][1] + (rough[b + 1][0] - rough[b][1]) / 2
        options = [
            (abs((p[0] + p[1]) / 2 - expected), j)
            for j, p in enumerate(pauses)
            if j > used and abs((p[0] + p[1]) / 2 - expected) <= tolerance
        ]
        if options:
            used = min(options)[1]
            anchors.append((b, pauses[used]))

    spans, first, t = [], 0, start
    for b, (p_start, p_end) in anchors + [(len(words) - 1, (end, end))]:
        spans += word_spans(t, p_start, words[first : b + 1])
        first, t = b + 1, p_end
    return spans, len(anchors)


def synthesize_sentence(kokoro: Kokoro, cfg: dict, text: str):
    lang = cfg.get("lang", "en-gb")
    say, pronounce = cfg.get("say", {}), cfg.get("pronounce", {})

    words = []  # (display token, phonemes used for timing, ends a phrase?)
    chunks, pending = [], []

    def flush():
        if pending:
            chunks.append(kokoro.tokenizer.phonemize(" ".join(pending), lang))
            pending.clear()

    for token in text.split():
        lead, core, trail = split_token(token)
        spoken = say.get(core, core)
        if core in pronounce:
            flush()
            phonemes = pronounce[core]
            chunks.append(phonemes + "".join(c for c in trail if c in PUNCTUATION))
        else:
            phonemes = kokoro.tokenizer.phonemize(spoken, lang)
            pending.append(lead + spoken + trail)
        words.append((token, phonemes, any(c in PUNCTUATION for c in trail)))
    flush()

    samples, sr = kokoro.create(
        " ".join(chunks), voice=cfg["voice"], speed=cfg.get("speed", 1.0), lang=lang, is_phonemes=True
    )
    rms = loudness(samples, sr)
    threshold = 0.06 * rms.max()
    loud = np.nonzero(rms >= threshold)[0]
    first, last = int(loud[0]), int(loud[-1])

    # Cut the clip down to the spoken part (plus a little air).
    a = max(0, int((first * FRAME - EDGE_PAD) * sr))
    b = min(len(samples), int(((last + 1) * FRAME + EDGE_PAD) * sr))
    clip = samples[a:b]
    offset = a / sr

    pauses = [(a * FRAME, b * FRAME) for a, b in find_pauses(rms, first, last, threshold)]
    spans, anchored = align(words, pauses, first * FRAME, (last + 1) * FRAME)
    timings = [(w[0], s - offset, e - offset) for w, (s, e) in zip(words, spans)]
    breaks = sum(1 for w in words[:-1] if w[2])
    return clip, sr, timings, anchored, breaks


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    script_path = Path(sys.argv[1]).resolve()
    cfg = json.loads(script_path.read_text())
    name = script_path.name.removesuffix(".script.json")

    ensure_models()
    kokoro = Kokoro(str(MODELS / MODEL_FILES[0]), str(MODELS / MODEL_FILES[1]))

    sr = 24000
    track = [np.zeros(int(cfg.get("leadIn", 0.25) * sr), dtype=np.float32)]
    cursor = cfg.get("leadIn", 0.25)
    sentences = []
    for s in cfg["sentences"]:
        clip, sr, timings, anchored, breaks = synthesize_sentence(kokoro, cfg, s["text"])
        duration = len(clip) / sr
        sentences.append(
            {
                "id": s["id"],
                "text": s["text"],
                "start": round(cursor + timings[0][1], 3),
                "end": round(cursor + timings[-1][2], 3),
                "words": [
                    {"text": t, "start": round(cursor + a, 3), "end": round(cursor + b, 3)} for t, a, b in timings
                ],
            }
        )
        print(f"{s['id']:>12}  {cursor:6.2f}s -> {cursor + duration:6.2f}s  {anchored}/{breaks} pauses heard")
        gap = s.get("pauseAfter", cfg.get("pauseAfter", 0.35))
        track += [clip.astype(np.float32), np.zeros(int(gap * sr), dtype=np.float32)]
        cursor += duration + gap

    audio = np.concatenate(track)
    audio *= PEAK / np.abs(audio).max()
    audio_rel = f"voiceover/{name}.wav"
    (ROOT / "public" / "voiceover").mkdir(parents=True, exist_ok=True)
    sf.write(ROOT / "public" / audio_rel, audio, sr, subtype="PCM_16")

    timing = {
        "audio": audio_rel,
        "voice": cfg["voice"],
        "durationInSeconds": round(len(audio) / sr, 3),
        "sentences": sentences,
    }
    timing_path = script_path.with_name(f"{name}.timing.json")
    timing_path.write_text(json.dumps(timing, ensure_ascii=False, indent=1) + "\n")
    print(f"\nWrote public/{audio_rel} ({timing['durationInSeconds']}s) and {timing_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
