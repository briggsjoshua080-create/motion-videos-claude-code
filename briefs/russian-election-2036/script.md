# Script notes: Russian election system, "Putin can legally rule until 2036." (59.7 s, 9:16)

The second Russia video: the same facts as `RussianElection` ("How Russia votes.", `briefs/russian-election-system/`),
rebuilt in the **current standard look** (`UkrainianElection`) and to the **TikTok Retention Rules** (CLAUDE.md).
Composition `RussianElection2036`, scenes in `src/scenes/russian-election-2036/`.

**No questions asked** (the user's standing instruction). Choices made:
- **Look:** the `UkrainianElection` look in Russian colours: deep flag blue (`#0B3C93`) with white text, accent words
  in **red blocks with white letters and a thin white rim** (all three flag colours), **red full-screen flashes** for
  the two re-hooks (the second flag colour against the blue), light paper for the ballots and the 2026 result,
  blue-and-red wipe bands. Red is in the flag and reads on blue, so the **standard red subtitle pill** (white text) is
  used; on the red flashes it turns white with red letters, on paper the words turn dark.
- **Hook:** "Putin can legally rule until 2036." on frame 0, over a 2000–2036 timeline of his presidency.
- **Loops:** how (is that legal) · who else has power · did the last vote matter. Re-hooks: "you vote twice" (the two
  Duma ballots) and "the upper house isn't elected".
- **Rewatch detail:** the timeline's 2008–12 stretch is drawn hollow from frame 0 and only explained at the end: the
  old rule allowed two terms in a row, so in 2008 he became prime minister (and came back in 2012).
- **Worked example:** the 2024 presidential election (87%) and the State Duma election of 18–20 Sep 2026 (his party,
  United Russia, 349 of 450; Yabloko, the main liberal party, barred). The party is not named on screen, to keep one
  idea per beat; it is named here and in the fact sheet.
- **Neutrality:** facts only; the barring is stated as fact (Yabloko was barred from the 2026 vote); the closing
  question invites debate: "Can a vote be fair if you know who wins?"
- **Left out for length:** prisoners can't vote and voting is optional (fact sheet), voting over three days and
  online in some regions, the PM's name (Mikhail Mishustin), the after-three-rejections rule, life senators.
- **Lengths:** first take 70.4 s of voice (18 lines); dropped the "two terms is the limit" line (the rewatch payoff
  explains the limit), shortened 12 lines, moved who-can-vote before re-hook 1 so it lands at 12.7 s instead of 9.7 s,
  speed 1.2 → 1.22 → **58.5 s of voice + 1.2 s hold = 59.7 s**.
- Putin is named only in text and voice (no likeness); the ballots, parties and the barred party's card are generic.

## Narration
Lives only in `src/voiceover/russian-election-2036.script.json` (the user's rule: no word-for-word script in the
brief). Beat-by-beat gist and timing: `retention-plan.md`.

## Pronunciation
`pronounce`: Duma → dˈuːmə, Putin → pˈuːtɪn. Numbers under `say`; "PM" is read "P M".

## Fact sheet (checked 3 Nov 2026; re-checked in this session: CEC 349 of 450 confirmed by Meduza/Interfax/Georgia Today, no change of PM found)

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
