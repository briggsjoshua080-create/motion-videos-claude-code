import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BR, CHAMBER, FONT, SENATE, STATE_MAX, STATE_MIN, UNITS, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const DEPUTY_SEATS = hemicycleSeats(CHAMBER, 8, 52, 118);
const SENATE_SEATS = hemicycleSeats(SENATE, 5, 56, 114);
const CARD_A = { top: 680, height: 270 } as const;
const CARD_B = { top: 970, height: 270 } as const;

/**
 * "That's the 513-member Chamber of Deputies. It makes the laws. The Senate, three per state, must
 * approve them too." Two glass cards, one per chamber, each with its own little dot half-circle
 * sweeping in: the Chamber (513, 8 to 70 per state, a MAKES THE LAWS chip on "makes") and the
 * Senate (81 = 3 for each of the 26 states and the Federal District, eight-year terms), with a
 * yellow MUST APPROVE THEM TOO chip on "approve".
 */
export const CongressScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, 10);
  const cardA = rise(frame, cue("congress", "513-member") - 8);
  const buildA = progress(frame, cue("congress", "513-member") - 6, cue("congress", "Deputies") + 10, Easing.inOut(Easing.cubic));
  const makes = pop(frame, cue("congress", "makes") - 4);
  const cardB = rise(frame, cue("congress", "Senate") - 8);
  const buildB = progress(frame, cue("congress", "Senate") - 4, cue("congress", "state") + 6, Easing.inOut(Easing.cubic));
  const three = pop(frame, cue("congress", "three") - 3);
  const approve = pop(frame, cue("congress", "approve") - 3);

  const chip = (text: string, bg: string, color: string, p: number) => (
    <div
      style={{
        padding: "10px 18px",
        borderRadius: 999,
        background: bg,
        border: `2px solid ${BR.white}`,
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
        Together they make the National Congress.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={BR.white} style={riseStyle(cardA, exit, 40)}>
        <Mono size={18} color={BR.textSoft} style={{ position: "absolute", left: 36, top: 30, letterSpacing: 2.5 }}>
          LOWER HOUSE · 4 YEARS
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 62, fontFamily: FONT.display, fontSize: 44, lineHeight: 1.02, color: BR.white }}>
          CHAMBER OF
          <br />
          DEPUTIES
        </div>
        <div style={{ position: "absolute", left: 36, top: 168, fontSize: 22, fontWeight: 500, color: BR.textSoft, opacity: Math.min(1, buildA * 2) }}>
          {STATE_MIN} to {STATE_MAX} per state, by population
        </div>
        <div style={{ position: "absolute", left: 36, top: 204 }}>{chip("MAKES THE LAWS", BR.white, BR.greenDeep, makes)}</div>
        <Hemicycle seats={DEPUTY_SEATS} cx={690} cy={176} dot={2.9} fill={() => BR.white} visible={(i) => buildA * (CHAMBER + 1) - i} />
        <div style={{ position: "absolute", left: 590, width: 200, top: 146, textAlign: "center", fontFamily: FONT.display, fontSize: 28, color: BR.white, opacity: buildA > 0 ? 1 : 0 }}>
          {Math.round(CHAMBER * buildA)}
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={BR.yellow} style={riseStyle(cardB, exit, 40)}>
        <Mono size={18} color={BR.textSoft} style={{ position: "absolute", left: 36, top: 30, letterSpacing: 2.5 }}>
          UPPER HOUSE · 8 YEARS
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 62, fontFamily: FONT.display, fontSize: 56, lineHeight: 1, color: BR.white }}>SENATE</div>
        <div style={{ position: "absolute", left: 36, top: 128, fontSize: 23, fontWeight: 500, color: BR.textSoft, lineHeight: 1.25, width: 470, opacity: Math.min(1, Math.max(0, three) * 1.5) }}>
          <span style={{ color: BR.yellow, fontWeight: 800 }}>3 per state</span> — every state the
          <br />
          same, big or small ({UNITS})
        </div>
        <div style={{ position: "absolute", left: 36, top: 204 }}>{chip("MUST APPROVE THEM TOO", BR.yellow, BR.blue, approve)}</div>
        <Hemicycle seats={SENATE_SEATS} cx={690} cy={176} dot={5.2} fill={() => BR.yellow} visible={(i) => buildB * (SENATE + 1) - i} />
        <div style={{ position: "absolute", left: 590, width: 200, top: 146, textAlign: "center", fontFamily: FONT.display, fontSize: 28, color: BR.white, opacity: buildB > 0 ? 1 : 0 }}>
          {Math.round(SENATE * buildB)}
        </div>
      </Glass>
    </>
  );
};
