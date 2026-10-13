import React from "react";
import { random } from "remotion";
import { Character } from "../../../components/explainer/Character";
import { EU, HAIR, PALETTE as C } from "../constants";

const CLOTHES = [EU.navy, EU.charcoal, EU.slate, EU.plum, EU.teal, EU.wine, EU.blueMid] as const;
const TIES = [EU.yellow, EU.blue, EU.wine, EU.teal, C.white] as const;
const HAIRS = [HAIR.brown, HAIR.dark, HAIR.light, HAIR.grey, HAIR.auburn, HAIR.blond] as const;

const pick = <T,>(list: readonly T[], seed: string): T => list[Math.floor(random(seed) * list.length) % list.length];

/** A generic cartoon politician (no real likeness), varied but deterministic per `seed`. */
export const Politician: React.FC<{ seed: string; size: number; bg?: string }> = ({ seed, size, bg = C.paperDeep }) => {
  const dress = random(`${seed}-outfit`) < 0.4;
  return (
    <Character
      id={seed}
      size={size}
      bg={bg}
      palette={C}
      outfit={dress ? "dress" : "suit"}
      clothes={pick(CLOTHES, `${seed}-clothes`)}
      tie={pick(TIES, `${seed}-tie`)}
      hair={pick(HAIRS, `${seed}-hair`)}
      hairStyle={dress ? pick(["long", "bob", "side"] as const, `${seed}-style`) : pick(["short", "side", "receding"] as const, `${seed}-style`)}
      glasses={random(`${seed}-glasses`) < 0.25}
    />
  );
};

/** A 9 x 3 grid of 27 politicians that pop in as a wave (`p(i)` = progress of person i). */
export const PeopleGrid: React.FC<{ seed: string; size: number; gap: number; p: (i: number) => number; bg?: (i: number) => string }> = ({
  seed,
  size,
  gap,
  p,
  bg,
}) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(9, ${size}px)`, gap }}>
    {Array.from({ length: 27 }, (_, i) => {
      const v = p(i);
      return (
        <div key={i} style={{ opacity: Math.min(1, Math.max(0, v) * 1.4), transform: `translateY(${(1 - v) * 16}px) scale(${0.6 + 0.4 * v})` }}>
          <Politician seed={`${seed}-${i}`} size={size} bg={bg ? bg(i) : C.paperDeep} />
        </div>
      );
    })}
  </div>
);
