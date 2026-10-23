import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CA, FONT, RESULT_2025, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono } from "./ui";

const CARD_A = { top: 752, height: 300 } as const;
const CARD_B = { top: 1076, height: 156 } as const;

/**
 * "Who can vote? Canadian citizens from 18, even abroad, and you can register at the polls."
 * A big 18+ card (Canadian citizens, ticked "even abroad") and a REGISTER card (even at the polls,
 * with ID), under the headline and the aside that voting isn't compulsory.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("who", "vote") + 2);
  const cardA = rise(frame, cue("who", "Canadian") - 6);
  const age = pop(frame, cue("who", "18") - 4);
  const abroad = rise(frame, cue("who", "abroad") - 6);
  const tick = progress(frame, cue("who", "abroad") - 2, cue("who", "abroad") + 10);
  const cardB = rise(frame, cue("who", "register") - 8);
  const reg = pop(frame, cue("who", "register") - 4);
  const pollsP = progress(frame, cue("who", "polls") - 4, cue("who", "polls", "end") + 4);

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
        Voting isn't compulsory — {RESULT_2025.turnout} voted in 2025.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={CA.white} style={riseStyle(cardA, exit)}>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 40,
            fontFamily: FONT.display,
            fontSize: 196,
            lineHeight: 1,
            color: CA.white,
            textShadow: "0 0 34px rgba(255,255,255,0.4)",
            transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, age))})`,
            transformOrigin: "left center",
            opacity: Math.min(1, Math.max(0, age) * 1.5),
          }}
        >
          18+
        </div>
        <div style={{ position: "absolute", left: 470, top: 46, width: 340 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: CA.white, lineHeight: 1.1 }}>Canadian citizens</div>
          <div style={{ marginTop: 8, fontSize: 27, fontWeight: 500, color: CA.textSoft, lineHeight: 1.25 }}>18 or over on election day</div>
        </div>
        <div style={{ position: "absolute", left: 470, top: 176, width: 340, height: 2, background: CA.line, opacity: abroad }} />
        <div style={{ position: "absolute", left: 470, top: 192, width: 350, ...riseStyle(abroad, 0, 20) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 36, fontWeight: 800, color: CA.rose }}>
            <Mark ok size={34} p={tick} color={CA.rose} />
            even abroad
          </div>
          <div style={{ marginTop: 6, fontSize: 24, fontWeight: 500, color: CA.textSoft }}>by special ballot, by mail</div>
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={CA.rose} style={riseStyle(cardB, exit)}>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 52,
            fontFamily: FONT.display,
            fontSize: 50,
            lineHeight: 1,
            color: CA.white,
            textShadow: "0 0 20px rgba(255,255,255,0.3)",
            transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, reg))})`,
            transformOrigin: "left center",
            opacity: Math.min(1, Math.max(0, reg) * 1.5),
          }}
        >
          REGISTER
        </div>
        <div style={{ position: "absolute", left: 350, top: 30, width: 460 }}>
          <div style={{ fontSize: 29, fontWeight: 800, color: CA.white, lineHeight: 1.15 }}>
            even{" "}
            <span style={{ position: "relative", color: pollsP > 0.3 ? CA.rose : CA.white }}>
              at the polls
              <span style={{ position: "absolute", left: 0, bottom: -3, height: 3, width: `${pollsP * 100}%`, background: CA.rose, borderRadius: 2 }} />
            </span>
          </div>
          <div style={{ marginTop: 6, fontSize: 23, fontWeight: 500, color: CA.textSoft, lineHeight: 1.25 }}>bring ID with your name and address</div>
        </div>
      </Glass>

      <Mono size={17} color={CA.textFaint} style={{ position: "absolute", left: 120, top: 1258, letterSpacing: 2.5, ...riseStyle(cardB, exit, 20) }}>
        PERMANENT RESIDENTS CAN'T VOTE · ADVANCE POLLS TOO
      </Mono>
    </>
  );
};
