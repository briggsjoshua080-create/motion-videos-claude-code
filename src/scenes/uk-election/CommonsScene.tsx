import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { LawIcon, MagnifierIcon } from "../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { COMMONS_POSE, PALETTE as C, UK, type SceneProps } from "./constants";
import { BigBenIcon, Card, IconTile } from "./ui";

const LABEL_TOP = COMMONS_POSE.commons.cy + 26;
const JOBS_TOP = LABEL_TOP + 150;

/**
 * "The winners form the House of Commons, which makes laws and checks the government."
 * The 650-seat half-circle itself is in CommonsLayer; this scene adds its name and its two jobs.
 */
export const CommonsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const label = rise(frame, cue("commons", "House") - 6);
  const jobs = [
    { key: "laws", icon: <LawIcon size={70} palette={C} />, title: "Makes laws", p: pop(frame, cue("commons", "makes") - 4) },
    { key: "checks", icon: <MagnifierIcon size={70} palette={C} />, title: "Checks the government", p: pop(frame, cue("commons", "checks") - 4) },
  ];

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: LABEL_TOP,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          fontFamily: theme.font,
          ...riseStyle(label, exit, 30),
        }}
      >
        <BigBenIcon height={124} />
        <div>
          <div style={{ fontSize: 60, fontWeight: 800, letterSpacing: -1.5, color: C.ink, lineHeight: 1.05 }}>House of Commons</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: UK.commons, marginTop: 6 }}>650 MPs · one per area · elected by you</div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 120, width: 840, top: JOBS_TOP, display: "flex", gap: 24, opacity: 1 - exit }}>
        {jobs.map((job) => (
          <Card
            key={job.key}
            left={0}
            top={0}
            width={408}
            height={190}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "0 26px",
              opacity: Math.min(1, job.p * 1.4),
              transform: `translateY(${(1 - job.p) * 40}px) scale(${0.9 + 0.1 * job.p})`,
            }}
          >
            <IconTile size={96} bg={UK.commonsSoft}>
              {job.icon}
            </IconTile>
            <div style={{ fontSize: 38, fontWeight: 800, color: C.ink, lineHeight: 1.1, letterSpacing: -0.6 }}>{job.title}</div>
          </Card>
        ))}
      </div>
    </>
  );
};
