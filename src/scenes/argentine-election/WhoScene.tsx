import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AR, FONT, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const CARD_A = { top: 676, height: 200 } as const;
const CARD_B = { top: 894, height: 200 } as const;
const CARD_C = { top: 1112, height: 132 } as const;

/**
 * "Who can vote? Every citizen from 16, and it's a must from 18 to 70. Citizens abroad can vote
 * too." A FROM 16 card (16 pops on its word; optional at 16–17 and over 70), a gold-rimmed A MUST
 * card where 18 and 70 pop on their words, and an ABROAD card underlined on "too".
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("who", "vote") + 2);
  const cardA = rise(frame, cue("who", "Every") - 6);
  const sixteen = pop(frame, cue("who", "16") - 3);
  const optional = rise(frame, cue("who", "16", "end"));
  const cardB = rise(frame, cue("who", "must") - 6);
  const from = pop(frame, cue("who", "18") - 3);
  const to = pop(frame, cue("who", "70") - 3);
  const cardC = rise(frame, cue("who", "Citizens") - 6);
  const under = progress(frame, cue("who", "too") - 2, cue("who", "too", "end") + 4);

  const big = (text: string, p: number, color: string = AR.white) => (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT.display,
        fontSize: 116,
        lineHeight: 1,
        color,
        textShadow: "0 0 34px rgba(255,255,255,0.35)",
        opacity: Math.min(1, Math.max(0, p) * 1.5),
        transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, p))})`,
      }}
    >
      {text}
    </span>
  );

  return (
    <>
      <Eyebrow style={{ top: 280, ...riseStyle(kicker, exit, 24) }}>02 — WHO CAN VOTE</Eyebrow>
      <Headline size={128} style={{ top: 330, ...riseStyle(head[0], exit, 50) }}>
        WHO CAN
      </Headline>
      <Headline size={128} style={{ top: 330 + 126, ...riseStyle(head[1], exit, 50) }}>
        <Accent>VOTE?</Accent>
      </Headline>
      <Aside size={42} style={{ top: 604, ...riseStyle(aside, exit, 24) }}>
        No sign-up: your ID card puts you on the roll.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={AR.white} style={riseStyle(cardA, exit)}>
        <Mono size={19} color={AR.textSoft} style={{ position: "absolute", left: 40, top: 30, letterSpacing: 3 }}>
          EVERY CITIZEN FROM
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 66 }}>{big("16", sixteen, AR.sun)}</div>
        <div style={{ position: "absolute", left: 250, top: 70, width: 560, ...riseStyle(optional, 0, 14) }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: AR.white, lineHeight: 1.1 }}>Optional at 16–17 and over 70</div>
          <div style={{ marginTop: 8, fontSize: 23, fontWeight: 500, color: AR.textSoft, lineHeight: 1.25 }}>No fine for them. Foreigners: some local votes only.</div>
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={AR.sun} style={{ ...riseStyle(cardB, exit), border: `2px solid ${AR.sun}` }}>
        <Mono size={19} color={AR.textSoft} style={{ position: "absolute", left: 40, top: 30, letterSpacing: 3 }}>
          VOTING IS A MUST
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 66, display: "flex", alignItems: "center", gap: 18 }}>
          {big("18", from)}
          <span style={{ fontFamily: FONT.display, fontSize: 80, color: AR.textSoft, opacity: Math.min(1, Math.max(0, to) * 1.5) }}>–</span>
          {big("70", to)}
        </div>
        <div style={{ position: "absolute", left: 470, top: 70, width: 340, opacity: Math.min(1, Math.max(0, to) * 1.5) }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: AR.white, lineHeight: 1.1 }}>years old</div>
          <div style={{ marginTop: 8, fontSize: 23, fontWeight: 500, color: AR.textSoft, lineHeight: 1.25 }}>Skip it with no excuse: a small fine.</div>
        </div>
      </Glass>

      <Glass top={CARD_C.top} height={CARD_C.height} tick={AR.white} style={riseStyle(cardC, exit)}>
        <div style={{ position: "absolute", left: 40, top: 40, fontFamily: FONT.display, fontSize: 50, lineHeight: 1, color: AR.white, textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
          ABROAD
        </div>
        <div style={{ position: "absolute", left: 318, top: 26, width: 500 }}>
          <div style={{ position: "relative", display: "inline-block", fontSize: 30, fontWeight: 800, color: AR.white, whiteSpace: "nowrap" }}>
            Can vote too — optional
            <span style={{ position: "absolute", left: 0, bottom: -4, height: 4, width: `${under * 100}%`, background: AR.sun, borderRadius: 2 }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 24, fontWeight: 500, color: AR.textSoft, whiteSpace: "nowrap" }}>with a foreign address on their ID</div>
        </div>
      </Glass>
    </>
  );
};
