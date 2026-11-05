import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { UK, type SceneProps } from "./constants";
import { Accent, Headline, Mark, SectionNumeral, Stamp, WipeLayer } from "./ui";

const PAPER = { left: 170, top: 470, width: 740, height: 620 } as const;
const ROWS = 4;
const CHOSEN = 1;
const ROW_H = (PAPER.height - 60) / ROWS;
const BOX = 120;

/**
 * "Makerfield voted: one cross, one name. He won by 9,000." Section 04, the heart of the "how": a
 * paper wipe, ONE CROSS, and a UK ballot paper (names and parties as grey bars, one box per row);
 * an X is drawn in one box on "cross", that row lights up on "name", and a +9,000 stamp lands on
 * "9,000". No joke here (comedy formula: the ballot stays clean).
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 4);
  const head = rise(frame, 6);
  const paper = pop(frame, 8);
  const cross = progress(frame, cue("ballot", "cross") - 4, cue("ballot", "cross") + 8, Easing.inOut(Easing.quad));
  const row = progress(frame, cue("ballot", "name") - 4, cue("ballot", "name") + 4);
  const stamp = progress(frame, cue("ballot", "9,000") - 6, cue("ballot", "9,000"), Easing.in(Easing.cubic));

  return (
    <>
      <WipeLayer duration={duration} kind="paper" />
      <SectionNumeral n="04" tone="paper" p={numeral * (1 - exit)} />
      <Headline size={124} tone="paper" style={{ top: 270, ...riseStyle(head, exit, 40) }}>
        ONE <Accent tone="paper">CROSS</Accent>
      </Headline>
      <div
        style={{
          position: "absolute",
          left: PAPER.left,
          top: PAPER.top,
          width: PAPER.width,
          height: PAPER.height,
          borderRadius: 10,
          background: UK.card,
          boxShadow: "0 30px 60px rgba(14,26,43,0.25), inset 0 0 0 2px rgba(14,26,43,0.12)",
          opacity: Math.min(1, Math.max(0, paper) * 1.6) * (1 - exit),
          transform: `translateY(${(1 - Math.min(1, Math.max(0, paper))) * 80 - exit * 40}px) rotate(-2deg)`,
        }}
      >
        <div style={{ position: "absolute", left: 30, top: 22, width: PAPER.width - 60, height: 16, borderRadius: 8, background: UK.inkFaint }} />
        {Array.from({ length: ROWS }, (_, i) => {
          const top = 50 + i * ROW_H;
          const lit = i === CHOSEN ? row : 0;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top, width: PAPER.width, height: ROW_H, borderTop: `3px solid ${UK.inkFaint}`, background: `rgba(207,20,43,${0.08 * lit})` }}>
              <div style={{ position: "absolute", left: 34, top: ROW_H * 0.28, width: [300, 360, 260, 330][i], height: 26, borderRadius: 13, background: i === CHOSEN && lit > 0.5 ? UK.ink : "rgba(14,26,43,0.45)" }} />
              <div style={{ position: "absolute", left: 34, top: ROW_H * 0.28 + 44, width: [200, 240, 180, 220][i], height: 16, borderRadius: 8, background: UK.inkFaint }} />
              <div
                style={{
                  position: "absolute",
                  right: 34,
                  top: (ROW_H - BOX) / 2,
                  width: BOX,
                  height: BOX,
                  border: `5px solid ${UK.ink}`,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i === CHOSEN && cross > 0 && <Mark ok={false} size={92} p={cross} color={UK.pen} width={10} />}
              </div>
            </div>
          );
        })}
      </div>
      <Stamp p={stamp} fade={1 - exit} color={UK.red} fill="rgba(255,253,247,0.9)" size={150} rotate={-9} style={{ left: 200, top: 860 }}>
        +9,000
      </Stamp>
    </>
  );
};
