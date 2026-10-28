import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, HOOK, SI, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, FlagBar, Glass, Headline, Mono, Stamp, Triglav } from "./ui";

const TITLE = { top: 400, size: 116, left: 196 } as const;
const TITLE_HEIGHT = TITLE.size * 0.98 * 3;
const CARD = { top: 966, height: 316 } as const;
const STEP = { top: 84, gap: 92 } as const;

/** One step of the hook's timeline: a dot on the line, the date and what happened. */
const Step: React.FC<{ top: number; date: string; text: string; p: number; strong?: boolean }> = ({ top, date, text, p, strong }) => (
  <div style={{ position: "absolute", left: 40, top, display: "flex", alignItems: "center", gap: 22, ...riseStyle(p, 0, 20) }}>
    <div
      style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        flexShrink: 0,
        background: strong ? SI.red : SI.white,
        boxShadow: strong ? `0 0 0 3px ${SI.white}, 0 0 18px rgba(225,37,44,0.6)` : "0 0 16px rgba(255,255,255,0.45)",
      }}
    />
    <div>
      <Mono size={18} color={SI.textSoft} style={{ letterSpacing: 3 }}>
        {date}
      </Mono>
      <div style={{ marginTop: 4, fontFamily: FONT.display, fontSize: 36, lineHeight: 1, color: SI.white, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  </div>
);

/**
 * "Slovenia's biggest party won the election, and still ended up in opposition." The reference
 * video's title card in Slovenian colours: the tricolour as a bar, the Triglav coat of arms, HOW
 * SLOVENIA VOTES., the italic hook line, and a two-step timeline card: most seats (22 Mar) on
 * "won", the rival becoming prime minister (22 May) on "ended", with an IN OPPOSITION stamp on
 * "opposition". Everything but the timeline is on screen at frame 0, so the thumbnail is never empty.
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
  const card = rise(frame, cue("hook", "biggest") - 8);
  const won = rise(frame, cue("hook", "won") - 4);
  const line = progress(frame, cue("hook", "and") - 4, cue("hook", "ended") - 2);
  const lost = rise(frame, cue("hook", "ended") - 4);
  const stamp = pop(frame, cue("hook", "opposition") - 3);

  return (
    <>
      <Eyebrow style={{ top: TITLE.top - 62, left: TITLE.left, ...riseStyle(kicker, exit, 24) }}>SLOVENIA'S ELECTIONS — EXPLAINED</Eyebrow>
      <FlagBar height={TITLE_HEIGHT - 16} p={bar} style={{ left: 104, top: TITLE.top + 8, opacity: 1 - exit }} />
      {["HOW", "SLOVENIA", "VOTES"].map((word, i) => (
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
                  background: SI.white,
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
        Most seats, but no government —
        <br />
        and how voting works, in 60 seconds.
      </Aside>

      <Triglav size={118} p={arms} style={{ position: "absolute", left: 812, top: TITLE.top + TITLE.size * 0.98 * 2 - 18, opacity: (1 - exit) * Math.min(1, Math.max(0, arms) * 1.5) }} />

      <Glass top={CARD.top} height={CARD.height} tick={SI.red} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={SI.textSoft} style={{ position: "absolute", left: 40, top: 32, letterSpacing: 3 }}>
          2026 · THE FREEDOM MOVEMENT
        </Mono>
        {/* The timeline line between the two dots. */}
        <div style={{ position: "absolute", left: 51, top: STEP.top + 40, width: 4, height: (STEP.gap - 4) * line, borderRadius: 2, background: SI.white, opacity: 0.7 }} />
        <Step top={STEP.top} date={HOOK.won} text="WINS THE MOST SEATS" p={won} />
        <Step top={STEP.top + STEP.gap} date={HOOK.lost} text="RIVAL BECOMES PM" p={lost} strong />
        <Stamp p={stamp} size={32} rotate={-4} style={{ left: 88, top: 252 }}>
          IN OPPOSITION
        </Stamp>
      </Glass>
    </>
  );
};
