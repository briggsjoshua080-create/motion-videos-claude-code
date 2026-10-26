import React from "react";
import { useCurrentFrame } from "remotion";
import { float } from "../../lib/animation";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, KING, NO, type SceneProps } from "./constants";
import { Aside, CrownIcon, Eyebrow, Glass, Headline, Mark, Mono, Stamp } from "./ui";

const ROWS = [
  { text: "Appoints the government", sub: "the one the Storting will accept" },
  { text: "Signs every law", sub: "in the Council of State, with ministers" },
] as const;
const ROW = { top: 772, height: 122, gap: 14 } as const;

/**
 * "The King appoints the government and signs every law. Since August: Haakon VIII." A glowing
 * crown, THE KING, the aside that the throne is inherited, two ticked rows (appoints the
 * government, signs every law), then a HAAKON VIII stamp and the date he took over.
 */
export const KingScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const crown = pop(frame, 2);
  const head = rise(frame, 5);
  const aside = rise(frame, 10);
  const rows = [cue("king", "appoints") - 6, cue("king", "signs") - 6].map((t) => rise(frame, t));
  const marks = [cue("king", "government"), cue("king", "law")].map((t) => progress(frame, t - 2, t + 8));
  const stamp = pop(frame, cue("king", "Haakon") - 3);
  const since = rise(frame, cue("king", "Since") - 4);

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>07 — THE KING</Eyebrow>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 356 + float(frame, 4, 60),
          transform: `scale(${0.5 + 0.5 * Math.max(0, crown)})`,
          transformOrigin: "left bottom",
          opacity: Math.min(1, Math.max(0, crown) * 1.5) * (1 - exit),
          filter: "drop-shadow(0 0 22px rgba(255,255,255,0.45))",
        }}
      >
        <CrownIcon size={150} />
      </div>
      <Headline size={150} style={{ top: 496, ...riseStyle(head, exit, 50) }}>
        THE KING
      </Headline>
      <Aside size={46} style={{ top: 664, ...riseStyle(aside, exit, 24) }}>
        Head of state — born to it, never elected.
      </Aside>

      {ROWS.map((r, i) => (
        <Glass key={r.text} top={ROW.top + i * (ROW.height + ROW.gap)} height={ROW.height} style={riseStyle(rows[i], exit, 30)}>
          <div style={{ position: "absolute", left: 34, top: 32 }}>
            <Mark ok size={56} p={marks[i]} color={NO.white} />
          </div>
          <div style={{ position: "absolute", left: 120, top: 22 }}>
            <div style={{ fontSize: 38, fontWeight: 800, color: NO.white }}>{r.text}</div>
            <div style={{ marginTop: 4, fontSize: 25, fontWeight: 500, color: NO.textSoft }}>{r.sub}</div>
          </div>
        </Glass>
      ))}

      <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - exit }}>
        <Stamp p={stamp} size={58} rotate={-4} style={{ left: 132, top: 1046 }}>
          {KING.name}
        </Stamp>
      </div>
      <div style={{ position: "absolute", left: 124, top: 1170, ...riseStyle(since, exit, 20) }}>
        <Mono size={19} color={NO.white} style={{ letterSpacing: 2.2 }}>
          KING SINCE {KING.since} · <span style={{ fontFamily: FONT.mono, color: NO.textSoft }}>AFTER {KING.before}</span>
        </Mono>
      </div>
    </>
  );
};
