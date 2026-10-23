import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { float } from "../../lib/animation";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CA, FONT, SENATE, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark } from "./ui";

const SEATS = hemicycleSeats(SENATE.seats, 5, 86, 150);
const HEMI = { cx: 760, cy: 468, dot: 7.5 } as const;
const ROWS = [
  { word: "aren't", ok: false, text: "Elected by the people", sub: "no Senate elections" },
  { word: "picks", ok: true, text: "Picked by the prime minister", sub: "appointed by the Governor General" },
  { word: "review", ok: true, text: "Reviews every law", sub: `can amend or reject it · serves to ${SENATE.retire}` },
] as const;
const ROW = { top: 700, height: 122, gap: 14 } as const;

/**
 * "The 105 senators aren't elected. The prime minister picks them, to review every law." THE
 * SENATE with its 105 seats filling a small half-circle beside the headline, then three rows:
 * elected by the people (crossed and struck through), picked by the PM, reviews every law.
 */
export const SenateScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, 10);
  const build = progress(frame, cue("senate", "105") - 8, cue("senate", "senators", "end"), Easing.inOut(Easing.cubic));
  const rows = ROWS.map((r) => rise(frame, cue("senate", r.word) - 8));
  const marks = ROWS.map((r) => progress(frame, cue("senate", r.word) - 2, cue("senate", r.word) + 8));
  const strike = progress(frame, cue("senate", "elected") - 2, cue("senate", "elected") + 8);

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>07 — THE SENATE</Eyebrow>
      <Headline size={128} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        THE
      </Headline>
      <Headline size={128} style={{ top: 352 + 126, ...riseStyle(head[1], exit, 50) }}>
        <Accent>SENATE</Accent>
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${float(frame, 3, 70)}px)` }}>
        <Hemicycle seats={SEATS} cx={HEMI.cx} cy={HEMI.cy} dot={HEMI.dot} fill={() => CA.white} visible={(i) => build * (SENATE.seats + 1) - i} />
        <div style={{ position: "absolute", left: HEMI.cx - 100, width: 200, top: HEMI.cy - 44, textAlign: "center", fontFamily: FONT.display, fontSize: 42, lineHeight: 1, color: CA.white, opacity: Math.min(1, build * 3) }}>
          {Math.round(SENATE.seats * build)}
        </div>
      </div>
      <Aside size={44} style={{ top: 628, ...riseStyle(aside, exit, 24) }}>
        The second chamber: 105 senators.
      </Aside>

      {ROWS.map((r, i) => (
        <Glass key={r.text} top={ROW.top + i * (ROW.height + ROW.gap)} height={ROW.height} style={riseStyle(rows[i], exit, 30)}>
          <div style={{ position: "absolute", left: 34, top: 32 }}>
            <Mark ok={r.ok} size={56} p={marks[i]} color={r.ok ? CA.white : CA.rose} />
          </div>
          <div style={{ position: "absolute", left: 120, top: 22 }}>
            <div style={{ position: "relative", display: "inline-block", fontSize: 36, fontWeight: 800, color: r.ok ? CA.white : `rgba(255,255,255,${1 - 0.4 * strike})` }}>
              {r.text}
              {!r.ok && (
                <div style={{ position: "absolute", left: -4, top: "54%", height: 5, width: `calc(${strike * 100}% + 8px)`, borderRadius: 3, background: CA.rose, opacity: strike > 0 ? 1 : 0 }} />
              )}
            </div>
            <div style={{ marginTop: 4, fontSize: 24, fontWeight: 500, color: CA.textSoft }}>{r.sub}</div>
          </div>
        </Glass>
      ))}
    </>
  );
};
