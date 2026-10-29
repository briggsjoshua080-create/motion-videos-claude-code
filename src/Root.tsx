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
import { ItalianElection, ITALIAN_ELECTION_DURATION } from "./compositions/ItalianElection";
import { AustrianElection, AUSTRIAN_ELECTION_DURATION } from "./compositions/AustrianElection";
import { PolishElection, POLISH_ELECTION_DURATION } from "./compositions/PolishElection";
import { DanishElection, DANISH_ELECTION_DURATION } from "./compositions/DanishElection";
import { SpanishElection, SPANISH_ELECTION_DURATION } from "./compositions/SpanishElection";
import { PortugueseElection, PORTUGUESE_ELECTION_DURATION } from "./compositions/PortugueseElection";
import { SwedishElection, SWEDISH_ELECTION_DURATION } from "./compositions/SwedishElection";
import { USElection, US_ELECTION_DURATION } from "./compositions/USElection";
import { CanadianElection, CANADIAN_ELECTION_DURATION } from "./compositions/CanadianElection";
import { RomanianElection, ROMANIAN_ELECTION_DURATION } from "./compositions/RomanianElection";
import { NorwegianElection, NORWEGIAN_ELECTION_DURATION } from "./compositions/NorwegianElection";
import { SerbianElection, SERBIAN_ELECTION_DURATION } from "./compositions/SerbianElection";
import { SlovenianElection, SLOVENIAN_ELECTION_DURATION } from "./compositions/SlovenianElection";
import { MexicanElection, MEXICAN_ELECTION_DURATION } from "./compositions/MexicanElection";

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
    <Composition
      id="ItalianElection"
      component={ItalianElection}
      durationInFrames={ITALIAN_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="AustrianElection"
      component={AustrianElection}
      durationInFrames={AUSTRIAN_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="PolishElection"
      component={PolishElection}
      durationInFrames={POLISH_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="DanishElection"
      component={DanishElection}
      durationInFrames={DANISH_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="SpanishElection"
      component={SpanishElection}
      durationInFrames={SPANISH_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="PortugueseElection"
      component={PortugueseElection}
      durationInFrames={PORTUGUESE_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="SwedishElection"
      component={SwedishElection}
      durationInFrames={SWEDISH_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="USElection"
      component={USElection}
      durationInFrames={US_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="CanadianElection"
      component={CanadianElection}
      durationInFrames={CANADIAN_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="RomanianElection"
      component={RomanianElection}
      durationInFrames={ROMANIAN_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="NorwegianElection"
      component={NorwegianElection}
      durationInFrames={NORWEGIAN_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="SerbianElection"
      component={SerbianElection}
      durationInFrames={SERBIAN_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="SlovenianElection"
      component={SlovenianElection}
      durationInFrames={SLOVENIAN_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
    <Composition
      id="MexicanElection"
      component={MexicanElection}
      durationInFrames={MEXICAN_ELECTION_DURATION}
      fps={VERTICAL.fps}
      width={VERTICAL.width}
      height={VERTICAL.height}
    />
  </>
);
