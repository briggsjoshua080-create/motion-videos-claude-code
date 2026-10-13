import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, localCue, sceneOf } from "../../compositions/german-election/constants";
import { GERMANY } from "../../components/german-election/germany";
import { pop, progress, rise, sceneExit } from "../../components/german-election/motion";
import { float } from "../../lib/animation";

const at = localCue("title");
const MAP_H = 580;
const MAP_W = (GERMANY.width / GERMANY.height) * MAP_H;

/** Scene 1: Germany drawn in the flag colours + the video title. "How does Germany choose its leaders?" */
export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = sceneOf("title");
  const exit = sceneExit(frame, durationInFrames);

  // Already under way on frame 0, so the very first frame (feed thumbnail) is never empty.
  const outline = progress(frame, -12, 20);
  const stripes = [progress(frame, 2, 20), progress(frame, 7, 25), progress(frame, 12, 30)];
  const mapIn = rise(frame, -20);
  const kicker = rise(frame, 10);
  const words = ["German", "election", "system"];
  const underline = progress(frame, at("hook", "leaders") - 4, at("hook", "leaders") + 12);
  const berlin = pop(frame, at("hook", "Germany"));

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: (1080 - MAP_W) / 2,
          top: 318 + float(frame, 8, 120),
          width: MAP_W,
          height: MAP_H,
          opacity: mapIn * (1 - exit),
          transform: `scale(${(0.92 + 0.08 * mapIn) * (1 - 0.12 * exit)}) translateY(${-exit * 80}px)`,
        }}
      >
        <svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${GERMANY.width} ${GERMANY.height}`} style={{ overflow: "visible" }}>
          <defs>
            <clipPath id="germany-clip">
              <path d={GERMANY.d} />
            </clipPath>
            <filter id="germany-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx={0} dy={14} stdDeviation={16} floodColor={COLORS.ink} floodOpacity={0.18} />
            </filter>
          </defs>
          <g filter="url(#germany-shadow)">
            <g clipPath="url(#germany-clip)">
              <rect x={0} y={0} width={GERMANY.width} height={GERMANY.height} fill={COLORS.paperDeep} />
              {[COLORS.black, COLORS.red, COLORS.gold].map((c, i) => (
                <rect
                  key={c}
                  x={-GERMANY.width * (1 - stripes[i])}
                  y={(GERMANY.height / 3) * i - 1}
                  width={GERMANY.width}
                  height={GERMANY.height / 3 + 2}
                  fill={c}
                />
              ))}
            </g>
          </g>
          <path
            d={GERMANY.d}
            fill="none"
            stroke={COLORS.ink}
            strokeWidth={5}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1 2"
            strokeDashoffset={1 - outline}
            opacity={outline > 0.001 ? 1 : 0}
          />
          <g transform={`translate(${GERMANY.berlin[0]} ${GERMANY.berlin[1]}) scale(${berlin})`}>
            <circle r={26} fill={COLORS.white} opacity={0.35} />
            <circle r={13} fill={COLORS.white} stroke={COLORS.ink} strokeWidth={5} />
          </g>
        </svg>
        <div
          style={{
            position: "absolute",
            left: (GERMANY.berlin[0] / GERMANY.width) * MAP_W + 26,
            top: (GERMANY.berlin[1] / GERMANY.height) * MAP_H - 70,
            padding: "6px 14px",
            borderRadius: 12,
            background: COLORS.white,
            color: COLORS.ink,
            fontSize: 30,
            fontWeight: 800,
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            opacity: berlin,
            transform: `scale(${0.8 + 0.2 * berlin})`,
          }}
        >
          Berlin
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 935,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 1 - exit,
          transform: `translateY(${-exit * 60}px)`,
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 6,
            color: COLORS.red,
            opacity: kicker,
            transform: `translateY(${(1 - kicker) * 20}px)`,
            marginBottom: 18,
          }}
        >
          EXPLAINED IN 30 SECONDS
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 26px", maxWidth: 900 }}>
          {words.map((w, i) => {
            const p = rise(frame, 12 + i * 5);
            return (
              <div
                key={w}
                style={{
                  position: "relative",
                  fontSize: 104,
                  fontWeight: 800,
                  letterSpacing: -3,
                  lineHeight: 1.08,
                  color: COLORS.ink,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 50}px)`,
                }}
              >
                {i > 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: -6,
                      right: -6,
                      bottom: 10,
                      height: 26,
                      borderRadius: 6,
                      background: COLORS.gold,
                      transformOrigin: "left center",
                      transform: `scaleX(${progress(underline, (i - 1) * 0.5, (i - 1) * 0.5 + 0.5)})`,
                    }}
                  />
                ) : null}
                <span style={{ position: "relative" }}>{w}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
