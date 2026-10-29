import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, MX, TERM, type SceneProps } from "./constants";
import { Accent, Aside, Emblem, Eyebrow, FlagBar, Glass, Headline, Mono, Stamp } from "./ui";

const TITLE = { top: 400, size: 116, left: 196 } as const;
const TITLE_HEIGHT = TITLE.size * 0.98 * 3;
const CARD = { top: 966, height: 316 } as const;
const YEARS = { left: 40, top: 92, width: 760, height: 76, gap: 10 } as const;

/**
 * "Mexico's president gets one term. Six years. Then never again." The reference video's title
 * card in Mexican colours: the tricolour as a bar, the coat of arms, HOW MEXICO VOTES., the italic
 * hook line, and a card where ONE TERM appears on "one", six year blocks (2024–2030) fill one by
 * one on "Six years", and a NEVER AGAIN stamp slams on "never". Everything but the card is on
 * screen at frame 0, so the thumbnail is never empty.
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, -20);
  const lines = [rise(frame, -18), rise(frame, -14), rise(frame, -10)];
  const bar = progress(frame, -16, 10);
  const dot = rise(frame, -8);
  const aside = rise(frame, -6);
  const arms = pop(frame, -4);
  const card = rise(frame, cue("hook", "president") - 8);
  const one = pop(frame, cue("hook", "one") - 3);
  const fill = progress(frame, cue("hook", "Six") - 3, cue("hook", "years", "end"));
  const stamp = pop(frame, cue("hook", "never") - 2);
  const blockW = (YEARS.width - YEARS.gap * (TERM.years - 1)) / TERM.years;

  return (
    <>
      <Eyebrow style={{ top: TITLE.top - 62, left: TITLE.left, ...riseStyle(kicker, exit, 24) }}>MEXICO'S ELECTIONS — EXPLAINED</Eyebrow>
      <FlagBar height={TITLE_HEIGHT - 16} p={bar} style={{ left: 104, top: TITLE.top + 8, opacity: 1 - exit }} />
      {["HOW", "MEXICO", "VOTES"].map((word, i) => (
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
                  background: MX.white,
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
        One term, then never again —
        <br />
        and how voting works, in 60 seconds.
      </Aside>

      <Emblem size={150} p={arms} style={{ position: "absolute", left: 790, top: TITLE.top + 10, opacity: (1 - exit) * Math.min(1, Math.max(0, arms) * 1.5) }} />

      <Glass top={CARD.top} height={CARD.height} tick={MX.red} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={MX.textSoft} style={{ position: "absolute", left: 40, top: 32, letterSpacing: 3 }}>
          THE PRESIDENT'S TERM
        </Mono>
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 22,
            fontFamily: FONT.display,
            fontSize: 40,
            lineHeight: 1,
            color: MX.white,
            opacity: Math.min(1, Math.max(0, one) * 1.5),
            transform: `scale(${0.6 + 0.4 * one})`,
            transformOrigin: "right center",
          }}
        >
          ONE TERM
        </div>
        {Array.from({ length: TERM.years }, (_, i) => {
          const on = Math.min(1, Math.max(0, fill * TERM.years - i));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: YEARS.left + i * (blockW + YEARS.gap),
                top: YEARS.top,
                width: blockW,
                height: YEARS.height,
                borderRadius: 10,
                background: on > 0 ? `rgba(255,255,255,${0.15 + 0.77 * on})` : "rgba(255,255,255,0.1)",
                border: `2px solid ${MX.line}`,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT.display,
                fontSize: 34,
                color: on > 0.5 ? MX.green : MX.textFaint,
              }}
            >
              {i + 1}
            </div>
          );
        })}
        <Mono size={18} color={MX.textSoft} style={{ position: "absolute", left: 40, top: 186, letterSpacing: 2.5, opacity: Math.min(1, fill * 3) }}>
          {TERM.from}
        </Mono>
        <Mono size={18} color={MX.textSoft} style={{ position: "absolute", right: 40, top: 186, letterSpacing: 2.5, opacity: Math.min(1, Math.max(0, fill * 3 - 2)) }}>
          {TERM.to}
        </Mono>
        <Stamp p={stamp} size={46} color={MX.white} rotate={-5} style={{ left: 190, top: 222, background: MX.red }}>
          NEVER AGAIN
        </Stamp>
      </Glass>
    </>
  );
};
