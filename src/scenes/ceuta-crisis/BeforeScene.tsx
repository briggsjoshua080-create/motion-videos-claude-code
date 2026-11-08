import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CE, FONT, type SceneProps } from "./constants";
import { Accent, Headline } from "./ui";

/**
 * "It's not the first time: in May 2021, thousands crossed too." Evidence for "again?": a timeline line
 * draws from 2021 to 2026, both marked by orange swimmer bursts; NOT THE / FIRST TIME. (May 2021: about
 * 8,000-10,000 people, after Spain treated the Polisario leader in hospital; see script.md.)
 */
export const BeforeScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 1), rise(frame, 4)];
  const line = progress(frame, 4, cue("before", "2021"));
  const marks = [pop(frame, cue("before", "May") - 4), pop(frame, cue("before", "thousands") - 2)];
  const y = 960;
  const xs = [220, 860];
  const label = (text: string, x: number, p: number, i: number) => (
    <div
      key={text}
      style={{
        position: "absolute",
        left: x - 160,
        width: 320,
        top: y + 70,
        textAlign: "center",
        fontFamily: FONT.display,
        fontSize: 110,
        lineHeight: 1,
        color: i === 0 ? CE.orange : CE.white,
        opacity: Math.min(1, Math.max(0, p) * 1.5) * (1 - exit),
        transform: `translateY(${(1 - Math.min(1, Math.max(0, p))) * 30}px)`,
      }}
    >
      {text}
    </div>
  );

  return (
    <>
      <Headline size={130} style={{ top: 280, ...riseStyle(head[0], exit, 50) }}>
        NOT THE
      </Headline>
      <Headline size={130} style={{ top: 280 + 135, ...riseStyle(head[1], exit, 50) }}>
        <Accent>FIRST TIME</Accent>
      </Headline>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <line x1={xs[0]} x2={xs[0] + (xs[1] - xs[0]) * line} y1={y} y2={y} stroke={CE.white} strokeWidth={8} strokeLinecap="round" />
        {[2022, 2023, 2024, 2025].map((yr, i) => {
          const x = xs[0] + ((xs[1] - xs[0]) * (i + 1)) / 5;
          return <circle key={yr} cx={x} cy={y} r={10} fill={CE.bg} stroke={CE.white} strokeWidth={4} opacity={line > (i + 1) / 5 ? 0.8 : 0} />;
        })}
        {xs.map((x, i) => {
          const p = Math.max(0, marks[i]);
          return (
            <g key={x} transform={`translate(${x} ${y}) scale(${Math.min(1.1, p)})`}>
              {Array.from({ length: 14 }, (_, k) => {
                const a = (k / 14) * Math.PI * 2;
                const r = 70 + (k % 3) * 22;
                return <circle key={k} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.7 - 40} r={10} fill={i === 0 ? CE.orange : CE.white} opacity={0.85} />;
              })}
              <circle r={26} fill={CE.orange} stroke={CE.white} strokeWidth={6} />
            </g>
          );
        })}
      </svg>
      {label("2021", xs[0], marks[0], 0)}
      {label("2026", xs[1], marks[1], 1)}
    </>
  );
};
