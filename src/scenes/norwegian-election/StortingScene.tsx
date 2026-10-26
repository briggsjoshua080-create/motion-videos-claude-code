import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DISTRICT_SEATS, FONT, NO, STORTING, TOPUP_SEATS, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mono } from "./ui";

const LAYOUT = { rows: 6, rIn: 175, rOut: 320, dot: 9.5 } as const;
const SEATS = hemicycleSeats(STORTING, LAYOUT.rows, LAYOUT.rIn, LAYOUT.rOut);
const CHAMBER = { cx: 540, cy: 1060, s: 1 } as const;
/** Top-up seats are spread through the chamber, not a block: every ninth seat stands for one. */
const isTopup = (i: number) => i % 9 === 4 && Math.floor(i / 9) < TOPUP_SEATS;

/**
 * "That's 169 seats in the Storting, which makes the laws and sets taxes." One dot half-circle
 * (the Storting has a single chamber) that sweeps in and counts up to 169 (150 district + 19
 * top-up seats, the top-ups in navy), then two pills say what it does.
 */
export const StortingScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, cue("storting", "Storting") - 4);
  const build = progress(frame, 2, cue("storting", "seats") + 4, Easing.inOut(Easing.cubic));
  const count = progress(frame, cue("storting", "169") - 2, cue("storting", "seats") + 2, Easing.out(Easing.cubic));
  const pills = [pop(frame, cue("storting", "laws") - 6), pop(frame, cue("storting", "taxes") - 6)];
  const { cx, cy, s } = CHAMBER;

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>05 — THE STORTING</Eyebrow>
      <Headline size={150} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        THE
      </Headline>
      <Headline size={136} style={{ top: 352 + 147, ...riseStyle(head[1], exit, 50) }}>
        <Accent>STORTING</Accent>
      </Headline>
      <Aside size={46} style={{ top: 672, ...riseStyle(aside, exit, 24) }}>
        Norway's parliament — just one chamber.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${s})` }}>
          <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={LAYOUT.dot} fill={(i) => (isTopup(i) && count > 0.9 ? NO.blue : NO.white)} visible={(i) => build * (STORTING + 1) - i} />
        </div>
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
            color: NO.white,
            textShadow: "0 0 30px rgba(255,255,255,0.4)",
            opacity: count > 0 ? 1 : 0,
          }}
        >
          {Math.round(STORTING * count)}
        </div>
        <Mono size={18} color={NO.textSoft} style={{ position: "absolute", left: cx - 220, width: 440, top: cy + 26, textAlign: "center", letterSpacing: 2.5, opacity: Math.min(1, Math.max(0, count * 2 - 1)) }}>
          {DISTRICT_SEATS} DISTRICT + {TOPUP_SEATS} TOP-UP
        </Mono>
      </div>

      <div style={{ position: "absolute", left: 120, top: 1124, width: 840, display: "flex", justifyContent: "center", gap: 22, opacity: 1 - exit }}>
        {["MAKES THE LAWS", "SETS TAXES & BUDGET"].map((label, i) => (
          <div
            key={label}
            style={{
              padding: "16px 28px",
              borderRadius: 999,
              background: i === 0 ? NO.white : NO.blue,
              border: `2px solid ${NO.white}`,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 25,
              letterSpacing: 3,
              color: i === 0 ? NO.red : NO.white,
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
      <Mono size={19} color={NO.textSoft} style={{ position: "absolute", left: 120, width: 840, top: 1214, textAlign: "center", letterSpacing: 2.5, ...riseStyle(pills[1], exit, 16) }}>
        ELECTED FOR A FIXED FOUR YEARS
      </Mono>
    </>
  );
};
