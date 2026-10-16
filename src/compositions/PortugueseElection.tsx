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
  PORTUGUESE_ELECTION_DURATION,
  SCENE_ORDER,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/portuguese-election/constants";
import { AssemblyLayer } from "../scenes/portuguese-election/AssemblyLayer";
import { TitleScene } from "../scenes/portuguese-election/TitleScene";
import { WhoScene } from "../scenes/portuguese-election/WhoScene";
import { BallotScene } from "../scenes/portuguese-election/BallotScene";
import { SeatsScene } from "../scenes/portuguese-election/SeatsScene";
import { ParliamentScene } from "../scenes/portuguese-election/ParliamentScene";
import { ResultScene } from "../scenes/portuguese-election/ResultScene";
import { GovScene } from "../scenes/portuguese-election/GovScene";
import { PresidentScene } from "../scenes/portuguese-election/PresidentScene";
import { QuestionScene } from "../scenes/portuguese-election/QuestionScene";

export { PORTUGUESE_ELECTION_DURATION };

/**
 * "Who runs Portugal?": how Portugal chooses who governs it, as one step-by-step story
 * (Vote -> Parliament -> Government -> President), in the white GermanElection look with Portugal's
 * colours. Script, sources and storyboard: briefs/portuguese-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  seats: SeatsScene,
  parliament: ParliamentScene,
  result: ResultScene,
  gov: GovScene,
  president: PresidentScene,
  question: QuestionScene,
};

const STEPS = [
  { label: "Vote", from: sceneFrom("who") },
  { label: "Parliament", from: sceneFrom("parliament") },
  { label: "Government", from: sceneFrom("result") },
  { label: "President", from: sceneFrom("president") },
];

const MUSIC_FILE = "audio/portuguese-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "three") - 4, volume: 0.15 },
  { file: "pop", at: at("hook", "general") - 2, volume: 0.15 },
  { file: "pop", at: at("hook", "elections") - 2, volume: 0.15 },
  { file: "pop", at: at("hook", "calling") - 3, volume: 0.18 },
  ...["Portuguese", "18", "abroad", "Brazilians"].map((word) => ({ file: "pop", at: at("who", word) - 4, volume: 0.13 })),
  { file: "thud", at: at("ballot", "no") - 3, volume: 0.16 },
  { file: "pop", at: at("ballot", "parties") - 3, volume: 0.13 },
  { file: "scribble", at: at("ballot", "cross") - 2, volume: 0.24 },
  { file: "pop", at: at("seats", "22") - 4, volume: 0.14 },
  { file: "pop", at: at("seats", "Lisbon") - 4, volume: 0.14 },
  { file: "pop", at: at("seats", "Portalegre") - 4, volume: 0.14 },
  { file: "pop", at: at("parliament", "make") - 4, volume: 0.15 },
  { file: "pop", at: at("parliament", "bring") - 4, volume: 0.15 },
  { file: "thud", at: at("parliament", "second") - 2, volume: 0.16 },
  { file: "thud", at: at("result", "91") - 2, volume: 0.18 },
  { file: "pop", at: at("result", "short") - 4, volume: 0.14 },
  { file: "pop", at: at("gov", "need") - 4, volume: 0.14 },
  { file: "pop", at: at("gov", "President") - 6, volume: 0.14 },
  { file: "pop", at: at("gov", "governs") - 4, volume: 0.14 },
  { file: "chime", at: at("gov", "out", "end") + 2, volume: 0.12 },
  { file: "pop", at: at("president", "President") - 8, volume: 0.15 },
  { file: "chime", at: at("president", "Directly") - 3, volume: 0.12 },
  { file: "pop", at: at("president", "veto") - 4, volume: 0.15 },
  { file: "thud", at: at("president", "dissolve") - 4, volume: 0.2 },
  { file: "pop", at: at("president", "last") - 4, volume: 0.13 },
  { file: "pop", at: at("president", "last") + 1, volume: 0.13 },
  { file: "pop", at: at("president", "last") + 6, volume: 0.13 },
  { file: "chime", at: at("question", "polls", "end") + 4, volume: 0.2 },
];

export const PortugueseElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <Paper palette={PALETTE} />

    {/* The Assembly half-circle carries on from the Parliament step to the end of the Government step. */}
    <Sequence name="Assembly half-circle" from={sceneFrom("parliament")} durationInFrames={sceneFrom("president") + 6 - sceneFrom("parliament")}>
      <AssemblyLayer offset={sceneFrom("parliament")} />
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

    <StepHeader title="WHO RUNS PORTUGAL?" steps={STEPS} appearAt={sceneFrom("who") - 4} allDoneAt={sceneFrom("question")} palette={PALETTE} />
    <Subtitles timing={timing} hide={NO_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, PORTUGUESE_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
