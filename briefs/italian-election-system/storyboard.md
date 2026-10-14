# Storyboard: Italian election system ("Who runs Italy?")

Format: 1080×1920, 30 fps, 1785 frames (59.5 s). The look is the `GermanElection` style in Italy's colours: white
paper (faint dot grid, soft green and red glows), the tricolour as a bar on the top edge, ink `#14202B`, flag green
`#009246` as the accent (deep green `#00733A` for text), flag red `#CE2B37` for "no" and majority lines, the real
ballot colours (pink for the Chamber, yellow for the Senate), and real alliance colours only in the 2022 result
(`PALETTE`, `IT` and `ALLIANCE` in `src/scenes/italian-election/constants.ts`). Font: Inter.

Every cue is looked up from the voice-over timing with `cue(sentence, word)` / `at(...)`. No narration frame numbers are
hard-coded. Each scene starts 6 frames before its first sentence.

**Persistent layers** (`src/compositions/ItalianElection.tsx`)
- **Paper**: the white background with the tricolour bar on the top edge (vertical stripes).
- **StepHeader**: tricolour chip, "WHO RUNS ITALY?" and 4 pills (Vote · Parliament · Government · President). It enters
  with step 1; finished pills get a green tick (all ticked for the closing question).
- **ChamberLayer**: one 400-seat half-circle (the Chamber of Deputies) from the seats scene to the President. It fills
  in three colours (area winners, seats shared by party votes, Italians abroad), steps left as the Chamber next to the
  Senate, returns big for the 2022 result (grey, then the alliances against the dashed "MAJORITY · 201" line), shrinks
  to the left for "both houses must back her", and fades when the President appears.
- **Subtitles**: TikTok style (`<Subtitles timing={timing} hide={["question"]} />`), centred at y ≈ 1330.
- **Audio**: the voice-over, a soft music bed (`npm run music -- ... --transpose 3`, volume 0.11), word-synced sound
  effects (whoosh, pop, scribble, thud, chime). Mastered to −14 LUFS.

| Frames | Step | Scene | Narration | Visual |
|---|---|---|---|---|
| 0–136 | Hook | Title | Italy has had **68** governments in **80** years. **Who** picks them? | Italy map filled with the tricolour, kicker "EXPLAINED IN ONE MINUTE", title "Who runs Italy?", all on screen at frame 0. Card "GOVERNMENTS SINCE 1946": 68 small cabinet tiles pop in as a counter runs to 68 on "68"; "1946 → 2026 · 80 years" on "80"; the last tile (today's) turns green; a red "?" pops on "Who". |
| 136–282 | 1 Vote | Who can vote? | **Who** can vote? **Italian** citizens from **18**, at **home** or **abroad**. | Header slides in. Card "WHO CAN VOTE?" (tricolour chip): rows pop on their words: Italian citizens (on the roll automatically, no sign-up), 18+ (for both houses: the Senate used to be 25+), at home (bring your voter card and ID), abroad (vote by post, for 8 deputies + 4 senators of their own). Footnote "Voting is a 'civic duty', but not compulsory". |
| 282–454 | 1 Vote | Ballot | You get **two** ballots, one per **house**. A **cross** on a **party** also **counts** for its **local** candidate. | Two ballots fan in on "two": pink "CHAMBER OF DEPUTIES" and yellow "SENATE", labelled on "house". The pink one comes forward and opens up: the local candidate's box on top, the backing parties' symbols (A, B) with their short name lists below, a second block (C). A pencil draws the X on party A on "cross"; on "counts" an arrow runs up from A to the local candidate, whose box turns green on "local": "1 cross → party A + its local candidate"; small print "No split votes". |
| 454–591 | 1 Vote | Seats | Each area's **winner** takes a **seat**. The **rest** are **shared** out by party **votes**. | Italy map with 147 area dots (top left, "YOUR AREA" gold dot), counter "147 areas: the most votes wins". The 400-seat half-circle builds below: 147 green seats on "winner", 245 slate seats on "shared", 8 gold seats for Italians abroad; legend "147 area winners · 245 by party votes (3% to get in) · 8 abroad". |
| 591–774 | 2 Parliament | Houses | The **Chamber** of Deputies has **400** seats, the **Senate** **200**, and **every** law must **pass** **both**. | The half-circle steps left as "Chamber of Deputies · 400"; the Senate's 200 seats sweep in on the right ("Senate · 200 + 5 for life, not elected"). Pill "EQUAL POWER". A law flies to the Chamber (green tick on "pass") and on to the Senate (tick on "both"); "Both must pass every law, and both must back the government". |
| 774–1074 | 3 Government | Result | In **2022**, a **centre-right** alliance **won** both houses with **44%** of the votes. The **President** named its leader, **Giorgia** Meloni, prime minister. | The half-circle returns big, grey; pill "General election · 25 Sept 2022". Centre-right fills blue past "MAJORITY · 201" with a counter to 237; then the others (centre-left, 5 Star Movement, Action–Italia Viva, others) and a legend. "Senate: 115 of 200" badge on "both houses". On "44%": "Centre-right: 44% of votes → 59% of seats" and "United, it won 4 in 5 areas". Prime minister card (generic cartoon): Giorgia Meloni, since Oct 2022, "named by the President · first woman in the job". |
| 1074–1308 | 3 Government | Support | **Both** houses must **back** her. If that **breaks**, the **President** can name a **new** one, with **no** new vote. That's how Italy got to **68**. | The Chamber (left) and Senate (right) small, each linked to the PM card with a green "✓ CONFIDENCE" tag. On "breaks" the links snap red and the PM card drops; on "new" a new PM card ("NEW PRIME MINISTER") slides in, named by the President; on "no" a crossed-out ballot box "NO ELECTION". On "68": the 68 tiles return with "2018–2022: one parliament, 3 governments (Conte, Conte, Draghi)". |
| 1308–1532 | 4 President | President | And the **President**? **MPs** and **regional** delegates **elect** him, for **seven** years. **Sergio** Mattarella **signs** every law. | Cartoon President (white hair, dark suit, tricolour pin; no likeness). An electors' half-circle builds: grey MPs, then 58 gold regional delegates ("663 electors: all MPs + 58 regional delegates"). "7 YEARS" badge on "seven". Name card "PRESIDENT OF THE REPUBLIC · Sergio Mattarella · re-elected in 2022". A law gets his signature and "SIGNED ✓" on "signs"; note "He can send a law back once, and can call early elections". |
| 1532–1616 | 4 President | New rules | From **2027**, new **rules** apply. | Card "NEW ELECTION LAW · FROM 2027" (stamp): "All seats shared out by votes", "Bonus seats for an alliance with 42%"; small print "Passed Oct 2026 · court challenges pending". |
| 1616–1785 | — | Question | Is it **democracy** if the prime minister can **change** without an **election**? | All pills ticked. Three PM cards swapping in a loop (one parliament, new prime ministers) with a red "?". The question appears word by word with the voice ("democracy", "change", "election" in red). "COMMENT BELOW" after the last word (chime), held to the end. |

## Safe areas (TikTok)
Key content stays inside x 120–960 and y 170–1250. Subtitles are centred at y ≈ 1330; the bottom ~450 px stay clear for
TikTok's caption and buttons.
