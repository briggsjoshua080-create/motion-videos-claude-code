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
  POLISH_ELECTION_DURATION,
  SCENE_ORDER,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/polish-election/constants";
import { SejmLayer } from "../scenes/polish-election/SejmLayer";
import { TitleScene } from "../scenes/polish-election/TitleScene";
import { WhoScene } from "../scenes/polish-election/WhoScene";
import { BallotScene } from "../scenes/polish-election/BallotScene";
import { SeatsScene } from "../scenes/polish-election/SeatsScene";
import { SejmScene } from "../scenes/polish-election/SejmScene";
import { SenateScene } from "../scenes/polish-election/SenateScene";
import { ResultScene } from "../scenes/polish-election/ResultScene";
import { GovernmentScene } from "../scenes/polish-election/GovernmentScene";
import { PresidentScene } from "../scenes/polish-election/PresidentScene";
import { VetoScene } from "../scenes/polish-election/VetoScene";
import { QuestionScene } from "../scenes/polish-election/QuestionScene";

export { POLISH_ELECTION_DURATION };

/**
 * "Who runs Poland?": how Poland chooses who governs it, as one step-by-step story
 * (Vote -> Parliament -> Government -> President), in the white GermanElection look with Poland's
 * colours. Script, sources and storyboard: briefs/polish-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  seats: SeatsScene,
  sejm: SejmScene,
  senate: SenateScene,
  result: ResultScene,
  govt: GovernmentScene,
  president: PresidentScene,
  veto: VetoScene,
  question: QuestionScene,
};

const STEPS = [
  { label: "Vote", from: sceneFrom("who") },
  { label: "Parliament", from: sceneFrom("sejm") },
  { label: "Government", from: sceneFrom("result") },
  { label: "President", from: sceneFrom("president") },
];

const MUSIC_FILE = "audio/polish-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "votes") - 2, volume: 0.15 },
  { file: "thud", at: at("hook", "lost") - 1, volume: 0.2 },
  { file: "pop", at: at("hook", "How") - 2, volume: 0.18 },
  ...["Polish", "18", "home", "abroad"].map((word) => ({ file: "pop", at: at("who", word) - 3, volume: 0.13 })),
  { file: "pop", at: at("ballot", "main") - 2, volume: 0.12 },
  { file: "scribble", at: at("ballot", "cross") + 1, volume: 0.24 },
  { file: "pop", at: at("ballot", "candidate") - 2, volume: 0.13 },
  { file: "thud", at: at("seats", "5%") + 4, volume: 0.18 },
  { file: "pop", at: at("seats", "share") - 2, volume: 0.13 },
  { file: "pop", at: at("seats", "votes") + 2, volume: 0.12 },
  { file: "whoosh", at: at("seats", "most") - 4, volume: 0.1 },
  { file: "pop", at: at("seats", "candidates") - 2, volume: 0.15 },
  { file: "pop", at: at("seats", "candidates") + 3, volume: 0.13 },
  { file: "pop", at: at("sejm", "460") - 2, volume: 0.13 },
  { file: "pop", at: at("sejm", "make") - 2, volume: 0.15 },
  { file: "pop", at: at("sejm", "vote") - 2, volume: 0.15 },
  { file: "pop", at: at("senate", "Senate") - 2, volume: 0.13 },
  { file: "whoosh", at: at("senate", "per") - 2, volume: 0.1 },
  { file: "pop", at: at("senate", "amend") - 2, volume: 0.13 },
  { file: "pop", at: at("senate", "final") - 2, volume: 0.15 },
  { file: "pop", at: at("result", "2023") - 3, volume: 0.14 },
  { file: "pop", at: at("result", "Law") - 2, volume: 0.15 },
  { file: "pop", at: at("result", "first") - 2, volume: 0.15 },
  { file: "thud", at: at("result", "majority") - 2, volume: 0.2 },
  { file: "pop", at: at("govt", "teamed") - 2, volume: 0.16 },
  { file: "thud", at: at("govt", "down") - 2, volume: 0.2 },
  { file: "pop", at: at("govt", "elected") - 4, volume: 0.14 },
  { file: "chime", at: at("govt", "Donald"), volume: 0.14 },
  { file: "pop", at: at("president", "And") - 3, volume: 0.15 },
  { file: "pop", at: at("president", "Elected") - 3, volume: 0.13 },
  { file: "pop", at: at("president", "five") - 3, volume: 0.13 },
  { file: "pop", at: at("president", "two") - 3, volume: 0.13 },
  { file: "pop", at: at("president", "Karol") - 3, volume: 0.13 },
  { file: "chime", at: at("president", "2025"), volume: 0.14 },
  { file: "thud", at: at("veto", "veto") - 1, volume: 0.22 },
  { file: "pop", at: at("veto", "laws") - 2, volume: 0.12 },
  { file: "pop", at: at("veto", "overriding") - 2, volume: 0.13 },
  { file: "whoosh", at: at("veto", "three") - 2, volume: 0.1 },
  { file: "thud", at: at("veto", "government", "end") - 2, volume: 0.2 },
  { file: "chime", at: at("question", "govern", "end") + 4, volume: 0.2 },
];

export const PolishElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <Paper palette={PALETTE} />

    {/* The Sejm half-circle carries on from the seats scene to the veto. */}
    <Sequence name="Sejm half-circle" from={sceneFrom("seats")} durationInFrames={sceneFrom("question") + 4 - sceneFrom("seats")}>
      <SejmLayer offset={sceneFrom("seats")} />
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

    <StepHeader title="WHO RUNS POLAND?" steps={STEPS} appearAt={sceneFrom("who") - 4} allDoneAt={sceneFrom("question")} palette={PALETTE} />
    <Subtitles timing={timing} hide={NO_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, POLISH_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
