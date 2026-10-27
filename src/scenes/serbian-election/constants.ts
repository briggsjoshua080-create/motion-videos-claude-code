import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/serbian-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * SerbianElection ("How Serbia votes."): colours, fonts, layout, data and timing. The look is the
 * Swedish video's (the user's Belgian reference: broadcast frame, numbered sections, huge glowing
 * headlines), in the Serbian flag's red, blue and white. Every visual cue is looked up from the
 * voice-over timing (src/voiceover/serbian-election.timing.json), never hard-coded.
 * Facts and sources: briefs/serbian-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's red, blue and white, the deep blues of the background, and the light "paper" scenes. */
export const RS = {
  /** The flag's red, for accent blocks, wipe bands and the subtitle pill. */
  red: "#C6363C",
  redDeep: "#A3252B",
  /** The background: the flag's blue, darker towards the edges. */
  bg: "#0C4076",
  bgLight: "#1A5596",
  bgDeep: "#072B52",
  bgNight: "#041B36",
  /** The flag's blue, for accents on paper. */
  blue: "#0C4076",
  white: "#FFFFFF",
  text: "#F4F8FF",
  textSoft: "rgba(236,243,255,0.8)",
  textFaint: "rgba(236,243,255,0.48)",
  line: "rgba(255,255,255,0.24)",
  glass: "rgba(2,16,40,0.38)",
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
  /** The glow of the UV lamp that shows the invisible ink. */
  uv: "#8B5CF6",
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

export type SceneId = "title" | "who" | "ballot" | "seats" | "assembly" | "pm" | "president" | "result" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "seats", "assembly", "pm", "president", "result", "question"];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const SERBIAN_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence; the title after "hook"). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : SERBIAN_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const RS_SUBTITLES = ["question"];

/** The numbered sections of the broadcast frame ("03 — THE BALLOT"). */
export const SECTIONS: { n: string; label: string; scene: SceneId }[] = [
  { n: "01", label: "HOW SERBIA VOTES", scene: "title" },
  { n: "02", label: "WHO CAN VOTE", scene: "who" },
  { n: "03", label: "THE BALLOT", scene: "ballot" },
  { n: "04", label: "THE SEATS", scene: "seats" },
  { n: "05", label: "THE ASSEMBLY", scene: "assembly" },
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

/** The National Assembly: 250 seats, one nationwide district, closed lists, 3% threshold (none for minority lists). */
export const ASSEMBLY = 250;
export const THRESHOLD = 3;
/** Electing a government takes a majority of all deputies: 126 of 250. */
export const MAJORITY = 126;
/** No government within 90 days of the new Assembly's first sitting: it is dissolved, new election. */
export const GOVERNMENT_DAYS = 90;

/** The hook: Vučić resigned as President on 27 Sep 2026 to lead his list; the snap election was on 25 Oct 2026. */
export const HOOK = { quit: "27 SEP 2026", lost: "25 OCT 2026" } as const;

/** Made-up nationwide vote shares for the threshold example (no real parties). */
export const SHARES = [
  { party: "LIST A", share: 34, minority: false },
  { party: "LIST B", share: 27, minority: false },
  { party: "LIST C", share: 9, minority: false },
  { party: "LIST D", share: 4, minority: false },
  { party: "LIST E", share: 2, minority: true },
  { party: "LIST F", share: 2, minority: false },
] as const;

/** Made-up lists on the ballot (placeholders, no real parties or people). */
export const BALLOT_LISTS = ["List A — Party of Example", "List B — Example Coalition", "List C — Movement for Example", "List D — Example Alliance", "List E — Minority Example List"] as const;
export const PICKED = 2;

/** Voters: 6,451,292 registered on election day (ODIHR), 102,147 of them signed up abroad; turnout 68.78% (RIK). */
export const VOTERS = { registered: "6.45 MILLION", abroad: "102,147", turnout: "68.8%" } as const;

/**
 * Early parliamentary election of 25 Oct 2026, RIK preliminary results (8,187 polling stations, 26 Oct 2026),
 * in hemicycle order from left to right. The four minority lists' 6 seats are shown together.
 */
export const RESULT_2026 = [
  { key: "SL", name: "Student List", seats: 140, color: "#C6363C", share: "52.7%" },
  { key: "MIN", name: "Minority lists (4)", seats: 6, color: "#8C8C8C", share: "" },
  { key: "US", name: "Aleksandar Vučić — United Serbia", seats: 104, color: "#2D5DA8", share: "39.2%" },
] as const;
export const ELECTION_DATE = "25 OCT 2026";

/** The presidency (checked 27 Oct 2026; see the brief). */
export const PRESIDENT = { term: 5, acting: "ANA BRNABIĆ", actingSince: "28 SEP 2026", electionBy: "DEC 2026" } as const;
