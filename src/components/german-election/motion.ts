import type { CSSProperties } from "react";
import { Easing, interpolate } from "remotion";
import { enter } from "../../lib/animation";
import { EXIT_FRAMES } from "../../compositions/german-election/constants";

/** Spring entrance (0 -> 1) starting at frame `at`. Calm, no overshoot. */
export const rise = (frame: number, at: number) => enter(frame, at, { damping: 200, stiffness: 120, mass: 0.8 });

/** Spring entrance with a little overshoot, for icons and cards that "pop". */
export const pop = (frame: number, at: number) => enter(frame, at, { damping: 13, stiffness: 140, mass: 0.7 });

/** Clamped 0 -> 1 progress between two frames with a smooth ease-in-out. */
export const progress = (frame: number, from: number, to: number, easing = Easing.bezier(0.65, 0, 0.35, 1)) =>
  interpolate(frame, [from, to], [0, 1], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/**
 * Exit progress (0 -> 1) for a scene that is `duration` frames long and keeps rendering
 * EXIT_FRAMES past its end. The old content is (almost) gone before the next scene's
 * content rises in, so the two never pile up on top of each other.
 */
export const sceneExit = (frame: number, duration: number) =>
  progress(frame, duration - 9, duration + EXIT_FRAMES - 2, Easing.bezier(0.33, 0, 0.67, 1));

/** Style for content that rises into place and later drifts up while fading out. */
export const riseStyle = (enterP: number, exitP = 0, distance = 60): CSSProperties => ({
  opacity: enterP * (1 - exitP),
  transform: `translateY(${(1 - enterP) * distance - exitP * distance}px)`,
});
