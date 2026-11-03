import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { RU, type SceneProps } from "./constants";
import { Accent, Headline, Mark, WipeLayer } from "./ui";

/** A generic ballot slip: a coloured top strip, grey bars for the small print, one ticked square. */
export const Slip: React.FC<{ w: number; h: number; strip: string; rows?: number; pick?: number; tick?: number; icon?: "party" | "person" }> = ({
  w,
  h,
  strip,
  rows = 4,
  pick = -1,
  tick = 0,
  icon = "party",
}) => {
  const rowH = (h - 60) / rows;
  const box = Math.min(64, rowH - 30);
  const colors = ["#5B8DEF", "#C0392B", "#3FB8AF", "#E0A21B", "#7A4FB3"];
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 14, background: RU.card, boxShadow: "0 24px 50px rgba(20,30,50,0.25)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: 30, background: strip }} />
      {Array.from({ length: rows }, (_, i) => {
        const y = 46 + i * rowH;
        const on = i === pick;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: y, width: w, height: rowH }}>
            {icon === "party" ? (
              <div style={{ position: "absolute", left: 24, top: (rowH - 44) / 2, width: 44, height: 44, borderRadius: 8, background: colors[i % colors.length] }} />
            ) : (
              <div style={{ position: "absolute", left: 24, top: (rowH - 48) / 2, width: 48, height: 48, borderRadius: 24, background: "rgba(14,26,36,0.25)" }} />
            )}
            <div style={{ position: "absolute", left: 88, top: rowH / 2 - 18, width: w - 88 - box - 50 - (i % 2) * 30, height: 18, borderRadius: 9, background: on ? "rgba(14,26,36,0.55)" : RU.inkFaint }} />
            <div style={{ position: "absolute", left: 88, top: rowH / 2 + 8, width: (w - 88 - box - 50) * 0.6, height: 12, borderRadius: 6, background: RU.inkFaint }} />
            <div style={{ position: "absolute", left: w - 24 - box, top: (rowH - box) / 2, width: box, height: box, border: `4px solid ${on ? RU.ink : "rgba(14,26,36,0.45)"}`, borderRadius: 6, boxSizing: "border-box" }} />
            {on && (
              <div style={{ position: "absolute", left: w - 24 - box - 4, top: (rowH - box) / 2 - 10 }}>
                <Mark ok size={box + 14} p={tick} color={RU.pen} width={10} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * "But here's the weird part: you vote twice." Re-hook 1 (rule 5, at about 13 s): a full red flash
 * as the pattern break, two ballot slips that fan out, and YOU VOTE TWICE? (up from the first
 * frames, so it stays 2 s).
 */
export const RehookScene: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const fan = [pop(frame, 3), pop(frame, 8)];
  const head = [rise(frame, 0), rise(frame, 3)];

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 300 + i * 120,
            top: 300 + i * 30,
            opacity: Math.min(1, Math.max(0, fan[i]) * 1.5) * (1 - exit),
            transform: `rotate(${(i === 0 ? -10 : 8) * Math.min(1.05, fan[i])}deg) scale(${0.7 + 0.3 * Math.min(1.05, fan[i])})`,
            transformOrigin: "50% 100%",
          }}
        >
          <Slip w={360} h={420} strip={i === 0 ? RU.blue : RU.navy} rows={3} icon={i === 0 ? "party" : "person"} />
        </div>
      ))}
      <Headline size={130} tone="flash" style={{ top: 800, ...riseStyle(head[0], exit, 40) }}>
        YOU VOTE
      </Headline>
      <Headline size={175} tone="flash" style={{ top: 800 + 140, ...riseStyle(head[1], exit, 40) }}>
        <Accent tone="flash">TWICE?</Accent>
      </Headline>
    </>
  );
};
