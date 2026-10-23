import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, US, type SceneProps } from "./constants";
import { Accent, Eyebrow, Headline, Mark, Mono, PaperLayer } from "./ui";

/**
 * The made-up ballot: one paper with every race, top to bottom. Names are placeholders on
 * purpose, so no real candidate or party is shown being voted for.
 */
const RACES = [
  { title: "PRESIDENT & VICE PRESIDENT", rows: ["Candidate A · Party A", "Candidate B · Party B"] },
  { title: "U.S. SENATE", rows: ["Candidate C · Party A", "Candidate D · Party B"] },
  { title: "U.S. HOUSE · DISTRICT 4", rows: ["Candidate E · Party A", "Candidate F · Party B"] },
  { title: "GOVERNOR", rows: ["Candidate G · Party A", "Candidate H · Party B"] },
  { title: "COUNTY SHERIFF", rows: ["Candidate J", "Candidate K"] },
] as const;
/** The race and row the voter fills in. */
const PICK = { race: 0, row: 1 } as const;

const BALLOT = { x: 120, y: 650, w: 500, h: 580 } as const;
const HEAD_H = 66;
const RACE = { h: 100, header: 30, row: 33 } as const;
const OVAL = { w: 34, h: 20, x: 22 } as const;

const ovalTop = (race: number, row: number) => HEAD_H + race * RACE.h + RACE.header + 8 + row * RACE.row + (RACE.row - OVAL.h) / 2 - 4;

/** A navy pen, tip at the origin. */
const Pen: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg width={60} height={190} viewBox="0 0 60 190" style={{ position: "absolute", overflow: "visible", ...style }}>
    <g transform="rotate(32 0 0)">
      <path d="M0 0 L-8 -24 L8 -24 Z" fill="#C9CED8" />
      <path d="M0 0 L-3 -9 L3 -9 Z" fill={US.navyNight} />
      <rect x={-9} y={-168} width={18} height={144} rx={4} fill={US.navy} />
      <rect x={-9} y={-168} width={6} height={144} fill="rgba(255,255,255,0.22)" />
      <rect x={6} y={-160} width={5} height={50} rx={2} fill="#C9CED8" />
    </g>
  </svg>
);

/** An empty or filled ballot oval; `fill` 0 -> 1 colours it in from left to right. */
const Oval: React.FC<{ fill?: number; crossed?: boolean }> = ({ fill = 0, crossed }) => (
  <div style={{ position: "relative", width: OVAL.w, height: OVAL.h, borderRadius: OVAL.h / 2, border: `2.5px solid ${US.ink}`, boxSizing: "border-box", overflow: "hidden", flexShrink: 0 }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: US.ink }} />
    {crossed && (
      <svg width={OVAL.w} height={OVAL.h} viewBox="0 0 34 20" style={{ position: "absolute", left: -2.5, top: -2.5 }}>
        <path d="M9 3 L25 17 M25 3 L9 17" stroke={US.ink} strokeWidth={2.5} strokeLinecap="round" />
      </svg>
    )}
  </div>
);

/**
 * "One paper ballot lists every race, from president to sheriff. Fill in the oval next to your
 * choice." On light paper: a long made-up ballot whose races light up from president down to
 * sheriff, then a pen fills one oval; on the right, the rule (fill the oval, no X or tick) and how
 * ballots differ from state to state.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = [rise(frame, 6), rise(frame, 10)];
  const ballot = rise(frame, cue("ballot", "One") - 2);
  // The races light up one after the other, from "every race" to "sheriff".
  const scan = progress(frame, cue("ballot", "every"), cue("ballot", "sheriff", "end"), Easing.inOut(Easing.quad)) * RACES.length;
  const scanDone = progress(frame, cue("ballot", "Fill") - 4, cue("ballot", "Fill") + 4);
  const pen = progress(frame, cue("ballot", "Fill") - 8, cue("ballot", "Fill"));
  const fill = progress(frame, cue("ballot", "oval") - 2, cue("ballot", "next") + 2, Easing.inOut(Easing.quad));
  const penAway = progress(frame, cue("ballot", "your"), cue("ballot", "choice") + 4);
  const rule = rise(frame, cue("ballot", "Fill") - 4);
  const right = pop(frame, cue("ballot", "oval") - 2);
  const wrong = pop(frame, cue("ballot", "next") - 2);
  const notes = rise(frame, cue("ballot", "race") + 4);

  const pick = { x: OVAL.x + OVAL.w * fill, y: ovalTop(PICK.race, PICK.row) + OVAL.h / 2 };

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        03 — THE BALLOT
      </Eyebrow>
      <Headline light size={116} style={{ top: 360, ...riseStyle(head[0], exit, 50) }}>
        ONE BALLOT,
      </Headline>
      <Headline light size={116} style={{ top: 360 + 114, ...riseStyle(head[1], exit, 50) }}>
        <Accent light>EVERY RACE</Accent>
      </Headline>

      <div
        style={{
          position: "absolute",
          left: BALLOT.x,
          top: BALLOT.y,
          width: BALLOT.w,
          height: BALLOT.h,
          borderRadius: 8,
          background: US.card,
          border: "2px solid #D6D0C2",
          boxShadow: "0 22px 46px rgba(11,30,58,0.2)",
          boxSizing: "border-box",
          fontFamily: FONT.body,
          color: US.ink,
          overflow: "hidden",
          transform: `rotate(-1deg)`,
          ...riseStyle(ballot, exit, 60),
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: HEAD_H - 8, background: US.navy, color: US.white }}>
          <div style={{ position: "absolute", left: 22, top: 10, fontFamily: FONT.mono, fontWeight: 700, fontSize: 15, letterSpacing: 2.6, opacity: 0.8 }}>OFFICIAL BALLOT</div>
          <div style={{ position: "absolute", left: 22, top: 28, fontFamily: FONT.display, fontSize: 21, letterSpacing: 0.5 }}>GENERAL ELECTION</div>
        </div>
        {RACES.map((race, r) => {
          const lit = Math.min(1, Math.max(0, scan - r)) * (1 - 0.6 * scanDone * (r === PICK.race ? 0 : 1));
          return (
            <div key={race.title} style={{ position: "absolute", left: 0, right: 0, top: HEAD_H + r * RACE.h, height: RACE.h }}>
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  right: 12,
                  top: 0,
                  height: RACE.h - 6,
                  borderRadius: 6,
                  background: `rgba(179,25,66,${0.09 * lit})`,
                  boxShadow: lit > 0.05 ? `inset 0 0 0 2px rgba(179,25,66,${0.5 * lit})` : "none",
                }}
              />
              <div style={{ position: "absolute", left: 22, top: 6, fontFamily: FONT.mono, fontWeight: 700, fontSize: 15, letterSpacing: 1.6 }}>{race.title}</div>
              <div style={{ position: "absolute", right: 22, top: 7, fontSize: 13, fontWeight: 600, color: US.inkSoft }}>Vote for one</div>
              {race.rows.map((name, i) => (
                <div key={name} style={{ position: "absolute", left: OVAL.x, top: RACE.header + 8 + i * RACE.row - 4, height: RACE.row, display: "flex", alignItems: "center", gap: 16 }}>
                  <Oval fill={r === PICK.race && i === PICK.row ? fill : 0} />
                  <div style={{ fontSize: 21, fontWeight: 600, whiteSpace: "nowrap" }}>{name}</div>
                </div>
              ))}
            </div>
          );
        })}
        {/* The ballot goes on: judges, local questions, ... */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60, background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 70%)" }} />
        {pen > 0 && penAway < 1 && (
          <Pen
            style={{
              left: pick.x + (1 - pen) * 120 + penAway * 140,
              top: pick.y - (1 - pen) * 80 - penAway * 60 + Math.sin(fill * Math.PI * 6) * 3,
              opacity: Math.min(pen * 2, 1 - penAway),
            }}
          />
        )}
      </div>

      {/* The rule: fill the oval; an X or a tick may not count. */}
      <div style={{ position: "absolute", left: 660, top: 660, width: 300, fontFamily: FONT.body, ...riseStyle(rule, exit, 30) }}>
        <div style={{ fontFamily: FONT.display, fontSize: 44, lineHeight: 1.02, color: US.ink }}>
          FILL THE
          <br />
          <span style={{ color: US.red }}>OVAL</span>
        </div>
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16, opacity: Math.min(1, Math.max(0, right) * 1.5), transform: `scale(${0.6 + 0.4 * right})`, transformOrigin: "left center" }}>
          <div style={{ transform: "scale(1.5)", transformOrigin: "left center", width: OVAL.w * 1.5 }}>
            <Oval fill={1} />
          </div>
          <Mark ok size={34} p={1} color="#1F8A4C" />
          <div style={{ fontSize: 24, fontWeight: 700, color: US.ink }}>like this</div>
        </div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 16, opacity: Math.min(1, Math.max(0, wrong) * 1.5), transform: `scale(${0.6 + 0.4 * wrong})`, transformOrigin: "left center" }}>
          <div style={{ transform: "scale(1.5)", transformOrigin: "left center", width: OVAL.w * 1.5 }}>
            <Oval crossed />
          </div>
          <Mark ok={false} size={30} p={1} color={US.red} />
          <div style={{ fontSize: 24, fontWeight: 700, color: US.ink }}>no X or tick</div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 660, top: 1000, width: 300, ...riseStyle(notes, exit, 20) }}>
        <div style={{ height: 2, background: US.inkFaint, marginBottom: 20 }} />
        <Mono size={17} color={US.inkSoft} style={{ letterSpacing: 2.5, lineHeight: 1.6, whiteSpace: "normal" }}>
          EACH STATE DESIGNS ITS OWN BALLOT
        </Mono>
        <Mono size={17} color={US.navy} style={{ marginTop: 14, letterSpacing: 2.5, lineHeight: 1.6, whiteSpace: "normal" }}>
          VOTE EARLY, BY MAIL OR ON THE DAY
        </Mono>
      </div>
    </>
  );
};
