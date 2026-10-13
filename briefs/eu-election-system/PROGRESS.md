# Video Production Progress: EU election system (2 parts)

## Current State
- **Current Phase**: Done
- **Current Step**: Both parts delivered (`out/eu-election-part-1.mp4`, `out/eu-election-part-2.mp4`); waiting for feedback
- **Last Updated**: 2026-10-13

## Project Info
- **Topic**: How the EU works: who votes for whom (European Parliament elections), who runs the EU (the Commission,
  the 27 national leaders) and who makes laws (Commission proposes; Parliament and Council decide)
- **Brief**: the standing brief "educational motion graphics video, political system" in `CLAUDE.md`, with the user's
  `GermanElection` video as the example
- **Compositions**: `EUElectionPart1` (1780 frames, 59.3 s) and `EUElectionPart2` (1759 frames, 58.6 s), 1080×1920, 30 fps
- **Skills**: `.claude/skills/educational-video-creator` and `.claude/skills/remotion-best-practices`, adapted to this repo

## Phase Checklist
### Phase 1: Requirements ✅
- [x] Standing brief applied (vertical, white German look in EU blue and yellow, bm_george, subtitles, music, closing question)
- [x] User's choices: **two videos** (the EU has too many parts for 60 s), steps Vote · Parliament · Commission · Laws,
  one sample ballot (every country has its own), Part 1 ends on "Is it fair that small countries get more MEPs per
  person than big ones?", Part 2 must make clear that only the Commission proposes laws and nobody elects it directly,
  then "So, does your vote really count?", teaser + recap between the parts, title "EU election system" + part number,
  both scripts approved before building
### Phase 1.5: Script ✅
- [x] Narration, visual plan and fact sheet in `script.md` (official EU sources), measured with the real voice. Approved 13 Oct 2026.
### Phase 2: Storyboard ✅
- [x] `storyboard.md`: 7 scenes (Part 1) and 9 scenes (Part 2), frame ranges from the timing files
### Phase 3: Visual design ✅
- [x] EU colours (Reflex Blue `#003399`, yellow `#FFCC00`), neutral blue tints for the political groups, Inter
- [x] Explainer parts extended: `emblem: "eu"` palette option (EU flag chip, starred top bar, parliament flag),
  `later` steps and `teaseAt` in `StepHeader` (for multi-part series), multi-country maps in `scripts/country-outline.py`
### Phase 4: Animation ✅
- [x] Shared: `src/scenes/eu-election/{constants,timeline,ui,TitleScene,QuestionScene}`
- [x] Part 1 scenes in `src/scenes/eu-election/part1/`, Part 2 scenes in `src/scenes/eu-election/part2/` (one
  half-circle, `HemicycleLayer`, carries from the recap to the vote and into the law step)
- [x] Every visual and sound cue comes from the voice-over timing via `cue()` / `at()`
### Phase 4.5: Audio ✅
- [x] Voice: Kokoro `bm_george`, speed 1.15. Part 1 58.3 s, Part 2 57.6 s of voice
- [x] Music: `npm run music` per part (D major), volume 0.11; shared sound effects
### Phase 5: QA ✅
- [x] `npm run typecheck`
- [x] Key frames reviewed for every scene of both parts. Fixed: star ring overlapping the map, "17+ in Greece" wrapping,
  percentages colliding with seat arrows, people icons wrapping into the numbers, overlapping diagram labels in the
  "no direct vote" scene, tick badges covering box titles, "(for most EU laws)" over the boxes, and two cards that were
  on screen too briefly (longer pauses after "who" in Part 1 and "team" in Part 2; no words changed)
- [x] Transition frames checked in the final MP4s: clean fades, frame 0 not empty
- [x] Part 1: h264 1080×1920, 30 fps, 1780 frames (59.35 s), AAC 48 kHz stereo, −13.9 LUFS
- [x] Part 2: h264 1080×1920, 30 fps, 1759 frames (58.65 s), AAC 48 kHz stereo, −14.0 LUFS (re-rendered once so the
  half-circle fades out with its scene instead of lingering under the next title)
### Phase 6: Export ✅
- [x] `npm run render:final -- EUElectionPart1 eu-election-part-1 --browser-executable=...` → sent to the user
- [x] `npm run render:final -- EUElectionPart2 eu-election-part-2 --browser-executable=...` → sent to the user

## Decisions
| Decision | Why |
|---|---|
| Two parts of under 60 s each | User's choice: one 60 s video could not explain voting, Parliament, Commission and law-making |
| One sample ballot + "Every country prints its own ballot" | There is no single EU ballot; each country has its own rules |
| Compulsory voting and voting from outside the EU only on the card | Saying them too would have pushed Part 1 over 60 s |
| No coalition named in "groups team up" | Several majorities are possible; keeps the video neutral |
| "MAJORITY NEEDED" without a number for the July 2024 vote | Parliament had 719 members that day (360 needed), not 720 (361) |
| Small print "(for most EU laws)" and "Parliament, the Council or citizens can ask it for one" | Accuracy (special procedures; requests for proposals) while keeping the user's point that only the Commission proposes |
| Neutral blue tints for political groups, no party colours or logos | Party-neutral |
| Generic cartoon politicians, names only on cards | No likenesses of real people |

## Files Created
- `src/compositions/EUElectionPart1.tsx`, `src/compositions/EUElectionPart2.tsx` (registered in `src/Root.tsx`)
- `src/scenes/eu-election/{constants.ts,timeline.ts,ui.tsx,TitleScene.tsx,QuestionScene.tsx}`
- `src/scenes/eu-election/part1/{timeline.ts,WhoScene,BallotScene,SeatsScene,ParliamentScene,PerPersonScene}.tsx`
- `src/scenes/eu-election/part2/{timeline.ts,people,HemicycleLayer,RecapScene,CommissionScene,LeadersScene,ElectedScene,TeamScene,NoDirectScene,LawsScene}.tsx`
- `src/components/europe.ts` (EU-27 map from Natural Earth via `scripts/country-outline.py`)
- `src/voiceover/eu-election-part-{1,2}.{script,timing}.json`, `public/voiceover/eu-election-part-{1,2}.wav`,
  `public/audio/eu-election-part-{1,2}/music.mp3`
- `briefs/eu-election-system/{script,storyboard,PROGRESS}.md`
- Changed: `src/components/explainer/{palette.ts,icons.tsx,Paper.tsx,StepHeader.tsx}`, `scripts/country-outline.py`
