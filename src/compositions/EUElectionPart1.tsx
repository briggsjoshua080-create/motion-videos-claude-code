import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { theme } from "../theme";
import { fadeInOut } from "../lib/animation";
import { Paper } from "../components/explainer/Paper";
import { StepHeader } from "../components/explainer/StepHeader";
import { Subtitles } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
import { EU, FPS, PALETTE, type SceneProps } from "../scenes/eu-election/constants";
import { TitleScene } from "../scenes/eu-election/TitleScene";
import { QuestionScene } from "../scenes/eu-election/QuestionScene";
import { MiniFlag } from "../scenes/eu-election/ui";
import { NO_SUBTITLES, P1, timing, type SceneId } from "../scenes/eu-election/part1/timeline";
import { WhoScene } from "../scenes/eu-election/part1/WhoScene";
import { BallotScene } from "../scenes/eu-election/part1/BallotScene";
import { SeatsScene } from "../scenes/eu-election/part1/SeatsScene";
import { ParliamentScene } from "../scenes/eu-election/part1/ParliamentScene";
import { PerPersonScene } from "../scenes/eu-election/part1/PerPersonScene";

export const EU_ELECTION_PART1_DURATION = P1.duration;

const Title: React.FC<SceneProps> = (props) => <TitleScene {...props} kicker="PART 1 OF 2" mode="countries" fillWord="27" />;

const Question: React.FC<SceneProps> = (props) => (
  <QuestionScene
    {...props}
    sentence="question"
    text="Is it fair that small countries get more MEPs per person than big ones?"
    accent={["fair", "small", "big"]}
    icons={
      <>
        <MiniFlag country="germany" width={190} />
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            background: EU.yellow,
            color: PALETTE.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.font,
            fontSize: 92,
            fontWeight: 900,
            boxShadow: "0 14px 34px rgba(15,27,61,0.2)",
          }}
        >
          ?
        </div>
        <MiniFlag country="malta" width={86} />
      </>
    }
    teaser={
      <div
        style={{
          padding: "14px 30px",
          borderRadius: 999,
          background: EU.yellow,
          color: PALETTE.ink,
          fontFamily: theme.font,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 1,
          boxShadow: "0 14px 34px rgba(15,27,61,0.16)",
        }}
      >
        PART 2: WHO'S REALLY IN CHARGE? →
      </div>
    }
  />
);

/**
 * "EU election system", part 1 of 2: who can vote, how you vote, how votes become seats, and the
 * European Parliament (720 MEPs, political groups, the 2024 result), ending on a fairness question
 * and a teaser for part 2. The white GermanElection look in the EU's blue and yellow.
 * Script, sources and storyboard: briefs/eu-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: Title,
  who: WhoScene,
  ballot: BallotScene,
  seats: SeatsScene,
  parliament: ParliamentScene,
  perPerson: PerPersonScene,
  question: Question,
};

const STEPS = [
  { label: "Vote", from: P1.from("who") },
  { label: "Parliament", from: P1.from("parliament") },
  { label: "Commission", from: Number.MAX_SAFE_INTEGER, later: true },
  { label: "Laws", from: Number.MAX_SAFE_INTEGER, later: true },
];

const MUSIC_FILE = "audio/eu-election-part-1/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;
const at = P1.at;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...P1.order.slice(1).map((id) => ({ file: "whoosh", at: P1.from(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "27"), volume: 0.16 },
  { file: "pop", at: at("hook", "parliament"), volume: 0.16 },
  ...(["EU", "countries", "wherever", "EU#2"] as const).map((word) => ({ file: "pop", at: at("who", word) - 3, volume: 0.13 })),
  { file: "pop", at: at("vote", "five") - 3, volume: 0.14 },
  { file: "whoosh", at: at("ballot", "differ") - 3, volume: 0.1 },
  { file: "scribble", at: at("ballot", "mark"), volume: 0.24 },
  { file: "pop", at: at("ballot", "party") - 2, volume: 0.14 },
  { file: "pop", at: at("seats", "seats"), volume: 0.12 },
  { file: "pop", at: at("big", "96") - 2, volume: 0.15 },
  { file: "pop", at: at("big", "6") - 2, volume: 0.15 },
  { file: "whoosh", at: at("meps", "Together") - 2, volume: 0.1 },
  { file: "pop", at: at("groups", "not") - 3, volume: 0.14 },
  { file: "pop", at: at("job", "laws") - 3, volume: 0.14 },
  { file: "pop", at: at("job", "budget") - 3, volume: 0.14 },
  { file: "pop", at: at("result", "EPP") - 3, volume: 0.16 },
  { file: "pop", at: at("result", "majority") - 3, volume: 0.15 },
  { file: "pop", at: at("result", "team") - 3, volume: 0.15 },
  { file: "pop", at: at("perPerson", "nine") - 3, volume: 0.16 },
  { file: "chime", at: at("question", undefined, "end") + 4, volume: 0.2 },
];

export const EUElectionPart1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <Paper palette={PALETTE} />

    {P1.order.map((id) => {
      const from = P1.from(id);
      const duration = P1.end(id) - from;
      const Scene = SCENES[id];
      return (
        <Sequence key={id} name={id} from={from} durationInFrames={duration + (id === "question" ? 0 : EXIT_FRAMES)}>
          <Scene cue={P1.cueFor(id)} duration={duration} />
        </Sequence>
      );
    })}

    <StepHeader
      title="EU ELECTION SYSTEM"
      steps={STEPS}
      appearAt={P1.from("who") - 4}
      allDoneAt={P1.from("question")}
      teaseAt={at("question", undefined, "end") + 14}
      palette={PALETTE}
    />
    <Subtitles timing={timing} hide={NO_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, EU_ELECTION_PART1_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
