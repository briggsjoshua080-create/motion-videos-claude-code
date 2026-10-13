import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { DrawnArrow, EuFlag, ParliamentIcon } from "../../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../../components/explainer/motion";
import { EU, PALETTE as C, type SceneProps } from "../constants";
import { Card, IconTile, Pill } from "../ui";
import { POSE } from "./HemicycleLayer";

/**
 * "From 18, or 16 in some countries, EU citizens elect the European Parliament."
 * Recap of part 1: who can vote, and the Parliament they elect (the half-circle is HemicycleLayer).
 */
export const RecapScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 0);
  const sixteen = pop(frame, cue("recap", "16") - 3);
  const arrow = progress(frame, cue("recap", "elect") - 6, cue("recap", "elect") + 8);
  const elect = pop(frame, cue("recap", "elect") - 2);
  const label = rise(frame, cue("recap", "European") - 4);
  const hemiTop = POSE.recap.cy - 410 * POSE.recap.s;

  return (
    <>
      <Card left={150} top={352} width={780} height={244} style={{ padding: "26px 34px", ...riseStyle(card, exit) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ borderRadius: 5, overflow: "hidden", boxShadow: `0 0 0 2px ${C.line}`, lineHeight: 0 }}>
            <EuFlag width={48} blue={EU.blue} yellow={EU.yellow} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color: C.ink }}>WHO CAN VOTE?</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 20 }}>
          <IconTile size={92} bg={EU.yellow}>
            <div style={{ fontSize: 34, fontWeight: 900, color: C.ink, letterSpacing: -1 }}>18+</div>
          </IconTile>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 38, fontWeight: 800, color: C.ink, letterSpacing: -0.8 }}>EU citizens aged 18+</div>
            <div style={{ fontSize: 27, fontWeight: 600, color: C.inkSoft, lineHeight: 1.3, opacity: 0.35 + 0.65 * Math.min(1, sixteen) }}>
              16+ in Austria, Belgium, Germany, Malta
              <br />
              17+ in Greece
            </div>
          </div>
        </div>
      </Card>

      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - exit }}>
        <DrawnArrow x1={540} y1={616} x2={540} y2={hemiTop - 14} p={arrow} color={C.ink} width={6} />
      </svg>
      <div style={{ position: "absolute", left: 572, top: (616 + hemiTop) / 2 - 30, opacity: 1 - exit }}>
        <Pill p={elect} bg={EU.yellow} color={C.ink} size={32}>
          elect
        </Pill>
      </div>

      <div
        style={{
          position: "absolute",
          top: POSE.recap.cy + 26,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          fontFamily: theme.font,
          ...riseStyle(label, exit, 24),
        }}
      >
        <ParliamentIcon width={86} palette={C} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: C.ink, letterSpacing: -1 }}>European Parliament</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: C.inkSoft }}>720 MEPs · elected by you</div>
        </div>
      </div>
    </>
  );
};
