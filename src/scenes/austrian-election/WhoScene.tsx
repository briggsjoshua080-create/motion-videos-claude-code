import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { FlagChip } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AT, PALETTE as C, type SceneProps } from "./constants";
import { AbroadIcon, Badge, Card, HomeVoteIcon, IconTile, IdCardIcon, PersonIcon } from "./ui";

type Row = { key: string; icon: React.ReactNode; tile: string; title: string; sub: string; at: number };

const CARD = { top: 352, height: 604 } as const;
const PANEL = { top: 974, height: 268 } as const;

/**
 * Five residents aged 16+, the last one greyed out with a cross from `out` on (0 -> 1).
 * Reused by the closing question.
 */
export const FivePeople: React.FC<{ size: number; shown: number; out: number; gap?: number }> = ({ size, shown, out, gap = 12 }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap }}>
    {Array.from({ length: 5 }, (_, i) => {
      const v = Math.min(1, Math.max(0, shown - i));
      const last = i === 4;
      return (
        <div
          key={i}
          style={{
            position: "relative",
            opacity: Math.min(1, v * 1.4),
            transform: `translateY(${(1 - v) * 24}px) scale(${0.7 + 0.3 * v})`,
          }}
        >
          <PersonIcon size={size} color={last ? interpolateColors(out, [0, 1], [AT.red, C.muted]) : AT.red} />
          {last ? <Badge size={size * 0.62} ok={false} p={out} style={{ position: "absolute", right: -size * 0.2, top: -size * 0.12 }} /> : null}
        </div>
      );
    })}
  </div>
);

/**
 * "Who can vote? Austrian citizens from 16, at home or abroad. That leaves out nearly one in five
 * residents over 16." The "Who can vote?" card (citizenship, age, home, abroad), then five residents
 * aged 16+ of whom one can't vote: nearly 1 in 5 aren't citizens.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 0);
  const optional = pop(frame, cue("who", "abroad", "end") - 2);

  const rows: Row[] = [
    {
      key: "citizens",
      icon: <IdCardIcon size={60} />,
      tile: C.paperDeep,
      title: "Austrian citizens",
      sub: "on the voter roll automatically",
      at: cue("who", "Austrian") - 4,
    },
    {
      key: "age",
      icon: <div style={{ fontSize: 36, fontWeight: 900, color: C.white, letterSpacing: -1 }}>16+</div>,
      tile: AT.red,
      title: "Aged 16 or over",
      sub: "first in Europe to vote at 16 (2007)",
      at: cue("who", "16") - 4,
    },
    {
      key: "home",
      icon: <HomeVoteIcon size={60} />,
      tile: C.paperDeep,
      title: "At home",
      sub: "at a polling station, or by post",
      at: cue("who", "home") - 3,
    },
    {
      key: "abroad",
      icon: <AbroadIcon size={60} />,
      tile: C.paperDeep,
      title: "Abroad",
      sub: "sign up first, then vote by post",
      at: cue("who", "abroad") - 3,
    },
  ];

  // Five residents aged 16+; the fifth can't vote.
  const panel = rise(frame, cue("noncitizens", "That") - 6);
  const people = progress(frame, cue("noncitizens", "That") - 4, cue("noncitizens", "out", "end"));
  const out = progress(frame, cue("noncitizens", "five") - 4, cue("noncitizens", "five") + 6);
  const share = pop(frame, cue("noncitizens", "one") - 3);
  const sub = rise(frame, cue("noncitizens", "residents") - 2);
  const small = rise(frame, cue("noncitizens", "16") + 2);

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
                <div style={{ fontSize: 28, fontWeight: 600, color: C.inkSoft, lineHeight: 1.25 }}>{row.sub}</div>
              </div>
            </div>
          );
        })}
      </Card>

      {/* Nearly 1 in 5 residents aged 16+ can't vote */}
      <Card top={PANEL.top} height={PANEL.height} style={{ padding: "26px 40px", ...riseStyle(panel, exit) }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <FivePeople size={70} shown={people * 5.2} out={out} gap={18} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              color: AT.red,
              whiteSpace: "nowrap",
              opacity: Math.min(1, share * 1.4),
              transform: `scale(${0.7 + 0.3 * share})`,
              transformOrigin: "100% 100%",
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 1 }}>nearly</div>
            <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 0.9 }}>1 in 5</div>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 30, fontWeight: 800, color: C.ink, whiteSpace: "nowrap", ...riseStyle(sub, 0, 14) }}>
          residents aged 16+ aren't citizens: no vote
        </div>
        <div style={{ marginTop: 6, fontSize: 23, fontWeight: 600, lineHeight: 1.3, color: C.inkSoft, whiteSpace: "nowrap", ...riseStyle(small, 0, 10) }}>
          About 1.5 million people. EU citizens among them
          <br />
          can still vote in local and EU elections.
        </div>
      </Card>
    </>
  );
};
