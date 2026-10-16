# Remotion motion-graphics project (instructions for AI agents)

Stack: **Remotion 4.0.535** (all `@remotion/*` packages pinned to the same exact
version — never mix versions), React 19, TypeScript, npm. Default format
**1920×1080 @ 30 fps**.

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
  Head of state, with a header that shows the steps (see `GermanElection`).
- **Right after the hook, say who can vote** (in every video; it differs between countries): the
  minimum age, which citizens/residents may vote, whether citizens abroad can vote, and any
  speciality (e.g. compulsory voting, registering first, voting at 16, foreigners in local
  elections). Say it in the narration and show it as a "Who can vote?" card at the start of the
  Vote step. Research it on the official sites every time and put it in the fact sheet.
- **Show exactly how people vote:** what the ballot looks like, how it is filled in, and how votes
  turn into seats. This is the heart of the video.
- **Whenever an institution is named** (a parliament chamber, the senate, the head of state, ...),
  **say in a few words what it does**. Only naming it is not helpful.
- **Audience:** people who are generally interested and come across the video in their TikTok or
  Instagram feed. Assume no prior knowledge, use plain words and explain any term.
- **Tone:** the video itself stays neutral and factual. Only the closing question is meant to
  spark debate.

**Format and style**
- TikTok style: vertical **1080×1920 @ 30 fps** (`VERTICAL` in `src/config.ts`), with a hook in the
  first 2 seconds. Keep key content inside x 120–960 and y 170–1480 (TikTok's buttons sit on the
  right, its caption at the bottom).
- **Length:** 25–60 s, depending on how long it takes to explain the system briefly but so that
  it is understood. **Never more than 60 s** unless the user explicitly says so. Generate the
  voice-over first and measure it. If it runs too long, propose cuts to the user (with measured
  lengths) before building.
- **Language:** always English (voice, subtitles, on-screen text).
- **Look (standard for every video):** like the `GermanElection` video, in the country's colours:
  - a **white background** (faint dot grid, soft colour glows, the flag as a thin bar on the top edge);
  - a **header** with the video title and numbered step pills (e.g. Vote · Parliament · Government ·
    King) that tick off as the story moves on;
  - white cards with soft shadows, a **ballot card** that shows how to vote, and **one parliament
    half-circle** (hemicycle) that carries through the steps (it fills up for majorities);
  - **flat cartoon characters** instead of plain silhouettes (no real likenesses): royals wear a
    crown or tiara and royal clothes, politicians wear suits, candidates wear a rosette;
  - dark text on light backgrounds; one national colour as the accent.
  - Build it from the reusable parts in `src/components/explainer/` (take one `ExplainerPalette` per
    country): `Paper`, `StepHeader`, `NameCard`, `Character` (king/queen with crown and
    robe, princess with tiara, politician, candidate), icons (ballot box, red pencil, parliament, law,
    budget, ...) and `motion` helpers, plus `Hemicycle`. Make the country map for the title scene with
    `scripts/country-outline.py` (it also makes multi-country maps, e.g. the EU in `src/components/europe.ts`,
    and splits a country into regions with `--cut`/`--assign`, e.g. the UK's four nations in `src/components/uk.ts`).
    Copy `DutchElection` as the starting point. For a flag that is not stripes (the EU, the UK, a Nordic cross), set `emblem` in
    the palette; for a series split into parts, mark the other part's steps `later` in `StepHeader` (see
    `EUElectionPart1`/`EUElectionPart2`, shared parts in `src/scenes/eu-election/`).
- **Colours:** the country's national colours (its flag, plus a national colour if it has one,
  e.g. Dutch orange), collected in one colour object for the video.
- **AI voice-over:** Kokoro, British male `bm_george` (`"lang": "en-gb"`, speed about 1.1–1.15),
  made with `scripts/voiceover.py` (see "Making the voice-over"). Fix names the voice gets wrong with
  `pronounce`.
- **Subtitles:** TikTok style, as in `WhyFranceVotesTwice` (the default `Subtitles` in
  `src/components/Subtitles.tsx`, used with `<Subtitles timing={timing} />`; no extra settings).
  Big, bold, **UPPERCASE** white words with a dark drop shadow, **no box behind them**, centred at
  y ≈ 1330, 1–3 words at a time. The word being spoken gets a solid **red pill** (`#ef4135`) behind
  it. Do not use the dark rounded box (`CaptionBox`) for new videos; existing videos keep theirs.
- **Audio:** soft background music under the voice (`npm run music`), plus light, subtle sound
  effects (`public/audio/sfx/`). Master to −14 LUFS with `npm run render:final`.
- **Ending:** a closing question, spoken and shown big on screen, that is polarising and invites
  many different answers in the comments, e.g. "Is it really democracy if you don't vote for your
  head of state?"

**Research (every time)**
- Research thoroughly before writing. Prefer official sources: the government's own sites, the
  electoral commission, parliament, the royal house or presidency.
- In Claude cloud sessions these sites are usually blocked for direct fetching (WebFetch and curl
  fail). Use `WebSearch` with `allowed_domains` set to the official domains instead, and
  cross-check numbers with a second source.
- Put the facts, dates and source links in the fact sheet in `briefs/<video>/script.md`, with the
  date they were checked. Flag facts that will go stale (e.g. who is in office).

**Process**
- **Ask the user whenever anything is unclear.** The user wants questions, not guesses. Use
  `AskUserQuestion` with plain-language options.
- Everything above is already decided, so don't ask about it again. Do show the exact narration
  and get it approved before building (see "Ask the user first").
- Use the project skills and pipeline in "Motion videos" below.
- After rendering, send the MP4 in the chat, then **commit and push straight to `main`** (the
  user's standing instruction), so new chats see the video and any rule changes.
- Reference videos: `GermanElection` (the look) and `DutchElection` (made to this brief:
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
  King who proposes the candidate and signs every law).

## Ask the user first (required before building)
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
- Write the narration script first and put it in the plan the user approves. The voice-over sets
  the pace: scene lengths follow the narration.
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
`/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell`.

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
                        uk.ts, italy.ts, austria.ts, poland.ts, denmark.ts, spain.ts)
src/components/explainer/  the standard white explainer look: palette, Paper, StepHeader,
                        NameCard, Character, icons, motion
src/lib/animation.ts    helpers: enter() spring, ease(), fadeInOut(), float()
src/voiceover/          narration scripts (*.script.json), generated timings, timing.ts helpers
scripts/voiceover.py    AI voice-over generator (Kokoro TTS)
scripts/music.py        soft background music from a voice-over timing file
scripts/sfx.py          shared sound effects (public/audio/sfx/)
scripts/render.sh       render any composition + master the audio to -14 LUFS
scripts/country-outline.py  country outline (SVG path) from Natural Earth for title maps
briefs/<video>/         script.md (narration + fact sheet + sources), storyboard.md, PROGRESS.md
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
2. Write `briefs/<video>/script.md`. Get the user's approval before building.
3. Write `briefs/<video>/storyboard.md` with scene timings.
4. Voice and timing: write `src/voiceover/<name>.script.json`, then `npm run voiceover -- src/voiceover/<name>.script.json` (setup once: `npm run voice:setup`). Check the measured length against the length limit before building.
5. Music: `npm run music -- src/voiceover/<name>.timing.json`. Sound effects are shared in `public/audio/sfx/`.
6. Build the composition (scenes start at their sentence, `<Subtitles timing={...} />`, music under the voice), then run `npm run typecheck`.
7. QA: render stills with `npx remotion still src/index.ts <Id> out/stills/f060.png --frame=60 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`. Check scene starts, scene ends, transitions, and that frame 0 is not empty.
8. Render: `npm run render:final -- <Id> <output-name> --browser-executable=<same path>`. Check with ffprobe (size, fps, duration) and loudness (−14 LUFS).
9. Send the MP4 with `SendUserFile` (`display: "render"`), update `PROGRESS.md`, then commit and push to `main`.

For a new video, copy the newest similar video (e.g. `DutchElection.tsx` + `src/scenes/dutch-election/`) and change the scenes, colours, composition id and file names.
