# Storyboard: "How Romania votes." (1080×1920, 30 fps, 60.0 s)

Look: the default Swedish look (the user's Belgian reference) in Romania's colours: deep blue background (`#002B7F`,
soft glows, film grain), flag yellow (`#FCD116`) accents, flag red (`#CE1126`) for small marks, white text. The ballot
and 2024 result scenes switch to light paper behind a yellow wipe band.

Persistent layers (`src/compositions/RomanianElection.tsx`): `Backdrop`, scenes, two `YellowSweep` wipes (opening and
the closing question), the broadcast frame `Hud` ("ROMANIA — HOW THE VOTE WORKS", timecode, section label, ruler,
80 BPM dots), `Grain`, TikTok `Subtitles` (standard red pill), hidden for the closing question.

Each scene starts 6 frames before its sentence (`sceneFrom`); every cue comes from `romanian-election.timing.json`.
Code: `src/scenes/romanian-election/`.

| # | Scene | Starts (s) | What is on screen |
|---|---|---|---|
| 01 | Title (hook) | 0 | "GENERAL ELECTIONS — EXPLAINED", the tricolour stood on end, **HOW / ROMANIA / VOTES.** (VOTES yellow, red dot); stamp **ANNULLED · 6 DEC 2024** slams in on "cancelled"; italic "The election a court cancelled — and how voting works, in 60 seconds." (box drawn round "cancelled"); strip "331 + 134 SEATS · 5% · 2 BALLOTS". On screen from frame 0. |
| 02 | Who can vote | 4.9 | **WHO CAN / VOTE?**; "Voting isn't compulsory — 52.5% voted in 2024."; card **18+** Romanian citizens, ✓ "an ID card is enough · no sign-up needed at home"; card **ABROAD** "Any polling station abroad · or by post — sign up for it first". |
| 03 | The ballot (paper) | 10.5 | **TWO BALLOTS, / ONE STAMP**; booklet covers CAMERA DEPUTAȚILOR / SENAT pop on "two ballots"; the Chamber booklet opens on "booklet" to four made-up party boxes (emblem, name, three candidates); a rubber stamp drops on "Stamp" and leaves a round violet **VOTAT** in Party B's box, which lights up; "STAMP INSIDE ONE BOX · FOLD · DROP IN THE BOX". |
| 04 | The seats | 16.0 | **THE 5% LINE**, "Under it, a party wins no seats at all."; made-up vote bars A–F, the yellow 5% line drops on "5%", E and F fade with red crosses, seat shares (38/30/21/11%) pop on "seats"; "43 VOTING AREAS · 19 SEATS SET ASIDE FOR MINORITIES". |
| 05 | Parliament | 19.4 | **TWO / CHAMBERS**, "Both elected on the same day, every four years."; two dot half-circles: 331 deputies (counts up on "331"), 134 senators (on "134"); yellow pill **BOTH PASS EVERY LAW** on "pass". |
| 06 | Prime minister | 26.4 | **THE PRIME / MINISTER**; PRESIDENT card → arrow → A CANDIDATE; joint vote card (465 members): the yes bar passes the yellow 233 line, stamp **IN OFFICE**, "233 CAN ALSO VOTE IT OUT". |
| 07 | The president | 31.9 | **THE / PRESIDENT**; ticked rows: elected directly (run-off, 5-year term), leads defence & foreign policy, can send a law back once; timeline card "THE CANCELLED ELECTION": 24 NOV 2024 1st round → 6 DEC 2024 **ANNULLED** (court: foreign interference) → 18 MAY 2025 **Nicușor Dan** wins the rerun · 53.6%. |
| 08a | The result 2024 (paper) | 40.6 | "08 — ELECTION OF 1 DEC 2024", **THE RESULT**, "Chamber of Deputies — 331 seats."; the Chamber fills in party colours, other groups fade while the Social Democrats' **22%** pops; on "seven" all colours return, **7 PARTIES IN** pill and the legend (PSD 86, AUR 63, PNL 49, USR 40, SOS 28, POT 24, UDMR 22, Minorities 19). |
| 08b | Since then | 47.1 | **2026: / A NEW PM**; ILIE BOLOJAN card (National Liberals · out on 5 May 2026) with red **OUSTED**; three crossed circles "3 PICKS FAILED · THEN THE 4TH"; LUCA NICULESCU card (independent, ex-diplomat): 280 YES vs 58 NO across the 233 line, **APPROVED**; "20 OCT 2026 · MINORITY GOVERNMENT · AS OF 24 OCT 2026". |
| 09 | Your verdict | 55.8 | Yellow sweep. **SHOULD A / COURT EVER / CANCEL AN / ELECTION?** with a yellow box round CANCEL; "…even to protect the vote?"; "TELL US IN THE COMMENTS" with YES (if it's rigged) / NO (voters decide). Holds 1.2 s. |

Sound: voice-over, soft music (`npm run music -- … --transpose 2`, 80 bpm mallet), whoosh at each scene change, pops
on cards, thuds for stamps and big numbers, a scribble for the boxes, a chime at the end.
