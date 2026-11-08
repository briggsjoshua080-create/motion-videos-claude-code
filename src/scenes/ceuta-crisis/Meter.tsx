import React from "react";
import { CE, FONT } from "./constants";

/** A likelihood gauge (LOW -> HIGH): a half dial from white to orange, with a needle at `value` (0..1). */
export const Meter: React.FC<{ value: number; opacity?: number; cy?: number }> = ({ value, opacity = 1, cy = 1000 }) => {
  const cx = 540;
  const r = 300;
  const segs = 7;
  const a = Math.PI * (1 - value);
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity }}>
        {Array.from({ length: segs }, (_, i) => {
          const a0 = Math.PI * (1 - i / segs) - 0.03;
          const a1 = Math.PI * (1 - (i + 1) / segs) + 0.03;
          const p = (ang: number, rr: number) => `${cx + Math.cos(ang) * rr} ${cy - Math.sin(ang) * rr}`;
          const t = i / (segs - 1);
          const color = `rgb(${Math.round(236 + (255 - 236) * t)}, ${Math.round(244 + (106 - 244) * t)}, ${Math.round(250 + (19 - 250) * t)})`;
          return <path key={i} d={`M${p(a0, r)} A${r} ${r} 0 0 1 ${p(a1, r)} L${p(a1, r - 70)} A${r - 70} ${r - 70} 0 0 0 ${p(a0, r - 70)} Z`} fill={color} opacity={0.9} />;
        })}
        <line x1={cx} y1={cy} x2={cx + Math.cos(a) * (r - 30)} y2={cy - Math.sin(a) * (r - 30)} stroke={CE.white} strokeWidth={16} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={30} fill={CE.orange} stroke={CE.white} strokeWidth={6} />
      </svg>
      {(["LOW", "HIGH"] as const).map((label, i) => (
        <div key={label} style={{ position: "absolute", top: cy + 30, left: i === 0 ? 150 : undefined, right: i === 1 ? 150 : undefined, fontFamily: FONT.display, fontSize: 110, lineHeight: 1, color: i === 0 ? CE.white : CE.orange, opacity: opacity * (0.55 + 0.45 * (i === 0 ? 1 - value : value)) }}>
          {label}
        </div>
      ))}
    </>
  );
};
