import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/ceuta-crisis.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * CeutaCrisis ("A city of 83,000. 72,000 arrived."): colours, fonts, layout, data and timing.
 * The summer 2026 Ceuta crisis in the current standard look (copied from ChineseElection, made to the
 * TikTok Retention Rules in CLAUDE.md), themed to the topic rather than a flag: the deep blue of the
 * Strait of Gibraltar with rescue orange (life jackets, buoys) for the accent blocks, the re-hook
 * flashes and the subtitle pill. Every visual cue is looked up from the voice-over timing
 * (src/voiceover/ceuta-crisis.timing.json), never hard-coded.
 * Facts, sources and the retention plan: briefs/ceuta-crisis-2026/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
export const W = VERTICAL.width;
export const H = VERTICAL.height;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** Sea blue, rescue orange, and the light "nautical chart" paper. */
export const CE = {
  /** Rescue orange: accent blocks, the subtitle pill, the re-hook flashes, the barrier. */
  orange: "#FF6A13",
  orangeDeep: "#E04E00",
  orangeLight: "#FF8B45",
  /** Dark navy, for text on orange and on paper. */
  navy: "#0A2036",
  /** The background: deep sea blue, lighter in the middle, darker towards the edges. */
  bg: "#0E3A5E",
  bgLight: "#185583",
  bgDeep: "#082844",
  bgNight: "#04172A",
  /** Sea and land on the dark maps. */
  sea: "#0E3A5E",
  land: "#3A74A3",
  landEdge: "rgba(255,255,255,0.35)",
  spain: "#D8E4EE",
  white: "#FFFFFF",
  text: "#F3F8FC",
  textSoft: "rgba(236,244,250,0.9)",
  line: "rgba(255,255,255,0.3)",
  /** Dark text on paper. */
  ink: "#0F1E2B",
  inkSoft: "#3A4C5C",
  inkFaint: "rgba(15,30,43,0.22)",
  /** The chart paper and its sea and land. */
  paper: "#F2EEE3",
  paperDeep: "#E2DACA",
  chartSea: "#BFD9E8",
  chartLand: "#E6D8B8",
  chartSpain: "#FFFFFF",
  /** The three problems. */
  geo: "#2E8FD0",
  politics: "#F2B705",
  social: "#E8505B",
  card: "#FFFFFF",
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
export const SCENE_ORDER = [
  "hook",
  "loops",
  "where",
  "fence",
  "swim",
  "rehook",
  "three",
  "geo",
  "law",
  "jobs",
  "rumour",
  "back",
  "dead",
  "date",
  "stopped",
  "again",
  "smaller",
  "buoys",
  "save",
  "question",
] as const;
export type SceneId = (typeof SCENE_ORDER)[number];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const CEUTA_CRISIS_DURATION = toFrame(lastSentence.end + TAIL);
export const DURATION = CEUTA_CRISIS_DURATION;

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

/** Lines already big on screen get no subtitles: the hook, the deaths (a quiet beat), the save line and the closing question. */
export const CE_SUBTITLES = ["hook", "dead", "save", "question"];

/** Frames a background wipe (paper or orange) takes. */
export const WIPE = 12;

/** Where the background is not blue: the chart (fence + swim), the court ruling, and the two orange re-hook flashes. */
export const LIGHT_SPANS: { from: number; to: number; kind: "paper" | "flash" }[] = [
  { from: sceneFrom("fence"), to: sceneEnd("swim"), kind: "paper" },
  { from: sceneFrom("rehook"), to: sceneEnd("rehook"), kind: "flash" },
  { from: sceneFrom("law"), to: sceneEnd("law"), kind: "paper" },
  { from: sceneFrom("date"), to: sceneEnd("date"), kind: "flash" },
];

/** The numbered sections (ticks on the broadcast frame's ruler, and the big outlined numerals). */
export const SECTIONS: { n: string; scene: SceneId }[] = [
  { n: "01", scene: "where" },
  { n: "02", scene: "three" },
  { n: "03", scene: "back" },
  { n: "04", scene: "stopped" },
];

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "loops").start;

/** Facts (checked 8 Nov 2026, sources in briefs/ceuta-crisis-2026/script.md). */
/** INE register, 1 Jan 2025: 83,567 people live in Ceuta. */
export const POPULATION = 83000;
/** Spain's Interior Ministry (as of 4 Aug 2026): 72,000 irregular entries on 29–31 July 2026 ... */
export const ARRIVED = 72000;
/** ... of whom 70,000 were already back in Morocco. */
export const WENT_BACK = 70000;
/** Spain's count of the dead (Al Jazeera, Aug 2026: "at least 80"; Morocco counted 11 on its side). */
export const DEAD = 80;
