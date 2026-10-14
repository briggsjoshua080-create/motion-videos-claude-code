import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { FlagChip } from "./icons";
import { progress, rise } from "./motion";
import type { ExplainerPalette } from "./palette";

export type Step = {
  label: string;
  /** Composition frame at which this step becomes active. */
  from: number;
  /** A step covered in another part of a series: drawn dashed, never active or ticked. */
  later?: boolean;
};

/**
 * Persistent header: the video title plus numbered step pills. The active step is dark, finished
 * steps get a tick. Mount it at the top level of the composition (it reads composition frames).
 */
export const StepHeader: React.FC<{
  title: string;
  steps: Step[];
  /** Composition frame at which the header slides in. */
  appearAt: number;
  /** Composition frame from which every step counts as finished (e.g. the closing question). */
  allDoneAt?: number;
  palette: ExplainerPalette;
  top?: number;
  /** Composition frame from which `later` steps pulse in the accent colour (a teaser for the next part). */
  teaseAt?: number;
}> = ({ title, steps, appearAt, allDoneAt = Number.MAX_SAFE_INTEGER, palette: c, top = 170, teaseAt = Number.MAX_SAFE_INTEGER }) => {
  const frame = useCurrentFrame();
  const inP = rise(frame, appearAt);
  const pillWidth = steps.length > 4 ? 160 : 196;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
        fontFamily: theme.font,
        opacity: inP,
        transform: `translateY(${(1 - inP) * -40}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <FlagChip width={46} palette={c} />
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 5, color: c.ink }}>{title}</div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {steps.map((step, i) => {
          if (step.later) {
            const tease = progress(frame, teaseAt, teaseAt + 10);
            const pulse = tease * (0.5 + 0.5 * Math.sin(((frame - teaseAt) / 24) * Math.PI * 2));
            return (
              <div
                key={step.label}
                style={{
                  width: pillWidth,
                  height: 58,
                  borderRadius: 29,
                  border: `2.5px dashed ${interpolateColors(tease, [0, 1], [c.line, c.accentDeep])}`,
                  background: interpolateColors(pulse, [0, 1], ["rgba(255,255,255,0)", c.white]),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transform: `scale(${1 + 0.05 * pulse})`,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    border: `2px dashed ${c.muted}`,
                    boxSizing: "border-box",
                    color: c.muted,
                    fontSize: 19,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: interpolateColors(tease, [0, 1], [c.muted, c.inkSoft]) }}>{step.label}</div>
              </div>
            );
          }
          const next = Math.min(steps[i + 1]?.from ?? Number.MAX_SAFE_INTEGER, allDoneAt);
          const active = progress(frame, step.from - 6, step.from + 6);
          const done = progress(frame, next - 6, next + 6);
          const on = active - done;
          const text = interpolateColors(active, [0, 1], [c.muted, c.white]);
          return (
            <div
              key={step.label}
              style={{
                width: pillWidth,
                height: 58,
                borderRadius: 29,
                background: interpolateColors(on, [0, 1], ["rgba(255,255,255,0)", c.ink]),
                border: `2.5px solid ${interpolateColors(on, [0, 1], [c.line, c.ink])}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transform: `scale(${1 + 0.06 * on})`,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  background: done > 0.5 ? c.accent : interpolateColors(active, [0, 1], [c.line, c.accent]),
                  color: interpolateColors(active, [0, 1], [c.ink, c.onAccent ?? c.ink]),
                  fontSize: 19,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {done > 0.5 ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: interpolateColors(done, [0, 1], [text, c.inkSoft]) }}>{step.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
