import { VERTICAL } from "../../config";
import type { ExplainerPalette } from "../../components/explainer/palette";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/dutch-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * DutchElection: colours, layout and timing. Every visual cue is looked up from the voice-over
 * timing (src/voiceover/dutch-election.timing.json), never hard-coded, so re-generating the voice
 * keeps animation, subtitles and sound effects in sync.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** Dutch flag (red, white, blue) and the national orange, on white. */
export const NL = {
  red: "#AE1C28",
  blue: "#21468B",
  orange: "#FF7F00",
  orangeSoft: "#FFAE5C",
  peach: "#FFD3A8",
  sky: "#6F96DB",
  seat: "#C5CBDA",
  /** Royal robe. */
  robe: "#9E1B32",
  /** Silver for the princess's tiara. */
  silver: "#D9DEE8",
} as const;

/** Hair colours for the cartoon characters. */
export const HAIR = {
  brown: "#5A3E2B",
  dark: "#2F2A28",
  light: "#B08A5E",
  auburn: "#8A4B2A",
} as const;

export const PALETTE: ExplainerPalette = {
  paper: "#FFFFFF",
  paperDeep: "#EEF0F5",
  card: "#FFFFFF",
  ink: "#14213D",
  inkSoft: "#4B5675",
  muted: "#A2AAC0",
  line: "#DCE0EA",
  accent: NL.orange,
  accentDeep: "#D96500",
  alert: NL.red,
  flag: [NL.red, "#FFFFFF", NL.blue],
  glows: [NL.orange, NL.blue],
  skin: "#E8B996",
  skinShade: "#D29F7C",
  white: "#FFFFFF",
};

/** Vertical 9:16 layout (px). Clear of TikTok's top bar, side buttons and caption area. */
export const LAYOUT = {
  marginX: 120,
  width: 840,
  headerTop: 170,
  stageTop: 340,
  subtitleCenterY: 1395,
} as const;

/** Each scene starts this many frames before its first sentence, so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the closing question stays up after the final word. */
const TAIL = 1.4;

export type SceneId = "title" | "vote" | "house" | "senate" | "government" | "king" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "vote", "house", "senate", "government", "king", "question"];
const FIRST_SENTENCE: Record<SceneId, string> = {
  title: "hook",
  vote: "vote",
  house: "house",
  senate: "senate",
  government: "coalition",
  king: "king",
  question: "question",
};

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const DUTCH_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts. */
export const sceneFrom = (id: SceneId): number =>
  id === "title" ? 0 : toFrame(getSentence(timing, FIRST_SENTENCE[id]).start) - LEAD;

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : DUTCH_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "two#2" = second "two". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** Words shown in the accent colour in the subtitle box, per sentence. */
export const KEYWORDS: Record<string, string[]> = {
  hook: ["dutch", "runs"],
  vote: ["one", "vote"],
  pencil: ["red", "pencil", "one", "candidate"],
  share: ["seats", "votes"],
  house: ["150", "house", "representatives"],
  houseJob: ["laws", "budget", "checks", "vote", "out"],
  senate: ["75", "senators", "yes", "no"],
  senateHow: ["provincial", "councils", "directly"],
  coalition: ["76", "2025", "d66", "pvv", "26"],
  cabinet: ["three", "parties", "rob", "jetten", "prime", "minister"],
  king: ["head", "state", "nobody"],
  kingInherit: ["willem-alexander", "inherited", "crown"],
  kingRole: ["signs", "ministers", "responsibility"],
};
/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** Senate scene: the House half-circle (HouseLayer) moves left, the Senate sits right. */
export const SENATE_POSE = { houseX: 330, houseScale: 0.46, senateX: 760, baseY: 600 } as const;

/** House of Representatives (150) and its majority; 2025 result and the Jetten coalition. */
export const HOUSE_TOTAL = 150;
export const MAJORITY = 76;
export const RESULT_2025 = { first: { name: "D66", seats: 26 }, second: { name: "PVV", seats: 26 } } as const;
export const COALITION = [
  { name: "D66", seats: 26, color: NL.orange },
  { name: "VVD", seats: 22, color: NL.orangeSoft },
  { name: "CDA", seats: 18, color: NL.peach },
] as const;
