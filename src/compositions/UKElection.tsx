import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { fadeInOut } from "../lib/animation";
import { makeCue } from "../voiceover/timing";
import { Paper } from "../components/explainer/Paper";
import { StepHeader } from "../components/explainer/StepHeader";
import { Subtitles } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
import {
  FPS,
  NO_SUBTITLES,
  PALETTE,
  SCENE_ORDER,
  UK_ELECTION_DURATION,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/uk-election/constants";
import { CommonsLayer } from "../scenes/uk-election/CommonsLayer";
import { TitleScene } from "../scenes/uk-election/TitleScene";
import { WhoScene } from "../scenes/uk-election/WhoScene";
import { BallotScene } from "../scenes/uk-election/BallotScene";
import { CountScene } from "../scenes/uk-election/CountScene";
import { CommonsScene } from "../scenes/uk-election/CommonsScene";
import { DevolvedScene } from "../scenes/uk-election/DevolvedScene";
import { LordsScene } from "../scenes/uk-election/LordsScene";
import { GovernmentScene } from "../scenes/uk-election/GovernmentScene";
import { KingScene } from "../scenes/uk-election/KingScene";
import { QuestionScene } from "../scenes/uk-election/QuestionScene";

export { UK_ELECTION_DURATION };

/**
 * "UK election system": how the UK chooses who governs it, as one step-by-step story
 * (Vote -> Parliament -> Government -> King), in the white GermanElection look with UK colours.
 * Script, sources and storyboard: briefs/uk-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  count: CountScene,
  commons: CommonsScene,
  devolved: DevolvedScene,
  lords: LordsScene,
  government: GovernmentScene,
  king: KingScene,
  question: QuestionScene,
};

const STEPS = [
  { label: "Vote", from: sceneFrom("who") },
  { label: "Parliament", from: sceneFrom("commons") },
  { label: "Government", from: sceneFrom("government") },
  { label: "King", from: sceneFrom("king") },
];

const MUSIC_FILE = "audio/uk-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "two-thirds"), volume: 0.15 },
  { file: "pop", at: at("hook", "third"), volume: 0.15 },
  { file: "pop", at: at("hook", "How") - 2, volume: 0.18 },
  ...["18", "British", "UK", "Britons"].map((word) => ({ file: "pop", at: at("who", word) - 3, volume: 0.13 })),
  { file: "pop", at: at("ballot", "650"), volume: 0.14 },
  { file: "pop", at: at("ballot", "each") - 2, volume: 0.15 },
  { file: "scribble", at: at("ballot", "cross"), volume: 0.24 },
  { file: "pop", at: at("ballot", "candidate") - 3, volume: 0.14 },
  { file: "pop", at: at("fptp", "wins") - 2, volume: 0.16 },
  { file: "thud", at: at("fptp", "nothing") - 3, volume: 0.24 },
  { file: "pop", at: at("commons", "House") - 3, volume: 0.14 },
  ...["makes", "checks"].map((word) => ({ file: "pop", at: at("commons", word) - 3, volume: 0.14 })),
  ...["Scotland", "Wales", "Northern"].map((word) => ({ file: "pop", at: at("devolved", word) - 2, volume: 0.14 })),
  { file: "pop", at: at("devolved", "things") - 3, volume: 0.13 },
  { file: "thud", at: at("devolved", "doesn't") - 2, volume: 0.24 },
  { file: "pop", at: at("lords", "Lords") - 2, volume: 0.14 },
  { file: "whoosh", at: at("lords", "also") - 2, volume: 0.1 },
  { file: "thud", at: at("lords", "isn't"), volume: 0.24 },
  { file: "pop", at: at("lords", "delay") - 3, volume: 0.15 },
  { file: "pop", at: at("result", "2024") - 3, volume: 0.14 },
  { file: "pop", at: at("result", "seats") - 2, volume: 0.15 },
  { file: "chime", at: at("result", "Keir"), volume: 0.14 },
  { file: "chime", at: at("result", "Andy"), volume: 0.16 },
  { file: "pop", at: at("king", "head") - 5, volume: 0.16 },
  { file: "scribble", at: at("king", "inherited"), volume: 0.2 },
  { file: "chime", at: at("king", "Charles"), volume: 0.14 },
  { file: "pop", at: at("king", "crown") - 2, volume: 0.14 },
  { file: "thud", at: at("king", "approves"), volume: 0.24 },
  { file: "pop", at: at("king", "stays") - 3, volume: 0.15 },
  { file: "chime", at: at("question", "seats", "end") + 4, volume: 0.2 },
];

export const UKElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <Paper palette={PALETTE} />

    {/* The Commons half-circle carries on from the Parliament step to the King. */}
    <Sequence name="Commons half-circle" from={sceneFrom("commons")} durationInFrames={sceneFrom("king") + 20 - sceneFrom("commons")}>
      <CommonsLayer offset={sceneFrom("commons")} />
    </Sequence>

    {SCENE_ORDER.map((id) => {
      const from = sceneFrom(id);
      const duration = sceneEnd(id) - from;
      const Scene = SCENES[id];
      return (
        <Sequence key={id} name={id} from={from} durationInFrames={duration + (id === "question" ? 0 : EXIT_FRAMES)}>
          <Scene cue={makeCue(timing, FPS, from)} duration={duration} />
        </Sequence>
      );
    })}

    <StepHeader title="UK ELECTION SYSTEM" steps={STEPS} appearAt={sceneFrom("who") - 4} allDoneAt={sceneFrom("question")} palette={PALETTE} />
    <Subtitles timing={timing} hide={NO_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, UK_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
