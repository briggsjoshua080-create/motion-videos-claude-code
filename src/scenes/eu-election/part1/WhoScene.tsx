import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { EuFlag } from "../../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../../components/explainer/motion";
import { EU, PALETTE as C, type SceneProps } from "../constants";
import { Card, IconTile } from "../ui";

const HouseIcon: React.FC = () => (
  <svg width={58} height={58} viewBox="0 0 60 60">
    <g stroke={C.ink} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
      <path d="M8 28 L30 9 L52 28" fill="none" />
      <path d="M14 25 V52 H46 V25" fill={C.card} />
      <rect x={25} y={36} width={10} height={16} fill={EU.bluePale} />
    </g>
  </svg>
);

const GlobeIcon: React.FC = () => (
  <svg width={58} height={58} viewBox="0 0 60 60">
    <g stroke={C.ink} strokeWidth={3.5} fill="none">
      <circle cx={30} cy={30} r={22} fill={C.card} />
      <ellipse cx={30} cy={30} rx={10} ry={22} />
      <path d="M8 30 H52 M12 19 H48 M12 41 H48" />
    </g>
  </svg>
);

type Row = { key: string; icon: React.ReactNode; tile: string; title: string; sub: React.ReactNode; at: number };

/**
 * "EU citizens can vote from 18, or 16 in some countries, wherever in the EU they live."
 * The "Who can vote?" card: age, compulsory voting, living in another EU country, living abroad.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 0);
  const sixteen = progress(frame, cue("who", "16") - 3, cue("who", "16") + 6);

  const rows: Row[] = [
    {
      key: "age",
      icon: <div style={{ fontSize: 36, fontWeight: 900, color: C.ink, letterSpacing: -1 }}>18+</div>,
      tile: EU.yellow,
      title: "EU citizens aged 18+",
      sub: (
        <span>
          <span
            style={{
              padding: "0 8px",
              borderRadius: 8,
              background: interpolateColors(sixteen, [0, 1], ["rgba(255,229,138,0)", EU.yellowSoft]),
              color: C.ink,
              fontWeight: 800,
            }}
          >
            16+ in Austria, Belgium, Germany, Malta
          </span>
          <br />
          17+ in Greece
        </span>
      ),
      at: cue("who", "EU") - 4,
    },
    {
      key: "compulsory",
      icon: <div style={{ fontSize: 44, fontWeight: 900, color: C.white }}>!</div>,
      tile: EU.blue,
      title: "Voting is compulsory in",
      sub: "Belgium, Bulgaria, Luxembourg and Greece",
      at: cue("who", "countries") - 2,
    },
    {
      key: "eu",
      icon: <HouseIcon />,
      tile: C.paperDeep,
      title: "Living in another EU country?",
      sub: "Vote there or for your home country, but only once",
      at: cue("who", "wherever") - 4,
    },
    {
      key: "abroad",
      icon: <GlobeIcon />,
      tile: C.paperDeep,
      title: "Living outside the EU?",
      sub: "Most EU countries let you vote from abroad",
      at: cue("who", "EU#2") - 4,
    },
  ];

  return (
    <Card top={352} height={800} style={{ padding: "34px 40px", ...riseStyle(card, exit) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
        <div style={{ borderRadius: 6, overflow: "hidden", boxShadow: `0 0 0 2px ${C.line}`, lineHeight: 0 }}>
          <EuFlag width={60} blue={EU.blue} yellow={EU.yellow} />
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
              <div style={{ fontSize: 30, fontWeight: 600, color: C.inkSoft, lineHeight: 1.3 }}>{row.sub}</div>
            </div>
          </div>
        );
      })}
    </Card>
  );
};
