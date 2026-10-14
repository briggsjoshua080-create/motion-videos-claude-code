import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { LawIcon } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CHAMBER_DOT, CHAMBER_POSE, CHAMBER_R_OUT, CHAMBER_TOTAL, IT, LIFE_SENATORS, PALETTE as C, SENATE_R_OUT, SENATE_TOTAL, type SceneProps } from "./constants";
import { Badge, Pill } from "./ui";

const CHAMBER = CHAMBER_POSE.houses;
/** The Senate sits to the right of the Chamber, drawn at the same scale (so it looks half as big). */
export const SENATE = { cx: 784, cy: CHAMBER.cy, s: CHAMBER.s } as const;
export const SENATE_SEATS = hemicycleSeats(SENATE_TOTAL, 7, 110, SENATE_R_OUT);
const LABEL_TOP = CHAMBER.cy + 20;
/** Where the law stops over each house. */
const STOP = {
  start: { x: 540, y: 1110 },
  chamber: { x: CHAMBER.cx, y: CHAMBER.cy - (CHAMBER_R_OUT + 24) * CHAMBER.s - 50 },
  senate: { x: SENATE.cx, y: SENATE.cy - (SENATE_R_OUT + 24) * SENATE.s - 50 },
} as const;

const HouseLabel: React.FC<{ cx: number; name: string; sub: string; note?: string; noteP?: number; color: string; p: number; exit: number }> = ({
  cx,
  name,
  sub,
  note,
  noteP = 0,
  color,
  p,
  exit,
}) => (
  <div style={{ position: "absolute", left: cx - 210, width: 420, top: LABEL_TOP, textAlign: "center", fontFamily: theme.font, ...riseStyle(p, exit, 20) }}>
    <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, letterSpacing: -0.8, whiteSpace: "nowrap" }}>{name}</div>
    <div style={{ fontSize: 30, fontWeight: 800, color, marginTop: 2 }}>{sub}</div>
    {note ? <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft, marginTop: 6, opacity: noteP, whiteSpace: "nowrap" }}>{note}</div> : null}
  </div>
);

/**
 * "The Chamber of Deputies has 400 seats, the Senate 200, and every law must pass both."
 * The Chamber (ChamberLayer) steps left; the Senate sweeps in on the right; a law gets a tick from
 * the Chamber, then from the Senate.
 */
export const HousesScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const chamberLabel = rise(frame, cue("houses", "Chamber") - 4);
  const build = progress(frame, cue("houses", "Senate") - 4, cue("houses", "200", "end") + 4, Easing.inOut(Easing.cubic));
  const senateLabel = rise(frame, cue("houses", "Senate") - 2);
  const life = rise(frame, cue("houses", "200") + 6);
  const equal = pop(frame, cue("houses", "and") - 4);
  const toChamber = progress(frame, cue("houses", "and"), cue("houses", "law"));
  const toSenate = progress(frame, cue("houses", "must"), cue("houses", "pass") + 2);
  const tickChamber = pop(frame, cue("houses", "law") - 1);
  const tickSenate = pop(frame, cue("houses", "pass") + 1);

  // The law's path: up to the Chamber, then over to the Senate.
  const leg = (a: { x: number; y: number }, b: { x: number; y: number }, t: number, lift: number) => ({
    x: interpolate(t, [0, 1], [a.x, b.x]),
    y: interpolate(t, [0, 1], [a.y, b.y]) - Math.sin(t * Math.PI) * lift,
  });
  const law = toSenate > 0 ? leg(STOP.chamber, STOP.senate, toSenate, 90) : leg(STOP.start, STOP.chamber, toChamber, 60);
  const lawOn = Math.min(1, toChamber * 5) * (1 - exit);

  return (
    <>
      {/* The Senate: 200 seats in yellow */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            transform: `translate(${SENATE.cx - 540}px, ${SENATE.cy - 830}px) scale(${SENATE.s})`,
            transformOrigin: "540px 830px",
          }}
        >
          <Hemicycle seats={SENATE_SEATS} cx={540} cy={830} dot={CHAMBER_DOT} fill={() => IT.senate} visible={(i) => build * (SENATE_TOTAL + 1) - i} />
        </div>
      </div>

      <HouseLabel cx={CHAMBER.cx} name="Chamber of Deputies" sub={`${CHAMBER_TOTAL} deputies`} color={IT.chamber} p={chamberLabel} exit={exit} />
      <HouseLabel
        cx={SENATE.cx}
        name="Senate"
        sub={`${SENATE_TOTAL} senators`}
        note={`+ ${LIFE_SENATORS} senators for life, not elected`}
        noteP={life}
        color={IT.senate}
        p={senateLabel}
        exit={exit}
      />

      {/* Equal powers */}
      <div style={{ position: "absolute", top: 556, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={equal} bg={C.ink} color={C.white} size={34} style={{ letterSpacing: 3 }}>
          EQUAL POWERS
        </Pill>
      </div>

      {/* A tick from each house */}
      <Badge size={66} ok p={tickChamber * (1 - exit)} style={{ position: "absolute", left: CHAMBER.cx - 33, top: CHAMBER.cy - 80 }} />
      <Badge size={66} ok p={tickSenate * (1 - exit)} style={{ position: "absolute", left: SENATE.cx - 33, top: SENATE.cy - 74 }} />

      {/* The law on its way through both houses */}
      <div style={{ position: "absolute", left: law.x - 45, top: law.y - 45, opacity: lawOn, transform: `rotate(${(toChamber - toSenate) * 10}deg)` }}>
        <LawIcon size={90} palette={C} />
      </div>
    </>
  );
};
