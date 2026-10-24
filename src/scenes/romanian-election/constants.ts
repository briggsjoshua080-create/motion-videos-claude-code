import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/romanian-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * RomanianElection ("How Romania votes."): colours, fonts, layout, data and timing. The look is the
 * Swedish video's (the user's Belgian reference: broadcast frame, numbered sections, huge glowing
 * headlines), in the Romanian flag's blue, yellow and red. Every visual cue is looked up from the
 * voice-over timing (src/voiceover/romanian-election.timing.json), never hard-coded.
 * Facts and sources: briefs/romanian-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's blue, yellow and red, the deep blues of the background, and the light "paper" scenes. */
export const RO = {
  blue: "#002B7F",
  blueLight: "#0B3FA6",
  blueDeep: "#001C5C",
  blueNight: "#00123D",
  yellow: "#FCD116",
  yellowSoft: "#FFE36B",
  red: "#CE1126",
  white: "#FFFFFF",
  text: "#F4F7FD",
  textSoft: "rgba(236,241,252,0.8)",
  textFaint: "rgba(236,241,252,0.46)",
  line: "rgba(255,255,255,0.22)",
  glass: "rgba(0,14,48,0.46)",
  glassEdge: "rgba(255,255,255,0.16)",
  /** Dark text on yellow and on paper. */
  ink: "#0B1838",
  inkSoft: "#4A5672",
  inkFaint: "rgba(11,24,56,0.38)",
  paper: "#F4F0E6",
  paperDeep: "#E4DCCB",
  card: "#FFFFFF",
  /** The ballot booklet's paper. */
  cream: "#FBF8F1",
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

export type SceneId = "title" | "who" | "ballot" | "seats" | "parliament" | "pm" | "president" | "result" | "now" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "seats", "parliament", "pm", "president", "result", "now", "question"];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const ROMANIAN_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence; the title after "hook"). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : ROMANIAN_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** The numbered sections of the broadcast frame ("03 — THE BALLOT"); the 2026 scene belongs to 08. */
export const SECTIONS: { n: string; label: string; scene: SceneId }[] = [
  { n: "01", label: "HOW ROMANIA VOTES", scene: "title" },
  { n: "02", label: "WHO CAN VOTE", scene: "who" },
  { n: "03", label: "THE BALLOT", scene: "ballot" },
  { n: "04", label: "THE SEATS", scene: "seats" },
  { n: "05", label: "PARLIAMENT", scene: "parliament" },
  { n: "06", label: "PRIME MINISTER", scene: "pm" },
  { n: "07", label: "THE PRESIDENT", scene: "president" },
  { n: "08", label: "THE RESULT", scene: "result" },
  { n: "09", label: "YOUR VERDICT", scene: "question" },
];

/** Scenes on light paper instead of blue. */
export const LIGHT_SCENES: SceneId[] = ["ballot", "result"];
/** Frames a background wipe takes. */
export const WIPE = 14;

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "who").start;

/** Parliament elected on 1 Dec 2024: 331 deputies + 134 senators; a government needs 233 of the 465 in a joint sitting. */
export const DEPUTIES = 331;
export const SENATORS = 134;
export const JOINT = DEPUTIES + SENATORS;
export const INVESTITURE = 233;
export const THRESHOLD = 5;
/** 41 counties + Bucharest + Romanians abroad. */
export const CONSTITUENCIES = 43;

/** Half-circle layouts (rows, inner and outer radius, dot size; px at scale 1). */
export const CHAMBER_LAYOUT = { rows: 9, rIn: 150, rOut: 330, dot: 7.4 } as const;
export const SENATE_LAYOUT = { rows: 5, rIn: 80, rOut: 170, dot: 7.4 } as const;

/** Made-up vote shares for the threshold example (no real parties). */
export const SHARES = [
  { party: "PARTY A", share: 31 },
  { party: "PARTY B", share: 24 },
  { party: "PARTY C", share: 17 },
  { party: "PARTY D", share: 9 },
  { party: "PARTY E", share: 4 },
  { party: "PARTY F", share: 3 },
] as const;

/** Made-up party lists on the ballot booklet's page (placeholders, no real parties or people). */
export const BALLOT_PARTIES = ["PARTY A", "PARTY B", "PARTY C", "PARTY D"] as const;
/** The box that gets the VOTAT stamp. */
export const STAMPED = 1;

/**
 * Chamber of Deputies, election of 1 Dec 2024 (Permanent Electoral Authority, final results), in
 * hemicycle order from left to right. Colours are close to the parties' own.
 */
export const RESULT_2024 = [
  { key: "PSD", name: "Social Democrats", seats: 86, color: "#E2231A", share: "22.0%" },
  { key: "MIN", name: "Minorities", seats: 19, color: "#9AA3AD", share: "" },
  { key: "USR", name: "USR", seats: 40, color: "#00A3E0", share: "12.4%" },
  { key: "UDMR", name: "UDMR", seats: 22, color: "#2E8540", share: "6.3%" },
  { key: "PNL", name: "National Liberals", seats: 49, color: "#F2C300", share: "13.2%" },
  { key: "POT", name: "POT", seats: 24, color: "#7B3F99", share: "6.5%" },
  { key: "SOS", name: "SOS Romania", seats: 28, color: "#1C2F6B", share: "7.4%" },
  { key: "AUR", name: "AUR", seats: 63, color: "#A8761C", share: "18.0%" },
] as const;

/** The presidential election: cancelled in 2024, rerun in 2025 (Constitutional Court, AEP). */
export const PRESIDENCY = {
  firstRound: "24 NOV 2024",
  annulled: "6 DEC 2024",
  rerun: "18 MAY 2025",
  winner: "Nicușor Dan",
  share: "53.6%",
  term: 5,
} as const;

/** The 2026 government crisis (checked 24 Oct 2026; see the brief). */
export const CRISIS = {
  ousted: { name: "Ilie Bolojan", party: "National Liberals", date: "5 MAY 2026", dateText: "5 May 2026", votes: 281 },
  failedPicks: 3,
  pm: { name: "Luca Niculescu", note: "Independent, ex-diplomat", date: "20 OCT 2026", yes: 280, no: 58 },
  asOf: "24 OCT 2026",
} as const;
