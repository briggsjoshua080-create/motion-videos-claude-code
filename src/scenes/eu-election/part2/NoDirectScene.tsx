import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { DrawnArrow, DrawnPath, ParliamentIcon } from "../../../components/explainer/icons";
import { pop, progress, sceneExit } from "../../../components/explainer/motion";
import { CARD_SHADOW, EU, PALETTE as C, type SceneProps } from "../constants";
import { CommissionIcon, IconTile, MarkBadge, PersonGlyph, Pill, Stamp } from "../ui";

const YOU = { x: 232, y: 470 };
const PARL = { x: 830, y: 740 };
const COMM = { x: 232, y: 1010 };

const Node: React.FC<{ x: number; y: number; p: number; label: string; children: React.ReactNode }> = ({ x, y, p, label, children }) => (
  <div
    style={{
      position: "absolute",
      left: x - 130,
      top: y - 100,
      width: 260,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      fontFamily: theme.font,
      opacity: Math.min(1, p * 1.4),
      transform: `scale(${0.7 + 0.3 * p})`,
    }}
  >
    {children}
    <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, textAlign: "center", lineHeight: 1.1 }}>{label}</div>
  </div>
);

/**
 * "So nobody votes for the Commission directly." You -> Parliament -> Commission, while the direct
 * line from you to the Commission is crossed out.
 */
export const NoDirectScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const you = pop(frame, 0);
  const parl = pop(frame, 4);
  const comm = pop(frame, 8);
  const a1 = progress(frame, 6, 18);
  const a2 = progress(frame, 12, 24);
  const labels = pop(frame, 16);
  const direct = progress(frame, cue("notDirect", "nobody") - 8, cue("notDirect", "nobody") + 4);
  const cross = pop(frame, cue("notDirect", "votes") - 4);
  const stamp = progress(frame, cue("notDirect", "votes") - 2, cue("notDirect", "votes") + 6);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <DrawnArrow x1={YOU.x + 100} y1={YOU.y - 30} x2={PARL.x - 30} y2={PARL.y - 120} bend={40} p={a1} color={C.ink} width={6} />
        <DrawnArrow x1={PARL.x - 40} y1={PARL.y + 110} x2={COMM.x + 120} y2={COMM.y - 60} bend={40} p={a2} color={C.ink} width={6} />
        <DrawnPath d={`M${YOU.x} ${YOU.y + 92} L${COMM.x} ${COMM.y - 112}`} p={direct} color={EU.no} width={7} />
      </svg>
      <div style={{ position: "absolute", left: 500, top: 486, opacity: Math.min(1, labels * 1.4) }}>
        <Pill p={labels} bg={EU.yellow} color={C.ink} size={28}>
          elect
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 480, top: 930, opacity: Math.min(1, labels * 1.4) }}>
        <Pill p={labels} bg={C.paperDeep} border={C.line} size={28}>
          elects & approves
        </Pill>
      </div>

      <Node x={YOU.x} y={YOU.y} p={you} label="You">
        <IconTile size={130} bg={EU.bluePale}>
          <PersonGlyph size={86} color={EU.blue} />
        </IconTile>
      </Node>
      <Node x={PARL.x} y={PARL.y} p={parl} label="European Parliament">
        <div style={{ padding: 18, borderRadius: 24, background: C.card, boxShadow: CARD_SHADOW }}>
          <ParliamentIcon width={150} palette={C} />
        </div>
      </Node>
      <Node x={COMM.x} y={COMM.y} p={comm} label="European Commission">
        <div style={{ padding: 16, borderRadius: 24, background: C.card, boxShadow: CARD_SHADOW }}>
          <CommissionIcon width={160} />
        </div>
      </Node>

      {/* The crossed-out direct line */}
      <div style={{ position: "absolute", left: YOU.x - 42, top: (YOU.y + COMM.y) / 2 - 62 }}>
        <MarkBadge size={84} kind="no" p={cross} />
      </div>
      <div style={{ position: "absolute", left: YOU.x + 62, top: (YOU.y + COMM.y) / 2 - 52 }}>
        <Stamp text="NO DIRECT VOTE" color={EU.no} p={stamp} size={36} rotate={-7} />
      </div>
    </div>
  );
};
