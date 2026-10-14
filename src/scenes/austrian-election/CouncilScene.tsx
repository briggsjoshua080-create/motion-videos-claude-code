import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { LawIcon, VoteOutIcon } from "../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AT, COUNCIL_POSE, COUNCIL_TOTAL, PALETTE as C, type SceneProps } from "./constants";

const POSE = COUNCIL_POSE.council;
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
 * "MPs sit in the National Council, which makes the laws and can vote the government out."
 * The half-circle (CouncilLayer) turns red as the National Council; two tiles say what it does.
 */
export const CouncilScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const label = rise(frame, cue("council", "National") - 4);
  const laws = pop(frame, cue("council", "laws") - 4);
  const out = pop(frame, cue("council", "vote") - 4);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: LABEL_TOP, textAlign: "center", fontFamily: theme.font, ...riseStyle(label, exit, 20) }}>
        <div style={{ fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: -1.2, whiteSpace: "nowrap" }}>National Council</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: AT.red, marginTop: 4, whiteSpace: "nowrap" }}>
          {COUNCIL_TOTAL} MPs · elected every 5 years
        </div>
      </div>
      <Tile left={120} p={laws} exit={exit} icon={<LawIcon size={92} palette={C} />} title="Makes the laws" sub="and approves the budget" />
      <Tile left={552} p={out} exit={exit} icon={<VoteOutIcon size={92} palette={C} />} title="Can vote the government out" sub="with a vote of no confidence" />
    </>
  );
};
