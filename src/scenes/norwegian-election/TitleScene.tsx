import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, NO, WEIGHT, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, FlagBar, Glass, Headline, Mono } from "./ui";

const TITLE = { top: 400, size: 136, left: 196 } as const;
const TITLE_HEIGHT = TITLE.size * 0.98 * 3;
const CARD = { top: 1000, height: 250 } as const;
const BAR = { left: 250, width: 420, h: 46 } as const;

/** One vote's weight: a bar that grows to `weight` (1 = a vote in Oslo) and its "×" label. */
const WeightRow: React.FC<{ top: number; name: string; weight: number; grow: number; label: number; strong?: boolean }> = ({
  top,
  name,
  weight,
  grow,
  label,
  strong,
}) => (
  <div style={{ position: "absolute", left: 0, top, width: 840, height: BAR.h }}>
    <Mono size={22} color={NO.white} style={{ position: "absolute", left: 40, top: 10, letterSpacing: 3 }}>
      {name}
    </Mono>
    <div
      style={{
        position: "absolute",
        left: BAR.left,
        top: 0,
        height: BAR.h,
        width: ((BAR.width * weight) / 1.9) * grow,
        borderRadius: 8,
        background: strong ? NO.white : "rgba(255,255,255,0.55)",
        boxShadow: strong ? "0 0 22px rgba(255,255,255,0.35)" : "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: BAR.left + ((BAR.width * weight) / 1.9) * grow + 16,
        top: 2,
        fontFamily: FONT.display,
        fontSize: 36,
        lineHeight: `${BAR.h}px`,
        color: NO.white,
        opacity: Math.min(1, Math.max(0, label) * 1.5),
        transform: `scale(${0.6 + 0.4 * label})`,
        transformOrigin: "left center",
      }}
    >
      ×{weight === 1 ? "1" : WEIGHT.ratio}
    </div>
  </div>
);

/**
 * "In Norway, a vote in the far north counts almost twice as much as a vote in Oslo."
 * The reference video's title card in Norwegian colours: a slice of the flag as a bar, HOW NORWAY
 * VOTES., the italic hook line, and a vote-weight card where Finnmark's bar grows to ×1.9 on
 * "twice" and Oslo's stops at ×1. Everything but the bars is on screen at frame 0, so the
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
  const card = rise(frame, cue("hook", "vote") - 8);
  const north = progress(frame, cue("hook", "far") - 2, cue("hook", "twice") + 4, Easing.out(Easing.cubic));
  const northLabel = pop(frame, cue("hook", "twice") - 2);
  const oslo = progress(frame, cue("hook", "vote#2") - 4, cue("hook", "Oslo") + 4, Easing.out(Easing.cubic));
  const osloLabel = pop(frame, cue("hook", "Oslo") - 2);

  return (
    <>
      <Eyebrow style={{ top: TITLE.top - 62, left: TITLE.left, ...riseStyle(kicker, exit, 24) }}>STORTING ELECTIONS — EXPLAINED</Eyebrow>
      <FlagBar height={TITLE_HEIGHT - 16} p={bar} style={{ left: 104, top: TITLE.top + 8, opacity: 1 - exit }} />
      {["HOW", "NORWAY", "VOTES"].map((word, i) => (
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
                  background: NO.white,
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
      <Aside size={52} style={{ top: TITLE.top + TITLE_HEIGHT + 30, left: TITLE.left, width: 780, ...riseStyle(aside, exit, 30) }}>
        Where some votes weigh more —
        <br />
        and how voting works, in 60 seconds.
      </Aside>

      <Glass top={CARD.top} height={CARD.height} tick={NO.white} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={NO.textSoft} style={{ position: "absolute", left: 40, top: 32, letterSpacing: 3 }}>
          WEIGHT OF ONE VOTE · IN SEATS
        </Mono>
        <WeightRow top={88} name={WEIGHT.finnmark.name} weight={1.9} grow={north} label={northLabel} strong />
        <WeightRow top={160} name={WEIGHT.oslo.name} weight={1} grow={oslo} label={osloLabel} />
      </Glass>
    </>
  );
};
