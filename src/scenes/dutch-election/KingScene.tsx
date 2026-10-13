import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { ease, enter, float } from "../../lib/animation";
import { Crown, DrawnPath, Medallion, NL, SceneFrame, SceneHeader, pop, progress, type SceneProps } from "./ui";

const X = 300; // centre line of the family chain
const ROWS = {
  beatrix: { y: 430, r: 50 },
  king: { y: 720, r: 100 },
  amalia: { y: 975, r: 70 },
} as const;
const LABEL_X = 440;
/** Crown: small above Queen Beatrix, then big on the King's badge (top edge, px). */
const CROWN_FROM = { top: 325, size: 70 };
const CROWN_TO = { top: 520, size: 150 };

const Label: React.FC<{ top: number; p: number; kicker?: string; name: string; sub: string; nameSize: number; subColor?: string }> = ({
  top,
  p,
  kicker,
  name,
  sub,
  nameSize,
  subColor = NL.mist,
}) => (
  <div
    style={{
      position: "absolute",
      left: LABEL_X,
      top,
      transform: `translateY(-50%) translateX(${(1 - p) * 40}px)`,
      opacity: p,
      fontFamily: theme.font,
      color: NL.white,
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}
  >
    {kicker ? <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 6, color: NL.orangeLight }}>{kicker}</div> : null}
    <div style={{ fontSize: nameSize, fontWeight: 900, letterSpacing: -1, lineHeight: 1.05 }}>{name}</div>
    <div style={{ fontSize: 34, fontWeight: 700, color: subColor }}>{sub}</div>
  </div>
);

/** "King Willem-Alexander inherited the crown. His daughter Amalia is next." */
export const KingScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const beatrix = enter(frame, 2);
  const king = pop(frame, cue("king", "King") - 3);
  const inherit = ease(frame, [cue("king", "inherited") - 2, cue("king", "crown") + 6]);
  const line1 = progress(frame, cue("king", "inherited") - 4, cue("king", "crown"));
  const line2 = progress(frame, cue("king", "daughter") - 4, cue("king", "Amalia"));
  const amalia = pop(frame, cue("king", "Amalia") - 3);
  const next = enter(frame, cue("king", "next") - 4);

  // The crown travels from Queen Beatrix to the King while the voice says "inherited the crown".
  const crownTop = interpolate(inherit, [0, 1], [CROWN_FROM.top, CROWN_TO.top]);
  const crownSize = interpolate(inherit, [0, 1], [CROWN_FROM.size, CROWN_TO.size]);

  return (
    <SceneFrame duration={duration}>
      <SceneHeader kicker="HEAD OF STATE" title="INHERITED, NOT ELECTED" titleSize={64} />

      {/* Dotted family line: mother -> son -> granddaughter, drawn on "inherited" and "daughter". */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <DrawnPath
          d={`M${X - 52} ${ROWS.beatrix.y + 10} C${X - 160} ${ROWS.beatrix.y + 80} ${X - 170} ${ROWS.king.y - 90} ${X - 102} ${ROWS.king.y - 20}`}
          p={line1}
          color={NL.orangeLight}
          width={7}
        />
        <DrawnPath
          d={`M${X - 100} ${ROWS.king.y + 30} C${X - 165} ${ROWS.king.y + 110} ${X - 160} ${ROWS.amalia.y - 60} ${X - 72} ${ROWS.amalia.y - 6}`}
          p={line2}
          color={NL.orangeLight}
          width={7}
        />
      </svg>

      <div style={{ position: "absolute", left: X - ROWS.beatrix.r, top: ROWS.beatrix.y - ROWS.beatrix.r, opacity: beatrix }}>
        <Medallion r={ROWS.beatrix.r} ring={NL.mist} id="beatrix" dim />
      </div>
      <Label top={ROWS.beatrix.y} p={beatrix} name="QUEEN BEATRIX" sub="until 2013" nameSize={42} />

      <div
        style={{
          position: "absolute",
          left: X - ROWS.king.r,
          top: ROWS.king.y - ROWS.king.r,
          transform: `scale(${king})`,
        }}
      >
        <Medallion r={ROWS.king.r} ring={NL.orange} id="king" />
      </div>
      <Label top={ROWS.king.y + 10} p={king} kicker="KING" name="WILLEM-ALEXANDER" sub="since 2013" nameSize={48} />

      <div
        style={{
          position: "absolute",
          left: X - crownSize / 2,
          top: crownTop + float(frame, 4, 60),
          opacity: beatrix,
          filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.4))",
        }}
      >
        <Crown size={crownSize} id="king-crown" />
      </div>

      <div style={{ position: "absolute", left: X - ROWS.amalia.r, top: ROWS.amalia.y - ROWS.amalia.r, transform: `scale(${amalia})` }}>
        <Medallion r={ROWS.amalia.r} ring={NL.orangeLight} id="amalia" />
      </div>
      <Label top={ROWS.amalia.y} p={amalia} name="PRINCESS AMALIA" sub="next in line" nameSize={44} subColor={NL.orangeLight} />

      {/* A faint crown waiting above Amalia on "next". */}
      <div
        style={{
          position: "absolute",
          left: X - 40,
          top: ROWS.amalia.y - ROWS.amalia.r - 66,
          opacity: 0.6 * next,
          transform: `translateY(${(1 - next) * 20}px)`,
        }}
      >
        <Crown size={80} id="amalia-crown" />
      </div>
    </SceneFrame>
  );
};
