import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CA, COMMONS, COMMONS_SEATS, FONT, HEMI, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mono } from "./ui";

/** A rounded label that pops in, for the chamber's jobs. */
export const Pill: React.FC<{ label: string; p: number; strong?: boolean }> = ({ label, p, strong }) => (
  <div
    style={{
      padding: "16px 28px",
      borderRadius: 999,
      background: strong ? CA.white : CA.glass,
      border: `1.5px solid ${strong ? CA.white : CA.glassEdge}`,
      fontFamily: FONT.mono,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: 4,
      color: strong ? CA.red : CA.white,
      whiteSpace: "nowrap",
      opacity: Math.min(1, Math.max(0, p) * 1.5),
      transform: `scale(${0.6 + 0.4 * Math.max(0, p)})`,
    }}
  >
    {label}
  </div>
);

/**
 * "Each riding's winner joins the House of Commons, which makes the laws and controls the money."
 * 343 dots sweep into the House of Commons half-circle (one per riding) with a counter; its two
 * jobs pop up as pills on their words.
 */
export const CommonsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("commons", "House") - 4);
  const build = progress(frame, cue("commons", "winner") - 4, cue("commons", "Commons", "end") + 4, Easing.inOut(Easing.cubic));
  const counter = rise(frame, cue("commons", "winner") - 6);
  const jobs = [pop(frame, cue("commons", "laws") - 4), pop(frame, cue("commons", "money") - 4)];

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>05 — PARLIAMENT</Eyebrow>
      <Headline size={124} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        HOUSE OF
      </Headline>
      <Headline size={124} style={{ top: 352 + 122, ...riseStyle(head[1], exit, 50) }}>
        <Accent>COMMONS</Accent>
      </Headline>
      <Aside size={44} style={{ top: 622, ...riseStyle(aside, exit, 24) }}>
        The elected chamber: one MP per riding.
      </Aside>
      <div style={{ position: "absolute", left: 120, top: 700, width: 840, display: "flex", gap: 18, opacity: 1 - exit }}>
        <Pill label="MAKES THE LAWS" p={jobs[0]} />
        <Pill label="CONTROLS THE MONEY" p={jobs[1]} />
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <div
          style={{
            position: "absolute",
            left: HEMI.cx - 400,
            top: HEMI.cy - 300,
            width: 800,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(255,255,255,0.12), rgba(255,255,255,0))",
          }}
        />
        <Hemicycle seats={COMMONS_SEATS} cx={HEMI.cx} cy={HEMI.cy} dot={HEMI.dot} fill={() => CA.white} visible={(i) => build * (COMMONS.seats + 1) - i} />
        <div style={{ position: "absolute", left: HEMI.cx - 200, width: 400, top: HEMI.cy - 104, textAlign: "center", fontFamily: FONT.display, fontSize: 100, lineHeight: 1, color: CA.white, textShadow: "0 0 30px rgba(255,255,255,0.35)", opacity: Math.min(1, counter) }}>
          {Math.round(COMMONS.seats * build)}
        </div>
        <Mono size={21} style={{ position: "absolute", left: 120, width: 840, top: HEMI.cy + 18, textAlign: "center", opacity: Math.min(1, counter) }}>
          SEATS · <span style={{ color: CA.white }}>AN ELECTION AT LEAST EVERY 5 YEARS</span>
        </Mono>
      </div>
    </>
  );
};
