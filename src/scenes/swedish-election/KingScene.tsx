import React from "react";
import { useCurrentFrame } from "remotion";
import { float } from "../../lib/animation";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { SE, type SceneProps } from "./constants";
import { Aside, CrownIcon, Eyebrow, Glass, Headline, Mark, Stamp } from "./ui";

const ROWS = [
  { ok: true, text: "Opens parliament every year", sub: "and chairs each change of government" },
  { ok: false, text: "Picks the prime minister", sub: "the Speaker proposes one" },
  { ok: false, text: "Signs laws", sub: "the government does" },
] as const;
const ROW = { top: 752, height: 122, gap: 14 } as const;

/**
 * "The King is head of state, but has no political power. He doesn't even sign laws." A glowing
 * crown, THE KING, a NO POLITICAL POWER stamp, and three rows: opens parliament (ticked), picks
 * the prime minister and signs laws (crossed and struck through).
 */
export const KingScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const crown = pop(frame, 2);
  const head = rise(frame, 5);
  const aside = rise(frame, cue("king", "head") - 4);
  const stamp = pop(frame, cue("king", "no") - 3);
  const rows = [cue("king", "head") - 2, cue("king", "political") - 6, cue("king", "even") - 6].map((t) => rise(frame, t));
  const marks = [cue("king", "state"), cue("king", "power") - 2, cue("king", "sign") - 2].map((t) => progress(frame, t, t + 10));
  const strikes = [0, progress(frame, cue("king", "power") + 4, cue("king", "power") + 14), progress(frame, cue("king", "laws") - 2, cue("king", "laws") + 8)];

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>06 — THE KING</Eyebrow>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 356 + float(frame, 4, 60),
          transform: `scale(${0.5 + 0.5 * Math.max(0, crown)})`,
          transformOrigin: "left bottom",
          opacity: Math.min(1, Math.max(0, crown) * 1.5) * (1 - exit),
          filter: "drop-shadow(0 0 22px rgba(254,204,2,0.55))",
        }}
      >
        <CrownIcon size={150} />
      </div>
      <Headline size={150} style={{ top: 496, ...riseStyle(head, exit, 50) }}>
        THE KING
      </Headline>
      <Stamp p={stamp} size={40} rotate={-5} style={{ left: 330, top: 396, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
        NO POLITICAL POWER
      </Stamp>
      <Aside size={46} style={{ top: 664, ...riseStyle(aside, exit, 24) }}>
        Head of state — a symbol, not a ruler.
      </Aside>

      {ROWS.map((r, i) => (
        <Glass key={r.text} top={ROW.top + i * (ROW.height + ROW.gap)} height={ROW.height} style={riseStyle(rows[i], exit, 30)}>
          <div style={{ position: "absolute", left: 34, top: 32 }}>
            <Mark ok={r.ok} size={56} p={marks[i]} color={r.ok ? SE.yellow : SE.white} />
          </div>
          <div style={{ position: "absolute", left: 120, top: 22 }}>
            <div style={{ position: "relative", display: "inline-block", fontSize: 38, fontWeight: 800, color: r.ok ? SE.white : `rgba(255,255,255,${1 - 0.35 * strikes[i]})` }}>
              {r.text}
              {!r.ok && (
                <div
                  style={{
                    position: "absolute",
                    left: -4,
                    top: "54%",
                    height: 5,
                    width: `calc(${strikes[i] * 100}% + 8px)`,
                    borderRadius: 3,
                    background: SE.yellow,
                    opacity: strikes[i] > 0 ? 1 : 0,
                  }}
                />
              )}
            </div>
            <div style={{ marginTop: 4, fontSize: 25, fontWeight: 500, color: SE.textSoft }}>{r.sub}</div>
          </div>
        </Glass>
      ))}
    </>
  );
};
