import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { DrawnArrow, DrawnCross, RedPencil } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CARD_SHADOW, IT, PALETTE as C, TINT, type SceneProps } from "./constants";
import { Pill } from "./ui";

/** The ballot, drawn at full size (840 x 470) and scaled down for the "two ballots" view. */
const W = 840;
const H = 470;
const BLOCK = { top: 100, height: 344, width: 384, gap: 24, candidate: 104, row: 120 } as const;
const blockLeft = (b: number) => 24 + b * (BLOCK.width + BLOCK.gap);
/** Two blocks: a local candidate on top, the parties that back them below (each with its short list). */
const BLOCKS = [
  { name: 200, parties: [{ id: "A", tint: TINT.a }, { id: "B", tint: TINT.b }] },
  { name: 170, parties: [{ id: "C", tint: TINT.c }, { id: "D", tint: TINT.d }] },
];
const SYMBOL = 70;
/** Party A's symbol, where the cross goes (ballot coordinates). */
const MARK = { x: blockLeft(0) + 24 + SYMBOL / 2, y: BLOCK.top + BLOCK.candidate + BLOCK.row / 2 } as const;
/** The "+1" tags sit at the right end of block 1: one on the candidate, one on party A. */
const PLUS_X = blockLeft(0) + BLOCK.width - 86;

const POSE = {
  /** Two ballots side by side. */
  chamberSmall: { x: 122, y: 560, s: 0.47, r: -4 },
  senateSmall: { x: 562, y: 576, s: 0.47, r: 4 },
  /** The Chamber ballot up close. */
  big: { x: 120, y: 452, s: 1, r: 0 },
} as const;

type Pose = { x: number; y: number; s: number; r: number };
const mix = (a: Pose, b: Pose, t: number): Pose => ({
  x: interpolate(t, [0, 1], [a.x, b.x]),
  y: interpolate(t, [0, 1], [a.y, b.y]),
  s: interpolate(t, [0, 1], [a.s, b.s]),
  r: interpolate(t, [0, 1], [a.r, b.r]),
});

const Bar: React.FC<{ left: number; top: number; width: number; height?: number; opacity?: number }> = ({ left, top, width, height = 12, opacity = 0.45 }) => (
  <div style={{ position: "absolute", left, top, width, height, borderRadius: height / 2, background: C.ink, opacity }} />
);

const Ballot: React.FC<{ title: string; paper: string; deep: string; partyHi?: number; candHi?: number; mark?: number }> = ({
  title,
  paper,
  deep,
  partyHi = 0,
  candHi = 0,
  mark = 0,
}) => (
  <div style={{ position: "relative", width: W, height: H, borderRadius: 22, background: paper, boxShadow: CARD_SHADOW, overflow: "hidden", fontFamily: theme.font }}>
    <div style={{ position: "absolute", left: 30, right: 30, top: 0, height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `3px solid ${deep}` }}>
      <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 3, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: deep, letterSpacing: 2 }}>BALLOT · 2022</div>
    </div>
    {BLOCKS.map((block, b) => (
      <div
        key={b}
        style={{
          position: "absolute",
          left: blockLeft(b),
          top: BLOCK.top,
          width: BLOCK.width,
          height: BLOCK.height,
          borderRadius: 14,
          border: `3px solid ${C.ink}`,
          background: C.white,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* The local candidate */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: BLOCK.width,
            height: BLOCK.candidate,
            background: b === 0 ? interpolateColors(candHi, [0, 1], [C.white, IT.greenSoft]) : C.white,
            borderBottom: `3px solid ${C.ink}`,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 22,
              top: 16,
              fontSize: 21,
              fontWeight: 800,
              letterSpacing: 2,
              color: b === 0 ? interpolateColors(candHi, [0, 1], [C.inkSoft, IT.greenDeep]) : C.inkSoft,
            }}
          >
            LOCAL CANDIDATE
          </div>
          <Bar left={22} top={56} width={block.name} height={20} opacity={0.8} />
        </div>
        {/* The parties backing them, each with its short list of names */}
        {block.parties.map((party, i) => {
          const top = BLOCK.candidate + i * BLOCK.row;
          const hi = b === 0 && i === 0 ? partyHi : 0;
          return (
            <div key={party.id} style={{ position: "absolute", left: 0, top, width: BLOCK.width, height: BLOCK.row, background: interpolateColors(hi, [0, 1], [C.white, TINT.aSoft]) }}>
              {i > 0 ? <div style={{ position: "absolute", left: 16, right: 16, top: 0, height: 2, background: C.line }} /> : null}
              <div
                style={{
                  position: "absolute",
                  left: 24,
                  top: (BLOCK.row - SYMBOL) / 2,
                  width: SYMBOL,
                  height: SYMBOL,
                  borderRadius: SYMBOL / 2,
                  background: party.tint,
                  border: `3px solid ${C.ink}`,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  fontWeight: 800,
                  color: C.ink,
                }}
              >
                {party.id}
              </div>
              <Bar left={116} top={34} width={170} />
              <Bar left={116} top={56} width={130} />
              <Bar left={116} top={78} width={150} />
            </div>
          );
        })}
      </div>
    ))}
    {/* The voter's cross on party A */}
    <div style={{ position: "absolute", left: MARK.x - 44, top: MARK.y - 44 }}>
      <DrawnCross size={88} p={mark} color={C.ink} stroke={5} />
    </div>
  </div>
);

const PENCIL_LENGTH = 300;

/**
 * "You get two ballots, one per house. A cross on a party also counts for its local candidate."
 * The pink Chamber ballot and the yellow Senate ballot; then the Chamber one up close: a cross on
 * party A also counts for the local candidate that A backs.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const fanIn = pop(frame, cue("ballot", "two") - 6);
  const labels = rise(frame, cue("ballot", "house") - 6);
  const zoom = progress(frame, cue("ballot", "A") - 14, cue("ballot", "A") + 4);
  const reach = progress(frame, cue("ballot", "A") - 6, cue("ballot", "cross") + 2);
  const mark = progress(frame, cue("ballot", "cross") + 2, cue("ballot", "party", "end"));
  const leave = progress(frame, cue("ballot", "also") - 2, cue("ballot", "counts") + 4);
  const partyHi = pop(frame, cue("ballot", "party") - 2);
  const plusParty = pop(frame, cue("ballot", "counts") - 4);
  const arrow = progress(frame, cue("ballot", "for"), cue("ballot", "local"));
  const candHi = progress(frame, cue("ballot", "local") - 4, cue("ballot", "local") + 6);
  const plusCand = pop(frame, cue("ballot", "local") - 2);
  const explain = rise(frame, cue("ballot", "counts"));
  const noSplit = rise(frame, cue("ballot", "candidate") + 2);

  const chamber = mix(POSE.chamberSmall, POSE.big, zoom);
  const senate = { ...POSE.senateSmall, x: POSE.senateSmall.x + zoom * 260 };
  const ballotIn = Math.min(1, fanIn * 1.4);

  // The pencil: comes in from the bottom right, draws the cross on party A, leaves.
  const target = { x: POSE.big.x + MARK.x, y: POSE.big.y + MARK.y };
  const tipX = interpolate(reach, [0, 1], [1060, target.x + 4]) + leave * 280 + Math.sin(mark * Math.PI * 8) * 4 * (1 - leave);
  const tipY = interpolate(reach, [0, 1], [1240, target.y + 6]) + leave * 200;
  const pencilOn = Math.min(1, reach * 3) * (1 - leave) * (1 - exit);

  // Screen positions of the two "+1" tags (on the big ballot) and the arrow between them.
  const plus = {
    x: POSE.big.x + PLUS_X,
    party: POSE.big.y + BLOCK.top + BLOCK.candidate + 38,
    candidate: POSE.big.y + BLOCK.top + 30,
  };

  return (
    <>
      {/* Senate ballot (yellow): slides away when the Chamber one comes close */}
      <div
        style={{
          position: "absolute",
          left: senate.x,
          top: senate.y,
          transformOrigin: "0 0",
          transform: `translateY(${(1 - fanIn) * 60}px) scale(${senate.s}) rotate(${senate.r}deg)`,
          opacity: ballotIn * (1 - zoom) * (1 - exit),
        }}
      >
        <Ballot title="SENATE" paper={IT.senateSoft} deep={IT.senate} />
      </div>
      {/* Chamber ballot (pink) */}
      <div
        style={{
          position: "absolute",
          left: chamber.x,
          top: chamber.y,
          transformOrigin: "0 0",
          transform: `translateY(${(1 - fanIn) * 60 - exit * 40}px) scale(${chamber.s}) rotate(${chamber.r}deg)`,
          opacity: ballotIn * (1 - exit),
        }}
      >
        <Ballot title="CHAMBER OF DEPUTIES" paper={IT.chamberSoft} deep={IT.chamber} partyHi={partyHi} candHi={candHi} mark={mark} />
      </div>

      {/* One ballot per house */}
      {[
        { x: POSE.chamberSmall.x + (W * POSE.chamberSmall.s) / 2, label: "Chamber of Deputies", color: IT.chamber },
        { x: POSE.senateSmall.x + (W * POSE.senateSmall.s) / 2, label: "Senate", color: IT.senate },
      ].map((l) => (
        <div
          key={l.label}
          style={{
            position: "absolute",
            left: l.x - 200,
            width: 400,
            top: 822,
            textAlign: "center",
            fontFamily: theme.font,
            fontSize: 36,
            fontWeight: 800,
            color: l.color,
            ...riseStyle(labels, Math.max(zoom, exit), 20),
          }}
        >
          {l.label}
        </div>
      ))}
      <div style={{ position: "absolute", left: 120, width: 840, top: 452, display: "flex", justifyContent: "center", opacity: 1 - Math.max(zoom, exit) }}>
        <Pill p={fanIn} bg={C.ink} color={C.white} size={32} style={{ letterSpacing: 2 }}>
          2 BALLOTS · 1 PER HOUSE
        </Pill>
      </div>

      {/* +1 for party A, and +1 for its local candidate */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - exit }}>
        <DrawnArrow x1={plus.x + 38} y1={plus.party - 6} x2={plus.x + 38} y2={plus.candidate + 50} p={arrow} color={IT.greenDeep} width={6} />
      </svg>
      <div style={{ position: "absolute", left: plus.x, top: plus.party, opacity: 1 - exit }}>
        <Pill p={plusParty} bg={TINT.aDeep} color={C.white} size={28}>
          +1
        </Pill>
      </div>
      <div style={{ position: "absolute", left: plus.x, top: plus.candidate, opacity: 1 - exit }}>
        <Pill p={plusCand} bg={IT.green} color={C.white} size={28}>
          +1
        </Pill>
      </div>

      {/* What the cross does */}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: POSE.big.y + H + 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          fontFamily: theme.font,
          ...riseStyle(explain, exit, 24),
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 800, color: C.ink, letterSpacing: -1, whiteSpace: "nowrap" }}>
          1 cross = <span style={{ color: TINT.aDeep }}>party A</span> + <span style={{ color: IT.greenDeep }}>its local candidate</span>
        </div>
        <div style={{ fontSize: 29, fontWeight: 600, color: C.inkSoft, opacity: noSplit, whiteSpace: "nowrap" }}>No split votes: party and candidate go together</div>
      </div>

      {/* The pencil */}
      <div style={{ position: "absolute", left: tipX, top: tipY, opacity: pencilOn }}>
        <RedPencil length={PENCIL_LENGTH} palette={C} color={IT.charcoal} lead={C.ink} />
      </div>
    </>
  );
};
