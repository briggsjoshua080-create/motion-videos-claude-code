import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BALLOT_PARTIES, FONT, RO, STAMPED, type SceneProps } from "./constants";
import { Accent, Eyebrow, Headline, Mono, PaperLayer, RomanianFlag } from "./ui";

/** The violet ink of the round VOTAT stamp. */
const INK = "#3B3FA8";
/** Made-up party emblems: simple shapes in neutral colours, no real logos. */
const EMBLEM_COLORS = ["#6B7A8F", "#8F6B4A", "#4A7F6B", "#7A5C8F"] as const;

const COVERS = [
  { ro: "CAMERA DEPUTAȚILOR", en: "Chamber of Deputies" },
  { ro: "SENAT", en: "Senate" },
] as const;
const COVER = { top: 600, w: 408, h: 112, gap: 24 } as const;
/** The open booklet: two pages side by side, two party boxes on each. */
const SPREAD = { left: 120, top: 762, w: 840, h: 430 } as const;
const PAGE_W = SPREAD.w / 2;
const BOX = { w: 372, h: 182, padX: 24, padY: 24, gap: 18 } as const;
const IMPRINT = 112;

const boxPos = (i: number) => ({
  x: (i < 2 ? 0 : PAGE_W) + BOX.padX,
  y: BOX.padY + (i % 2) * (BOX.h + BOX.gap),
});

/** One party's box on the ballot: an emblem, the party's name and the start of its list. */
const PartyBox: React.FC<{ i: number; lit: number }> = ({ i, lit }) => {
  const party = BALLOT_PARTIES[i];
  const letter = party.slice(-1);
  const { x, y } = boxPos(i);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: BOX.w,
        height: BOX.h,
        boxSizing: "border-box",
        border: `2.5px solid ${RO.ink}`,
        borderRadius: 4,
        background: `rgba(252,209,22,${0.28 * lit})`,
        fontFamily: FONT.body,
        color: RO.ink,
      }}
    >
      <svg width={54} height={54} viewBox="0 0 54 54" style={{ position: "absolute", left: 18, top: 18 }}>
        {i % 2 === 0 ? <circle cx={27} cy={27} r={24} fill={EMBLEM_COLORS[i]} /> : <rect x={4} y={4} width={46} height={46} rx={10} fill={EMBLEM_COLORS[i]} />}
        <path d={i < 2 ? "M14 34 L27 16 L40 34 Z" : "M27 12 L31 24 L43 24 L33 31 L37 43 L27 35 L17 43 L21 31 L11 24 L23 24 Z"} fill="rgba(255,255,255,0.85)" />
      </svg>
      <div style={{ position: "absolute", left: 86, top: 22, fontFamily: FONT.display, fontSize: 30, lineHeight: 1 }}>{party}</div>
      <div style={{ position: "absolute", left: 86, top: 58, fontFamily: FONT.mono, fontSize: 13, letterSpacing: 2, color: RO.inkSoft }}>PARTY LIST</div>
      {[1, 2, 3].map((n) => (
        <div key={n} style={{ position: "absolute", left: 20, top: 84 + (n - 1) * 30, fontSize: 21, fontWeight: 600, whiteSpace: "nowrap" }}>
          <span style={{ color: RO.inkSoft, marginRight: 8 }}>{n}.</span>
          Candidate {letter}
          {n}
        </div>
      ))}
    </div>
  );
};

/** The round VOTAT imprint; `p` fades it in as the stamp presses. */
const Imprint: React.FC<{ p: number; style?: React.CSSProperties }> = ({ p, style }) => (
  <svg width={IMPRINT} height={IMPRINT} viewBox="0 0 100 100" style={{ position: "absolute", opacity: p, transform: `rotate(-12deg) scale(${1.08 - 0.08 * p})`, ...style }}>
    <circle cx={50} cy={50} r={46} fill="none" stroke={INK} strokeWidth={5} />
    <circle cx={50} cy={50} r={38} fill="none" stroke={INK} strokeWidth={2} />
    <text x={50} y={58} textAnchor="middle" fontFamily="Archivo Black, sans-serif" fontSize={23} fill={INK}>
      VOTAT
    </text>
  </svg>
);

/** The rubber stamp: a round knob, a neck and a base; the base's centre is at the origin. */
const StampTool: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg width={140} height={220} viewBox="-70 -210 140 220" style={{ position: "absolute", overflow: "visible", ...style }}>
    <ellipse cx={0} cy={-172} rx={34} ry={30} fill="#8A5A34" />
    <ellipse cx={-10} cy={-182} rx={12} ry={8} fill="rgba(255,255,255,0.25)" />
    <rect x={-13} y={-146} width={26} height={96} rx={6} fill="#A06C42" />
    <rect x={-56} y={-54} width={112} height={34} rx={8} fill="#6B4426" />
    <rect x={-52} y={-20} width={104} height={14} rx={3} fill={INK} />
  </svg>
);

/**
 * "You get two ballots, each a booklet of party lists. Stamp VOTED in one party's box." On light
 * paper like the reference's ballot scene: the two booklet covers (Chamber of Deputies, Senate),
 * then one booklet opens to a page of party boxes, and a rubber stamp presses a round VOTAT
 * imprint inside one box, which lights up.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = [rise(frame, 6), rise(frame, 10)];
  const covers = [pop(frame, cue("ballot", "two") - 4), pop(frame, cue("ballot", "ballots") - 2)];
  const focus = progress(frame, cue("ballot", "booklet") - 8, cue("ballot", "booklet") + 2);
  const spread = rise(frame, cue("ballot", "booklet") - 6);
  const lists = progress(frame, cue("ballot", "party") - 6, cue("ballot", "lists", "end"));
  const down = progress(frame, cue("ballot", "Stamp") - 6, cue("ballot", "VOTED") + 1, Easing.in(Easing.cubic));
  const press = progress(frame, cue("ballot", "VOTED") + 1, cue("ballot", "VOTED") + 4);
  const up = progress(frame, cue("ballot", "one") - 2, cue("ballot", "party's") + 4, Easing.out(Easing.cubic));
  const lit = progress(frame, cue("ballot", "party's") - 4, cue("ballot", "box") + 2);
  const caption = rise(frame, cue("ballot", "box") - 4);

  const target = boxPos(STAMPED);
  const imprint = { x: target.x + BOX.w - IMPRINT - 22, y: target.y + (BOX.h - IMPRINT) / 2 + 6 };
  const toolX = SPREAD.left + imprint.x + IMPRINT / 2;
  const toolY = SPREAD.top + imprint.y + IMPRINT / 2 - interpolate(down, [0, 1], [320, 0]) - up * 340;
  const toolOpacity = Math.min(1, down * 3) * (1 - up);

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        03 — THE BALLOT
      </Eyebrow>
      <Headline light size={100} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        TWO BALLOTS,
      </Headline>
      <Headline light size={100} style={{ top: 352 + 102, ...riseStyle(head[1], exit, 50) }}>
        <Accent light>ONE STAMP</Accent>
      </Headline>

      {COVERS.map((c, i) => {
        const p = covers[i];
        const dim = i === 0 ? 1 : 1 - 0.55 * focus;
        return (
          <div
            key={c.ro}
            style={{
              position: "absolute",
              left: 120 + i * (COVER.w + COVER.gap),
              top: COVER.top,
              width: COVER.w,
              height: COVER.h,
              borderRadius: 10,
              background: RO.cream,
              boxShadow: i === 0 && focus > 0 ? `0 0 0 ${3 * focus}px ${RO.blue}, 0 14px 30px rgba(11,24,56,0.16)` : "0 14px 30px rgba(11,24,56,0.16)",
              border: "1.5px solid #D8D0BF",
              boxSizing: "border-box",
              overflow: "hidden",
              opacity: Math.min(1, Math.max(0, p) * 1.5) * dim * (1 - exit),
              transform: `scale(${0.7 + 0.3 * Math.min(1.05, p)})`,
            }}
          >
            <RomanianFlag width={42} style={{ position: "absolute", left: 22, top: 22 }} />
            <Mono size={17} color={RO.ink} style={{ position: "absolute", left: 80, top: 24, letterSpacing: 2.4 }}>
              {c.ro}
            </Mono>
            <div style={{ position: "absolute", left: 80, top: 56, fontFamily: FONT.body, fontSize: 26, fontWeight: 700, color: RO.inkSoft }}>{c.en}</div>
          </div>
        );
      })}

      {/* The open booklet: two pages of party boxes. */}
      <div
        style={{
          position: "absolute",
          left: SPREAD.left,
          top: SPREAD.top,
          width: SPREAD.w,
          height: SPREAD.h,
          ...riseStyle(spread, exit, 50),
        }}
      >
        <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: RO.cream, border: "1.5px solid #D8D0BF", boxShadow: "0 24px 50px rgba(11,24,56,0.2)" }} />
        <div style={{ position: "absolute", left: PAGE_W - 1, top: 0, width: 2, height: SPREAD.h, background: "linear-gradient(180deg, #CFC5B0, #E5DDCB)" }} />
        {BALLOT_PARTIES.map((_, i) => (
          <div key={i} style={{ opacity: Math.min(1, Math.max(0, lists * 4 - i)) }}>
            <PartyBox i={i} lit={i === STAMPED ? lit : 0} />
          </div>
        ))}
        <Imprint p={press} style={{ left: imprint.x, top: imprint.y }} />
      </div>

      {toolOpacity > 0 && <StampTool style={{ left: toolX - 70, top: toolY - 210 + 6 * (1 - press), opacity: toolOpacity * (1 - exit) }} />}

      <Mono size={20} color={RO.blue} style={{ position: "absolute", left: 120, top: 1212, letterSpacing: 3, ...riseStyle(caption, exit, 20) }}>
        STAMP INSIDE ONE BOX · FOLD · DROP IN THE BOX
      </Mono>
    </>
  );
};
