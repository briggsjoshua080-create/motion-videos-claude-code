import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { makeCue } from "../voiceover/timing";
import { Subtitles, type SubtitleStyle } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
// Same fonts as the Swedish video (Archivo Black, Instrument Serif, JetBrains Mono).
import "../scenes/swedish-election/fonts";
import {
  FPS,
  LIGHT_SPANS,
  SCENE_ORDER,
  US,
  US_MIDTERMS_DURATION,
  US_SUBTITLES,
  WIPE,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/us-midterms/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/us-midterms/ui";
import { HookScene } from "../scenes/us-midterms/HookScene";
import { LoopsScene } from "../scenes/us-midterms/LoopsScene";
import { ExamScene } from "../scenes/us-midterms/ExamScene";
import { PassedScene } from "../scenes/us-midterms/PassedScene";
import { RehookScene } from "../scenes/us-midterms/RehookScene";
import { HouseScene } from "../scenes/us-midterms/HouseScene";
import { CongressScene } from "../scenes/us-midterms/CongressScene";
import { WhoScene } from "../scenes/us-midterms/WhoScene";
import { StrangeScene } from "../scenes/us-midterms/StrangeScene";
import { BallotScene } from "../scenes/us-midterms/BallotScene";
import { SeatsScene } from "../scenes/us-midterms/SeatsScene";
import { ResultScene } from "../scenes/us-midterms/ResultScene";
import { NextScene } from "../scenes/us-midterms/NextScene";
import { WhyScene } from "../scenes/us-midterms/WhyScene";
import { ShareScene } from "../scenes/us-midterms/ShareScene";
import { HorseScene } from "../scenes/us-midterms/HorseScene";
import { QuestionScene } from "../scenes/us-midterms/QuestionScene";

export { US_MIDTERMS_DURATION };

/**
 * "The president just failed his midterm.": the US midterms explained as a comedy, the first video
 * made with the comedy formula (briefs/comedy-explainer-formula.md) on top of the TikTok Retention
 * Rules (CLAUDE.md). The premise: the midterm is the president's mid-term exam, graded by voters
 * electing Congress. The hook on frame 0 over a report card with a hidden horse sticker; three open
 * loops (what, who, why); halfway through the term America elects Congress, lose seats and he
 * fails; only two presidents passed since WWII; re-hook 1 ("the whole House reapplies for its job");
 * 435 seats every two years, senators get six; Congress writes the laws and controls the money; the
 * graders (citizens from 18 who registered; North Dakota skips that); re-hook 2 ("Americans even
 * elect their sheriffs"); one oval per race; most votes wins a district, 218 wins the House; 3 Nov
 * 2026: Democrats won both (the report card returns, F, F); every law needs both parties ("Hello,
 * gridlock"); angry voters show up, happy ones stay on the couch; send this; the horse (1845, never
 * on Sundays, hence Tuesday); and "So, should America scrap midterms?" in the hook's layout, so the
 * video loops. The standard look in Old Glory blue with red accents and red re-hook flashes.
 * Plan, facts and sources: briefs/us-midterm-elections/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  hook: HookScene,
  loops: LoopsScene,
  exam: ExamScene,
  passed: PassedScene,
  rehook: RehookScene,
  house: HouseScene,
  congress: CongressScene,
  who: WhoScene,
  strange: StrangeScene,
  ballot: BallotScene,
  seats: SeatsScene,
  result: ResultScene,
  next: NextScene,
  why: WhyScene,
  share: ShareScene,
  horse: HorseScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/us-midterms/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** On paper the words turn dark (red pill, white text); on a red flash the pill turns white with red text. */
const PAPER_STYLE: SubtitleStyle = { color: US.ink, shadow: "0 0 18px rgba(255,255,255,0.35)", highlight: US.red, activeColor: US.white };
const FLASH_STYLE: SubtitleStyle = { color: US.white, shadow: "0 4px 18px rgba(80,0,0,0.5)", highlight: US.white, activeColor: US.red };
const subtitleStyle = (seconds: number): SubtitleStyle | undefined => {
  const frame = seconds * FPS;
  const span = LIGHT_SPANS.find(({ from, to }) => frame >= from + WIPE / 2 && frame < to - WIPE / 2);
  return span ? (span.kind === "paper" ? PAPER_STYLE : FLASH_STYLE) : undefined;
};

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word (the visual punchlines). */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(2).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 3, volume: 0.11 })),
  { file: "thud", at: at("hook", "failed") - 1, volume: 0.2 },
  { file: "pop", at: at("loops", "What") - 5, volume: 0.13 },
  { file: "pop", at: at("loops", "Who") - 2, volume: 0.1 },
  { file: "pop", at: at("loops", "Why") - 2, volume: 0.1 },
  { file: "pop", at: at("exam", "term", "end") - 5, volume: 0.11 },
  { file: "pop", at: at("exam", "Congress") - 4, volume: 0.12 },
  { file: "thud", at: at("exam", "Lose") - 3, volume: 0.18 },
  { file: "pop", at: at("passed", "World") - 2, volume: 0.08 },
  { file: "pop", at: at("passed", "War") + 2, volume: 0.08 },
  { file: "pop", at: at("passed", "Two") + 4, volume: 0.08 },
  { file: "chime", at: at("passed", "two#2") - 2, volume: 0.12 },
  { file: "thud", at: at("rehook", "weird") - 1, volume: 0.16 },
  { file: "pop", at: at("house", "435", "end") - 2, volume: 0.13 },
  { file: "pop", at: at("congress", "laws") - 4, volume: 0.12 },
  { file: "pop", at: at("congress", "money") - 4, volume: 0.13 },
  { file: "pop", at: at("who", "18", "end") - 2, volume: 0.13 },
  { file: "thud", at: at("who", "North") - 2, volume: 0.15 },
  { file: "scribble", at: at("who", "skips") - 3, volume: 0.15 },
  { file: "pop", at: at("strange", "strange") - 4, volume: 0.14 },
  { file: "scribble", at: at("ballot", "ballot") - 4, volume: 0.15 },
  { file: "scribble", at: at("ballot", "oval") - 4, volume: 0.15 },
  { file: "scribble", at: at("ballot", "race") - 4, volume: 0.15 },
  { file: "pop", at: at("seats", "district") - 2, volume: 0.12 },
  { file: "pop", at: at("seats", "218", "end") - 3, volume: 0.13 },
  { file: "thud", at: at("result", "won") - 3, volume: 0.18 },
  { file: "thud", at: at("result", "won") + 2, volume: 0.16 },
  { file: "thud", at: at("next", "parties"), volume: 0.15 },
  { file: "thud", at: at("next", "Hello") - 3, volume: 0.18 },
  { file: "pop", at: at("why", "Angry") - 4, volume: 0.13 },
  { file: "pop", at: at("why", "Happy") - 5, volume: 0.12 },
  { file: "whoosh", at: at("share", "Send") - 5, volume: 0.12 },
  { file: "pop", at: at("horse", "1845") - 4, volume: 0.13 },
  { file: "scribble", at: at("horse", "Sundays") - 3, volume: 0.16 },
  { file: "scribble", at: at("horse", "Tuesday") - 4, volume: 0.16 },
  { file: "pop", at: at("question", "midterms") - 2, volume: 0.13 },
  { file: "chime", at: at("question", "midterms", "end"), volume: 0.18 },
];

export const USMidterms: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: US.bg }}>
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

    {/* A blue-and-red sweep (the flag's stripes) opens the closing question. */}
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Red is in the flag and reads on the blue: the standard red pill, at 110 px (rule 6). */}
    <Subtitles timing={timing} hide={US_SUBTITLES} fontSize={110} maxChars={12} highlight={US.pill} activeColor={US.white} activeScale={1} styleAt={subtitleStyle} />

    <Audio src={staticFile(timing.audio)} />
    <Audio
      src={staticFile(MUSIC_FILE)}
      volume={(f) => MUSIC_VOLUME * Math.min(1, (f + 1) / 6) * Math.min(1, Math.max(0, (US_MIDTERMS_DURATION - f) / 15))}
    />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
