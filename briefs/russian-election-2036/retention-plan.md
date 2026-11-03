# Retention plan: "Putin can legally rule until 2036." (1080×1920, 30 fps, 59.7 s)

The Russian election system redone in the current standard look (`UkrainianElection`) and to the **TikTok Retention
Rules** in `CLAUDE.md`. Beat by beat, with the second marks **measured** from the voice-over
(`src/voiceover/russian-election-2036.timing.json`: 58.5 s of voice and a 1.2 s hold). No word-for-word script here;
the narration lines only live in `src/voiceover/russian-election-2036.script.json`.

Loops: **L1** how is that legal? · **L2** who else has power? · **L3** did the last vote matter? · **L4** (re-hook 1)
why "vote twice"? · **L5** (re-hook 2) a house nobody elects? · **L6** (hidden) the hollow gap in the hook's timeline.

| # | Time (s) | Section | On screen | Technique / change type | Loops |
|---|---|---|---|---|---|
| 1 | 0.0–2.9 | Hook | Frame 0 complete: PUTIN CAN / RULE TO / **2036** (red block) / LEGALLY. over a timeline bar 2000 → 2036; the bar's 2008–12 stretch is a **hollow outline** (not mentioned); the end of the bar pulses on "2036" | Bold claim, works on mute, pulse + thud | **plants L6** |
| 2 | 2.9–5.9 | Loops | HOW? · WHO? · THE VOTE? all up by 3.3 s; the red block jumps to the question being asked | Text change, 3 curiosity gaps | **opens L1, L2, L3** |
| 3 | 5.9–9.5 | 01 The reset | Outlined 01; HIS TERMS; a counter rolls **4 → 0** on "zero"; RESET stamp; *in 2020.* | Number counter + stamp; strongest fact early | **L1 partly answered (9 s)** |
| 4 | 9.5–12.5 | 02 The vote | Outlined 02; WHO CAN VOTE?; **18+** counts up; *even from abroad.* + globe | Card pop + counter (background, 3 s) | — |
| 5 | 12.5–15.0 | Re-hook 1 | Red flash: two ballot slips fan out, YOU VOTE / **TWICE?** | Full-colour flash (pattern break) | **opens L4** |
| 6 | 15.0–18.7 | 02 Ballots | Paper wipe; TWO / BALLOTS; two generic slips: a tick on a party row ("party"), a tick on a name row ("candidate") | Background switch + drawing | **L4 closed** |
| 7 | 18.7–22.8 | 02 Seats | A 450-dot hemicycle builds in two halves: left half red on "parties" with **5%+**, right half white on "district" with LOCAL WINNERS | Hemicycle build + text change | — |
| 8 | 22.8–25.2 | 03 Parliament | Outlined 03; STATE **DUMA** over the full hemicycle; *makes the laws.* | Headline swap on the same visual | L2 (1 of 3) |
| 9 | 25.2–28.2 | Re-hook 2 | Red flash: NOT / **ELECTED** over a ballot box that gets crossed out | Flash + stamp | **opens L5** |
| 10 | 28.2–32.8 | 03 Upper house | UPPER / HOUSE; a row of region tiles each sends two dots up into a chamber; a star adds **+30**; *approves every law.* | Build + counter | **L5 closed**, L2 (2 of 3) |
| 11 | 32.8–35.8 | 04 Government | Outlined 04; THE **PM**; the president's star sends an arrow to a person card; YES stamp from the Duma on "yes" | Icon chain + stamp | **L2 closed** (everyone tied to the president) |
| 12 | 35.8–39.3 | 05 President | Outlined 05; a counter to **6** YEARS; a bar fills past a dashed 50% line, *or a run-off.* | Counter + bar | — |
| 13 | 39.3–42.4 | 05 Result | PUTIN and a counter to **87%**; *in 2024.* | Cut + number counter | L3 (1 of 2) |
| 14 | 42.4–48.2 | 05 Result | Paper wipe; the hemicycle fills with his party's red block, **349** counts up, a dashed two-thirds line; then a party card gets a BARRED stamp on "barred" | Background switch, counter, stamp | **L3 closed** |
| 15 | 48.2–50.1 | Save | SAVE / **THIS** + bookmark; *for election day.* (no subtitles) | Icon + text | — |
| 16 | 50.1–56.0 | 06 Rewatch | The hook's timeline returns and zooms into the hollow 2008–12 stretch, which lights up; THE GAP?; **PM** fills the gap on "PM"; *two terms in a row.* | Zoom-in reveal | **L6 closed; L1 fully closed** (the old rule and how he worked round it) |
| 17 | 56.0–58.5 (+1.2 s hold to 59.7) | Your call | Blue/red sweep; CAN A / VOTE BE / **FAIR** / IF YOU / KNOW WHO WINS? in exactly the hook's layout; YES / NO where the timeline was; hold | Mirrors frame 0 for a seamless loop | all closed |

**Voice gist** (not a script): Putin can legally rule until 2036 → how, who else has power, did the vote matter →
2020 reset his terms to zero → 18+, even abroad → "you vote twice" → two ballots, party + local candidate → half the
seats by party above 5%, half district winners → the State Duma makes the laws → "now it gets strange": the upper
house isn't elected → regions send two, the president adds 30, it approves every law → the president picks the PM,
the Duma says yes → six years, over half or a run-off → 2024: 87% → 2026: his party 349 seats, a liberal rival
barred → save this → the gap: two terms in a row was the limit, so in 2008 he became PM → can a vote be fair if you
know who wins?

## Check against the rules (before building, with the measured voice)
| Rule | Plan |
|---|---|
| 1 Hook | Frame 0 shows 5 words at 118–175 px, white and red on deep blue, over a timeline; no title card, logo or topic label; complete on mute. |
| 2 Open loops | Three gaps by 5.9 s (how / who / the vote); L1 partly answered at 6–9.5 s (the reset), fully at 50–56 s (the old two-in-a-row rule); L2 closed at 23–36 s; L3 at 39–48 s; L4 opened 12.7 s, closed 15–18.6 s; L5 opened 25.4 s, closed 28–33 s; L6 planted at 0 s, closed 50–56 s. |
| 3 Early payoff | Strongest fact at 0 s (rule until 2036); first surprising insight (terms reset to zero) at 6–9.5 s; simple background = who can vote, 2.9 s. |
| 4 Pacing | 17 beats, a change every 1.5–3 s, nothing static over 5 s (the 5.8 s result beat changes at 45 s); change types rotate. Pauses 0.16–0.3 s. |
| 5 Re-hooks | 12.7 s ("you vote twice", red flash) and 25.4 s ("now it gets strange", red flash). The second is a bit before 30 s, because the upper house is the strange part and belongs right after the Duma. |
| 6 Text | Keyword captions 115–340 px, italic lines 118–125 px, subtitles 110 px; widths checked with fontTools; no small labels; one idea per screen. |
| 7 Density | One number per beat (2036, 4→0, 18, 5%, 30, 6, 87%, 349); no party shares or full seat tables. |
| 8 Ending | All loops closed by 56 s; 1.2 s hold; the last frame mirrors frame 0 (same background, sizes, accent block and position). |
| 9 Engagement | YES/NO question + "Save this for election day"; pinned comment in `posting.md`. |
| 10 Rewatch | The hollow 2008–12 stretch in the hook's timeline (0–2.9 s), explained only at 50–56 s. |
| 11 Output | 3 A/B hooks, caption with hashtags, pinned comment: `posting.md`. |

## Scores after building (out of 10, from stills of every beat and the timing)

**First build (draft render):** rules 1–5 and 7–11 scored 8–10. **Rule 6 scored 6**: three stamps landed on their
spoken word near the end of a beat and stayed up under 2 s (YES 1.4 s, RUN-OFF 1.7 s, BARRED 1.6 s), and the 2026
hemicycle was built so late that it was fully visible for only 0.6 s before the party card covered it. Fixed: YES now
lands with "picks" (2.1 s), RUN-OFF on "years" (2.3 s), BARRED on "seats" (2.2 s), and the hemicycle builds in the
scene's first 0.7 s (fully up 3.4 s). Measured again: every caption and stamp stays up **2.0–4.4 s**.

| Rule | Score | Why |
|---|---|---|
| 1 Hook | 9 | Complete, huge, high-contrast on frame 0 (5 words, 2036 in a red block), the timeline end pulses on "2036"; no title or logo. |
| 2 Open loops | 8 | Three gaps by 5.9 s, the first partly answered at 6–9.5 s and fully at 50–56 s; all six loops closed. The loop words are short, so the voice carries the full questions. |
| 3 Early payoff | 9 | The strongest claim is frame 0, the term reset (the surprise) lands at 6–9.5 s; background (who can vote) only 2.9 s. |
| 4 Pacing | 9 | A change every 1.5–3 s, 12+ change types (counter, stamp, flash, paper wipe, hemicycle build, dot flight, arrow, bar, zoom, sweep); pauses ≤ 0.3 s. |
| 5 Re-hooks | 8 | Red flashes at 12.7 s and 25.4 s; the second is ~5 s before the 30 s mark, because the upper house has to follow the Duma. |
| 6 Text | 8 | Nothing under 110 px (widths checked with fontTools), one idea per screen, every caption 2.0–4.4 s after the fix. |
| 7 Density | 9 | One number per beat (2036, 4→0, 18, 5%, +30, 6, 87%, 349); "of 450" is the only second number, as context. |
| 8 Ending | 9 | All loops closed by 56 s, 1.2 s hold, the last frame mirrors frame 0 (same block, same red accent position, buttons where the timeline was). |
| 9 Engagement | 9 | One YES/NO question, one save reason, a pinned comment with its own take. |
| 10 Rewatch | 9 | The hollow 2008–12 stretch is on frame 0 and explained only at 50–56 s, with a zoom back into it. |
| 11 Output | 10 | 3 A/B hooks, caption + 5 hashtags, pinned comment (`posting.md`). |

Nothing is below 7 after the fixes. Final: `out/russian-election-2036.mp4`, 1080×1920, 30 fps, 59.7 s, −13.9 LUFS.
