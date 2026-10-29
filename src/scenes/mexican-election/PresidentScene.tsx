import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, JUDGES, MX, TERM, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono, Stamp } from "./ui";

/** Made-up race (no real people): the most votes wins outright, even without half. */
const RACE = [
  { name: "CANDIDATE A", share: 41 },
  { name: "CANDIDATE B", share: 35 },
  { name: "CANDIDATE C", share: 24 },
] as const;
const PM = { top: 690, height: 100 } as const;
const ROUNDS = { top: 806, height: 264 } as const;
const BAR = { left: 270, per: 9, top: 76, step: 54, h: 36 } as const;
const JUDGE = { top: 1084, height: 160 } as const;

/** A simple judge's gavel. */
const Gavel: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <g transform="rotate(-35 50 50)">
      <rect x={22} y={22} width={56} height={26} rx={6} fill={MX.white} />
      <rect x={16} y={18} width={10} height={34} rx={3} fill={MX.white} />
      <rect x={74} y={18} width={10} height={34} rx={3} fill={MX.white} />
      <rect x={46} y={46} width={9} height={46} rx={4} fill={MX.white} />
    </g>
    <rect x={12} y={86} width={52} height={8} rx={3} fill={MX.red} />
  </svg>
);

/**
 * "There's no prime minister. The president runs the government, and wins with the most votes,
 * no run-off. And since 2025, Mexicans even elect their judges." A crossed-out NO PRIME MINISTER
 * row on "no prime minister"; a made-up race where Candidate A wins with 41% (WINS chip on "most
 * votes") and a NO RUN-OFF stamp on "run-off"; then a red-ticked card on the second sentence:
 * judges are elected too (first time 1 June 2025, about 13% voted).
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, cue("president", "president") - 4);
  const pm = rise(frame, cue("president", "no") - 6);
  const cross = progress(frame, cue("president", "prime") - 2, cue("president", "minister") + 8);
  const card = rise(frame, cue("president", "wins") - 8);
  const grow = progress(frame, cue("president", "wins") - 4, cue("president", "most") + 6, Easing.out(Easing.cubic));
  const win = pop(frame, cue("president", "votes") - 3);
  const stamp = pop(frame, cue("president", "run-off") - 2);
  const judge = rise(frame, cue("judges", "since") - 6);
  const tick = progress(frame, cue("judges", "elect") - 2, cue("judges", "judges") + 6);

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>06 — THE PRESIDENT</Eyebrow>
      <Headline size={108} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        THE
      </Headline>
      <Headline size={108} style={{ top: 352 + 106, ...riseStyle(head[1], exit, 50) }}>
        <Accent>PRESIDENT</Accent>
      </Headline>
      <Aside size={42} style={{ top: 596, ...riseStyle(aside, exit, 24) }}>
        Head of state and of government — {TERM.years} years.
      </Aside>

      <Glass top={PM.top} height={PM.height} tick={MX.red} style={riseStyle(pm, exit, 30)}>
        <div style={{ position: "absolute", left: 34, top: 24 }}>
          <Mark ok={false} size={50} p={cross} color={MX.red} />
        </div>
        <div style={{ position: "absolute", left: 116, top: 14 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: MX.white }}>No prime minister</div>
          <div style={{ marginTop: 2, fontSize: 24, fontWeight: 500, color: MX.textSoft }}>the president picks the ministers</div>
        </div>
      </Glass>

      <Glass top={ROUNDS.top} height={ROUNDS.height} tick={MX.white} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={MX.textSoft} style={{ position: "absolute", left: 40, top: 28, letterSpacing: 3 }}>
          ONE ROUND · MADE-UP
        </Mono>
        {RACE.map((c, i) => (
          <div key={c.name} style={{ position: "absolute", left: 0, top: BAR.top + i * BAR.step, width: 840, height: BAR.h, opacity: i === 0 ? 1 : 1 - 0.4 * win }}>
            <div style={{ position: "absolute", left: 40, top: 7, fontFamily: FONT.mono, fontWeight: 700, fontSize: 20, letterSpacing: 1.5, color: MX.white }}>{c.name}</div>
            <div style={{ position: "absolute", left: BAR.left, top: 0, height: BAR.h, width: c.share * BAR.per * grow, borderRadius: 8, background: i === 0 ? MX.white : "rgba(255,255,255,0.7)", boxShadow: "0 0 18px rgba(255,255,255,0.25)" }} />
            <div style={{ position: "absolute", left: BAR.left + c.share * BAR.per * grow - 74, width: 64, textAlign: "right", top: 2, fontFamily: FONT.display, fontSize: 24, lineHeight: "34px", color: MX.green, opacity: Math.min(1, grow * 2) }}>
              {c.share}%
            </div>
            {i === 0 && (
              <div
                style={{
                  position: "absolute",
                  left: BAR.left + c.share * BAR.per + 16,
                  top: 0,
                  height: BAR.h,
                  padding: "0 14px",
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  background: MX.red,
                  border: `2px solid ${MX.white}`,
                  boxSizing: "border-box",
                  fontFamily: FONT.mono,
                  fontWeight: 700,
                  fontSize: 17,
                  letterSpacing: 2,
                  color: MX.white,
                  whiteSpace: "nowrap",
                  opacity: Math.min(1, Math.max(0, win) * 1.5),
                  transform: `scale(${0.6 + 0.4 * win})`,
                  transformOrigin: "left center",
                }}
              >
                WINS
              </div>
            )}
          </div>
        ))}
        <div style={{ position: "absolute", left: 40, top: 230, fontFamily: FONT.body, fontSize: 21, fontWeight: 500, color: MX.textSoft, opacity: Math.min(1, card) }}>
          The most votes wins — no 50% needed.
        </div>
        <Stamp p={stamp} size={38} rotate={-6} style={{ left: 580, top: 150, background: MX.red }}>
          NO RUN-OFF
        </Stamp>
      </Glass>

      <Glass top={JUDGE.top} height={JUDGE.height} tick={MX.red} style={{ ...riseStyle(judge, exit, 30), border: `2px solid ${MX.red}` }}>
        <div style={{ position: "absolute", left: 30, top: 30 }}>
          <Gavel size={104} />
        </div>
        <div style={{ position: "absolute", left: 160, top: 26 }}>
          <Mono size={18} color={MX.textSoft} style={{ letterSpacing: 2.5 }}>
            SINCE {JUDGES.date}
          </Mono>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT.display, fontSize: 42, lineHeight: 1, color: MX.white, whiteSpace: "nowrap" }}>
            JUDGES ARE ELECTED
            <Mark ok size={38} p={tick} color={MX.white} />
          </div>
          <div style={{ marginTop: 12, fontSize: 23, fontWeight: 500, color: MX.textSoft, whiteSpace: "nowrap" }}>Supreme Court too · only about {JUDGES.turnout} voted</div>
        </div>
      </Glass>

    </>
  );
};
