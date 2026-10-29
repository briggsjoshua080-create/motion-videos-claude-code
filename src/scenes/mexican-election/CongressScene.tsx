import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CHAMBER, FONT, MX, SENATE, STATES, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const DEPUTY_SEATS = hemicycleSeats(CHAMBER, 8, 52, 118);
const SENATE_SEATS = hemicycleSeats(SENATE, 5, 56, 114);
const CARD_A = { top: 680, height: 270 } as const;
const CARD_B = { top: 970, height: 270 } as const;

/**
 * "That's the Chamber of Deputies: it makes laws and sets the budget. The 128-member Senate must
 * pass every law too." Two glass cards, one per chamber, each with its own little dot
 * half-circle sweeping in: the Chamber (500, pills MAKES LAWS and SETS THE BUDGET on their
 * words) and the Senate (128 = 3 per state + 32 from party lists), with a red MUST PASS EVERY LAW
 * TOO chip on "every".
 */
export const CongressScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, 10);
  const cardA = rise(frame, cue("congress", "Chamber") - 8);
  const buildA = progress(frame, cue("congress", "Chamber") - 6, cue("congress", "Deputies") + 10, Easing.inOut(Easing.cubic));
  const jobs = [cue("congress", "makes"), cue("congress", "sets")].map((t) => pop(frame, t - 4));
  const cardB = rise(frame, cue("congress", "128-member") - 8);
  const buildB = progress(frame, cue("congress", "128-member") - 4, cue("congress", "Senate") + 6, Easing.inOut(Easing.cubic));
  const every = pop(frame, cue("congress", "every") - 3);

  const chip = (text: string, bg: string, color: string, p: number) => (
    <div
      style={{
        padding: "10px 18px",
        borderRadius: 999,
        background: bg,
        border: `2px solid ${MX.white}`,
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
        Together they make the Congress.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={MX.white} style={riseStyle(cardA, exit, 40)}>
        <Mono size={18} color={MX.textSoft} style={{ position: "absolute", left: 36, top: 30, letterSpacing: 2.5 }}>
          LOWER HOUSE · 3 YEARS
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 62, fontFamily: FONT.display, fontSize: 44, lineHeight: 1.02, color: MX.white }}>
          CHAMBER OF
          <br />
          DEPUTIES
        </div>
        <div style={{ position: "absolute", left: 36, top: 176, display: "flex", gap: 12 }}>
          {chip("MAKES LAWS", MX.white, MX.green, jobs[0])}
          {chip("SETS THE BUDGET", MX.white, MX.green, jobs[1])}
        </div>
        <Hemicycle seats={DEPUTY_SEATS} cx={690} cy={176} dot={2.9} fill={() => MX.white} visible={(i) => buildA * (CHAMBER + 1) - i} />
        <div style={{ position: "absolute", left: 590, width: 200, top: 146, textAlign: "center", fontFamily: FONT.display, fontSize: 28, color: MX.white, opacity: buildA > 0 ? 1 : 0 }}>
          {Math.round(CHAMBER * buildA)}
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={MX.red} style={riseStyle(cardB, exit, 40)}>
        <Mono size={18} color={MX.textSoft} style={{ position: "absolute", left: 36, top: 30, letterSpacing: 2.5 }}>
          UPPER HOUSE · 6 YEARS
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 62, fontFamily: FONT.display, fontSize: 56, lineHeight: 1, color: MX.white }}>SENATE</div>
        <div style={{ position: "absolute", left: 36, top: 128, fontSize: 23, fontWeight: 500, color: MX.textSoft, lineHeight: 1.25, width: 460 }}>
          3 per state ({STATES}) + 32 from
          <br />
          national party lists
        </div>
        <div style={{ position: "absolute", left: 36, top: 200 }}>{chip("MUST PASS EVERY LAW TOO", MX.red, MX.white, every)}</div>
        <Hemicycle seats={SENATE_SEATS} cx={690} cy={176} dot={5.2} fill={(i) => (i < SENATE - 32 ? MX.white : MX.red)} visible={(i) => buildB * (SENATE + 1) - i} />
        <div style={{ position: "absolute", left: 590, width: 200, top: 146, textAlign: "center", fontFamily: FONT.display, fontSize: 28, color: MX.white, opacity: buildB > 0 ? 1 : 0 }}>
          {Math.round(SENATE * buildB)}
        </div>
      </Glass>
    </>
  );
};
