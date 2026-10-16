import React from "react";
import { Character } from "../../components/explainer/Character";
import { FIRST, HAIR, PALETTE as C, PT } from "./constants";

/**
 * The President as a generic cartoon (no likeness): grey receding hair, dark suit and the green-red
 * presidential sash.
 */
export const President: React.FC<{ size: number; id: string; bg?: string }> = ({ size, id, bg = PT.greenSoft }) => (
  <Character size={size} bg={bg} palette={C} clothes={PT.suit} tie={PT.red} sash={PT.green} hair={HAIR.grey} hairStyle="receding" id={id} />
);

/** The Prime Minister as a generic cartoon (no likeness): dark hair, navy suit, a tie in his alliance's orange. */
export const PrimeMinister: React.FC<{ size: number; id: string; bg?: string }> = ({ size, id, bg = "#FDE7D2" }) => (
  <Character size={size} bg={bg} palette={C} clothes={PT.navy} tie={FIRST.color} hair={HAIR.dark} hairStyle="side" id={id} />
);
