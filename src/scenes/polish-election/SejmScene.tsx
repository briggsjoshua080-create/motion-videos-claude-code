import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { LawIcon } from "../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { PALETTE as C, PL, SEJM_POSE, SEJM_TOTAL, type SceneProps } from "./constants";
import { CabinetIcon } from "./ui";

const POSE = SEJM_POSE.sejm;
const LABEL_TOP = POSE.cy + 22;
const TILES_TOP = LABEL_TOP + 128;

const Tile: React.FC<{ left: number; p: number; exit: number; icon: React.ReactNode; title: string; sub: string }> = ({ left, p, exit, icon, title, sub }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: TILES_TOP,
      width: 408,
      height: 252,
      borderRadius: 28,
      background: C.card,
      boxShadow: "0 22px 54px rgba(20,32,43,0.14)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      fontFamily: theme.font,
      opacity: Math.min(1, p * 1.4) * (1 - exit),
      transform: `translateY(${(1 - p) * 40 - exit * 30}px) scale(${0.85 + 0.15 * p})`,
    }}
  >
    {icon}
    <div style={{ fontSize: 35, fontWeight: 800, color: C.ink, letterSpacing: -0.8, textAlign: "center", lineHeight: 1.1, padding: "0 24px" }}>{title}</div>
    <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft, textAlign: "center" }}>{sub}</div>
  </div>
);

/**
 * "These 460 MPs make the laws and vote the government in."
 * The half-circle (SejmLayer) turns red as the Sejm; two tiles say what it does.
 */
export const SejmScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const label = rise(frame, cue("sejm", "460") - 4);
  const laws = pop(frame, cue("sejm", "make") - 4);
  const govt = pop(frame, cue("sejm", "vote") - 4);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: LABEL_TOP, textAlign: "center", fontFamily: theme.font, ...riseStyle(label, exit, 20) }}>
        <div style={{ fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: -1.2, whiteSpace: "nowrap" }}>Sejm</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: PL.red, marginTop: 4, whiteSpace: "nowrap" }}>
          {SEJM_TOTAL} MPs · elected every 4 years
        </div>
      </div>
      <Tile left={120} p={laws} exit={exit} icon={<LawIcon size={92} palette={C} />} title="Makes the laws" sub="and passes the budget" />
      <Tile left={552} p={govt} exit={exit} icon={<CabinetIcon size={92} />} title="Votes the government in" sub="and can vote it out" />
    </>
  );
};
