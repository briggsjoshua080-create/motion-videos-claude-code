import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BR, FONT, TERM_YEARS, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono, Stamp } from "./ui";

/** Made-up first round (no real people): nobody passes half, so the top two go on. */
const RACE = [
  { name: "CANDIDATE A", share: 44 },
  { name: "CANDIDATE B", share: 38 },
  { name: "CANDIDATE C", share: 18 },
] as const;
const PM = { top: 690, height: 100 } as const;
const ROUNDS = { top: 808, height: 300 } as const;
const BAR = { left: 270, per: 10, top: 84, step: 58, h: 38 } as const;
const HALF = BAR.left + 50 * BAR.per;

/**
 * "The president runs the government, with no prime minister. If nobody gets over half, the top two
 * meet in a run-off." A crossed-out NO PRIME MINISTER row on "no prime minister"; a made-up first
 * round where the bars grow, the 50% line flashes on "over half" (nobody reaches it), Candidate C
 * fades on "top two" and a RUN-OFF stamp slams on "run-off". Footnote: four years, one re-election in a row.
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, cue("president", "runs") - 4);
  const pm = rise(frame, cue("president", "with") - 6);
  const cross = progress(frame, cue("president", "prime") - 2, cue("president", "minister") + 8);
  const card = rise(frame, cue("president", "If") - 8);
  const grow = progress(frame, cue("president", "If") - 4, cue("president", "nobody") + 8, Easing.out(Easing.cubic));
  const half = progress(frame, cue("president", "over") - 4, cue("president", "half") + 4);
  const flash = half > 0 && half < 1 ? 1 : half >= 1 ? 0.75 : 0.35;
  const top2 = progress(frame, cue("president", "top") - 2, cue("president", "two") + 6);
  const stamp = pop(frame, cue("president", "run-off") - 2);
  const note = rise(frame, cue("president", "run-off") + 4);

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
        Head of state and of government — {TERM_YEARS} years.
      </Aside>

      <Glass top={PM.top} height={PM.height} tick={BR.yellow} style={riseStyle(pm, exit, 30)}>
        <div style={{ position: "absolute", left: 34, top: 24 }}>
          <Mark ok={false} size={50} p={cross} color={BR.yellow} />
        </div>
        <div style={{ position: "absolute", left: 116, top: 14 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: BR.white }}>No prime minister</div>
          <div style={{ marginTop: 2, fontSize: 24, fontWeight: 500, color: BR.textSoft }}>the president picks the ministers</div>
        </div>
      </Glass>

      <Glass top={ROUNDS.top} height={ROUNDS.height} tick={BR.white} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={BR.textSoft} style={{ position: "absolute", left: 40, top: 28, letterSpacing: 3 }}>
          ROUND ONE · MADE-UP
        </Mono>
        {RACE.map((c, i) => {
          const out = i === 2 ? top2 : 0;
          return (
            <div key={c.name} style={{ position: "absolute", left: 0, top: BAR.top + i * BAR.step, width: 840, height: BAR.h, opacity: 1 - 0.65 * out }}>
              <div style={{ position: "absolute", left: 40, top: 8, fontFamily: FONT.mono, fontWeight: 700, fontSize: 20, letterSpacing: 1.5, color: BR.white }}>{c.name}</div>
              <div style={{ position: "absolute", left: BAR.left, top: 0, height: BAR.h, width: c.share * BAR.per * grow, borderRadius: 8, background: i < 2 ? BR.white : "rgba(255,255,255,0.7)", boxShadow: "0 0 18px rgba(255,255,255,0.25)" }} />
              <div style={{ position: "absolute", left: BAR.left + c.share * BAR.per * grow - 74, width: 64, textAlign: "right", top: 2, fontFamily: FONT.display, fontSize: 24, lineHeight: "36px", color: BR.greenDeep, opacity: Math.min(1, grow * 2) }}>
                {c.share}%
              </div>
              {i < 2 && (
                <div
                  style={{
                    position: "absolute",
                    left: BAR.left + 10,
                    top: 2,
                    height: BAR.h - 4,
                    padding: "0 12px",
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    background: BR.yellow,
                    fontFamily: FONT.mono,
                    fontWeight: 700,
                    fontSize: 16,
                    letterSpacing: 1.5,
                    color: BR.blue,
                    whiteSpace: "nowrap",
                    opacity: Math.min(1, top2 * 1.5),
                    transform: `scale(${0.6 + 0.4 * top2})`,
                    transformOrigin: "left center",
                  }}
                >
                  TOP {i + 1}
                </div>
              )}
            </div>
          );
        })}
        {/* The 50% line nobody reaches. */}
        <div style={{ position: "absolute", left: HALF - 2, top: BAR.top - 18, width: 4, height: BAR.step * 3 + 6, borderRadius: 2, background: BR.yellow, opacity: Math.min(1, grow * 2) * flash, boxShadow: half > 0 ? "0 0 18px rgba(255,223,0,0.8)" : "none" }} />
        <Mono size={16} color={BR.yellow} style={{ position: "absolute", left: HALF - 30, top: BAR.top - 46, letterSpacing: 1.5, opacity: Math.min(1, grow * 2) * flash }}>
          50%
        </Mono>
        <div style={{ position: "absolute", left: 40, top: 262, fontFamily: FONT.body, fontSize: 21, fontWeight: 500, color: BR.textSoft, opacity: Math.min(1, Math.max(0, note)) }}>
          Three weeks later: the top two, face to face.
        </div>
        <Stamp p={stamp} size={40} color={BR.blue} rotate={-6} style={{ left: 560, top: 214, background: BR.yellow, borderColor: BR.white }}>
          RUN-OFF
        </Stamp>
      </Glass>
      <Mono size={17} color={BR.textSoft} style={{ position: "absolute", left: 120, width: 840, top: 1126, textAlign: "center", letterSpacing: 1.6, ...riseStyle(note, exit, 14) }}>
        {TERM_YEARS}-YEAR TERM · ONE RE-ELECTION IN A ROW
      </Mono>
    </>
  );
};
