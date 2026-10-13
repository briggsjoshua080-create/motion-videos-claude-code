# Remotion motion-graphics project (instructions for AI agents)

Stack: **Remotion 4.0.535** (all `@remotion/*` packages pinned to the same exact
version — never mix versions), React 19, TypeScript, npm. Default format
**1920×1080 @ 30 fps**.

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

## Voice-over and subtitles (default for every video)
Every video gets an **AI voice-over** and **subtitles burned into the video**, unless the user says
otherwise.
- Write the narration script first and put it in the plan the user approves. The voice-over sets
  the pace: scene lengths follow the narration.
- Subtitles show the narration word for word, in sync with the voice: large, bold, high-contrast,
  a few words at a time. On vertical videos keep them out of the bottom ~20% and the right edge,
  where the TikTok/Reels/Shorts buttons and captions sit.

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
                        Subtitles, FranceMap)
src/lib/animation.ts    helpers: enter() spring, ease(), fadeInOut(), float()
src/voiceover/          narration scripts (*.script.json), generated timings, timing.ts helpers
scripts/voiceover.py    AI voice-over generator (Kokoro TTS)
public/audio|images|fonts   static assets, referenced with staticFile("audio/x.mp3")
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
