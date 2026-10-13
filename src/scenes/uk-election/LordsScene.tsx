import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { Character } from "../../components/explainer/Character";
import { BallotBoxIcon, DrawnCross, LawIcon } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { COMMONS_POSE, COMMONS_R_OUT, HAIR, LORDS_TOTAL, PALETTE as C, UK, type SceneProps } from "./constants";
import { Card, HourglassIcon, Pill } from "./ui";

const COMMONS = COMMONS_POSE.lords;
/** The Lords sit to the right of the Commons, drawn at the same size. */
const LORDS = { cx: 776, cy: COMMONS.cy, s: COMMONS.s } as const;
const LORDS_SEATS = hemicycleSeats(LORDS_TOTAL, 14, 140, COMMONS_R_OUT);
const LABEL_TOP = COMMONS.cy + 18;
const CARD = { top: 800, height: 214 } as const;

const ChamberLabel: React.FC<{ cx: number; name: string; sub: string; color: string; p: number; exit: number }> = ({ cx, name, sub, color, p, exit }) => (
  <div style={{ position: "absolute", left: cx - 200, width: 400, top: LABEL_TOP, textAlign: "center", fontFamily: theme.font, ...riseStyle(p, exit, 20) }}>
    <div style={{ fontSize: 40, fontWeight: 800, color: C.ink, letterSpacing: -0.8 }}>{name}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{sub}</div>
  </div>
);

/**
 * "The House of Lords also checks laws, but isn't elected and can only delay them."
 * The Commons (CommonsLayer) steps left; the red Lords half-circle sweeps in on the right; a law
 * travels from one to the other; then who the Lords are and what they cannot do.
 */
export const LordsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const commonsLabel = rise(frame, 10);
  const build = progress(frame, cue("lords", "House") - 4, cue("lords", "Lords", "end") + 6, Easing.inOut(Easing.cubic));
  const lordsLabel = rise(frame, cue("lords", "Lords") - 2);
  const checks = pop(frame, cue("lords", "checks") - 4);
  const fly = progress(frame, cue("lords", "also") - 2, cue("lords", "laws", "end") + 4);
  const landed = progress(frame, cue("lords", "laws", "end") + 10, cue("lords", "laws", "end") + 22);
  const card = rise(frame, cue("lords", "but") - 8);
  const ballot = pop(frame, cue("lords", "isn't") - 4);
  const cross = progress(frame, cue("lords", "isn't"), cue("lords", "elected", "end"));
  const delay = pop(frame, cue("lords", "delay") - 4);
  const delayNote = rise(frame, cue("lords", "them") - 2);

  // The law's path: an arc from the Commons to the Lords.
  const lawX = interpolate(fly, [0, 1], [COMMONS.cx + 60, LORDS.cx - 60]);
  const lawY = COMMONS.cy - 110 - Math.sin(fly * Math.PI) * 50;

  return (
    <>
      {/* The House of Lords: about 800 seats in red */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            transform: `translate(${LORDS.cx - 540}px, ${LORDS.cy - 830}px) scale(${LORDS.s})`,
            transformOrigin: "540px 830px",
          }}
        >
          <Hemicycle seats={LORDS_SEATS} cx={540} cy={830} dot={6.5} fill={() => UK.lords} visible={(i) => build * (LORDS_TOTAL + 1) - i} />
        </div>
      </div>

      <ChamberLabel cx={COMMONS.cx} name="Commons" sub="650 MPs · elected" color={UK.commons} p={commonsLabel} exit={exit} />
      <ChamberLabel cx={LORDS.cx} name="Lords" sub="about 800 · appointed" color={UK.lords} p={lordsLabel} exit={exit} />

      {/* A law goes from the Commons to the Lords to be checked */}
      <div
        style={{
          position: "absolute",
          left: lawX - 45,
          top: lawY - 45,
          opacity: Math.min(1, fly * 6) * (1 - Math.max(landed, exit)),
          transform: `rotate(${(fly - 0.5) * 24}deg) scale(${1 - 0.4 * landed})`,
        }}
      >
        <LawIcon size={90} palette={C} />
      </div>
      <div style={{ position: "absolute", top: 362, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={checks} bg={UK.lordsSoft} color={UK.lords} size={34}>
          Also checks every law
        </Pill>
      </div>

      {/* Who sits there: appointed for life, plus bishops. Not elected. */}
      <Card
        top={CARD.top}
        height={CARD.height}
        style={{ display: "flex", alignItems: "center", gap: 28, padding: "0 34px", ...riseStyle(card, exit, 40) }}
      >
        <Character
          size={150}
          bg={UK.lordsSoft}
          palette={C}
          outfit="robe"
          clothes={UK.lords}
          hair={HAIR.white}
          hairStyle="receding"
          glasses
          id="lord"
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: C.ink, letterSpacing: -0.6, lineHeight: 1.15 }}>Appointed for life</div>
          <div style={{ fontSize: 29, fontWeight: 600, color: C.inkSoft, marginTop: 6 }}>plus 26 bishops</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: Math.min(1, ballot * 1.4), transform: `scale(${0.7 + 0.3 * ballot})` }}>
          <div style={{ position: "relative", width: 120, height: 120 }}>
            <BallotBoxIcon size={120} palette={C} />
            <div style={{ position: "absolute", left: 6, top: 6 }}>
              <DrawnCross size={108} p={cross} color={C.alert} stroke={5.5} />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 1.5, color: C.alert, whiteSpace: "nowrap" }}>NOT ELECTED</div>
        </div>
      </Card>

      {/* It can only delay laws */}
      <div style={{ position: "absolute", left: 120, width: 840, top: CARD.top + CARD.height + 34, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "14px 34px 14px 20px",
            borderRadius: 999,
            background: C.card,
            boxShadow: "0 14px 34px rgba(14,26,58,0.14)",
            border: `3px solid ${UK.gold}`,
            fontFamily: theme.font,
            fontSize: 40,
            fontWeight: 800,
            color: C.ink,
            whiteSpace: "nowrap",
            opacity: Math.min(1, delay * 1.4),
            transform: `scale(${0.6 + 0.4 * delay})`,
          }}
        >
          <HourglassIcon size={60} />
          Can only <span style={{ color: UK.goldDeep }}>delay</span> laws
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: CARD.top + CARD.height + 138,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 28,
          fontWeight: 600,
          color: C.inkSoft,
          ...riseStyle(delayNote, exit, 14),
        }}
      >
        for up to a year: then the Commons gets its way
      </div>
    </>
  );
};
