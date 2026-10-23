import React from "react";
import { useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CA, COMMONS, FONT, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, FlagBar, Headline, Mono } from "./ui";

const TITLE = { top: 420, size: 156, left: 196 } as const;
const TITLE_HEIGHT = TITLE.size * 0.98 * 3;

/** Draws a white box around its words when `p` goes 0 -> 1. */
const Boxed: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ position: "relative", display: "inline-block", margin: "0 14px", color: p > 0.5 ? CA.white : undefined }}>
    {children}
    <svg style={{ position: "absolute", left: -12, top: 2, width: "calc(100% + 24px)", height: "calc(100% + 4px)", overflow: "visible", transform: "rotate(-1.4deg)" }}>
      <rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        rx={10}
        fill="none"
        stroke={CA.white}
        strokeWidth={5}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        opacity={p > 0.01 ? 1 : 0}
        style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))" }}
      />
    </svg>
  </span>
);

/**
 * "In Canada, nobody votes for the prime minister, or the King."
 * The reference video's title card in Canadian colours: the flag stood on end, HOW CANADA VOTES.,
 * the italic hook line (a white box draws around "nobody" on "nobody") and a mono strip.
 * Everything is already on screen at frame 0, so the thumbnail is never empty.
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, -20);
  const lines = [rise(frame, -18), rise(frame, -14), rise(frame, -10)];
  const bar = progress(frame, -16, 10);
  const dot = rise(frame, -8);
  const aside = rise(frame, cue("hook", "Canada") - 8);
  const box = progress(frame, cue("hook", "nobody") - 2, cue("hook", "votes") + 6);
  const strip = rise(frame, 12);

  return (
    <>
      <Eyebrow style={{ top: TITLE.top - 62, left: TITLE.left, ...riseStyle(kicker, exit, 24) }}>FEDERAL ELECTIONS — EXPLAINED</Eyebrow>
      <FlagBar height={TITLE_HEIGHT - 16} p={bar} style={{ left: 104, top: TITLE.top + 8, opacity: 1 - exit }} />
      {["HOW", "CANADA", "VOTES"].map((word, i) => (
        <Headline key={word} size={TITLE.size} style={{ left: TITLE.left, top: TITLE.top + i * TITLE.size * 0.98, ...riseStyle(lines[i], exit, 50) }}>
          {i === 2 ? (
            <>
              <Accent>{word}</Accent>
              <span
                style={{
                  display: "inline-block",
                  width: TITLE.size * 0.2,
                  height: TITLE.size * 0.2,
                  marginLeft: TITLE.size * 0.1,
                  borderRadius: "50%",
                  background: CA.white,
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
        Why <Boxed p={box}>nobody</Boxed> votes for
        <br />
        the prime minister — in 60 seconds.
      </Aside>
      <div style={{ position: "absolute", left: TITLE.left, top: TITLE.top + TITLE_HEIGHT + 196, width: 764, height: 2, background: CA.line, ...riseStyle(strip, exit, 20) }} />
      <Mono size={21} style={{ position: "absolute", left: TITLE.left, top: TITLE.top + TITLE_HEIGHT + 222, fontWeight: 400, ...riseStyle(strip, exit, 20) }}>
        {COMMONS.seats} RIDINGS · {COMMONS.seats} SEATS · <span style={{ fontFamily: FONT.mono, color: CA.white, fontWeight: 700 }}>{COMMONS.majority} TO WIN</span>
      </Mono>
    </>
  );
};
