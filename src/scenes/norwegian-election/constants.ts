import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/norwegian-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * NorwegianElection ("How Norway votes."): colours, fonts, layout, data and timing. The look is the
 * Swedish video's (the user's Belgian reference: broadcast frame, numbered sections, huge glowing
 * headlines), in the Norwegian flag's red, white and navy blue. Every visual cue is looked up from
 * the voice-over timing (src/voiceover/norwegian-election.timing.json), never hard-coded.
 * Facts and sources: briefs/norwegian-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's red, white and navy, the deep reds of the background, and the light "paper" scenes. */
export const NO = {
  /** The flag's red, for accents on paper. */
  red: "#BA0C2F",
  /** The background: a deep Norwegian red, darker towards the edges. */
  bg: "#9C0A27",
  bgLight: "#B8122F",
  bgDeep: "#70061A",
  bgNight: "#4A0411",
  /** The flag's navy cross, for accent blocks, wipe bands and the subtitle pill. */
  blue: "#00205B",
  blueLight: "#1C3F86",
  white: "#FFFFFF",
  text: "#FFF5F6",
  textSoft: "rgba(255,240,242,0.8)",
  textFaint: "rgba(255,240,242,0.48)",
  line: "rgba(255,255,255,0.24)",
  glass: "rgba(46,2,10,0.38)",
  glassEdge: "rgba(255,255,255,0.18)",
  /** Dark text on paper. */
  ink: "#0B1838",
  inkSoft: "#4A5672",
  inkFaint: "rgba(11,24,56,0.38)",
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

export type SceneId = "title" | "who" | "ballot" | "seats" | "topup" | "storting" | "pm" | "king" | "result" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "seats", "topup", "storting", "pm", "king", "result", "question"];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const NORWEGIAN_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence; the title after "hook"). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : NORWEGIAN_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** The numbered sections of the broadcast frame ("03 — THE BALLOT"); the top-up scene belongs to 04. */
export const SECTIONS: { n: string; label: string; scene: SceneId }[] = [
  { n: "01", label: "HOW NORWAY VOTES", scene: "title" },
  { n: "02", label: "WHO CAN VOTE", scene: "who" },
  { n: "03", label: "THE BALLOT", scene: "ballot" },
  { n: "04", label: "THE SEATS", scene: "seats" },
  { n: "05", label: "THE STORTING", scene: "storting" },
  { n: "06", label: "PRIME MINISTER", scene: "pm" },
  { n: "07", label: "THE KING", scene: "king" },
  { n: "08", label: "THE RESULT", scene: "result" },
  { n: "09", label: "YOUR VERDICT", scene: "question" },
];

/** Scenes on light paper instead of red. */
export const LIGHT_SCENES: SceneId[] = ["ballot", "result"];
/** Frames a background wipe takes. */
export const WIPE = 14;

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "who").start;

/** The Storting elected on 8 Sep 2025: 150 district seats + 19 top-up seats (one per district); top-ups only for parties with 4%+ nationwide. */
export const STORTING = 169;
export const DISTRICT_SEATS = 150;
export const TOPUP_SEATS = 19;
export const DISTRICTS = 19;
export const THRESHOLD = 4;
/** A no-confidence vote needs a majority: 85 of 169. */
export const MAJORITY = 85;
/** Seats per district are shared out by points: 1 per resident, 1.8 per square kilometre. */
export const AREA_POINTS = 1.8;

/**
 * Vote weight, election of 8 Sep 2025: eligible voters (Statistics Norway) per seat (both district
 * and top-up seats count for the district).
 */
export const WEIGHT = {
  finnmark: { name: "FINNMARK", voters: 54_600, seats: 4, area: "48,600 KM²", perSeat: 14_000 },
  oslo: { name: "OSLO", voters: 518_570, seats: 20, area: "454 KM²", perSeat: 26_000 },
  ratio: "1.9",
} as const;

/** Made-up nationwide vote shares for the top-up example (no real parties). */
export const SHARES = [
  { party: "PARTY A", share: 30, topup: false },
  { party: "PARTY B", share: 24, topup: false },
  { party: "PARTY C", share: 15, topup: true },
  { party: "PARTY D", share: 8, topup: true },
  { party: "PARTY E", share: 5, topup: true },
  { party: "PARTY F", share: 3, topup: false },
] as const;

/** Made-up party papers on the rack in the polling booth (placeholders, no real parties or people). */
export const RACK = ["PARTY A", "PARTY B", "PARTY C"] as const;
export const PICKED = 1;
export const CANDIDATES = ["Candidate 1", "Candidate 2", "Candidate 3", "Candidate 4", "Candidate 5"] as const;

/**
 * Storting election of 8 Sep 2025 (Storting / Valgdirektoratet), in hemicycle order from left to
 * right. Colours are close to the parties' own.
 */
export const RESULT_2025 = [
  { key: "R", name: "Red", seats: 9, color: "#8E0F1E" },
  { key: "SV", name: "Socialist Left", seats: 9, color: "#C7346E" },
  { key: "MDG", name: "Greens", seats: 8, color: "#5E8F22" },
  { key: "AP", name: "Labour", seats: 53, color: "#E4202C" },
  { key: "SP", name: "Centre", seats: 9, color: "#00843D" },
  { key: "KRF", name: "Christian Dem.", seats: 7, color: "#F2B300" },
  { key: "V", name: "Liberals", seats: 3, color: "#0E7C7B" },
  { key: "H", name: "Conservatives", seats: 24, color: "#2A7DE1" },
  { key: "FRP", name: "Progress", seats: 47, color: "#003E72" },
] as const;
export const ELECTION_DATE = "8 SEP 2025";
export const LABOUR_SHARE = "28.0%";
export const PROGRESS_SHARE = "23.8%";
export const PM = "Jonas Gahr Støre";

/** The monarchy (checked 26 Oct 2026; see the brief). */
export const KING = { name: "HAAKON VIII", since: "28 AUG 2026", before: "HARALD V, 1991–2026" } as const;
