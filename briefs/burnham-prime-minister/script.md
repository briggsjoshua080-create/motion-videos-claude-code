# Brief: how and why Andy Burnham became UK prime minister, "Britain's new PM won under 25,000 votes." (60.0 s, 9:16)

The user asked (5 Nov 2026): *"Make a motion graphics Video about how and why burnham bekame the uks prime minister.
Same style as us midterms."* So this is a **comedy explainer** in the `USMidterms` style: the comedy formula
(`briefs/comedy-explainer-formula.md`) on top of the **TikTok Retention Rules**, in the standard look themed in the
Union flag's colours. The beat plan, rule check and scores are in `retention-plan.md`; the A/B hooks, caption and
pinned comment in `posting.md`. No word-for-word script here: the narration lives only in
`src/voiceover/burnham-pm.script.json`.

**Style:** the `USMidterms` look (copied from `src/scenes/us-midterms/`): a deep Union flag blue background (lighter in
the middle, deeper at the edges, glows, grain), white text, accent words in **red blocks with white letters and a thin
white rim**, a **full red flash for each re-hook**, light paper for the ballot, the broadcast frame without small text,
numbered sections as huge outlined numerals, no title card, a last frame that mirrors frame 0. **Subtitles: the standard
red pill** at 110 px (white pill with red text on the flashes, dark words on paper). One extra colour: the House of
Commons' green leather, for the chair (and the Greens' green block).

**Comedy (from the formula):**
- **Premise ("the game"): musical chairs.** To be PM you need a chair, a seat in the Commons. Burnham had none; his party
  kept him away from the first free chair (Gorton and Denton), which Labour then lost; an MP stood up and gave him his
  (Makerfield); then he took the big one (No. 10).
- **Running prop:** a green Commons chair (frame 0, the re-hook where it is yanked away, the BLOCKED rope, the chair
  that slides in on re-hook 2, the magnifier at the end).
- **Plant and payoff (rule 10):** a small gold **crown tag** on the chair's arm from frame 0, never mentioned until the
  end: MPs can't legally resign, so an MP who wants to leave is appointed to a do-nothing Crown office, the Steward and
  Bailiff of the Chiltern Hundreds (Josh Simons took it in May 2026 to free Makerfield).
- **Jokes that carry facts:** "No vote for PM" (Britons elect MPs; the biggest party's leader becomes PM), "Swap the
  leader, swap the PM. Seven in ten years." (seven PMs since June 2016), the chair yanked away (a party leader must be an
  MP), "Labour lost it. To the Greens." (Gorton and Denton, Feb 2026), "Rivals: zero." (the 20% nomination bar), the
  do-nothing Crown job.
- **Sincere beat:** "Everyone else votes by 2029." (the next general election is due by August 2029).
- **Neutral (both-sides test):** the jokes target the rules (seats, nominations, the Crown office), not Burnham, Starmer,
  Labour or the voters; no likenesses (generic props only), no party logos; results stated plainly. The closing question
  ("Should a new PM face voters first?") is the one debate line, and it applies to every party (Johnson → Truss → Sunak
  came the same way).

**No questions asked** (the user's standing instruction). Choices made:
- Vertical 1080×1920 @ 30 fps, **60.0 s** (59.0 s of voice + a 1.0 s hold, the shortest the rules allow, to stay at 60 s).
  Kokoro `bm_george`, en-gb, speed 1.22, pauses 0.1 s. First take 74.1 s; trimmed in four rounds (hook number rounded to
  "under 25,000", "who can vote" cut to the fact sheet, 650 moved to the screen, shorter loops, contest, crown and
  closing lines): 59.0 s.
- **Hook:** "Britain's new PM won under 25,000 votes." (Burnham's only public vote on the way to No. 10: 24,937 in the
  Makerfield by-election). Alternatives in `posting.md`.
- **Story:** 01 the chairs (how a PM is chosen; seven PMs in ten years) → re-hook 1 (a leader needs a seat; he had none)
  → 02 no seat (mayor of Greater Manchester, blocked by Labour's NEC in Jan 2026; the Greens won that by-election) →
  03 why now (Labour's May 2026 local-election losses; nearly 100 MPs asked Starmer to go) → re-hook 2 (an MP gave him
  his seat) → 04 the vote (Makerfield, one cross, won by 9,000+; Starmer quit four days later) → 05 the race (20% of
  Labour MPs needed, Burnham had 90%+, unopposed; the King appointed him on 20 July) → everyone else votes by 2029 →
  share → 06 the crown tag (the Chiltern Hundreds) → the question.
- **Who can vote** (UK Parliament: British, Irish and qualifying Commonwealth citizens aged 18+ who are registered) is in
  this fact sheet only: this is not a "political system" video under the standing brief, and the 60 s limit won.
- **Left out for length:** the Mandelson row and staff resignations in Feb 2026, cabinet resignations in May, exact vote
  shares, Reform UK's second place in Makerfield, the NEC vote count, Bev Craig's election as mayor (30 July), Starmer
  leaving the Commons (Sept 2026), Burnham's 2010 and 2015 leadership bids (in the pinned comment).
- **Name in the voice:** "Burnham" and "Starmer" are read correctly by Kokoro; no `pronounce` needed. "MPs", "MP" and
  "PM" are spelled out in `say`.

## Fact sheet (checked 5 Nov 2026)

Official sites (gov.uk, parliament.uk, labour.org.uk) can't be fetched from this cloud session, and Wikipedia is
blocked too, so the facts come from searches, cross-checked across at least two outlets each. Flagged ⚠ where sources
differ.

| Fact | Source(s) |
|---|---|
| Andy Burnham became prime minister on **20 July 2026**, appointed by the King, after Keir Starmer. Labour leader announced **17 July** (nominations closed 15 July); the only candidate, so elected unopposed. Britain's **59th** PM. | [NBC News](https://www.nbcnews.com/world/united-kingdom/andy-burnham-british-prime-minister-keir-starmer-labour-king-charles-rcna588324); [NPR, 19 Jul 2026](https://www.npr.org/2026/07/19/g-s1-134001/andy-burnham-new-british-prime-minister); [Museum of the Prime Minister](https://www.museumofpm.org/prime-ministers/andy-burnham/); [Deccan Chronicle](https://www.deccanchronicle.com/amp/world/andy-burnham-takes-charge-vows-to-end-years-of-uk-political-turmoil-1972491) |
| UK voters elect MPs (650 seats), not the PM; the monarch appoints the person who can command a Commons majority, normally the leader of the biggest party. Labour held about **403** seats in July 2026. | [Institute for Government](https://www.instituteforgovernment.org.uk/explainers/labour-party-leadership-contests); [Al Jazeera, 9 Jul 2026](https://aljazeera.com/news/2026/7/9/uk-labour-leadership-nominations-begin-whos-running-and-how-it-works) ⚠ 402 vs 403 |
| **Seven PMs in ten years**: Cameron, May, Johnson, Truss, Sunak, Starmer, Burnham since the June 2016 Brexit vote. | [CNBC, 22 Jun 2026](https://www.cnbc.com/2026/06/22/keir-starmer-resigns-uk-prime-minister.html); [Georgetown SFS](https://sfs.georgetown.edu/news/five-questions-about-new-uk-prime-minister-andy-burnham/) |
| Labour's rules: a leadership candidate must be an MP, and needs nominations from **20%** of Labour MPs (81 of 403) plus affiliate or CLP support. | [Al Jazeera](https://aljazeera.com/news/2026/7/9/uk-labour-leadership-nominations-begin-whos-running-and-how-it-works); [tutor2u](https://www.tutor2u.net/politics/blog/how-does-the-labour-party-select-its-leader); [ITV](https://www.itv.com/news/2026-06-19/what-happens-now-that-andy-burnham-has-won-the-makerfield-by-election) |
| Burnham had over **90%** of Labour MPs' nominations (379, 94%, by 15 July; 322 on day one), so no rival could reach 81. | [Wikipedia via search (2026 Labour leadership crisis)](https://en.wikipedia.org/wiki/2026_Labour_Party_leadership_crisis); [21st Century Chronicle](https://21stcenturychronicle.com/burnham-set-to-be-next-uk-pm-as-322-labour-mps-back-him-in-first-nomination-tally/) ⚠ exact count varies |
| Burnham was **Mayor of Greater Manchester** (since May 2017). Labour's NEC **blocked** him from standing in the **Gorton and Denton** by-election (Jan 2026; reported 8–1). | [The Conversation](https://theconversation.com/victory-in-gorton-and-denton-is-historic-for-the-greens-and-cataclysmic-for-britains-two-party-politics-277001); [Al Jazeera, 19 Jun 2026](https://www.aljazeera.com/news/2026/6/19/andy-burnham-wins-crucial-uk-by-election-in-blow-to-keir-starmer) |
| Gorton and Denton by-election, **26 Feb 2026**: Green Hannah Spencer 14,980, Reform 10,578, Labour 9,364 (third). The Greens' first Westminster by-election win. | [Manchester City Council](https://www.manchester.gov.uk/online-directories/the-council-and-democracy-directories/elections-and-voting-directories/elections-directories/election-results/parliamentary-elections/parliamentary-gorton-and-denton-by-election-26-february-2026); [Hounslow Herald](https://hounslowherald.com/green-wins-gorton-and-denton-byelection-in-seismic-result-for-politics-p30969-343.htm) |
| **May 2026 local elections**: Labour lost well over 1,000 councillors (reported up to ~1,500) and 35 councils; by 14 May, **97** Labour MPs had called on Starmer to go or set a timetable (LabourList tracker). Video: "crashed", "nearly 100 MPs". | [Newzino](https://newzino.com/story/uk-labour-leadership-transition-2026); [Wikipedia via search](https://en.wikipedia.org/wiki/2026_Labour_Party_leadership_crisis) ⚠ councillor total varies |
| Makerfield MP **Josh Simons** announced on **14 May 2026** he would stand down so Burnham could return; appointed **Steward and Bailiff of the Chiltern Hundreds** (c. 18 May). MPs cannot resign; this nominal Crown office disqualifies them (House of Commons Disqualification Act 1975). | [LabourList](https://labourlist.org/2026/05/josh-simons-resigns-andy-burnham-makerfield-by-election/); [Wigan Today](https://www.wigantoday.net/news/people/josh-simons-officially-resigns-as-makerfield-mp-triggering-a-by-election-8551306); [ObiterJ](https://obiterj.blogspot.com/2026/05/mp-appointed-to-chiltern-hundreds-stoke.html) ⚠ appointment date |
| **Makerfield by-election, 18 June 2026**: Burnham (Labour) 24,937 (54.8%), Robert Kenyon (Reform) 15,696 (34.5%); majority about 9,240; turnout about 58.7%. Video: "under 25,000 votes", "won by 9,000". | [LBC](https://www.lbc.co.uk/article/makerfield-by-election-result-burnham-5Hjdbp7_2/); [Pollcheck](https://www.pollcheck.co.uk/by-elections/makerfield-explorer); [Irish Times](https://www.irishtimes.com/world/uk/2026/06/19/andy-burnham-wins-huge-majority-in-makerfield-byelection/) ⚠ majority 9,231 vs 9,241 |
| Starmer announced his resignation on **22 June 2026** (four days later), staying until a successor was chosen. | [CNBC](https://www.cnbc.com/2026/06/22/keir-starmer-resigns-uk-prime-minister.html); [Newzino](https://newzino.com/story/uk-labour-leadership-transition-2026) |
| Who can vote in a UK Parliament election: British, Irish and qualifying Commonwealth citizens aged **18+**, registered. (Votes at 16 for Westminster was announced in 2025 but did not apply in June 2026.) | [gov.uk: Register to vote](https://www.gov.uk/register-to-vote); [Electoral Commission](https://www.electoralcommission.org.uk/) |
| The next UK general election must be held by **August 2029** (five years after Parliament first met in July 2024). Video: "by 2029". | [Dissolution and Calling of Parliament Act 2022](https://www.legislation.gov.uk/ukpga/2022/11) |
| Afterwards: Bev Craig (Labour) won the Greater Manchester mayoral by-election on 30 July 2026. | [LBC](https://www.lbc.co.uk/article/labour-win-greater-manchester-mayor-bev-craig-andy-burnham-5HjdfQG_2/); [GMCA/Bolton](https://www.bolton.gov.uk/GMElection2026) |

**Stale-fact flags:** "Britain's new PM" (correct as of 5 Nov 2026); Labour's seat count (by-elections change it); "seven
in ten years" (counted to July 2026).
