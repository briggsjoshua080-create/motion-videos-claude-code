# Storyboard: "How Norway votes." (1080×1920 @ 30 fps, ≈59.7 s)

Scenes start 6 frames before their sentence (`LEAD`); all cues come from `src/voiceover/norwegian-election.timing.json`.
Code: `src/compositions/NorwegianElection.tsx`, `src/scenes/norwegian-election/`.

| # | Scene (file) | Time (s) | Background | What happens |
|---|---|---|---|---|
| 01 | `TitleScene` | 0.0–5.4 | red | Navy/white sweep; flag-slice bar, HOW / NORWAY / VOTES. (VOTES in a navy block); aside "Where some votes weigh more"; vote-weight card: Finnmark bar grows to ×1.9 on "twice", Oslo stops at ×1 on "Oslo". |
| 02 | `WhoScene` | 5.4–10.2 | red | WHO CAN VOTE?; 80% turnout aside; 18+ card (Norwegian citizens, turn 18 by 31 Dec of the election year, ticked "no sign-up needed"); ABROAD card; footnote "foreign residents: local elections only". |
| 03 | `BallotScene` | 10.2–15.4 | paper | ONE PAPER PER PARTY; pill "names are fixed · no changes since 2025"; rack of three party papers, one comes forward, folds in half, gets a round STAMPED mark, drops through the ballot box slot; four numbered steps light up. |
| 04 | `SeatsScene` | 15.4–23.7 | red | PEOPLE + LAND; "each km² counts like 1.8 people"; Finnmark card (4 seat dots, 14,000 per seat) and Oslo card (20 dots, 26,000 per seat); ×1.9 WEIGHT stamp. |
| 04 | `TopupScene` | 23.7–28.2 | red | TOP-UP SEATS; made-up vote bars, 4% line drops, "+ TOP-UP" chips on the smaller parties over it, "NO TOP-UP" under it; pill "seats ≈ votes nationwide". |
| 05 | `StortingScene` | 28.2–33.7 | red | THE STORTING; one dot half-circle builds, counts to 169 (19 top-up seats in navy); pills MAKES THE LAWS / SETS TAXES & BUDGET; "elected for a fixed four years". |
| 06 | `PmScene` | 33.7–38.8 | red | NO VOTE NEEDED; ELECTED → (NO VOTE) → IN OFFICE; no-confidence bar fills to 84, one short of the 85 line; STAYS stamp. |
| 07 | `KingScene` | 38.8–44.0 | red | Crown, THE KING, "born to it, never elected"; ticked rows: appoints the government, signs every law; HAAKON VIII stamp, "king since 28 Aug 2026 · after Harald V, 1991–2026". |
| 08 | `ResultScene` | 44.0–51.9 | paper | THE RESULT (8 Sep 2025); 169-seat half-circle in party colours; Labour lit with 53 (28.0%), then Progress 47 (23.8%); all back with the legend; pills PM: JONAS GAHR STØRE, LABOUR ALONE. |
| 09 | `QuestionScene` | 51.9–59.7 | red | Navy/white sweep; "The Storting can never be dissolved"; NO EARLY ELECTIONS.; STABILITY, OR DEMOCRACY ON PAUSE? (box drawn round ON PAUSE?); STABLE / PAUSED answer buttons; subtitles off. |

Audio: voice-over, soft music (`public/audio/norwegian-election/music.mp3`, `--transpose -2`), shared sound effects on
scene changes and key words; mastered to −14 LUFS by `npm run render:final`.
