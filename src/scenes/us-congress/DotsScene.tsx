import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CLOTURE, FONT, RECORD_HOURS, US, type SceneProps } from "./constants";
import { Accent, Aside, Bubble, Clock, Headline, SectionNumeral, roll } from "./ui";
import { CHAT, HookChat } from "./HookScene";

/**
 * "And those typing dots? Senators talking. The record: 25 hours. Ending it takes 60 votes."
 * Section 06, the rewatch payoff (rule 10): the frame-0 chat window comes back and zooms into its
 * little typing bubble, which grows huge and keeps bouncing (senators can talk as long as they
 * like); then a clock spins to 25 HOURS (the longest Senate speech, April 2025); then 60 VOTES "to
 * end it" (cloture), which sets up the closing question.
 */
/** The chat window sits higher here than on frame 0, so the subtitles never cover it. */
const LIFT = 520;

export const DotsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const win = rise(frame, 0);
  // The zoom: the dots bubble (left 30, top 380 in the window) grows to fill the frame.
  const zoom = progress(frame, cue("dots", "typing") - 4, cue("dots", "dots", "end") + 4, Easing.inOut(Easing.cubic));
  const talk = rise(frame, cue("dots", "Senators") - 6);
  const phase2 = cue("dots", "The") - 6;
  const p2 = progress(frame, phase2, phase2 + 8);
  const clock = pop(frame, phase2 + 2);
  const hours = progress(frame, phase2 + 2, cue("dots", "hours", "end"), Easing.out(Easing.cubic));
  const phase3 = cue("dots", "Ending") - 6;
  const p3 = progress(frame, phase3, phase3 + 8);
  const sixty = pop(frame, cue("dots", "60") - 5);
  const endAside = rise(frame, phase3 + 2);
  const scale = 1 + zoom * 3.2;
  const big = pop(frame, cue("dots", "dots", "end") - 2);

  return (
    <>
      <SectionNumeral n="06" p={numeral * (1 - exit)} />

      {/* Phase 1: the hook's chat window returns; the camera pushes into the typing dots. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: Math.min(1, win * 1.5) * (1 - zoom),
          transform: `scale(${scale})`,
          transformOrigin: `${CHAT.left + 90}px ${CHAT.top - LIFT + 400}px`,
        }}
      >
        <HookChat frame={frame} law={1} style={{ top: CHAT.top - LIFT }} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, Math.max(0, big)) * (1 - p2) }}>
        <Bubble p={big} width={620} height={280} kind="dots" t={frame} style={{ left: 230, top: 520 }} />
        <Headline size={150} style={{ top: 900, ...riseStyle(talk, 0, 40) }}>
          <Accent>TALKING</Accent>
        </Headline>
      </div>

      {/* Phase 2: the record. */}
      <div style={{ position: "absolute", inset: 0, opacity: p2 * (1 - p3) * (1 - exit) }}>
        <Aside size={118} style={{ top: 250 }}>
          the record:
        </Aside>
        <Headline size={175} style={{ top: 380 }}>
          {roll(0, RECORD_HOURS, hours)} HOURS
        </Headline>
        <div style={{ position: "absolute", left: 300, top: 640, opacity: Math.min(1, Math.max(0, clock) * 1.5), transform: `scale(${0.6 + 0.4 * Math.min(1.08, Math.max(0, clock))})` }}>
          <Clock size={480} turns={hours * RECORD_HOURS} />
        </div>
      </div>

      {/* Phase 3: 60 votes to end it. */}
      <div style={{ position: "absolute", inset: 0, opacity: p3 * (1 - exit) }}>
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 260,
            fontFamily: FONT.display,
            fontSize: 340,
            lineHeight: 0.92,
            letterSpacing: -6,
            color: US.white,
            textShadow: "0 0 60px rgba(255,255,255,0.35)",
            opacity: Math.min(1, Math.max(0, sixty) * 1.5),
            transform: `scale(${0.7 + 0.3 * Math.min(1.08, Math.max(0, sixty))})`,
            transformOrigin: "0 50%",
          }}
        >
          {CLOTURE}
        </div>
        <Headline size={150} style={{ top: 600 }}>
          <Accent>VOTES</Accent>
        </Headline>
        <Aside size={120} style={{ top: 800, ...riseStyle(endAside, 0, 30) }}>
          to end the talking.
        </Aside>
      </div>
    </>
  );
};
