import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { DrawnPath, LawIcon } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AT, COUNCIL_DOT, COUNCIL_POSE, COUNCIL_R_OUT, COUNCIL_TOTAL, FEDERAL_R_OUT, FEDERAL_TOTAL, PALETTE as C, type SceneProps } from "./constants";
import { ClockIcon, Pill, StateHouseIcon } from "./ui";

const COUNCIL = COUNCIL_POSE.federal;
/** The Federal Council sits right of the National Council, at the same scale. */
const FEDERAL = { cx: 792, cy: COUNCIL.cy, s: COUNCIL.s } as const;
const FEDERAL_SEATS = hemicycleSeats(FEDERAL_TOTAL, 4, 110, FEDERAL_R_OUT);
const LABEL_TOP = COUNCIL.cy + 18;
/** The nine state parliaments, in a row under both houses. */
const STATES = { top: 1004, size: 62, left: 121, step: 97 } as const;
const stateX = (k: number) => STATES.left + k * STATES.step + STATES.size / 2;
/** Where the law flies: from above the National Council to above the Federal Council. */
const LAW = {
  from: { x: COUNCIL.cx, y: COUNCIL.cy - (COUNCIL_R_OUT + 24) * COUNCIL.s - 70 },
  to: { x: FEDERAL.cx, y: FEDERAL.cy - (FEDERAL_R_OUT + 24) * FEDERAL.s - 80 },
} as const;

const HouseLabel: React.FC<{ cx: number; name: string; sub: string; color: string; p: number; exit: number }> = ({ cx, name, sub, color, p, exit }) => (
  <div style={{ position: "absolute", left: cx - 220, width: 440, top: LABEL_TOP, textAlign: "center", fontFamily: theme.font, ...riseStyle(p, exit, 20) }}>
    <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, letterSpacing: -0.8, whiteSpace: "nowrap" }}>{name}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color, marginTop: 2, whiteSpace: "nowrap" }}>{sub}</div>
  </div>
);

/**
 * "The Federal Council, sent by the nine states, can mostly only delay laws."
 * The National Council (CouncilLayer) steps left; the Federal Council's 60 seats sweep in on the right,
 * filled from the nine state parliaments; a law reaches it and is held up, not stopped.
 */
export const FederalScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const councilLabel = rise(frame, 6);
  const build = progress(frame, cue("federal", "Federal") - 4, cue("federal", "Council", "end") + 6, Easing.inOut(Easing.cubic));
  const federalLabel = rise(frame, cue("federal", "Federal") - 2);
  const houses = progress(frame, cue("federal", "sent") - 4, cue("federal", "states") + 2);
  const lines = progress(frame, cue("federal", "nine") - 6, cue("federal", "states", "end") + 4);
  const caption = rise(frame, cue("federal", "nine") - 2);
  const fly = progress(frame, cue("federal", "can") - 4, cue("federal", "only"));
  const held = pop(frame, cue("federal", "delay") - 3);
  const note = rise(frame, cue("federal", "only") - 2);

  const law = {
    x: interpolate(fly, [0, 1], [LAW.from.x, LAW.to.x]),
    y: interpolate(fly, [0, 1], [LAW.from.y, LAW.to.y]) - Math.sin(fly * Math.PI) * 70,
  };
  const lawOn = Math.min(1, fly * 6) * (1 - exit);

  return (
    <>
      {/* The Federal Council: 60 seats in slate */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            transform: `translate(${FEDERAL.cx - 540}px, ${FEDERAL.cy - 830}px) scale(${FEDERAL.s})`,
            transformOrigin: "540px 830px",
          }}
        >
          <Hemicycle seats={FEDERAL_SEATS} cx={540} cy={830} dot={COUNCIL_DOT} fill={() => AT.federal} visible={(i) => build * (FEDERAL_TOTAL + 1) - i} />
        </div>
      </div>

      <HouseLabel cx={COUNCIL.cx} name="National Council" sub={`${COUNCIL_TOTAL} · elected by you`} color={AT.red} p={councilLabel} exit={exit} />
      <HouseLabel cx={FEDERAL.cx} name="Federal Council" sub={`${FEDERAL_TOTAL} · sent by the states`} color={AT.federal} p={federalLabel} exit={exit} />

      {/* Nine state parliaments send the Federal Council's members */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - exit }}>
        {Array.from({ length: 9 }, (_, k) => (
          <DrawnPath
            key={k}
            d={`M${stateX(k)} ${STATES.top - 8} C${stateX(k)} ${STATES.top - 56} ${FEDERAL.cx} ${LABEL_TOP + 140} ${FEDERAL.cx} ${LABEL_TOP + 92}`}
            p={lines}
            color={AT.federal}
            width={3}
          />
        ))}
      </svg>
      {Array.from({ length: 9 }, (_, k) => {
        const v = Math.min(1, Math.max(0, houses * 10 - k));
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: STATES.left + k * STATES.step,
              top: STATES.top,
              opacity: Math.min(1, v * 1.4) * (1 - exit),
              transform: `translateY(${(1 - v) * 20}px) scale(${0.6 + 0.4 * v})`,
            }}
          >
            <StateHouseIcon size={STATES.size} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: STATES.top + STATES.size + 16,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 30,
          fontWeight: 700,
          color: C.inkSoft,
          whiteSpace: "nowrap",
          ...riseStyle(caption, exit, 14),
        }}
      >
        <span style={{ color: C.ink, fontWeight: 800 }}>9 state parliaments</span> send 3 to 12 members each
      </div>

      {/* The law reaches the Federal Council: held up, not stopped */}
      <div style={{ position: "absolute", left: law.x - 45, top: law.y - 45, opacity: lawOn, transform: `rotate(${(1 - fly) * -8}deg)` }}>
        <LawIcon size={90} palette={C} />
        <div style={{ position: "absolute", left: 56, top: -18, opacity: Math.min(1, held * 1.4), transform: `scale(${held})` }}>
          <ClockIcon size={58} />
        </div>
      </div>
      <div style={{ position: "absolute", left: LAW.to.x - 210, top: LAW.to.y - 26, width: 150, display: "flex", justifyContent: "flex-end", opacity: 1 - exit }}>
        <Pill p={held} bg={AT.federal} color={C.white} size={28} style={{ letterSpacing: 2 }}>
          DELAY
        </Pill>
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: STATES.top + STATES.size + 76,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 28,
          fontWeight: 600,
          color: C.inkSoft,
          whiteSpace: "nowrap",
          ...riseStyle(note, exit, 12),
        }}
      >
        It can only <span style={{ color: C.ink, fontWeight: 800 }}>block</span> laws that cut the states' powers
      </div>
    </>
  );
};
