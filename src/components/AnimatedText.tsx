import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { enter } from "../lib/animation";

type Props = {
  text: string;
  /** Frame (relative to the scene) at which the first word starts. */
  delay?: number;
  /** Frames between consecutive words. */
  stagger?: number;
  fontSize?: number;
  weight?: number;
  color?: string;
  align?: "left" | "center" | "right";
};

/** Word-by-word text reveal: each word slides up, un-blurs and fades in on a spring. */
export const AnimatedText: React.FC<Props> = ({
  text,
  delay = 0,
  stagger = 4,
  fontSize = 120,
  weight = 800,
  color = theme.colors.text,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        gap: `0 ${fontSize * 0.28}px`,
        fontFamily: theme.font,
        fontSize,
        fontWeight: weight,
        color,
        lineHeight: 1.1,
        letterSpacing: -fontSize * 0.02,
      }}
    >
      {words.map((word, i) => {
        const p = enter(frame, delay + i * stagger);
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * fontSize * 0.5}px)`,
              filter: `blur(${(1 - p) * 12}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
