#!/usr/bin/env python3
"""Generate the voice-over and the timeline for the GermanElection video.

The narration below is the single source of truth: this script synthesises it with
Kokoro (offline neural TTS, Apache-2.0), lays the sentences out on a 30 s timeline and
writes

  public/audio/german-election/voice.wav           the full voice-over track
  src/compositions/german-election/timeline.json  scene + sentence + word timings (frames)

Every animation, subtitle and sound effect in the composition is keyed off timeline.json,
so re-running this script after editing the narration keeps everything in sync.

Usage:
  python3 -I scripts/german-election/build_voice.py --model-dir <dir>

<dir> must contain kokoro-v1.0.onnx and voices-v1.0.bin from
https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
Requires: pip install kokoro-onnx soundfile
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parents[2]
VOICE_OUT = ROOT / "public/audio/german-election/voice.wav"
TIMELINE_OUT = ROOT / "src/compositions/german-election/timeline.json"

FPS = 30
TOTAL_SECONDS = 30.0
VOICE = "bm_george"  # calm British male, documentary feel
LANG = "en-gb"
SPEED = 1.05
SENTENCE_GAP = 0.22  # pause between sentences inside a scene (s)
MIN_TAIL = 0.2  # silence kept at the end of every scene (s)
FINAL_TAIL = 0.5  # hold after the last sentence so the last visual can settle (s)

# *word* marks a highlighted (gold) word in the subtitles.
# "|" splits a long sentence into two subtitle lines shown one after the other.
SCENES = [
    {"id": "title", "planned": 4.0, "lead": 0.4, "sentences": [
        {"id": "hook", "text": "How does Germany choose its *leaders?*"},
    ]},
    {"id": "votes", "planned": 7.0, "lead": 0.15, "sentences": [
        {"id": "twoVotes", "text": "Voters cast *two votes.*"},
        {"id": "firstVote", "text": "The *first* picks a *local candidate.*"},
        {"id": "secondVote", "text": "The *second* decides each *party's strength.*"},
    ]},
    {"id": "bundestag", "planned": 6.0, "lead": 0.15, "sentences": [
        {"id": "threshold", "text": "Parties need *5%* to enter."},
        {"id": "seats", "text": "The *Bundestag* has *630 seats.*"},
    ]},
    {"id": "chancellor", "planned": 7.0, "lead": 0.15, "sentences": [
        {"id": "elect", "text": "It elects the *Chancellor,* | with at least *316 votes.*"},
        {"id": "merz", "text": "Today: *Friedrich Merz.*"},
    ]},
    {"id": "president", "planned": 6.0, "lead": 0.15, "sentences": [
        {"id": "convention", "text": "The *President* is chosen | by a *Federal Convention.*"},
        {"id": "steinmeier", "text": "Today: *Frank-Walter Steinmeier.*"},
    ]},
]

# How on-screen words are spoken.
SPOKEN = {
    "5%": "five percent",
    "630": "six hundred and thirty",
    "316": "three hundred and sixteen",
}

# Pronunciation fixes applied to the phonemizer output (espeak, en-gb).
PHONEME_FIXES = {
    "fɹˈiːdɹɪtʃ": "fɹˈiːdɹɪk",  # Friedrich
    "mˈɜːz": "mˈɛəts",  # Merz
    "fɹˈaŋkwˈɒltə": "fɹˈaŋk vˈaltə",  # Frank-Walter
    "stˈaɪnmaɪə": "ʃtˈaɪnmaɪə",  # Steinmeier
    "bˈʌndɪstˌaɡ": "bˈʊndəstˌɑːɡ",  # Bundestag
}


def display_words(text: str) -> list[dict]:
    """Split subtitle text into words, keeping highlight and line-break markers."""
    words, line = [], 0
    for raw in text.split():
        if raw == "|":
            line += 1
            continue
        hl = raw.startswith("*") or raw.rstrip(",.?!:").endswith("*")
        clean = raw.replace("*", "")
        words.append({"text": clean, "hl": hl, "line": line})
    # Words inside a *multi word* span are highlighted too.
    inside = False
    for raw, w in zip([r for r in text.split() if r != "|"], words):
        if raw.startswith("*"):
            inside = True
        if inside:
            w["hl"] = True
        if raw.rstrip(",.?!:").endswith("*"):
            inside = False
    return words


def spoken_text(words: list[dict]) -> str:
    out = []
    for w in words:
        core = w["text"].rstrip(",.?!:")
        tail = w["text"][len(core):]
        out.append(SPOKEN.get(core, core) + tail)
    return " ".join(out)


def phonemes_for(kokoro: Kokoro, text: str) -> str:
    ph = kokoro.tokenizer.phonemize(text, LANG)
    for bad, good in PHONEME_FIXES.items():
        ph = ph.replace(bad, good)
    return ph


def word_weight(kokoro: Kokoro, word: str) -> float:
    """Relative speaking time of one on-screen word (phoneme count + punctuation pause)."""
    core = word.rstrip(",.?!:")
    ph = phonemes_for(kokoro, SPOKEN.get(core, core))
    n = len(re.sub(r"[ˈˌː\s]", "", ph))
    pause = 3 if word[-1:] in ",:" else 0
    return max(n, 1) + pause


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--model-dir", required=True, type=Path)
    args = ap.parse_args()

    kokoro = Kokoro(str(args.model_dir / "kokoro-v1.0.onnx"), str(args.model_dir / "voices-v1.0.bin"))

    # 1. Synthesise every sentence on its own (natural prosody, exact boundaries).
    clips = {}
    for scene in SCENES:
        for s in scene["sentences"]:
            words = display_words(s["text"])
            ph = phonemes_for(kokoro, spoken_text(words))
            audio, sr = kokoro.create(ph, voice=VOICE, speed=SPEED, lang=LANG, is_phonemes=True)
            clips[s["id"]] = {"audio": audio.astype(np.float32), "sr": sr, "words": words, "phonemes": ph}
            print(f"{s['id']:<11} {len(audio) / sr:5.2f}s  {ph}")

    sr = next(iter(clips.values()))["sr"]

    # 2. Scene lengths: what the speech needs, then share the remaining time out evenly.
    needs = []
    for i, scene in enumerate(SCENES):
        speech = sum(len(clips[s["id"]]["audio"]) / sr for s in scene["sentences"])
        gaps = SENTENCE_GAP * (len(scene["sentences"]) - 1)
        tail = FINAL_TAIL if i == len(SCENES) - 1 else MIN_TAIL
        needs.append(scene["lead"] + speech + gaps + tail)
    slack = TOTAL_SECONDS - sum(needs)
    if slack < 0:
        raise SystemExit(f"Narration is {-slack:.2f}s too long for {TOTAL_SECONDS}s - raise SPEED or trim text")
    # Give slack where the plan wanted more room than the speech needs.
    want = [max(sc["planned"] - n, 0.0) for sc, n in zip(SCENES, needs)]
    total_want = sum(want) or 1.0
    lengths = [n + slack * w / total_want for n, w in zip(needs, want)]

    total_frames = round(TOTAL_SECONDS * FPS)
    frames, acc = [], 0
    for i, length in enumerate(lengths):
        end = total_frames if i == len(lengths) - 1 else round((sum(lengths[: i + 1])) * FPS)
        frames.append((acc, end - acc))
        acc = end

    # 3. Place sentences and estimate word timings.
    track = np.zeros(int(TOTAL_SECONDS * sr), dtype=np.float32)
    timeline = {"fps": FPS, "durationInFrames": total_frames, "voice": VOICE, "scenes": {}, "sentences": {}}
    for scene, (start_f, dur_f) in zip(SCENES, frames):
        timeline["scenes"][scene["id"]] = {"from": start_f, "durationInFrames": dur_f}
        t = start_f / FPS + scene["lead"]
        for s in scene["sentences"]:
            clip = clips[s["id"]]
            audio = clip["audio"]
            i0 = int(round(t * sr))
            track[i0:i0 + len(audio)] += audio
            dur = len(audio) / sr
            weights = [word_weight(kokoro, w["text"]) for w in clip["words"]]
            total_w = sum(weights)
            words_out, acc_w = [], 0.0
            for w, wt in zip(clip["words"], weights):
                w_from = t + dur * acc_w / total_w
                acc_w += wt
                w_to = t + dur * acc_w / total_w
                words_out.append({**w, "from": round(w_from * FPS), "to": round(w_to * FPS)})
            timeline["sentences"][s["id"]] = {
                "scene": scene["id"],
                "from": round(t * FPS),
                "to": round((t + dur) * FPS),
                "words": words_out,
            }
            t += dur + SENTENCE_GAP

    # 4. Level the voice: speech RMS about -19 dBFS, peaks below -1 dBFS.
    active = np.abs(track) > 0.01
    rms = float(np.sqrt(np.mean(track[active] ** 2)))
    gain = min(10 ** (-19 / 20) / rms, 10 ** (-1 / 20) / float(np.max(np.abs(track))))
    track *= gain

    VOICE_OUT.parent.mkdir(parents=True, exist_ok=True)
    sf.write(VOICE_OUT, track, sr, subtype="PCM_16")
    TIMELINE_OUT.parent.mkdir(parents=True, exist_ok=True)
    TIMELINE_OUT.write_text(json.dumps(timeline, indent=2) + "\n")

    for sid, (f, d) in zip([s["id"] for s in SCENES], frames):
        print(f"scene {sid:<11} from {f:4d}  {d:4d} frames ({d / FPS:.2f}s)")
    print(f"wrote {VOICE_OUT.relative_to(ROOT)} and {TIMELINE_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
