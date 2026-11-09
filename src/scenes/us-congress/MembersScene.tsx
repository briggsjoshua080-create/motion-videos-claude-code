import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, MEMBERS, US, type SceneProps } from "./constants";
import { Aside, ChatWindow, Headline, SectionNumeral, roll, wobble } from "./ui";

const WIN = { left: 190, top: 880, width: 700, height: 300 } as const;
const COLS = 35;

/**
 * "Congress: 535 members." Section 01 opens: CONGRESS, a 535 counter and "members.", over the
 * group chat, whose body fills with 535 member dots as the number rolls up (loop 1, partly).
 */
export const MembersScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = rise(frame, 1);
  const num = rise(frame, cue("members", "535") - 6);
  const count = progress(frame, cue("members", "535") - 2, cue("members", "535", "end"), Easing.out(Easing.cubic));
  const aside = rise(frame, cue("members", "members") - 6);
  const win = rise(frame, 4);

  return (
    <>
      <SectionNumeral n="01" p={numeral * (1 - exit)} />
      <Headline size={130} style={{ top: 250, ...riseStyle(head, exit, 50) }}>
        CONGRESS
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 400,
          fontFamily: FONT.display,
          fontSize: 340,
          lineHeight: 0.92,
          letterSpacing: -6,
          color: US.white,
          textShadow: "0 0 60px rgba(255,255,255,0.35)",
          ...riseStyle(num, exit, 60),
        }}
      >
        {roll(0, MEMBERS, count)}
      </div>
      <Aside size={120} style={{ top: 735, ...riseStyle(aside, exit, 30) }}>
        members.
      </Aside>
      <div style={{ position: "absolute", inset: 0, ...riseStyle(win, exit, 60) }}>
        <ChatWindow width={WIN.width} height={WIN.height} style={{ left: WIN.left, top: WIN.top }}>
          {Array.from({ length: MEMBERS }, (_, i) => {
            const on = count * MEMBERS - i;
            if (on <= 0) return null;
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const house = i < 435;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 28 + col * 18.6,
                  top: 90 + row * 12 + (wobble(`m${i}`) - 0.5) * 2,
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: house ? "#2F6FDE" : US.red,
                  opacity: Math.min(1, on / 8),
                }}
              />
            );
          })}
        </ChatWindow>
      </div>
    </>
  );
};
