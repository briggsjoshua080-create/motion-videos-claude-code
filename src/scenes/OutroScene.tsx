import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { AnimatedText } from "../components/AnimatedText";
import { theme } from "../theme";
import { ease } from "../lib/animation";

export const OutroScene: React.FC<{ message: string; footer: string }> = ({ message, footer }) => {
  const frame = useCurrentFrame();
  const f = ease(frame, [35, 60]);
  return (
    <AbsoluteFill>
      <Backdrop hue="blue" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 160, gap: 30 }}>
        <AnimatedText text={message} fontSize={120} delay={4} />
        <div
          style={{
            opacity: f,
            fontFamily: theme.font,
            fontSize: 40,
            color: theme.colors.muted,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {footer}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
