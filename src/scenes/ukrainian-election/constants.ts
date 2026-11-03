import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/ukrainian-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * UkrainianElection ("Elections are banned in Ukraine."): colours, fonts, layout, data and timing.
 * The first video made to the TikTok Retention Rules in CLAUDE.md and the template for new ones:
 * the Swedish look (broadcast frame, huge glowing headlines, paper ballots) in Ukraine's blue and
 * yellow, with no title card, no text under 110 px, yellow flashes for the re-hooks and a last
 * frame that mirrors frame 0. Every visual cue is looked up from the voice-over timing
 * (src/voiceover/ukrainian-election.timing.json), never hard-coded.
 * Facts, sources and the retention plan: briefs/ukrainian-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
export const W = VERTICAL.width;
export const H = VERTICAL.height;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's blue and yellow, the deep blue background and the light "paper" scenes. */
export const UA = {
  /** The flag's blue (DSTU 4512:2006, Pantone 2935 C). */
  blue: "#0057B7",
  blueDeep: "#0A3F8F",
  /** The flag's yellow (Pantone 012 C), for accent blocks, the subtitle pill and the re-hook flashes. */
  yellow: "#FFD700",
  yellowDeep: "#F2C200",
  /** Dark blue for text on yellow. */
  navy: "#0A2552",
  /** The background: a strong flag blue, lighter in the middle, deeper towards the edges. */
  bg: "#0B4EA6",
  bgLight: "#1C69C9",
  bgDeep: "#073A82",
  bgNight: "#04234F",
  white: "#FFFFFF",
  text: "#F4F8FF",
  textSoft: "rgba(240,246,255,0.88)",
  line: "rgba(255,255,255,0.28)",
  glass: "rgba(3,22,56,0.38)",
  glassEdge: "rgba(255,255,255,0.22)",
  /** Dark text on paper. */
  ink: "#0E1A2B",
  inkSoft: "#34445A",
  inkFaint: "rgba(14,26,43,0.22)",
  /** Pen ink on the ballots. */
  pen: "#1747A6",
  paper: "#F4F1E8",
  paperDeep: "#E3DCCD",
  card: "#FFFFFF",
  /** The rewatch detail: seats nobody could vote for in 2019, a dim grey that is easy to miss. */
  empty: "rgba(190,204,226,0.36)",
  /** Everyone else in the hemicycle. */
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

/** Scenes, each named after its first sentence. "stranger" also covers the "rada" sentence. */
export type SceneId =
  | "hook"
  | "loops"
  | "still"
  | "why"
  | "rehook"
  | "who"
  | "role"
  | "ballot"
  | "comedian"
  | "stranger"
  | "pm"
  | "next"
  | "threshold"
  | "save"
  | "empty"
  | "question";
export const SCENE_ORDER: SceneId[] = [
  "hook",
  "loops",
  "still",
  "why",
  "rehook",
  "who",
  "role",
  "ballot",
  "comedian",
  "stranger",
  "pm",
  "next",
  "threshold",
  "save",
  "empty",
  "question",
];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const UKRAINIAN_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (the hook at frame 0, complete on the first frame). */
export const sceneFrom = (id: SceneId): number => (id === "hook" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : UKRAINIAN_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** Lines already big on screen word for word get no subtitles: the hook, the closing question and two short lines. */
export const UA_SUBTITLES = ["hook", "role", "save", "question"];

/** Frames a background wipe (paper or yellow) takes. */
export const WIPE = 12;

/** Where the background is light: the two paper ballots and the yellow re-hook flashes (composition frames). */
export const LIGHT_SPANS: { from: number; to: number; kind: "paper" | "flash" }[] = [
  { from: sceneFrom("rehook"), to: sceneEnd("rehook"), kind: "flash" },
  { from: sceneFrom("ballot"), to: sceneEnd("ballot"), kind: "paper" },
  { from: sceneFrom("stranger"), to: at("stranger", "won") - 3, kind: "flash" },
  { from: sceneFrom("next"), to: sceneEnd("next"), kind: "paper" },
];

/** The numbered sections (ticks on the broadcast frame's ruler, and the big outlined numerals). */
export const SECTIONS: { n: string; scene: SceneId }[] = [
  { n: "01", scene: "still" },
  { n: "02", scene: "who" },
  { n: "03", scene: "stranger" },
  { n: "04", scene: "pm" },
  { n: "05", scene: "next" },
  { n: "06", scene: "question" },
];

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "loops").start;

/** The year the president and parliament were elected, and now (checked 3 Nov 2026). */
export const ELECTED = 2019;
export const NOW_YEAR = 2026;

/** Presidential run-off, 21 Apr 2019 (CEC): Zelensky 73.22% of the votes cast. */
export const RUN_OFF_SHARE = 73;

/**
 * The Verkhovna Rada after the snap election of 21 Jul 2019 (CEC, OSCE/ODIHR): 450 seats; Servant of the
 * People won 254 (the first single-party majority); 26 single-member districts in occupied Crimea,
 * Sevastopol and parts of Donetsk and Luhansk could not vote, so 424 MPs took their seats. Seat counts are
 * not shown on screen (rule 7); the 26 grey seats are the rewatch detail (rule 10).
 */
export const RADA = 450;
export const MAJORITY = 226;
export const SOP_2019 = 254;
export const EMPTY_2019 = 26;

/** Who leads the government now (appointed by the Rada on 16 Jul 2026, 289 votes; checked 3 Nov 2026). */
export const NEW_PM = { name: "KORETSKYI", since: "July 2026" } as const;

/** The next Rada vote (Electoral Code 2019): parties need 5% of the national vote. Made-up parties and shares. */
export const THRESHOLD = 5;
export const PARTIES = [
  { share: 38, color: UA.yellow },
  { share: 24, color: "#FFFFFF" },
  { share: 14, color: "#8EC5FF" },
  { share: 4, color: "#FFFFFF" },
  { share: 3, color: "#FFFFFF" },
] as const;

/** The new ballot (made-up layout): one row per party with a square to tick and a box for a candidate's number. */
export const BALLOT_ROWS = 3;
export const BALLOT_PICK = 1;
export const WRITTEN_NUMBER = "12";
