import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, MAJORITY, SE, TOTAL, type SceneProps } from "./constants";
import { Accent, CrownIcon, Eyebrow, GavelIcon, Glass, Headline, Mono, PersonIcon, Stamp } from "./ui";

const FLOW = { top: 640, height: 206, width: 330 } as const;
const VOTE = { top: 896, height: 330 } as const;
const BAR = { left: 40, top: 112, width: 760, height: 56 } as const;
/** The "no" count the bar stops at: one short of the 175 that would stop the candidate. */
const NO_VOTES = MAJORITY - 1;

/**
 * "Then parliament's Speaker, not the King, picks a prime minister, who's in unless 175 members
 * vote no." Speaker card -> arrow -> candidate card (a struck-out crown: not the King), then the
 * vote: the "no" bar fills to 174, one short of the 175 line, and the candidate is APPROVED.
 */
export const PmScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const speaker = rise(frame, cue("pm", "Speaker") - 8);
  const king = pop(frame, cue("pm", "King") - 4);
  const strike = progress(frame, cue("pm", "King"), cue("pm", "King") + 10);
  const arrow = progress(frame, cue("pm", "picks") - 4, cue("pm", "prime") + 2);
  const candidate = rise(frame, cue("pm", "prime") - 6);
  const vote = rise(frame, cue("pm", "who's") - 8);
  const line = pop(frame, cue("pm", "175") - 4);
  const fill = progress(frame, cue("pm", "unless") - 2, cue("pm", "members") + 2, Easing.out(Easing.quad));
  const stamp = pop(frame, cue("pm", "vote") - 3);

  const lineX = BAR.left + (BAR.width * MAJORITY) / TOTAL;
  const noCount = Math.round(NO_VOTES * fill);

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>05 — THE PRIME MINISTER</Eyebrow>
      <Headline size={120} style={{ top: 350, ...riseStyle(head[0], exit, 50) }}>
        THE PRIME
      </Headline>
      <Headline size={120} style={{ top: 350 + 118, ...riseStyle(head[1], exit, 50) }}>
        <Accent>MINISTER</Accent>
      </Headline>

      <Glass top={FLOW.top} width={FLOW.width} height={FLOW.height} tick={SE.white} style={riseStyle(speaker, exit, 40)}>
        <div style={{ position: "absolute", left: 30, top: 26 }}>
          <GavelIcon size={78} />
        </div>
        <div style={{ position: "absolute", left: 30, top: 116, fontFamily: FONT.display, fontSize: 34, color: SE.white }}>THE SPEAKER</div>
        <div style={{ position: "absolute", left: 30, top: 160, fontSize: 25, fontWeight: 500, color: SE.textSoft }}>chairs parliament</div>
      </Glass>

      <div style={{ position: "absolute", left: 120 + FLOW.width, top: FLOW.top, width: 960 - 120 - FLOW.width * 2, height: FLOW.height, opacity: 1 - exit }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 14,
            transform: `translateX(-50%) scale(${0.6 + 0.4 * king})`,
            opacity: Math.min(1, Math.max(0, king) * 1.5),
          }}
        >
          <CrownIcon size={72} color={SE.textSoft} strike={strike} />
        </div>
        <svg width={180} height={40} style={{ position: "absolute", left: 0, top: 84, overflow: "visible" }}>
          <path d="M14 20 H160" stroke={SE.yellow} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arrow} opacity={arrow > 0.01 ? 1 : 0} />
          <path d="M142 4 L162 20 L142 36" fill="none" stroke={SE.yellow} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.9 ? 1 : 0} />
        </svg>
        <Mono size={17} color={SE.textSoft} style={{ position: "absolute", left: 0, width: 180, top: 140, textAlign: "center", letterSpacing: 2.5, opacity: Math.min(1, Math.max(0, king)) }}>
          NOT THE KING
        </Mono>
      </div>

      <Glass left={960 - FLOW.width} top={FLOW.top} width={FLOW.width} height={FLOW.height} tick={SE.yellow} style={riseStyle(candidate, exit, 40)}>
        <div style={{ position: "absolute", left: 30, top: 26 }}>
          <PersonIcon size={78} color={SE.yellow} />
        </div>
        <div style={{ position: "absolute", left: 30, top: 116, fontFamily: FONT.display, fontSize: 34, color: SE.white }}>A CANDIDATE</div>
        <div style={{ position: "absolute", left: 30, top: 160, fontSize: 25, fontWeight: 500, color: SE.textSoft }}>for prime minister</div>
      </Glass>

      <Glass top={VOTE.top} height={VOTE.height} tick={SE.white} style={riseStyle(vote, exit, 40)}>
        <Mono size={22} style={{ position: "absolute", left: 40, top: 34 }}>
          THE VOTE · {TOTAL} MEMBERS
        </Mono>
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.width, height: BAR.height, borderRadius: 12, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${(100 * NO_VOTES * fill) / TOTAL}%`, height: "100%", background: SE.white, boxShadow: "0 0 24px rgba(255,255,255,0.4)" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: lineX - 3,
            top: BAR.top - 22,
            width: 6,
            height: BAR.height + 44,
            borderRadius: 3,
            background: SE.yellow,
            boxShadow: "0 0 16px rgba(254,204,2,0.6)",
            transform: `scaleY(${Math.max(0, line)})`,
          }}
        />
        <Mono size={21} color={SE.yellow} style={{ position: "absolute", left: lineX + 14, top: BAR.top - 46, opacity: Math.min(1, Math.max(0, line)) }}>
          {MAJORITY} NO = OUT
        </Mono>
        <div style={{ position: "absolute", left: 40, top: 214, fontFamily: FONT.display, fontSize: 64, lineHeight: 1, color: SE.white, opacity: fill > 0 ? 1 : 0 }}>
          {noCount} <span style={{ fontSize: 36 }}>NO</span>
        </div>
        <Mono size={19} color={SE.textSoft} style={{ position: "absolute", left: 40, top: 290, letterSpacing: 2.5, opacity: Math.min(1, Math.max(0, stamp)) }}>
          ZERO YES VOTES NEEDED
        </Mono>
        <Stamp p={stamp} size={58} style={{ left: 430, top: 206 }}>
          APPROVED
        </Stamp>
      </Glass>
    </>
  );
};
