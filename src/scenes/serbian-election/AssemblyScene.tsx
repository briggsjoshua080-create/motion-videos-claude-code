import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ASSEMBLY, FONT, RS, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mono } from "./ui";

const LAYOUT = { rows: 8, rIn: 160, rOut: 330, dot: 8 } as const;
const SEATS = hemicycleSeats(ASSEMBLY, LAYOUT.rows, LAYOUT.rIn, LAYOUT.rOut);
const CHAMBER = { cx: 540, cy: 1040 } as const;
const JOBS = ["MAKES LAWS", "PASSES THE BUDGET", "ELECTS THE GOVERNMENT"] as const;

/**
 * "That's the National Assembly: it makes laws, passes the budget and elects the government." One
 * dot half-circle (one chamber) sweeps in and counts up to 250 on "Assembly", then three pills say
 * what it does, each on its word.
 */
export const AssemblyScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, cue("assembly", "Assembly") - 4);
  const build = progress(frame, 2, cue("assembly", "Assembly") + 8, Easing.inOut(Easing.cubic));
  const count = progress(frame, cue("assembly", "National") - 2, cue("assembly", "Assembly") + 8, Easing.out(Easing.cubic));
  const pills = [cue("assembly", "makes"), cue("assembly", "passes"), cue("assembly", "elects")].map((t) => pop(frame, t - 4));
  const { cx, cy } = CHAMBER;

  const pill = (label: string, i: number) => (
    <div
      key={label}
      style={{
        padding: "16px 28px",
        borderRadius: 999,
        background: i === 2 ? RS.red : i === 0 ? RS.white : "transparent",
        border: `2px solid ${RS.white}`,
        fontFamily: FONT.mono,
        fontWeight: 700,
        fontSize: 25,
        letterSpacing: 3,
        color: i === 0 ? RS.blue : RS.white,
        whiteSpace: "nowrap",
        boxShadow: "0 0 30px rgba(255,255,255,0.22)",
        opacity: Math.min(1, Math.max(0, pills[i]) * 1.5),
        transform: `scale(${0.6 + 0.4 * pills[i]})`,
      }}
    >
      {label}
    </div>
  );

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>05 — THE ASSEMBLY</Eyebrow>
      <Headline size={124} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        NATIONAL
      </Headline>
      <Headline size={124} style={{ top: 352 + 122, ...riseStyle(head[1], exit, 50) }}>
        <Accent>ASSEMBLY</Accent>
      </Headline>
      <Aside size={46} style={{ top: 632, ...riseStyle(aside, exit, 24) }}>
        Serbia's parliament — one chamber, four years.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={LAYOUT.dot} fill={() => RS.white} visible={(i) => build * (ASSEMBLY + 1) - i} />
        <div
          style={{
            position: "absolute",
            left: cx - 200,
            width: 400,
            top: cy - 104,
            textAlign: "center",
            fontFamily: FONT.display,
            fontSize: 96,
            lineHeight: 1,
            color: RS.white,
            textShadow: "0 0 30px rgba(255,255,255,0.4)",
            opacity: count > 0 ? 1 : 0,
          }}
        >
          {Math.round(ASSEMBLY * count)}
        </div>
        <Mono size={18} color={RS.textSoft} style={{ position: "absolute", left: cx - 220, width: 440, top: cy + 26, textAlign: "center", letterSpacing: 2.5, opacity: Math.min(1, Math.max(0, count * 2 - 1)) }}>
          MEMBERS OF PARLIAMENT
        </Mono>
      </div>

      <div style={{ position: "absolute", left: 120, top: 1112, width: 840, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, opacity: 1 - exit }}>
        {JOBS.map(pill)}
      </div>
    </>
  );
};
