import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { fadeInOut } from "../lib/animation";
import { makeCue } from "../voiceover/timing";
import { Subtitles } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
// Same fonts as the Swedish video (Archivo Black, Instrument Serif, JetBrains Mono).
import "../scenes/swedish-election/fonts";
import {
  FPS,
  RS,
  RS_SUBTITLES,
  SCENE_ORDER,
  SERBIAN_ELECTION_DURATION,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/serbian-election/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/serbian-election/ui";
import { TitleScene } from "../scenes/serbian-election/TitleScene";
import { WhoScene } from "../scenes/serbian-election/WhoScene";
import { BallotScene } from "../scenes/serbian-election/BallotScene";
import { SeatsScene } from "../scenes/serbian-election/SeatsScene";
import { AssemblyScene } from "../scenes/serbian-election/AssemblyScene";
import { PmScene } from "../scenes/serbian-election/PmScene";
import { PresidentScene } from "../scenes/serbian-election/PresidentScene";
import { ResultScene } from "../scenes/serbian-election/ResultScene";
import { QuestionScene } from "../scenes/serbian-election/QuestionScene";

export { SERBIAN_ELECTION_DURATION };

/**
 * "How Serbia votes.": a president who quit to run for prime minister and lost to the Student List
 * as the hook, who can vote, one ballot (circle one number) and invisible ink on the finger, one
 * nationwide district with a 3% line (minority lists exempt), the 250-seat National Assembly, a
 * prime minister who needs 126 votes, a directly elected president with a run-off, the 25 Oct
 * 2026 snap election result, and a movement with no clear leader as the closing debate, as one
 * numbered story. The look is the Swedish video's (the user's Belgian reference) in Serbia's blue,
 * red and white. Script, sources and storyboard: briefs/serbian-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  seats: SeatsScene,
  assembly: AssemblyScene,
  pm: PmScene,
  president: PresidentScene,
  result: ResultScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/serbian-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "quit") - 3, volume: 0.13 },
  { file: "pop", at: at("hook", "lost") - 3, volume: 0.13 },
  { file: "thud", at: at("hook", "students") - 2, volume: 0.18 },
  ...["Citizens", "18", "abroad"].map((word) => ({ file: "pop", at: at("who", word) - 4, volume: 0.13 })),
  { file: "scribble", at: at("ballot", "Circle") - 2, volume: 0.14 },
  { file: "pop", at: at("ballot", "list") - 4, volume: 0.12 },
  { file: "whoosh", at: at("ballot", "invisible") - 4, volume: 0.08 },
  { file: "thud", at: at("ballot", "twice") - 2, volume: 0.18 },
  { file: "thud", at: at("seats", "3%") - 3, volume: 0.17 },
  { file: "pop", at: at("seats", "share") - 3, volume: 0.13 },
  { file: "pop", at: at("seats", "Minority") - 3, volume: 0.14 },
  { file: "pop", at: at("assembly", "makes") - 4, volume: 0.12 },
  { file: "pop", at: at("assembly", "passes") - 4, volume: 0.12 },
  { file: "pop", at: at("assembly", "elects") - 4, volume: 0.12 },
  { file: "pop", at: at("pm", "proposed") - 2, volume: 0.13 },
  { file: "thud", at: at("pm", "majority") - 2, volume: 0.18 },
  { file: "pop", at: at("president", "half") - 2, volume: 0.13 },
  { file: "pop", at: at("president", "back") - 2, volume: 0.12 },
  { file: "thud", at: at("president", "block") - 2, volume: 0.16 },
  { file: "pop", at: at("result", "140") - 4, volume: 0.14 },
  { file: "pop", at: at("result", "104") - 4, volume: 0.14 },
  { file: "pop", at: at("question", "December") - 2, volume: 0.13 },
  { file: "scribble", at: at("question", "run") - 2, volume: 0.18 },
  { file: "chime", at: at("question", "country", "end") + 4, volume: 0.2 },
];

export const SerbianElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: RS.bg }}>
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

    {/* Red-and-white sweeps (the flag's colours) open the video and the closing question, like the reference's colour wipes. */}
    <Sweep from={1} length={16} />
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Red is in the flag and reads on the blue background: the standard red subtitle pill. */}
    <Subtitles timing={timing} hide={RS_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, SERBIAN_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
