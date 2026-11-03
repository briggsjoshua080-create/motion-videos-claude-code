import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { UA, type SceneProps } from "./constants";
import { Accent, Aside, BallotBox, Chain, Headline, NightLayer, Padlock, Stamp } from "./ui";

const BOX = { left: 350, top: 800, size: 380 } as const;

/**
 * "Why? Martial law. Since Russia's full-scale invasion, it bans every vote." The first loop answered
 * in part (rule 2). The background switches to night blue (rule 4), MARTIAL LAW rises, "since the
 * invasion." follows, a ballot box slides up on "law", a NO VOTES stamp lands on "Since", two chains wrap the
 * box on "invasion" and a padlock shuts on "it".
 */
export const BanScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const night = progress(frame, 0, 10) * (1 - progress(frame, duration - 6, duration + 3));
  const head = [rise(frame, cue("why", "Martial") - 6), rise(frame, cue("why", "law") - 6)];
  const aside = rise(frame, cue("why", "Since") - 4);
  const box = rise(frame, cue("why", "law") - 2);
  const chains = progress(frame, cue("why", "invasion") - 2, cue("why", "invasion", "end"), Easing.out(Easing.quad));
  const lock = pop(frame, cue("why", "it") - 4);
  const shut = progress(frame, cue("why", "it") - 1, cue("why", "it") + 4);
  // The stamp lands on "Since", so it stays up for 3 s (rule 6).
  const stamp = pop(frame, cue("why", "Since") - 2);

  const bw = BOX.size;
  const bh = BOX.size * 0.85;
  const x0 = BOX.left - 30;
  const x1 = BOX.left + bw + 30;
  const yTop = BOX.top + bh * 0.36;
  const yBot = BOX.top + bh * 0.98;

  return (
    <>
      <NightLayer p={night} />
      <Headline size={165} style={{ top: 270, ...riseStyle(head[0], exit, 50) }}>
        MARTIAL
      </Headline>
      <Headline size={165} style={{ top: 270 + 162, ...riseStyle(head[1], exit, 50) }}>
        <Accent>LAW</Accent>
      </Headline>
      <Aside size={120} style={{ top: 628, ...riseStyle(aside, exit, 30) }}>
        since the invasion.
      </Aside>

      <div style={{ position: "absolute", inset: 0, ...riseStyle(box, exit, 140) }}>
        <BallotBox size={bw} dark style={{ position: "absolute", left: BOX.left, top: BOX.top, filter: "drop-shadow(0 26px 40px rgba(0,0,0,0.5))" }} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <Chain x1={x0} y1={yTop} x2={x1} y2={yBot} p={chains} links={12} />
          <Chain x1={x1} y1={yTop} x2={x0} y2={yBot} p={chains} links={12} />
        </svg>
        <Padlock
          size={120}
          closed={shut}
          style={{
            position: "absolute",
            left: BOX.left + bw / 2 - 60,
            top: (yTop + yBot) / 2 - 92,
            opacity: Math.min(1, Math.max(0, lock) * 1.5),
            transform: `scale(${0.6 + 0.4 * Math.min(1.1, Math.max(0, lock))})`,
          }}
        />
      </div>
      <Stamp p={stamp} color={UA.yellow} fill="rgba(4,35,79,0.82)" size={112} rotate={-8} style={{ left: 182, top: 880, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
        NO VOTES
      </Stamp>
    </>
  );
};
