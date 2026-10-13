import type { VoiceTiming } from "../../../voiceover/timing";
import timingJson from "../../../voiceover/eu-election-part-1.timing.json";
import { makeTimeline } from "../timeline";

/**
 * EUElectionPart1 ("Vote + Parliament"): the scene timeline, derived
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

/** The closing question is already big on screen. */
export const NO_SUBTITLES = ["question"];
