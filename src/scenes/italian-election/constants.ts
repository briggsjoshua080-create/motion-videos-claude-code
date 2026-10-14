import { VERTICAL } from "../../config";
import type { ExplainerPalette } from "../../components/explainer/palette";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/italian-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * ItalianElection ("Who runs Italy?"): colours, layout, data and timing. Every visual cue is looked
 * up from the voice-over timing (src/voiceover/italian-election.timing.json), never hard-coded, so
 * re-generating the voice keeps animation, subtitles and sound effects in sync. Facts and sources:
 * briefs/italian-election-system/script.md.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/**
 * The tricolour's green (the accent) and red ("no", warnings), the real 2022 ballot colours (pink
 * for the Chamber, yellow for the Senate, also used for the two houses) and a few neutrals.
 */
export const IT = {
  green: "#009246",
  greenDeep: "#00733A",
  greenSoft: "#D4EEDD",
  red: "#CE2B37",
  redSoft: "#F8D8DB",
  /** Chamber of Deputies: its 2022 ballot was pink. */
  chamber: "#C8467A",
  chamberSoft: "#F8D5E1",
  /** Senate: its 2022 ballot was yellow. */
  senate: "#D29A00",
  senateSoft: "#FBE8AC",
  /** Seats shared out by party votes. */
  shared: "#5B6B80",
  /** Seats elected by Italians abroad. */
  abroad: "#178C8C",
  /** Regional delegates who help elect the President. */
  gold: "#E5A50F",
  goldSoft: "#FCEBC3",
  goldDeep: "#8F6200",
  seat: "#CBD2DB",
  /** Grey for things that win nothing or stop working. */
  none: "#B6BEC9",
  /** Suits of the cartoon characters. */
  suit: "#26303F",
  navy: "#1E2B46",
  charcoal: "#3B4352",
} as const;

/** Made-up parties A–D on the example ballot (neutral tints), and party A's highlight. */
export const TINT = {
  a: "#C9D3EA",
  b: "#F4D9B0",
  c: "#CFE6D9",
  d: "#E8D1E4",
  aSoft: "#E4EAF7",
  aDeep: "#3A5BA8",
} as const;

/** Alliance colours as used on Italian election nights (2022 result only). */
export const ALLIANCE = {
  centreRight: "#2D63B6",
  centreLeft: "#E14B52",
  m5s: "#F1BE17",
  actionIv: "#8A5BC1",
  other: "#9AA4B0",
} as const;

/** Hair colours for the cartoon characters. */
export const HAIR = {
  brown: "#5A3E2B",
  dark: "#2F2A28",
  blonde: "#D9B56C",
  grey: "#A3A3A3",
  white: "#E6E3DE",
  auburn: "#8A4B2A",
} as const;

export const PALETTE: ExplainerPalette = {
  paper: "#FFFFFF",
  paperDeep: "#EEF1F4",
  card: "#FFFFFF",
  ink: "#14202B",
  inkSoft: "#4B5866",
  muted: "#A4AEB9",
  line: "#DEE3E8",
  accent: IT.green,
  accentDeep: IT.greenDeep,
  alert: IT.red,
  flag: [IT.green, "#FFFFFF", IT.red],
  flagVertical: true,
  glows: [IT.green, IT.red],
  skin: "#E8B996",
  skinShade: "#D29F7C",
  white: "#FFFFFF",
};

export const CARD_SHADOW = "0 22px 54px rgba(20,32,43,0.14)";

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

export type SceneId = "title" | "who" | "ballot" | "seats" | "houses" | "result" | "support" | "president" | "newlaw" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "seats", "houses", "result", "support", "president", "newlaw", "question"];
const FIRST_SENTENCE: Record<SceneId, string> = {
  title: "hook",
  who: "who",
  ballot: "ballot",
  seats: "seats",
  houses: "houses",
  result: "result",
  support: "support",
  president: "president",
  newlaw: "newlaw",
  question: "question",
};

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const ITALIAN_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts. */
export const sceneFrom = (id: SceneId): number =>
  id === "title" ? 0 : toFrame(getSentence(timing, FIRST_SENTENCE[id]).start) - LEAD;

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : ITALIAN_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];

/** Governments of the Republic since 1946, Meloni's included (Presidency of the Council of Ministers). */
export const GOVERNMENTS = 68;

/** Chamber of Deputies: 400 seats, 201 is a majority. */
export const CHAMBER_TOTAL = 400;
export const CHAMBER_MAJORITY = 201;
/** Senate: 200 elected senators, plus (October 2026) 5 senators for life. */
export const SENATE_TOTAL = 200;
export const LIFE_SENATORS = 5;

/**
 * How the Chamber's 400 seats were filled in 2022 (the Senate is split the same way: 74 areas, 122
 * shared, 4 abroad). The groups fill the half-circle from the left in this order.
 */
export const CHAMBER_SPLIT = [
  { key: "areas", seats: 147, color: IT.green, label: "area winners" },
  { key: "shared", seats: 245, color: IT.shared, label: "by party votes" },
  { key: "abroad", seats: 8, color: IT.abroad, label: "Italians abroad" },
] as const;
export const AREA_SEATS = CHAMBER_SPLIT[0].seats;

/**
 * General election of 25 September 2022, Chamber of Deputies (seats; share of the votes in %),
 * left to right as the alliances fill the half-circle. "Others" = SVP 3, Valle d'Aosta 1,
 * Sud chiama Nord 1, MAIE 1 (their `votes` is the rest of the vote, including lists that won no
 * seat; not shown). Senate: the centre-right won 115 of 200.
 */
export const RESULT_2022 = [
  { name: "Centre-left", seats: 84, votes: 26.1, color: ALLIANCE.centreLeft },
  { name: "5 Star Movement", seats: 52, votes: 15.4, color: ALLIANCE.m5s },
  { name: "Others", seats: 6, votes: 6.9, color: ALLIANCE.other },
  { name: "Action–Italia Viva", seats: 21, votes: 7.8, color: ALLIANCE.actionIv },
  { name: "Centre-right", seats: 237, votes: 43.8, color: ALLIANCE.centreRight },
] as const;
export const WINNER = RESULT_2022[RESULT_2022.length - 1];
/** The centre-right's share of the Chamber's seats: 237 of 400. */
export const WINNER_SEAT_SHARE = (100 * WINNER.seats) / CHAMBER_TOTAL;
export const SENATE_WINNER_SEATS = 115;

/** The President is elected by all MPs (400 deputies, 200 senators, 5 senators for life) + 58 regional delegates. */
export const REGIONAL_DELEGATES = 58;
export const ELECTORS = CHAMBER_TOTAL + SENATE_TOTAL + LIFE_SENATORS + REGIONAL_DELEGATES;

/**
 * Where the Chamber half-circle (ChamberLayer) sits in each scene: centre of its base line, scale
 * and opacity. Scenes use these to place labels next to it.
 */
export const CHAMBER_POSE = {
  /** Below the map of the voting areas. */
  seats: { cx: 540, cy: 1168, s: 0.8, o: 1 },
  /** Left of the Senate. */
  houses: { cx: 318, cy: 900, s: 0.52, o: 1 },
  result: { cx: 540, cy: 800, s: 1, o: 1 },
  /** Small, top left: one of the two houses backing the government. */
  support: { cx: 300, cy: 560, s: 0.4, o: 1 },
  president: { cx: 540, cy: 560, s: 0.3, o: 0 },
} as const;
/** Outer radius and seat size of the half-circle at scale 1. */
export const CHAMBER_R_OUT = 400;
export const CHAMBER_DOT = 8;
/** The Senate is drawn smaller (half the seats) at the same scale. */
export const SENATE_R_OUT = 290;
