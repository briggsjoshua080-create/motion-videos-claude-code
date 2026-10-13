/**
 * Single source of truth for video format and timing.
 * Change width / height / fps / durations here and every composition follows.
 */
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

/** Convert seconds to frames at the project fps. */
export const sec = (seconds: number): number => Math.round(seconds * VIDEO.fps);

/** Sample composition timing, in seconds. */
export const SAMPLE = {
  intro: 4,
  shapes: 5,
  outro: 4,
  /** Length of each cross-scene transition. Transitions overlap neighbouring scenes. */
  transition: 0.75,
} as const;

/** Total frames = sum of scenes minus the overlap taken by the 2 transitions. */
export const SAMPLE_DURATION_FRAMES =
  sec(SAMPLE.intro) +
  sec(SAMPLE.shapes) +
  sec(SAMPLE.outro) -
  2 * sec(SAMPLE.transition);
