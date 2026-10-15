import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Character } from "../../components/explainer/Character";
import { NameCard } from "../../components/explainer/NameCard";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DK, HAIR, PALETTE as C, TALK_DAYS, party, type SceneProps } from "./constants";
import { Badge, Card } from "./ui";

const KING = { left: 120, top: 300, size: 170 } as const;
const ROUNDS_CARD = { top: 500, height: 330, row: 84 } as const;
const DAYS_TOP = 852;
const PM_CARD = { top: 1010, height: 188 } as const;

/** The King as a generic cartoon (no likeness): crown, red robe with ermine collar, white sash. */
export const King: React.FC<{ size: number; id: string }> = ({ size, id }) => (
  <Character size={size} bg={DK.redSoft} palette={C} outfit="robe" clothes={DK.robe} sash={C.white} hair={HAIR.brown} hairStyle="receding" headwear="crown" jewels={[DK.gold, DK.red]} id={id} />
);

/** The Prime Minister as a generic cartoon (no likeness): blonde bob, dark suit. */
export const PrimeMinister: React.FC<{ size: number; id: string }> = ({ size, id }) => (
  <Character size={size} bg={DK.redSoft} palette={C} clothes={DK.suit} hair={HAIR.blonde} hairStyle="bob" id={id} />
);

const ROUNDS = [
  { date: "25 Mar", name: "Mette Frederiksen", party: party("A"), ok: false, outcome: "no deal" },
  { date: "8 May", name: "Troels Lund Poulsen", party: party("V"), ok: false, outcome: "no deal" },
  { date: "23 May", name: "Mette Frederiksen", party: party("A"), ok: true, outcome: "deal on 1 June" },
] as const;

/**
 * "The parties went to the King three times to pick a negotiator. After a record 69 days, Mette
 * Frederiksen formed a government."
 * The King's round: each party tells the King who should lead the talks. Three rounds (who led, and
 * how it ended), a day counter to 69, then the Prime Minister's card.
 */
export const TalksScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const king = pop(frame, cue("talks", "King") - 8);
  const kingText = rise(frame, cue("talks", "King") - 2);
  const card = rise(frame, cue("talks", "three") - 6);
  const rowAt = [cue("talks", "three") - 2, cue("talks", "times") + 2, cue("talks", "pick") + 2];
  const resultAt = [cue("talks", "negotiator") - 2, cue("talks", "negotiator") + 6, cue("talks", "negotiator") + 14];
  const daysIn = rise(frame, cue("talks", "After") - 4);
  const days = Math.round(TALK_DAYS * progress(frame, cue("talks", "After"), cue("talks", "days", "end")));
  const record = pop(frame, cue("talks", "record") + 4);
  const pm = pop(frame, cue("talks", "Mette") - 8);
  const name = progress(frame, cue("talks", "Mette") - 2, cue("talks", "Frederiksen", "end"));

  return (
    <>
      {/* The King and what a King's round is */}
      <div
        style={{
          position: "absolute",
          left: KING.left,
          top: KING.top,
          opacity: Math.min(1, king * 1.4) * (1 - exit),
          transform: `translateY(${-exit * 40}px) scale(${0.85 + 0.15 * king})`,
          filter: "drop-shadow(0 14px 24px rgba(20,32,43,0.16))",
        }}
      >
        <King size={KING.size} id="king-talks" />
      </div>
      <div style={{ position: "absolute", left: KING.left + KING.size + 30, top: KING.top + 22, width: 840 - KING.size - 30, fontFamily: theme.font, ...riseStyle(kingText, exit, 20) }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color: DK.red, whiteSpace: "nowrap" }}>THE KING'S ROUND</div>
        <div style={{ marginTop: 8, fontSize: 30, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>
          Each party tells the King who should lead the talks
        </div>
      </div>

      {/* Three rounds */}
      <Card top={ROUNDS_CARD.top} height={ROUNDS_CARD.height} style={{ padding: "24px 36px", ...riseStyle(card, exit) }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.muted }}>2026 · WHO LED THE TALKS</div>
        {ROUNDS.map((r, i) => {
          const p = pop(frame, rowAt[i]);
          const res = pop(frame, resultAt[i]);
          return (
            <div
              key={r.date}
              style={{
                position: "absolute",
                left: 36,
                right: 36,
                top: 68 + i * ROUNDS_CARD.row,
                height: ROUNDS_CARD.row,
                display: "flex",
                alignItems: "center",
                gap: 18,
                borderTop: i === 0 ? "none" : `2px solid ${C.line}`,
                opacity: Math.min(1, p * 1.4),
                transform: `translateX(${(1 - p) * 40}px)`,
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 22, background: C.ink, color: C.white, fontSize: 24, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: C.ink, whiteSpace: "nowrap", letterSpacing: -0.5, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 8, background: r.party.color }} />
                  {r.name}
                </div>
                <div style={{ fontSize: 22, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap" }}>
                  {r.date} · {r.party.name}
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: r.ok ? C.ink : DK.redDeep, whiteSpace: "nowrap", opacity: Math.min(1, res * 1.4) }}>{r.outcome}</div>
              <Badge size={48} ok={r.ok} p={res} />
            </div>
          );
        })}
      </Card>

      {/* 69 days: a record */}
      <div style={{ position: "absolute", left: 120, width: 840, top: DAYS_TOP, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 16, fontFamily: theme.font, ...riseStyle(daysIn, exit, 20) }}>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 1, color: DK.red }}>{days}</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>days of talks</div>
        <div
          style={{
            alignSelf: "center",
            padding: "6px 16px",
            borderRadius: 12,
            background: DK.red,
            color: C.white,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 2,
            opacity: Math.min(1, record * 1.4),
            transform: `scale(${0.6 + 0.4 * record}) rotate(-4deg)`,
          }}
        >
          RECORD
        </div>
      </div>

      <NameCard
        top={PM_CARD.top}
        height={PM_CARD.height}
        left={120}
        width={840}
        role="PRIME MINISTER"
        name="Mette Frederiksen"
        sub="leads the government · since 2019"
        cardP={pm}
        nameP={name}
        exitP={exit}
        palette={C}
        portrait={<PrimeMinister size={124} id="pm-talks" />}
      />
    </>
  );
};
