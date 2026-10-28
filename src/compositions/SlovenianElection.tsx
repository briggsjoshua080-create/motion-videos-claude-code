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
  SI,
  SI_SUBTITLES,
  SCENE_ORDER,
  SLOVENIAN_ELECTION_DURATION,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/slovenian-election/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/slovenian-election/ui";
import { TitleScene } from "../scenes/slovenian-election/TitleScene";
import { WhoScene } from "../scenes/slovenian-election/WhoScene";
import { BallotScene } from "../scenes/slovenian-election/BallotScene";
import { SeatsScene } from "../scenes/slovenian-election/SeatsScene";
import { AssemblyScene } from "../scenes/slovenian-election/AssemblyScene";
import { PmScene } from "../scenes/slovenian-election/PmScene";
import { PresidentScene } from "../scenes/slovenian-election/PresidentScene";
import { ResultScene } from "../scenes/slovenian-election/ResultScene";
import { QuestionScene } from "../scenes/slovenian-election/QuestionScene";

export { SLOVENIAN_ELECTION_DURATION };

/**
 * "How Slovenia votes.": the biggest party ending up in opposition as the hook, who can vote (and
 * the Italian and Hungarian voters' second vote), one name per party on the ballot (circle one
 * number, it counts for the party), the 4% line with 88 seats by votes plus 2 minority seats, the
 * 90-seat National Assembly and the weak National Council, a prime minister who needs 46 votes,
 * a directly elected president with no veto, the March 2026 result and Janša's coalition, and
 * "Is it fair that some citizens get two votes?" as the closing debate, as one numbered story.
 * The look is the Swedish video's (the user's Belgian reference) in Slovenia's white, blue and
 * red. Script, sources and storyboard: briefs/slovenian-election-system/.
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

const MUSIC_FILE = "audio/slovenian-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "won") - 3, volume: 0.13 },
  { file: "pop", at: at("hook", "ended") - 3, volume: 0.13 },
  { file: "thud", at: at("hook", "opposition") - 2, volume: 0.18 },
  ...["Citizens", "post", "Italian"].map((word) => ({ file: "pop", at: at("who", word) - 4, volume: 0.13 })),
  { file: "thud", at: at("who", "second") - 2, volume: 0.16 },
  { file: "scribble", at: at("ballot", "Circle") - 2, volume: 0.14 },
  { file: "whoosh", at: at("ballot", "counts") - 2, volume: 0.08 },
  { file: "thud", at: at("ballot", "party#2") - 2, volume: 0.17 },
  { file: "thud", at: at("seats", "4%") - 3, volume: 0.17 },
  { file: "pop", at: at("seats", "88") - 3, volume: 0.13 },
  { file: "pop", at: at("seats", "Two") - 3, volume: 0.14 },
  { file: "pop", at: at("assembly", "makes") - 4, volume: 0.12 },
  { file: "pop", at: at("assembly", "picks") - 4, volume: 0.12 },
  { file: "thud", at: at("assembly", "again") - 3, volume: 0.15 },
  { file: "thud", at: at("pm", "votes") - 2, volume: 0.18 },
  { file: "pop", at: at("pm", "or") - 3, volume: 0.13 },
  { file: "pop", at: at("president", "run-off") - 2, volume: 0.13 },
  { file: "thud", at: at("president", "veto") - 2, volume: 0.16 },
  { file: "pop", at: at("result", "29") - 4, volume: 0.14 },
  { file: "pop", at: at("result", "28") - 4, volume: 0.14 },
  { file: "pop", at: at("result", "coalition") - 2, volume: 0.14 },
  { file: "thud", at: at("result", "prime") - 4, volume: 0.17 },
  { file: "scribble", at: at("question", "two") - 2, volume: 0.18 },
  { file: "chime", at: at("question", "votes", "end") + 4, volume: 0.2 },
];

export const SlovenianElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: SI.bg }}>
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
    <Subtitles timing={timing} hide={SI_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, SLOVENIAN_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
