import React from "react";
import { Easing, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { Hemicycle, hemicycleSeats } from "../../../components/Hemicycle";
import { pop, progress } from "../../../components/explainer/motion";
import { EP_SEATS, EU, GROUPS_2024, PALETTE as C, groupOfSeat } from "../constants";
import { P2 } from "./timeline";

const R_IN = 150;
const R_OUT = 400;
const SEATS = hemicycleSeats(EP_SEATS, 14, R_IN, R_OUT);
const DOT = 6.4;
/** Seats that voted for the Commission President in July 2024. */
export const VOTES_FOR = 401;

/** Where the half-circle sits: centre of its base line and scale. */
export const POSE = {
  recap: { cx: 540, cy: 1040, s: 0.68 },
  elected: { cx: 540, cy: 830, s: 1 },
  laws: { cx: 320, cy: 1100, s: 0.4 },
} as const;

/** Seat fill for the July 2024 vote (0 -> 1), in composition frames. Shared with the ElectedScene counter. */
export const voteFill = (g: number, at: typeof P2.at) =>
  progress(g, at("elected", "re-elected") - 2, at("elected", "401") + 10, Easing.inOut(Easing.quad));

/**
 * The European Parliament as one half-circle through Part 2: under the recap ("EU citizens elect
 * the European Parliament"), big for the July 2024 vote on the Commission President (401 seats
 * fill yellow), and small inside the "Parliament" box when a law needs both sides' yes.
 * It fades out while other scenes are on. Mount it above the scenes (the law step draws a white box
 * under it). Works in composition frames (`offset` = Sequence start).
 */
export const HemicycleLayer: React.FC<{ offset: number }> = ({ offset }) => {
  const g = useCurrentFrame() + offset;
  const { at, from } = P2;

  // Fades out together with the scene it belongs to (same window as sceneExit), so it never lingers.
  const out = (next: number) => progress(g, next - 9, next + 1);
  const recapIn = progress(g, from("recap") + 6, from("recap") + 22);
  const recapOut = out(from("commission"));
  const electedIn = progress(g, from("elected") + 2, from("elected") + 16);
  const electedOut = out(from("team"));
  const lawsIn = progress(g, at("decide", "two") - 4, at("decide", "two") + 10);
  const lawsOut = out(from("question"));

  const phase = g < from("elected") ? "recap" : g < from("laws") ? "elected" : "laws";
  const pose = POSE[phase];
  const opacity =
    phase === "recap" ? recapIn * (1 - recapOut) : phase === "elected" ? electedIn * (1 - electedOut) : lawsIn * (1 - lawsOut);
  if (opacity <= 0) return null;

  const fill = voteFill(g, at);
  const majorityP = pop(g, at("elected", "votes") - 4);
  const line = progress(g, at("elected", "votes") - 2, at("elected", "votes") + 14);
  const top = POSE.elected.cy - R_OUT - DOT * 2;
  const build = phase === "recap" ? progress(g, from("recap") + 4, at("recap", "Parliament") + 6, Easing.inOut(Easing.cubic)) : 1;

  const seatFill = (i: number) => {
    if (phase === "elected") {
      const v = Math.min(1, Math.max(0, fill * (VOTES_FOR + 12) - i));
      return interpolateColors(i < VOTES_FOR ? v : 0, [0, 1], [EU.seat, EU.yellow]);
    }
    return GROUPS_2024[groupOfSeat(i)].color;
  };

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transform: `translate(${pose.cx - 540}px, ${pose.cy - 830}px) scale(${pose.s})`,
          transformOrigin: "540px 830px",
        }}
      >
        <Hemicycle seats={SEATS} cx={540} cy={830} dot={DOT} fill={seatFill} visible={(i) => build * (EP_SEATS + 30) - i} />
      </div>

      {phase === "elected" ? (
        <>
          {/* Majority mark through the middle: the President needs a majority of all MEPs. */}
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <line
              x1={540}
              y1={top + 10}
              x2={540}
              y2={top + 10 + (R_OUT - R_IN + 16) * line}
              stroke={EU.blue}
              strokeWidth={6}
              strokeDasharray="14 10"
              strokeLinecap="round"
              opacity={line > 0.01 ? 1 : 0}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 340,
              width: 400,
              top: top - 52,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: Math.min(1, majorityP * 1.4),
              transform: `scale(${0.7 + 0.3 * majorityP})`,
            }}
          >
            <div
              style={{
                padding: "8px 22px",
                borderRadius: 12,
                background: EU.blue,
                color: C.white,
                fontFamily: theme.font,
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: 3,
                whiteSpace: "nowrap",
              }}
            >
              MAJORITY NEEDED
            </div>
            <svg width={28} height={14} viewBox="0 0 28 14">
              <path d="M0 0 L28 0 L14 14 Z" fill={EU.blue} />
            </svg>
          </div>
        </>
      ) : null}
    </div>
  );
};
