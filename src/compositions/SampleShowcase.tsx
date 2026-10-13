import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SAMPLE, SAMPLE_DURATION_FRAMES, sec } from "../config";
import { fadeInOut } from "../lib/animation";
import { IntroScene } from "../scenes/IntroScene";
import { ShapesScene } from "../scenes/ShapesScene";
import { OutroScene } from "../scenes/OutroScene";
import { theme } from "../theme";

export type SampleProps = {
  title: string;
  subtitle: string;
  heading: string;
  message: string;
  footer: string;
  /** Path inside /public, or empty string to disable audio. */
  audioFile: string;
};

export const sampleDefaults: SampleProps = {
  title: "Motion, Programmed",
  subtitle: "Built with Remotion + AI agents",
  heading: "Shapes in motion",
  message: "Ready to create",
  footer: "motion-videos-claude-code",
  audioFile: "audio/pad.mp3",
};

const t = () => linearTiming({ durationInFrames: sec(SAMPLE.transition) });

export const SampleShowcase: React.FC<SampleProps> = (p) => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={sec(SAMPLE.intro)}>
        <IntroScene title={p.title} subtitle={p.subtitle} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={t()} />
      <TransitionSeries.Sequence durationInFrames={sec(SAMPLE.shapes)}>
        <ShapesScene heading={p.heading} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={t()} />
      <TransitionSeries.Sequence durationInFrames={sec(SAMPLE.outro)}>
        <OutroScene message={p.message} footer={p.footer} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    {p.audioFile ? (
      <Audio
        src={staticFile(p.audioFile)}
        volume={(f) => 0.5 * fadeInOut(f, SAMPLE_DURATION_FRAMES, sec(1))}
      />
    ) : null}
  </AbsoluteFill>
);
