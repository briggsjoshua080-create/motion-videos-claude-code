import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { HOUSE, HOUSE_TERM, SENATE_TERM, US, type SceneProps } from "./constants";
import { Accent, Aside, Headline, HouseSeats, SenateGrid, Stamp, sweepIn } from "./ui";

/**
 * "The House: 435, one per district, every two years. The Senate: two per state, for six years."
 * How the two chats are elected. THE HOUSE / 435 while a 435-dot hemicycle builds, "one per
 * district," and a 2 YEARS stamp; then SENATE / 6 YEARS over 50 states as pairs of dots, the two
 * seats of each state lighting up together on "two per state".
 */
export const HouseScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), pop(frame, cue("house", "435") - 4)];
  const build = progress(frame, cue("house", "435") - 4, cue("house", "district", "end"), Easing.out(Easing.quad));
  const aside = rise(frame, cue("house", "one") - 5);
  const stamp = pop(frame, cue("house", "every") - 3);
  const swap = cue("senate", "The") - 6;
  const out = progress(frame, swap, swap + 8);
  const senate = [rise(frame, swap + 2), pop(frame, cue("senate", "six") - 5)];
  const grid = progress(frame, swap + 2, swap + 16);
  const pairs = progress(frame, cue("senate", "two") - 3, cue("senate", "state", "end"));
  const senAside = rise(frame, cue("senate", "two") - 5);

  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-out * 50}px)` }}>
        <Headline size={130} style={{ top: 230, ...riseStyle(head[0], 0, 50) }}>
          THE HOUSE
        </Headline>
        <Headline size={175} style={{ top: 370, opacity: Math.min(1, Math.max(0, head[1]) * 1.5), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, head[1]))})`, transformOrigin: "0 50%" }}>
          <Accent>{HOUSE}</Accent>
        </Headline>
        <Aside size={118} style={{ top: 570, ...riseStyle(aside, 0, 30) }}>
          one per district,
        </Aside>
        <HouseSeats visible={(i) => sweepIn(build, i)} fill={() => US.white} cy={1120} />
        <Stamp p={stamp} size={120} color={US.white} fill={US.red} rotate={-7} style={{ left: 290, top: 970 }}>
          {HOUSE_TERM} YEARS
        </Stamp>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: out * (1 - exit) }}>
        <Headline size={150} style={{ top: 230, ...riseStyle(senate[0], 0, 50) }}>
          SENATE
        </Headline>
        <Headline size={150} style={{ top: 230 + 150 * 0.98 + 10, opacity: Math.min(1, Math.max(0, senate[1]) * 1.5) }}>
          <Accent>{SENATE_TERM}</Accent> YEARS
        </Headline>
        <Aside size={118} style={{ top: 565, ...riseStyle(senAside, 0, 30) }}>
          two per state.
        </Aside>
        <SenateGrid
          left={258}
          top={735}
          step={48}
          dot={17}
          visible={(i) => grid * 14 - Math.floor(i / 10) * 0.9 - (i % 10) * 0.25}
          fill={(i) => (pairs * 50 - Math.floor(i / 2) > 0 ? US.white : "rgba(255,255,255,0.3)")}
        />
      </div>
    </>
  );
};
