import React from "react";
import { useCurrentFrame } from "remotion";
import { Hemicycle } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CA, COMMONS, COMMONS_SEATS, FONT, HEMI, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono, PersonIcon } from "./ui";

/** Top of the majority marker over the half-circle's middle seat line. */
const LINE_TOP = HEMI.cy - 352;

/**
 * "The leader the House backs becomes prime minister. 172 seats is a majority." The same
 * half-circle as the Commons scene: a prime-minister card (leads the government, must keep the
 * House's trust), then the first 172 seats light up to the majority line in the middle.
 */
export const PmScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("pm", "leader") - 2);
  const card = rise(frame, cue("pm", "backs") - 6);
  const fill = progress(frame, cue("pm", "172") - 6, cue("pm", "seats") + 2);
  const line = pop(frame, cue("pm", "majority") - 6);
  const label = rise(frame, cue("pm", "majority") - 2);

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>06 — THE GOVERNMENT</Eyebrow>
      <Headline size={120} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        PRIME
      </Headline>
      <Headline size={120} style={{ top: 352 + 118, ...riseStyle(head[1], exit, 50) }}>
        <Accent>MINISTER</Accent>
      </Headline>
      <Aside size={42} style={{ top: 612, ...riseStyle(aside, exit, 24) }}>
        Usually the leader of the biggest party.
      </Aside>

      <Glass top={684} height={124} tick={CA.white} style={riseStyle(card, exit, 30)}>
        <div style={{ position: "absolute", left: 30, top: 22 }}>
          <PersonIcon size={78} />
        </div>
        <div style={{ position: "absolute", left: 132, top: 20 }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: CA.white }}>Leads the government</div>
          <div style={{ marginTop: 4, fontSize: 24, fontWeight: 500, color: CA.textSoft }}>picks the ministers · must keep the House's trust</div>
        </div>
      </Glass>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <Hemicycle
          seats={COMMONS_SEATS}
          cx={HEMI.cx}
          cy={HEMI.cy}
          dot={HEMI.dot}
          fill={(i) => (i < COMMONS.majority * fill ? CA.white : "rgba(255,255,255,0.28)")}
        />
        <div style={{ position: "absolute", left: HEMI.cx - 3, top: LINE_TOP, width: 6, height: HEMI.cy - LINE_TOP - 140, borderRadius: 3, background: CA.white, boxShadow: "0 0 18px rgba(255,255,255,0.6)", opacity: Math.min(1, Math.max(0, line)), transform: `scaleY(${Math.max(0, Math.min(1, line))})`, transformOrigin: "top" }} />
        <div style={{ position: "absolute", left: HEMI.cx - 200, width: 400, top: HEMI.cy - 104, textAlign: "center", fontFamily: FONT.display, fontSize: 100, lineHeight: 1, color: CA.white, textShadow: "0 0 30px rgba(255,255,255,0.35)" }}>
          {Math.round(COMMONS.majority * fill)}
        </div>
        <Mono size={21} style={{ position: "absolute", left: 120, width: 840, top: HEMI.cy + 18, textAlign: "center", ...riseStyle(label, 0, 12) }}>
          OF {COMMONS.seats} SEATS = <span style={{ color: CA.white }}>MAJORITY</span>
        </Mono>
      </div>
    </>
  );
};
