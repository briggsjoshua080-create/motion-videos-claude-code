import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { enter, float } from "../../lib/animation";
import { Crown, DrawnPath, NL, Pill, SAFE, SceneFrame, SceneHeader, pop, progress, type SceneProps } from "./ui";

const DOC = { left: 230, top: 370, width: 620, height: 640 } as const;
const SIG_KING_Y = 790;
const SIG_MINISTER_Y = 925;

/** A loose handwritten squiggle ending on the signature line at y. */
const signature = (y: number) =>
  `M282 ${y - 14} C300 ${y - 70} 326 ${y - 72} 330 ${y - 30} S352 ${y + 6} 372 ${y - 44} S404 ${y - 92} 418 ${y - 30} ` +
  `S444 ${y - 4} 462 ${y - 50} S494 ${y - 76} 512 ${y - 26} S548 ${y - 18} 590 ${y - 40}`;

/** Placeholder text lines of the law: [y, relative width]. */
const TEXT_LINES: [number, number][] = [
  [505, 0.86],
  [545, 0.62],
  [585, 0.8],
  [625, 0.55],
];

/** "He signs every law, but his ministers take the responsibility." */
export const RoleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const doc = enter(frame, 0);
  const kingSig = progress(frame, cue("role", "signs") - 2, cue("role", "law", "end") + 4);
  const kingLabel = enter(frame, cue("role", "signs") - 4);
  const ministerSig = progress(frame, cue("role", "ministers") - 2, cue("role", "take", "end") + 4);
  const ministerLabel = enter(frame, cue("role", "ministers") - 4);
  const responsible = pop(frame, cue("role", "responsibility") - 4);

  return (
    <SceneFrame duration={duration}>
      <SceneHeader kicker="HEAD OF STATE" title="THE KING'S ROLE" />

      <div
        style={{
          position: "absolute",
          left: DOC.left,
          top: DOC.top + float(frame, 6, 110),
          width: DOC.width,
          height: DOC.height,
          borderRadius: 30,
          background: NL.paper,
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          opacity: doc,
          transform: `rotate(2deg) translateY(${(1 - doc) * 50}px)`,
        }}
      >
        <svg width={DOC.width} height={DOC.height} viewBox={`${DOC.left} ${DOC.top} ${DOC.width} ${DOC.height}`} style={{ position: "absolute", left: 0, top: 0 }}>
          <text x={DOC.left + 50} y={DOC.top + 72} fontFamily={theme.font} fontSize={44} fontWeight={900} fill={NL.ink}>
            ACT OF PARLIAMENT
          </text>
          <rect x={DOC.left + 50} y={DOC.top + 88} width={300} height={6} rx={3} fill={NL.orange} />
          {TEXT_LINES.map(([y, w]) => (
            <rect key={y} x={DOC.left + 50} y={y} width={(DOC.width - 230) * w} height={14} rx={7} fill={NL.inkSoft} opacity={0.35} />
          ))}
          {/* Royal seal */}
          <circle cx={DOC.left + 530} cy={DOC.top + 200} r={62} fill={NL.orange} opacity={0.18} />
          <circle cx={DOC.left + 530} cy={DOC.top + 200} r={50} fill="none" stroke={NL.orange} strokeWidth={5} />
          {/* Signature lines */}
          <line x1={DOC.left + 46} y1={SIG_KING_Y} x2={DOC.left + 380} y2={SIG_KING_Y} stroke={NL.ink} strokeWidth={3} opacity={0.5} />
          <line x1={DOC.left + 46} y1={SIG_MINISTER_Y} x2={DOC.left + 380} y2={SIG_MINISTER_Y} stroke={NL.ink} strokeWidth={3} opacity={0.5} />
          <DrawnPath d={signature(SIG_KING_Y)} p={kingSig} color={NL.blue} width={7} />
          <DrawnPath d={signature(SIG_MINISTER_Y)} p={ministerSig} color={NL.blue} width={7} />
        </svg>
        <div style={{ position: "absolute", left: 530 - 44, top: 200 - 36 }}>
          <Crown size={88} id="seal-crown" />
        </div>
        <div
          style={{
            position: "absolute",
            left: 400,
            top: SIG_KING_Y - DOC.top - 50,
            fontFamily: theme.font,
            fontSize: 40,
            fontWeight: 900,
            color: NL.ink,
            opacity: kingLabel,
            lineHeight: 1.1,
          }}
        >
          THE
          <br />
          KING
        </div>
        <div
          style={{
            position: "absolute",
            left: 400,
            top: SIG_MINISTER_Y - DOC.top - 50,
            fontFamily: theme.font,
            fontSize: 40,
            fontWeight: 900,
            color: NL.ink,
            opacity: ministerLabel,
            lineHeight: 1.1,
          }}
        >
          A<br />
          MINISTER
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: DOC.top + DOC.height + 44,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          opacity: Math.min(1, responsible * 1.4),
          transform: `scale(${0.6 + 0.4 * responsible})`,
        }}
      >
        <Pill size={40}>MINISTERS ARE RESPONSIBLE</Pill>
        <div style={{ fontFamily: theme.font, fontSize: 32, fontWeight: 700, color: NL.mist }}>Constitution, article 42</div>
      </div>
    </SceneFrame>
  );
};
