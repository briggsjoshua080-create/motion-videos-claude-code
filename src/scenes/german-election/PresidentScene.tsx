import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { localCue } from "../../compositions/german-election/constants";
import { pop, progress } from "../../components/german-election/motion";
import { NameCard } from "../../components/german-election/NameCard";

const at = localCue("president");

/** Scene 5: the Federal Convention elects the President (ring + portrait live in ParliamentLayer). */
export const PresidentScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <NameCard
        top={1082}
        height={196}
        role="FEDERAL PRESIDENT"
        name="Frank-Walter Steinmeier"
        sub="Head of state · since 2017"
        cardP={pop(frame, at("steinmeier") - 2)}
        nameP={progress(frame, at("steinmeier", "Frank-Walter") - 4, at("steinmeier", "Frank-Walter") + 12)}
      />
    </AbsoluteFill>
  );
};
