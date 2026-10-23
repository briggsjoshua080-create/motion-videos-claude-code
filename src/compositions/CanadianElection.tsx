import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { fadeInOut } from "../lib/animation";
import { makeCue } from "../voiceover/timing";
import { Subtitles } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
// Same fonts as the Swedish video (Archivo Black, Instrument Serif, JetBrains Mono).
import "../scenes/swedish-election/fonts";
import {
  CA,
  CANADIAN_ELECTION_DURATION,
  FPS,
  NO_SUBTITLES,
  SCENE_ORDER,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/canadian-election/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/canadian-election/ui";
import { TitleScene } from "../scenes/canadian-election/TitleScene";
import { WhoScene } from "../scenes/canadian-election/WhoScene";
import { BallotScene } from "../scenes/canadian-election/BallotScene";
import { RidingScene } from "../scenes/canadian-election/RidingScene";
import { CommonsScene } from "../scenes/canadian-election/CommonsScene";
import { PmScene } from "../scenes/canadian-election/PmScene";
import { SenateScene } from "../scenes/canadian-election/SenateScene";
import { CrownScene } from "../scenes/canadian-election/CrownScene";
import { ResultScene } from "../scenes/canadian-election/ResultScene";
import { TwistScene } from "../scenes/canadian-election/TwistScene";
import { QuestionScene } from "../scenes/canadian-election/QuestionScene";

export { CANADIAN_ELECTION_DURATION };

/**
 * "How Canada votes.": who can vote, the one-riding ballot, first past the post, the House of
 * Commons, the prime minister, the Senate, the Crown, the 2025 result and the 2026 twist, as one
 * numbered story. The look is the Swedish video's (the user's Belgian reference) in the Canadian
 * flag's red and white. Script, sources and storyboard: briefs/canadian-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  riding: RidingScene,
  commons: CommonsScene,
  pm: PmScene,
  senate: SenateScene,
  crown: CrownScene,
  result: ResultScene,
  twist: TwistScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/canadian-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "thud", at: 0, volume: 0.16 },
  { file: "scribble", at: at("hook", "nobody") - 2, volume: 0.18 },
  ...["Canadian", "18", "abroad", "register"].map((word) => ({ file: "pop", at: at("who", word) - 4, volume: 0.13 })),
  { file: "pop", at: at("ballot", "ballot") - 2, volume: 0.12 },
  { file: "scribble", at: at("ballot", "circle") - 2, volume: 0.24 },
  { file: "pop", at: at("ballot", "one") - 2, volume: 0.12 },
  { file: "pop", at: at("riding", "wins") - 2, volume: 0.14 },
  { file: "thud", at: at("riding", "riding") - 4, volume: 0.16 },
  { file: "pop", at: at("riding", "half") - 2, volume: 0.13 },
  { file: "thud", at: at("commons", "House") - 2, volume: 0.15 },
  { file: "pop", at: at("commons", "laws") - 4, volume: 0.14 },
  { file: "pop", at: at("commons", "money") - 4, volume: 0.14 },
  { file: "pop", at: at("pm", "backs") - 6, volume: 0.13 },
  { file: "thud", at: at("pm", "172") - 2, volume: 0.17 },
  { file: "pop", at: at("pm", "majority") - 6, volume: 0.13 },
  { file: "thud", at: at("senate", "105") - 2, volume: 0.15 },
  ...["aren't", "picks", "review"].map((word) => ({ file: "pop", at: at("senate", word) - 2, volume: 0.13 })),
  { file: "pop", at: at("crown", "King") - 6, volume: 0.14 },
  { file: "pop", at: at("crown", "Governor") - 6, volume: 0.14 },
  { file: "scribble", at: at("crown", "signs") - 2, volume: 0.16 },
  { file: "thud", at: at("result", "169") - 3, volume: 0.18 },
  { file: "pop", at: at("result", "three") - 4, volume: 0.14 },
  { file: "thud", at: at("result", "majority") - 4, volume: 0.15 },
  { file: "pop", at: at("twist", "five") - 4, volume: 0.14 },
  { file: "pop", at: at("twist", "by-elections") - 4, volume: 0.14 },
  { file: "thud", at: at("twist", "majority") - 4, volume: 0.17 },
  { file: "scribble", at: at("question", "again") - 2, volume: 0.18 },
  { file: "chime", at: at("question", "again", "end") + 4, volume: 0.2 },
];

export const CanadianElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CA.bg }}>
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

    {/* Colour wipes open the video and the closing question, like the reference's. */}
    <Sweep from={1} length={16} />
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    <Subtitles timing={timing} hide={NO_SUBTITLES} highlight={CA.white} activeColor={CA.red} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, CANADIAN_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
