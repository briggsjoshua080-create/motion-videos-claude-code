import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, LAYOUT, SENTENCE_ORDER, TIMELINE, Word } from "../../compositions/german-election/constants";
import { progress } from "./motion";

type Chunk = { words: Word[]; from: number; to: number; until: number };

/** Split each sentence at its "|" markers (word.line) into subtitle chunks with display windows. */
const buildChunks = (): Chunk[] => {
  const chunks: Chunk[] = [];
  for (const id of SENTENCE_ORDER) {
    const s = TIMELINE.sentences[id];
    const lines = [...new Set(s.words.map((w) => w.line))];
    for (const line of lines) {
      const words = s.words.filter((w) => w.line === line);
      chunks.push({ words, from: words[0].from, to: words[words.length - 1].to, until: 0 });
    }
  }
  chunks.forEach((c, i) => {
    const next = chunks[i + 1];
    if (!next) c.until = TIMELINE.durationInFrames;
    else if (next.from - c.to < 24) c.until = next.from - 3;
    else c.until = c.to + 12;
  });
  return chunks;
};

const CHUNKS = buildChunks();

/**
 * Burned-in subtitles, synced word by word to the voice-over.
 * Spoken words are solid, upcoming words dim; key words are gold.
 */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const chunk = CHUNKS.find((c) => frame >= c.from - 3 && frame < c.until);
  if (!chunk) return null;

  const inP = progress(frame, chunk.from - 3, chunk.from + 3);
  const outP = chunk.until === TIMELINE.durationInFrames ? 0 : progress(frame, chunk.until - 5, chunk.until);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: LAYOUT.subtitleCenterY,
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
          background: "rgba(22, 22, 26, 0.92)",
          boxShadow: "0 14px 40px rgba(22, 22, 26, 0.18)",
          fontFamily: FONT,
          fontSize: 50,
          fontWeight: 700,
          lineHeight: 1.22,
          letterSpacing: -0.5,
          textAlign: "center",
          textWrap: "balance",
          color: COLORS.white,
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
                color: w.hl ? COLORS.gold : COLORS.white,
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
