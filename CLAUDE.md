# Remotion motion-graphics project (instructions for AI agents)

Stack: **Remotion 4.0.535** (all `@remotion/*` packages pinned to the same exact
version — never mix versions), React 19, TypeScript, npm. Default format
**1920×1080 @ 30 fps**.

## TikTok Retention Rules
The user's rules (3 Nov 2026) for **every short-form video** (target **45–60 s, 9:16**) that is planned, scripted or
built in this project. Where they conflict with the standing brief below, these rules win. `UkrainianElection`
(`briefs/ukrainian-election-system/`) is the first video made to them and the template for new ones.

1. **HOOK (0–3 s):** the first frame must show one huge, high-contrast line (max 8 words) with a bold, surprising or
   contrarian claim, a specific question, or the result first. No title cards, no topic labels like "How X works", no
   intro, no logo. It must work on mute. Never put the key hook in small text.
2. **OPEN LOOPS:** in the first 5 s, raise at least 2–3 curiosity gaps (what, why, what happens next). Answer the first
   only partly at about 10–15 s and pay off the others later. Every loop must be closed by the end with a real answer.
3. **EARLY PAYOFF:** deliver the first surprising insight by 12–15 s. Put the strongest or most surprising fact in the
   first 5 s, never only at the end. Simple, well-known background must be at most 8 s total.
4. **PACING:** something must visibly change every 3–5 s (cut, zoom, background switch, number counter, map build,
   text change). No static block over 5 s. Rotate the change types. Remove pauses over 0.5 s.
5. **RE-HOOKS:** add a new tease at about 15 s and 30 s ("But here's the weird part", "Now it gets strange") so viewers
   have a reason to stay for the next section.
6. **TEXT:** keyword captions, large, with at least 2 s on screen. Minimum font size readable on a phone: nothing
   smaller than about 6% of screen height. Remove tiny grey subtext or enlarge it. Max one key idea per screen.
7. **DENSITY:** max one number or concept per beat. Do not show complex charts or detailed numbers (like exact seat
   counts) unless the number is the point.
8. **ENDING:** close all loops, hold the last frame 1–2 s, and make the ending flow back into the first frame (e.g.
   the final question becomes the opening line) so the video loops and gets rewatched.
9. **ENGAGEMENT:** end with ONE easy opinion question answerable in one word (like YES/NO) to drive comments, plus ONE
   share or save reason ("Send this to someone who...", "Save this for election day", "Part 2: ..."). Also write a
   pinned-comment text that adds a take of its own and invites debate.
10. **REWATCH:** hide at least one small detail or fact that is only explained at the end, so viewers rewatch.
11. **OUTPUT:** with every video, also deliver 3 alternative hook lines to A/B test, a caption with 3–5 hashtags, and
    the pinned comment text.

**Do not write word-for-word scripts unless the user asks.** Plan with a beat-by-beat timeline (second ranges, what is
on screen, which technique is used, which loop is open or closed). The narration lines only live in
`src/voiceover/<name>.script.json`, because the voice tool needs them.

**How to apply them here**
- **Before building:** write the retention plan in `briefs/<video>/retention-plan.md` (the beat table above plus a
  check against each rule, with second marks) and show it in the chat. Under the "no questions" rule, carry on
  building straight away; re-time the table once the voice-over is measured.
- **After building:** score the video **out of 10 per rule** in the same file (honestly, from stills and the timing),
  fix anything **below 7**, render again and re-score.
- **Deliverables** (in `briefs/<video>/posting.md` and in the chat, next to the MP4): 3 A/B hook lines, the caption
  with 3–5 hashtags, the pinned comment.
- **Sizes on 1080×1920** (rule 6): nothing under **110 px** (≈ 6% of 1920; `MIN_TEXT` in
  `src/scenes/ukrainian-election/constants.ts`). Keyword captions 115–340 px; an Archivo Black line holds about 9
  letters at 130 px and 6 at 175 px inside x 120–960 (check widths before building, e.g. with fontTools on the
  `@fontsource` files); italic serif lines at 118–125 px; subtitles at `fontSize={110} maxChars={12} activeScale={1}`
  (110 px is the largest size at which "GOVERNMENT" still fits the safe width, and 12 characters keep every page to
  two lines). The broadcast frame keeps its corner marks, ruler and beat dots but **no small text** (no mono label,
  timecode or section label); the section number is a huge outlined numeral behind the content. Props such as
  ballots draw their small print as grey bars, not text.
- **Subtitles on light backgrounds:** pass `styleAt` to `Subtitles` so the words turn dark (dark pill, light text)
  while a paper scene or a colour flash is on screen (see `subtitleStyle` in `UkrainianElection.tsx`).
- **Hook frame:** frame 0 already shows the complete hook line (nothing fades in from empty); no subtitles under it.
  No "HOW <COUNTRY> VOTES." title any more.
- **Re-hooks:** the line sits on a full-screen flash in the flag's second colour, so the pattern break is visible.
- **Timing:** `pauseAfter` about 0.2 s (never over 0.5 s), `leadIn` about 0.1 s; hold the last frame 1–2 s; the last
  frame mirrors frame 0 (same background, same text block position), so the loop back to the hook is seamless.

## Comedy explainers (on request, since 4 Nov 2026)
When the prompt asks for a **funny, comedic or entertaining** video, follow
[`briefs/comedy-explainer-formula.md`](briefs/comedy-explainer-formula.md) on top of the Retention Rules (and of the
standing brief, if it applies). It is the user's reusable "general script": the research behind it, seven house rules,
a toolbox of comic devices, a fill-in beat template (0–60 s) and six comedy checks. `USMidterms` is the worked example.
The short version:
- **The punchline is the fact** (delete test: a joke that carries no information gets cut). Never a joke inside the
  hardest explanation (the ballot, the seat maths); put the button right after it.
- **One comic premise** for the whole video, set by 10 s and called back at the end (midterms → the president's exam).
- **Punch at the system, never at people** (both-sides test), so the video stays neutral; exaggerate only what is
  literally true, and keep the exact numbers in the fact sheet.
- **Straight setup, twist on the cut**, with a visual gag (stamp, sign, prop) and a sound effect; the narrator stays
  deadpan. About one laugh every 5–8 s.
- **Plant, repeat, pay off:** the rewatch detail (rule 10) doubles as the comic plant (a horse sticker in frame 0,
  explained at the end).
- **One sincere "why it matters" line.**
- Score **C1–C6** (the comedy checks) out of 10 next to the eleven rules in `retention-plan.md`; fix anything below 7.

## Standing brief: "educational motion graphics video, political system"
When the user's prompt contains **"educational motion graphics video, political system"**, this
section is the brief. The user does not want to repeat it, so apply every point below unless the
prompt says otherwise.

**What the video shows**
- How the people who govern the country get into power: mainly the national election system
  (e.g. Germany's Bundestag, the UK's House of Commons) and how the government and its leader come
  out of it (chancellor, prime minister, coalition talks).
- Any other top office and how it is filled, elected or not: a monarch (e.g. the King in the UK or
  the Netherlands), a president (e.g. Germany's Bundespräsident). Also any speciality of the
  system: several voting rounds or a run-off, a chamber the people don't elect directly, thresholds,
  coalition building, and so on.
- The **most recent national election** as the worked example (date, result, who formed the
  government).
- **Tell one clear, step-by-step story**, not a list of facts: e.g. Vote → Parliament → Government →
  Head of state, shown as numbered sections (see `UkrainianElection`), wrapped in the open loops and
  re-hooks of the TikTok Retention Rules.
- **Say who can vote** (in every video; it differs between countries) **at the start of the Vote step**,
  after the hook, the open loops and the first payoff: the minimum age, which citizens/residents may vote,
  whether citizens abroad can vote, and any speciality (e.g. compulsory voting, registering first,
  voting at 16, foreigners in local elections). Say it in the narration and show it as a "Who can vote?"
  card. Keep it to about 3 s: it counts toward the ≤ 8 s of simple background (Retention Rule 3), so pick
  the one or two points that matter most and put the rest in the fact sheet. Research it on the official
  sites every time.
- **Show exactly how people vote:** what the ballot looks like, how it is filled in, and how votes
  turn into seats. This is the heart of the video.
- **Whenever an institution is named** (a parliament chamber, the senate, the head of state, ...),
  **say in a few words what it does**. Only naming it is not helpful.
- **Audience:** people who are generally interested and come across the video in their TikTok or
  Instagram feed. Assume no prior knowledge, use plain words and explain any term.
- **Tone:** the video itself stays neutral and factual. Only the closing question is meant to
  spark debate.

**Format and style**
- TikTok style: vertical **1080×1920 @ 30 fps** (`VERTICAL` in `src/config.ts`), with the hook line
  complete on frame 0 (Retention Rule 1). Keep key content inside x 120–960 and y 170–1480 (TikTok's
  buttons sit on the right, its caption at the bottom).
- **Length:** **45–60 s** (Retention Rules). **Never more than 60 s** unless the user explicitly says
  so. Generate the voice-over first and measure it; if it runs too long, trim it yourself (see "No
  questions") and note the measured lengths in the brief.
- **Language:** always English (voice, subtitles, on-screen text).
- **Look (standard for every video, since 3 Nov 2026): the `UkrainianElection` look**, which is the
  `SwedishElection` look (the user's Belgian reference style) adapted to the TikTok Retention Rules, themed in
  **the country's flag colours**. Use it for every new video unless the user asks for another style, and
  **copy `UkrainianElection.tsx` + `src/scenes/ukrainian-election/` as the starting point** (each video keeps its
  own copy of `ui.tsx`/`constants.ts`). Earlier videos in the Swedish look (`SwedishElection`, `USElection`,
  `CanadianElection`, `SerbianElection`, `SlovenianElection`, `MexicanElection`, `BrazilianElection`,
  `ArgentineElection`, `RussianElection`) predate the rules: they have a title card and small labels, so don't copy those parts.
  - a **dark-ish background in a strong flag colour** (deeper at the edges, soft glows, film grain), white
    text, a second flag colour for accents; light **"paper" scenes** for the ballots; a **full-screen flash in
    the second flag colour** for each re-hook;
  - a **broadcast frame** (`Hud`): corner marks, a progress ruler with a tick per section and beat dots at the
    bottom, **no small text** (the old mono label, timecode and section label are gone, per rule 6);
  - **numbered sections** shown as a huge outlined numeral behind the content, huge heavy uppercase keyword
    captions (Archivo Black, 115–340 px) with one italic serif line (Instrument Serif, ≥ 110 px), stamps, number
    counters, a **dot hemicycle** (empty seats as hollow rings), a ballot close-up, colour sweeps; **no title card**:
    frame 0 is the hook line; the last frame mirrors it;
  - fonts bundled in `src/scenes/swedish-election/fonts.ts` (Archivo Black, Instrument Serif, JetBrains Mono);
    reusable parts in `src/scenes/ukrainian-election/ui.tsx`.
  - Subtitle pill: the standard red pill if red is in the flag and reads on the background; otherwise pick a flag
    colour yourself (no questions) (`<Subtitles highlight=... activeColor=... />`; Sweden and Ukraine: yellow with
    dark blue text, Canada: white with red text).
- **Older look (only on request):** the white `GermanElection`/`DutchElection` explainer look: white
  background with a dot grid, a header with numbered step pills, white cards, flat cartoon characters
  (`Character`), one hemicycle, built from `src/components/explainer/` (`Paper`, `StepHeader`, `NameCard`,
  icons, `motion`) with one `ExplainerPalette` per country. Country maps for any title scene come from
  `scripts/country-outline.py` (multi-country maps, e.g. the EU in `src/components/europe.ts`; regions with
  `--cut`/`--assign`, e.g. `src/components/uk.ts`). For a series split into parts, see
  `EUElectionPart1`/`EUElectionPart2`.
- **Colours:** the country's national colours (its flag, plus a national colour if it has one,
  e.g. Dutch orange), collected in one colour object for the video.
- **AI voice-over:** Kokoro, British male `bm_george` (`"lang": "en-gb"`, speed about 1.15–1.2),
  made with `scripts/voiceover.py` (see "Making the voice-over"). Fix names the voice gets wrong with
  `pronounce`.
- **Subtitles:** TikTok style, as in `WhyFranceVotesTwice` (the `Subtitles` in
  `src/components/Subtitles.tsx`), now at **`fontSize={110}`** (Retention Rule 6; see `UkrainianElection.tsx`
  for the exact props). Big, bold, **UPPERCASE** white words with a dark drop shadow, **no box behind them**,
  centred at y ≈ 1330, 1–3 words at a time. The word being spoken gets a solid **red pill** (`#ef4135`) behind
  it. Keep visuals above y ≈ 1180 so the subtitles never cover them; hide subtitles for lines already big on
  screen (the hook, the question). Do not use the dark rounded box (`CaptionBox`) for new videos; existing
  videos keep theirs.
- **Audio:** soft background music under the voice (`npm run music`), plus light, subtle sound
  effects (`public/audio/sfx/`). Master to −14 LUFS with `npm run render:final`.
- **Ending (Retention Rules 8–9):** one save/share line ("Save this for election day"), then one easy,
  polarising **YES/NO question**, spoken and shown big on a last frame that mirrors frame 0, held 1–2 s, e.g.
  "Should Ukraine vote before the war ends?". Every open loop is closed before it; the hidden detail (rule 10)
  is explained just before it.

**Research (every time)**
- Research thoroughly before writing. Prefer official sources: the government's own sites, the
  electoral commission, parliament, the royal house or presidency.
- In Claude cloud sessions these sites are usually blocked for direct fetching (WebFetch and curl
  fail). Use `WebSearch` with `allowed_domains` set to the official domains instead, and
  cross-check numbers with a second source.
- Put the facts, dates and source links in the fact sheet in `briefs/<video>/script.md`, with the
  date they were checked. Flag facts that will go stale (e.g. who is in office).

**Process**
- **No questions (the user's standing instruction since 28 Oct 2026):** make every video entirely on your
  own, based on this brief and the decisions recorded here. Do not ask questions, do not wait for the
  narration to be approved, and do not stop to propose cuts: research, write, measure, trim to ≤ 60 s,
  build, render, send and push in one go. Record the choices you made in `briefs/<video>/script.md`
  (as in `NorwegianElection`, `SerbianElection`, `SlovenianElection`). This overrides "Ask the user
  first" below and the "ask" points in this brief, unless the user asks for questions again.
- **TikTok Retention Rules (since 3 Nov 2026):** before building, write the retention plan
  (`briefs/<video>/retention-plan.md`, beat by beat with second marks, checked against each rule) and show it
  in the chat; after the render, score each rule out of 10, fix anything below 7, and deliver the 3 A/B hooks,
  the caption and the pinned comment (`briefs/<video>/posting.md`). See "TikTok Retention Rules" above.
- Use the project skills and pipeline in "Motion videos" below.
- After rendering, send the MP4 in the chat, then **commit and push straight to `main`** (the
  user's standing instruction), so new chats see the video and any rule changes.
- Reference videos: `UkrainianElection` (the current standard: the Retention Rules in the default look, see the
  end of this list), `SwedishElection` (where the look comes from), `GermanElection` (the older white look) and `DutchElection` (made to this brief:
  `src/compositions/DutchElection.tsx`, `briefs/dutch-election-system/`). A two-part series made to this brief:
  `EUElectionPart1` + `EUElectionPart2` (`briefs/eu-election-system/`). Also made to this brief: `UKElection`
  (`briefs/uk-election-system/`; first past the post, a 650-dot constituency map, devolved parliaments),
  `ItalianElection` ("Who runs Italy?", `briefs/italian-election-system/`; a mixed system with one cross for party and
  local candidate, two equal houses, a new government without an election, a President elected by parliament),
  `AustrianElection` ("Who runs Austria?", `briefs/austrian-election-system/`; proportional seats with preference
  votes and a 4% threshold, a second chamber sent by the states, 155 days of coalition talks, a directly elected
  President with a run-off) and `PolishElection` ("Who runs Poland?", `briefs/polish-election-system/`; one cross for
  a candidate on a party list, 5%/8% thresholds, a Senate of 100 district winners, the first party losing power to a
  Sejm majority, a directly elected President with a run-off and a veto that takes three fifths to override), and `DanishElection` ("Who runs Denmark?", `briefs/danish-election-system/`; one cross for a party or a
  candidate, a 2% threshold with 40 top-up seats, one chamber, three King's rounds and a minority government that rules
  because no majority votes against it, a King who signs every law but can't block one), and `SpanishElection` ("Who runs Spain?", `briefs/spanish-election-system/`; two ballots: a closed party list
  for Congress and up to three people for the Senate, a 3% threshold per province, the first party losing the investiture vote, a
  King who proposes the candidate and signs every law), and `PortugueseElection` ("Who runs Portugal?",
  `briefs/portuguese-election-system/`; one cross for a party on a ballot with no names, 22 districts with no threshold,
  one chamber, a minority government that needs no vote to take office, a directly elected President who can veto laws
  and dissolve parliament). `SwedishElection` ("How Sweden votes.", `briefs/swedish-election-system/`; one paper per
  party, colour-coded by election, with an optional cross for one candidate, a 4% threshold with 39 top-up seats, a prime
  minister who only needs fewer than 175 "no" votes, a King with no political power, 2022 as the worked example plus a
  dated 2026 note) follows the brief's content but, at the user's request, the look of their Belgian reference video
  (see "Reference videos in another style"). `USElection` ("How the US votes.", `briefs/us-election-system/`) redoes
  the Swedish look in US colours (navy background, red accents, standard red subtitle pill): who can vote and
  registration, one paper ballot with every race (fill the oval), Congress as two half-circles (House 435, Senate 100),
  the Electoral College on a tile map of the 50 states + DC (`src/scenes/us-election/TileMap.tsx`, with 2024 winners
  and electoral votes in `constants.ts`), the president, 2024 as the worked example plus a dated 2026 midterms note. `CanadianElection` ("How Canada votes.",
  `briefs/canadian-election-system/`) redoes the Swedish look in Canadian red (deep red background, accent words in white
  blocks with red letters, a **white subtitle pill with red text**): who can vote, a one-riding ballot (mark one circle),
  first past the post, the House of Commons (343) and the PM (172), an appointed Senate, the King and Governor General,
  2025 as the worked example plus the 2026 floor-crossing majority.
  `RomanianElection` ("How Romania votes.", `briefs/romanian-election-system/`) is the first video made with the Swedish
  look as the default, in Romanian blue (yellow accents, standard red subtitle pill): the cancelled 2024 presidential
  election as the hook, two ballot booklets and the round VOTAT stamp, the 5% line, two chambers (331 + 134), a PM who
  needs 233 votes in a joint sitting, a directly elected President, the 2024 result plus the 2026 change of PM.
  `NorwegianElection` ("How Norway votes.", `briefs/norwegian-election-system/`) was made with no questions asked (the
  user's wish): the Swedish look in Norwegian red with navy-and-white accents (accent words in navy blocks with a white
  rim, like the flag's cross; a **navy subtitle pill with white text**, since red doesn't read on the red background);
  a controversial hook (a vote in Finnmark weighs 1.9× one in Oslo, because seats follow area too), one paper per party
  (fold, stamp, box; closed lists since 2025), 4% top-up seats, one chamber (169), a PM who needs no vote, King Haakon
  VIII (since 28 Aug 2026), the 2025 result, and an equally controversial ending (the Storting can never be dissolved).
  `SerbianElection` ("How Serbia votes.", `briefs/serbian-election-system/`) was also made with no questions asked: the
  Swedish look in Serbian blue with red accents (accent words in red blocks, the standard red subtitle pill, the
  tricolour as the title bar); the President who quit to run for PM and lost as the hook, one ballot (circle one
  number) plus invisible UV ink on the finger, one nationwide district with a 3% line (minority lists exempt), the
  National Assembly (250), a PM who needs 126, a directly elected President with a run-off who can return but not block
  laws, the 25 Oct 2026 snap election (preliminary RIK count, made two days later) and "Can a movement with no clear
  leader run a country?" as the ending.
  `SlovenianElection` ("How Slovenia votes.", `briefs/slovenian-election-system/`) was the first video made under the
  standing "no questions" rule: the Swedish look in Slovenian blue with red accents and a simplified coat of arms
  (`Triglav` in `src/scenes/slovenian-election/ui.tsx`), the standard red subtitle pill; the biggest party ending up in
  opposition as the hook, a second vote for Italian and Hungarian community voters, one name per party on the district
  ballot (circle one number, it counts for the party), the 4% line (88 seats + 2 minority seats), the National Assembly
  (90) and the weak National Council, a PM who needs 46, a directly elected President with no veto, the 22 Mar 2026
  result and Janša's coalition, and "Is it fair that some citizens get two votes?" as the ending.
  `MexicanElection` ("How Mexico votes.", `briefs/mexican-election-system/`) was also made with no questions asked: the
  Swedish look in Mexican green with red accents and a simplified coat of arms (`Emblem` in
  `src/scenes/mexican-election/ui.tsx`), the standard red subtitle pill; the one six-year presidential term as the hook,
  a photo voter card and online voting from abroad, one ballot per race (mark a party logo, or two in one alliance),
  300 district + 200 list deputies with a 3% line and an 8-point cap, the Chamber (500) and Senate (128), a president
  with no PM and no run-off, elected judges since 2025, the 2024 result (Sheinbaum; the alliance's 54.7% of the votes
  but 364 of 500 seats), and "Should 54% of the votes win 73% of the seats?" as the ending.
  `BrazilianElection` ("How Brazil votes.", `briefs/brazilian-election-system/`) was also made with no questions asked:
  the Swedish look in Brazilian green with yellow-and-blue accents (accent words in yellow blocks with blue letters, a
  simplified flag as `Emblem` in `src/scenes/brazilian-election/ui.tsx`) and, since red is not in the flag, a **yellow
  subtitle pill with blue text**; compulsory voting (an unpaid fine blocks your passport) as the hook, voting optional at
  16–17/70+/illiterate and president-only abroad, a generic electronic voting machine (type the number, check the photo,
  press green, six votes), open lists where a star candidate pulls others in, the Chamber (513) and Senate (3 per state),
  a two-round presidency, the 2026 result (Lula's run-off comeback, Bolsonaro's PL the biggest party in both houses),
  and "Should anyone be forced to vote?" as the ending.
  `ArgentineElection` ("How Argentina votes.", `briefs/argentine-election-system/`) was also made with no questions
  asked: the Swedish look in a deep celeste with white accent blocks (deep-blue letters, gold rim), a turning Sun of May
  (`Emblem` in `src/scenes/argentine-election/ui.tsx`) and, since red is not in the flag, a **gold subtitle pill with navy
  text**; "40% of the vote can make you president" as the hook, voting from 16 (a must 18–70), the single paper ballot
  (one box per row, since 2025), D'Hondt by province above 3% with half the Chamber every two years, the Chamber (257) and
  a Senate with 2 seats for the winner and 1 for the runner-up, the 45% / 40%+10 rule, Milei's 2023 win and the 2025
  midterms (biggest bloc, no majority), and "Should 16-year-olds help choose who runs a country?" as the ending.
  `RussianElection` ("How Russia votes.", `briefs/russian-election-system/`) was also made with no questions asked: the
  Swedish look in deep Russian blue with red accent blocks (white letters, white rim), white-blue-red wipe bands, the
  tricolour as the title bar (no coat of arms) and the standard red subtitle pill; "Russia's president can legally rule
  until 2036" (a 1999–2036 timeline) as the hook, voting from 18 (not prisoners, optional, abroad at embassies), two
  ballots (party list + district candidate), 225 list seats above 5% + 225 district winners, the State Duma (450) and the
  unelected Federation Council, a president with a run-off who picks the PM and whose terms were reset in 2020, the 2024
  result (Putin 87%) and the 2026 Duma election (United Russia 349 of 450, Yabloko barred; criticism attributed), and
  "Can an election be fair if you already know who'll win?" as the ending.
  `UkrainianElection` ("Elections are banned in Ukraine.", `briefs/ukrainian-election-system/`) is **the current
  standard**: the first video made to the TikTok Retention Rules, with no questions asked. The look is the Swedish look
  in deep Ukrainian blue with yellow accents (accent words in yellow blocks with dark blue letters, a **yellow subtitle
  pill with dark blue text** at 110 px), yellow full-screen flashes for the two re-hooks, and no title card. The story:
  the hook line on frame 0, three open loops (why / who rules / what's next), martial law banning every vote, who can
  vote, the presidential ballot (tick one name, a run-off), the 2019 result (Zelensky's 73%, his party named after his
  TV show winning parliament alone), the Rada and the July 2026 change of PM, the never-used Rada ballot (tick a party,
  write in a candidate's number, 5% line), 26 grey seats as the rewatch detail (districts under occupation in 2019),
  and "Should Ukraine vote before the war ends?" on a last frame that mirrors the first. Its `retention-plan.md` and
  `posting.md` are the examples for the new planning files.
  `RussianElection2036` ("Putin can legally rule until 2036.", `briefs/russian-election-2036/`) is the second Russia
  video, the first remake of an older video in the standard look, with no questions asked: deep Russian blue with red
  accent blocks (white letters, white rim), red full-screen flashes for the re-hooks, the standard red subtitle pill
  (white pill with red text on the flashes); a 2000–2036 timeline on frame 0 whose hollow 2008–12 stretch is the rewatch
  detail (the old two-in-a-row limit, so he was PM), the 2020 reset (4 terms → 0), two Duma ballots, half the seats by
  party above 5% and half district winners, an unelected upper house, a PM the Duma just approves, the 2024 (87%) and
  2026 (349 of 450, a liberal rival barred) results, and "Can a vote be fair if you know who wins?" as the ending.
  `USMidterms` ("The president just failed his midterm.", `briefs/us-midterm-elections/`) is the first **comedy
  explainer** (see "Comedy explainers"), made the day after the 3 Nov 2026 vote with no questions asked: the standard
  look in Old Glory blue with red accent blocks (white letters, white rim), red re-hook flashes and the standard red
  subtitle pill (white pill with red text on the flashes, dark words on paper). The premise: the midterm is the
  president's mid-term exam, graded by voters electing Congress. A report card with a red F on frame 0 (its gold horse
  sticker is the rewatch detail), a wall of 21 report cards (only two passed since 1946), "the whole House reapplies for
  its job" (NOW HIRING sign), 435 seats every two years and senators six, what Congress does, the graders (citizens from
  18 who registered; North Dakota skips that), "Americans even elect their sheriffs", one oval per race, most votes
  wins a district and 218 the House, the 2026 result (Democrats won both, AP projections of 4 Nov 2026) as the report
  card's callback, "Hello, gridlock", angry voters show up and happy ones stay on the couch, the horse (1845, never on
  Sundays, hence Tuesday) and "So, should America scrap midterms?" as the ending. Its props (`ReportCard`,
  `GradeStamp`, `HorseSticker`, `Horse`, `HangingSign`, `SheriffStar`, `Car`, `Couch`, …) are in
  `src/scenes/us-midterms/ui.tsx`.
  `ChineseElection` ("Xi won 2,952 votes to zero.", `briefs/chinese-election-system/`) was made "in the same style as
  the Russian one" (5 Nov 2026) with no questions asked: the `RussianElection2036` standard look in deep Chinese red
  with yellow accent blocks (red letters, white rim), yellow re-hook flashes and, since red doesn't read on the red
  background, a **yellow subtitle pill with dark red text**. A pyramid of people's congresses on frame 0 whose small
  floating star is the rewatch detail (the Communist Party above the ladder); not the public but just under 3,000
  lawmakers; a billion people voting in the 2026 local round; 18+ but only for a local congress; back, reject or write
  in a name; more names than seats; each congress elects the one above; the NPC (laws, a week a year); a president with
  one name on the ballot, the 2018 end of the term limit, the premier; Xi's 2023 third term; the party's 205 top members
  pick the real boss; and "Is one name on a ballot a real choice?" as the ending. Props (`Pyramid`, `LocalBallot`,
  `CongressSeats`, `Star`) are in `src/scenes/chinese-election/`.
  `BurnhamPM` ("Britain's new PM won under 25,000 votes.", `briefs/burnham-prime-minister/`) is the second **comedy
  explainer**, made "in the same style as US midterms" (5 Nov 2026) with no questions asked: how and why Andy Burnham
  became UK prime minister (20 July 2026). The `USMidterms` look in Union flag blue with red accent blocks, red re-hook
  flashes, the standard red subtitle pill, plus Commons green for the props. The premise is **musical chairs** (you need
  a Commons seat to be PM): a green Commons chair with a small gold crown tag (the rewatch detail) on frame 0, no vote
  for PM (650 seats, No. 10), seven PMs in ten years, the chair yanked away (a leader must be an MP), blocked from
  Gorton and Denton (lost to the Greens), May's crash and nearly 100 MPs, an MP who gave him his seat, the Makerfield
  ballot (+9,000), Starmer quits, a fifth of MPs needed vs 90% (rivals: zero), the King, everyone else votes by 2029, the
  crown tag as the Chiltern Hundreds, and "Should a new PM face voters first?" as the ending. Props (`Chair`, `Crown`,
  `Door`, `Rosette`, `BallotBox`) are in `src/scenes/burnham-pm/ui.tsx`. This brief is not a "political system" video,
  so who can vote is in the fact sheet only.
  `CeutaCrisis` ("A city of 83,000. 72,000 arrived.", `briefs/ceuta-crisis-2026/`) is the first **news-event explainer**
  (8 Nov 2026, no questions asked): the summer 2026 Ceuta crisis (29–31 July) — what happened, when, why, and whether it
  can happen again. The standard look themed **to the topic instead of a flag** ("adjust graphics to fit topic"):
  Strait-of-Gibraltar sea blue with **rescue orange** accent blocks, orange re-hook flashes and an orange subtitle pill
  with navy text, light "nautical chart" paper. A real Spain–Morocco outline map (`strait.ts`, Natural Earth), a
  schematic chart of Ceuta's border with swimmers rounding the fence's end (`maps.tsx`), and **three overlapping
  circles** (Geography / Politics / Social, `Problems.tsx`) that fill one by one and spark where they overlap, to show
  how the causes came together; a likelihood gauge (`Meter.tsx`) answers "again?". At the user's word ("doesn't matter if it's a little too long") it runs 73.7 s, with Italy's border checks and the 2021 precedent. The dotted orange line in the sea on
  frame 0 is the floating barrier (rewatch detail). Ends on "Should Spain send swimmers back at once?". Not a political
  system video, so the election parts of the standing brief don't apply.
- **Reference videos in another style:** if the user shares a video to copy, keep its layout, typography, motion and
  format details, but theme it in **the country's flag colours**. The user's Belgian reference
  (`belgian-elections-explained.mp4`: black background, yellow and red) is dark only because Belgium's flag is black;
  `SwedishElection` redoes that look in Swedish blue and yellow (blue background, yellow accents, light "paper" scenes
  for the ballot and the result, a broadcast frame with timecode and section ruler; reusable parts in
  `src/scenes/swedish-election/ui.tsx`; its fonts Archivo Black, Instrument Serif and JetBrains Mono are bundled from
  `@fontsource` in `src/scenes/swedish-election/fonts.ts`). Still ask about format, voice and length: the user chose vertical with the AI
  narrator, unlike the landscape, music-only reference. If red is not in the flag, ask whether the subtitle pill should
  use a flag colour instead (`<Subtitles highlight=... activeColor=... />`; Sweden: yellow with dark text).

## Ask the user first (required before building)
**Overridden since 28 Oct 2026:** the user wants every video made without questions (see "Process" in the
standing brief). Use this section only if the user asks to be asked again.

The user wants to decide what each video looks like before any code is written. **Before building
a new video, or making a big change to one (new scenes, new format, new style), ask the user many
questions, step by step, and wait for the answers.** Do not write code, render, commit or push
until the user has approved the plan.

1. Ask a few questions at a time (use the `AskUserQuestion` tool when available), in plain,
   non-technical language, with example answers to pick from. Use each round's answers to shape
   the next round.
2. Cover at least:
   - **Purpose & audience:** who watches it, where it will be posted (YouTube, TikTok/Reels/Shorts,
     a class or presentation), what viewers should remember.
   - **Content:** which topics, in what order, how detailed, real or made-up examples, and the facts
     or sources to use (check facts before putting them on screen).
   - **Format:** landscape 1920×1080, vertical 1080×1920 or square 1080×1080; length; language of
     the on-screen text.
   - **Style:** colours, mood (serious, playful, news-style), fonts, logos or images to include.
   - **Voice & audio:** AI voice-over and subtitles are on by default (see below). Ask which voice
     (e.g. female/male, accent), the subtitle style, and whether to add music or sound effects.
   - **Text:** the exact title, opening and ending wording, and how much text is on screen.
3. Write the plan back as a short scene-by-scene list (what each scene shows, the exact voice-over
   words and how long it lasts, plus total length, format, style and audio) and ask the user to
   approve or change it.
4. Start building only after the user approves. Small, clear requests (e.g. "make the title
   bigger") can be done straight away. If the user says to skip the questions, use sensible
   defaults and say which ones you picked.
5. If the prompt triggers the standing brief above, most of these answers are already given. Ask
   only about what is still unclear, and get the narration approved.

## Voice-over and subtitles (default for every video)
Every video gets an **AI voice-over** and **subtitles burned into the video**, unless the user says
otherwise.
- Plan the narration beat by beat in the retention plan (not as a word-for-word script, unless the
  user asks; see "TikTok Retention Rules"), then write the lines straight into the voice-over JSON.
  The voice-over sets the pace: scene lengths follow the narration. Keep pauses ≤ 0.5 s.
- Subtitles show the narration word for word, in sync with the voice, in the TikTok style above
  (`<Subtitles timing={timing} />`). Use `hide={["sentence-id"]}` for lines that are already big on
  screen. On vertical videos keep them out of the bottom ~20% and the right edge, where the
  TikTok/Reels/Shorts buttons and captions sit.

### Making the voice-over
The voice is **Kokoro** (free, open model, Apache-2.0), run locally by `scripts/voiceover.py`. Its
model files download from the kokoro-onnx GitHub release (no Hugging Face access needed) into
`.voice/` (git-ignored).
1. Setup, once per machine: `npm run voice:setup`.
2. Write `src/voiceover/<name>.script.json` (example: `why-france-votes-twice.script.json`):
   - `voice` — British male `bm_george` `bm_fable` `bm_lewis` `bm_daniel`; British female `bf_emma`
     `bf_isabella` `bf_alice` `bf_lily`; American male `am_michael` `am_fenrir` `am_puck` `am_adam`…;
     American female `af_heart` `af_bella` `af_nicole` `af_sarah`…. `lang`: `en-gb` or `en-us`.
   - `speed` (1.0 = normal), `leadIn` (silence at the start), `pauseAfter` (silence after each
     sentence; can be set per sentence to give a scene's last visual time to land).
   - `sentences`: `{ "id", "text" }` — one per idea; scenes are cued off these ids. `text` is
     exactly what the subtitles show.
   - `say`: how to read a word aloud (`"2022": "twenty twenty-two"`, `"28%": "twenty-eight percent"`).
   - `pronounce`: phonemes for names the voice gets wrong (`"Mélenchon": "mˌeɪlɒnʃˈɒn"`).
3. Generate: `npm run voiceover -- src/voiceover/<name>.script.json` → writes
   `public/voiceover/<name>.wav` and `src/voiceover/<name>.timing.json`. Commit both, so renders
   never need the voice tool.
4. In the composition (see `WhyFranceVotesTwice.tsx`): import the timing JSON,
   `<Audio src={staticFile(timing.audio)} />`, `<Subtitles timing={timing} />`, start each scene at
   `getSentence(timing, id).start`, and trigger animations on words with `cue(id, "word")` from
   `makeCue()` (`"two#2"` = second "two"). Derive the duration from the timing, never hard-code it.

Kokoro does not report word times, so the script estimates them (anchored on the real pauses).
Always check stills where a visual depends on a word; if timing is off, change `speed`/`pauseAfter`
or cue a neighbouring word.

## Commands
| Task | Command |
|---|---|
| Install | `npm install` |
| Open Studio (live preview) | `npm run studio` |
| List compositions | `npm run compositions` |
| Type-check (run before finishing) | `npm run typecheck` |
| Render sample MP4 | `npm run render` → `out/sample-showcase.mp4` |
| Render any composition | `npx remotion render src/index.ts <CompositionId> out/<name>.mp4` |
| Render one frame as PNG | `npx remotion still src/index.ts <CompositionId> out/<name>.png --frame=60` |
| Upgrade Remotion | `npx remotion upgrade` (keeps versions in sync) |
| Voice tool setup (once) | `npm run voice:setup` |
| Make a voice-over | `npm run voiceover -- src/voiceover/<name>.script.json` |
| Make background music | `npm run music -- src/voiceover/<name>.timing.json [--transpose N]` → `public/audio/<name>/music.mp3` |
| Rebuild shared sound effects | `npm run sfx` → `public/audio/sfx/*.wav` (committed; rarely needed) |
| Render + master to −14 LUFS | `npm run render:final -- <CompositionId> <output-name> [--browser-executable=...]` → `out/<output-name>.mp4` |
| Country map for a title scene | `python3 -I scripts/country-outline.py <countries-10m.json> "<Country>" src/components/<country>.ts --const <NAME>` (data: `npm pack world-atlas@2.0.2`, see the script) |

If Chrome cannot be auto-downloaded (offline/sandbox), add
`--browser-executable=/path/to/chrome-or-headless_shell` to any command. In Claude cloud sessions
the download host is blocked; use the pre-installed
`/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell` (newer images:
`/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`; check with `ls`).

## Layout
```
src/index.ts            registerRoot — do not rename
src/Root.tsx            ALL <Composition>s are registered here
src/config.ts           VIDEO {width,height,fps}, sec(), SAMPLE timings  ← change format/duration here
src/theme.ts            colours + font (Inter bundled locally)
src/compositions/       one file per video (timeline of scenes)
src/scenes/             one file per scene (a full-frame chunk of a video)
src/components/         reusable building blocks (AnimatedText, Backdrop, ShapeCard, GradientText,
                        Subtitles, Hemicycle, FranceMap), country outlines (netherlands.ts, europe.ts = EU-27,
                        uk.ts, italy.ts, austria.ts, poland.ts, denmark.ts, spain.ts, portugal.ts)
src/components/explainer/  the standard white explainer look: palette, Paper, StepHeader,
                        NameCard, Character, icons, motion
src/lib/animation.ts    helpers: enter() spring, ease(), fadeInOut(), float()
src/voiceover/          narration scripts (*.script.json), generated timings, timing.ts helpers
scripts/voiceover.py    AI voice-over generator (Kokoro TTS)
scripts/music.py        soft background music from a voice-over timing file
scripts/sfx.py          shared sound effects (public/audio/sfx/)
scripts/render.sh       render any composition + master the audio to -14 LUFS
scripts/country-outline.py  country outline (SVG path) from Natural Earth for title maps
briefs/<video>/         script.md (choices + fact sheet + sources), retention-plan.md (beat timeline, rule
                        check, scores out of 10), posting.md (A/B hooks, caption, pinned comment),
                        storyboard.md, PROGRESS.md
briefs/comedy-explainer-formula.md  the reusable comedy + information script (see "Comedy explainers")
public/audio|images|fonts   static assets, referenced with staticFile("audio/x.mp3")
public/audio/<name>/    per-video music; public/audio/sfx/ shared sound effects
public/voiceover/       generated voice-over WAVs
out/                    render output (git-ignored)
```

## Creating a new video
1. Ask the user questions and get the plan approved first (see "Ask the user first" above).
2. Create `src/compositions/MyVideo.tsx` exporting the component, a props type and `defaultProps`.
3. Build it from scenes in `src/scenes/` joined with `<TransitionSeries>` (or `<Series>`).
4. Register in `src/Root.tsx`: `<Composition id="MyVideo" component={MyVideo}
   durationInFrames={...} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height}
   defaultProps={...} />`.
5. Preview with `npm run studio`, then `npx remotion render src/index.ts MyVideo out/my-video.mp4`.

## Changing resolution / fps / duration
- Resolution & fps: edit `VIDEO` in `src/config.ts` (e.g. 1080×1920 for vertical, fps 60).
- Duration: edit seconds in `SAMPLE` (or your own constants) — always convert with `sec(seconds)`;
  never hard-code frame counts. With `TransitionSeries`, total = sum of scenes − sum of transition
  lengths (see `SAMPLE_DURATION_FRAMES`).
- Per-composition override: pass different `width`/`height`/`fps` on that `<Composition>`.
  Note `sec()` uses `VIDEO.fps`; if a composition uses a different fps, compute frames from that fps.

## Animation rules (critical)
- **Everything must be driven by `useCurrentFrame()`.** No CSS transitions/animations, no
  `setTimeout`, no `Date.now()`/`Math.random()` (use `random("seed")` from `remotion`) —
  they will not render correctly. Output must be deterministic per frame.
- `useCurrentFrame()` inside a `<Sequence>`/`TransitionSeries.Sequence` is **relative to that
  sequence** (starts at 0) — write scenes as if they start at frame 0.
- Use `spring()` (via `enter(frame, delay)`) for natural entrances, `interpolate()`/`ease()` for
  timed tweens. Always clamp (`extrapolateLeft/Right: "clamp"`) — `ease()` already does.
- Stagger with `delay + i * stagger` frames. Add ambient motion with `float()`.
- Typography: use `<AnimatedText>` for word-by-word reveals; `<GradientText>` for accents. Font is
  `theme.font`. For another Google font: `import {loadFont} from "@remotion/google-fonts/Poppins"`
  (needs network at render time) or bundle one via `@fontsource/*` like `theme.ts` does.
- Graphics: use `@remotion/shapes` (`Circle, Rect, Star, Triangle, Polygon, Pie`) wrapped in
  `<ShapeCard>`; for custom paths use inline `<svg>`.
- Transitions: `@remotion/transitions` — `fade()`, `slide()`, `wipe()`, `flip()`, `clockWipe()`
  inside `<TransitionSeries.Transition presentation={...} timing={linearTiming({durationInFrames})}/>`.
- Layout: `AbsoluteFill` + flexbox; positions are px on the 1920×1080 canvas. Keep safe margins ≥ 120px.
- Images/video: use `<Img>`, `<OffthreadVideo>` from `remotion` (not `<img>`/`<video>`).

## Audio synchronisation
- Put files in `public/audio/` and play with `<Audio src={staticFile("audio/x.mp3")} />` inside the
  composition (see `SampleShowcase.tsx`). Offset a clip with a `<Sequence from={sec(2)}>` wrapper.
- Volume can be a function of the frame: `volume={(f) => fadeInOut(f, total, sec(1))}`.
- Sync visuals to beats: frames per beat = `fps * 60 / bpm`; trigger `enter(frame, beat * k)`.
- Audio-reactive visuals: `useAudioData` / `visualizeAudio` from `@remotion/media-utils`
  (the file must be local in `public/`).
- Voice-over: derive scene/composition length from the clip with `getAudioDurationInSeconds`
  inside `calculateMetadata` on the `<Composition>` so video length follows the audio.
- Audio is included in the rendered MP4 automatically.

## Quality checklist before finishing
1. `npm run typecheck` passes.
2. `npx remotion still ...` on a few key frames (first, middle, last) and look at them.
3. Full render succeeds and `ffprobe` shows the expected size/fps/duration.
4. No text clipped at the edges; every animation settles before its scene ends.

## Delivering finished videos
- After every successful render, send the MP4 to the user in the chat (e.g. with the `SendUserFile`
  tool, `display: "render"`) — `out/` is git-ignored, so the file is otherwise unreachable from a
  cloud session. Mention the file name, resolution, fps and duration.

## Motion videos (read before making any new video)

When the user asks for a motion video, explainer or any Remotion video, use the two project skills in `.claude/skills/` and follow the layout of this repo, not the skills' default layout.

1. `educational-video-creator`: the workflow (requirements → script → storyboard → visuals → animation → audio → QA). Load it with the Skill tool.
2. `remotion-best-practices`: Remotion API rules. Start with its `SKILL.md`, then read the reference for the task (e.g. `remotion-markup/audio.md`, `transitions.md`, `multi-scene-video.md`).

### Overrides to the skills' defaults in this repo
- Do **not** create a `remotion_video/` folder or run `npx create-video`. Use `src/compositions/<Name>.tsx`, `src/scenes/<name>/`, `src/components/<name>/`, `public/audio/<name>/`, and register the composition in `src/Root.tsx`.
- Do **not** use `edge-tts`; its service is blocked in this environment. Use the offline Kokoro tool `scripts/voiceover.py` (see "Making the voice-over"). `scripts/german-election/` is an older, single-video version of the same idea.
- The narration is the source of truth. Every animation, subtitle and sound-effect cue comes from the voice-over timing file through `makeCue()` / `cue(sentence, word)` (`src/voiceover/timing.ts`; examples: `DutchElection.tsx`, `WhyFranceVotesTwice.tsx`). Never hard-code narration frame numbers.
- Colours only via the `COLORS` object. Use generic characters, not real people's likenesses, unless the user asks otherwise.
- All motion comes from `useCurrentFrame()`. No CSS transitions or animations.

### Steps, in order
1. Check the answers in `briefs/motion-video-brief.xlsx` (sheet "Blank Brief"). Ask the user for anything missing.
2. Write `briefs/<video>/script.md` (choices + fact sheet) and the retention plan
   `briefs/<video>/retention-plan.md` (see "TikTok Retention Rules"); show the plan in the chat.
3. Write `briefs/<video>/storyboard.md` with scene timings.
4. Voice and timing: write `src/voiceover/<name>.script.json`, then `npm run voiceover -- src/voiceover/<name>.script.json` (setup once: `npm run voice:setup`). Check the measured length against the length limit before building.
5. Music: `npm run music -- src/voiceover/<name>.timing.json`. Sound effects are shared in `public/audio/sfx/`.
6. Build the composition (scenes start at their sentence, `<Subtitles timing={...} />`, music under the voice), then run `npm run typecheck`.
7. QA: render stills with `npx remotion still src/index.ts <Id> out/stills/f060.png --frame=60 --browser-executable=<headless shell, see Commands>`. Check scene starts, scene ends, transitions, and that frame 0 is not empty.
8. Render: `npm run render:final -- <Id> <output-name> --browser-executable=<same path>`. Check with ffprobe (size, fps, duration) and loudness (−14 LUFS).
9. Score each Retention Rule out of 10 in `retention-plan.md`; fix anything below 7 and render again.
10. Send the MP4 with `SendUserFile` (`display: "render"`) together with the scores, the 3 A/B hooks, the caption
    and the pinned comment (`posting.md`), update `PROGRESS.md`, then commit and push to `main`.

For a new video, copy the standard video (`UkrainianElection.tsx` + `src/scenes/ukrainian-election/`) and change the scenes, colours, composition id and file names.
