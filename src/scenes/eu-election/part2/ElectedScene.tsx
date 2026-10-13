import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { NameCard } from "../../../components/explainer/NameCard";
import { pop, progress, rise, sceneExit } from "../../../components/explainer/motion";
import { EU, PALETTE as C, type SceneProps } from "../constants";
import { POSE, VOTES_FOR, voteFill } from "./HemicycleLayer";
import { CandidatePortrait } from "./LeadersScene";
import { P2 } from "./timeline";

/**
 * "Then Parliament votes. In July 2024, it re-elected Ursula von der Leyen with 401 votes."
 * Seats and the majority mark are in HemicycleLayer; this scene adds the counter and the name card.
 */
export const ElectedScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const { cx, cy } = POSE.elected;
  const july = rise(frame, cue("elected", "July") - 6);
  // Same fill as the seats in HemicycleLayer (composition frames), so the counter matches the seats.
  const fill = voteFill(frame + P2.from("elected"), P2.at);
  const counting = frame >= cue("elected", "re-elected") - 2;
  const card = pop(frame, cue("elected", "re-elected") - 4);
  const name = progress(frame, cue("elected", "Ursula") - 2, cue("elected", "Leyen", "end"));

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
      {/* Centre: "July 2024", then the votes in favour counting up to 401 */}
      <div
        style={{
          position: "absolute",
          left: cx - 170,
          width: 340,
          top: cy - 138,
          textAlign: "center",
          fontFamily: theme.font,
          opacity: july,
        }}
      >
        <div style={{ fontSize: 100, fontWeight: 800, lineHeight: 1, letterSpacing: -3, color: counting ? EU.yellowDeep : C.ink }}>
          {counting ? Math.round(VOTES_FOR * fill) : "2024"}
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft, marginTop: 6 }}>{counting ? "votes in favour" : "July vote"}</div>
      </div>

      <NameCard
        top={cy + 100}
        height={196}
        left={120}
        width={840}
        role="COMMISSION PRESIDENT"
        name="Ursula von der Leyen"
        sub="Re-elected July 2024 · 401 votes"
        cardP={card}
        nameP={name}
        portrait={<CandidatePortrait size={128} id="candidate-elected" />}
        palette={C}
      />
    </div>
  );
};
