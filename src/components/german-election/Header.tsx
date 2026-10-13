import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { COLORS, FONT, LAYOUT, SceneId, sceneOf } from "../../compositions/german-election/constants";
import { FlagChip } from "./icons";
import { progress, rise } from "./motion";

const STEPS: { scene: SceneId; label: string }[] = [
  { scene: "votes", label: "Votes" },
  { scene: "bundestag", label: "Bundestag" },
  { scene: "chancellor", label: "Chancellor" },
  { scene: "president", label: "President" },
];

/**
 * Persistent header: video title plus a 4-step progress row. Mounted in a Sequence that
 * starts with the "votes" scene, but works in global frames via `offset`.
 */
export const Header: React.FC<{ offset: number }> = ({ offset }) => {
  const frame = useCurrentFrame() + offset; // global frame
  const inP = rise(frame, sceneOf("votes").from - 4);

  return (
    <div
      style={{
        position: "absolute",
        top: LAYOUT.headerTop,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
        fontFamily: FONT,
        opacity: inP,
        transform: `translateY(${(1 - inP) * -40}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <FlagChip width={46} />
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 5, color: COLORS.ink }}>
          GERMAN ELECTION SYSTEM
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {STEPS.map((step, i) => {
          const start = sceneOf(step.scene).from;
          const next = STEPS[i + 1] ? sceneOf(STEPS[i + 1].scene).from : Number.MAX_SAFE_INTEGER;
          const active = progress(frame, start - 6, start + 6);
          const done = progress(frame, next - 6, next + 6);
          const bg = interpolateColors(active - done, [0, 1], ["rgba(255,255,255,0)", COLORS.ink]);
          const text = interpolateColors(active, [0, 1], [COLORS.muted, COLORS.white]);
          const finalText = interpolateColors(done, [0, 1], [text, COLORS.inkSoft]);
          return (
            <div
              key={step.scene}
              style={{
                width: 196,
                height: 58,
                borderRadius: 29,
                background: bg,
                border: `2.5px solid ${interpolateColors(active - done, [0, 1], [COLORS.line, COLORS.ink])}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transform: `scale(${1 + 0.06 * (active - done)})`,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  background: done > 0.5 ? COLORS.gold : interpolateColors(active, [0, 1], [COLORS.line, COLORS.gold]),
                  color: COLORS.ink,
                  fontSize: 19,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {done > 0.5 ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: finalText }}>{step.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
