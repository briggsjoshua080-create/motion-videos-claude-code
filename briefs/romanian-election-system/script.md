# Script: Romanian election system, "How Romania votes." (≈60.0 s, 9:16)

**Style:** the look of `SwedishElection` (the user's Belgian reference, now the default look) in the **Romanian flag's
colours**: a deep Romanian-blue background (`#002B7F`, lighter in the middle, darker at the edges) with white text,
flag yellow (`#FCD116`) for accents, flag red (`#CE1126`) for small marks; light "paper" scenes for the ballot and the
2024 result; yellow sweeps open the video and the closing question; the tricolour stood on end as the title bar.

The user chose (24 Oct 2026):
- Vertical 1080×1920 @ 30 fps, ≤ 60 s, AI narrator (Kokoro `bm_george`, en-gb, speed 1.15) + TikTok subtitles with the
  **standard red pill** (red is in the flag).
- **Blue background, yellow accents, red subtitle pill.**
- Hook: **the cancelled 2024 presidential election**.
- Worked example: **the 1 Dec 2024 parliament vote plus the 2026 change of prime minister** (the 2025 presidential rerun
  sits in the President section).
- Closing question: **"Should a court ever be allowed to cancel an election?"**
- The narration and scene plan below, approved before building (first draft 72.2 s, trimmed to 58.8 s).

## Narration (source of truth: `src/voiceover/romanian-election.script.json`)

| Section | id | Time (s) | Narration |
|---|---|---|---|
| 01 How Romania votes | hook | 0.2–4.8 | In 2024, Romania's top court cancelled a presidential election. |
| 02 Who can vote | who | 5.1–10.4 | Who can vote? Romanians from 18 with an ID card, even abroad or by post. |
| 03 The ballot | ballot | 10.7–15.9 | You get two ballots, each a booklet of party lists. Stamp VOTED in one party's box. |
| 04 The seats | seats | 16.2–19.3 | Parties need 5%, then seats follow the vote. |
| 05 Parliament | parliament | 19.6–26.3 | They fill two chambers, 331 deputies and 134 senators, who pass the laws. |
| 06 Prime minister | pm | 26.6–31.8 | The president names a prime minister, who needs 233 votes in parliament. |
| 07 The president | president | 32.0–40.5 | The president, elected directly, leads defence and foreign policy. The court cited foreign interference, and Nicușor Dan won the rerun. |
| 08 The result | result | 40.7–46.9 | In 2024, the Social Democrats came first with 22%, and seven parties got in. |
|  | now | 47.3–55.6 | In 2026, parliament ousted the prime minister. The president's fourth pick, Luca Niculescu, won 280 votes. |
| 09 Your verdict | question | 56.0–58.8 | Should a court ever be allowed to cancel an election? |

## Fact sheet (checked 24 Oct 2026)

| Fact | Source |
|---|---|
| **Who can vote:** Romanian citizens 18 or older on election day (minus a small number barred by a court). At home you vote with your ID card at your polling station (permanent electoral register, no sign-up). Abroad: in person at any polling station abroad (two days in 2024, 950 stations), or by post after registering beforehand (6,839 did in 2024). Voting isn't compulsory. | [mae.ro: documents for voting abroad](https://losangeles.mae.ro/en/local-news/1448), [mae.ro: register to vote by mail](https://london.mae.ro/en/romania-news/6486), [rri.ro: diaspora prepares](https://rri.ro/en/news-and-current-affairs/today-in-the-news/romanian-diaspora-prepares-for-parliamentary-elections-in-december-id86710.html), [romania-insider: 6,839 postal voters](https://www.romania-insider.com/almost-7000-romanians-living-abroad-vote-mail-oct-2024), [agerpres: 18,008,555 on the lists](https://agerpres.ro/2024/11/30/parliamentaryelections2024-aep-18-008-555-citizens-registered-in-permanent-electoral-lists--1395864) |
| **Ballot:** one ballot for the Senate and one for the Chamber of Deputies; each lists the parties (and independents) in boxes; the voter presses the round "VOTAT" stamp inside one box, folds the paper and drops it in the box (Law 208/2015). | [Law 208/2015, English text](https://www.te.gob.mx/vota_elections/thesaurus/article/22582/16166/178) |
| **Seats:** closed party lists in 43 constituencies (41 counties, Bucharest, Romanians abroad); 5% national threshold for parties; national minority organisations that miss it get one deputy seat each (19 in 2024). | [cdep.ro: Constitution](https://www.cdep.ro/pls/dic/site.page?den=act2_2&par1=3), [cdep.ro: how Parliament works](https://www.cdep.ro/pls/dic/site.page?id=108), [europalibera: seats per county](https://romania.europalibera.org/a/cum-arata-noul-parlament-autoritatea-electorala-permanenta-a-atribuit-mandatele-de-senatori-si-deputati/33230614.html) |
| **Parliament:** two chambers, both elected the same day for four years; both debate and pass laws (one is the "decision" chamber for each kind of law). 2024: 331 deputies (312 + 19 minority seats), 134 senators = 465. | [cdep.ro: how Parliament works](https://www.cdep.ro/pls/dic/site.page?id=108), [europalibera](https://romania.europalibera.org/a/cum-arata-noul-parlament-autoritatea-electorala-permanenta-a-atribuit-mandatele-de-senatori-si-deputati/33230614.html) |
| **Prime minister:** the President designates a candidate after consulting the parties; the government needs a vote of confidence from a majority of all deputies and senators in a joint sitting = **233 of 465**; the same majority can remove it (censure motion). | [presidency.ro: Constitution](https://www.presidency.ro/en/the-constitution-of-romania), [romania-insider: 233 needed](https://www.romania-insider.com/luca-niculescus-proposed-government-faces-confidence-vote-romanian) |
| **President:** directly elected for 5 years, two terms at most; run-off between the top two unless someone wins a majority of registered voters in round one; head of state, commander of the armed forces, leads foreign and defence policy (with the government), can send a law back to parliament once, can dissolve parliament only after failed investiture votes. | [presidency.ro: Constitution](https://www.presidency.ro/en/the-constitution-of-romania), [presidency.ro: domestic policy](https://www.presidency.ro/en/president/role-and-responsibilities/domestic-policy), [ccr.ro: Constitution](https://www.ccr.ro/en/constitution-of-roumania/) |
| **The cancelled election:** first round 24 Nov 2024 led by Călin Georgescu (an outsider); on **6 Dec 2024** the Constitutional Court annulled the whole election, after declassified intelligence reports pointed to foreign (Russian) interference and an online campaign. Rerun 4 May 2025; run-off **18 May 2025**: **Nicușor Dan 53.6%** (6,168,642), George Simion 46.4%; sworn in 26 May 2025. | [romania-insider: CCR annuls](https://www.romania-insider.com/ccr-annuls-presidential-elections-romania-december-2024), [euronews: court cancels](https://www.euronews.com/my-europe/2024/12/06/romanian-constitutional-court-blocks-presidential-run-off), [romania-insider: Simion concedes](https://www.romania-insider.com/george-simion-defeat-presidential-runoff-romania-2025), [euronews: Dan sworn in](https://www.euronews.com/my-europe/2025/05/26/nicusor-dan-sworn-in-as-romanias-president-easing-countrys-political-crisis) |
| **Election 1 Dec 2024 (Chamber):** PSD 21.96% / 86 seats, AUR 18.01% / 63, PNL 13.20% / 49, USR 12.40% / 40, SOS Romania 7.36% / 28, POT 6.46% / 24, UDMR 6.33% / 22, minorities 19 (331). Turnout 52.5%. | [agerpres: AEP final results](https://agerpres.ro/2024/12/02/parliamentaryelection2024-aep---final-results-for-chamber-of-deputies-psd---21-96-aur---18-01-pnl-----1397191), [romania-insider: results](https://www.romania-insider.com/romania-parliamentary-elections-results-december-2024) |
| **Governments since:** Ciolacu (PSD) to May 2025; Ilie Bolojan (PNL) from June 2025 with PSD, PNL, USR, UDMR and minorities; PSD left in April 2026; Bolojan ousted by a censure motion on **5 May 2026** (281 votes). Three nominees failed; the President's fourth pick, **Luca Niculescu** (independent, ex-ambassador to France), won the confidence vote on **20 Oct 2026, 280 to 58** (233 needed): a minority government of PSD and independents. | [agerpres: Bolojan coalition](https://agerpres.ro/english/2025/06/23/bolojan-political-agreement-between-psd-pnl-usr-udmr-minorities-group-ensures-stable-government--1461825), [balkaninsight: PSD ministers resign](https://balkaninsight.com/2026/04/23/romanias-coalition-government-in-crisis-as-psd-ministers-resign/bi/), [aljazeera: Bolojan toppled](https://www.aljazeera.com/news/2026/5/5/romania-pm-ilie-bolojans-government-toppled-in-no-confidence-vote), [balkaninsight: new government](https://balkaninsight.com/2026/10/20/romanian-parliament-backs-new-government-after-months-of-crisis/bi/), [euronews: sworn in](https://www.euronews.com/video/2026/10/21/new-romanian-prime-minister-luca-niculescu-and-cabinet-members-sworn-in) |

**Will go stale:** who is prime minister (Niculescu's minority government is days old on 24 Oct 2026), party seat counts
(MPs switch groups), the President. Next parliament vote due by late 2028. Check before reusing.

**Research note:** official sites are blocked for direct fetching in Claude cloud sessions; facts were gathered with web
searches (official domains first: presidency.ro, cdep.ro, ccr.ro, mae.ro, roaep.ro) and cross-checked with news agencies
(AGERPRES, Euronews, Balkan Insight, Romania Insider) for the 2024–2026 events.

## Pronunciation
`pronounce`: Nicușor → nˌikuʃˈɔɹ, Niculescu → nˌikulˈɛsku. Numbers are spelled out under `say`.
