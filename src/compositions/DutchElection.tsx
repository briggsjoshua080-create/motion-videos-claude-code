import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { fadeInOut } from "../lib/animation";
import { makeCue } from "../voiceover/timing";
import { Paper } from "../components/explainer/Paper";
import { StepHeader } from "../components/explainer/StepHeader";
import { CaptionBox } from "../components/explainer/CaptionBox";
import { EXIT_FRAMES } from "../components/explainer/motion";
import {
  DUTCH_ELECTION_DURATION,
  FPS,
  KEYWORDS,
  NO_SUBTITLES,
  PALETTE,
  SCENE_ORDER,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/dutch-election/constants";
import { HouseLayer } from "../scenes/dutch-election/HouseLayer";
import { TitleScene } from "../scenes/dutch-election/TitleScene";
import { VoteScene } from "../scenes/dutch-election/VoteScene";
import { HouseScene } from "../scenes/dutch-election/HouseScene";
import { SenateScene } from "../scenes/dutch-election/SenateScene";
import { GovernmentScene } from "../scenes/dutch-election/GovernmentScene";
import { KingScene } from "../scenes/dutch-election/KingScene";
import { QuestionScene } from "../scenes/dutch-election/QuestionScene";

export { DUTCH_ELECTION_DURATION };

/**
 * "Dutch election system": how the Dutch choose who runs the country, as one step-by-step story
 * (Vote -> Parliament -> Government -> King), in the white GermanElection look with Dutch colours.
 * Script, sources and storyboard: briefs/dutch-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: TitleScene,
  vote: VoteScene,
  house: HouseScene,
  senate: SenateScene,
  government: GovernmentScene,
  king: KingScene,
  question: QuestionScene,
};

const STEPS = [
  { label: "Vote", from: sceneFrom("vote") },
  { label: "Parliament", from: sceneFrom("house") },
  { label: "Government", from: sceneFrom("government") },
  { label: "King", from: sceneFrom("king") },
];

const MUSIC_FILE = "audio/dutch-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(1).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "Dutch"), volume: 0.16 },
  { file: "pop", at: at("vote", "one"), volume: 0.16 },
  { file: "scribble", at: at("pencil", "fill"), volume: 0.24 },
  { file: "pop", at: at("pencil", "candidate"), volume: 0.16 },
  { file: "pop", at: at("share", "party"), volume: 0.14 },
  { file: "pop", at: at("house", "House"), volume: 0.14 },
  ...["laws", "approves", "checks", "vote"].map((word) => ({ file: "pop", at: at("houseJob", word) - 3, volume: 0.14 })),
  { file: "whoosh", at: at("senate", "check") - 2, volume: 0.1 },
  { file: "pop", at: at("senate", "yes"), volume: 0.16 },
  { file: "pop", at: at("senate", "no"), volume: 0.16 },
  { file: "pop", at: at("senateHow", "Provincial"), volume: 0.14 },
  { file: "thud", at: at("senateHow", "not"), volume: 0.26 },
  { file: "pop", at: at("coalition", "76"), volume: 0.16 },
  { file: "pop", at: at("coalition", "D66"), volume: 0.16 },
  { file: "pop", at: at("coalition", "PVV"), volume: 0.16 },
  { file: "pop", at: at("cabinet", "parties"), volume: 0.14 },
  { file: "chime", at: at("cabinet", "Rob"), volume: 0.16 },
  { file: "pop", at: at("king", "head") - 4, volume: 0.16 },
  { file: "thud", at: at("king", "Nobody"), volume: 0.26 },
  { file: "chime", at: at("kingInherit", "Willem-Alexander"), volume: 0.14 },
  { file: "pop", at: at("kingInherit", "crown"), volume: 0.14 },
  { file: "scribble", at: at("kingRole", "signs"), volume: 0.22 },
  { file: "scribble", at: at("kingRole", "ministers"), volume: 0.22 },
  { file: "pop", at: at("kingRole", "responsibility"), volume: 0.14 },
  { file: "chime", at: at("question", "state", "end") + 4, volume: 0.2 },
];

export const DutchElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <Paper palette={PALETTE} />

    {/* The House half-circle carries on from the Parliament step to the King. */}
    <Sequence name="House half-circle" from={sceneFrom("house")} durationInFrames={sceneFrom("king") + 20 - sceneFrom("house")}>
      <HouseLayer offset={sceneFrom("house")} />
    </Sequence>

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

    <StepHeader
      title="DUTCH ELECTION SYSTEM"
      steps={STEPS}
      appearAt={sceneFrom("vote") - 4}
      allDoneAt={sceneFrom("question")}
      palette={PALETTE}
    />
    <CaptionBox timing={timing} palette={PALETTE} keywords={KEYWORDS} hide={NO_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, DUTCH_ELECTION_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
