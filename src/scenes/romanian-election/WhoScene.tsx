import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, RO, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark } from "./ui";

const CARD_A = { top: 752, height: 300 } as const;
const CARD_B = { top: 1076, height: 160 } as const;

/**
 * "Who can vote? Romanians from 18 with an ID card, even abroad or by post." A big 18+ card
 * (Romanian citizens, ticked "an ID card is enough") and an ABROAD card (any polling station
 * abroad, or by post after signing up), under the headline and the aside that voting isn't
 * compulsory.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("who", "vote") + 2);
  const cardA = rise(frame, cue("who", "Romanians") - 6);
  const age = pop(frame, cue("who", "18") - 4);
  const id = rise(frame, cue("who", "ID") - 6);
  const tick = progress(frame, cue("who", "ID") - 2, cue("who", "card") + 8);
  const cardB = rise(frame, cue("who", "abroad") - 6);
  const post = progress(frame, cue("who", "post") - 4, cue("who", "post") + 8);

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
        Voting isn't compulsory — 52.5% voted in 2024.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={RO.yellow} style={riseStyle(cardA, exit)}>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 40,
            fontFamily: FONT.display,
            fontSize: 196,
            lineHeight: 1,
            color: RO.yellow,
            textShadow: "0 0 34px rgba(252,209,22,0.45)",
            transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, age))})`,
            transformOrigin: "left center",
            opacity: Math.min(1, Math.max(0, age) * 1.5),
          }}
        >
          18+
        </div>
        <div style={{ position: "absolute", left: 470, top: 46, width: 340 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: RO.white, lineHeight: 1.1 }}>Romanian citizens</div>
          <div style={{ marginTop: 8, fontSize: 27, fontWeight: 500, color: RO.textSoft, lineHeight: 1.25 }}>18 or over on election day</div>
        </div>
        <div style={{ position: "absolute", left: 470, top: 176, width: 340, height: 2, background: RO.line, opacity: id }} />
        <div style={{ position: "absolute", left: 470, top: 196, width: 360, ...riseStyle(id, 0, 20) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 29, fontWeight: 800, color: RO.yellow, whiteSpace: "nowrap" }}>
            <Mark ok size={28} p={tick} color={RO.yellow} />
            an ID card is enough
          </div>
          <div style={{ marginTop: 6, fontSize: 24, fontWeight: 500, color: RO.textSoft }}>no sign-up needed at home</div>
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={RO.red} style={riseStyle(cardB, exit)}>
        <div style={{ position: "absolute", left: 40, top: 44, fontFamily: FONT.display, fontSize: 52, lineHeight: 1, color: RO.white, textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
          ABROAD
        </div>
        <div style={{ position: "absolute", left: 318, top: 32, width: 490 }}>
          <div style={{ fontSize: 31, fontWeight: 800, color: RO.white, whiteSpace: "nowrap" }}>Any polling station abroad</div>
          <div style={{ marginTop: 8, fontSize: 25, fontWeight: 500, color: RO.textSoft, lineHeight: 1.25 }}>
            <span style={{ position: "relative", color: post > 0.3 ? RO.yellow : RO.textSoft, fontWeight: 800 }}>
              or by post
              <span style={{ position: "absolute", left: 0, bottom: -4, height: 3, width: `${post * 100}%`, background: RO.yellow, borderRadius: 2 }} />
            </span>{" "}
            — sign up for it first
          </div>
        </div>
      </Glass>
    </>
  );
};
