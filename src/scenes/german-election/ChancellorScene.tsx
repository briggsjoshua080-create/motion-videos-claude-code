import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, localCue, sceneOf } from "../../compositions/german-election/constants";
import { PersonBust } from "../../components/german-election/icons";
import { pop, progress, sceneExit } from "../../components/german-election/motion";
import { NameCard } from "../../components/german-election/NameCard";

const at = localCue("chancellor");

/** Scene 4: the Bundestag elects the Chancellor (the hemicycle lives in ParliamentLayer). */
export const ChancellorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = sceneOf("chancellor");
  return (
    <AbsoluteFill>
      <NameCard
        top={968}
        height={258}
        role="CHANCELLOR"
        name="Friedrich Merz"
        sub="Head of government · since 2025"
        cardP={pop(frame, at("elect", "Chancellor"))}
        nameP={progress(frame, at("merz", "Friedrich") - 4, at("merz", "Friedrich") + 10)}
        exitP={sceneExit(frame, durationInFrames)}
        portrait={<PersonBust id="chancellor" size={180} bg={COLORS.paperDeep} suit={COLORS.ink} tie={COLORS.red} hair={COLORS.hairGrey} hairStyle="receding" />}
      />
    </AbsoluteFill>
  );
};
