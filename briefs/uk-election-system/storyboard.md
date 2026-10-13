# Storyboard: UK election system

Format: 1080×1920, 30 fps, 1795 frames (59.8 s). The look is the `GermanElection` style in UK colours: white paper
(faint dot grid, soft red and blue glows), the Union flag's horizontal arm as a bar on the top edge, ink `#0E1A3A`,
Union blue `#012169`, Union red `#C8102E`, royal gold `#F4B41A` as the accent, Commons green `#0E7C55`, Lords red
`#B0193A` (`PALETTE`, `UK` and `PARTY` in `src/scenes/uk-election/constants.ts`). Real party colours appear only in the
2024 result. Font: Inter.

Every cue is looked up from the voice-over timing with `cue(sentence, word)` / `at(...)`. No narration frame numbers are
hard-coded.

**Persistent layers** (`src/compositions/UKElection.tsx`)
- **Paper**: the white background with the Union flag bar on the top edge (`emblem: "uk"`).
- **StepHeader**: Union flag chip, "UK ELECTION SYSTEM" and 4 pills (Vote · Parliament · Government · King). It enters
  with step 1; finished pills get a gold tick (all ticked for the closing question).
- **CommonsLayer**: one 650-seat half-circle from the Commons to the King. It fills green, shrinks to the bottom right as
  "the UK Parliament" in the nations scene, steps left for the Lords, returns big for the 2024 result (seats turn grey,
  then Labour red past the dashed "MAJORITY · 326" line, then the other parties), and fades when the King appears.
- **Subtitles**: TikTok style (`<Subtitles timing={timing} hide={["question"]} />`), centred at y ≈ 1330.
- **Audio**: the voice-over, a soft music bed (`npm run music -- ... --transpose -2`, volume 0.11), word-synced sound
  effects (whoosh, pop, scribble, thud, chime). Mastered to −14 LUFS.

| Frames | Step | Scene | Narration | Visual |
|---|---|---|---|---|
| 0–151 | Hook | Title | One party won almost **two-thirds** of the seats with a **third** of the votes. **How?** | UK map filled with the Union flag, kicker "EXPLAINED IN ONE MINUTE", title "UK election system", all on screen at frame 0. Card "ONE PARTY · JULY 2024": the Seats bar fills to 63% on "two-thirds", the Votes bar to 34% on "third"; a red "?" pops on "How?". |
| 151–358 | 1 Vote | Who can vote? | **Who** can vote? From **18**: **British**, Irish and Commonwealth citizens in the **UK**, plus **Britons** abroad. | Header slides in. Card "WHO CAN VOTE?" (Union flag): rows pop on their words: 18+ (votes at 16 planned), British/Irish/Commonwealth citizens living in the UK (e.g. India, Canada, Nigeria), Register first + photo ID, British citizens abroad. |
| 358–538 | 1 Vote | Ballot | The UK has **650** areas. In **each**, you put one **cross** next to one **candidate**. | 650 green dots fill the UK map north to south (England 543, Scotland 57, Wales 32, NI 18: dense where people live), counter to 650 "areas, called constituencies", "Each has about the same number of voters". On "In each" the map shrinks to the corner and one dot turns gold: "YOUR AREA · 1 area = 1 seat". A UK ballot paper ("Vote for ONE candidate", Party A–D with emblems and boxes); a polling-station pencil on a string draws the X on "cross"; gold frame on "candidate". |
| 538–684 | 1 Vote | Count | Whoever gets the most **votes** **wins** the **seat**. Votes for **everyone else** win **nothing**. | Pill "FIRST PAST THE POST". Card "THE COUNT IN YOUR AREA": bars grow to A 38%, B 31%, C 19%, D 12%. Party A gets a gold highlight and "1 SEAT"; the others turn grey with red "0 SEATS" on "nothing", and "62% of the votes here win no seat at all". |
| 684–820 | 2 Parliament | Commons | The **winners** form the **House** of Commons, which **makes** laws and **checks** the government. | The 650 seats sweep in green with a counter (650 MPs). Big Ben icon + "House of Commons · 650 MPs · one per area · elected by you". Job cards pop on their words: Makes laws, Checks the government. |
| 820–1005 | 2 Parliament | Nations | **Scotland**, **Wales** and **Northern** Ireland have their own parliaments for **things** like schools. **England** **doesn't**. | UK map of the four nations: each devolved nation turns blue with a gold pin on Edinburgh, Cardiff or Belfast as it is named, and its parliament appears in the "OWN PARLIAMENTS" card (Scottish Parliament, Senedd, NI Assembly). "THEIR OWN LAWS ON: Schools, Health and more". England turns grey: "England · no parliament of its own"; an arrow from the small half-circle "UK Parliament · decides for England". |
| 1005–1164 | 2 Parliament | Lords | The House of **Lords** **also** **checks** laws, but **isn't** elected and can only **delay** them. | Commons (green, left, "650 MPs · elected") and the red Lords half-circle sweeping in (right, "about 800 · appointed"). A law flies from Commons to Lords; pill "Also checks every law". Card: cartoon lord in a scarlet robe with ermine, "Appointed for life · plus 26 bishops", ballot box crossed out "NOT ELECTED" on "isn't". Pill "Can only delay laws" on "delay"; "for up to a year: then the Commons gets its way". |
| 1164–1426 | 3 Government | Government | In **2024**, **Labour** won **411** **seats**, so its leader **became** Prime Minister: first **Keir** Starmer, **now** **Andy** Burnham. | The half-circle returns, grey; pill "General election · 4 July 2024". Labour fills red past "MAJORITY · 326" with a counter to 411; then the others fill (Conservatives, Lib Dems, Reform UK, others) and the pill becomes "Labour: 34% of votes → 63% of seats" plus a legend. Prime Minister card (generic cartoon): Keir Starmer, July 2024 – July 2026, "The King appoints the leader of the biggest party"; on "now" it changes to Andy Burnham, since July 2026, "Labour picked a new leader: no general election". |
| 1426–1622 | 4 King | King | And the **head** of state? **King** **Charles** **inherited** the **crown**. He **approves** every law, but **stays** out of politics. | Cartoon King (crown, red robe, ermine, blue Garter sash; no likeness). Ballot box crossed out "NOT ELECTED" on "inherited". Name card "HEAD OF STATE · King Charles III · Inherited the crown in 2022"; "NEXT IN LINE · Prince William". An "ACT OF PARLIAMENT" gets a "ROYAL ASSENT ✓" stamp on "approves"; pill "STAYS OUT OF POLITICS" on "stays". |
| 1622–1795 | — | Question | Is it **fair** that a **third** of the votes can win almost **two-thirds** of the seats? | All pills ticked. "34% of the votes ? 63% of the seats" bars. The question appears word by word with the voice ("fair", "third", "two-thirds" in red). "COMMENT BELOW" after the last word (chime), held to the end. |

## Safe areas (TikTok)
Key content stays inside x 120–960 and y 170–1250. Subtitles are centred at y ≈ 1330; the bottom ~450 px stay clear for
TikTok's caption and buttons.
