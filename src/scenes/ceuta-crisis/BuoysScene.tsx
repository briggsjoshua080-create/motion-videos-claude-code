import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, Aside, Headline } from "./ui";
import { BARRIER, ChartView, HOOK_VIEW } from "./maps";

/**
 * "And the dotted line at the start? A floating barrier, to make sending swimmers back legal again."
 * Rule 10's payoff: the hook's chart returns where it was on frame 0, the view zooms onto the dotted
 * line in the sea, whose floats light up; FLOATING / BARRIER, "to send them back.". (Spain began the
 * 500 m barrier on 1 Aug 2026; the court said returns could apply with "containment" at sea.)
 */
export const BuoysScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, cue("buoys", "floating") - 8), rise(frame, cue("buoys", "barrier") - 8)];
  const aside = rise(frame, cue("buoys", "to") - 6);
  const mapIn = rise(frame, 0);
  const z = progress(frame, cue("buoys", "start") - 4, cue("buoys", "barrier"), Easing.inOut(Easing.cubic));
  const glow = progress(frame, cue("buoys", "floating") - 6, cue("buoys", "barrier") + 4);
  const blink = 0.6 + 0.4 * Math.sin(frame / 4);
  const [x, y, w, h] = HOOK_VIEW.vb;
  const fx = (BARRIER.from[0] + BARRIER.to[0]) / 2;
  const fy = (BARRIER.from[1] + BARRIER.to[1]) / 2;
  const k = 1 + 0.75 * z;
  const nw = w / k;
  const nh = h / k;
  const vb: [number, number, number, number] = [x + (fx - nw / 2 - x) * z, y + (fy - nh / 2 - y) * z, nw, nh];

  return (
    <>
      <ChartView tone="sea" top={660} vb={vb} swimFrame={frame} swimAmount={0.35 * (1 - z)} crowd={0} barrierGlow={glow * blink} opacity={Math.min(1, mapIn) * (1 - exit)} />
      <Headline size={130} style={{ top: 280, ...riseStyle(head[0], exit, 50) }}>
        FLOATING
      </Headline>
      <Headline size={160} style={{ top: 280 + 135, ...riseStyle(head[1], exit, 50) }}>
        <Accent>BARRIER</Accent>
      </Headline>
      <Aside size={120} style={{ top: 610, ...riseStyle(aside, exit, 30) }}>
        to send them back.
      </Aside>
    </>
  );
};
