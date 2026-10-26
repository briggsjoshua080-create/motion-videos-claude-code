import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, MAJORITY, NO, STORTING, type SceneProps } from "./constants";
import { Accent, Eyebrow, Glass, Headline, Mono, PersonIcon, Stamp } from "./ui";

const FLOW = { top: 640, height: 206, width: 330 } as const;
const VOTE = { top: 896, height: 320 } as const;
const BAR = { left: 40, top: 112, width: 760, height: 56 } as const;
/** Where the "against" bar stops: one short of the majority that would remove the government. */
const AGAINST = MAJORITY - 1;

/**
 * "A prime minister needs no vote to take office, just no majority against them." Election card
 * -> arrow (with a NO VOTE chip) -> prime minister card, then the only vote that matters: the
 * "against" bar fills to 84, one short of the 85 line, and the government STAYS.
 */
export const PmScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const election = rise(frame, 4);
  const arrow = progress(frame, cue("pm", "needs") - 6, cue("pm", "no") + 4);
  const chip = pop(frame, cue("pm", "no") - 3);
  const pm = rise(frame, cue("pm", "take") - 8);
  const vote = rise(frame, cue("pm", "just") - 10);
  const line = pop(frame, cue("pm", "majority") - 4);
  const fill = progress(frame, cue("pm", "majority") - 2, cue("pm", "them", "end") - 4, Easing.out(Easing.quad));
  const stamp = pop(frame, cue("pm", "them", "end") - 4);

  const lineX = BAR.left + (BAR.width * MAJORITY) / STORTING;
  const count = Math.round(AGAINST * fill);

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>06 — THE PRIME MINISTER</Eyebrow>
      <Headline size={120} style={{ top: 350, ...riseStyle(head[0], exit, 50) }}>
        NO VOTE
      </Headline>
      <Headline size={120} style={{ top: 350 + 118, ...riseStyle(head[1], exit, 50) }}>
        <Accent>NEEDED</Accent>
      </Headline>

      <Glass top={FLOW.top} width={FLOW.width} height={FLOW.height} tick={NO.white} style={riseStyle(election, exit, 40)}>
        <div style={{ position: "absolute", left: 30, top: 30, fontFamily: FONT.display, fontSize: 64, lineHeight: 1, color: NO.white }}>{STORTING}</div>
        <div style={{ position: "absolute", left: 30, top: 116, fontFamily: FONT.display, fontSize: 34, color: NO.white }}>ELECTED</div>
        <div style={{ position: "absolute", left: 30, top: 160, fontSize: 25, fontWeight: 500, color: NO.textSoft }}>a new Storting</div>
      </Glass>

      <div style={{ position: "absolute", left: 120 + FLOW.width, top: FLOW.top, width: 960 - 120 - FLOW.width * 2, height: FLOW.height, opacity: 1 - exit }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 22,
            padding: "8px 16px",
            borderRadius: 999,
            background: NO.blue,
            border: `2px solid ${NO.white}`,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 2.5,
            color: NO.white,
            whiteSpace: "nowrap",
            transform: `translateX(-50%) scale(${0.6 + 0.4 * chip})`,
            opacity: Math.min(1, Math.max(0, chip) * 1.5),
          }}
        >
          NO VOTE
        </div>
        <svg width={180} height={40} style={{ position: "absolute", left: 0, top: 84, overflow: "visible" }}>
          <path d="M14 20 H160" stroke={NO.white} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arrow} opacity={arrow > 0.01 ? 1 : 0} />
          <path d="M142 4 L162 20 L142 36" fill="none" stroke={NO.white} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.9 ? 1 : 0} />
        </svg>
      </div>

      <Glass left={960 - FLOW.width} top={FLOW.top} width={FLOW.width} height={FLOW.height} tick={NO.blue} style={riseStyle(pm, exit, 40)}>
        <div style={{ position: "absolute", left: 30, top: 26 }}>
          <PersonIcon size={78} color={NO.white} />
        </div>
        <div style={{ position: "absolute", left: 30, top: 116, fontFamily: FONT.display, fontSize: 34, color: NO.white }}>IN OFFICE</div>
        <div style={{ position: "absolute", left: 30, top: 160, fontSize: 25, fontWeight: 500, color: NO.textSoft }}>the prime minister</div>
      </Glass>

      <Glass top={VOTE.top} height={VOTE.height} tick={NO.white} style={riseStyle(vote, exit, 40)}>
        <Mono size={22} style={{ position: "absolute", left: 40, top: 34 }}>
          NO-CONFIDENCE VOTE · {STORTING} SEATS
        </Mono>
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.width, height: BAR.height, borderRadius: 12, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${(100 * AGAINST * fill) / STORTING}%`, height: "100%", background: NO.white, boxShadow: "0 0 24px rgba(255,255,255,0.4)" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: lineX - 3,
            top: BAR.top - 22,
            width: 6,
            height: BAR.height + 44,
            borderRadius: 3,
            background: NO.blue,
            boxShadow: `0 0 0 2px ${NO.white}`,
            transform: `scaleY(${Math.max(0, line)})`,
          }}
        />
        <Mono size={21} color={NO.white} style={{ position: "absolute", left: lineX + 14, top: BAR.top - 46, opacity: Math.min(1, Math.max(0, line)) }}>
          {MAJORITY} AGAINST = OUT
        </Mono>
        <div style={{ position: "absolute", left: 40, top: 212, fontFamily: FONT.display, fontSize: 64, lineHeight: 1, color: NO.white, opacity: fill > 0 ? 1 : 0 }}>
          {count} <span style={{ fontSize: 34 }}>AGAINST</span>
        </div>
        <Stamp p={stamp} size={58} style={{ left: 500, top: 200 }}>
          STAYS
        </Stamp>
      </Glass>
    </>
  );
};
