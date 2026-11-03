import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, RU, TIMELINE, TIMELINE_SPANS, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, FlagBar, Glass, Headline, Mono, Stamp } from "./ui";

const TITLE = { top: 400, size: 116, left: 196 } as const;
const TITLE_HEIGHT = TITLE.size * 0.98 * 3;
const CARD = { top: 966, height: 300 } as const;
const BAR = { left: 40, top: 112, w: 760, h: 64 } as const;
const yearX = (y: number) => BAR.left + (BAR.w * (y - TIMELINE.from)) / (TIMELINE.to - TIMELINE.from);

/**
 * "Russia's president can legally rule until 2036." The reference video's title card in Russian
 * colours: the tricolour as a bar, HOW RUSSIA VOTES., the italic hook line, and a timeline card:
 * Putin's years in power (president or PM) fill from 1999 to today on "president", the 2020 reset
 * mark appears on "legally", the bar runs on (striped, still to come) to 2036 on "rule until", and a
 * 2036 stamp slams on "2036". Everything but the card is on screen at frame 0.
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, -20);
  const lines = [rise(frame, -18), rise(frame, -14), rise(frame, -10)];
  const bar = progress(frame, -16, 10);
  const dot = rise(frame, -8);
  const aside = rise(frame, -6);
  const card = rise(frame, cue("hook", "Russia's") - 10);
  const past = progress(frame, cue("hook", "president") - 6, cue("hook", "legally") + 2, Easing.out(Easing.cubic));
  const reset = pop(frame, cue("hook", "legally") - 2);
  const future = progress(frame, cue("hook", "rule") - 2, cue("hook", "2036") + 4, Easing.inOut(Easing.cubic));
  const stamp = pop(frame, cue("hook", "2036") - 1);
  const nowX = yearX(TIMELINE.now);
  const fillX = past < 1 ? BAR.left + (nowX - BAR.left) * past : nowX + (yearX(TIMELINE.to) - nowX) * future;

  return (
    <>
      <Eyebrow style={{ top: TITLE.top - 62, left: TITLE.left, ...riseStyle(kicker, exit, 24) }}>RUSSIA'S ELECTIONS — EXPLAINED</Eyebrow>
      <FlagBar height={TITLE_HEIGHT - 16} p={bar} style={{ left: 104, top: TITLE.top + 8, opacity: 1 - exit }} />
      {["HOW", "RUSSIA", "VOTES"].map((word, i) => (
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
                  background: RU.white,
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
        Two ballots, one strong president —
        <br />
        how it works, in 60 seconds.
      </Aside>

      <Glass top={CARD.top} height={CARD.height} tick={RU.red} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={RU.textSoft} style={{ position: "absolute", left: 40, top: 30, letterSpacing: 3 }}>
          PUTIN IN POWER · PRESIDENT OR PM
        </Mono>
        {/* The empty track. */}
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.w, height: BAR.h, borderRadius: 12, background: "rgba(255,255,255,0.1)", border: `2px solid ${RU.line}`, boxSizing: "border-box" }} />
        {/* Years served (solid) and the years the 2020 change allows (striped). */}
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: Math.min(fillX, nowX) - BAR.left, height: BAR.h, borderRadius: "12px 0 0 12px", background: RU.red, boxShadow: `0 0 30px ${RU.redGlow}` }} />
        <div
          style={{
            position: "absolute",
            left: nowX,
            top: BAR.top,
            width: Math.max(0, fillX - nowX),
            height: BAR.h,
            borderRadius: "0 12px 12px 0",
            background: `repeating-linear-gradient(-45deg, ${RU.red} 0 12px, rgba(213,43,30,0.35) 12px 24px)`,
          }}
        />
        {/* Role labels inside the bar. */}
        {TIMELINE_SPANS.map((s) => {
          const mid = (yearX(s.from) + yearX(Math.min(s.to, TIMELINE.now))) / 2;
          const shown = fillX > mid + 20;
          return s.to - s.from >= 4 ? (
            <Mono key={s.from} size={15} color={RU.white} style={{ position: "absolute", left: mid - 60, width: 120, textAlign: "center", top: BAR.top + 22, letterSpacing: 1.5, opacity: shown ? 1 : 0 }}>
              {s.role}
            </Mono>
          ) : null;
        })}
        {/* Year marks under the bar. */}
        {[TIMELINE.from, 2008, 2012, TIMELINE.now, TIMELINE.to].map((y) => (
          <Mono key={y} size={17} color={y === TIMELINE.to ? RU.white : RU.textSoft} style={{ position: "absolute", left: yearX(y) - 30, width: 60, textAlign: "center", top: BAR.top + BAR.h + 10, letterSpacing: 1, opacity: y === TIMELINE.to ? future : Math.min(1, card) }}>
            {y === TIMELINE.now ? "NOW" : y}
          </Mono>
        ))}
        {/* The 2020 reset mark. */}
        <div style={{ position: "absolute", left: yearX(TIMELINE.reset) - 2, top: BAR.top - 16, width: 4, height: BAR.h + 32, borderRadius: 2, background: RU.white, opacity: Math.min(1, Math.max(0, reset) * 1.5) }} />
        <Mono size={16} color={RU.white} style={{ position: "absolute", left: yearX(TIMELINE.reset) - 120, width: 240, textAlign: "center", top: BAR.top - 40, letterSpacing: 1.5, opacity: Math.min(1, Math.max(0, reset) * 1.5) }}>
          2020: TERMS RESET
        </Mono>
        <Stamp p={stamp} size={46} color={RU.white} rotate={-7} style={{ left: 560, top: 214, background: RU.red, borderColor: RU.white }}>
          2036
        </Stamp>
        <div style={{ position: "absolute", left: 40, top: 236, fontSize: 22, fontWeight: 500, color: RU.textSoft, whiteSpace: "nowrap", opacity: Math.min(1, Math.max(0, stamp)) }}>
          …if he runs again in 2030 and wins.
        </div>
      </Glass>
    </>
  );
};
