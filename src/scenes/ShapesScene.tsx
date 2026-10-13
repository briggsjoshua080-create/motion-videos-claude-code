import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Circle, Rect, Star, Triangle } from "@remotion/shapes";
import { Backdrop } from "../components/Backdrop";
import { ShapeCard } from "../components/ShapeCard";
import { AnimatedText } from "../components/AnimatedText";
import { theme } from "../theme";
import { ease } from "../lib/animation";

export const ShapesScene: React.FC<{ heading: string }> = ({ heading }) => {
  const frame = useCurrentFrame();
  const line = ease(frame, [10, 50]);
  const c = theme.colors;
  return (
    <AbsoluteFill>
      <Backdrop hue="pink" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 130 }}>
        <AnimatedText text={heading} fontSize={90} delay={4} />
        <div
          style={{
            marginTop: 28,
            height: 6,
            width: 520 * line,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${c.accent}, ${c.accent2})`,
          }}
        />
      </AbsoluteFill>
      <ShapeCard x={220} y={470} delay={14}>
        <Circle radius={130} fill={c.accent} />
      </ShapeCard>
      <ShapeCard x={600} y={470} delay={22} spin={-120}>
        <Rect width={260} height={260} cornerRadius={40} fill={c.accent2} />
      </ShapeCard>
      <ShapeCard x={980} y={480} delay={30} spin={180}>
        <Star innerRadius={70} outerRadius={140} points={5} fill={c.accent3} />
      </ShapeCard>
      <ShapeCard x={1380} y={490} delay={38} spin={-90}>
        <Triangle length={270} direction="up" fill={c.text} />
      </ShapeCard>
    </AbsoluteFill>
  );
};
