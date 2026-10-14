import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { FlagChip } from "../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { PALETTE as C, PL, type SceneProps } from "./constants";
import { AbroadIcon, Card, HomeVoteIcon, IconTile, IdCardIcon } from "./ui";

type Row = { key: string; icon: React.ReactNode; tile: string; title: string; sub: string; at: number };

const CARD = { top: 352, height: 640 } as const;

/**
 * "Who can vote? Polish citizens from 18, at home or abroad."
 * The "Who can vote?" card: citizenship, age, voting at home, voting abroad; not compulsory; EU
 * citizens living in Poland only vote in local and EU elections.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 0);
  const optional = pop(frame, cue("who", "vote") + 2);
  const note = rise(frame, cue("who", "home") - 2);

  const rows: Row[] = [
    {
      key: "citizens",
      icon: <IdCardIcon size={60} />,
      tile: C.paperDeep,
      title: "Polish citizens",
      sub: "on the voter register automatically",
      at: cue("who", "Polish") - 4,
    },
    {
      key: "age",
      icon: <div style={{ fontSize: 36, fontWeight: 900, color: C.white, letterSpacing: -1 }}>18+</div>,
      tile: PL.red,
      title: "Aged 18 or over",
      sub: "on election day",
      at: cue("who", "18") - 4,
    },
    {
      key: "home",
      icon: <HomeVoteIcon size={60} />,
      tile: C.paperDeep,
      title: "At home",
      sub: "at a polling station, or by post or\nproxy if 60+ or disabled",
      at: cue("who", "home") - 3,
    },
    {
      key: "abroad",
      icon: <AbroadIcon size={60} />,
      tile: C.paperDeep,
      title: "Abroad",
      sub: "sign up with a consulate first;\nthe votes are counted in Warsaw",
      at: cue("who", "abroad") - 3,
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
                <div style={{ fontSize: 38, fontWeight: 800, color: C.ink, letterSpacing: -0.8 }}>{row.title}</div>
                <div style={{ fontSize: 27, fontWeight: 600, color: C.inkSoft, lineHeight: 1.25, whiteSpace: "pre-line" }}>{row.sub}</div>
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
        EU citizens living in Poland can vote
        <br />
        only in <span style={{ color: C.ink, fontWeight: 800 }}>local and EU elections</span>
      </div>
    </>
  );
};
