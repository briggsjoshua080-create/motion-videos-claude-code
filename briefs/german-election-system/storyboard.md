# Storyboard: German election system

Format: 1080×1920, 30 fps, 900 frames. The palette is warm paper (#F4F1EA) with ink (#16161A) and the flag colours black, red (#DD0000) and gold (#FFCE00). The font is Inter.

Frame numbers are from `src/compositions/german-election/timeline.json`. The code never hard-codes them; it looks each one up from the narration with `cue(sentence, word)`.

**Persistent layers** (outside the scenes)
- **Paper:** the background, with a faint drifting dot grid, soft gold and red glows, and the flag bar on the top edge.
- **Header** (from frame 85): "GERMAN ELECTION SYSTEM" plus 4 step pills (Votes, Bundestag, Chancellor, President). The active pill is ink and finished pills get a gold check.
- **Subtitles:** a dark rounded box centred at y = 1395. Words light up as they are spoken and key words are gold. Long sentences are split at the `|` markers.
- **Audio:** the voice-over, a music bed ducked while the narrator speaks, and 17 soft sound effects tied to the same cues as the visuals.

| # | Frames | Narration cue | Visual |
|---|---|---|---|
| 1 | 0–93 | "How does **Germany** choose its **leaders**?" | Germany outline draws itself and fills with black, red and gold stripes. A Berlin pin pops in on "Germany". "EXPLAINED IN 30 SECONDS" sits above the title "German election system", and a gold underline sweeps in on "leaders". |
| 2 | 93–324 | "Voters cast **two** **votes**." | A ballot card ("You have 2 votes") with two columns, 1st vote (ink) and 2nd vote (red). Crosses are drawn on "two" and "votes" (scribble SFX). |
|   |   | "The **first** picks a **local candidate**." | A gold frame lands on column 1 while column 2 dims. An arrow leads to the "Local candidate · 299 districts" card with a candidate character wearing a rosette. |
|   |   | "The **second** **decides** each **party's** strength." | The gold frame slides to column 2. An arrow leads to the "Party strength · share of seats" card, where 4 bars grow. |
| 3a | 324–425 | "Parties need **5%** to **enter**." | "Share of votes" bar chart with 7 neutral bars. A dashed red 5% line draws in with a "5%" tag. On "enter", the bars below the line turn grey and get a red ✕, and the others get a ✓. |
| 3b | 409–512 | "The **Bundestag** has **630** seats." | A 630-seat hemicycle sweeps in from left to right (riser SFX) while the counter runs 0 → 630. A Reichstag icon and the "Bundestag" label appear below. |
| 4 | 512–702 | "It elects the **Chancellor**, with at least **316** votes." | The label fades out. Seats fill gold up to 316 (counter: "316 · majority of 630 seats"). A "MAJORITY" tag appears over the centre (chime). The Chancellor card pops in. |
|   |   | "Today: **Friedrich** Merz." | The name wipes in on the card: "Friedrich Merz · Head of government · since 2025". |
| 5 | 702–900 | "The **President** is chosen **by** a **Federal Convention**." | The hemicycle shrinks upwards and the President character pops into its centre. 630 red state-delegate seats complete the ring, the "Federal Convention" title appears, and a legend shows 630 Bundestag members and 630 state delegates. |
|   |   | "Today: **Frank-Walter** Steinmeier." | Name card: "FEDERAL PRESIDENT · Frank-Walter Steinmeier · Head of state · since 2017" (chime). It holds until the end. |

## Safe areas (TikTok)
Key content stays inside x 120–960 and y 170–1480. The bottom ~440 px stays clear for TikTok's caption and UI. Cards end at x 940, clear of the like/comment buttons.

## Audio levels
- **Voice:** −21 LUFS before mastering.
- **Music:** volume 0.13, ducked to about 0.075 under speech. Energy sits below 2 kHz, so it doesn't mask the voice.
- **SFX:** volumes 0.12–0.32.
- **Final master:** loudness-normalised to −14 LUFS with a −1.5 dBTP ceiling (TikTok/YouTube level) by `scripts/german-election/render.sh`.
