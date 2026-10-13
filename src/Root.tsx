import React from "react";
import { Composition } from "remotion";
import { VIDEO, VERTICAL, SAMPLE_DURATION_FRAMES } from "./config";
import { SampleShowcase, sampleDefaults } from "./compositions/SampleShowcase";
import {
  GermanElection,
  germanElectionDefaults,
  GERMAN_ELECTION_DURATION,
} from "./compositions/GermanElection";
import {
  WhyFranceVotesTwice,
  WHY_FRANCE_DURATION_FRAMES,
  WHY_FRANCE_SIZE,
} from "./compositions/WhyFranceVotesTwice";

/**
 * Register every composition here. To add one:
 * 1. create src/compositions/MyVideo.tsx
 * 2. add a <Composition id="MyVideo" ... /> below
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="SampleShowcase"
      component={SampleShowcase}
      durationInFrames={SAMPLE_DURATION_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={sampleDefaults}
    />
    <Composition
      id="GermanElection"
      component={GermanElection}
      durationInFrames={GERMAN_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
      defaultProps={germanElectionDefaults}
    />
    <Composition
      id="WhyFranceVotesTwice"
      component={WhyFranceVotesTwice}
      durationInFrames={WHY_FRANCE_DURATION_FRAMES}
      fps={VIDEO.fps}
      width={WHY_FRANCE_SIZE.width}
      height={WHY_FRANCE_SIZE.height}
    />
  </>
);
