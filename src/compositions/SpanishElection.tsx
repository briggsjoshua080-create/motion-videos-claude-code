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
  SPANISH_ELECTION_DURATION,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/spanish-election/constants";
import { CongressLayer } from "../scenes/spanish-election/CongressLayer";
import { TitleScene } from "../scenes/spanish-election/TitleScene";
import { WhoScene } from "../scenes/spanish-election/WhoScene";
import { BallotScene } from "../scenes/spanish-election/BallotScene";
import { SeatsScene } from "../scenes/spanish-election/SeatsScene";
import { SenateScene } from "../scenes/spanish-election/SenateScene";
import { CongressScene } from "../scenes/spanish-election/CongressScene";
import { ResultScene } from "../scenes/spanish-election/ResultScene";
import { TalksScene } from "../scenes/spanish-election/TalksScene";
import { KingScene } from "../scenes/spanish-election/KingScene";
import { QuestionScene } from "../scenes/spanish-election/QuestionScene";

export { SPANISH_ELECTION_DURATION };

/**
 * "Who runs Spain?": how Spain chooses who governs it, as one step-by-step story
 * (Vote -> Parliament -> Government -> King), in the white GermanElection look with Spain's
 * colours. Script, sources and storyboard: briefs/spanish-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  seats: SeatsScene,
  senate: SenateScene,
  congress: CongressScene,
  result: ResultScene,
  talks: TalksScene,
  king: KingScene,
  question: QuestionScene,
};

const STEPS = [
  { label: "Vote", from: sceneFrom("who") },
  { label: "Parliament", from: sceneFrom("congress") },
  { label: "Government", from: sceneFrom("result") },
  { label: "King", from: sceneFrom("king") },
];

const MUSIC_FILE = "audio/spanish-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "party") - 4, volume: 0.15 },
  { file: "thud", at: at("hook", "first") - 3, volume: 0.18 },
  { file: "pop", at: at("hook", "man") - 4, volume: 0.15 },
  { file: "pop", at: at("hook", "How") - 3, volume: 0.18 },
  ...["Spaniards", "18", "even", "living"].map((word) => ({ file: "pop", at: at("who", word) - 4, volume: 0.13 })),
  { file: "pop", at: at("ballot", "two") - 4, volume: 0.13 },
  { file: "pop", at: at("ballot", "pick") - 2, volume: 0.13 },
  { file: "thud", at: at("ballot", "no") - 3, volume: 0.16 },
  { file: "whoosh", at: at("ballot", "drop") - 2, volume: 0.1 },
  { file: "thud", at: at("ballot", "envelope", "end") + 4, volume: 0.15 },
  { file: "pop", at: at("seats", "province") - 2, volume: 0.13 },
  { file: "thud", at: at("seats", "3%") + 2, volume: 0.18 },
  { file: "pop", at: at("senate", "Senate") - 4, volume: 0.13 },
  { file: "scribble", at: at("senate", "tick") - 1, volume: 0.24 },
  { file: "pop", at: at("congress", "make") - 4, volume: 0.15 },
  { file: "pop", at: at("congress", "elect") - 4, volume: 0.15 },
  { file: "pop", at: at("congress", "amend") - 3, volume: 0.13 },
  { file: "chime", at: at("congress", "last") - 3, volume: 0.12 },
  { file: "pop", at: at("result", "People's") - 4, volume: 0.15 },
  { file: "thud", at: at("result", "137") - 2, volume: 0.18 },
  { file: "pop", at: at("result", "short") - 4, volume: 0.14 },
  { file: "pop", at: at("talks", "leader") - 4, volume: 0.14 },
  { file: "thud", at: at("talks", "lost") - 2, volume: 0.2 },
  { file: "pop", at: at("talks", "Pedro") - 6, volume: 0.14 },
  { file: "chime", at: at("talks", "won") - 2, volume: 0.14 },
  { file: "pop", at: at("talks", "Sumar") - 3, volume: 0.12 },
  { file: "pop", at: at("talks", "regional") - 4, volume: 0.12 },
  { file: "pop", at: at("king", "King") - 8, volume: 0.15 },
  { file: "chime", at: at("king", "Felipe"), volume: 0.12 },
  { file: "pop", at: at("king", "inherited") - 3, volume: 0.13 },
  { file: "pop", at: at("king", "proposes") - 4, volume: 0.15 },
  { file: "pop", at: at("king", "signs") - 4, volume: 0.15 },
  { file: "thud", at: at("king", "block") - 4, volume: 0.2 },
  { file: "chime", at: at("question", "govern", "end") + 4, volume: 0.2 },
];

export const SpanishElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <Paper palette={PALETTE} />

    {/* The Congress half-circle carries on from the Congress step to the end of the Government step. */}
    <Sequence name="Congress half-circle" from={sceneFrom("congress")} durationInFrames={sceneFrom("king") + 6 - sceneFrom("congress")}>
      <CongressLayer offset={sceneFrom("congress")} />
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

    <StepHeader title="WHO RUNS SPAIN?" steps={STEPS} appearAt={sceneFrom("who") - 4} allDoneAt={sceneFrom("question")} palette={PALETTE} />
    <Subtitles timing={timing} hide={NO_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, SPANISH_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
