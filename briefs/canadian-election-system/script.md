# Script: Canadian election system, "How Canada votes." (≈59.9 s, 9:16)

**Style:** the look of `SwedishElection` (the user's Belgian reference) in the **Canadian flag's colours**: a deep red
background (`#9E1119`, lighter in the middle, darker at the edges) with white text; accent words sit in a white block in
flag red (`#D52B1E`), like the flag's white square with the red leaf; light "paper" scenes for the ballot and the 2025
result; a white sweep opens the video and the closing question; the flag stood on end as the title bar.

The user chose (23 Oct 2026):
- Vertical 1080×1920 @ 30 fps, ≤ 60 s, AI narrator (Kokoro `bm_george`, en-gb, speed 1.15) + TikTok subtitles with a
  **white pill and red text** (the standard red pill would vanish on the red background).
- **Deep red background, white accents.**
- Worked example: **the 2025 result plus the 2026 twist** (floor crossings and by-elections gave the Liberals a majority).
- Closing question: **"Should an MP who switches parties have to face the voters again?"**
- The narration and scene plan below, approved before building (first draft 66.7 s, trimmed to 58.8 s).

## Narration (source of truth: `src/voiceover/canadian-election.script.json`)

| Section | id | Time (s) | Narration |
|---|---|---|---|
| 01 How Canada votes | hook | 0.2–3.6 | In Canada, nobody votes for the prime minister, or the King. |
| 02 Who can vote | who | 3.9–9.7 | Who can vote? Canadian citizens from 18, even abroad, and you can register at the polls. |
| 03 The ballot | ballot | 10.1–14.3 | Your ballot lists only your local candidates. Mark the circle next to one. |
| 04 The count | riding | 14.7–17.7 | The most votes wins the riding, even without half. |
| 05 Parliament | commons | 18.0–23.3 | Each riding's winner joins the House of Commons, which makes the laws and controls the money. |
| 06 The government | pm | 23.6–29.4 | The leader the House backs becomes prime minister. 172 seats is a majority. |
| 07 The Senate | senate | 29.8–35.4 | The 105 senators aren't elected. The prime minister picks them, to review every law. |
| 08 Head of state | crown | 35.8–41.1 | The head of state is King Charles. The Governor General stands in for him and signs the laws. |
| 09 The result | result | 41.4–47.8 | In 2025, Mark Carney's Liberals won 169 seats, three short of a majority. |
|  | twist | 48.2–54.4 | Then five MPs switched to them, and by-elections did the rest: a majority, with no new election. |
| 10 Your verdict | question | 54.9–58.7 | Should an MP who switches parties have to face the voters again? |

## Fact sheet (checked 23 Oct 2026)

| Fact | Source |
|---|---|
| **Who can vote:** Canadian citizens 18 or older on election day. Citizens abroad who have ever lived in Canada can vote by special ballot (mail), with no time limit since the 2019 Supreme Court ruling (*Frank*). Permanent residents can't vote. Voting isn't compulsory. | [elections.ca: Canadians abroad](https://www.elections.ca/content.aspx?section=vot&dir=reg%2Fetr&document=index&lang=e), [elections.ca: Supreme Court ruling](https://www.elections.ca/content.aspx?section=med&document=jan1419c&dir=pre&lang=e) |
| **Register at the polls:** possible on advance polling days and election day, with ID showing name and address (or two pieces of ID, or someone vouching). | [elections.ca: registration at the polls](https://www.elections.ca/content.aspx?section=vot&dir=bkg&document=ec90525&lang=e), [elections.ca: overview of the voting process](https://www.elections.ca/visit/over_vp_e.html) |
| **Ballot:** lists the riding's candidates (with party), mark in the circle beside one name; a pencil is supplied; counted by hand. | [elections.ca: overview of the voting process](https://www.elections.ca/visit/over_vp_e.html), [elections.ca: voting safeguards](https://www.elections.ca/content.aspx?section=vot&dir=int%2Fsaf&document=index&lang=e) |
| **First past the post:** the candidate with the most votes in a riding wins; 343 ridings = 343 seats (2023 representation order); 172 = majority. | [elections.ca: about federal elections](https://www.elections.ca/content2.aspx?section=faq&document=fedelect&lang=e) |
| **Election timing:** fixed date (third Monday of October, four years after the last election); next planned for **15 Oct 2029**; the Charter limits a House to 5 years. | [elections.ca: the electoral cycle](https://www.elections.ca/content.aspx?section=ele&dir=cycle&document=index&lang=e) |
| **Senate:** 105 seats; senators summoned by the Governor General on the PM's advice (independent advisory board since 2016); serve until 75; "sober second thought": reviews, amends or can reject bills. | [canada.ca: about the Senate](https://www.canada.ca/en/campaign/independent-advisory-board-for-senate-appointments/about-the-senate.html), [sencanada.ca brochure](https://sencanada.ca/media/qvnbhzup/com_bro_thought-action-web_e_final.pdf) |
| **The Crown:** King Charles III is head of state; the Governor General represents him, ensures there is a PM with the House's confidence, gives royal assent to bills. **Louise Arbour** installed as 31st Governor General on **8 June 2026** (succeeded Mary Simon). | [gg.ca: Louise Arbour](https://www.gg.ca/en/media/news/2026/louise-arbour-governor-general), [pm.gc.ca: appointment 5 May 2026](https://www.pm.gc.ca/en/news/news-releases/2026/05/05/prime-minister-carney-announces-kings-approval-canadas-next-governor), [gg.ca annual report](https://www.gg.ca/en/the-office/reports/annual-reports/2024-2025-annual-report) |
| **Election 28 Apr 2025:** Liberal 169, Conservative 144, Bloc Québécois 22, NDP 7, Green 1 (343). Votes: Liberal 43.7%, Conservative 41.3%. Turnout 69.0%. Mark Carney (PM since 14 Mar 2025) stayed on with a minority. | [elections.ca: official results table](https://www.elections.ca/res/rep/off/ovrGE45/62/table7E.html), [ourcommons.ca: Appendix 12](https://www.ourcommons.ca/procedure-and-practice-4/app12-e.html), [elections.ca: 45th GE by the numbers](https://www.elections.ca/content.aspx?section=med&dir=pre&document=apr2925&lang=e), [elections.ca: turnout](https://www.elections.ca/content.aspx?section=res&dir=rec%2Feval%2Fpes2025%2Fevt&document=p3&lang=e) |
| **The 2026 twist:** five MPs crossed to the Liberals (Conservatives Chris d'Entremont Nov 2025, Michael Ma Dec 2025, Matt Jeneroux 18 Feb 2026, Marilyn Gladu 8 Apr 2026; NDP Lori Idlout 11 Mar 2026), none via a by-election. Three Liberal seats fell empty (Freeland and Blair resigned; Terrebonne annulled), leaving 171. By-elections on **13 Apr 2026** (Terrebonne, University–Rosedale, Scarborough Southwest), all won by Liberals → **174**, a majority. | [CBC: Idlout](https://www.cbc.ca/news/politics/idlout-crossing-floor-liberals-9.7123443), [CBC: Jeneroux](https://www.cbc.ca/news/politics/jeneroux-joins-liberals-9.7095322), [The Conversation: Gladu](https://theconversation.com/another-mp-jumps-to-carneys-liberals-igniting-concerns-about-the-health-of-canadas-democracy-280342), [CBC: majority with 3 by-elections](https://www.cbc.ca/news/politics/byelection-liberal-conservatives-carney-majority-government-9.7161054), [pm.gc.ca: by-elections called](https://www.pm.gc.ca/en/news/news-releases/2026/03/08/prime-minister-carney-announces-elections), [Globe and Mail](https://www.theglobeandmail.com/politics/article-by-election-results-terrebonne-toronto-university-rosedale-scarborough/) |

**Will go stale:** seat counts change with vacancies (about 173 Liberal seats with 6 vacant as of Sept 2026; the video
shows 174 as of 13 Apr 2026), who is PM, Governor General, King. Check before reusing.

**Research note:** official sites are blocked for direct fetching in Claude cloud sessions; facts were gathered with web
searches limited to official domains (elections.ca, ourcommons.ca, canada.ca, gg.ca, pm.gc.ca, sencanada.ca) and
cross-checked with news sources for 2026 events.

## Pronunciation
No `pronounce` entries needed; numbers and "MP"/"MPs" are spelled out under `say`.
