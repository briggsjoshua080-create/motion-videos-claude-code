import { VERTICAL } from "../../config";
import type { ExplainerPalette } from "../../components/explainer/palette";
import type { Cue } from "../../voiceover/timing";

/**
 * Shared look and data for the two-part "EU election system" series (EUElectionPart1 and
 * EUElectionPart2). Facts and sources: briefs/eu-election-system/script.md.
 */

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

export const FPS = VERTICAL.fps;

/**
 * EU colours: Reflex Blue and yellow from the EU emblem (Regulation 1049/2014), plus tints of the
 * blue for seats and charts. `no` is a functional red for crossed-out things, not a flag colour.
 */
export const EU = {
  blue: "#003399",
  yellow: "#FFCC00",
  blueDeep: "#002266",
  blueMid: "#2F5BB7",
  blueSoft: "#7D9BD6",
  bluePale: "#DCE5F7",
  yellowDeep: "#A07C00",
  yellowSoft: "#FFE58A",
  seat: "#C9CFDD",
  seatAlt: "#ADB6CB",
  no: "#D2372C",
  /** Suits and dresses of the cartoon politicians. */
  navy: "#22305C",
  charcoal: "#3B4252",
  slate: "#5B6B8C",
  plum: "#6B3E6E",
  teal: "#2D6F73",
  wine: "#8C2F39",
} as const;

/** Hair colours for the cartoon characters. */
export const HAIR = {
  brown: "#5A3E2B",
  dark: "#2F2A28",
  light: "#B08A5E",
  grey: "#9A9A9A",
  auburn: "#8A4B2A",
  blond: "#D8B56A",
} as const;

export const PALETTE: ExplainerPalette = {
  paper: "#FFFFFF",
  paperDeep: "#EEF1F8",
  card: "#FFFFFF",
  ink: "#0F1B3D",
  inkSoft: "#4A5677",
  muted: "#A3ACC2",
  line: "#DCE1EC",
  accent: EU.yellow,
  accentDeep: EU.yellowDeep,
  alert: EU.blue,
  flag: [EU.blue],
  emblem: "eu",
  glows: [EU.yellow, EU.blue],
  skin: "#E8B996",
  skinShade: "#D29F7C",
  white: "#FFFFFF",
};

/** Small flags drawn in the video (stripes top to bottom, or left to right when vertical). */
export const FLAGS = {
  germany: { stripes: ["#000000", "#DD0000", "#FFCE00"], vertical: false },
  malta: { stripes: ["#FFFFFF", "#CF142B"], vertical: true },
} as const;

/** Vertical 9:16 layout (px). Clear of TikTok's top bar, side buttons and caption area. */
export const LAYOUT = {
  marginX: 120,
  width: 840,
  stageTop: 340,
  subtitleCenterY: 1395,
} as const;

export const CARD_SHADOW = "0 22px 54px rgba(15,27,61,0.14)";

/** Each scene starts this many frames before its first sentence, so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the closing question stays up after the final word. */
export const TAIL = 1.4;

/** European Parliament 2024–2029. */
export const EP_SEATS = 720;
export const EP_MAJORITY = 361;

/**
 * Seats per country, 2024–2029 (European Council Decision (EU) 2023/2061), largest first.
 * Used for the "seated by country" pattern before the seats sort into political groups.
 */
export const COUNTRY_SEATS: readonly (readonly [code: string, seats: number])[] = [
  ["DE", 96], ["FR", 81], ["IT", 76], ["ES", 61], ["PL", 53], ["RO", 33], ["NL", 31], ["BE", 22], ["CZ", 21],
  ["EL", 21], ["HU", 21], ["PT", 21], ["SE", 21], ["AT", 20], ["BG", 17], ["DK", 15], ["FI", 15], ["SK", 15],
  ["IE", 14], ["HR", 12], ["LT", 11], ["LV", 9], ["SI", 9], ["EE", 7], ["CY", 6], ["LU", 6], ["MT", 6],
];

export type Group = { key: string; name: string; seats: number; color: string };

/**
 * The 2024 result at the constitutive session (results.elections.europa.eu), in seating order
 * from left to right. Neutral blue tints, alternating light and dark so the blocks stay apart;
 * no party colours, to keep the video party-neutral.
 */
export const GROUPS_2024: readonly Group[] = [
  { key: "left", name: "Left", seats: 46, color: "#A9BBE3" },
  { key: "sd", name: "S&D", seats: 136, color: "#3559A8" },
  { key: "greens", name: "Greens", seats: 53, color: "#8CA6DC" },
  { key: "renew", name: "Renew", seats: 77, color: "#5677C4" },
  { key: "epp", name: "EPP", seats: 188, color: "#1E3C8A" },
  { key: "ecr", name: "ECR", seats: 78, color: "#7189C2" },
  { key: "pfe", name: "Patriots", seats: 84, color: "#2B3F78" },
  { key: "esn", name: "ESN", seats: 25, color: "#9AA8CC" },
  { key: "ni", name: "Non-attached", seats: 33, color: "#BCC3D3" },
];

/** First seat index of each group (seats run left to right). */
export const GROUP_FROM = GROUPS_2024.map((_, i) => GROUPS_2024.slice(0, i).reduce((n, g) => n + g.seats, 0));
export const groupOfSeat = (i: number): number => GROUP_FROM.filter((from) => i >= from).length - 1;

/** People per MEP: population (31 Dec 2024; Destatis, NSO Malta) / seats. */
export const PER_MEP = {
  germany: { people: 870_000, seats: 96, population: 83_577_140 },
  malta: { people: 96_000, seats: 6, population: 574_250 },
} as const;
