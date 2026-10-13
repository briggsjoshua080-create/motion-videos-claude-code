#!/usr/bin/env bash
# Render the GermanElection video, then master its audio to -14 LUFS / -1.5 dBTP
# (the loudness TikTok, Reels and YouTube normalise to). The video stream is copied untouched.
#
# Usage: scripts/german-election/render.sh [extra remotion flags]
#   e.g. scripts/german-election/render.sh --browser-executable=/path/to/chrome-headless-shell
set -euo pipefail
cd "$(dirname "$0")/../.."
mkdir -p out

RAW=out/german-election-system-raw.mp4
OUT=out/german-election-system.mp4

npx remotion render src/index.ts GermanElection "$RAW" "$@"

# A transparent peak limiter first (catches the few voice peaks that would otherwise clip after the
# gain), then two-pass loudnorm: measure, then apply one linear gain that hits the target exactly.
LIMIT="alimiter=limit=0.45:attack=3:release=60:level=false"
STATS=$(ffmpeg -hide_banner -nostats -i "$RAW" -af "$LIMIT,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 |
  python3 -c 'import json,sys; t=sys.stdin.read(); i=t.rindex("{"); print(json.dumps(json.loads(t[i:t.index("}", i)+1])))')
read -r I TP LRA THRESH OFFSET < <(python3 -c 'import json,sys; d=json.loads(sys.argv[1]); print(d["input_i"], d["input_tp"], d["input_lra"], d["input_thresh"], d["target_offset"])' "$STATS")

ffmpeg -y -loglevel error -i "$RAW" -c:v copy \
  -af "$LIMIT,loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$THRESH:offset=$OFFSET:linear=true" \
  -ar 48000 -c:a aac -b:a 192k -movflags +faststart "$OUT"

echo "Wrote $OUT"
