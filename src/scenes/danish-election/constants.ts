import { VERTICAL } from "../../config";
import type { ExplainerPalette } from "../../components/explainer/palette";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/danish-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * DanishElection ("Who runs Denmark?"): colours, layout, data and timing. Every visual cue is looked
 * up from the voice-over timing (src/voiceover/danish-election.timing.json), never hard-coded, so
 * re-generating the voice keeps animation, subtitles and sound effects in sync. Facts and sources:
 * briefs/danish-election-system/script.md.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The Dannebrog's red (the accent, and "no"), dark ink for "yes", and a few neutrals. */
export const DK = {
  red: "#C8102E",
  redDeep: "#9B0C23",
  redSoft: "#FADADF",
  seat: "#CBD2DB",
  /** Grey for things that win nothing. */
  none: "#B6BEC9",
  /** Seats that step back while others are highlighted. */
  faded: "#E4E8ED",
  /** The opposition in the "no majority against" step. */
  against: "#3B4352",
  suit: "#26303F",
  navy: "#1E2B46",
  charcoal: "#3B4352",
  /** The King's robe and crown jewels. */
  robe: "#7A1020",
  gold: "#D9A520",
} as const;

/** Made-up parties A–E on the example ballot and vote bars (neutral tints, none like a real party's). */
export const TINT = {
  a: "#56657A",
  aSoft: "#E2E7EE",
  b: "#D19A2E",
  bSoft: "#F8EBCF",
  bDeep: "#8A6210",
  c: "#8A63B8",
  cSoft: "#ECE3F6",
  d: "#B0714A",
  dSoft: "#F4E4D9",
  e: "#9AA4B0",
  eSoft: "#E9ECF0",
} as const;

/** Hair colours for the cartoon characters. */
export const HAIR = {
  brown: "#5A3E2B",
  dark: "#2F2A28",
  blonde: "#C9A36A",
  grey: "#9C9A97",
} as const;

export const PALETTE: ExplainerPalette = {
  paper: "#FFFFFF",
  paperDeep: "#EEF1F4",
  card: "#FFFFFF",
  ink: "#14202B",
  inkSoft: "#4B5866",
  muted: "#A4AEB9",
  line: "#DEE3E8",
  accent: DK.red,
  accentDeep: DK.redDeep,
  onAccent: "#FFFFFF",
  alert: DK.red,
  flag: [DK.red, "#FFFFFF"],
  emblem: "nordic",
  glows: [DK.red, "#F08A99"],
  skin: "#E8B996",
  skinShade: "#D29F7C",
  white: "#FFFFFF",
};

export const CARD_SHADOW = "0 22px 54px rgba(20,32,43,0.14)";

/** Each scene starts this many frames before its first sentence, so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the closing question stays up after the final word. */
const TAIL = 1.3;

export type SceneId = "title" | "who" | "ballot" | "seats" | "folketing" | "result" | "talks" | "minority" | "king" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "seats", "folketing", "result", "talks", "minority", "king", "question"];
const FIRST_SENTENCE: Record<SceneId, string> = {
  title: "hook",
  who: "who",
  ballot: "ballot",
  seats: "seats",
  folketing: "folketing",
  result: "result",
  talks: "talks",
  minority: "minority",
  king: "king",
  question: "question",
};

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const DANISH_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts. */
export const sceneFrom = (id: SceneId): number =>
  id === "title" ? 0 : toFrame(getSentence(timing, FIRST_SENTENCE[id]).start) - LEAD;

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : DANISH_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** Folketing: 179 seats (175 Denmark, 2 Greenland, 2 Faroe Islands); 90 is a majority. */
export const TOTAL = 179;
export const DENMARK_SEATS = 175;
export const MAJORITY = 90;
export const THRESHOLD = 2;

/**
 * The example on the vote bars: made-up parties A–E. E stays under 2% and gets no seats; A–D share
 * Denmark's 175 seats by their votes (rounded so they add up to 175). The last 4 seats of the
 * half-circle are Greenland's and the Faroe Islands'.
 */
export const EXAMPLE = [
  { id: "A", votes: 35, seats: 62, color: TINT.a },
  { id: "B", votes: 27, seats: 48, color: TINT.b },
  { id: "C", votes: 20, seats: 36, color: TINT.c },
  { id: "D", votes: 16.4, seats: 29, color: TINT.d },
  { id: "E", votes: 1.6, seats: 0, color: TINT.e },
] as const;

/**
 * Folketing election of 24 March 2026 (seats; share of the votes in Denmark, %), roughly left to
 * right as the parties sit, then the 4 North Atlantic seats. Colours close to Danish election-night
 * graphics. `side`: the government, its support parties, or the opposition (Oct 2026).
 */
export const RESULT_2026 = [
  { key: "O", name: "Red–Green", seats: 11, votes: 6.3, color: "#E6801A", side: "support" },
  { key: "AA", name: "Alternative", seats: 5, votes: 2.6, color: "#2B8738", side: "support" },
  { key: "F", name: "SF", seats: 20, votes: 11.6, color: "#E07EA8", side: "gov" },
  { key: "A", name: "Social Democrats", seats: 38, votes: 21.8, color: "#B32722", side: "gov" },
  { key: "B", name: "Social Liberals", seats: 10, votes: 5.8, color: "#713280", side: "gov" },
  { key: "M", name: "Moderates", seats: 14, votes: 7.7, color: "#B48CD2", side: "gov" },
  { key: "V", name: "Venstre", seats: 18, votes: 10.1, color: "#1F4E8C", side: "opp" },
  { key: "C", name: "Conservatives", seats: 13, votes: 7.6, color: "#96B226", side: "opp" },
  { key: "I", name: "Liberal Alliance", seats: 16, votes: 9.4, color: "#3FB2BE", side: "opp" },
  { key: "AE", name: "Denmark Democrats", seats: 10, votes: 5.8, color: "#7896D2", side: "opp" },
  { key: "DF", name: "Danish People's", seats: 16, votes: 9.1, color: "#EAC73E", side: "opp" },
  { key: "H", name: "Citizens' Party", seats: 4, votes: 2.1, color: "#5C6B7A", side: "opp" },
  { key: "NA", name: "Greenland & Faroes", seats: 4, votes: 0, color: DK.none, side: "na" },
] as const;
export type PartyKey = (typeof RESULT_2026)[number]["key"];
export const party = (key: PartyKey) => RESULT_2026.find((p) => p.key === key)!;
export const FIRST = party("A");
/** Parties that won seats in Denmark. */
export const PARTIES_IN = RESULT_2026.filter((p) => p.key !== "NA").length;
/** The Frederiksen III government (S, SF, Social Liberals, Moderates), formed 3 June 2026. */
export const GOVERNMENT_SEATS = RESULT_2026.filter((p) => p.side === "gov").reduce((n, p) => n + p.seats, 0);
/** The opposition parties (Venstre, Conservatives, LA, Denmark Democrats, DF, Citizens' Party). */
export const OPPOSITION_SEATS = RESULT_2026.filter((p) => p.side === "opp").reduce((n, p) => n + p.seats, 0);
/** Days from the election (24 Mar) to the new government (3 Jun 2026). */
export const TALK_DAYS = 69;

/**
 * Where the half-circle (FolketingLayer) sits in each scene: centre of its base line, scale and
 * opacity. Scenes use these to place labels next to it.
 */
export const POSE = {
  /** Below the vote bars. */
  seats: { cx: 540, cy: 1150, s: 0.62, o: 1 },
  folketing: { cx: 540, cy: 780, s: 0.95, o: 1 },
  result: { cx: 540, cy: 740, s: 0.95, o: 1 },
  /** Hidden while the King's rounds play. */
  talks: { cx: 540, cy: 740, s: 0.8, o: 0 },
  minority: { cx: 540, cy: 716, s: 0.86, o: 1 },
} as const;
/** Rows, radii and seat size of the half-circle at scale 1. */
export const ROWS = 6;
export const R_IN = 200;
export const R_OUT = 420;
export const DOT = 15;
