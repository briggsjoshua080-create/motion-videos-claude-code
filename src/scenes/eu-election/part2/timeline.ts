import type { VoiceTiming } from "../../../voiceover/timing";
import timingJson from "../../../voiceover/eu-election-part-2.timing.json";
import { makeTimeline } from "../timeline";

/**
 * EUElectionPart2 ("Commission + Laws"): the scene timeline and subtitle keywords, all derived
 * from src/voiceover/eu-election-part-2.timing.json.
 */
export const timing = timingJson as VoiceTiming;

export type SceneId = "title" | "recap" | "commission" | "leaders" | "elected" | "team" | "noDirect" | "laws" | "question";

export const P2 = makeTimeline<SceneId>(
  timing,
  ["title", "recap", "commission", "leaders", "elected", "team", "noDirect", "laws", "question"],
  {
    title: "hook",
    recap: "recap",
    commission: "commission",
    leaders: "leaders",
    elected: "elected",
    team: "team",
    noDirect: "notDirect",
    laws: "onlyCommission",
    question: "question",
  },
);

/** Words shown in the accent colour in the subtitle box, per sentence. */
export const KEYWORDS: Record<string, string[]> = {
  hook: ["really", "runs"],
  recap: ["18", "16", "elect", "european", "parliament"],
  commission: ["day", "european", "commission"],
  commissionJob: ["proposes", "laws", "money", "follow"],
  leaders: ["president", "leaders", "27", "direction"],
  elected: ["parliament", "votes", "2024", "ursula", "von", "der", "leyen", "401"],
  team: ["one", "commissioner", "approves", "team", "vote", "out"],
  notDirect: ["nobody", "directly"],
  onlyCommission: ["only", "commission", "propose"],
  decide: ["two", "sides", "parliament", "elect", "council", "ministers", "27"],
  both: ["both", "yes", "law"],
};
/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];
