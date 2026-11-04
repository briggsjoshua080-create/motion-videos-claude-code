import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/us-midterms.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * USMidterms ("The president just failed his midterm."): colours, fonts, layout, data and timing.
 * The US midterms explained as a comedy, made to the TikTok Retention Rules (CLAUDE.md) and the
 * comedy formula (briefs/comedy-explainer-formula.md): the standard look (copied from
 * UkrainianElection, with RussianElection2036's red accents) in the US flag's blue, red and white,
 * red full-screen flashes for the re-hooks, no title card, no text under 110 px, a last frame that
 * mirrors frame 0. The running gag is the president's report card. Every visual cue is looked up
 * from the voice-over timing (src/voiceover/us-midterms.timing.json), never hard-coded.
 * Facts, sources and the retention plan: briefs/us-midterm-elections/.
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

/** Scenes, each named after its first sentence. */
export type SceneId =
  | "hook"
  | "loops"
  | "exam"
  | "passed"
  | "rehook"
  | "house"
  | "congress"
  | "who"
  | "strange"
  | "ballot"
  | "seats"
  | "result"
  | "next"
  | "why"
  | "share"
  | "horse"
  | "question";
export const SCENE_ORDER: SceneId[] = [
  "hook",
  "loops",
  "exam",
  "passed",
  "rehook",
  "house",
  "congress",
  "who",
  "strange",
  "ballot",
  "seats",
  "result",
  "next",
  "why",
  "share",
  "horse",
  "question",
];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const US_MIDTERMS_DURATION = toFrame(lastSentence.end + TAIL);
export const DURATION = US_MIDTERMS_DURATION;

/**
 * Scenes that start on a later word of their sentence, so the previous scene's last caption or
 * stamp stays up at least 2 s (rule 6): "Together, they" still shows the House and the Senate side
 * by side, "From January," still shows the report card, "Why?" still shows the gridlock, "And the"
 * still shows the share line.
 */
const START_WORD: Partial<Record<SceneId, string>> = { congress: "write", next: "every", why: "Angry", horse: "horse" };

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

/** Where the background is not blue: the paper ballot and the two red re-hook flashes (composition frames). */
export const LIGHT_SPANS: { from: number; to: number; kind: "paper" | "flash" }[] = [
  { from: sceneFrom("rehook"), to: sceneEnd("rehook"), kind: "flash" },
  { from: sceneFrom("strange"), to: sceneEnd("strange"), kind: "flash" },
  { from: sceneFrom("ballot"), to: sceneEnd("ballot"), kind: "paper" },
];

/** The numbered sections (ticks on the broadcast frame's ruler, and the big outlined numerals). */
export const SECTIONS: { n: string; scene: SceneId }[] = [
  { n: "01", scene: "exam" },
  { n: "02", scene: "house" },
  { n: "03", scene: "who" },
  { n: "04", scene: "result" },
  { n: "05", scene: "why" },
  { n: "06", scene: "horse" },
];

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "loops").start;

/**
 * The record (American Presidency Project, checked 4 Nov 2026): one report card per midterm since
 * World War II, 1946–2026. The president's party lost House seats every time except 1998 and 2002.
 */
export const FIRST_MIDTERM = 1946;
export const MIDTERMS = Array.from({ length: (2026 - FIRST_MIDTERM) / 4 + 1 }, (_, i) => FIRST_MIDTERM + i * 4);
export const PASSED = [1998, 2002];

/** Congress: 435 House seats every two years (218 = a majority); 100 senators, six-year terms, a third up. */
export const HOUSE = 435;
export const MAJORITY = 218;
export const HOUSE_TERM = 2;
export const SENATE = 100;
export const SENATE_TERM = 6;
/** Senate seats on the 2026 ballot: 33 regular + 2 specials (Ohio, Florida). */
export const SENATE_UP = 35;

/** Who can vote: citizens from 18 who registered (North Dakota has no registration). */
export const VOTING_AGE = 18;

/** Election Day: "the Tuesday next after the first Monday in November", set in 1845. */
export const ELECTION_DAY_LAW = 1845;
