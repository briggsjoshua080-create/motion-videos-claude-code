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
  NO_SUBTITLES,
  SCENE_ORDER,
  US,
  US_ELECTION_DURATION,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/us-election/constants";
import { Backdrop, Grain, Hud, RedSweep } from "../scenes/us-election/ui";
import { TitleScene } from "../scenes/us-election/TitleScene";
import { WhoScene } from "../scenes/us-election/WhoScene";
import { BallotScene } from "../scenes/us-election/BallotScene";
import { CongressScene } from "../scenes/us-election/CongressScene";
import { ElectorsScene } from "../scenes/us-election/ElectorsScene";
import { PresidentScene } from "../scenes/us-election/PresidentScene";
import { ResultScene } from "../scenes/us-election/ResultScene";
import { NowScene } from "../scenes/us-election/NowScene";
import { QuestionScene } from "../scenes/us-election/QuestionScene";

export { US_ELECTION_DURATION };

/**
 * "How the US votes.": who can vote, the one-paper ballot with every race, Congress (House and
 * Senate), the Electoral College, the president, the 2024 result and the 2026 midterms, as one
 * numbered story. The look is the Swedish video's (the user's Belgian reference) in the US flag's
 * colours. Script, sources and storyboard: briefs/us-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  congress: CongressScene,
  electors: ElectorsScene,
  president: PresidentScene,
  result: ResultScene,
  now: NowScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/us-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "thud", at: 0, volume: 0.16 },
  { file: "scribble", at: at("hook", "don't") - 2, volume: 0.18 },
  ...["US", "18", "abroad", "register"].map((word) => ({ file: "pop", at: at("who", word) - 4, volume: 0.13 })),
  { file: "pop", at: at("ballot", "One") - 2, volume: 0.12 },
  { file: "scribble", at: at("ballot", "oval") - 2, volume: 0.24 },
  { file: "pop", at: at("ballot", "next") - 2, volume: 0.12 },
  { file: "pop", at: at("congress", "laws") - 4, volume: 0.14 },
  { file: "pop", at: at("congress", "budget") - 4, volume: 0.14 },
  { file: "thud", at: at("congress", "435") - 2, volume: 0.17 },
  { file: "pop", at: at("congress", "two") - 4, volume: 0.13 },
  { file: "thud", at: at("senate", "100") - 2, volume: 0.16 },
  { file: "pop", at: at("senate", "two") - 4, volume: 0.13 },
  { file: "pop", at: at("senate", "six") - 4, volume: 0.13 },
  { file: "pop", at: at("electors", "all") - 4, volume: 0.15 },
  { file: "thud", at: at("win", "538") - 2, volume: 0.17 },
  { file: "thud", at: at("win", "270") - 2, volume: 0.17 },
  ...["government", "army", "veto"].map((word) => ({ file: "pop", at: at("president", word) - 2, volume: 0.13 })),
  { file: "thud", at: at("result", "312") - 3, volume: 0.18 },
  { file: "pop", at: at("result", "226") - 3, volume: 0.14 },
  { file: "pop", at: at("result", "Republicans") - 6, volume: 0.14 },
  { file: "pop", at: at("now", "decide") - 4, volume: 0.13 },
  { file: "pop", at: at("now", "Congress") - 4, volume: 0.13 },
  { file: "scribble", at: at("question", "always") - 2, volume: 0.18 },
  { file: "chime", at: at("question", "win", "end") + 4, volume: 0.2 },
];

export const USElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: US.navy }}>
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

    {/* Red colour wipes open the video and the closing question, like the reference's. */}
    <RedSweep from={1} length={16} />
    <RedSweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    <Subtitles timing={timing} hide={NO_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, US_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
