import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BR, ELECTORATE, FONT, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const CARD_A = { top: 676, height: 220 } as const;
const CARD_B = { top: 914, height: 190 } as const;
const CARD_C = { top: 1122, height: 122 } as const;

/**
 * "Who can vote? Voting is a must from 18 to 70. It's optional at 16 and 17, over 70, and if you
 * can't read. Citizens abroad only vote for president." A yellow-rimmed MUST VOTE card where 18
 * and 70 pop on their words; an OPTIONAL card with three chips (16–17, 70+, CAN'T READ) on their
 * words; and an ABROAD card (president only) underlined on "president".
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("who", "vote") + 2);
  const cardA = rise(frame, cue("who", "Voting") - 6);
  const from = pop(frame, cue("who", "18") - 3);
  const to = pop(frame, cue("who", "70") - 3);
  const cardB = rise(frame, cue("who", "optional") - 6);
  const chips = [pop(frame, cue("who", "16") - 3), pop(frame, cue("who", "over") - 3), pop(frame, cue("who", "read") - 4)];
  const cardC = rise(frame, cue("who", "Citizens") - 6);
  const under = progress(frame, cue("who", "president") - 2, cue("who", "president", "end") + 4);

  const big = (text: string, p: number) => (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT.display,
        fontSize: 120,
        lineHeight: 1,
        color: BR.white,
        textShadow: "0 0 34px rgba(255,255,255,0.4)",
        opacity: Math.min(1, Math.max(0, p) * 1.5),
        transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, p))})`,
      }}
    >
      {text}
    </span>
  );

  const chip = (text: string, sub: string, p: number) => (
    <div
      key={text}
      style={{
        width: 238,
        height: 104,
        borderRadius: 16,
        background: "rgba(255,255,255,0.1)",
        border: `2px solid ${BR.white}`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(1, Math.max(0, p) * 1.5),
        transform: `scale(${0.6 + 0.4 * p})`,
      }}
    >
      <div style={{ fontFamily: FONT.display, fontSize: 36, lineHeight: 1, color: BR.yellow, whiteSpace: "nowrap" }}>{text}</div>
      <div style={{ marginTop: 6, fontSize: 20, fontWeight: 600, color: BR.textSoft, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
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
        Brazilian citizens: {ELECTORATE.total} voters in 2026.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={BR.yellow} style={{ ...riseStyle(cardA, exit), border: `2px solid ${BR.yellow}` }}>
        <Mono size={19} color={BR.textSoft} style={{ position: "absolute", left: 40, top: 30, letterSpacing: 3 }}>
          VOTING IS A MUST
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 70, display: "flex", alignItems: "center", gap: 18 }}>
          {big("18", from)}
          <span style={{ fontFamily: FONT.display, fontSize: 80, color: BR.textSoft, opacity: Math.min(1, Math.max(0, to) * 1.5) }}>–</span>
          {big("70", to)}
        </div>
        <div style={{ position: "absolute", left: 470, top: 74, width: 340, opacity: Math.min(1, Math.max(0, to) * 1.5) }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: BR.white, lineHeight: 1.1 }}>years old</div>
          <div style={{ marginTop: 8, fontSize: 23, fontWeight: 500, color: BR.textSoft, lineHeight: 1.25 }}>Can't make it? Give a reason, or pay the fine.</div>
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={BR.white} style={riseStyle(cardB, exit)}>
        <Mono size={19} color={BR.textSoft} style={{ position: "absolute", left: 40, top: 26, letterSpacing: 3 }}>
          OPTIONAL — NO FINE
        </Mono>
        <div style={{ position: "absolute", left: 40, top: 66, display: "flex", gap: 23 }}>
          {chip("16–17", "first-time voters", chips[0])}
          {chip("70+", "older voters", chips[1])}
          {chip("CAN'T READ", "no penalty", chips[2])}
        </div>
      </Glass>

      <Glass top={CARD_C.top} height={CARD_C.height} tick={BR.white} style={riseStyle(cardC, exit)}>
        <div style={{ position: "absolute", left: 40, top: 36, fontFamily: FONT.display, fontSize: 50, lineHeight: 1, color: BR.white, textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
          ABROAD
        </div>
        <div style={{ position: "absolute", left: 318, top: 22, width: 500 }}>
          <div style={{ position: "relative", display: "inline-block", fontSize: 30, fontWeight: 800, color: BR.white, whiteSpace: "nowrap" }}>
            President only
            <span style={{ position: "absolute", left: 0, bottom: -4, height: 4, width: `${under * 100}%`, background: BR.yellow, borderRadius: 2 }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 24, fontWeight: 500, color: BR.textSoft, whiteSpace: "nowrap" }}>{ELECTORATE.abroad} registered abroad in 2026</div>
        </div>
      </Glass>
    </>
  );
};
