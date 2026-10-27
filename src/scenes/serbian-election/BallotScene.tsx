import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BALLOT_LISTS, FONT, PICKED, RS, type SceneProps } from "./constants";
import { Accent, Eyebrow, Headline, Mono, PaperLayer, Stamp } from "./ui";

const PAPER = { left: 120, top: 700, w: 460, h: 540 } as const;
const ROW = { top: 128, step: 78 } as const;
const HAND = { left: 610, top: 700, w: 350, h: 540 } as const;

/** Spray droplets from the nozzle to the fingertip (fixed offsets, so every frame is the same). */
const DROPS = [
  [0.0, -6],
  [0.12, 10],
  [0.22, -14],
  [0.31, 4],
  [0.42, -2],
  [0.5, 14],
  [0.6, -10],
  [0.7, 6],
  [0.8, -4],
  [0.9, 12],
] as const;

/**
 * "Circle the number of one party list. And your finger gets invisible ink, so no one votes
 * twice." On light paper like the reference's ballot scene: a ballot with five made-up lists, a
 * red ring drawing itself round number 3 on "Circle"; next to it a line-art fingertip gets a spray
 * of ink on "invisible" that only shows under the UV lamp, which glows on "twice" with a VOTED
 * stamp. A pill says you vote for the list, not for a person.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = [rise(frame, 6), rise(frame, 10)];
  const paper = rise(frame, 6);
  const rows = BALLOT_LISTS.map((_, i) => rise(frame, 10 + i * 3));
  const ring = progress(frame, cue("ballot", "Circle") - 2, cue("ballot", "number") + 6);
  const listPill = pop(frame, cue("ballot", "list") - 4);
  const hand = rise(frame, cue("ballot", "finger") - 8);
  const spray = progress(frame, cue("ballot", "invisible") - 4, cue("ballot", "ink") + 4);
  const uv = progress(frame, cue("ballot", "votes") - 6, cue("ballot", "twice") + 2);
  const stamp = pop(frame, cue("ballot", "twice") - 2);

  const glow = interpolateColors(uv, [0, 1], ["rgba(139,92,246,0)", "rgba(139,92,246,0.85)"]);
  const cardBg = interpolateColors(uv, [0, 1], [RS.card, "#1E1440"]);
  const line = interpolateColors(uv, [0, 1], [RS.ink, "#E9E2FF"]);

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        03 — THE BALLOT
      </Eyebrow>
      <Headline light size={132} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        CIRCLE ONE
      </Headline>
      <Headline light size={132} style={{ top: 352 + 129, ...riseStyle(head[1], exit, 50) }}>
        <Accent light>NUMBER</Accent>
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 638,
          padding: "8px 18px",
          borderRadius: 999,
          background: RS.blue,
          fontFamily: FONT.mono,
          fontWeight: 700,
          fontSize: 19,
          letterSpacing: 2.5,
          color: RS.white,
          whiteSpace: "nowrap",
          opacity: Math.min(1, Math.max(0, listPill) * 1.5) * (1 - exit),
          transform: `scale(${0.6 + 0.4 * listPill})`,
          transformOrigin: "left center",
        }}
      >
        YOU VOTE FOR A LIST · ITS ORDER OF NAMES IS FIXED
      </div>

      {/* The ballot paper. */}
      <div
        style={{
          position: "absolute",
          left: PAPER.left,
          top: PAPER.top,
          width: PAPER.w,
          height: PAPER.h,
          borderRadius: 10,
          background: RS.cream,
          border: "2px solid #D9D2C4",
          boxSizing: "border-box",
          boxShadow: "0 22px 40px rgba(10,34,56,0.18)",
          fontFamily: FONT.body,
          ...riseStyle(paper, exit, 50),
        }}
      >
        <div style={{ position: "absolute", left: 26, top: 24, fontFamily: FONT.mono, fontWeight: 700, fontSize: 15, letterSpacing: 2.6, color: RS.inkSoft }}>
          ELECTION OF MPS · BALLOT
        </div>
        <div style={{ position: "absolute", left: 26, top: 52, fontSize: 17, fontWeight: 600, color: RS.inkSoft }}>Circle the number of one list only</div>
        <div style={{ position: "absolute", left: 26, right: 26, top: 92, height: 4, background: RS.red }} />
        {BALLOT_LISTS.map((name, i) => (
          <div key={name} style={{ position: "absolute", left: 26, right: 20, top: ROW.top + i * ROW.step, height: 60, display: "flex", alignItems: "center", gap: 18, ...riseStyle(rows[i], 0, 16) }}>
            <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontSize: 36, color: RS.ink }}>
              {i + 1}
              {i === PICKED && (
                <svg width={84} height={78} style={{ position: "absolute", left: -12, top: -9, overflow: "visible" }}>
                  <ellipse
                    cx={42}
                    cy={39}
                    rx={38}
                    ry={34}
                    fill="none"
                    stroke={RS.red}
                    strokeWidth={6}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1 - ring}
                    transform="rotate(-18 42 39)"
                    opacity={ring > 0.01 ? 1 : 0}
                  />
                </svg>
              )}
            </div>
            <div style={{ fontSize: 19, fontWeight: 700, color: RS.ink, lineHeight: 1.15 }}>{name}</div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 26, right: 26, bottom: 22, fontSize: 15, fontWeight: 600, color: RS.inkFaint }}>Made-up lists · voting is secret</div>
      </div>

      {/* The finger, the ink spray and the UV lamp. */}
      <div
        style={{
          position: "absolute",
          left: HAND.left,
          top: HAND.top,
          width: HAND.w,
          height: HAND.h,
          borderRadius: 24,
          background: cardBg,
          border: "2px solid #E2DACB",
          boxSizing: "border-box",
          boxShadow: `0 22px 40px rgba(10,34,56,0.18), 0 0 ${60 * uv}px ${glow}`,
          overflow: "hidden",
          ...riseStyle(hand, exit, 50),
        }}
      >
        <Mono size={17} color={interpolateColors(uv, [0, 1], [RS.inkSoft, "#CDBEFF"])} style={{ position: "absolute", left: 28, top: 28, letterSpacing: 2.5 }}>
          {uv > 0.5 ? "UNDER THE UV LAMP" : "YOUR FINGER"}
        </Mono>
        <svg width={HAND.w} height={HAND.h} style={{ position: "absolute", inset: 0 }}>
          {/* The ink on the fingertip: invisible in daylight, glowing under UV. */}
          <ellipse cx={175} cy={150} rx={56 * Math.min(1, spray * 1.2)} ry={60 * Math.min(1, spray * 1.2)} fill={RS.uv} opacity={0.12 * spray + 0.8 * uv} style={{ filter: `blur(${6 - 3 * uv}px)` }} />
          {/* Line-art fingertip close-up: the finger, its nail and two knuckle creases. */}
          <g fill="none" stroke={line} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M105 400 V170 a70 70 0 0 1 140 0 V400" />
            <path d="M138 150 a37 37 0 0 1 74 0 v46 a12 12 0 0 1 -12 12 h-50 a12 12 0 0 1 -12 -12 Z" strokeWidth={4} opacity={0.75} />
            <path d="M140 300 q35 12 70 0 M148 318 q27 8 54 0" strokeWidth={4} opacity={0.6} />
          </g>
          {/* The spray bottle's nozzle and its droplets. */}
          <g opacity={Math.min(1, spray * 3) * (1 - uv)}>
            <rect x={300} y={128} width={50} height={44} rx={8} fill={RS.inkSoft} />
            {DROPS.map(([t, dy], i) => {
              const p = Math.min(1, Math.max(0, spray * 1.6 - t * 0.6));
              const x = 296 - p * 70;
              return <circle key={i} cx={x} cy={150 + dy * p} r={4.5} fill={RS.inkSoft} opacity={p > 0 && p < 1 ? 0.8 : 0} />;
            })}
          </g>
        </svg>
        <div style={{ position: "absolute", left: 28, right: 20, top: 430, fontFamily: FONT.body, fontSize: 24, fontWeight: 700, lineHeight: 1.2, color: line, opacity: Math.min(1, spray * 2) }}>
          {uv > 0.5 ? "The ink shows you've voted" : "Invisible ink, sprayed on"}
        </div>
        <Stamp p={stamp} size={40} color="#CDBEFF" rotate={-8} style={{ left: 100, top: 250 }}>
          VOTED
        </Stamp>
      </div>
    </>
  );
};
