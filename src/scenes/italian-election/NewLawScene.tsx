import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { IT, PALETTE as C, type SceneProps } from "./constants";
import { BonusIcon, Card, IconTile, SeatsIcon } from "./ui";

/**
 * "From 2027, new rules apply." A new election law (passed in October 2026) replaces the system
 * shown in this video at the next general election, due in 2027.
 */
export const NewLawScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 0);
  const stamp = pop(frame, cue("newlaw", "2027") - 4);
  // The changes come in right after the year, so they stay up long enough to read.
  const rows = [
    { key: "seats", icon: <SeatsIcon size={70} color={IT.shared} />, title: "Seats shared out by votes", sub: "area winners only in 2 small regions", p: pop(frame, cue("newlaw", "2027") + 6) },
    { key: "bonus", icon: <BonusIcon size={64} />, title: "Bonus seats for 42%", sub: "for an alliance that wins 42% in both houses", p: pop(frame, cue("newlaw", "2027") + 16) },
  ];
  const footer = rise(frame, cue("newlaw", "2027") + 26);

  return (
    <Card top={474} height={588} style={{ padding: "40px 44px", ...riseStyle(card, exit) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div
          style={{
            padding: "10px 20px",
            borderRadius: 14,
            border: `5px solid ${IT.green}`,
            color: IT.greenDeep,
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: 3,
            opacity: Math.min(1, stamp * 1.4),
            transform: `rotate(-6deg) scale(${0.7 + 0.3 * stamp})`,
          }}
        >
          NEW
        </div>
        <div>
          <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: -1.2, color: C.ink, lineHeight: 1.05 }}>Election law</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft, marginTop: 4 }}>from the next election, in 2027</div>
        </div>
      </div>
      {rows.map((row) => (
        <div
          key={row.key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            marginTop: 30,
            paddingTop: 30,
            borderTop: `2px solid ${C.line}`,
            opacity: Math.min(1, row.p * 1.4),
            transform: `translateX(${(1 - row.p) * 40}px)`,
          }}
        >
          <IconTile size={96} bg={C.paperDeep}>
            {row.icon}
          </IconTile>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: theme.font }}>
            <div style={{ fontSize: 38, fontWeight: 800, color: C.ink, letterSpacing: -0.8 }}>{row.title}</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: C.inkSoft }}>{row.sub}</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 34, fontSize: 26, fontWeight: 600, color: C.muted, textAlign: "center", ...riseStyle(footer, 0, 12) }}>
        Passed in October 2026 · court challenges pending
      </div>
    </Card>
  );
};
