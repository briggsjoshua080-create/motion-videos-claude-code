import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CA, FONT, RIDING, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono, Stamp } from "./ui";

const BARS = { top: 780, left: 120, width: 840, height: 96, gap: 26, track: 600 } as const;
/** x of a share (in %) on the bar track. */
const shareX = (share: number) => BARS.left + 220 + (BARS.track * share) / 100;

/**
 * "The most votes wins the riding, even without half." One made-up riding: three candidates' bars
 * grow to 38 %, 34 % and 28 %; the top one turns white and gets a WINS THE SEAT stamp; on "without
 * half" a dashed 50 % line drops in and the losers' 62 % is counted together.
 */
export const RidingScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, 10);
  const bars = RIDING.map((_, i) => rise(frame, cue("riding", "most") - 8 + i * 3));
  const grow = progress(frame, cue("riding", "most"), cue("riding", "wins"), Easing.out(Easing.cubic));
  const win = progress(frame, cue("riding", "wins") - 2, cue("riding", "wins") + 6);
  const stamp = pop(frame, cue("riding", "riding") - 4);
  const half = progress(frame, cue("riding", "without") - 4, cue("riding", "half"));
  const rest = pop(frame, cue("riding", "half") - 2);
  const others = RIDING.slice(1).reduce((n, c) => n + c.share, 0);

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>04 — THE COUNT</Eyebrow>
      <Headline size={128} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        FIRST PAST
      </Headline>
      <Headline size={128} style={{ top: 352 + 126, ...riseStyle(head[1], exit, 50) }}>
        <Accent>THE POST</Accent>
      </Headline>
      <Aside size={46} style={{ top: 640, ...riseStyle(aside, exit, 24) }}>
        One winner per riding — the rest get nothing.
      </Aside>

      {RIDING.map((c, i) => {
        const top = BARS.top + i * (BARS.height + BARS.gap);
        const winner = i === 0;
        const fillW = (BARS.track * c.share * grow) / 100;
        return (
          <Glass key={c.name} top={top} height={BARS.height} style={riseStyle(bars[i], exit, 30)}>
            <div style={{ position: "absolute", left: 28, top: 18, width: 190 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: CA.white, whiteSpace: "nowrap" }}>{c.name}</div>
              <div style={{ fontSize: 19, fontWeight: 500, color: CA.textSoft }}>{c.party}</div>
            </div>
            <div style={{ position: "absolute", left: 220, top: 24, width: BARS.track - 20, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.08)" }} />
            <div
              style={{
                position: "absolute",
                left: 220,
                top: 24,
                width: fillW,
                height: 48,
                borderRadius: 10,
                background: winner ? `rgba(255,255,255,${0.45 + 0.55 * win})` : `rgba(255,211,206,${0.42 - 0.12 * win})`,
                boxShadow: winner && win > 0.5 ? "0 0 30px rgba(255,255,255,0.45)" : "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 220 + fillW + 14,
                top: 22,
                fontFamily: FONT.display,
                fontSize: 42,
                lineHeight: 1.2,
                color: winner ? CA.white : CA.textSoft,
                opacity: grow > 0.05 ? 1 : 0,
              }}
            >
              {Math.round(c.share * grow)}%
            </div>
          </Glass>
        );
      })}

      {/* The 50 % line: nobody needs to cross it. */}
      <div style={{ position: "absolute", left: shareX(50) - 2, top: BARS.top - 30, width: 4, height: (BARS.height + BARS.gap) * 3 + 20, opacity: half * (1 - exit), backgroundImage: `repeating-linear-gradient(180deg, ${CA.white} 0 14px, transparent 14px 24px)` }} />
      <Mono size={19} color={CA.white} style={{ position: "absolute", left: shareX(50) - 60, width: 120, textAlign: "center", top: BARS.top - 62, opacity: half * (1 - exit) }}>
        HALF
      </Mono>

      <Stamp p={stamp} size={24} rotate={-5} style={{ left: 704, top: BARS.top + 24, background: CA.bgDeep, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
        WINS THE SEAT
      </Stamp>

      <div style={{ position: "absolute", left: 120, top: BARS.top + (BARS.height + BARS.gap) * 3 + 10, display: "flex", alignItems: "baseline", gap: 18, opacity: Math.min(1, Math.max(0, rest) * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * rest})`, transformOrigin: "left center" }}>
        <span style={{ fontFamily: FONT.display, fontSize: 56, color: CA.white }}>{others}%</span>
        <span style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: 44, color: CA.textSoft }}>voted for someone else.</span>
      </div>
    </>
  );
};
