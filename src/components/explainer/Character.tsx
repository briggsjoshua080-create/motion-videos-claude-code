import React from "react";
import type { ExplainerPalette } from "./palette";

export type CharacterProps = {
  size: number;
  /** Background disc colour. */
  bg: string;
  palette: ExplainerPalette;
  /** "suit" for politicians and candidates, "robe" (with ermine collar) for monarchs, "dress". */
  outfit?: "suit" | "robe" | "dress";
  /** Main clothing colour (suit, robe or dress). */
  clothes: string;
  tie?: string;
  /** Diagonal sash across the chest (royals). */
  sash?: string;
  hair: string;
  hairStyle?: "short" | "side" | "receding" | "long" | "bob";
  headwear?: "none" | "crown" | "tiara";
  /** Crown/tiara colours: [metal, jewel]. */
  jewels?: [string, string];
  /** Rosette on the lapel (election candidate), in this colour. */
  rosette?: string;
  glasses?: boolean;
  /** Unique id: keeps the SVG clip paths of several characters apart. */
  id: string;
};

/** Ermine collar: white fur with black tails. */
const ErmineCollar: React.FC<{ white: string; ink: string }> = ({ white, ink }) => (
  <g>
    <path d="M30 172 C46 142 74 130 100 130 C126 130 154 142 170 172 L152 186 C138 162 120 152 100 152 C80 152 62 162 48 186 Z" fill={white} />
    {[
      [56, 160],
      [76, 146],
      [100, 141],
      [124, 146],
      [144, 160],
      [66, 172],
      [134, 172],
    ].map(([x, y]) => (
      <path key={`${x}-${y}`} d={`M${x} ${y} l3 7 l-6 0 z`} fill={ink} />
    ))}
  </g>
);

/**
 * Flat, friendly character bust (the GermanElection style), extended for any role:
 * monarchs (crown + robe + sash), royals (tiara), politicians (suit + tie), candidates (rosette).
 */
export const Character: React.FC<CharacterProps> = ({
  size,
  bg,
  palette: c,
  outfit = "suit",
  clothes,
  tie,
  sash,
  hair,
  hairStyle = "short",
  headwear = "none",
  jewels,
  rosette,
  glasses = false,
  id,
}) => {
  const [metal, jewel] = jewels ?? [c.accent, c.alert];
  const longHair = hairStyle === "long" || hairStyle === "bob";
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <clipPath id={`${id}-disc`}>
          <circle cx={100} cy={100} r={100} />
        </clipPath>
      </defs>
      <circle cx={100} cy={100} r={100} fill={bg} />
      <g clipPath={`url(#${id}-disc)`}>
        {/* Hair that falls behind the shoulders */}
        {hairStyle === "long" ? <path d="M58 86 C54 44 76 30 100 30 C124 30 146 44 142 86 L150 156 L50 156 Z" fill={hair} /> : null}
        {hairStyle === "bob" ? <path d="M60 84 C56 46 78 32 100 32 C122 32 144 46 140 84 L143 116 C130 124 70 124 57 116 Z" fill={hair} /> : null}
        <rect x={87} y={104} width={26} height={34} rx={10} fill={c.skinShade} />
        <path d="M22 210 C22 156 56 130 100 130 C144 130 178 156 178 210 Z" fill={clothes} />
        {outfit === "suit" ? (
          <>
            <path d="M82 131 L100 166 L118 131 Z" fill={c.white} />
            <path d="M96 138 L104 138 L108 172 L100 184 L92 172 Z" fill={tie ?? c.alert} />
            <path d="M82 131 L72 210 L100 166 Z" fill="rgba(0,0,0,0.18)" />
            <path d="M118 131 L128 210 L100 166 Z" fill="rgba(0,0,0,0.1)" />
          </>
        ) : null}
        {outfit === "dress" ? (
          <>
            <path d="M80 131 Q100 162 120 131 Z" fill={c.skin} />
            <path d="M84 140 Q100 160 116 140" stroke={c.white} strokeWidth={3} fill="none" strokeLinecap="round" />
          </>
        ) : null}
        {outfit === "robe" ? (
          <>
            <path d="M86 140 L100 162 L114 140 Z" fill={c.white} />
            {sash ? <path d="M64 146 L84 136 L150 210 L122 210 Z" fill={sash} /> : null}
            <ErmineCollar white={c.white} ink={c.ink} />
          </>
        ) : null}
        {rosette ? (
          <g transform="translate(140 166)">
            <circle r={13} fill={rosette} />
            <circle r={6} fill={c.white} />
            <path d="M-6 10 L-10 30 L-2 25 L2 30 L6 10 Z" fill={rosette} />
          </g>
        ) : null}
      </g>
      {!longHair ? (
        <>
          <circle cx={65} cy={84} r={8} fill={c.skin} />
          <circle cx={135} cy={84} r={8} fill={c.skin} />
        </>
      ) : null}
      <ellipse cx={100} cy={80} rx={35} ry={41} fill={c.skin} />
      {hairStyle === "short" ? (
        <path d="M64 80 C60 48 78 36 100 36 C124 36 142 50 136 80 C132 64 120 56 100 56 C80 56 68 64 64 80 Z" fill={hair} />
      ) : null}
      {hairStyle === "side" ? (
        <path d="M64 82 C58 46 80 32 106 34 C130 36 142 52 136 80 C132 66 122 56 104 54 C96 62 80 66 64 82 Z" fill={hair} />
      ) : null}
      {hairStyle === "receding" ? (
        <path d="M64 84 C62 64 66 50 74 46 C70 60 72 70 76 78 Z M136 84 C138 64 134 50 126 46 C130 60 128 70 124 78 Z" fill={hair} />
      ) : null}
      {longHair ? <path d="M64 80 C62 50 80 38 100 38 C120 38 138 50 136 80 C128 60 114 52 98 56 C86 58 72 66 64 80 Z" fill={hair} /> : null}
      <circle cx={87} cy={84} r={3.6} fill={c.ink} />
      <circle cx={113} cy={84} r={3.6} fill={c.ink} />
      <path d="M90 104 Q100 109 110 104" stroke={c.skinShade} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {glasses ? (
        <g stroke={c.ink} strokeWidth={3} fill="none">
          <rect x={74} y={76} width={22} height={16} rx={6} />
          <rect x={104} y={76} width={22} height={16} rx={6} />
          <path d="M96 83 L104 83" />
        </g>
      ) : null}
      {headwear === "crown" ? (
        <g stroke={c.ink} strokeWidth={2.5} strokeLinejoin="round">
          <path d="M64 46 L60 12 L81 30 L100 2 L119 30 L140 12 L136 46 Z" fill={metal} />
          <rect x={60} y={38} width={80} height={15} rx={5} fill={metal} />
          <circle cx={60} cy={11} r={5} fill={c.white} />
          <circle cx={100} cy={2} r={6} fill={c.white} />
          <circle cx={140} cy={11} r={5} fill={c.white} />
          <circle cx={82} cy={45.5} r={4} fill={jewel} strokeWidth={0} />
          <circle cx={100} cy={45.5} r={4.5} fill={c.white} strokeWidth={0} />
          <circle cx={118} cy={45.5} r={4} fill={jewel} strokeWidth={0} />
        </g>
      ) : null}
      {headwear === "tiara" ? (
        <g stroke={c.ink} strokeWidth={2} strokeLinejoin="round">
          <path d="M72 46 C82 38 92 35 100 35 C108 35 118 38 128 46 L124 50 C116 44 108 42 100 42 C92 42 84 44 76 50 Z" fill={metal} />
          <path d="M86 40 L90 30 L94 38 Z M96 36 L100 22 L104 36 Z M106 38 L110 30 L114 40 Z" fill={metal} />
          <circle cx={100} cy={30} r={3.5} fill={jewel} strokeWidth={0} />
        </g>
      ) : null}
    </svg>
  );
};
