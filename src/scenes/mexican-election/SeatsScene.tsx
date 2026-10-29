import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Hemicycle, hemicycleSeats } from "../../components/Hemicycle";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CHAMBER, DISTRICT_SEATS, FONT, LIST_SEATS, MAX_SEATS, MX, OVER_CAP, THRESHOLD, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mono } from "./ui";

const LAYOUT = { rows: 11, rIn: 130, rOut: 360, dot: 6.5 } as const;
const SEATS = hemicycleSeats(CHAMBER, LAYOUT.rows, LAYOUT.rIn, LAYOUT.rOut);
const CENTER = { cx: 540, cy: 1078 } as const;
const PILLS_TOP = 1110;

/**
 * "300 deputies win a district. 200 more are shared by votes, for parties above 3%." The 500-seat
 * Chamber as a dot half-circle: 300 white seats sweep in on "300" (one winner per district), then
 * 200 red seats on "200" (shared out by votes in five big regions), with a pill for each and a 3%
 * chip on "3%". Footnote: the cap on over-representation that the result scene comes back to.
 */
export const SeatsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, 10);
  const districts = progress(frame, cue("seats", "300") - 4, cue("seats", "district") + 4, Easing.inOut(Easing.cubic));
  const lists = progress(frame, cue("seats", "200") - 4, cue("seats", "votes") + 2, Easing.inOut(Easing.cubic));
  const pillA = pop(frame, cue("seats", "win") - 3);
  const pillB = pop(frame, cue("seats", "shared") - 3);
  const line = pop(frame, cue("seats", "3%") - 3);
  const note = rise(frame, cue("seats", "3%") + 6);
  const count = Math.round(DISTRICT_SEATS * districts + LIST_SEATS * lists);

  const visible = (i: number) =>
    i < DISTRICT_SEATS ? districts * (DISTRICT_SEATS + 1) - i : lists * (LIST_SEATS + 1) - (i - DISTRICT_SEATS);
  const { cx, cy } = CENTER;

  const pill = (text: string, bg: string, color: string, p: number) => (
    <div
      style={{
        padding: "14px 24px",
        borderRadius: 999,
        background: bg,
        border: `2px solid ${MX.white}`,
        fontFamily: FONT.mono,
        fontWeight: 700,
        fontSize: 23,
        letterSpacing: 2.5,
        color,
        whiteSpace: "nowrap",
        boxShadow: "0 0 30px rgba(255,255,255,0.22)",
        opacity: Math.min(1, Math.max(0, p) * 1.5),
        transform: `scale(${0.6 + 0.4 * p})`,
      }}
    >
      {text}
    </div>
  );

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>04 — THE SEATS</Eyebrow>
      <Headline size={124} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        {DISTRICT_SEATS} +
      </Headline>
      <Headline size={124} style={{ top: 352 + 122, ...riseStyle(head[1], exit, 50) }}>
        <Accent>{LIST_SEATS}</Accent>
      </Headline>
      <Aside size={44} style={{ top: 628, ...riseStyle(aside, exit, 24) }}>
        {CHAMBER} deputies, elected every three years.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <Hemicycle seats={SEATS} cx={cx} cy={cy} dot={LAYOUT.dot} fill={(i) => (i < DISTRICT_SEATS ? MX.white : MX.red)} visible={visible} />
        <div
          style={{
            position: "absolute",
            left: cx - 200,
            width: 400,
            top: cy - 86,
            textAlign: "center",
            fontFamily: FONT.display,
            fontSize: 84,
            lineHeight: 1,
            color: MX.white,
            textShadow: "0 0 30px rgba(255,255,255,0.4)",
            opacity: count > 0 ? 1 : 0,
          }}
        >
          {count}
        </div>
        {/* The 3% chip, on the red (vote-shared) side. */}
        <div
          style={{
            position: "absolute",
            left: 740,
            top: 690,
            padding: "10px 18px",
            borderRadius: 999,
            background: MX.red,
            border: `3px solid ${MX.white}`,
            fontFamily: FONT.display,
            fontSize: 30,
            color: MX.white,
            whiteSpace: "nowrap",
            opacity: Math.min(1, Math.max(0, line) * 1.5),
            transform: `scale(${0.6 + 0.4 * line}) rotate(4deg)`,
          }}
        >
          {THRESHOLD}%+ ONLY
        </div>
      </div>

      <div style={{ position: "absolute", left: 120, top: PILLS_TOP, width: 840, display: "flex", justifyContent: "center", gap: 16, opacity: 1 - exit }}>
        {pill(`${DISTRICT_SEATS} WIN A DISTRICT`, MX.white, MX.green, pillA)}
        {pill(`${LIST_SEATS} SHARED BY VOTES`, MX.red, MX.white, pillB)}
      </div>
      <Mono size={18} color={MX.textSoft} style={{ position: "absolute", left: 120, width: 840, top: 1196, textAlign: "center", letterSpacing: 1.8, ...riseStyle(note, exit, 16) }}>
        CAP: SEATS ≤ VOTE SHARE + {OVER_CAP} POINTS · MAX {MAX_SEATS} PER PARTY
      </Mono>
    </>
  );
};
