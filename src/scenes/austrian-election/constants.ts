import { VERTICAL } from "../../config";
import type { ExplainerPalette } from "../../components/explainer/palette";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/austrian-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * AustrianElection ("Who runs Austria?"): colours, layout, data and timing. Every visual cue is looked
 * up from the voice-over timing (src/voiceover/austrian-election.timing.json), never hard-coded, so
 * re-generating the voice keeps animation, subtitles and sound effects in sync. Facts and sources:
 * briefs/austrian-election-system/script.md.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/**
 * The flag's red (the accent, and "no"), dark ink for "yes", a slate for the Federal Council and a
 * few neutrals. The National Council is drawn in flag red.
 */
export const AT = {
  red: "#C8102E",
  redDeep: "#9E0B23",
  redSoft: "#F9DADF",
  /** Federal Council (sent by the states). */
  federal: "#5B6B80",
  federalSoft: "#E3E8EF",
  seat: "#CBD2DB",
  /** Grey for things that win nothing or stop working. */
  none: "#B6BEC9",
  /** Suits of the cartoon characters. */
  suit: "#26303F",
  navy: "#1E2B46",
  charcoal: "#3B4352",
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

/** Party colours as used on Austrian election nights (2024 result only). */
export const PARTY = {
  fpo: "#1F5CB0",
  ovp: "#3FAFC0",
  spo: "#E2343B",
  neos: "#E23A8E",
  greens: "#74AC36",
} as const;

/** Hair colours for the cartoon characters. */
export const HAIR = {
  brown: "#5A3E2B",
  dark: "#2F2A28",
  grey: "#9C9A97",
  white: "#E6E3DE",
} as const;

export const PALETTE: ExplainerPalette = {
  paper: "#FFFFFF",
  paperDeep: "#EEF1F4",
  card: "#FFFFFF",
  ink: "#14202B",
  inkSoft: "#4B5866",
  muted: "#A4AEB9",
  line: "#DEE3E8",
  accent: AT.red,
  accentDeep: AT.redDeep,
  onAccent: "#FFFFFF",
  alert: AT.red,
  flag: [AT.red, "#FFFFFF", AT.red],
  glows: [AT.red, "#F08A99"],
  skin: "#E8B996",
  skinShade: "#D29F7C",
  white: "#FFFFFF",
};

export const CARD_SHADOW = "0 22px 54px rgba(20,32,43,0.14)";

/** Vertical 9:16 layout (px). Clear of TikTok's top bar, side buttons and caption area. */
export const LAYOUT = {
  marginX: 120,
  width: 840,
  headerTop: 170,
  stageTop: 350,
  /** Lowest edge for scene content: the subtitles sit below, centred at y = 1330. */
  stageBottom: 1250,
} as const;

/** Each scene starts this many frames before its first sentence, so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the closing question stays up after the final word. */
const TAIL = 1.3;

export type SceneId = "title" | "who" | "ballot" | "seats" | "council" | "federal" | "result" | "talks" | "president" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "seats", "council", "federal", "result", "talks", "president", "question"];
const FIRST_SENTENCE: Record<SceneId, string> = {
  title: "hook",
  who: "who",
  ballot: "ballot",
  seats: "seats",
  council: "council",
  federal: "federal",
  result: "result",
  talks: "talks",
  president: "president",
  question: "question",
};

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const AUSTRIAN_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts. */
export const sceneFrom = (id: SceneId): number =>
  id === "title" ? 0 : toFrame(getSentence(timing, FIRST_SENTENCE[id]).start) - LEAD;

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : AUSTRIAN_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** Days from the election (29 Sep 2024) to the new government's swearing-in (3 Mar 2025). */
export const DAYS = 155;

/** National Council: 183 seats, 92 is a majority. Federal Council: 60 members (since June 2023). */
export const COUNCIL_TOTAL = 183;
export const COUNCIL_MAJORITY = 92;
export const FEDERAL_TOTAL = 60;

/**
 * The example on the vote bars: made-up parties A–E. E stays under 4% and gets no seats; A–D share
 * the 183 seats by their votes (rounded so they add up to 183).
 */
export const EXAMPLE = [
  { id: "A", votes: 35, seats: 67, color: TINT.a },
  { id: "B", votes: 28, seats: 53, color: TINT.b },
  { id: "C", votes: 20, seats: 38, color: TINT.c },
  { id: "D", votes: 13, seats: 25, color: TINT.d },
  { id: "E", votes: 3, seats: 0, color: TINT.e },
] as const;
export const THRESHOLD = 4;

/**
 * National Council election of 29 September 2024 (seats; share of the votes in %), left to right as
 * the parties sit in the half-circle. Majority: 92 of 183.
 */
export const RESULT_2024 = [
  { key: "greens", name: "Greens", seats: 16, votes: 8.2, color: PARTY.greens, gov: false },
  { key: "spo", name: "SPÖ", seats: 41, votes: 21.1, color: PARTY.spo, gov: true },
  { key: "neos", name: "NEOS", seats: 18, votes: 9.1, color: PARTY.neos, gov: true },
  { key: "ovp", name: "ÖVP", seats: 51, votes: 26.3, color: PARTY.ovp, gov: true },
  { key: "fpo", name: "FPÖ", seats: 57, votes: 28.8, color: PARTY.fpo, gov: false },
] as const;
export const FIRST = RESULT_2024[RESULT_2024.length - 1];
/** The government formed in March 2025: ÖVP + SPÖ + NEOS. */
export const GOVERNMENT_SEATS = RESULT_2024.filter((p) => p.gov).reduce((n, p) => n + p.seats, 0);
export const partyColor = (key: (typeof RESULT_2024)[number]["key"]) => RESULT_2024.find((p) => p.key === key)!.color;

/**
 * Where the National Council half-circle (CouncilLayer) sits in each scene: centre of its base line,
 * scale and opacity. Scenes use these to place labels next to it.
 */
export const COUNCIL_POSE = {
  /** Below the vote bars. */
  seats: { cx: 540, cy: 1196, s: 0.74, o: 1 },
  council: { cx: 540, cy: 800, s: 0.9, o: 1 },
  /** Left of the Federal Council. */
  federal: { cx: 296, cy: 810, s: 0.5, o: 1 },
  result: { cx: 540, cy: 812, s: 1, o: 1 },
  /** Small, at the top: the new government's majority. */
  talks: { cx: 540, cy: 604, s: 0.5, o: 1 },
  president: { cx: 540, cy: 604, s: 0.4, o: 0 },
} as const;
/** Outer radius and seat size of the half-circle at scale 1. */
export const COUNCIL_R_OUT = 400;
export const COUNCIL_DOT = 12;
/** The Federal Council is drawn smaller (a third of the seats) at the same scale. */
export const FEDERAL_R_OUT = 230;
