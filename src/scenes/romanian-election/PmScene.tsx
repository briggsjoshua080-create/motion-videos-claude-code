import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, INVESTITURE, JOINT, RO, type SceneProps } from "./constants";
import { Accent, Eyebrow, Glass, Headline, Mono, PersonIcon, Stamp } from "./ui";

const FLOW = { top: 640, height: 206, width: 330 } as const;
const VOTE = { top: 896, height: 320 } as const;
const BAR = { left: 40, top: 112, width: 760, height: 56 } as const;
/** How far the "yes" bar fills in the example: past the line, not a real vote. */
const EXAMPLE_YES = 260;

/** Line-art star of office for the president's card. */
const SealIcon: React.FC<{ size: number; color?: string }> = ({ size, color = RO.white }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round">
    <circle cx={50} cy={50} r={40} />
    <path d="M50 24 L57 42 L76 42 L61 54 L67 73 L50 61 L33 73 L39 54 L24 42 L43 42 Z" />
  </svg>
);

/**
 * "The president names a prime minister, who needs 233 votes in parliament." President card ->
 * arrow -> candidate card, then the joint vote of both chambers: the "yes" bar runs past the 233
 * line (half of all 465 members) and the government is IN.
 */
export const PmScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const president = rise(frame, cue("pm", "president") - 8);
  const arrow = progress(frame, cue("pm", "names") - 4, cue("pm", "prime") + 2);
  const candidate = rise(frame, cue("pm", "prime") - 6);
  const vote = rise(frame, cue("pm", "who") - 8);
  const line = pop(frame, cue("pm", "233") - 4);
  const fill = progress(frame, cue("pm", "233") - 2, cue("pm", "parliament") + 2, Easing.out(Easing.quad));
  const stamp = pop(frame, cue("pm", "parliament") + 4);

  const lineX = BAR.left + (BAR.width * INVESTITURE) / JOINT;

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>06 — THE PRIME MINISTER</Eyebrow>
      <Headline size={120} style={{ top: 350, ...riseStyle(head[0], exit, 50) }}>
        THE PRIME
      </Headline>
      <Headline size={120} style={{ top: 350 + 118, ...riseStyle(head[1], exit, 50) }}>
        <Accent>MINISTER</Accent>
      </Headline>

      <Glass top={FLOW.top} width={FLOW.width} height={FLOW.height} tick={RO.white} style={riseStyle(president, exit, 40)}>
        <div style={{ position: "absolute", left: 30, top: 26 }}>
          <SealIcon size={78} />
        </div>
        <div style={{ position: "absolute", left: 30, top: 116, fontFamily: FONT.display, fontSize: 34, color: RO.white }}>PRESIDENT</div>
        <div style={{ position: "absolute", left: 30, top: 160, fontSize: 25, fontWeight: 500, color: RO.textSoft }}>names a candidate</div>
      </Glass>

      <svg width={180} height={40} style={{ position: "absolute", left: 120 + FLOW.width, top: FLOW.top + 84, overflow: "visible", opacity: 1 - exit }}>
        <path d="M14 20 H160" stroke={RO.yellow} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arrow} opacity={arrow > 0.01 ? 1 : 0} />
        <path d="M142 4 L162 20 L142 36" fill="none" stroke={RO.yellow} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.9 ? 1 : 0} />
      </svg>

      <Glass left={960 - FLOW.width} top={FLOW.top} width={FLOW.width} height={FLOW.height} tick={RO.yellow} style={riseStyle(candidate, exit, 40)}>
        <div style={{ position: "absolute", left: 30, top: 26 }}>
          <PersonIcon size={78} color={RO.yellow} />
        </div>
        <div style={{ position: "absolute", left: 30, top: 116, fontFamily: FONT.display, fontSize: 34, color: RO.white }}>A CANDIDATE</div>
        <div style={{ position: "absolute", left: 30, top: 160, fontSize: 25, fontWeight: 500, color: RO.textSoft }}>for prime minister</div>
      </Glass>

      <Glass top={VOTE.top} height={VOTE.height} tick={RO.white} style={riseStyle(vote, exit, 40)}>
        <Mono size={22} style={{ position: "absolute", left: 40, top: 34 }}>
          BOTH CHAMBERS TOGETHER · {JOINT} MEMBERS
        </Mono>
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.width, height: BAR.height, borderRadius: 12, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${(100 * EXAMPLE_YES * fill) / JOINT}%`, height: "100%", background: RO.white, boxShadow: "0 0 24px rgba(255,255,255,0.4)" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: lineX - 3,
            top: BAR.top - 22,
            width: 6,
            height: BAR.height + 44,
            borderRadius: 3,
            background: RO.yellow,
            boxShadow: "0 0 16px rgba(252,209,22,0.6)",
            transform: `scaleY(${Math.max(0, line)})`,
          }}
        />
        <Mono size={21} color={RO.yellow} style={{ position: "absolute", left: lineX + 14, top: BAR.top - 46, opacity: Math.min(1, Math.max(0, line)) }}>
          {INVESTITURE} YES = IN
        </Mono>
        <div style={{ position: "absolute", left: 40, top: 204, fontFamily: FONT.display, fontSize: 64, lineHeight: 1, color: RO.white, opacity: fill > 0 ? 1 : 0 }}>
          {Math.round(EXAMPLE_YES * fill)} <span style={{ fontSize: 36 }}>YES</span>
        </div>
        <Mono size={19} color={RO.textSoft} style={{ position: "absolute", left: 40, top: 280, letterSpacing: 2.5, opacity: Math.min(1, Math.max(0, stamp)) }}>
          {INVESTITURE} CAN ALSO VOTE IT OUT
        </Mono>
        <Stamp p={stamp} size={50} style={{ left: 420, top: 200 }}>
          IN OFFICE
        </Stamp>
      </Glass>
    </>
  );
};
