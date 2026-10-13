# Video Production Progress: Dutch election system

## Current State
- **Current Phase**: Done (version 2)
- **Current Step**: Delivered `out/dutch-election-system.mp4`; waiting for feedback
- **Last Updated**: 2026-10-13

## Project Info
- **Topic**: How the Dutch choose who runs the country: vote → parliament → government → King
- **Brief**: the standing brief "educational motion graphics video, political system" in `CLAUDE.md`
- **Look**: the `GermanElection` style in Dutch colours, built from the reusable `src/components/explainer/`
- **Composition**: `DutchElection` (`src/compositions/DutchElection.tsx`), 1080×1920, 30 fps, 1768 frames (58.9 s)
- **Skills**: `.claude/skills/educational-video-creator` and `.claude/skills/remotion-best-practices`, adapted to this repo

## Phase Checklist
### Phase 1: Requirements ✅
- [x] Feedback on version 1: unclear how people vote, a list of facts, the House and Senate not explained. The user
      wants the German video's look on white, a real King character, and allows 25–60 s.
- [x] The user approved: script v2, "king" (not "key") icons, and this look as the standard for all future videos.
### Phase 1.5: Script ✅
- [x] Ladder script (Vote → Parliament → Government → King), measured 57.9 s with the real voice. Facts in `script.md`.
### Phase 2: Storyboard ✅
- [x] 7 scenes + persistent header, half-circle, subtitles and audio in `storyboard.md`
### Phase 3: Visual design ✅
- [x] White palette from the Dutch flag + orange (`PALETTE`/`NL`), Netherlands outline from Natural Earth
      (`scripts/country-outline.py` → `src/components/netherlands.ts`)
### Phase 4: Animation ✅
- [x] Reusable explainer components: Paper, StepHeader, CaptionBox, NameCard, Character (king/princess/politician/candidate), icons, motion
- [x] Scenes in `src/scenes/dutch-election/`, persistent `HouseLayer`; all cues from the voice-over timing
### Phase 4.5: Audio ✅
- [x] Voice: `npm run voiceover -- src/voiceover/dutch-election.script.json`
- [x] Music: `npm run music -- src/voiceover/dutch-election.timing.json --transpose 2`, volume 0.11
- [x] Sound effects from `public/audio/sfx/`, tied to words
### Phase 5: QA ✅
- [x] `npm run typecheck`
- [x] 30 key frames reviewed. Fixed: map not filled on frame 0, stray majority-line dot, arrows over the Senate label,
      last subtitle lingering into the closing question, title half-faded on frame 0, empty stage at the start of the
      Parliament step (the seats now sweep in from "Together")
- [x] Transition frames checked in the final MP4; ffprobe: h264 1080×1920, 30 fps, 1768 frames (58.94 s), AAC 48 kHz
      stereo; loudness −13.9 LUFS, peak −2.6 dBFS
### Phase 6: Export ✅
- [x] `out/dutch-election-system.mp4` sent to the user (`npm run render:final -- DutchElection dutch-election-system --browser-executable=...`)

## Decisions
| Decision | Why |
|---|---|
| Coalition parties and Princess Amalia shown on screen, not spoken | Keeps the narration under 60 s |
| "not you directly" for the Senate | Accurate: people elect the provincial councils, which elect the Senate |
| Generic cartoon characters, no portraits | No likenesses of real people; names are given as text |
| Example vote shares (List 1–3) on the ballot | Explains proportional seats without implying a real party's result |
| Research via web search limited to official domains | The official sites are blocked for direct fetching in this environment |

## Files Created / Changed
- `src/compositions/DutchElection.tsx`; `src/scenes/dutch-election/{constants,HouseLayer,TitleScene,VoteScene,HouseScene,SenateScene,GovernmentScene,KingScene,QuestionScene}.ts(x)`
- `src/components/explainer/{palette,motion,Paper,StepHeader,CaptionBox,NameCard,Character,icons}.ts(x)`, `src/components/netherlands.ts`
- `scripts/country-outline.py`
- `src/voiceover/dutch-election.{script,timing}.json`, `public/voiceover/dutch-election.wav`, `public/audio/dutch-election/music.mp3`
