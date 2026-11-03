import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { COUNCIL_PRESIDENT, DUMA, DUMA_YEARS, FONT, RU, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono, Stamp } from "./ui";

const DUMA_SEATS = hemicycleSeats(DUMA, 9, 50, 118);
const CARD_A = { top: 680, height: 250 } as const;
const CARD_B = { top: 948, height: 300 } as const;

/**
 * "That's the State Duma, which makes the laws. The Federation Council must approve them, but nobody
 * elects it: regions send two each, the president adds up to 30." Two glass cards: the State Duma
 * (450 dots sweep in, MAKES THE LAWS on "makes") and the Federation Council (MUST APPROVE THEM on
 * "approve", a NOT ELECTED stamp on "nobody", two seats per region on "two" — one from the regional
 * parliament, one from the governor — and +30 from the president on "30").
 */
export const CongressScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, 10);
  const cardA = rise(frame, cue("congress", "State") - 8);
  const buildA = progress(frame, cue("congress", "State") - 6, cue("congress", "makes") + 4, Easing.inOut(Easing.cubic));
  const makes = pop(frame, cue("congress", "makes") - 4);
  const cardB = rise(frame, cue("congress", "Federation") - 8);
  const approve = pop(frame, cue("congress", "approve") - 3);
  const stamp = pop(frame, cue("congress", "nobody") - 2);
  const pair = [pop(frame, cue("congress", "two") - 3), pop(frame, cue("congress", "two") + 2)];
  const plus = pop(frame, cue("congress", "30") - 3);

  const chip = (text: string, bg: string, color: string, p: number) => (
    <div
      style={{
        padding: "10px 18px",
        borderRadius: 999,
        background: bg,
        border: `2px solid ${RU.white}`,
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
    <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 150, opacity: Math.min(1, Math.max(0, p) * 1.5), transform: `scale(${0.5 + 0.5 * Math.min(1.1, p)})` }}>
      <div style={{ width: 44, height: 44, borderRadius: 22, background: fill, border: `3px solid ${RU.white}`, boxSizing: "border-box", boxShadow: fill === RU.red ? `0 0 20px ${RU.redGlow}` : "0 0 14px rgba(255,255,255,0.3)" }} />
      <Mono size={13} color={RU.textSoft} style={{ letterSpacing: 1, textAlign: "center", whiteSpace: "normal", lineHeight: 1.3 }}>
        {label}
      </Mono>
    </div>
  );

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>05 — THE PARLIAMENT</Eyebrow>
      <Headline size={124} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        TWO
      </Headline>
      <Headline size={124} style={{ top: 352 + 122, ...riseStyle(head[1], exit, 50) }}>
        <Accent>CHAMBERS</Accent>
      </Headline>
      <Aside size={44} style={{ top: 628, ...riseStyle(aside, exit, 24) }}>
        Only one of them is chosen by voters.
      </Aside>

      <Glass top={CARD_A.top} height={CARD_A.height} tick={RU.white} style={riseStyle(cardA, exit, 40)}>
        <Mono size={18} color={RU.textSoft} style={{ position: "absolute", left: 36, top: 30, letterSpacing: 2.5 }}>
          LOWER HOUSE · {DUMA_YEARS} YEARS · ELECTED
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 66, fontFamily: FONT.display, fontSize: 54, lineHeight: 1.02, color: RU.white }}>
          STATE
          <br />
          DUMA
        </div>
        <div style={{ position: "absolute", left: 36, top: 186 }}>{chip("MAKES THE LAWS", RU.white, RU.blueDeep, makes)}</div>
        <Hemicycle seats={DUMA_SEATS} cx={680} cy={176} dot={3.4} fill={() => RU.white} visible={(i) => buildA * (DUMA + 1) - i} />
        <div style={{ position: "absolute", left: 580, width: 200, top: 146, textAlign: "center", fontFamily: FONT.display, fontSize: 28, color: RU.white, opacity: buildA > 0 ? 1 : 0 }}>
          {Math.round(DUMA * buildA)}
        </div>
      </Glass>

      <Glass top={CARD_B.top} height={CARD_B.height} tick={RU.red} style={riseStyle(cardB, exit, 40)}>
        <Mono size={18} color={RU.textSoft} style={{ position: "absolute", left: 36, top: 30, letterSpacing: 2.5 }}>
          UPPER HOUSE · SENATORS
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 64, fontFamily: FONT.display, fontSize: 44, lineHeight: 1.02, color: RU.white }}>FEDERATION COUNCIL</div>
        <div style={{ position: "absolute", left: 36, top: 126 }}>{chip("MUST APPROVE THEM", RU.red, RU.white, approve)}</div>
        <Stamp p={stamp} size={36} color={RU.white} rotate={6} style={{ left: 540, top: 124, background: RU.red, borderColor: RU.white }}>
          NOT ELECTED
        </Stamp>
        <div style={{ position: "absolute", left: 20, top: 196, display: "flex", alignItems: "flex-start", gap: 4 }}>
          {seat(pair[0], RU.white, "REGIONAL PARLIAMENT")}
          {seat(pair[1], RU.white, "REGIONAL GOVERNOR")}
          <div style={{ marginTop: 6, marginLeft: 6, fontSize: 22, fontWeight: 600, color: RU.white, opacity: Math.min(1, Math.max(0, pair[1]) * 1.5), whiteSpace: "nowrap" }}>per region</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 204,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: Math.min(1, Math.max(0, plus) * 1.5),
            transform: `scale(${0.6 + 0.4 * Math.min(1.1, plus)})`,
            transformOrigin: "left center",
          }}
        >
          <div style={{ fontFamily: FONT.display, fontSize: 52, lineHeight: 1, color: RU.white, textShadow: `0 0 24px ${RU.redGlow}` }}>+{COUNCIL_PRESIDENT}</div>
          <Mono size={14} color={RU.textSoft} style={{ letterSpacing: 1, whiteSpace: "normal", width: 140, lineHeight: 1.3 }}>
            UP TO, PICKED BY THE PRESIDENT
          </Mono>
        </div>
      </Glass>
    </>
  );
};
