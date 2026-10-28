import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BALLOT_ROWS, CONSTITUENCIES, DISTRICTS, FONT, PICKED, SI, type SceneProps } from "./constants";
import { Accent, Eyebrow, Headline, Mono, PaperLayer, Stamp } from "./ui";

const PAPER = { left: 120, top: 700, w: 470, h: 556 } as const;
const ROW = { top: 128, step: 78 } as const;
const PARTY = { left: 620, top: 700, w: 340, h: 540 } as const;

/**
 * "The ballot shows one candidate per party. Circle one number, and it counts for the whole
 * party." On light paper like the reference's ballot scene: a district ballot with one made-up
 * candidate per party, a red ring drawing itself round number 3 on "Circle"; then the vote flies
 * from the candidate to a card for the whole party (+1 for PARTY C, COUNTED stamp on "party").
 * A pill says there is one name per party in each of the 88 districts.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = [rise(frame, 6), rise(frame, 10)];
  const paper = rise(frame, 6);
  const rows = BALLOT_ROWS.map((_, i) => rise(frame, 10 + i * 3));
  const namePill = pop(frame, cue("ballot", "candidate") - 4);
  const ring = progress(frame, cue("ballot", "Circle") - 2, cue("ballot", "number") + 6);
  const card = rise(frame, cue("ballot", "counts") - 8);
  const fly = progress(frame, cue("ballot", "counts") - 2, cue("ballot", "whole") + 2, Easing.inOut(Easing.cubic));
  const plus = pop(frame, cue("ballot", "whole") - 1);
  const stamp = pop(frame, cue("ballot", "party#2") - 2);
  const picked = BALLOT_ROWS[PICKED];

  // The flying vote: from the circled number on the ballot to the middle of the party card.
  const from = { x: PAPER.left + 56, y: PAPER.top + ROW.top + PICKED * ROW.step + 30 };
  const to = { x: PARTY.left + PARTY.w / 2, y: PARTY.top + 250 };
  const fx = from.x + (to.x - from.x) * fly;
  const fy = from.y + (to.y - from.y) * fly - Math.sin(Math.PI * fly) * 120;

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
          background: SI.blue,
          fontFamily: FONT.mono,
          fontWeight: 700,
          fontSize: 19,
          letterSpacing: 2.5,
          color: SI.white,
          whiteSpace: "nowrap",
          opacity: Math.min(1, Math.max(0, namePill) * 1.5) * (1 - exit),
          transform: `scale(${0.6 + 0.4 * namePill})`,
          transformOrigin: "left center",
        }}
      >
        ONE NAME PER PARTY · {CONSTITUENCIES * DISTRICTS} DISTRICTS
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
          background: SI.cream,
          border: "2px solid #D9D2C4",
          boxSizing: "border-box",
          boxShadow: "0 22px 40px rgba(10,34,56,0.18)",
          fontFamily: FONT.body,
          ...riseStyle(paper, exit, 50),
        }}
      >
        <div style={{ position: "absolute", left: 26, top: 24, fontFamily: FONT.mono, fontWeight: 700, fontSize: 15, letterSpacing: 2.6, color: SI.inkSoft }}>
          NATIONAL ASSEMBLY · DISTRICT 4
        </div>
        <div style={{ position: "absolute", left: 26, top: 52, fontSize: 17, fontWeight: 600, color: SI.inkSoft }}>Circle the number of one candidate only</div>
        <div style={{ position: "absolute", left: 26, right: 26, top: 92, height: 4, background: SI.red }} />
        {BALLOT_ROWS.map((r, i) => (
          <div key={r.name} style={{ position: "absolute", left: 26, right: 20, top: ROW.top + i * ROW.step, height: 60, display: "flex", alignItems: "center", gap: 18, ...riseStyle(rows[i], 0, 16) }}>
            <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontSize: 36, color: SI.ink }}>
              {i + 1}
              {i === PICKED && (
                <svg width={84} height={78} style={{ position: "absolute", left: -12, top: -9, overflow: "visible" }}>
                  <ellipse
                    cx={42}
                    cy={39}
                    rx={38}
                    ry={34}
                    fill="none"
                    stroke={SI.red}
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
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: SI.ink, lineHeight: 1.1 }}>{r.name}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: SI.inkSoft, lineHeight: 1.2 }}>{r.party}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 26, right: 26, bottom: 22, fontSize: 15, fontWeight: 600, color: SI.inkFaint }}>Made-up names · voting is secret</div>
      </div>

      {/* The whole party's card: the vote lands here. */}
      <div
        style={{
          position: "absolute",
          left: PARTY.left,
          top: PARTY.top,
          width: PARTY.w,
          height: PARTY.h,
          borderRadius: 24,
          background: SI.card,
          border: `3px solid ${SI.blue}`,
          boxSizing: "border-box",
          boxShadow: "0 22px 40px rgba(10,34,56,0.18)",
          fontFamily: FONT.body,
          ...riseStyle(card, exit, 50),
        }}
      >
        <Mono size={17} color={SI.inkSoft} style={{ position: "absolute", left: 28, top: 28, letterSpacing: 2.5 }}>
          IT COUNTS FOR
        </Mono>
        <div style={{ position: "absolute", left: 28, top: 64, fontFamily: FONT.display, fontSize: 52, lineHeight: 1, color: SI.blue }}>{picked.party.toUpperCase()}</div>
        <div style={{ position: "absolute", left: 28, right: 28, top: 132, height: 3, background: SI.red }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 186,
            textAlign: "center",
            fontFamily: FONT.display,
            fontSize: 130,
            lineHeight: 1,
            color: SI.red,
            opacity: Math.min(1, Math.max(0, plus) * 1.5),
            transform: `scale(${0.6 + 0.4 * plus})`,
          }}
        >
          +1
        </div>
        <div style={{ position: "absolute", left: 28, right: 24, top: 384, fontSize: 23, fontWeight: 700, lineHeight: 1.25, color: SI.ink, opacity: Math.min(1, Math.max(0, plus)) }}>
          Its seats go to the candidates with the best district results.
        </div>
        <Stamp p={stamp} size={36} color={SI.red} rotate={-8} style={{ left: 60, top: 316 }}>
          COUNTED
        </Stamp>
      </div>

      {/* The vote on its way from the ballot to the party. */}
      {fly > 0 && fly < 1 && (
        <div
          style={{
            position: "absolute",
            left: fx - 26,
            top: fy - 26,
            width: 52,
            height: 52,
            borderRadius: 26,
            background: SI.red,
            border: `3px solid ${SI.white}`,
            boxShadow: "0 8px 20px rgba(10,34,56,0.3)",
            opacity: 1 - exit,
          }}
        />
      )}
    </>
  );
};
