import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BURNHAM_SHARE, FONT, NOMINATION_SHARE, UK, type SceneProps } from "./constants";
import { Accent, Headline, SectionNumeral, Stamp, roll } from "./ui";

const BAR = { left: 120, top: 640, width: 840, height: 110 } as const;

/**
 * "Candidates need a fifth of Labour's MPs. Burnham got 90%. Rivals: zero." Section 05, the
 * leadership race: NEED 1/5 over a bar of Labour MPs with a red line at 20%; on "Burnham" the
 * headline turns into GOT 90% and the bar fills (counting up) far past the line; on "Rivals" a
 * RIVALS: 0 stamp lands (nobody else could reach 20%).
 */
export const ContestScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const swapAt = cue("contest", "Burnham") - 4;
  const first = rise(frame, 1) * (1 - progress(frame, swapAt - 4, swapAt + 2));
  const second = pop(frame, swapAt);
  const bar = rise(frame, 3);
  const mark = pop(frame, cue("contest", "fifth") - 4);
  const fill = progress(frame, swapAt, cue("contest", "90%", "end") + 2, Easing.out(Easing.cubic));
  const stamp = progress(frame, cue("contest", "Rivals") - 2, cue("contest", "Rivals") + 4, Easing.in(Easing.cubic));
  const markX = BAR.left + BAR.width * NOMINATION_SHARE;

  return (
    <>
      <SectionNumeral n="05" p={numeral * (1 - exit)} />
      {first > 0.01 && (
        <Headline size={150} style={{ top: 300, opacity: first * (1 - exit), transform: `translateY(${(1 - first) * 30}px)` }}>
          NEED <Accent>1/5</Accent>
        </Headline>
      )}
      {second > 0 && (
        <Headline size={170} style={{ top: 290, opacity: Math.min(1, second * 1.6) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, second)})`, transformOrigin: "0 50%" }}>
          GOT <Accent>{roll(0, Math.round(BURNHAM_SHARE * 100), fill)}%</Accent>
        </Headline>
      )}

      <div style={{ position: "absolute", inset: 0, ...riseStyle(bar, exit, 40) }}>
        <div
          style={{
            position: "absolute",
            left: BAR.left,
            top: BAR.top,
            width: BAR.width,
            height: BAR.height,
            borderRadius: 24,
            background: "rgba(255,255,255,0.12)",
            boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.55)",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: BAR.width * BURNHAM_SHARE * fill, background: UK.white }} />
        </div>
        <div style={{ position: "absolute", left: markX - 6, top: BAR.top - 40, width: 12, height: BAR.height + 80, borderRadius: 6, background: UK.red, opacity: Math.min(1, Math.max(0, mark) * 1.5), transform: `scaleY(${Math.min(1.05, Math.max(0, mark))})`, boxShadow: "0 0 0 3px rgba(255,255,255,0.9)" }} />
        <div style={{ position: "absolute", left: markX - 60, top: BAR.top + BAR.height + 60, fontFamily: FONT.display, fontSize: 110, lineHeight: 1, color: UK.white, opacity: Math.min(1, Math.max(0, mark) * 1.5) }}>1/5</div>
      </div>
      <Stamp p={stamp} fade={1 - exit} color={UK.white} fill={UK.red} size={125} rotate={-7} style={{ left: 170, top: 960 }}>
        RIVALS: 0
      </Stamp>
    </>
  );
};
