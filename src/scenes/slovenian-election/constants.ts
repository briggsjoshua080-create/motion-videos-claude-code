import { VERTICAL } from "../../config";
import { theme } from "../../theme";
import { getSentence, getWordTime, type Cue, type VoiceTiming } from "../../voiceover/timing";
import timingJson from "../../voiceover/slovenian-election.timing.json";

/** Every scene gets the voice-over cue function (scene-relative frames) and its own length. */
export type SceneProps = { cue: Cue; duration: number };

/**
 * SlovenianElection ("How Slovenia votes."): colours, fonts, layout, data and timing. The look is the
 * Swedish video's (the user's Belgian reference: broadcast frame, numbered sections, huge glowing
 * headlines), in the Slovenian flag's white, blue and red (with the gold of the coat of arms' stars). Every visual cue is looked up from the
 * voice-over timing (src/voiceover/slovenian-election.timing.json), never hard-coded.
 * Facts and sources: briefs/slovenian-election-system/.
 */
export const timing = timingJson as VoiceTiming;
export const FPS = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * FPS);

/** The flag's white, blue and red, the gold stars of the coat of arms, the deep blues of the background, and the light "paper" scenes. */
export const SI = {
  /** The flag's red, for accent blocks, wipe bands and the subtitle pill. */
  red: "#E1252C",
  redDeep: "#B81C22",
  /** The background: the flag's blue, darker towards the edges. */
  bg: "#0A4A9A",
  bgLight: "#1A62B8",
  bgDeep: "#06336E",
  bgNight: "#03224A",
  /** The flag's blue, for accents on paper. */
  blue: "#0A4A9A",
  /** The three stars of the coat of arms: a small accent only. */
  gold: "#FFD23F",
  white: "#FFFFFF",
  text: "#F4F8FF",
  textSoft: "rgba(236,243,255,0.8)",
  textFaint: "rgba(236,243,255,0.48)",
  line: "rgba(255,255,255,0.24)",
  glass: "rgba(2,16,44,0.38)",
  glassEdge: "rgba(255,255,255,0.18)",
  /** Dark text on paper. */
  ink: "#0B1838",
  inkSoft: "#4A5672",
  inkFaint: "rgba(11,24,56,0.38)",
  paper: "#F4F0E9",
  paperDeep: "#E4DCD0",
  card: "#FFFFFF",
  /** The ballot paper. */
  cream: "#FBF9F4",
} as const;

/** Archivo Black headlines, Instrument Serif italics, JetBrains Mono labels, Inter body text (loaded in the Swedish fonts.ts). */
export const FONT = {
  display: "'Archivo Black', 'Inter Variable', sans-serif",
  serif: "'Instrument Serif', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
  body: theme.font,
} as const;

/** Each scene starts this many frames before its first sentence, so visuals lead the voice. */
export const LEAD = 6;
/** Seconds the closing question stays up after the final word. */
const TAIL = 1.2;

export type SceneId = "title" | "who" | "ballot" | "seats" | "assembly" | "pm" | "president" | "result" | "question";
export const SCENE_ORDER: SceneId[] = ["title", "who", "ballot", "seats", "assembly", "pm", "president", "result", "question"];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const SLOVENIAN_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

/** Composition frame at which each scene starts (each scene is named after its first sentence; the title after "hook"). */
export const sceneFrom = (id: SceneId): number => (id === "title" ? 0 : toFrame(getSentence(timing, id).start) - LEAD);

/** Composition frame at which each scene ends (= the next one starts). */
export const sceneEnd = (id: SceneId): number => {
  const next = SCENE_ORDER[SCENE_ORDER.indexOf(id) + 1];
  return next ? sceneFrom(next) : SLOVENIAN_ELECTION_DURATION;
};

/** Composition frame at which a sentence (or a word in it) starts or ends. "a#2" = second "a". */
export const at = (sentence: string, word?: string, edge: "start" | "end" = "start"): number =>
  toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);

/** The closing question is already big on screen. */
export const SI_SUBTITLES = ["question"];

/** The numbered sections of the broadcast frame ("03 — THE BALLOT"). */
export const SECTIONS: { n: string; label: string; scene: SceneId }[] = [
  { n: "01", label: "HOW SLOVENIA VOTES", scene: "title" },
  { n: "02", label: "WHO CAN VOTE", scene: "who" },
  { n: "03", label: "THE BALLOT", scene: "ballot" },
  { n: "04", label: "THE SEATS", scene: "seats" },
  { n: "05", label: "THE PARLIAMENT", scene: "assembly" },
  { n: "06", label: "PRIME MINISTER", scene: "pm" },
  { n: "07", label: "THE PRESIDENT", scene: "president" },
  { n: "08", label: "THE RESULT", scene: "result" },
  { n: "09", label: "YOUR VERDICT", scene: "question" },
];

/** Scenes on light paper instead of blue. */
export const LIGHT_SCENES: SceneId[] = ["ballot", "result"];
/** Frames a background wipe takes. */
export const WIPE = 14;

/** The music's mallet plays one note every 0.75 s (80 bpm) from the second sentence on (scripts/music.py). */
export const BPM = 80;
export const BEAT_START = getSentence(timing, "who").start;

/** The National Assembly: 90 seats; 88 shared in proportion to votes by lists over 4%, 2 for the Italian and Hungarian communities. */
export const ASSEMBLY = 90;
export const LIST_SEATS = 88;
export const MINORITY_SEATS = 2;
export const THRESHOLD = 4;
/** 8 constituencies of 11 electoral districts each: one name per party on each district's ballot. */
export const CONSTITUENCIES = 8;
export const DISTRICTS = 11;
/** Electing a prime minister takes a majority of all deputies: 46 of 90 (secret ballot). */
export const MAJORITY = 46;
/** The National Council: 40 members chosen by interest groups; it can make the Assembly vote again on a law. */
export const COUNCIL = 40;

/** The hook: the Freedom Movement came first on 22 Mar 2026; Janša was elected PM on 22 May 2026. */
export const HOOK = { won: "22 MAR 2026", lost: "22 MAY 2026" } as const;

/** Made-up nationwide vote shares for the threshold example (no real parties). */
export const SHARES = [
  { party: "PARTY A", share: 30 },
  { party: "PARTY B", share: 26 },
  { party: "PARTY C", share: 11 },
  { party: "PARTY D", share: 6 },
  { party: "PARTY E", share: 3 },
  { party: "PARTY F", share: 2 },
] as const;

/** Made-up ballot of one electoral district: one candidate per party (no real parties or people). */
export const BALLOT_ROWS = [
  { name: "Candidate A", party: "Party A" },
  { name: "Candidate B", party: "Party B" },
  { name: "Candidate C", party: "Party C" },
  { name: "Candidate D", party: "Party D" },
  { name: "Candidate E", party: "Party E" },
] as const;
export const PICKED = 2;

/** Voters on the abroad list (6 Mar 2026, ODIHR) and turnout (DVK, 70.25%). */
export const VOTERS = { abroad: "115,392", turnout: "70.3%" } as const;

/**
 * National Assembly election of 22 Mar 2026, official DVK results, in hemicycle order from left to
 * right: the opposition, the minority MPs, Resni.ca (supports the government from outside), then
 * the coalition. Colours are approximate party colours, chosen to read on paper.
 */
export const RESULT_2026 = [
  { key: "LEV", name: "Levica & Vesna", seats: 5, color: "#9B1B30", coalition: false },
  { key: "SD", name: "Social Democrats", seats: 6, color: "#E1252C", coalition: false },
  { key: "GS", name: "Freedom Movement (Golob)", seats: 29, color: "#1E9BD7", coalition: false },
  { key: "MIN", name: "Italian & Hungarian MPs", seats: 2, color: "#8C8C8C", coalition: false },
  { key: "RES", name: "Resni.ca", seats: 5, color: "#6B7A2E", coalition: false },
  { key: "DEM", name: "Democrats", seats: 6, color: "#2BA39A", coalition: true },
  { key: "NSI", name: "NSi, SLS & Fokus", seats: 9, color: "#0D2F6B", coalition: true },
  { key: "SDS", name: "SDS (Janša)", seats: 28, color: "#E8A800", coalition: true },
] as const;
export const ELECTION_DATE = "22 MAR 2026";
/** The coalition's 43 seats, and Janša's 51 votes in the secret PM vote (22 May 2026). */
export const COALITION_SEATS = 43;
export const PM_VOTES = 51;

/** The presidency (checked 28 Oct 2026; see the brief). */
export const PRESIDENT = { term: 5, name: "NATAŠA PIRC MUSAR", since: "DEC 2022", next: "2027" } as const;
