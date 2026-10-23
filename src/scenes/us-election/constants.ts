import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/us-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * USElection ("How the US votes."): colours, fonts, layout, data and timing. The look is the
 * Swedish video's (the user's Belgian reference: broadcast frame, numbered sections, huge glowing
 * headlines), in the US flag's colours. Every visual cue is looked up from the voice-over timing
 * (src/voiceover/us-election.timing.json), never hard-coded. Facts and sources: briefs/us-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's Old Glory blue and red, the shades the look needs, and the light "paper" scenes. */
export const US = {
  navy: "#0A3161",
  navyDeep: "#06234A",
  navyNight: "#041A38",
  red: "#B31942",
  /** Red bright enough to read as text and glow on navy. */
  redBright: "#F0475E",
  white: "#FFFFFF",
  text: "#F3F6FB",
  textSoft: "rgba(232,239,250,0.78)",
  textFaint: "rgba(232,239,250,0.45)",
  line: "rgba(255,255,255,0.22)",
  glass: "rgba(2,16,40,0.48)",
  glassEdge: "rgba(255,255,255,0.16)",
  /** Dark text on paper. */
  ink: "#0B1E3A",
  inkSoft: "#4A5A72",
  inkFaint: "rgba(11,30,58,0.38)",
  paper: "#F3EFE6",
  paperDeep: "#E3DCCD",
  card: "#FFFFFF",
} as const;

/** The parties' own colours, used only for the 2024 result (on paper). */
export const PARTY = { R: "#D22B3A", D: "#2563C4" } as const;

/** Archivo Black headlines, Instrument Serif italics, JetBrains Mono labels, Inter body text. */
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

export type SceneId = "title" | "who" | "ballot" | "congress" | "electors" | "president" | "result" | "now" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "congress", "electors", "president", "result", "now", "question"];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const US_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : US_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** The numbered sections of the broadcast frame ("03 — THE BALLOT"); the 2026 note belongs to 07. */
export const SECTIONS: { n: string; label: string; scene: SceneId }[] = [
  { n: "01", label: "HOW THE US VOTES", scene: "title" },
  { n: "02", label: "WHO CAN VOTE", scene: "who" },
  { n: "03", label: "THE BALLOT", scene: "ballot" },
  { n: "04", label: "CONGRESS", scene: "congress" },
  { n: "05", label: "ELECTORAL COLLEGE", scene: "electors" },
  { n: "06", label: "THE PRESIDENT", scene: "president" },
  { n: "07", label: "THE RESULT", scene: "result" },
  { n: "08", label: "YOUR VERDICT", scene: "question" },
];

/** Scenes on light paper instead of navy. */
export const LIGHT_SCENES: SceneId[] = ["ballot", "result"];
/** Frames a background wipe takes. */
export const WIPE = 14;

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "who").start;

/** Congress: 435 House seats (218 = majority), 100 senators (two per state). */
export const HOUSE = { seats: 435, majority: 218, term: 2 } as const;
export const SENATE = { seats: 100, perState: 2, term: 6 } as const;

/** The Electoral College: 538 electors, 270 to win. */
export const ELECTORS = 538;
export const TO_WIN = 270;

/**
 * Every state (and DC) on an 11 × 8 tile grid, with its electoral votes for 2024 and 2028
 * (2020 census) and who won it in 2024. Maine and Nebraska split theirs: `split` gives the
 * electors that went to the other side.
 */
export type StateTile = { id: string; name: string; col: number; row: number; ev: number; won: "R" | "D"; split?: number };
export const STATES: StateTile[] = [
  { id: "AK", name: "Alaska", col: 0, row: 0, ev: 3, won: "R" },
  { id: "ME", name: "Maine", col: 10, row: 0, ev: 4, won: "D", split: 1 },
  { id: "VT", name: "Vermont", col: 9, row: 1, ev: 3, won: "D" },
  { id: "NH", name: "New Hampshire", col: 10, row: 1, ev: 4, won: "D" },
  { id: "WA", name: "Washington", col: 0, row: 2, ev: 12, won: "D" },
  { id: "ID", name: "Idaho", col: 1, row: 2, ev: 4, won: "R" },
  { id: "MT", name: "Montana", col: 2, row: 2, ev: 4, won: "R" },
  { id: "ND", name: "North Dakota", col: 3, row: 2, ev: 3, won: "R" },
  { id: "MN", name: "Minnesota", col: 4, row: 2, ev: 10, won: "D" },
  { id: "IL", name: "Illinois", col: 5, row: 2, ev: 19, won: "D" },
  { id: "WI", name: "Wisconsin", col: 6, row: 2, ev: 10, won: "R" },
  { id: "MI", name: "Michigan", col: 7, row: 2, ev: 15, won: "R" },
  { id: "NY", name: "New York", col: 8, row: 2, ev: 28, won: "D" },
  { id: "RI", name: "Rhode Island", col: 9, row: 2, ev: 4, won: "D" },
  { id: "MA", name: "Massachusetts", col: 10, row: 2, ev: 11, won: "D" },
  { id: "OR", name: "Oregon", col: 0, row: 3, ev: 8, won: "D" },
  { id: "NV", name: "Nevada", col: 1, row: 3, ev: 6, won: "R" },
  { id: "WY", name: "Wyoming", col: 2, row: 3, ev: 3, won: "R" },
  { id: "SD", name: "South Dakota", col: 3, row: 3, ev: 3, won: "R" },
  { id: "IA", name: "Iowa", col: 4, row: 3, ev: 6, won: "R" },
  { id: "IN", name: "Indiana", col: 5, row: 3, ev: 11, won: "R" },
  { id: "OH", name: "Ohio", col: 6, row: 3, ev: 17, won: "R" },
  { id: "PA", name: "Pennsylvania", col: 7, row: 3, ev: 19, won: "R" },
  { id: "NJ", name: "New Jersey", col: 8, row: 3, ev: 14, won: "D" },
  { id: "CT", name: "Connecticut", col: 9, row: 3, ev: 7, won: "D" },
  { id: "CA", name: "California", col: 0, row: 4, ev: 54, won: "D" },
  { id: "UT", name: "Utah", col: 1, row: 4, ev: 6, won: "R" },
  { id: "CO", name: "Colorado", col: 2, row: 4, ev: 10, won: "D" },
  { id: "NE", name: "Nebraska", col: 3, row: 4, ev: 5, won: "R", split: 1 },
  { id: "MO", name: "Missouri", col: 4, row: 4, ev: 10, won: "R" },
  { id: "KY", name: "Kentucky", col: 5, row: 4, ev: 8, won: "R" },
  { id: "WV", name: "West Virginia", col: 6, row: 4, ev: 4, won: "R" },
  { id: "VA", name: "Virginia", col: 7, row: 4, ev: 13, won: "D" },
  { id: "MD", name: "Maryland", col: 8, row: 4, ev: 10, won: "D" },
  { id: "DE", name: "Delaware", col: 9, row: 4, ev: 3, won: "D" },
  { id: "AZ", name: "Arizona", col: 1, row: 5, ev: 11, won: "R" },
  { id: "NM", name: "New Mexico", col: 2, row: 5, ev: 5, won: "D" },
  { id: "KS", name: "Kansas", col: 3, row: 5, ev: 6, won: "R" },
  { id: "AR", name: "Arkansas", col: 4, row: 5, ev: 6, won: "R" },
  { id: "TN", name: "Tennessee", col: 5, row: 5, ev: 11, won: "R" },
  { id: "NC", name: "North Carolina", col: 6, row: 5, ev: 16, won: "R" },
  { id: "SC", name: "South Carolina", col: 7, row: 5, ev: 9, won: "R" },
  { id: "DC", name: "Washington, D.C.", col: 8, row: 5, ev: 3, won: "D" },
  { id: "OK", name: "Oklahoma", col: 3, row: 6, ev: 7, won: "R" },
  { id: "LA", name: "Louisiana", col: 4, row: 6, ev: 8, won: "R" },
  { id: "MS", name: "Mississippi", col: 5, row: 6, ev: 6, won: "R" },
  { id: "AL", name: "Alabama", col: 6, row: 6, ev: 9, won: "R" },
  { id: "GA", name: "Georgia", col: 7, row: 6, ev: 16, won: "R" },
  { id: "HI", name: "Hawaii", col: 0, row: 7, ev: 4, won: "D" },
  { id: "TX", name: "Texas", col: 3, row: 7, ev: 40, won: "R" },
  { id: "FL", name: "Florida", col: 8, row: 7, ev: 30, won: "R" },
];
export const GRID = { cols: 11, rows: 8 } as const;

/** Electoral votes per side in 2024, counted from the tiles (312 and 226). */
const evFor = (side: "R" | "D") =>
  STATES.reduce((n, s) => n + (s.won === side ? s.ev - (s.split ?? 0) : s.split ?? 0), 0);
export const EV_2024 = { R: evFor("R"), D: evFor("D") } as const;

/** The state the winner-takes-all example uses. */
export const EXAMPLE_STATE = "PA";

/** 2024: election of 5 Nov 2024 (FEC, National Archives); Congress as elected. */
export const RESULT_2024 = {
  date: "5 NOV 2024",
  R: { name: "Donald Trump", party: "Republican", popular: "49.8%" },
  D: { name: "Kamala Harris", party: "Democrat", popular: "48.3%" },
  tookOffice: "20 JAN 2025",
  house: { R: 220, D: 215 },
  senate: { R: 53, D: 47 },
} as const;

/** The 2026 midterms. Will go stale after 3 Nov 2026: see the brief. */
export const MIDTERMS = { date: "3 NOV 2026", house: 435, senate: 35, asOf: "23 OCT 2026" } as const;
