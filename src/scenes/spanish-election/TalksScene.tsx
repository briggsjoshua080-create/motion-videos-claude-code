import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import {
  COALITION_SEATS,
  ES,
  FEIJOO_NO,
  FEIJOO_YES,
  FIRST,
  MAJORITY,
  PALETTE as C,
  POSE,
  PSOE,
  RESULT_2023,
  SANCHEZ_NO,
  SANCHEZ_YES,
  type SceneProps,
} from "./constants";
import { PartyLeader, PrimeMinister } from "./characters";
import { Badge, Card } from "./ui";

const P = POSE.talks;
const RULE_TOP = P.cy + 16;
const ROW = { top: RULE_TOP + 64, height: 132, gap: 14 } as const;
const BACKED_TOP = ROW.top + 2 * (ROW.height + ROW.gap) + 10;
/** The parties besides the Socialists who voted for Sánchez. */
const BACKERS = RESULT_2023.filter((p) => p.sanchez && p.key !== "PSOE");

const VoteRow: React.FC<{
  top: number;
  p: number;
  res: number;
  exit: number;
  portrait: React.ReactNode;
  name: string;
  party: string;
  color: string;
  date: string;
  yes: number;
  no: number;
  ok: boolean;
}> = ({ top, p, res, exit, portrait, name, party, color, date, yes, no, ok }) => (
  <Card top={top} height={ROW.height} style={{ padding: "0 28px", display: "flex", alignItems: "center", gap: 22, opacity: Math.min(1, p * 1.4) * (1 - exit), transform: `translateX(${(1 - p) * 50}px)` }}>
    {portrait}
    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
      <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, letterSpacing: -0.6, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.inkSoft, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: color }} />
        {party} · {date}
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", opacity: Math.min(1, res * 1.4) }}>
      <div style={{ fontSize: 30, fontWeight: 800, color: ok ? C.ink : ES.redDeep, whiteSpace: "nowrap" }}>
        {yes} yes · {no} no
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.inkSoft, whiteSpace: "nowrap" }}>{ok ? "elected" : "not elected"}</div>
    </div>
    <Badge size={52} ok={ok} p={res} />
  </Card>
);

/**
 * "Its leader, Feijóo, lost the vote. Pedro Sánchez of the Socialists won it, backed by Sumar and
 * regional parties."
 * The investiture votes (seats lit in CongressLayer above): Feijóo 172 yes, 178 no (27 Sep 2023);
 * Sánchez 179 yes, 171 no (16 Nov 2023), backed by Sumar, Catalan, Basque, Galician and Canarian
 * parties; then the coalition government of the Socialists and Sumar.
 */
export const TalksScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const rule = rise(frame, 4);
  const row1 = pop(frame, cue("talks", "leader") - 4);
  const res1 = pop(frame, cue("talks", "lost") - 2);
  const row2 = pop(frame, cue("talks", "Pedro") - 6);
  const res2 = pop(frame, cue("talks", "won") - 2);
  const backed = rise(frame, cue("talks", "backed") - 8);
  const regional = cue("talks", "regional") - 4;
  const coalition = pop(frame, cue("talks", "regional") + 4);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: RULE_TOP, textAlign: "center", fontFamily: theme.font, fontSize: 25, fontWeight: 700, color: C.inkSoft, whiteSpace: "nowrap", ...riseStyle(rule, exit, 12) }}>
        Congress votes on a candidate: <span style={{ color: C.ink, fontWeight: 800 }}>{MAJORITY} yes</span>, or more yes than no in a 2nd vote
      </div>

      <VoteRow
        top={ROW.top}
        p={row1}
        res={res1}
        exit={exit}
        portrait={<PartyLeader size={100} id="feijoo" />}
        name="Alberto Núñez Feijóo"
        party="People's Party"
        color={FIRST.color}
        date="Sep 2023"
        yes={FEIJOO_YES}
        no={FEIJOO_NO}
        ok={false}
      />
      <VoteRow
        top={ROW.top + ROW.height + ROW.gap}
        p={row2}
        res={res2}
        exit={exit}
        portrait={<PrimeMinister size={100} id="pm-talks" />}
        name="Pedro Sánchez"
        party="Socialists (PSOE)"
        color={PSOE.color}
        date="16 Nov 2023"
        yes={SANCHEZ_YES}
        no={SANCHEZ_NO}
        ok
      />

      {/* Who backed him */}
      <div style={{ position: "absolute", left: 120, width: 840, top: BACKED_TOP, fontFamily: theme.font, ...riseStyle(backed, exit, 16) }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 3, color: C.muted, textAlign: "center" }}>BACKED BY</div>
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {BACKERS.map((p, i) => {
            const v = pop(frame, i === 0 ? cue("talks", "Sumar") - 3 : regional + (i - 1) * 2);
            return (
              <div
                key={p.key}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: C.card,
                  boxShadow: "0 8px 20px rgba(20,32,43,0.12)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 24,
                  fontWeight: 800,
                  color: C.ink,
                  whiteSpace: "nowrap",
                  opacity: Math.min(1, v * 1.4),
                  transform: `scale(${0.6 + 0.4 * v})`,
                }}
              >
                <span style={{ width: 14, height: 14, borderRadius: 7, background: p.color }} />
                {p.name} {p.seats}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 25,
            fontWeight: 700,
            color: C.inkSoft,
            whiteSpace: "nowrap",
            opacity: Math.min(1, coalition * 1.4),
          }}
        >
          Government: <span style={{ color: C.ink, fontWeight: 800 }}>Socialists + Sumar</span> ({COALITION_SEATS} seats, no majority of their own)
        </div>
      </div>
    </>
  );
};
