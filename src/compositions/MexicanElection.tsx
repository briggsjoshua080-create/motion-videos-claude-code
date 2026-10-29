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
  MX,
  MX_SUBTITLES,
  SCENE_ORDER,
  MEXICAN_ELECTION_DURATION,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/mexican-election/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/mexican-election/ui";
import { TitleScene } from "../scenes/mexican-election/TitleScene";
import { WhoScene } from "../scenes/mexican-election/WhoScene";
import { BallotScene } from "../scenes/mexican-election/BallotScene";
import { SeatsScene } from "../scenes/mexican-election/SeatsScene";
import { CongressScene } from "../scenes/mexican-election/CongressScene";
import { PresidentScene } from "../scenes/mexican-election/PresidentScene";
import { ResultScene } from "../scenes/mexican-election/ResultScene";
import { QuestionScene } from "../scenes/mexican-election/QuestionScene";

export { MEXICAN_ELECTION_DURATION };

/**
 * "How Mexico votes.": one six-year presidential term, never again, as the hook; who can vote
 * (18, a photo voter card, online from abroad, a duty with no fine); one ballot per race, marking a
 * party logo (or two in the same alliance); 300 district seats plus 200 shared by votes over 3%;
 * the Chamber of Deputies and the Senate; a president with no prime minister and no run-off;
 * elected judges since 2025; the 2024 result (Sheinbaum, the first woman president, and her
 * alliance's 54% of the votes but 73% of the deputies); and "Should 54% of the votes win 73% of
 * the seats?" as the closing debate, as one numbered story. The look is the Swedish video's (the
 * user's Belgian reference) in Mexico's green, white and red. Script, sources and storyboard:
 * briefs/mexican-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  seats: SeatsScene,
  congress: CongressScene,
  president: PresidentScene,
  result: ResultScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/mexican-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "one") - 3, volume: 0.13 },
  { file: "pop", at: at("hook", "Six") - 3, volume: 0.12 },
  { file: "thud", at: at("hook", "never") - 2, volume: 0.18 },
  ...["Citizens", "photo", "online"].map((word) => ({ file: "pop", at: at("who", word) - 4, volume: 0.13 })),
  { file: "scribble", at: at("who", "no") - 2, volume: 0.14 },
  { file: "pop", at: at("ballot", "own") - 5, volume: 0.13 },
  { file: "scribble", at: at("ballot", "Mark") - 2, volume: 0.14 },
  { file: "scribble", at: at("ballot", "two") - 2, volume: 0.14 },
  { file: "thud", at: at("ballot", "alliance") + 1, volume: 0.17 },
  { file: "pop", at: at("seats", "win") - 3, volume: 0.13 },
  { file: "pop", at: at("seats", "shared") - 3, volume: 0.13 },
  { file: "thud", at: at("seats", "3%") - 3, volume: 0.17 },
  { file: "pop", at: at("congress", "makes") - 4, volume: 0.12 },
  { file: "pop", at: at("congress", "sets") - 4, volume: 0.12 },
  { file: "thud", at: at("congress", "every") - 3, volume: 0.15 },
  { file: "scribble", at: at("president", "prime") - 2, volume: 0.13 },
  { file: "pop", at: at("president", "votes") - 3, volume: 0.13 },
  { file: "thud", at: at("president", "run-off") - 2, volume: 0.16 },
  { file: "pop", at: at("judges", "judges") - 3, volume: 0.14 },
  { file: "pop", at: at("result", "first") - 3, volume: 0.14 },
  { file: "pop", at: at("result", "alliance") - 2, volume: 0.14 },
  { file: "thud", at: at("result", "73%") - 3, volume: 0.17 },
  { file: "scribble", at: at("question", "seats") - 4, volume: 0.18 },
  { file: "chime", at: at("question", "seats", "end") + 4, volume: 0.2 },
];

export const MexicanElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: MX.bg }}>
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

    {/* Red-and-white sweeps over green (the flag's colours) open the video and the closing question, like the reference's colour wipes. */}
    <Sweep from={1} length={16} />
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Red is in the flag and reads on the green background: the standard red subtitle pill. */}
    <Subtitles timing={timing} hide={MX_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, MEXICAN_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
