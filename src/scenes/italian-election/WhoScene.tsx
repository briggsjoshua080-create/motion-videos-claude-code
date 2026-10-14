import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { FlagChip } from "../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { IT, PALETTE as C, type SceneProps } from "./constants";
import { AbroadIcon, Card, IconTile, IdCardIcon, VoterCardIcon } from "./ui";

type Row = { key: string; icon: React.ReactNode; tile: string; title: string; sub: string; at: number };

/**
 * "Who can vote? Italian citizens from 18, at home or abroad."
 * The "Who can vote?" card: citizenship (no sign-up), age, voting at home, voting from abroad.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 0);
  const duty = rise(frame, cue("who", "abroad", "end") - 2);

  const rows: Row[] = [
    {
      key: "citizens",
      icon: <IdCardIcon size={66} />,
      tile: C.paperDeep,
      title: "Italian citizens",
      sub: "on the voter roll automatically: no sign-up",
      at: cue("who", "Italian") - 4,
    },
    {
      key: "age",
      icon: <div style={{ fontSize: 38, fontWeight: 900, color: C.white, letterSpacing: -1 }}>18+</div>,
      tile: IT.green,
      title: "Aged 18 or over",
      sub: "for both houses (the Senate used to be 25+)",
      at: cue("who", "18") - 4,
    },
    {
      key: "home",
      icon: <VoterCardIcon size={66} />,
      tile: C.paperDeep,
      title: "At home",
      sub: "bring your voter card and an ID",
      at: cue("who", "home") - 3,
    },
    {
      key: "abroad",
      icon: <AbroadIcon size={66} />,
      tile: C.paperDeep,
      title: "Abroad: vote by post",
      sub: "for their own 8 deputies + 4 senators",
      at: cue("who", "abroad") - 3,
    },
  ];

  return (
    <Card top={364} height={800} style={{ padding: "34px 40px", ...riseStyle(card, exit) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 12 }}>
        <FlagChip width={64} palette={C} />
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
              padding: "20px 0",
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
      {/* Article 48 of the constitution */}
      <div
        style={{
          marginTop: 10,
          padding: "16px 22px",
          borderRadius: 16,
          background: IT.greenSoft,
          fontFamily: theme.font,
          fontSize: 28,
          fontWeight: 700,
          color: IT.greenDeep,
          textAlign: "center",
          ...riseStyle(duty, 0, 16),
        }}
      >
        Voting is a “civic duty”, but not compulsory
      </div>
    </Card>
  );
};
