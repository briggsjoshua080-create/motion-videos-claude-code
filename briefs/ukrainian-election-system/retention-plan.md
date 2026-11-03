# Retention plan: "Elections are banned in Ukraine." (1080×1920, 30 fps, 59.8 s)

The first video made to the **TikTok Retention Rules** in `CLAUDE.md`. Beat by beat, with the second marks
**measured** from the final voice-over (`src/voiceover/ukrainian-election.timing.json`: 58.6 s of voice and a 1.2 s
hold). No word-for-word script here (the user's rule); the narration lines only live in
`src/voiceover/ukrainian-election.script.json`.

Loops: **L1** why are elections banned? · **L2** who's in charge? · **L3** what comes next? · **L4** (re-hook 1) why
does it "sound made up"? · **L5** (hidden) the 26 grey seats.

| # | Time (s) | Section | On screen | Technique / change type | Loops |
|---|---|---|---|---|---|
| 1 | 0.0–2.3 | Hook | Frame 0 already complete: ELECTIONS / ARE / **BANNED** (yellow block) / IN UKRAINE. over a ballot box; an open padlock drops and snaps shut on "banned" (1.0 s) | Bold claim, result first, works on mute, stamp + thud | — |
| 2 | 2.3–4.9 | Loops | WHY? · WHO? · NEXT? all up by 2.6 s; the yellow block jumps to the question being asked (2.5 / 2.8 / 3.9 s) | Text change, 3 curiosity gaps | **opens L1, L2, L3** |
| 3 | 4.9–9.5 | 01 The ban | Star (president) and parliament icons pop; ELECTED; a year counter rolls back 2026 → **2019** (7.3–8.3 s) with *and still there.* | Number counter; strongest fact early | L2 partly (they're from 2019) |
| 4 | 9.5–14.1 | 01 The ban | Night-blue background; MARTIAL LAW (10.0 s); ballot box (10.3 s); NO VOTES stamp and *since the invasion.* (10.9 s); chains (12.1 s); padlock (12.8 s) | Background switch, stamp, chains | **L1 partly answered at 10–13 s** |
| 5 | 14.1–16.1 | Re-hook 1 | Yellow flash: a TV full of static with a big "?", SOUNDS MADE UP? | Full-colour flash (pattern break) | **opens L4** |
| 6 | 16.1–19.5 | 02 The vote | Outlined 02; WHO CAN VOTE?; 18+ counts up with *even from abroad.* (17.3 s); globe on "abroad" (19.1 s) | Card pop + counter (background, 3.4 s) | — |
| 7 | 19.5–21.7 | 02 The vote | THE PRESIDENT and *leads the army.*; a commander's star spins in (what the office does) | Icon pop | — |
| 8 | 21.7–25.9 | 02 The vote | Paper wipe; TICK ONE NAME; generic ballot, one tick (22.0 s); the slip slides away, a bar fills past **50%** (23.4 s), falls short and a RUN-OFF stamp lands (24.0 s) | Background switch, drawing, bar, stamp | — |
| 9 | 25.9–31.7 | 02 Result | TV with a stand-up microphone; TV COMEDIAN (27.2 s); on "won" (29.5 s): ZELENSKY and a counter to **73%** (30.5 s); *won the run-off.* | Cut + number counter | L4 half-closed (a comedian won) |
| 10 | 31.7–37.6 | Re-hook 2 → 03 Parliament | Yellow flash: IT GOT STRANGER; TV static clears into SERVANT OF THE PEOPLE (33.5 s); wipe to blue on "won" (35.7 s): THE RADA, the 450-dot hemicycle builds, yellow block past the dashed halfway line, MAJORITY stamp (36.4 s). **26 hollow grey rings at the right end, not mentioned** | Re-hook, colour flash, hemicycle build, stamp | **L4 closed** (party named after his TV show wins alone); **plants L5** |
| 11 | 37.6–40.3 | 03 Parliament | *makes the laws, / picks the PM.* under the hemicycle (37.4 s); MAJORITY fades on "picks" (38.6 s) | Text change on the same visual | — |
| 12 | 40.3–43.0 | 04 Government | Outlined 04; NEW PM and *since July 2026.*; the old PM's card slides out, KORETSKYI slides in on "July" (40.6 s) | Card swap | **L2 closed** (2019 president + Rada, new PM) |
| 13 | 43.0–47.4 | 05 Next vote | Paper wipe; outlined 05; NEW BALLOT: party rows with a square and a № box; tick (44.8 s), a hand writes "12" (45.9–47.1 s) | Background switch + handwriting | **L3 paid off; L1 fully closed** ("when martial law ends") |
| 14 | 47.4–49.8 | 05 Seats | **5%** and *to win seats.*; five made-up party bars, dashed 5% line (48.3 s), the two below it grey out and get crossed (49.5 s) | Chart drop (simple) | — |
| 15 | 49.8–51.9 | Save | SAVE THIS + a bookmark drops in; *for election day.* (no subtitles: words on screen) | Icon + text change | — |
| 16 | 51.9–56.3 | 06 Rewatch | The 2019 hemicycle returns, then zooms into the hollow rings (52.3–53.3 s), they light up while the rest dims; 26 EMPTY SEATS (52.8 s); *occupied districts, / no vote held.* (53.6 s) | Zoom-in reveal | **L5 closed** (rewatch payoff) |
| 17 | 56.3–58.6 (+1.2 s hold to 59.8) | Your call | Blue/yellow sweep; SHOULD / UKRAINE / **VOTE** / BEFORE THE / WAR ENDS? in exactly the hook's layout; YES / NO (58.3 s); hold | Mirrors frame 0, so the loop is seamless | all closed |

**Voice gist** (not a script): the ban → three questions → the 2019 leaders still in office → martial law since the
full-scale invasion bans every vote → "how they got there sounds made up" → 18+, even abroad → the president leads
the army → tick one name; over half, or a run-off → 2019: TV comedian Zelensky, 73% → "then it got stranger": his
party, named after his TV show, wins parliament outright → the Rada makes laws, picks who runs the government →
July: a new PM → after martial law: tick a party and write in a candidate's number → 5% to win seats → save this →
the 26 grey seats were occupied districts → should Ukraine vote before the war ends?

## Check against the rules (before building, re-checked with the measured voice)
| Rule | Plan |
|---|---|
| 1 Hook | Frame 0 shows 5 words, 118–175 px, white and yellow on deep blue; no title card, logo or topic label; complete on mute. |
| 2 Open loops | Three gaps by 3.9 s (why / who / next); L1 partly answered at 10–13 s (martial law), fully at 43.2 s ("when martial law ends"); L2 at 40.3–43 s; L3 at 43–47.4 s; L4 opened at 14 s, closed at 36 s; L5 planted at 35.7 s, closed at 52–56 s. |
| 3 Early payoff | Strongest fact (elections banned) at 0 s; first surprising insight (2019 leaders still in office) at 7–9 s; simple background = martial law (4.6 s) + who can vote (3.4 s) = 8.0 s, right at the limit. |
| 4 Pacing | 17 beats, a visible change every 1–3 s, never a static block over 5 s; change types rotate (stamp, text, counter, background switch, flash, icon, paper wipe, drawing, chart, hemicycle build, card swap, zoom, sweep). Pauses 0.16–0.45 s (none over 0.5 s). |
| 5 Re-hooks | 14.1 s ("sounds made up", yellow flash) and 31.7 s ("then it got stranger", yellow flash). |
| 6 Text | Keyword captions 115–340 px, italic lines 118–125 px, subtitles 110 px (5.7% of the height; "GOVERNMENT" just fits the safe area at that size); no small labels; one idea per screen. |
| 7 Density | One number per beat (2019, 18, 50%, 73%, 2026, 5%, 26); no seat counts, no party percentages. |
| 8 Ending | All loops closed by 56 s; 1.2 s hold; the last frame mirrors frame 0 (same background, sizes, accent block and position). |
| 9 Engagement | YES/NO question + "Save this for election day"; pinned comment in `posting.md`. |
| 10 Rewatch | The 26 hollow grey rings (35.7–40.3 s), explained only at 52–56 s. |
| 11 Output | 3 A/B hooks, caption with 5 hashtags, pinned comment: `posting.md`. |

## Scores after building (out of 10, from stills of every beat and the timing)

**First build (draft render, 59.4 s):** rules 1–5 and 7–11 scored 8–10. **Rule 6 scored 6**: the main captions were
big and stayed up, but several secondary lines and stamps appeared on their spoken word and so stayed up only
0.4–1.6 s ("and still there.", "even from abroad.", "leads the army.", NO VOTES, RUN-OFF, MAJORITY, KORETSKYI, "to
win seats.", "for election day.", "no vote held."). Fixed: every line now appears when its beat starts (or with the
first word it belongs to), the stamps land earlier, and three pauses grew (after "rehook" 0.24 s, "role" 0.4 s,
"ballot" 0.45 s). Measured again: every caption and stamp now stays up **2.0–3.3 s**. Also fixed in that pass: the
martial-law chains were drawn in the wrong place, the "№" sign touched its box, one subtitle page wrapped to three
lines (now at most two, `maxChars={12}`), the empty seats became hollow rings so they read as empty, the headline
no longer sits on the hemicycle in the payoff, and two subtitle lines that repeated the on-screen words were hidden.

| Rule | Score | Why |
|---|---|---|
| 1 Hook | 9 | Complete, huge and high-contrast on frame 0, 5 words, a padlock slam at 1 s; nothing to read in small type. |
| 2 Open loops | 8 | Three gaps in 4 s, the first answered partly at 10–13 s, all five closed; the three loop words are short, so the voice carries the full questions. |
| 3 Early payoff | 8 | The strongest fact is the first frame and the first insight lands at 7–9 s; background sits exactly at the 8 s limit. |
| 4 Pacing | 9 | A change every 1–3 s, 13 different change types, pauses ≤ 0.45 s. |
| 5 Re-hooks | 9 | At 14.1 s and 31.7 s, each on a full yellow flash. |
| 6 Text | 8 | Nothing under 110 px, every caption up 2–3.3 s after the fix, one idea per screen; subtitles at 110 px are just under 6% of the height. |
| 7 Density | 9 | One number per beat, no seat counts or party shares. |
| 8 Ending | 9 | Loops closed, 1.2 s hold, last frame mirrors frame 0 exactly. |
| 9 Engagement | 9 | One YES/NO question, one save reason, a pinned comment with its own take. |
| 10 Rewatch | 8 | The 26 hollow rings are visible for 4.6 s at 35.7 s and only explained at 52 s; subtle on purpose. |
| 11 Output | 10 | 3 A/B hooks, caption + 5 hashtags, pinned comment (`posting.md`). |

Nothing is below 7 after the fixes.
