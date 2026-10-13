import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { ease } from "../../lib/animation";
import { FR, PersonIcon, Pill, SAFE, SceneFrame, SceneHeader, pop, span, type SceneProps } from "./ui";

/** Official first-round results, 10 April 2022 (Conseil constitutionnel). */
const RESULTS = [
  { name: "MACRON", pct: 27.85, spoken: "Macron" },
  { name: "LE PEN", pct: 23.15, spoken: "Le" },
  { name: "MÉLENCHON", pct: 21.95, spoken: "Mélenchon" },
];
const CENTERS = [265, 540, 815];
const BAR_W = 190;
const BASE = 1060;
/** The dashed 50% line; bars are scaled so 50% would reach it. */
const LINE = 470;
const PX = (BASE - LINE) / 50;

export const Round1Scene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const lineIn = ease(frame, [4, 20]);
  const twelve = cue("r1a", "twelve");
  const missed = ease(frame, span(cue("r1b", "missed") - 3, cue("r1b", "missed") + 9));

  return (
    <SceneFrame duration={duration}>
      <SceneHeader kicker="2022 · ROUND 1" title="12 candidates ran" />

      <div
        style={{
          position: "absolute",
          top: 352,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {Array.from({ length: 12 }, (_, i) => {
          const p = pop(frame, twelve - 4 + i * 1.5);
          return (
            <div key={i} style={{ opacity: 0.85 * p, transform: `scale(${p})` }}>
              <PersonIcon size={56} color={i < 3 ? FR.white : FR.mist} />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: LINE,
          borderTop: `4px dashed ${FR.white}`,
          opacity: 0.8 * lineIn,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: LINE - 44,
          textAlign: "right",
          fontFamily: theme.font,
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: 2,
          color: FR.white,
          opacity: 0.8 * lineIn,
        }}
      >
        50% NEEDED TO WIN
      </div>
      <div style={{ position: "absolute", left: SAFE.left, width: SAFE.width, top: BASE, height: 4, background: FR.line }} />

      {RESULTS.map((r, i) => {
        const g = ease(frame, span(cue("r1b", r.spoken) - 3, cue("r1b", r.spoken) + 16));
        const h = r.pct * PX * g;
        const qualified = i < 2;
        const dim = qualified ? 1 : 1 - 0.6 * missed;
        const tag = pop(frame, cue("r1b", "missed") - 3 + (qualified ? i * 3 : 6));
        const label: React.CSSProperties = {
          position: "absolute",
          left: CENTERS[i] - 150,
          width: 300,
          textAlign: "center",
          fontFamily: theme.font,
          color: FR.white,
        };
        return (
          <React.Fragment key={r.name}>
            <div
              style={{
                position: "absolute",
                left: CENTERS[i] - BAR_W / 2,
                width: BAR_W,
                top: BASE - h,
                height: h,
                borderRadius: "20px 20px 0 0",
                background: FR.white,
                opacity: dim,
              }}
            />
            <div
              style={{
                ...label,
                top: BASE - h - 72,
                fontSize: 52,
                fontWeight: 900,
                fontVariantNumeric: "tabular-nums",
                opacity: g * dim,
              }}
            >
              {(r.pct * g).toFixed(2)}%
            </div>
            <div
              style={{
                ...label,
                top: BASE - h - 140,
                display: "flex",
                justifyContent: "center",
                opacity: tag,
                transform: `scale(${tag})`,
              }}
            >
              {qualified ? (
                <Pill size={26}>ROUND 2</Pill>
              ) : (
                <Pill size={26} bg="transparent" border={`3px solid ${FR.mist}`} color={FR.mist}>
                  1.2 PTS SHORT
                </Pill>
              )}
            </div>
            <div style={{ ...label, top: BASE + 18, fontSize: 38, fontWeight: 800, letterSpacing: 1, opacity: g * dim }}>
              {r.name}
            </div>
          </React.Fragment>
        );
      })}
    </SceneFrame>
  );
};
