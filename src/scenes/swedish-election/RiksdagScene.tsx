import React from "react";
import { Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CONSTITUENCIES, DOT, FIXED_SEATS, FONT, R_IN, R_OUT, ROWS, SE, THRESHOLD, TOP_UP, TOP_UP_SEATS, TOTAL, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const SEATS = hemicycleSeats(TOTAL, ROWS, R_IN, R_OUT);
/** Centre of the half-circle's base line and its scale: big first, smaller once the seat rules come in. */
const BIG = { cx: 540, cy: 968, s: 1 } as const;
const SMALL = { cx: 540, cy: 880, s: 0.8 } as const;

/**
 * "Votes fill the Riksdag, the parliament: 349 members who make laws and set the budget. A party
 * needs 4% nationwide, and 39 top-up seats make seats match votes." 349 white dots sweep into a
 * half-circle with a counter, the two jobs pop up as pills; then the chamber steps back for a 4%
 * card and a +39 card while 39 seats turn yellow.
 */
export const RiksdagScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = rise(frame, 3);
  const aside = rise(frame, cue("riksdag", "parliament") - 4);
  const build = progress(frame, 2, cue("riksdag", "349") + 4, Easing.inOut(Easing.cubic));
  const count = progress(frame, cue("riksdag", "349") - 2, cue("riksdag", "349", "end"), Easing.out(Easing.cubic));
  const counter = rise(frame, cue("riksdag", "349") - 6);
  const jobs = [pop(frame, cue("riksdag", "laws") - 4), pop(frame, cue("riksdag", "budget") - 4)];
  const shrink = progress(frame, cue("seats", "A") - 8, cue("seats", "A") + 10);
  const threshold = rise(frame, cue("seats", "4%") - 6);
  const thresholdPop = pop(frame, cue("seats", "4%") - 2);
  const topUp = rise(frame, cue("seats", "39") - 6);
  const topUpPop = pop(frame, cue("seats", "39") - 2);
  const light = progress(frame, cue("seats", "39") - 2, cue("seats", "top-up") + 8);
  const match = rise(frame, cue("seats", "match") - 4);

  const cx = interpolate(shrink, [0, 1], [BIG.cx, SMALL.cx]);
  const cy = interpolate(shrink, [0, 1], [BIG.cy, SMALL.cy]);
  const s = interpolate(shrink, [0, 1], [BIG.s, SMALL.s]);
  const seatFill = (i: number) => (TOP_UP_SEATS.has(i) ? interpolateColors(light, [0, 1], [SE.white, SE.yellow]) : SE.white);
  const seatVisible = (i: number) => build * (TOTAL + 1) - i;
  const glowR = (R_OUT + DOT * 2) * s;

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>04 — THE RIKSDAG</Eyebrow>
      <Headline size={112} style={{ top: 352, ...riseStyle(head, exit, 50) }}>
        THE <Accent>RIKSDAG</Accent>
      </Headline>
      <Aside size={46} style={{ top: 480, ...riseStyle(aside, exit, 24) }}>
        Sweden's parliament — just one chamber.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <div
          style={{
            position: "absolute",
            left: cx - glowR,
            top: cy - glowR * 0.75,
            width: glowR * 2,
            height: glowR,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(255,255,255,0.12), rgba(255,255,255,0))",
          }}
        />
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${s})` }}>
          <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={DOT} fill={seatFill} visible={seatVisible} />
        </div>
        <div
          style={{
            position: "absolute",
            left: cx - 260,
            width: 520,
            top: cy - 124 * s,
            textAlign: "center",
            fontFamily: FONT.display,
            fontSize: 130 * s,
            lineHeight: 1,
            color: SE.white,
            textShadow: "0 0 30px rgba(255,255,255,0.35)",
            opacity: Math.min(1, counter),
          }}
        >
          {Math.round(TOTAL * count)}
        </div>
        <Mono size={22} style={{ position: "absolute", left: cx - 200, width: 400, top: cy + 18, textAlign: "center", opacity: Math.min(1, counter) }}>
          SEATS · 175 = MAJORITY
        </Mono>
      </div>

      {/* The Riksdag's two big jobs, then the two seat rules. */}
      <div style={{ position: "absolute", left: 120, top: 1040, width: 840, display: "flex", justifyContent: "center", gap: 24, opacity: (1 - shrink) * (1 - exit) }}>
        {["MAKES LAWS", "SETS THE BUDGET"].map((label, i) => (
          <div
            key={label}
            style={{
              padding: "18px 30px",
              borderRadius: 999,
              background: SE.glass,
              border: `1.5px solid ${SE.glassEdge}`,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 4,
              color: SE.white,
              whiteSpace: "nowrap",
              opacity: Math.min(1, Math.max(0, jobs[i]) * 1.5),
              transform: `scale(${0.6 + 0.4 * jobs[i]})`,
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <Glass top={936} height={132} tick={SE.yellow} style={riseStyle(threshold, exit, 40)}>
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 18,
            fontFamily: FONT.display,
            fontSize: 100,
            lineHeight: 1,
            color: SE.yellow,
            textShadow: "0 0 26px rgba(254,204,2,0.45)",
            transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, thresholdPop))})`,
            transformOrigin: "left center",
          }}
        >
          {THRESHOLD}%
        </div>
        <div style={{ position: "absolute", left: 300, top: 26 }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: SE.white }}>of the national vote</div>
          <div style={{ marginTop: 4, fontSize: 25, fontWeight: 500, color: SE.textSoft }}>or a party wins no seats at all</div>
        </div>
      </Glass>

      <Glass top={1090} height={132} tick={SE.yellow} style={riseStyle(topUp, exit, 40)}>
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 18,
            fontFamily: FONT.display,
            fontSize: 100,
            lineHeight: 1,
            color: SE.yellow,
            textShadow: "0 0 26px rgba(254,204,2,0.45)",
            transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, topUpPop))})`,
            transformOrigin: "left center",
          }}
        >
          +{TOP_UP}
        </div>
        <div style={{ position: "absolute", left: 300, top: 22 }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: SE.white }}>top-up seats</div>
          <div style={{ marginTop: 4, fontSize: 25, fontWeight: 500, color: SE.textSoft, opacity: 0.4 + 0.6 * Math.min(1, match) }}>
            {FIXED_SEATS} in {CONSTITUENCIES} areas, then these even it out
          </div>
        </div>
      </Glass>
    </>
  );
};
