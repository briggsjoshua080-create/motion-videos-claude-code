import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { bareWord, type VoiceTiming } from "../../voiceover/timing";
import { progress } from "./motion";
import type { ExplainerPalette } from "./palette";

type CaptionWord = { text: string; from: number; key: boolean };
type Chunk = { words: CaptionWord[]; from: number; to: number; until: number };

const ENDS_PHRASE = /[,.?!;:]$/;

const rgba = (hex: string, alpha: number) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Splits the narration into short phrases: at punctuation, and before the box gets too long. */
const buildChunks = (
  timing: VoiceTiming,
  fps: number,
  keywords: Record<string, string[]>,
  hide: string[],
  maxChars: number,
  end: number,
): Chunk[] => {
  const chunks: Chunk[] = [];
  for (const sentence of timing.sentences) {
    if (hide.includes(sentence.id)) continue;
    const keys = new Set((keywords[sentence.id] ?? []).map((k) => k.toLowerCase()));
    let current: { text: string; start: number; end: number; key: boolean }[] = [];
    const flush = () => {
      if (current.length === 0) return;
      chunks.push({
        words: current.map((w) => ({ text: w.text, from: Math.round(w.start * fps), key: w.key })),
        from: Math.round(current[0].start * fps),
        to: Math.round(current[current.length - 1].end * fps),
        until: 0,
      });
      current = [];
    };
    for (const w of sentence.words) {
      const chars = current.reduce((n, x) => n + x.text.length + 1, 0);
      if (current.length > 0 && chars + w.text.length > maxChars) flush();
      current.push({ text: w.text, start: w.start, end: w.end, key: keys.has(bareWord(w.text).toLowerCase()) });
      const length = current.reduce((n, x) => n + x.text.length + 1, 0);
      if (ENDS_PHRASE.test(w.text) && length >= 14) flush();
    }
    flush();
  }
  const hiddenStarts = timing.sentences.filter((s) => hide.includes(s.id)).map((s) => Math.round(s.start * fps));
  chunks.forEach((chunk, i) => {
    const next = chunks[i + 1];
    if (!next) chunk.until = end;
    else if (next.from - chunk.to < 24) chunk.until = next.from - 3;
    else chunk.until = chunk.to + 12;
    // A sentence without subtitles (e.g. the closing question) also ends the subtitle before it.
    const hidden = hiddenStarts.find((f) => f > chunk.to);
    if (hidden !== undefined) chunk.until = Math.min(chunk.until, hidden - 3);
  });
  return chunks;
};

/**
 * Burned-in subtitles in a dark rounded box (the GermanElection look), synced word by word to a
 * voice-over timing file: spoken words are solid, upcoming words dim, key words in the accent colour.
 */
export const CaptionBox: React.FC<{
  timing: VoiceTiming;
  palette: ExplainerPalette;
  /** Words to colour, per sentence id (compared without punctuation, ignoring case). */
  keywords?: Record<string, string[]>;
  /** Sentence ids without subtitles (e.g. when the words are already big on screen). */
  hide?: string[];
  centerY?: number;
  maxChars?: number;
}> = ({ timing, palette: c, keywords = {}, hide = [], centerY = 1395, maxChars = 34 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // Pass `keywords` and `hide` as module-level constants so this is only computed once.
  const chunks = useMemo(
    () => buildChunks(timing, fps, keywords, hide, maxChars, durationInFrames),
    [timing, fps, keywords, hide, maxChars, durationInFrames],
  );
  const chunk = chunks.find((ch) => frame >= ch.from - 3 && frame < ch.until);
  if (!chunk) return null;

  const inP = progress(frame, chunk.from - 3, chunk.from + 3);
  const outP = chunk.until === durationInFrames ? 0 : progress(frame, chunk.until - 5, chunk.until);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: centerY,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(-50%) scale(${0.96 + 0.04 * inP})`,
        opacity: inP * (1 - outP),
      }}
    >
      <div
        style={{
          maxWidth: 860,
          padding: "20px 34px",
          borderRadius: 26,
          background: rgba(c.ink, 0.92),
          boxShadow: `0 14px 40px ${rgba(c.ink, 0.18)}`,
          fontFamily: theme.font,
          fontSize: 50,
          fontWeight: 700,
          lineHeight: 1.22,
          letterSpacing: -0.5,
          textAlign: "center",
          textWrap: "balance",
          color: c.white,
        }}
      >
        {chunk.words.map((w, i) => {
          const spoken = progress(frame, w.from - 2, w.from + 3);
          return (
            <span
              key={`${w.text}-${i}`}
              style={{
                display: "inline-block",
                marginRight: i < chunk.words.length - 1 ? "0.26em" : 0,
                color: w.key ? c.accent : c.white,
                opacity: 0.38 + 0.62 * spoken,
                transform: `translateY(${(1 - spoken) * 5}px)`,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
