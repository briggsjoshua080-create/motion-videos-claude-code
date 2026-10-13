import type { VoiceTiming } from "../../../voiceover/timing";
import timingJson from "../../../voiceover/eu-election-part-1.timing.json";
import { makeTimeline } from "../timeline";

/**
 * EUElectionPart1 ("Vote + Parliament"): the scene timeline and subtitle keywords, all derived
 * from src/voiceover/eu-election-part-1.timing.json.
 */
export const timing = timingJson as VoiceTiming;

export type SceneId = "title" | "who" | "ballot" | "seats" | "parliament" | "perPerson" | "question";

export const P1 = makeTimeline<SceneId>(timing, ["title", "who", "ballot", "seats", "parliament", "perPerson", "question"], {
  title: "hook",
  who: "who",
  ballot: "vote",
  seats: "seats",
  parliament: "meps",
  perPerson: "perPerson",
  question: "question",
});

/** Words shown in the accent colour in the subtitle box, per sentence. */
export const KEYWORDS: Record<string, string[]> = {
  hook: ["27", "one", "parliament"],
  who: ["eu", "18", "16", "wherever"],
  vote: ["five", "own", "parties"],
  ballot: ["differ", "one", "party"],
  seats: ["seats", "votes"],
  big: ["germany", "96", "malta", "6"],
  meps: ["720", "meps", "european", "parliament"],
  groups: ["political", "groups", "country"],
  job: ["laws", "budget"],
  result: ["2024", "epp", "188", "majority", "361", "team", "up"],
  perPerson: ["malta", "nine", "germany"],
};
/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];
