import React from "react";
import { Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { POLAND as MAP_DATA } from "../../components/poland";
import { LawIcon } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { PALETTE as C, PL, SEJM_POSE, SEJM_TOTAL, SENATE_TOTAL, type SceneProps } from "./constants";
import { DISTRICT_DOTS } from "./districts";
import { AmendIcon, Pill, PolandFlagMap } from "./ui";

const SEJM = SEJM_POSE.senate;
/** The Senate sits right of the Sejm, on the same base line. */
const SENATE = { cx: 760, cy: SEJM.cy } as const;
const SENATE_DOT = 7;
const SENATE_SEATS = hemicycleSeats(SENATE_TOTAL, 4, 96, 186);
/** The Poland map with the 100 districts, above both houses. */
const MAP_W = 404;
const MAP_H = (MAP_W * MAP_DATA.height) / MAP_DATA.width;
const MAP = { left: 540 - MAP_W / 2, top: 368 } as const;
const toScreen = (d: { x: number; y: number }) => ({ x: MAP.left + (d.x * MAP_W) / MAP_DATA.width, y: MAP.top + (d.y * MAP_H) / MAP_DATA.height });
const LABEL_TOP = SEJM.cy + 16;
/** Where the law flies: above the Sejm, above the Senate. */
const LAW_Y = SEJM.cy - 242;

const HouseLabel: React.FC<{ cx: number; name: string; sub: string; color: string; p: number; exit: number }> = ({ cx, name, sub, color, p, exit }) => (
  <div style={{ position: "absolute", left: cx - 200, width: 400, top: LABEL_TOP, textAlign: "center", fontFamily: theme.font, ...riseStyle(p, exit, 20) }}>
    <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, letterSpacing: -0.8, whiteSpace: "nowrap" }}>{name}</div>
    <div style={{ fontSize: 27, fontWeight: 800, color, marginTop: 2, whiteSpace: "nowrap" }}>{sub}</div>
  </div>
);

/**
 * "The Senate, one winner per district, can amend laws, but the Sejm has the final say."
 * The Sejm (SejmLayer) steps to the bottom left; the map shows 100 districts, each district's winner
 * flies into a seat of the Senate; a law goes to the Senate (amended) and back to the Sejm (final say).
 */
export const SenateScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const mapIn = rise(frame, 0);
  const dotsIn = progress(frame, 2, cue("senate", "Senate") + 8);
  const winners = progress(frame, cue("senate", "one") - 4, cue("senate", "winner", "end"));
  const flyStart = cue("senate", "per") - 2;
  const mapLabel = rise(frame, cue("senate", "district") - 4);
  const sejmLabel = rise(frame, 12);
  const senateLabel = rise(frame, cue("senate", "Senate") - 2);
  const seatsIn = progress(frame, cue("senate", "Senate") - 4, cue("senate", "Senate") + 10);

  const go = progress(frame, cue("senate", "can") - 4, cue("senate", "laws") + 2);
  const amend = pop(frame, cue("senate", "amend") - 2);
  const back = progress(frame, cue("senate", "but") - 2, cue("senate", "Sejm") + 6);
  const finalSay = pop(frame, cue("senate", "final") - 4);

  const lawX = interpolate(go - back, [0, 1], [SEJM.cx, SENATE.cx]);
  const lawY = LAW_Y - Math.sin(Math.PI * (go < 1 ? go : back)) * 26;
  const lawOn = Math.min(1, go * 6) * (1 - exit);

  return (
    <>
      {/* The map with the 100 districts */}
      <div style={{ position: "absolute", left: MAP.left, top: MAP.top, opacity: Math.min(1, mapIn) * (1 - exit), filter: "drop-shadow(0 14px 22px rgba(20,32,43,0.12))" }}>
        <PolandFlagMap width={MAP_W} id="senate-map" stroke={5} warsaw={false} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: MAP.top + MAP_H + 8,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 28,
          fontWeight: 700,
          color: C.inkSoft,
          whiteSpace: "nowrap",
          ...riseStyle(mapLabel, exit, 12),
        }}
      >
        <span style={{ color: C.ink, fontWeight: 800 }}>100 districts</span> · most votes wins
      </div>

      {/* The Senate: 100 seats in slate, filled by the district winners */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <Hemicycle seats={SENATE_SEATS} cx={SENATE.cx} cy={SENATE.cy} dot={SENATE_DOT} fill={() => PL.senateSoft} visible={() => seatsIn} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - exit }}>
        {DISTRICT_DOTS.map((d, j) => {
          const from = toScreen(d);
          const seat = SENATE_SEATS[j];
          const to = { x: SENATE.cx + seat.x, y: SENATE.cy + seat.y };
          const t = progress(frame, flyStart + j * 0.22, flyStart + j * 0.22 + 14, Easing.inOut(Easing.cubic));
          const v = Math.min(1, Math.max(0, dotsIn * (DISTRICT_DOTS.length + 8) - j * 0.6) / 8);
          const won = Math.min(1, Math.max(0, winners * 1.6 - (j / DISTRICT_DOTS.length) * 0.6));
          const x = from.x + (to.x - from.x) * t;
          const y = from.y + (to.y - from.y) * t - Math.sin(Math.PI * t) * 50;
          const r = interpolate(t, [0, 1], [7.5, SENATE_DOT]) * (0.4 + 0.6 * v);
          return <circle key={j} cx={x} cy={y} r={r} opacity={v} fill={interpolateColors(won, [0, 1], [C.ink, PL.senate])} stroke={C.white} strokeWidth={t < 0.5 ? 2 : 0} />;
        })}
      </svg>

      <HouseLabel cx={SEJM.cx} name="Sejm" sub={`${SEJM_TOTAL} MPs`} color={PL.red} p={sejmLabel} exit={exit} />
      <HouseLabel cx={SENATE.cx} name="Senate" sub={`${SENATE_TOTAL} senators`} color={PL.senate} p={senateLabel} exit={exit} />

      {/* What happens to a law: amended by the Senate, final say for the Sejm */}
      <div style={{ position: "absolute", left: SENATE.cx - 200, width: 400, top: LABEL_TOP + 86, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={amend} bg={PL.senateSoft} color={PL.senate} border={PL.senate} size={26} style={{ letterSpacing: 1 }}>
          can amend or reject
        </Pill>
      </div>
      <div style={{ position: "absolute", left: SEJM.cx - 200, width: 400, top: LABEL_TOP + 86, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={finalSay} bg={C.ink} color={C.white} size={26} style={{ letterSpacing: 1 }}>
          has the final say ✓
        </Pill>
      </div>
      <div style={{ position: "absolute", left: lawX - 38, top: lawY - 38, opacity: lawOn, transform: `rotate(${(go - back) * 6 - 3}deg)` }}>
        <LawIcon size={76} palette={C} />
        <div style={{ position: "absolute", left: 44, top: -16, opacity: Math.min(1, amend * 1.4) * (1 - back), transform: `scale(${amend})` }}>
          <AmendIcon size={48} />
        </div>
      </div>
    </>
  );
};
