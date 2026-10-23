# Script: US election system, "How the US votes." (≈59.9 s, 9:16)

**Style:** the look of `SwedishElection` (itself the user's Belgian reference video, `belgian-elections-explained.mp4`),
redone in the **US flag's colours**: a navy background (Old Glory blue `#0A3161`) with red highlights (a brighter red
`#F0475E` for text on navy, flag red `#B31942` for fills) and white text. Kept from the Swedish video: the broadcast
frame (corner marks, mono label, running timecode, section label, progress ruler, BPM dots), numbered sections, huge
heavy uppercase headlines with a soft glow, one italic serif line per scene, glass cards, light "paper" scenes for the
ballot and the result, colour wipes (red here). The flag bar on the title is a vertical stars-and-stripes bar.

The user chose (23 Oct 2026):
- Vertical **1080×1920 @ 30 fps**, **about 60 seconds** (limit 60 s), AI narrator (Kokoro `bm_george`) + TikTok subtitles
  with the standard **red pill** (red is in the flag).
- Focus: **President + Congress** (Vote → Congress → Electoral College → President), **2024** as the worked example
  plus a short, dated note on the **2026 midterms (3 Nov 2026)**.
- Title **"HOW THE US VOTES."**; closing question **"Should the candidate with the most votes always win?"**
- The narration and scene plan below, approved before building.

**Core message:** US citizens from 18 (also abroad) can vote, but must register first (not in North Dakota). One paper
ballot holds every race; you fill in the oval. Congress (makes laws, sets the budget) = House (435, every 2 years) +
Senate (100, two per state, 6-year terms). Your presidential vote picks electors; the state's winner usually takes all
of them (not in Maine and Nebraska); 538 electors, 270 wins. The president is head of state and head of government,
leads the government and the army and can veto laws. 2024: Trump 312 – Harris 226; Republicans won both houses.

## Narration (as spoken: Kokoro `bm_george`, en-gb, speed 1.15)

Source of truth: `src/voiceover/us-election.script.json`. Voice-over 59.0 s (last word ends 58.7 s); video 59.9 s
(1.2 s hold). First draft measured 60.0 s to the last word; trimmed two lines to 58.7 s before showing the user.

| # | Section | id | Time (s) | Narration |
|---|---|---|---|---|
| 01 | How the US votes | hook | 0.2–3.6 | In America, you don't vote for the president. Not directly. |
| 02 | Who can vote | who | 3.9–9.4 | Who can vote? US citizens from 18, even abroad. But first, you have to register. |
| 03 | The ballot | ballot | 9.7–15.4 | One paper ballot lists every race, from president to sheriff. Fill in the oval next to your choice. |
| 04 | Congress | congress | 15.7–23.4 | You also elect Congress, which makes the laws and sets the budget: 435 members of the House, every two years, |
| | | senate | 23.7–26.9 | and 100 senators, two per state, for six years. |
| 05 | Electoral College | electors | 27.3–32.7 | Your vote for president really picks electors. Whoever wins a state usually takes all of them. |
| | | win | 33.1–37.9 | 538 in all. 270 wins the White House. |
| 06 | The president | president | 38.3–42.2 | The president leads the government and the army, and can veto laws. |
| 07 | The result | result | 42.5–51.8 | In 2024, Donald Trump won 312 electors to Kamala Harris's 226. Republicans also won Congress. |
| | | now | 52.2–55.5 | On November 3rd, the midterms decide Congress again. |
| 08 | Your verdict | question | 55.9–58.7 | Should the candidate with the most votes always win? |

Shown on screen only: voting isn't compulsory, 65% voted in 2024; citizens abroad vote by mail via their home state;
registration deadlines differ; each state sets the details; territories (e.g. Puerto Rico) have no vote for president;
each state designs its own ballot; vote early, by mail or on the day; fill the oval, no X or tick; 218 = House majority;
House seats by population, starts all tax bills; Senate: a third up every 2 years, approves judges and treaties; one
elector per seat in Congress (+3 for DC); Maine and Nebraska can split theirs; president: head of state and of
government, picks the Cabinet, commander in chief, Congress can override a veto with ⅔, 4-year terms, 2 terms max;
2024 map by state, popular vote 49.8% / 48.3%; Congress as elected: House 220–215, Senate 53–47 (Democrats incl. 2
independents); Trump took office 20 Jan 2025; midterms 3 Nov 2026: all 435 House seats, 35 Senate seats, "as of 23 Oct
2026 · results not in yet"; closing: in 2000 and 2016 the winner had fewer votes nationwide.

## Fact sheet (checked 23 Oct 2026)

| Fact | Source |
|---|---|
| **Who can vote (federal):** US citizens who are 18 by Election Day and meet their state's residency rules; citizens living abroad included. Rules on felony convictions etc. are set by each state. | [usa.gov: who can vote](https://www.usa.gov/who-can-vote), [EAC: Voter's Guide to Federal Elections](https://www.eac.gov/sites/default/files/event_document/files/A%20Voter's%20Guide%20to%20Federal%20Elections.pdf) |
| **Registration:** required in every state except North Dakota; deadlines differ, from Election Day (same-day registration) to 30 days before. Overseas citizens and military use the Federal Post Card Application (registration + absentee ballot). | [eac.gov: how do I register](https://www.eac.gov/how-do-i-register-to-vote), [usa.gov: who can vote](https://www.usa.gov/who-can-vote) |
| **Territories:** not represented in the Electoral College, so residents of Puerto Rico and the other territories don't vote for president (unless domiciled in a state or DC). DC has 3 electors (23rd Amendment) but no voting member of Congress. | [CRS: The Electoral College FAQ](https://www.congress.gov/crs-product/R48936), [archives.gov: Electoral College FAQ](https://www.archives.gov/electoral-college/faq) |
| **Voting isn't compulsory.** Turnout 2024: 65.3% of the citizen voting-age population (Census survey). | [census.gov: 2024 voting and registration](https://www.census.gov/newsroom/press-releases/2025/2024-presidential-election-voting-registration-tables.html) |
| **Ballot:** designed by each state/county; on paper ballots you completely fill in the oval; don't use an X or a check mark; you don't have to vote in every race. | [EAC field guide](https://www.eac.gov/sites/default/files/eac_assets/1/28/Field-Guide-Vol-01-20130620.pdf), [EAC: Effective designs](https://www.eac.gov/sites/default/files/eac_assets/1/1/EAC_Effective_Election_Design.pdf) |
| **Congress:** House + Senate; both must pass the identical bill. House: 435 members, all elected every 2 years. Senate: 100 senators, two per state, 6-year terms, a third elected every 2 years; advice and consent on appointments and treaties. Revenue bills start in the House (Constitution Art. I §7). | [usa.gov: midterm elections](https://www.usa.gov/midterm-elections), [whitehouse.gov: legislative branch](https://www.whitehouse.gov/government/legislative-branch/), [senate.gov: Constitution](https://www.senate.gov/civics/constitution_item/constitution.htm) |
| **Electoral College:** 538 electors (House seats + 2 per state, + 3 for DC); 270 to win. 48 states and DC: winner takes all; Maine (4) and Nebraska (5) give electors by congressional district plus 2 statewide. No majority → the House picks the president. | [archives.gov: what is the Electoral College](https://www.archives.gov/electoral-college/about), [archives.gov: distribution of electoral votes](https://www.archives.gov/electoral-college/allocation) |
| **President:** head of state and head of government, commander in chief; appoints the Cabinet; signs or vetoes bills; Congress overrides a veto with ⅔ of each chamber; two 4-year terms max (22nd Amendment). | [obamawhitehouse.archives.gov: executive branch](https://obamawhitehouse.archives.gov/1600/executive-branch), [archives.gov: veto lesson](https://www.archives.gov/files/legislative/resources/education/veto/) |
| **Election 5 Nov 2024:** Trump–Vance 312 electoral votes, Harris–Walz 226. Popular vote: Trump 77,302,580 (49.80%), Harris 75,017,613 (48.32%). Maine and Nebraska both split. Electors voted 17 Dec 2024; Congress counted 6 Jan 2025; inauguration 20 Jan 2025. The state-by-state winners on the map add up to 312/226 (checked in code: `EV_2024`). | [archives.gov: 2024 results](https://www.archives.gov/electoral-college/2024), [FEC: official 2024 results](https://www.fec.gov/resources/cms-content/documents/2024presgeresults.pdf), [archives.gov: key dates](https://www.archives.gov/electoral-college/key-dates) |
| **Congress 2024:** House as elected 220 R – 215 D; Senate 53 R – 45 D + 2 independents caucusing with the Democrats. | [NBC: 2024 House results](https://www.nbcnews.com/politics/2024-elections/house-results), [senate.gov: party division](https://www.senate.gov/history/partydiv.htm), [CRS: 119th Congress profile](https://www.congress.gov/crs-product/R48535) |
| **Midterms 3 Nov 2026:** all 435 House seats; 35 Senate seats (33 regular class 2 seats + special elections in Ohio and Florida for the seats JD Vance and Marco Rubio left). Louisiana House run-offs 12 Dec 2026. | [usa.gov: midterm elections](https://www.usa.gov/midterm-elections), [senate.gov daily press: Senate facts](https://www.dailypress.senate.gov/on-the-floor/senate-facts/); cross-check: [270towin](https://270towin.com/2026-senate-election/preliminary-2026-senate-outlook) |
| **2000 and 2016:** the winner of the Electoral College had fewer popular votes (Bush vs Gore, Trump vs Clinton); also 1876 and 1888 (and 1824, decided by the House). | [archives.gov: Electoral College FAQ](https://www.archives.gov/electoral-college/faq), [CRS RL32611](https://www.congress.gov/crs-product/RL32611) |

**Will go stale:** the midterms line and card ("On November 3rd …", "AS OF 23 OCT 2026 · RESULTS NOT IN YET") stop being
current once the 3 Nov 2026 votes are counted. Then change `MIDTERMS` in `src/scenes/us-election/constants.ts` (and the
`now` sentence if wanted) and re-render. Who holds office (Trump, Congress majorities) is as of 23 Oct 2026.

**Research note:** official sites are blocked for direct fetching in Claude cloud sessions; facts were gathered with web
searches limited to official domains (usa.gov, eac.gov, vote.gov, archives.gov, fec.gov, census.gov, senate.gov,
house.gov, congress.gov), cross-checked with a second source where possible.

## Pronunciation
No `pronounce` entries needed. Numbers are spelled out under `say` ("US" → "U S", "538" → "five hundred and thirty-eight", …).
