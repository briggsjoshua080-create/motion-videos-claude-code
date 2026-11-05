import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { makeCue } from "../voiceover/timing";
import { Subtitles, type SubtitleStyle } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
// Same fonts as the Swedish video (Archivo Black, Instrument Serif, JetBrains Mono).
import "../scenes/swedish-election/fonts";
import {
  BURNHAM_PM_DURATION,
  FPS,
  HIDDEN_SUBTITLES,
  LIGHT_SPANS,
  SCENE_ORDER,
  UK,
  WIPE,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/burnham-pm/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/burnham-pm/ui";
import { HookScene } from "../scenes/burnham-pm/HookScene";
import { LoopsScene } from "../scenes/burnham-pm/LoopsScene";
import { ChairsScene } from "../scenes/burnham-pm/ChairsScene";
import { SevenScene } from "../scenes/burnham-pm/SevenScene";
import { RehookScene } from "../scenes/burnham-pm/RehookScene";
import { BlockedScene } from "../scenes/burnham-pm/BlockedScene";
import { GreensScene } from "../scenes/burnham-pm/GreensScene";
import { MayScene } from "../scenes/burnham-pm/MayScene";
import { StrangeScene } from "../scenes/burnham-pm/StrangeScene";
import { BallotScene } from "../scenes/burnham-pm/BallotScene";
import { QuitScene } from "../scenes/burnham-pm/QuitScene";
import { ContestScene } from "../scenes/burnham-pm/ContestScene";
import { KingScene } from "../scenes/burnham-pm/KingScene";
import { NextScene } from "../scenes/burnham-pm/NextScene";
import { ShareScene } from "../scenes/burnham-pm/ShareScene";
import { CrownScene } from "../scenes/burnham-pm/CrownScene";
import { QuestionScene } from "../scenes/burnham-pm/QuestionScene";

export { BURNHAM_PM_DURATION };

/**
 * "Britain's new PM won under 25,000 votes.": how and why Andy Burnham became UK prime minister
 * (20 July 2026), a comedy explainer in the USMidterms style (briefs/comedy-explainer-formula.md on
 * top of the TikTok Retention Rules). The premise is musical chairs: you need a chair (a Commons
 * seat) to be PM. The hook over a green Commons chair with a hidden crown tag; three open loops
 * (how, whose seat, why now); Britons never vote for a PM (650 seats, the biggest party's leader
 * gets No. 10); swap the leader, swap the PM, seven in ten years; re-hook 1 (Labour's leader needs
 * a seat; the chair is yanked away); the mayor of Manchester blocked from a by-election, which
 * Labour lost to the Greens; May's crash and nearly 100 MPs telling Starmer to go; re-hook 2 (an MP
 * gave him his seat); one cross on the Makerfield ballot, won by 9,000; Starmer quits four days
 * later; a fifth of Labour MPs needed, Burnham got 90%, rivals zero; the King made him PM; everyone
 * else votes by 2029; send this; the crown tag (MPs can't quit, so they take the Chiltern
 * Hundreds); and "Should a new PM face voters first?" in the hook's layout, so the video loops.
 * Plan, facts and sources: briefs/burnham-prime-minister/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  hook: HookScene,
  loops: LoopsScene,
  chairs: ChairsScene,
  seven: SevenScene,
  rehook: RehookScene,
  blocked: BlockedScene,
  greens: GreensScene,
  may: MayScene,
  strange: StrangeScene,
  ballot: BallotScene,
  quit: QuitScene,
  contest: ContestScene,
  king: KingScene,
  next: NextScene,
  share: ShareScene,
  crown: CrownScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/burnham-pm/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** On paper the words turn dark (red pill, white text); on a red flash the pill turns white with red text. */
const PAPER_STYLE: SubtitleStyle = { color: UK.ink, shadow: "0 0 18px rgba(255,255,255,0.35)", highlight: UK.red, activeColor: UK.white };
const FLASH_STYLE: SubtitleStyle = { color: UK.white, shadow: "0 4px 18px rgba(80,0,0,0.5)", highlight: UK.white, activeColor: UK.red };
const subtitleStyle = (seconds: number): SubtitleStyle | undefined => {
  const frame = seconds * FPS;
  const span = LIGHT_SPANS.find(({ from, to }) => frame >= from + WIPE / 2 && frame < to - WIPE / 2);
  return span ? (span.kind === "paper" ? PAPER_STYLE : FLASH_STYLE) : undefined;
};

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word (the visual punchlines). */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(2).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 3, volume: 0.11 })),
  { file: "thud", at: at("hook", "25,000") - 1, volume: 0.2 },
  { file: "pop", at: at("loops", "How") - 5, volume: 0.13 },
  { file: "pop", at: at("loops", "Whose") - 2, volume: 0.1 },
  { file: "pop", at: at("loops", "why") - 2, volume: 0.1 },
  { file: "pop", at: at("chairs", "elect") - 2, volume: 0.1 },
  { file: "pop", at: at("chairs", "leader") - 3, volume: 0.14 },
  { file: "whoosh", at: at("seven", "Swap") - 2, volume: 0.1 },
  { file: "pop", at: at("seven", "Seven") - 6, volume: 0.1 },
  { file: "chime", at: at("seven", "years") - 2, volume: 0.12 },
  { file: "whoosh", at: at("rehook", "none") - 6, volume: 0.16 },
  { file: "thud", at: at("rehook", "none") - 1, volume: 0.17 },
  { file: "thud", at: at("blocked", "blocked") - 2, volume: 0.18 },
  { file: "pop", at: at("greens", "Greens") - 3, volume: 0.14 },
  { file: "thud", at: at("may", "crashed") + 2, volume: 0.15 },
  { file: "pop", at: at("may", "100") - 4, volume: 0.12 },
  { file: "pop", at: at("strange", "strange") - 3, volume: 0.13 },
  { file: "whoosh", at: at("strange", "hand") - 8, volume: 0.14 },
  { file: "scribble", at: at("ballot", "cross") - 4, volume: 0.16 },
  { file: "thud", at: at("ballot", "9,000"), volume: 0.16 },
  { file: "scribble", at: at("quit", "days") - 2, volume: 0.12 },
  { file: "thud", at: at("quit", "quit") - 2, volume: 0.16 },
  { file: "pop", at: at("contest", "fifth") - 4, volume: 0.12 },
  { file: "chime", at: at("contest", "90%", "end") - 2, volume: 0.13 },
  { file: "thud", at: at("contest", "Rivals") + 2, volume: 0.17 },
  { file: "chime", at: at("king", "King") - 4, volume: 0.15 },
  { file: "pop", at: at("king", "PM") - 3, volume: 0.12 },
  { file: "pop", at: at("next", "votes") + 4, volume: 0.13 },
  { file: "whoosh", at: at("share", "Send") - 5, volume: 0.12 },
  { file: "pop", at: at("crown", "MPs") - 4, volume: 0.12 },
  { file: "chime", at: at("crown", "So") - 4, volume: 0.15 },
  { file: "pop", at: at("question", "voters") - 2, volume: 0.13 },
  { file: "chime", at: at("question", "first", "end"), volume: 0.18 },
];

export const BurnhamPM: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: UK.bg }}>
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

    {/* A blue-and-red sweep (the flag's colours) opens the closing question. */}
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Red is in the flag and reads on the blue: the standard red pill, at 110 px (rule 6). */}
    <Subtitles timing={timing} hide={HIDDEN_SUBTITLES} fontSize={110} maxChars={12} highlight={UK.pill} activeColor={UK.white} activeScale={1} styleAt={subtitleStyle} />

    <Audio src={staticFile(timing.audio)} />
    <Audio
      src={staticFile(MUSIC_FILE)}
      volume={(f) => MUSIC_VOLUME * Math.min(1, (f + 1) / 6) * Math.min(1, Math.max(0, (BURNHAM_PM_DURATION - f) / 15))}
    />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
