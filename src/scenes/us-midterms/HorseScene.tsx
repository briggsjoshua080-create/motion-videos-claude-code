import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ELECTION_DAY_LAW, FONT, US, type SceneProps } from "./constants";
import { Horse, Mark, ReportCard, SectionNumeral } from "./ui";
import { CARD } from "./HookScene";

/** Centre of the horse sticker on the hook's report card (card rotated -4° about its centre), and where the zoom takes it. */
const STICKER = (() => {
  const header = Math.round(CARD.height * 0.16);
  const size = Math.round(CARD.width * 0.17);
  const local = { x: CARD.width - CARD.width * 0.05 - size / 2, y: header * 0.12 + size / 2 };
  const a = (CARD.rotate * Math.PI) / 180;
  const rx = local.x - CARD.width / 2;
  const ry = local.y - CARD.height / 2;
  return {
    x: CARD.left + CARD.width / 2 + rx * Math.cos(a) - ry * Math.sin(a),
    y: CARD.top + CARD.height / 2 + rx * Math.sin(a) + ry * Math.cos(a),
  };
})();
const STICKER_R = Math.round(CARD.width * 0.17) / 2;
/** The magnifying glass: where it ends up and how big; inside it the card is magnified ZOOM times. */
const TARGET = { x: 540, y: 700, r: 300 } as const;
const ZOOM = 5;
const DAY = { top: 600, width: 380, height: 250, left: [120, 580] } as const;

/**
 * "And the horse? In 1845, farmers rode to vote, never on Sundays. Hence, Tuesday." Section 06, the
 * rewatch payoff (rule 10) as an absurd origin story (comedy formula): the hook's report card comes
 * back and the camera zooms into its gold horse sticker (there since frame 0, never mentioned); on
 * "1845" the horse gallops off it across the screen, two calendar days appear, SUN gets crossed out
 * on "Sundays" and TUE gets circled on "Tuesday", where the horse stops.
 */
export const HorseScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const year = cue("horse", "1845");
  const z = progress(frame, 0, year - 3, Easing.inOut(Easing.cubic));
  const cardOut = progress(frame, year - 3, year + 5);
  const yearIn = pop(frame, year - 4);
  const days = [rise(frame, cue("horse", "farmers") - 8), rise(frame, cue("horse", "farmers") - 4)];
  const cross = progress(frame, cue("horse", "Sundays") - 3, cue("horse", "Sundays") + 9);
  const ring = progress(frame, cue("horse", "Tuesday") - 4, cue("horse", "Tuesday") + 8);
  const run = progress(frame, year - 2, cue("horse", "Tuesday") + 2, Easing.out(Easing.quad));
  const horseX = interpolate(run, [0, 1], [-420, DAY.left[1] + 10]);
  const stopping = 1 - progress(frame, cue("horse", "Tuesday") - 6, cue("horse", "Tuesday") + 6);
  const s = 1 + (ZOOM - 1) * z;
  const lens = {
    x: interpolate(z, [0, 1], [STICKER.x, TARGET.x]),
    y: interpolate(z, [0, 1], [STICKER.y, TARGET.y]),
    r: interpolate(z, [0, 1], [STICKER_R * 1.25, TARGET.r]),
  };

  return (
    <>
      <SectionNumeral n="06" p={numeral * (1 - exit)} />

      {cardOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - cardOut, transform: `scale(${1 - 0.3 * cardOut})`, transformOrigin: `${lens.x}px ${lens.y}px` }}>
          <div style={{ position: "absolute", inset: 0, clipPath: `circle(${lens.r}px at ${lens.x}px ${lens.y}px)`, background: US.paper }}>
            <div style={{ position: "absolute", inset: 0, transformOrigin: `${STICKER.x}px ${STICKER.y}px`, transform: `translate(${(lens.x - STICKER.x)}px, ${(lens.y - STICKER.y)}px) scale(${s})` }}>
              <ReportCard width={CARD.width} height={CARD.height} rotate={CARD.rotate} style={{ left: CARD.left, top: CARD.top }} />
            </div>
          </div>
          {/* The lens rim and handle: the camera "zooms" like a detective's magnifying glass. */}
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line x1={lens.x + lens.r * 0.72} y1={lens.y + lens.r * 0.72} x2={lens.x + lens.r * 1.1} y2={lens.y + lens.r * 1.1} stroke={US.goldDeep} strokeWidth={lens.r * 0.16} strokeLinecap="round" />
            <circle cx={lens.x} cy={lens.y} r={lens.r} fill="none" stroke={US.white} strokeWidth={Math.max(4, lens.r * 0.05)} />
          </svg>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 120,
          top: 220,
          fontFamily: FONT.display,
          fontSize: 300,
          lineHeight: 0.92,
          letterSpacing: -6,
          color: US.white,
          textShadow: "0 0 60px rgba(255,255,255,0.35)",
          opacity: Math.min(1, Math.max(0, yearIn) * 1.5) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * Math.min(1.06, Math.max(0, yearIn))}) translateY(${-exit * 40}px)`,
          transformOrigin: "0 50%",
        }}
      >
        {ELECTION_DAY_LAW}
      </div>

      {(["SUN", "TUE"] as const).map((day, i) => (
        <div
          key={day}
          style={{
            position: "absolute",
            left: DAY.left[i],
            top: DAY.top,
            width: DAY.width,
            height: DAY.height,
            borderRadius: 24,
            background: US.card,
            overflow: "visible",
            boxShadow: "0 24px 44px rgba(0,8,30,0.4)",
            ...riseStyle(days[i], exit, 50),
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 44, borderRadius: "24px 24px 0 0", background: US.red }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 44, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontSize: 150, lineHeight: 1, color: US.ink, letterSpacing: -2 }}>
            {day}
          </div>
          {i === 0 && cross > 0 && (
            <div style={{ position: "absolute", left: 70, top: 10 }}>
              <Mark ok={false} size={240} p={cross} color={US.red} width={12} />
            </div>
          )}
          {i === 1 && ring > 0 && (
            <svg width={DAY.width + 100} height={DAY.height + 100} style={{ position: "absolute", left: -50, top: -50, overflow: "visible" }}>
              <ellipse
                cx={(DAY.width + 100) / 2}
                cy={(DAY.height + 100) / 2}
                rx={DAY.width / 2 + 32}
                ry={DAY.height / 2 + 22}
                fill="none"
                stroke={US.red}
                strokeWidth={12}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - ring}
                transform={`rotate(-5 ${(DAY.width + 100) / 2} ${(DAY.height + 100) / 2})`}
              />
            </svg>
          )}
        </div>
      ))}

      {run > 0 && (
        <Horse
          width={360}
          color={US.white}
          mane={US.gold}
          phase={frame * 0.75 * (0.25 + 0.75 * stopping)}
          style={{ position: "absolute", left: horseX, top: 905, opacity: 1 - exit, filter: "drop-shadow(0 20px 22px rgba(0,8,30,0.45))" }}
        />
      )}
    </>
  );
};
