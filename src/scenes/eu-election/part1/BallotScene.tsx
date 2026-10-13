import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { DrawnCross, RedPencil } from "../../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../../components/explainer/motion";
import { CARD_SHADOW, EU, PALETTE as C, type SceneProps } from "../constants";
import { Pill } from "../ui";

const BALLOT = { left: 150, top: 452, width: 780, height: 600, header: 84 } as const;
const ROW = { top: 196, height: 96, box: 52 } as const; // relative to the ballot
const PARTIES = [
  { name: "Party A", color: EU.blueMid },
  { name: "Party B", color: EU.yellow },
  { name: "Party C", color: EU.blueSoft },
  { name: "Party D", color: EU.slate },
] as const;
const CHOSEN = 1;
const boxCentre = {
  x: BALLOT.left + 40 + ROW.box / 2,
  y: BALLOT.top + ROW.top + CHOSEN * ROW.height + (ROW.height - ROW.box) / 2 + ROW.box / 2,
};

/** Outline of another country's ballot, fanned out behind ours on "differ". */
const OtherBallot: React.FC<{ variant: number; p: number; exit: number }> = ({ variant, p, exit }) => {
  const side = variant === 0 ? -1 : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: BALLOT.left + 60,
        top: BALLOT.top + 30,
        width: BALLOT.width - 120,
        height: BALLOT.height - 60,
        borderRadius: 24,
        background: C.card,
        boxShadow: CARD_SHADOW,
        border: `2px solid ${C.line}`,
        overflow: "hidden",
        opacity: Math.min(1, p * 1.4) * (1 - exit),
        transform: `translateX(${side * 170 * p}px) rotate(${side * 8 * p}deg)`,
      }}
    >
      <div style={{ height: 54, background: variant === 0 ? EU.blueMid : C.inkSoft }} />
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 30, top: 84 + i * 56, display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: variant === 0 ? 15 : 6,
              border: `3px solid ${C.muted}`,
              fontSize: 20,
              fontWeight: 800,
              color: C.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.font,
            }}
          >
            {variant === 1 ? i + 1 : ""}
          </div>
          <div style={{ width: 300 - ((i * 53) % 120), height: 12, borderRadius: 6, background: C.line }} />
        </div>
      ))}
    </div>
  );
};

/**
 * "Every five years, each country votes for its own parties. Ballots differ, but often you just
 * mark one party." A sample ballot; a pen marks one box.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const years = pop(frame, cue("vote", "five") - 4);
  const ballot = rise(frame, cue("vote", "each") - 8);
  const own = pop(frame, cue("vote", "own") - 3);
  const differ = progress(frame, cue("ballot", "differ") - 4, cue("ballot", "differ") + 12);
  const note = pop(frame, cue("ballot", "differ") + 2);

  const markAt = cue("ballot", "mark");
  const reach = progress(frame, cue("ballot", "you") - 4, markAt - 2);
  const mark = progress(frame, markAt - 1, cue("ballot", "one") + 4);
  const leave = progress(frame, cue("ballot", "party") + 2, cue("ballot", "party") + 14);
  const chosen = pop(frame, cue("ballot", "party") - 3);
  const oneVote = pop(frame, cue("ballot", "one") - 3);

  const tipX = interpolate(reach, [0, 1], [1000, boxCentre.x + 6]) + leave * 320;
  const tipY = interpolate(reach, [0, 1], [1200, boxCentre.y + 4]) + leave * 240 + Math.sin(mark * Math.PI * 6) * 4 * (1 - leave);

  return (
    <>
      <div style={{ position: "absolute", top: 352, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={years} bg={C.paperDeep} border={C.line}>
          Every <span style={{ color: EU.blue }}>5 years</span>
        </Pill>
      </div>

      <OtherBallot variant={0} p={differ} exit={exit} />
      <OtherBallot variant={1} p={differ} exit={exit} />

      <div
        style={{
          position: "absolute",
          left: BALLOT.left,
          top: BALLOT.top,
          width: BALLOT.width,
          height: BALLOT.height,
          borderRadius: 28,
          background: C.card,
          boxShadow: CARD_SHADOW,
          overflow: "hidden",
          fontFamily: theme.font,
          ...riseStyle(ballot, exit),
        }}
      >
        <div
          style={{
            height: BALLOT.header,
            background: C.ink,
            color: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 36px",
            fontSize: 32,
            fontWeight: 800,
          }}
        >
          <div style={{ letterSpacing: 5 }}>BALLOT</div>
          <div>
            You have{" "}
            <span style={{ display: "inline-block", color: C.accent, transform: `scale(${1 + 0.25 * Math.sin(Math.PI * Math.min(1, oneVote))})` }}>
              1 vote
            </span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 40, top: BALLOT.header + 30, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.inkSoft }}>European election</div>
          <div
            style={{
              padding: "4px 14px",
              borderRadius: 10,
              background: EU.yellowSoft,
              fontSize: 26,
              fontWeight: 800,
              color: C.ink,
              opacity: Math.min(1, own * 1.4),
              transform: `scale(${0.7 + 0.3 * own})`,
            }}
          >
            your country's parties
          </div>
        </div>
        {PARTIES.map((party, i) => (
          <div
            key={party.name}
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: ROW.top + i * ROW.height,
              height: ROW.height,
              display: "flex",
              alignItems: "center",
              gap: 22,
              borderTop: `2px solid ${C.line}`,
            }}
          >
            <div style={{ width: ROW.box, height: ROW.box, borderRadius: 10, border: `4px solid ${C.ink}`, boxSizing: "border-box", flexShrink: 0 }} />
            <div style={{ width: 16, height: 52, borderRadius: 8, background: party.color, flexShrink: 0 }} />
            <div style={{ width: 190, fontSize: 38, fontWeight: 800, color: C.ink, flexShrink: 0 }}>{party.name}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[0, 1].map((line) => (
                <div
                  key={line}
                  style={{ width: 250 - ((i * 41 + line * 67) % 90), height: 12, borderRadius: 6, background: C.muted, opacity: line === 0 ? 0.55 : 0.3 }}
                />
              ))}
            </div>
          </div>
        ))}
        {/* The cross in the chosen box */}
        <div style={{ position: "absolute", left: 40 + 2, top: ROW.top + CHOSEN * ROW.height + (ROW.height - ROW.box) / 2 + 2 }}>
          <DrawnCross size={ROW.box - 4} p={mark} color={EU.blue} stroke={6} />
        </div>
        {/* Highlight on the chosen party */}
        <div
          style={{
            position: "absolute",
            left: 22,
            right: 22,
            top: ROW.top + CHOSEN * ROW.height + 8,
            height: ROW.height - 14,
            borderRadius: 16,
            border: `5px solid ${C.accent}`,
            opacity: Math.min(1, chosen * 1.4),
            transform: `scale(${0.94 + 0.06 * chosen})`,
          }}
        />
      </div>

      <div style={{ position: "absolute", top: BALLOT.top + BALLOT.height + 44, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={note} bg={C.card} border={C.line} size={30} style={{ boxShadow: CARD_SHADOW }}>
          Every country prints <span style={{ color: EU.blue }}>its own ballot</span>
        </Pill>
      </div>

      {/* The pen */}
      <div style={{ position: "absolute", left: tipX, top: tipY, opacity: Math.min(1, reach * 3) * (1 - leave) * (1 - exit) }}>
        <RedPencil length={330} palette={C} color={EU.blue} />
      </div>
    </>
  );
};
