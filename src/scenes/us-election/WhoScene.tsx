import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, US, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono } from "./ui";

const CARD_A = { top: 752, height: 300 } as const;
const CARD_B = { top: 1076, height: 156 } as const;

/**
 * "Who can vote? US citizens from 18, even abroad. But first, you have to register." A big 18+
 * card (US citizens, ticked "even abroad") and a REGISTER card (every state but North Dakota),
 * under the headline and the aside that voting isn't compulsory.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("who", "vote") + 2);
  const cardA = rise(frame, cue("who", "US") - 6);
  const age = pop(frame, cue("who", "18") - 4);
  const abroad = rise(frame, cue("who", "abroad") - 6);
  const tick = progress(frame, cue("who", "abroad") - 2, cue("who", "abroad") + 10);
  const cardB = rise(frame, cue("who", "But") - 6);
  const reg = pop(frame, cue("who", "register") - 4);
  const firstP = progress(frame, cue("who", "first") - 2, cue("who", "register") + 6);

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>02 — WHO CAN VOTE</Eyebrow>
      <Headline size={150} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        WHO CAN
      </Headline>
      <Headline size={150} style={{ top: 352 + 147, ...riseStyle(head[1], exit, 50) }}>
        <Accent>VOTE?</Accent>
      </Headline>
      <Aside size={46} style={{ top: 672, ...riseStyle(aside, exit, 24) }}>
        Voting isn't compulsory — 65% voted in 2024.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={US.redBright} style={riseStyle(cardA, exit)}>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 40,
            fontFamily: FONT.display,
            fontSize: 196,
            lineHeight: 1,
            color: US.redBright,
            textShadow: "0 0 34px rgba(240,71,94,0.45)",
            transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, age))})`,
            transformOrigin: "left center",
            opacity: Math.min(1, Math.max(0, age) * 1.5),
          }}
        >
          18+
        </div>
        <div style={{ position: "absolute", left: 470, top: 46, width: 340 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: US.white, lineHeight: 1.1 }}>US citizens</div>
          <div style={{ marginTop: 8, fontSize: 27, fontWeight: 500, color: US.textSoft, lineHeight: 1.25 }}>18 or over on election day</div>
        </div>
        <div style={{ position: "absolute", left: 470, top: 176, width: 340, height: 2, background: US.line, opacity: abroad }} />
        <div style={{ position: "absolute", left: 470, top: 192, width: 350, ...riseStyle(abroad, 0, 20) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 36, fontWeight: 800, color: US.redBright }}>
            <Mark ok size={34} p={tick} color={US.redBright} />
            even abroad
          </div>
          <div style={{ marginTop: 6, fontSize: 24, fontWeight: 500, color: US.textSoft }}>by mail, via their home state</div>
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={US.white} style={riseStyle(cardB, exit)}>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 52,
            fontFamily: FONT.display,
            fontSize: 50,
            lineHeight: 1,
            color: US.white,
            textShadow: "0 0 20px rgba(255,255,255,0.3)",
            transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, reg))})`,
            transformOrigin: "left center",
            opacity: Math.min(1, Math.max(0, reg) * 1.5),
          }}
        >
          REGISTER
        </div>
        <div style={{ position: "absolute", left: 350, top: 30, width: 460 }}>
          <div style={{ fontSize: 29, fontWeight: 800, color: US.white, lineHeight: 1.15 }}>
            <span style={{ position: "relative", color: firstP > 0.3 ? US.redBright : US.white }}>
              first
              <span style={{ position: "absolute", left: 0, bottom: -3, height: 3, width: `${firstP * 100}%`, background: US.redBright, borderRadius: 2 }} />
            </span>{" "}
            — in every state
          </div>
          <div style={{ marginTop: 6, fontSize: 23, fontWeight: 500, color: US.textSoft, lineHeight: 1.25 }}>except North Dakota · deadlines differ</div>
        </div>
      </Glass>

      <Mono size={17} color={US.textFaint} style={{ position: "absolute", left: 120, top: 1258, letterSpacing: 2.5, ...riseStyle(cardB, exit, 20) }}>
        EACH STATE SETS THE DETAILS · TERRITORIES: NO VOTE FOR PRESIDENT
      </Mono>
    </>
  );
};
