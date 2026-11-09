import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, IGNORE_DAYS, US, type SceneProps } from "./constants";
import { Accent, Headline, Mark, Stamp, WipeLayer } from "./ui";

const BOX = { left: 120, top: 640, size: 148, gap: 25 } as const;

/**
 * "Now it gets strange: ignore a bill for ten days, and it's law anyway!" Re-hook 2 (rule 5) on a
 * full red flash: IT GETS / STRANGE, then ten day boxes tick off one by one (from "ignore" to
 * "days") and a LAW! stamp slams on "law" (loop 5, opened and answered).
 */
export const StrangeScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4)];
  const days = progress(frame, cue("strange", "ignore") - 2, cue("strange", "days", "end") + 2);
  const boxes = rise(frame, cue("strange", "ignore") - 8);
  const stamp = pop(frame, cue("strange", "law") - 4);

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <Headline size={150} tone="flash" style={{ top: 240, ...riseStyle(head[0], exit, 40) }}>
        IT GETS
      </Headline>
      <Headline size={150} tone="flash" style={{ top: 240 + 150 * 0.98 + 8, ...riseStyle(head[1], exit, 40) }}>
        <Accent tone="flash">STRANGE</Accent>
      </Headline>

      <div style={{ position: "absolute", inset: 0, ...riseStyle(boxes, exit, 40) }}>
        {Array.from({ length: IGNORE_DAYS }, (_, i) => {
          const on = Math.min(1, Math.max(0, days * IGNORE_DAYS - i) * 1.4);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: BOX.left + (i % 5) * (BOX.size + BOX.gap),
                top: BOX.top + Math.floor(i / 5) * (BOX.size + BOX.gap),
                width: BOX.size,
                height: BOX.size,
                borderRadius: 22,
                background: on > 0 ? US.white : "rgba(255,255,255,0.16)",
                border: "5px solid rgba(255,255,255,0.85)",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT.display,
                fontSize: 110,
                color: US.red,
              }}
            >
              {on > 0 && i === IGNORE_DAYS - 1 ? "10" : on > 0 ? <Mark ok size={92} p={on} color={US.red} width={11} /> : null}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <Stamp p={stamp} size={175} color={US.red} fill={US.white} rotate={-8} style={{ left: 330, top: 905 }}>
          LAW!
        </Stamp>
      </div>
    </>
  );
};
