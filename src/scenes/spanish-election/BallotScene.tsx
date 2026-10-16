import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { FlagChip } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CARD_SHADOW, ES, PALETTE as C, TINT, type SceneProps } from "./constants";
import { Pill } from "./ui";

/** One Congress ballot per party (made-up parties and names): a white sheet with a fixed, numbered list. */
const SHEET = { w: 236, h: 360, top: 372 } as const;
const SHEETS = [
  { id: "A", tint: TINT.a, soft: TINT.aSoft, names: ["Luis Ortega", "Ana Ruiz", "Pablo Gil", "Marta Vidal", "Jorge Sanz"], left: 150 },
  { id: "B", tint: TINT.b, soft: TINT.bSoft, names: ["Elena Mora", "Javier Pons", "Lucía Rey", "Diego Lara", "Sara Molina"], left: 422 },
  { id: "C", tint: TINT.c, soft: TINT.cSoft, names: ["Carmen Soto", "Raúl Prieto", "Irene Vega", "Hugo Nieto", "Rosa Campos"], left: 694 },
] as const;
const PICK = 1;
const ENVELOPE = { left: 300, top: 920, w: 480, h: 300 } as const;
/** Where the picked sheet ends up: its top just inside the envelope's mouth, then sliding down. */
const DROP_TOP = ENVELOPE.top + 24;
const DROP_SCALE = 0.62;

const Sheet: React.FC<{ s: (typeof SHEETS)[number]; hi: number; lock: number }> = ({ s, hi, lock }) => (
  <div
    style={{
      width: SHEET.w,
      height: SHEET.h,
      borderRadius: 14,
      background: C.card,
      boxShadow: `${CARD_SHADOW}, inset 0 0 0 ${3 + 2 * hi}px ${interpolateColors(hi, [0, 1], [C.line, s.tint])}`,
      padding: "16px 18px",
      boxSizing: "border-box",
      fontFamily: theme.font,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, borderBottom: `3px solid ${C.ink}` }}>
      <div style={{ width: 40, height: 40, borderRadius: 9, background: s.tint, color: C.white, fontSize: 26, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.id}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.ink }}>Party {s.id}</div>
    </div>
    {s.names.map((n, i) => (
      <div key={n} style={{ display: "flex", gap: 10, marginTop: 13, fontSize: 21, fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>
        <span style={{ fontWeight: 800, color: C.inkSoft, width: 18 }}>{i + 1}</span>
        {n}
      </div>
    ))}
    <div style={{ position: "absolute", left: 18, right: 18, bottom: 14, fontSize: 17, fontWeight: 700, color: C.muted, letterSpacing: 1.5 }}>CONGRESS</div>
    {/* The padlock: the list can't be changed */}
    <div
      style={{
        position: "absolute",
        right: 12,
        bottom: 10,
        width: 46,
        height: 46,
        borderRadius: 23,
        background: C.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(1, lock * 1.4),
        transform: `scale(${Math.max(0, lock)})`,
      }}
    >
      <svg width={26} height={28} viewBox="0 0 26 28">
        <path d="M7 12 V8 a6 6 0 0 1 12 0 V12" fill="none" stroke={C.white} strokeWidth={3.5} />
        <rect x={3} y={12} width={20} height={14} rx={3} fill={C.white} />
      </svg>
    </div>
  </div>
);

/**
 * "You get two ballots. For Congress, you pick one party's list, with no changes, and drop it in the
 * envelope."
 * Two ballots (white for Congress, beige for the Senate). Congress: one white sheet per party with
 * its candidates in a fixed order (made-up parties). The voter picks party B's sheet (a padlock: no
 * changes) and it drops into the envelope.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const two = pop(frame, cue("ballot", "two") - 4);
  const sheetsIn = rise(frame, cue("ballot", "Congress") - 8);
  const pick = progress(frame, cue("ballot", "pick") - 2, cue("ballot", "list", "end"));
  const lock = pop(frame, cue("ballot", "no") - 3);
  const lockLine = rise(frame, cue("ballot", "changes") - 2);
  const envIn = rise(frame, cue("ballot", "drop") - 10);
  const drop = progress(frame, cue("ballot", "drop") - 4, cue("ballot", "envelope") + 2);
  const sink = progress(frame, cue("ballot", "envelope"), cue("ballot", "envelope", "end"));

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: 292, display: "flex", justifyContent: "center", gap: 14, opacity: 1 - exit }}>
        <Pill p={two} bg={C.ink} color={C.white} size={26} style={{ letterSpacing: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <FlagChip width={34} palette={C} />2 BALLOTS: Congress (white) + Senate (beige)
        </Pill>
      </div>

      {SHEETS.map((s, i) => {
        const picked = i === PICK;
        const others = picked ? 0 : pick;
        const lift = picked ? pick : 0;
        // The picked sheet moves down into the envelope, shrinking a little; the others fade back.
        const left = picked ? interpolate(drop, [0, 1], [s.left, ENVELOPE.left + (ENVELOPE.w - SHEET.w * DROP_SCALE) / 2]) : s.left;
        const top = picked ? interpolate(drop, [0, 1], [SHEET.top - 24 * lift, DROP_TOP]) + sink * 50 : SHEET.top;
        const scale = picked ? interpolate(drop, [0, 1], [1 + 0.06 * lift, DROP_SCALE]) : 1 - 0.06 * others;
        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left,
              top,
              zIndex: picked ? 2 : 1,
              transform: `scale(${scale}) translateY(${(1 - sheetsIn) * 50}px)`,
              transformOrigin: "0 0",
              opacity: Math.min(1, sheetsIn * 1.4) * (1 - 0.6 * others) * (1 - exit),
            }}
          >
            <Sheet s={s} hi={lift} lock={picked ? lock : 0} />
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: SHEET.top + SHEET.h + 34,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 32,
          fontWeight: 800,
          color: C.ink,
          letterSpacing: -0.5,
          ...riseStyle(lockLine, Math.max(exit, drop), 16),
        }}
      >
        A <span style={{ color: ES.red }}>closed list</span>: the party sets the order
        <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft, marginTop: 6 }}>Cross out or add a name, and the vote doesn't count</div>
      </div>

      {/* The envelope: its back sits behind the sheet, its front pocket in front of it */}
      <div style={{ position: "absolute", left: ENVELOPE.left, top: ENVELOPE.top, width: ENVELOPE.w, height: ENVELOPE.h, zIndex: 1, ...riseStyle(envIn, exit, 40) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "#F4F6F8", boxShadow: CARD_SHADOW }} />
      </div>
      <div style={{ position: "absolute", left: ENVELOPE.left, top: ENVELOPE.top + 70, width: ENVELOPE.w, height: ENVELOPE.h - 70, zIndex: 3, ...riseStyle(envIn, exit, 40) }}>
        <svg width={ENVELOPE.w} height={ENVELOPE.h - 70} style={{ position: "absolute", inset: 0 }}>
          <path d={`M0 0 L${ENVELOPE.w / 2} 90 L${ENVELOPE.w} 0 V${ENVELOPE.h - 86} a16 16 0 0 1 -16 16 H16 a16 16 0 0 1 -16 -16 Z`} fill={C.white} stroke={C.line} strokeWidth={3} />
          <path d={`M0 ${ENVELOPE.h - 70} L${ENVELOPE.w / 2 - 20} 110 M${ENVELOPE.w} ${ENVELOPE.h - 70} L${ENVELOPE.w / 2 + 20} 110`} stroke={C.line} strokeWidth={3} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontFamily: theme.font, fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.muted }}>
          ENVELOPE · CONGRESS
        </div>
      </div>
    </>
  );
};
