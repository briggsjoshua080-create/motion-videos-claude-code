# Storyboard: "The president just failed his midterm." (USMidterms, 1080×1920, 30 fps, 59.97 s)

One scene per beat, each in `src/scenes/us-midterms/`, all timed from `src/voiceover/us-midterms.timing.json` (no
hard-coded narration frames). Scene spans are measured (seconds); four scenes start on a later word of their sentence
(`START_WORD` in `constants.ts`) so the previous caption stays up 2 s.

| Scene | File | Span (s) | Background | What moves |
|---|---|---|---|---|
| hook | `HookScene.tsx` | 0.00–2.17 | blue | Hook rows complete on frame 0; report card (`ReportCard`) with the horse sticker; F (`GradeStamp`) slams on "failed" |
| loops | `LoopsScene.tsx` | 2.17–5.70 | blue | WHAT? WHO? WHY?, red block follows the voice |
| exam | `ExamScene.tsx` | 5.70–10.37 | blue | 01; HALFWAY; term bar fills to the middle, pin; Capitol (`CapitolDome`) on "America"; CONGRESS; F on "Lose" |
| passed | `PassedScene.tsx` | 10.37–13.23 | blue | ONLY 2 PASSED.; 21 mini report cards (1946–2026) get F in a wave; 1998 and 2002 flip to A on "two" |
| rehook | `RehookScene.tsx` | 13.23–16.73 | red flash | NOW HIRING sign (`HangingSign`) drops and swings; THE WHOLE HOUSE REAPPLIES. |
| house | `HouseScene.tsx` | 16.73–22.10 | blue | 02; 435 counter + 435-dot hemicycle (`HouseSeats`); "every two years."; swap to SENATE 6 YEARS + 100-dot grid, 35 lit |
| congress | `CongressScene.tsx` | 22.10–24.23 | blue | LAWS + scroll, MONEY + coin, Capitol |
| who | `WhoScene.tsx` | 24.23–28.80 | blue | 03; THE GRADERS; 18+ counter; "who registered." + clipboard; ND tile drops, red cross on the form |
| strange | `StrangeScene.tsx` | 28.80–32.23 | red flash | IT GETS STRANGE; sheriff's star spins in; SHERIFFS?! |
| ballot | `BallotScene.tsx` | 32.23–34.87 | paper | ONE OVAL PER RACE.; ballot with HOUSE / SENATE / SHERIFF; a pen fills one oval per race |
| seats | `SeatsScene.tsx` | 34.87–39.03 | blue | MOST VOTES WINS; three candidate bars, tick on the winner; swap to 218 counter, hemicycle fills to the dashed line |
| result | `ResultScene.tsx` | 39.03–42.77 | blue | 04; DEMOCRATS WON BOTH.; report card callback (HOUSE, SENATE, horse sticker); two F stamps on "won" |
| next | `NextScene.tsx` | 42.77–46.37 | blue | EVERY LAW NEEDS BOTH; red and blue cars meet nose to nose; GRIDLOCK stamp on "Hello" |
| why | `WhyScene.tsx` | 46.37–49.43 | blue | 05; ANGRY SHOW UP + angry face; HAPPY STAY HOME + couch with a sleeper and Zs |
| share | `ShareScene.tsx` | 49.43–51.60 | blue | SEND THIS + paper plane; "to someone / who skipped it." |
| horse | `HorseScene.tsx` | 51.60–56.67 | blue | 06; magnifying glass grows from the sticker's spot; 1845; SUN (crossed) and TUE (circled) cards; the horse gallops to TUE |
| question | `QuestionScene.tsx` | 56.67–59.97 | blue | Blue-and-red sweep; SO, SHOULD AMERICA SCRAP MIDTERMS? in the hook's rows; YES / NO; 1.2 s hold |

Audio: voice (`public/voiceover/us-midterms.wav`), music (`public/audio/us-midterms/music.mp3`, `--transpose 3`,
volume 0.11), shared sound effects on every scene change and visual punchline (stamps = thud, pops, scribbles for the
pen and the marks, chimes on the A cards and the last word). Subtitles at 110 px with the standard red pill; white
pill with red text on the red flashes, dark words on paper; hidden for the hook, the share line and the question.
