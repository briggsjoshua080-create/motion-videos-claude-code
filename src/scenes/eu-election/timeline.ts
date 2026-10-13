import { getSentence, getWordTime, makeCue, type Cue, type VoiceTiming } from "../../voiceover/timing";
import { FPS, LEAD, TAIL } from "./constants";

export type Timeline<Id extends string> = {
  timing: VoiceTiming;
  order: readonly Id[];
  /** Total length in frames: the last word plus TAIL seconds. */
  duration: number;
  /** Composition frame at which each scene starts (the first scene starts at 0). */
  from: (id: Id) => number;
  /** Composition frame at which each scene ends (= the next one starts). */
  end: (id: Id) => number;
  /** Composition frame at which a sentence (or a word in it) starts or ends. "two#2" = second "two". */
  at: (sentence: string, word?: string, edge?: "start" | "end") => number;
  /** Scene-relative cue function for a scene. */
  cueFor: (id: Id) => Cue;
};

const toFrame = (seconds: number) => Math.round(seconds * FPS);

/**
 * Scene timeline derived from a voice-over timing file: every scene starts LEAD frames before its
 * first sentence, so nothing is hard-coded and re-generating the voice keeps everything in sync.
 */
export const makeTimeline = <Id extends string>(
  timing: VoiceTiming,
  order: readonly Id[],
  firstSentence: Record<Id, string>,
): Timeline<Id> => {
  const last = timing.sentences[timing.sentences.length - 1];
  const duration = toFrame(last.end + TAIL);
  const from = (id: Id) => (order.indexOf(id) === 0 ? 0 : toFrame(getSentence(timing, firstSentence[id]).start) - LEAD);
  const end = (id: Id) => {
    const next = order[order.indexOf(id) + 1];
    return next ? from(next) : duration;
  };
  const at = (sentence: string, word?: string, edge: "start" | "end" = "start") =>
    toFrame(word ? getWordTime(timing, sentence, word, edge) : getSentence(timing, sentence)[edge]);
  return { timing, order, duration, from, end, at, cueFor: (id) => makeCue(timing, FPS, from(id)) };
};
