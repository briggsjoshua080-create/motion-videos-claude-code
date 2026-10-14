import { VERTICAL } from "../../config";
import type { ExplainerPalette } from "../../components/explainer/palette";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/polish-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * PolishElection ("Who runs Poland?"): colours, layout, data and timing. Every visual cue is looked
 * up from the voice-over timing (src/voiceover/polish-election.timing.json), never hard-coded, so
 * re-generating the voice keeps animation, subtitles and sound effects in sync. Facts and sources:
 * briefs/polish-election-system/script.md.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/**
 * The flag's red (the accent, and "no"), dark ink for "yes", a slate blue for the Senate and a few
 * neutrals. The Sejm is drawn in flag red.
 */
export const PL = {
  red: "#DC143C",
  redDeep: "#A50F2D",
  redSoft: "#FBDDE2",
  /** The Senate. */
  senate: "#4F6D8F",
  senateSoft: "#E1E8F0",
  seat: "#CBD2DB",
  /** Grey for things that win nothing or stop working. */
  none: "#B6BEC9",
  /** Seats that step back while others are highlighted. */
  faded: "#E4E8ED",
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

/** Party colours close to those of Polish election-night graphics (2023 result only). */
export const PARTY = {
  pis: "#263778",
  ko: "#EE7F1A",
  td: "#E2B300",
  left: "#B0236E",
  konf: "#33363D",
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
  accent: PL.red,
  accentDeep: PL.redDeep,
  onAccent: "#FFFFFF",
  alert: PL.red,
  flag: ["#FFFFFF", PL.red],
  glows: [PL.red, "#F08A99"],
  skin: "#E8B996",
  skinShade: "#D29F7C",
  white: "#FFFFFF",
};

export const CARD_SHADOW = "0 22px 54px rgba(20,32,43,0.14)";

/** Each scene starts this many frames before its first sentence, so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the closing question stays up after the final word. */
const TAIL = 1.3;

export type SceneId = "title" | "who" | "ballot" | "seats" | "sejm" | "senate" | "result" | "govt" | "president" | "veto" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "seats", "sejm", "senate", "result", "govt", "president", "veto", "question"];
const FIRST_SENTENCE: Record<SceneId, string> = {
  title: "hook",
  who: "who",
  ballot: "ballot",
  seats: "seats",
  sejm: "sejm",
  senate: "senate",
  result: "result",
  govt: "govt",
  president: "president",
  veto: "veto",
  question: "question",
};

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const POLISH_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts. */
export const sceneFrom = (id: SceneId): number =>
  id === "title" ? 0 : toFrame(getSentence(timing, FIRST_SENTENCE[id]).start) - LEAD;

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : POLISH_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** Sejm: 460 seats, 231 is a majority, 3/5 of all MPs (276) override a veto. Senate: 100 seats. */
export const SEJM_TOTAL = 460;
export const SEJM_MAJORITY = 231;
export const OVERRIDE = 276;
export const SENATE_TOTAL = 100;
/** MPs on the governing side in October 2026 (KO, PSL, the Left, Polska 2050, Centrum), about. */
export const GOVERNMENT_TODAY = 240;
/** Laws President Nawrocki vetoed in his first year (Aug 2025 – Aug 2026). */
export const VETOES_FIRST_YEAR = 41;

/**
 * The example on the vote bars: made-up parties A–E. E stays under 5% and gets no seats; A–D share
 * the 460 seats by their votes (rounded so they add up to 460).
 */
export const EXAMPLE = [
  { id: "A", votes: 36, seats: 173, color: TINT.a },
  { id: "B", votes: 29, seats: 139, color: TINT.b },
  { id: "C", votes: 17, seats: 81, color: TINT.c },
  { id: "D", votes: 14, seats: 67, color: TINT.d },
  { id: "E", votes: 4, seats: 0, color: TINT.e },
] as const;
export const THRESHOLD = 5;

/**
 * Party B's list in "your district" (made up), in list order, with the crosses each candidate got.
 * Party B wins two seats here; they go to the two candidates with the most crosses.
 */
export const LIST_B = [
  { no: 1, name: "Anna Nowak", crosses: 12480 },
  { no: 2, name: "Piotr Wójcik", crosses: 8215 },
  { no: 3, name: "Ewa Zielińska", crosses: 5036 },
  { no: 4, name: "Jan Kowalski", crosses: 21904 },
  { no: 5, name: "Maria Lis", crosses: 3127 },
] as const;
export const LIST_B_SEATS = 2;
/** The candidate the voter crosses on the ballot (list number). */
export const VOTED_CANDIDATE = 4;

/**
 * Sejm election of 15 October 2023 (seats; share of the votes in %), left to right as the parties
 * sit in the half-circle. Majority: 231 of 460.
 */
export const RESULT_2023 = [
  { key: "left", name: "Left", seats: 26, votes: 8.61, color: PARTY.left, gov: true },
  { key: "ko", name: "KO", seats: 157, votes: 30.7, color: PARTY.ko, gov: true },
  { key: "td", name: "Third Way", seats: 65, votes: 14.4, color: PARTY.td, gov: true },
  { key: "konf", name: "Confed.", seats: 18, votes: 7.16, color: PARTY.konf, gov: false },
  { key: "pis", name: "PiS", seats: 194, votes: 35.38, color: PARTY.pis, gov: false },
] as const;
export const FIRST = RESULT_2023[RESULT_2023.length - 1];
/** The government formed in December 2023: KO + Third Way (Polska 2050, PSL) + the Left. */
export const GOVERNMENT_SEATS = RESULT_2023.filter((p) => p.gov).reduce((n, p) => n + p.seats, 0);
export const partyColor = (key: (typeof RESULT_2023)[number]["key"]) => RESULT_2023.find((p) => p.key === key)!.color;

/**
 * Where the Sejm half-circle (SejmLayer) sits in each scene: centre of its base line, scale and
 * opacity. Scenes use these to place labels next to it.
 */
export const SEJM_POSE = {
  /** Below the vote bars. */
  seats: { cx: 540, cy: 1036, s: 0.55, o: 1 },
  sejm: { cx: 540, cy: 800, s: 0.9, o: 1 },
  /** Bottom left, beside the Senate. */
  senate: { cx: 330, cy: 1094, s: 0.45, o: 1 },
  result: { cx: 540, cy: 812, s: 0.95, o: 1 },
  /** Small, at the top: the new government's majority. */
  govt: { cx: 540, cy: 626, s: 0.55, o: 1 },
  president: { cx: 540, cy: 626, s: 0.45, o: 0 },
  /** Back for the veto: three fifths to override. */
  veto: { cx: 540, cy: 1000, s: 0.74, o: 1 },
} as const;
/** Rows, radii and seat size of the half-circle at scale 1. */
export const SEJM_ROWS = 10;
export const SEJM_R_IN = 170;
export const SEJM_R_OUT = 420;
export const SEJM_DOT = 8;
