import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Character } from "../../components/explainer/Character";
import { NameCard } from "../../components/explainer/NameCard";
import { BallotBoxIcon } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { HAIR, PALETTE as C, PARTY, PL, type SceneProps } from "./constants";
import { PM_CARD, PrimeMinister } from "./GovernmentScene";
import { Badge, CalendarIcon, Card } from "./ui";

export const PRESIDENT = { left: 124, top: 362, size: 230 } as const;
const FACTS = { left: 396, top: 366 } as const;
const ROUNDS = { top: 654, height: 296, barLeft: 230, barWidth: 520 } as const;
const CARD = { top: 972, height: 176 } as const;

/** The President as a generic cartoon (no likeness): dark hair, dark suit, a white-red pin. */
export const President: React.FC<{ size: number; id: string }> = ({ size, id }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    <Character size={size} bg={PL.redSoft} palette={C} clothes={PL.suit} tie={PL.red} hair={HAIR.brown} hairStyle="short" id={id} />
    <div
      style={{
        position: "absolute",
        left: size * 0.66,
        top: size * 0.79,
        width: size * 0.12,
        height: size * 0.078,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: `0 0 0 2px ${C.white}`,
      }}
    >
      {C.flag.map((color, i) => (
        <div key={`${color}-${i}`} style={{ flex: 1, background: color }} />
      ))}
    </div>
  </div>
);

const Fact: React.FC<{ top: number; p: number; exit: number; children: React.ReactNode }> = ({ top, p, exit, children }) => (
  <div
    style={{
      position: "absolute",
      left: FACTS.left,
      top,
      width: 560,
      display: "flex",
      alignItems: "center",
      gap: 18,
      fontFamily: theme.font,
      ...riseStyle(p, exit, 24),
    }}
  >
    {children}
  </div>
);

type Share = { name: string; pct: number; color: string };

/** One round of the 2025 election as a stacked bar (names inside, shares below), with a 50% mark. */
const Round: React.FC<{ top: number; title: string; when: string; shares: Share[]; p: number; grow: number; winner?: number }> = ({ top, title, when, shares, p, grow, winner = 0 }) => {
  const starts = shares.map((_, i) => shares.slice(0, i).reduce((n, s) => n + s.pct, 0));
  const barX = ROUNDS.barLeft - 36;
  return (
    <div style={{ position: "absolute", left: 36, right: 36, top, height: 104, ...riseStyle(p, 0, 20) }}>
      <div style={{ position: "absolute", left: 0, top: 10, width: ROUNDS.barLeft - 50 }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontSize: 23, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap" }}>{when}</div>
      </div>
      {/* 50% mark (behind the bar: a tick above and below it) */}
      <div style={{ position: "absolute", left: barX + ROUNDS.barWidth / 2 - 1.5, top: -6, width: 3, height: 66, background: C.ink, opacity: 0.8 }} />
      <div style={{ position: "absolute", left: barX, top: 8, width: ROUNDS.barWidth, height: 48, borderRadius: 10, background: C.paperDeep, overflow: "hidden" }}>
        {shares.map((s, i) => (
          <div
            key={s.name}
            style={{
              position: "absolute",
              left: (ROUNDS.barWidth * starts[i] * grow) / 100,
              top: 0,
              width: (ROUNDS.barWidth * s.pct * grow) / 100,
              height: 48,
              background: s.color,
              borderRight: `3px solid ${C.white}`,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              fontSize: 21,
              fontWeight: 800,
              color: C.white,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ opacity: Math.min(1, Math.max(0, grow * 2 - 1)) }}>{s.name}</span>
          </div>
        ))}
      </div>
      {shares.map((s, i) => (
        <div
          key={s.name}
          style={{
            position: "absolute",
            left: barX + (ROUNDS.barWidth * (starts[i] + s.pct / 2)) / 100 - 80,
            width: 160,
            top: 62,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
            fontSize: 24,
            fontWeight: 800,
            color: s.color === PL.none ? C.inkSoft : s.color,
            whiteSpace: "nowrap",
            opacity: Math.min(1, Math.max(0, grow * 2 - 1)),
          }}
        >
          {i === 0 && winner > 0 ? <Badge size={28} ok p={winner} /> : null}
          {s.pct.toFixed(1)}%
        </div>
      ))}
    </div>
  );
};

/**
 * "And the president? Elected by the people for five years, in two rounds if needed. Karol Nawrocki
 * won in 2025."
 * Cartoon President (no likeness), how he is elected, the two rounds of 2025, and his name card; the
 * Prime Minister's card stays from the government scene until the President's comes in.
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const president = pop(frame, cue("president", "And") - 4);
  const elected = pop(frame, cue("president", "Elected") - 4);
  const years = pop(frame, cue("president", "five") - 4);
  const rounds = pop(frame, cue("president", "two") - 4);
  const card = rise(frame, cue("president", "Karol") - 12);
  const round1 = rise(frame, cue("president", "Karol") - 10);
  const grow1 = progress(frame, cue("president", "Karol") - 8, cue("president", "Karol") + 8);
  const round2 = rise(frame, cue("president", "won") - 10);
  const grow2 = progress(frame, cue("president", "won") - 8, cue("president", "won") + 8);
  const win = pop(frame, cue("president", "2025") - 2);
  const nameCard = pop(frame, cue("president", "Karol") - 6);
  const name = progress(frame, cue("president", "Karol") - 2, cue("president", "Nawrocki", "end") + 2);
  // The Prime Minister's card, carried over from the government scene, makes way for the President's.
  const pmOut = progress(frame, cue("president", "Karol") - 22, cue("president", "Karol") - 10);

  return (
    <>
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
        <President size={PRESIDENT.size} id="president" />
        <Badge size={60} ok p={elected} style={{ position: "absolute", right: -4, top: 2 }} />
      </div>

      {/* How he gets the job */}
      <Fact top={FACTS.top} p={elected} exit={exit}>
        <BallotBoxIcon size={72} palette={C} />
        <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, letterSpacing: -0.8, lineHeight: 1.1 }}>
          Elected by
          <br />
          the people
        </div>
      </Fact>
      <Fact top={FACTS.top + 96} p={years} exit={exit}>
        <CalendarIcon size={68} label="5" />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, letterSpacing: -0.8 }}>5 years</div>
          <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft }}>at most 2 terms</div>
        </div>
      </Fact>
      <Fact top={FACTS.top + 182} p={rounds} exit={exit}>
        <div
          style={{
            width: 72,
            height: 68,
            borderRadius: 16,
            background: PL.red,
            color: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 25,
            fontWeight: 900,
            letterSpacing: -0.5,
            flexShrink: 0,
          }}
        >
          50%
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 31, fontWeight: 800, color: C.ink, letterSpacing: -0.6 }}>More than half to win</div>
          <div style={{ fontSize: 25, fontWeight: 600, color: C.inkSoft }}>or a run-off of the top two</div>
        </div>
      </Fact>

      {/* 2025: two rounds */}
      <Card top={ROUNDS.top} height={ROUNDS.height} style={{ padding: "24px 36px", ...riseStyle(card, exit) }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.muted }}>PRESIDENTIAL ELECTION 2025</div>
        <Round
          top={64}
          title="Round 1"
          when="18 May"
          p={round1}
          grow={grow1}
          shares={[
            { name: "Trzaskowski", pct: 31.36, color: PARTY.ko },
            { name: "Nawrocki", pct: 29.54, color: PARTY.pis },
            { name: "11 others", pct: 39.1, color: PL.none },
          ]}
        />
        <Round
          top={170}
          title="Run-off"
          when="1 June"
          p={round2}
          grow={grow2}
          winner={win}
          shares={[
            { name: "Nawrocki", pct: 50.89, color: PARTY.pis },
            { name: "Trzaskowski", pct: 49.11, color: PARTY.ko },
          ]}
        />
      </Card>

      {/* Carried over from the government scene: the Prime Minister */}
      <NameCard
        top={PM_CARD.top}
        height={PM_CARD.height}
        role="PRIME MINISTER"
        name="Donald Tusk"
        sub="leads the government · since Dec 2023"
        cardP={1}
        nameP={1}
        exitP={pmOut}
        palette={C}
        portrait={<PrimeMinister size={124} id="pm-president" />}
      />

      <NameCard
        top={CARD.top}
        height={CARD.height}
        role="PRESIDENT"
        name="Karol Nawrocki"
        sub="head of state · commands the armed forces"
        cardP={nameCard}
        nameP={name}
        exitP={exit}
        palette={C}
      />
    </>
  );
};
