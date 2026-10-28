import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, SI, VOTERS, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono } from "./ui";

const CARD_A = { top: 676, height: 250 } as const;
const CARD_B = { top: 944, height: 122 } as const;
const CARD_C = { top: 1084, height: 160 } as const;

/**
 * "Who can vote? Citizens aged 18, also by post from abroad. And Italian and Hungarian minority
 * voters get a second vote." A big 18+ card (Slovenian citizens, ticked "on the register
 * automatically"), an ABROAD card (by post, or at an embassy) underlined on "post", and a red-rimmed
 * card where a second ballot slides in next to the first on "second": one vote for a party, one
 * for their own community's MP.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("who", "vote") + 2);
  const cardA = rise(frame, cue("who", "Citizens") - 6);
  const age = pop(frame, cue("who", "18") - 4);
  const auto = rise(frame, cue("who", "18") + 4);
  const tick = progress(frame, cue("who", "18") + 6, cue("who", "18") + 16);
  const cardB = rise(frame, cue("who", "also") - 4);
  const post = progress(frame, cue("who", "post") - 2, cue("who", "abroad", "end"));
  const cardC = rise(frame, cue("who", "Italian") - 6);
  const second = pop(frame, cue("who", "second") - 3);

  const ballot = (label: string, sub: string, p: number, red?: boolean) => (
    <div
      style={{
        width: 150,
        height: 104,
        borderRadius: 10,
        background: SI.cream,
        border: red ? `4px solid ${SI.red}` : "2px solid #D9D2C4",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(1, Math.max(0, p) * 1.5),
        transform: `scale(${0.6 + 0.4 * p}) rotate(${red ? 4 : -3}deg)`,
        boxShadow: "0 12px 24px rgba(0,10,30,0.35)",
      }}
    >
      <div style={{ fontFamily: FONT.display, fontSize: 30, lineHeight: 1, color: red ? SI.red : SI.ink }}>{label}</div>
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontWeight: 700, fontSize: 14, letterSpacing: 1.5, color: SI.inkSoft }}>{sub}</div>
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
        Voting isn't compulsory — {VOTERS.turnout} voted in 2026.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={SI.white} style={riseStyle(cardA, exit)}>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 40,
            fontFamily: FONT.display,
            fontSize: 172,
            lineHeight: 1,
            color: SI.white,
            textShadow: "0 0 34px rgba(255,255,255,0.4)",
            transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, age))})`,
            transformOrigin: "left center",
            opacity: Math.min(1, Math.max(0, age) * 1.5),
          }}
        >
          18+
        </div>
        <div style={{ position: "absolute", left: 440, top: 36, width: 370 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: SI.white, lineHeight: 1.1 }}>Slovenian citizens</div>
          <div style={{ marginTop: 8, fontSize: 26, fontWeight: 500, color: SI.textSoft, lineHeight: 1.25 }}>18 by election day</div>
        </div>
        <div style={{ position: "absolute", left: 440, top: 152, width: 360, height: 2, background: SI.line, opacity: auto }} />
        <div style={{ position: "absolute", left: 440, top: 168, width: 380, ...riseStyle(auto, 0, 20) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 800, color: SI.white, whiteSpace: "nowrap" }}>
            <Mark ok size={28} p={tick} color={SI.white} />
            no sign-up needed
          </div>
          <div style={{ marginTop: 4, fontSize: 23, fontWeight: 500, color: SI.textSoft }}>everyone is on the register</div>
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={SI.white} style={riseStyle(cardB, exit)}>
        <div style={{ position: "absolute", left: 40, top: 36, fontFamily: FONT.display, fontSize: 50, lineHeight: 1, color: SI.white, textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
          ABROAD
        </div>
        <div style={{ position: "absolute", left: 318, top: 22, width: 500 }}>
          <div style={{ position: "relative", display: "inline-block", fontSize: 30, fontWeight: 800, color: SI.white, whiteSpace: "nowrap" }}>
            Vote by post
            <span style={{ position: "absolute", left: 0, bottom: -4, height: 3, width: `${post * 100}%`, background: SI.red, borderRadius: 2 }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 24, fontWeight: 500, color: SI.textSoft }}>or at an embassy · {VOTERS.abroad} on the list</div>
        </div>
      </Glass>

      <Glass top={CARD_C.top} height={CARD_C.height} tick={SI.red} style={{ ...riseStyle(cardC, exit), border: `2px solid ${SI.red}` }}>
        <div style={{ position: "absolute", left: 40, top: 26, width: 430 }}>
          <Mono size={18} color={SI.textSoft} style={{ letterSpacing: 2.5 }}>
            ITALIAN & HUNGARIAN
          </Mono>
          <div style={{ marginTop: 8, fontFamily: FONT.display, fontSize: 46, lineHeight: 1, color: SI.white }}>TWO VOTES</div>
          <div style={{ marginTop: 10, fontSize: 23, fontWeight: 500, color: SI.textSoft, whiteSpace: "nowrap" }}>a party + their own community's MP</div>
        </div>
        <div style={{ position: "absolute", right: 34, top: 28, display: "flex", gap: 14 }}>
          {ballot("1", "PARTY", cardC)}
          {ballot("2", "OWN MP", second, true)}
        </div>
      </Glass>
    </>
  );
};
