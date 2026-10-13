import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { EU27 } from "../../components/europe";
import { float } from "../../lib/animation";
import { pop, progress, rise, sceneExit } from "../../components/explainer/motion";
import { EU, PALETTE as C, type SceneProps } from "./constants";
import { Pill, StarRing } from "./ui";

const MAP = { height: 600, top: 306 } as const;
const MAP_W = (MAP.height * EU27.width) / EU27.height;
const MAP_LEFT = 540 - MAP_W / 2;
/** The star ring sits over the map, centred on its visual middle. */
const RING = { cx: 548, cy: 606, size: 730, star: 25 } as const;
const minX = Math.min(...EU27.countries.map((c) => c.centre[0]));
const maxX = Math.max(...EU27.countries.map((c) => c.centre[0]));

export type TitleSceneProps = SceneProps & {
  kicker: string;
  /**
   * "countries": the 27 countries fill in one after another on `fillWord`, then the
   * "27 countries -> 1 parliament" chips pop (Part 1). "question": the map is already blue and a
   * big "?" pops on `fillWord` (Part 2).
   */
  mode: "countries" | "question";
  fillWord: string;
};

/** Map of the 27 EU countries inside the ring of stars, the part number and the series title. */
export const TitleScene: React.FC<TitleSceneProps> = ({ cue, duration, kicker, mode, fillWord }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  // Map, ring and title are already on screen at frame 0, so the thumbnail is never empty.
  const mapIn = rise(frame, -18);
  const kickerIn = rise(frame, -26);
  const titleIn = rise(frame, -22);
  const fillAt = cue("hook", fillWord) - 4;
  const chipA = pop(frame, cue("hook", fillWord) - 2);
  const chipB = mode === "countries" ? pop(frame, cue("hook", "parliament") - 3) : 0;
  const question = pop(frame, fillAt);

  const countryFill = (x: number) => {
    if (mode === "question") return EU.blue;
    // Ripple from west to east over ~16 frames.
    const t = progress(frame, fillAt + ((x - minX) / (maxX - minX)) * 16, fillAt + ((x - minX) / (maxX - minX)) * 16 + 8);
    return interpolateColors(t, [0, 1], [EU.bluePale, EU.blue]);
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: MAP_LEFT,
          top: MAP.top,
          opacity: 1 - exit,
          transform: `translateY(${-exit * 60}px) scale(${0.94 + 0.06 * mapIn})`,
          filter: "drop-shadow(0 18px 30px rgba(0,51,153,0.18))",
        }}
      >
        <svg width={MAP_W} height={MAP.height} viewBox={`0 0 ${EU27.width} ${EU27.height}`} style={{ overflow: "visible" }}>
          {EU27.countries.map((c) => (
            <path key={c.name} d={c.d} fill={countryFill(c.centre[0])} stroke={C.white} strokeWidth={2.4} strokeLinejoin="round" />
          ))}
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: RING.cx - RING.size / 2,
          top: RING.cy - RING.size / 2 + float(frame, 4, 120),
          opacity: 1 - exit,
          transform: `rotate(${frame * 0.08}deg) scale(${0.92 + 0.08 * mapIn})`,
        }}
      >
        <StarRing size={RING.size} star={RING.star} />
      </div>

      {mode === "question" ? (
        <div
          style={{
            position: "absolute",
            left: 540 - 85,
            top: RING.cy - 85,
            width: 170,
            height: 170,
            borderRadius: 85,
            background: EU.yellow,
            border: `6px solid ${C.ink}`,
            boxSizing: "border-box",
            color: C.ink,
            fontFamily: theme.font,
            fontSize: 120,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 18px 40px rgba(15,27,61,0.28)",
            opacity: Math.min(1, question * 1.4) * (1 - exit),
            transform: `scale(${question}) rotate(${(1 - question) * -30}deg)`,
          }}
        >
          ?
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          top: 992,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: 6,
          color: EU.blue,
          opacity: kickerIn * (1 - exit),
          transform: `translateY(${(1 - kickerIn) * 30 - exit * 40}px)`,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1038,
          left: 120,
          width: 840,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: -2.5,
          lineHeight: 1.04,
          color: C.ink,
          opacity: titleIn * (1 - exit),
          transform: `translateY(${(1 - titleIn) * 40 - exit * 40}px)`,
        }}
      >
        EU election system
      </div>

      {mode === "countries" ? (
        <div
          style={{
            position: "absolute",
            top: 1178,
            left: 120,
            width: 840,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 22,
            opacity: 1 - exit,
          }}
        >
          <Pill p={chipA} bg={EU.blue} color={C.white}>
            27 countries
          </Pill>
          <svg width={54} height={30} viewBox="0 0 54 30" style={{ opacity: Math.min(1, chipB * 1.4) }}>
            <path d="M4 15 H44 M32 4 L46 15 L32 26" fill="none" stroke={C.inkSoft} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Pill p={chipB} bg={EU.yellow} color={C.ink}>
            1 parliament
          </Pill>
        </div>
      ) : null}
    </>
  );
};
