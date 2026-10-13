import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { bareWord, type VoiceTiming, type Word } from "../voiceover/timing";

type Page = { words: Word[]; start: number; end: number };

const ENDS_PHRASE = /[,.?!;:]$/;

/** Splits the narration into short caption pages: a few words each, never across a pause. */
const buildPages = (timing: VoiceTiming, hide: string[], maxWords: number, maxChars: number): Page[] => {
  const pages: Page[] = [];
  for (const sentence of timing.sentences) {
    if (hide.includes(sentence.id)) continue;
    let current: Word[] = [];
    const flush = () => {
      if (current.length === 0) return;
      pages.push({ words: current, start: current[0].start, end: current[current.length - 1].end });
      current = [];
    };
    for (const word of sentence.words) {
      const chars = [...current, word].reduce((n, w) => n + bareWord(w.text).length, 0);
      if (current.length >= maxWords || (current.length > 0 && chars > maxChars)) flush();
      current.push(word);
      if (ENDS_PHRASE.test(word.text)) flush();
    }
    flush();
  }
  // A page stays up until the next one starts, unless a long pause comes first.
  return pages.map((page, i) => {
    const next = pages[i + 1];
    return { ...page, end: next && next.start - page.end < 0.6 ? next.start : page.end + 0.35 };
  });
};

/** "officials," -> "OFFICIALS" (keeps ? and %). */
const label = (text: string) => text.replace(/[,.;:!]+$/, "").toUpperCase();

/**
 * TikTok-style burned-in subtitles: big bold words, a few at a time, with the word
 * being spoken highlighted. Driven by a voice-over timing file.
 */
export const Subtitles: React.FC<{
  timing: VoiceTiming;
  /** Sentence ids to leave without subtitles (e.g. when the text is already on screen). */
  hide?: string[];
  /** Vertical centre of the subtitle block, in px. */
  centerY?: number;
  fontSize?: number;
  maxWords?: number;
  maxChars?: number;
  highlight?: string;
}> = ({ timing, hide = [], centerY = 1330, fontSize = 74, maxWords = 3, maxChars = 16, highlight = "#ef4135" }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const hideKey = hide.join("|");
  const pages = useMemo(
    () => buildPages(timing, hideKey ? hideKey.split("|") : [], maxWords, maxChars),
    [timing, hideKey, maxWords, maxChars],
  );

  const t = frame / fps;
  const page = pages.find((p) => t >= p.start && t < p.end);
  if (!page) return null;

  const pop = interpolate(frame - page.start * fps, [0, 5], [0.86, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const active = page.words.reduce((current, w, i) => (t >= w.start ? i : current), 0);
  const boxWidth = Math.min(820, width - 240);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: (width - boxWidth) / 2,
          width: boxWidth,
          top: centerY,
          transform: `translateY(-50%) scale(${pop})`,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: `${fontSize * 0.12}px ${fontSize * 0.22}px`,
          fontFamily: theme.font,
          fontSize,
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: -fontSize * 0.01,
        }}
      >
        {page.words.map((w, i) => (
          <span
            key={`${w.start}-${i}`}
            style={{
              display: "inline-block",
              padding: `0 ${fontSize * 0.16}px`,
              borderRadius: fontSize * 0.2,
              color: "#ffffff",
              background: i === active ? highlight : "transparent",
              transform: `scale(${i === active ? 1.06 : 1})`,
              textShadow: i === active ? "none" : "0 4px 0 rgba(0,0,0,0.35), 0 0 22px rgba(0,0,0,0.55)",
            }}
          >
            {label(w.text)}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
