import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/russian-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * RussianElection ("How Russia votes."): colours, fonts, layout, data and timing. The look is the
 * Swedish video's (the user's Belgian reference: broadcast frame, numbered sections, huge glowing
 * headlines), in the Russian flag's white, blue and red. Every visual cue is looked up from the
 * voice-over timing (src/voiceover/russian-election.timing.json), never hard-coded.
 * Facts and sources: briefs/russian-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's white, blue and red, and the light "paper" scenes. */
export const RU = {
  /** The flag's red: accent blocks, highlights, stamps. */
  red: "#D52B1E",
  redDeep: "#A81E14",
  redGlow: "rgba(213,43,30,0.55)",
  /** The flag's blue, for accents on paper. */
  blue: "#0039A6",
  blueDeep: "#002A7A",
  /** Deep navy, for text on white. */
  navy: "#06173F",
  /** The background: a strong, deep flag blue, darker towards the edges. */
  bg: "#0B3C93",
  bgLight: "#1D56B8",
  bgDeep: "#072A6C",
  bgNight: "#041C4C",
  white: "#FFFFFF",
  text: "#F4F7FD",
  textSoft: "rgba(240,245,255,0.82)",
  textFaint: "rgba(240,245,255,0.48)",
  line: "rgba(255,255,255,0.26)",
  glass: "rgba(4,16,48,0.38)",
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
/** Seconds the closing question stays up after the final word (keeps the video under 60 s). */
const TAIL = 0.9;

export type SceneId = "title" | "who" | "ballot" | "seats" | "congress" | "president" | "result" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "seats", "congress", "president", "result", "question"];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const RUSSIAN_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence; the title after "hook"). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : RUSSIAN_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const RU_SUBTITLES = ["question"];

/** The numbered sections of the broadcast frame ("03 — THE BALLOT"). */
export const SECTIONS: { n: string; label: string; scene: SceneId }[] = [
  { n: "01", label: "HOW RUSSIA VOTES", scene: "title" },
  { n: "02", label: "WHO CAN VOTE", scene: "who" },
  { n: "03", label: "THE BALLOTS", scene: "ballot" },
  { n: "04", label: "THE SEATS", scene: "seats" },
  { n: "05", label: "THE PARLIAMENT", scene: "congress" },
  { n: "06", label: "THE PRESIDENT", scene: "president" },
  { n: "07", label: "THE RESULT", scene: "result" },
  { n: "08", label: "YOUR VERDICT", scene: "question" },
];

/** Scenes on light paper instead of blue. */
export const LIGHT_SCENES: SceneId[] = ["ballot", "result"];
/** Frames a background wipe takes. */
export const WIPE = 14;

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "who").start;

/**
 * The hook's timeline: Putin in power as president or prime minister since 1999. PM Aug 1999,
 * acting president 31 Dec 1999, president 2000–2008, PM 2008–2012, president since 2012; the
 * current term ends in 2030; the 2020 amendments allow one more six-year term, to 2036.
 */
export const TIMELINE = { from: 1999, to: 2036, now: 2026, reset: 2020 } as const;
export const TIMELINE_SPANS = [
  { from: 1999, to: 2000, role: "PM" },
  { from: 2000, to: 2008, role: "PRESIDENT" },
  { from: 2008, to: 2012, role: "PM" },
  { from: 2012, to: 2036, role: "PRESIDENT" },
] as const;

/** The two State Duma ballots (generic, made-up names; not the real layout). */
export const LIST_BALLOT = ["PARTY A", "PARTY B", "PARTY C", "PARTY D", "PARTY E"] as const;
export const DISTRICT_BALLOT = [
  { name: "CANDIDATE A", party: "PARTY B" },
  { name: "CANDIDATE B", party: "PARTY A" },
  { name: "CANDIDATE C", party: "INDEPENDENT" },
  { name: "CANDIDATE D", party: "PARTY D" },
] as const;
/** The made-up voter's picks (index into each ballot). */
export const LIST_PICK = 2;
export const DISTRICT_PICK = 1;

/** The State Duma: 450 seats, five years; 225 by party list (5% line), 225 in single-member districts (most votes wins). */
export const DUMA = 450;
export const LIST_SEATS = 225;
export const DISTRICT_SEATS = 225;
export const THRESHOLD = 5;
export const DUMA_YEARS = 5;
/** Made-up nationwide list vote (party E falls under the line). */
export const LIST_VOTE = [
  { name: "PARTY A", share: 44 },
  { name: "PARTY B", share: 21 },
  { name: "PARTY C", share: 13 },
  { name: "PARTY D", share: 8 },
  { name: "PARTY E", share: 3.2 },
] as const;

/** The Federation Council: two per region (one from its parliament, one from its governor), plus up to 30 named by the president (up to 7 for life). */
export const COUNCIL_PER_REGION = 2;
export const COUNCIL_PRESIDENT = 30;

/** The president: six years, more than half of the votes in round one or a run-off; since 2020 at most two terms in total, earlier terms of the sitting president not counted. */
export const TERM_YEARS = 6;
export const TERMS_BEFORE_RESET = 4;

/** Presidential election 15–17 March 2024 (CEC final count). */
export const PRES_2024 = [
  { name: "PUTIN", share: 87.28, color: "#1F4FA8" },
  { name: "KHARITONOV", share: 4.31, color: "#C0392B" },
  { name: "DAVANKOV", share: 3.85, color: "#3FB8AF" },
  { name: "SLUTSKY", share: 3.2, color: "#E0A21B" },
] as const;
export const TURNOUT_2024 = "77.5%";

/** State Duma election 18–20 Sep 2026: seats announced by the CEC on 25 Sep 2026, in hemicycle order. */
export const DUMA_2026 = [
  { key: "KPRF", name: "Communists", seats: 37, color: "#C0392B", ruling: false },
  { key: "SR", name: "A Just Russia", seats: 17, color: "#E0A21B", ruling: false },
  { key: "NP", name: "New People", seats: 19, color: "#3FB8AF", ruling: false },
  { key: "OTH", name: "Others", seats: 5, color: "#9A9A9A", ruling: false },
  { key: "LDPR", name: "LDPR", seats: 23, color: "#5B8DEF", ruling: false },
  { key: "UR", name: "United Russia", seats: 349, color: "#1F4FA8", ruling: true },
] as const;
export const UR_LIST_2026 = "57.8%";
export const TURNOUT_2026 = "59.8%";
export const TWO_THIRDS = 300;
export const DATES = { pres: "15–17 MAR 2024", duma: "18–20 SEP 2026" } as const;
