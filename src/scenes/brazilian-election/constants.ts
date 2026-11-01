import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/brazilian-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * BrazilianElection ("How Brazil votes."): colours, fonts, layout, data and timing. The look is the
 * Swedish video's (the user's Belgian reference: broadcast frame, numbered sections, huge glowing
 * headlines), in the Brazilian flag's green, yellow, blue and white. Every visual cue is looked up
 * from the voice-over timing (src/voiceover/brazilian-election.timing.json), never hard-coded.
 * Facts and sources: briefs/brazilian-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's green field, yellow rhombus, blue globe and white band, and the light "paper" scenes. */
export const BR = {
  /** The flag's yellow, for accent blocks, wipe bands and the subtitle pill. */
  yellow: "#FFDF00",
  yellowDeep: "#E8C400",
  /** The flag's blue (the globe), for text on yellow and accents on paper. */
  blue: "#002776",
  blueLight: "#1C4BA8",
  /** The background: the flag's green, darker towards the edges. */
  bg: "#00733A",
  bgLight: "#0A8F49",
  bgDeep: "#00532A",
  bgNight: "#00351B",
  /** The flag's green, for accents on paper. */
  green: "#009C3B",
  greenDeep: "#007A2E",
  /** The voting machine's CONFIRMA key. */
  confirm: "#1FA344",
  /** Kept for the shared ui.tsx (the Mexican copy used red); in Brazil it is the flag's yellow. */
  red: "#FFDF00",
  white: "#FFFFFF",
  text: "#F3FBF6",
  textSoft: "rgba(236,250,242,0.8)",
  textFaint: "rgba(236,250,242,0.48)",
  line: "rgba(255,255,255,0.24)",
  glass: "rgba(0,30,14,0.38)",
  glassEdge: "rgba(255,255,255,0.18)",
  /** Dark text on paper. */
  ink: "#0E1A24",
  inkSoft: "#4A5864",
  inkFaint: "rgba(14,26,36,0.38)",
  paper: "#F4F1E8",
  paperDeep: "#E3DCCD",
  card: "#FFFFFF",
  cream: "#FBF9F4",
  /** The voting machine's casing. */
  machine: "#2B2F33",
  machineDeep: "#1A1D20",
} as const;

/** Archivo Black headlines, Instrument Serif italics, JetBrains Mono labels, Inter body text (loaded in the Swedish fonts.ts). */
export const FONT = {
  display: "'Archivo Black', 'Inter Variable', sans-serif",
  serif: "'Instrument Serif', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
  body: theme.font,
} as const;

/** Each scene starts this many frames before its first sentence, so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the closing question stays up after the final word. */
const TAIL = 1.2;

export type SceneId = "title" | "who" | "ballot" | "seats" | "congress" | "president" | "result" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "seats", "congress", "president", "result", "question"];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const BRAZILIAN_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence; the title after "hook"). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : BRAZILIAN_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const BR_SUBTITLES = ["question"];

/** The numbered sections of the broadcast frame ("03 — THE BALLOT"). */
export const SECTIONS: { n: string; label: string; scene: SceneId }[] = [
  { n: "01", label: "HOW BRAZIL VOTES", scene: "title" },
  { n: "02", label: "WHO CAN VOTE", scene: "who" },
  { n: "03", label: "THE BALLOT", scene: "ballot" },
  { n: "04", label: "THE SEATS", scene: "seats" },
  { n: "05", label: "THE CONGRESS", scene: "congress" },
  { n: "06", label: "THE PRESIDENT", scene: "president" },
  { n: "07", label: "THE RESULT", scene: "result" },
  { n: "08", label: "YOUR VERDICT", scene: "question" },
];

/** Scenes on light paper instead of green. */
export const LIGHT_SCENES: SceneId[] = ["ballot", "result"];
/** Frames a background wipe takes. */
export const WIPE = 14;

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "who").start;

/** Not voting without an excuse: a fine of up to R$3.51 per round; unpaid, it blocks a passport (TSE). */
export const FINE = "R$3.51";

/** Voters in 2026 (TSE): 158.7 million at home and abroad, 918,876 of them abroad (president only). */
export const ELECTORATE = { total: "158.7M", abroad: "918,876" } as const;

/** The six votes on the machine in 2026, in order, with the number of digits typed (TSE). */
export const SIX_VOTES = [
  { office: "FEDERAL DEPUTY", digits: 4 },
  { office: "STATE DEPUTY", digits: 5 },
  { office: "SENATOR 1", digits: 3 },
  { office: "SENATOR 2", digits: 3 },
  { office: "GOVERNOR", digits: 2 },
  { office: "PRESIDENT", digits: 2 },
] as const;
/** The made-up number typed on the machine (a federal deputy: four digits, the first two are the party's). */
export const TYPED = "7712";

/**
 * A made-up party list in one state (open list): the party wins 3 seats from its pooled votes; the
 * star brings in most of them, so two candidates with few votes of their own get in too.
 */
export const PARTY_LIST = [
  { name: "THE STAR", votes: 1300, elected: true },
  { name: "CANDIDATE B", votes: 90, elected: true },
  { name: "CANDIDATE C", votes: 70, elected: true },
  { name: "CANDIDATE D", votes: 40, elected: false },
] as const;
export const LIST_SEATS_WON = 3;

/** The Chamber of Deputies: 513, shared among the 26 states and the Federal District (8 to 70 each), four years. */
export const CHAMBER = 513;
export const STATE_MIN = 8;
export const STATE_MAX = 70;
/** The Senate: 81 = 3 for each of the 27 units, eight-year terms, two thirds renewed in 2026 (54 seats). */
export const SENATE = 81;
export const UNITS = 27;
export const SENATE_UP_2026 = 54;

/** The president: four years, one immediate re-election, a run-off if nobody has more than half of the valid votes. */
export const TERM_YEARS = 4;

/** Presidential election 2026 (TSE, % of valid votes). */
export const ROUND_1 = [
  { name: "F. BOLSONARO", share: 47.03, color: "#1F4E9C" },
  { name: "LULA", share: 45.16, color: "#C8102E" },
] as const;
export const RUN_OFF = [
  { name: "LULA", share: 51.79, color: "#C8102E" },
  { name: "F. BOLSONARO", share: 48.21, color: "#1F4E9C" },
] as const;
export const DATES = { round1: "4 OCT", runOff: "25 OCT 2026" } as const;

/**
 * Chamber of Deputies 2027–2031 as elected on 4 Oct 2026, in hemicycle order (left to right). The
 * PT federation (PT, PCdoB, PV) and Bolsonaro's PL are highlighted; everyone else in one grey block.
 */
export const RESULT_2026 = [
  { key: "PT", name: "Lula's PT & allies", seats: 88, color: "#C8102E", party: false },
  { key: "OTH", name: "Others", seats: 304, color: "#9A9A9A", party: false },
  { key: "PL", name: "Bolsonaro's PL", seats: 121, color: "#1F4E9C", party: true },
] as const;
/** The Senate from Feb 2027 (projection after the vote): the PL holds 28 of 81 seats. */
export const PL_SENATE = 28;

/** Who is president now (checked 1 Nov 2026; see the brief). */
export const NOW = { name: "LULA", termStarts: "5 JAN 2027", until: "2031" } as const;
