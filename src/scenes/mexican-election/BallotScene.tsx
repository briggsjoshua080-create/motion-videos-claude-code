import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ALLY, BALLOT_PARTIES, FONT, MX, PICKED, type SceneProps } from "./constants";
import { Accent, Eyebrow, Headline, Mono, PaperLayer, Stamp } from "./ui";

const RACES = ["PRESIDENT", "SENATE", "DEPUTIES"] as const;
const RACE = { top: 630, w: 264, h: 96, gap: 24 } as const;
const PAPER = { left: 120, top: 756, w: 840, h: 476 } as const;
const BOX = { left: 40, top: 110, w: 240, h: 148, gapX: 20, gapY: 18 } as const;

type Shape = (typeof BALLOT_PARTIES)[number]["shape"];

/** A made-up party logo: a simple shape in the party's colour. */
const Logo: React.FC<{ shape: Shape; color: string; size: number }> = ({ shape, color, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {shape === "circle" && <circle cx={50} cy={50} r={40} fill={color} />}
    {shape === "square" && <rect x={14} y={14} width={72} height={72} rx={12} fill={color} />}
    {shape === "triangle" && <path d="M50 10 L90 86 H10 Z" fill={color} />}
    {shape === "diamond" && <path d="M50 6 L94 50 L50 94 L6 50 Z" fill={color} />}
    {shape === "star" && <path d="M50 6 L61 38 H95 L67 58 L78 92 L50 72 L22 92 L33 58 L5 38 H39 Z" fill={color} />}
    {shape === "leaf" && <path d="M50 8 C82 22 90 62 50 92 C10 62 18 22 50 8 Z" fill={color} />}
  </svg>
);

/** A big hand-drawn X that draws itself (two strokes) when `p` goes 0 -> 1. */
const BigX: React.FC<{ p: number; size: number }> = ({ p, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -size / 2, marginTop: -size / 2, overflow: "visible" }}>
    <path d="M14 16 L86 86" stroke={MX.ink} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, p * 2)} opacity={p > 0.01 ? 1 : 0} />
    <path d="M86 14 L16 84" stroke={MX.ink} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, p * 2 - 1)} opacity={p > 0.5 ? 1 : 0} />
  </svg>
);

/**
 * "Each race gets its own ballot. Mark one party's logo, or two, if they're in the same alliance."
 * On light paper like the reference's ballot scene: three ballot slips (PRESIDENT, SENATE,
 * DEPUTIES) pop in on "own ballot"; then one made-up ballot with six party logos; an X draws
 * itself over Party B on "Mark", a second X over Party C on "two", and a red bracket joins them on
 * "same alliance" (SAME ALLIANCE: VALID). The vote then counts for their joint candidate.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = [rise(frame, 6), rise(frame, 10)];
  const races = RACES.map((_, i) => pop(frame, cue("ballot", "own") - 6 + i * 4));
  const paper = rise(frame, cue("ballot", "Mark") - 12);
  const boxes = BALLOT_PARTIES.map((_, i) => rise(frame, cue("ballot", "Mark") - 10 + i * 2));
  const x1 = progress(frame, cue("ballot", "Mark") - 1, cue("ballot", "logo") + 2);
  const x2 = progress(frame, cue("ballot", "two") - 1, cue("ballot", "two") + 10);
  const bracket = progress(frame, cue("ballot", "same") - 4, cue("ballot", "alliance") + 4);
  const stamp = pop(frame, cue("ballot", "alliance") + 2);

  const boxPos = (i: number) => ({
    left: BOX.left + (i % 3) * (BOX.w + BOX.gapX),
    top: BOX.top + Math.floor(i / 3) * (BOX.h + BOX.gapY),
  });
  const a = boxPos(PICKED);
  const b = boxPos(ALLY);

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        03 — THE BALLOT
      </Eyebrow>
      <Headline light size={132} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        MARK THE
      </Headline>
      <Headline light size={132} style={{ top: 352 + 129, ...riseStyle(head[1], exit, 50) }}>
        <Accent light>LOGO</Accent>
      </Headline>

      {/* One ballot per race. */}
      {RACES.map((r, i) => (
        <div
          key={r}
          style={{
            position: "absolute",
            left: 120 + i * (RACE.w + RACE.gap),
            top: RACE.top,
            width: RACE.w,
            height: RACE.h,
            borderRadius: 10,
            background: MX.cream,
            border: `2px solid #D9D2C4`,
            borderTop: `8px solid ${i === 0 ? MX.green : i === 1 ? MX.red : MX.ink}`,
            boxSizing: "border-box",
            boxShadow: "0 14px 28px rgba(10,40,26,0.16)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 20,
            opacity: Math.min(1, Math.max(0, races[i]) * 1.5) * (1 - exit),
            transform: `scale(${0.6 + 0.4 * races[i]}) rotate(${(i - 1) * 2}deg)`,
          }}
        >
          <Mono size={14} color={MX.inkSoft} style={{ letterSpacing: 2.4 }}>
            BALLOT {i + 1} OF 3
          </Mono>
          <div style={{ marginTop: 6, fontFamily: FONT.display, fontSize: 30, lineHeight: 1, color: MX.ink }}>{r}</div>
        </div>
      ))}

      {/* The ballot paper with six made-up party logos. */}
      <div
        style={{
          position: "absolute",
          left: PAPER.left,
          top: PAPER.top,
          width: PAPER.w,
          height: PAPER.h,
          borderRadius: 12,
          background: MX.cream,
          border: "2px solid #D9D2C4",
          boxSizing: "border-box",
          boxShadow: "0 22px 40px rgba(10,40,26,0.18)",
          fontFamily: FONT.body,
          ...riseStyle(paper, exit, 50),
        }}
      >
        <div style={{ position: "absolute", left: 40, top: 26, fontFamily: FONT.mono, fontWeight: 700, fontSize: 16, letterSpacing: 2.6, color: MX.inkSoft }}>
          PRESIDENCY · MARK ONE LOGO
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 62, height: 5, display: "flex" }}>
          <div style={{ flex: 1, background: MX.green }} />
          <div style={{ flex: 1, background: "#E4DED2" }} />
          <div style={{ flex: 1, background: MX.red }} />
        </div>
        {BALLOT_PARTIES.map((p, i) => {
          const pos = boxPos(i);
          return (
            <div
              key={p.key}
              style={{
                position: "absolute",
                ...pos,
                width: BOX.w,
                height: BOX.h,
                borderRadius: 10,
                border: `2px solid ${MX.inkFaint}`,
                boxSizing: "border-box",
                background: MX.card,
                ...riseStyle(boxes[i], 0, 16),
              }}
            >
              <div style={{ position: "absolute", left: 0, right: 0, top: 14, display: "flex", justifyContent: "center" }}>
                <Logo shape={p.shape} color={p.color} size={78} />
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 12, textAlign: "center", fontSize: 21, fontWeight: 800, color: MX.ink }}>Party {p.key}</div>
              {i === PICKED && <BigX p={x1} size={150} />}
              {i === ALLY && <BigX p={x2} size={150} />}
            </div>
          );
        })}
        {/* The alliance bracket under the two marked logos. */}
        <svg width={PAPER.w} height={PAPER.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
          <path
            d={`M${a.left + 20} ${a.top - 14} V${a.top - 30} H${b.left + BOX.w - 20} V${a.top - 14}`}
            fill="none"
            stroke={MX.red}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - bracket}
            opacity={bracket > 0.01 ? 1 : 0}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: a.left + 10,
            top: BOX.top + 2 * BOX.h + BOX.gapY + 18,
            fontSize: 19,
            fontWeight: 600,
            color: MX.inkFaint,
          }}
        >
          Made-up parties · B and C run one joint candidate
        </div>
        <Stamp p={stamp} size={34} color={MX.red} rotate={-6} style={{ left: 420, top: -38, background: MX.cream }}>
          SAME ALLIANCE: VALID
        </Stamp>
      </div>
    </>
  );
};
