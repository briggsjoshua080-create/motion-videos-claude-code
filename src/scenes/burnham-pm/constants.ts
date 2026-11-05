import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/burnham-pm.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * BurnhamPM ("Britain's new PM won under 25,000 votes."): colours, fonts, layout, data and timing.
 * How and why Andy Burnham became UK prime minister (July 2026), told as a comedy with the comedy
 * formula (briefs/comedy-explainer-formula.md) on top of the TikTok Retention Rules (CLAUDE.md), in
 * the USMidterms style: the standard look in the Union flag's blue, red and white, red re-hook
 * flashes, no title card, no text under 110 px, a last frame that mirrors frame 0. The running gag
 * is musical chairs: a green House of Commons chair. Every visual cue comes from the voice-over
 * timing (src/voiceover/burnham-pm.timing.json), never hard-coded.
 * Facts, sources and the retention plan: briefs/burnham-prime-minister/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
export const W = VERTICAL.width;
export const H = VERTICAL.height;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The Union flag's blue, red and white, the Commons' green leather, and light "paper" props. */
export const UK = {
  /** Union flag red, for accent blocks, stamps and the re-hook flashes (a touch brighter for screens). */
  red: "#CF142B",
  redDeep: "#9C0C20",
  redLight: "#E5374D",
  /** The standard subtitle pill (CLAUDE.md). */
  pill: "#EF4135",
  /** Union flag blue, for bands and text on white. */
  blue: "#012169",
  navy: "#00133F",
  /** The background: a strong, deep flag blue, lighter in the middle, darker towards the edges. */
  bg: "#0D2C78",
  bgLight: "#1B44A2",
  bgDeep: "#08205C",
  white: "#FFFFFF",
  text: "#F4F7FD",
  textSoft: "rgba(240,245,255,0.88)",
  /** Dark text on paper. */
  ink: "#0E1A2B",
  inkSoft: "#34445A",
  inkFaint: "rgba(14,26,43,0.2)",
  /** Pen ink on the ballot. */
  pen: "#1A1A1A",
  paper: "#F4F1E8",
  paperDeep: "#E3DCCD",
  card: "#FFFDF7",
  /** The House of Commons' green leather benches (the chair) and the Green Party's green. */
  green: "#1F7A4D",
  greenLight: "#2F9A63",
  greenDeep: "#145436",
  wood: "#6B4426",
  woodDeep: "#4A2E18",
  /** The crown tag (the rewatch detail) and the King's crown. */
  gold: "#F2B632",
  goldDeep: "#C98B12",
  /** No. 10's black door. */
  door: "#14161C",
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

/** Each scene starts this many frames before its first sentence (or start word), so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the last frame is held after the final word (rule 8: 1–2 s; 1.0 keeps the video at 60 s). */
const TAIL = 1.0;

/** Scenes, each named after its first sentence. */
export type SceneId =
  | "hook"
  | "loops"
  | "chairs"
  | "seven"
  | "rehook"
  | "blocked"
  | "greens"
  | "may"
  | "strange"
  | "ballot"
  | "quit"
  | "contest"
  | "king"
  | "next"
  | "share"
  | "crown"
  | "question";
export const SCENE_ORDER: SceneId[] = [
  "hook",
  "loops",
  "chairs",
  "seven",
  "rehook",
  "blocked",
  "greens",
  "may",
  "strange",
  "ballot",
  "quit",
  "contest",
  "king",
  "next",
  "share",
  "crown",
  "question",
];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const BURNHAM_PM_DURATION = toFrame(lastSentence.end + TAIL);
export const DURATION = BURNHAM_PM_DURATION;

/**
 * Scenes that start on a later word of their sentence, so the previous scene's captions, stamps and
 * props stay up long enough (rule 6): e.g. "Britons never" still shows the three questions, "But
 * here's the" still shows 7 PMs, "He was Manchester's" still shows NO SEAT, "On 20 July," still
 * shows RIVALS: 0, "And the" still shows the share line.
 */
const START_WORD: Partial<Record<SceneId, string>> = {
  chairs: "vote",
  rehook: "weird",
  blocked: "mayor",
  greens: "lost",
  may: "May's",
  ballot: "voted",
  quit: "later",
  contest: "need",
  king: "King",
  next: "votes",
  share: "this",
  crown: "crown",
};

/** Composition frame at which each scene starts (the hook at frame 0, complete on the first frame). */
export const sceneFrom = (id: SceneId): number => {
  if (id === "hook") return 0;
  const word = START_WORD[id];
  return toFrame(word ? getWordTime(timing, id, word) : getSentence(timing, id).start) - LEAD;
};

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** Lines already big on screen word for word get no subtitles: the hook, the share line and the closing question. */
export const HIDDEN_SUBTITLES = ["hook", "share", "question"];

/** Frames a background wipe (paper or red) takes. */
export const WIPE = 12;

/** Where the background is not blue: the paper ballot and the two red re-hook flashes (composition frames). */
export const LIGHT_SPANS: { from: number; to: number; kind: "paper" | "flash" }[] = [
  { from: sceneFrom("rehook"), to: sceneEnd("rehook"), kind: "flash" },
  { from: sceneFrom("strange"), to: sceneEnd("strange"), kind: "flash" },
  { from: sceneFrom("ballot"), to: sceneEnd("ballot"), kind: "paper" },
];

/** The numbered sections (ticks on the broadcast frame's ruler, and the big outlined numerals). */
export const SECTIONS: { n: string; scene: SceneId }[] = [
  { n: "01", scene: "chairs" },
  { n: "02", scene: "blocked" },
  { n: "03", scene: "may" },
  { n: "04", scene: "ballot" },
  { n: "05", scene: "contest" },
  { n: "06", scene: "crown" },
];

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "loops").start;

/** The House of Commons: 650 seats; Labour held 403 in July 2026 (a majority, shown as the red share, never as a number). */
export const COMMONS = 650;
export const LABOUR_SEATS = 403;
/** Prime ministers since the June 2016 Brexit vote: Cameron, May, Johnson, Truss, Sunak, Starmer, Burnham. */
export const PMS_IN_TEN_YEARS = 7;
/** Labour's rule: a leadership candidate needs nominations from 20% of Labour MPs (81 of 403); Burnham had over 90%. */
export const NOMINATION_SHARE = 0.2;
export const BURNHAM_SHARE = 0.9;
