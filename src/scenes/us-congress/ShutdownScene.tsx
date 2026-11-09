import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, SHUTDOWN_DAYS, US, type SceneProps } from "./constants";
import { Accent, Aside, CapitolDome, HangingSign, Headline, SectionNumeral, roll, swingAngle } from "./ui";

/**
 * "No deal on money? Shutdown. Last year: 43 days." Section 04, why Congress is so controversial
 * (loop 2 closed: when the chats can't agree, nothing gets sent, not even the money): NO DEAL?,
 * then a CLOSED sign drops onto the Capitol and swings on "Shutdown", then 43 DAYS rolls up with
 * "last year." (1 Oct – 12 Nov 2025, the longest ever).
 */
export const ShutdownScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = rise(frame, 1);
  const dome = rise(frame, 3);
  const dropAt = cue("shutdown", "Shutdown") - 6;
  const drop = progress(frame, dropAt, dropAt + 7, Easing.in(Easing.quad));
  const angle = swingAngle(frame, dropAt + 7, 10, 0.32, 0.06);
  const swap = cue("shutdown", "Last") - 6;
  const out = progress(frame, swap, swap + 8);
  const days = pop(frame, cue("shutdown", "43") - 6);
  const count = progress(frame, cue("shutdown", "43") - 4, cue("shutdown", "days", "end"), Easing.out(Easing.cubic));
  const aside = rise(frame, swap + 2);

  return (
    <>
      <SectionNumeral n="04" p={numeral * (1 - exit)} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-out * 40}px)` }}>
        <Headline size={150} style={{ top: 230, ...riseStyle(head, 0, 50) }}>
          NO DEAL?
        </Headline>
      </div>

      <Aside size={120} style={{ top: 250, opacity: Math.min(1, aside) * (1 - exit) }}>
        last year:
      </Aside>
      <Headline size={175} style={{ top: 380, opacity: Math.min(1, Math.max(0, days) * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, days))})`, transformOrigin: "0 50%" }}>
        <Accent>{roll(0, SHUTDOWN_DAYS, count)}</Accent> DAYS
      </Headline>

      <div style={{ position: "absolute", inset: 0, ...riseStyle(dome, exit, 60) }}>
        <CapitolDome size={620} style={{ position: "absolute", left: 230, top: 680, opacity: 0.95 }} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, drop * 3) * (1 - exit), transform: `translateY(${(1 - drop) * -700}px)` }}>
        <HangingSign left={230} top={540} width={620} height={250} angle={angle}>
          <div style={{ fontFamily: FONT.display, fontSize: 140, lineHeight: 1, color: US.red, letterSpacing: -1 }}>CLOSED</div>
        </HangingSign>
      </div>
    </>
  );
};
