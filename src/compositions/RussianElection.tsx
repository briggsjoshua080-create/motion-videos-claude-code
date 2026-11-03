import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { fadeInOut } from "../lib/animation";
import { makeCue } from "../voiceover/timing";
import { Subtitles } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
// Same fonts as the Swedish video (Archivo Black, Instrument Serif, JetBrains Mono).
import "../scenes/swedish-election/fonts";
import {
  RU,
  RU_SUBTITLES,
  RUSSIAN_ELECTION_DURATION,
  FPS,
  SCENE_ORDER,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/russian-election/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/russian-election/ui";
import { TitleScene } from "../scenes/russian-election/TitleScene";
import { WhoScene } from "../scenes/russian-election/WhoScene";
import { BallotScene } from "../scenes/russian-election/BallotScene";
import { SeatsScene } from "../scenes/russian-election/SeatsScene";
import { CongressScene } from "../scenes/russian-election/CongressScene";
import { PresidentScene } from "../scenes/russian-election/PresidentScene";
import { ResultScene } from "../scenes/russian-election/ResultScene";
import { QuestionScene } from "../scenes/russian-election/QuestionScene";

export { RUSSIAN_ELECTION_DURATION };

/**
 * "How Argentina votes.": 40% of the vote can make you president as the hook; who can vote (every
 * citizen from 16, a must from 18 to 70, citizens abroad too); the single paper ballot (one box per
 * row); deputies shared out by province above a 3% line, half elected every two years; the Chamber
 * of Deputies (257) and the Senate (3 per province, one for the runner-up); the president's
 * 45% / 40%-plus-10-points rule and the run-off; the 2023 result (Milei) and the 2025 midterms (his
 * party first, no majority); and "Should 16-year-olds help choose who runs a country?" as the closing
 * debate, as one numbered story. The look is the Swedish video's (the user's Belgian reference) in
 * Argentina's celeste, white and Sun-of-May gold. Script, sources and storyboard:
 * briefs/russian-election-system/.
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

const MUSIC_FILE = "audio/russian-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "legally") - 3, volume: 0.13 },
  { file: "thud", at: at("hook", "2036") - 1, volume: 0.18 },
  { file: "pop", at: at("who", "18") - 3, volume: 0.13 },
  { file: "pop", at: at("who", "abroad") - 3, volume: 0.12 },
  { file: "scribble", at: at("who", "prisoners") - 2, volume: 0.12 },
  { file: "pop", at: at("who", "optional") - 2, volume: 0.11 },
  { file: "pop", at: at("ballot", "two") - 3, volume: 0.1 },
  { file: "pop", at: at("ballot", "ballots") - 3, volume: 0.1 },
  { file: "scribble", at: at("ballot", "Tick") - 2, volume: 0.14 },
  { file: "scribble", at: at("ballot", "each") - 3, volume: 0.14 },
  { file: "pop", at: at("seats", "450") - 3, volume: 0.13 },
  { file: "thud", at: at("seats", "5%") - 3, volume: 0.14 },
  { file: "pop", at: at("seats", "winners") - 3, volume: 0.12 },
  { file: "pop", at: at("congress", "makes") - 4, volume: 0.12 },
  { file: "pop", at: at("congress", "approve") - 3, volume: 0.12 },
  { file: "thud", at: at("congress", "nobody") - 2, volume: 0.16 },
  { file: "pop", at: at("congress", "30") - 3, volume: 0.13 },
  { file: "pop", at: at("president", "six") - 3, volume: 0.12 },
  { file: "pop", at: at("president", "run-off") - 3, volume: 0.12 },
  { file: "pop", at: at("president", "approves") - 2, volume: 0.12 },
  { file: "scribble", at: at("president", "reset") - 4, volume: 0.14 },
  { file: "thud", at: at("president", "zero") - 2, volume: 0.16 },
  { file: "pop", at: at("result", "87%") - 2, volume: 0.14 },
  { file: "pop", at: at("result", "349") - 3, volume: 0.14 },
  { file: "thud", at: at("result", "barred") - 3, volume: 0.16 },
  { file: "scribble", at: at("question", "win") - 4, volume: 0.18 },
  { file: "chime", at: at("question", "win", "end") + 4, volume: 0.2 },
];

export const RussianElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: RU.bg }}>
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

    {/* White-blue-red sweeps (the flag's stripes) open the video and the closing question, like the reference's colour wipes. */}
    <Sweep from={1} length={16} />
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Red is in the flag and reads on the blue: the standard red subtitle pill. */}
    <Subtitles timing={timing} hide={RU_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, RUSSIAN_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
