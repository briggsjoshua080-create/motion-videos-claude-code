import { VERTICAL } from "../../config";
import type { ExplainerPalette } from "../../components/explainer/palette";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/spanish-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * SpanishElection ("Who runs Spain?"): colours, layout, data and timing. Every visual cue is looked
 * up from the voice-over timing (src/voiceover/spanish-election.timing.json), never hard-coded, so
 * re-generating the voice keeps animation, subtitles and sound effects in sync. Facts and sources:
 * briefs/spanish-election-system/script.md.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's red (the accent, and "no") and yellow, dark ink for "yes", and a few neutrals. */
export const ES = {
  red: "#AA151B",
  redDeep: "#850F14",
  redSoft: "#F7DCDD",
  yellow: "#F1BF00",
  yellowSoft: "#FDF1C7",
  yellowDeep: "#8A6A00",
  seat: "#CBD2DB",
  /** Grey for things that win nothing. */
  none: "#B6BEC9",
  /** Seats that step back while others are highlighted. */
  faded: "#E4E8ED",
  suit: "#26303F",
  navy: "#1E2B46",
  charcoal: "#3B4352",
  /** The Senate ballot's sepia paper. */
  sepia: "#EFDDBC",
  sepiaDeep: "#C9A66B",
  /** The King's robe and crown jewels. */
  robe: "#7A1020",
  gold: "#D9A520",
} as const;

/** Made-up parties A–E on the example ballots and vote bars (neutral tints, none like a real party's). */
export const TINT = {
  a: "#56657A",
  aSoft: "#E2E7EE",
  b: "#8A63B8",
  bSoft: "#ECE3F6",
  bDeep: "#5E3D8A",
  c: "#2E9C8F",
  cSoft: "#DDF1EE",
  d: "#B0714A",
  dSoft: "#F4E4D9",
  e: "#9AA4B0",
  eSoft: "#E9ECF0",
} as const;

/** Hair colours for the cartoon characters. */
export const HAIR = {
  brown: "#5A3E2B",
  dark: "#2F2A28",
  grey: "#9C9A97",
  salt: "#B9B4AE",
} as const;

export const PALETTE: ExplainerPalette = {
  paper: "#FFFFFF",
  paperDeep: "#EEF1F4",
  card: "#FFFFFF",
  ink: "#14202B",
  inkSoft: "#4B5866",
  muted: "#A4AEB9",
  line: "#DEE3E8",
  accent: ES.red,
  accentDeep: ES.redDeep,
  onAccent: "#FFFFFF",
  alert: ES.red,
  /** Red, yellow (twice as wide), red. */
  flag: [ES.red, ES.yellow, ES.yellow, ES.red],
  glows: [ES.yellow, "#F08A8F"],
  skin: "#E8B996",
  skinShade: "#D29F7C",
  white: "#FFFFFF",
};

export const CARD_SHADOW = "0 22px 54px rgba(20,32,43,0.14)";

/** Each scene starts this many frames before its first sentence, so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the closing question stays up after the final word. */
const TAIL = 1.3;

export type SceneId = "title" | "who" | "ballot" | "seats" | "senate" | "congress" | "result" | "talks" | "king" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "seats", "senate", "congress", "result", "talks", "king", "question"];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const SPANISH_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : SPANISH_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** Congress of Deputies: 350 seats; 176 is an absolute majority. */
export const TOTAL = 350;
export const MAJORITY = 176;
export const THRESHOLD = 3;

/**
 * The example province on the vote bars: made-up parties A–E sharing 6 seats (D'Hondt). E stays under
 * 3% and gets nothing; D gets votes but no seat (too few for one of only 6).
 */
export const EXAMPLE = [
  { id: "A", votes: 34, seats: 3, color: TINT.a },
  { id: "B", votes: 28, seats: 2, color: TINT.b },
  { id: "C", votes: 18, seats: 1, color: TINT.c },
  { id: "D", votes: 9, seats: 0, color: TINT.d },
  { id: "E", votes: 2, seats: 0, color: TINT.e },
] as const;
export const EXAMPLE_SEATS = 6;

/**
 * Congress election of 23 July 2023 (seats; share of the votes, %), roughly left to right as the
 * parties sit. Colours close to Spanish election-night graphics. `feijoo` / `sanchez`: voted yes in
 * the investiture vote of 27 Sep 2023 (Feijóo) / 16 Nov 2023 (Sánchez).
 */
export const RESULT_2023 = [
  { key: "BILDU", name: "EH Bildu", seats: 6, color: "#9CBE2B", feijoo: false, sanchez: true },
  { key: "BNG", name: "BNG", seats: 1, color: "#7FB6DE", feijoo: false, sanchez: true },
  { key: "ERC", name: "ERC", seats: 7, color: "#F5A623", feijoo: false, sanchez: true },
  { key: "SUMAR", name: "Sumar", seats: 31, color: "#D6336C", feijoo: false, sanchez: true },
  { key: "PSOE", name: "Socialists (PSOE)", seats: 121, color: "#E30613", feijoo: false, sanchez: true },
  { key: "PNV", name: "PNV", seats: 5, color: "#2E7D4F", feijoo: false, sanchez: true },
  { key: "JUNTS", name: "Junts", seats: 7, color: "#20B5A6", feijoo: false, sanchez: true },
  { key: "CC", name: "Canarian Coal.", seats: 1, color: "#F2D13A", feijoo: true, sanchez: true },
  { key: "UPN", name: "UPN", seats: 1, color: "#3D5BA9", feijoo: true, sanchez: false },
  { key: "PP", name: "People's Party (PP)", seats: 137, color: "#1D84CE", feijoo: true, sanchez: false },
  { key: "VOX", name: "Vox", seats: 33, color: "#5DB83A", feijoo: true, sanchez: false },
] as const;
export type PartyKey = (typeof RESULT_2023)[number]["key"];
export const party = (key: PartyKey) => RESULT_2023.find((p) => p.key === key)!;
export const FIRST = party("PP");
export const PSOE = party("PSOE");
export const FEIJOO_YES = RESULT_2023.filter((p) => p.feijoo).reduce((n, p) => n + p.seats, 0);
export const SANCHEZ_YES = RESULT_2023.filter((p) => p.sanchez).reduce((n, p) => n + p.seats, 0);
/** Feijóo's first vote: 172 yes, 178 no. Sánchez's: 179 yes, 171 no. */
export const FEIJOO_NO = TOTAL - FEIJOO_YES;
export const SANCHEZ_NO = TOTAL - SANCHEZ_YES;
/** The coalition government: Socialists + Sumar. */
export const COALITION_SEATS = party("PSOE").seats + party("SUMAR").seats;

/**
 * Where the half-circle (CongressLayer) sits in each scene: centre of its base line, scale and
 * opacity. Scenes use these to place labels next to it.
 */
export const POSE = {
  congress: { cx: 540, cy: 680, s: 0.8, o: 1 },
  result: { cx: 540, cy: 720, s: 0.88, o: 1 },
  talks: { cx: 540, cy: 640, s: 0.62, o: 1 },
} as const;
/** Rows, radii and seat size of the half-circle at scale 1. */
export const ROWS = 9;
export const R_IN = 170;
export const R_OUT = 420;
export const DOT = 10.5;
