import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AR, CHAMBER, DISTRICTS, FONT, SENATE, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const DEPUTY_SEATS = hemicycleSeats(CHAMBER, 7, 54, 118);
const SENATE_SEATS = hemicycleSeats(SENATE, 4, 60, 114);
const CARD_A = { top: 680, height: 260 } as const;
const CARD_B = { top: 958, height: 290 } as const;

/**
 * "That's the 257-member Chamber of Deputies, which makes the laws. The Senate must pass them too:
 * three per province, one for the runner-up." Two glass cards, each with its own dot half-circle
 * sweeping in: the Chamber (257, a MAKES THE LAWS chip on "makes") and the Senate (72 = 3 for each
 * of the 24 districts; a MUST PASS THEM TOO chip on "pass"), where three seats per province pop in on
 * "three" — two for the winning list, one (gold) for the runner-up on "runner-up".
 */
export const CongressScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, 10);
  const cardA = rise(frame, cue("congress", "257-member") - 8);
  const buildA = progress(frame, cue("congress", "257-member") - 6, cue("congress", "Deputies") + 10, Easing.inOut(Easing.cubic));
  const makes = pop(frame, cue("congress", "makes") - 4);
  const cardB = rise(frame, cue("congress", "Senate") - 8);
  const buildB = progress(frame, cue("congress", "Senate") - 4, cue("congress", "too") + 6, Easing.inOut(Easing.cubic));
  const pass = pop(frame, cue("congress", "pass") - 3);
  const trio = [pop(frame, cue("congress", "three") - 3), pop(frame, cue("congress", "three") + 1), pop(frame, cue("congress", "runner-up") - 3)];

  const chip = (text: string, bg: string, color: string, p: number) => (
    <div
      style={{
        padding: "10px 18px",
        borderRadius: 999,
        background: bg,
        border: `2px solid ${AR.white}`,
        fontFamily: FONT.mono,
        fontWeight: 700,
        fontSize: 19,
        letterSpacing: 2,
        color,
        whiteSpace: "nowrap",
        opacity: Math.min(1, Math.max(0, p) * 1.5),
        transform: `scale(${0.6 + 0.4 * p})`,
        transformOrigin: "left center",
      }}
    >
      {text}
    </div>
  );

  const seat = (p: number, fill: string, label: string) => (
    <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: Math.min(1, Math.max(0, p) * 1.5), transform: `scale(${0.5 + 0.5 * p})` }}>
      <div style={{ width: 40, height: 40, borderRadius: 20, background: fill, border: `3px solid ${AR.white}`, boxSizing: "border-box", boxShadow: fill === AR.sun ? "0 0 20px rgba(246,180,14,0.7)" : "0 0 14px rgba(255,255,255,0.3)" }} />
      <Mono size={13} color={AR.textSoft} style={{ letterSpacing: 1 }}>
        {label}
      </Mono>
    </div>
  );

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>05 — THE CONGRESS</Eyebrow>
      <Headline size={124} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        TWO
      </Headline>
      <Headline size={124} style={{ top: 352 + 122, ...riseStyle(head[1], exit, 50) }}>
        <Accent>CHAMBERS</Accent>
      </Headline>
      <Aside size={44} style={{ top: 628, ...riseStyle(aside, exit, 24) }}>
        Together they make the National Congress.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={AR.white} style={riseStyle(cardA, exit, 40)}>
        <Mono size={18} color={AR.textSoft} style={{ position: "absolute", left: 36, top: 30, letterSpacing: 2.5 }}>
          LOWER HOUSE · 4 YEARS
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 62, fontFamily: FONT.display, fontSize: 44, lineHeight: 1.02, color: AR.white }}>
          CHAMBER OF
          <br />
          DEPUTIES
        </div>
        <div style={{ position: "absolute", left: 36, top: 166, fontSize: 22, fontWeight: 500, color: AR.textSoft, opacity: Math.min(1, buildA * 2) }}>
          Seats by population
        </div>
        <div style={{ position: "absolute", left: 36, top: 196 }}>{chip("MAKES THE LAWS", AR.white, AR.blueDeep, makes)}</div>
        <Hemicycle seats={DEPUTY_SEATS} cx={690} cy={170} dot={3.6} fill={() => AR.white} visible={(i) => buildA * (CHAMBER + 1) - i} />
        <div style={{ position: "absolute", left: 590, width: 200, top: 140, textAlign: "center", fontFamily: FONT.display, fontSize: 28, color: AR.white, opacity: buildA > 0 ? 1 : 0 }}>
          {Math.round(CHAMBER * buildA)}
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={AR.sun} style={riseStyle(cardB, exit, 40)}>
        <Mono size={18} color={AR.textSoft} style={{ position: "absolute", left: 36, top: 30, letterSpacing: 2.5 }}>
          UPPER HOUSE · 6 YEARS · {DISTRICTS} × 3
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 62, fontFamily: FONT.display, fontSize: 56, lineHeight: 1, color: AR.white }}>SENATE</div>
        <div style={{ position: "absolute", left: 36, top: 128 }}>{chip("MUST PASS THEM TOO", AR.sun, AR.navy, pass)}</div>
        <div style={{ position: "absolute", left: 36, top: 192, display: "flex", alignItems: "flex-start", gap: 14 }}>
          {seat(trio[0], AR.white, "WINNER")}
          {seat(trio[1], AR.white, "WINNER")}
          {seat(trio[2], AR.sun, "RUNNER-UP")}
          <div style={{ marginLeft: 6, marginTop: 6, fontSize: 22, fontWeight: 600, color: AR.white, opacity: Math.min(1, Math.max(0, trio[2]) * 1.5), whiteSpace: "nowrap" }}>per province</div>
        </div>
        <Hemicycle seats={SENATE_SEATS} cx={690} cy={180} dot={6.2} fill={(i) => (i % 3 === 2 ? AR.sun : AR.white)} visible={(i) => buildB * (SENATE + 1) - i} />
        <div style={{ position: "absolute", left: 590, width: 200, top: 150, textAlign: "center", fontFamily: FONT.display, fontSize: 28, color: AR.white, opacity: buildB > 0 ? 1 : 0 }}>
          {Math.round(SENATE * buildB)}
        </div>
      </Glass>
    </>
  );
};
