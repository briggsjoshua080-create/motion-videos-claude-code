import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/iran-crisis-start.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * IranCrisisStart ("One night killed Iran's leader."): colours, fonts, layout, data and timing.
 * The start of the 2026 Iran war (June 2025 build-up to the first ten days) in the current standard look
 * (copied from CeutaCrisis, made to the TikTok Retention Rules in CLAUDE.md), themed to the topic: deep
 * midnight indigo with amber (warning light, oil) for the accent blocks, the re-hook flashes and the
 * subtitle pill, and strike red for the missiles. Every visual cue is looked up from the voice-over timing
 * (src/voiceover/iran-crisis-start.timing.json), never hard-coded.
 * Facts, sources and the retention plan: briefs/iran-crisis-start/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
export const W = VERTICAL.width;
export const H = VERTICAL.height;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

export const IR = {
  /** Amber: accent blocks, the subtitle pill, the re-hook flashes, the oil. */
  amber: "#FFB020",
  amberDeep: "#E08A00",
  amberLight: "#FFCB5C",
  /** Dark indigo, for text on amber and on paper. */
  navy: "#0B1030",
  /** The background: midnight indigo, lighter in the middle, darker towards the edges. */
  bg: "#151A4D",
  bgLight: "#232B78",
  bgDeep: "#0D1033",
  bgNight: "#070A22",
  /** Sea and land on the dark maps. */
  sea: "#151A4D",
  land: "#2E3680",
  landDim: "#222962",
  landEdge: "rgba(255,255,255,0.28)",
  iran: "#5B67D6",
  white: "#FFFFFF",
  text: "#F1F2FF",
  textSoft: "rgba(232,235,255,0.9)",
  line: "rgba(255,255,255,0.3)",
  /** Strike red: missiles, impacts. */
  strike: "#FF4D4D",
  /** Dark text on paper. */
  ink: "#10142E",
  inkSoft: "#3A3F66",
  inkFaint: "rgba(16,20,46,0.22)",
  paper: "#F2EEE3",
  paperDeep: "#E2DACA",
  /** Water of the Gulf in the Hormuz close-up. */
  water: "#0E3A8F",
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

/** Scenes, each named after its sentence. */
export const SCENE_ORDER = [
  "hook",
  "loops",
  "strike",
  "dead",
  "rehook",
  "june",
  "talks",
  "protests",
  "crackdown",
  "fleet",
  "retaliate",
  "usdead",
  "hormuz",
  "spread",
  "son",
  "talk26",
  "twodays",
  "save",
  "question",
] as const;
export type SceneId = (typeof SCENE_ORDER)[number];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const IRAN_CRISIS_START_DURATION = toFrame(lastSentence.end + TAIL);
export const DURATION = IRAN_CRISIS_START_DURATION;

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

/** Lines already big on screen get no subtitles: the hook, the three loop words, the punchline, the save line and the question. */
export const IR_SUBTITLES = ["hook", "loops", "twodays", "save", "question"];

/** Frames a background wipe (amber) takes. */
export const WIPE = 12;

/** Where the background is not indigo: the three amber re-hook flashes (the fuse, the warships, the spread). */
export const LIGHT_SPANS: { from: number; to: number; kind: "paper" | "flash" }[] = [
  { from: sceneFrom("rehook"), to: sceneEnd("rehook"), kind: "flash" },
  { from: sceneFrom("fleet"), to: sceneEnd("fleet"), kind: "flash" },
  { from: sceneFrom("spread"), to: sceneEnd("spread"), kind: "flash" },
];

/** The sections (ticks on the broadcast frame's ruler). */
export const SECTIONS: { n: string; scene: SceneId }[] = [
  { n: "01", scene: "strike" },
  { n: "02", scene: "june" },
  { n: "03", scene: "retaliate" },
  { n: "04", scene: "talk26" },
];

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "loops").start;

/** Facts (checked 11 Nov 2026, sources in briefs/iran-crisis-start/script.md). */
/** Carriers in the region before the strikes: USS Abraham Lincoln (Gulf of Oman) and USS Gerald R. Ford (heading in). */
export const CARRIERS = 2;
/** The strait carries about a fifth of the world's oil. */
export const HORMUZ_SHARE = 0.2;
/** Days of the first war between Israel and Iran, 13–24 June 2025. */
export const TWELVE_DAY_WAR = 12;
/** Pentagon: six US soldiers died in the 1 March drone strike on a makeshift operations centre in Kuwait. */
export const US_DEAD = 6;
