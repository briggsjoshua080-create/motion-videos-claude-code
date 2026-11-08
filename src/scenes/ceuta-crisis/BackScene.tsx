import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CE, FONT, WENT_BACK, type SceneProps } from "./constants";
import { Aside, SectionNumeral, roll } from "./ui";

/**
 * "Within days, almost all went back." Section 03 (what came next): a counter rolls up to 70,000 (Spain's
 * count of returns by 4 Aug) while rows of chevrons stream left, back towards Morocco; "went back.".
 */
export const BackScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const count = rise(frame, 2);
  const n = roll(0, WENT_BACK, progress(frame, 4, cue("back", "all"), Easing.out(Easing.cubic)));
  const aside = rise(frame, 6);

  return (
    <>
      <SectionNumeral n="03" p={numeral * (1 - exit)} />
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 360,
          fontFamily: FONT.display,
          fontSize: 210,
          lineHeight: 0.92,
          letterSpacing: -4,
          color: CE.white,
          textShadow: "0 0 60px rgba(255,106,19,0.55), 0 0 4px rgba(255,255,255,0.6)",
          whiteSpace: "nowrap",
          ...riseStyle(count, exit, 60),
        }}
      >
        {n.toLocaleString("en-US")}
      </div>
      <Aside size={124} style={{ top: 600, ...riseStyle(aside, exit, 30) }}>
        went back.
      </Aside>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: (1 - exit) * Math.min(1, frame / 8) }}>
        {Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 6 }, (_, c) => {
            const x = ((1100 - ((frame * 9 + c * 190 + r * 70) % 1300)) + 1300) % 1300 - 100;
            const y = 840 + r * 85;
            return <path key={`${r}-${c}`} d={`M${x + 34} ${y - 30} L${x} ${y} L${x + 34} ${y + 30}`} fill="none" stroke={r % 2 ? CE.orange : CE.white} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />;
          }),
        )}
      </svg>
    </>
  );
};
