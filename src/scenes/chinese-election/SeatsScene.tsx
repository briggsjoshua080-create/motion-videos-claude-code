import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CN, type SceneProps } from "./constants";
import { Accent, Headline, Mark, PersonIcon } from "./ui";

const CARD = { w: 240, h: 230, top: 640, xs: [120, 420, 720] } as const;
const SEAT = { w: 270, h: 120, top: 1000, xs: [255, 555] } as const;

/** A simple seat seen from the front (a yellow chair back and cushion). */
const Seat: React.FC<{ x: number; p: number }> = ({ x, p }) => (
  <svg width={SEAT.w} height={SEAT.h} viewBox="0 0 270 120" style={{ position: "absolute", left: x, top: SEAT.top, overflow: "visible", opacity: Math.min(1, p), transform: `translateY(${(1 - Math.min(1, p)) * 30}px)` }}>
    <rect x={30} y={0} width={210} height={70} rx={20} fill={CN.yellow} />
    <rect x={10} y={70} width={250} height={34} rx={14} fill={CN.yellowDeep} />
    <rect x={30} y={104} width={18} height={16} fill={CN.yellowDeep} />
    <rect x={222} y={104} width={18} height={16} fill={CN.yellowDeep} />
  </svg>
);

/**
 * "There are more names than seats, so some lose." The one rule that makes the local vote a choice
 * (the law asks for a third to twice as many candidates as seats): MORE NAMES; three candidate cards
 * over two seats; on "so" two cards drop into the seats, and on "lose" the third is crossed out and
 * falls away.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 0), rise(frame, 4)];
  const cards = CARD.xs.map((_, i) => pop(frame, 4 + i * 3));
  const seats = rise(frame, cue("seats", "than") - 6);
  const sit = progress(frame, cue("seats", "so") - 6, cue("seats", "so") + 8, Easing.inOut(Easing.cubic));
  const cross = progress(frame, cue("seats", "lose") - 6, cue("seats", "lose") + 4);
  const fall = progress(frame, cue("seats", "lose") + 2, cue("seats", "lose") + 16, Easing.in(Easing.quad));

  return (
    <>
      <Headline size={150} style={{ top: 250, ...riseStyle(head[0], exit, 40) }}>
        MORE
      </Headline>
      <Headline size={150} style={{ top: 250 + 147, ...riseStyle(head[1], exit, 40) }}>
        <Accent>NAMES</Accent>
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {SEAT.xs.map((x) => (
          <Seat key={x} x={x} p={seats} />
        ))}
        {CARD.xs.map((x0, i) => {
          const loser = i === 2;
          const x1 = loser ? x0 : SEAT.xs[i] + (SEAT.w - CARD.w) / 2;
          const y1 = loser ? CARD.top : SEAT.top - CARD.h + 40;
          const x = loser ? x0 : x0 + (x1 - x0) * sit;
          const y = loser ? CARD.top + fall * 700 : CARD.top + (y1 - CARD.top) * sit;
          const p = cards[i];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: CARD.w,
                height: CARD.h,
                borderRadius: 24,
                background: CN.white,
                boxShadow: "0 20px 40px rgba(40,4,0,0.35)",
                opacity: Math.min(1, Math.max(0, p) * 1.5) * (loser ? 1 - fall : 1),
                transform: `scale(${0.6 + 0.4 * Math.min(1.08, Math.max(0, p))}) rotate(${loser ? fall * 25 : 0}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 24,
                boxSizing: "border-box",
              }}
            >
              <PersonIcon size={120} color={CN.red} />
              <div style={{ width: 150, height: 22, borderRadius: 11, background: "rgba(31,18,16,0.35)", marginTop: 14 }} />
              {loser && (
                <div style={{ position: "absolute", left: 30, top: 25 }}>
                  <Mark ok={false} size={180} p={cross} color={CN.red} width={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
