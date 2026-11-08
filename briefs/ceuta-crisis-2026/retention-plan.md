# Retention plan: "A city of 83,000. 72,000 arrived." (1080×1920, 30 fps, 60.0 s)

The summer 2026 Ceuta crisis in the current standard look, themed to the topic (Strait sea blue + rescue orange), made
to the **TikTok Retention Rules** in `CLAUDE.md`. Second marks are **measured** from the voice-over
(`src/voiceover/ceuta-crisis.timing.json`: 58.8 s of voice and a 1.2 s hold). The narration lines only live in
`src/voiceover/ceuta-crisis.script.json`.

Loops: **L1** how did they get in? · **L2** why that week? · **L3** could it happen again? · **L4** (re-hook 1) they
thought the border was open — why? · **L5** (re-hook 2) a new rumour named a date — what happened? · **L6** (hidden) the
dotted orange line in the sea on frame 0's map.

| # | Time (s) | Section | On screen | Technique / change type | Loops |
|---|---|---|---|---|---|
| 1 | 0.0–4.4 | Hook | Frame 0 complete: A CITY OF / 83,000. / **72,000** (orange block) / ARRIVED. over a schematic map of Ceuta and its fence; a short **dotted orange line** floats in the sea off the fence's end (not mentioned) | Result-first, works on mute | **plants L6** |
| 2 | 4.4–6.9 | Loops | HOW? · WHY? · AGAIN? all up by 5 s; the orange block jumps to the question being asked | Text change, 3 gaps | **opens L1–L3** |
| 3 | 6.9–9.4 | 01 What | Outlined 01; SPAIN, / **IN AFRICA**; real outline map of Spain and Morocco zooms in on an orange pulsing Ceuta | Map zoom | — |
| 4 | 9.4–11.7 | 01 What | Chart-paper wipe; the border fence draws from Benzú to Tarajal and stops at the water; STOPS AT / **THE SEA** | Background switch + line build | **L1 partly answered (9–12 s)** |
| 5 | 11.7–14.7 | 01 What | Same chart: swimmer dots stream from Fnideq's beach around the fence's end into Ceuta; THEY / **SWAM** | Particle flow | **L1 answered** (first surprising insight, 12 s) |
| 6 | 14.7–17.6 | Re-hook 1 | Orange flash: a gate swings open; THE BORDER / WAS **OPEN?** | Full-colour flash | **opens L4** |
| 7 | 17.6–19.2 | 02 Why | Outlined 02; three empty circles pop in (wave, gavel, closed shop icons); 3 / **PROBLEMS** | Diagram build | **L2 starts closing** |
| 8 | 19.2–21.9 | 02 Geography | Circle 1 fills sea blue; GEOGRAPHY; *one short swim.* | Fill + text change | — |
| 9 | 21.9–25.6 | 02 Politics | Paper wipe: a court ruling (grey bars) gets a NO PUSHBACK stamp; POLITICS; *June 2026* | Background switch + stamp | — |
| 10 | 25.6–29.2 | 02 Social | The circles return, 1–2 filled, 3 fills; SOCIAL; a shop shutter closes; *no jobs.* | Fill + icon motion | — |
| 11 | 29.2–33.0 | 02 Rumour | All three overlap and the centre ignites; a social post (no logo) pops out: BORDER **OPEN**, shares count up | Spark + counter | **L4 closed, L2 closed** |
| 12 | 33.0–35.1 | 03 After | Outlined 03; a counter to **70,000**; arrows back to Morocco; *went back.* | Counter | — |
| 13 | 35.1–37.0 | 03 After | Darker, quiet layer: AT LEAST / **80** / DIED. (white, no accent block, no pop) | Mood change | — |
| 14 | 37.0–40.8 | Re-hook 2 | Orange flash: a calendar page drops: **15** AUGUST; A NEW / DATE | Flash + calendar drop | **opens L5** |
| 15 | 40.8–43.4 | 04 Again? | Outlined 04; a line of police shields closes along the beach; STOPPED stamp | Line build + stamp | **L5 closed** |
| 16 | 43.4–45.8 | 04 Again? | Likelihood meter, needle at LOW; THIS BIG? / **NOT SOON.** | Meter | **L3 partly** |
| 17 | 45.8–49.7 | 04 Again? | Needle swings to HIGH; SMALLER / **SWIMS?**; *almost surely.* | Meter swing | **L3 closed** |
| 18 | 49.7–54.6 | 04 Barrier | The hook's map returns, zooms on the dotted line, which lights up; FLOATING / **BARRIER**; *to send swimmers back.* | Callback + zoom | **L6 closed** |
| 19 | 54.6–56.9 | Save | SAVE / **THIS** + lifebuoy-orange bookmark; *for the next crisis.* (no subtitles) | Icon + text | — |
| 20 | 56.9–58.8 (+1.2 s hold to 60.0) | Your call | Sweep; SEND / SWIMMERS / **BACK** / AT ONCE? in exactly the hook's layout; YES / NO where the map was; hold | Mirrors frame 0 | all closed |

**Voice gist** (not a script): a city of 83,000, 72,000 arrived in three days → how, why that week, again? → Ceuta is
Spain in Africa → its fence stops at the sea → late July, tens of thousands swam around it → "the weird part": they
thought the border was open → three problems collided → geography: one short swim → politics: the top court ruled
swimmers can't be sent straight back → social: no jobs in Fnideq since the border trade ended → Facebook turned the
ruling into "the border is open" → almost all went back → at least 80 died → "now it gets strange": a new date, 15
August → Morocco sent thousands of police and stopped it → again? this big, not soon → smaller swims, almost surely →
the dotted line: a floating barrier to make sending swimmers back legal again → save this → should Spain send swimmers
back at once?

## Check against the rules (before building, with the measured voice)
| Rule | Plan |
|---|---|
| 1 Hook | Frame 0: 6 words at 110–175 px, white and orange on deep blue, over the map; no title, logo or topic label; works on mute. |
| 2 Open loops | Three gaps by 6.9 s; L1 partly at 9–12 s, fully 12–15 s; L2 at 17.6–33 s; L3 at 43–50 s; L4 14.9 → 29–33 s; L5 37.2 → 41–43 s; L6 0 s → 50–55 s. |
| 3 Early payoff | Strongest fact on frame 0 (72,000 into a city of 83,000); first surprising insight (the fence stops at the sea, they swam round it) at 9.5–14.7 s; simple background (Ceuta is Spain in Africa) 2.5 s. |
| 4 Pacing | 20 beats, a change every 1.6–4.9 s, types rotate (counter, map zoom, wipe, line build, particle flow, flash, diagram fill, stamp, spark, mood layer, calendar, shields, meter, callback zoom, sweep). Pauses 0.16–0.3 s. |
| 5 Re-hooks | 14.9 s ("the weird part", orange flash) and 37.2 s ("now it gets strange", orange flash). The second is 7 s after the 30 s mark, because the why-section needs four beats. |
| 6 Text | Keyword captions 110–230 px (widths checked with fontTools), italic lines 118–125 px, subtitles 110 px; no small labels; one idea per screen. |
| 7 Density | One number per beat (83,000/72,000 in the hook, 70,000, 80, 15); no charts with numbers; the circles carry no text. |
| 8 Ending | All loops closed by 54.6 s, 1.2 s hold, last frame mirrors frame 0 (same block, accent in the same place). |
| 9 Engagement | YES/NO question + "Save this for the next border crisis"; pinned comment in `posting.md`. |
| 10 Rewatch | The dotted orange line in the sea (0–4.4 s), explained only at 49.8–54.6 s. |
| 11 Output | 3 A/B hooks, caption with hashtags, pinned comment: `posting.md`. |

## Scores after building (out of 10, from stills of every beat and the timing)

**First build:** rule 6 scored 6: SWAM came in on its spoken word and stayed up only about 1.2 s, the 70,000 counter
stopped at 69,997 when the scene left, the lifebuoy covered the edge of THIS, and the barrier reveal's map sat under the
subtitles. Fixed: SWAM is up from 0.2 s into its beat, the counter lands on "all", the lifebuoy sits under the save
line, the barrier map moved up to y 660–1290, and the deaths beat has no subtitles (the words are on screen; it stays
quiet). Measured again: every caption and stamp stays up **≥ 2.0 s** except the 1.6–1.8 s beats (THREE PROBLEMS, 80
DIED), which are their whole beat.

| Rule | Score | Why |
|---|---|---|
| 1 Hook | 9 | Complete on frame 0, huge and high-contrast (A CITY OF 83,000. **72,000** ARRIVED.), result first, works on mute; no title or logo. |
| 2 Open loops | 8 | HOW? WHY? AGAIN? by 6.9 s; how is answered at 9–15 s, why at 17–33 s, again at 43–50 s; both re-hook loops and the hidden line are closed. |
| 3 Early payoff | 9 | The strongest fact is frame 0; the first surprise (the fence stops at the sea, they swam round it) lands at 9.5–14.7 s; background is 2.5 s. |
| 4 Pacing | 9 | 20 beats, a change every 1.6–4.9 s, change types rotate (map zoom, wipe, fence draw, swimmer flow, flash, gate, circle fills, stamp, spark, counter, dark layer, calendar, shields, gauge, callback zoom, sweep); pauses ≤ 0.3 s. |
| 5 Re-hooks | 7 | Orange flashes at 14.9 s ("the weird part") and 37.2 s ("now it gets strange"): real pattern breaks, but the second is 7 s after the 30 s mark because the why-section needs four beats. |
| 6 Text | 8 | Nothing under 110 px (widths checked with fontTools), one idea per screen, captions ≥ 2 s after the fixes (two 1.6–1.8 s beats). |
| 7 Density | 9 | One number per beat (83,000/72,000, 70,000, 80, 15); the three circles carry icons, not text. |
| 8 Ending | 9 | All loops closed by 54.6 s, 1.2 s hold, the last frame mirrors frame 0 (same block sizes, orange block in the same place, YES/NO where the map was). |
| 9 Engagement | 9 | One YES/NO question, one save reason, a pinned comment with its own take. |
| 10 Rewatch | 8 | The dotted orange line in the sea is on frame 0 among the swimmers and explained only at 49.8–54.6 s with a zoom onto it. |
| 11 Output | 10 | 3 A/B hooks, caption + 5 hashtags, pinned comment (`posting.md`). |

Nothing is below 7. Final: `out/ceuta-crisis.mp4`, 1080×1920, 30 fps, 60.0 s, −14.0 LUFS.
