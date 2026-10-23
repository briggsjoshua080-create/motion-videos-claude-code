# Storyboard: "How Canada votes." (1080×1920, 30 fps, 59.9 s)

Look: `SwedishElection` (the user's Belgian reference) in the Canadian flag's colours: deep red background, white
text, accent words in white blocks with flag-red letters, light paper for the ballot and the 2025 result (flag-red
wipe band), white sweeps for the opening and the question. Persistent layers (`src/compositions/CanadianElection.tsx`):
`Backdrop`, scenes, `Sweep`s, broadcast frame `Hud` ("CANADA — HOW THE VOTE WORKS"), `Grain`, `Subtitles`
(white pill, red text; off for the closing question). Code: `src/scenes/canadian-election/`. One House of Commons
half-circle (343 dots, `COMMONS_SEATS` at `HEMI`) carries through scenes 05, 06, 09 and the twist.

| # | Scene | What is on screen |
|---|---|---|
| 01 | Title (hook) | Flag bar, **HOW / CANADA / VOTES.**, "Why nobody votes for the prime minister — in 60 seconds." (box on "nobody"), strip "343 RIDINGS · 343 SEATS · 172 TO WIN". On screen from frame 0. |
| 02 | Who can vote | **WHO CAN VOTE?**, "Voting isn't compulsory — 69% voted in 2025."; 18+ Canadian citizens card, ✓ even abroad (special ballot, by mail); REGISTER even at the polls (ID with name and address); "PERMANENT RESIDENTS CAN'T VOTE · ADVANCE POLLS TOO". |
| 03 | The ballot (paper) | **ONE RIDING, ONE MARK**, "A riding is a local area — Canada has 343."; made-up ballot (5 candidates, circles); rows light up on "local candidates"; a pencil draws an X; MARK ONE CIRCLE: X or ✓ both count, two = spoiled; "NO PM ON IT — UNLESS THEY RUN IN YOUR RIDING", "PAPER, COUNTED BY HAND". |
| 04 | The count | **FIRST PAST THE POST**; bars 38/34/28%, the winner turns white, WINS THE SEAT stamp; dashed HALF line; "62% voted for someone else." |
| 05 | Parliament | **HOUSE OF COMMONS**, pills MAKES THE LAWS / CONTROLS THE MONEY; 343 dots fill the half-circle; "AN ELECTION AT LEAST EVERY 5 YEARS". |
| 06 | The government | **PRIME MINISTER**, "Usually the leader of the biggest party."; card: leads the government, picks the ministers, must keep the House's trust; the first 172 seats light up to the majority line. |
| 07 | The Senate | **THE SENATE** with 105 seats; rows: elected by the people (struck out), picked by the PM (appointed by the GG), reviews every law (can amend or reject · serves to 75). |
| 08 | Head of state | **THE CROWN**, "Canada's King is also the UK's."; cartoon King (crown, robe) → Governor General (Louise Arbour since June 2026); ✓ Signs every law ✓ Appoints the PM. |
| 09a | The result (paper) | ELECTION OF 28 APR 2025, Carney (Liberal) 169 vs Poilievre (Conservative) 144, BLOC 22 · NDP 7 · GREEN 1, vote shares; half-circle in party colours; majority line, 3 SHORT, MINORITY stamp. |
| 09b | The 2026 twist | **THE 2026 TWIST**, "A majority — and nobody voted for it."; +5 MPs switched (4 Con · 1 NDP), +3 by-election wins (13 Apr 2026 · 3 empty seats); Liberal seats 169 → 171 → 174 past the line; MAJORITY stamp; next election set for 15 Oct 2029. |
| 10 | Your verdict | **SHOULD AN MP WHO SWITCHES PARTIES FACE THE VOTERS AGAIN?** (box on AGAIN?), "In 2025–26, 5 MPs switched — none faced a vote.", YES (a by-election first) / NO (MPs are free to switch). Holds 1.2 s. |

Sound: voice-over, soft music (`npm run music -- src/voiceover/canadian-election.timing.json --transpose 2`), whooshes,
pops, thuds, scribbles and a closing chime, all cued from the timing file.
