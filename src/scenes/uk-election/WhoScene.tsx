import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { UnionFlag } from "../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { PALETTE as C, UK, type SceneProps } from "./constants";
import { Card, GlobeIcon, IconTile, IdCardIcon, PassportIcon } from "./ui";

type Row = { key: string; icon: React.ReactNode; tile: string; title: string; sub: string; at: number };

/**
 * "Who can vote? From 18: British, Irish and Commonwealth citizens in the UK, plus Britons abroad."
 * The "Who can vote?" card: age, citizenship, registering with photo ID, and voting from abroad.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 0);

  const rows: Row[] = [
    {
      key: "age",
      icon: <div style={{ fontSize: 38, fontWeight: 900, color: C.ink, letterSpacing: -1 }}>18+</div>,
      tile: UK.gold,
      title: "Aged 18 or over",
      sub: "Votes at 16 are planned: a bill is going through Parliament",
      at: cue("who", "18") - 4,
    },
    {
      key: "citizens",
      icon: <PassportIcon size={64} />,
      tile: C.paperDeep,
      title: "British, Irish or Commonwealth",
      sub: "citizens living in the UK (Commonwealth: e.g. India, Canada, Nigeria)",
      at: cue("who", "British") - 4,
    },
    {
      key: "register",
      icon: <IdCardIcon size={64} />,
      tile: C.paperDeep,
      title: "Register first",
      sub: "and bring photo ID to the polling station",
      at: cue("who", "UK") - 2,
    },
    {
      key: "abroad",
      icon: <GlobeIcon size={62} />,
      tile: C.paperDeep,
      title: "British citizens abroad",
      sub: "can vote from overseas",
      at: cue("who", "Britons") - 4,
    },
  ];

  return (
    <Card top={360} height={770} style={{ padding: "34px 40px", ...riseStyle(card, exit) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
        <div style={{ borderRadius: 6, overflow: "hidden", boxShadow: `0 0 0 2px ${C.line}`, lineHeight: 0 }}>
          <UnionFlag width={64} blue={UK.blue} white={C.white} red={UK.red} id="who-flag" />
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 4, color: C.ink }}>WHO CAN VOTE?</div>
      </div>
      {rows.map((row, i) => {
        const p = pop(frame, row.at);
        return (
          <div
            key={row.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "22px 0",
              borderTop: i === 0 ? "none" : `2px solid ${C.line}`,
              opacity: Math.min(1, p * 1.4),
              transform: `translateX(${(1 - p) * 40}px)`,
            }}
          >
            <IconTile size={96} bg={row.tile}>
              {row.icon}
            </IconTile>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: theme.font }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: C.ink, letterSpacing: -0.8 }}>{row.title}</div>
              <div style={{ fontSize: 29, fontWeight: 600, color: C.inkSoft, lineHeight: 1.3 }}>{row.sub}</div>
            </div>
          </div>
        );
      })}
    </Card>
  );
};
