import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { DrawnCross, FlagChip, RedPencil } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AT, CARD_SHADOW, PALETTE as C, TINT, type SceneProps } from "./constants";
import { Pill } from "./ui";

/** The ballot (840 x 640 px) and its parts, in ballot coordinates. */
const W = 840;
const H = 640;
const POS = { x: 120, y: 384 } as const;
const COL = { top: 96, width: 256, gap: 20, left: 16 } as const;
const colLeft = (i: number) => COL.left + i * (COL.width + COL.gap);
/** Rows inside a column (offsets from the column top). */
const ROW = {
  list: 12,
  name: 40,
  nameH: 56,
  circle: 142,
  rule1: 188,
  federalLabel: 198,
  federal: 222,
  stateLabel: 274,
  state: 298,
  fieldH: 42,
  rule2: 354,
  regionalLabel: 364,
  regional: 392,
  regionalH: 42,
} as const;
const PARTIES = [
  { id: "A", list: 1, tint: TINT.aSoft },
  { id: "B", list: 2, tint: TINT.bSoft },
  { id: "C", list: 3, tint: TINT.cSoft },
] as const;
/** The voter picks party B (the middle column). */
const VOTED = 1;
const CIRCLE_R = 30;
const SMALL_R = 12;

/** Ballot coordinates of the four marks: the party cross, the two names written in, the regional cross. */
const MARK = {
  party: { x: colLeft(VOTED) + COL.width / 2, y: COL.top + ROW.circle },
  federal: { x: colLeft(VOTED) + 22, y: COL.top + ROW.federal + ROW.fieldH / 2 },
  state: { x: colLeft(VOTED) + 22, y: COL.top + ROW.state + ROW.fieldH / 2 },
  regional: { x: colLeft(VOTED) + 30, y: COL.top + ROW.regional + ROW.regionalH * 1.5 },
} as const;

const Bar: React.FC<{ left: number; top: number; width: number; height?: number; opacity?: number }> = ({ left, top, width, height = 12, opacity = 0.45 }) => (
  <div style={{ position: "absolute", left, top, width, height, borderRadius: height / 2, background: C.ink, opacity }} />
);

const Label: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: "absolute", left: 14, top, fontSize: 17, fontWeight: 800, letterSpacing: 1.5, color: C.inkSoft, whiteSpace: "nowrap" }}>{children}</div>
);

/** Handwriting in a write-in field, revealed left to right. */
const Written: React.FC<{ text: string; p: number }> = ({ text, p }) => (
  <div
    style={{
      position: "absolute",
      left: 16,
      top: 3,
      fontSize: 28,
      fontWeight: 700,
      fontStyle: "italic",
      color: AT.navy,
      whiteSpace: "nowrap",
      clipPath: `inset(-10px ${(1 - p) * 100}% -10px -10px)`,
      opacity: p > 0.01 ? 1 : 0,
    }}
  >
    {text}
  </div>
);

const Ballot: React.FC<{ partyMark: number; voted: number; federal: number; state: number; regional: number }> = ({ partyMark, voted, federal, state, regional }) => (
  <div style={{ position: "relative", width: W, height: H, borderRadius: 22, background: C.card, boxShadow: CARD_SHADOW, overflow: "hidden", fontFamily: theme.font }}>
    <div style={{ position: "absolute", left: 28, right: 28, top: 0, height: 80, display: "flex", alignItems: "center", gap: 16, borderBottom: `3px solid ${C.ink}` }}>
      <FlagChip width={44} palette={C} />
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 3, color: C.ink }}>OFFICIAL BALLOT</div>
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 22, fontWeight: 700, color: C.inkSoft, letterSpacing: 1 }}>National Council election</div>
    </div>
    {PARTIES.map((party, i) => {
      const left = colLeft(i);
      const isVoted = i === VOTED;
      const hi = isVoted ? voted : 0;
      return (
        <div
          key={party.id}
          style={{
            position: "absolute",
            left,
            top: COL.top,
            width: COL.width,
            height: H - COL.top - 16,
            borderRadius: 14,
            border: `3px solid ${isVoted ? interpolateColors(hi, [0, 1], [C.ink, TINT.b]) : C.ink}`,
            background: interpolateColors(hi, [0, 1], [C.white, "#FFFBF3"]),
            boxSizing: "border-box",
          }}
        >
          <div style={{ position: "absolute", left: 0, right: 0, top: ROW.list, textAlign: "center", fontSize: 18, fontWeight: 800, letterSpacing: 2, color: C.muted }}>LIST {party.list}</div>
          <div
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              top: ROW.name,
              height: ROW.nameH,
              borderRadius: 10,
              background: party.tint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
              color: C.ink,
            }}
          >
            Party {party.id}
          </div>
          {/* The party circle */}
          <div
            style={{
              position: "absolute",
              left: COL.width / 2 - CIRCLE_R - 3,
              top: ROW.circle - CIRCLE_R - 3,
              width: CIRCLE_R * 2,
              height: CIRCLE_R * 2,
              borderRadius: CIRCLE_R + 3,
              border: `3px solid ${C.ink}`,
              background: C.white,
            }}
          />
          <div style={{ position: "absolute", left: 14, right: 14, top: ROW.rule1, height: 2, background: C.line }} />
          {/* Preference votes: a name or list number for the federal and the state list */}
          <Label top={ROW.federalLabel}>FEDERAL LIST</Label>
          <div style={{ position: "absolute", left: 14, right: 14, top: ROW.federal, height: ROW.fieldH, borderRadius: 8, border: `2.5px solid ${C.muted}`, boxSizing: "border-box", background: C.white }}>
            {isVoted ? <Written text="Huber" p={federal} /> : null}
          </div>
          <Label top={ROW.stateLabel}>STATE LIST</Label>
          <div style={{ position: "absolute", left: 14, right: 14, top: ROW.state, height: ROW.fieldH, borderRadius: 8, border: `2.5px solid ${C.muted}`, boxSizing: "border-box", background: C.white }}>
            {isVoted ? <Written text="No. 4" p={state} /> : null}
          </div>
          <div style={{ position: "absolute", left: 14, right: 14, top: ROW.rule2, height: 2, background: C.line }} />
          {/* Regional candidates: a small circle each */}
          <Label top={ROW.regionalLabel}>REGIONAL CANDIDATES</Label>
          {[0, 1, 2].map((r) => (
            <div key={r} style={{ position: "absolute", left: 0, top: ROW.regional + r * ROW.regionalH, width: COL.width, height: ROW.regionalH }}>
              <div
                style={{
                  position: "absolute",
                  left: 30 - SMALL_R - 2.5,
                  top: ROW.regionalH / 2 - SMALL_R - 2.5,
                  width: SMALL_R * 2,
                  height: SMALL_R * 2,
                  borderRadius: SMALL_R + 3,
                  border: `2.5px solid ${C.ink}`,
                  background: C.white,
                }}
              />
              <Bar left={56} top={ROW.regionalH / 2 - 6} width={[118, 96, 110][(r + i) % 3]} />
            </div>
          ))}
        </div>
      );
    })}
    {/* The voter's crosses: party B, and one of its regional candidates */}
    <div style={{ position: "absolute", left: MARK.party.x - 40, top: MARK.party.y - 40 }}>
      <DrawnCross size={80} p={partyMark} color={C.ink} stroke={5} />
    </div>
    <div style={{ position: "absolute", left: MARK.regional.x - 20, top: MARK.regional.y - 20 }}>
      <DrawnCross size={40} p={regional} color={C.ink} stroke={6} />
    </div>
  </div>
);

const PENCIL_LENGTH = 300;

/**
 * "You cross one party, and can also back up to three of its candidates."
 * The official ballot (made-up parties A–C): the cross goes on party B; then up to three preference
 * votes for B's candidates: a name for the federal list, a list number for the state list and a
 * cross next to a regional candidate.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const ballotIn = rise(frame, 0);

  // The pencil's stops (scene frames): party circle, federal field, state field, regional circle.
  const tCross = cue("ballot", "cross");
  const tFederal = cue("ballot", "also");
  const tState = cue("ballot", "three") - 2;
  const tRegional = cue("ballot", "its");
  const reach = progress(frame, tCross - 12, tCross);
  const partyMark = progress(frame, tCross, cue("ballot", "party", "end") - 4);
  const toFederal = progress(frame, cue("ballot", "party", "end"), tFederal);
  const federal = progress(frame, tFederal, tFederal + 14);
  const toState = progress(frame, tFederal + 14, tState);
  const state = progress(frame, tState, tState + 8);
  const toRegional = progress(frame, tState + 8, tRegional);
  const regional = progress(frame, tRegional, tRegional + 9);
  const leave = progress(frame, tRegional + 10, tRegional + 26);
  const voted = progress(frame, cue("ballot", "party") - 4, cue("ballot", "party") + 6);

  const plus = [pop(frame, tFederal + 12), pop(frame, tState + 7), pop(frame, tRegional + 8)];
  const line1 = rise(frame, cue("ballot", "party") - 2);
  const line2 = rise(frame, cue("ballot", "three") - 2);
  const line3 = rise(frame, cue("ballot", "candidates") + 2);

  // Pencil tip on screen: the stops, with a little scribble while it writes.
  const at = (m: { x: number; y: number }) => ({ x: POS.x + m.x, y: POS.y + m.y });
  const stops = [at(MARK.party), at(MARK.federal), at(MARK.state), at(MARK.regional)];
  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({ x: interpolate(t, [0, 1], [a.x, b.x]), y: interpolate(t, [0, 1], [a.y, b.y]) });
  let tip = lerp({ x: 1060, y: 1260 }, stops[0], reach);
  if (toFederal > 0) tip = lerp(stops[0], stops[1], toFederal);
  if (federal > 0) tip = { x: stops[1].x + federal * 86, y: stops[1].y + Math.sin(federal * Math.PI * 6) * 5 };
  if (toState > 0) tip = lerp({ x: stops[1].x + 86, y: stops[1].y }, stops[2], toState);
  if (state > 0) tip = { x: stops[2].x + state * 70, y: stops[2].y + Math.sin(state * Math.PI * 4) * 5 };
  if (toRegional > 0) tip = lerp({ x: stops[2].x + 70, y: stops[2].y }, stops[3], toRegional);
  if (leave > 0) tip = lerp(stops[3], { x: 1100, y: 1300 }, leave);
  const wobble = partyMark > 0 && partyMark < 1 ? Math.sin(partyMark * Math.PI * 8) * 4 : regional > 0 && regional < 1 ? Math.sin(regional * Math.PI * 8) * 3 : 0;
  const pencilOn = Math.min(1, reach * 3) * (1 - leave) * (1 - exit);

  // "+1" tags at the right end of the three preference votes (inside party B's column).
  const tags = [MARK.federal, MARK.state, MARK.regional].map((m) => ({ x: POS.x + colLeft(VOTED) + COL.width - 78, y: POS.y + m.y - 22 }));

  return (
    <>
      <div style={{ position: "absolute", left: POS.x, top: POS.y, ...riseStyle(ballotIn, exit, 50) }}>
        <Ballot partyMark={partyMark} voted={voted} federal={federal} state={state} regional={regional} />
      </div>

      {tags.map((t, i) => (
        <div key={i} style={{ position: "absolute", left: t.x, top: t.y, opacity: 1 - exit }}>
          <Pill p={plus[i]} bg={TINT.b} color={C.ink} size={22}>
            +1
          </Pill>
        </div>
      ))}

      {/* What the marks mean */}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: POS.y + H + 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          fontFamily: theme.font,
          opacity: 1 - exit,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color: C.ink, letterSpacing: -1, whiteSpace: "nowrap", ...riseStyle(line1, 0, 20) }}>
          1 cross = your vote for <span style={{ color: TINT.bDeep }}>party B</span>
        </div>
        <div style={{ fontSize: 31, fontWeight: 700, color: C.ink, whiteSpace: "nowrap", ...riseStyle(line2, 0, 16) }}>
          + up to <span style={{ color: TINT.bDeep, fontWeight: 800 }}>3 preference votes</span> for its candidates
        </div>
        <div style={{ fontSize: 26, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap", ...riseStyle(line3, 0, 12) }}>Enough of them move a candidate up the list</div>
      </div>

      {/* The pencil */}
      <div style={{ position: "absolute", left: tip.x + wobble, top: tip.y, opacity: pencilOn }}>
        <RedPencil length={PENCIL_LENGTH} palette={C} color={AT.charcoal} lead={C.ink} />
      </div>
    </>
  );
};
