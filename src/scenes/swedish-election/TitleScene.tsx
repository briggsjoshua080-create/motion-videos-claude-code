import React from "react";
import { useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, SE, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, FlagBar, Headline, Mono } from "./ui";

const TITLE = { top: 420, size: 160, left: 196 } as const;
const TITLE_HEIGHT = TITLE.size * 0.98 * 3;

/** Draws a yellow box around its words when `p` goes 0 -> 1. */
const Boxed: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ position: "relative", display: "inline-block", color: p > 0.5 ? SE.white : undefined }}>
    {children}
    <svg style={{ position: "absolute", left: -12, top: 2, width: "calc(100% + 24px)", height: "calc(100% + 4px)", overflow: "visible", transform: "rotate(-1.4deg)" }}>
      <rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        rx={10}
        fill="none"
        stroke={SE.yellow}
        strokeWidth={5}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        opacity={p > 0.01 ? 1 : 0}
        style={{ filter: "drop-shadow(0 0 8px rgba(254,204,2,0.5))" }}
      />
    </svg>
  </span>
);

/**
 * "In Sweden, you can become prime minister without a single yes vote."
 * The reference video's title card in Swedish colours: a tall Nordic-cross bar, HOW SWEDEN VOTES.,
 * the italic hook line (a yellow box draws around "zero yes votes" on "single") and a mono strip.
 * Everything is already on screen at frame 0, so the thumbnail is never empty.
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, -20);
  const lines = [rise(frame, -18), rise(frame, -14), rise(frame, -10)];
  const bar = progress(frame, -16, 10);
  const dot = rise(frame, -8);
  const aside = rise(frame, cue("hook", "you") - 6);
  const box = progress(frame, cue("hook", "single") - 2, cue("hook", "vote") + 4);
  const strip = rise(frame, 12);

  return (
    <>
      <Eyebrow style={{ top: TITLE.top - 62, left: TITLE.left, ...riseStyle(kicker, exit, 24) }}>GENERAL ELECTIONS — EXPLAINED</Eyebrow>
      <FlagBar height={TITLE_HEIGHT - 16} p={bar} style={{ left: 104, top: TITLE.top + 8, opacity: 1 - exit }} />
      {["HOW", "SWEDEN", "VOTES"].map((word, i) => (
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
                  background: SE.white,
                  boxShadow: "0 0 24px rgba(255,255,255,0.6)",
                  transform: `scale(${dot})`,
                }}
              />
            </>
          ) : (
            word
          )}
        </Headline>
      ))}
      <Aside size={54} style={{ top: TITLE.top + TITLE_HEIGHT + 34, left: TITLE.left, width: 780, ...riseStyle(aside, exit, 30) }}>
        The prime minister who needs
        <br />
        <Boxed p={box}>zero yes votes</Boxed> — in 60 seconds.
      </Aside>
      <div style={{ position: "absolute", left: TITLE.left, top: TITLE.top + TITLE_HEIGHT + 196, width: 764, height: 2, background: SE.line, ...riseStyle(strip, exit, 20) }} />
      <Mono size={21} style={{ position: "absolute", left: TITLE.left, top: TITLE.top + TITLE_HEIGHT + 222, fontWeight: 400, ...riseStyle(strip, exit, 20) }}>
        RIKSDAG · 349 SEATS · 4% · <span style={{ fontFamily: FONT.mono, color: SE.yellow }}>3 BALLOTS</span>
      </Mono>
    </>
  );
};
