import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { DrawnCross, FlagChip, RedPencil } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { PALETTE as C, PT, TINT, type SceneProps } from "./constants";
import { Badge, Pill } from "./ui";

/** The ballot: one line per party (made-up parties): name, short name, symbol, empty square. */
const SHEET = { left: 170, top: 372, w: 740, header: 92, row: 98 } as const;
const PARTIES = [
  { id: "A", name: "Party A", short: "PA", tint: TINT.a, shape: "circle" },
  { id: "B", name: "Party B", short: "PB", tint: TINT.b, shape: "star" },
  { id: "C", name: "Party C", short: "PC", tint: TINT.c, shape: "leaf" },
  { id: "D", name: "Party D", short: "PD", tint: TINT.d, shape: "square" },
  { id: "E", name: "Party E", short: "PE", tint: TINT.e, shape: "triangle" },
] as const;
const SHEET_H = SHEET.header + PARTIES.length * SHEET.row + 20;
const PICK = 2;
const BOX = 62;
const BOX_X = SHEET.w - 40 - BOX;
const rowTop = (i: number) => SHEET.header + i * SHEET.row;
/** The middle of the picked party's square, on the canvas. */
const MARK = { x: SHEET.left + BOX_X + BOX / 2, y: SHEET.top + rowTop(PICK) + SHEET.row / 2 } as const;

const Symbol: React.FC<{ shape: (typeof PARTIES)[number]["shape"]; color: string }> = ({ shape, color }) => (
  <svg width={56} height={56} viewBox="0 0 40 40" style={{ display: "block" }}>
    <circle cx={20} cy={20} r={19} fill={C.white} stroke={color} strokeWidth={3} />
    {shape === "circle" ? <circle cx={20} cy={20} r={9} fill={color} /> : null}
    {shape === "star" ? <path d="M20 8 L23.5 16.5 L32 17 L25.5 22.5 L27.5 31 L20 26.5 L12.5 31 L14.5 22.5 L8 17 L16.5 16.5 Z" fill={color} /> : null}
    {shape === "leaf" ? <path d="M11 29 C11 16 20 10 30 10 C30 22 23 29 11 29 Z M11 29 L22 18" fill={color} stroke={C.white} strokeWidth={1.5} /> : null}
    {shape === "square" ? <rect x={11} y={11} width={18} height={18} rx={3} fill={color} /> : null}
    {shape === "triangle" ? <path d="M20 9 L31 29 H9 Z" fill={color} /> : null}
  </svg>
);

/**
 * "The ballot has no names, only parties. You put one cross next to the party you choose."
 * One ballot sheet with five made-up parties: name, short name, symbol and an empty square (no
 * candidates' names). The pencil draws one cross in party C's square; one cross only, or it's void.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const label = pop(frame, cue("ballot", "ballot") - 4);
  const sheetIn = rise(frame, 0);
  const noNames = pop(frame, cue("ballot", "no") - 3);
  const parties = pop(frame, cue("ballot", "parties") - 3);
  const cross = progress(frame, cue("ballot", "cross") - 2, cue("ballot", "next", "end") + 2);
  const hi = progress(frame, cue("ballot", "party") - 4, cue("ballot", "party") + 6);
  const rule = rise(frame, cue("ballot", "choose") - 2);
  const callOut = progress(frame, cue("ballot", "choose") - 12, cue("ballot", "choose") - 3);

  // The pencil comes in from the bottom right, draws the cross, then leaves.
  const reach = progress(frame, cue("ballot", "one") - 8, cue("ballot", "cross") - 2);
  const leave = progress(frame, cue("ballot", "next", "end") + 4, cue("ballot", "next", "end") + 16);
  const drawing = cross > 0 && cross < 1;
  const wobble = drawing ? Math.sin(frame * 1.6) * 4 : 0;
  const tipX = interpolate(reach, [0, 1], [1080, MARK.x + 4]) + leave * 300 + wobble + (drawing ? (cross < 0.5 ? -10 + 40 * cross : 30 - 40 * (cross - 0.5)) : 0);
  const tipY = interpolate(reach, [0, 1], [1400, MARK.y + 10]) + leave * 220;
  const pencilOn = Math.min(1, reach * 3) * (1 - leave) * (1 - exit);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: 292, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={label} bg={C.ink} color={C.white} size={26} style={{ letterSpacing: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <FlagChip width={34} palette={C} />
          ONE BALLOT · one cross
        </Pill>
      </div>

      <div style={{ position: "absolute", left: SHEET.left, top: SHEET.top, width: SHEET.w, height: SHEET_H, fontFamily: theme.font, ...riseStyle(sheetIn, exit, 50) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: C.card, boxShadow: "0 22px 54px rgba(20,32,43,0.16)", border: `3px solid ${C.line}`, boxSizing: "border-box" }} />
        <div style={{ position: "absolute", left: 32, right: 32, top: 0, height: SHEET.header, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `3px solid ${C.ink}` }}>
          <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: 2.5, color: C.ink, whiteSpace: "nowrap" }}>ASSEMBLY OF THE REPUBLIC</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.inkSoft, whiteSpace: "nowrap" }}>Lisbon district</div>
        </div>
        {PARTIES.map((p, i) => {
          const picked = i === PICK;
          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: 14,
                right: 14,
                top: rowTop(i) + 6,
                height: SHEET.row - 12,
                borderRadius: 12,
                background: picked ? `rgba(46,156,143,${0.14 * hi})` : "transparent",
                borderBottom: i === PARTIES.length - 1 ? "none" : `2px solid ${C.line}`,
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "0 18px",
              }}
            >
              <div style={{ fontSize: 31, fontWeight: 800, color: C.ink, width: 200, whiteSpace: "nowrap" }}>{p.name}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, width: 70 }}>{p.short}</div>
              <Symbol shape={p.shape} color={p.tint} />
            </div>
          );
        })}
        {PARTIES.map((p, i) => (
          <div key={`box-${p.id}`} style={{ position: "absolute", left: BOX_X, top: rowTop(i) + (SHEET.row - BOX) / 2, width: BOX, height: BOX, borderRadius: 8, border: `3.5px solid ${C.ink}`, boxSizing: "border-box", background: C.white }} />
        ))}
        <div style={{ position: "absolute", left: BOX_X + 1, top: rowTop(PICK) + (SHEET.row - BOX) / 2 + 1 }}>
          <DrawnCross size={60} p={cross} color={C.ink} stroke={6} />
        </div>
      </div>

      {/* What's on it, and what isn't */}
      <div style={{ position: "absolute", left: 120, width: 840, top: SHEET.top + SHEET_H + 30, display: "flex", flexDirection: "column", gap: 14, fontFamily: theme.font, opacity: 1 - Math.max(exit, callOut) }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, opacity: Math.min(1, noNames * 1.4), transform: `scale(${0.7 + 0.3 * noNames})` }}>
          <Badge size={44} ok={false} p={noNames} />
          <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>No candidates' names</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, opacity: Math.min(1, parties * 1.4), transform: `scale(${0.7 + 0.3 * parties})` }}>
          <Badge size={44} ok p={parties} />
          <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>
            Only parties: <span style={{ color: PT.green }}>they rank their candidates</span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, width: 840, top: SHEET.top + SHEET_H + 36, textAlign: "center", fontFamily: theme.font, ...riseStyle(rule, exit, 16) }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, letterSpacing: -0.6, whiteSpace: "nowrap" }}>
          <span style={{ color: PT.red }}>One cross</span> in one square
        </div>
        <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft, marginTop: 6, whiteSpace: "nowrap" }}>Two crosses or any writing: the vote doesn't count</div>
      </div>

      <div style={{ position: "absolute", left: tipX, top: tipY, opacity: pencilOn }}>
        <RedPencil length={300} palette={C} color={PT.charcoal} lead={C.ink} />
      </div>
    </>
  );
};
