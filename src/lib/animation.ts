import { interpolate, spring, Easing } from "remotion";
import { VIDEO } from "../config";

/** Smooth, slightly bouncy entrance spring (0 -> 1). Pass `delay` in frames. */
export const enter = (
  frame: number,
  delay = 0,
  config: { damping?: number; stiffness?: number; mass?: number } = {},
): number =>
  spring({
    frame: frame - delay,
    fps: VIDEO.fps,
    config: { damping: 18, stiffness: 120, mass: 0.9, ...config },
  });

/** Clamped linear interpolation with an easing curve. */
export const ease = (
  frame: number,
  [from, to]: [number, number],
  [outFrom, outTo]: [number, number] = [0, 1],
  easing = Easing.bezier(0.16, 1, 0.3, 1),
): number =>
  interpolate(frame, [from, to], [outFrom, outTo], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Fade a value in at the start and out at the end of a `duration` window. */
export const fadeInOut = (
  frame: number,
  duration: number,
  edge = 12,
): number =>
  interpolate(frame, [0, edge, duration - edge, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Continuous gentle float (use for ambient motion). Returns -amp..amp. */
export const float = (frame: number, amp = 10, period = 90, phase = 0): number =>
  Math.sin(((frame + phase) / period) * Math.PI * 2) * amp;
