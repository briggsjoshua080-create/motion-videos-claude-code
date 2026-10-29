import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ABROAD, FONT, MX, TURNOUT, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono } from "./ui";

const CARD_A = { top: 676, height: 250 } as const;
const CARD_B = { top: 944, height: 122 } as const;
const CARD_C = { top: 1084, height: 160 } as const;

/** A generic photo voter card: photo box, lines for the name and a chip (no real design copied). */
const VoterCard: React.FC<{ p: number }> = ({ p }) => (
  <div
    style={{
      width: 176,
      height: 112,
      borderRadius: 12,
      background: MX.cream,
      border: `3px solid ${MX.white}`,
      boxSizing: "border-box",
      position: "relative",
      opacity: Math.min(1, Math.max(0, p) * 1.5),
      transform: `scale(${0.6 + 0.4 * p}) rotate(-4deg)`,
      boxShadow: "0 12px 24px rgba(0,20,12,0.4)",
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 18, background: MX.green }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 18, height: 4, background: MX.red }} />
    <div style={{ position: "absolute", left: 12, top: 32, width: 50, height: 64, borderRadius: 6, background: "#CFC7B8" }}>
      <svg width={50} height={64} viewBox="0 0 50 64">
        <circle cx={25} cy={24} r={11} fill="#9E9584" />
        <path d="M6 64 C6 46 14 40 25 40 C36 40 44 46 44 64 Z" fill="#9E9584" />
      </svg>
    </div>
    {[36, 50, 64, 78].map((y, i) => (
      <div key={y} style={{ position: "absolute", left: 74, top: y, width: i === 0 ? 86 : 70 - i * 8, height: 7, borderRadius: 4, background: i === 0 ? MX.ink : "#B9B1A3" }} />
    ))}
  </div>
);

/**
 * "Who can vote? Citizens aged 18 with a photo voter card, even online from abroad. Voting is a
 * duty, but there's no fine." A big 18+ card (Mexican citizens) with a generic photo voter card
 * that pops in on "photo"; an ABROAD card (online, by post or at a consulate) underlined on
 * "online"; and a red-rimmed card: voting is a duty in the constitution, crossed out "fine" on "no fine".
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("who", "vote") + 2);
  const cardA = rise(frame, cue("who", "Citizens") - 6);
  const age = pop(frame, cue("who", "18") - 4);
  const id = pop(frame, cue("who", "photo") - 4);
  const tick = progress(frame, cue("who", "card") - 2, cue("who", "card") + 8);
  const cardB = rise(frame, cue("who", "even") - 4);
  const online = progress(frame, cue("who", "online") - 2, cue("who", "abroad", "end"));
  const cardC = rise(frame, cue("who", "Voting") - 6);
  const cross = progress(frame, cue("who", "no") - 2, cue("who", "fine") + 8);

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
        Turnout in 2024: {TURNOUT} of registered voters.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={MX.white} style={riseStyle(cardA, exit)}>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 40,
            fontFamily: FONT.display,
            fontSize: 172,
            lineHeight: 1,
            color: MX.white,
            textShadow: "0 0 34px rgba(255,255,255,0.4)",
            transform: `scale(${0.7 + 0.3 * Math.min(1.1, Math.max(0, age))})`,
            transformOrigin: "left center",
            opacity: Math.min(1, Math.max(0, age) * 1.5),
          }}
        >
          18+
        </div>
        <div style={{ position: "absolute", left: 440, top: 30, width: 380 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: MX.white, lineHeight: 1.1 }}>Mexican citizens</div>
          <div style={{ marginTop: 6, fontSize: 25, fontWeight: 500, color: MX.textSoft, lineHeight: 1.25 }}>18 by election day</div>
        </div>
        <div style={{ position: "absolute", left: 436, top: 118 }}>
          <VoterCard p={id} />
        </div>
        <div style={{ position: "absolute", left: 630, top: 132, width: 190, ...riseStyle(id, 0, 16) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 25, fontWeight: 800, color: MX.white, whiteSpace: "nowrap" }}>
            <Mark ok size={24} p={tick} color={MX.white} />
            voter card
          </div>
          <div style={{ marginTop: 4, fontSize: 21, fontWeight: 500, color: MX.textSoft, lineHeight: 1.2 }}>with a photo, free from the INE</div>
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={MX.white} style={riseStyle(cardB, exit)}>
        <div style={{ position: "absolute", left: 40, top: 36, fontFamily: FONT.display, fontSize: 50, lineHeight: 1, color: MX.white, textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
          ABROAD
        </div>
        <div style={{ position: "absolute", left: 318, top: 22, width: 500 }}>
          <div style={{ position: "relative", display: "inline-block", fontSize: 30, fontWeight: 800, color: MX.white, whiteSpace: "nowrap" }}>
            Vote online
            <span style={{ position: "absolute", left: 0, bottom: -4, height: 3, width: `${online * 100}%`, background: MX.red, borderRadius: 2 }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 24, fontWeight: 500, color: MX.textSoft, whiteSpace: "nowrap" }}>by post or at a consulate · {ABROAD.votes} in 2024</div>
        </div>
      </Glass>

      <Glass top={CARD_C.top} height={CARD_C.height} tick={MX.red} style={{ ...riseStyle(cardC, exit), border: `2px solid ${MX.red}` }}>
        <div style={{ position: "absolute", left: 40, top: 26, width: 460 }}>
          <Mono size={18} color={MX.textSoft} style={{ letterSpacing: 2.5 }}>
            THE CONSTITUTION SAYS
          </Mono>
          <div style={{ marginTop: 8, fontFamily: FONT.display, fontSize: 46, lineHeight: 1, color: MX.white }}>A DUTY</div>
          <div style={{ marginTop: 10, fontSize: 23, fontWeight: 500, color: MX.textSoft, whiteSpace: "nowrap" }}>but nobody is punished for skipping it</div>
        </div>
        <div style={{ position: "absolute", right: 44, top: 40, width: 220, height: 80, ...riseStyle(cardC, 0, 10) }}>
          <div style={{ fontFamily: FONT.display, fontSize: 64, lineHeight: "80px", textAlign: "center", color: MX.white, opacity: 1 - 0.5 * cross }}>FINE</div>
          <svg width={220} height={80} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d="M8 66 L212 14" stroke={MX.red} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - cross} opacity={cross > 0.01 ? 1 : 0} />
          </svg>
        </div>
      </Glass>
    </>
  );
};
