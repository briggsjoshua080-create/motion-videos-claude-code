import { VERTICAL } from "../../config";
import type { ExplainerPalette } from "../../components/explainer/palette";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/uk-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * UKElection: colours, layout, data and timing. Every visual cue is looked up from the voice-over
 * timing (src/voiceover/uk-election.timing.json), never hard-coded, so re-generating the voice
 * keeps animation, subtitles and sound effects in sync. Facts and sources:
 * briefs/uk-election-system/script.md.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/**
 * Union flag blue and red, royal gold (the crown) as the accent, and the colours of the two
 * chambers' benches: green for the Commons, red for the Lords.
 */
export const UK = {
  blue: "#012169",
  red: "#C8102E",
  gold: "#F4B41A",
  goldDeep: "#9C6A00",
  goldSoft: "#FBE3A6",
  commons: "#0E7C55",
  commonsSoft: "#CFE8DD",
  lords: "#B0193A",
  lordsSoft: "#F3D3DA",
  seat: "#C9CFDB",
  /** Grey for things that win nothing or have no parliament of their own. */
  none: "#B4BBCB",
  /** Suits, robes and dresses of the cartoon characters. */
  suit: "#2B3550",
  charcoal: "#3B4252",
  robe: "#9E1B32",
} as const;

/** Party colours as used on UK election nights (results scene only). */
export const PARTY = {
  labour: "#E4003B",
  conservative: "#0087DC",
  libDem: "#FAA61A",
  reform: "#12B6CF",
  other: "#8E97AA",
} as const;

/** Hair colours for the cartoon characters. */
export const HAIR = {
  brown: "#5A3E2B",
  dark: "#2F2A28",
  light: "#B08A5E",
  grey: "#A3A3A3",
  white: "#E6E3DE",
  auburn: "#8A4B2A",
} as const;

export const PALETTE: ExplainerPalette = {
  paper: "#FFFFFF",
  paperDeep: "#EEF1F7",
  card: "#FFFFFF",
  ink: "#0E1A3A",
  inkSoft: "#4A5677",
  muted: "#A3ACC2",
  line: "#DCE1EC",
  accent: UK.gold,
  accentDeep: UK.goldDeep,
  alert: UK.red,
  flag: [UK.blue, "#FFFFFF", UK.red],
  emblem: "uk",
  glows: [UK.red, UK.blue],
  skin: "#E8B996",
  skinShade: "#D29F7C",
  white: "#FFFFFF",
};

export const CARD_SHADOW = "0 22px 54px rgba(14,26,58,0.14)";

/** Vertical 9:16 layout (px). Clear of TikTok's top bar, side buttons and caption area. */
export const LAYOUT = {
  marginX: 120,
  width: 840,
  headerTop: 170,
  stageTop: 350,
  /** Lowest edge for scene content: the subtitles sit below, centred at y = 1330. */
  stageBottom: 1250,
} as const;

/** Each scene starts this many frames before its first sentence, so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the closing question stays up after the final word. */
const TAIL = 1.4;

export type SceneId = "title" | "who" | "ballot" | "count" | "commons" | "devolved" | "lords" | "government" | "king" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "count", "commons", "devolved", "lords", "government", "king", "question"];
const FIRST_SENTENCE: Record<SceneId, string> = {
  title: "hook",
  who: "who",
  ballot: "ballot",
  count: "fptp",
  commons: "commons",
  devolved: "devolved",
  lords: "lords",
  government: "result",
  king: "king",
  question: "question",
};

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const UK_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts. */
export const sceneFrom = (id: SceneId): number =>
  id === "title" ? 0 : toFrame(getSentence(timing, FIRST_SENTENCE[id]).start) - LEAD;

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : UK_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "one#2" = second "one". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** House of Commons: 650 seats, one per area; 326 is a majority. */
export const COMMONS_TOTAL = 650;
export const MAJORITY = 326;

/**
 * General election of 4 July 2024 (seats; UK vote share in %). Seats fill the half-circle from the
 * left in this order. "Others" = SNP 9, Sinn Féin 7, independents 6, DUP 5, Greens 4, Plaid Cymru 4,
 * SDLP 2, Alliance, UUP, TUV and the Speaker 1 each.
 */
export const RESULT_2024 = [
  { name: "Labour", seats: 411, votes: 33.7, color: PARTY.labour },
  { name: "Others", seats: 41, votes: 16.1, color: PARTY.other },
  { name: "Lib Dems", seats: 72, votes: 12.2, color: PARTY.libDem },
  { name: "Conservatives", seats: 121, votes: 23.7, color: PARTY.conservative },
  { name: "Reform UK", seats: 5, votes: 14.3, color: PARTY.reform },
] as const;
export const WINNER = RESULT_2024[0];
/** Labour's share of the seats: 411 of 650. */
export const WINNER_SEAT_SHARE = (100 * WINNER.seats) / COMMONS_TOTAL;

/** House of Lords: about 800 members, nearly all appointed for life, plus 26 bishops. */
export const LORDS_TOTAL = 800;

/**
 * Where the Commons half-circle (CommonsLayer) sits in each scene: centre of its base line, scale
 * and opacity. Scenes use these to place labels next to it.
 */
export const COMMONS_POSE = {
  commons: { cx: 540, cy: 830, s: 1, o: 1 },
  /** Small, near London, as "the UK Parliament" that decides for England. */
  devolved: { cx: 780, cy: 1130, s: 0.28, o: 1 },
  /** Left of the Lords. */
  lords: { cx: 304, cy: 640, s: 0.42, o: 1 },
  government: { cx: 540, cy: 800, s: 1, o: 1 },
  king: { cx: 540, cy: 600, s: 0.55, o: 0 },
} as const;
/** Outer radius and seat size of the half-circle at scale 1. */
export const COMMONS_R_OUT = 400;
export const COMMONS_DOT = 7;
