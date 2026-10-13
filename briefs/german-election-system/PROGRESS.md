# Video Production Progress: German election system

## Current State
- **Current Phase**: Done
- **Current Step**: Delivered `out/german-election-system.mp4`; waiting for feedback
- **Last Updated**: 2026-10-13

## Project Info
- **Topic**: How the German election system works (Bundestag, Chancellor, President), for beginners
- **Composition**: `GermanElection` (src/compositions/GermanElection.tsx), 1080×1920, 30 fps, 900 frames
- **Brief**: `briefs/motion-video-brief.xlsx` (sheet "German Election - example")
- **Skills**: `.claude/skills/educational-video-creator` and `.claude/skills/remotion-best-practices`, adapted to this repo's layout (CLAUDE.md) instead of a `remotion_video/` folder

## Phase Checklist
### Phase 1: Requirements ✅
- [x] Topic, audience (students and beginners), language (English), 30 s, 9:16. Answers are in the brief spreadsheet.
### Phase 1.5: Script ✅
- [x] Full narration and fact sheet in `script.md`. The user approved the draft; 4 sentences were tightened to fit 30 s (listed in script.md).
### Phase 2: Storyboard ✅
- [x] 5 scenes plus the persistent header, subtitles and audio, in `storyboard.md`
### Phase 3: Visual design ✅
- [x] Paper, ink and German flag palette, Inter font, `COLORS`/`LAYOUT` in `src/compositions/german-election/constants.ts`
### Phase 4: Animation ✅
- [x] Scenes in `src/scenes/german-election/`, components in `src/components/german-election/`
- [x] Every visual cue is derived from `timeline.json` via `cue()`, with no hard-coded narration frames
- [x] Persistent background layer, header, subtitles
### Phase 4.5: Audio ✅
- [x] edge-tts is blocked by this environment's network policy, so the voice uses **Kokoro TTS** instead (offline, Apache-2.0, voice `bm_george`)
- [x] `scripts/german-election/build_voice.py` writes `public/audio/german-election/voice.wav` and `timeline.json`
- [x] `scripts/german-election/build_music_sfx.py` writes `music.mp3` and `sfx-*.wav` (synthesised, royalty-free)
- [x] Music is ducked under speech, and the final master is normalised to −14 LUFS by `scripts/german-election/render.sh`
### Phase 5: QA
- [x] `npm run typecheck`
- [x] Key-frame stills reviewed (60, 140, 215, 300, 360, 400, 470, 560, 630, 690, 760, 850, 899)
- [x] Transition frames reviewed in the full render. Scene exits were tightened so the old and new scenes no longer pile up, and frame 0 is no longer empty.
- [x] ffprobe: h264 1080×1920, 30 fps, 900 frames (30.0 s), AAC 48 kHz stereo. Loudness −14.0 LUFS, true peak −2.4 dBFS. Music and SFX sit about 16 dB under the voice.
### Phase 6: Export
- [x] `out/german-election-system.mp4` sent to the user (render: `npm run render:german-election`)

## Decisions
| Decision | Why |
|---|---|
| Kokoro `bm_george` at speed 1.05 | edge-tts is blocked here; a calm British male voice gives the documentary feel requested |
| Scenes placed with `<Sequence>`s on one global timeline, not `<TransitionSeries>` | The hemicycle carries on across scenes 3–5 and morphs into the Federal Convention |
| Neutral, unlabelled party bars | Keeps the video party-neutral |
| Generic characters, no portraits | Avoids likenesses of real people; the names are given on cards |

## Files Created
- `src/compositions/GermanElection.tsx`, `src/compositions/german-election/{constants.ts,timeline.json}`
- `src/scenes/german-election/{TitleScene,VotesScene,ThresholdScene,ParliamentLayer,ChancellorScene,PresidentScene}.tsx`
- `src/components/german-election/{Paper,Header,Subtitles,NameCard,icons}.tsx`, `motion.ts`, `germany.ts`
- `public/audio/german-election/{voice.wav,music.mp3,sfx-*.wav}`
- `scripts/german-election/{build_voice.py,build_music_sfx.py,render.sh}`
- `briefs/german-election-system/{script.md,storyboard.md,PROGRESS.md}`
