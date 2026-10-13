import React from "react";
import { useCurrentFrame } from "remotion";
import { enter, float } from "../lib/animation";

/** Wraps any SVG shape: springs it in (scale + rotation) then floats it gently. */
export const ShapeCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
  x: number;
  y: number;
  spin?: number;
}> = ({ children, delay = 0, x, y, spin = 90 }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, delay, { damping: 12, stiffness: 100 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float(frame, 14, 100, delay * 3),
        transform: `scale(${p}) rotate(${(1 - p) * spin}deg)`,
        opacity: Math.min(1, p * 1.5),
      }}
    >
      {children}
    </div>
  );
};
