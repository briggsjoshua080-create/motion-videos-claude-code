# Script: EU election system (2 parts, each under 60 s, 9:16)

Made to the standing brief "educational motion graphics video, political system" (see `CLAUDE.md`), in the
`GermanElection` look (white background, step header, ballot card, one hemicycle, cartoon characters), in the EU's
colours (Reflex Blue and yellow).

The EU has more parts than one country, so the user chose **two videos** that share one step header
(**Vote · Parliament · Commission · Laws**):

- **Part 1 of 2**: Vote + Parliament (who can vote, how you vote, how votes become seats, the 720 MEPs, the 2024
  result). Ends on "Is it fair that small countries get more MEPs per person than big ones?" plus a teaser for Part 2.
- **Part 2 of 2**: Commission + Laws (a one-line recap, who runs the EU day to day, how the Commission is chosen,
  that nobody votes for it directly, that only the Commission proposes laws, and that Parliament and the Council of
  ministers decide). Ends on "So, does your vote really count?"

**Core message:** you elect the European Parliament; the Commission, which nobody elects directly, runs the EU and
alone proposes laws; Parliament and national ministers decide on them.

**Learning goals**
1. EU citizens vote from 18 (16 in Austria, Belgium, Germany and Malta, 17 in Greece), wherever in the EU they live.
2. Each country votes for its own parties, on its own ballot; seats follow the votes, and each country has a fixed
   number of seats (Germany 96 ... Malta 6), so small countries get more MEPs per person.
3. The 720 MEPs sit in political groups, not by country; in 2024 the EPP won most seats (188), short of a 361 majority.
4. The Commission runs the EU day to day and is the only body that proposes laws. The 27 national leaders propose its
   President, Parliament elects them and approves the team. Nobody votes for the Commission directly.
5. A law needs a yes from both Parliament (which you elect) and the Council (ministers of the 27 governments).

**Narrative strategy:** Part 1 opens on a puzzle ("27 countries, one parliament?") and climbs from your ballot to the
whole Parliament, then flips the "big countries get more seats" fact into a fairness question. Part 2 opens on "Who
really runs the EU?", recaps Part 1 in one line, and follows a law from proposal to "yes + yes", so the closing
question ("does your vote really count?") lands on facts the viewer has just seen. The videos stay neutral (they show
both the indirect link from your vote to the Commission and the direct one to Parliament); only the closing questions
are meant to spark debate.

## Narration (as spoken: Kokoro `bm_george`, en-gb, speed 1.15)

Measured with the real voice on 13 Oct 2026 (times are when each sentence is spoken). Approved by the user on
13 Oct 2026. Source of truth: `src/voiceover/eu-election-part-1.script.json` and `eu-election-part-2.script.json`.

### Part 1 of 2: Vote + Parliament (voice 58.3 s, video 59.3 s)

| Step | id | Time (s) | Narration |
|---|---|---|---|
| Title | hook | 0.3–3.3 | How do 27 countries elect one parliament? |
| 1 Vote | who | 3.6–9.5 | EU citizens can vote from 18, or 16 in some countries, wherever in the EU they live. |
| | vote | 10.4–13.7 | Every five years, each country votes for its own parties. |
| | ballot | 14.1–17.1 | Ballots differ, but often you just mark one party. |
| | seats | 17.5–20.5 | Each party then wins seats in line with its votes. |
| | big | 20.9–25.0 | Big countries have more seats: Germany 96, Malta just 6. |
| 2 Parliament | meps | 25.5–30.6 | Together, that's 720 MEPs: members of the European Parliament. |
| | groups | 31.0–33.7 | They sit in political groups, not by country. |
| | job | 34.1–37.1 | Parliament votes on EU laws and the EU budget. |
| | result | 37.4–47.2 | In June 2024, the centre-right EPP won the most seats: 188. But a majority needs 361, so groups team up. |
| Closing | perPerson | 47.7–53.0 | Per person, though, Malta has about nine times as many MEPs as Germany. |
| | question | 53.3–57.9 | Is it fair that small countries get more MEPs per person than big ones? |

### Part 2 of 2: Commission + Laws (voice 57.6 s, video 58.6 s)

| Step | id | Time (s) | Narration |
|---|---|---|---|
| Title | hook | 0.3–2.1 | Who really runs the EU? |
| Recap | recap | 2.5–7.8 | From 18, or 16 in some countries, EU citizens elect the European Parliament. |
| 3 Commission | commission | 8.4–11.8 | But day to day, the EU is run by the European Commission. |
| | commissionJob | 12.2–17.5 | It proposes new laws, manages the EU's money, and makes sure countries follow EU law. |
| | leaders | 17.9–23.7 | Its President is proposed by the leaders of the 27 countries, who set the EU's direction. |
| | elected | 24.1–31.4 | Then Parliament votes. In July 2024, it re-elected Ursula von der Leyen with 401 votes. |
| | team | 31.8–36.8 | Each country sends one commissioner, and Parliament approves the team, or can vote it out. |
| | notDirect | 37.4–40.0 | So nobody votes for the Commission directly. |
| 4 Laws | onlyCommission | 40.5–43.8 | And only the Commission can propose new EU laws. |
| | decide | 44.1–51.4 | Then two sides decide: Parliament, which you elect, and the Council, made of ministers from the 27 national governments. |
| | both | 51.8–54.8 | Only if both say yes does it become EU law. |
| Closing | question | 55.3–57.2 | So, does your vote really count? |

Small pauses were lengthened after approval (no words changed) so cards can be read: 0.85 s after "who" in Part 1
(the "Who can vote?" card) and 0.6 s after "team" in Part 2.

## Visual plan

Persistent layers in both parts: white paper with a faint dot grid and soft blue/yellow glows, a thin EU-blue bar with
small yellow stars on the top edge, the step header "EU ELECTION SYSTEM" (EU flag chip) with the pills
Vote · Parliament · Commission · Laws, the dark subtitle box at y ≈ 1395 (key words in EU yellow), soft music and light
sound effects.

### Part 1
| # | Scene | What you see |
|---|---|---|
| 1 | Title | Map of the 27 EU countries in EU blue inside the ring of 12 yellow stars, already there on frame 0. Kicker "PART 1 OF 2", title "EU election system". On "27", the countries light up one after another. |
| 2 | Who can vote? | Header slides in, pill 1 "Vote" turns on. Card "WHO CAN VOTE?": EU citizens 18+ (16+ in Austria, Belgium, Germany, Malta; 17+ in Greece) · Live in another EU country? Vote there or for your home country, but only once · Outside the EU? Most countries let you vote from abroad · Voting is compulsory in Belgium, Bulgaria, Luxembourg and Greece. Rows pop on the spoken words. |
| 3 | Ballot | "Every 5 years" chip. A sample ballot card ("BALLOT · You have 1 vote", Party A–D of your country, with candidate lines and boxes). A pen draws a cross next to one party on "mark". Small note: "Every country uses its own ballot". |
| 4 | Votes → seats | "Share of votes → seats" card: Party A 40% → 4 seats, B 30% → 3, C 20% → 2, D 10% → 1 (out of 10 example seats, shown as dots). Then two seat blocks: Germany 96 dots vs Malta 6 dots, with flag chips. |
| 5 | Parliament | Pill 2 "Parliament" turns on. The 720-seat half-circle sweeps in with a counter, "European Parliament" label. On "groups", the seats sort into coloured blocks for the political groups, with a small "not by country" tag. Two job cards pop: "Votes on EU laws" and "Votes on the EU budget". |
| 6 | 2024 result | "June 2024 election" label. The EPP block (188) lights up yellow, "EPP · 188 · centre-right". Dashed majority line with "MAJORITY · 361". On "team up": "188 + other groups → 361" (no coalition is named, to stay neutral). |
| 7 | Per person | The half-circle fades. "1 MEP for every ..." card: Germany ≈ 870,000 people (9 people icons) vs Malta ≈ 96,000 people (1 icon), "≈ 9×". |
| 8 | Question | The question appears big, word by word ("fair", "small", "big" in colour). Then "COMMENT BELOW" and a teaser pill "PART 2: WHO'S REALLY IN CHARGE? →" (pills 3 and 4 glow). |

### Part 2
| # | Scene | What you see |
|---|---|---|
| 1 | Title | The same EU map and star ring, kicker "PART 2 OF 2", title "EU election system". A big "?" pops on "really runs". |
| 2 | Recap | Header slides in with pills 1 and 2 already ticked. Small "Who can vote?" card (EU citizens, 18+, 16+ in Austria, Belgium, Germany, Malta, 17+ in Greece) with an arrow to a mini half-circle "European Parliament · 720 MEPs · elected by you". |
| 3 | Commission | Pill 3 "Commission" turns on. A Commission building with the EU flag, "European Commission · Brussels". Three job cards pop on the words: "Proposes new laws", "Manages the EU's money", "Checks countries follow EU law". |
| 4 | Leaders | A grid of 27 small cartoon leaders (presidents and prime ministers), "The 27 national leaders · set the EU's direction", small print "(the European Council)". An arrow to a candidate card (a generic cartoon politician). |
| 5 | Elected | The 720-seat half-circle: 401 seats fill yellow past the majority mark, counter to 401. Name card "COMMISSION PRESIDENT · Ursula von der Leyen · re-elected July 2024 · 401 votes" with a generic cartoon portrait (no likeness). |
| 6 | Team | 27 small commissioner figures, "one per country · each runs one area, e.g. trade". A big tick "Approved by Parliament · 370 votes · Nov 2024", then a chip "Can vote it out (needs ⅔ of votes)". |
| 7 | No direct vote | Diagram: You → Parliament → Commission. A direct arrow "You → Commission" is crossed out with a "NO DIRECT VOTE" stamp. |
| 8 | Laws | Pill 4 "Laws" turns on. A "PROPOSAL" paper comes out of the Commission with the tag "Only the Commission can propose" (small print: "Parliament, the Council or citizens can ask it to"). The paper goes to two boxes: "European Parliament · elected by you" and "Council of the EU · ministers from 27 governments". Each gets "YES ✓", then the paper is stamped "EU LAW" (small print: "for most EU laws"). |
| 9 | Question | "So, does your vote really count?" big, word by word, then "COMMENT BELOW". All pills ticked. |

## Fact sheet (checked 13 Oct 2026)

| Fact | Source |
|---|---|
| **Who can vote:** EU citizens; minimum age 16 in Austria, Belgium, Germany and Malta, 17 in Greece, 18 elsewhere (set by each member state). | [EPRS: Voting age for European elections](https://www.europarl.europa.eu/thinktank/en/document/EPRS_ATA(2023)749767), [EP factsheet: electoral procedures](https://www.europarl.europa.eu/factsheets/en/sheet/21/the-european-parliament-electoral-procedures) |
| Voting is compulsory in Belgium, Bulgaria, Luxembourg and Greece. | [EP factsheet: electoral procedures](https://www.europarl.europa.eu/factsheets/en/sheet/21/the-european-parliament-electoral-procedures) |
| An EU citizen living in another EU country can vote there (after registering) or for their home country, but never twice in the same election. | [Your Europe: European elections](https://europa.eu/youreurope/citizens/residence/elections-abroad/european-elections/index_en.htm), [Your Europe FAQ](https://europa.eu/youreurope/citizens/residence/elections-abroad/european-elections/faq/index_en.htm) |
| Outside the EU: 23 member states let citizens vote from abroad; Czechia, Ireland, Malta and Slovakia do not (Ireland: only diplomats/military); Bulgaria and Italy only from another EU country. Shown on screen as "most countries let you vote from abroad". | [EPRS: Voting from abroad in EP elections (March 2024)](https://www.europarl.europa.eu/RegData/etudes/BRIE/2023/751457/EPRS_BRI(2023)751457_EN.pdf) |
| Common EU rules: proportional representation (list or single transferable vote), optional threshold up to 5%; each country decides its own voting system and ballot. | [EP factsheet: electoral procedures](https://www.europarl.europa.eu/factsheets/en/sheet/21/the-european-parliament-electoral-procedures) |
| Elections every 5 years; the last ones were held 6–9 June 2024. Turnout 50.74%. | [results.elections.europa.eu: 2024 results](https://results.elections.europa.eu/en/european-results/2024-2029/), [Turnout](https://results.elections.europa.eu/en/turnout/) |
| 720 seats for 2024–2029, fixed per country: Germany 96 (the maximum), France 81, Italy 76, Spain 61, Poland 53 ... Cyprus, Luxembourg, Malta 6 each (the minimum). "Degressive proportionality": MEPs from bigger countries represent more people. | [European Council decision, 22 Sep 2023](https://www.consilium.europa.eu/en/press/press-releases/2023/09/22/the-european-council-establishes-the-composition-of-the-european-parliament/), [Decision (EU) 2023/2061](https://eur-lex.europa.eu/eli/dec/2023/2061), [EP: how many MEPs per country](https://www.europarl.europa.eu/topics/en/article/20180126STO94114/2024-2029-european-parliament-how-many-meps-per-country) |
| People per MEP: Germany 83,577,140 (31 Dec 2024) / 96 ≈ 870,000; Malta 574,250 (end 2024) / 6 ≈ 96,000. Ratio ≈ 9.1, so "about nine times as many MEPs per person". | [Destatis: current population](https://www.destatis.de/EN/Themes/Society-Environment/Population/Current-Population/Tables/liste-current-population-basis-2022.html), [NSO Malta: World Population Day 2025](https://nso.gov.mt/world-population-day-11-july-2025/), cross-check [Eurostat, 1 Jan 2025](https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250711-1) |
| MEPs sit in political groups by political affiliation, not nationality; a group needs 23 MEPs from at least 7 countries. | [EP: political groups](https://www.europarl.europa.eu/about-parliament/en/organisation-and-rules/organisation/political-groups), [EP FAQ](https://www.europarl.europa.eu/news/en/faq/16/what-are-political-groups-and-how-are-they-formed) |
| 2024 result (constitutive session): EPP 188, S&D 136, Patriots for Europe 84, ECR 78, Renew Europe 77, Greens/EFA 53, The Left 46, ESN 25, non-attached 33 (total 720). The EPP (European People's Party) describes itself as centre-right. | [results.elections.europa.eu: seats by group](https://results.elections.europa.eu/en/seats-political-group-country/2024-2029/), [EPRS: size of political groups](https://www.europarl.europa.eu/thinktank/en/document/EPRS_ATA(2024)762357) |
| An absolute majority of the 720 MEPs is 361. | [EP: ordinary legislative procedure ("361 out of 720")](https://www.europarl.europa.eu/olp/en/ordinary-legislative-procedure/overview) |
| Parliament adopts EU laws together with the Council, adopts the budget with the Council, elects the Commission President, approves the Commission, and can force it to resign (motion of censure: two-thirds of votes cast and a majority of all MEPs). | [EP: legislative powers](https://www.europarl.europa.eu/about-parliament/en/powers-and-procedures/legislative-powers), [EP Rules, Rule 131](https://www.europarl.europa.eu/doceo/document/RULES-10-2025-01-20-RULE-131_EN.html) |
| **Commission:** the EU's executive, responsible for its daily running; the only institution that tables laws for Parliament and Council; manages policies and the budget; enforces EU law. One Commissioner per member state (27). | [european-union.europa.eu: European Commission](https://european-union.europa.eu/institutions-law-budget/institutions-and-bodies/search-all-eu-institutions-and-bodies/european-commission_en), [commission.europa.eu: role](https://commission.europa.eu/about/role_en) |
| Others (Parliament, the Council, a European citizens' initiative) can ask the Commission for a proposal; the Commission decides. | [Consilium: ordinary legislative procedure](https://www.consilium.europa.eu/en/council-eu/decision-making/ordinary-legislative-procedure/) |
| **European Council** (the 27 heads of state or government): sets the EU's overall direction and priorities, does not pass laws; proposes the Commission President by qualified majority, taking the EP election into account. | [european-union.europa.eu: European Council](https://european-union.europa.eu/institutions-law-budget/institutions-and-bodies/search-all-eu-institutions-and-bodies/european-council_en), [Consilium: nominations](https://www.consilium.europa.eu/en/european-council/role-nominations-appointment/) |
| 27 June 2024: the European Council proposed Ursula von der Leyen (and elected António Costa as its own President, 1 Dec 2024 – 31 May 2027). | [Consilium: 2024 nomination process](https://www.consilium.europa.eu/en/european-council/role-nominations-appointment/2024-nomination-process/) |
| 18 July 2024: Parliament re-elected von der Leyen with 401 votes (284 against, 22 blank/invalid; 360 needed, as Parliament had 719 members that day). | [EP press release](https://www.europarl.europa.eu/news/en/press-room/20240710IPR22812/parliament-re-elects-ursula-von-der-leyen-as-commission-president) |
| 27 Nov 2024: Parliament approved the whole Commission, 370 for, 282 against, 36 abstentions; in office from 1 Dec 2024. | [EP press release](https://www.europarl.europa.eu/news/en/press-room/20241121IPR25546/parliament-approves-the-von-der-leyen-ii-commission) |
| Censure motions against the Commission failed (latest: January 2026, 165 for, 390 against). Von der Leyen is still President in October 2026. | [EP press release, Jan 2026](https://www.europarl.europa.eu/news/en/press-room/20260116IPR32439/parliament-rejects-motion-of-censure-against-european-commission), [State of the Union 2026](https://ec.europa.eu/commission/presscorner/detail/en/speech_26_1868), [commission.europa.eu: President](https://commission.europa.eu/about/organisation/president_en) |
| **Council of the EU:** government ministers from each EU country (the minister for the topic); negotiates and adopts laws with Parliament, mostly by qualified majority (55% of countries, 65% of the population). | [european-union.europa.eu: Council of the EU](https://european-union.europa.eu/institutions-law-budget/institutions-and-bodies/search-all-eu-institutions-and-bodies/council-european-union_en), [Consilium: qualified majority](https://www.consilium.europa.eu/en/council-eu/voting-system/qualified-majority/) |
| Ordinary legislative procedure (most EU laws): the Commission proposes; Parliament and the Council must both approve the same text, or the law is not adopted. Some special procedures give the Council a bigger role, so the screen says "for most EU laws". | [Consilium: ordinary legislative procedure](https://www.consilium.europa.eu/en/council-eu/decision-making/ordinary-legislative-procedure/), [EP: OLP overview](https://www.europarl.europa.eu/olp/en/ordinary-legislative-procedure/overview) |
| EU colours: Reflex Blue `#003399`, yellow `#FFCC00`; 12 yellow stars on a circle. | [Regulation (EU) 1049/2014](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014R1049) |

**Will go stale:** the 2024 result, von der Leyen as Commission President (term to 2029), and the seats per country
(the 2023 decision asks Parliament to propose a new method by the end of 2026, for 2029). Voting ages and voting from
abroad can change country by country (the abroad list is from March 2024).

**Research note:** the official sites are blocked for direct fetching in Claude cloud sessions, so the facts were
gathered with web searches limited to the official domains above and cross-checked.

## Pronunciation fixes
`MEPs` → "em ee peez" (otherwise read as "meps"), `EPP` → "E P P", `Leyen` → `lˈaɪən`. Numbers are spelled out under
`say` (e.g. `720` → "seven hundred and twenty", `401` → "four hundred and one").
