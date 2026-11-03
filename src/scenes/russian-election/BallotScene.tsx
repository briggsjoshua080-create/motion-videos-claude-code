import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { DISTRICT_BALLOT, DISTRICT_PICK, FONT, LIST_BALLOT, LIST_PICK, RU, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mark, Mono, PaperLayer } from "./ui";

const SHEET = { top: 680, w: 408, h: 496, gap: 24 } as const;
const ROW = { top: 132, h: 60 } as const;
const BOX = 40;

/**
 * "For parliament, you get two ballots: one with parties, one with local candidates. Tick one box on
 * each." On light paper like the reference's ballot scene: two generic State Duma ballots (made-up
 * names, not the real layout) slide in on "two ballots"; the party-list sheet lights up on
 * "parties", the district sheet on "local candidates"; one mark lands on the list sheet on "Tick"
 * and one on the district sheet on "each". A note: any mark in one empty square.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = [rise(frame, 6), rise(frame, 10)];
  const aside = rise(frame, cue("ballot", "parliament") - 4);
  const sheets = [rise(frame, cue("ballot", "two") - 6), rise(frame, cue("ballot", "ballots") - 4)];
  const hi = [
    progress(frame, cue("ballot", "parties") - 4, cue("ballot", "parties") + 4) * (1 - progress(frame, cue("ballot", "local") - 4, cue("ballot", "local") + 2)),
    progress(frame, cue("ballot", "local") - 4, cue("ballot", "local") + 4) * (1 - progress(frame, cue("ballot", "Tick") - 4, cue("ballot", "Tick") + 2)),
  ];
  const ticks = [progress(frame, cue("ballot", "Tick") - 2, cue("ballot", "Tick") + 8), progress(frame, cue("ballot", "each") - 3, cue("ballot", "each") + 7)];
  const note = rise(frame, cue("ballot", "box") - 4);
  const ok = [pop(frame, cue("ballot", "Tick") + 8), pop(frame, cue("ballot", "each") + 6)];

  const sheet = (i: 0 | 1) => {
    const left = 120 + i * (SHEET.w + SHEET.gap);
    const rows = i === 0 ? LIST_BALLOT.map((name) => ({ name, sub: "federal list" })) : DISTRICT_BALLOT.map((c) => ({ name: c.name, sub: c.party.toLowerCase() }));
    const pick = i === 0 ? LIST_PICK : DISTRICT_PICK;
    const s = sheets[i];
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left,
          top: SHEET.top,
          width: SHEET.w,
          height: SHEET.h,
          borderRadius: 14,
          background: RU.card,
          border: `2px solid ${hi[i] > 0.05 ? RU.red : "#D5CDBE"}`,
          boxSizing: "border-box",
          boxShadow: hi[i] > 0.05 ? `0 0 0 ${4 * hi[i]}px rgba(213,43,30,0.25), 0 24px 44px rgba(10,30,60,0.16)` : "0 24px 44px rgba(10,30,60,0.16)",
          fontFamily: FONT.body,
          overflow: "hidden",
          opacity: Math.min(1, Math.max(0, s) * 1.5) * (1 - exit),
          transform: `translateY(${(1 - Math.min(1, s)) * 60}px) rotate(${i === 0 ? -1.2 : 1.2}deg) scale(${1 + 0.03 * hi[i]})`,
        }}
      >
        {/* The flag's stripes as a header band. */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, background: RU.white }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 10, height: 10, background: RU.blue }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 20, height: 10, background: RU.red }} />
        <Mono size={15} color={RU.inkSoft} style={{ position: "absolute", left: 22, top: 46, letterSpacing: 2 }}>
          {i === 0 ? "BALLOT 1 · NATIONWIDE" : "BALLOT 2 · YOUR DISTRICT"}
        </Mono>
        <div style={{ position: "absolute", left: 22, top: 74, fontFamily: FONT.display, fontSize: 30, color: RU.ink }}>{i === 0 ? "PARTIES" : "CANDIDATES"}</div>
        {rows.map((r, k) => (
          <div key={r.name} style={{ position: "absolute", left: 0, top: ROW.top + k * ROW.h, width: SHEET.w, height: ROW.h, borderTop: "1.5px solid #E2DBCD" }}>
            <div style={{ position: "absolute", left: 22, top: 10, fontFamily: FONT.display, fontSize: 19, color: RU.ink }}>{r.name}</div>
            <div style={{ position: "absolute", left: 22, top: 34, fontSize: 15, fontWeight: 500, color: RU.inkSoft }}>{r.sub}</div>
            <div style={{ position: "absolute", right: 24, top: (ROW.h - BOX) / 2, width: BOX, height: BOX, border: `3px solid ${RU.ink}`, boxSizing: "border-box", background: RU.white }} />
            {k === pick && (
              <div style={{ position: "absolute", right: 18, top: (ROW.h - BOX) / 2 - 12 }}>
                <Mark ok size={54} p={ticks[i]} color={RU.blue} width={10} />
              </div>
            )}
          </div>
        ))}
        {/* A green "valid" chip once the one mark is in. */}
        <div
          style={{
            position: "absolute",
            left: 22,
            bottom: 14,
            padding: "4px 12px",
            borderRadius: 999,
            background: RU.blue,
            color: RU.white,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: 1.5,
            opacity: Math.min(1, Math.max(0, ok[i]) * 1.5),
            transform: `scale(${0.6 + 0.4 * Math.min(1, ok[i])})`,
            transformOrigin: "left center",
          }}
        >
          ONE MARK · VALID
        </div>
      </div>
    );
  };

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        03 — THE BALLOTS
      </Eyebrow>
      <Headline light size={124} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        TWO
      </Headline>
      <Headline light size={124} style={{ top: 352 + 122, ...riseStyle(head[1], exit, 50) }}>
        <Accent light>BALLOTS</Accent>
      </Headline>
      <Aside light size={40} style={{ top: 620, ...riseStyle(aside, exit, 20) }}>
        For the State Duma, Russia's parliament.
      </Aside>
      {sheet(0)}
      {sheet(1)}
      <Mono size={17} color={RU.inkSoft} style={{ position: "absolute", left: 120, width: 840, top: 1204, textAlign: "center", letterSpacing: 1.6, ...riseStyle(note, exit, 14) }}>
        ANY MARK IN ONE EMPTY SQUARE · ONLINE IN SOME REGIONS
      </Mono>
    </>
  );
};
