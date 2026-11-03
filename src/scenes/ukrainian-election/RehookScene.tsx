import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, UA, type SceneProps } from "./constants";
import { Accent, Headline, TVFrame, WipeLayer } from "./ui";

/**
 * "How they got there sounds made up." Re-hook 1 (rule 5, at about 14 s): a full yellow flash as the
 * pattern break, an old TV full of static with a big question mark, and SOUNDS MADE UP? (up from the
 * first frames, so it stays 2 s).
 */
export const RehookScene: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const tv = pop(frame, 3);
  const mark = pop(frame, 9);
  const head = [rise(frame, 0), rise(frame, 2)];
  const flicker = 0.45 + 0.2 * Math.abs(Math.sin(frame * 1.7));

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, Math.max(0, tv) * 1.5) * (1 - exit), transform: `scale(${0.85 + 0.15 * Math.min(1.05, tv)})`, transformOrigin: "540px 540px" }}>
        <TVFrame left={150} top={300} width={780} height={470} staticAmount={flicker} tone="flash">
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT.display,
              fontSize: 300,
              lineHeight: 1,
              color: UA.yellow,
              textShadow: "0 0 50px rgba(255,215,0,0.6)",
              opacity: Math.min(1, Math.max(0, mark) * 1.5),
              transform: `scale(${0.5 + 0.5 * Math.min(1.1, Math.max(0, mark))}) rotate(${(1 - Math.min(1, mark)) * 20}deg)`,
            }}
          >
            ?
          </div>
        </TVFrame>
      </div>
      <Headline size={150} tone="flash" style={{ top: 830, ...riseStyle(head[0], exit, 40) }}>
        SOUNDS
      </Headline>
      <Headline size={145} tone="flash" style={{ top: 830 + 147, ...riseStyle(head[1], exit, 40) }}>
        <Accent tone="flash">MADE UP?</Accent>
      </Headline>
    </>
  );
};
