import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, NEW_PM, UA, type SceneProps } from "./constants";
import { Accent, Aside, Headline, PersonIcon, SectionNumeral } from "./ui";

const CARD = { left: 120, top: 540, w: 840, h: 400 } as const;

/**
 * "In July, it chose a new prime minister." Section 04, the government: NEW PM, a card where the old
 * prime minister (a grey outline) slides out on "July" and the new one slides in with his name,
 * and "since July 2026." from the start (all text stays up 2 s, rule 6). Generic outlines, no likeness. Closes loop 2 (who's in charge).
 */
export const PMScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = rise(frame, 1);
  const card = rise(frame, 3);
  const swap = progress(frame, cue("pm", "July") - 4, cue("pm", "July") + 8, Easing.inOut(Easing.cubic));
  const aside = rise(frame, 3);

  const face = (fill: string, stroke: string) => (
    <div style={{ width: 170, height: 170, borderRadius: 85, background: fill, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PersonIcon size={120} color={stroke} />
    </div>
  );

  return (
    <>
      <SectionNumeral n="04" p={numeral * (1 - exit)} />
      <Headline size={185} style={{ top: 270, ...riseStyle(head, exit, 50) }}>
        NEW <Accent>PM</Accent>
      </Headline>
      <div
        style={{
          position: "absolute",
          left: CARD.left,
          top: CARD.top,
          width: CARD.w,
          height: CARD.h,
          borderRadius: 28,
          overflow: "hidden",
          background: UA.glass,
          border: `2px solid ${UA.glassEdge}`,
          boxShadow: "0 26px 60px rgba(0,10,30,0.35)",
          ...riseStyle(card, exit, 60),
        }}
      >
        {/* The outgoing prime minister. */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, transform: `translateX(${-swap * CARD.w}px)`, opacity: 1 - swap * 0.6 }}>
          {face("rgba(255,255,255,0.12)", "rgba(255,255,255,0.5)")}
          <div style={{ width: 520, height: 60, borderRadius: 30, background: "rgba(255,255,255,0.2)" }} />
        </div>
        {/* The new one. */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, transform: `translateX(${(1 - swap) * CARD.w}px)` }}>
          {face(UA.yellow, UA.navy)}
          <div style={{ fontFamily: FONT.display, fontSize: 112, lineHeight: 1, letterSpacing: -1.3, color: UA.white, textShadow: "0 0 30px rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{NEW_PM.name}</div>
        </div>
      </div>
      <Aside size={118} style={{ top: 1000, ...riseStyle(aside, exit, 30) }}>
        since {NEW_PM.since}.
      </Aside>
    </>
  );
};
