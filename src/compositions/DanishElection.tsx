import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { fadeInOut } from "../lib/animation";
import { makeCue } from "../voiceover/timing";
import { Paper } from "../components/explainer/Paper";
import { StepHeader } from "../components/explainer/StepHeader";
import { Subtitles } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
import {
  DANISH_ELECTION_DURATION,
  FPS,
  NO_SUBTITLES,
  PALETTE,
  SCENE_ORDER,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/danish-election/constants";
import { FolketingLayer } from "../scenes/danish-election/FolketingLayer";
import { TitleScene } from "../scenes/danish-election/TitleScene";
import { WhoScene } from "../scenes/danish-election/WhoScene";
import { BallotScene } from "../scenes/danish-election/BallotScene";
import { SeatsScene } from "../scenes/danish-election/SeatsScene";
import { FolketingScene } from "../scenes/danish-election/FolketingScene";
import { ResultScene } from "../scenes/danish-election/ResultScene";
import { TalksScene } from "../scenes/danish-election/TalksScene";
import { MinorityScene } from "../scenes/danish-election/MinorityScene";
import { KingScene } from "../scenes/danish-election/KingScene";
import { QuestionScene } from "../scenes/danish-election/QuestionScene";

export { DANISH_ELECTION_DURATION };

/**
 * "Who runs Denmark?": how Denmark chooses who governs it, as one step-by-step story
 * (Vote -> Folketing -> Government -> King), in the white GermanElection look with Denmark's
 * colours. Script, sources and storyboard: briefs/danish-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  seats: SeatsScene,
  folketing: FolketingScene,
  result: ResultScene,
  talks: TalksScene,
  minority: MinorityScene,
  king: KingScene,
  question: QuestionScene,
};

const STEPS = [
  { label: "Vote", from: sceneFrom("who") },
  { label: "Folketing", from: sceneFrom("folketing") },
  { label: "Government", from: sceneFrom("result") },
  { label: "King", from: sceneFrom("king") },
];

const MUSIC_FILE = "audio/danish-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "179") - 2, volume: 0.15 },
  { file: "thud", at: at("hook", "seats") - 1, volume: 0.18 },
  { file: "pop", at: at("hook", "normal") - 3, volume: 0.16 },
  { file: "pop", at: at("hook", "Why") - 3, volume: 0.18 },
  ...["Danish", "18", "living", "not"].map((word) => ({ file: "pop", at: at("who", word) - 3, volume: 0.13 })),
  { file: "pop", at: at("ballot", "ballot") - 4, volume: 0.12 },
  { file: "scribble", at: at("ballot", "next") + 1, volume: 0.24 },
  { file: "pop", at: at("ballot", "or") - 2, volume: 0.13 },
  { file: "scribble", at: at("ballot", "next#2") + 5, volume: 0.22 },
  { file: "thud", at: at("seats", "2%") + 4, volume: 0.18 },
  { file: "pop", at: at("seats", "share") - 2, volume: 0.13 },
  { file: "pop", at: at("seats", "nationwide") - 2, volume: 0.13 },
  { file: "pop", at: at("folketing", "Folketing") - 4, volume: 0.13 },
  { file: "pop", at: at("folketing", "only") - 3, volume: 0.13 },
  { file: "pop", at: at("folketing", "makes") - 4, volume: 0.15 },
  { file: "pop", at: at("folketing", "checks") - 4, volume: 0.15 },
  { file: "pop", at: at("result", "2026") - 4, volume: 0.14 },
  { file: "whoosh", at: at("result", "twelve") - 4, volume: 0.1 },
  { file: "pop", at: at("result", "Social") - 2, volume: 0.15 },
  { file: "thud", at: at("result", "38") - 2, volume: 0.18 },
  { file: "pop", at: at("talks", "King") - 8, volume: 0.15 },
  ...["three", "times", "pick"].map((word, k) => ({ file: "pop", at: at("talks", word) + (k === 0 ? -2 : 2), volume: 0.13 })),
  { file: "thud", at: at("talks", "negotiator") - 2, volume: 0.16 },
  { file: "thud", at: at("talks", "negotiator") + 6, volume: 0.16 },
  { file: "pop", at: at("talks", "negotiator") + 14, volume: 0.16 },
  { file: "pop", at: at("talks", "record") + 4, volume: 0.15 },
  { file: "chime", at: at("talks", "Mette"), volume: 0.14 },
  { file: "pop", at: at("minority", "without") - 6, volume: 0.13 },
  { file: "thud", at: at("minority", "behind") - 2, volume: 0.18 },
  { file: "pop", at: at("minority", "no") - 6, volume: 0.13 },
  { file: "chime", at: at("minority", "against") - 2, volume: 0.14 },
  { file: "pop", at: at("king", "King") - 8, volume: 0.15 },
  { file: "chime", at: at("king", "Frederik"), volume: 0.12 },
  { file: "pop", at: at("king", "inherited") - 3, volume: 0.13 },
  { file: "pop", at: at("king", "signs") - 4, volume: 0.15 },
  { file: "thud", at: at("king", "block") - 4, volume: 0.2 },
  { file: "chime", at: at("question", "it", "end") + 4, volume: 0.2 },
];

export const DanishElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <Paper palette={PALETTE} />

    {/* The Folketing half-circle carries on from the seats scene to the minority-government step. */}
    <Sequence name="Folketing half-circle" from={sceneFrom("seats")} durationInFrames={sceneFrom("king") + 6 - sceneFrom("seats")}>
      <FolketingLayer offset={sceneFrom("seats")} />
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

    <StepHeader title="WHO RUNS DENMARK?" steps={STEPS} appearAt={sceneFrom("who") - 4} allDoneAt={sceneFrom("question")} palette={PALETTE} />
    <Subtitles timing={timing} hide={NO_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, DANISH_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
