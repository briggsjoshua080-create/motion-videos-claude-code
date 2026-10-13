import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Character } from "../../components/explainer/Character";
import { DrawnArrow, RedPencil } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { HAIR, NL, PALETTE as C, type SceneProps } from "./constants";

const BALLOT = { left: 120, top: 340, width: 840, height: 450, header: 76 } as const;
const COL_W = BALLOT.width / 3;
const ROWS_Y = [176, 240, 304, 368]; // relative to the ballot's top
const CHOSEN = { col: 1, row: 1 } as const;
const BOX = 38;
const boxCentre = {
  x: BALLOT.left + CHOSEN.col * COL_W + 36 + BOX / 2,
  y: BALLOT.top + ROWS_Y[CHOSEN.row] + BOX / 2,
};

/** Example vote shares and the seats they give (150 seats, so 1 seat ≈ 0.67%). */
const SHARES = [
  { name: "List 1", pct: 40, seats: 60, color: NL.blue },
  { name: "List 2", pct: 34, seats: 51, color: NL.orange },
  { name: "List 3", pct: 26, seats: 39, color: NL.red },
];
const SHARE_CARD = { left: 120, top: 830, width: 840, height: 440 } as const;

/**
 * "At least every four years, you get one vote. With a red pencil, you fill in the box next to one
 * candidate. Each party gets seats in line with its votes."
 */
export const VoteScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const ballot = rise(frame, 0);
  const oneVote = pop(frame, cue("vote", "one") - 3);
  const years = pop(frame, cue("vote", "four") - 4);
  const yearsOut = progress(frame, cue("pencil", "With") - 2, cue("pencil", "With") + 8);

  const fillAt = cue("pencil", "fill");
  const reach = progress(frame, cue("pencil", "red") - 4, fillAt - 2);
  const mark = progress(frame, fillAt - 1, cue("pencil", "box") + 2);
  const leave = progress(frame, cue("pencil", "next"), cue("pencil", "one") + 4);
  const chosen = pop(frame, cue("pencil", "candidate") - 4);
  const arrow = progress(frame, cue("pencil", "candidate") - 2, cue("pencil", "candidate") + 12);
  const candidate = pop(frame, cue("pencil", "candidate") + 4);
  const candidateOut = progress(frame, cue("share", "Each") - 6, cue("share", "Each") + 4);

  const shareIn = rise(frame, cue("share", "party") - 8);
  const bars = progress(frame, cue("share", "party") - 2, cue("share", "seats") + 6);
  const seats = progress(frame, cue("share", "seats") - 2, cue("share", "votes") + 6);

  const tipX = interpolate(reach, [0, 1], [1000, boxCentre.x]) + leave * 300;
  const tipY = interpolate(reach, [0, 1], [1050, boxCentre.y]) + leave * 220 + Math.sin(mark * Math.PI * 6) * 5 * (1 - leave);

  return (
    <>
      {/* Ballot paper */}
      <div
        style={{
          position: "absolute",
          left: BALLOT.left,
          top: BALLOT.top,
          width: BALLOT.width,
          height: BALLOT.height,
          borderRadius: 28,
          background: C.card,
          boxShadow: "0 22px 54px rgba(20,33,61,0.14)",
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
        {[0, 1, 2].map((col) => (
          <div key={col} style={{ position: "absolute", left: col * COL_W, top: 0, width: COL_W, height: "100%" }}>
            {col > 0 ? <div style={{ position: "absolute", left: 0, top: BALLOT.header + 24, bottom: 24, width: 2, background: C.line }} /> : null}
            <div style={{ position: "absolute", left: 36, top: BALLOT.header + 28, fontSize: 32, fontWeight: 800, color: C.ink }}>List {col + 1}</div>
            {ROWS_Y.map((y, row) => {
              const isChosen = col === CHOSEN.col && row === CHOSEN.row;
              return (
                <div key={y} style={{ position: "absolute", left: 36, top: y, display: "flex", alignItems: "center", gap: 18 }}>
                  <div
                    style={{
                      width: BOX,
                      height: BOX,
                      borderRadius: 8,
                      border: `4px solid ${C.ink}`,
                      boxSizing: "border-box",
                      background: isChosen ? `rgba(229,40,40,${mark})` : C.card,
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ width: 150 - ((row * 37 + col * 23) % 50), height: 14, borderRadius: 7, background: C.muted, opacity: 0.55 }} />
                    <div style={{ width: 90 + ((row * 29 + col * 17) % 40), height: 10, borderRadius: 5, background: C.muted, opacity: 0.3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {/* Highlight on the chosen candidate */}
        <div
          style={{
            position: "absolute",
            left: CHOSEN.col * COL_W + 20,
            top: ROWS_Y[CHOSEN.row] - 12,
            width: COL_W - 40,
            height: BOX + 24,
            borderRadius: 14,
            border: `5px solid ${C.accent}`,
            opacity: Math.min(1, chosen * 1.4),
            transform: `scale(${0.9 + 0.1 * chosen})`,
          }}
        />
      </div>

      {/* "At least every four years" */}
      <div
        style={{
          position: "absolute",
          top: BALLOT.top + BALLOT.height + 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, years * 1.4) * (1 - yearsOut) * (1 - exit),
          transform: `scale(${0.7 + 0.3 * years})`,
        }}
      >
        <div
          style={{
            padding: "14px 30px",
            borderRadius: 999,
            background: C.paperDeep,
            border: `2.5px solid ${C.line}`,
            fontFamily: theme.font,
            fontSize: 36,
            fontWeight: 800,
            color: C.ink,
          }}
        >
          At least every <span style={{ color: C.accentDeep }}>4 years</span>
        </div>
      </div>

      {/* The red pencil */}
      <div style={{ position: "absolute", left: tipX, top: tipY, opacity: Math.min(1, reach * 3) * (1 - leave) * (1 - exit) }}>
        <RedPencil length={330} palette={C} color={NL.red} />
      </div>

      {/* Arrow + "Your candidate" card */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: (1 - candidateOut) * (1 - exit) }}>
        <DrawnArrow x1={540} y1={BALLOT.top + BALLOT.height + 10} x2={540} y2={BALLOT.top + BALLOT.height + 64} p={arrow} color={C.ink} width={6} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 250,
          top: BALLOT.top + BALLOT.height + 80,
          width: 580,
          height: 190,
          borderRadius: 28,
          background: C.card,
          boxShadow: "0 22px 54px rgba(20,33,61,0.14)",
          display: "flex",
          alignItems: "center",
          gap: 30,
          padding: "0 36px",
          boxSizing: "border-box",
          fontFamily: theme.font,
          opacity: Math.min(1, candidate * 1.4) * (1 - candidateOut) * (1 - exit),
          transform: `translateY(${(1 - candidate) * 40 - candidateOut * 40}px) scale(${0.92 + 0.08 * candidate})`,
        }}
      >
        <Character
          size={134}
          bg={C.paperDeep}
          palette={C}
          clothes={NL.blue}
          tie={NL.orange}
          hair={HAIR.brown}
          hairStyle="bob"
          rosette={NL.orange}
          id="candidate"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: C.ink, letterSpacing: -1 }}>Your candidate</div>
          <div style={{ fontSize: 32, fontWeight: 600, color: C.inkSoft }}>List 2, number 2</div>
        </div>
      </div>

      {/* Votes become seats */}
      <div
        style={{
          position: "absolute",
          left: SHARE_CARD.left,
          top: SHARE_CARD.top,
          width: SHARE_CARD.width,
          height: SHARE_CARD.height,
          borderRadius: 28,
          background: C.card,
          boxShadow: "0 22px 54px rgba(20,33,61,0.14)",
          fontFamily: theme.font,
          ...riseStyle(shareIn, exit),
        }}
      >
        <div style={{ position: "absolute", left: 36, top: 30, fontSize: 32, fontWeight: 800, letterSpacing: 4, color: C.muted }}>SHARE OF VOTES</div>
        <div style={{ position: "absolute", right: 36, top: 30, fontSize: 32, fontWeight: 800, letterSpacing: 4, color: C.muted }}>SEATS</div>
        {SHARES.map((s, i) => {
          const y = 104 + i * 92;
          return (
            <div key={s.name} style={{ position: "absolute", left: 36, top: y, width: SHARE_CARD.width - 72, height: 60, display: "flex", alignItems: "center" }}>
              <div style={{ width: 130, fontSize: 32, fontWeight: 800, color: C.ink }}>{s.name}</div>
              <div style={{ width: (330 * s.pct * bars) / 40, height: 44, borderRadius: 10, background: s.color }} />
              <div style={{ marginLeft: 14, fontSize: 34, fontWeight: 800, color: C.ink, opacity: bars }}>{s.pct}%</div>
              <svg width={60} height={30} viewBox="0 0 60 30" style={{ position: "absolute", left: 560, opacity: seats }}>
                <path d="M4 15 H50 M38 4 L52 15 L38 26" fill="none" stroke={C.inkSoft} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ position: "absolute", right: 0, fontSize: 40, fontWeight: 800, color: C.ink, opacity: Math.min(1, seats * 3) }}>
                {Math.round(s.seats * seats)}
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 36, right: 36, bottom: 28, textAlign: "center", fontSize: 32, fontWeight: 600, color: C.inkSoft, opacity: seats }}>
          150 seats in total: each one ≈ 0.67% of the votes
        </div>
      </div>
    </>
  );
};
