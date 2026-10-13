/** Shape of the *.timing.json files written by scripts/voiceover.py (times in seconds). */
export type Word = { text: string; start: number; end: number };
export type Sentence = { id: string; text: string; start: number; end: number; words: Word[] };
export type VoiceTiming = {
  audio: string;
  voice: string;
  durationInSeconds: number;
  sentences: Sentence[];
};

/** Frame (relative to the current scene) at which a sentence, or a word in it, starts or ends. */
export type Cue = (sentenceId: string, word?: string, edge?: "start" | "end") => number;

/** Strips punctuation around a word: "officials," -> "officials". */
export const bareWord = (text: string): string => text.replace(/^["'(]+|[,.?!;:"')]+$/g, "");

export const getSentence = (timing: VoiceTiming, id: string): Sentence => {
  const sentence = timing.sentences.find((s) => s.id === id);
  if (!sentence) throw new Error(`Voice-over has no sentence "${id}"`);
  return sentence;
};

/**
 * Seconds at which `word` starts or ends (ignoring case and punctuation).
 * Use "two#2" for the second "two" in the sentence.
 */
export const getWordTime = (
  timing: VoiceTiming,
  sentenceId: string,
  word: string,
  edge: "start" | "end" = "start",
): number => {
  const [text, nth = "1"] = word.split("#");
  const matches = getSentence(timing, sentenceId).words.filter(
    (w) => bareWord(w.text).toLowerCase() === text.toLowerCase(),
  );
  const match = matches[Number(nth) - 1];
  if (!match) throw new Error(`Sentence "${sentenceId}" has no word "${word}"`);
  return match[edge];
};

/** Cue function for a scene that starts at frame `sceneStart` of the composition. */
export const makeCue =
  (timing: VoiceTiming, fps: number, sceneStart: number): Cue =>
  (sentenceId, word, edge = "start") => {
    const seconds = word
      ? getWordTime(timing, sentenceId, word, edge)
      : getSentence(timing, sentenceId)[edge];
    return Math.round(seconds * fps) - sceneStart;
  };
