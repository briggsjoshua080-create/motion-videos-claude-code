import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { VoteOutIcon } from "../../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../../components/explainer/motion";
import { EU, PALETTE as C, type SceneProps } from "../constants";
import { IconTile, JobCard, MarkBadge } from "../ui";
import { PeopleGrid } from "./people";

const GRID = { top: 446, size: 84, gap: 10 } as const;

/**
 * "Each country sends one commissioner, and Parliament approves the team, or can vote it out."
 * 27 commissioners, approved by Parliament (370 votes, Nov 2024); Parliament can vote them out.
 */
export const TeamScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const title = rise(frame, 0);
  const wave = (i: number) => pop(frame, cue("team", "one") - 8 + (i % 9) * 1.5 + Math.floor(i / 9) * 3);
  const approved = pop(frame, cue("team", "Parliament") - 2);
  const out = pop(frame, cue("team", "or") - 4);

  return (
    <>
      <div style={{ position: "absolute", top: 352, left: 0, right: 0, textAlign: "center", fontFamily: theme.font, ...riseStyle(title, exit, 24) }}>
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 4, color: C.ink }}>27 COMMISSIONERS</div>
        <div style={{ fontSize: 27, fontWeight: 600, color: C.inkSoft, marginTop: 4 }}>one per country · each runs one area, e.g. trade</div>
      </div>

      <div style={{ position: "absolute", top: GRID.top, left: 540 - (9 * GRID.size + 8 * GRID.gap) / 2, opacity: 1 - exit }}>
        <PeopleGrid seed="commissioner" size={GRID.size} gap={GRID.gap} p={wave} bg={() => EU.bluePale} />
      </div>

      <JobCard
        left={120}
        top={764}
        width={840}
        height={128}
        p={approved}
        out={exit}
        icon={<MarkBadge size={84} kind="yes" p={approved} />}
        label={
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Approved by Parliament</span>
            <span style={{ fontSize: 28, fontWeight: 600, color: C.inkSoft }}>370 votes in favour · Nov 2024</span>
          </div>
        }
        fontSize={40}
      />
      <JobCard
        left={120}
        top={912}
        width={840}
        height={128}
        p={out}
        out={exit}
        icon={
          <IconTile size={84}>
            <VoteOutIcon size={62} palette={C} />
          </IconTile>
        }
        label={
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Parliament can vote it out</span>
            <span style={{ fontSize: 28, fontWeight: 600, color: C.inkSoft }}>the whole team · needs ⅔ of the votes</span>
          </div>
        }
        fontSize={40}
      />
    </>
  );
};
