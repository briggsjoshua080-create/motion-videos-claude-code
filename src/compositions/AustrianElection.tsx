import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { fadeInOut } from "../lib/animation";
import { makeCue } from "../voiceover/timing";
import { Paper } from "../components/explainer/Paper";
import { StepHeader } from "../components/explainer/StepHeader";
import { Subtitles } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
import {
  AUSTRIAN_ELECTION_DURATION,
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
} from "../scenes/austrian-election/constants";
import { CouncilLayer } from "../scenes/austrian-election/CouncilLayer";
import { TitleScene } from "../scenes/austrian-election/TitleScene";
import { WhoScene } from "../scenes/austrian-election/WhoScene";
import { BallotScene } from "../scenes/austrian-election/BallotScene";
import { SeatsScene } from "../scenes/austrian-election/SeatsScene";
import { CouncilScene } from "../scenes/austrian-election/CouncilScene";
import { FederalScene } from "../scenes/austrian-election/FederalScene";
import { ResultScene } from "../scenes/austrian-election/ResultScene";
import { TalksScene } from "../scenes/austrian-election/TalksScene";
import { PresidentScene } from "../scenes/austrian-election/PresidentScene";
import { QuestionScene } from "../scenes/austrian-election/QuestionScene";

export { AUSTRIAN_ELECTION_DURATION };

/**
 * "Who runs Austria?": how Austria chooses who governs it, as one step-by-step story
 * (Vote -> Parliament -> Government -> President), in the white GermanElection look with Austria's
 * colours. Script, sources and storyboard: briefs/austrian-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  seats: SeatsScene,
  council: CouncilScene,
  federal: FederalScene,
  result: ResultScene,
  talks: TalksScene,
  president: PresidentScene,
  question: QuestionScene,
};

const STEPS = [
  { label: "Vote", from: sceneFrom("who") },
  { label: "Parliament", from: sceneFrom("council") },
  { label: "Government", from: sceneFrom("result") },
  { label: "President", from: sceneFrom("president") },
];

const MUSIC_FILE = "audio/austrian-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "155") - 2, volume: 0.14 },
  { file: "pop", at: at("hook", "government") - 2, volume: 0.15 },
  { file: "pop", at: at("hook", "Why") - 2, volume: 0.18 },
  ...["Austrian", "16", "home", "abroad"].map((word) => ({ file: "pop", at: at("who", word) - 3, volume: 0.13 })),
  { file: "pop", at: at("noncitizens", "That") - 2, volume: 0.12 },
  { file: "thud", at: at("noncitizens", "five") - 1, volume: 0.2 },
  { file: "scribble", at: at("ballot", "cross") + 1, volume: 0.24 },
  { file: "scribble", at: at("ballot", "also") + 1, volume: 0.16 },
  { file: "pop", at: at("ballot", "three") + 5, volume: 0.12 },
  { file: "scribble", at: at("ballot", "its") + 1, volume: 0.16 },
  { file: "pop", at: at("seats", "shared") - 2, volume: 0.13 },
  { file: "pop", at: at("seats", "votes") + 2, volume: 0.12 },
  { file: "thud", at: at("seats", "4%") + 4, volume: 0.2 },
  { file: "pop", at: at("council", "National") - 2, volume: 0.13 },
  { file: "pop", at: at("council", "laws") - 2, volume: 0.15 },
  { file: "pop", at: at("council", "vote") - 2, volume: 0.15 },
  { file: "pop", at: at("federal", "Federal") - 2, volume: 0.13 },
  { file: "pop", at: at("federal", "nine") - 2, volume: 0.12 },
  { file: "thud", at: at("federal", "delay") - 1, volume: 0.18 },
  { file: "pop", at: at("result", "2024") - 3, volume: 0.14 },
  { file: "pop", at: at("result", "Freedom") - 2, volume: 0.15 },
  { file: "pop", at: at("result", "29%") - 2, volume: 0.15 },
  { file: "thud", at: at("result", "majority") - 2, volume: 0.2 },
  { file: "pop", at: at("talks", "Two") - 3, volume: 0.13 },
  { file: "thud", at: at("talks", "failed") - 4, volume: 0.2 },
  { file: "thud", at: at("talks", "failed") + 3, volume: 0.18 },
  { file: "pop", at: at("talks", "teamed") - 2, volume: 0.16 },
  { file: "chime", at: at("talks", "Christian"), volume: 0.14 },
  { file: "pop", at: at("president", "And") - 3, volume: 0.15 },
  { file: "pop", at: at("president", "Elected") - 3, volume: 0.13 },
  { file: "pop", at: at("president", "six") - 3, volume: 0.13 },
  { file: "pop", at: at("president", "run-off") - 3, volume: 0.13 },
  { file: "chime", at: at("president", "Alexander"), volume: 0.14 },
  { file: "pop", at: at("president", "appoints") - 2, volume: 0.15 },
  { file: "thud", at: at("president", "dismiss") - 2, volume: 0.2 },
  { file: "chime", at: at("question", "vote", "end") + 4, volume: 0.2 },
];

export const AustrianElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <Paper palette={PALETTE} />

    {/* The National Council half-circle carries on from the seats scene to the President. */}
    <Sequence name="National Council half-circle" from={sceneFrom("seats")} durationInFrames={sceneFrom("president") + 20 - sceneFrom("seats")}>
      <CouncilLayer offset={sceneFrom("seats")} />
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

    <StepHeader title="WHO RUNS AUSTRIA?" steps={STEPS} appearAt={sceneFrom("who") - 4} allDoneAt={sceneFrom("question")} palette={PALETTE} />
    <Subtitles timing={timing} hide={NO_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, AUSTRIAN_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
