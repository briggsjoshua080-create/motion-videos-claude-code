import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Aside, Headline } from "./ui";
import { EMPTY_CENTRE, RadaSeats } from "./RadaSeats";

const ZOOM = 2.8;
const TARGET = { x: 540, y: 720 } as const;

/**
 * "And the 26 grey seats? Occupied districts, where no vote could be held." The rewatch payoff (rule
 * 10): the 2019 hemicycle comes back, the camera zooms into the hollow grey rings that sat at its
 * right end all along (shown at about 35 s, never mentioned), they light up while the rest dims,
 * 26 EMPTY SEATS, then "occupied districts," and "no vote held.".
 */
export const EmptySeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const build = progress(frame, 0, 10, Easing.out(Easing.quad));
  // The whole hemicycle first (a callback to 35 s), then the zoom; the headline rises once the dots have moved down and away.
  const z = progress(frame, cue("empty", "26") - 4, cue("empty", "seats") + 8, Easing.inOut(Easing.cubic));
  const glow = z * (0.65 + 0.35 * Math.sin(frame / 3.2));
  const head = [rise(frame, cue("empty", "grey") - 6), rise(frame, cue("empty", "grey") - 2)];
  const lines = [rise(frame, cue("empty", "Occupied") - 6), rise(frame, cue("empty", "Occupied") - 2)];
  const s = 1 + (ZOOM - 1) * z;
  const dx = (TARGET.x - EMPTY_CENTRE.x) * z;
  const dy = (TARGET.y - EMPTY_CENTRE.y) * z;
  // Dots never sit behind the headline: everything above y ≈ 590 fades out as the headline comes in.
  const cut = 590 * Math.min(1, head[0]);
  const mask = `linear-gradient(to bottom, transparent ${cut}px, black ${cut + 50}px, black 1060px, transparent 1170px)`;

  return (
    <>
      <Headline size={150} style={{ top: 250, ...riseStyle(head[0], exit, 40) }}>
        26 EMPTY
      </Headline>
      <Headline size={150} style={{ top: 250 + 147, ...riseStyle(head[1], exit, 40) }}>
        <Accent>SEATS</Accent>
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, WebkitMaskImage: mask, maskImage: mask }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${EMPTY_CENTRE.x}px ${EMPTY_CENTRE.y}px`, transform: `translate(${dx}px, ${dy}px) scale(${s})` }}>
          <RadaSeats build={build} dim={z} glow={glow} />
        </div>
      </div>
      <Aside size={118} style={{ top: 860, ...riseStyle(lines[0], exit, 30) }}>
        occupied districts,
      </Aside>
      <Aside size={118} style={{ top: 980, ...riseStyle(lines[1], exit, 30) }}>
        no vote held.
      </Aside>
    </>
  );
};
