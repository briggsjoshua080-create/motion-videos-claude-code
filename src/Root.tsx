import React from "react";
import { Composition } from "remotion";
import { VIDEO, SAMPLE_DURATION_FRAMES } from "./config";
import { SampleShowcase, sampleDefaults } from "./compositions/SampleShowcase";
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
      id="WhyFranceVotesTwice"
      component={WhyFranceVotesTwice}
      durationInFrames={WHY_FRANCE_DURATION_FRAMES}
      fps={VIDEO.fps}
      width={WHY_FRANCE_SIZE.width}
      height={WHY_FRANCE_SIZE.height}
    />
  </>
);
