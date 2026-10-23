import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { fadeInOut } from "../lib/animation";
import { makeCue } from "../voiceover/timing";
import { Subtitles } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
import "../scenes/swedish-election/fonts";
import {
  FPS,
  NO_SUBTITLES,
  SCENE_ORDER,
  SE,
  SWEDISH_ELECTION_DURATION,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/swedish-election/constants";
import { Backdrop, Grain, Hud, YellowSweep } from "../scenes/swedish-election/ui";
import { TitleScene } from "../scenes/swedish-election/TitleScene";
import { WhoScene } from "../scenes/swedish-election/WhoScene";
import { BallotScene } from "../scenes/swedish-election/BallotScene";
import { RiksdagScene } from "../scenes/swedish-election/RiksdagScene";
import { PmScene } from "../scenes/swedish-election/PmScene";
import { KingScene } from "../scenes/swedish-election/KingScene";
import { ResultScene } from "../scenes/swedish-election/ResultScene";
import { NowScene } from "../scenes/swedish-election/NowScene";
import { QuestionScene } from "../scenes/swedish-election/QuestionScene";

export { SWEDISH_ELECTION_DURATION };

/**
 * "How Sweden votes.": who can vote, the one-paper-per-party ballot, the Riksdag, the prime
 * minister who needs no yes votes, the powerless King, the 2022 result and the 2026 deadlock, as
 * one numbered story. The look is the user's Belgian reference video (broadcast frame, glowing
 * headlines) in Sweden's flag colours. Script, sources and storyboard: briefs/swedish-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  riksdag: RiksdagScene,
  pm: PmScene,
  king: KingScene,
  result: ResultScene,
  now: NowScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/swedish-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "thud", at: 0, volume: 0.16 },
  { file: "scribble", at: at("hook", "single") - 2, volume: 0.18 },
  ...["Swedish", "18", "abroad", "Foreign"].map((word) => ({ file: "pop", at: at("who", word) - 4, volume: 0.13 })),
  ...[0, 1, 2].map((i) => ({ file: "pop", at: at("ballot", "party") - 4 + i * 4, volume: 0.12 })),
  { file: "pop", at: at("ballot", "yellow") - 3, volume: 0.13 },
  { file: "whoosh", at: at("ballot", "Pick") - 4, volume: 0.1 },
  { file: "scribble", at: at("ballot", "one") - 2, volume: 0.24 },
  { file: "pop", at: at("ballot", "if") - 2, volume: 0.13 },
  { file: "thud", at: at("ballot", "envelope") + 6, volume: 0.15 },
  { file: "pop", at: at("riksdag", "laws") - 4, volume: 0.14 },
  { file: "pop", at: at("riksdag", "budget") - 4, volume: 0.14 },
  { file: "thud", at: at("seats", "4%") - 2, volume: 0.17 },
  { file: "pop", at: at("seats", "39") - 2, volume: 0.15 },
  { file: "pop", at: at("pm", "Speaker") - 6, volume: 0.13 },
  { file: "pop", at: at("pm", "King") - 4, volume: 0.13 },
  { file: "pop", at: at("pm", "prime") - 4, volume: 0.13 },
  { file: "thud", at: at("pm", "vote") - 3, volume: 0.2 },
  { file: "pop", at: at("king", "head") - 2, volume: 0.13 },
  { file: "thud", at: at("king", "no") - 3, volume: 0.19 },
  { file: "pop", at: at("king", "laws") - 2, volume: 0.13 },
  { file: "thud", at: at("result", "176") - 3, volume: 0.18 },
  { file: "pop", at: at("result", "Ulf") - 6, volume: 0.14 },
  { file: "thud", at: at("now", "voted") - 4, volume: 0.2 },
  { file: "chime", at: at("question", "no", "end") + 4, volume: 0.2 },
];

export const SwedishElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: SE.blue }}>
    <Backdrop />

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

    {/* Yellow colour wipes open the video and the closing question, like the reference's. */}
    <YellowSweep from={1} length={16} />
    <YellowSweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    <Subtitles timing={timing} hide={NO_SUBTITLES} highlight={SE.yellow} activeColor={SE.ink} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, SWEDISH_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
