import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { LawIcon, MagnifierIcon } from "../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DK, PALETTE as C, POSE, TOTAL, type SceneProps } from "./constants";

const P = POSE.folketing;
const LABEL_TOP = P.cy + 22;
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
    <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft, textAlign: "center", padding: "0 20px" }}>{sub}</div>
  </div>
);

/**
 * "These 179 MPs form the Folketing, the only chamber. It makes the laws and checks the government."
 * The half-circle (FolketingLayer) turns red as the Folketing; a "one chamber" tag; two tiles say
 * what it does.
 */
export const FolketingScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const label = rise(frame, cue("folketing", "Folketing") - 6);
  const only = pop(frame, cue("folketing", "only") - 3);
  const laws = pop(frame, cue("folketing", "makes") - 4);
  const checks = pop(frame, cue("folketing", "checks") - 4);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: LABEL_TOP, textAlign: "center", fontFamily: theme.font, ...riseStyle(label, exit, 20) }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
          <div style={{ fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: -1.2, whiteSpace: "nowrap" }}>Folketing</div>
          <div
            style={{
              padding: "6px 16px",
              borderRadius: 12,
              background: C.ink,
              color: C.white,
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: 2,
              whiteSpace: "nowrap",
              opacity: Math.min(1, only * 1.4),
              transform: `scale(${0.6 + 0.4 * only})`,
            }}
          >
            THE ONLY CHAMBER
          </div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: DK.red, marginTop: 4, whiteSpace: "nowrap" }}>{TOTAL} MPs · elected at least every 4 years</div>
      </div>
      <Tile left={120} p={laws} exit={exit} icon={<LawIcon size={92} palette={C} />} title="Makes the laws" sub="and passes the budget" />
      <Tile left={552} p={checks} exit={exit} icon={<MagnifierIcon size={92} palette={C} />} title="Checks the government" sub="and can vote ministers out" />
    </>
  );
};
