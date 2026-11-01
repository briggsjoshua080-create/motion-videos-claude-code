import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { fadeInOut } from "../lib/animation";
import { makeCue } from "../voiceover/timing";
import { Subtitles } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
// Same fonts as the Swedish video (Archivo Black, Instrument Serif, JetBrains Mono).
import "../scenes/swedish-election/fonts";
import {
  BR,
  BR_SUBTITLES,
  BRAZILIAN_ELECTION_DURATION,
  FPS,
  SCENE_ORDER,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/brazilian-election/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/brazilian-election/ui";
import { TitleScene } from "../scenes/brazilian-election/TitleScene";
import { WhoScene } from "../scenes/brazilian-election/WhoScene";
import { BallotScene } from "../scenes/brazilian-election/BallotScene";
import { SeatsScene } from "../scenes/brazilian-election/SeatsScene";
import { CongressScene } from "../scenes/brazilian-election/CongressScene";
import { PresidentScene } from "../scenes/brazilian-election/PresidentScene";
import { ResultScene } from "../scenes/brazilian-election/ResultScene";
import { QuestionScene } from "../scenes/brazilian-election/QuestionScene";

export { BRAZILIAN_ELECTION_DURATION };

/**
 * "How Brazil votes.": skipping the vote can cost you your passport as the hook; who can vote (a
 * must from 18 to 70, optional at 16–17, over 70 and for those who can't read, president only from
 * abroad); typing numbers into an electronic voting machine, six votes in a row; open-list seats
 * where one star candidate pulls others in; the Chamber of Deputies (513) and the Senate (3 per
 * state); a president with no prime minister and a run-off; the 2026 result (Lula's comeback in the
 * run-off, but Bolsonaro's PL the biggest party in both houses); and "Should anyone be forced to
 * vote?" as the closing debate, as one numbered story. The look is the Swedish video's (the user's
 * Belgian reference) in Brazil's green, yellow and blue. Script, sources and storyboard:
 * briefs/brazilian-election-system/.
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

const MUSIC_FILE = "audio/brazilian-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "scribble", at: at("hook", "skipping"), volume: 0.13 },
  { file: "pop", at: at("hook", "cost") - 3, volume: 0.13 },
  { file: "thud", at: at("hook", "passport") - 1, volume: 0.18 },
  { file: "pop", at: at("who", "18") - 3, volume: 0.13 },
  { file: "pop", at: at("who", "70") - 3, volume: 0.12 },
  ...["16", "over", "read"].map((word) => ({ file: "pop", at: at("who", word) - 4, volume: 0.12 })),
  ...[0, 1, 2, 3].map((i) => ({
    file: "pop",
    at: Math.round(at("ballot", "type") + ((at("ballot", "number", "end") + 2 - at("ballot", "type")) * i) / 4),
    volume: 0.09,
  })),
  { file: "chime", at: at("ballot", "green") - 1, volume: 0.14 },
  { file: "pop", at: at("ballot", "Six") - 3, volume: 0.12 },
  { file: "pop", at: at("seats", "state") - 2, volume: 0.13 },
  { file: "thud", at: at("seats", "star") - 3, volume: 0.15 },
  { file: "pop", at: at("seats", "pull") - 2, volume: 0.13 },
  { file: "pop", at: at("seats", "others") - 2, volume: 0.13 },
  { file: "pop", at: at("congress", "makes") - 4, volume: 0.12 },
  { file: "thud", at: at("congress", "approve") - 3, volume: 0.15 },
  { file: "scribble", at: at("president", "prime") - 2, volume: 0.13 },
  { file: "pop", at: at("president", "half") - 3, volume: 0.13 },
  { file: "thud", at: at("president", "run-off") - 2, volume: 0.16 },
  { file: "pop", at: at("result", "51.8%") - 2, volume: 0.14 },
  { file: "thud", at: at("result", "most") - 3, volume: 0.16 },
  { file: "pop", at: at("result", "both") - 2, volume: 0.13 },
  { file: "scribble", at: at("question", "vote") - 4, volume: 0.18 },
  { file: "chime", at: at("question", "vote", "end") + 4, volume: 0.2 },
];

export const BrazilianElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BR.bg }}>
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

    {/* Yellow-and-blue sweeps over green (the flag's colours) open the video and the closing question, like the reference's colour wipes. */}
    <Sweep from={1} length={16} />
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Red is not in the flag: a flag-yellow subtitle pill with flag-blue text (as Sweden's yellow pill). */}
    <Subtitles timing={timing} hide={BR_SUBTITLES} highlight={BR.yellow} activeColor={BR.blue} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, BRAZILIAN_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
