import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { type SceneProps } from "./constants";
import { Accent, CapitolDome, Coin, Headline, Scroll } from "./ui";

/**
 * "(Together, they) write the laws and control the money." What Congress does, in two words (the
 * standing brief: say what an institution does): LAWS with a scroll that pops on "laws", MONEY with
 * a gold coin that drops on "money", over the Capitol. Both words are up from the scene's start.
 */
export const CongressScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4)];
  const scroll = pop(frame, cue("congress", "laws") - 5);
  const coin = pop(frame, cue("congress", "money") - 6);
  const dome = rise(frame, 2);
  const iconStyle = (p: number): React.CSSProperties => ({
    position: "absolute",
    opacity: Math.min(1, Math.max(0, p) * 1.5) * (1 - exit),
    transform: `scale(${0.5 + 0.5 * Math.min(1.1, Math.max(0, p))}) rotate(${(1 - Math.min(1, p)) * -25}deg)`,
  });

  return (
    <>
      <Headline size={175} style={{ top: 250, ...riseStyle(head[0], exit, 50) }}>
        LAWS
      </Headline>
      <Headline size={175} style={{ top: 250 + 175 * 0.98 + 14, ...riseStyle(head[1], exit, 50) }}>
        <Accent>MONEY</Accent>
      </Headline>
      <div style={{ ...iconStyle(scroll), left: 720, top: 190, width: 192, height: 240 }}>
        <Scroll size={240} style={{ filter: "drop-shadow(0 20px 30px rgba(0,8,30,0.45))" }} />
      </div>
      <CapitolDome size={460} style={{ position: "absolute", left: 140, top: 680, ...riseStyle(dome, exit, 40), filter: "drop-shadow(0 22px 34px rgba(0,8,30,0.45))" }} />
      <div style={{ ...iconStyle(coin), left: 690, top: 800 - (1 - Math.min(1, Math.max(0, coin))) * 200, width: 220, height: 220 }}>
        <Coin size={220} style={{ left: 0, top: 0 }} />
      </div>
    </>
  );
};
