# Video Production Progress: Austrian election system ("Who runs Austria?")

## Current State
- **Current Phase**: Done
- **Current Step**: Delivered `out/austrian-election-system.mp4`; waiting for feedback
- **Last Updated**: 2026-10-14

## Project Info
- **Topic**: How Austria chooses who governs it: vote (proportional, preference votes, 4%) → Parliament (National
  Council, Federal Council) → Government (2024 result, 155 days of talks, Stocker) → President (Van der Bellen)
- **Brief**: the standing brief "educational motion graphics video, political system" in `CLAUDE.md` (the user asked
  for "a motion graphics video about the Austrian election system, same concept as usual")
- **Look**: the `GermanElection` style in Austria's colours, built from the reusable `src/components/explainer/`
- **Composition**: `AustrianElection` (`src/compositions/AustrianElection.tsx`), 1080×1920, 30 fps, 1789 frames (59.6 s)
- **Skills**: `.claude/skills/educational-video-creator` and `.claude/skills/remotion-best-practices`, adapted to this repo

## Phase Checklist
### Phase 1: Requirements ✅
- [x] User's choices: hook "It took Austria 155 days to get a government. Why?", closing question "Should people who
      live in Austria but aren't citizens get a vote?", the short version of the 2024–25 talks, flag red as the
      accent, header title "WHO RUNS AUSTRIA?"
### Phase 1.5: Script ✅
- [x] Narration measured with the real voice (58.7 s voice, 59.6 s video), approved by the user on 14 Oct 2026.
      Facts and sources in `script.md`
### Phase 2: Storyboard ✅
- [x] 10 scenes + persistent header, half-circle, subtitles and audio in `storyboard.md`
### Phase 3: Visual design ✅
- [x] Austria outline from Natural Earth (`src/components/austria.ts`, via `scripts/country-outline.py`)
- [x] Palette in `constants.ts`: flag red accent (white text on it: new optional `onAccent` in `ExplainerPalette`,
      used by `StepHeader`), dark ink for "yes" ticks, slate for the Federal Council, neutral tints for parties A–E,
      party colours for the 2024 result only
### Phase 4: Animation ✅
- [x] Scenes in `src/scenes/austrian-election/`; persistent `CouncilLayer` (one 183-seat half-circle from the seats
      scene to the talks); the Chancellor's card carries over from the talks into the President scene; composition
      registered in `src/Root.tsx`
- [x] Every visual and sound cue comes from the voice-over timing
### Phase 4.5: Audio ✅
- [x] Voice: `npm run voiceover -- src/voiceover/austrian-election.script.json` (58.7 s); longer pauses after the
      ballot, Federal Council, result and talks lines so each scene's last visual has time to land
- [x] Music: `npm run music -- src/voiceover/austrian-election.timing.json --transpose -1`, volume 0.11
- [x] Sound effects from `public/audio/sfx/`, tied to words
### Phase 5: QA ✅
- [x] `npm run typecheck`
- [x] About 60 key frames reviewed (scene starts, middles, ends and transitions). Fixed: the day counter missing on
      frame 0, a timeline label past the card edge, small people icons in the "1 in 5" panel, the seat counter
      touching the half-circle's inner row (inner radius 170 → 190), the Federal Council scene sitting too high, a
      clipped "50%" tile and a tight gap in the President scene, duplicate React keys on the seat counters. Wording:
      "sign up first" (Austrians abroad renew every 10 years), "nearly 1 in 5" on screen as in the voice, "unless it
      wins one in a region" (the 4% rule's exception)
### Phase 6: Export ✅
- [x] `npm run render:final -- AustrianElection austrian-election-system --browser-executable=...`
- [x] MP4 sent to the user, committed and pushed to `main`

## Decisions
| Decision | Why |
|---|---|
| Hook "155 days", closing question on non-citizens | User's choice |
| "Two rounds of talks failed" instead of only the FPÖ–ÖVP talks | The hook asks why it took 155 days: both failed rounds are the answer (user approved the narration) |
| "That leaves out nearly one in five residents over 16" spoken | Sets up the closing question; 19% of residents aged 16+ in 2024 (ORF) |
| Flag red as the accent, dark ink for "yes" ticks, red for "no" | User's choice of flag red; ticks in ink keep yes and no apart |
| Real party colours only in the 2024 result | As in the UK and Italian videos; the ballot and seat examples use neutral "Party A–E" |
| Seat order in the 2024 half-circle: Greens, SPÖ, NEOS, ÖVP, FPÖ (left to right) | Roughly left to right in politics; the FPÖ fills from the right end, far from the middle line; the new government (SPÖ, NEOS, ÖVP) is one block across it |
| "Stocker" read as SHTOCK-er, "Van der Bellen" as fan dair BELL-en | Closer to how they are said in Austria (fixed with `pronounce`) |
| The President's decision not to ask the FPÖ leader first is in the fact sheet, not the video | User chose the short version of the talks |
| Generic cartoon characters, names only on cards | No likeness of real people |
| Research via web search limited to official domains | The official sites are blocked for direct fetching in this environment |

## Files Created / Changed
- `src/compositions/AustrianElection.tsx` (registered in `src/Root.tsx`)
- `src/scenes/austrian-election/{constants.ts,ui.tsx,CouncilLayer,TitleScene,WhoScene,BallotScene,SeatsScene,CouncilScene,FederalScene,ResultScene,TalksScene,PresidentScene,QuestionScene}.tsx`
- `src/components/austria.ts` (Austria outline)
- `src/voiceover/austrian-election.{script,timing}.json`, `public/voiceover/austrian-election.wav`,
  `public/audio/austrian-election/music.mp3`
- `briefs/austrian-election-system/{script,storyboard,PROGRESS}.md`
- Changed: `src/components/explainer/{palette.ts,StepHeader.tsx}` (optional `onAccent` text colour), `CLAUDE.md`
  (reference videos, country outlines), `README.md` (video table)
