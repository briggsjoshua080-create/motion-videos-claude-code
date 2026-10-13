# Storyboard: EU election system (2 parts)

Format: 1080×1920 (9:16), 30 fps. Part 1: 1780 frames (59.3 s). Part 2: 1759 frames (58.6 s). The look is the
`GermanElection` style in the EU's colours: white paper (faint dot grid, soft yellow and blue glows), ink `#0F1B3D`,
Reflex Blue `#003399` and yellow `#FFCC00` (`EU` and `PALETTE` in `src/scenes/eu-election/constants.ts`). Font: Inter.

Every scene starts 6 frames before its first sentence, and every cue is looked up from the voice-over timing with
`cue(sentence, word)` / `at(...)` (`makeTimeline` in `src/scenes/eu-election/timeline.ts`). No narration frame numbers
are hard-coded; the frame ranges below are what the current timing files give.

**Persistent layers** (both compositions)
- **Paper** with the EU emblem option: a blue top bar with 12 small yellow stars.
- **StepHeader** "EU ELECTION SYSTEM" (EU flag chip) with Vote · Parliament · Commission · Laws. In Part 1 the last two
  pills are dashed ("later": covered in Part 2) and pulse in yellow with the Part 2 teaser. In Part 2, Vote and
  Parliament light up during the recap, then Commission and Laws.
- **Subtitles**: TikTok style (`src/components/Subtitles.tsx`, default settings): 1–3 uppercase words at y ≈ 1330, the
  spoken word on a red pill, hidden for the closing question.
- **Audio**: voice-over, soft music (volume 0.11), word-synced sound effects (whoosh, pop, scribble, thud, chime),
  mastered to −14 LUFS.

## Part 1 of 2: Vote + Parliament (`EUElectionPart1`)

| Frames | Scene (file) | Narration | Visual |
|---|---|---|---|
| 0–103 | Title (`TitleScene`, mode "countries") | How do **27** countries elect **one parliament**? | EU-27 map (Natural Earth, `src/components/europe.ts`) inside a slowly turning ring of 12 stars, "PART 1 OF 2", "EU election system", all on frame 0. On "27" the countries fill blue from west to east and a "27 countries" chip pops; "→ 1 parliament" on "parliament". |
| 103–308 | Who (`part1/WhoScene`) | **EU** citizens can vote from **18**, or **16** in some **countries**, **wherever** in the **EU** they live. | Header slides in (Vote). "WHO CAN VOTE?" card; rows pop on the words: 18+ (the "16+ in Austria, Belgium, Germany, Malta" line lights up on "16"; 17+ in Greece), compulsory voting (BE, BG, LU, GR), living in another EU country, living outside the EU. |
| 308–518 | Ballot (`part1/BallotScene`) | Every **five** years, **each** country votes for its **own** parties. Ballots **differ**, but often you just **mark** one **party**. | "Every 5 years" chip. Sample ballot (Party A–D, "your country's parties"). Two other ballots fan out on "differ" + "Every country prints its own ballot". A blue pencil draws a cross for Party B on "mark"; yellow frame on "party". |
| 518–760 | Seats (`part1/SeatsScene`) | Each **party** then wins **seats** in line with its **votes**. **Big** countries have more seats: **Germany 96**, **Malta** just **6**. | "VOTES → SEATS" (example: 10 seats): 40/30/20/10% bars → 4/3/2/1 seat dots. "SEATS PER COUNTRY": Germany's 96 dots fill on "Germany", Malta's 6 on "Malta"; "Every country gets between 6 and 96 seats". |
| 760–1426 | Parliament (`part1/ParliamentScene`) | **Together**, that's **720 MEPs**: members of the **European** Parliament. They sit in **political** groups, **not** by country. Parliament votes on EU **laws** and the EU **budget**. In **June 2024**, the centre-right **EPP** won the most seats: **188**. But a **majority** needs **361**, so groups **team** up. | Pill 2 "Parliament". The 720-seat half-circle sweeps in (counter), striped by country with DE/FR/IT/ES/PL labels; "European Parliament · 720 MEPs · elected every 5 years". On "political" the seats ripple into 9 group colours; "Seated by political group, not by country". Job cards "Votes on EU laws" / "Votes on the EU budget". On "June": centre "2024 · election result" and the group legend; on "EPP" the EPP block turns yellow (centre "188 EPP seats"), others dim; "MAJORITY · 361" tag and dashed line on "majority"; "EPP 188 + other groups → 361" on "team" (no coalition named). |
| 1426–1594 | Per person (`part1/PerPersonScene`) | Per person, though, **Malta** has about **nine** times as many MEPs as **Germany**. | "ONE MEP REPRESENTS ABOUT": Germany 870,000 people (9 person icons), Malta 96,000 (1 icon); rows light up on their names; "≈ 9× more MEPs per person in Malta than in Germany" on "nine". |
| 1594–1780 | Question (`QuestionScene`) | Is it fair that small countries get more MEPs per person than big ones? | German flag, "?" and Maltese flag. The question word by word ("fair", "small", "big" in blue). "COMMENT BELOW", then "PART 2: WHO'S REALLY IN CHARGE? →" while pills 3–4 pulse. |

## Part 2 of 2: Commission + Laws (`EUElectionPart2`)

| Frames | Scene (file) | Narration | Visual |
|---|---|---|---|
| 0–69 | Title (`TitleScene`, mode "question") | Who **really runs** the EU? | Same map, already blue, star ring, "PART 2 OF 2"; a big yellow "?" spins in on "really". |
| 69–244 | Recap (`part2/RecapScene`) | From **18**, or **16** in some countries, EU citizens **elect** the **European Parliament**. | Header slides in (Vote, then Parliament on "elect"). Small "WHO CAN VOTE?" card (18+, 16+ in AT/BE/DE/MT, 17+ in GR); arrow with "elect" down to the half-circle (`HemicycleLayer`, group colours); "European Parliament · 720 MEPs · elected by you". |
| 244–530 | Commission (`part2/CommissionScene`) | But **day** to day, the EU is run by the **European Commission**. It **proposes** new **laws**, manages the EU's **money**, and makes sure countries **follow** EU law. | Pill 3. Commission building with the EU flag, "European Commission · Brussels · runs the EU day to day". Job cards pop on "proposes", "manages", "makes": Proposes new laws / Manages the EU's money / Checks countries follow EU law. |
| 530–716 | Leaders (`part2/LeadersScene`) | Its **President** is proposed by the **leaders** of the **27** countries, who set the EU's **direction**. | "Candidate for Commission President" card (generic cartoon) on "President". "THE 27 NATIONAL LEADERS · the 'European Council'" and a 9×3 grid of generic politicians on "leaders"; arrow + "propose" to the candidate; "They set the EU's direction" (compass) on "who". |
| 716–948 | Elected (`part2/ElectedScene` + `HemicycleLayer`) | Then **Parliament votes**. In July **2024**, it re-elected **Ursula von der Leyen** with **401** votes. | Big half-circle in grey; "MAJORITY NEEDED" + dashed line on "votes"; centre "2024 · July vote"; from "re-elected" 401 seats fill yellow with the counter reaching 401 on "401". Name card "COMMISSION PRESIDENT · Ursula von der Leyen · Re-elected July 2024 · 401 votes" (name wipes in on her name). |
| 948–1117 | Team (`part2/TeamScene`) | Each country sends **one commissioner**, and Parliament **approves** the **team**, or can **vote** it **out**. | "27 COMMISSIONERS · one per country · each runs one area, e.g. trade", grid pops on "one". "Approved by Parliament · 370 votes in favour · Nov 2024" on "Parliament"; "Parliament can vote it out · the whole team · needs ⅔ of the votes" on "or". |
| 1117–1210 | No direct vote (`part2/NoDirectScene`) | So **nobody** votes for the Commission **directly**. | You → (elect) → European Parliament → (elects & approves) → European Commission. The direct red line You → Commission draws on "nobody", then a red ✗ and the stamp "NO DIRECT VOTE" (thud) on "votes". |
| 1210–1654 | Laws (`part2/LawsScene` + `HemicycleLayer`) | And **only** the **Commission** can **propose** new EU laws. Then **two sides** decide: **Parliament**, which you **elect**, and the **Council**, made of **ministers** from the **27** national governments. Only if **both** say **yes** does it become EU **law**. | Pill 4. "ONLY the Commission can propose laws"; a "PROPOSAL" paper slides out of the Commission; "Parliament, the Council or citizens can ask it for one". On "two sides": arrows to two boxes, "European Parliament" (mini half-circle, "720 MEPs · elected by you") and "Council of the EU" (27 mini ministers, "ministers from the 27 national governments"); each box lights up on its word. Blue ticks on "both" and "yes", then the stamp "EU LAW" on "law" with "(for most EU laws)". |
| 1654–1759 | Question (`QuestionScene`) | So, does your vote really count? | Ballot box, "?", law paper. The question word by word ("vote", "count" in blue), then "COMMENT BELOW". All four pills ticked. |

## Safe areas (TikTok)
Key content stays inside x 120–960 and y 170–1270; the subtitles are centred at y ≈ 1330, and the bottom ~440 px stays
clear for TikTok's caption and buttons.
