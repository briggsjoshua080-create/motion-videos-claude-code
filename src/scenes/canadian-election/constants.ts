import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import type { ExplainerPalette } from "../../components/explainer/palette";
import { hemicycleSeats } from "../../components/Hemicycle";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/canadian-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * CanadianElection ("How Canada votes."): colours, fonts, layout, data and timing. The look is the
 * Swedish video's (the user's Belgian reference: broadcast frame, numbered sections, huge glowing
 * headlines), in the Canadian flag's red and white. Every visual cue is looked up from the
 * voice-over timing (src/voiceover/canadian-election.timing.json), never hard-coded.
 * Facts and sources: briefs/canadian-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's red and white, the deep reds of the background, and the light "paper" scenes. */
export const CA = {
  /** The flag's red, for fills, accents on paper and the wipe bands. */
  red: "#D52B1E",
  /** The background: a deep Canadian red, darker towards the edges. */
  bg: "#9E1119",
  bgLight: "#BD1A22",
  bgDeep: "#740A11",
  bgNight: "#52060B",
  white: "#FFFFFF",
  /** Soft rose for small accents on red (marks, labels) where pure white would be too loud. */
  rose: "#FFD3CE",
  text: "#FFF6F5",
  textSoft: "rgba(255,240,238,0.8)",
  textFaint: "rgba(255,240,238,0.48)",
  line: "rgba(255,255,255,0.24)",
  glass: "rgba(52,4,9,0.38)",
  glassEdge: "rgba(255,255,255,0.18)",
  /** Dark text on paper. */
  ink: "#2A0D10",
  inkSoft: "#6A4A4C",
  inkFaint: "rgba(42,13,16,0.36)",
  paper: "#F5F0EA",
  paperDeep: "#E6DCD2",
  card: "#FFFFFF",
} as const;

/** The parties' own colours, used only for the 2025 result (on paper). */
export const PARTY = {
  LPC: { name: "Liberal", short: "LIB", color: "#D71920" },
  CPC: { name: "Conservative", short: "CON", color: "#1A4E8C" },
  BQ: { name: "Bloc Québécois", short: "BLOC", color: "#2BA3C8" },
  NDP: { name: "NDP", short: "NDP", color: "#F28A1B" },
  GPC: { name: "Green", short: "GREEN", color: "#3D9B35" },
} as const;
export type PartyId = keyof typeof PARTY;

/** Archivo Black headlines, Instrument Serif italics, JetBrains Mono labels, Inter body text. */
export const FONT = {
  display: "'Archivo Black', 'Inter Variable', sans-serif",
  serif: "'Instrument Serif', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
  body: theme.font,
} as const;

/** Colours for the flat cartoon characters (King and Governor General) in the Crown scene. */
export const CHARACTER_PALETTE: ExplainerPalette = {
  paper: CA.paper,
  paperDeep: CA.paperDeep,
  card: CA.card,
  ink: CA.ink,
  inkSoft: CA.inkSoft,
  muted: "#B8A9A6",
  line: "#E2D6CF",
  accent: CA.red,
  accentDeep: "#A5161B",
  alert: CA.red,
  flag: [CA.red, CA.white, CA.red],
  flagVertical: true,
  glows: ["rgba(213,43,30,0.12)", "rgba(213,43,30,0.08)"],
  skin: "#F2C9A5",
  skinShade: "#DFAE88",
  white: CA.white,
};

/** Each scene starts this many frames before its first sentence, so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the closing question stays up after the final word. */
const TAIL = 1.2;

export type SceneId = "title" | "who" | "ballot" | "riding" | "commons" | "pm" | "senate" | "crown" | "result" | "twist" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "riding", "commons", "pm", "senate", "crown", "result", "twist", "question"];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const CANADIAN_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence; the title after "hook"). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : CANADIAN_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** The numbered sections of the broadcast frame ("03 — THE BALLOT"); the 2026 twist belongs to 09. */
export const SECTIONS: { n: string; label: string; scene: SceneId }[] = [
  { n: "01", label: "HOW CANADA VOTES", scene: "title" },
  { n: "02", label: "WHO CAN VOTE", scene: "who" },
  { n: "03", label: "THE BALLOT", scene: "ballot" },
  { n: "04", label: "THE COUNT", scene: "riding" },
  { n: "05", label: "HOUSE OF COMMONS", scene: "commons" },
  { n: "06", label: "PRIME MINISTER", scene: "pm" },
  { n: "07", label: "THE SENATE", scene: "senate" },
  { n: "08", label: "THE CROWN", scene: "crown" },
  { n: "09", label: "THE RESULT", scene: "result" },
  { n: "10", label: "YOUR VERDICT", scene: "question" },
];

/** Scenes on light paper instead of red. */
export const LIGHT_SCENES: SceneId[] = ["ballot", "result"];
/** Frames a background wipe takes. */
export const WIPE = 14;

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "who").start;

/** The House of Commons: one MP per riding (2023 representation order), 172 = majority. */
export const COMMONS = { seats: 343, majority: 172 } as const;
/**
 * The one House of Commons half-circle that carries through the Commons, prime minister, result
 * and twist scenes, always in the same place (seats ordered left to right).
 */
export const COMMONS_SEATS = hemicycleSeats(COMMONS.seats, 11, 150, 330);
export const HEMI = { cx: 540, cy: 1170, dot: 7 } as const;
/** The Senate: 105 appointed senators, until age 75. */
export const SENATE = { seats: 105, retire: 75 } as const;

/** The made-up riding result for the first-past-the-post example (placeholders, no real people). */
export const RIDING = [
  { name: "Candidate A", party: "Party A", share: 38 },
  { name: "Candidate B", party: "Party B", share: 34 },
  { name: "Candidate C", party: "Party C", share: 28 },
] as const;

/** 45th general election, 28 April 2025 (Elections Canada, official results). Seats in hemicycle order, left to right (Liberals first, so the gap to 172 shows). */
export const RESULT_2025 = {
  date: "28 APR 2025",
  seats: [
    { party: "LPC", seats: 169 },
    { party: "NDP", seats: 7 },
    { party: "GPC", seats: 1 },
    { party: "BQ", seats: 22 },
    { party: "CPC", seats: 144 },
  ] as { party: PartyId; seats: number }[],
  pm: { name: "Mark Carney", party: "LPC" as PartyId, votes: "43.7%" },
  opposition: { name: "Pierre Poilievre", party: "CPC" as PartyId, votes: "41.3%" },
  turnout: "69%",
} as const;

/** How the Liberals reached a majority without a general election (CBC, Globe and Mail; see the brief). */
export const TWIST = {
  switched: 5,
  switchedFrom: "4 CONSERVATIVE · 1 NDP",
  before: 171,
  byElections: 3,
  byElectionDate: "13 APR 2026",
  after: 174,
  nextElection: "15 OCT 2029",
} as const;
