import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, US, type SceneProps } from "./constants";
import { Aside, Bubble, ChatWindow, Figure, Headline, Mark, Scroll, Stamp } from "./ui";

const WIN = { top: 420, width: 400, height: 300 } as const;

/**
 * "Both chats pass the same text. He signs... or vetoes. Two thirds can overrule him." How a law is
 * made: the House chat and the Senate chat each send the same scroll; the two scrolls fly together
 * into one law that lands in front of the president; a white tick on "signs", then (after the
 * dramatic pause) a red VETO stamp on "vetoes". Then 2/3 rolls in and a white cross strikes the VETO
 * on "overrule" (loop 3 closed: the president only signs or vetoes; Congress can still win).
 */
export const LawScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const wins = [rise(frame, 1), rise(frame, 4)];
  const sends = [pop(frame, cue("law", "Both") + 2), pop(frame, cue("law", "chats") + 2)];
  const same = rise(frame, cue("law", "Both") - 4);
  const merge = progress(frame, cue("law", "text") - 4, cue("law", "He") + 2, Easing.inOut(Easing.cubic));
  const figure = rise(frame, cue("law", "He") - 8);
  const tick = progress(frame, cue("law", "signs") - 2, cue("law", "signs") + 8);
  const veto = pop(frame, cue("law", "vetoes") - 3);
  const two = cue("override", "Two") - 6;
  const swap = progress(frame, two, two + 8);
  const third = pop(frame, two + 2);
  const aside = rise(frame, cue("override", "can") - 6);
  const strike = progress(frame, cue("override", "overrule") - 2, cue("override", "overrule") + 10);
  const vetoHit = frame >= cue("law", "vetoes") + 1 && frame < cue("law", "vetoes") + 9 ? Math.sin((frame - cue("law", "vetoes")) * 2.6) * 8 : 0;

  // Where the two scrolls fly from (the windows' send bubbles) to (the desk).
  const desk = { x: 600, y: 900 };
  const from = [
    { x: 120 + WIN.width - 110, y: WIN.top + 200 },
    { x: 560 + WIN.width - 110, y: WIN.top + 200 },
  ];

  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: (1 - swap) * (1 - exit), transform: `translateY(${-swap * 50}px)` }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ position: "absolute", inset: 0, ...riseStyle(wins[i], 0, 50) }}>
            <ChatWindow width={WIN.width} height={WIN.height} header={i === 0 ? US.blue : US.navy} style={{ left: i === 0 ? 120 : 560, top: WIN.top }}>
              <Bubble p={1} width={240} style={{ left: 22, top: 80 }} />
              <Bubble p={merge > 0 ? 0 : sends[i]} side="right" width={150} height={84} kind="scroll" style={{ right: 22, top: 160 }} />
            </ChatWindow>
          </div>
        ))}
        <Headline size={130} style={{ top: 240, ...riseStyle(same, 0, 30) }}>
          SAME TEXT
        </Headline>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {merge > 0 &&
          from.map((f, i) => {
            const x = f.x + (desk.x - f.x) * merge;
            const y = f.y + (desk.y - f.y) * merge;
            return <Scroll key={i} size={110 + 110 * merge} style={{ position: "absolute", left: x - 50, top: y - 60, opacity: i === 1 && merge >= 1 ? 0 : 1, filter: "drop-shadow(0 18px 26px rgba(0,8,30,0.45))" }} />;
          })}
        <div style={{ position: "absolute", left: 150, top: 760, ...riseStyle(figure, 0, 60) }}>
          <Figure size={330} />
        </div>
        {tick > 0 && (
          <div style={{ position: "absolute", left: 780, top: 780 }}>
            <Mark ok size={170} p={tick} color={US.white} width={12} />
          </div>
        )}
        <div style={{ position: "absolute", left: 470 + vetoHit, top: 960 }}>
          <Stamp p={veto} size={160} color={US.white} fill={US.red} rotate={-10} style={{ position: "relative" }}>
            VETO
          </Stamp>
          {strike > 0 && (
            <div style={{ position: "absolute", left: 60, top: -40 }}>
              <Mark ok={false} size={260} p={strike} color={US.white} width={13} />
            </div>
          )}
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: swap * (1 - exit) }}>
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 220,
            fontFamily: FONT.display,
            fontSize: 300,
            lineHeight: 0.92,
            letterSpacing: -6,
            color: US.white,
            textShadow: "0 0 60px rgba(255,255,255,0.35)",
            opacity: Math.min(1, Math.max(0, third) * 1.5),
            transform: `scale(${0.7 + 0.3 * Math.min(1.08, Math.max(0, third))})`,
            transformOrigin: "0 50%",
          }}
        >
          2/3
        </div>
        <Aside size={118} style={{ top: 520, ...riseStyle(aside, 0, 30) }}>
          can overrule him.
        </Aside>
      </div>
    </>
  );
};
