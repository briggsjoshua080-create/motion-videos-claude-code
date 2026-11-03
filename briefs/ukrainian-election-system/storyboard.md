# Storyboard: "Elections are banned in Ukraine." (1080×1920, 30 fps, ≈59.8 s)

Every scene starts 6 frames before its sentence (the hook at frame 0); all cues come from
`src/voiceover/ukrainian-election.timing.json`. Beat-level detail and the loops: `retention-plan.md`.

| # | Scene (file) | Time (s) | Background | What happens |
|---|---|---|---|---|
| 01 | Hook (`HookScene`) | 0–2.3 | blue | ELECTIONS / ARE / BANNED / IN UKRAINE. complete on frame 0; padlock snaps shut on a ballot box on "banned". |
| 02 | Loops (`LoopsScene`) | 2.3–4.9 | blue | WHY? WHO? NEXT?, the yellow block follows the question. |
| 03 | Still in office (`StillScene`) | 4.9–9.5 | blue | Outlined 01; star + parliament icons; ELECTED; counter 2026 → 2019; "and still there." |
| 04 | The ban (`BanScene`) | 9.5–14.1 | night blue | MARTIAL LAW; "since the invasion."; ballot box, NO VOTES stamp, chains, padlock. |
| 05 | Re-hook 1 (`RehookScene`) | 14.1–16.1 | yellow flash | TV static with "?"; SOUNDS MADE UP?. |
| 06 | Who can vote (`WhoScene`) | 16.1–19.5 | blue | Outlined 02; WHO CAN VOTE?; 18+ counter; globe + "even from abroad." |
| 07 | The president (`PresidentScene`) | 19.5–21.7 | blue | THE PRESIDENT; commander's star; "leads the army." |
| 08 | The ballot (`BallotScene`) | 21.7–25.9 | paper | TICK ONE NAME; generic ballot, one tick; 50% bar; RUN-OFF stamp. |
| 09 | The 2019 result (`ComedianScene`) | 25.9–31.7 | blue | TV + microphone, TV COMEDIAN; then ZELENSKY, 73% counter, "won the run-off." |
| 10 | Re-hook 2 + the Rada (`ParliamentScene`) | 31.7–40.3 | yellow flash → blue | IT GOT STRANGER; TV title SERVANT OF THE PEOPLE; outlined 03; THE RADA; 450-dot hemicycle (26 hollow grey rings), halfway line, MAJORITY stamp; "makes the laws," "picks the PM." |
| 11 | The government (`PMScene`) | 40.3–43.0 | blue | Outlined 04; NEW PM; card swap to KORETSKYI; "since July 2026." |
| 12 | The next ballot (`NextBallotScene`) | 43.0–47.4 | paper | Outlined 05; NEW BALLOT; party rows with a square and a № box; tick, then "12" written in. |
| 13 | The 5% line (`ThresholdScene`) | 47.4–49.8 | blue | 5%; "to win seats."; five bars, dashed line, two crossed out. |
| 14 | Save (`SaveScene`) | 49.8–51.9 | blue | SAVE THIS + bookmark; "for election day." |
| 15 | Rewatch payoff (`EmptySeatsScene`) | 51.9–56.3 | blue | The hemicycle again, zoom into the 26 rings, they light up; 26 EMPTY SEATS; "occupied districts," "no vote held." |
| 16 | Your call (`QuestionScene`) | 56.3–59.8 | blue (sweep) | SHOULD / UKRAINE / VOTE / BEFORE THE / WAR ENDS? in the hook's layout; YES / NO; 1.2 s hold. |

**Audio:** Kokoro `bm_george` (en-gb, speed 1.2); music `public/audio/ukrainian-election/music.mp3`
(`npm run music -- src/voiceover/ukrainian-election.timing.json --transpose -3`, volume 0.11); shared sound
effects (whoosh on scene changes, thud on the padlock and stamps, scribble on chains, ticks and the written number,
pops on reveals, a chime on the last word). Mastered to −14 LUFS by `npm run render:final`.
