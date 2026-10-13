import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { ease, enter } from "../../lib/animation";
import { Crown, NL, Person, Pill, SAFE, SceneFrame, countTo, pop, progress, FlagChip, type SceneProps } from "./ui";

/** Jetten cabinet (sworn in 23 Feb 2026): D66 26 + VVD 22 + CDA 18 = 66 of 150 seats. */
const PARTIES = [
  { name: "D66", seats: 26, color: NL.orange, text: NL.white },
  { name: "VVD", seats: 22, color: NL.white, text: NL.ink },
  { name: "CDA", seats: 18, color: NL.sky, text: NL.ink },
] as const;
/** Seats before each party in the bar (0, 26, 48). */
const OFFSETS = PARTIES.map((_, i) => PARTIES.slice(0, i).reduce((sum, p) => sum + p.seats, 0));
const COALITION_SEATS = PARTIES.reduce((sum, p) => sum + p.seats, 0);
const TOTAL = 150;
const MAJORITY = 76;
const BAR = { left: SAFE.left + 20, top: 500, width: SAFE.width - 40, height: 60 } as const;
const seatX = (seats: number) => BAR.left + (BAR.width * seats) / TOTAL;

/** The traditional photo on the palace steps: ministers in two rows, the King in front. */
const BACK_ROW = [300, 420, 540, 660, 780];
const FRONT_ROW = [360, 480, 600, 720];
const KING_X = 480;
const PM_X = 600;

/** "After 117 days of coalition talks, the King swore in Rob Jetten's cabinet, with 66 seats." */
export const CabinetScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const header = enter(frame, 0);
  const days = ease(frame, [2, cue("cabinet", "117", "end")]);
  const chipsAt = cue("cabinet", "coalition") - 4;
  const fill = ease(frame, [cue("cabinet", "talks") - 6, cue("cabinet", "the") + 4]);
  const steps = enter(frame, cue("cabinet", "King") - 8);
  const crown = pop(frame, cue("cabinet", "King") - 2);
  const sworn = enter(frame, cue("cabinet", "swore") - 4);
  const pm = pop(frame, cue("cabinet", "Rob") - 3);
  const result = pop(frame, cue("cabinet", "66") - 3);

  return (
    <SceneFrame duration={duration}>
      {/* Header with a live day counter */}
      <div
        style={{
          position: "absolute",
          top: 190,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          fontFamily: theme.font,
          color: NL.white,
          opacity: header,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, fontWeight: 800, letterSpacing: 4, color: NL.orangeLight }}>
          <FlagChip width={44} />
          GOVERNMENT
        </div>
        <div style={{ fontSize: 76, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05, textShadow: "0 6px 24px rgba(0,0,0,0.35)" }}>
          <span style={{ color: NL.orangeLight, display: "inline-block", minWidth: 150, textAlign: "right" }}>{countTo(117, days)}</span> DAYS OF TALKS
        </div>
      </div>

      {/* Coalition partners */}
      <div style={{ position: "absolute", top: 352, left: SAFE.left, width: SAFE.width, display: "flex", justifyContent: "center", gap: 20 }}>
        {PARTIES.map((p, i) => {
          const s = pop(frame, chipsAt + i * 4);
          return (
            <div key={p.name} style={{ opacity: Math.min(1, s * 1.4), transform: `scale(${s})` }}>
              <Pill size={40} bg={p.color} color={p.text}>
                {p.name} · {p.seats}
              </Pill>
            </div>
          );
        })}
      </div>

      {/* Seat bar: 150 seats wide, majority tick at 76 */}
      <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.width, height: BAR.height, borderRadius: 18, background: NL.glass, border: `3px solid ${NL.line}`, overflow: "hidden", opacity: header }}>
        {PARTIES.map((p, i) => {
          const from = OFFSETS[i];
          const share = Math.min(1, Math.max(0, (fill * COALITION_SEATS - from) / p.seats));
          return (
            <div
              key={p.name}
              style={{
                position: "absolute",
                left: (BAR.width * from) / TOTAL,
                top: 0,
                height: "100%",
                width: ((BAR.width * p.seats) / TOTAL) * share,
                background: p.color,
              }}
            />
          );
        })}
      </div>
      <div style={{ position: "absolute", left: seatX(MAJORITY) - 3, top: BAR.top - 16, width: 6, height: BAR.height + 32, borderRadius: 3, background: NL.redBright, opacity: header }} />
      <div
        style={{
          position: "absolute",
          left: seatX(MAJORITY) - 200,
          width: 400,
          top: BAR.top - 58,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 32,
          fontWeight: 800,
          color: NL.redBright,
          opacity: header,
        }}
      >
        MAJORITY: {MAJORITY}
      </div>
      <div
        style={{
          position: "absolute",
          left: BAR.left,
          top: BAR.top + BAR.height + 16,
          fontFamily: theme.font,
          fontSize: 36,
          fontWeight: 900,
          color: NL.white,
          opacity: Math.min(1, result * 1.4),
          transform: `translateY(${(1 - result) * 16}px)`,
        }}
      >
        {COALITION_SEATS} SEATS · <span style={{ color: NL.orangeLight }}>MINORITY CABINET</span>
      </div>

      {/* Swearing-in on the palace steps */}
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: 676,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 40,
          fontWeight: 900,
          color: NL.orangeLight,
          letterSpacing: 1,
          opacity: sworn,
          transform: `translateY(${(1 - sworn) * 16}px)`,
        }}
      >
        SWORN IN BY THE KING · 23 FEB 2026
      </div>
      {[
        { w: 700, top: 1000 },
        { w: 780, top: 1036 },
        { w: 860, top: 1072 },
      ].map((s, i) => (
        <div
          key={s.w}
          style={{
            position: "absolute",
            left: SAFE.center - s.w / 2,
            top: s.top + (1 - steps) * 60,
            width: s.w,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(180deg, ${NL.paper}, ${NL.mist})`,
            opacity: steps * (1 - i * 0.12),
          }}
        />
      ))}
      {BACK_ROW.map((x, i) => {
        const p = enter(frame, cue("cabinet", "King") - 8 + i * 2);
        return (
          <div key={x} style={{ position: "absolute", left: x - 48, top: 790 + (1 - p) * 50, opacity: p }}>
            <Person size={96} color={i % 2 === 0 ? NL.sky : NL.white} />
          </div>
        );
      })}
      {FRONT_ROW.map((x, i) => {
        const p = enter(frame, cue("cabinet", "King") - 6 + i * 2);
        const isPm = x === PM_X;
        return (
          <div key={x} style={{ position: "absolute", left: x - 58, top: 884 + (1 - p) * 50, opacity: p }}>
            <Person size={116} color={isPm ? (pm > 0.5 ? NL.orange : NL.white) : x === KING_X ? NL.white : NL.sky} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: KING_X - 38, top: 852, transform: `scale(${crown})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.4))" }}>
        <Crown size={76} id="cabinet-crown" />
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: 1126,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, pm * 1.4),
          transform: `scale(${0.6 + 0.4 * pm})`,
        }}
      >
        <Pill size={40}>PRIME MINISTER ROB JETTEN</Pill>
      </div>
    </SceneFrame>
  );
};
