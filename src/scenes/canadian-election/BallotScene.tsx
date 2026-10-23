import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CA, COMMONS, FONT, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mark, Mono, PaperLayer } from "./ui";

/**
 * The made-up ballot: one riding's candidates, surname first with the party underneath and a white
 * circle on the right, as on a real federal ballot. Names are placeholders on purpose.
 */
const CANDIDATES = [
  { name: "CANDIDATE, A.", party: "Party A" },
  { name: "CANDIDATE, B.", party: "Party B" },
  { name: "CANDIDATE, C.", party: "Party C" },
  { name: "CANDIDATE, D.", party: "Party D" },
  { name: "CANDIDATE, E.", party: "Independent" },
] as const;
/** The row the voter marks. */
const PICK = 1;

const BALLOT = { x: 120, y: 680, w: 470, h: 560 } as const;
const HEAD_H = 80;
const ROW_H = 92;
const CIRCLE = { d: 52, right: 30 } as const;

/** A pencil, tip at the origin. */
const Pencil: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg width={60} height={190} viewBox="0 0 60 190" style={{ position: "absolute", overflow: "visible", ...style }}>
    <g transform="rotate(32 0 0)">
      <path d="M0 0 L-9 -26 L9 -26 Z" fill="#E8C9A0" />
      <path d="M0 0 L-3 -9 L3 -9 Z" fill={CA.ink} />
      <rect x={-9} y={-160} width={18} height={134} fill={CA.red} />
      <rect x={-9} y={-160} width={6} height={134} fill="rgba(255,255,255,0.25)" />
      <rect x={-9} y={-176} width={18} height={16} rx={3} fill="#E9A6A0" />
    </g>
  </svg>
);

/** A hand-drawn X that draws itself (stroke by stroke) as `p` goes 0 -> 1. */
const DrawnX: React.FC<{ size: number; p: number; color?: string }> = ({ size, p, color = CA.ink }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <path d="M24 22 L78 80" stroke={color} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, p * 2)} />
    <path d="M78 20 L22 78" stroke={color} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, p * 2 - 1)} opacity={p > 0.5 ? 1 : 0} />
  </svg>
);

/** A ballot circle, empty or with a mark. */
const Circle: React.FC<{ size?: number; mark?: "x" | "tick" | "none"; p?: number }> = ({ size = CIRCLE.d, mark = "none", p = 1 }) => (
  <div style={{ position: "relative", width: size, height: size, borderRadius: "50%", border: `3px solid ${CA.ink}`, background: CA.white, boxSizing: "border-box", flexShrink: 0 }}>
    {mark === "x" && <DrawnX size={size - 6} p={p} />}
    {mark === "tick" && (
      <div style={{ position: "absolute", left: 4, top: 2 }}>
        <Mark ok size={size - 14} p={p} color={CA.ink} width={8} />
      </div>
    )}
  </div>
);

/**
 * "Your ballot lists only your local candidates. Mark the circle next to one." On light paper: a
 * made-up federal ballot for one riding (candidates and parties, no party leader unless they run
 * there); the rows light up on "local candidates", then a pencil marks one circle; on the right the
 * rule (one mark, an X or a tick both count) and how it is counted.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = [rise(frame, 6), rise(frame, 10)];
  const aside = rise(frame, cue("ballot", "local") - 4);
  const ballot = rise(frame, cue("ballot", "ballot") - 4);
  const scan = progress(frame, cue("ballot", "local"), cue("ballot", "candidates", "end") + 4, Easing.inOut(Easing.quad)) * CANDIDATES.length;
  const scanDone = progress(frame, cue("ballot", "Mark") - 4, cue("ballot", "Mark") + 4);
  const pencil = progress(frame, cue("ballot", "Mark") - 8, cue("ballot", "Mark"));
  const mark = progress(frame, cue("ballot", "circle") - 2, cue("ballot", "one") + 4, Easing.inOut(Easing.quad));
  const pencilAway = progress(frame, cue("ballot", "one", "end"), cue("ballot", "one", "end") + 10);
  const rule = rise(frame, cue("ballot", "Mark") - 4);
  const ok = pop(frame, cue("ballot", "circle") - 2);
  const bad = pop(frame, cue("ballot", "one") - 2);
  const notes = rise(frame, cue("ballot", "candidates") + 4);

  const circleX = BALLOT.w - CIRCLE.right - CIRCLE.d;
  const circleY = (i: number) => HEAD_H + i * ROW_H + (ROW_H - CIRCLE.d) / 2;
  const tip = { x: circleX + CIRCLE.d * (0.25 + 0.5 * mark), y: circleY(PICK) + CIRCLE.d * (0.25 + 0.5 * (mark < 0.5 ? mark * 2 : 2 - mark * 2)) };

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        03 — THE BALLOT
      </Eyebrow>
      <Headline light size={112} style={{ top: 360, ...riseStyle(head[0], exit, 50) }}>
        ONE RIDING,
      </Headline>
      <Headline light size={112} style={{ top: 360 + 110, ...riseStyle(head[1], exit, 50) }}>
        <Accent light>ONE MARK</Accent>
      </Headline>
      <Aside light size={42} style={{ top: 600, ...riseStyle(aside, exit, 24) }}>
        A riding is a local area — Canada has {COMMONS.seats}.
      </Aside>

      <div
        style={{
          position: "absolute",
          left: BALLOT.x,
          top: BALLOT.y,
          width: BALLOT.w,
          height: BALLOT.h,
          borderRadius: 8,
          background: CA.card,
          border: "2px solid #D9CCC2",
          boxShadow: "0 22px 46px rgba(42,13,16,0.18)",
          boxSizing: "border-box",
          fontFamily: FONT.body,
          color: CA.ink,
          overflow: "hidden",
          transform: "rotate(-1deg)",
          ...riseStyle(ballot, exit, 60),
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: HEAD_H - 10, background: CA.ink, color: CA.white }}>
          <div style={{ position: "absolute", left: 22, top: 12, fontFamily: FONT.mono, fontWeight: 700, fontSize: 15, letterSpacing: 2.6, opacity: 0.8 }}>FEDERAL ELECTION · BALLOT</div>
          <div style={{ position: "absolute", left: 22, top: 32, fontFamily: FONT.display, fontSize: 23, letterSpacing: 0.5 }}>YOUR RIDING</div>
        </div>
        {CANDIDATES.map((c, i) => {
          const lit = Math.min(1, Math.max(0, scan - i)) * (1 - 0.7 * scanDone * (i === PICK ? 0 : 1));
          return (
            <div key={c.name} style={{ position: "absolute", left: 0, right: 0, top: HEAD_H + i * ROW_H, height: ROW_H, borderBottom: i < CANDIDATES.length - 1 ? "2px solid #E8DED6" : "none" }}>
              <div
                style={{
                  position: "absolute",
                  left: 10,
                  right: 10,
                  top: 6,
                  bottom: 6,
                  borderRadius: 6,
                  background: `rgba(213,43,30,${0.08 * lit})`,
                  boxShadow: lit > 0.05 ? `inset 0 0 0 2px rgba(213,43,30,${0.5 * lit})` : "none",
                }}
              />
              <div style={{ position: "absolute", left: 26, top: 18, fontSize: 25, fontWeight: 800, letterSpacing: 0.3 }}>{c.name}</div>
              <div style={{ position: "absolute", left: 26, top: 52, fontSize: 19, fontWeight: 500, color: CA.inkSoft }}>{c.party}</div>
              <div style={{ position: "absolute", left: circleX, top: (ROW_H - CIRCLE.d) / 2 }}>
                <Circle mark={i === PICK ? "x" : "none"} p={i === PICK ? mark : 0} />
              </div>
            </div>
          );
        })}
        {pencil > 0 && pencilAway < 1 && (
          <Pencil
            style={{
              left: tip.x + (1 - pencil) * 120 + pencilAway * 140,
              top: tip.y - (1 - pencil) * 80 - pencilAway * 60,
              opacity: Math.min(pencil * 2, 1 - pencilAway),
            }}
          />
        )}
      </div>

      {/* The rule: one mark in one circle; any clear mark counts. */}
      <div style={{ position: "absolute", left: 640, top: 690, width: 320, fontFamily: FONT.body, ...riseStyle(rule, exit, 30) }}>
        <div style={{ fontFamily: FONT.display, fontSize: 44, lineHeight: 1.02, color: CA.ink }}>
          MARK
          <br />
          <span style={{ color: CA.red }}>ONE CIRCLE</span>
        </div>
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14, opacity: Math.min(1, Math.max(0, ok) * 1.5), transform: `scale(${0.6 + 0.4 * ok})`, transformOrigin: "left center" }}>
          <Circle size={46} mark="x" />
          <Circle size={46} mark="tick" />
          <Mark ok size={30} p={1} color="#1F8A4C" />
          <div style={{ fontSize: 22, fontWeight: 700, color: CA.ink, lineHeight: 1.1 }}>both count</div>
        </div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14, opacity: Math.min(1, Math.max(0, bad) * 1.5), transform: `scale(${0.6 + 0.4 * bad})`, transformOrigin: "left center" }}>
          <Circle size={46} mark="x" />
          <Circle size={46} mark="x" />
          <Mark ok={false} size={26} p={1} color={CA.red} />
          <div style={{ fontSize: 22, fontWeight: 700, color: CA.ink, lineHeight: 1.1 }}>two = spoiled</div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 640, top: 1030, width: 320, ...riseStyle(notes, exit, 20) }}>
        <div style={{ height: 2, background: CA.inkFaint, marginBottom: 18 }} />
        <Mono size={17} color={CA.inkSoft} style={{ letterSpacing: 2.2, lineHeight: 1.6, whiteSpace: "normal" }}>
          NO PM ON IT — UNLESS THEY RUN IN YOUR RIDING
        </Mono>
        <Mono size={17} color={CA.red} style={{ marginTop: 12, letterSpacing: 2.2, lineHeight: 1.6, whiteSpace: "normal" }}>
          PAPER, COUNTED BY HAND
        </Mono>
      </div>
    </>
  );
};
