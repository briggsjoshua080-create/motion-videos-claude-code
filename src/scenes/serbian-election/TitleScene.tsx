import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, HOOK, RS, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, FlagBar, Glass, Headline, Mono, Stamp } from "./ui";

const TITLE = { top: 400, size: 136, left: 196 } as const;
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
        background: strong ? RS.red : RS.white,
        boxShadow: strong ? `0 0 0 3px ${RS.white}, 0 0 18px rgba(198,54,60,0.6)` : "0 0 16px rgba(255,255,255,0.45)",
      }}
    />
    <div>
      <Mono size={18} color={RS.textSoft} style={{ letterSpacing: 3 }}>
        {date}
      </Mono>
      <div style={{ marginTop: 4, fontFamily: FONT.display, fontSize: 36, lineHeight: 1, color: RS.white, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  </div>
);

/**
 * "Serbia's president quit to run for prime minister. Weeks later, he lost to a list backed by
 * students." The reference video's title card in Serbian colours: the tricolour as a bar, HOW
 * SERBIA VOTES., the italic hook line, and a two-step timeline card: quit as President (27 Sep)
 * on "quit", lost the election (25 Oct) on "lost", with a STUDENT LIST WINS stamp on "students".
 * Everything but the timeline is on screen at frame 0, so the thumbnail is never empty.
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, -20);
  const lines = [rise(frame, -18), rise(frame, -14), rise(frame, -10)];
  const bar = progress(frame, -16, 10);
  const dot = rise(frame, -8);
  const aside = rise(frame, -6);
  const card = rise(frame, cue("hook", "president") - 8);
  const quit = rise(frame, cue("hook", "quit") - 4);
  const line = progress(frame, cue("hook", "Weeks") - 6, cue("hook", "lost") - 2);
  const lost = rise(frame, cue("hook", "lost") - 4);
  const stamp = pop(frame, cue("hook", "students") - 3);

  return (
    <>
      <Eyebrow style={{ top: TITLE.top - 62, left: TITLE.left, ...riseStyle(kicker, exit, 24) }}>SERBIA'S ELECTIONS — EXPLAINED</Eyebrow>
      <FlagBar height={TITLE_HEIGHT - 16} p={bar} style={{ left: 104, top: TITLE.top + 8, opacity: 1 - exit }} />
      {["HOW", "SERBIA", "VOTES"].map((word, i) => (
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
                  background: RS.white,
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
        A president who quit, a snap vote —
        <br />
        and how voting works, in 60 seconds.
      </Aside>

      <Glass top={CARD.top} height={CARD.height} tick={RS.red} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={RS.textSoft} style={{ position: "absolute", left: 40, top: 32, letterSpacing: 3 }}>
          AUTUMN 2026 · ALEKSANDAR VUČIĆ
        </Mono>
        {/* The timeline line between the two dots. */}
        <div style={{ position: "absolute", left: 51, top: STEP.top + 40, width: 4, height: (STEP.gap - 4) * line, borderRadius: 2, background: RS.white, opacity: 0.7 }} />
        <Step top={STEP.top} date={HOOK.quit} text="QUITS AS PRESIDENT" p={quit} />
        <Step top={STEP.top + STEP.gap} date={HOOK.lost} text="LOSES THE ELECTION" p={lost} strong />
        <Stamp p={stamp} size={32} rotate={-4} style={{ left: 88, top: 252 }}>
          STUDENT LIST WINS
        </Stamp>
      </Glass>
    </>
  );
};
