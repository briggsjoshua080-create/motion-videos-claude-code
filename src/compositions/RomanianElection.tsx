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
  RO,
  ROMANIAN_ELECTION_DURATION,
  SCENE_ORDER,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/romanian-election/constants";
import { Backdrop, Grain, Hud, YellowSweep } from "../scenes/romanian-election/ui";
import { TitleScene } from "../scenes/romanian-election/TitleScene";
import { WhoScene } from "../scenes/romanian-election/WhoScene";
import { BallotScene } from "../scenes/romanian-election/BallotScene";
import { SeatsScene } from "../scenes/romanian-election/SeatsScene";
import { ParliamentScene } from "../scenes/romanian-election/ParliamentScene";
import { PmScene } from "../scenes/romanian-election/PmScene";
import { PresidentScene } from "../scenes/romanian-election/PresidentScene";
import { ResultScene } from "../scenes/romanian-election/ResultScene";
import { NowScene } from "../scenes/romanian-election/NowScene";
import { QuestionScene } from "../scenes/romanian-election/QuestionScene";

export { ROMANIAN_ELECTION_DURATION };

/**
 * "How Romania votes.": the cancelled 2024 presidential election as the hook, who can vote, two
 * ballot booklets and the VOTAT stamp, the 5% line, the two chambers, the prime minister's 233
 * votes, the president, the 2024 result and the 2026 change of government, as one numbered story.
 * The look is the Swedish video's (the user's Belgian reference) in Romania's blue, yellow and red.
 * Script, sources and storyboard: briefs/romanian-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  who: WhoScene,
  ballot: BallotScene,
  seats: SeatsScene,
  parliament: ParliamentScene,
  pm: PmScene,
  president: PresidentScene,
  result: ResultScene,
  now: NowScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/romanian-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "thud", at: at("hook", "cancelled") - 3, volume: 0.19 },
  { file: "scribble", at: at("hook", "cancelled") + 2, volume: 0.16 },
  ...["Romanians", "18", "ID", "abroad"].map((word) => ({ file: "pop", at: at("who", word) - 4, volume: 0.13 })),
  { file: "pop", at: at("ballot", "two") - 4, volume: 0.12 },
  { file: "pop", at: at("ballot", "ballots") - 2, volume: 0.12 },
  { file: "pop", at: at("ballot", "booklet") - 4, volume: 0.12 },
  { file: "thud", at: at("ballot", "VOTED") + 1, volume: 0.2 },
  { file: "thud", at: at("seats", "5%") - 3, volume: 0.17 },
  { file: "pop", at: at("seats", "seats") - 4, volume: 0.13 },
  { file: "pop", at: at("parliament", "331") - 2, volume: 0.13 },
  { file: "pop", at: at("parliament", "134") - 2, volume: 0.13 },
  { file: "pop", at: at("parliament", "pass") - 4, volume: 0.14 },
  { file: "pop", at: at("pm", "president") - 8, volume: 0.13 },
  { file: "pop", at: at("pm", "prime") - 6, volume: 0.13 },
  { file: "thud", at: at("pm", "parliament") + 4, volume: 0.18 },
  ...["elected", "defence", "policy"].map((word) => ({ file: "pop", at: at("president", word) - 4, volume: 0.12 })),
  { file: "thud", at: at("president", "interference") - 2, volume: 0.19 },
  { file: "pop", at: at("president", "won") - 4, volume: 0.14 },
  { file: "thud", at: at("result", "22%") - 3, volume: 0.18 },
  { file: "pop", at: at("result", "seven") - 2, volume: 0.14 },
  { file: "thud", at: at("now", "ousted") - 3, volume: 0.19 },
  { file: "pop", at: at("now", "Luca") - 6, volume: 0.14 },
  { file: "thud", at: at("now", "votes") - 2, volume: 0.18 },
  { file: "scribble", at: at("question", "cancel") - 2, volume: 0.18 },
  { file: "chime", at: at("question", "election", "end") + 4, volume: 0.2 },
];

export const RomanianElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: RO.blue }}>
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
    <Subtitles timing={timing} hide={NO_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, ROMANIAN_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
