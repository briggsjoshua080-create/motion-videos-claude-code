import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { US, type SceneProps } from "./constants";
import { Accent, CapitolDome, GradeStamp, Headline, SectionNumeral } from "./ui";

const BAR = { left: 120, top: 500, width: 840, height: 72 } as const;

/**
 * "Halfway through his term, America elects Congress. Lose seats, and he fails." Section 01 sets the
 * comic premise (comedy formula, rule 2): HALFWAY over a four-year term bar that fills to its middle,
 * where a red pin lands; the Capitol pops up with CONGRESS ("that's the exam"); and on "Lose" a red F
 * is stamped right onto it.
 */
export const ExamScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = rise(frame, 1);
  const bar = rise(frame, 3);
  const fill = progress(frame, cue("exam", "Halfway") - 2, cue("exam", "term", "end"), Easing.inOut(Easing.cubic));
  const pin = pop(frame, cue("exam", "term", "end") - 6);
  const dome = pop(frame, cue("exam", "America") - 4);
  const label = rise(frame, cue("exam", "Congress") - 4);
  const stampAt = cue("exam", "Lose") - 2;
  const stamp = progress(frame, stampAt - 6, stampAt, Easing.in(Easing.cubic));
  const shake = frame >= stampAt && frame < stampAt + 6 ? Math.sin((frame - stampAt) * 2.6) * 7 * (1 - (frame - stampAt) / 6) : 0;
  const pinX = BAR.left + BAR.width * 0.5 * fill;

  return (
    <>
      <SectionNumeral n="01" p={numeral * (1 - exit)} />
      <Headline size={150} style={{ top: 270, ...riseStyle(head, exit, 50) }}>
        HALFWAY
      </Headline>

      <div style={{ position: "absolute", inset: 0, ...riseStyle(bar, exit, 40) }}>
        <div
          style={{
            position: "absolute",
            left: BAR.left,
            top: BAR.top,
            width: BAR.width,
            height: BAR.height,
            borderRadius: BAR.height / 2,
            background: "rgba(255,255,255,0.12)",
            boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.55)",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: BAR.width * 0.5 * fill, background: US.white }} />
          {[0.25, 0.5, 0.75].map((x) => (
            <div key={x} style={{ position: "absolute", left: BAR.width * x - 2, top: 14, width: 4, height: BAR.height - 28, borderRadius: 2, background: x * 2 <= fill + 0.001 ? "rgba(10,49,97,0.35)" : "rgba(255,255,255,0.35)" }} />
          ))}
        </div>
        <svg width={80} height={120} viewBox="0 0 80 120" style={{ position: "absolute", left: pinX - 40, top: BAR.top - 92, overflow: "visible", opacity: Math.min(1, Math.max(0, pin) * 1.5), transform: `scale(${0.5 + 0.5 * Math.min(1.1, Math.max(0, pin))})`, transformOrigin: "40px 120px" }}>
          <path d="M40 116 L22 62 A26 26 0 1 1 58 62 Z" fill={US.red} stroke={US.white} strokeWidth={5} strokeLinejoin="round" />
          <circle cx={40} cy={42} r={10} fill={US.white} />
        </svg>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translate(${shake}px, ${-exit * 40}px)` }}>
        <CapitolDome
          size={420}
          style={{ position: "absolute", left: 330, top: 640, opacity: Math.min(1, Math.max(0, dome) * 1.5), transform: `scale(${0.6 + 0.4 * Math.min(1.08, Math.max(0, dome))})`, transformOrigin: "210px 344px", filter: "drop-shadow(0 22px 34px rgba(0,8,30,0.45))" }}
        />
        <GradeStamp p={stamp} size={210} color={US.red} style={{ left: 680, top: 600, background: "rgba(255,255,255,0.92)" }} />
      </div>
      <Headline size={130} style={{ top: 1010, ...riseStyle(label, exit, 30) }}>
        <Accent>CONGRESS</Accent>
      </Headline>
    </>
  );
};
