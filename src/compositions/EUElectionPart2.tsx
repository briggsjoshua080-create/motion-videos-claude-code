import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { theme } from "../theme";
import { fadeInOut } from "../lib/animation";
import { Paper } from "../components/explainer/Paper";
import { StepHeader } from "../components/explainer/StepHeader";
import { CaptionBox } from "../components/explainer/CaptionBox";
import { BallotBoxIcon, LawIcon } from "../components/explainer/icons";
import { EXIT_FRAMES } from "../components/explainer/motion";
import { EU, FPS, PALETTE, type SceneProps } from "../scenes/eu-election/constants";
import { TitleScene } from "../scenes/eu-election/TitleScene";
import { QuestionScene } from "../scenes/eu-election/QuestionScene";
import { KEYWORDS, NO_SUBTITLES, P2, timing, type SceneId } from "../scenes/eu-election/part2/timeline";
import { HemicycleLayer } from "../scenes/eu-election/part2/HemicycleLayer";
import { RecapScene } from "../scenes/eu-election/part2/RecapScene";
import { CommissionScene } from "../scenes/eu-election/part2/CommissionScene";
import { LeadersScene } from "../scenes/eu-election/part2/LeadersScene";
import { ElectedScene } from "../scenes/eu-election/part2/ElectedScene";
import { TeamScene } from "../scenes/eu-election/part2/TeamScene";
import { NoDirectScene } from "../scenes/eu-election/part2/NoDirectScene";
import { LawsScene } from "../scenes/eu-election/part2/LawsScene";

export const EU_ELECTION_PART2_DURATION = P2.duration;

const Title: React.FC<SceneProps> = (props) => <TitleScene {...props} kicker="PART 2 OF 2" mode="question" fillWord="really" />;

const Question: React.FC<SceneProps> = (props) => (
  <QuestionScene
    {...props}
    sentence="question"
    text="So, does your vote really count?"
    accent={["vote", "count"]}
    icons={
      <>
        <div style={{ transform: "rotate(-6deg)" }}>
          <BallotBoxIcon size={190} palette={PALETTE} mark={EU.blue} />
        </div>
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
        <div style={{ transform: "rotate(6deg)" }}>
          <LawIcon size={180} palette={PALETTE} />
        </div>
      </>
    }
  />
);

/**
 * "EU election system", part 2 of 2: who runs the EU day to day (the Commission), how its President
 * and team are chosen, that nobody votes for it directly, that only it proposes laws, and that
 * Parliament and the Council of ministers both have to say yes. Ends on "So, does your vote really
 * count?". The white GermanElection look in the EU's blue and yellow.
 * Script, sources and storyboard: briefs/eu-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  title: Title,
  recap: RecapScene,
  commission: CommissionScene,
  leaders: LeadersScene,
  elected: ElectedScene,
  team: TeamScene,
  noDirect: NoDirectScene,
  laws: LawsScene,
  question: Question,
};

const at = P2.at;

const STEPS = [
  { label: "Vote", from: P2.from("recap") },
  { label: "Parliament", from: at("recap", "elect") - 2 },
  { label: "Commission", from: P2.from("commission") },
  { label: "Laws", from: P2.from("laws") },
];

const MUSIC_FILE = "audio/eu-election-part-2/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...P2.order.slice(1).map((id) => ({ file: "whoosh", at: P2.from(id) - 4, volume: 0.12 })),
  { file: "pop", at: at("hook", "really") - 4, volume: 0.16 },
  { file: "pop", at: at("recap", "elect") - 2, volume: 0.14 },
  ...(["proposes", "manages", "makes"] as const).map((word) => ({ file: "pop", at: at("commissionJob", word) - 4, volume: 0.14 })),
  { file: "pop", at: at("leaders", "President") - 4, volume: 0.15 },
  { file: "pop", at: at("leaders", "leaders") - 4, volume: 0.12 },
  { file: "pop", at: at("leaders", "who") - 4, volume: 0.13 },
  { file: "pop", at: at("elected", "votes") - 4, volume: 0.15 },
  { file: "whoosh", at: at("elected", "re-elected") - 2, volume: 0.1 },
  { file: "chime", at: at("elected", "Ursula") - 2, volume: 0.15 },
  { file: "pop", at: at("team", "one") - 6, volume: 0.12 },
  { file: "pop", at: at("team", "Parliament") - 2, volume: 0.15 },
  { file: "pop", at: at("team", "or") - 4, volume: 0.15 },
  { file: "thud", at: at("notDirect", "votes") - 2, volume: 0.26 },
  { file: "pop", at: at("onlyCommission", "only") - 4, volume: 0.15 },
  { file: "whoosh", at: at("onlyCommission", "propose") - 4, volume: 0.1 },
  { file: "pop", at: at("decide", "two") - 2, volume: 0.15 },
  { file: "pop", at: at("decide", "Parliament") - 4, volume: 0.12 },
  { file: "pop", at: at("decide", "Council") - 4, volume: 0.12 },
  { file: "pop", at: at("both", "both") - 3, volume: 0.16 },
  { file: "pop", at: at("both", "yes") - 3, volume: 0.16 },
  { file: "thud", at: at("both", "law") - 2, volume: 0.24 },
  { file: "chime", at: at("question", undefined, "end") + 4, volume: 0.2 },
];

export const EUElectionPart2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <Paper palette={PALETTE} />

    {P2.order.map((id) => {
      const from = P2.from(id);
      const duration = P2.end(id) - from;
      const Scene = SCENES[id];
      return (
        <Sequence key={id} name={id} from={from} durationInFrames={duration + (id === "question" ? 0 : EXIT_FRAMES)}>
          <Scene cue={P2.cueFor(id)} duration={duration} />
        </Sequence>
      );
    })}

    {/* One Parliament half-circle from the recap to the law step (above the scenes' cards). */}
    <Sequence name="Parliament half-circle" from={P2.from("recap")} durationInFrames={P2.from("question") + 10 - P2.from("recap")}>
      <HemicycleLayer offset={P2.from("recap")} />
    </Sequence>

    <StepHeader title="EU ELECTION SYSTEM" steps={STEPS} appearAt={P2.from("recap") - 4} allDoneAt={P2.from("question")} palette={PALETTE} />
    <CaptionBox timing={timing} palette={PALETTE} keywords={KEYWORDS} hide={NO_SUBTITLES} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, EU_ELECTION_PART2_DURATION, Math.round(FPS))} />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
