import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CANDIDATES, FONT, NO, PICKED, RACK, type SceneProps } from "./constants";
import { Accent, Eyebrow, Headline, Mono, PaperLayer } from "./ui";

/** The full-size ballot paper; the rack shows the same paper scaled down. */
const PAPER = { w: 400, h: 500 } as const;
const ROW = { top: 176, step: 54 } as const;

/** One party's ballot paper: the party's name over its fixed list of candidates. `fold` folds the bottom half up. */
const BallotPaper: React.FC<{ party: string; fold?: number; stamp?: number }> = ({ party, fold = 0, stamp = 0 }) => {
  // The bottom half swings up over the top half; once past halfway we see its back (blank, where the stamp goes).
  const flapScale = Math.cos(fold * Math.PI);
  const back = flapScale < 0;
  const sheet: React.CSSProperties = {
    position: "absolute",
    left: 0,
    width: PAPER.w,
    height: PAPER.h / 2,
    background: NO.cream,
    border: "2px solid #D9D2C4",
    boxSizing: "border-box",
    overflow: "hidden",
  };
  const face = (
    <>
      <div style={{ position: "absolute", left: 26, top: 22, fontFamily: FONT.mono, fontWeight: 700, fontSize: 15, letterSpacing: 2.6, color: NO.inkSoft }}>
        STORTING ELECTION
      </div>
      <div style={{ position: "absolute", left: 24, top: 50, fontFamily: FONT.display, fontSize: 58, lineHeight: 1, letterSpacing: -0.5, color: NO.ink }}>{party}</div>
      <div style={{ position: "absolute", left: 26, right: 26, top: 126, height: 4, background: NO.red }} />
      <div style={{ position: "absolute", left: 26, top: 140, fontSize: 16, fontWeight: 600, color: NO.inkSoft }}>Candidates, in the party's order</div>
      {CANDIDATES.map((name, i) => (
        <div key={name} style={{ position: "absolute", left: 26, top: ROW.top + i * ROW.step, fontSize: 25, fontWeight: 600, color: NO.ink, whiteSpace: "nowrap" }}>
          <span style={{ color: NO.inkSoft, marginRight: 10 }}>{i + 1}.</span>
          {name}
        </div>
      ))}
    </>
  );
  return (
    <div style={{ position: "relative", width: PAPER.w, height: PAPER.h, fontFamily: FONT.body, filter: "drop-shadow(0 22px 30px rgba(10,34,56,0.22))" }}>
      <div style={{ ...sheet, top: 0, borderRadius: "8px 8px 0 0" }}>{face}</div>
      <div
        style={{
          ...sheet,
          top: PAPER.h / 2,
          borderRadius: back ? "8px 8px 0 0" : "0 0 8px 8px",
          transformOrigin: "50% 0",
          transform: `scaleY(${flapScale})`,
          background: back ? "#EFEADF" : NO.cream,
        }}
      >
        {!back && <div style={{ position: "absolute", left: 0, top: -PAPER.h / 2, width: PAPER.w, height: PAPER.h }}>{face}</div>}
        {back && (
          // Seen through scaleY(-1): draw the stamp upside down so it reads the right way up.
          <div style={{ position: "absolute", inset: 0, transform: "scaleY(-1)" }}>
            <div
              style={{
                position: "absolute",
                left: PAPER.w / 2 - 66,
                top: PAPER.h / 4 - 66,
                width: 132,
                height: 132,
                borderRadius: 66,
                border: `7px solid ${NO.blue}`,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: NO.blue,
                fontFamily: FONT.display,
                fontSize: 21,
                letterSpacing: 0.5,
                opacity: Math.min(1, Math.max(0, stamp) * 2),
                transform: `rotate(-12deg) scale(${1.6 - 0.6 * Math.min(1.15, Math.max(0, stamp))})`,
              }}
            >
              STAMPED
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const STEPS = ["Pick your party's paper", "Fold it", "An official stamps it", "Drop it in the box"] as const;

/** Where the rack papers sit (left x, top y at rack scale) and where the picked one goes. */
const RACK_SCALE = 0.56;
const RACK_X = [148, 428, 708];
const RACK_TOP = 760;
const BIG = { x: 140, y: 700, s: 0.9 } as const;
/** The ballot box: the slot line is its top edge; the paper vanishes into it. */
const BOX = { x: 150, y: 1050, w: 340, h: 190 } as const;

/**
 * "One ballot paper per party: pick one, fold it, get it stamped, drop it in the box." On light
 * paper like the reference's ballot scene: a rack of party papers, the voter's paper comes forward,
 * folds in half, gets the official's stamp on the outside and slides into the ballot box, while
 * the four steps light up on the right. A pill notes that since 2025 the list can't be changed.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = [rise(frame, 6), rise(frame, 10)];
  const rack = RACK.map((_, i) => pop(frame, cue("ballot", "paper") - 4 + i * 4));
  const fixed = pop(frame, cue("ballot", "party") + 2);
  const pick = progress(frame, cue("ballot", "pick") - 4, cue("ballot", "one#2") + 8, Easing.bezier(0.45, 0, 0.2, 1));
  const fold = progress(frame, cue("ballot", "fold") - 2, cue("ballot", "it") + 4, Easing.inOut(Easing.cubic));
  const stamp = pop(frame, cue("ballot", "stamped") - 2);
  const box = rise(frame, cue("ballot", "stamped") - 4);
  const drop = progress(frame, cue("ballot", "drop") - 2, cue("ballot", "box") + 2, Easing.in(Easing.cubic));
  const steps = [cue("ballot", "pick") - 2, cue("ballot", "fold") - 3, cue("ballot", "stamped") - 4, cue("ballot", "drop") - 4].map((t) => rise(frame, t));
  const active = [pick, fold, stamp, drop].filter((p) => p > 0.05).length - 1;

  // The picked paper: from its rack slot to the big spot; after folding it shrinks a little and drops through the slot.
  const lifted = interpolate(pick, [0, 1], [RACK_SCALE, BIG.s]);
  const ps = lifted * (1 - 0.12 * progress(frame, cue("ballot", "stamped") + 6, cue("ballot", "drop") - 2));
  const px = interpolate(pick, [0, 1], [RACK_X[PICKED], BIG.x]) + ((BIG.s - ps) * PAPER.w) / 2;
  const restY = interpolate(pick, [0, 1], [RACK_TOP, BIG.y]);
  const aboveBox = BOX.y - 30 - (PAPER.h / 2) * ps;
  const py = interpolate(progress(frame, cue("ballot", "stamped") + 6, cue("ballot", "drop") - 2), [0, 1], [restY, aboveBox]) + drop * ((PAPER.h / 2) * ps + 60);

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        03 — THE BALLOT
      </Eyebrow>
      <Headline light size={132} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        ONE PAPER
      </Headline>
      <Headline light size={132} style={{ top: 352 + 129, ...riseStyle(head[1], exit, 50) }}>
        <Accent light>PER PARTY</Accent>
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 640,
          padding: "8px 18px",
          borderRadius: 999,
          background: NO.blue,
          fontFamily: FONT.mono,
          fontWeight: 700,
          fontSize: 19,
          letterSpacing: 2.5,
          color: NO.white,
          whiteSpace: "nowrap",
          opacity: Math.min(1, Math.max(0, fixed) * 1.5) * (1 - exit),
          transform: `scale(${0.6 + 0.4 * fixed})`,
          transformOrigin: "left center",
        }}
      >
        NAMES ARE FIXED · NO CHANGES SINCE 2025
      </div>

      {/* The other parties' papers leave when the voter picks theirs. */}
      {RACK.map((party, i) => {
        if (i === PICKED) return null;
        const away = (i < PICKED ? -1 : 1) * pick * 260;
        return (
          <div
            key={party}
            style={{
              position: "absolute",
              left: RACK_X[i] + away,
              top: RACK_TOP,
              transformOrigin: "0 0",
              transform: `scale(${RACK_SCALE * (0.6 + 0.4 * rack[i])}) rotate(${(i - 1) * 3}deg)`,
              opacity: Math.min(1, Math.max(0, rack[i]) * 1.5) * (1 - pick) * (1 - exit),
            }}
          >
            <BallotPaper party={party} />
          </div>
        );
      })}

      {/* The picked paper, clipped at the box's slot so it disappears into the box. */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: drop > 0 ? BOX.y : 1920, overflow: "hidden", opacity: 1 - exit }}>
        <div
          style={{
            position: "absolute",
            left: px,
            top: py,
            transformOrigin: "0 0",
            transform: `scale(${ps * (0.6 + 0.4 * Math.min(1, rack[PICKED]))})`,
            opacity: Math.min(1, Math.max(0, rack[PICKED]) * 1.5),
          }}
        >
          <BallotPaper party={RACK[PICKED]} fold={fold} stamp={stamp} />
        </div>
      </div>

      {/* The ballot box. */}
      <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h, ...riseStyle(box, exit, 50) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: NO.blue, boxShadow: "0 22px 40px rgba(0,20,60,0.3)" }} />
        <div style={{ position: "absolute", left: 60, right: 60, top: -6, height: 12, borderRadius: 6, background: NO.ink }} />
        <Mono size={22} color={NO.white} style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", letterSpacing: 5 }}>
          BALLOT BOX
        </Mono>
      </div>

      {/* The four steps light up on the right. */}
      {STEPS.map((title, i) => {
        const on = steps[i];
        const top = 740 + i * 122;
        const current = i === active;
        return (
          <div key={title} style={{ position: "absolute", left: 590, top, width: 380, display: "flex", alignItems: "center", gap: 16, ...riseStyle(on, exit, 30) }}>
            <div
              style={{
                width: 56,
                height: 56,
                flexShrink: 0,
                borderRadius: 28,
                background: current ? NO.red : NO.blue,
                color: NO.white,
                fontFamily: FONT.display,
                fontSize: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 18px rgba(0,32,91,0.25)",
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontFamily: FONT.body, fontSize: 30, fontWeight: 800, color: NO.ink, lineHeight: 1.12 }}>{title}</div>
          </div>
        );
      })}
    </>
  );
};
