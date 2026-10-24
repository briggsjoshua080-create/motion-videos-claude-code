import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DEPUTIES, FONT, PRESIDENCY, RO, SENATORS, THRESHOLD, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, FlagBar, Headline, Mono, Stamp } from "./ui";

const TITLE = { top: 420, size: 136, left: 196 } as const;
const TITLE_HEIGHT = TITLE.size * 0.98 * 3;

/** Draws a yellow box around its words when `p` goes 0 -> 1. */
const Boxed: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ position: "relative", display: "inline-block", color: p > 0.5 ? RO.white : undefined }}>
    {children}
    <svg style={{ position: "absolute", left: -12, top: 2, width: "calc(100% + 24px)", height: "calc(100% + 4px)", overflow: "visible", transform: "rotate(-1.4deg)" }}>
      <rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        rx={10}
        fill="none"
        stroke={RO.yellow}
        strokeWidth={5}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        opacity={p > 0.01 ? 1 : 0}
        style={{ filter: "drop-shadow(0 0 8px rgba(252,209,22,0.5))" }}
      />
    </svg>
  </span>
);

/**
 * "In 2024, Romania's top court cancelled a presidential election."
 * The reference video's title card in Romanian colours: the tricolour stood on end as a bar,
 * HOW ROMANIA VOTES., an ANNULLED stamp that slams in on "cancelled", the italic hook line (a yellow
 * box draws around "cancelled") and a mono strip. Everything is on screen at frame 0, so the
 * thumbnail is never empty.
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, -20);
  const lines = [rise(frame, -18), rise(frame, -14), rise(frame, -10)];
  const bar = progress(frame, -16, 10);
  const dot = rise(frame, -8);
  const aside = rise(frame, -6);
  const box = progress(frame, cue("hook", "cancelled") - 2, cue("hook", "presidential") + 4);
  const stamp = pop(frame, cue("hook", "cancelled") - 3);
  const strip = rise(frame, 12);

  return (
    <>
      <Eyebrow style={{ top: TITLE.top - 62, left: TITLE.left, ...riseStyle(kicker, exit, 24) }}>GENERAL ELECTIONS — EXPLAINED</Eyebrow>
      <FlagBar height={TITLE_HEIGHT - 16} p={bar} style={{ left: 104, top: TITLE.top + 8, opacity: 1 - exit }} />
      {["HOW", "ROMANIA", "VOTES"].map((word, i) => (
        <Headline key={word} size={TITLE.size} style={{ left: TITLE.left, top: TITLE.top + i * TITLE.size * 0.98, ...riseStyle(lines[i], exit, 50) }}>
          {i === 2 ? (
            <>
              <Accent>{word}</Accent>
              <span
                style={{
                  display: "inline-block",
                  width: TITLE.size * 0.2,
                  height: TITLE.size * 0.2,
                  marginLeft: TITLE.size * 0.06,
                  borderRadius: "50%",
                  background: RO.red,
                  boxShadow: "0 0 24px rgba(206,17,38,0.7)",
                  transform: `scale(${dot})`,
                }}
              />
            </>
          ) : (
            word
          )}
        </Headline>
      ))}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - exit }}>
        <Stamp p={stamp} size={50} rotate={-9} style={{ left: 590, top: TITLE.top + 22 }}>
          ANNULLED
        </Stamp>
        <Mono size={20} color={RO.yellow} style={{ position: "absolute", left: 620, top: TITLE.top + 108, opacity: Math.min(1, Math.max(0, stamp)), transform: "rotate(-9deg)" }}>
          {PRESIDENCY.annulled}
        </Mono>
      </div>
      <Aside size={52} style={{ top: TITLE.top + TITLE_HEIGHT + 34, left: TITLE.left, width: 780, ...riseStyle(aside, exit, 30) }}>
        The election a court <Boxed p={box}>cancelled</Boxed> —
        <br />
        and how voting works, in 60 seconds.
      </Aside>
      <div style={{ position: "absolute", left: TITLE.left, top: TITLE.top + TITLE_HEIGHT + 196, width: 764, height: 2, background: RO.line, ...riseStyle(strip, exit, 20) }} />
      <Mono size={21} style={{ position: "absolute", left: TITLE.left, top: TITLE.top + TITLE_HEIGHT + 222, fontWeight: 400, ...riseStyle(strip, exit, 20) }}>
        {DEPUTIES} + {SENATORS} SEATS · {THRESHOLD}% · <span style={{ fontFamily: FONT.mono, color: RO.yellow }}>2 BALLOTS</span>
      </Mono>
    </>
  );
};
