import React from "react";
import { theme } from "../../theme";
import type { ExplainerPalette } from "./palette";

/** White card naming an office and its holder. The name wipes in (`nameP`) over a placeholder bar. */
export const NameCard: React.FC<{
  top: number;
  height: number;
  role: string;
  name: string;
  sub: string;
  /** Card entrance (0 -> 1, may overshoot). */
  cardP: number;
  /** Name reveal (0 -> 1). */
  nameP: number;
  exitP?: number;
  portrait?: React.ReactNode;
  palette: ExplainerPalette;
  left?: number;
  width?: number;
}> = ({ top, height, role, name, sub, cardP, nameP, exitP = 0, portrait, palette: c, left = 140, width = 800 }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      height,
      borderRadius: 28,
      background: c.card,
      boxShadow: "0 22px 54px rgba(20,33,61,0.14)",
      display: "flex",
      alignItems: "center",
      justifyContent: portrait ? "flex-start" : "center",
      gap: 34,
      padding: portrait ? "0 40px" : 0,
      boxSizing: "border-box",
      fontFamily: theme.font,
      opacity: Math.min(1, cardP * 1.4) * (1 - exitP),
      transform: `translateY(${(1 - cardP) * 50 - exitP * 40}px) scale(${0.92 + 0.08 * cardP})`,
    }}
  >
    <div style={{ position: "absolute", left: 0, top: 26, bottom: 26, width: 10, borderRadius: "0 6px 6px 0", background: c.alert }} />
    {portrait}
    <div style={{ display: "flex", flexDirection: "column", alignItems: portrait ? "flex-start" : "center", gap: 6 }}>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 4, color: c.alert }}>{role}</div>
      <div style={{ position: "relative", height: 70, display: "flex", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            left: portrait ? 0 : "50%",
            width: 300,
            height: 26,
            borderRadius: 13,
            background: c.paperDeep,
            transform: portrait ? undefined : "translateX(-50%)",
            opacity: 1 - nameP,
          }}
        />
        <div
          style={{
            fontSize: portrait ? 58 : 56,
            fontWeight: 800,
            letterSpacing: -1.5,
            color: c.ink,
            whiteSpace: "nowrap",
            opacity: nameP,
            transform: `translateY(${(1 - nameP) * 18}px)`,
            clipPath: `inset(0 ${(1 - nameP) * 100}% 0 0)`,
          }}
        >
          {name}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: c.inkSoft }}>{sub}</div>
    </div>
  </div>
);
