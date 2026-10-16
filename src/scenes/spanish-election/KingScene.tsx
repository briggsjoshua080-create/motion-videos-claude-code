import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { CrownIcon, LawIcon } from "../../components/explainer/icons";
import { NameCard } from "../../components/explainer/NameCard";
import { pop, progress, sceneExit } from "../../components/explainer/motion";
import { ES, PALETTE as C, type SceneProps } from "./constants";
import { King, PrimeMinister } from "./characters";
import { Badge, Pill } from "./ui";

const KING = { size: 226, top: 320 } as const;
const NAME = { top: 572, height: 160 } as const;
const PILL_TOP = NAME.top + NAME.height + 22;
const TILES_TOP = PILL_TOP + 84;
const TILE_H = 250;

const Tile: React.FC<{ left: number; p: number; exit: number; icon: React.ReactNode; title: string; sub: string }> = ({ left, p, exit, icon, title, sub }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: TILES_TOP,
      width: 408,
      height: TILE_H,
      borderRadius: 28,
      background: C.card,
      boxShadow: "0 22px 54px rgba(20,32,43,0.14)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontFamily: theme.font,
      opacity: Math.min(1, p * 1.4) * (1 - exit),
      transform: `translateY(${(1 - p) * 40 - exit * 30}px) scale(${0.85 + 0.15 * p})`,
    }}
  >
    {icon}
    <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, letterSpacing: -0.8, textAlign: "center", lineHeight: 1.1, padding: "0 20px" }}>{title}</div>
    <div style={{ fontSize: 24, fontWeight: 600, color: C.inkSoft, textAlign: "center", padding: "0 20px", lineHeight: 1.25, whiteSpace: "pre-line" }}>{sub}</div>
  </div>
);

/**
 * "And the King? Felipe the Sixth inherited the throne. He proposes the candidate and signs every
 * law, but can't block one."
 * The King (generic cartoon with crown and robe), his name card, "inherited, not elected", and two
 * tiles: he proposes the candidate for prime minister after meeting the parties; he signs every law
 * within 15 days, but can't refuse one.
 */
export const KingScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const king = pop(frame, cue("king", "King") - 8);
  const card = pop(frame, cue("king", "Felipe") - 8);
  const name = progress(frame, cue("king", "Felipe") - 2, cue("king", "Sixth", "end"));
  const inherited = pop(frame, cue("king", "inherited") - 3);
  const proposes = pop(frame, cue("king", "proposes") - 4);
  const signs = pop(frame, cue("king", "signs") - 4);
  const block = pop(frame, cue("king", "block") - 4);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 540 - KING.size / 2,
          top: KING.top,
          opacity: Math.min(1, king * 1.4) * (1 - exit),
          transform: `translateY(${-exit * 40}px) scale(${0.85 + 0.15 * king})`,
          filter: "drop-shadow(0 18px 30px rgba(20,32,43,0.18))",
        }}
      >
        <King size={KING.size} id="king-scene" />
      </div>

      <NameCard
        top={NAME.top}
        height={NAME.height}
        left={120}
        width={840}
        role="KING · HEAD OF STATE"
        name="Felipe VI"
        sub="since 19 June 2014"
        cardP={card}
        nameP={name}
        exitP={exit}
        palette={C}
        portrait={<CrownIcon size={96} palette={C} />}
      />

      <div style={{ position: "absolute", left: 120, width: 840, top: PILL_TOP, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={inherited} bg={ES.yellowSoft} color={ES.yellowDeep} border={ES.yellow} size={30}>
          Inherited the throne · nobody votes for him
        </Pill>
      </div>

      <Tile
        left={120}
        p={proposes}
        exit={exit}
        icon={<PrimeMinister size={84} id="pm-king" bg={ES.yellowSoft} />}
        title="Proposes the candidate"
        sub={"for prime minister,\nafter meeting the parties"}
      />
      <Tile
        left={552}
        p={signs}
        exit={exit}
        icon={
          <div style={{ position: "relative" }}>
            <LawIcon size={84} palette={C} />
            <Badge size={46} ok={false} p={block} style={{ position: "absolute", right: -16, bottom: -6 }} />
          </div>
        }
        title="Signs every law"
        sub={"within 15 days,\nbut can't block one"}
      />
    </>
  );
};
