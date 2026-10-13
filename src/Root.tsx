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
import { DutchElection, DUTCH_ELECTION_DURATION } from "./compositions/DutchElection";
import { EUElectionPart1, EU_ELECTION_PART1_DURATION } from "./compositions/EUElectionPart1";
import { EUElectionPart2, EU_ELECTION_PART2_DURATION } from "./compositions/EUElectionPart2";
import { UKElection, UK_ELECTION_DURATION } from "./compositions/UKElection";

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
    <Composition
      id="DutchElection"
      component={DutchElection}
      durationInFrames={DUTCH_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="EUElectionPart1"
      component={EUElectionPart1}
      durationInFrames={EU_ELECTION_PART1_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="EUElectionPart2"
      component={EUElectionPart2}
      durationInFrames={EU_ELECTION_PART2_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="UKElection"
      component={UKElection}
      durationInFrames={UK_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
  </>
);
