import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/swedish-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * SwedishElection ("How Sweden votes."): colours, fonts, layout, data and timing. The look follows
 * the user's Belgian reference video (broadcast frame, numbered sections, huge glowing headlines),
 * in Sweden's flag colours. Every visual cue is looked up from the voice-over timing
 * (src/voiceover/swedish-election.timing.json), never hard-coded, so re-generating the voice keeps
 * animation, subtitles and sound effects in sync. Facts and sources: briefs/swedish-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** Sweden's flag (blue field, yellow cross), the shades the look needs, and the light "paper" scenes. */
export const SE = {
  blue: "#006AA7",
  blueDeep: "#004C7E",
  blueNight: "#00335A",
  blueBright: "#3D9FE0",
  yellow: "#FECC02",
  yellowSoft: "#FFE16A",
  yellowDeep: "#9A7600",
  white: "#FFFFFF",
  text: "#F4F8FC",
  textSoft: "rgba(236,244,251,0.78)",
  textFaint: "rgba(236,244,251,0.45)",
  line: "rgba(255,255,255,0.22)",
  glass: "rgba(0,36,64,0.46)",
  glassEdge: "rgba(255,255,255,0.16)",
  /** Dark text on yellow and on paper. */
  ink: "#0A2238",
  inkSoft: "#4A5D70",
  inkFaint: "rgba(10,34,56,0.38)",
  paper: "#F3EFE6",
  paperDeep: "#E3DCCD",
  card: "#FFFFFF",
  /** Envelope and the white (municipal) ballot paper. */
  cream: "#FBF8F1",
  /** The blue (regional) ballot paper. */
  paperBlue: "#BFDDF2",
} as const;

/** Archivo Black headlines, Instrument Serif italics, JetBrains Mono labels, Inter body text (loaded in fonts.ts). */
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

export type SceneId = "title" | "who" | "ballot" | "riksdag" | "pm" | "king" | "result" | "now" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "riksdag", "pm", "king", "result", "now", "question"];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const SWEDISH_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : SWEDISH_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** The numbered sections of the broadcast frame ("03 — THE BALLOT"); the 2026 note belongs to 07. */
export const SECTIONS: { n: string; label: string; scene: SceneId }[] = [
  { n: "01", label: "HOW SWEDEN VOTES", scene: "title" },
  { n: "02", label: "WHO CAN VOTE", scene: "who" },
  { n: "03", label: "THE BALLOT", scene: "ballot" },
  { n: "04", label: "THE RIKSDAG", scene: "riksdag" },
  { n: "05", label: "THE PRIME MINISTER", scene: "pm" },
  { n: "06", label: "THE KING", scene: "king" },
  { n: "07", label: "THE RESULT", scene: "result" },
  { n: "08", label: "YOUR VERDICT", scene: "question" },
];

/** Scenes on light paper instead of Swedish blue (the Belgian video's ballot scene is light too). */
export const LIGHT_SCENES: SceneId[] = ["ballot", "result"];
/** Frames a background wipe takes. */
export const WIPE = 14;

/**
 * The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on
 * (scripts/music.py); the frame's BPM dots blink with it.
 */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "who").start;

/** The Riksdag: 349 seats in one chamber; 175 is a majority, and 175 "no" votes stop a prime minister. */
export const TOTAL = 349;
export const MAJORITY = 175;
export const FIXED_SEATS = 310;
export const TOP_UP = 39;
export const CONSTITUENCIES = 29;
export const THRESHOLD = 4;

/** Half-circle rows, radii and seat size (px at scale 1). */
export const ROWS = 9;
export const R_IN = 190;
export const R_OUT = 400;
export const DOT = 8.6;

/** Seats lit as the 39 top-up seats: spread evenly over the chamber. */
export const TOP_UP_SEATS = new Set(Array.from({ length: TOP_UP }, (_, k) => Math.round(((k + 0.5) * TOTAL) / TOP_UP)));

/**
 * Riksdag election of 11 Sept 2022 (seats), left to right as the parties sit. Colours are the
 * parties' own. `right`: the four parties behind Ulf Kristersson (176 seats).
 */
export const RESULT_2022 = [
  { key: "V", name: "Left Party", seats: 24, color: "#AF0000", right: false },
  { key: "S", name: "Social Democrats", seats: 107, color: "#E8112D", right: false },
  { key: "MP", name: "Green Party", seats: 18, color: "#83CF39", right: false },
  { key: "C", name: "Centre Party", seats: 24, color: "#009933", right: false },
  { key: "L", name: "Liberals", seats: 16, color: "#006AB3", right: true },
  { key: "KD", name: "Christian Democrats", seats: 19, color: "#231977", right: true },
  { key: "M", name: "Moderates", seats: 68, color: "#52BDEC", right: true },
  { key: "SD", name: "Sweden Democrats", seats: 73, color: "#DDCC00", right: true },
] as const;
export const RIGHT_SEATS = RESULT_2022.filter((p) => p.right).reduce((n, p) => n + p.seats, 0);
export const OTHER_SEATS = TOTAL - RIGHT_SEATS;

/** Ulf Kristersson's vote, 17 Oct 2022 (approved). */
export const PM_2022 = { name: "Ulf Kristersson", party: "Moderates", date: "17 Oct 2022", yes: 176, no: 173 } as const;

/** The Speaker's first proposal after the 13 Sept 2026 election (rejected). Will go stale: see the brief. */
export const PM_2026 = { name: "Magdalena Andersson", party: "Social Democrats", date: "15 Oct 2026", yes: 99, no: 248, asOf: "23 OCT 2026" } as const;

/**
 * The made-up ballot papers in the rack (one per party, yellow = Riksdag) and the candidates on the
 * one the voter picks. Party names are placeholders on purpose: no real party is shown voting.
 */
export const RACK = ["PARTY A", "PARTY B", "PARTY C"] as const;
export const PICKED = 1;
export const CANDIDATES = ["Candidate B1", "Candidate B2", "Candidate B3", "Candidate B4", "Candidate B5"] as const;
/** The candidate who gets the personal vote (index in CANDIDATES). */
export const MARKED = 2;
