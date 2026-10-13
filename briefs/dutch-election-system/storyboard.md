# Storyboard: Dutch election system (version 2)

Format: 1080×1920, 30 fps, 1768 frames (58.9 s). The look is the `GermanElection` style in Dutch colours: white
paper (`#FFFFFF`, faint dot grid, soft orange and blue glows), ink `#14213D`, flag red `#AE1C28`, blue `#21468B`, and
the national orange `#FF7F00` as the accent (`PALETTE` and `NL` in `src/scenes/dutch-election/constants.ts`). Font: Inter.

Every cue is looked up from the voice-over timing with `cue(sentence, word)` / `at(...)`. No narration frame numbers
are hard-coded.

**Persistent layers** (`src/compositions/DutchElection.tsx`)
- **Paper**: the white background with the red-white-blue bar on the top edge.
- **StepHeader**: "DUTCH ELECTION SYSTEM" plus 4 pills (Vote · Parliament · Government · King). It enters with
  step 1, the active pill is ink, and finished pills get an orange tick (all ticked for the closing question).
- **HouseLayer**: one 150-seat half-circle from the Parliament step to the King. It sweeps in, moves left for the
  Senate, returns for the 2025 result and the coalition (with the majority line), and fades when the King appears.
- **CaptionBox**: a dark rounded box at y = 1395. Words light up as they are spoken and key words are orange
  (`KEYWORDS`). It is hidden for the closing question.
- **Audio**: the voice-over, a soft music bed (volume 0.11, about 16 LU under the voice), and word-synced sound
  effects (whoosh, pop, scribble, thud, chime). Mastered to −14 LUFS.

| Step | Scene | Narration | Visual |
|---|---|---|---|
| — | Title | How do the **Dutch** choose who runs their country? | Netherlands outline (Natural Earth) filled red-white-blue, already on frame 0. A "The Hague" pin pops on "Dutch". Kicker "EXPLAINED IN ONE MINUTE" and the title "Dutch election system". |
| 1 | Vote | At least every **four** years, you get **one** vote. With a **red pencil**, you **fill** in the box next to one **candidate**. Each **party** gets **seats** in line with its votes. | Ballot card (dark header "BALLOT · You have 1 vote", 3 lists × 4 candidates with boxes). "At least every 4 years" chip. The red pencil fills one box on "fill". On "candidate", an orange frame, an arrow and a "Your candidate" card (cartoon woman with a rosette). Then a "Share of votes → Seats" card: 40/34/26% → 60/51/39 seats, with "each seat ≈ 0.67% of the votes". |
| 2 | House | Together, they fill the **150** seats of the **House** of Representatives. It makes **laws**, **approves** the budget, **checks** the government and can even **vote** it out. | The half-circle sweeps in from "Together" with a counter to 150. Parliament icon + "House of Representatives · Tweede Kamer · elected by you". 4 job cards pop in on their words: Makes laws, Approves the budget, Checks the government, Can vote it out. |
| 2 | Senate | Then the **75** senators **check** every **law**, but they can **only** say **yes** or **no**. **Provincial** councils **choose** them, **not** you directly. | The House moves left ("House · 150") and a red 75-seat Senate sweeps in on the right ("Senate · 75"). A law flies from House to Senate on "check every law". YES ✓ / NO ✗ pills and "but can't change it". Then 12 council-hall tiles ("12 provincial councils") with arrows up to the Senate, and a crossed-out ballot box "No direct vote" on "not". |
| 3 | Government | No party wins **76** seats alone. In **2025**, **D66** and the **PVV** **tied** with just 26 each. So **three parties** teamed **up**, with **Rob** Jetten as Prime Minister. | The half-circle returns in grey with the red "MAJORITY · 76" tag and a dashed line. "2025 election result" in the centre. 26 seats fill orange from the left (D66 tag) and 26 blue from the right (PVV tag), then "TIE". On "three parties", PVV returns to grey and the coalition fills from the left: D66 26 + VVD 22 + CDA 18 = 66 (counter), with "66 is less than 76: a minority cabinet". Prime Minister name card with a cartoon politician. |
| 4 | King | And the **head** of state? **Nobody** **votes** for him. **King** Willem-Alexander inherited the **crown**. He **signs** every law, but his **ministers** carry the **responsibility**. | Cartoon King (crown, red robe with ermine collar, orange sash) on an orange disc. A ballot box gets a red cross: "NOT ELECTED". Name card "HEAD OF STATE · King Willem-Alexander · Inherited the crown in 2013", then "NEXT IN LINE · Princess Amalia" (tiara). The ballot is replaced by an "ACT OF PARLIAMENT": the King's signature draws on "signs", the minister's on "ministers", and a "RESPONSIBLE" tag. |
| — | Question | Is it really **democracy** if you don't **vote** for your head of state? | Crown, "?" and ballot box. The question appears word by word with the voice ("democracy" and "vote" in orange). "COMMENT BELOW" after the last word (chime), held to the end. |

## Safe areas (TikTok)
Key content stays inside x 120–960 and y 170–1300. The subtitle box sits at y ≈ 1340–1450, and the bottom ~440 px
stays clear for TikTok's caption and buttons.
