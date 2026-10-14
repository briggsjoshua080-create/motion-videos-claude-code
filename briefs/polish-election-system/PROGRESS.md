# Video Production Progress: Polish election system ("Who runs Poland?")

## Current State
- **Current Phase**: Done
- **Current Step**: Delivered `out/polish-election-system.mp4`; waiting for feedback
- **Last Updated**: 2026-10-14

## Project Info
- **Topic**: How Poland chooses who governs it: vote (one cross for a candidate on a party list, 5%/8%) → Parliament
  (Sejm, Senate) → Government (2023 result, Tusk) → President (direct election with a run-off, veto; Nawrocki 2025)
- **Brief**: the standing brief "educational motion graphics video, political system" in `CLAUDE.md` (the user asked
  for "a motion video about the Polish election system in the same style as the other videos")
- **Look**: the `GermanElection` style in Poland's colours, built from the reusable `src/components/explainer/`
- **Composition**: `PolishElection` (`src/compositions/PolishElection.tsx`), 1080×1920, 30 fps, 1790 frames (59.7 s)
- **Skills**: `.claude/skills/educational-video-creator` and `.claude/skills/remotion-best-practices`, adapted to this repo

## Phase Checklist
### Phase 1: Requirements ✅
- [x] Research on official sites (PKW, Sejm, Senate, President, gov.pl), facts in `script.md` (checked 14 Oct 2026)
- [x] User's choices: hook "In 2023, Poland's ruling party won the most votes, and still lost power. How?", closing
      question "Should the party with the most votes always get to govern?", a small on-screen note "41 vetoes in his
      first year"; header title "WHO RUNS POLAND?", flag red as the accent
### Phase 1.5: Script ✅
- [x] Narration measured with the real voice (58.7 s voice, 59.7 s video), approved by the user on 14 Oct 2026
### Phase 2: Storyboard ✅
- [x] 11 scenes + persistent header, half-circle, subtitles and audio in `storyboard.md`
### Phase 3: Visual design ✅
- [x] Poland outline from Natural Earth (`src/components/poland.ts`, via `scripts/country-outline.py`); 100 Senate
      district dots spread over it (`src/scenes/polish-election/districts.ts`)
- [x] Palette in `constants.ts`: flag red accent (white text on it), dark ink for "yes" ticks, slate blue for the
      Senate, neutral tints for parties A–E, party colours for the 2023 result only
### Phase 4: Animation ✅
- [x] Scenes in `src/scenes/polish-election/`; persistent `SejmLayer` (one 460-seat half-circle from the seats scene
      to the veto); the Prime Minister's card carries over from the government into the President scene; composition
      registered in `src/Root.tsx`
- [x] Every visual and sound cue comes from the voice-over timing
### Phase 4.5: Audio ✅
- [x] Voice: `npm run voiceover -- src/voiceover/polish-election.script.json` (58.7 s)
- [x] Music: `npm run music -- src/voiceover/polish-election.timing.json --transpose 1`, volume 0.11
- [x] Sound effects from `public/audio/sfx/`, tied to words
### Phase 5: QA ✅
- [x] `npm run typecheck`
- [x] About 60 key frames reviewed (scene starts, middles, ends and every scene change). Fixed: party B's seats came
      too late to be seen (now on "candidates"), the Prime Minister's card left after 0.6 s (now carried into the
      President scene), the "not compulsory" tag and the EU note came at the very end of their scene, the 50% mark ran
      through a candidate's name, the half-circle stayed into the closing question, the "crosses" header sat over the
      seat badges, the law icon touched both houses. Also fixed in the shared `Paper`: the flag bar on the top edge
      never showed for horizontal stripes (each stripe collapsed to 0 px)
### Phase 6: Export ✅
- [x] `npm run render:final -- PolishElection polish-election-system --browser-executable=...`: h264 1080×1920,
      30 fps, 1790 frames (59.7 s), AAC 48 kHz stereo; loudness −13.9 LUFS, true peak −3.0 dBFS
- [x] Frames pulled from the final MP4 checked: frame 0 not empty, clean scene changes, the question holds to the end
- [x] MP4 sent to the user, committed and pushed to `main`

## Decisions
| Decision | Why |
|---|---|
| Hook, closing question and veto note | User's choice |
| Worked examples: the 2023 Sejm election (parliament, government) and the 2025 presidential election | The most recent elections for each office |
| "Law and Justice" spoken, "PiS" only on screen | The voice would read "PiS" as a word |
| "The next three parties" for KO, Third Way and the Left | They came 2nd, 3rd and 4th; each is itself an alliance, so "three parties" is the plain-language version |
| Seat order in the 2023 half-circle: Left, KO, Third Way, Confederation, PiS (left to right) | Roughly left to right in politics; PiS fills from the right end, far from the middle line; the coalition (248) is one block from the left across the majority line |
| The veto scene shows the governing side as "about 240" (the Left, KO and the parties that ran as Third Way, in the 2023 colours) | That is its size in October 2026 (after the 2026 splits); 248 was the 2023 coalition. Either way it is short of 276 |
| The 2026 party splits stay in the fact sheet, not the video | The video explains the system with the 2023 result; Tusk and Nawrocki are still in office |
| Generic cartoon characters, names only on cards | No likeness of real people |
| `Paper` fix (flag stripes `flex: none`) | The brief asks for the flag as a thin bar on the top edge; it was missing for every horizontal-stripe flag (the Dutch and Austrian videos too, if re-rendered they get it) |
| Research via web search limited to official domains | The official sites are blocked for direct fetching in this environment |

## Files Created / Changed
- `src/compositions/PolishElection.tsx` (registered in `src/Root.tsx`)
- `src/scenes/polish-election/{constants.ts,ui.tsx,districts.ts,SejmLayer,TitleScene,WhoScene,BallotScene,SeatsScene,SejmScene,SenateScene,ResultScene,GovernmentScene,PresidentScene,VetoScene,QuestionScene}.tsx`
- `src/components/poland.ts` (Poland outline)
- `src/voiceover/polish-election.{script,timing}.json`, `public/voiceover/polish-election.wav`,
  `public/audio/polish-election/music.mp3`
- `briefs/polish-election-system/{script,storyboard,PROGRESS}.md`
- Changed: `src/components/explainer/Paper.tsx` (flag bar fix), `CLAUDE.md` (reference videos, country outlines),
  `README.md` (video table)
