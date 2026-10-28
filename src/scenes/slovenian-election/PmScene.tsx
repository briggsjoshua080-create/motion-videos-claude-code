import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ASSEMBLY, FONT, MAJORITY, SI, type SceneProps } from "./constants";
import { Accent, Eyebrow, Glass, Headline, Mono, PersonIcon, Stamp } from "./ui";

const VOTE = { top: 628, height: 290 } as const;
const BAR = { left: 40, top: 112, width: 760, height: 56 } as const;
const WHO = { top: 948, height: 196, width: 350 } as const;

/** Three outlines side by side: a group of MPs. */
const GroupIcon: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ position: "relative", width: size * 1.7, height: size }}>
    {[0, 2, 1].map((i) => (
      <div key={i} style={{ position: "absolute", left: i * size * 0.35, top: i === 1 ? 0 : size * 0.08, opacity: i === 1 ? 1 : 0.7 }}>
        <PersonIcon size={i === 1 ? size : size * 0.9} color={SI.white} />
      </div>
    ))}
  </div>
);

/**
 * "The prime minister needs 46 of 90 votes, proposed by the president or by MPs." The Assembly
 * vote first: the "for" bar fills to the 46 line of 90 and the PM is ELECTED; then who may
 * propose the candidate: the president, OR a group of MPs. Footnote: in 2026 the president
 * proposed no one, so MPs did.
 */
export const PmScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const vote = rise(frame, cue("pm", "prime") - 6);
  const line = pop(frame, cue("pm", "46") - 4);
  const fill = progress(frame, cue("pm", "46") - 2, cue("pm", "votes") - 2, Easing.out(Easing.quad));
  const stamp = pop(frame, cue("pm", "votes") - 2);
  const president = rise(frame, cue("pm", "proposed") - 4);
  const or = pop(frame, cue("pm", "or") - 3);
  const mps = rise(frame, cue("pm", "MPs") - 6);
  const note = rise(frame, cue("pm", "MPs") + 6);

  const lineX = BAR.left + (BAR.width * MAJORITY) / ASSEMBLY;
  const count = Math.round(MAJORITY * fill);

  const who = (left: number, p: number, icon: React.ReactNode, title: string, sub: string, tick: string) => (
    <Glass left={left} top={WHO.top} width={WHO.width} height={WHO.height} tick={tick} style={riseStyle(p, exit, 40)}>
      <div style={{ position: "absolute", left: 30, top: 24 }}>{icon}</div>
      <div style={{ position: "absolute", left: 30, top: 104, fontFamily: FONT.display, fontSize: 32, color: SI.white }}>{title}</div>
      <div style={{ position: "absolute", left: 30, top: 146, fontSize: 23, fontWeight: 500, color: SI.textSoft, whiteSpace: "nowrap" }}>{sub}</div>
    </Glass>
  );

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>06 — THE PRIME MINISTER</Eyebrow>
      <Headline size={112} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        THE PM
      </Headline>
      <Headline size={112} style={{ top: 352 + 112, ...riseStyle(head[1], exit, 50) }}>
        <Accent>NEEDS {MAJORITY}</Accent>
      </Headline>

      <Glass top={VOTE.top} height={VOTE.height} tick={SI.white} style={riseStyle(vote, exit, 40)}>
        <Mono size={22} style={{ position: "absolute", left: 40, top: 34 }}>
          SECRET VOTE · {ASSEMBLY} MPS
        </Mono>
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.width, height: BAR.height, borderRadius: 12, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${(100 * MAJORITY * fill) / ASSEMBLY}%`, height: "100%", background: SI.white, boxShadow: "0 0 24px rgba(255,255,255,0.4)" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: lineX - 3,
            top: BAR.top - 22,
            width: 6,
            height: BAR.height + 44,
            borderRadius: 3,
            background: SI.red,
            boxShadow: `0 0 0 2px ${SI.white}`,
            transform: `scaleY(${Math.max(0, line)})`,
          }}
        />
        <Mono size={21} color={SI.white} style={{ position: "absolute", left: lineX + 14, top: BAR.top - 46, opacity: Math.min(1, Math.max(0, line)) }}>
          {MAJORITY} = MAJORITY
        </Mono>
        <div style={{ position: "absolute", left: 40, top: 200, fontFamily: FONT.display, fontSize: 64, lineHeight: 1, color: SI.white, opacity: fill > 0 ? 1 : 0 }}>
          {count} <span style={{ fontSize: 34 }}>FOR</span>
        </div>
        <Stamp p={stamp} size={52} style={{ left: 440, top: 188 }}>
          ELECTED
        </Stamp>
      </Glass>

      {who(120, president, <PersonIcon size={70} color={SI.white} />, "PRESIDENT", "proposes a candidate", SI.white)}
      <div
        style={{
          position: "absolute",
          left: 540 - 38,
          top: WHO.top + WHO.height / 2 - 38,
          width: 76,
          height: 76,
          borderRadius: 38,
          background: SI.red,
          border: `3px solid ${SI.white}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT.display,
          fontSize: 26,
          color: SI.white,
          opacity: Math.min(1, Math.max(0, or) * 1.5) * (1 - exit),
          transform: `scale(${0.6 + 0.4 * or})`,
          zIndex: 1,
        }}
      >
        OR
      </div>
      {who(960 - WHO.width, mps, <GroupIcon size={70} />, "MPs", "a party group, or any 10", SI.red)}

      <Mono size={19} color={SI.textSoft} style={{ position: "absolute", left: 120, top: 1170, letterSpacing: 2.2, ...riseStyle(note, exit, 16) }}>
        2026: THE PRESIDENT PROPOSED NO ONE, SO MPS DID
      </Mono>
    </>
  );
};
