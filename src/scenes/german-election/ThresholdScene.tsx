import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { COLORS, FONT, localCue } from "../../compositions/german-election/constants";
import { pop, progress, rise } from "../../components/german-election/motion";

const at = localCue("bundestag");

const CARD = { x: 140, y: 400, w: 800, h: 640 };
const BASE_Y = 560; // chart baseline inside the card
const PX_PER_PCT = 15;
const THRESHOLD = 5;
const BARS = [27, 21, 15, 12, 8, 4, 2.5];
const BAR_COLORS = [COLORS.ink, COLORS.red, COLORS.goldDeep, COLORS.inkSoft, COLORS.barGrey, COLORS.barGrey, COLORS.barGrey];

/** Scene 3a: "Parties need 5% to enter." Bar chart with the 5% threshold line. */
export const ThresholdScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cardIn = rise(frame, 0);
  const line = progress(frame, at("threshold", "5%") - 2, at("threshold", "5%") + 12);
  const tag = pop(frame, at("threshold", "5%") + 6);
  const verdict = progress(frame, at("threshold", "enter") - 2, at("threshold", "enter") + 8);
  const out = progress(frame, at("seats", "Bundestag") - 8, at("seats", "Bundestag") + 6);

  const lineY = BASE_Y - THRESHOLD * PX_PER_PCT;
  const slot = 680 / BARS.length;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: 26,
          background: COLORS.card,
          boxShadow: "0 24px 60px rgba(22,22,26,0.14)",
          opacity: cardIn * (1 - out),
          transform: `translateY(${(1 - cardIn) * 80}px) scale(${1 - 0.1 * out})`,
        }}
      >
        <div style={{ position: "absolute", left: 40, top: 34, fontSize: 28, fontWeight: 800, letterSpacing: 4, color: COLORS.inkSoft }}>
          SHARE OF VOTES
        </div>
        <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", inset: 0 }}>
          <line x1={50} y1={BASE_Y} x2={CARD.w - 50} y2={BASE_Y} stroke={COLORS.line} strokeWidth={4} strokeLinecap="round" />
          {BARS.map((v, i) => {
            const grow = rise(frame, 4 + i * 3);
            const h = v * PX_PER_PCT * grow;
            const x = 60 + i * slot + (slot - 62) / 2;
            const failed = v < THRESHOLD;
            const fill = failed ? interpolateColors(verdict, [0, 1], [BAR_COLORS[i], COLORS.barOut]) : BAR_COLORS[i];
            const mark = 1.3 * pop(frame, at("threshold", "enter") + (failed ? 0 : 5));
            return (
              <g key={i}>
                <rect x={x} y={BASE_Y - h} width={62} height={h} rx={10} fill={fill} />
                <g transform={`translate(${x + 31} ${BASE_Y + 46}) scale(${mark})`} opacity={verdict}>
                  {failed ? (
                    <g stroke={COLORS.red} strokeWidth={7} strokeLinecap="round">
                      <line x1={-14} y1={-14} x2={14} y2={14} />
                      <line x1={14} y1={-14} x2={-14} y2={14} />
                    </g>
                  ) : (
                    <path d="M-15 1 L-4 12 L16 -12" stroke={COLORS.ink} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </g>
              </g>
            );
          })}
          <line
            x1={40}
            y1={lineY}
            x2={40 + (CARD.w - 80) * line}
            y2={lineY}
            stroke={COLORS.red}
            strokeWidth={5}
            strokeDasharray="16 12"
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            right: 26,
            top: lineY - 84,
            padding: "6px 18px",
            borderRadius: 14,
            background: COLORS.red,
            color: COLORS.white,
            fontSize: 40,
            fontWeight: 800,
            transform: `scale(${tag})`,
            transformOrigin: "right bottom",
          }}
        >
          5%
        </div>
      </div>
    </AbsoluteFill>
  );
};
