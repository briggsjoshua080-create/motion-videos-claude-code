import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { enter } from "../../lib/animation";
import { Hemicycle } from "../../components/Hemicycle";
import { HOUSE_SEATS } from "./VotersScene";
import { DrawnPath, NL, Pill, SAFE, SceneFrame, SceneHeader, pop, progress, type SceneProps } from "./ui";

/** Official result, 29 Oct 2025 (Electoral Council, 7 Nov 2025): the two largest parties tied. */
const TIE_SEATS = 26;
const MAJORITY = 76;
const HC = { cx: 540, cy: 1010, dot: 14, rOut: 390 } as const;

/** "In 2025, D66 and the PVV tied with 26 seats each. A majority needs 76." */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const seatsIn = enter(frame, 0);
  const d66 = progress(frame, cue("result", "D66") - 2, cue("result", "D66") + 16);
  const pvv = progress(frame, cue("result", "PVV") - 2, cue("result", "PVV") + 16);
  const d66Tag = pop(frame, cue("result", "D66") - 3);
  const pvvTag = pop(frame, cue("result", "PVV") - 3);
  const tie = pop(frame, cue("result", "tied") - 3);
  const others = enter(frame, cue("result", "seats") - 2);
  const line = progress(frame, cue("result", "majority") - 4, cue("result", "needs") + 4);
  const majority = pop(frame, cue("result", "majority") - 2);

  const d66Count = TIE_SEATS * d66;
  const pvvCount = TIE_SEATS * pvv;
  const total = HOUSE_SEATS.length;
  const fill = (i: number) => {
    if (i < d66Count) return NL.orange;
    if (i >= total - pvvCount) return NL.white;
    return NL.seat;
  };

  return (
    <SceneFrame duration={duration}>
      <SceneHeader kicker="ELECTION · 29 OCT 2025" title="A TIE AT THE TOP" />

      <Hemicycle seats={HOUSE_SEATS} cx={HC.cx} cy={HC.cy} dot={HC.dot} fill={fill} visible={() => seatsIn} />

      {/* Majority line through the middle: crossing it takes 76 of 150 seats. */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <DrawnPath d={`M${HC.cx} ${HC.cy - HC.rOut - 40} L${HC.cx} ${HC.cy + 20}`} p={line} color={NL.redBright} width={8} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: HC.cy - HC.rOut - 130,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, majority * 1.4),
          transform: `scale(${0.6 + 0.4 * majority})`,
        }}
      >
        <Pill bg={NL.redBright} size={42}>
          MAJORITY = {MAJORITY} SEATS
        </Pill>
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: HC.cy + 34,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, tie * 1.4),
          transform: `scale(${tie})`,
        }}
      >
        <div style={{ fontFamily: theme.font, fontSize: 72, fontWeight: 900, color: NL.orangeLight, letterSpacing: -1 }}>TIE</div>
      </div>

      <div style={{ position: "absolute", left: SAFE.left, top: HC.cy + 40, opacity: Math.min(1, d66Tag * 1.4), transform: `scale(${d66Tag})` }}>
        <Pill size={44}>D66 · {TIE_SEATS}</Pill>
      </div>
      <div
        style={{
          position: "absolute",
          right: 1080 - SAFE.left - SAFE.width,
          top: HC.cy + 40,
          opacity: Math.min(1, pvvTag * 1.4),
          transform: `scale(${pvvTag})`,
        }}
      >
        <Pill size={44} bg={NL.white} color={NL.ink}>
          PVV · {TIE_SEATS}
        </Pill>
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: HC.cy + 140,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 34,
          fontWeight: 800,
          color: NL.mist,
          letterSpacing: 2,
          opacity: others,
        }}
      >
        + 13 OTHER PARTIES SHARE {total - 2 * TIE_SEATS} SEATS
      </div>
    </SceneFrame>
  );
};
