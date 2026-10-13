import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { BudgetIcon, LawIcon, MagnifierIcon } from "../../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../../components/explainer/motion";
import { PALETTE as C, type SceneProps } from "../constants";
import { CommissionIcon, IconTile, JobCard } from "../ui";

/**
 * "But day to day, the EU is run by the European Commission. It proposes new laws, manages the
 * EU's money, and makes sure countries follow EU law."
 */
export const CommissionScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const icon = rise(frame, 0);
  const label = rise(frame, cue("commission", "European") - 6);
  const jobs = [
    { key: "laws", p: pop(frame, cue("commissionJob", "proposes") - 4), icon: <LawIcon size={64} palette={C} />, label: "Proposes new laws" },
    { key: "money", p: pop(frame, cue("commissionJob", "manages") - 4), icon: <BudgetIcon size={64} palette={C} />, label: "Manages the EU's money" },
    {
      key: "law",
      p: pop(frame, cue("commissionJob", "makes") - 4),
      icon: <MagnifierIcon size={60} palette={C} />,
      label: "Checks countries follow EU law",
    },
  ];

  return (
    <>
      <div style={{ position: "absolute", left: 540 - 150, top: 352, ...riseStyle(icon, exit, 40) }}>
        <CommissionIcon width={300} />
      </div>
      <div style={{ position: "absolute", top: 584, left: 0, right: 0, textAlign: "center", fontFamily: theme.font, ...riseStyle(label, exit, 24) }}>
        <div style={{ fontSize: 54, fontWeight: 800, color: C.ink, letterSpacing: -1.5 }}>European Commission</div>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.inkSoft, marginTop: 4 }}>Brussels · runs the EU day to day</div>
      </div>
      {jobs.map((job, i) => (
        <JobCard
          key={job.key}
          left={120}
          top={744 + i * 142}
          width={840}
          height={120}
          p={job.p}
          out={exit}
          icon={<IconTile size={88}>{job.icon}</IconTile>}
          label={job.label}
          fontSize={40}
        />
      ))}
    </>
  );
};
