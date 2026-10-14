# Storyboard: Polish election system ("Who runs Poland?")

Format: 1080×1920, 30 fps, 1790 frames (59.7 s). The look is the `GermanElection` style in Poland's colours: white
paper (faint dot grid, soft red glows), the flag as white-red stripes on the top edge, ink `#14202B`, flag red
`#DC143C` as the accent (deep red `#A50F2D` for text), dark ink for "yes" ticks and flag red for "no" crosses, a slate
blue for the Senate, neutral tints for the made-up parties A–E, and party colours only in the 2023 result (`PALETTE`,
`PL`, `PARTY` and `TINT` in `src/scenes/polish-election/constants.ts`). Font: Inter.

Every cue is looked up from the voice-over timing with `cue(sentence, word)` / `at(...)`. No narration frame numbers are
hard-coded. Each scene starts 6 frames before its first sentence.

**Persistent layers** (`src/compositions/PolishElection.tsx`)
- **Paper**: the white background with the flag as a bar on the top edge.
- **StepHeader**: flag chip, "WHO RUNS POLAND?" and 4 pills (Vote · Parliament · Government · President). It enters
  with step 1; finished pills get a tick (all ticked for the closing question).
- **SejmLayer**: one 460-seat half-circle (the Sejm) from the seats scene to the veto scene. It fills with the made-up
  parties A–D by their votes, turns red as the Sejm, shrinks to the bottom left beside the Senate, returns big for the
  2023 result (grey, then Law and Justice from the right, short of the dashed "MAJORITY · 231" line, then the
  others), shrinks to the top for the government (the coalition's 248 seats stay lit), fades for the President and
  comes back for the veto (the line moves to three fifths: 276; the governing side, about 240, falls short) and fades
  out just before the closing question.
- **Subtitles**: TikTok style (`<Subtitles timing={timing} hide={["question"]} />`), centred at y ≈ 1330.
- **Audio**: the voice-over, a soft music bed (`npm run music -- ... --transpose 1`, volume 0.11), word-synced sound
  effects (whoosh, pop, scribble, thud, chime). Mastered to −14 LUFS.

| Frames | Step | Scene | Narration | Visual |
|---|---|---|---|---|
| 0–180 | Hook | Title | In **2023**, Poland's **ruling party** won the **most votes**, and still **lost power**. **How**? | Kicker "EXPLAINED IN ONE MINUTE", title "Who runs Poland?", the Poland map in the flag's white and red (Warsaw marked), all on screen at frame 0. Card "THE 2023 ELECTION": left "Most votes": Law and Justice (PiS), 35%, a tick on "most votes"; right "In power?": the government icon greys out with a red ✕ and "lost power" on "lost power"; a red "?" pops on "How". |
| 180–302 | 1 Vote | Who can vote? | **Who** can vote? **Polish** citizens from **18**, at **home** or **abroad**. | Header slides in. Card "WHO CAN VOTE?" (flag chip, "not compulsory" tag): rows pop on their words: Polish citizens (on the voter register automatically), 18+ (on election day), at home (polling station; by post or proxy if 60+ or disabled), abroad (sign up with a consulate first; votes counted in Warsaw). Small print: EU citizens living in Poland vote only in local and EU elections. |
| 302–446 | 1 Vote | Ballot | For the **Sejm**, parliament's **main house**, you put **one cross** next to **one candidate**. | The Sejm ballot as a booklet (tabs for lists 1–5); the open page is list 2, made-up party B, with six candidates. A pencil draws a cross next to candidate 4, Jan Kowalski, on "cross"; his row lights up on "candidate". Below: "1 cross next to 1 candidate", "= a vote for Jan Kowalski and for party B", small print "Crosses on two lists: the vote doesn't count". |
| 446–625 | 1 Vote | Seats | **Parties** above **5%** **share** the seats by **votes**, and their **most popular** candidates **get** them. | Card "VOTES" with five bars (A 36%, B 29%, C 17%, D 14%, E 4%); the 460-seat half-circle builds below in the same colours with a counter; the dashed 5% line: E greys out ("✕ no seats", "alliances need 8%"). On "and their": the card turns into "PARTY B · YOUR DISTRICT": five candidates in list order with their crosses; on "most popular" they re-sort (no. 4 Jan Kowalski jumps to the top); on "candidates" the top two get "SEAT ✓" ("Party B won 2 seats here: its 2 most-crossed candidates get them"), so the result stays up until the scene ends. |
| 625–770 | 2 Parliament | Sejm | These **460** MPs **make** the laws and **vote** the government **in**. | The half-circle turns red and moves up: "Sejm · 460 MPs · elected every 4 years". Two tiles pop: "Makes the laws" (law icon) and "Votes the government in" ("and can vote it out"). |
| 770–932 | 2 Parliament | Senate | The **Senate**, **one winner** per **district**, can **amend** laws, but the **Sejm** has the **final say**. | The Sejm steps to the bottom left; the Poland map with 100 district dots appears at the top; the Senate's 100 seats appear bottom right and each district dot flies into a seat ("100 districts · most votes wins"). A law flies from the Sejm to the Senate ("AMEND ✎") and back ("final say ✓"). |
| 932–1076 | 3 Government | Result | In **2023**, **Law** and Justice came **first**, but **without** a **majority**. | The half-circle returns big and grey; pill "Sejm election · 15 Oct 2023 · 74% turnout". PiS blue fills 194 seats from the right with a counter; the dashed "MAJORITY · 231" line drops on "first"; then "PiS: 35% of votes → 194 of 460 seats". On "without a majority": the others fill in (the Left, KO, Third Way, Confederation), the full result table, and a red "37 seats short of a majority" pill. |
| 1076–1241 | 3 Government | Government | The **next three** parties **teamed up**, **voted down** its prime minister, and **elected** **Donald** Tusk. | The half-circle shrinks to the top; the Left, KO and Third Way stay lit (counter "248 seats"), the others fade. Card "11 DEC 2023 · SEJM VOTES": "Mateusz Morawiecki (PiS) · the President's pick · 190 yes : 266 no" ✕, then "Donald Tusk (KO) · the Sejm's pick · 248 yes : 201 no" ✓. Prime Minister card (generic cartoon): "PRIME MINISTER · Donald Tusk · leads the government · since Dec 2023"; it stays on screen into the President scene. |
| 1241–1471 | 4 President | President | And the **president**? **Elected** by the people for **five** years, in **two rounds** if needed. **Karol** Nawrocki **won** in 2025. | The half-circle fades. Cartoon President (dark hair, dark suit, flag pin; no likeness) top left; on the right: "Elected by the people" (ballot box), "5 YEARS · max. 2 terms", "More than half to win, or a run-off of the top two". Card "PRESIDENTIAL ELECTION 2025": round 1 (18 May): Trzaskowski 31.4%, Nawrocki 29.5%, 11 others → no one over 50%; run-off (1 June): Nawrocki 50.9% ✓, Trzaskowski 49.1%. Name card "PRESIDENT · Karol Nawrocki · head of state · commands the armed forces". The Prime Minister's card (carried over) stays at the bottom until just before "Karol", so prime minister and president are on screen together. |
| 1471–1654 | 4 President | Veto | He can **veto** laws, and **overriding** him takes **three fifths** of the Sejm, **more** than the **government** has. | The President (small) and a law: a red "VETO" stamp on "veto". The Sejm half-circle comes back grey; on "overriding" the dashed line appears, on "three fifths" it swings from the middle to 276 ("3/5 · 276 MPs to override"); on "more than the government has" the governing side (about 240) fills from the left and stops short (red ✕). Small note: "41 vetoes in his first year (Aug 2025–Aug 2026)". |
| 1654–1790 | — | Question | Should the **party** with the **most votes** always **get** to **govern**? | All pills ticked. Callback card: "Most votes ✓ · in power ✕" with a red "?". The question appears word by word with the voice ("most", "votes", "govern" in red). "COMMENT BELOW" after the last word (chime), held to the end. |

## Safe areas (TikTok)
Key content stays inside x 120–960 and y 170–1250. Subtitles are centred at y ≈ 1330; the bottom ~450 px stay clear for
TikTok's caption and buttons.
