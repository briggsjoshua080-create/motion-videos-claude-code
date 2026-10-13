# Video Production Progress: Who runs the Netherlands? (Dutch election system)

## Current State
- **Current Phase**: Done
- **Current Step**: Delivered `out/dutch-election-system.mp4`; waiting for feedback
- **Last Updated**: 2026-10-13

## Project Info
- **Topic**: How the Netherlands is governed: hereditary head of state, elected parliament, coalition government
- **Brief**: the standing brief "educational motion graphics video, political system" in `CLAUDE.md`
- **Composition**: `DutchElection` (`src/compositions/DutchElection.tsx`), 1080×1920, 30 fps, 1331 frames (44.4 s)
- **Skills**: `.claude/skills/educational-video-creator` and `.claude/skills/remotion-best-practices`, adapted to this repo's layout

## Phase Checklist
### Phase 1: Requirements ✅
- [x] Standing brief applied. The user chose: English, British male voice, ~40 s full version + Senate line, closing question "Is it really democracy if you don't vote for your head of state?"
### Phase 1.5: Script ✅
- [x] Narration and fact sheet in `script.md` (official sources). Approved; then shortened (user's choice) to fit 45 s after the Senate line was added.
### Phase 2: Storyboard ✅
- [x] 8 scenes in `storyboard.md`
### Phase 3: Visual design ✅
- [x] Dutch flag colours + national orange, Inter, `NL`/`SAFE` in `src/scenes/dutch-election/ui.tsx`
### Phase 4: Animation ✅
- [x] Scenes in `src/scenes/dutch-election/`, reusable `src/components/Hemicycle.tsx`
- [x] All visual and sound cues come from the voice-over timing via `cue()`
### Phase 4.5: Audio ✅
- [x] Voice: Kokoro `bm_george`, speed 1.15 (`npm run voiceover -- src/voiceover/dutch-election.script.json`), 43.3 s
- [x] Music: `npm run music -- src/voiceover/dutch-election.timing.json --transpose 2`, volume 0.11 (about 16 LU under the voice)
- [x] Sound effects: shared `public/audio/sfx/` (whoosh, pop, scribble, thud, chime)
### Phase 5: QA ✅
- [x] `npm run typecheck`
- [x] 24 key frames reviewed (start/middle/end of every scene). Fixed: stray seat before the sweep, see-through stamp, lingering pencil, "0 DAYS" counter, cramped majority label, CTA spacing, dark idle seats, crown missing on frame 0
- [x] Transition frames checked in the final MP4: clean fades, no empty frames
- [x] ffprobe: h264 1080×1920, 30 fps, 1331 frames (44.37 s), AAC 48 kHz stereo. Loudness −13.9 LUFS, peak −2.4 dBFS
### Phase 6: Export ✅
- [x] `out/dutch-election-system.mp4` sent to the user (render: `npm run render:final -- DutchElection dutch-election-system --browser-executable=...`)

## Decisions
| Decision | Why |
|---|---|
| Dropped "two-thirds of a percent wins a seat" | User's choice: with the Senate line the script ran 52–55 s; this version measures 44.4 s |
| "not the people directly" (Senate) | Accurate: people elect the provincial councils, which elect the Senate |
| Neutral party colours (orange/white/blue tones), no party logos | Keeps the video party-neutral; only the closing question is meant to polarise |
| Generic figures, no portraits | No likenesses of real people; names are given as text |
| Research via web search limited to official domains | The official sites are blocked for direct fetching in this environment |

## Files Created
- `src/compositions/DutchElection.tsx`; `src/scenes/dutch-election/{ui,HookScene,KingScene,RoleScene,VotersScene,SenateScene,ResultScene,CabinetScene,QuestionScene}.tsx`
- `src/components/Hemicycle.tsx` (reusable), `src/components/Subtitles.tsx` (new `activeColor` prop)
- `src/voiceover/dutch-election.{script,timing}.json`, `public/voiceover/dutch-election.wav`, `public/audio/dutch-election/music.mp3`
- `briefs/dutch-election-system/{script,storyboard,PROGRESS}.md`
