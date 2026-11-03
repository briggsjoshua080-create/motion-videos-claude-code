import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, RUN_OFF_SHARE, UA, type SceneProps } from "./constants";
import { Accent, Aside, Headline, TVFrame, roll } from "./ui";

/** A stage microphone on a stand (stand-up comedy), drawn generic. */
const Microphone: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <rect x={38} y={8} width={24} height={40} rx={12} fill={UA.yellow} />
    <path d="M30 34 v8 a20 20 0 0 0 40 0 v-8" fill="none" stroke={UA.white} strokeWidth={5} strokeLinecap="round" />
    <line x1={50} y1={62} x2={50} y2={88} stroke={UA.white} strokeWidth={5} strokeLinecap="round" />
    <line x1={34} y1={90} x2={66} y2={90} stroke={UA.white} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

/**
 * "In 2019, TV comedian Volodymyr Zelensky won the run-off with 73%." Two halves of at least 2 s each
 * (rule 6): an old TV with a spotlit stand-up microphone and TV COMEDIAN; then, on "won", ZELENSKY
 * and a huge counter that runs up to 73% on its word, with "won the run-off." (no likeness of him).
 */
export const ComedianScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const won = cue("comedian", "won");
  const swap = progress(frame, won - 6, won + 2, Easing.in(Easing.cubic));
  const tv = rise(frame, 2);
  const head = [rise(frame, cue("comedian", "TV") - 8), rise(frame, cue("comedian", "comedian") - 6)];
  const spot = progress(frame, 6, 22);
  const name = rise(frame, won - 2);
  // The count lands on 73 as the number is spoken, so the final figure stays up for over 1.5 s.
  const count = progress(frame, won, cue("comedian", "73%") + 2, Easing.out(Easing.cubic));
  const big = pop(frame, won);
  const aside = rise(frame, cue("comedian", "run-off") - 4);

  return (
    <>
      {/* Half 1: the comedian on TV. */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - swap, transform: `translateY(${-swap * 60}px)` }}>
        <div style={{ position: "absolute", inset: 0, ...riseStyle(tv, 0, 80) }}>
          <TVFrame left={170} top={340} width={740} height={440}>
            <div style={{ position: "absolute", left: "50%", top: -40, width: 520, height: 520, marginLeft: -260, background: "radial-gradient(circle at 50% 30%, rgba(255,240,170,0.55) 0%, rgba(255,240,170,0) 62%)", opacity: spot }} />
            <div style={{ position: "absolute", left: "50%", top: 60, marginLeft: -110 }}>
              <Microphone size={220} />
            </div>
          </TVFrame>
        </div>
        <Headline size={140} style={{ top: 850, ...riseStyle(head[0], 0, 40) }}>
          TV
        </Headline>
        <Headline size={140} style={{ top: 850 + 138, ...riseStyle(head[1], 0, 40) }}>
          <Accent>COMEDIAN</Accent>
        </Headline>
      </div>

      {/* Half 2: the run-off result. */}
      <Headline size={140} style={{ top: 300, ...riseStyle(name, exit, 40) }}>
        ZELENSKY
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 470,
          fontFamily: FONT.display,
          fontSize: 340,
          lineHeight: 0.92,
          letterSpacing: -6,
          color: UA.yellow,
          textShadow: "0 0 70px rgba(255,215,0,0.5)",
          whiteSpace: "nowrap",
          opacity: Math.min(1, Math.max(0, big) * 1.5) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * Math.min(1.08, Math.max(0, big))}) translateY(${-exit * 50}px)`,
          transformOrigin: "0 50%",
        }}
      >
        {roll(0, RUN_OFF_SHARE, count)}%
      </div>
      <Aside size={120} style={{ top: 840, ...riseStyle(aside, exit, 30) }}>
        won the run-off.
      </Aside>
    </>
  );
};
