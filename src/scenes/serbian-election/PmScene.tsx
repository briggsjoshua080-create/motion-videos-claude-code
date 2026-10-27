import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ASSEMBLY, FONT, GOVERNMENT_DAYS, MAJORITY, RS, type SceneProps } from "./constants";
import { Accent, Eyebrow, Glass, Headline, Mono, PersonIcon, Stamp } from "./ui";

const FLOW = { top: 640, height: 206, width: 330 } as const;
const VOTE = { top: 896, height: 300 } as const;
const BAR = { left: 40, top: 112, width: 760, height: 56 } as const;

/**
 * "The prime minister, proposed by the president, needs 126 votes: a majority." President card
 * -> arrow (with a PROPOSES chip) -> prime minister card, then the Assembly vote: the "for" bar
 * fills to the 126 line and the government is ELECTED. Footnote: no government in 90 days means a
 * new election.
 */
export const PmScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const pm = rise(frame, cue("pm", "prime") - 6);
  const president = rise(frame, cue("pm", "proposed") - 6);
  const arrow = progress(frame, cue("pm", "proposed") - 2, cue("pm", "president") + 6);
  const chip = pop(frame, cue("pm", "proposed") - 2);
  const vote = rise(frame, cue("pm", "needs") - 8);
  const line = pop(frame, cue("pm", "126") - 4);
  const fill = progress(frame, cue("pm", "126") - 2, cue("pm", "majority") - 2, Easing.out(Easing.quad));
  const stamp = pop(frame, cue("pm", "majority") - 2);
  const note = rise(frame, cue("pm", "majority") + 6);

  const lineX = BAR.left + (BAR.width * MAJORITY) / ASSEMBLY;
  const count = Math.round(MAJORITY * fill);

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>06 — THE PRIME MINISTER</Eyebrow>
      <Headline size={112} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        THE PM
      </Headline>
      <Headline size={112} style={{ top: 352 + 112, ...riseStyle(head[1], exit, 50) }}>
        <Accent>NEEDS {MAJORITY}</Accent>
      </Headline>

      <Glass top={FLOW.top} width={FLOW.width} height={FLOW.height} tick={RS.white} style={riseStyle(president, exit, 40)}>
        <div style={{ position: "absolute", left: 30, top: 26 }}>
          <PersonIcon size={78} color={RS.white} />
        </div>
        <div style={{ position: "absolute", left: 30, top: 116, fontFamily: FONT.display, fontSize: 34, color: RS.white }}>PRESIDENT</div>
        <div style={{ position: "absolute", left: 30, top: 160, fontSize: 25, fontWeight: 500, color: RS.textSoft }}>names a candidate</div>
      </Glass>

      <div style={{ position: "absolute", left: 120 + FLOW.width, top: FLOW.top, width: 960 - 120 - FLOW.width * 2, height: FLOW.height, opacity: 1 - exit }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 22,
            padding: "8px 16px",
            borderRadius: 999,
            background: RS.red,
            border: `2px solid ${RS.white}`,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: 2,
            color: RS.white,
            whiteSpace: "nowrap",
            transform: `translateX(-50%) scale(${0.6 + 0.4 * chip})`,
            opacity: Math.min(1, Math.max(0, chip) * 1.5),
          }}
        >
          PROPOSES
        </div>
        <svg width={180} height={40} style={{ position: "absolute", left: 0, top: 84, overflow: "visible" }}>
          <path d="M14 20 H160" stroke={RS.white} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arrow} opacity={arrow > 0.01 ? 1 : 0} />
          <path d="M142 4 L162 20 L142 36" fill="none" stroke={RS.white} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.9 ? 1 : 0} />
        </svg>
      </div>

      <Glass left={960 - FLOW.width} top={FLOW.top} width={FLOW.width} height={FLOW.height} tick={RS.red} style={riseStyle(pm, exit, 40)}>
        <div style={{ position: "absolute", left: 30, top: 26 }}>
          <PersonIcon size={78} color={RS.white} />
        </div>
        <div style={{ position: "absolute", left: 30, top: 116, fontFamily: FONT.display, fontSize: 26, lineHeight: "40px", color: RS.white }}>PRIME MINISTER</div>
        <div style={{ position: "absolute", left: 30, top: 160, fontSize: 25, fontWeight: 500, color: RS.textSoft }}>leads the government</div>
      </Glass>

      <Glass top={VOTE.top} height={VOTE.height} tick={RS.white} style={riseStyle(vote, exit, 40)}>
        <Mono size={22} style={{ position: "absolute", left: 40, top: 34 }}>
          ASSEMBLY VOTE · {ASSEMBLY} SEATS
        </Mono>
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.width, height: BAR.height, borderRadius: 12, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${(100 * MAJORITY * fill) / ASSEMBLY}%`, height: "100%", background: RS.white, boxShadow: "0 0 24px rgba(255,255,255,0.4)" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: lineX - 3,
            top: BAR.top - 22,
            width: 6,
            height: BAR.height + 44,
            borderRadius: 3,
            background: RS.red,
            boxShadow: `0 0 0 2px ${RS.white}`,
            transform: `scaleY(${Math.max(0, line)})`,
          }}
        />
        <Mono size={21} color={RS.white} style={{ position: "absolute", left: lineX + 14, top: BAR.top - 46, opacity: Math.min(1, Math.max(0, line)) }}>
          {MAJORITY} = MAJORITY
        </Mono>
        <div style={{ position: "absolute", left: 40, top: 204, fontFamily: FONT.display, fontSize: 64, lineHeight: 1, color: RS.white, opacity: fill > 0 ? 1 : 0 }}>
          {count} <span style={{ fontSize: 34 }}>FOR</span>
        </div>
        <Stamp p={stamp} size={52} style={{ left: 440, top: 192 }}>
          ELECTED
        </Stamp>
      </Glass>

      <Mono size={19} color={RS.textSoft} style={{ position: "absolute", left: 120, top: 1220, letterSpacing: 2.5, ...riseStyle(note, exit, 16) }}>
        NO GOVERNMENT IN {GOVERNMENT_DAYS} DAYS? NEW ELECTION.
      </Mono>
    </>
  );
};
