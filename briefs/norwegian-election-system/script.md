# Script: Norwegian election system, "How Norway votes." (≈59.7 s, 9:16)

**Style:** the default look (`SwedishElection`, the user's Belgian reference) in the **Norwegian flag's colours**: a deep
Norwegian-red background (`#9C0A27`, lighter in the middle, darker at the edges) with white text; accent words in
**navy blocks with a white rim** (the flag's blue cross with its white edge); navy-and-white wipe bands and sweeps;
light "paper" scenes for the ballot and the 2025 result; a slice of the flag stood on end as the title bar.

**No questions this time:** the user asked for the recommended approach on everything (26 Oct 2026). Choices made:
- Vertical 1080×1920 @ 30 fps, ≤ 60 s, AI narrator (Kokoro `bm_george`, en-gb, speed 1.15) + TikTok subtitles.
- **Subtitle pill: navy with white text.** Red is in the flag, but the background is red, so a red pill wouldn't read
  (the brief says to ask in that case; the user said not to ask). Navy is the flag's third colour.
- **Controversial opening statement:** a vote in the far north (Finnmark) counts almost twice as much as one in Oslo
  (seats are shared out by population *and* land area).
- **Equally controversial ending:** Norway's parliament can never be dissolved, no early elections. "Stability, or
  democracy on pause?"
- Worked example: the **8 Sep 2025** Storting election; plus the **new King** (Haakon VIII since 28 Aug 2026).
- First draft measured 63.4 s; trimmed to 59.5 s of voice (59.7 s with the closing hold).

## Narration (source of truth: `src/voiceover/norwegian-election.script.json`)

| Section | id | Time (s) | Narration |
|---|---|---|---|
| 01 How Norway votes | hook | 0.2–5.3 | In Norway, a vote in the far north counts almost twice as much as a vote in Oslo. |
| 02 Who can vote | who | 5.6–10.1 | Who can vote? Norwegians who turn 18 in the election year, even abroad. |
| 03 The ballot | ballot | 10.4–15.3 | One ballot paper per party: pick one, fold it, get it stamped, drop it in the box. |
| 04 The seats | seats | 15.6–23.6 | Seats go to 19 districts by people and land: Finnmark gets a seat per 14,000 voters, Oslo per 26,000. |
|  | topup | 23.9–28.1 | Parties above 4% get top-up seats to match the national vote. |
| 05 The Storting | storting | 28.4–33.5 | That's 169 seats in the Storting, which makes the laws and sets taxes. |
| 06 Prime minister | pm | 33.9–38.7 | A prime minister needs no vote to take office, just no majority against them. |
| 07 The King | king | 39.0–43.9 | The King appoints the government and signs every law. Since August: Haakon VIII. |
| 08 The result | result | 44.2–51.7 | In 2025, Labour won 53 seats, Progress 47, and Jonas Gahr Støre stayed on, governing alone. |
| 09 Your verdict | question | 52.1–58.5 | And Norway's parliament can never be dissolved. No early elections. Stability, or democracy on pause? |

## Fact sheet (checked 26 Oct 2026)

| Fact | Source |
|---|---|
| **Who can vote:** Norwegian citizens who are 18 or turn 18 by the end of the election year, and are or have ever been registered as resident in Norway (diplomatic staff regardless). Everyone is on the electoral register automatically (no sign-up); abroad: automatically if you lived in Norway in the last 10 years, otherwise you're added when you vote. Vote abroad at embassies/consulates (advance voting) or by post. Not compulsory; turnout 2025: 80%. Foreign residents can vote only in local elections, not for the Storting. | [valg.no: voting rights and the electoral register](https://www.valg.no/en/for-voters/parliamentary-election-2025/voting-rights-and-the-electoral-register/), [regjeringen.no: Election Act (English)](https://www.regjeringen.no/contentassets/65ef16de8087456e9c10530b68b2fcb6/2025/act-relating-to-parliamentary-and-local-government-elections.pdf), [valg.no: voting by mail](https://www.valg.no/en/for-voters/parliamentary-election-2025/voting-from-abroad/voting-by-mail/), [ssb.no: Storting election 2025 (turnout 80%)](https://www.ssb.no/valg/stortingsvalg) |
| **Ballot:** one ballot paper per party (with its list of candidates). Pick one, fold it, the polling official stamps it, then you put it in the box yourself. **Since the 2025 election the Storting lists are closed:** voters can no longer strike out or reorder candidates. Voting outside your own municipality uses a simpler paper with party names only. | [valg.no: voting on election day](https://www.valg.no/en/for-voters/parliamentary-election-2025/voting-on-election-day/), [regjeringen.no: veileder om stemming (closed lists from 2025)](https://www.regjeringen.no/contentassets/8d1f4ff9bf284a49a0cfac328660b405/no/pdfs/h-2571-b_veileder-om-stemming.pdf) |
| **Seats per district (area factor):** 19 districts (the pre-2018 counties); seats per district are calculated from population **and area: 1 point per resident, 1.8 points per km²** (Constitution § 57, Election Act § 11-3); every district has at least 4 seats; recalculated before each election. For 2025 Finnmark dropped from 5 to 4 seats, Akershus rose to 20 (same as Oslo). | [lovdata.no: Election Act ch. 11](https://lovdata.no/dokument/NLO/lov/2002-06-28-57/KAPITTEL_11#%C2%A711-11), [stortinget.no: 2022–23 committee report](https://www.stortinget.no/no/Saker-og-publikasjoner/Publikasjoner/Innstillinger/Stortinget/2022-2023/inns-202223-431l/?all=true), [regjeringen.no: seat allocation 2025](https://www.regjeringen.no/no/aktuelt/fordeling-av-mandatene-for-stortingsvalget-i-2025/id3040582/), [valg.no: seat allocation 2025](https://www.valg.no/aktuelt/siste-nytt/fordeling-av-mandatene-for-stortingsvalget-i-2025/) |
| **Vote weight (the hook):** eligible voters 2025 (SSB): Finnmark 54,600 for 4 seats = **13,650 per seat (≈14,000)**; Oslo 518,570 for 20 seats = **25,930 per seat (≈26,000)**. Ratio **1.9** ("almost twice"). Counts all seats of the district (district + its top-up seat). | [ssb.no: immigrants and Norwegian-born at the 2025 election (eligible voters per district)](https://www.ssb.no/valg/stortingsvalg/artikler/innvandrere-og-norskfodte-ved-stortingsvalget-2025/_/attachment/inline/2fa575fc-ff02-419d-a685-8f76070881e1:ad877ca871e173b5c57e0cd7c577ed51d988ce2b/RAPP2026-03.pdf), [stortinget.no: Oslo, 20 seats](https://www.stortinget.no/no/Representanter-og-komiteer/valgdistriktene/Oslo/) |
| **Top-up seats:** 169 = 150 district seats + 19 top-up (levelling) seats, one per district. Only parties with **4%+ nationwide** take part in the top-up seats; there is **no threshold for district seats**. 2025: 19 top-ups went to Red 5, SV 4, KrF 4, Centre 1, Conservatives 1 (and others per final count). | [stortinget.no: Stortingsvalg](https://www.stortinget.no/no/stortinget-og-demokratiet/valg-og-konstituering/stortingsvalg/), [snl.no: utjevningsmandat](https://snl.no/utjevningsmandat), [undervisning.stortinget.no: Stortinget 2025–29](https://undervisning.stortinget.no/valg/stortinget-2025-29/) |
| **The Storting:** one chamber (the Lagting/Odelsting split ended in 2009), 169 members elected for a fixed four years; passes laws, decides taxes and the budget, controls the government. | [stortinget.no: The Storting and Democracy (English)](https://www.stortinget.no/globalassets/pdf/brosjyrer---plakater/hovedbrosjyre-div-spraak---arkiv/2024/the-storting-and-democracy_2024_english_uu.pdf) |
| **Prime minister / government (negative parliamentarism):** no investiture vote; a government sits as long as no majority votes no confidence (Constitution § 15). Majority of 169 = **85**. | [snl.no: negativt flertall](https://snl.no/negativt_flertall_-_norsk_politikk), [undervisning.stortinget.no: hva er parlamentarisme?](https://undervisning.stortinget.no/maktfordeling/hva-er-parlamentarisme/), [snl.no: regjeringen](https://snl.no/regjeringen?fraa=allkunne) |
| **No dissolution:** the Constitution fixes elections every four years (§ 54) and gives no power to dissolve the Storting or call a snap election; a government that loses confidence resigns and a new one is formed from the same Storting. | [stortinget.no: The Storting and Democracy](https://www.stortinget.no/globalassets/pdf/brosjyrer---plakater/hovedbrosjyre-div-spraak---arkiv/2024/the-storting-and-democracy_2024_english_uu.pdf), [legco.gov.hk: political system of Norway](https://www.legco.gov.hk/research-publications/english/1314fsc49-political-system-of-norway-20140902-e.pdf) |
| **The King:** hereditary head of state; formally appoints the government (the one the Storting will tolerate) and signs laws and decisions in the Council of State (Statsråd) with the ministers. **King Harald V died on 28 Aug 2026 (aged 89, reigned since 1991); his son became King Haakon VIII** the same moment and swore his oath before the Storting on 1 Sep 2026. | [kongehuset.no: Norges konge](https://www.kongehuset.no/kongehuset/hans-majestet-kongen/norges-konge), [kongehuset.no: King Haakon VIII's memorial speech](https://www.kongehuset.no/taler-og-budskap/kong-haakon-viii/minnetale-over-kong-harald-v), [regjeringen.no: the Prime Minister's speech, King Harald V has died](https://www.regjeringen.no/en/whats-new/his-majesty-king-harald-v-has-died-the-prime-ministers-speech/id3171481/), [nrk.no: Kong Harald er død](https://www.nrk.no/norge/kong-harald-er-dod-1.14236265), [ABC News: oath on 1 Sep](https://abcnews.com/International/wireStory/norways-king-haakon-pledges-oath-allegiance-constitution-father-136110584) |
| **Election 8 Sep 2025:** Labour 28.0% / 53 seats, Progress 23.8% / 47, Conservatives 14.6% / 24, Socialist Left 9, Centre 9, Red 9, Greens 8, Christian Democrats 7, Liberals 3 (= 169). The left/centre side (Ap, SV, Sp, R, MDG) has 88 seats. Jonas Gahr Støre (Labour) continued as PM with a **Labour-only minority government** (Centre had left the cabinet on 4 Feb 2025), relying on SV, Sp, Red and the Greens for budgets (2026 budget deal 3 Dec 2025; 2027 budget tabled 7 Oct 2026). | [stortinget.no: party overview](https://www.stortinget.no/no/Representanter-og-komiteer/Partiene/Partioversikt/), [undervisning.stortinget.no: Stortinget 2025–29](https://undervisning.stortinget.no/valg/stortinget-2025-29/), [regjeringen.no: Støre's government](https://www.regjeringen.no/en/the-government/previous-governments/regjeringer-siden-1814/historiske-regjeringer/governments-since-1945/jonas-gahr-stores-government/id2877906), [Arctic Today / Reuters: budget deal](https://www.arctictoday.com/norway-government-budget-in-peril-over-oil-wealth-funds-israel-investments), [regjeringen.no: 2027 budget](https://www.regjeringen.no/no/statsbudsjett/2027) |

**Will go stale:** who is prime minister (Støre's Labour minority government), party seat counts, "since August" for
the King (fine for this video's life on TikTok, but reword if reused after 2026). Seats per district are recalculated
before every election, so the Finnmark/Oslo numbers change in 2029. Next Storting election: September 2029.

**Research note:** official sites are blocked for direct fetching in Claude cloud sessions; facts were gathered with web
searches (official domains first: valg.no, regjeringen.no, stortinget.no, kongehuset.no, lovdata.no, ssb.no) and
cross-checked with SNL, NRK and wire services (Reuters, AP). The King's death was confirmed on kongehuset.no,
regjeringen.no and NRK before it went into the script.

## Pronunciation
`pronounce`: Storting → stˈɔːtɪŋ, Finnmark → fˈɪnmɑːk, Haakon → hˈɔːkɒn, Støre → stˈøːɹə, Gahr → ɡˈɑː.
Numbers and "VIII" (the Eighth) are spelled out under `say`.
