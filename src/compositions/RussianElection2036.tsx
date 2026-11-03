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
  RU,
  RU_SUBTITLES,
  RUSSIAN_ELECTION_2036_DURATION,
  SCENE_ORDER,
  WIPE,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/russian-election-2036/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/russian-election-2036/ui";
import { HookScene } from "../scenes/russian-election-2036/HookScene";
import { LoopsScene } from "../scenes/russian-election-2036/LoopsScene";
import { ResetScene } from "../scenes/russian-election-2036/ResetScene";
import { WhoScene } from "../scenes/russian-election-2036/WhoScene";
import { RehookScene } from "../scenes/russian-election-2036/RehookScene";
import { BallotScene } from "../scenes/russian-election-2036/BallotScene";
import { SeatsScene } from "../scenes/russian-election-2036/SeatsScene";
import { DumaScene } from "../scenes/russian-election-2036/DumaScene";
import { StrangerScene } from "../scenes/russian-election-2036/StrangerScene";
import { CouncilScene } from "../scenes/russian-election-2036/CouncilScene";
import { PMScene } from "../scenes/russian-election-2036/PMScene";
import { PresidentScene } from "../scenes/russian-election-2036/PresidentScene";
import { ResultScene } from "../scenes/russian-election-2036/ResultScene";
import { Duma2026Scene } from "../scenes/russian-election-2036/Duma2026Scene";
import { SaveScene } from "../scenes/russian-election-2036/SaveScene";
import { GapScene } from "../scenes/russian-election-2036/GapScene";
import { QuestionScene } from "../scenes/russian-election-2036/QuestionScene";

export { RUSSIAN_ELECTION_2036_DURATION };

/**
 * "Putin can legally rule until 2036.": the Russian election system redone in the current standard
 * look (copied from UkrainianElection) and to the TikTok Retention Rules (CLAUDE.md). The hook line
 * and a 2000–2036 timeline on frame 0 (its hollow 2008–12 stretch is the rewatch detail); three open
 * loops (how, who else, did the vote matter); the 2020 reset of his terms; who can vote; re-hook 1
 * ("you vote twice"); two ballots; half the seats by party above 5%, half district winners; the State
 * Duma; re-hook 2 (the upper house isn't elected); the Federation Council; the PM; the president
 * (six years, over half or a run-off); 2024 (87%) and 2026 (349 seats, a liberal rival barred); save
 * this; the gap (the old two-in-a-row limit, so he was PM 2008–12); and "Can a vote be fair if you
 * know who wins?" in the hook's layout, so the video loops. Deep Russian blue, red accent blocks, red
 * re-hook flashes. Plan, facts and sources: briefs/russian-election-2036/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  hook: HookScene,
  loops: LoopsScene,
  reset: ResetScene,
  who: WhoScene,
  rehook: RehookScene,
  ballot: BallotScene,
  seats: SeatsScene,
  duma: DumaScene,
  stranger: StrangerScene,
  council: CouncilScene,
  pm: PMScene,
  president: PresidentScene,
  result: ResultScene,
  duma2026: Duma2026Scene,
  save: SaveScene,
  gap: GapScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/russian-election-2036/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** On paper the words turn dark (red pill, white text); on a red flash the pill turns white with red text. */
const PAPER_STYLE: SubtitleStyle = { color: RU.ink, shadow: "0 0 18px rgba(255,255,255,0.35)", highlight: RU.red, activeColor: RU.white };
const FLASH_STYLE: SubtitleStyle = { color: RU.white, shadow: "0 4px 18px rgba(80,0,0,0.5)", highlight: RU.white, activeColor: RU.red };
const subtitleStyle = (seconds: number): SubtitleStyle | undefined => {
  const frame = seconds * FPS;
  const span = LIGHT_SPANS.find(({ from, to }) => frame >= from + WIPE / 2 && frame < to - WIPE / 2);
  return span ? (span.kind === "paper" ? PAPER_STYLE : FLASH_STYLE) : undefined;
};

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(2).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 3, volume: 0.11 })),
  { file: "thud", at: at("hook", "2036") - 1, volume: 0.2 },
  { file: "pop", at: at("loops", "How") - 5, volume: 0.13 },
  { file: "pop", at: at("loops", "Who") - 2, volume: 0.1 },
  { file: "pop", at: at("loops", "And") - 2, volume: 0.1 },
  { file: "thud", at: at("reset", "change") - 3, volume: 0.17 },
  { file: "pop", at: at("reset", "zero", "end") - 3, volume: 0.13 },
  { file: "pop", at: at("who", "18", "end") - 2, volume: 0.13 },
  { file: "pop", at: sceneFrom("rehook") + 9, volume: 0.12 },
  { file: "scribble", at: at("ballot", "party") - 2, volume: 0.16 },
  { file: "scribble", at: at("ballot", "candidate") - 2, volume: 0.16 },
  { file: "pop", at: at("seats", "half#2") - 8, volume: 0.11 },
  { file: "scribble", at: at("stranger", "isn't") - 4, volume: 0.16 },
  { file: "pop", at: at("council", "two") - 4, volume: 0.11 },
  { file: "pop", at: at("council", "president") - 4, volume: 0.12 },
  { file: "thud", at: at("pm", "picks") + 2, volume: 0.17 },
  { file: "thud", at: at("president", "years") - 2, volume: 0.16 },
  { file: "pop", at: at("result", "87%") + 3, volume: 0.14 },
  { file: "pop", at: at("duma2026", "349", "end"), volume: 0.13 },
  { file: "thud", at: at("duma2026", "seats") - 2, volume: 0.18 },
  { file: "pop", at: at("save", "Save") - 2, volume: 0.13 },
  { file: "pop", at: at("gap", "so") - 6, volume: 0.13 },
  { file: "pop", at: at("question", "wins") - 2, volume: 0.13 },
  { file: "chime", at: at("question", "wins", "end"), volume: 0.18 },
];

export const RussianElection2036: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: RU.bg }}>
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

    {/* A blue-and-red sweep (the flag's lower stripes) opens the closing question. */}
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Red is in the flag and reads on the blue: the standard red pill, at 110 px (rule 6). */}
    <Subtitles timing={timing} hide={RU_SUBTITLES} fontSize={110} maxChars={12} highlight={RU.red} activeColor={RU.white} activeScale={1} styleAt={subtitleStyle} />

    <Audio src={staticFile(timing.audio)} />
    <Audio
      src={staticFile(MUSIC_FILE)}
      volume={(f) => MUSIC_VOLUME * Math.min(1, (f + 1) / 6) * Math.min(1, Math.max(0, (RUSSIAN_ELECTION_2036_DURATION - f) / 15))}
    />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
