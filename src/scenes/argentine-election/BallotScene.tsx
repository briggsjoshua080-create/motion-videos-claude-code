import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { AR, BALLOT_PARTIES, BALLOT_ROWS, BALLOT_TICKS, FONT, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mark, Mono, PaperLayer } from "./ui";

const SHEET = { left: 120, top: 680, w: 840, h: 420 } as const;
const GRID = { label: 200, col: 160, head: 54, headH: 84, row: 92 } as const;
const BOX = { size: 40 } as const;
const URN = { left: 400, top: 1084, w: 280, h: 160 } as const;

/**
 * "Since 2025, there's one paper ballot: a row per race, a column per party. Tick one box per row,
 * fold it, and drop it in." On light paper like the reference's ballot scene: a generic single paper
 * ballot (Boleta Única de Papel; made-up parties, not the real layout) with one row per race and
 * one column per party. A row lights up on "row", a column on "column"; one tick lands in each row
 * from "Tick" on; the sheet folds small on "fold" and drops into a ballot box on "drop".
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = [rise(frame, 6), rise(frame, 10)];
  const aside = rise(frame, cue("ballot", "paper") - 6);
  const sheet = rise(frame, cue("ballot", "one") - 10);
  const rowHi = progress(frame, cue("ballot", "row") - 3, cue("ballot", "row") + 4) * (1 - progress(frame, cue("ballot", "column") - 2, cue("ballot", "column") + 4));
  const colHi = progress(frame, cue("ballot", "column") - 3, cue("ballot", "column") + 4) * (1 - progress(frame, cue("ballot", "Tick") - 4, cue("ballot", "Tick") + 2));
  const tickFrom = cue("ballot", "Tick") - 2;
  const tickStep = Math.max(4, Math.round((cue("ballot", "row#2", "end") - tickFrom) / BALLOT_ROWS.length));
  const ticks = BALLOT_ROWS.map((_, i) => progress(frame, tickFrom + i * tickStep, tickFrom + i * tickStep + 8));
  const fold = progress(frame, cue("ballot", "fold") - 3, cue("ballot", "it") + 4, Easing.inOut(Easing.cubic));
  const urn = pop(frame, cue("ballot", "fold") - 2);
  const drop = progress(frame, cue("ballot", "drop") - 2, cue("ballot", "in") + 4, Easing.in(Easing.quad));

  // Folded: the sheet shrinks above the ballot box; dropped: it slides into the slot.
  const scale = 1 - 0.62 * fold;
  const squash = 1 - 0.6 * fold;
  const centerY = SHEET.top + SHEET.h / 2;
  const target = URN.top - 40;
  const y = (target - centerY) * fold + 120 * drop;

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        03 — THE BALLOT
      </Eyebrow>
      <Headline light size={120} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        ONE BOX
      </Headline>
      <Headline light size={120} style={{ top: 352 + 118, ...riseStyle(head[1], exit, 50) }}>
        <Accent light>PER ROW</Accent>
      </Headline>
      <Aside light size={40} style={{ top: 606, ...riseStyle(aside, exit, 20) }}>
        One paper ballot for everyone — since 2025.
      </Aside>

      {/* The ballot box (appears on "fold"). */}
      <div style={{ position: "absolute", left: URN.left, top: URN.top, width: URN.w, height: URN.h, opacity: Math.min(1, Math.max(0, urn) * 1.5) * (1 - exit), transform: `scale(${0.6 + 0.4 * urn})`, transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: URN.w, height: URN.h, borderRadius: 16, background: AR.blue, boxShadow: "0 18px 36px rgba(10,30,60,0.25)" }} />
        <div style={{ position: "absolute", left: URN.w / 2 - 80, top: 18, width: 160, height: 12, borderRadius: 6, background: AR.navy }} />
        <Mono size={18} color={AR.white} style={{ position: "absolute", left: 0, width: URN.w, top: 90, textAlign: "center", letterSpacing: 4 }}>
          BALLOT BOX
        </Mono>
      </div>

      {/* The ballot sheet. */}
      <div
        style={{
          position: "absolute",
          left: SHEET.left,
          top: SHEET.top,
          width: SHEET.w,
          height: SHEET.h,
          borderRadius: 14,
          background: AR.card,
          border: "2px solid #D5CDBE",
          boxSizing: "border-box",
          boxShadow: "0 24px 44px rgba(10,30,60,0.16)",
          fontFamily: FONT.body,
          overflow: "hidden",
          opacity: (1 - Math.max(0, drop * 1.6 - 0.6)) * Math.min(1, Math.max(0, sheet) * 1.5) * (1 - exit),
          transform: `translateY(${y + (1 - Math.min(1, sheet)) * 40}px) scale(${scale}, ${scale * squash})`,
          zIndex: 1,
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: GRID.head - 8, background: AR.celeste, display: "flex", alignItems: "center", paddingLeft: 22 }}>
          <Mono size={16} color={AR.navy} style={{ letterSpacing: 3 }}>
            SINGLE PAPER BALLOT · NATIONAL ELECTION
          </Mono>
        </div>
        {/* Column highlight. */}
        <div style={{ position: "absolute", left: GRID.label, top: GRID.head - 8, width: GRID.col, bottom: 0, background: "rgba(246,180,14,0.28)", opacity: colHi }} />
        {/* Party headers. */}
        {BALLOT_PARTIES.map((p, c) => (
          <div key={p.name} style={{ position: "absolute", left: GRID.label + c * GRID.col, top: GRID.head, width: GRID.col, height: GRID.headH - 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, borderLeft: "1.5px solid #E2DBCD" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: p.color }} />
            <div style={{ fontFamily: FONT.display, fontSize: 18, color: AR.ink }}>{p.name}</div>
          </div>
        ))}
        {BALLOT_ROWS.map((race, r) => {
          const top = GRID.head + GRID.headH + r * GRID.row;
          return (
            <div key={race} style={{ position: "absolute", left: 0, top, width: SHEET.w, height: GRID.row, borderTop: "1.5px solid #E2DBCD" }}>
              {r === 0 && <div style={{ position: "absolute", inset: 0, background: "rgba(246,180,14,0.28)", opacity: rowHi }} />}
              <div style={{ position: "absolute", left: 22, top: 0, height: GRID.row, display: "flex", alignItems: "center", fontFamily: FONT.display, fontSize: 21, color: AR.ink }}>{race}</div>
              {BALLOT_PARTIES.map((p, c) => {
                const ticked = BALLOT_TICKS[r] === c;
                return (
                  <div key={p.name} style={{ position: "absolute", left: GRID.label + c * GRID.col, top: 0, width: GRID.col, height: GRID.row, borderLeft: "1.5px solid #E2DBCD" }}>
                    <div style={{ position: "absolute", left: 16, top: 30, width: 70, height: 8, borderRadius: 4, background: "#D9D3C6" }} />
                    <div style={{ position: "absolute", left: 16, top: 46, width: 50, height: 8, borderRadius: 4, background: "#E6E0D4" }} />
                    <div style={{ position: "absolute", right: 18, top: (GRID.row - BOX.size) / 2, width: BOX.size, height: BOX.size, borderRadius: 6, border: `3px solid ${AR.ink}`, boxSizing: "border-box", background: AR.white }} />
                    {ticked && (
                      <div style={{ position: "absolute", right: 12, top: (GRID.row - BOX.size) / 2 - 12 }}>
                        <Mark ok size={54} p={ticks[r]} color={AR.blue} width={10} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* The front of the ballot box, so the dropped ballot disappears into it. */}
      <div style={{ position: "absolute", left: URN.left, top: URN.top + 26, width: URN.w, height: URN.h - 26, borderRadius: "0 0 16px 16px", background: AR.blue, zIndex: 2, opacity: Math.min(1, Math.max(0, urn) * 1.5) * (1 - exit) * (drop > 0 ? 1 : 0) }}>
        <Mono size={18} color={AR.white} style={{ position: "absolute", left: 0, width: URN.w, top: 64, textAlign: "center", letterSpacing: 4 }}>
          BALLOT BOX
        </Mono>
      </div>
    </>
  );
};
