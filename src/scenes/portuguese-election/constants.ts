import { VERTICAL } from "../../config";
import type { ExplainerPalette } from "../../components/explainer/palette";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/portuguese-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * PortugueseElection ("Who runs Portugal?"): colours, layout, data and timing. Every visual cue is
 * looked up from the voice-over timing (src/voiceover/portuguese-election.timing.json), never
 * hard-coded, so re-generating the voice keeps animation, subtitles and sound effects in sync.
 * Facts and sources: briefs/portuguese-election-system/script.md.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's green (the accent) and red ("no", alerts), the armillary sphere's gold, and neutrals. */
export const PT = {
  green: "#046A38",
  greenDeep: "#034A27",
  greenSoft: "#DCEFE3",
  red: "#DA291C",
  redDeep: "#A51E14",
  redSoft: "#FADBD8",
  gold: "#FFD100",
  goldSoft: "#FFF4C2",
  goldDeep: "#8A6A00",
  seat: "#CBD2DB",
  /** Grey for things that win nothing. */
  none: "#B6BEC9",
  /** Seats that step back while others are highlighted. */
  faded: "#E4E8ED",
  suit: "#26303F",
  navy: "#1E2B46",
  charcoal: "#3B4352",
} as const;

/** Made-up parties A–E on the example ballot and vote bars (neutral tints, none like a real party's). */
export const TINT = {
  a: "#56657A",
  b: "#8A63B8",
  c: "#2E9C8F",
  d: "#B0714A",
  e: "#9AA4B0",
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
  accent: PT.green,
  accentDeep: PT.greenDeep,
  onAccent: "#FFFFFF",
  alert: PT.red,
  /** Green (2/5) and red (3/5), side by side. */
  flag: [PT.green, PT.green, PT.red, PT.red, PT.red],
  flagVertical: true,
  glows: ["#7FC79B", "#F08A8F"],
  skin: "#E8B996",
  skinShade: "#D29F7C",
  white: "#FFFFFF",
};

export const CARD_SHADOW = "0 22px 54px rgba(20,32,43,0.14)";

/** Each scene starts this many frames before its first sentence, so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the closing question stays up after the final word. */
const TAIL = 1.3;

export type SceneId = "title" | "who" | "ballot" | "seats" | "parliament" | "result" | "gov" | "president" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "seats", "parliament", "result", "gov", "president", "question"];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const PORTUGUESE_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : PORTUGUESE_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** Assembly of the Republic: 230 seats; 116 is an absolute majority. */
export const TOTAL = 230;
export const MAJORITY = 116;

/** The three general elections called after the President dissolved parliament. */
export const ELECTIONS = [
  { date: "30 Jan 2022", year: "2022", why: "budget voted down" },
  { date: "10 Mar 2024", year: "2024", why: "prime minister resigned" },
  { date: "18 May 2025", year: "2025", why: "confidence vote lost" },
] as const;

/**
 * The example district on the vote bars: made-up parties A–E sharing 6 seats (D'Hondt, no
 * threshold). D (9%) and E (4%) still win nothing: too few votes for one of only 6 seats.
 */
export const EXAMPLE = [
  { id: "A", votes: 38, seats: 3, color: TINT.a },
  { id: "B", votes: 30, seats: 2, color: TINT.b },
  { id: "C", votes: 14, seats: 1, color: TINT.c },
  { id: "D", votes: 9, seats: 0, color: TINT.d },
  { id: "E", votes: 4, seats: 0, color: TINT.e },
] as const;
export const EXAMPLE_SEATS = 6;

/**
 * Assembly election of 18 May 2025 (seats), roughly left to right as the parties sit. Colours close
 * to Portuguese election-night graphics. `reject`: how each party voted on the PCP's motion to
 * reject the government's programme (18 June 2025): yes, abstained or no.
 */
export const RESULT_2025 = [
  { key: "BE", name: "Left Bloc", seats: 1, color: "#8E1B3A", reject: "yes" },
  { key: "CDU", name: "CDU (PCP)", seats: 3, color: "#D7262E", reject: "yes" },
  { key: "LIVRE", name: "Livre", seats: 6, color: "#7CB342", reject: "yes" },
  { key: "PAN", name: "PAN", seats: 1, color: "#13A89E", reject: "abstain" },
  { key: "PS", name: "Socialists (PS)", seats: 58, color: "#EC5BA5", reject: "no" },
  { key: "JPP", name: "JPP", seats: 1, color: "#A57FD0", reject: "no" },
  { key: "AD", name: "Democratic Alliance (AD)", seats: 91, color: "#F28C28", reject: "no" },
  { key: "IL", name: "Liberal Initiative", seats: 9, color: "#2DB3E6", reject: "no" },
  { key: "CH", name: "Chega", seats: 60, color: "#1F2A5C", reject: "no" },
] as const;
export type PartyKey = (typeof RESULT_2025)[number]["key"];
export const party = (key: PartyKey) => RESULT_2025.find((p) => p.key === key)!;
export const FIRST = party("AD");
/** Votes for the motion to reject the programme: 10, far from the 116 needed. */
export const REJECT_YES = RESULT_2025.filter((p) => p.reject === "yes").reduce((n, p) => n + p.seats, 0);

/**
 * Where the half-circle (AssemblyLayer) sits in each scene: centre of its base line, scale and
 * opacity. Scenes use these to place labels next to it.
 */
export const POSE = {
  parliament: { cx: 540, cy: 680, s: 0.8, o: 1 },
  result: { cx: 540, cy: 720, s: 0.88, o: 1 },
  gov: { cx: 540, cy: 640, s: 0.62, o: 1 },
} as const;
/** Rows, radii and seat size of the half-circle at scale 1. */
export const ROWS = 7;
export const R_IN = 170;
export const R_OUT = 420;
export const DOT = 12;
