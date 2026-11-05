# Retention plan: "Xi won 2,952 votes to zero." (1080×1920, 30 fps, 58.7 s)

China's election system in the current standard look, in the style of `RussianElection2036` (the user asked for "same
style as the Russian one"), made to the **TikTok Retention Rules** in `CLAUDE.md`. Second marks are **measured** from the
voice-over (`src/voiceover/chinese-election.timing.json`: 57.5 s of voice and a 1.2 s hold). No word-for-word script here;
the narration lines only live in `src/voiceover/chinese-election.script.json`.

Loops: **L1** who voted? · **L2** why did nobody say no? · **L3** who really runs China? · **L4** (re-hook 1) a billion
voters, but for what? · **L5** (re-hook 2) the only vote you get, so who chooses the rest? · **L6** (hidden) the small star
floating above the pyramid on frame 0.

| # | Time (s) | Section | On screen | Technique / change type | Loops |
|---|---|---|---|---|---|
| 1 | 0.0–3.6 | Hook | Frame 0 complete: XI WON / 2,952 TO / **ZERO** (yellow block) / VOTES. over a five-tier pyramid (bottom two tiers yellow, top three hollow); a **small yellow star floats above the tip** (not mentioned); the ZERO block pulses on "zero" | Bold result-first claim, works on mute | **plants L6** |
| 2 | 3.6–7.3 | Loops | WHO? · WHY? · BOSS? all up by 4 s; the yellow block jumps to the question being asked | Text change, 3 curiosity gaps | **opens L1, L2, L3** |
| 3 | 7.3–10.2 | 01 The voters | Outlined 01; NOT THE / PUBLIC; a counter rolls to **3,000**; *lawmakers only.* | Number counter; strongest fact early | **L1 partly answered (8–10 s)** |
| 4 | 10.2–13.6 | Re-hook 1 | Yellow flash: a field of dots fills the screen, A BILLION / **VOTERS** | Full-colour flash (pattern break) | **opens L4** |
| 5 | 13.6–17.4 | 02 Who can vote | Outlined 02; WHO CAN / VOTE?; **18+** counts up; *local congress only.* | Card + counter (background, 3.8 s) | **L4 closed** |
| 6 | 17.4–20.8 | 02 Ballot | Paper wipe; a generic ballot with three names: a tick, a cross, a written-in name (grey bars, no text); YES / NO / OR WRITE | Background switch + drawing | — |
| 7 | 20.8–23.2 | 02 Seats | MORE / **NAMES**; three name cards over two seats, one card drops away on "lose" | Build + drop | — |
| 8 | 23.2–26.2 | Re-hook 2 | Yellow flash: YOUR / ONLY / **VOTE**, a ballot box with a "1" | Flash + pop | **opens L5** |
| 9 | 26.2–30.3 | 03 The ladder | Outlined 03; LEVEL BY / **LEVEL**; the hook's pyramid returns large and builds tier by tier on county, city, province, nation, a dot climbing each step | Pyramid build (the frame-0 visual explained) | **L5 closed** |
| 10 | 30.3–33.6 | 03 Congress | NATIONAL / **CONGRESS** over a ~3,000-dot hemicycle; *passes the laws.* | Hemicycle build | L1 closed (who the 3,000 are) |
| 11 | 33.6–35.5 | 03 Congress | A counter to **8** DAYS; *a year.* (the 2026 session ran 5–12 March) | Cut + counter | — |
| 12 | 35.5–38.4 | 04 President | Outlined 04; ONE NAME; a ballot with a single row and one tick | Card + tick | **L2 closed** (one candidate) |
| 13 | 38.4–41.1 | 04 Term limit | TERM / **LIMIT**; two term bars hit a wall, the wall breaks, a third bar runs on; GONE stamp | Bar build + stamp | — |
| 14 | 41.1–43.6 | 04 Premier | THE / **PREMIER**; the president's card sends an arrow to a person card; *runs the cabinet.* | Icon chain | — |
| 15 | 43.6–46.6 | 05 Result | Paper wipe; *in 2023,* the hook's **2,952** counts up, TO ZERO, a 3RD TERM stamp | Background switch, counter, stamp, callback | **L1 fully closed** |
| 16 | 46.6–48.6 | Save | SAVE / **THIS** + bookmark; *for 2027.* (no subtitles) | Icon + text | — |
| 17 | 48.6–55.0 | 06 The party | The hook's pyramid returns; the camera rises to the star above it, which lights up; THE / **PARTY**; a counter to **205**; *picks the boss.* | Zoom-in reveal + counter | **L6 closed; L3 closed** |
| 18 | 55.0–57.5 (+1.2 s hold to 58.7) | Your call | Red/yellow sweep; IS ONE / NAME A / **REAL** / CHOICE? in exactly the hook's layout; YES / NO where the pyramid was; hold | Mirrors frame 0 for a seamless loop | all closed |

**Voice gist** (not a script): Xi won 2,952 to zero → who voted, why no "no", who really runs China → not the public,
just under 3,000 lawmakers → "the weird part": a billion people vote this year → everyone from 18, but only for a local
congress → back or reject each name, or write one in → more names than seats → "now it gets strange": that's the only
vote → each congress elects the one above → the National People's Congress passes the laws → about a week a year →
it elects the president, one name → 2018: term limit scrapped → he names the premier → that's the 2023 third term →
save this for 2027 → the star: the Communist Party; its top 205 pick the real boss → is one name on a ballot a real choice?

## Check against the rules (before building, with the measured voice)
| Rule | Plan |
|---|---|
| 1 Hook | Frame 0 shows 5 words at 130–175 px, white and yellow on deep red, over the pyramid; no title card, logo or topic label; complete on mute. |
| 2 Open loops | Three gaps by 7.3 s (who / why / boss); L1 partly answered at 7–10 s, fully at 30–34 s and 44–47 s; L2 at 35–38 s; L3 at 49–55 s; L4 opened 10.4 s, closed 13.6–17 s; L5 opened 23.4 s, closed 26–30 s; L6 planted at 0 s, closed 49–55 s. |
| 3 Early payoff | Strongest fact at 0 s (2,952 to zero); first surprising insight (not the public, ~3,000 lawmakers) at 7–10 s; simple background = who can vote, 3.8 s. |
| 4 Pacing | 18 beats, a change every 2–4 s; the 6.4 s party beat changes at "Party" and "205". Pauses 0.16–0.3 s. |
| 5 Re-hooks | 10.4 s ("a billion people vote", yellow flash) and 23.4 s ("the only vote you get", yellow flash). Both a few seconds early, because the short voice puts the vote step there. |
| 6 Text | Keyword captions 130–340 px, italic lines 118–125 px, subtitles 110 px; widths checked with fontTools; no small labels; one idea per screen. |
| 7 Density | One number per beat (2,952, 3,000, 18, 8, 2,952 again, 205); no seat tables. |
| 8 Ending | All loops closed by 55 s; 1.2 s hold; the last frame mirrors frame 0 (same sizes, block and position). |
| 9 Engagement | YES/NO question + "Save this for 2027"; pinned comment in `posting.md`. |
| 10 Rewatch | The small star above the pyramid (0–3.6 s), explained only at 49–55 s. |
| 11 Output | 3 A/B hooks, caption with hashtags, pinned comment: `posting.md`. |

## Scores after building (out of 10, from stills of every beat and the timing)

**First build:** rule 6 scored 6: four captions or stamps came in on their spoken word near the end of a short beat
and stayed up under 2 s (OR WRITE 1.2 s, GONE 1.4 s, "passes the laws." 1.3 s, "runs the cabinet." 1.1 s, 205 and
"pick the boss." 1.4–1.7 s), and the zoomed pyramid in the star scene left faint orange bands behind the subtitles.
Fixed: the ballot caption is up from the start, GONE lands just after "2018", the asides come in at the start of
their beats, 205 counts from "Its", and the pyramid fades out completely as the camera zooms into the star. Measured
again: every caption and stamp stays up **2.0–3.4 s**.

| Rule | Score | Why |
|---|---|---|
| 1 Hook | 9 | Complete, huge, high-contrast on frame 0 (XI WON 2,952 TO ZERO VOTES., ZERO in a yellow block that pulses on "zero"); no title or logo. |
| 2 Open loops | 8 | Three gaps by 7.3 s, the first partly answered at 7–10 s and fully at 30–34 s and 44–47 s; all six loops closed. The loop words are short, so the voice carries the full questions. |
| 3 Early payoff | 9 | The strongest fact is frame 0; "not the public, just under 3,000 lawmakers" lands at 7–10 s; background (who can vote) 3.8 s. |
| 4 Pacing | 9 | A change every 2–4 s, many change types (counter, crowd flood, flash, paper wipe, ticks, card drop, pyramid build, hemicycle sweep, calendar, wall break, stamp, arrow, zoom, sweep); pauses ≤ 0.3 s. |
| 5 Re-hooks | 7 | Yellow flashes at 10.4 s and 23.4 s: real pattern breaks, but each about 5 s before the 15/30 s marks, because the short voice puts the vote step there. |
| 6 Text | 8 | Nothing under 110 px (widths checked with fontTools), one idea per screen, every caption 2.0–3.4 s after the fix. |
| 7 Density | 9 | One number per beat (2,952, 3,000, 18, one week, 2018, 2,952 again, 205); no seat tables. |
| 8 Ending | 9 | All loops closed by 55 s, 1.2 s hold, the last frame mirrors frame 0 (same block sizes, yellow accent in the same place, YES/NO where the pyramid was). |
| 9 Engagement | 9 | One YES/NO question, one save reason (2027), a pinned comment with its own take. |
| 10 Rewatch | 8 | The star above the pyramid is on frame 0 and explained only at 49–55 s with a zoom into it; it is small enough to pass as decoration on the first watch. |
| 11 Output | 10 | 3 A/B hooks, caption + 5 hashtags, pinned comment (`posting.md`). |

Nothing is below 7 after the fixes. Final: `out/chinese-election.mp4`, 1080×1920, 30 fps, 58.7 s, −14.0 LUFS.
