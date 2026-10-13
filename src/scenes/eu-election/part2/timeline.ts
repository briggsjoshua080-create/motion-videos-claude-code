import type { VoiceTiming } from "../../../voiceover/timing";
import timingJson from "../../../voiceover/eu-election-part-2.timing.json";
import { makeTimeline } from "../timeline";

/**
 * EUElectionPart2 ("Commission + Laws"): the scene timeline, derived
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

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];
