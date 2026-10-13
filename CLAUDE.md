# Remotion motion-graphics project (instructions for AI agents)

Stack: **Remotion 4.0.535** (all `@remotion/*` packages pinned to the same exact
version — never mix versions), React 19, TypeScript, npm. Default format
**1920×1080 @ 30 fps**.

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

If Chrome cannot be auto-downloaded (offline/sandbox), add
`--browser-executable=/path/to/chrome-or-headless_shell` to any command.

## Layout
```
src/index.ts            registerRoot — do not rename
src/Root.tsx            ALL <Composition>s are registered here
src/config.ts           VIDEO {width,height,fps}, sec(), SAMPLE timings  ← change format/duration here
src/theme.ts            colours + font (Inter bundled locally)
src/compositions/       one file per video (timeline of scenes)
src/scenes/             one file per scene (a full-frame chunk of a video)
src/components/         reusable building blocks (AnimatedText, Backdrop, ShapeCard, GradientText)
src/lib/animation.ts    helpers: enter() spring, ease(), fadeInOut(), float()
public/audio|images|fonts   static assets, referenced with staticFile("audio/x.mp3")
out/                    render output (git-ignored)
```

## Creating a new video
1. Create `src/compositions/MyVideo.tsx` exporting the component, a props type and `defaultProps`.
2. Build it from scenes in `src/scenes/` joined with `<TransitionSeries>` (or `<Series>`).
3. Register in `src/Root.tsx`: `<Composition id="MyVideo" component={MyVideo}
   durationInFrames={...} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height}
   defaultProps={...} />`.
4. Preview with `npm run studio`, then `npx remotion render src/index.ts MyVideo out/my-video.mp4`.

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
- Do **not** use `edge-tts`; its service is blocked in this environment. Use the offline Kokoro pipeline in `scripts/german-election/` as the template.
- The narration is the source of truth. Every animation, subtitle and sound-effect cue comes from `timeline.json` through `cue()` (see `src/compositions/german-election/constants.ts`). Never hard-code narration frame numbers.
- Colours only via the `COLORS` object. Use generic characters, not real people's likenesses, unless the user asks otherwise.
- All motion comes from `useCurrentFrame()`. No CSS transitions or animations.

### Steps, in order
1. Check the answers in `briefs/motion-video-brief.xlsx` (sheet "Blank Brief"). Ask the user for anything missing.
2. Write `briefs/<video>/script.md`. Get the user's approval before building.
3. Write `briefs/<video>/storyboard.md` with scene timings.
4. Voice and timeline: `python3 -I scripts/<video>/build_voice.py --model-dir <dir with kokoro-v1.0.onnx and voices-v1.0.bin>`.
5. Music and sound effects: `python3 -I scripts/<video>/build_music_sfx.py`.
6. Build the composition, then run `npm run typecheck`.
7. QA: render stills with `npx remotion still src/index.ts <Id> out/stills/f060.png --frame=60 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`. Check scene starts, scene ends, transitions, and that frame 0 is not empty.
8. Render: `bash scripts/<video>/render.sh --browser-executable=<same path>`. Check with ffprobe (size, fps, duration) and loudness (−14 LUFS).
9. Send the MP4 with `SendUserFile` (`display: "render"`), update `PROGRESS.md`, then commit and push to the working branch.

The `scripts/german-election/` files are templates for one video. For a new video, copy the folder and change the scene data, composition id and file names.
