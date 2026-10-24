import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CHAMBER_LAYOUT, DEPUTIES, FONT, RO, SENATE_LAYOUT, SENATORS, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mono } from "./ui";

const CHAMBER_SEATS = hemicycleSeats(DEPUTIES, CHAMBER_LAYOUT.rows, CHAMBER_LAYOUT.rIn, CHAMBER_LAYOUT.rOut);
const SENATE_SEATS = hemicycleSeats(SENATORS, SENATE_LAYOUT.rows, SENATE_LAYOUT.rIn, SENATE_LAYOUT.rOut);
/** The two half-circles side by side: the Chamber of Deputies on the left, the Senate on the right. */
const CHAMBER = { cx: 380, cy: 1000, s: 0.75 } as const;
const SENATE = { cx: 812, cy: 1000, s: 0.82 } as const;

/** One chamber: dots sweep in, a counter runs up to its size on the spoken number, a label underneath. */
const House: React.FC<{
  seats: typeof CHAMBER_SEATS;
  layout: { dot: number };
  at: { cx: number; cy: number; s: number };
  total: number;
  build: number;
  count: number;
  label: string;
  sub: string;
  fontSize: number;
}> = ({ seats, layout, at, total, build, count, label, sub, fontSize }) => {
  const { cx, cy, s } = at;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${s})` }}>
        <Hemicycle seats={seats} cx={cx} cy={cy} dot={layout.dot} fill={() => RO.white} visible={(i) => build * (total + 1) - i} />
      </div>
      <div
        style={{
          position: "absolute",
          left: cx - 200,
          width: 400,
          top: cy + 18,
          textAlign: "center",
          fontFamily: FONT.display,
          fontSize,
          lineHeight: 1,
          color: RO.yellow,
          textShadow: "0 0 30px rgba(252,209,22,0.45)",
          opacity: count > 0 ? 1 : 0,
        }}
      >
        {Math.round(total * count)}
      </div>
      <div style={{ position: "absolute", left: cx - 220, width: 440, top: cy + 18 + fontSize * 1.08, textAlign: "center", opacity: Math.min(1, build * 2) }}>
        <Mono size={21} color={RO.white} style={{ letterSpacing: 3 }}>
          {label}
        </Mono>
        <div style={{ marginTop: 6, fontFamily: FONT.body, fontSize: 23, fontWeight: 500, color: RO.textSoft }}>{sub}</div>
      </div>
    </>
  );
};

/**
 * "They fill two chambers, 331 deputies and 134 senators, who pass the laws." The Chamber of
 * Deputies and the Senate as two dot half-circles side by side, each counting up on its number,
 * then one pill says what both do: pass the laws.
 */
export const ParliamentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, cue("parliament", "chambers") - 2);
  const buildA = progress(frame, cue("parliament", "two") - 6, cue("parliament", "331", "end"), Easing.inOut(Easing.cubic));
  const countA = progress(frame, cue("parliament", "331") - 2, cue("parliament", "deputies", "end"), Easing.out(Easing.cubic));
  const buildB = progress(frame, cue("parliament", "and") - 8, cue("parliament", "134", "end"), Easing.inOut(Easing.cubic));
  const countB = progress(frame, cue("parliament", "134") - 2, cue("parliament", "senators", "end"), Easing.out(Easing.cubic));
  const laws = pop(frame, cue("parliament", "pass") - 4);

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>05 — PARLIAMENT</Eyebrow>
      <Headline size={150} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        TWO
      </Headline>
      <Headline size={124} style={{ top: 352 + 147, ...riseStyle(head[1], exit, 50) }}>
        <Accent>CHAMBERS</Accent>
      </Headline>
      <Aside size={46} style={{ top: 672, ...riseStyle(aside, exit, 24) }}>
        Both elected on the same day, every four years.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <House seats={CHAMBER_SEATS} layout={CHAMBER_LAYOUT} at={CHAMBER} total={DEPUTIES} build={buildA} count={countA} label="DEPUTIES" sub="Chamber of Deputies" fontSize={64} />
        <House seats={SENATE_SEATS} layout={SENATE_LAYOUT} at={SENATE} total={SENATORS} build={buildB} count={countB} label="SENATORS" sub="Senate" fontSize={64} />
      </div>

      <div style={{ position: "absolute", left: 120, top: 1196, width: 840, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <div
          style={{
            padding: "18px 34px",
            borderRadius: 999,
            background: RO.yellow,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 4,
            color: RO.ink,
            whiteSpace: "nowrap",
            boxShadow: "0 0 34px rgba(252,209,22,0.35)",
            opacity: Math.min(1, Math.max(0, laws) * 1.5),
            transform: `scale(${0.6 + 0.4 * laws})`,
          }}
        >
          BOTH PASS EVERY LAW
        </div>
      </div>
    </>
  );
};
