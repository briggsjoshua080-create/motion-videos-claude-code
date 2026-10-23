# Storyboard: "How the US votes." (1080×1920, 30 fps, 59.9 s)

Look: `SwedishElection` (the user's Belgian reference video) in the US flag's colours: navy background (`#0A3161`, deeper
navy at the edges, soft white and red glows, film grain), red accents (`#F0475E` on navy, flag red `#B31942` for fills),
white text. The ballot and 2024 result scenes switch to light paper behind a red wipe band, so the ballot and the
parties' own colours (Republican red, Democratic blue) read clearly.

Persistent layers (`src/compositions/USElection.tsx`): `Backdrop` (navy), scenes, two `RedSweep` colour wipes (the
opening and the closing question), the broadcast frame `Hud` ("USA — HOW THE VOTE WORKS", timecode, section label,
progress ruler, "80 BPM" dots), `Grain`, TikTok `Subtitles` (standard red pill), hidden for the closing question. Fonts
are the Swedish video's (`src/scenes/swedish-election/fonts.ts`).

Each scene starts 6 frames before its sentence (`sceneFrom`); every cue comes from `us-election.timing.json`.
Code: `src/scenes/us-election/`.

| # | Scene | Starts (s) | What is on screen |
|---|---|---|---|
| 01 | Title (hook) | 0 | "GENERAL ELECTIONS — EXPLAINED", vertical stars-and-stripes bar, **HOW / THE US / VOTES.** (VOTES in red, white dot); italic "Why you don't vote for the president — in 60 seconds." with a red box drawn round "don't vote" on "don't"; strip "CONGRESS · 538 ELECTORS · 270 TO WIN". On screen from frame 0. |
| 02 | Who can vote | 3.7 | **WHO CAN / VOTE?**; italic "Voting isn't compulsory — 65% voted in 2024."; card **18+** US citizens + ✓ even abroad (by mail, via their home state); card **REGISTER** "first — in every state, except North Dakota · deadlines differ"; mono "EACH STATE SETS THE DETAILS · TERRITORIES: NO VOTE FOR PRESIDENT". |
| 03 | The ballot (paper) | 9.5 | Paper wipes in. **ONE BALLOT, / EVERY RACE**; a made-up ballot (Candidate A–K, Party A/B): President & VP, U.S. Senate, U.S. House, Governor, County Sheriff; the races light up from "every race" to "sheriff"; a pen fills Candidate B's oval; right: **FILL THE OVAL** with a filled oval ✓ "like this" and a crossed oval ✗ "no X or tick"; "EACH STATE DESIGNS ITS OWN BALLOT / VOTE EARLY, BY MAIL OR ON THE DAY". |
| 04 | Congress | 15.5 | **CONGRESS**, "America's parliament — two chambers."; pills MAKES LAWS / SETS THE BUDGET on the words; 435 dots sweep into the House half-circle, counter to 435, "HOUSE OF REPRESENTATIVES · 218 = MAJORITY", red pill EVERY 2 YEARS. On "and 100 senators" the House moves left and shrinks, the Senate's 100 seats fill on the right; cards HOUSE (435 seats by population, all elected every 2 years, starts all tax bills) and SENATE (2 per state, 6-year terms, a third up every 2 years, approves judges & treaties) light up on the words. |
| 05 | Electoral College | 27.1 | **THE ELECTORAL / COLLEGE**, "Each state: one elector per seat in Congress."; 50 states + DC pop in as tiles with their electors (11 × 8 grid); on "Whoever wins" the aside becomes "Win a state — take all its electors.", Pennsylvania grows and turns white with a red "ALL 19" pill; Maine and Nebraska get a red ring ("MAINE & NEBRASKA CAN SPLIT THEIRS"); on "538" the counter runs to 538 in the empty top-left of the map; on "270" a bar fills to the red 270 line: "270 TO WIN → WHITE HOUSE". |
| 06 | The president | 38.1 | Star seal, **THE / PRESIDENT**, "Head of state and head of government."; ticked rows on their words: Leads the government (picks the Cabinet), Commands the army (commander in chief), Can veto laws (Congress can override with ⅔); "ELECTED FOR 4 YEARS · 2 TERMS MAX". |
| 07a | The result 2024 (paper) | 42.3 | Paper wipes in. "07 — ELECTION OF 5 NOV 2024", **THE RESULT**, "538 electors — 270 to win."; the tile map fills west to east in party colours (Maine and Nebraska split); score DONALD TRUMP · REPUBLICAN **312** vs KAMALA HARRIS · DEMOCRAT **226** across the 270 line, popular vote 49.8% / 48.3%. On "Republicans" the map gives way to Congress as elected in 2024: HOUSE 220–215 (218 = majority), SENATE 53–47 (Dem incl. 2 independents); the aside becomes "Trump took office on 20 January 2025." |
| 07b | Midterms 2026 | 52.0 | Paper wipes out. "07 — NEXT: THE MIDTERMS", **3 NOV / 2026**, "Midterms: halfway through the president's term."; cards **435** House seats (all of them, as every 2 years) and **35** Senate seats (a third, plus 2 vacated seats); "AS OF 23 OCT 2026 · RESULTS NOT IN YET". |
| 08 | Your verdict | 55.7 | Red sweep. **SHOULD THE / MOST VOTES / ALWAYS WIN?** with a red box drawn round ALWAYS WIN?; italic "In 2000 and 2016, the winner had fewer votes nationwide."; "TELL US IN THE COMMENTS" with YES (most votes wins) / NO (keep the electors). Holds 1.2 s after the last word. |

Sound: voice-over, soft music (`npm run music -- src/voiceover/us-election.timing.json --transpose 2`, 80 bpm mallet),
light effects: whoosh at each scene change, pops on cards, scribbles for the hook box, the oval and the closing box,
thuds for big numbers, a chime at the end.
