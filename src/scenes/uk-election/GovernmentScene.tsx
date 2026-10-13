import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Character } from "../../components/explainer/Character";
import { NameCard } from "../../components/explainer/NameCard";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { COMMONS_POSE, HAIR, PALETTE as C, RESULT_2024, UK, WINNER, WINNER_SEAT_SHARE, type SceneProps } from "./constants";
import { Pill } from "./ui";

const POSE = COMMONS_POSE.government;
const CALLBACK_TOP = POSE.cy + 24;
const LEGEND_TOP = CALLBACK_TOP + 76;
const CARD = { top: LEGEND_TOP + 66, height: 190 } as const;
const NOTE_TOP = CARD.top + CARD.height + 16;
/** Everyone but the winner, biggest first, "Others" last. */
const LEGEND = RESULT_2024.filter((p) => p !== WINNER).sort((a, b) => (a.name === "Others" ? 1 : b.name === "Others" ? -1 : b.seats - a.seats));

const Note: React.FC<{ p: number; out: number; children: React.ReactNode }> = ({ p, out, children }) => (
  <div
    style={{
      position: "absolute",
      left: 120,
      width: 840,
      top: NOTE_TOP,
      textAlign: "center",
      fontFamily: theme.font,
      fontSize: 28,
      fontWeight: 600,
      color: C.inkSoft,
      whiteSpace: "nowrap",
      ...riseStyle(p, out, 14),
    }}
  >
    {children}
  </div>
);

/**
 * "In 2024, Labour won 411 seats, so its leader became Prime Minister: first Keir Starmer, now Andy
 * Burnham." Seats, counter and majority line are in CommonsLayer; this scene adds the year, the
 * votes-vs-seats callback to the hook, a legend, and the Prime Minister card (Starmer, then Burnham).
 */
export const GovernmentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const year = pop(frame, cue("result", "2024") - 4);
  const yearOut = progress(frame, cue("result", "seats") - 8, cue("result", "seats") - 2);
  const callback = pop(frame, cue("result", "seats") - 2);
  const legend = rise(frame, cue("result", "seats") + 4);
  const card1 = pop(frame, cue("result", "its") - 4);
  const name1 = progress(frame, cue("result", "Keir") - 2, cue("result", "Starmer", "end"));
  const swap = progress(frame, cue("result", "now") - 4, cue("result", "now") + 6);
  const card2 = pop(frame, cue("result", "now") - 2);
  const name2 = progress(frame, cue("result", "Andy") - 2, cue("result", "Burnham", "end"));
  const note1 = rise(frame, cue("result", "became") - 2);
  const note2 = rise(frame, cue("result", "now") + 4);

  return (
    <>
      {/* The election, under the half-circle until the votes-vs-seats callback takes its place */}
      <div style={{ position: "absolute", left: 120, width: 840, top: CALLBACK_TOP, display: "flex", justifyContent: "center", opacity: 1 - Math.max(yearOut, exit) }}>
        <Pill p={year} bg={C.ink} color={C.white} size={32}>
          General election · 4 July 2024
        </Pill>
      </div>

      {/* Back to the hook: a third of the votes, almost two-thirds of the seats */}
      <div style={{ position: "absolute", left: 120, width: 840, top: CALLBACK_TOP, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={callback} bg={C.card} color={C.ink} border={WINNER.color} size={32} style={{ boxShadow: "0 10px 26px rgba(14,26,58,0.12)" }}>
          {WINNER.name}: <span style={{ color: WINNER.color }}>{Math.round(WINNER.votes)}% of votes</span> →{" "}
          <span style={{ color: WINNER.color }}>{Math.round(WINNER_SEAT_SHARE)}% of seats</span>
        </Pill>
      </div>

      {/* Everyone else */}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: LEGEND_TOP,
          display: "flex",
          justifyContent: "center",
          gap: 22,
          fontFamily: theme.font,
          fontSize: 25,
          fontWeight: 700,
          color: C.inkSoft,
          whiteSpace: "nowrap",
          ...riseStyle(legend, exit, 12),
        }}
      >
        {LEGEND.map((p) => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: p.color }} />
            {p.name} {p.seats}
          </div>
        ))}
      </div>

      {/* The Prime Minister: Keir Starmer, then Andy Burnham */}
      <NameCard
        top={CARD.top}
        height={CARD.height}
        role="PRIME MINISTER"
        name="Keir Starmer"
        sub="July 2024 – July 2026"
        cardP={card1}
        nameP={name1}
        exitP={Math.max(swap, exit)}
        palette={C}
        portrait={<Character size={130} bg={C.paperDeep} palette={C} clothes={UK.charcoal} tie={UK.gold} hair={HAIR.grey} hairStyle="side" id="pm-2024" />}
      />
      <NameCard
        top={CARD.top}
        height={CARD.height}
        role="PRIME MINISTER"
        name="Andy Burnham"
        sub="since July 2026"
        cardP={card2}
        nameP={name2}
        exitP={exit}
        palette={C}
        portrait={<Character size={130} bg={UK.goldSoft} palette={C} clothes={UK.suit} tie={UK.gold} hair={HAIR.dark} hairStyle="short" id="pm-2026" />}
      />

      <Note p={note1} out={Math.max(swap, exit)}>
        The King appoints the leader of the biggest party
      </Note>
      <Note p={note2} out={exit}>
        Labour picked a new leader: <span style={{ color: C.ink, fontWeight: 800 }}>no general election</span>
      </Note>
    </>
  );
};
