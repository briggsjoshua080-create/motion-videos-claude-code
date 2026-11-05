import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/chinese-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * ChineseElection ("Xi won 2,952 votes to zero."): colours, fonts, layout, data and timing.
 * China's election system in the current standard look, in the style of RussianElection2036 (made
 * to the TikTok Retention Rules in CLAUDE.md): deep flag red with yellow accent blocks, yellow
 * full-screen flashes for the re-hooks, no title card, no text under 110 px, a last frame that
 * mirrors frame 0. Every visual cue is looked up from the voice-over timing
 * (src/voiceover/chinese-election.timing.json), never hard-coded.
 * Facts, sources and the retention plan: briefs/chinese-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
export const W = VERTICAL.width;
export const H = VERTICAL.height;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's red and yellow, the deep red background and the light "paper" scenes. */
export const CN = {
  /** The flag's red. */
  red: "#DE2910",
  redDeep: "#9E1308",
  redLight: "#F0442A",
  /** Dark red, for text on yellow and on white. */
  maroon: "#5E0A06",
  /** The flag's yellow: accent blocks, the subtitle pill, the re-hook flashes. */
  yellow: "#FFDE00",
  yellowDeep: "#F2B800",
  yellowLight: "#FFEC5C",
  /** The background: a strong, deep flag red, lighter in the middle, darker towards the edges. */
  bg: "#B3170C",
  bgLight: "#D2281A",
  bgDeep: "#7E0D07",
  bgNight: "#560804",
  white: "#FFFFFF",
  text: "#FFF7F2",
  textSoft: "rgba(255,244,236,0.9)",
  line: "rgba(255,255,255,0.3)",
  glass: "rgba(60,4,2,0.32)",
  glassEdge: "rgba(255,255,255,0.24)",
  /** Dark text on paper. */
  ink: "#1F1210",
  inkSoft: "#4A3631",
  inkFaint: "rgba(31,18,16,0.22)",
  /** Pen ink on the ballots. */
  pen: "#1747A6",
  paper: "#F6F0E4",
  paperDeep: "#E6DAC6",
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
  "few",
  "rehook",
  "who",
  "ballot",
  "seats",
  "only",
  "ladder",
  "npc",
  "week",
  "president",
  "limit",
  "premier",
  "result",
  "save",
  "star",
  "question",
] as const;
export type SceneId = (typeof SCENE_ORDER)[number];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const CHINESE_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);
export const DURATION = CHINESE_ELECTION_DURATION;

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
export const CN_SUBTITLES = ["hook", "save", "question"];

/** Frames a background wipe (paper or yellow) takes. */
export const WIPE = 12;

/** Where the background is not red: the two paper scenes and the two yellow re-hook flashes (composition frames). */
export const LIGHT_SPANS: { from: number; to: number; kind: "paper" | "flash" }[] = [
  { from: sceneFrom("rehook"), to: sceneEnd("rehook"), kind: "flash" },
  { from: sceneFrom("ballot"), to: sceneEnd("ballot"), kind: "paper" },
  { from: sceneFrom("only"), to: sceneEnd("only"), kind: "flash" },
  { from: sceneFrom("result"), to: sceneEnd("result"), kind: "paper" },
];

/** The numbered sections (ticks on the broadcast frame's ruler, and the big outlined numerals). */
export const SECTIONS: { n: string; scene: SceneId }[] = [
  { n: "01", scene: "few" },
  { n: "02", scene: "who" },
  { n: "03", scene: "ladder" },
  { n: "04", scene: "president" },
  { n: "05", scene: "result" },
  { n: "06", scene: "star" },
];

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "loops").start;

/** Facts (checked 5 Nov 2026, sources in briefs/chinese-election-system/script.md). */
/** 10 Mar 2023, 14th NPC: Xi re-elected president 2,952 for, 0 against, 0 abstentions (the only candidate). */
export const XI_VOTES = 2952;
/** The 14th National People's Congress has 2,977 deputies ("just under 3,000"). */
export const NPC_SIZE = 2977;
/** Every citizen from 18 can vote (unless stripped of political rights by a court), but only directly for the county and township congresses. */
export const VOTING_AGE = 18;
/** The 2026 annual NPC session ran 5–12 March: eight days. */
export const SESSION_DAYS = 8;
/** The Communist Party's 20th Central Committee (Oct 2022): 205 full members, who chose Xi as general secretary. */
export const CENTRAL_COMMITTEE = 205;

/**
 * The pyramid of people's congresses, bottom to top: township, county (both elected directly by
 * voters), city, province and the National People's Congress (each elected by the one below). The
 * small star floating above its tip is the rewatch detail: the Communist Party, which stands above
 * the whole ladder and is explained only at the end.
 */
export const TIERS = 5;
export const DIRECT_TIERS = 2;
/** The pyramid as it sits under the hook (and in the closing star scene). */
export const PYRAMID_HOOK = { cx: 540, base: 1220, baseW: 840, topW: 170, tierH: 40, gap: 9 } as const;
/** The large pyramid of the ladder scene. */
export const PYRAMID_BIG = { cx: 540, base: 1170, baseW: 840, topW: 190, tierH: 92, gap: 14 } as const;
