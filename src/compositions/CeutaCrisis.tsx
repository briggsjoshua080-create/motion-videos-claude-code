import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { makeCue } from "../voiceover/timing";
import { Subtitles, type SubtitleStyle } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
// Same fonts as the Swedish video (Archivo Black, Instrument Serif, JetBrains Mono).
import "../scenes/swedish-election/fonts";
import {
  CEUTA_CRISIS_DURATION,
  CE,
  CE_SUBTITLES,
  FPS,
  LIGHT_SPANS,
  SCENE_ORDER,
  WIPE,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/ceuta-crisis/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/ceuta-crisis/ui";
import { HookScene } from "../scenes/ceuta-crisis/HookScene";
import { LoopsScene } from "../scenes/ceuta-crisis/LoopsScene";
import { WhereScene } from "../scenes/ceuta-crisis/WhereScene";
import { FenceScene } from "../scenes/ceuta-crisis/FenceScene";
import { SwimScene } from "../scenes/ceuta-crisis/SwimScene";
import { RehookScene } from "../scenes/ceuta-crisis/RehookScene";
import { ThreeScene } from "../scenes/ceuta-crisis/ThreeScene";
import { GeoScene } from "../scenes/ceuta-crisis/GeoScene";
import { LawScene } from "../scenes/ceuta-crisis/LawScene";
import { JobsScene } from "../scenes/ceuta-crisis/JobsScene";
import { RumourScene } from "../scenes/ceuta-crisis/RumourScene";
import { SparkScene } from "../scenes/ceuta-crisis/SparkScene";
import { ItalyScene } from "../scenes/ceuta-crisis/ItalyScene";
import { BeforeScene } from "../scenes/ceuta-crisis/BeforeScene";
import { BackScene } from "../scenes/ceuta-crisis/BackScene";
import { DeadScene } from "../scenes/ceuta-crisis/DeadScene";
import { DateScene } from "../scenes/ceuta-crisis/DateScene";
import { StoppedScene } from "../scenes/ceuta-crisis/StoppedScene";
import { AgainScene } from "../scenes/ceuta-crisis/AgainScene";
import { SmallerScene } from "../scenes/ceuta-crisis/SmallerScene";
import { BuoysScene } from "../scenes/ceuta-crisis/BuoysScene";
import { SaveScene } from "../scenes/ceuta-crisis/SaveScene";
import { QuestionScene } from "../scenes/ceuta-crisis/QuestionScene";

export { CEUTA_CRISIS_DURATION };

/**
 * "A city of 83,000. 72,000 arrived.": the summer 2026 Ceuta crisis (29–31 July) in the current
 * standard look, made to the TikTok Retention Rules (CLAUDE.md) and themed to the topic: Strait sea
 * blue with rescue orange. The hook line over a chart of Ceuta's border (its dotted orange line in the
 * sea is the rewatch detail); three open loops (how, why that week, again?); 01 what: Spain in Africa,
 * a fence that stops at the sea, tens of thousands swam round it; re-hook 1 (they thought the border
 * was open); 02 why: three circles (geography, politics, social) fill one by one; re-hook 2 (the Facebook
 * rumour, orange flash); all three met in one week (a spark where they overlap); 03 after: 70,000 went
 * back, at least 80 died, Italy brought back border checks; 04 again?: a new date (15 August), Morocco
 * stopped it, not the first time (2021), not this big soon, smaller swims almost surely; the dotted line is a
 * floating barrier; save this; and "Should Spain send swimmers back at once?" in the hook's layout.
 * Plan, facts and sources: briefs/ceuta-crisis-2026/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  hook: HookScene,
  loops: LoopsScene,
  where: WhereScene,
  fence: FenceScene,
  swim: SwimScene,
  rehook: RehookScene,
  three: ThreeScene,
  geo: GeoScene,
  law: LawScene,
  jobs: JobsScene,
  rumour: RumourScene,
  spark: SparkScene,
  back: BackScene,
  dead: DeadScene,
  italy: ItalyScene,
  date: DateScene,
  stopped: StoppedScene,
  before: BeforeScene,
  again: AgainScene,
  smaller: SmallerScene,
  buoys: BuoysScene,
  save: SaveScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/ceuta-crisis/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** On chart paper the words turn dark (orange pill, navy text); on an orange flash they turn navy (navy pill, orange text). */
const PAPER_STYLE: SubtitleStyle = { color: CE.ink, shadow: "0 0 18px rgba(255,255,255,0.35)", highlight: CE.orange, activeColor: CE.navy };
const FLASH_STYLE: SubtitleStyle = { color: CE.navy, shadow: "0 0 18px rgba(255,255,255,0.4)", highlight: CE.navy, activeColor: CE.orange };
const subtitleStyle = (seconds: number): SubtitleStyle | undefined => {
  const frame = seconds * FPS;
  const span = LIGHT_SPANS.find(({ from, to }) => frame >= from + WIPE / 2 && frame < to - WIPE / 2);
  return span ? (span.kind === "paper" ? PAPER_STYLE : FLASH_STYLE) : undefined;
};

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. No pop on the deaths beat. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(2)
    .filter((id) => id !== "swim" && id !== "smaller" && id !== "dead")
    .map((id) => ({ file: "whoosh", at: sceneFrom(id) - 3, volume: 0.11 })),
  { file: "thud", at: at("hook", "72,000") - 1, volume: 0.2 },
  { file: "pop", at: at("loops", "How") - 5, volume: 0.13 },
  { file: "pop", at: at("loops", "Why") - 2, volume: 0.1 },
  { file: "pop", at: at("loops", "Could") - 2, volume: 0.1 },
  { file: "pop", at: at("where", "Africa") - 3, volume: 0.12 },
  { file: "scribble", at: sceneFrom("fence") + 6, volume: 0.12 },
  { file: "pop", at: at("fence", "sea") - 3, volume: 0.12 },
  { file: "pop", at: at("rehook", "open") - 2, volume: 0.13 },
  { file: "pop", at: sceneFrom("three") + 4, volume: 0.1 },
  { file: "pop", at: sceneFrom("three") + 10, volume: 0.1 },
  { file: "pop", at: sceneFrom("three") + 16, volume: 0.1 },
  { file: "thud", at: at("law", "sent") - 2, volume: 0.17 },
  { file: "scribble", at: at("jobs", "closed") - 3, volume: 0.12 },
  { file: "pop", at: at("rumour", "Facebook") - 4, volume: 0.13 },
  { file: "pop", at: at("rumour", "border") - 2, volume: 0.1 },
  { file: "thud", at: at("spark", "met") - 4, volume: 0.16 },
  { file: "thud", at: at("italy", "checks") - 2, volume: 0.15 },
  { file: "thud", at: at("date", "date") - 4, volume: 0.16 },
  { file: "pop", at: at("before", "May") - 4, volume: 0.12 },
  { file: "pop", at: at("before", "thousands") - 2, volume: 0.12 },
  { file: "thud", at: at("stopped", "stopped") - 2, volume: 0.18 },
  { file: "pop", at: at("smaller", "Almost") - 2, volume: 0.12 },
  { file: "pop", at: at("buoys", "floating") - 4, volume: 0.13 },
  { file: "pop", at: at("save", "Save") - 2, volume: 0.13 },
  { file: "pop", at: at("question", "back") - 2, volume: 0.13 },
  { file: "chime", at: at("question", "once", "end"), volume: 0.18 },
];

export const CeutaCrisis: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CE.bg }}>
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

    {/* An orange-and-white sweep opens the closing question. */}
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Rescue orange with navy text, at 110 px (rule 6). */}
    <Subtitles timing={timing} hide={CE_SUBTITLES} fontSize={110} maxChars={12} highlight={CE.orange} activeColor={CE.navy} activeScale={1} styleAt={subtitleStyle} />

    <Audio src={staticFile(timing.audio)} />
    <Audio
      src={staticFile(MUSIC_FILE)}
      volume={(f) => MUSIC_VOLUME * Math.min(1, (f + 1) / 6) * Math.min(1, Math.max(0, (CEUTA_CRISIS_DURATION - f) / 15))}
    />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
