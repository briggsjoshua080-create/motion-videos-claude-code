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
  NO,
  NO_SUBTITLES,
  NORWEGIAN_ELECTION_DURATION,
  SCENE_ORDER,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/norwegian-election/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/norwegian-election/ui";
import { TitleScene } from "../scenes/norwegian-election/TitleScene";
import { WhoScene } from "../scenes/norwegian-election/WhoScene";
import { BallotScene } from "../scenes/norwegian-election/BallotScene";
import { SeatsScene } from "../scenes/norwegian-election/SeatsScene";
import { TopupScene } from "../scenes/norwegian-election/TopupScene";
import { StortingScene } from "../scenes/norwegian-election/StortingScene";
import { PmScene } from "../scenes/norwegian-election/PmScene";
import { KingScene } from "../scenes/norwegian-election/KingScene";
import { ResultScene } from "../scenes/norwegian-election/ResultScene";
import { QuestionScene } from "../scenes/norwegian-election/QuestionScene";

export { NORWEGIAN_ELECTION_DURATION };

/**
 * "How Norway votes.": the far north's heavier votes as the hook, who can vote, one paper per party
 * (fold, stamp, box), seats by people and land (Finnmark vs Oslo), the 4% top-up seats, the
 * Storting, a prime minister who needs no vote, the King (Haakon VIII since Aug 2026), the 2025
 * result, and a parliament that can never be dissolved as the closing debate, as one numbered
 * story. The look is the Swedish video's (the user's Belgian reference) in Norway's red, white and
 * navy. Script, sources and storyboard: briefs/norwegian-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  seats: SeatsScene,
  topup: TopupScene,
  storting: StortingScene,
  pm: PmScene,
  king: KingScene,
  result: ResultScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/norwegian-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "twice") - 3, volume: 0.15 },
  { file: "pop", at: at("hook", "Oslo") - 3, volume: 0.12 },
  ...["Norwegians", "18", "abroad"].map((word) => ({ file: "pop", at: at("who", word) - 4, volume: 0.13 })),
  { file: "pop", at: at("ballot", "pick") - 2, volume: 0.12 },
  { file: "scribble", at: at("ballot", "fold") - 2, volume: 0.12 },
  { file: "thud", at: at("ballot", "stamped") - 1, volume: 0.2 },
  { file: "pop", at: at("ballot", "box") - 2, volume: 0.13 },
  { file: "pop", at: at("seats", "Finnmark") - 2, volume: 0.13 },
  { file: "pop", at: at("seats", "Oslo") - 4, volume: 0.13 },
  { file: "thud", at: at("seats", "26,000") + 10, volume: 0.18 },
  { file: "thud", at: at("topup", "4%") - 3, volume: 0.17 },
  { file: "pop", at: at("topup", "top-up") - 4, volume: 0.13 },
  { file: "pop", at: at("topup", "match") - 2, volume: 0.13 },
  { file: "pop", at: at("storting", "169") - 2, volume: 0.13 },
  { file: "pop", at: at("storting", "laws") - 6, volume: 0.13 },
  { file: "pop", at: at("storting", "taxes") - 6, volume: 0.13 },
  { file: "pop", at: at("pm", "no") - 3, volume: 0.14 },
  { file: "thud", at: at("pm", "them", "end") - 4, volume: 0.18 },
  { file: "pop", at: at("king", "government") - 2, volume: 0.12 },
  { file: "pop", at: at("king", "law") - 2, volume: 0.12 },
  { file: "thud", at: at("king", "Haakon") - 3, volume: 0.19 },
  { file: "pop", at: at("result", "53") - 4, volume: 0.14 },
  { file: "pop", at: at("result", "47") - 4, volume: 0.14 },
  { file: "pop", at: at("result", "stayed") - 2, volume: 0.13 },
  { file: "thud", at: at("question", "dissolved") - 2, volume: 0.18 },
  { file: "scribble", at: at("question", "on") - 2, volume: 0.18 },
  { file: "chime", at: at("question", "pause", "end") + 4, volume: 0.2 },
];

export const NorwegianElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NO.bg }}>
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

    {/* Navy-and-white sweeps (the flag's cross) open the video and the closing question, like the reference's colour wipes. */}
    <Sweep from={1} length={16} />
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Red is the background here, so the spoken word gets a navy pill (the flag's cross) instead of the standard red one. */}
    <Subtitles timing={timing} hide={NO_SUBTITLES} highlight={NO.blue} activeColor={NO.white} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, NORWEGIAN_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
