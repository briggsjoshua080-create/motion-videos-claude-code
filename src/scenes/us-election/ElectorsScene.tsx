import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ELECTORS, EXAMPLE_STATE, FONT, STATES, TO_WIN, US, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mono } from "./ui";
import { TileMap } from "./TileMap";

const MAP = { left: 147, top: 680, tile: 66, gap: 6 } as const;
const PITCH = MAP.tile + MAP.gap;
const example = STATES.find((s) => s.id === EXAMPLE_STATE)!;
const SPLITTERS = ["ME", "NE"];
/** The empty grid cells top left (rows 0–1, columns 1–8) hold the counter and the 270 bar. */
const COUNTER = { left: MAP.left + PITCH + 6, top: MAP.top + 4 } as const;
const BAR = { left: MAP.left + PITCH * 4 + 10, top: MAP.top + 62, width: 300, height: 22 } as const;

/**
 * "Your vote for president really picks electors. Whoever wins a state usually takes all of them.
 * 538 in all. 270 wins the White House." All 50 states and DC pop in as tiles with their electors;
 * one state lights up (win it, take all its electors), Maine and Nebraska get a ring (they can
 * split theirs); then the counter runs to 538 and a bar marks the 270 needed to win.
 */
export const ElectorsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, cue("electors", "picks") - 4);
  const tilesFrom = cue("electors", "president") - 2;
  const tilesTo = cue("electors", "electors", "end");
  const winner = progress(frame, cue("electors", "Whoever") - 4, cue("electors", "wins") + 4);
  const all = pop(frame, cue("electors", "all") - 4);
  const usually = rise(frame, cue("electors", "usually") - 2);
  const back = progress(frame, cue("win", "538") - 6, cue("win", "538") + 4);
  const counter = rise(frame, cue("win", "538") - 6);
  const count = progress(frame, cue("win", "538") - 2, cue("win", "538", "end"), Easing.out(Easing.cubic));
  const bar = rise(frame, cue("win", "270") - 8);
  const fill = progress(frame, cue("win", "270") - 2, cue("win", "wins") + 4, Easing.out(Easing.quad));
  const house = pop(frame, cue("win", "White") - 3);

  const focus = winner * (1 - back);
  const asideOut = progress(frame, cue("electors", "Whoever") - 10, cue("electors", "Whoever") - 4);
  const asideSwap = progress(frame, cue("electors", "Whoever") - 4, cue("electors", "Whoever") + 4);
  const maxOrder = Math.max(...STATES.map((s) => s.col + s.row));

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>05 — THE ELECTORAL COLLEGE</Eyebrow>
      <Headline size={92} style={{ top: 356, ...riseStyle(head[0], exit, 50) }}>
        THE ELECTORAL
      </Headline>
      <Headline size={92} style={{ top: 356 + 92, ...riseStyle(head[1], exit, 50) }}>
        <Accent>COLLEGE</Accent>
      </Headline>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - asideOut }}>
        <Aside size={42} style={{ top: 588, ...riseStyle(aside, exit, 24) }}>
          Each state: one elector per seat in Congress.
        </Aside>
      </div>
      <Aside size={42} style={{ top: 588, opacity: asideSwap * (1 - exit) }}>
        Win a state — take <span style={{ color: US.redBright }}>all</span> its electors.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <TileMap
          left={MAP.left}
          top={MAP.top}
          tile={MAP.tile}
          gap={MAP.gap}
          style={(s) => {
            const p = pop(frame, tilesFrom + ((tilesTo - tilesFrom) * (s.col + s.row)) / maxOrder);
            const isExample = s.id === example.id;
            const isSplitter = SPLITTERS.includes(s.id);
            const dim = isExample ? 0 : 0.6 * focus;
            return {
              fill: isExample && focus > 0.5 ? US.white : `rgba(255,255,255,${0.16 + 0.1 * back})`,
              text: isExample && focus > 0.5 ? US.navy : US.white,
              opacity: Math.max(0, p) * 1.5 * (1 - dim),
              scale: (0.6 + 0.4 * Math.min(1.1, Math.max(0, p))) * (isExample ? 1 + 0.45 * focus : 1),
              ring: isExample && focus > 0.5 ? US.redBright : isSplitter && usually > 0.3 && back < 1 ? US.redBright : undefined,
            };
          }}
        />

        {/* "ALL 19" pops next to the example state. */}
        <div
          style={{
            position: "absolute",
            left: MAP.left + example.col * PITCH + MAP.tile * 0.5 - 70,
            top: MAP.top + example.row * PITCH - 74,
            width: 140,
            padding: "8px 0",
            borderRadius: 999,
            background: US.red,
            textAlign: "center",
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 2,
            color: US.white,
            zIndex: 3,
            opacity: Math.min(1, Math.max(0, all) * 1.5) * (1 - back),
            transform: `scale(${0.6 + 0.4 * all})`,
          }}
        >
          ALL {example.ev}
        </div>

        <Mono
          size={16}
          color={US.textSoft}
          style={{ position: "absolute", left: MAP.left + PITCH * 4 + 6, top: MAP.top + PITCH * 7 + 8, letterSpacing: 2, lineHeight: 1.5, whiteSpace: "normal", width: PITCH * 4, opacity: Math.min(1, usually) }}
        >
          <span style={{ color: US.redBright }}>○</span> MAINE &amp; NEBRASKA CAN SPLIT THEIRS
        </Mono>

        <div style={{ position: "absolute", left: COUNTER.left, top: COUNTER.top, fontFamily: FONT.display, fontSize: 96, lineHeight: 1, color: US.white, textShadow: "0 0 30px rgba(255,255,255,0.35)", opacity: Math.min(1, counter) }}>
          {Math.round(ELECTORS * count)}
        </div>
        <Mono size={18} color={US.textSoft} style={{ position: "absolute", left: BAR.left, top: MAP.top + 18, opacity: Math.min(1, counter) }}>
          ELECTORS IN ALL
        </Mono>
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.width, height: BAR.height, borderRadius: 11, background: "rgba(255,255,255,0.14)", overflow: "hidden", opacity: Math.min(1, bar) }}>
          <div style={{ width: `${(100 * TO_WIN * fill) / ELECTORS}%`, height: "100%", background: US.white, boxShadow: "0 0 20px rgba(255,255,255,0.4)" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: BAR.left + (BAR.width * TO_WIN) / ELECTORS - 3,
            top: BAR.top - 12,
            width: 6,
            height: BAR.height + 24,
            borderRadius: 3,
            background: US.redBright,
            boxShadow: "0 0 14px rgba(240,71,94,0.6)",
            opacity: Math.min(1, bar),
          }}
        />
        <Mono size={18} color={US.redBright} style={{ position: "absolute", left: BAR.left, top: BAR.top + 38, opacity: Math.min(1, bar) }}>
          {TO_WIN} TO WIN
          <span style={{ color: US.white, opacity: Math.min(1, Math.max(0, house)) }}> → WHITE HOUSE</span>
        </Mono>
      </div>
    </>
  );
};
