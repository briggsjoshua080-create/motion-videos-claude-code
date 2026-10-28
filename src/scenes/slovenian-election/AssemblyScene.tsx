import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ASSEMBLY, COUNCIL, FONT, MINORITY_SEATS, SI, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const LAYOUT = { rows: 5, rIn: 130, rOut: 250, dot: 13 } as const;
const SEATS = hemicycleSeats(ASSEMBLY, LAYOUT.rows, LAYOUT.rIn, LAYOUT.rOut);
const CHAMBER = { cx: 540, cy: 956 } as const;
/** The two minority seats sit in the middle of the half-circle. */
const MIDDLE = Math.floor(ASSEMBLY / 2) - 1;
const isMinority = (i: number) => i >= MIDDLE && i < MIDDLE + MINORITY_SEATS;
const JOBS = ["MAKES LAWS", "PICKS THE GOVERNMENT"] as const;
const COUNCIL_CARD = { top: 1076, height: 156 } as const;

/**
 * "That's the National Assembly: it makes laws and picks the government. A second chamber, the
 * National Council, can only make it vote again." One dot half-circle sweeps in and counts up to
 * 90 on "Assembly" (the two minority seats in red), two pills say what it does, each on its word,
 * then a smaller card for the National Council (40 members from interest groups) with a VOTE
 * AGAIN chip on "again".
 */
export const AssemblyScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, cue("assembly", "Assembly") - 4);
  const build = progress(frame, 2, cue("assembly", "Assembly") + 8, Easing.inOut(Easing.cubic));
  const count = progress(frame, cue("assembly", "National") - 2, cue("assembly", "Assembly") + 8, Easing.out(Easing.cubic));
  const pills = [cue("assembly", "makes"), cue("assembly", "picks")].map((t) => pop(frame, t - 4));
  const council = rise(frame, cue("assembly", "second") - 6);
  const again = pop(frame, cue("assembly", "again") - 3);
  const { cx, cy } = CHAMBER;

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>05 — THE PARLIAMENT</Eyebrow>
      <Headline size={124} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        NATIONAL
      </Headline>
      <Headline size={124} style={{ top: 352 + 122, ...riseStyle(head[1], exit, 50) }}>
        <Accent>ASSEMBLY</Accent>
      </Headline>
      <Aside size={44} style={{ top: 628, ...riseStyle(aside, exit, 24) }}>
        The main chamber — {ASSEMBLY} MPs, four years.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={LAYOUT.dot} fill={(i) => (isMinority(i) ? SI.red : SI.white)} visible={(i) => build * (ASSEMBLY + 1) - i} />
        <div
          style={{
            position: "absolute",
            left: cx - 200,
            width: 400,
            top: cy - 100,
            textAlign: "center",
            fontFamily: FONT.display,
            fontSize: 92,
            lineHeight: 1,
            color: SI.white,
            textShadow: "0 0 30px rgba(255,255,255,0.4)",
            opacity: count > 0 ? 1 : 0,
          }}
        >
          {Math.round(ASSEMBLY * count)}
        </div>
      </div>

      <div style={{ position: "absolute", left: 120, top: 984, width: 840, display: "flex", justifyContent: "center", gap: 18, opacity: 1 - exit }}>
        {JOBS.map((label, i) => (
          <div
            key={label}
            style={{
              padding: "14px 26px",
              borderRadius: 999,
              background: i === 0 ? SI.white : SI.red,
              border: `2px solid ${SI.white}`,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 3,
              color: i === 0 ? SI.blue : SI.white,
              whiteSpace: "nowrap",
              boxShadow: "0 0 30px rgba(255,255,255,0.22)",
              opacity: Math.min(1, Math.max(0, pills[i]) * 1.5),
              transform: `scale(${0.6 + 0.4 * pills[i]})`,
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <Glass top={COUNCIL_CARD.top} height={COUNCIL_CARD.height} tick={SI.gold} style={riseStyle(council, exit, 30)}>
        <Mono size={18} color={SI.textSoft} style={{ position: "absolute", left: 36, top: 26, letterSpacing: 2.5 }}>
          SECOND CHAMBER · {COUNCIL} MEMBERS
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 58, fontFamily: FONT.display, fontSize: 42, lineHeight: 1, color: SI.white }}>NATIONAL COUNCIL</div>
        <div style={{ position: "absolute", left: 36, top: 112, fontSize: 23, fontWeight: 500, color: SI.textSoft, whiteSpace: "nowrap" }}>
          chosen by employers, workers, farmers & regions
        </div>
        <div
          style={{
            position: "absolute",
            right: 30,
            top: -24,
            padding: "10px 18px",
            borderRadius: 999,
            background: SI.red,
            border: `2px solid ${SI.white}`,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 19,
            letterSpacing: 2,
            color: SI.white,
            whiteSpace: "nowrap",
            opacity: Math.min(1, Math.max(0, again) * 1.5),
            transform: `scale(${0.6 + 0.4 * again}) rotate(-3deg)`,
            transformOrigin: "right center",
          }}
        >
          CAN ONLY SAY: VOTE AGAIN
        </div>
      </Glass>
    </>
  );
};
