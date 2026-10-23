import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CANDIDATES, FONT, MARKED, PICKED, RACK, SE, type SceneProps } from "./constants";
import { Accent, Eyebrow, Headline, Mark, Mono, PaperLayer } from "./ui";

/** The full-size ballot paper; the rack shows the same paper scaled down. */
const PAPER = { w: 400, h: 500 } as const;
const ROW = { top: 186, step: 58 } as const;
const BOX = 32;

const BallotPaper: React.FC<{ party: string; cross?: number; highlight?: number }> = ({ party, cross = 0, highlight = 0 }) => (
  <div
    style={{
      position: "relative",
      width: PAPER.w,
      height: PAPER.h,
      borderRadius: 8,
      background: "linear-gradient(180deg, #FFE878 0%, #FFE061 100%)",
      border: "2px solid #E0BF3A",
      boxShadow: "0 22px 46px rgba(10,34,56,0.24)",
      boxSizing: "border-box",
      fontFamily: FONT.body,
      color: SE.ink,
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", left: 26, top: 22, fontFamily: FONT.mono, fontWeight: 700, fontSize: 15, letterSpacing: 2.6, color: SE.inkSoft }}>
      ELECTION TO THE RIKSDAG
    </div>
    <div style={{ position: "absolute", left: 24, top: 52, fontFamily: FONT.display, fontSize: 58, lineHeight: 1, letterSpacing: -0.5 }}>{party}</div>
    <div style={{ position: "absolute", left: 26, right: 26, top: 128, height: 2, background: "rgba(10,34,56,0.35)" }} />
    <div style={{ position: "absolute", left: 26, top: 142, fontSize: 16, fontWeight: 600, color: SE.inkSoft }}>Personal vote: mark one box (or none)</div>
    {CANDIDATES.map((name, i) => (
      <div key={name} style={{ position: "absolute", left: 26, top: ROW.top + i * ROW.step, display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            position: "relative",
            width: BOX,
            height: BOX,
            borderRadius: 4,
            border: `3px solid ${SE.ink}`,
            background: i === MARKED ? `rgba(255,255,255,${0.55 + 0.45 * highlight})` : "rgba(255,255,255,0.55)",
            boxSizing: "border-box",
          }}
        >
          {i === MARKED && (
            <div style={{ position: "absolute", left: -6, top: -6 }}>
              <Mark ok={false} size={BOX + 6} p={cross} color={SE.blueNight} width={11} />
            </div>
          )}
        </div>
        <div style={{ fontSize: 25, fontWeight: 600, whiteSpace: "nowrap" }}>
          <span style={{ color: SE.inkSoft, marginRight: 10 }}>{i + 1}.</span>
          {name}
        </div>
      </div>
    ))}
  </div>
);

/** A blue pencil, tip at the origin. */
const Pencil: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg width={60} height={190} viewBox="0 0 60 190" style={{ position: "absolute", overflow: "visible", ...style }}>
    <g transform="rotate(32 0 0)">
      <path d="M0 0 L-9 -26 L9 -26 Z" fill="#E9C9A0" />
      <path d="M0 0 L-3 -9 L3 -9 Z" fill={SE.blueNight} />
      <rect x={-9} y={-170} width={18} height={144} rx={2} fill={SE.blue} />
      <rect x={-9} y={-170} width={6} height={144} fill="rgba(255,255,255,0.25)" />
      <rect x={-9} y={-186} width={18} height={18} rx={3} fill={SE.yellow} />
    </g>
  </svg>
);

/** Paper colours of the three votes held on the same day. */
const LEGEND = [
  { color: "#FFE061", border: "#E0BF3A", label: "PARLIAMENT" },
  { color: SE.paperBlue, border: "#8FBEE0", label: "REGION" },
  { color: SE.cream, border: "#D8D0BF", label: "MUNICIPALITY" },
] as const;

const STEPS = [
  { n: "1", title: "Pick your party's paper", sub: "" },
  { n: "2", title: "Mark one candidate", sub: "" },
  { n: "3", title: "Seal it in an envelope", sub: "staff drop it in the box" },
] as const;

/** Where the rack papers sit (left x, top y at rack scale) and where the picked one goes. */
const RACK_SCALE = 0.56;
const RACK_X = [148, 428, 708];
const RACK_TOP = 770;
const BIG = { x: 120, y: 726, s: 0.92 } as const;
const ENVELOPE = { x: 118, y: 958, w: 404, h: 250 } as const;

/**
 * "Each party has its own ballot paper, yellow for parliament. Pick yours, mark one candidate if
 * you like, and seal it in an envelope." On light paper like the reference's ballot scene: a rack of
 * yellow party papers (blue and white ones are for the region and municipality, same day), the
 * voter's paper comes forward, a cross goes in one candidate's box, and it goes into an envelope,
 * while the three steps light up on the right.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = [rise(frame, 6), rise(frame, 10)];
  const legend = rise(frame, cue("ballot", "yellow") - 8);
  const legendFocus = progress(frame, cue("ballot", "parliament") - 4, cue("ballot", "parliament") + 6);
  const rack = RACK.map((_, i) => pop(frame, cue("ballot", "party") - 4 + i * 4));
  const pick = progress(frame, cue("ballot", "Pick") - 4, cue("ballot", "yours") + 6, Easing.bezier(0.45, 0, 0.2, 1));
  const steps = [cue("ballot", "Pick") - 2, cue("ballot", "mark") - 4, cue("ballot", "seal") - 4].map((t) => rise(frame, t));
  const optional = pop(frame, cue("ballot", "if") - 2);
  const pen = progress(frame, cue("ballot", "mark") - 10, cue("ballot", "mark") - 2);
  const cross = progress(frame, cue("ballot", "one") - 2, cue("ballot", "candidate", "end"));
  const penAway = progress(frame, cue("ballot", "if") - 2, cue("ballot", "if") + 6);
  const envelope = rise(frame, cue("ballot", "seal") - 12);
  const seal = progress(frame, cue("ballot", "seal") - 4, cue("ballot", "envelope") + 2, Easing.inOut(Easing.cubic));
  const flap = progress(frame, cue("ballot", "envelope") + 2, cue("ballot", "envelope") + 12);

  // The picked paper: from its rack slot to the big spot, then shrinking down into the envelope.
  const lifted = interpolate(pick, [0, 1], [RACK_SCALE, BIG.s]);
  const ps = lifted * (1 - 0.51 * seal) * (0.6 + 0.4 * Math.min(1, rack[PICKED]));
  const centreX = interpolate(seal, [0, 1], [interpolate(pick, [0, 1], [RACK_X[PICKED], BIG.x]) + (PAPER.w * lifted) / 2, ENVELOPE.x + ENVELOPE.w / 2]);
  const px = centreX - (PAPER.w * ps) / 2;
  const py = interpolate(pick, [0, 1], [RACK_TOP, BIG.y]) + seal * (ENVELOPE.y + 18 - BIG.y);
  const boxCenter = { x: 26 + BOX / 2, y: ROW.top + MARKED * ROW.step + BOX / 2 };
  const flapClosed = flap >= 0.5;

  const flapShape = (
    <svg width={ENVELOPE.w} height={ENVELOPE.h * 0.62} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={`M0 0 L${ENVELOPE.w / 2} ${ENVELOPE.h * 0.58} L${ENVELOPE.w} 0 Z`} fill="#EFE8D8" stroke="#D3C9B4" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        03 — THE BALLOT
      </Eyebrow>
      <Headline light size={132} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        ONE PAPER
      </Headline>
      <Headline light size={132} style={{ top: 352 + 129, ...riseStyle(head[1], exit, 50) }}>
        <Accent light>PER PARTY</Accent>
      </Headline>

      <div style={{ position: "absolute", left: 120, top: 650, display: "flex", alignItems: "center", gap: 26, ...riseStyle(legend, exit, 20) }}>
        {LEGEND.map((l, i) => {
          const dim = i === 0 ? 1 : 1 - 0.55 * legendFocus;
          return (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 10, opacity: dim }}>
              <div style={{ width: 30, height: 40, borderRadius: 3, background: l.color, border: `2px solid ${l.border}`, boxShadow: "0 4px 10px rgba(10,34,56,0.15)" }} />
              <Mono size={19} color={i === 0 && legendFocus > 0.5 ? SE.ink : SE.inkSoft}>
                {l.label}
              </Mono>
            </div>
          );
        })}
        <Mono size={19} color={SE.blue} style={{ marginLeft: 4 }}>
          · SAME DAY
        </Mono>
      </div>

      {/* The other parties' papers leave when the voter picks theirs. */}
      {RACK.map((party, i) => {
        if (i === PICKED) return null;
        const away = (i < PICKED ? -1 : 1) * pick * 260;
        return (
          <div
            key={party}
            style={{
              position: "absolute",
              left: RACK_X[i] + away,
              top: RACK_TOP,
              transformOrigin: "0 0",
              transform: `scale(${RACK_SCALE * (0.6 + 0.4 * rack[i])}) rotate(${(i - 1) * 3}deg)`,
              opacity: Math.min(1, Math.max(0, rack[i]) * 1.5) * (1 - pick) * (1 - exit),
            }}
          >
            <BallotPaper party={party} />
          </div>
        );
      })}

      {/* Envelope back and (open) flap sit behind the paper. */}
      <div style={{ position: "absolute", left: ENVELOPE.x, top: ENVELOPE.y, width: ENVELOPE.w, height: ENVELOPE.h, ...riseStyle(envelope, exit, 60) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "#E9E1CF" }} />
        {!flapClosed && <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "50% 0", transform: `scaleY(${-1 + 2 * flap})` }}>{flapShape}</div>}
      </div>

      <div
        style={{
          position: "absolute",
          left: px,
          top: py,
          transformOrigin: "0 0",
          transform: `scale(${ps})`,
          opacity: Math.min(1, Math.max(0, rack[PICKED]) * 1.5) * (1 - exit),
        }}
      >
        <BallotPaper party={RACK[PICKED]} cross={cross} highlight={cross} />
        {pen > 0 && penAway < 1 && (
          <Pencil
            style={{
              left: boxCenter.x + 8 + (1 - pen) * 120 + penAway * 140 + Math.sin(cross * Math.PI * 4) * 6,
              top: boxCenter.y + 4 - (1 - pen) * 80 - penAway * 60,
              opacity: Math.min(pen * 2, 1 - penAway),
            }}
          />
        )}
      </div>

      {/* Envelope front pocket and the closed flap cover the paper. */}
      <div style={{ position: "absolute", left: ENVELOPE.x, top: ENVELOPE.y, width: ENVELOPE.w, height: ENVELOPE.h, ...riseStyle(envelope, exit, 60) }}>
        <svg width={ENVELOPE.w} height={ENVELOPE.h} style={{ position: "absolute", left: 0, top: 0, filter: "drop-shadow(0 16px 26px rgba(10,34,56,0.22))" }}>
          <path
            d={`M0 ${ENVELOPE.h * 0.28} L${ENVELOPE.w / 2} ${ENVELOPE.h * 0.66} L${ENVELOPE.w} ${ENVELOPE.h * 0.28} V${ENVELOPE.h - 10} Q${ENVELOPE.w} ${ENVELOPE.h} ${ENVELOPE.w - 10} ${ENVELOPE.h} H10 Q0 ${ENVELOPE.h} 0 ${ENVELOPE.h - 10} Z`}
            fill={SE.cream}
            stroke="#D3C9B4"
            strokeWidth={2}
          />
        </svg>
        {flapClosed && <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "50% 0", transform: `scaleY(${-1 + 2 * flap})` }}>{flapShape}</div>}
      </div>

      {/* The three steps light up on the right once the voter picks a paper. */}
      {STEPS.map((s, i) => {
        const on = steps[i];
        const top = 760 + i * 150;
        return (
          <div key={s.n} style={{ position: "absolute", left: 570, top, width: 390, display: "flex", gap: 16, ...riseStyle(on, exit, 30) }}>
            <div
              style={{
                width: 56,
                height: 56,
                flexShrink: 0,
                borderRadius: 28,
                background: SE.blue,
                color: SE.white,
                fontFamily: FONT.display,
                fontSize: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 18px rgba(0,106,167,0.3)",
              }}
            >
              {s.n}
            </div>
            <div style={{ fontFamily: FONT.body }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: SE.ink, lineHeight: 1.12 }}>{s.title}</div>
              {i === 1 && (
                <div
                  style={{
                    display: "inline-block",
                    marginTop: 10,
                    padding: "5px 14px",
                    borderRadius: 999,
                    background: SE.yellow,
                    fontFamily: FONT.mono,
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: 3,
                    color: SE.ink,
                    opacity: Math.min(1, Math.max(0, optional) * 1.5),
                    transform: `scale(${0.6 + 0.4 * optional})`,
                    transformOrigin: "left center",
                  }}
                >
                  OPTIONAL
                </div>
              )}
              {s.sub && <div style={{ marginTop: 6, fontSize: 24, fontWeight: 500, color: SE.inkSoft }}>{s.sub}</div>}
            </div>
          </div>
        );
      })}
    </>
  );
};
