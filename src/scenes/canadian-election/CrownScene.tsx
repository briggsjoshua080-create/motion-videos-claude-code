import React from "react";
import { useCurrentFrame } from "remotion";
import { Character } from "../../components/explainer/Character";
import { float } from "../../lib/animation";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CA, CHARACTER_PALETTE, FONT, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mark, Mono } from "./ui";

const CARD = { top: 690, height: 400, width: 408 } as const;
const GOLD = "#E7B526";

/**
 * "The head of state is King Charles. The Governor General stands in for him and signs the laws."
 * Two cards with flat cartoon characters (no real likenesses): the King (crown, robe, red sash)
 * and the Governor General (suit) who stands in for him in Canada; on "signs the laws" a ticked
 * strip: signs every law (royal assent), appoints the PM the House backs.
 */
export const CrownScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const aside = rise(frame, cue("crown", "head") - 2);
  const king = pop(frame, cue("crown", "King") - 6);
  const gg = pop(frame, cue("crown", "Governor") - 6);
  const arrow = progress(frame, cue("crown", "stands") - 4, cue("crown", "him") + 4);
  const signs = rise(frame, cue("crown", "signs") - 6);
  const tick = progress(frame, cue("crown", "signs") - 2, cue("crown", "laws") + 6);

  const card = (left: number, p: number, title: string, sub: string, note: string, person: React.ReactNode) => (
    <Glass left={left} top={CARD.top} width={CARD.width} height={CARD.height} tick={CA.white} style={{ opacity: Math.min(1, Math.max(0, p) * 1.5) * (1 - exit), transform: `translateY(${(1 - Math.min(1, p)) * 30 - exit * 30}px)` }}>
      <div style={{ position: "absolute", left: (CARD.width - 200) / 2, top: 26, transform: `translateY(${float(frame, 4, 70, left)}px)` }}>{person}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.display, fontSize: 30, color: CA.white, lineHeight: 1.05 }}>{title}</div>
        <div style={{ marginTop: 8, fontSize: 23, fontWeight: 600, color: CA.textSoft }}>{sub}</div>
        <Mono size={15} color={CA.rose} style={{ marginTop: 14, letterSpacing: 2 }}>
          {note}
        </Mono>
      </div>
    </Glass>
  );

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>08 — HEAD OF STATE</Eyebrow>
      <Headline size={128} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        THE
      </Headline>
      <Headline size={128} style={{ top: 352 + 126, ...riseStyle(head[1], exit, 50) }}>
        <Accent>CROWN</Accent>
      </Headline>
      <Aside size={44} style={{ top: 618, ...riseStyle(aside, exit, 24) }}>
        Canada's King is also the UK's.
      </Aside>

      {card(
        120,
        king,
        "KING CHARLES III",
        "head of state",
        "LIVES IN THE UK",
        <Character size={200} bg="rgba(255,255,255,0.92)" palette={CHARACTER_PALETTE} outfit="robe" clothes="#7A1018" sash={CA.red} hair="#D9D4CC" hairStyle="receding" headwear="crown" jewels={[GOLD, CA.red]} id="ca-king" />,
      )}
      {card(
        552,
        gg,
        "GOVERNOR GENERAL",
        "stands in for him",
        "LOUISE ARBOUR · SINCE JUNE 2026",
        <Character size={200} bg="rgba(255,255,255,0.92)" palette={CHARACTER_PALETTE} outfit="suit" clothes="#2A2F3A" tie={CA.red} hair="#CFC8C0" hairStyle="bob" glasses id="ca-gg" />,
      )}
      {/* "stands in for him": an arrow from the King's card to the Governor General's. */}
      <svg width={120} height={60} style={{ position: "absolute", left: 480, top: CARD.top + 100, overflow: "visible", opacity: (arrow > 0 ? 1 : 0) * (1 - exit) }}>
        <path d="M8 30 H104 M86 12 L106 30 L86 48" fill="none" stroke={CA.white} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arrow} style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))" }} />
      </svg>

      <div style={{ position: "absolute", left: 120, top: CARD.top + CARD.height + 22, width: 840, display: "flex", gap: 28, alignItems: "center", ...riseStyle(signs, exit, 20) }}>
        {["Signs every law", "Appoints the PM"].map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 800, color: i === 0 ? CA.white : CA.textSoft }}>
            <Mark ok size={34} p={i === 0 ? tick : Math.max(0, tick * 2 - 1)} color={CA.white} />
            {t}
          </div>
        ))}
      </div>
    </>
  );
};
