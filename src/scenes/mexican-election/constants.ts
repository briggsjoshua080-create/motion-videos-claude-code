import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/mexican-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * MexicanElection ("How Mexico votes."): colours, fonts, layout, data and timing. The look is the
 * Swedish video's (the user's Belgian reference: broadcast frame, numbered sections, huge glowing
 * headlines), in the Mexican flag's green, white and red. Every visual cue is looked up from the
 * voice-over timing (src/voiceover/mexican-election.timing.json), never hard-coded.
 * Facts and sources: briefs/mexican-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's green, white and red, the eagle's brown and the cactus green of the coat of arms, and the light "paper" scenes. */
export const MX = {
  /** The flag's red, for accent blocks, wipe bands and the subtitle pill. */
  red: "#CE1126",
  redDeep: "#A50D1E",
  /** The background: the flag's green, darker towards the edges. */
  bg: "#00573C",
  bgLight: "#0B7350",
  bgDeep: "#003D2A",
  bgNight: "#00271B",
  /** The flag's green, for accents on paper. */
  green: "#006847",
  /** The coat of arms: the eagle's brown and the cactus green (small accents only). */
  brown: "#8A5A2B",
  cactus: "#5E9A3A",
  gold: "#E8B33B",
  white: "#FFFFFF",
  text: "#F3FBF7",
  textSoft: "rgba(236,250,243,0.8)",
  textFaint: "rgba(236,250,243,0.48)",
  line: "rgba(255,255,255,0.24)",
  glass: "rgba(0,26,17,0.38)",
  glassEdge: "rgba(255,255,255,0.18)",
  /** Dark text on paper. */
  ink: "#0E1F18",
  inkSoft: "#4A5C53",
  inkFaint: "rgba(14,31,24,0.38)",
  paper: "#F4F0E9",
  paperDeep: "#E4DCD0",
  card: "#FFFFFF",
  /** The ballot paper. */
  cream: "#FBF9F4",
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
export const MEXICAN_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence; the title after "hook"). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : MEXICAN_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const MX_SUBTITLES = ["question"];

/** The numbered sections of the broadcast frame ("03 — THE BALLOT"). */
export const SECTIONS: { n: string; label: string; scene: SceneId }[] = [
  { n: "01", label: "HOW MEXICO VOTES", scene: "title" },
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

/** One six-year term (the sexenio), never again (Constitution art. 83). */
export const TERM = { years: 6, from: 2024, to: 2030 } as const;

/** The Chamber of Deputies: 300 won in single-member districts, 200 shared by votes in 5 regions (3% threshold). */
export const CHAMBER = 500;
export const DISTRICT_SEATS = 300;
export const LIST_SEATS = 200;
export const THRESHOLD = 3;
/** No party may hold more seats than its vote share + 8 points, and never more than 300 (art. 54). */
export const OVER_CAP = 8;
export const MAX_SEATS = 300;
/** The Senate: 128 = 3 per state (32 × 3) + 32 from national party lists, six years. */
export const SENATE = 128;
export const STATES = 32;

/** Made-up ballot (no real parties or people): six party logos in a grid, B and C in one alliance. */
export const BALLOT_PARTIES = [
  { key: "A", color: "#2E6FD8", shape: "circle" },
  { key: "B", color: "#8E1B3A", shape: "star" },
  { key: "C", color: "#2E9E4F", shape: "leaf" },
  { key: "D", color: "#E07B1A", shape: "square" },
  { key: "E", color: "#D9302C", shape: "triangle" },
  { key: "F", color: "#6E4FB8", shape: "diamond" },
] as const;
/** The first mark, and the alliance partner that may be marked as well. */
export const PICKED = 1;
export const ALLY = 2;

/** Voters abroad in 2024 (INE): 184,326 votes cast, most of them online. */
export const ABROAD = { votes: "184,326", online: "122,497" } as const;

/** Presidential election of 2 Jun 2024 (INE count, % of votes cast). */
export const PRESIDENT_2024 = [
  { name: "SHEINBAUM", share: 59.8, color: "#9B1B30" },
  { name: "GÁLVEZ", share: 27.5, color: "#1F4E9C" },
  { name: "MÁYNEZ", share: 10.3, color: "#E8761C" },
] as const;
export const ELECTION_DATE = "2 JUN 2024";
export const TURNOUT = "61%";

/**
 * Chamber of Deputies 2024–2027 as first seated (Sep 2024), in hemicycle order from left to right:
 * the governing alliance, then the opposition. Colours are approximate party colours, chosen to read on paper.
 */
export const RESULT_2024 = [
  { key: "MOR", name: "Morena", seats: 257, color: "#9B1B30", alliance: true },
  { key: "PT", name: "PT", seats: 47, color: "#E0262E", alliance: true },
  { key: "PVEM", name: "Greens (PVEM)", seats: 60, color: "#4FA346", alliance: true },
  { key: "OPP", name: "PAN, PRI, MC & others", seats: 136, color: "#8C8C8C", alliance: false },
] as const;
/** The alliance's share of the votes for deputies (Morena 40.8 + PVEM 8.4 + PT 5.5) and of the seats (364 / 500). */
export const ALLIANCE = { votes: 54.7, seats: 364, seatShare: 72.8 } as const;

/** The judicial election of 1 Jun 2025: the first time judges, including the Supreme Court, were elected; about 13% turned out. */
export const JUDGES = { date: "1 JUN 2025", turnout: "13%" } as const;

/** Who is president now (checked 29 Oct 2026; see the brief). */
export const NOW = { name: "CLAUDIA SHEINBAUM", since: "1 OCT 2024", until: "2030", midterm: "6 JUN 2027" } as const;
