import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, SE, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark } from "./ui";

const CARD_A = { top: 752, height: 300 } as const;
const CARD_B = { top: 1076, height: 150 } as const;

/**
 * "Who can vote? Swedish citizens from 18, even abroad. Foreign residents vote locally, not for
 * parliament." A big 18+ card (Swedish citizens, ticked "even abroad") and a LOCAL card for foreign
 * residents, under the headline and the aside that voting isn't compulsory.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("who", "vote") + 2);
  const cardA = rise(frame, cue("who", "Swedish") - 6);
  const age = pop(frame, cue("who", "18") - 4);
  const abroad = rise(frame, cue("who", "abroad") - 6);
  const tick = progress(frame, cue("who", "abroad") - 2, cue("who", "abroad") + 10);
  const cardB = rise(frame, cue("who", "Foreign") - 6);
  const notP = progress(frame, cue("who", "not") - 2, cue("who", "parliament") + 6);

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
        Voting isn't compulsory — yet 84% voted in 2022.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={SE.yellow} style={riseStyle(cardA, exit)}>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 40,
            fontFamily: FONT.display,
            fontSize: 196,
            lineHeight: 1,
            color: SE.yellow,
            textShadow: "0 0 34px rgba(254,204,2,0.45)",
            transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, age))})`,
            transformOrigin: "left center",
            opacity: Math.min(1, Math.max(0, age) * 1.5),
          }}
        >
          18+
        </div>
        <div style={{ position: "absolute", left: 470, top: 46, width: 340 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: SE.white, lineHeight: 1.1 }}>Swedish citizens</div>
          <div style={{ marginTop: 8, fontSize: 27, fontWeight: 500, color: SE.textSoft, lineHeight: 1.25 }}>18 or over on election day</div>
        </div>
        <div style={{ position: "absolute", left: 470, top: 176, width: 340, height: 2, background: SE.line, opacity: abroad }} />
        <div style={{ position: "absolute", left: 470, top: 196, width: 340, ...riseStyle(abroad, 0, 20) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 36, fontWeight: 800, color: SE.yellow }}>
            <Mark ok size={34} p={tick} color={SE.yellow} />
            even abroad
          </div>
          <div style={{ marginTop: 6, fontSize: 24, fontWeight: 500, color: SE.textSoft }}>re-register every 10 years</div>
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={SE.white} style={riseStyle(cardB, exit)}>
        <div style={{ position: "absolute", left: 40, top: 40, fontFamily: FONT.display, fontSize: 66, lineHeight: 1, color: SE.white, textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
          LOCAL
        </div>
        <div style={{ position: "absolute", left: 330, top: 28, width: 480 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: SE.white }}>Foreign residents</div>
          <div style={{ marginTop: 6, fontSize: 25, fontWeight: 500, color: SE.textSoft, lineHeight: 1.25 }}>
            region & municipality votes —{" "}
            <span style={{ position: "relative", color: notP > 0.3 ? SE.yellow : SE.textSoft, fontWeight: 800 }}>
              not parliament
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -4,
                  height: 3,
                  width: `${notP * 100}%`,
                  background: SE.yellow,
                  borderRadius: 2,
                }}
              />
            </span>
          </div>
        </div>
      </Glass>
    </>
  );
};
