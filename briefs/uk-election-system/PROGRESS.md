# Video Production Progress: UK election system

## Current State
- **Current Phase**: Done
- **Current Step**: Delivered `out/uk-election-system.mp4`; waiting for feedback
- **Last Updated**: 2026-10-13

## Project Info
- **Topic**: How the UK chooses who governs it: vote (first past the post) → Parliament (Commons, the nations' own
  parliaments, Lords) → Government (2024 result, Prime Minister) → King
- **Brief**: the standing brief "educational motion graphics video, political system" in `CLAUDE.md` (the user asked
  for "the English election system and the governing bodies" and confirmed the brief applies)
- **Look**: the `GermanElection` style in UK colours, built from the reusable `src/components/explainer/`
- **Composition**: `UKElection` (`src/compositions/UKElection.tsx`), 1080×1920, 30 fps, 1795 frames (59.8 s)
- **Skills**: `.claude/skills/educational-video-creator` and `.claude/skills/remotion-best-practices`, adapted to this repo

## Phase Checklist
### Phase 1: Requirements ✅
- [x] User's choices: the UK system (England has no parliament of its own), same standard as the Dutch/EU videos,
      House of Lords and the King included, Scotland/Wales/Northern Ireland in one short sentence, one video ≤ 60 s,
      closing question "Is it fair that a third of the votes can win almost two-thirds of the seats?", hook with the
      surprising numbers, title "UK election system", real party colours for the 2024 result
### Phase 1.5: Script ✅
- [x] Narration measured with the real voice (59.8 s video), approved by the user on 13 Oct 2026. Facts in `script.md`.
### Phase 2: Storyboard ✅
- [x] 10 scenes + persistent header, half-circle, subtitles and audio in `storyboard.md`
### Phase 3: Visual design ✅
- [x] UK palette (Union blue and red, royal gold accent, Commons green, Lords red, party colours for the result)
- [x] UK map with the four nations (`src/components/uk.ts`, from Natural Earth via `scripts/country-outline.py`, which
      gained `--cut`/`--assign`/`--rest` to split a country into regions)
- [x] Union flag in the explainer parts (`emblem: "uk"`: header chip, top bar, parliament icon; `UnionFlag` in icons)
### Phase 4: Animation ✅
- [x] Scenes in `src/scenes/uk-election/`; persistent `CommonsLayer`; 650 area dots by nation (`areas.ts`)
- [x] Every visual and sound cue comes from the voice-over timing
### Phase 4.5: Audio ✅
- [x] Voice: `npm run voiceover -- src/voiceover/uk-election.script.json` (58.8 s)
- [x] Music: `npm run music -- src/voiceover/uk-election.timing.json --transpose -2`, volume 0.11
- [x] Sound effects from `public/audio/sfx/`, tied to words
### Phase 5: QA ✅
- [x] `npm run typecheck`
- [x] 30 key frames reviewed, then the fixed scenes again. Fixed: map frame stretched by Rockall (now dropped with
      `--min-lon -9`), title kicker wrapping, "?" covering the card title, nations-scene labels crowding the map (moved
      to a column of cards), election label overlapping the seats (now a pill below), law icon left on the Lords,
      Royal Assent stamp running off its paper, Lords note wrapping, Union flag fill cropped too tightly
### Phase 6: Export ✅
- [x] `npm run render:final -- UKElection uk-election-system --browser-executable=...`: h264 1080×1920, 30 fps,
      1795 frames (59.8 s), AAC 48 kHz stereo; loudness −14.0 LUFS, true peak −1.5 dBFS
- [x] Transition frames checked in the final MP4: clean fades, frame 0 not empty, the question holds to the end
- [x] MP4 sent to the user, committed and pushed to `main`

## Decisions
| Decision | Why |
|---|---|
| The UK system, not "England" | England has no parliament of its own; its laws come from the UK Parliament (user's choice) |
| "Scotland, Wales and Northern Ireland" | The user wrote "Scotland and Ireland"; the Republic of Ireland is a separate country and Wales also has its own parliament |
| Hook without "In 2024", ending on "How?" | Keeps the video under 60 s; the year is on screen |
| "No general election" for Burnham shown, not spoken | Saying it would push the video over 60 s |
| Royal gold as the accent, not flag red or blue | Labour is red and the Conservatives are blue; gold (the crown) keeps the look party-neutral and readable under the ticks |
| Real party colours only in the 2024 result | User's choice; the example count uses neutral "Party A–D" |
| Area dots by nation's real seat count | Constituencies have about the same number of voters, so England is dense and Scotland sparse, as in reality |
| Example count: the winner is not "your" candidate | Shows that a vote for a losing candidate wins nothing, as the narration says |
| Generic cartoon characters, names only on cards | No likenesses of real people |
| Research via web search limited to official domains | The official sites are blocked for direct fetching in this environment |

## Files Created / Changed
- `src/compositions/UKElection.tsx` (registered in `src/Root.tsx`)
- `src/scenes/uk-election/{constants.ts,areas.ts,ui.tsx,CommonsLayer,TitleScene,WhoScene,BallotScene,CountScene,CommonsScene,DevolvedScene,LordsScene,GovernmentScene,KingScene,QuestionScene}.tsx`
- `src/components/uk.ts` (UK outline + four nations)
- `src/voiceover/uk-election.{script,timing}.json`, `public/voiceover/uk-election.wav`, `public/audio/uk-election/music.mp3`
- `briefs/uk-election-system/{script,storyboard,PROGRESS}.md`
- Changed: `src/components/explainer/{palette.ts,icons.tsx,Paper.tsx}` (Union flag, pencil lead colour),
  `scripts/country-outline.py` (regions)
