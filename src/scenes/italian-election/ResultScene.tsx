import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Character } from "../../components/explainer/Character";
import { NameCard } from "../../components/explainer/NameCard";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CHAMBER_POSE, HAIR, IT, PALETTE as C, RESULT_2022, SENATE_TOTAL, SENATE_WINNER_SEATS, WINNER, WINNER_SEAT_SHARE, type SceneProps } from "./constants";
import { Pill } from "./ui";

const POSE = CHAMBER_POSE.result;
const CALLBACK_TOP = POSE.cy + 24;
const LEGEND_TOP = CALLBACK_TOP + 76;
export const PM_CARD = { top: LEGEND_TOP + 82, height: 190 } as const;
const NOTE_TOP = PM_CARD.top + PM_CARD.height + 16;
/** Everyone but the winner, biggest first, "Others" last. */
const LEGEND = RESULT_2022.filter((p) => p !== WINNER).sort((a, b) => (a.name === "Others" ? 1 : b.name === "Others" ? -1 : b.seats - a.seats));

/** The prime minister as a generic cartoon (no likeness): blonde, dark top. */
export const PrimeMinister: React.FC<{ size: number; bg: string; id: string }> = ({ size, bg, id }) => (
  <Character size={size} bg={bg} palette={C} outfit="dress" clothes={IT.navy} hair={HAIR.blonde} hairStyle="bob" id={id} />
);

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
 * "In 2022, a centre-right alliance won both houses with 44% of the votes. The President named its
 * leader, Giorgia Meloni, prime minister." Seats, counter and majority line are in ChamberLayer;
 * this scene adds the election date, the Senate, votes vs seats, a legend and the prime minister.
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  // The prime minister's card carries straight on into the next scene, so it never exits.
  const year = pop(frame, cue("result", "2022") - 4);
  const yearOut = progress(frame, cue("result", "both") - 6, cue("result", "both"));
  const senate = pop(frame, cue("result", "both") - 2);
  const senateOut = progress(frame, cue("result", "44%") - 6, cue("result", "44%"));
  const callback = pop(frame, cue("result", "44%") - 2);
  const legend = rise(frame, cue("result", "votes") - 2);
  const areasNote = rise(frame, cue("result", "votes") + 6);
  const card = pop(frame, cue("result", "President") - 4);
  const name = progress(frame, cue("result", "Giorgia") - 2, cue("result", "Meloni", "end"));
  const womanNote = rise(frame, cue("result", "prime") - 2);
  const areasOut = progress(frame, cue("result", "prime") - 8, cue("result", "prime") - 2);

  return (
    <>
      {/* The election, then the Senate, then votes vs seats: one after the other under the half-circle */}
      <div style={{ position: "absolute", left: 120, width: 840, top: CALLBACK_TOP, display: "flex", justifyContent: "center", opacity: 1 - Math.max(yearOut, exit) }}>
        <Pill p={year} bg={C.ink} color={C.white} size={32}>
          General election · 25 Sept 2022
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 120, width: 840, top: CALLBACK_TOP, display: "flex", justifyContent: "center", opacity: 1 - Math.max(senateOut, exit) }}>
        <Pill p={senate} bg={IT.senateSoft} color={C.ink} border={IT.senate} size={32}>
          Senate too: <span style={{ color: WINNER.color }}>{SENATE_WINNER_SEATS}</span> of {SENATE_TOTAL} seats
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 120, width: 840, top: CALLBACK_TOP, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={callback} bg={C.card} color={C.ink} border={WINNER.color} size={32} style={{ boxShadow: "0 10px 26px rgba(20,32,43,0.12)" }}>
          Centre-right: <span style={{ color: WINNER.color }}>{Math.round(WINNER.votes)}% of votes</span> →{" "}
          <span style={{ color: WINNER.color }}>{Math.round(WINNER_SEAT_SHARE)}% of seats</span>
        </Pill>
      </div>

      {/* Everyone else */}
      <div
        style={{
          position: "absolute",
          left: 160,
          width: 760,
          top: LEGEND_TOP,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 24,
          rowGap: 6,
          fontFamily: theme.font,
          fontSize: 24,
          fontWeight: 700,
          color: C.inkSoft,
          whiteSpace: "nowrap",
          ...riseStyle(legend, exit, 12),
        }}
      >
        {LEGEND.map((p) => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: p.color }} />
            {p.name} {p.seats}
          </div>
        ))}
      </div>

      {/* The prime minister */}
      <NameCard
        top={PM_CARD.top}
        height={PM_CARD.height}
        role="PRIME MINISTER"
        name="Giorgia Meloni"
        sub="since October 2022"
        cardP={card}
        nameP={name}
        palette={C}
        portrait={<PrimeMinister size={130} bg={IT.greenSoft} id="pm-result" />}
      />

      <Note p={areasNote} out={Math.max(areasOut, exit)}>
        United, it won <span style={{ color: C.ink, fontWeight: 800 }}>4 in 5</span> voting areas
      </Note>
      <Note p={womanNote} out={exit}>
        Named by the President · <span style={{ color: C.ink, fontWeight: 800 }}>the first woman in the job</span>
      </Note>
    </>
  );
};
