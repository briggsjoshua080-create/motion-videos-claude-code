# Storyboard: Austrian election system ("Who runs Austria?")

Format: 1080×1920, 30 fps, 1789 frames (59.6 s). The look is the `GermanElection` style in Austria's colours:
white paper (faint dot grid, soft red glows), the flag as red-white-red stripes on the top edge, ink `#14202B`, flag
red `#C8102E` as the accent (deep red `#9E0B23` for text), dark ink for "yes" ticks and flag red for "no" crosses,
neutral tints for the made-up parties A–E, and real party colours only in the 2024 result (`PALETTE`, `AT`, `PARTY`
and `TINT` in `src/scenes/austrian-election/constants.ts`). Font: Inter.

Every cue is looked up from the voice-over timing with `cue(sentence, word)` / `at(...)`. No narration frame numbers are
hard-coded. Each scene starts 6 frames before its first sentence.

**Persistent layers** (`src/compositions/AustrianElection.tsx`)
- **Paper**: the white background with the flag as a bar on the top edge (horizontal stripes).
- **StepHeader**: flag chip, "WHO RUNS AUSTRIA?" and 4 pills (Vote · Parliament · Government · President). It enters
  with step 1; finished pills get a tick (all ticked for the closing question).
- **CouncilLayer**: one 183-seat half-circle (the National Council) from the seats scene to the end of the talks. It
  fills with the made-up parties A–D by their votes, turns red as the National Council, steps left beside the Federal
  Council, returns big for the 2024 result (grey, then the FPÖ from the right, short of the dashed "MAJORITY · 92"
  line, then the others), shrinks to the top for the talks (the new government's 110 seats light up) and fades when
  the President appears.
- **Subtitles**: TikTok style (`<Subtitles timing={timing} hide={["question"]} />`), centred at y ≈ 1330.
- **Audio**: the voice-over, a soft music bed (`npm run music -- ... --transpose -1`, volume 0.11), word-synced sound
  effects (whoosh, pop, scribble, thud, chime). Mastered to −14 LUFS.

| Frames | Step | Scene | Narration | Visual |
|---|---|---|---|---|
| 0–141 | Hook | Title | It took Austria **155** days to get a **government**. **Why**? | Kicker "EXPLAINED IN ONE MINUTE", title "Who runs Austria?", the Austria map filled with the flag's stripes (Vienna marked), all on screen at frame 0. Card "FROM ELECTION TO GOVERNMENT": a day counter runs to 155 on "155 days" while a red bar fills from "29 Sep 2024 · election" to "3 Mar 2025 · government" (the end point pops on "government"); a red "?" pops on "Why". |
| 141–393 | 1 Vote | Who can vote? | **Who** can vote? **Austrian** citizens from **16**, at **home** or **abroad**. That leaves out **nearly** one in **five** residents over 16. | Header slides in. Card "WHO CAN VOTE?" (flag chip, "not compulsory" tag): rows pop on their words: Austrian citizens (on the roll automatically), 16+ (first in Europe, since 2007), at home (polling station or by post), abroad (sign up once, vote by post). Below: five people; on "nearly … five" the fifth turns grey with a red ✕; "1 in 5 residents aged 16+ aren't citizens: no vote" and small print "about 1.5 million people · EU citizens can vote in local and EU elections". |
| 393–521 | 1 Vote | Ballot | You **cross** one **party**, and can **also** back up to **three** of its **candidates**. | The official ballot (made-up parties A–C): each party has a circle, two write-in fields (federal list, state list) and its regional candidates with small circles. A pencil crosses party B's circle on "cross" (party B lights up: "1 cross = your party vote"); on "also back … three" it writes a name in the federal field, a list number in the state field and crosses a regional candidate, each with a "+1"; "+ up to 3 preference votes, only for that party's candidates"; on "candidates": "Enough of them move a candidate up the list". |
| 521–650 | 1 Vote | Seats | **Seats** are **shared** out by **votes**, but a party needs **4%** to get in. | Card "VOTES" with five bars (A 35%, B 28%, C 20%, D 13%, E 3%). The 183-seat half-circle builds below in the same colours, A to D by their votes, with a counter to 183. On "4%": a dashed 4% line crosses the bars, E's bar greys out with "✕ no seats", small print "or a seat won in one of 39 regions". |
| 650–808 | 2 Parliament | National Council | MPs sit in the **National** Council, which makes the **laws** and can **vote** the government **out**. | The half-circle turns red and moves up: "National Council · 183 MPs · elected every 5 years". Two tiles pop: "Makes the laws" (law icon) and "Can vote the government out" (door icon, red arrow). |
| 808–965 | 2 Parliament | Federal Council | The **Federal** Council, **sent** by the **nine** states, can mostly only **delay** laws. | The National Council steps left; the Federal Council's 60 seats sweep in on the right (slate). A row of nine state parliaments pops in below with lines up to it: "9 state parliaments send 60 members (3–12 each)". A law flies from the National Council to the Federal Council and gets a clock "DELAY" tag on "delay"; note "It can only block laws that cut the states' powers". |
| 965–1154 | 3 Government | Result | In **2024**, the **Freedom** Party came **first** with **29%**, **far** from a **majority**. | The half-circle returns big and grey; pill "National Council election · 29 Sept 2024". FPÖ blue fills 57 seats from the right with a counter; the dashed "MAJORITY · 92" line drops on "first"; on "29%": "FPÖ: 29% of votes → 57 of 183 seats". On "far from a majority": the others fill in (Greens, SPÖ, NEOS, ÖVP) with a legend, and a red "35 seats short of a majority" pill. |
| 1154–1334 | 3 Government | Talks | **Two** rounds of talks **failed**, then **three** other parties **teamed** up under **Chancellor** **Christian** Stocker. | The half-circle shrinks to the top. Timeline card: "ÖVP + SPÖ + NEOS · until Jan 2025" ✕, "FPÖ + ÖVP · until Feb 2025" ✕, "ÖVP + SPÖ + NEOS · 3 Mar 2025" ✓. On "three other parties": the coalition's 110 seats light up across the majority line (the others fade), counter "110 seats", "110 seats ✓" in the timeline. Chancellor card (generic cartoon): "FEDERAL CHANCELLOR · Christian Stocker · leads the government · ÖVP, since March 2025"; note "Day 155: the longest wait ever · first 3-party government since 1947". The Chancellor card stays on screen into the next scene. |
| 1334–1641 | 4 President | President | And the **President**? **Elected** by the people for **six** years, with a **run-off** if needed. **Alexander** Van der Bellen **appoints** the Chancellor, and can even **dismiss** the government. | Cartoon President (grey hair, dark suit, flag pin; no likeness) top left; on the right: "Elected by the people" (ballot box), "6 YEARS · max. 2 terms", "Over 50% to win, else a run-off of the top two". Name card "FEDERAL PRESIDENT · Alexander Van der Bellen · head of state · re-elected 2022". On "appoints": an arrow from the President down to the Chancellor card, "appoints ✓"; on "dismiss": a red "can dismiss the government" tag on it. |
| 1641–1789 | — | Question | Should **people** who **live** in Austria but aren't **citizens** get a **vote**? | All pills ticked. The five people with the greyed-out fifth ("1 in 5 can't vote"). The question appears word by word with the voice ("live", "citizens", "vote" in red). "COMMENT BELOW" after the last word (chime), held to the end. |

## Safe areas (TikTok)
Key content stays inside x 120–960 and y 170–1250. Subtitles are centred at y ≈ 1330; the bottom ~450 px stay clear for
TikTok's caption and buttons.
