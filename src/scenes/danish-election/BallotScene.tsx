import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { DrawnCross, FlagChip, RedPencil } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CARD_SHADOW, DK, PALETTE as C, TINT, type SceneProps } from "./constants";
import { Pill } from "./ui";

/** The ballot (760 x 640 px), in ballot coordinates: one long sheet, each party followed by its candidates. */
const W = 760;
const H = 640;
const POS = { x: 160, y: 352 } as const;
const HEADER = 78;
const ROW = 50;
const BOX = 38;
const BOX_X = W - 40 - BOX;

type Line = { kind: "party"; letter: string; name: string; tint: string; soft: string } | { kind: "cand"; name: string };
/** Made-up parties and candidates. */
const LINES: Line[] = [
  { kind: "party", letter: "A", name: "Party A", tint: TINT.a, soft: TINT.aSoft },
  { kind: "cand", name: "Søren Madsen" },
  { kind: "cand", name: "Hanne Lund" },
  { kind: "party", letter: "B", name: "Party B", tint: TINT.b, soft: TINT.bSoft },
  { kind: "cand", name: "Line Holm" },
  { kind: "cand", name: "Kasper Bach" },
  { kind: "cand", name: "Mette Krogh" },
  { kind: "party", letter: "C", name: "Party C", tint: TINT.c, soft: TINT.cSoft },
  { kind: "cand", name: "Jens Dahl" },
  { kind: "cand", name: "Ida Vinther" },
];
const PARTY_ROW = 3;
const CAND_ROW = 4;
const rowTop = (i: number) => HEADER + 18 + i * ROW;
const markAt = (i: number) => ({ x: BOX_X + BOX / 2, y: rowTop(i) + ROW / 2 });

const Ballot: React.FC<{ partyMark: number; partyGhost: number; candMark: number; hiParty: number; hiCand: number }> = ({
  partyMark,
  partyGhost,
  candMark,
  hiParty,
  hiCand,
}) => (
  <div style={{ position: "relative", width: W, height: H, fontFamily: theme.font }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: C.card, boxShadow: CARD_SHADOW, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 28, right: 28, top: 0, height: HEADER, display: "flex", alignItems: "center", gap: 16, borderBottom: `3px solid ${C.ink}` }}>
        <FlagChip width={44} palette={C} />
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 3, color: C.ink }}>BALLOT · FOLKETING</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 22, fontWeight: 700, color: C.inkSoft, letterSpacing: 1 }}>one sheet</div>
      </div>
      {LINES.map((line, i) => {
        const hi = i === PARTY_ROW ? hiParty : i === CAND_ROW ? hiCand : 0;
        const isParty = line.kind === "party";
        return (
          <div
            key={line.name}
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              top: rowTop(i),
              height: ROW - 4,
              borderRadius: 10,
              background: isParty ? interpolateColors(hi, [0, 1], [line.soft, "#FFF6E3"]) : interpolateColors(hi, [0, 1], ["rgba(255,255,255,0)", "#FFF6E3"]),
              boxShadow: `inset 0 0 0 3px ${interpolateColors(hi, [0, 1], ["rgba(255,255,255,0)", TINT.b])}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: isParty ? "0 18px" : "0 18px 0 74px",
            }}
          >
            {isParty ? (
              <>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: line.tint, color: C.white, fontSize: 24, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {line.letter}
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: C.ink }}>{line.name}</div>
              </>
            ) : (
              <div style={{ fontSize: 28, fontWeight: i === CAND_ROW ? 800 : 600, color: C.ink }}>{line.name}</div>
            )}
          </div>
        );
      })}
      {/* A box at the end of every line */}
      {LINES.map((line, i) => (
        <div
          key={`box-${line.name}`}
          style={{ position: "absolute", left: BOX_X, top: rowTop(i) + (ROW - 4 - BOX) / 2, width: BOX, height: BOX, borderRadius: 6, border: `3px solid ${C.ink}`, boxSizing: "border-box", background: C.white }}
        />
      ))}
    </div>
    {/* Crosses: first next to the party, then (instead) next to a candidate */}
    <div style={{ position: "absolute", left: markAt(PARTY_ROW).x - 30, top: markAt(PARTY_ROW).y - 32, opacity: 1 - 0.75 * partyGhost }}>
      <DrawnCross size={60} p={partyMark} color={C.ink} stroke={5.5} />
    </div>
    <div style={{ position: "absolute", left: markAt(CAND_ROW).x - 30, top: markAt(CAND_ROW).y - 32 }}>
      <DrawnCross size={60} p={candMark} color={C.ink} stroke={5.5} />
    </div>
    <div
      style={{
        position: "absolute",
        left: BOX_X - 92,
        top: (markAt(PARTY_ROW).y + markAt(CAND_ROW).y) / 2 - 20,
        padding: "4px 14px",
        borderRadius: 999,
        background: DK.red,
        color: C.white,
        fontSize: 24,
        fontWeight: 900,
        letterSpacing: 2,
        opacity: Math.min(1, partyGhost * 1.4),
        transform: `scale(${0.6 + 0.4 * partyGhost})`,
      }}
    >
      OR
    </div>
  </div>
);

const PENCIL_LENGTH = 300;

/**
 * "On the ballot, you put one cross: next to a party, or next to one of its candidates."
 * The Folketing ballot (made-up parties): one sheet with each party followed by its candidates. The
 * pencil crosses party B, then shows the other option: a cross next to one of B's candidates.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const ballotIn = rise(frame, 0);
  const chamber = pop(frame, cue("ballot", "ballot") - 4);

  const t1 = cue("ballot", "next");
  const t2 = cue("ballot", "next#2");
  const partyMark = progress(frame, t1, cue("ballot", "party") + 6);
  const partyGhost = progress(frame, cue("ballot", "or") - 2, cue("ballot", "or") + 8);
  const candMark = progress(frame, t2 + 4, cue("ballot", "candidates") + 4);
  const hiParty = progress(frame, cue("ballot", "a") - 4, cue("ballot", "party") + 4) * (1 - partyGhost);
  const hiCand = progress(frame, t2, cue("ballot", "candidates") + 4);
  const line1 = rise(frame, cue("ballot", "cross") - 2);
  const line2 = rise(frame, cue("ballot", "candidates") - 2);
  const line3 = rise(frame, cue("ballot", "candidates") + 10);

  // The pencil: in from the bottom right, to the party box, then down to the candidate box, then away.
  const pA = { x: POS.x + markAt(PARTY_ROW).x, y: POS.y + markAt(PARTY_ROW).y };
  const pB = { x: POS.x + markAt(CAND_ROW).x, y: POS.y + markAt(CAND_ROW).y };
  const start = { x: 1060, y: 1300 };
  const away = { x: 1100, y: 1320 };
  const reach = progress(frame, t1 - 14, t1);
  const move = progress(frame, cue("ballot", "or") - 2, t2 + 4);
  const leave = progress(frame, cue("ballot", "candidates") + 6, cue("ballot", "candidates") + 20);
  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({ x: interpolate(t, [0, 1], [a.x, b.x]), y: interpolate(t, [0, 1], [a.y, b.y]) });
  const tip = leave > 0 ? lerp(pB, away, leave) : move > 0 ? lerp(pA, pB, move) : lerp(start, pA, reach);
  const drawing = (partyMark > 0 && partyMark < 1) || (candMark > 0 && candMark < 1);
  const wobble = drawing ? Math.sin(frame * 1.6) * 4 : 0;
  const pencilOn = Math.min(1, reach * 3) * (1 - leave) * (1 - exit);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: 292, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={chamber} bg={C.ink} color={C.white} size={26} style={{ letterSpacing: 1 }}>
          FOLKETING · Denmark's parliament
        </Pill>
      </div>

      <div style={{ position: "absolute", left: POS.x, top: POS.y, ...riseStyle(ballotIn, exit, 50) }}>
        <Ballot partyMark={partyMark} partyGhost={partyGhost} candMark={candMark} hiParty={hiParty} hiCand={hiCand} />
      </div>

      {/* What the cross means */}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: POS.y + H + 26,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          fontFamily: theme.font,
          opacity: 1 - exit,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color: C.ink, letterSpacing: -1, whiteSpace: "nowrap", ...riseStyle(line1, 0, 20) }}>
          <span style={{ color: DK.red }}>1 cross</span>: a party <span style={{ color: DK.red }}>or</span> a candidate
        </div>
        <div style={{ fontSize: 29, fontWeight: 700, color: C.ink, whiteSpace: "nowrap", ...riseStyle(line2, 0, 16) }}>
          A vote for <span style={{ fontWeight: 800 }}>Line Holm</span> also counts for <span style={{ color: TINT.bDeep, fontWeight: 800 }}>party B</span>
        </div>
        <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap", ...riseStyle(line3, 0, 12) }}>Two crosses: the vote doesn't count</div>
      </div>

      {/* The pencil */}
      <div style={{ position: "absolute", left: tip.x + wobble, top: tip.y, opacity: pencilOn }}>
        <RedPencil length={PENCIL_LENGTH} palette={C} color={DK.charcoal} lead={C.ink} />
      </div>
    </>
  );
};
