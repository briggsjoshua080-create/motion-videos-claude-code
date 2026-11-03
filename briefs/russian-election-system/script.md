# Script: Russian election system, "How Russia votes." (≈59.9 s, 9:16)

**Style:** the default look (`SwedishElection`, the user's Belgian reference style) in the **Russian flag's colours**: a
strong, deep flag-blue background (`#0B3C93`, lighter in the middle, darker at the edges) with white text; accent words
in **red blocks (the flag's bottom stripe) with white letters and a thin white rim**; white-blue-red wipe bands and
sweeps; light "paper" scenes for the ballots and the result; the tricolour as the title bar (no coat of arms). Red is in
the flag and reads on the blue, so the **standard red subtitle pill** is used.

**No questions asked:** the user's standing instruction (28 Oct 2026). Choices made:
- Vertical 1080×1920 @ 30 fps, ≤ 60 s, AI narrator (Kokoro `bm_george`, en-gb, speed 1.18) + TikTok subtitles.
- **Hook:** "Russia's president can legally rule until 2036" (the 2020 term reset), shown as a timeline of Putin's years
  in power as president or PM since 1999.
- **Worked example:** the most recent national election is the **State Duma election of 18–20 Sep 2026**; the
  **2024 presidential election** is shown for the head of state.
- **Specialities:** two ballots (party list + district candidate), 225/225 seats with a 5% line, an unelected upper
  house (Federation Council: two per region + up to 30 named by the president), a PM picked by the president and
  approved by the Duma, the 2020 term reset, voting over up to three days and online voting in some regions.
- **Neutrality:** the video stays factual; the criticism is attributed and kept to checkable facts (Yabloko barred,
  no OSCE observers invited, "critics call it not free" on screen). The closing question invites debate.
- **Closing question:** "So, can an election be fair if you already know who'll win?"
- **Left out for length:** the 89 regions Russia counts (incl. four annexed Ukrainian regions, not recognised
  internationally; the video only says "per region"), the Constitutional Court, the Security Council, the prime
  minister's name (Mikhail Mishustin; government reshuffled 19 Oct 2026).
- First draft measured 68.4 s of voice; every line except the question was shortened, the online-voting line moved to
  the screen, speed raised from 1.15 to 1.18 → 59.0 s of voice; the final hold is 0.9 s (59.9 s total).
- Putin and the 2024 candidates are named only in text and voice (no likeness); the ballots' parties and candidates,
  the party-vote example and the district race are made up.

## Narration (source of truth: `src/voiceover/russian-election.script.json`)

| Section | id | Time (s) | Narration |
|---|---|---|---|
| 01 How Russia votes | hook | 0.2–3.9 | Russia's president can legally rule until 2036. |
| 02 Who can vote | who | 4.2–10.1 | Who can vote? Every citizen from 18, also from abroad. Not prisoners, and voting is optional. |
| 03 The ballots | ballot | 10.4–16.3 | For parliament, you get two ballots: one with parties, one with local candidates. Tick one box on each. |
| 04 The seats | seats | 16.7–23.2 | Half of the 450 seats go to parties above 5%. The other half go to district winners. |
| 05 The parliament | congress | 23.5–32.9 | That's the State Duma, which makes the laws. The Federation Council must approve them, but nobody elects it: regions send two each, the president adds up to 30. |
| 06 The president | president | 33.3–43.6 | The president is elected for six years, with a run-off if no one gets half. He picks the prime minister; the Duma approves. In 2020, Putin's terms were reset to zero. |
| 07 The result | result | 43.9–55.2 | In 2024, Putin won with 87%. In 2026, United Russia took 349 of 450 seats, with the main liberal party barred. |
| 08 Your verdict | question | 55.9–59.0 | So, can an election be fair if you already know who'll win? |

## Fact sheet (checked 3 Nov 2026)

| Fact | Source |
|---|---|
| **Who votes:** citizens who are 18 by election day, legally capable, not serving a prison sentence by court verdict. Citizens abroad vote at embassies/consulates (152 countries in 2026). Voting is optional. Voter lists come from residence registration (no sign-up). Remote electronic voting (DEG) in some regions, only with a Russian address. Foreigners: only local elections where a treaty allows. | [TASS: who can vote](https://tass.com/politics/1337181), [Meduza: voting abroad 2026](https://meduza.io/en/feature/2026/09/15/putin-lost-at-some-overseas-polling-stations-in-2024-here-s-how-russians-abroad-can-vote-in-this-weekend-s-state-duma-elections), [Moscow Times: rules abroad](https://www.themoscowtimes.com/2024/01/31/eyeing-anti-kremlin-exiles-russia-tightens-rules-on-voting-abroad-a83887) |
| **State Duma:** 450 seats, 5 years; 225 by nationwide party list (5% line), 225 in single-member districts (most votes wins, no run-off); two ballots, a mark in one empty square on each. Makes the laws. | [Wikipedia: Russian legislative elections](https://en.wikipedia.org/wiki/Russian_legislative_elections), [Belfer Center: Russian election law](https://www.belfercenter.org/publication/russian-election-law), Constitution art. 95–97, 105 |
| **Federation Council:** two per region (one from the regional parliament, one from the governor), up to 30 named by the president (up to 7 for life), former presidents for life; not elected by voters; must approve federal laws. | [Meduza 2020](https://meduza.io/en/feature/2020/09/22/it-s-always-a-surprise), [TASS: law on the Federation Council](https://tass.com/politics/1218717), Federal Law 439-FZ (22 Dec 2020), Constitution art. 95, 105–106 |
| **President:** head of state, 6 years, over 50% in round one or a run-off; picks the prime minister, whom the Duma approves (after three rejections he appoints and may dissolve the Duma). 2020 amendments: two terms in total, the sitting president's earlier terms not counted → Putin can run in 2030 and serve to 2036. | [Moscow Times 2020](https://www.themoscowtimes.com/2020/03/16/russias-top-court-approves-putin-reform-plan-to-stay-president-until-2036-a69643/pdf), [Al Jazeera 2020](https://www.aljazeera.com/amp/news/2020/07/03/putin-orders-constitution-changes-allowing-him-to-rule-until-2036), Constitution art. 81, 111 |
| **Putin's years:** PM Aug 1999; acting president 31 Dec 1999; president 2000–08 (two terms), PM 2008–12, president 2012, 2018, 2024 (5th term). | Wikipedia; Kremlin |
| **2024 presidential (15–17 Mar):** Putin **87.28%**, Kharitonov 4.31%, Davankov 3.85%, Slutsky 3.20%; turnout **77.49%**. Observers and foreign governments called it unfree and non-competitive. | [Moscow Times: final count](https://www.themoscowtimes.com/2024/03/18/putin-wins-8728-of-votes-with-all-ballots-counted-election-officials-a84515/pdf), [Anadolu](https://www.aa.com.tr/en/asia-pacific/russian-electoral-authority-officially-declares-putin-winner-in-presidential-poll/3170664) |
| **2026 State Duma (18–20 Sep):** CEC (25 Sep): **United Russia 349**, Communists 37, LDPR 23, New People 19, A Just Russia 17, Rodina 1, independents 4 (= 450). UR 57.83% of the list vote (preliminary). Turnout 59.8%. Preliminary count had said 355. Yabloko barred in summer 2026; no OSCE observers invited; Golos's head in jail. | [Meduza: 349 of 450](https://meduza.io/en/news/2026/09/25/united-russia-won-349-of-450-seats-in-russia-s-new-state-duma-parliament-will-include-46-war-participants), [Georgia Today](https://georgiatoday.ge/cec-united-russia-secures-349-seats-in-russias-state-duma/), [Meduza: 57.82%](https://meduza.io/en/news/2026/09/21/russia-s-election-commission-says-ruling-party-united-russia-leads-in-208-of-225-single-member-districts-and-has-57-82-of-the-party-list-vote), [Euronews](https://www.euronews.com/2026/09/21/russians-vote-in-final-day-of-parliamentary-elections), [Meduza: no competition, Yabloko barred](https://meduza.io/en/feature/2026/09/16/russia-s-2026-parliamentary-election-has-no-meaningful-competition-independent-observers-still-plan-to-document-how-paper-and-online-results-diverge), [Moscow Times: Golos](https://www.themoscowtimes.com/2026/08/06/russia-wants-to-stamp-out-free-election-monitoring-it-wont-work) |
| **Government:** Mishustin's cabinet reshaped 19 Oct 2026; Mishustin still PM as far as found. | [Interfax](https://interfax.com/newsroom/top-stories/119223/), [Nest Centre](https://nestcentre.org/?p=8281) |

**Will go stale:** party seat counts change with by-elections; the PM may change; the next presidential election is
due in March 2030. Re-check before reusing.

**Research note:** official sites (cikrf.ru, duma.gov.ru, kremlin.ru) are blocked for direct fetching in Claude
cloud sessions; facts were gathered with web searches and cross-checked across Meduza, Interfax, the Moscow Times,
Euronews and others. The final CEC party-list percentages for parties other than UR and the Communists were not
confirmed and are not used.

## Pronunciation
`pronounce`: Duma → dˈuːmə, Putin → pˈuːtɪn. Numbers and percentages spelled out under `say`.
