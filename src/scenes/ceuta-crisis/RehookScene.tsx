import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CE, type SceneProps } from "./constants";
import { Accent, Headline, WipeLayer } from "./ui";

/**
 * "But here's the weird part: they thought the border was open." Re-hook 1 (rule 5) on a full orange
 * flash: a gate in the fence swings open, BORDER / OPEN? (up from the first frames, so 2 s+).
 */
export const RehookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 2), pop(frame, 6)];
  const swing = progress(frame, cue("rehook", "open") - 18, cue("rehook", "open") + 2);
  const gate = rise(frame, 4);
  const angle = -72 * swing;

  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <Headline size={150} tone="flash" style={{ top: 330, ...riseStyle(head[0], exit, 40) }}>
        BORDER
      </Headline>
      <Headline
        size={200}
        tone="flash"
        style={{ top: 330 + 160, opacity: Math.min(1, Math.max(0, head[1]) * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.08, Math.max(0, head[1]))})`, transformOrigin: "0 50%" }}
      >
        <Accent tone="flash">OPEN?</Accent>
      </Headline>
      {/* A fence with a gate that swings open (perspective). */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, ...riseStyle(gate, exit, 60) }}>
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={120 + i * 70} x2={120 + i * 70} y1={820} y2={1160} stroke={CE.navy} strokeWidth={6} opacity={i >= 5 && i <= 8 ? 0 : 0.75} />
        ))}
        {[840, 1000, 1140].map((y) => (
          <g key={y}>
            <line x1={100} x2={440} y1={y} y2={y} stroke={CE.navy} strokeWidth={8} />
            <line x1={680} x2={980} y1={y} y2={y} stroke={CE.navy} strokeWidth={8} />
          </g>
        ))}
        <rect x={436} y={800} width={18} height={380} fill={CE.navy} />
        <rect x={666} y={800} width={18} height={380} fill={CE.navy} />
        <g transform={`translate(454 0) scale(${Math.cos((angle * Math.PI) / 180)} 1) translate(-454 0)`}>
          <rect x={454} y={820} width={212} height={340} fill="none" stroke={CE.navy} strokeWidth={10} />
          {[0, 1, 2].map((i) => (
            <line key={i} x1={454 + 53 * (i + 1)} x2={454 + 53 * (i + 1)} y1={820} y2={1160} stroke={CE.navy} strokeWidth={6} />
          ))}
          <line x1={454} x2={666} y1={820} y2={1160} stroke={CE.navy} strokeWidth={6} />
        </g>
      </svg>
    </>
  );
};
