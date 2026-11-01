import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BR, FINE, FONT, type SceneProps } from "./constants";
import { Accent, Aside, Emblem, Eyebrow, FlagBar, Glass, Headline, Mark, Mono, Stamp } from "./ui";

const TITLE = { top: 400, size: 116, left: 196 } as const;
const TITLE_HEIGHT = TITLE.size * 0.98 * 3;
const CARD = { top: 966, height: 300 } as const;
const STEP = { top: 70, w: 224, h: 150, gap: 84 } as const;

/** A blank ballot box with a slot (no vote cast). */
const BallotIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={BR.white} strokeWidth={6} strokeLinejoin="round">
    <rect x={14} y={40} width={72} height={50} rx={6} />
    <path d="M34 40 H66" stroke={BR.bg} strokeWidth={8} />
    <path d="M36 40 L40 12 H66 L64 40" />
  </svg>
);

/** A generic passport booklet (dark blue, a globe on the cover; not the real Brazilian design). */
const Passport: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size * 0.74} height={size} viewBox="0 0 74 100">
    <rect x={2} y={2} width={70} height={96} rx={8} fill={BR.blue} stroke={BR.white} strokeWidth={3} />
    <circle cx={37} cy={44} r={16} fill="none" stroke={BR.yellow} strokeWidth={3} />
    <path d="M21 44 H53 M37 28 C28 36 28 52 37 60 M37 28 C46 36 46 52 37 60" fill="none" stroke={BR.yellow} strokeWidth={2.4} />
    <rect x={18} y={74} width={38} height={5} rx={2.5} fill={BR.yellow} />
  </svg>
);

/**
 * "In Brazil, skipping the vote can cost you your passport." The reference video's title card in
 * Brazilian colours: the flag's colours as a bar, a simplified flag, HOW BRAZIL VOTES., the
 * italic hook line, and a card with a chain that builds on the spoken words: SKIP THE VOTE (on
 * "skipping") → A FINE (on "cost") → a passport with a BLOCKED stamp (on "passport"). Everything
 * but the card is on screen at frame 0, so the thumbnail is never empty.
 */
export const TitleScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, -20);
  const lines = [rise(frame, -18), rise(frame, -14), rise(frame, -10)];
  const bar = progress(frame, -16, 10);
  const dot = rise(frame, -8);
  const aside = rise(frame, -6);
  const flag = pop(frame, -4);
  const card = rise(frame, cue("hook", "Brazil") - 8);
  const steps = [pop(frame, cue("hook", "skipping") - 3), pop(frame, cue("hook", "cost") - 3), pop(frame, cue("hook", "your") - 3)];
  const arrows = [progress(frame, cue("hook", "skipping"), cue("hook", "cost")), progress(frame, cue("hook", "cost"), cue("hook", "your"))];
  const cross = progress(frame, cue("hook", "skipping") + 2, cue("hook", "vote", "end") + 2);
  const stamp = pop(frame, cue("hook", "passport") - 1);
  const note = rise(frame, cue("hook", "passport", "end"));

  const step = (i: number, label: string, children: React.ReactNode) => (
    <div
      key={label}
      style={{
        position: "absolute",
        left: 40 + i * (STEP.w + STEP.gap) - (i === 2 ? 0 : 0),
        top: STEP.top,
        width: STEP.w,
        height: STEP.h,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        opacity: Math.min(1, Math.max(0, steps[i]) * 1.5),
        transform: `scale(${0.6 + 0.4 * steps[i]})`,
      }}
    >
      <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>{children}</div>
      <Mono size={19} color={BR.white} style={{ marginTop: 10, letterSpacing: 2.5 }}>
        {label}
      </Mono>
    </div>
  );

  const arrow = (i: number) => {
    const x = 40 + (i + 1) * STEP.w + i * STEP.gap + 10;
    return (
      <svg key={i} width={STEP.gap - 20} height={30} style={{ position: "absolute", left: x, top: STEP.top + 50, overflow: "visible" }}>
        <path
          d={`M0 15 H${STEP.gap - 30} M${STEP.gap - 42} 4 L${STEP.gap - 28} 15 L${STEP.gap - 42} 26`}
          fill="none"
          stroke={BR.yellow}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - arrows[i]}
          opacity={arrows[i] > 0.01 ? 1 : 0}
        />
      </svg>
    );
  };

  return (
    <>
      <Eyebrow style={{ top: TITLE.top - 62, left: TITLE.left, ...riseStyle(kicker, exit, 24) }}>BRAZIL'S ELECTIONS — EXPLAINED</Eyebrow>
      <FlagBar height={TITLE_HEIGHT - 16} p={bar} style={{ left: 104, top: TITLE.top + 8, opacity: 1 - exit }} />
      {["HOW", "BRAZIL", "VOTES"].map((word, i) => (
        <Headline key={word} size={TITLE.size} style={{ left: TITLE.left, top: TITLE.top + i * TITLE.size * 0.98, ...riseStyle(lines[i], exit, 50) }}>
          {i === 2 ? (
            <>
              <Accent>{word}</Accent>
              <span
                style={{
                  display: "inline-block",
                  width: TITLE.size * 0.2,
                  height: TITLE.size * 0.2,
                  marginLeft: TITLE.size * 0.1,
                  borderRadius: "50%",
                  background: BR.yellow,
                  boxShadow: "0 0 24px rgba(255,223,0,0.6)",
                  transform: `scale(${dot})`,
                }}
              />
            </>
          ) : (
            word
          )}
        </Headline>
      ))}
      <Aside size={52} style={{ top: TITLE.top + TITLE_HEIGHT + 30, left: TITLE.left, width: 780, ...riseStyle(aside, exit, 30) }}>
        Where skipping the vote costs you —
        <br />
        and how voting works, in 60 seconds.
      </Aside>

      <Emblem size={160} p={flag} style={{ position: "absolute", left: 780, top: TITLE.top + 14, opacity: (1 - exit) * Math.min(1, Math.max(0, flag) * 1.5) }} />

      <Glass top={CARD.top} height={CARD.height} tick={BR.yellow} style={riseStyle(card, exit, 40)}>
        <Mono size={19} color={BR.textSoft} style={{ position: "absolute", left: 40, top: 30, letterSpacing: 3 }}>
          IF YOU DON'T VOTE — AND HAVE NO EXCUSE
        </Mono>
        {step(
          0,
          "SKIP THE VOTE",
          <>
            <BallotIcon size={92} />
            <div style={{ position: "absolute", left: 10, top: 10 }}>
              <Mark ok={false} size={80} p={cross} color={BR.yellow} />
            </div>
          </>,
        )}
        {step(
          1,
          `UP TO ${FINE}`,
          <div style={{ fontFamily: FONT.display, fontSize: 58, lineHeight: 1, color: BR.blue, background: BR.yellow, padding: "12px 18px", borderRadius: 12, boxShadow: `0 0 0 3px ${BR.white}` }}>
            FINE
          </div>,
        )}
        {step(2, "UNPAID?", <Passport size={100} />)}
        {arrow(0)}
        {arrow(1)}
        <Stamp p={stamp} size={28} color={BR.blue} rotate={-10} style={{ left: 566, top: 116, background: BR.yellow, borderColor: BR.white }}>
          NO PASSPORT
        </Stamp>
        <div style={{ position: "absolute", left: 40, top: 244, fontSize: 22, fontWeight: 500, color: BR.textSoft, whiteSpace: "nowrap", ...riseStyle(note, 0, 12) }}>
          Also no ID card, no public job — until you pay.
        </div>
      </Glass>
    </>
  );
};
