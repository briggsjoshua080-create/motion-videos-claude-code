import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { makeCue } from "../voiceover/timing";
import { Subtitles, type SubtitleStyle } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
// Same fonts as the Swedish video (Archivo Black, Instrument Serif, JetBrains Mono).
import "../scenes/swedish-election/fonts";
import {
  IRAN_CRISIS_START_DURATION,
  IR,
  IR_SUBTITLES,
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
} from "../scenes/iran-crisis-start/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/iran-crisis-start/ui";
import {
  CrackdownScene,
  DeadScene,
  FleetScene,
  HookScene,
  HormuzScene,
  JuneScene,
  LoopsScene,
  ProtestsScene,
  QuestionScene,
  RehookScene,
  RetaliateScene,
  SaveScene,
  SonScene,
  SpreadScene,
  StrikeScene,
  Talk26Scene,
  TalksScene,
  TwoDaysScene,
  UsDeadScene,
} from "../scenes/iran-crisis-start/scenes";

export { IRAN_CRISIS_START_DURATION };

/**
 * "One night killed Iran's leader.": how the 2026 Iran war began (June 2025 to the first ten days) in the
 * current standard look, made to the TikTok Retention Rules (CLAUDE.md) and themed to the topic: midnight
 * indigo with amber. The hook line over a dark map of Iran (the huge outlined 26 behind it is the rewatch
 * detail); three open loops (who struck, why then, who took over); the 28 Feb strikes and the death of
 * the supreme leader; re-hook 1 (the fuse was lit months earlier, amber flash); the June 2025 twelve-day
 * war, the unsolved nuclear dispute, the December protests and the crackdown (attributed); re-hook 2 (the
 * warships, amber flash); Iran's strikes on US bases, the first US deaths, tankers halting in Hormuz;
 * re-hook 3 (it spreads to Lebanon, amber flash); Mojtaba Khamenei named leader; the 26 February Geneva
 * talks two days before the bombs; "Part 2: where it stands now"; and "Was striking Iran justified?" in
 * the hook's layout. Plan, facts and sources: briefs/iran-crisis-start/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  hook: HookScene,
  loops: LoopsScene,
  strike: StrikeScene,
  dead: DeadScene,
  rehook: RehookScene,
  june: JuneScene,
  talks: TalksScene,
  protests: ProtestsScene,
  crackdown: CrackdownScene,
  fleet: FleetScene,
  retaliate: RetaliateScene,
  usdead: UsDeadScene,
  hormuz: HormuzScene,
  spread: SpreadScene,
  son: SonScene,
  talk26: Talk26Scene,
  twodays: TwoDaysScene,
  save: SaveScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/iran-crisis-start/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** On an amber flash the words turn navy (navy pill, amber text). */
const FLASH_STYLE: SubtitleStyle = { color: IR.navy, shadow: "0 0 18px rgba(255,255,255,0.4)", highlight: IR.navy, activeColor: IR.amber };
const subtitleStyle = (seconds: number): SubtitleStyle | undefined => {
  const frame = seconds * FPS;
  const span = LIGHT_SPANS.find(({ from, to }) => frame >= from + WIPE / 2 && frame < to - WIPE / 2);
  return span ? FLASH_STYLE : undefined;
};

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. No pop on the deaths beats. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(2)
    .filter((id) => id !== "dead" && id !== "usdead" && id !== "twodays")
    .map((id) => ({ file: "whoosh", at: sceneFrom(id) - 3, volume: 0.11 })),
  { file: "thud", at: at("hook", "Iran's") - 1, volume: 0.2 },
  { file: "pop", at: at("loops", "Who") - 4, volume: 0.13 },
  { file: "pop", at: at("loops", "Why") - 2, volume: 0.1 },
  { file: "pop", at: at("loops", "over") - 2, volume: 0.1 },
  { file: "pop", at: at("strike", "28") - 3, volume: 0.12 },
  { file: "thud", at: at("strike", "hundreds") - 2, volume: 0.16 },
  { file: "thud", at: at("dead", "killed") - 2, volume: 0.17 },
  { file: "pop", at: at("june", "twelve-day") - 3, volume: 0.12 },
  { file: "pop", at: at("talks", "ceasefire") - 2, volume: 0.12 },
  { file: "scribble", at: at("protests", "shops") - 2, volume: 0.12 },
  { file: "pop", at: at("fleet", "warships") - 3, volume: 0.13 },
  { file: "thud", at: at("retaliate", "hits") - 2, volume: 0.16 },
  { file: "thud", at: at("hormuz", "stop") - 2, volume: 0.17 },
  { file: "pop", at: at("spread", "Hezbollah") - 3, volume: 0.12 },
  { file: "pop", at: at("son", "Mojtaba") - 3, volume: 0.12 },
  { file: "pop", at: at("talk26", "26") - 2, volume: 0.14 },
  { file: "thud", at: at("twodays", "bombs") - 2, volume: 0.2 },
  { file: "pop", at: at("save", "Save") - 2, volume: 0.13 },
  { file: "pop", at: at("question", "Iran") - 2, volume: 0.13 },
  { file: "chime", at: at("question", "justified", "end"), volume: 0.18 },
];

export const IranCrisisStart: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: IR.bg }}>
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

    {/* An amber-and-white sweep opens the closing question. */}
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Amber with navy text, at 110 px (rule 6). */}
    <Subtitles timing={timing} hide={IR_SUBTITLES} fontSize={110} maxChars={12} highlight={IR.amber} activeColor={IR.navy} activeScale={1} styleAt={subtitleStyle} />

    <Audio src={staticFile(timing.audio)} />
    <Audio
      src={staticFile(MUSIC_FILE)}
      volume={(f) => MUSIC_VOLUME * Math.min(1, (f + 1) / 6) * Math.min(1, Math.max(0, (IRAN_CRISIS_START_DURATION - f) / 15))}
    />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
