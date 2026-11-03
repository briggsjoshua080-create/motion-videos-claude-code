import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, RU, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono } from "./ui";

const CARD_A = { top: 676, height: 200 } as const;
const ROW = { top: 894, height: 166, w: 411 } as const;
const CARD_D = { top: 1078, height: 166 } as const;

/**
 * "Who can vote? Every citizen from 18, also from abroad. Not prisoners, and voting is optional."
 * A FROM 18 card (18 pops on its word), an ABROAD card (embassies and consulates) on "abroad", a
 * NOT PRISONERS card with a red cross on "prisoners", and an OPTIONAL card on "optional".
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("who", "vote") + 2);
  const cardA = rise(frame, cue("who", "Every") - 6);
  const eighteen = pop(frame, cue("who", "18") - 3);
  const cardB = rise(frame, cue("who", "also") - 4);
  const abroad = pop(frame, cue("who", "abroad") - 3);
  const cardC = rise(frame, cue("who", "Not") - 4);
  const cross = progress(frame, cue("who", "prisoners") - 2, cue("who", "prisoners", "end") + 4);
  const cardD = rise(frame, cue("who", "voting") - 6);
  const under = progress(frame, cue("who", "optional") - 2, cue("who", "optional", "end") + 4);

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
        No sign-up: your home address puts you on the list.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={RU.white} style={riseStyle(cardA, exit)}>
        <Mono size={19} color={RU.textSoft} style={{ position: "absolute", left: 40, top: 30, letterSpacing: 3 }}>
          EVERY CITIZEN FROM
        </Mono>
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 66,
            fontFamily: FONT.display,
            fontSize: 116,
            lineHeight: 1,
            color: RU.white,
            textShadow: "0 0 34px rgba(255,255,255,0.35)",
            opacity: Math.min(1, Math.max(0, eighteen) * 1.5),
            transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, eighteen))})`,
            transformOrigin: "left center",
          }}
        >
          18
        </div>
        <div style={{ position: "absolute", left: 250, top: 72, width: 560, opacity: Math.min(1, Math.max(0, eighteen) * 1.5) }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: RU.white, lineHeight: 1.1 }}>years old on election day</div>
          <div style={{ marginTop: 8, fontSize: 23, fontWeight: 500, color: RU.textSoft, lineHeight: 1.25 }}>Foreigners: only some local votes, by treaty.</div>
        </div>
      </Glass>

      <Glass top={ROW.top} width={ROW.w} height={ROW.height} tick={RU.white} style={riseStyle(cardB, exit)}>
        <div style={{ position: "absolute", left: 32, top: 34, fontFamily: FONT.display, fontSize: 44, lineHeight: 1, color: RU.white, transform: `scale(${0.8 + 0.2 * Math.min(1, Math.max(0, abroad))})`, transformOrigin: "left center" }}>
          ABROAD
        </div>
        <div style={{ position: "absolute", left: 32, top: 92, width: 350, fontSize: 23, fontWeight: 500, color: RU.textSoft, lineHeight: 1.25 }}>
          At embassies and consulates
        </div>
      </Glass>

      <Glass left={120 + ROW.w + 18} top={ROW.top} width={ROW.w} height={ROW.height} tick={RU.red} style={{ ...riseStyle(cardC, exit), border: `2px solid ${RU.red}` }}>
        <div style={{ position: "absolute", left: 32, top: 34, fontFamily: FONT.display, fontSize: 40, lineHeight: 1, color: RU.white }}>PRISONERS</div>
        <div style={{ position: "absolute", left: 32, top: 92, width: 260, fontSize: 23, fontWeight: 500, color: RU.textSoft, lineHeight: 1.25 }}>
          serving a sentence can't vote
        </div>
        <div style={{ position: "absolute", right: 26, top: 74 }}>
          <Mark ok={false} size={68} p={cross} color={RU.red} width={11} />
        </div>
      </Glass>

      <Glass top={CARD_D.top} height={CARD_D.height} tick={RU.white} style={riseStyle(cardD, exit)}>
        <div style={{ position: "absolute", left: 40, top: 48, fontFamily: FONT.display, fontSize: 50, lineHeight: 1, color: RU.white, textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
          OPTIONAL
        </div>
        <div style={{ position: "absolute", left: 370, top: 40, width: 440 }}>
          <div style={{ position: "relative", display: "inline-block", fontSize: 30, fontWeight: 800, color: RU.white, whiteSpace: "nowrap" }}>
            No fine for staying home
            <span style={{ position: "absolute", left: 0, bottom: -4, height: 4, width: `${under * 100}%`, background: RU.red, borderRadius: 2 }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 24, fontWeight: 500, color: RU.textSoft, whiteSpace: "nowrap" }}>Voting runs over up to 3 days</div>
        </div>
      </Glass>
    </>
  );
};
