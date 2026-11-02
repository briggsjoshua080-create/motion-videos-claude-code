import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AR, FONT, LEAD_POINTS, WIN_WITH_LEAD, type SceneProps } from "./constants";
import { Accent, Aside, Emblem, Eyebrow, FlagBar, Glass, Headline, Mono, Stamp } from "./ui";

const TITLE = { top: 400, size: 104, left: 196 } as const;
const TITLE_HEIGHT = TITLE.size * 0.98 * 3;
const CARD = { top: 966, height: 300 } as const;
const BAR = { left: 40, top: 110, w: 760, h: 74 } as const;

/**
 * "In Argentina, 40% of the vote can make you president." The reference video's title card in
 * Argentine colours: the flag as a bar, a slowly turning Sun of May, HOW ARGENTINA VOTES., the
 * italic hook line, and a card where a vote bar fills to 40% (on "40%"), the 50% "majority" mark
 * it never reaches appears (on "vote"), and a PRESIDENT stamp slams on "president". Everything but
 * the card is on screen at frame 0, so the thumbnail is never empty.
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, -20);
  const lines = [rise(frame, -18), rise(frame, -14), rise(frame, -10)];
  const bar = progress(frame, -16, 10);
  const dot = rise(frame, -8);
  const aside = rise(frame, -6);
  const sun = pop(frame, -4);
  const card = rise(frame, cue("hook", "Argentina") - 8);
  const fill = progress(frame, cue("hook", "40%") - 4, cue("hook", "40%", "end") + 4, Easing.out(Easing.cubic));
  const half = progress(frame, cue("hook", "vote") - 4, cue("hook", "vote") + 6);
  const stamp = pop(frame, cue("hook", "president") - 1);
  const note = rise(frame, cue("hook", "president", "end"));
  const x = (pct: number) => BAR.left + (BAR.w * pct) / 100;

  return (
    <>
      <Eyebrow style={{ top: TITLE.top - 62, left: TITLE.left, ...riseStyle(kicker, exit, 24) }}>ARGENTINA'S ELECTIONS — EXPLAINED</Eyebrow>
      <FlagBar height={TITLE_HEIGHT - 16} p={bar} style={{ left: 104, top: TITLE.top + 8, opacity: 1 - exit }} />
      {["HOW", "ARGENTINA", "VOTES"].map((word, i) => (
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
                  background: AR.sun,
                  boxShadow: "0 0 24px rgba(246,180,14,0.6)",
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
        Where 40% can be enough —
        <br />
        and how voting works, in 60 seconds.
      </Aside>

      <Emblem size={150} p={sun} spin={frame * 0.25} style={{ position: "absolute", left: 690, top: TITLE.top + 2 * TITLE.size * 0.98 - 22, opacity: (1 - exit) * Math.min(1, Math.max(0, sun) * 1.5) }} />

      <Glass top={CARD.top} height={CARD.height} tick={AR.sun} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={AR.textSoft} style={{ position: "absolute", left: 40, top: 30, letterSpacing: 3 }}>
          PRESIDENTIAL VOTE · ROUND ONE
        </Mono>
        {/* The whole vote, and the share that can be enough. */}
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.w, height: BAR.h, borderRadius: 12, background: "rgba(255,255,255,0.12)", border: `2px solid ${AR.line}`, boxSizing: "border-box" }} />
        <div
          style={{
            position: "absolute",
            left: BAR.left,
            top: BAR.top,
            width: (BAR.w * WIN_WITH_LEAD * fill) / 100,
            height: BAR.h,
            borderRadius: 12,
            background: AR.sun,
            boxShadow: "0 0 30px rgba(246,180,14,0.55)",
          }}
        />
        <div style={{ position: "absolute", left: BAR.left + 20, top: BAR.top, fontFamily: FONT.display, fontSize: 44, lineHeight: `${BAR.h}px`, color: AR.navy, opacity: Math.min(1, fill * 2) }}>
          {Math.round(WIN_WITH_LEAD * fill)}%
        </div>
        {/* The majority line it does not need to reach. */}
        <div style={{ position: "absolute", left: x(50) - 2, top: BAR.top - 14, width: 4, height: BAR.h + 28, borderRadius: 2, background: AR.white, opacity: half }} />
        <Mono size={17} color={AR.white} style={{ position: "absolute", left: x(50) + 14, top: BAR.top + 14, letterSpacing: 1.5, opacity: half }}>
          50% MAJORITY
        </Mono>
        <Mono size={17} color={AR.sun} style={{ position: "absolute", left: x(50) + 14, top: BAR.top + 42, letterSpacing: 1.5, opacity: half }}>
          NOT NEEDED
        </Mono>
        <Stamp p={stamp} size={40} color={AR.navy} rotate={-7} style={{ left: 556, top: 196, background: AR.sun, borderColor: AR.white }}>
          PRESIDENT
        </Stamp>
        <div style={{ position: "absolute", left: 40, top: 262, fontSize: 22, fontWeight: 500, color: AR.textSoft, whiteSpace: "nowrap", ...riseStyle(note, 0, 12) }}>
          …if the runner-up is more than {LEAD_POINTS} points behind.
        </div>
      </Glass>
    </>
  );
};
