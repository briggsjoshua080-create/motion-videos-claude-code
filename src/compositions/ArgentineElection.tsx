import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { fadeInOut } from "../lib/animation";
import { makeCue } from "../voiceover/timing";
import { Subtitles } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
// Same fonts as the Swedish video (Archivo Black, Instrument Serif, JetBrains Mono).
import "../scenes/swedish-election/fonts";
import {
  AR,
  AR_SUBTITLES,
  ARGENTINE_ELECTION_DURATION,
  FPS,
  SCENE_ORDER,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/argentine-election/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/argentine-election/ui";
import { TitleScene } from "../scenes/argentine-election/TitleScene";
import { WhoScene } from "../scenes/argentine-election/WhoScene";
import { BallotScene } from "../scenes/argentine-election/BallotScene";
import { SeatsScene } from "../scenes/argentine-election/SeatsScene";
import { CongressScene } from "../scenes/argentine-election/CongressScene";
import { PresidentScene } from "../scenes/argentine-election/PresidentScene";
import { ResultScene } from "../scenes/argentine-election/ResultScene";
import { QuestionScene } from "../scenes/argentine-election/QuestionScene";

export { ARGENTINE_ELECTION_DURATION };

/**
 * "How Argentina votes.": 40% of the vote can make you president as the hook; who can vote (every
 * citizen from 16, a must from 18 to 70, citizens abroad too); the single paper ballot (one box per
 * row); deputies shared out by province above a 3% line, half elected every two years; the Chamber
 * of Deputies (257) and the Senate (3 per province, one for the runner-up); the president's
 * 45% / 40%-plus-10-points rule and the run-off; the 2023 result (Milei) and the 2025 midterms (his
 * party first, no majority); and "Should 16-year-olds help choose who runs a country?" as the closing
 * debate, as one numbered story. The look is the Swedish video's (the user's Belgian reference) in
 * Argentina's celeste, white and Sun-of-May gold. Script, sources and storyboard:
 * briefs/argentine-election-system/.
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

const MUSIC_FILE = "audio/argentine-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "40%") - 3, volume: 0.13 },
  { file: "thud", at: at("hook", "president") - 1, volume: 0.18 },
  { file: "pop", at: at("who", "16") - 3, volume: 0.13 },
  { file: "pop", at: at("who", "18") - 3, volume: 0.12 },
  { file: "pop", at: at("who", "70") - 3, volume: 0.12 },
  { file: "pop", at: at("who", "too") - 2, volume: 0.11 },
  { file: "pop", at: at("ballot", "row") - 3, volume: 0.1 },
  { file: "pop", at: at("ballot", "column") - 3, volume: 0.1 },
  { file: "scribble", at: at("ballot", "Tick") - 2, volume: 0.14 },
  { file: "whoosh", at: at("ballot", "fold") - 2, volume: 0.1 },
  { file: "thud", at: at("ballot", "in") - 1, volume: 0.15 },
  { file: "pop", at: at("seats", "province") - 3, volume: 0.13 },
  { file: "thud", at: at("seats", "3%") - 3, volume: 0.14 },
  { file: "pop", at: at("seats", "Half") - 2, volume: 0.12 },
  { file: "pop", at: at("congress", "makes") - 4, volume: 0.12 },
  { file: "thud", at: at("congress", "pass") - 3, volume: 0.15 },
  { file: "pop", at: at("congress", "runner-up") - 3, volume: 0.13 },
  { file: "pop", at: at("president", "45%") - 3, volume: 0.13 },
  { file: "pop", at: at("president", "40%") - 3, volume: 0.13 },
  { file: "thud", at: at("president", "run-off") - 2, volume: 0.16 },
  { file: "pop", at: at("result", "55.7%") - 2, volume: 0.14 },
  { file: "pop", at: at("result", "midterms") - 2, volume: 0.13 },
  { file: "thud", at: at("result", "majority") - 3, volume: 0.15 },
  { file: "scribble", at: at("question", "country") - 4, volume: 0.18 },
  { file: "chime", at: at("question", "country", "end") + 4, volume: 0.2 },
];

export const ArgentineElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: AR.bg }}>
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

    {/* Celeste-and-white sweeps (the flag's stripes) open the video and the closing question, like the reference's colour wipes. */}
    <Sweep from={1} length={16} />
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Red is not in the flag: a Sun-of-May gold subtitle pill with navy text (as Sweden's and Brazil's yellow pills). */}
    <Subtitles timing={timing} hide={AR_SUBTITLES} highlight={AR.sun} activeColor={AR.navy} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, ARGENTINE_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
