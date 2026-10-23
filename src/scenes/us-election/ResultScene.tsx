import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ELECTORS, EV_2024, FONT, PARTY, RESULT_2024, STATES, TO_WIN, US, type SceneProps } from "./constants";
import { Aside, Eyebrow, Headline, Mono, PaperLayer } from "./ui";
import { TileMap } from "./TileMap";

const MAP = { left: 218, top: 566, tile: 54, gap: 5 } as const;
const EMPTY = "#DCD5C6";
const SCORE = { top: 1046 } as const;
const BAR = { left: 120, top: SCORE.top + 128, width: 840, height: 30 } as const;
const PANEL = { top: 600, height: 400 } as const;

/** One chamber's split as a bar: Republicans from the left, Democrats from the right, majority line. */
const ChamberBar: React.FC<{ label: string; r: number; d: number; total: number; note: string; top: number; p: number }> = ({ label, r, d, total, note, top, p }) => {
  const w = 760;
  return (
    <div style={{ position: "absolute", left: 40, top, width: w }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ fontFamily: FONT.display, fontSize: 40, color: US.ink }}>{label}</div>
        <Mono size={17} color={US.inkSoft} style={{ letterSpacing: 2.5 }}>
          {note}
        </Mono>
      </div>
      <div style={{ position: "relative", marginTop: 14, height: 40, borderRadius: 10, background: EMPTY, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(100 * r * p) / total}%`, background: PARTY.R }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${(100 * d * p) / total}%`, background: PARTY.D }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, marginLeft: -2, background: US.ink, opacity: 0.8 }} />
      </div>
      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontFamily: FONT.display, fontSize: 34 }}>
        <span style={{ color: PARTY.R }}>
          {Math.round(r * p)} <span style={{ fontFamily: FONT.mono, fontSize: 17, letterSpacing: 2 }}>REP</span>
        </span>
        <span style={{ color: PARTY.D }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 17, letterSpacing: 2 }}>DEM</span> {Math.round(d * p)}
        </span>
      </div>
    </div>
  );
};

/**
 * "In 2024, Donald Trump won 312 electors to Kamala Harris's 226. Republicans also won Congress."
 * On paper, so the parties' own colours read clearly: the state tiles fill in red and blue (Maine
 * and Nebraska split), the electoral score counts up across the 270 line with the popular vote
 * underneath; then the map makes way for Congress as elected (House 220–215, Senate 53–47).
 */
export const ResultScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = rise(frame, 7);
  const aside = rise(frame, 10);
  const asideSwap = progress(frame, cue("result", "Republicans") - 10, cue("result", "Republicans") - 2);
  const mapIn = rise(frame, 8);
  const fillFrom = 12;
  const fillTo = cue("result", "312");
  const score = rise(frame, cue("result", "Donald") - 8);
  const r = progress(frame, cue("result", "312") - 4, cue("result", "electors"), Easing.out(Easing.cubic));
  const d = progress(frame, cue("result", "226") - 4, cue("result", "226", "end"), Easing.out(Easing.cubic));
  const popular = rise(frame, cue("result", "226") + 2);
  const toCongress = progress(frame, cue("result", "Republicans") - 10, cue("result", "Republicans") + 2);
  const panel = rise(frame, cue("result", "Republicans") - 6);
  const bars = progress(frame, cue("result", "also") - 2, cue("result", "Congress", "end"), Easing.out(Easing.cubic));

  const maxCol = Math.max(...STATES.map((s) => s.col));

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        07 — ELECTION OF {RESULT_2024.date}
      </Eyebrow>
      <Headline light size={132} style={{ top: 350, ...riseStyle(head, exit, 50) }}>
        THE RESULT
      </Headline>
      <Aside light size={42} style={{ top: 486, ...riseStyle(aside, exit, 24), opacity: Math.min(1, aside) * (1 - asideSwap) * (1 - exit) }}>
        {ELECTORS} electors — {TO_WIN} to win.
      </Aside>
      <Aside light size={42} style={{ top: 486, opacity: asideSwap * (1 - exit) }}>
        Trump took office on 20 January 2025.
      </Aside>

      <div style={{ position: "absolute", inset: 0, ...riseStyle(mapIn, 0, 30), opacity: Math.min(1, mapIn) * (1 - toCongress) * (1 - exit) }}>
        <TileMap
          left={MAP.left}
          top={MAP.top}
          tile={MAP.tile}
          gap={MAP.gap}
          style={(s) => {
            const lit = progress(frame, fillFrom + ((fillTo - fillFrom) * s.col) / (maxCol + 1), fillFrom + ((fillTo - fillFrom) * (s.col + 1)) / (maxCol + 1));
            const on = lit > 0.5;
            return {
              fill: on ? PARTY[s.won] : EMPTY,
              text: on ? US.white : US.inkSoft,
              opacity: 1,
              scale: on ? 1 + 0.12 * Math.sin(Math.min(1, (lit - 0.5) * 2) * Math.PI) : 1,
              split: on && s.split ? { fill: PARTY[s.won === "R" ? "D" : "R"], share: s.split / s.ev } : undefined,
            };
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 120,
          top: PANEL.top,
          width: 840,
          height: PANEL.height,
          borderRadius: 24,
          background: US.card,
          boxShadow: "0 24px 56px rgba(11,30,58,0.14)",
          fontFamily: FONT.body,
          ...riseStyle(panel, exit, 40),
        }}
      >
        <Mono size={19} color={US.inkSoft} style={{ position: "absolute", left: 40, top: 30, letterSpacing: 3.5 }}>
          CONGRESS · AS ELECTED IN 2024
        </Mono>
        <ChamberBar label="HOUSE" r={RESULT_2024.house.R} d={RESULT_2024.house.D} total={435} note="218 = MAJORITY" top={78} p={bars} />
        <ChamberBar label="SENATE" r={RESULT_2024.senate.R} d={RESULT_2024.senate.D} total={100} note="DEM INCL. 2 INDEPENDENTS" top={232} p={bars} />
      </div>

      {/* The electoral score: Trump left, Harris right, across the 270 line. */}
      <div style={{ position: "absolute", inset: 0, ...riseStyle(score, exit, 30) }}>
        {(["R", "D"] as const).map((side) => {
          const c = RESULT_2024[side];
          const left = side === "R";
          return (
            <div key={side} style={{ position: "absolute", top: SCORE.top, ...(left ? { left: 120 } : { right: 120 }), textAlign: left ? "left" : "right" }}>
              <Mono size={19} color={US.inkSoft} style={{ letterSpacing: 3 }}>
                {c.name.toUpperCase()} · {c.party.toUpperCase()}
              </Mono>
              <div style={{ marginTop: 6, fontFamily: FONT.display, fontSize: 84, lineHeight: 1, color: PARTY[side], opacity: (left ? r : d) > 0 ? 1 : 0 }}>
                {Math.round(EV_2024[side] * (left ? r : d))}
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.width, height: BAR.height, borderRadius: 10, background: EMPTY, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(100 * EV_2024.R * r) / ELECTORS}%`, background: PARTY.R }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${(100 * EV_2024.D * d) / ELECTORS}%`, background: PARTY.D }} />
        </div>
        <div style={{ position: "absolute", left: BAR.left + (BAR.width * TO_WIN) / ELECTORS - 3, top: BAR.top - 12, width: 6, height: BAR.height + 24, borderRadius: 3, background: US.ink }} />
        <Mono size={17} color={US.ink} style={{ position: "absolute", left: BAR.left + (BAR.width * TO_WIN) / ELECTORS - 60, width: 120, textAlign: "center", top: BAR.top - 40 }}>
          {TO_WIN}
        </Mono>
        <div style={{ position: "absolute", left: BAR.left, width: BAR.width, top: BAR.top + 44, display: "flex", justifyContent: "space-between", ...riseStyle(popular, 0, 12) }}>
          <Mono size={17} color={US.inkSoft} style={{ letterSpacing: 2.5 }}>
            POPULAR VOTE {RESULT_2024.R.popular}
          </Mono>
          <Mono size={17} color={US.inkSoft} style={{ letterSpacing: 2.5 }}>
            {RESULT_2024.D.popular}
          </Mono>
        </div>
      </div>

    </>
  );
};
