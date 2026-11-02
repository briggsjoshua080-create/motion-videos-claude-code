import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/argentine-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * ArgentineElection ("How Argentina votes."): colours, fonts, layout, data and timing. The look is
 * the Swedish video's (the user's Belgian reference: broadcast frame, numbered sections, huge
 * glowing headlines), in the Argentine flag's sky blue (celeste), white and the gold of the Sun of
 * May. Every visual cue is looked up from the voice-over timing
 * (src/voiceover/argentine-election.timing.json), never hard-coded.
 * Facts and sources: briefs/argentine-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's celeste and white, the Sun of May's gold, and the light "paper" scenes. */
export const AR = {
  /** The flag's celeste (sky blue), for wipe bands and accents. */
  celeste: "#74ACDF",
  celesteLight: "#A9CDEE",
  /** The Sun of May's gold, for highlights, the subtitle pill and stamps. */
  sun: "#F6B40E",
  sunDeep: "#D99A00",
  /** The sun's brown outline on the flag. */
  sunLine: "#85340A",
  /** Deep navy, for text on gold or white. */
  navy: "#0C2C52",
  /** The background: a strong, deeper celeste, darker towards the edges. */
  bg: "#2F6EAE",
  bgLight: "#4589C9",
  bgDeep: "#1D4F86",
  bgNight: "#123760",
  /** Accents on paper (a celeste dark enough to read on cream). */
  blue: "#1F5FA3",
  blueDeep: "#174A80",
  /** Kept for the shared ui.tsx (other copies used a flag red); in Argentina it is the sun's gold. */
  red: "#F6B40E",
  white: "#FFFFFF",
  text: "#F4F8FD",
  textSoft: "rgba(240,247,255,0.82)",
  textFaint: "rgba(240,247,255,0.48)",
  line: "rgba(255,255,255,0.26)",
  glass: "rgba(6,28,58,0.36)",
  glassEdge: "rgba(255,255,255,0.2)",
  /** Dark text on paper. */
  ink: "#0E1A24",
  inkSoft: "#4A5864",
  inkFaint: "rgba(14,26,36,0.38)",
  paper: "#F4F1E8",
  paperDeep: "#E3DCCD",
  card: "#FFFFFF",
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
export const ARGENTINE_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence; the title after "hook"). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : ARGENTINE_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const AR_SUBTITLES = ["question"];

/** The numbered sections of the broadcast frame ("03 — THE BALLOT"). */
export const SECTIONS: { n: string; label: string; scene: SceneId }[] = [
  { n: "01", label: "HOW ARGENTINA VOTES", scene: "title" },
  { n: "02", label: "WHO CAN VOTE", scene: "who" },
  { n: "03", label: "THE BALLOT", scene: "ballot" },
  { n: "04", label: "THE SEATS", scene: "seats" },
  { n: "05", label: "THE CONGRESS", scene: "congress" },
  { n: "06", label: "THE PRESIDENT", scene: "president" },
  { n: "07", label: "THE RESULT", scene: "result" },
  { n: "08", label: "YOUR VERDICT", scene: "question" },
];

/** Scenes on light paper instead of celeste. */
export const LIGHT_SCENES: SceneId[] = ["ballot", "result"];
/** Frames a background wipe takes. */
export const WIPE = 14;

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "who").start;

/**
 * The presidential first-round rule (Constitution art. 97–98): 45% of the valid votes for a party
 * ("votos afirmativos", blank and spoiled votes not counted) wins outright, or 40% with a lead of
 * more than 10 points over the runner-up; otherwise a run-off between the top two.
 */
export const WIN_OUTRIGHT = 45;
export const WIN_WITH_LEAD = 40;
export const LEAD_POINTS = 10;

/** The paper ballot (Boleta Única de Papel, since 2025): one row per race, one column per party. Made-up parties. */
export const BALLOT_PARTIES = [
  { name: "PARTY A", color: "#7A4FB3" },
  { name: "PARTY B", color: "#2E9AD6" },
  { name: "PARTY C", color: "#E0A21B" },
  { name: "PARTY D", color: "#D2453C" },
] as const;
export const BALLOT_ROWS = ["PRESIDENT", "SENATORS", "DEPUTIES"] as const;
/** The made-up voter ticks one box per row, in these columns. */
export const BALLOT_TICKS = [1, 0, 2] as const;

/**
 * One made-up province with 10 deputy seats up: share of the vote, and the seats each list wins
 * with the D'Hondt method among the lists above the 3% line (A 5, B 2, C 2, D 1; E is out).
 */
export const PROVINCE = [
  { name: "LIST A", share: 42, seats: 5 },
  { name: "LIST B", share: 30, seats: 2 },
  { name: "LIST C", share: 16, seats: 2 },
  { name: "LIST D", share: 9, seats: 1 },
  { name: "LIST E", share: 2.4, seats: 0 },
] as const;
export const THRESHOLD = 3;

/** The Chamber of Deputies: 257, four-year terms, half renewed every two years (127 in 2025, 130 in 2027). */
export const CHAMBER = 257;
export const MAJORITY = 129;
export const UP_2025 = 127;
export const UP_2027 = 130;
/** The Senate: 72 = 3 for each of the 23 provinces and the city of Buenos Aires; six years, a third every two years. */
export const SENATE = 72;
export const DISTRICTS = 24;

/** The president: four years, one re-election in a row. */
export const TERM_YEARS = 4;

/** Presidential election 2023 (final count, Justicia Nacional Electoral; % of votes for a candidate). */
export const ROUND_1 = [
  { name: "MASSA", share: 36.78, color: "#2E9AD6" },
  { name: "MILEI", share: 29.99, color: "#7A4FB3" },
  { name: "BULLRICH", share: 23.81, color: "#E0A21B" },
] as const;
export const RUN_OFF = [
  { name: "MILEI", share: 55.65, color: "#7A4FB3" },
  { name: "MASSA", share: 44.35, color: "#2E9AD6" },
] as const;
export const DATES = { round1: "22 OCT 2023", runOff: "19 NOV 2023", midterms: "26 OCT 2025" } as const;

/** Midterms of 26 Oct 2025: La Libertad Avanza first with 40.84% of the national deputy vote (Ministry of the Interior). */
export const LLA_2025 = "40.8%";

/**
 * Chamber of Deputies blocs after the new members took their seats (Dec 2025), in hemicycle order:
 * the Peronist bloc (Unión por la Patria), everyone else, and Milei's La Libertad Avanza (95, the
 * biggest bloc, short of the 129 needed for a majority).
 */
export const CHAMBER_2025 = [
  { key: "UXP", name: "Peronists", seats: 93, color: "#2E9AD6", party: false },
  { key: "OTH", name: "Others", seats: 69, color: "#9A9A9A", party: false },
  { key: "LLA", name: "Milei's LLA", seats: 95, color: "#7A4FB3", party: true },
] as const;
/** La Libertad Avanza's own senators (reported Nov 2026). */
export const LLA_SENATE = 21;

/** Who is president now (checked 2 Nov 2026; see the brief). */
export const NOW = { name: "MILEI", since: "10 DEC 2023", until: "2027" } as const;
