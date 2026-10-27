import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, RS, VOTERS, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono } from "./ui";

const CARD_A = { top: 746, height: 312 } as const;
const CARD_B = { top: 1076, height: 146 } as const;

/**
 * "Who can vote? Citizens aged 18 who live in Serbia. Living abroad? Sign up first." A big 18+
 * card (Serbian citizens, "with a home in Serbia" underlined on "live", ticked "on the register
 * automatically") and an ABROAD card (sign up first, vote at an embassy), under the headline and
 * the aside that voting isn't compulsory. A footnote: how many signed up abroad in 2026.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("who", "vote") + 2);
  const cardA = rise(frame, cue("who", "Citizens") - 6);
  const age = pop(frame, cue("who", "18") - 4);
  const home = progress(frame, cue("who", "live") - 4, cue("who", "Serbia", "end"));
  const auto = rise(frame, cue("who", "Serbia") - 2);
  const tick = progress(frame, cue("who", "Serbia"), cue("who", "Serbia") + 10);
  const cardB = rise(frame, cue("who", "Living") - 6);
  const sign = progress(frame, cue("who", "Sign") - 2, cue("who", "first", "end"));
  const note = rise(frame, cue("who", "first") + 2);

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
        Voting isn't compulsory — {VOTERS.turnout} voted in 2026.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={RS.white} style={riseStyle(cardA, exit)}>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 52,
            fontFamily: FONT.display,
            fontSize: 196,
            lineHeight: 1,
            color: RS.white,
            textShadow: "0 0 34px rgba(255,255,255,0.4)",
            transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, age))})`,
            transformOrigin: "left center",
            opacity: Math.min(1, Math.max(0, age) * 1.5),
          }}
        >
          18+
        </div>
        <div style={{ position: "absolute", left: 470, top: 40, width: 340 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: RS.white, lineHeight: 1.1 }}>Serbian citizens</div>
          <div style={{ marginTop: 8, fontSize: 26, fontWeight: 500, color: RS.textSoft, lineHeight: 1.25 }}>
            <span style={{ position: "relative", color: home > 0.3 ? RS.white : RS.textSoft, fontWeight: home > 0.3 ? 700 : 500 }}>
              with a home in Serbia
              <span style={{ position: "absolute", left: 0, bottom: -4, height: 3, width: `${home * 100}%`, background: RS.white, borderRadius: 2 }} />
            </span>
            {" "}(18 by election day)
          </div>
        </div>
        <div style={{ position: "absolute", left: 470, top: 214, width: 340, height: 2, background: RS.line, opacity: auto }} />
        <div style={{ position: "absolute", left: 470, top: 228, width: 360, ...riseStyle(auto, 0, 20) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 800, color: RS.white, whiteSpace: "nowrap" }}>
            <Mark ok size={28} p={tick} color={RS.white} />
            no sign-up needed
          </div>
          <div style={{ marginTop: 6, fontSize: 23, fontWeight: 500, color: RS.textSoft }}>everyone is on the register</div>
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={RS.red} style={riseStyle(cardB, exit)}>
        <div style={{ position: "absolute", left: 40, top: 44, fontFamily: FONT.display, fontSize: 52, lineHeight: 1, color: RS.white, textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
          ABROAD
        </div>
        <div style={{ position: "absolute", left: 318, top: 30, width: 490 }}>
          <div style={{ position: "relative", display: "inline-block", fontSize: 30, fontWeight: 800, color: RS.white, whiteSpace: "nowrap" }}>
            Sign up first
            <span style={{ position: "absolute", left: 0, bottom: -4, height: 3, width: `${sign * 100}%`, background: RS.red, borderRadius: 2 }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 25, fontWeight: 500, color: RS.textSoft }}>then vote at an embassy or consulate</div>
        </div>
      </Glass>

      <Mono size={19} color={RS.textSoft} style={{ position: "absolute", left: 120, top: 1240, letterSpacing: 2.5, ...riseStyle(note, exit, 20) }}>
        {VOTERS.abroad} SIGNED UP ABROAD IN 2026
      </Mono>
    </>
  );
};
