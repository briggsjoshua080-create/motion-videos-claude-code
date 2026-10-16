import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { LawIcon, ParliamentIcon, VoteOutIcon } from "../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { MAJORITY, PALETTE as C, POSE, PT, TOTAL, type SceneProps } from "./constants";
import { Badge, Card } from "./ui";

const P = POSE.parliament;
const LABEL_TOP = P.cy + 18;
const TILES_TOP = LABEL_TOP + 112;
const TILE_H = 220;
const ONE = { top: TILES_TOP + TILE_H + 20, height: 170 } as const;

const Tile: React.FC<{ left: number; p: number; exit: number; icon: React.ReactNode; title: string; sub: string }> = ({ left, p, exit, icon, title, sub }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: TILES_TOP,
      width: 408,
      height: TILE_H,
      borderRadius: 28,
      background: C.card,
      boxShadow: "0 22px 54px rgba(20,32,43,0.14)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: theme.font,
      opacity: Math.min(1, p * 1.4) * (1 - exit),
      transform: `translateY(${(1 - p) * 40 - exit * 30}px) scale(${0.85 + 0.15 * p})`,
    }}
  >
    {icon}
    <div style={{ fontSize: 33, fontWeight: 800, color: C.ink, letterSpacing: -0.8, textAlign: "center", lineHeight: 1.1, padding: "0 20px" }}>{title}</div>
    <div style={{ fontSize: 24, fontWeight: 600, color: C.inkSoft, textAlign: "center", padding: "0 20px" }}>{sub}</div>
  </div>
);

/**
 * "The 230 members of the Assembly make the laws and can bring down the government. There is no
 * second chamber."
 * The half-circle (AssemblyLayer) sweeps in green; two tiles say what the Assembly does; a card
 * says it is the only chamber (no senate).
 */
export const ParliamentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const label = rise(frame, cue("parliament", "members") - 6);
  const laws = pop(frame, cue("parliament", "make") - 4);
  const down = pop(frame, cue("parliament", "bring") - 4);
  const one = rise(frame, cue("parliament", "no") - 8);
  const cross = pop(frame, cue("parliament", "second") - 2);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: LABEL_TOP, textAlign: "center", fontFamily: theme.font, ...riseStyle(label, exit, 20) }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: C.ink, letterSpacing: -1.2, whiteSpace: "nowrap" }}>Assembly of the Republic</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: PT.green, marginTop: 2, whiteSpace: "nowrap" }}>{TOTAL} members · elected for up to 4 years</div>
      </div>
      <Tile left={120} p={laws} exit={exit} icon={<LawIcon size={76} palette={C} />} title="Makes the laws" sub="and passes the budget" />
      <Tile left={552} p={down} exit={exit} icon={<VoteOutIcon size={76} palette={C} />} title="Can bring down the government" sub={`with ${MAJORITY} votes`} />

      <Card top={ONE.top} height={ONE.height} style={{ padding: "24px 32px", display: "flex", alignItems: "center", gap: 26, ...riseStyle(one, exit) }}>
        <div style={{ position: "relative", width: 120, height: 120, borderRadius: 30, background: PT.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <ParliamentIcon width={88} palette={C} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 3, color: C.muted, whiteSpace: "nowrap" }}>ONE CHAMBER ONLY</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Badge size={40} ok={false} p={cross} />
            <div style={{ fontSize: 31, fontWeight: 800, color: C.ink, whiteSpace: "nowrap", opacity: Math.min(1, cross * 1.4) }}>No senate: the Assembly decides</div>
          </div>
        </div>
      </Card>
    </>
  );
};
