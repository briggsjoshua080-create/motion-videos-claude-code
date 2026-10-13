import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { DrawnArrow } from "../../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../../components/explainer/motion";
import { CARD_SHADOW, EU, PALETTE as C, type SceneProps } from "../constants";
import { CommissionIcon, MarkBadge, Pill, Stamp } from "../ui";
import { PeopleGrid } from "./people";

const PAPER = { width: 250, height: 170, top: 640 } as const;
const BOX = { top: 860, height: 330, width: 400 } as const;
const LEFT_X = 120;
const RIGHT_X = 560;

/** The law proposal: a paper with a header and text lines. */
const Proposal: React.FC = () => (
  <div
    style={{
      width: PAPER.width,
      height: PAPER.height,
      borderRadius: 18,
      background: C.card,
      boxShadow: CARD_SHADOW,
      border: `3px solid ${C.ink}`,
      boxSizing: "border-box",
      padding: "16px 22px",
      fontFamily: theme.font,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 3, color: EU.blue }}>PROPOSAL</div>
    {[180, 200, 150, 120].map((w, i) => (
      <div key={i} style={{ width: w, height: 10, borderRadius: 5, background: C.muted, opacity: 0.5 }} />
    ))}
  </div>
);

const Box: React.FC<{ left: number; p: number; hi: number; title: string; children: React.ReactNode }> = ({ left, p, hi, title, children }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: BOX.top,
      width: BOX.width,
      height: BOX.height,
      borderRadius: 28,
      background: C.card,
      boxShadow: CARD_SHADOW,
      border: `5px solid ${interpolateColors(hi, [0, 1], [C.card, EU.blue])}`,
      boxSizing: "border-box",
      fontFamily: theme.font,
      opacity: Math.min(1, p * 1.4),
      transform: `translateY(${(1 - p) * 40}px) scale(${0.92 + 0.08 * p})`,
    }}
  >
    <div style={{ position: "absolute", top: 18, left: 24, fontSize: 30, fontWeight: 800, color: C.ink, letterSpacing: -0.5 }}>{title}</div>
    {children}
  </div>
);

/**
 * "And only the Commission can propose new EU laws. Then two sides decide: Parliament, which you
 * elect, and the Council, made of ministers from the 27 national governments. Only if both say yes
 * does it become EU law." The mini Parliament half-circle inside the left box is HemicycleLayer.
 */
export const LawsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const commission = rise(frame, 0);
  const only = pop(frame, cue("onlyCommission", "only") - 4);
  const paperIn = progress(frame, cue("onlyCommission", "propose") - 6, cue("onlyCommission", "propose") + 10);
  const ask = rise(frame, cue("onlyCommission", "laws") - 4);
  const twoAt = cue("decide", "two");
  const sides = progress(frame, twoAt - 4, twoAt + 8);
  const boxes = pop(frame, twoAt - 2);
  const arrows = progress(frame, twoAt, cue("decide", "decide") + 4);
  const parlHi = progress(frame, cue("decide", "Parliament") - 4, cue("decide", "Parliament") + 4) * (1 - progress(frame, cue("decide", "Council") - 6, cue("decide", "Council")));
  const councilHi = progress(frame, cue("decide", "Council") - 4, cue("decide", "Council") + 4) * (1 - progress(frame, cue("both", "Only") - 4, cue("both", "Only") + 4));
  const elected = pop(frame, cue("decide", "elect") - 4);
  const ministers = (i: number) => pop(frame, cue("decide", "ministers") - 4 + (i % 9) + Math.floor(i / 9) * 2);
  const ministersText = rise(frame, cue("decide", "ministers") - 4);
  const yesLeft = pop(frame, cue("both", "both") - 3);
  const yesRight = pop(frame, cue("both", "yes") - 3);
  const lawStamp = progress(frame, cue("both", "law") - 4, cue("both", "law") + 4);
  const most = rise(frame, cue("both", "law") + 6);

  const paperY = interpolate(paperIn, [0, 1], [430, PAPER.top]);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
      {/* The proposal comes out of the Commission */}
      <div style={{ position: "absolute", left: 540 - PAPER.width / 2, top: paperY, opacity: Math.min(1, paperIn * 2), transform: `rotate(${(1 - paperIn) * -6}deg)` }}>
        <Proposal />
      </div>
      <div style={{ position: "absolute", left: 540 - 105, top: 352, ...riseStyle(commission, 0, 30) }}>
        <CommissionIcon width={210} />
      </div>
      <div style={{ position: "absolute", top: 512, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 1 - sides }}>
        <Pill p={only} bg={EU.yellow} color={C.ink} size={34}>
          ONLY the Commission can propose laws
        </Pill>
      </div>
      <div
        style={{
          position: "absolute",
          top: PAPER.top + PAPER.height + 26,
          left: 120,
          width: 840,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 28,
          fontWeight: 600,
          color: C.inkSoft,
          ...riseStyle(ask, sides, 16),
        }}
      >
        Parliament, the Council or citizens can ask it for one
      </div>

      {/* Two sides decide */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <DrawnArrow x1={500} y1={PAPER.top + PAPER.height + 6} x2={LEFT_X + BOX.width / 2 + 20} y2={BOX.top - 10} bend={-30} p={arrows} color={C.ink} width={6} />
        <DrawnArrow x1={580} y1={PAPER.top + PAPER.height + 6} x2={RIGHT_X + BOX.width / 2 - 20} y2={BOX.top - 10} bend={30} p={arrows} color={C.ink} width={6} />
      </svg>

      <Box left={LEFT_X} p={boxes} hi={parlHi} title="European Parliament">
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontSize: 26, fontWeight: 700, color: C.inkSoft }}>
          720 MEPs ·{" "}
          <span style={{ display: "inline-block", color: EU.blue, fontWeight: 800, transform: `scale(${1 + 0.2 * Math.sin(Math.PI * Math.min(1, elected))})` }}>
            elected by you
          </span>
        </div>
      </Box>
      <Box left={RIGHT_X} p={boxes} hi={councilHi} title="Council of the EU">
        <div style={{ position: "absolute", top: 76, left: (BOX.width - (9 * 34 + 8 * 4)) / 2 }}>
          <PeopleGrid seed="minister" size={34} gap={4} p={ministers} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 18,
            textAlign: "center",
            fontSize: 26,
            fontWeight: 700,
            color: C.inkSoft,
            lineHeight: 1.25,
            ...riseStyle(ministersText, 0, 12),
          }}
        >
          ministers from the
          <br />
          <span style={{ color: EU.blue, fontWeight: 800 }}>27 national governments</span>
        </div>
      </Box>

      {/* Both say yes */}
      <div style={{ position: "absolute", left: LEFT_X + BOX.width - 64, top: BOX.top - 30 }}>
        <MarkBadge size={88} kind="yes" p={yesLeft} />
      </div>
      <div style={{ position: "absolute", left: RIGHT_X + BOX.width - 64, top: BOX.top - 30 }}>
        <MarkBadge size={88} kind="yes" p={yesRight} />
      </div>
      <div style={{ position: "absolute", left: 540 - 150, top: PAPER.top + 40, width: 300, display: "flex", justifyContent: "center" }}>
        <Stamp text="EU LAW" color={EU.blue} p={lawStamp} size={58} rotate={-9} />
      </div>
      <div
        style={{
          position: "absolute",
          top: PAPER.top - 46,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 26,
          fontWeight: 600,
          color: C.inkSoft,
          ...riseStyle(most, 0, 12),
        }}
      >
        (for most EU laws)
      </div>
    </div>
  );
};
