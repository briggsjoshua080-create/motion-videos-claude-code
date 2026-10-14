# Video Production Progress: Italian election system ("Who runs Italy?")

## Current State
- **Current Phase**: 6 (Export)
- **Current Step**: Rendering `out/italian-election-system.mp4`
- **Last Updated**: 2026-10-14

## Project Info
- **Topic**: How Italy chooses who governs it: vote (the 2022 mixed system) → Parliament (two equal houses) →
  Government (2022 result, Meloni; new governments without an election) → President (Mattarella); new rules from 2027
- **Brief**: the standing brief "educational motion graphics video, political system" in `CLAUDE.md` (the user asked
  for "a motion graphics video of the Italian election system, same style as usual")
- **Look**: the `GermanElection` style in Italy's colours, built from the reusable `src/components/explainer/`
- **Composition**: `ItalianElection` (`src/compositions/ItalianElection.tsx`), 1080×1920, 30 fps, 1785 frames (59.5 s)
- **Skills**: `.claude/skills/educational-video-creator` and `.claude/skills/remotion-best-practices`, adapted to this repo

## Phase Checklist
### Phase 1: Requirements ✅
- [x] A new election law was passed on 8 Oct 2026 (in force 24 Oct, used from 2027). User's choice: explain the rules
      used in 2022 with 2022 as the worked example, plus one line that new rules apply from 2027
- [x] Hook "68 governments in 80 years. Who picks them?"; closing question "Is it democracy if the prime minister can
      change without an election?"; header title "WHO RUNS ITALY?"
### Phase 1.5: Script ✅
- [x] Narration measured with the real voice (58.4 s voice, 59.5 s video), approved by the user on 14 Oct 2026.
      Facts and sources in `script.md`
### Phase 2: Storyboard ✅
- [x] 10 scenes + persistent header, half-circle, subtitles and audio in `storyboard.md`
### Phase 3: Visual design ✅
- [x] Italy outline from Natural Earth (`src/components/italy.ts`, via `scripts/country-outline.py`)
- [x] Palette in `constants.ts`: flag green accent, flag red alert, the 2022 ballot colours (pink Chamber, yellow
      Senate, also used for the two houses), alliance colours for the 2022 result only, neutral tints for parties A–D
### Phase 4: Animation ✅
- [x] Scenes in `src/scenes/italian-election/`; persistent `ChamberLayer` (one 400-seat half-circle from the seats
      scene to the President); 147 area dots (`areas.ts`); the 68-government tiles (`GovernmentTiles.tsx`) in the
      hook, the payoff and the closing question; composition registered in `src/Root.tsx`
- [x] Every visual and sound cue comes from the voice-over timing
### Phase 4.5: Audio ✅
- [x] Voice: `npm run voiceover -- src/voiceover/italian-election.script.json` (58.4 s)
- [x] Music: `npm run music -- src/voiceover/italian-election.timing.json --transpose 3`, volume 0.11
- [x] Sound effects from `public/audio/sfx/`, tied to words
### Phase 5: QA ✅
- [x] `npm run typecheck`
- [x] About 45 key frames reviewed. Fixed: a "Who can vote?" line wrapping and empty card space, ballots and the two
      houses sitting too high on the screen, map dots too big, a text wrapping beside the map, the result legend
      running past the safe area (now two rows), the 2018–2022 line running out of its card, and the Chamber
      half-circle overlapping the "68 governments" card (it now fades out first)
### Phase 6: Export
- [ ] `npm run render:final -- ItalianElection italian-election-system --browser-executable=...`
- [ ] MP4 sent to the user, committed and pushed to `main`

## Decisions
| Decision | Why |
|---|---|
| The 2022 rules, not the new 2026 law | User's choice: 2022 is the worked example; one closing line says new rules apply from 2027 |
| "centre-right alliance" | The alliance's own name and the standard Italian term (centrodestra); neutral |
| Flag green as the accent, flag red for "no" | National colours; no Italian alliance uses green, so the look stays party-neutral |
| Pink for the Chamber, yellow for the Senate | The real colours of the two 2022 ballots, so ballots and houses match |
| Real alliance colours only in the 2022 result | As in the UK video; the ballot example uses neutral "Party A–D" |
| Centre-right seats on the right of the half-circle | Matches where right-wing parties sit; still crosses the middle (majority) line |
| "That's how Italy got to 68" | Most governments began between elections (own count from the list of governments: about 48 of 68; 2018–2022: three governments, one parliament) |
| 147 area dots by population share (Sicily 12, Sardinia 4) | Areas have about equal numbers of people; a stylised picture, not the real boundaries |
| The President's electors as "all MPs + 58 regional delegates" (663 with the 5 senators for life) | Constitution art. 83 |
| Generic cartoon characters, names only on cards | No likeness of real people |
| Research via web search limited to official domains | The official sites are blocked for direct fetching in this environment |

## Files Created / Changed
- `src/compositions/ItalianElection.tsx` (registered in `src/Root.tsx`)
- `src/scenes/italian-election/{constants.ts,areas.ts,ui.tsx,GovernmentTiles,ChamberLayer,TitleScene,WhoScene,BallotScene,SeatsScene,HousesScene,ResultScene,SupportScene,PresidentScene,NewLawScene,QuestionScene}.tsx`
- `src/components/italy.ts` (Italy outline)
- `src/voiceover/italian-election.{script,timing}.json`, `public/voiceover/italian-election.wav`,
  `public/audio/italian-election/music.mp3`
- `briefs/italian-election-system/{script,storyboard,PROGRESS}.md`
- Changed: `CLAUDE.md` (reference videos), `README.md` (video table)
