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
  ITALIAN_ELECTION_DURATION,
  NO_SUBTITLES,
  PALETTE,
  SCENE_ORDER,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/italian-election/constants";
import { ChamberLayer } from "../scenes/italian-election/ChamberLayer";
import { TitleScene } from "../scenes/italian-election/TitleScene";
import { WhoScene } from "../scenes/italian-election/WhoScene";
import { BallotScene } from "../scenes/italian-election/BallotScene";
import { SeatsScene } from "../scenes/italian-election/SeatsScene";
import { HousesScene } from "../scenes/italian-election/HousesScene";
import { ResultScene } from "../scenes/italian-election/ResultScene";
import { SupportScene } from "../scenes/italian-election/SupportScene";
import { PresidentScene } from "../scenes/italian-election/PresidentScene";
import { NewLawScene } from "../scenes/italian-election/NewLawScene";
import { QuestionScene } from "../scenes/italian-election/QuestionScene";

export { ITALIAN_ELECTION_DURATION };

/**
 * "Who runs Italy?": how Italy chooses who governs it, as one step-by-step story
 * (Vote -> Parliament -> Government -> President), in the white GermanElection look with Italy's
 * colours. Script, sources and storyboard: briefs/italian-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  seats: SeatsScene,
  houses: HousesScene,
  result: ResultScene,
  support: SupportScene,
  president: PresidentScene,
  newlaw: NewLawScene,
  question: QuestionScene,
};

const STEPS = [
  { label: "Vote", from: sceneFrom("who") },
  { label: "Parliament", from: sceneFrom("houses") },
  { label: "Government", from: sceneFrom("result") },
  { label: "President", from: sceneFrom("president") },
];

const MUSIC_FILE = "audio/italian-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "68") - 2, volume: 0.15 },
  { file: "pop", at: at("hook", "80") - 2, volume: 0.13 },
  { file: "pop", at: at("hook", "Who") - 2, volume: 0.18 },
  ...["Italian", "18", "home", "abroad"].map((word) => ({ file: "pop", at: at("who", word) - 3, volume: 0.13 })),
  { file: "pop", at: at("ballot", "two") - 4, volume: 0.14 },
  { file: "scribble", at: at("ballot", "cross") + 2, volume: 0.24 },
  { file: "pop", at: at("ballot", "counts") - 3, volume: 0.14 },
  { file: "pop", at: at("ballot", "local") - 2, volume: 0.14 },
  { file: "pop", at: at("seats", "Each") - 4, volume: 0.13 },
  { file: "pop", at: at("seats", "winner") - 2, volume: 0.15 },
  { file: "pop", at: at("seats", "shared") - 2, volume: 0.13 },
  { file: "pop", at: at("houses", "Senate") - 2, volume: 0.13 },
  { file: "pop", at: at("houses", "and") - 4, volume: 0.13 },
  { file: "pop", at: at("houses", "law") - 1, volume: 0.15 },
  { file: "pop", at: at("houses", "pass") + 1, volume: 0.15 },
  { file: "pop", at: at("result", "2022") - 3, volume: 0.14 },
  { file: "pop", at: at("result", "won") - 3, volume: 0.15 },
  { file: "pop", at: at("result", "44%") - 2, volume: 0.15 },
  { file: "chime", at: at("result", "Giorgia"), volume: 0.14 },
  { file: "pop", at: at("support", "back") - 2, volume: 0.15 },
  { file: "thud", at: at("support", "breaks"), volume: 0.24 },
  { file: "pop", at: at("support", "new") - 3, volume: 0.15 },
  { file: "scribble", at: at("support", "no") - 2, volume: 0.2 },
  { file: "pop", at: at("support", "That's") - 3, volume: 0.15 },
  { file: "pop", at: at("president", "President") - 6, volume: 0.16 },
  { file: "pop", at: at("president", "MPs") - 3, volume: 0.13 },
  { file: "pop", at: at("president", "regional") - 2, volume: 0.13 },
  { file: "pop", at: at("president", "seven") - 3, volume: 0.15 },
  { file: "chime", at: at("president", "Sergio"), volume: 0.14 },
  { file: "scribble", at: at("president", "signs"), volume: 0.2 },
  { file: "thud", at: at("president", "law") - 1, volume: 0.2 },
  { file: "pop", at: at("newlaw", "2027") - 3, volume: 0.16 },
  { file: "pop", at: at("newlaw", "2027") + 6, volume: 0.12 },
  { file: "pop", at: at("newlaw", "2027") + 16, volume: 0.12 },
  { file: "chime", at: at("question", "election", "end") + 4, volume: 0.2 },
];

export const ItalianElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <Paper palette={PALETTE} />

    {/* The Chamber half-circle carries on from the seats scene to the President. */}
    <Sequence name="Chamber half-circle" from={sceneFrom("seats")} durationInFrames={sceneFrom("president") + 20 - sceneFrom("seats")}>
      <ChamberLayer offset={sceneFrom("seats")} />
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

    <StepHeader title="WHO RUNS ITALY?" steps={STEPS} appearAt={sceneFrom("who") - 4} allDoneAt={sceneFrom("question")} palette={PALETTE} />
    <Subtitles timing={timing} hide={NO_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, ITALIAN_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
