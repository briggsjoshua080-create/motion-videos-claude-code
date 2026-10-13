import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Character } from "../../components/explainer/Character";
import { NameCard } from "../../components/explainer/NameCard";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { COALITION, HAIR, MAJORITY, NL, PALETTE as C, RESULT_2025, type SceneProps } from "./constants";

const ROW_TOP = 822;
const COALITION_SEATS = COALITION.reduce((n, p) => n + p.seats, 0);

const Tag: React.FC<{ text: string; bg: string; color: string; p: number; out: number }> = ({ text, bg, color, p, out }) => (
  <div
    style={{
      padding: "12px 26px",
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: theme.font,
      fontSize: 36,
      fontWeight: 800,
      whiteSpace: "nowrap",
      opacity: Math.min(1, p * 1.4) * (1 - out),
      transform: `scale(${0.6 + 0.4 * p})`,
    }}
  >
    {text}
  </div>
);

/**
 * "No party wins 76 seats alone. In 2025, D66 and the PVV tied with just 26 each. So three parties
 * teamed up, with Rob Jetten as Prime Minister." Seats and the majority line are in HouseLayer.
 */
export const GovernmentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const year = rise(frame, cue("coalition", "2025") - 4);
  const first = pop(frame, cue("coalition", "D66") - 3);
  const second = pop(frame, cue("coalition", "PVV") - 3);
  const tie = pop(frame, cue("coalition", "tied") - 3);
  const resultOut = progress(frame, cue("cabinet", "three") - 4, cue("cabinet", "three") + 4);
  const sum = pop(frame, cue("cabinet", "up") - 4);
  const note = rise(frame, cue("cabinet", "up") + 2);
  const card = pop(frame, cue("cabinet", "with") - 4);
  const name = progress(frame, cue("cabinet", "Rob") - 2, cue("cabinet", "Jetten", "end"));

  return (
    <>
      {/* 2025 in the middle of the half-circle while the result comes in */}
      <div
        style={{
          position: "absolute",
          left: 340,
          width: 400,
          top: 668,
          textAlign: "center",
          fontFamily: theme.font,
          color: C.ink,
          ...riseStyle(year, Math.max(resultOut, exit), 20),
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>2025</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft, marginTop: 4 }}>election result</div>
      </div>

      {/* The tie */}
      <div style={{ position: "absolute", left: 120, width: 840, top: ROW_TOP, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 1 - exit }}>
        <Tag text={`${RESULT_2025.first.name} · ${RESULT_2025.first.seats}`} bg={NL.orange} color={C.white} p={first} out={resultOut} />
        <div style={{ fontFamily: theme.font, fontSize: 48, fontWeight: 800, color: C.ink, opacity: Math.min(1, tie * 1.4) * (1 - resultOut), transform: `scale(${tie})` }}>
          TIE
        </div>
        <Tag text={`${RESULT_2025.second.name} · ${RESULT_2025.second.seats}`} bg={NL.blue} color={C.white} p={second} out={resultOut} />
      </div>

      {/* The coalition */}
      <div style={{ position: "absolute", left: 120, width: 840, top: ROW_TOP, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, opacity: 1 - exit }}>
        {COALITION.map((party, i) => {
          const p = pop(frame, cue("cabinet", "parties") - 4 + i * 5);
          return (
            <React.Fragment key={party.name}>
              {i > 0 ? <div style={{ fontFamily: theme.font, fontSize: 40, fontWeight: 800, color: C.inkSoft, opacity: p }}>+</div> : null}
              <Tag text={`${party.name} ${party.seats}`} bg={party.color} color={i === 0 ? C.white : C.ink} p={p} out={0} />
            </React.Fragment>
          );
        })}
        <div style={{ fontFamily: theme.font, fontSize: 40, fontWeight: 800, color: C.ink, opacity: sum, whiteSpace: "nowrap" }}>= {COALITION_SEATS}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: ROW_TOP + 86,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 32,
          fontWeight: 600,
          color: C.inkSoft,
          ...riseStyle(note, exit, 16),
        }}
      >
        {COALITION_SEATS} is less than {MAJORITY}: a <span style={{ color: C.alert, fontWeight: 800 }}>minority cabinet</span>
      </div>

      <NameCard
        top={980}
        height={210}
        role="PRIME MINISTER"
        name="Rob Jetten"
        sub="Head of government · since Feb 2026"
        cardP={card}
        nameP={name}
        exitP={exit}
        palette={C}
        portrait={
          <Character size={140} bg={C.paperDeep} palette={C} clothes={C.ink} tie={NL.blue} hair={HAIR.dark} hairStyle="side" id="prime-minister" />
        }
      />
    </>
  );
};
