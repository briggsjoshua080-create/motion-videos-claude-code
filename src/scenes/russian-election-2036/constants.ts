import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/russian-election-2036.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * RussianElection2036 ("Putin can legally rule until 2036."): colours, fonts, layout, data and timing.
 * The Russian election system redone in the current standard look (copied from UkrainianElection,
 * made to the TikTok Retention Rules in CLAUDE.md): deep flag blue with red accent blocks, red
 * full-screen flashes for the re-hooks, no title card, no text under 110 px, a last frame that
 * mirrors frame 0. Every visual cue is looked up from the voice-over timing
 * (src/voiceover/russian-election-2036.timing.json), never hard-coded.
 * Facts, sources and the retention plan: briefs/russian-election-2036/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
export const W = VERTICAL.width;
export const H = VERTICAL.height;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's white, blue and red, the deep blue background and the light "paper" scenes. */
export const RU = {
  /** The flag's red: accent blocks, the subtitle pill, the re-hook flashes. */
  red: "#D52B1E",
  redDeep: "#A81E14",
  redLight: "#E8473A",
  /** The flag's blue. */
  blue: "#0039A6",
  /** Deep navy, for text on white. */
  navy: "#06173F",
  /** The background: a strong, deep flag blue, lighter in the middle, darker towards the edges. */
  bg: "#0B3C93",
  bgLight: "#1D56B8",
  bgDeep: "#072A6C",
  bgNight: "#041C4C",
  white: "#FFFFFF",
  text: "#F4F7FD",
  textSoft: "rgba(240,245,255,0.88)",
  line: "rgba(255,255,255,0.28)",
  glass: "rgba(4,16,48,0.38)",
  glassEdge: "rgba(255,255,255,0.22)",
  /** Dark text on paper. */
  ink: "#0E1A24",
  inkSoft: "#34445A",
  inkFaint: "rgba(14,26,36,0.22)",
  /** Pen ink on the ballots. */
  pen: "#1747A6",
  paper: "#F4F1E8",
  paperDeep: "#E3DCCD",
  card: "#FFFFFF",
  /** The rewatch detail: the 2008–12 stretch of the timeline, drawn hollow and easy to miss. */
  gap: "rgba(220,230,250,0.5)",
  /** Seats of other parties in the hemicycle. */
  others: "rgba(255,255,255,0.9)",
} as const;

/** Archivo Black headlines, Instrument Serif italics, Inter for subtitles (loaded in the Swedish fonts.ts). */
export const FONT = {
  display: "'Archivo Black', 'Inter Variable', sans-serif",
  serif: "'Instrument Serif', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
  body: theme.font,
} as const;

/** Rule 6 of the TikTok Retention Rules: no text smaller than this (≈ 6% of the 1920 px height). */
export const MIN_TEXT = 110;
/** Left edge of every text block (TikTok's safe area is x 120–960). */
export const LEFT = 120;

/** Each scene starts this many frames before its first sentence, so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the last frame is held after the final word (rule 8: 1–2 s). */
const TAIL = 1.2;

/** Scenes, each named after its first sentence. */
export type SceneId =
  | "hook"
  | "loops"
  | "reset"
  | "who"
  | "rehook"
  | "ballot"
  | "seats"
  | "duma"
  | "stranger"
  | "council"
  | "pm"
  | "president"
  | "result"
  | "duma2026"
  | "save"
  | "gap"
  | "question";
export const SCENE_ORDER: SceneId[] = [
  "hook",
  "loops",
  "reset",
  "who",
  "rehook",
  "ballot",
  "seats",
  "duma",
  "stranger",
  "council",
  "pm",
  "president",
  "result",
  "duma2026",
  "save",
  "gap",
  "question",
];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const RUSSIAN_ELECTION_2036_DURATION = toFrame(lastSentence.end + TAIL);
export const DURATION = RUSSIAN_ELECTION_2036_DURATION;

/** Composition frame at which each scene starts (the hook at frame 0, complete on the first frame). */
export const sceneFrom = (id: SceneId): number => (id === "hook" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** Lines already big on screen word for word get no subtitles: the hook, the save line and the closing question. */
export const RU_SUBTITLES = ["hook", "save", "question"];

/** Frames a background wipe (paper or red) takes. */
export const WIPE = 12;

/** Where the background is not blue: the two paper scenes and the two red re-hook flashes (composition frames). */
export const LIGHT_SPANS: { from: number; to: number; kind: "paper" | "flash" }[] = [
  { from: sceneFrom("rehook"), to: sceneEnd("rehook"), kind: "flash" },
  { from: sceneFrom("ballot"), to: sceneEnd("ballot"), kind: "paper" },
  { from: sceneFrom("stranger"), to: sceneEnd("stranger"), kind: "flash" },
  { from: sceneFrom("duma2026"), to: sceneEnd("duma2026"), kind: "paper" },
];

/** The numbered sections (ticks on the broadcast frame's ruler, and the big outlined numerals). */
export const SECTIONS: { n: string; scene: SceneId }[] = [
  { n: "01", scene: "reset" },
  { n: "02", scene: "who" },
  { n: "03", scene: "duma" },
  { n: "04", scene: "pm" },
  { n: "05", scene: "president" },
  { n: "06", scene: "gap" },
];

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "loops").start;

/**
 * The hook's timeline (checked 3 Nov 2026): Putin president 2000–2008 (two terms in a row, the old
 * limit), prime minister 2008–2012 (the hollow gap, the rewatch detail), president again from 2012;
 * the current term ends in 2030 and the 2020 amendments allow one more six-year term, to 2036.
 */
export const TIMELINE = { from: 2000, to: 2036, now: 2026, gapFrom: 2008, gapTo: 2012 } as const;
/** Where the timeline bar sits in the hook (and again in the rewatch payoff). */
export const BAR = { left: 120, width: 840, top: 980, height: 74 } as const;
export const yearX = (year: number) => BAR.left + (BAR.width * (year - TIMELINE.from)) / (TIMELINE.to - TIMELINE.from);

/** The 2020 amendments: earlier presidential terms (2000, 2004, 2012, 2018) no longer count. */
export const TERMS_BEFORE = 4;
/** Every citizen from 18 can vote (not prisoners serving a sentence; voting is optional). */
export const VOTING_AGE = 18;
/** The State Duma: 450 seats, 225 by party list above a 5% line, 225 district winners. */
export const DUMA = 450;
export const LIST_SEATS = 225;
export const THRESHOLD = 5;
/** The Federation Council: two per region, plus up to 30 named by the president. */
export const COUNCIL_PRESIDENT = 30;
/** The president: six years, over half in round one or a run-off. */
export const TERM_YEARS = 6;
/** Presidential election 15–17 Mar 2024 (CEC final count): 87.28%. */
export const PRES_2024 = 87;
/** State Duma election 18–20 Sep 2026 (CEC, 25 Sep 2026): United Russia 349 of 450. */
export const UR_2026 = 349;
