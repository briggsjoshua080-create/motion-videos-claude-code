import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { DrawnCross, RedPencil } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ES, PALETTE as C, TINT, type SceneProps } from "./constants";
import { Pill } from "./ui";

/** The Senate ballot (made-up candidates): one beige sheet, candidates grouped by party, a box each. */
const W = 760;
const POS = { x: 160, y: 370 } as const;
const HEADER = 74;
const ROW = 50;
const BOX = 38;
const BOX_X = W - 40 - BOX;

type Line = { kind: "party"; id: string; tint: string } | { kind: "cand"; name: string };
const LINES: Line[] = [
  { kind: "party", id: "A", tint: TINT.a },
  { kind: "cand", name: "Teresa Navarro" },
  { kind: "cand", name: "Óscar Méndez" },
  { kind: "party", id: "B", tint: TINT.b },
  { kind: "cand", name: "Alba Cortés" },
  { kind: "cand", name: "Manuel Rivas" },
  { kind: "party", id: "C", tint: TINT.c },
  { kind: "cand", name: "Nuria Herrera" },
  { kind: "cand", name: "Iván Romero" },
];
const H = HEADER + 18 + LINES.length * ROW + 20;
/** The three crosses: two for party B, one for party C (they may be from different parties). */
const MARKS = [4, 5, 7];
const rowTop = (i: number) => HEADER + 18 + i * ROW;
const markAt = (i: number) => ({ x: BOX_X + BOX / 2, y: rowTop(i) + ROW / 2 });

/**
 * "For the Senate, you tick up to three candidates."
 * The beige Senate ballot: candidates of every party on one sheet. The pencil marks three of them,
 * from two parties. Notes: up to 3 in most provinces, 4 senators per province.
 */
export const SenateScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const chamber = pop(frame, cue("senate", "Senate") - 4);
  const ballotIn = rise(frame, 0);
  const t0 = cue("senate", "tick") - 2;
  const t1 = cue("senate", "candidates", "end") + 2;
  const step = (t1 - t0) / 3;
  const marks = MARKS.map((_, k) => progress(frame, t0 + k * step, t0 + (k + 0.8) * step));
  const three = pop(frame, cue("senate", "three") - 2);
  const note = rise(frame, cue("senate", "candidates") + 4);

  // The pencil hops from box to box.
  const k = Math.min(2, Math.max(0, Math.floor((frame - t0) / step)));
  const here = markAt(MARKS[k]);
  const prev = markAt(MARKS[Math.max(0, k - 1)]);
  const hop = k === 0 ? 1 : progress(frame, t0 + k * step - 4, t0 + k * step);
  const reach = progress(frame, t0 - 12, t0);
  const leave = progress(frame, t1 + 2, t1 + 14);
  const start = { x: 1060, y: 1300 };
  const tipX = POS.x + (k === 0 ? interpolate(reach, [0, 1], [start.x - POS.x, here.x]) : interpolate(hop, [0, 1], [prev.x, here.x])) + leave * 300;
  const tipY = POS.y + (k === 0 ? interpolate(reach, [0, 1], [start.y - POS.y, here.y]) : interpolate(hop, [0, 1], [prev.y, here.y])) + leave * 200;
  const drawing = marks.some((m) => m > 0 && m < 1);
  const wobble = drawing ? Math.sin(frame * 1.6) * 4 : 0;
  const pencilOn = Math.min(1, reach * 3) * (1 - leave) * (1 - exit);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: 292, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={chamber} bg={ES.sepiaDeep} color={C.white} size={26} style={{ letterSpacing: 1 }}>
          SENATE · the second chamber
        </Pill>
      </div>

      <div style={{ position: "absolute", left: POS.x, top: POS.y, width: W, height: H, fontFamily: theme.font, ...riseStyle(ballotIn, exit, 50) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: ES.sepia, boxShadow: "0 22px 54px rgba(20,32,43,0.16)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 28, right: 28, top: 0, height: HEADER, display: "flex", alignItems: "center", gap: 16, borderBottom: `3px solid ${C.ink}` }}>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 3, color: C.ink }}>BALLOT · SENATE</div>
            <div style={{ flex: 1 }} />
            <div
              style={{
                padding: "4px 14px",
                borderRadius: 10,
                background: ES.red,
                color: C.white,
                fontSize: 24,
                fontWeight: 900,
                opacity: Math.min(1, three * 1.4),
                transform: `scale(${0.6 + 0.4 * three})`,
              }}
            >
              mark up to 3
            </div>
          </div>
          {LINES.map((line, i) =>
            line.kind === "party" ? (
              <div key={line.id} style={{ position: "absolute", left: 28, top: rowTop(i), height: ROW, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: line.tint, color: C.white, fontSize: 22, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {line.id}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: C.ink }}>Party {line.id}</div>
              </div>
            ) : (
              <React.Fragment key={line.name}>
                <div style={{ position: "absolute", left: 76, top: rowTop(i), height: ROW, display: "flex", alignItems: "center", fontSize: 28, fontWeight: 600, color: C.ink }}>{line.name}</div>
                <div style={{ position: "absolute", left: BOX_X, top: rowTop(i) + (ROW - BOX) / 2, width: BOX, height: BOX, borderRadius: 6, border: `3px solid ${C.ink}`, boxSizing: "border-box", background: C.white }} />
              </React.Fragment>
            ),
          )}
        </div>
        {MARKS.map((row, k2) => (
          <div key={row} style={{ position: "absolute", left: markAt(row).x - 30, top: markAt(row).y - 32 }}>
            <DrawnCross size={60} p={marks[k2]} color={C.ink} stroke={5.5} />
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: POS.y + H + 30,
          textAlign: "center",
          fontFamily: theme.font,
          ...riseStyle(note, exit, 16),
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, letterSpacing: -0.8 }}>
          Vote for <span style={{ color: ES.red }}>people</span>, from any party
        </div>
        <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft, marginTop: 6 }}>Each province elects 4 senators (islands and Ceuta & Melilla fewer)</div>
      </div>

      <div style={{ position: "absolute", left: tipX + wobble, top: tipY, opacity: pencilOn }}>
        <RedPencil length={300} palette={C} color={ES.charcoal} lead={C.ink} />
      </div>
    </>
  );
};
