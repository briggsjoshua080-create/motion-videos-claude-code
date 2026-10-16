import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { FlagChip } from "../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { PALETTE as C, PT, type SceneProps } from "./constants";
import { AbroadIcon, BrazilFlag, Card, IconTile, IdCardIcon } from "./ui";

type Row = { key: string; icon: React.ReactNode; tile: string; title: string; sub: string; at: number };

const CARD = { top: 340, height: 690 } as const;

/**
 * "Who can vote? Portuguese citizens from 18, even abroad, plus Brazilians living here with equal
 * rights."
 * The "Who can vote?" card: citizens (on the voter roll automatically), 18+, Portuguese abroad (by
 * post or at a consulate, 4 seats of their own), and Brazilians with the equal-rights status; not
 * compulsory; early voting a week before, in any town.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 0);
  const optional = pop(frame, cue("who", "vote") + 2);
  const note = rise(frame, cue("who", "rights") - 2);

  const rows: Row[] = [
    {
      key: "citizens",
      icon: <IdCardIcon size={60} />,
      tile: C.paperDeep,
      title: "Portuguese citizens",
      sub: "on the voter roll automatically",
      at: cue("who", "Portuguese") - 4,
    },
    {
      key: "age",
      icon: <div style={{ fontSize: 36, fontWeight: 900, color: C.white, letterSpacing: -1 }}>18+</div>,
      tile: PT.green,
      title: "Aged 18 or over",
      sub: "on election day",
      at: cue("who", "18") - 4,
    },
    {
      key: "abroad",
      icon: <AbroadIcon size={60} />,
      tile: C.paperDeep,
      title: "Living abroad, too",
      sub: "by post or at a consulate;\nthey elect 4 MPs of their own",
      at: cue("who", "abroad") - 4,
    },
    {
      key: "brazil",
      icon: <BrazilFlag width={62} />,
      tile: C.paperDeep,
      title: "Brazilians living in Portugal",
      sub: "with the \"equal political rights\" status\n(after 3 years living here)",
      at: cue("who", "Brazilians") - 4,
    },
  ];

  return (
    <>
      <Card top={CARD.top} height={CARD.height} style={{ padding: "30px 40px", ...riseStyle(card, exit) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 6 }}>
          <FlagChip width={64} palette={C} />
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 4, color: C.ink, whiteSpace: "nowrap" }}>WHO CAN VOTE?</div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 12,
              background: C.paperDeep,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 1.5,
              color: C.inkSoft,
              whiteSpace: "nowrap",
              opacity: Math.min(1, optional * 1.4),
              transform: `scale(${0.7 + 0.3 * optional})`,
            }}
          >
            NOT COMPULSORY
          </div>
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
                padding: "15px 0",
                borderTop: i === 0 ? "none" : `2px solid ${C.line}`,
                opacity: Math.min(1, p * 1.4),
                transform: `translateX(${(1 - p) * 40}px)`,
              }}
            >
              <IconTile size={88} bg={row.tile}>
                {row.icon}
              </IconTile>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: theme.font }}>
                <div style={{ fontSize: 38, fontWeight: 800, color: C.ink, letterSpacing: -0.8, whiteSpace: "nowrap" }}>{row.title}</div>
                <div style={{ fontSize: 26, fontWeight: 600, color: C.inkSoft, lineHeight: 1.25, whiteSpace: "pre-line" }}>{row.sub}</div>
              </div>
            </div>
          );
        })}
      </Card>

      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: CARD.top + CARD.height + 26,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 26,
          fontWeight: 600,
          color: C.inkSoft,
          lineHeight: 1.35,
          ...riseStyle(note, exit, 12),
        }}
      >
        Busy on the day? <span style={{ color: C.ink, fontWeight: 800 }}>Vote early</span>, a week before,
        <br />
        in any town in Portugal (sign up online first)
      </div>
    </>
  );
};
