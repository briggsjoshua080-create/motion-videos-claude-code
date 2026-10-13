import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { AnimatedText } from "../components/AnimatedText";
import { GradientText } from "../components/GradientText";
import { ease } from "../lib/animation";

export const IntroScene: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const sub = ease(frame, [30, 55]);
  return (
    <AbsoluteFill>
      <Backdrop hue="blue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 160, gap: 36 }}>
        <AnimatedText text={title} delay={6} fontSize={150} />
        <div style={{ opacity: sub, transform: `translateY(${(1 - sub) * 24}px)` }}>
          <GradientText fontSize={54}>{subtitle}</GradientText>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
