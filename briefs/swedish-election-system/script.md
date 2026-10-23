# Script: Swedish election system, "How Sweden votes." (≈59.8 s, 9:16)

**Style:** the user's reference video `belgian-elections-explained.mp4` (made outside this repo: 1920×1080, 60 fps,
music only), redone in **Sweden's flag colours**. The Belgian video is dark only because Belgium's flag is black, so
this one has a **Swedish-blue background with yellow highlights** and white text. Kept from the reference: a "broadcast"
frame (corner marks, a mono label top left, a running timecode top right, a section label, progress ruler and BPM beat
dots at the bottom), numbered sections ("03 — THE BALLOT"), huge heavy uppercase headlines with a soft glow, one
italic serif line per scene, small mono labels, glass-like stat cards, a dot hemicycle, a ballot close-up, colour wipes
between sections. Fonts: Archivo Black (headlines), Instrument Serif italic, JetBrains Mono (labels), Inter (body).

The user chose (19 Oct 2026):
- Vertical **1080×1920 @ 30 fps** for TikTok/Reels, **about 60 seconds** (limit 60 s).
- **AI narrator + TikTok subtitles** (Kokoro `bm_george`), the spoken word on a **Swedish-yellow pill** (dark text),
  not the usual red.
- Title **"HOW SWEDEN VOTES."** (mirrors "HOW BELGIUM VOTES.").
- **2022** as the worked example (a finished story), plus a **short note on 2026** (government still not formed).
- **Short seat maths**: the 4% line and the 39 top-up seats, no worked division table.
- Closing question on the **"no yes vote needed"** rule.
- The narration and scene plan below as written (approved before building).

**Core message:** Swedish citizens from 18 (also abroad) vote; foreign residents only vote locally. Every party has its
own ballot paper (yellow for parliament, blue for the region, white for the municipality, all on one day); you take
your party's paper, may mark one candidate, and seal it in an envelope. The 349-seat Riksdag makes the laws and the
budget; a party needs 4% nationwide, and 39 top-up seats make seats match votes. The Speaker (not the King) proposes a
prime minister, who is in unless 175 members vote no. The King has no political power. 2022: the four parties on the
right won 176 seats and Ulf Kristersson got the job (176–173). 2026: the Speaker's first pick (Magdalena Andersson)
was voted down, 99–248.

## Narration (as spoken: Kokoro `bm_george`, en-gb, speed 1.15)

Source of truth: `src/voiceover/swedish-election.script.json`. Voice-over 58.9 s (last word ends 58.6 s); video 59.77 s
(1.2 s hold). First draft measured 64.4 s; trimmed to 58.6 s before showing the user.

| # | Section | id | Time (s) | Narration |
|---|---|---|---|---|
| 01 | How Sweden votes | hook | 0.2–4.2 | In Sweden, you can become prime minister without a single yes vote. |
| 02 | Who can vote | who | 4.5–11.1 | Who can vote? Swedish citizens from 18, even abroad. Foreign residents vote locally, not for parliament. |
| 03 | The ballot | ballot | 11.4–19.0 | Each party has its own ballot paper, yellow for parliament. Pick yours, mark one candidate if you like, and seal it in an envelope. |
| 04 | The Riksdag | riksdag | 19.3–25.5 | Votes fill the Riksdag, the parliament: 349 members who make laws and set the budget. |
| | | seats | 25.8–31.2 | A party needs 4% nationwide, and 39 top-up seats make seats match votes. |
| 05 | The prime minister | pm | 31.6–38.5 | Then parliament's Speaker, not the King, picks a prime minister, who's in unless 175 members vote no. |
| 06 | The King | king | 38.9–43.6 | The King is head of state, but has no political power. He doesn't even sign laws. |
| 07 | The result | result | 43.9–50.8 | In 2022, four parties on the right won 176 seats, and Ulf Kristersson got the job. |
| | | now | 51.2–54.7 | In 2026, the Speaker's first pick was voted down. |
| 08 | Your verdict | question | 55.2–58.6 | Should a prime minister need a yes vote, not just avoid a no? |

Shown on screen only (planned): voting isn't compulsory, 84% voted in 2022; Swedes abroad re-register every 10 years;
EU citizens vote locally at once, others after 3 years' residence; blue and white papers for the regional and municipal
votes on the same day; the candidate list with one box each, staff drop the envelope in the box; one chamber since
1971; 310 constituency seats in 29 constituencies + 39 top-up seats; the Speaker chairs parliament; the "no" counter
with the 175 line; the King opens parliament each September and presides when a government changes; the full 2022
result in party colours, Kristersson approved 176–173 on 17 Oct 2022, government M + KD + L backed by SD (Tidö
Agreement); 2026: Magdalena Andersson (Social Democrats) 99 yes, 248 no on 15 Oct 2026, talks go on, "as of 23 Oct 2026".

## Fact sheet (checked 19 Oct 2026; the 2026 government talks re-checked 23 Oct 2026)

| Fact | Source |
|---|---|
| **Who can vote (Riksdag):** Swedish citizens, at least 18 on election day, who live in Sweden or have ever been registered as living here. Emigrants keep the vote for 10 years, then re-register for another 10. A coordination number is not enough. | [val.se: right to vote in Sweden](https://www.val.se/english/how-to-vote/your-right-to-vote-and-your-voting-card/your-right-to-vote-if-you-live-in-sweden), [val.se: right to vote abroad](https://www.val.se/english/how-to-vote/your-right-to-vote-and-your-voting-card/your-right-to-vote-if-you-live-abroad) |
| **Foreign residents:** vote in regional and municipal elections only: EU, Icelandic and Norwegian citizens registered in the municipality/region; others after 3 consecutive years in the population register. 18+. | [val.se: right to vote and voting cards](https://www.val.se/servicelankar/servicelankar/other-languages/english-engelska/voting/the-right-to-vote-and-voting-cards) |
| **Voting is not compulsory.** Turnout 2022: 84.21%; 2026: 84.9%. | [val.se: results 2022](https://www.val.se/english/election-results/elections-to-the-riksdag-and-regional-and-municipal-councils/election-results-2022), [val.se: results 2026](https://www.val.se/english/election-results/elections-to-the-riksdag-and-regional-and-municipal-councils/election-results-2026) |
| **Election day:** every four years, second Sunday in September; Riksdag, regional and municipal elections on the same day. | [riksdagen.se: elections to the Riksdag](https://www.riksdagen.se/en/how-the-riksdag-works/democracy/elections-to-the-riksdag/) |
| **Ballot papers:** one per party per election; yellow = Riksdag, blue = regional council, white = municipal council. Name ballots (party + candidates), party ballots (party only), blank ballots (write the party). Personal vote: an "x" by **one** candidate (or write the name on a party/blank ballot). | [val.se: ballot papers](https://www.val.se/english/the-swedish-electoral-system/ballot-papers) |
| **How you vote:** take one paper per election (papers stand behind a screen), go behind a screen, put one paper in each envelope and seal it, hand the envelopes to staff and show ID; staff tick the roll and put the envelopes in the ballot box. | [val.se: how to vote on election day](https://www.val.se/english/how-to-vote/voting-on-election-day/heres-how-to-vote-on-election-day) |
| **Personal votes:** a candidate marked on at least 5% of the party's ballots in the constituency moves up (2026: 81 of 349 elected on personal votes). | [val.se: distribution of seats](https://www.val.se/english/the-swedish-electoral-system/distribution-of-seats), [val.se: elected members 2026](https://www.val.se/servicelankar/servicelankar/pressrum/nyheter--pressmeddelanden/pressmeddelande-nya/2026-09-19-valda-ledamoter-till-riksdagen) |
| **Seats:** 349 = 310 fixed constituency seats (29 constituencies) + 39 adjustment ("top-up") seats that make the national split match the national vote. Threshold 4% nationwide (or 12% in one constituency for that constituency's seats). Modified odd-number method, first divisor 1.2 since 2018 (1.2, 3, 5, 7 …). | [val.se: distribution of seats](https://www.val.se/english/the-swedish-electoral-system/distribution-of-seats), [val.se manual "Mandatfördelning"](https://www.val.se/download/18.162047b519a91d05331183a9/1761747515752/manual-mandatfordelning-val-v785-05.pdf), [riksdagen.se: glossary](https://www.riksdagen.se/en/glossary/) |
| **Riksdag:** one chamber since 1971 (349 members since 1976); enacts laws, decides taxes and how state money is spent, scrutinises the government. The Speaker leads the chamber's work. | [riksdagen.se: elections to the Riksdag](https://www.riksdagen.se/en/how-the-riksdag-works/democracy/elections-to-the-riksdag/), [riksdagen.se: The work of the Riksdag](https://www.riksdagen.se/en/how-the-riksdag-works/the-work-of-the-riksdag/), [Instrument of Government (2023, EN)](https://www.riksdagen.se/globalassets/05.-sa-fungerar-riksdagen/demokrati/the-instrument-of-government-2023-eng.pdf) |
| **Prime minister:** the Speaker talks to the party leaders and proposes a PM; the Riksdag votes; the proposal fails only if more than half of all members (175) vote no. Up to four proposals; then an extra election within three months. | [riksdagen.se: forming a government](https://www.riksdagen.se/en/how-the-riksdag-works/democracy/forming-a-government/) |
| **King:** head of state (Instrument of Government 1:5) with no political power since the 1974 Instrument of Government; does not appoint the PM; laws and government decisions are signed by the PM or a minister on the government's behalf (IG 7:7) and promulgated by the government. Opens the Riksdag session each September; presides over the council where a new government takes office. | [riksdagen.se: Instrument of Government 50 years](https://www.riksdagen.se/en/how-the-riksdag-works/the-history-of-the-riksdag/the-instrument-of-government-50-years/), [kungahuset.se: the monarchy](https://www.kungahuset.se/english/the-monarchy-of-sweden), [kungahuset.se: King opens the session (2022)](https://www.kungahuset.se/english/archive/news/2022-09-27-hm-the-king-opens-the-parliamentary-session), [Instrument of Government (2023, EN)](https://www.riksdagen.se/globalassets/05.-sa-fungerar-riksdagen/demokrati/the-instrument-of-government-2023-eng.pdf) |
| **Election 11 Sept 2022:** S 107 (30.33%), SD 73 (20.54%), M 68 (19.10%), V 24, C 24, KD 19, MP 18, L 16 = 349. M + SD + KD + L = 176; S + V + C + MP = 173. | [val.se: results 2022](https://www.val.se/english/election-results/elections-to-the-riksdag-and-regional-and-municipal-councils/election-results-2022) |
| **Government 2022:** Ulf Kristersson (Moderates) approved 17 Oct 2022, 176 yes (M, SD, KD, L) to 173 no; took office 18 Oct 2022 at a council chaired by the King. Coalition M + KD + L, cooperating with SD under the Tidö Agreement. | [riksdagen.se: Kristersson approved](https://www.riksdagen.se/en/news/articles/2022/oct/17/ulf-kristersson-approved-as-prime-minister_cms40110c18-74aa-4e0b-a28e-19df166633dben/), [government.se: Sweden's new Government](https://www.government.se/press-releases/2022/10/swedens-new-government/) |
| **Election 13 Sept 2026:** S 99 (28.02%), M 70, SD 62, V 30, C 25, KD 22, MP 22, L 19 = 349; result fixed 19 Sept. Kristersson asked to be dismissed 17 Sept (caretaker). | [val.se: results 2026](https://www.val.se/english/election-results/elections-to-the-riksdag-and-regional-and-municipal-councils/election-results-2026), [val.se press release 19 Sept 2026](https://www.val.se/servicelankar/servicelankar/pressrum/nyheter--pressmeddelanden/pressmeddelande-nya/2026-09-19-riksdag-election-results-2026-established) |
| **15 Oct 2026:** the Speaker's proposal, Magdalena Andersson (S), rejected: 99 yes, 248 no, 0 abstained, 2 absent. **19 Oct:** the Speaker gave Centre Party leader Elisabeth Thand Ringqvist the task of exploring a government parliament can tolerate; she reports on 26 Oct; no date for a new prime-minister vote (status on 23 Oct 2026). | [riksdagen.se: No to Magdalena Andersson](https://www.riksdagen.se/en/news/articles/2026/oct/15/no-to-magdalena-andersson-socdem-as-prime_cmsd2ab1134-a03c-4be2-b345-af0aacff33d3en/), [riksdagen.se: next step](https://www.riksdagen.se/sv/aktuellt/aktuelltnotiser/2026/okt/15/nasta-steg-i-regeringsbildningen_cms81daed92-3bdf-4af2-a731-6ed385bca324sv/), [riksdagen.se: task to Thand Ringqvist](https://www.riksdagen.se/sv/aktuellt/aktuelltnotiser/2026/okt/19/talmannen-ger-sonderingsuppdrag-till-elisabeth_cms20f3231b-7bf8-47ca-a1c7-2a0e5045b80dsv/); cross-check: [The Local](https://www.thelocal.se/20261015/breaking-social-democrat-leader-magdalena-andersson-loses-first-pm-vote), [Reuters via US News](https://www.usnews.com/news/world/articles/2026-10-15/swedish-parliament-votes-against-social-democrats-leader-as-pm-as-expected) |

**Will go stale:** the 2026 government formation (still open on 23 Oct 2026; the line "the Speaker's first pick was
voted down" stays true, but "talks go on — as of 23 Oct 2026" on screen will not; update `PM_2026.asOf` in
`src/scenes/swedish-election/constants.ts` and re-render, or change the line once a prime minister is approved). Kristersson leads a caretaker government until a new PM
takes office. Next regular election: September 2030 (earlier if four PM proposals fail).

**Research note:** official sites are blocked for direct fetching in Claude cloud sessions; facts were gathered with web
searches limited to official domains (val.se, riksdagen.se, regeringen.se/government.se, kungahuset.se), cross-checked
with news sources (The Local, Reuters, SVT).

## Pronunciation
`Riksdag` → `ɹˈɪksdɑːɡ`, `Kristersson` → `kɹˈɪstəʃɒn`, `Andersson` → `ˈandəʃɒn`, `Magdalena` → `mˌaɡdəlˈeɪnə`
(the last two kept for later edits; not spoken now). Numbers spelled out under `say`.
