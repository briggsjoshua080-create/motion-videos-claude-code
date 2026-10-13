import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { COLORS, FONT, cue, sceneOf } from "../../compositions/german-election/constants";
import { PersonBust, ReichstagIcon } from "../../components/german-election/icons";
import { pop, progress, rise } from "../../components/german-election/motion";

/** Bundestag seats (2025-): 630. A majority ("Kanzlermehrheit") is 316. */
const SEATS_TOTAL = 630;
const MAJORITY = 316;
const ROWS = 12;
const R_OUT = 420;
const R_IN = 180;
const DOT = 7.6;
const CENTER_X = 540;
const CENTER_Y = 905;
const RING_Y = 725;
const RING_SCALE = 0.62;

type Seat = { x: number; y: number; theta: number; r: number };

/** Classic parliament layout: seats per row proportional to the row's radius, ordered left to right. */
const SEATS: Seat[] = (() => {
  const radii = Array.from({ length: ROWS }, (_, i) => R_IN + (i * (R_OUT - R_IN)) / (ROWS - 1));
  const sum = radii.reduce((a, b) => a + b, 0);
  const counts = radii.map((r) => Math.round((SEATS_TOTAL * r) / sum));
  counts[ROWS - 1] += SEATS_TOTAL - counts.reduce((a, b) => a + b, 0);
  const seats: Seat[] = [];
  radii.forEach((r, i) => {
    for (let j = 0; j < counts[i]; j++) {
      const theta = Math.PI * (1 - j / (counts[i] - 1));
      seats.push({ x: r * Math.cos(theta), y: -r * Math.sin(theta), theta, r });
    }
  });
  return seats.sort((a, b) => b.theta - a.theta || a.r - b.r);
})();

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const INK = rgb(COLORS.ink);
const GOLD = rgb(COLORS.seatGold);
const inkToGold = (t: number) => `rgb(${INK.map((c, i) => Math.round(c + (GOLD[i] - c) * t)).join(",")})`;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The parliament hemicycle, alive from "The Bundestag has 630 seats" to the end:
 *  - Bundestag scene: 630 seats sweep in while a counter counts to 630.
 *  - Chancellor scene: 316 seats turn gold -> the majority needed to elect the Chancellor.
 *  - President scene: shrinks and is completed by 630 state delegates -> the Federal Convention.
 * Works in global frames (`offset` = the Sequence's start frame).
 */
export const ParliamentLayer: React.FC<{ offset: number }> = ({ offset }) => {
  const g = useCurrentFrame() + offset;

  // Bundestag scene
  const buildStart = cue("seats", "Bundestag") - 2;
  const build = progress(g, buildStart, cue("seats", "630") + 30, Easing.inOut(Easing.cubic));
  const counterA = rise(g, buildStart);
  const label = rise(g, cue("seats", "Bundestag") + 4);

  // Chancellor scene
  const ch = sceneOf("chancellor").from;
  const labelOut = progress(g, ch - 6, ch + 6);
  const fill = progress(g, cue("elect", "Chancellor") - 2, cue("elect", "316") + 12, Easing.inOut(Easing.quad));
  const counterB = rise(g, cue("elect", "Chancellor") - 2);
  const majority = pop(g, cue("elect", "316") + 12);

  // President scene
  const pr = sceneOf("president").from;
  const m = progress(g, pr - 4, pr + 22);
  const lower = progress(g, cue("convention", "by") - 4, cue("convention", "Convention") + 16, Easing.inOut(Easing.cubic));
  const president = pop(g, Math.max(cue("convention", "President"), pr + 16));
  const convTitle = rise(g, cue("convention", "Federal") - 4);
  const legend = rise(g, cue("convention", "Convention") + 6);

  const cy = CENTER_Y + (RING_Y - CENTER_Y) * m;
  const scale = 1 + (RING_SCALE - 1) * m;
  const goldCount = MAJORITY * fill;
  const shown = build * SEATS_TOTAL;
  const lowerShown = lower * SEATS_TOTAL;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${CENTER_X} ${cy}) scale(${scale})`}>
          {SEATS.map((s, k) => {
            const appear = clamp01((shown - k) / 12);
            if (appear <= 0) return null;
            const gold = clamp01(goldCount - k) * (1 - m);
            return <circle key={k} cx={s.x} cy={s.y} r={DOT * (0.4 + 0.6 * appear)} opacity={appear} fill={inkToGold(gold)} />;
          })}
          {lowerShown > 0
            ? SEATS.map((s, k) => {
                const appear = clamp01((lowerShown - k) / 12);
                if (appear <= 0) return null;
                const mirror = SEATS[SEATS_TOTAL - 1 - k];
                return (
                  <circle
                    key={`l${k}`}
                    cx={mirror.x}
                    cy={-mirror.y}
                    r={DOT * (0.4 + 0.6 * appear)}
                    opacity={appear}
                    fill={COLORS.red}
                  />
                );
              })
            : null}
          <g opacity={majority * (1 - m)} transform={`translate(0 ${-R_OUT - 30})`}>
            <path d="M-14 -4 L14 -4 L0 14 Z" fill={COLORS.red} transform={`scale(${majority})`} />
          </g>
        </g>
      </svg>

      {/* Majority tag above the hemicycle */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CENTER_Y - R_OUT - 100,
          display: "flex",
          justifyContent: "center",
          opacity: majority * (1 - m),
        }}
      >
        <div
          style={{
            padding: "6px 20px",
            borderRadius: 14,
            background: COLORS.red,
            color: COLORS.white,
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 3,
            transform: `scale(${0.6 + 0.4 * majority})`,
          }}
        >
          MAJORITY
        </div>
      </div>

      {/* Counter: 630 seats */}
      <Counter value={Math.round(SEATS_TOTAL * build)} caption="seats" opacity={counterA * (1 - labelOut)} />
      {/* Counter: 316 votes needed */}
      <Counter
        value={Math.round(MAJORITY * fill)}
        caption={`majority of ${SEATS_TOTAL} seats`}
        opacity={counterB * (1 - m)}
        color={COLORS.ink}
      />

      {/* Bundestag label */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CENTER_Y + 34,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 22,
          opacity: label * (1 - labelOut),
          transform: `translateY(${(1 - label) * 30}px)`,
        }}
      >
        <ReichstagIcon width={136} />
        <div style={{ fontSize: 76, fontWeight: 800, color: COLORS.ink, letterSpacing: -2 }}>Bundestag</div>
      </div>

      {/* President scene: title, president in the middle of the ring, legend */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 352,
          textAlign: "center",
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: -1.5,
          color: COLORS.ink,
          opacity: convTitle,
          transform: `translateY(${(1 - convTitle) * 30}px)`,
        }}
      >
        Federal Convention
      </div>
      <div
        style={{
          position: "absolute",
          left: CENTER_X - 100,
          top: RING_Y - 100,
          width: 200,
          height: 200,
          transform: `scale(${president})`,
          opacity: Math.min(1, president * 1.5),
        }}
      >
        <PersonBust id="president-ring" size={200} bg={COLORS.gold} suit={COLORS.ink} tie={COLORS.ink} hair={COLORS.hairGrey} hairStyle="receding" glasses />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1012,
          display: "flex",
          justifyContent: "center",
          gap: 40,
          fontSize: 30,
          fontWeight: 700,
          color: COLORS.inkSoft,
          opacity: legend,
          transform: `translateY(${(1 - legend) * 20}px)`,
        }}
      >
        <LegendItem color={COLORS.ink} text="630 Bundestag members" />
        <LegendItem color={COLORS.red} text="630 state delegates" />
      </div>
    </AbsoluteFill>
  );
};

const Counter: React.FC<{ value: number; caption: string; opacity: number; color?: string }> = ({
  value,
  caption,
  opacity,
  color = COLORS.ink,
}) => (
  <div
    style={{
      position: "absolute",
      left: CENTER_X - 200,
      width: 400,
      top: CENTER_Y - 150,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      opacity,
    }}
  >
    <div style={{ fontSize: 112, fontWeight: 800, lineHeight: 1, letterSpacing: -3, color, fontVariantNumeric: "tabular-nums" }}>
      {value}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.inkSoft, marginTop: 8 }}>{caption}</div>
  </div>
);

const LegendItem: React.FC<{ color: string; text: string }> = ({ color, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 22, height: 22, borderRadius: 11, background: color }} />
    {text}
  </div>
);
