import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../../components/explainer/motion";
import { EU, PALETTE as C, PER_MEP, type SceneProps } from "../constants";
import { Card, CardTitle, MiniFlag, PersonGlyph } from "../ui";

const fmt = (n: number) => Math.round(n).toLocaleString("en-GB");

/**
 * "Per person, though, Malta has about nine times as many MEPs as Germany."
 * One German MEP stands for about 870,000 people, one Maltese MEP for about 96,000.
 */
export const PerPersonScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const card = rise(frame, 0);
  const count = progress(frame, 4, 34);
  const maltaHi = pop(frame, cue("perPerson", "Malta") - 4);
  const nine = pop(frame, cue("perPerson", "nine") - 4);
  const germanyHi = pop(frame, cue("perPerson", "Germany") - 4);
  const glyphs = Math.round(PER_MEP.germany.people / PER_MEP.malta.people); // 9

  const rows = [
    { country: "germany" as const, name: "Germany", people: PER_MEP.germany.people, n: glyphs, hi: germanyHi, top: 120 },
    { country: "malta" as const, name: "Malta", people: PER_MEP.malta.people, n: 1, hi: maltaHi, top: 330 },
  ];

  return (
    <Card top={400} height={720} style={{ padding: "34px 40px", ...riseStyle(card, exit) }}>
      <CardTitle color={C.ink}>ONE MEP REPRESENTS ABOUT</CardTitle>
      {rows.map((row) => (
        <div
          key={row.name}
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            top: row.top,
            height: 180,
            borderRadius: 22,
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            gap: 22,
            background: `rgba(255,229,138,${0.55 * Math.min(1, Math.max(0, row.hi))})`,
          }}
        >
          <div style={{ width: 150, display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
            <MiniFlag country={row.country} width={78} />
            <div style={{ fontSize: 32, fontWeight: 800, color: C.ink }}>{row.name}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", width: 232, flexShrink: 0 }}>
            <div style={{ fontSize: 54, fontWeight: 800, letterSpacing: -2, color: EU.blue, lineHeight: 1 }}>{fmt(row.people * count)}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.inkSoft, marginTop: 6 }}>people</div>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {Array.from({ length: row.n }, (_, k) => {
              const v = Math.min(1, Math.max(0, count * (row.n + 2) - k));
              return (
                <div key={k} style={{ opacity: v, transform: `translateY(${(1 - v) * 12}px) scale(${1 + 0.15 * Math.sin(Math.PI * Math.min(1, row.hi))})` }}>
                  <PersonGlyph size={42} color={row.country === "malta" ? EU.yellowDeep : C.inkSoft} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 548,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          opacity: Math.min(1, nine * 1.4),
          transform: `scale(${0.7 + 0.3 * nine})`,
        }}
      >
        <div
          style={{
            padding: "10px 28px",
            borderRadius: 999,
            background: EU.yellow,
            color: C.ink,
            fontSize: 44,
            fontWeight: 900,
          }}
        >
          ≈ 9×
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: C.ink, lineHeight: 1.15 }}>
          more MEPs per person
          <br />
          <span style={{ color: C.inkSoft, fontWeight: 600, fontSize: 28 }}>in Malta than in Germany</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontSize: 24, fontWeight: 600, color: C.muted }}>
        Population at the end of 2024 ÷ seats (96 and 6)
      </div>
    </Card>
  );
};
