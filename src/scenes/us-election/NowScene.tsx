import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, MIDTERMS, US, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const CARD = { top: 760, height: 190, gap: 24 } as const;

/**
 * "On November 3rd, the midterms decide Congress again." The 2026 note: the midterms of 3 Nov 2026
 * with what is on the ballot (all 435 House seats, 35 Senate seats), date-stamped because it goes
 * stale once the votes are in. Facts and the date they were checked: briefs/us-election-system/.
 */
export const NowScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("now", "midterms") - 4);
  const cards = [pop(frame, cue("now", "decide") - 4), pop(frame, cue("now", "Congress") - 4)];
  const asOf = rise(frame, cue("now", "Congress"));

  const card = (i: number, big: number, title: string, sub: string) => (
    <Glass top={CARD.top + i * (CARD.height + CARD.gap)} height={CARD.height} tick={US.redBright} style={{ opacity: Math.min(1, Math.max(0, cards[i]) * 1.5) * (1 - exit), transform: `scale(${0.85 + 0.15 * cards[i]})` }}>
      <div style={{ position: "absolute", left: 40, top: 42, fontFamily: FONT.display, fontSize: 104, lineHeight: 1, color: US.redBright, textShadow: "0 0 28px rgba(240,71,94,0.45)" }}>{big}</div>
      <div style={{ position: "absolute", left: 330, top: 50 }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: US.white }}>{title}</div>
        <div style={{ marginTop: 6, fontSize: 25, fontWeight: 500, color: US.textSoft }}>{sub}</div>
      </div>
    </Glass>
  );

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>07 — NEXT: THE MIDTERMS</Eyebrow>
      <Headline size={132} style={{ top: 350, ...riseStyle(head[0], exit, 50) }}>
        <Accent>3 NOV</Accent>
      </Headline>
      <Headline size={132} style={{ top: 350 + 130, ...riseStyle(head[1], exit, 50) }}>
        2026
      </Headline>
      <Aside size={44} style={{ top: 650, ...riseStyle(aside, exit, 24) }}>
        Midterms: halfway through the president's term.
      </Aside>
      {card(0, MIDTERMS.house, "House seats", "all of them, as every 2 years")}
      {card(1, MIDTERMS.senate, "Senate seats", "a third, plus 2 vacated seats")}
      <Mono size={19} color={US.textSoft} style={{ position: "absolute", left: 120, top: 1206, letterSpacing: 3, ...riseStyle(asOf, exit, 20) }}>
        AS OF {MIDTERMS.asOf} · <span style={{ color: US.redBright }}>RESULTS NOT IN YET</span>
      </Mono>
    </>
  );
};
