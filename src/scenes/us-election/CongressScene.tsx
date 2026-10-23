import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, HOUSE, SENATE, US, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

/** House: 435 small dots in 12 rows. Senate: 100 bigger dots in 5 rows. */
const HOUSE_SEATS = hemicycleSeats(HOUSE.seats, 12, 172, 362);
const SENATE_SEATS = hemicycleSeats(SENATE.seats, 5, 92, 190);
const HOUSE_DOT = 6.6;
const SENATE_DOT = 9;
/** The House: big in the middle first, then small on the left once the Senate comes in. */
const HOUSE_BIG = { cx: 540, cy: 1066, s: 1 } as const;
const HOUSE_SMALL = { cx: 315, cy: 930, s: 0.5 } as const;
const SENATE_AT = { cx: 765, cy: 930 } as const;
const COLS = { top: 980, height: 262, width: 408 } as const;

/** A chamber's big number and label in the middle of its half-circle. */
const Count: React.FC<{ cx: number; cy: number; size: number; value: number; label: string; opacity: number; labelOpacity?: number }> = ({ cx, cy, size, value, label, opacity, labelOpacity = 1 }) => (
  <>
    <div style={{ position: "absolute", left: cx - 200, width: 400, top: cy - size * 0.95, textAlign: "center", fontFamily: FONT.display, fontSize: size, lineHeight: 1, color: US.white, textShadow: "0 0 30px rgba(255,255,255,0.35)", opacity }}>
      {value}
    </div>
    <Mono size={Math.max(15, size * 0.17)} style={{ position: "absolute", left: cx - 200, width: 400, top: cy + 14, textAlign: "center", opacity: opacity * labelOpacity }}>
      {label}
    </Mono>
  </>
);

/**
 * "You also elect Congress, which makes the laws and sets the budget: 435 members of the House,
 * every two years, and 100 senators, two per state, for six years." The two jobs pop up as pills,
 * 435 dots sweep into the House's half-circle with a counter; then the House steps aside for the
 * Senate's 100 seats and two cards compare the chambers.
 */
export const CongressScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = rise(frame, 3);
  const aside = rise(frame, cue("congress", "Congress") - 4);
  const jobs = [pop(frame, cue("congress", "laws") - 4), pop(frame, cue("congress", "budget") - 4)];
  const build = progress(frame, cue("congress", "budget"), cue("congress", "435") + 6, Easing.inOut(Easing.cubic));
  const count = progress(frame, cue("congress", "435") - 2, cue("congress", "435", "end"), Easing.out(Easing.cubic));
  const counter = rise(frame, cue("congress", "435") - 6);
  const years = pop(frame, cue("congress", "two") - 4);
  const split = progress(frame, cue("senate", "and") - 8, cue("senate", "100") + 2);
  const senate = progress(frame, cue("senate", "100") - 6, cue("senate", "senators", "end"), Easing.inOut(Easing.cubic));
  const senateCount = progress(frame, cue("senate", "100") - 2, cue("senate", "100", "end"), Easing.out(Easing.cubic));
  const cols = rise(frame, cue("senate", "100") + 2);
  const perState = pop(frame, cue("senate", "two") - 4);
  const six = pop(frame, cue("senate", "six") - 4);

  const hx = interpolate(split, [0, 1], [HOUSE_BIG.cx, HOUSE_SMALL.cx]);
  const hy = interpolate(split, [0, 1], [HOUSE_BIG.cy, HOUSE_SMALL.cy]);
  const hs = interpolate(split, [0, 1], [HOUSE_BIG.s, HOUSE_SMALL.s]);
  const houseVisible = (i: number) => build * (HOUSE.seats + 1) - i;
  const senateVisible = (i: number) => senate * (SENATE.seats + 1) - i;
  const glowR = 400 * hs;

  const pill = (label: string, p: number) => (
    <div
      key={label}
      style={{
        padding: "16px 28px",
        borderRadius: 999,
        background: US.glass,
        border: `1.5px solid ${US.glassEdge}`,
        fontFamily: FONT.mono,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: 4,
        color: US.white,
        whiteSpace: "nowrap",
        opacity: Math.min(1, Math.max(0, p) * 1.5),
        transform: `scale(${0.6 + 0.4 * p})`,
      }}
    >
      {label}
    </div>
  );

  const card = (left: number, title: string, lines: { text: string; p: number; accent?: boolean }[]) => (
    <Glass left={left} top={COLS.top} width={COLS.width} height={COLS.height} tick={US.redBright} style={riseStyle(cols, exit, 40)}>
      <div style={{ position: "absolute", left: 30, top: 28, fontFamily: FONT.display, fontSize: 40, color: US.white }}>{title}</div>
      {lines.map((l, i) => (
        <div
          key={l.text}
          style={{
            position: "absolute",
            left: 30,
            top: 88 + i * 40,
            fontSize: 25,
            fontWeight: l.accent ? 800 : 600,
            color: l.accent ? US.redBright : US.textSoft,
            whiteSpace: "nowrap",
            opacity: 0.35 + 0.65 * Math.min(1, Math.max(0, l.p)),
          }}
        >
          {l.text}
        </div>
      ))}
    </Glass>
  );

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>04 — CONGRESS</Eyebrow>
      <Headline size={140} style={{ top: 352, ...riseStyle(head, exit, 50) }}>
        <Accent>CONGRESS</Accent>
      </Headline>
      <Aside size={46} style={{ top: 500, ...riseStyle(aside, exit, 24) }}>
        America's parliament — two chambers.
      </Aside>
      <div style={{ position: "absolute", left: 120, top: 588, width: 840, display: "flex", gap: 20, opacity: 1 - exit }}>
        {pill("MAKES LAWS", jobs[0])}
        {pill("SETS THE BUDGET", jobs[1])}
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <div
          style={{
            position: "absolute",
            left: hx - glowR,
            top: hy - glowR * 0.75,
            width: glowR * 2,
            height: glowR,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(255,255,255,0.12), rgba(255,255,255,0))",
          }}
        />
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${hx}px ${hy}px`, transform: `scale(${hs})` }}>
          <Hemicycle seats={HOUSE_SEATS} cx={hx} cy={hy} dot={HOUSE_DOT} fill={() => US.white} visible={houseVisible} />
        </div>
        <Count cx={hx} cy={hy} size={interpolate(split, [0, 1], [104, 50])} value={Math.round(HOUSE.seats * count)} label="HOUSE" opacity={Math.min(1, counter)} labelOpacity={split} />
        <Mono
          size={22}
          color={US.textSoft}
          style={{ position: "absolute", left: 120, width: 840, top: HOUSE_BIG.cy + 18, textAlign: "center", opacity: Math.min(1, counter) * (1 - split) }}
        >
          HOUSE OF REPRESENTATIVES · {HOUSE.majority} = MAJORITY
        </Mono>
        <div
          style={{
            position: "absolute",
            left: 540 - 150,
            width: 300,
            top: HOUSE_BIG.cy + 66,
            padding: "12px 0",
            borderRadius: 999,
            background: US.red,
            textAlign: "center",
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 4,
            color: US.white,
            opacity: Math.min(1, Math.max(0, years) * 1.5) * (1 - split),
            transform: `scale(${0.6 + 0.4 * years})`,
          }}
        >
          EVERY 2 YEARS
        </div>

        <Hemicycle seats={SENATE_SEATS} cx={SENATE_AT.cx} cy={SENATE_AT.cy} dot={SENATE_DOT} fill={() => US.white} visible={senateVisible} />
        <Count cx={SENATE_AT.cx} cy={SENATE_AT.cy} size={50} value={Math.round(SENATE.seats * senateCount)} label="SENATE" opacity={Math.min(1, senate * 2)} />
      </div>

      {card(120, "HOUSE", [
        { text: "435 seats, by population", p: 1 },
        { text: "all elected every 2 years", p: 1, accent: true },
        { text: "starts all tax bills", p: 1 },
      ])}
      {card(552, "SENATE", [
        { text: "2 per state, big or small", p: perState, accent: true },
        { text: "6-year terms", p: six, accent: true },
        { text: "a third up every 2 years", p: six },
        { text: "approves judges & treaties", p: six },
      ])}
    </>
  );
};
