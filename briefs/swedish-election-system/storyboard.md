# Storyboard: "How Sweden votes." (1080×1920, 30 fps, 59.8 s)

Look: the user's Belgian reference video (`belgian-elections-explained.mp4`, made outside this repo) in Sweden's flag
colours: Swedish-blue background (`#006AA7`, deeper blue at the edges, soft white/blue glows, film grain), flag yellow
(`#FECC02`) for accents, white text. The ballot and 2022 result scenes switch to light paper (as the reference's ballot
scene does) behind a yellow wipe band, so the yellow ballot and the parties' own colours read clearly.

Persistent layers (`src/compositions/SwedishElection.tsx`): `Backdrop` (blue), scenes, two `YellowSweep` colour wipes
(the opening and the closing question), the broadcast frame `Hud` (corner marks, "SWEDEN — HOW THE VOTE WORKS",
running timecode, section label, progress ruler with a tick per section, "80 BPM" dots blinking with the music's
mallet beat), `Grain`, TikTok `Subtitles` with a yellow pill (dark text) for the spoken word, hidden for the closing
question. Fonts: Archivo Black, Instrument Serif italic, JetBrains Mono (`src/scenes/swedish-election/fonts.ts`), Inter.

Each scene starts 6 frames before its sentence (`sceneFrom`); every cue comes from `swedish-election.timing.json`.
Code: `src/scenes/swedish-election/`.

| # | Scene | Starts (s) | What is on screen |
|---|---|---|---|
| 01 | Title (hook) | 0 | "GENERAL ELECTIONS — EXPLAINED", tall Nordic-cross flag bar, **HOW / SWEDEN / VOTES.** (VOTES in yellow, white dot); italic "The prime minister who needs zero yes votes — in 60 seconds." with a yellow box drawn round "zero yes votes" on "single"; mono strip "RIKSDAG · 349 SEATS · 4% · 3 BALLOTS". On screen from frame 0. |
| 02 | Who can vote | 4.33 | **WHO CAN / VOTE?**; italic "Voting isn't compulsory — yet 84% voted in 2022."; glass card **18+** "Swedish citizens, 18 or over on election day" + ✓ "even abroad, re-register every 10 years"; card **LOCAL** "Foreign residents: region & municipality votes — not parliament" (underlined on "not"). |
| 03 | The ballot (paper) | 11.20 | Paper wipes in. **ONE PAPER / PER PARTY**; legend of paper colours: PARLIAMENT (yellow, lit on "parliament"), REGION (blue), MUNICIPALITY (white) · SAME DAY; rack of yellow papers PARTY A/B/C; on "Pick" Party B's paper comes forward (others leave) and the steps light up: 1 Pick your party's paper, 2 Mark one candidate (OPTIONAL tag on "if you like"), 3 Seal it in an envelope ("staff drop it in the box"); a blue pencil crosses Candidate B3's box; the paper shrinks into an envelope and the flap closes. |
| 04 | The Riksdag + seats | 19.13 | **THE RIKSDAG**, "Sweden's parliament — just one chamber."; 349 white dots sweep into a half-circle, counter 0→349 on "349", "SEATS · 175 = MAJORITY"; pills MAKES LAWS / SETS THE BUDGET on the words. On "A party…" the chamber shrinks: card **4%** "of the national vote, or a party wins no seats at all"; card **+39** "top-up seats: 310 in 29 areas, then these even it out" while 39 seats turn yellow. |
| 05 | The prime minister | 31.37 | **THE PRIME / MINISTER**; card THE SPEAKER (gavel, "chairs parliament") → yellow arrow → A CANDIDATE (for prime minister); struck-out crown "NOT THE KING"; vote card: the "no" bar fills to **174**, one short of the yellow 175 line ("175 NO = OUT"), stamp **APPROVED**, "ZERO YES VOTES NEEDED". |
| 06 | The King | 38.70 | Glowing crown, **THE KING**, stamp **NO POLITICAL POWER** on "no"; italic "Head of state — a symbol, not a ruler."; rows: ✓ Opens parliament every year (and chairs each change of government); ✕ Picks the prime minister (the Speaker proposes one), struck on "power"; ✕ Signs laws (the government does), struck on "laws". |
| 07a | The result 2022 (paper) | 43.73 | Paper wipes in. "07 — ELECTION OF 11 SEPT 2022", **THE RESULT**, "349 seats — 175 make a majority."; the 2022 Riksdag fills in party colours (V 24, S 107, MP 18, C 24, L 16, KD 19, M 68, SD 73); on "four parties on the right" the other four fade and **176** "SEATS ON THE RIGHT" pops; two-column legend; on "Ulf Kristersson" the legend gives way to his card: PRIME MINISTER · 17 OCT 2022, Moderates · approved 176 to 173, government M + KD + L backed by SD. |
| 07b | 2026 | 50.97 | Paper wipes out. "07 — ELECTION OF 13 SEPT 2026", **2026: / VOTED DOWN**; card MAGDALENA ANDERSSON, Social Democrats · the Speaker's first pick; vote card 15 OCT 2026: 99 YES (yellow) vs 248 NO (white) across the 175 line, stamp **REJECTED** on "voted"; "TALKS GO ON — AS OF 23 OCT 2026". |
| 08 | Your verdict | 55.00 | Yellow sweep. **SHOULD A PM / NEED A / YES VOTE?** with a yellow box drawn round YES VOTE?; italic "…or is avoiding 175 "no" votes enough?"; "TELL US IN THE COMMENTS" with YES (need a yes) / NO (keep it as it is) buttons. Holds 1.2 s after the last word. |

Sound: voice-over, soft music (`npm run music -- … --transpose 2`, 80 bpm mallet), light effects: whoosh at each scene
change, pops on cards, scribbles for the hook box and the ballot cross, thuds for stamps and big numbers, a chime at the end.
