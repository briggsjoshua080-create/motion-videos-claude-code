import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, UA, type SceneProps } from "./constants";
import { Accent, Headline, Mark, Stamp, WipeLayer } from "./ui";

const SLIP = { left: 150, top: 610, w: 780, h: 520 } as const;
const ROW = { top: 96, h: 104, box: 84 } as const;
const PICK = 1;
const BAR = { left: 140, top: 760, w: 800, h: 120 } as const;

/**
 * "You tick one name. Over half wins, or the top two face a run-off." On light paper: TICK ONE NAME
 * stays up the whole beat (rule 6). A generic presidential ballot (names drawn as grey bars, a
 * square beside each) gets one tick on "tick"; then the slip slides away and a vote bar fills past a
 * 50% line on "half wins", falls short of it on "or", where a RUN-OFF stamp lands (so it stays up 2 s).
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 4), rise(frame, 8)];
  const slip = rise(frame, 2);
  const tick = progress(frame, cue("ballot", "tick") - 1, cue("ballot", "tick") + 8);
  const away = progress(frame, cue("ballot", "Over") - 8, cue("ballot", "Over") + 2, Easing.in(Easing.cubic));
  const bar = rise(frame, cue("ballot", "Over") - 4);
  const fillUp = progress(frame, cue("ballot", "half") - 2, cue("ballot", "wins") + 4, Easing.out(Easing.cubic));
  const fillDown = progress(frame, cue("ballot", "or") - 6, cue("ballot", "two") + 2, Easing.inOut(Easing.cubic));
  const share = 0.12 + 0.46 * fillUp - 0.18 * fillDown;
  const win = pop(frame, cue("ballot", "wins") - 2) * (1 - fillDown);
  const stamp = pop(frame, cue("ballot", "or") - 6);
  const half = BAR.left + BAR.w / 2;

  return (
    <>
      <WipeLayer duration={duration} kind="paper" />
      <Headline tone="paper" size={150} style={{ top: 250, ...riseStyle(head[0], exit, 50) }}>
        TICK ONE
      </Headline>
      <Headline tone="paper" size={150} style={{ top: 250 + 147, ...riseStyle(head[1], exit, 50) }}>
        <Accent tone="paper">NAME</Accent>
      </Headline>

      {/* The ballot slip (generic: names as grey bars, a square to the right of each). */}
      <div
        style={{
          position: "absolute",
          left: SLIP.left,
          top: SLIP.top,
          width: SLIP.w,
          height: SLIP.h,
          borderRadius: 14,
          background: UA.card,
          boxShadow: "0 24px 50px rgba(20,30,50,0.18)",
          ...riseStyle(slip, 0, 80),
          opacity: Math.min(1, slip) * (1 - away),
          transform: `translateY(${(1 - slip) * 80 + away * 260}px) rotate(${-1.5 + away * 6}deg)`,
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width: SLIP.w, height: 26, borderRadius: "14px 14px 0 0", background: UA.blue }} />
        <div style={{ position: "absolute", left: 0, top: 26, width: SLIP.w, height: 14, background: UA.yellow }} />
        {[0, 1, 2, 3].map((i) => {
          const y = ROW.top + i * ROW.h;
          const on = i === PICK;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: y, width: SLIP.w, height: ROW.h }}>
              <div style={{ position: "absolute", left: 40, top: 26, width: 360 - (i % 2) * 60, height: 26, borderRadius: 13, background: on ? "rgba(14,26,43,0.55)" : UA.inkFaint }} />
              <div style={{ position: "absolute", left: 40, top: 62, width: 220 + (i % 3) * 40, height: 16, borderRadius: 8, background: UA.inkFaint }} />
              <div
                style={{
                  position: "absolute",
                  left: SLIP.w - 40 - ROW.box,
                  top: (ROW.h - ROW.box) / 2,
                  width: ROW.box,
                  height: ROW.box,
                  border: `5px solid ${on ? UA.ink : "rgba(14,26,43,0.45)"}`,
                  borderRadius: 8,
                  boxSizing: "border-box",
                  background: "#FFFFFF",
                }}
              />
              {on && (
                <div style={{ position: "absolute", left: SLIP.w - 40 - ROW.box - 6, top: (ROW.h - ROW.box) / 2 - 14 }}>
                  <Mark ok size={ROW.box + 18} p={tick} color={UA.pen} width={10} />
                </div>
              )}
              {i < 3 && <div style={{ position: "absolute", left: 30, right: 30, bottom: 0, height: 2, background: "rgba(14,26,43,0.1)" }} />}
            </div>
          );
        })}
      </div>

      {/* Over half wins; otherwise the top two meet again. */}
      <div style={{ position: "absolute", inset: 0, ...riseStyle(bar, exit, 40) }}>
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.w, height: BAR.h, borderRadius: 20, background: "rgba(14,26,43,0.08)", border: "3px solid rgba(14,26,43,0.18)", boxSizing: "border-box" }} />
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.w * share, height: BAR.h, borderRadius: 20, background: UA.blue, boxShadow: "0 10px 30px rgba(0,87,183,0.35)" }} />
        <div style={{ position: "absolute", left: half - 3, top: BAR.top - 30, width: 6, height: BAR.h + 60, borderRadius: 3, background: UA.ink }} />
        <div style={{ position: "absolute", left: half + 20, top: BAR.top - 150, fontFamily: FONT.display, fontSize: 112, lineHeight: 1, color: UA.ink }}>50%</div>
        <div style={{ position: "absolute", left: BAR.left + BAR.w * share - 110, top: BAR.top + 8, opacity: Math.min(1, Math.max(0, win) * 1.5) }}>
          <Mark ok size={104} p={Math.min(1, win)} color={UA.yellow} width={11} />
        </div>
      </div>
      <Stamp p={stamp} color={UA.navy} fill={UA.yellow} size={120} rotate={-6} style={{ left: 250, top: 950, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit), border: `11px solid ${UA.navy}` }}>
        RUN-OFF
      </Stamp>
    </>
  );
};
