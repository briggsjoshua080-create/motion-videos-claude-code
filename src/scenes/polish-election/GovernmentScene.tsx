import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Character } from "../../components/explainer/Character";
import { NameCard } from "../../components/explainer/NameCard";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { GOVERNMENT_SEATS, HAIR, PALETTE as C, PARTY, PL, RESULT_2023, SEJM_POSE, type SceneProps } from "./constants";
import { Badge, Card } from "./ui";

const POSE = SEJM_POSE.govt;
const LEGEND_TOP = POSE.cy + 12;
const VOTES = { top: 694, height: 262, row: 92 } as const;
/** The Prime Minister's card. */
export const PM_CARD = { top: 974, height: 188 } as const;
const COALITION = RESULT_2023.filter((p) => p.gov);

/** The Prime Minister as a generic cartoon (no likeness): grey hair, dark suit, orange tie. */
export const PrimeMinister: React.FC<{ size: number; id: string }> = ({ size, id }) => (
  <Character size={size} bg={PL.redSoft} palette={C} clothes={PL.suit} tie={PARTY.ko} hair={HAIR.grey} hairStyle="side" id={id} />
);

/** One Sejm vote on a prime minister: who, whose pick, yes : no, and the outcome. */
const VoteRow: React.FC<{ i: number; name: string; sub: string; yes: number; no: number; ok: boolean; p: number; result: number }> = ({ i, name, sub, yes, no, ok, p, result }) => (
  <div
    style={{
      position: "absolute",
      left: 36,
      right: 36,
      top: 70 + i * VOTES.row,
      height: VOTES.row,
      display: "flex",
      alignItems: "center",
      gap: 18,
      borderTop: i === 0 ? "none" : `2px solid ${C.line}`,
      opacity: Math.min(1, p * 1.4),
      transform: `translateX(${(1 - p) * 40}px)`,
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
      <div style={{ fontSize: 31, fontWeight: 800, color: C.ink, whiteSpace: "nowrap", letterSpacing: -0.5 }}>{name}</div>
      <div style={{ fontSize: 23, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, whiteSpace: "nowrap", opacity: Math.min(1, result * 1.4) }}>
      <span style={{ fontSize: 36, fontWeight: 800, color: C.ink }}>{yes}</span>
      <span style={{ fontSize: 22, fontWeight: 700, color: C.inkSoft }}>yes</span>
      <span style={{ fontSize: 30, fontWeight: 800, color: C.muted, margin: "0 4px" }}>:</span>
      <span style={{ fontSize: 36, fontWeight: 800, color: PL.red }}>{no}</span>
      <span style={{ fontSize: 22, fontWeight: 700, color: C.inkSoft }}>no</span>
    </div>
    <Badge size={54} ok={ok} p={result} />
  </div>
);

/**
 * "The next three parties teamed up, voted down its prime minister, and elected Donald Tusk."
 * The half-circle (SejmLayer) shrinks to the top and keeps the coalition's 248 seats lit; the two
 * Sejm votes of 11 December 2023; the Prime Minister's card (it stays on screen into the President scene).
 */
export const GovernmentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const legend = rise(frame, cue("govt", "teamed") - 4);
  const card = rise(frame, cue("govt", "voted") - 10);
  const row1 = pop(frame, cue("govt", "voted") - 6);
  const result1 = pop(frame, cue("govt", "down") - 2);
  const row2 = pop(frame, cue("govt", "elected") - 6);
  const result2 = pop(frame, cue("govt", "Donald") - 2);
  const pm = pop(frame, cue("govt", "Donald") - 8);
  const name = progress(frame, cue("govt", "Donald") - 2, cue("govt", "Tusk", "end"));

  return (
    <>
      {/* The coalition: the next three parties */}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: LEGEND_TOP,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          fontFamily: theme.font,
          fontSize: 26,
          fontWeight: 800,
          color: C.ink,
          whiteSpace: "nowrap",
          ...riseStyle(legend, exit, 12),
        }}
      >
        {COALITION.map((p, k) => (
          <React.Fragment key={p.key}>
            {k > 0 ? <span style={{ color: C.muted }}>+</span> : null}
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 18, height: 18, borderRadius: 9, background: p.color }} />
              {p.name}
            </span>
          </React.Fragment>
        ))}
        <span style={{ color: C.muted }}>=</span>
        <span>{GOVERNMENT_SEATS} seats ✓</span>
      </div>

      <Card top={VOTES.top} height={VOTES.height} style={{ padding: "24px 36px", ...riseStyle(card, exit) }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.muted }}>11 DEC 2023 · SEJM VOTES</div>
        <VoteRow i={0} name="Mateusz Morawiecki (PiS)" sub="the president's pick" yes={190} no={266} ok={false} p={row1} result={result1} />
        <VoteRow i={1} name="Donald Tusk (KO)" sub="the Sejm's own pick" yes={248} no={201} ok p={row2} result={result2} />
      </Card>

      <NameCard
        top={PM_CARD.top}
        height={PM_CARD.height}
        role="PRIME MINISTER"
        name="Donald Tusk"
        sub="leads the government · since Dec 2023"
        cardP={pm}
        nameP={name}
        palette={C}
        portrait={<PrimeMinister size={124} id="pm-govt" />}
      />
    </>
  );
};
