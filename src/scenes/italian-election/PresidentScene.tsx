import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { Character } from "../../components/explainer/Character";
import { NameCard } from "../../components/explainer/NameCard";
import { DrawnPath } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CHAMBER_R_OUT, ELECTORS, HAIR, IT, PALETTE as C, REGIONAL_DELEGATES, type SceneProps } from "./constants";
import { Badge, CalendarIcon, Card } from "./ui";

const PRESIDENT = { left: 130, top: 362, size: 300 } as const;
const ELECTORS_POSE = { cx: 724, cy: 632, s: 0.54 } as const;
const ELECTOR_SEATS = hemicycleSeats(ELECTORS, 13, 140, CHAMBER_R_OUT);
/** The 58 regional delegates, spread evenly among the MPs. */
const DELEGATES = new Set(Array.from({ length: REGIONAL_DELEGATES }, (_, k) => Math.floor(((k + 0.5) * ELECTORS) / REGIONAL_DELEGATES)));
/** Order in which the MPs' seats appear (delegates are skipped, they come second). */
const MP_RANK = (() => {
  const rank: number[] = [];
  let n = 0;
  for (let i = 0; i < ELECTORS; i++) rank.push(DELEGATES.has(i) ? -1 : n++);
  return rank;
})();
const DELEGATE_RANK = (() => {
  const rank: number[] = [];
  let n = 0;
  for (let i = 0; i < ELECTORS; i++) rank.push(DELEGATES.has(i) ? n++ : -1);
  return rank;
})();
const LAW_CARD = { top: 992, height: 236 } as const;

/**
 * "And the President? MPs and regional delegates elect him, for seven years. Sergio Mattarella signs
 * every law." Cartoon President (no likeness), the electors (all MPs + 58 regional delegates), the
 * seven-year term, and a law getting his signature.
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const president = pop(frame, cue("president", "President") - 8);
  const mps = progress(frame, cue("president", "MPs") - 4, cue("president", "and") + 4, Easing.inOut(Easing.cubic));
  const delegates = progress(frame, cue("president", "regional") - 2, cue("president", "delegates", "end"), Easing.inOut(Easing.cubic));
  const electorsLabel = rise(frame, cue("president", "MPs") - 2);
  const delegatesLabel = rise(frame, cue("president", "regional") - 2);
  const elected = pop(frame, cue("president", "elect") - 2);
  const years = pop(frame, cue("president", "seven") - 4);
  const card = pop(frame, cue("president", "Sergio") - 6);
  const name = progress(frame, cue("president", "Sergio") - 2, cue("president", "Mattarella", "end") + 4);
  const law = rise(frame, cue("president", "signs") - 6);
  const sign = progress(frame, cue("president", "signs"), cue("president", "law", "end"));
  const stamp = progress(frame, cue("president", "law") - 2, cue("president", "law") + 6);

  const mpCount = ELECTORS - REGIONAL_DELEGATES;

  return (
    <>
      {/* The President: white hair, dark suit, a tricolour pin (no real likeness) */}
      <div
        style={{
          position: "absolute",
          left: PRESIDENT.left,
          top: PRESIDENT.top,
          opacity: Math.min(1, president * 1.4) * (1 - exit),
          transform: `translateY(${-exit * 40}px) scale(${0.85 + 0.15 * president})`,
          filter: "drop-shadow(0 18px 30px rgba(20,32,43,0.18))",
        }}
      >
        <Character size={PRESIDENT.size} bg={IT.greenSoft} palette={C} clothes={IT.suit} tie={IT.navy} hair={HAIR.white} hairStyle="side" id="president" />
        <div style={{ position: "absolute", left: PRESIDENT.size * 0.66, top: PRESIDENT.size * 0.79, width: 30, height: 20, display: "flex", borderRadius: 3, overflow: "hidden", boxShadow: `0 0 0 2px ${C.white}` }}>
          {C.flag.map((color, i) => (
            <div key={`${color}-${i}`} style={{ flex: 1, background: color }} />
          ))}
        </div>
        <Badge size={70} ok p={elected} style={{ position: "absolute", right: -6, top: 4 }} />
      </div>

      {/* Seven years */}
      <div
        style={{
          position: "absolute",
          left: PRESIDENT.left + PRESIDENT.size / 2 - 140,
          width: 280,
          top: PRESIDENT.top + PRESIDENT.size + 16,
          display: "flex",
          justifyContent: "center",
          opacity: 1 - exit,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 26px 8px 12px",
            borderRadius: 999,
            background: C.card,
            boxShadow: "0 10px 26px rgba(20,32,43,0.14)",
            fontFamily: theme.font,
            fontSize: 34,
            fontWeight: 800,
            color: C.ink,
            whiteSpace: "nowrap",
            opacity: Math.min(1, years * 1.4),
            transform: `scale(${0.6 + 0.4 * years})`,
          }}
        >
          <CalendarIcon size={58} label="7" />
          7 YEARS
        </div>
      </div>

      {/* The electors: every MP, then 58 delegates from the regions */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            transform: `translate(${ELECTORS_POSE.cx - 540}px, ${ELECTORS_POSE.cy - 830}px) scale(${ELECTORS_POSE.s})`,
            transformOrigin: "540px 830px",
          }}
        >
          <Hemicycle
            seats={ELECTOR_SEATS}
            cx={540}
            cy={830}
            dot={8.5}
            fill={(i) => (DELEGATES.has(i) ? IT.gold : IT.shared)}
            visible={(i) => (DELEGATES.has(i) ? delegates * (REGIONAL_DELEGATES + 1) - DELEGATE_RANK[i] : mps * (mpCount + 1) - MP_RANK[i])}
          />
        </div>
      </div>
      <div style={{ position: "absolute", left: ELECTORS_POSE.cx - 230, width: 460, top: ELECTORS_POSE.cy + 14, textAlign: "center", fontFamily: theme.font, ...riseStyle(electorsLabel, exit, 16) }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>
          {Math.round(mpCount * mps + REGIONAL_DELEGATES * delegates)} electors
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, whiteSpace: "nowrap" }}>
          all MPs <span style={{ color: IT.goldDeep, opacity: delegatesLabel }}>+ {REGIONAL_DELEGATES} regional delegates</span>
        </div>
      </div>

      <NameCard
        top={762}
        height={204}
        role="PRESIDENT OF THE REPUBLIC"
        name="Sergio Mattarella"
        sub="since 2015 · re-elected in 2022"
        cardP={card}
        nameP={name}
        exitP={exit}
        palette={C}
      />

      {/* He signs every law */}
      <Card top={LAW_CARD.top} height={LAW_CARD.height} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 36px", ...riseStyle(law, exit) }}>
        <div style={{ position: "relative", width: 150, height: 190, borderRadius: 14, background: C.paperDeep, border: `3px solid ${C.ink}`, boxSizing: "border-box", flexShrink: 0 }}>
          {[24, 46, 68, 90].map((y, i) => (
            <div key={y} style={{ position: "absolute", left: 18, top: y, width: [104, 90, 108, 70][i], height: 10, borderRadius: 5, background: C.muted, opacity: 0.6 }} />
          ))}
          <svg width={150} height={190} style={{ position: "absolute", left: 0, top: 0 }}>
            <DrawnPath d="M18 150 C28 128 36 160 46 140 S62 124 70 146 S90 158 100 136 S118 140 128 150" p={sign} color={IT.navy} width={4} />
          </svg>
          <div
            style={{
              position: "absolute",
              right: -22,
              bottom: -18,
              opacity: Math.min(1, stamp * 2),
              transform: `rotate(-10deg) scale(${interpolate(stamp, [0, 1], [1.7, 1])})`,
            }}
          >
            <Badge size={62} ok p={1} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: theme.font }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: C.ink, letterSpacing: -0.8 }}>Signs every law</div>
          <div style={{ fontSize: 27, fontWeight: 600, color: C.inkSoft, lineHeight: 1.3 }}>
            can send a law back once, names the prime minister and can call early elections
          </div>
        </div>
      </Card>
    </>
  );
};
