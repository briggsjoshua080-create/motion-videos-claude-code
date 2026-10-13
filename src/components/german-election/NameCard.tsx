import React from "react";
import { COLORS, FONT } from "../../compositions/german-election/constants";

type Props = {
  top: number;
  height: number;
  role: string;
  name: string;
  sub: string;
  /** Card entrance (0 -> 1, may overshoot). */
  cardP: number;
  /** Name reveal (0 -> 1). Until then a placeholder bar holds its place. */
  nameP: number;
  exitP?: number;
  portrait?: React.ReactNode;
};

/** White card naming an office and its current holder. */
export const NameCard: React.FC<Props> = ({ top, height, role, name, sub, cardP, nameP, exitP = 0, portrait }) => (
  <div
    style={{
      position: "absolute",
      left: 140,
      top,
      width: 800,
      height,
      borderRadius: 28,
      background: COLORS.card,
      boxShadow: "0 22px 54px rgba(22,22,26,0.14)",
      display: "flex",
      alignItems: "center",
      justifyContent: portrait ? "flex-start" : "center",
      gap: 34,
      padding: portrait ? "0 40px" : 0,
      boxSizing: "border-box",
      fontFamily: FONT,
      opacity: Math.min(1, cardP * 1.4) * (1 - exitP),
      transform: `translateY(${(1 - cardP) * 50 - exitP * 40}px) scale(${0.92 + 0.08 * cardP})`,
    }}
  >
    <div style={{ position: "absolute", left: 0, top: 26, bottom: 26, width: 10, borderRadius: "0 6px 6px 0", background: COLORS.red }} />
    {portrait}
    <div style={{ display: "flex", flexDirection: "column", alignItems: portrait ? "flex-start" : "center", gap: 6 }}>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 4, color: COLORS.red }}>{role}</div>
      <div style={{ position: "relative", height: 70, display: "flex", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            left: portrait ? 0 : "50%",
            width: 300,
            height: 26,
            borderRadius: 13,
            background: COLORS.paperDeep,
            transform: portrait ? undefined : "translateX(-50%)",
            opacity: 1 - nameP,
          }}
        />
        <div
          style={{
            fontSize: portrait ? 62 : 58,
            fontWeight: 800,
            letterSpacing: -1.5,
            color: COLORS.ink,
            whiteSpace: "nowrap",
            opacity: nameP,
            transform: `translateY(${(1 - nameP) * 18}px)`,
            clipPath: `inset(0 ${(1 - nameP) * 100}% 0 0)`,
          }}
        >
          {name}
        </div>
      </div>
      <div style={{ fontSize: 27, fontWeight: 600, color: COLORS.inkSoft }}>{sub}</div>
    </div>
  </div>
);
