import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/us-congress.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * USCongress ("America's most hated group chat writes every law."): colours, fonts, layout, data and
 * timing. How the US Congress works, explained as a comedy (briefs/comedy-explainer-formula.md) on
 * top of the TikTok Retention Rules (CLAUDE.md), in the standard look in the US flag's colours (the
 * USMidterms palette). The premise: Congress is America's group chat. Every visual cue is looked up
 * from the voice-over timing (src/voiceover/us-congress.timing.json), never hard-coded.
 * Facts, sources and the retention plan: briefs/us-congress/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
export const W = VERTICAL.width;
export const H = VERTICAL.height;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's Old Glory blue, red and white, the deep blue background and the light "paper" props. */
export const US = {
  /** Red for accent blocks, stamps and the re-hook flashes (Old Glory red, a touch brighter for screens). */
  red: "#D2283F",
  redDeep: "#A3172F",
  redLight: "#E8475C",
  /** The standard subtitle pill (CLAUDE.md). */
  pill: "#EF4135",
  /** Old Glory blue, for bands and text on white. */
  blue: "#0A3161",
  navy: "#061A3D",
  /** The background: a strong, deep flag blue, lighter in the middle, darker towards the edges. */
  bg: "#0C3A7C",
  bgLight: "#1B50A0",
  bgDeep: "#082B60",
  bgNight: "#051C43",
  white: "#FFFFFF",
  text: "#F4F7FD",
  textSoft: "rgba(240,245,255,0.88)",
  line: "rgba(255,255,255,0.28)",
  glass: "rgba(4,16,48,0.38)",
  /** Dark text on paper. */
  ink: "#0E1A2B",
  inkSoft: "#34445A",
  inkFaint: "rgba(14,26,43,0.2)",
  /** Pen ink on the ballot. */
  pen: "#123A8A",
  paper: "#F4F1E8",
  paperDeep: "#E3DCCD",
  card: "#FFFDF7",
  /** The horse sticker (the rewatch detail): a gold teacher's sticker, small on purpose. */
  gold: "#F2B632",
  goldDeep: "#C98B12",
  /** Neutral greys for losing bars and seats that are not in play. */
  grey: "rgba(255,255,255,0.32)",
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

/** Scenes, each named after its first sentence ("house" also holds "senate", "law" also holds "override"). */
export type SceneId =
  | "hook"
  | "loops"
  | "approval"
  | "members"
  | "house"
  | "rehook"
  | "wyoming"
  | "power"
  | "president"
  | "law"
  | "strange"
  | "shutdown"
  | "result"
  | "next"
  | "share"
  | "dots"
  | "question";
export const SCENE_ORDER: SceneId[] = [
  "hook",
  "loops",
  "approval",
  "members",
  "house",
  "rehook",
  "wyoming",
  "power",
  "president",
  "law",
  "strange",
  "shutdown",
  "result",
  "next",
  "share",
  "dots",
  "question",
];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const US_CONGRESS_DURATION = toFrame(lastSentence.end + TAIL);
export const DURATION = US_CONGRESS_DURATION;

/** Scenes that start on a later word of their sentence (none yet; kept for re-timing). */
const START_WORD: Partial<Record<SceneId, string>> = {};

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
export const US_SUBTITLES = ["hook", "share", "question"];

/** Frames a background wipe (paper or red) takes. */
export const WIPE = 12;

/** Where the background is not blue: the two red re-hook flashes (composition frames). */
export const LIGHT_SPANS: { from: number; to: number; kind: "paper" | "flash" }[] = [
  { from: sceneFrom("rehook"), to: sceneEnd("rehook"), kind: "flash" },
  { from: sceneFrom("strange"), to: sceneEnd("strange"), kind: "flash" },
];

/** The numbered sections (ticks on the broadcast frame's ruler, and the big outlined numerals). */
export const SECTIONS: { n: string; scene: SceneId }[] = [
  { n: "01", scene: "members" },
  { n: "02", scene: "power" },
  { n: "03", scene: "president" },
  { n: "04", scene: "shutdown" },
  { n: "05", scene: "result" },
  { n: "06", scene: "dots" },
];

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "loops").start;

/** Congress (checked 9 Nov 2026, sources in briefs/us-congress/script.md). */
export const MEMBERS = 535;
export const HOUSE = 435;
export const SENATE = 100;
export const HOUSE_TERM = 2;
export const SENATE_TERM = 6;
/** Gallup, 1–19 Oct 2026: 14% approve of the way Congress is handling its job. */
export const APPROVAL = 14;
/** California ≈ 39.5 million vs Wyoming ≈ 577,000 people (2020 census): about 68 times. */
export const POP_RATIO = 68;
/** A bill the president neither signs nor returns becomes law after ten days (Sundays excepted) while Congress sits. */
export const IGNORE_DAYS = 10;
/** The 1 Oct – 12 Nov 2025 shutdown, the longest ever. */
export const SHUTDOWN_DAYS = 43;
/** The longest Senate speech: about 25 hours (31 March – 1 April 2025). */
export const RECORD_HOURS = 25;
/** Cloture (ending debate) takes three fifths of the Senate: 60 votes. */
export const CLOTURE = 60;

/**
 * The 3 Nov 2026 result as AP projections stood around 6–7 Nov 2026 (shown as colours only, no
 * numbers on screen): House about 254 D, 162 R, 19 uncalled; Senate 54 D (incl. independents),
 * 44 R, 2 uncalled.
 */
export const RESULT = { house: { d: 254, r: 162 }, senate: { d: 54, r: 44 } } as const;
/** Party colours for the result (Democratic light blue, Republican red; uncalled grey). */
export const PARTY = { d: "#7CC0FF", r: "#F0505E", open: "rgba(255,255,255,0.3)" } as const;
