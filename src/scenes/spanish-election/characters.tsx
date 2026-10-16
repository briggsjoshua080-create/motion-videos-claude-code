import React from "react";
import { Character } from "../../components/explainer/Character";
import { ES, HAIR, PALETTE as C, PSOE, FIRST } from "./constants";

/** The King as a generic cartoon (no likeness): crown, red robe with ermine collar, yellow sash. */
export const King: React.FC<{ size: number; id: string }> = ({ size, id }) => (
  <Character size={size} bg={ES.yellowSoft} palette={C} outfit="robe" clothes={ES.robe} sash={ES.yellow} hair={HAIR.grey} hairStyle="side" headwear="crown" jewels={[ES.gold, ES.red]} id={id} />
);

/** The Prime Minister as a generic cartoon (no likeness): dark hair, dark suit, a tie in his party's red. */
export const PrimeMinister: React.FC<{ size: number; id: string; bg?: string }> = ({ size, id, bg = ES.redSoft }) => (
  <Character size={size} bg={bg} palette={C} clothes={ES.suit} tie={PSOE.color} hair={HAIR.dark} hairStyle="short" id={id} />
);

/** The People's Party leader as a generic cartoon (no likeness): grey receding hair, glasses, blue tie. */
export const PartyLeader: React.FC<{ size: number; id: string }> = ({ size, id }) => (
  <Character size={size} bg="#DCEBF7" palette={C} clothes={ES.navy} tie={FIRST.color} hair={HAIR.salt} hairStyle="receding" glasses id={id} />
);
