# Brief: the US Congress, "America's most hated group chat writes every law." (≈59.6 s, 9:16)

The user asked (9 Nov 2026) for a motion graphics video about the **US Congress**: how it's voted, why it's so
impactful for laws, why it's so controversial, what the president has to do with it, **explained in an entertaining
manner with expressions in the voice**, using the current election as the example. So it's a **comedy explainer**
(`briefs/comedy-explainer-formula.md`) on top of the **TikTok Retention Rules**. Beat plan, rule check and scores:
`retention-plan.md`; A/B hooks, caption and pinned comment: `posting.md`. No word-for-word script here: the narration
lives only in `src/voiceover/us-congress.script.json`.

**Style:** the standard look (the `USMidterms` copy of `UkrainianElection`) in the US flag's colours: deep Old Glory
blue, red accent blocks with white letters and a white rim, a full red flash for each re-hook, the broadcast frame
without small text, outlined section numerals 01–06, no title card, a last frame that mirrors frame 0. Standard red
subtitle pill at 110 px (white pill with red text on the flashes). New props in `src/scenes/us-congress/ui.tsx`:
`ChatWindow`, `Bubble` (bars, scroll, typing dots), `DoubleTick`, `Receipt`, `Figure` (generic suited figure, no
likeness), `Clock`, `SenateGrid`.

**Comedy (from the formula):**
- **Premise:** Congress is America's group chat. Two chats (House, Senate), 535 members; a law is a message both
  chats must send word for word; the president isn't in the chat (only members can introduce bills), he can only sign
  or veto; ignoring it for ten days sends it anyway; the election changed who runs both chats; with a president of the
  other party, "expect a lot of left on read" (vetoes).
- **Plant and payoff (rule 10):** a small "typing…" bubble in the chat window on frame 0; at the end the camera pushes
  into it: senators talking, the 25-hour record, 60 votes to end it; that sets up the closing question.
- **Jokes that carry facts:** "Approval: 14%. Ouch." (Gallup), "Wyoming gets as many senators as California, with 68
  times fewer people", "the president? Not even in the chat", "ignore a bill for ten days, and it's law anyway",
  "No deal on money? Shutdown." (43 days), "left on read" (vetoes in divided government), "send this to the friend who
  never replies", the typing dots.
- **Sincere beat:** "Now every law needs both parties."
- **Neutral:** the jokes target the institution and its rules; the shutdown, the record speech and the veto pattern
  hit both parties; no names, no likenesses, no party logos; the result is stated plainly.

**Expression in the voice:** `scripts/voiceover.py` now takes per-sentence `speed`, `voice`, `lang` and `gain`
overrides (Kokoro has no emotion control, so delivery comes from speed, punctuation and pauses): a slower, flat
"Approval: 14%. Ouch." (1.18), excited re-hooks ending in "!" (1.24), a dramatic "He signs... or vetoes.", a slower
closing question (1.18), the rest brisk (1.27). Kokoro `bm_george`, en-gb.

**No questions asked** (standing instruction). Choices made:
- Vertical 1080×1920 @ 30 fps, **59.6 s** (58.43 s of voice + a 1.2 s hold). First take 72.5 s; second 62.2 s; cut
  "picked by citizens from 18", "He can't post a bill", "the government", "Every … Every …" read as a list, then shorter
  phrasings and speeds: 58.4 s.
- **Who can vote** is not spoken (this prompt is not the "political system" standing brief, and the 60 s limit was
  tight): it's in the fact sheet below and in the pinned comment ideas.
- **Worked example:** the **3 Nov 2026 midterms**: Democrats won the House and the Senate (AP projections). Shown as
  colours on the hemicycle and Senate grid (no numbers, rule 7).
- **Closing question:** "So, should the Senate scrap the sixty-vote rule?" (YES/NO); on screen "SHOULD THE SENATE SCRAP
  60-VOTE rules?" so the rows match the hook's layout.
- **Left out for length:** impeachment, Senate confirmations of judges and cabinet, the vice president's tie-break,
  conference committees, gerrymandering, D.C. and territories with non-voting delegates, the pocket veto.

## Fact sheet (checked 9 Nov 2026)

| Fact | Source |
|---|---|
| **Congress:** 535 voting members: House 435 (seats shared out by population, one member per district, two-year terms), Senate 100 (two per state, six-year terms, a third elected every two years). | [US Constitution, Art. I (senate.gov)](https://www.senate.gov/civics/constitution_item/constitution.htm), [usa.gov](https://www.usa.gov/midterm-elections) |
| **Approval:** Gallup, 1–19 Oct 2026: **14%** approve of Congress, the lowest Gallup has recorded before a midterm (trend from 1974). | [Gallup](https://news.gallup.com/poll/716204/record-lows-say-congressional-incumbents-deserve-reelection.aspx), [Political Wire, 28 Oct 2026](https://politicalwire.com/2026/10/28/congress-at-record-low-approval/) |
| **Wyoming vs California:** 2020 census: California 39,538,223, Wyoming 576,851 → about **68.5×**; both have two senators. | [Census Bureau 2020 apportionment](https://www.census.gov/data/tables/2020/dec/2020-apportionment-data.html) |
| **Power:** Congress makes all federal laws, lays taxes, controls spending (the power of the purse); tax bills start in the House. | Constitution Art. I §§ 7–8 (above) |
| **President:** not a member; can't introduce a bill (a member has to); signs or vetoes a bill passed in identical form by both chambers; **two thirds** of each chamber override a veto; a bill neither signed nor returned within **ten days (Sundays excepted)** becomes law, unless Congress has adjourned (then it dies: the pocket veto). | Constitution Art. I § 7 (above), [archives.gov: veto lesson](https://www.archives.gov/files/legislative/resources/education/veto/) |
| **Shutdown:** 1 Oct – 12 Nov 2025, **43 days**, the longest ever (previous record 35 days, Dec 2018 – Jan 2019). | [WTTW/AP](https://news.wttw.com/2025/11/13/president-trump-signs-government-funding-bill-ending-shutdown-after-record-43-days), [Fortune](https://fortune.com/2025/11/13/trump-government-shutdown-over-43-days-historic-length/) |
| **Result, 3 Nov 2026** (AP projections, about 6–7 Nov): Senate **54 D – 44 R**, 2 uncalled (Mississippi, Alaska); House about **254 D – 162 R**, 19 uncalled (other trackers 252–259 D). Democrats control both chambers from 3 Jan 2027; the president is a Republican. | [CBS News](https://www.cbsnews.com/live-updates/election-day-2026-midterms/), [NBC News](https://www.nbcnews.com/politics/2026-elections/house-results), [CNN](https://www.cnn.com/2026/11/05/politics/live-news/midterm-election-congress), [Yahoo/AP live blog](https://www.yahoo.com/news/politics/live/midterms-2026-election-results-and-latest-updates-mississippi-votes-still-being-counted-in-senate-nail-biter-after-democrats-take-control-of-congress-200037541.html) |
| **Longest Senate speech:** about **25 hours** (25 h 4–5 min), 31 Mar – 1 Apr 2025, beating Strom Thurmond's 24 h 18 min (1957, a filibuster against the Civil Rights Act). Not named in the video. | [FOX/AP](https://www.ktvu.com/news/cory-booker-filibuster-senate-floor-speech), [The Hill](https://digital-release.thehill.com/?p=5225720) |
| **60 votes:** ending debate (cloture) on most bills takes three fifths of the Senate, 60; abolished for nominations (2013, 2017) but still in place for laws as of mid-2026 despite pressure to scrap it. | [Daily Signal, Mar 2026](https://www.dailysignal.com/2026/03/20/talking-nuking-or-voting-on-the-filibuster-where-does-gop-senate-infighting-go-from-here/), [Roll Call, Aug 2026](https://rollcall.com/2026/08/03/the-not-so-secret-filibuster-society/) |
| **Who can vote** (fact sheet only): US citizens 18 by Election Day, registered by their state's deadline (North Dakota has no registration); citizens abroad vote absentee; felony rules differ by state. | [usa.gov](https://www.usa.gov/register-to-vote), [vote.gov](https://vote.gov) |

**Will go stale:** the seat counts (uncalled races, certification), "last year" for the 2025 shutdown (true in 2026),
the 60-vote rule (could be changed by the new Senate), the approval figure.

**Research note:** official sites are blocked for direct fetching in cloud sessions; facts came from web searches and
were cross-checked with at least two outlets for the result and the shutdown.

## Pronunciation
No `pronounce` entries. Numbers spelled out under `say`; "November 3" is read "November third".
