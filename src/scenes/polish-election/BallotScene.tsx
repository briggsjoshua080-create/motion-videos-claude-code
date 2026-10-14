import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { DrawnCross, FlagChip, RedPencil } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CARD_SHADOW, LIST_B, PALETTE as C, PL, TINT, VOTED_CANDIDATE, type SceneProps } from "./constants";
import { Pill } from "./ui";

/** The booklet (760 x 600 px) and its parts, in booklet coordinates. */
const W = 760;
const H = 600;
const POS = { x: 150, y: 392 } as const;
const HEADER = 78;
const BAND = { top: 98, height: 64 } as const;
const ROW = { top: 180, height: 64, box: 42 } as const;
const BOX_X = 34;
/** The open page is list 2 (party B); the tabs show the other lists in the booklet. */
const TABS = [
  { list: 1, tint: TINT.aSoft },
  { list: 2, tint: TINT.bSoft },
  { list: 3, tint: TINT.cSoft },
  { list: 4, tint: TINT.dSoft },
  { list: 5, tint: TINT.eSoft },
] as const;
const CANDIDATES = [...LIST_B, { no: 6, name: "Adam Mazur", crosses: 0 }];
const VOTED_ROW = CANDIDATES.findIndex((c) => c.no === VOTED_CANDIDATE);
/** Booklet coordinates of the voter's cross. */
const MARK = { x: BOX_X + ROW.box / 2, y: ROW.top + VOTED_ROW * ROW.height + ROW.height / 2 } as const;

/** A page behind the open one (the booklet has one page per list). */
const BackPage: React.FC<{ dx: number; dy: number; rotate: number }> = ({ dx, dy, rotate }) => (
  <div
    style={{
      position: "absolute",
      left: dx,
      top: dy,
      width: W,
      height: H,
      borderRadius: 22,
      background: C.card,
      boxShadow: "0 10px 28px rgba(20,32,43,0.12)",
      transform: `rotate(${rotate}deg)`,
    }}
  />
);

const Booklet: React.FC<{ mark: number; chosen: number }> = ({ mark, chosen }) => (
  <div style={{ position: "relative", width: W, height: H, fontFamily: theme.font }}>
    <BackPage dx={16} dy={12} rotate={2.2} />
    <BackPage dx={-8} dy={6} rotate={-1.4} />
    {/* Index tabs on the right edge: lists 1-5 */}
    {TABS.map((tab, i) => (
      <div
        key={tab.list}
        style={{
          position: "absolute",
          left: W - 12,
          top: 106 + i * 82,
          width: 50,
          height: 70,
          borderRadius: "0 12px 12px 0",
          background: tab.list === 2 ? TINT.b : tab.tint,
          boxShadow: "0 6px 14px rgba(20,32,43,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 10,
          boxSizing: "border-box",
          fontSize: 24,
          fontWeight: 800,
          color: tab.list === 2 ? C.white : C.inkSoft,
        }}
      >
        {tab.list}
      </div>
    ))}
    {/* The open page: list 2 */}
    <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: C.card, boxShadow: CARD_SHADOW, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 28, right: 28, top: 0, height: HEADER, display: "flex", alignItems: "center", gap: 16, borderBottom: `3px solid ${C.ink}` }}>
        <FlagChip width={44} palette={C} />
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 3, color: C.ink }}>BALLOT · SEJM</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 22, fontWeight: 700, color: C.inkSoft, letterSpacing: 1 }}>page 2: list 2</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          top: BAND.top,
          height: BAND.height,
          borderRadius: 12,
          background: TINT.bSoft,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "0 22px",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: TINT.bDeep }}>LIST 2</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: C.ink }}>Party B</div>
      </div>
      {CANDIDATES.map((cand, i) => {
        const hi = i === VOTED_ROW ? chosen : 0;
        return (
          <div
            key={cand.no}
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              top: ROW.top + i * ROW.height,
              height: ROW.height,
              borderRadius: 12,
              background: interpolateColors(hi, [0, 1], ["rgba(255,255,255,0)", "#FFF6E3"]),
              boxShadow: `inset 0 0 0 3px ${interpolateColors(hi, [0, 1], ["rgba(255,255,255,0)", TINT.b])}`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: MARK.x - 16 - ROW.box / 2,
                top: (ROW.height - ROW.box) / 2,
                width: ROW.box,
                height: ROW.box,
                borderRadius: 6,
                border: `3px solid ${C.ink}`,
                boxSizing: "border-box",
                background: C.white,
              }}
            />
            <div style={{ position: "absolute", left: 84, top: 0, height: ROW.height - 6, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: C.muted, width: 30 }}>{cand.no}.</span>
              <span style={{ fontSize: 30, fontWeight: i === VOTED_ROW ? 800 : 600, color: C.ink }}>{cand.name}</span>
            </div>
          </div>
        );
      })}
    </div>
    {/* The voter's cross */}
    <div style={{ position: "absolute", left: MARK.x - 34, top: MARK.y - 34 }}>
      <DrawnCross size={68} p={mark} color={C.ink} stroke={5.5} />
    </div>
  </div>
);

const PENCIL_LENGTH = 300;

/**
 * "For the Sejm, parliament's main house, you put one cross next to one candidate."
 * The Sejm ballot, a booklet with one page per party list (made-up parties): the cross goes next to
 * candidate 4 of party B; it counts for him and for his party.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const bookletIn = rise(frame, 0);
  const house = pop(frame, cue("ballot", "main") - 4);

  const tCross = cue("ballot", "cross");
  const reach = progress(frame, tCross - 14, tCross);
  const mark = progress(frame, tCross, cue("ballot", "next", "end"));
  const leave = progress(frame, cue("ballot", "next", "end") + 2, cue("ballot", "candidate") + 4);
  const chosen = progress(frame, cue("ballot", "one#2") - 4, cue("ballot", "candidate") + 4);
  const line1 = rise(frame, tCross - 2);
  const line2 = rise(frame, cue("ballot", "candidate") - 2);
  const line3 = rise(frame, cue("ballot", "candidate") + 8);

  const target = { x: POS.x + MARK.x, y: POS.y + MARK.y };
  const start = { x: 1060, y: 1300 };
  const away = { x: 1100, y: 1320 };
  const tip = {
    x: leave > 0 ? interpolate(leave, [0, 1], [target.x, away.x]) : interpolate(reach, [0, 1], [start.x, target.x]),
    y: leave > 0 ? interpolate(leave, [0, 1], [target.y, away.y]) : interpolate(reach, [0, 1], [start.y, target.y]),
  };
  const wobble = mark > 0 && mark < 1 ? Math.sin(mark * Math.PI * 8) * 4 : 0;
  const pencilOn = Math.min(1, reach * 3) * (1 - leave) * (1 - exit);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: 312, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={house} bg={C.ink} color={C.white} size={28} style={{ letterSpacing: 1 }}>
          SEJM · parliament's main house
        </Pill>
      </div>

      <div style={{ position: "absolute", left: POS.x, top: POS.y, ...riseStyle(bookletIn, exit, 50) }}>
        <Booklet mark={mark} chosen={chosen} />
      </div>

      {/* What the cross means */}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: POS.y + H + 34,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          fontFamily: theme.font,
          opacity: 1 - exit,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color: C.ink, letterSpacing: -1, whiteSpace: "nowrap", ...riseStyle(line1, 0, 20) }}>
          <span style={{ color: PL.red }}>1 cross</span> next to <span style={{ color: PL.red }}>1 candidate</span>
        </div>
        <div style={{ fontSize: 31, fontWeight: 700, color: C.ink, whiteSpace: "nowrap", ...riseStyle(line2, 0, 16) }}>
          = a vote for <span style={{ fontWeight: 800 }}>Jan Kowalski</span> and for <span style={{ color: TINT.bDeep, fontWeight: 800 }}>party B</span>
        </div>
        <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap", ...riseStyle(line3, 0, 12) }}>Crosses on two lists: the vote doesn't count</div>
      </div>

      {/* The pencil */}
      <div style={{ position: "absolute", left: tip.x + wobble, top: tip.y, opacity: pencilOn }}>
        <RedPencil length={PENCIL_LENGTH} palette={C} color={PL.charcoal} lead={C.ink} />
      </div>
    </>
  );
};
