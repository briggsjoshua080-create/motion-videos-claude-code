import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { makeCue } from "../voiceover/timing";
import { Subtitles, type SubtitleStyle } from "../components/Subtitles";
import { EXIT_FRAMES } from "../components/explainer/motion";
// Same fonts as the Swedish video (Archivo Black, Instrument Serif, JetBrains Mono).
import "../scenes/swedish-election/fonts";
import {
  CHINESE_ELECTION_DURATION,
  CN,
  CN_SUBTITLES,
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
} from "../scenes/chinese-election/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/chinese-election/ui";
import { HookScene } from "../scenes/chinese-election/HookScene";
import { LoopsScene } from "../scenes/chinese-election/LoopsScene";
import { FewScene } from "../scenes/chinese-election/FewScene";
import { RehookScene } from "../scenes/chinese-election/RehookScene";
import { WhoScene } from "../scenes/chinese-election/WhoScene";
import { BallotScene } from "../scenes/chinese-election/BallotScene";
import { SeatsScene } from "../scenes/chinese-election/SeatsScene";
import { OnlyScene } from "../scenes/chinese-election/OnlyScene";
import { LadderScene } from "../scenes/chinese-election/LadderScene";
import { NpcScene } from "../scenes/chinese-election/NpcScene";
import { WeekScene } from "../scenes/chinese-election/WeekScene";
import { PresidentScene } from "../scenes/chinese-election/PresidentScene";
import { LimitScene } from "../scenes/chinese-election/LimitScene";
import { PremierScene } from "../scenes/chinese-election/PremierScene";
import { ResultScene } from "../scenes/chinese-election/ResultScene";
import { SaveScene } from "../scenes/chinese-election/SaveScene";
import { StarScene } from "../scenes/chinese-election/StarScene";
import { QuestionScene } from "../scenes/chinese-election/QuestionScene";

export { CHINESE_ELECTION_DURATION };

/**
 * "Xi won 2,952 votes to zero.": China's election system in the current standard look, in the style
 * of RussianElection2036, made to the TikTok Retention Rules (CLAUDE.md). The hook line and a
 * pyramid of people's congresses on frame 0 (the small star above its tip is the rewatch detail);
 * three open loops (who voted, why nobody said no, who really runs China); not the public but just
 * under 3,000 lawmakers; re-hook 1 (a billion people vote this year); who can vote (18+, only for a
 * local congress); the local ballot (back, reject or write in); more names than seats; re-hook 2
 * (the only vote you get); the ladder of congresses; the National People's Congress (passes the
 * laws, a week a year); the president (one name), the 2018 end of the term limit, the premier;
 * Xi's 2023 third term; save this for 2027; the star (the Communist Party, whose top 205 pick the
 * real boss); and "Is one name on a ballot a real choice?" in the hook's layout, so the video loops.
 * Deep Chinese red, yellow accent blocks, yellow re-hook flashes. Plan, facts and sources:
 * briefs/chinese-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  hook: HookScene,
  loops: LoopsScene,
  few: FewScene,
  rehook: RehookScene,
  who: WhoScene,
  ballot: BallotScene,
  seats: SeatsScene,
  only: OnlyScene,
  ladder: LadderScene,
  npc: NpcScene,
  week: WeekScene,
  president: PresidentScene,
  limit: LimitScene,
  premier: PremierScene,
  result: ResultScene,
  save: SaveScene,
  star: StarScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/chinese-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** On paper the words turn dark (red pill, white text); on a yellow flash they turn dark red (red pill, yellow text). */
const PAPER_STYLE: SubtitleStyle = { color: CN.ink, shadow: "0 0 18px rgba(255,255,255,0.35)", highlight: CN.red, activeColor: CN.white };
const FLASH_STYLE: SubtitleStyle = { color: CN.maroon, shadow: "0 0 18px rgba(255,255,255,0.4)", highlight: CN.red, activeColor: CN.yellow };
const subtitleStyle = (seconds: number): SubtitleStyle | undefined => {
  const frame = seconds * FPS;
  const span = LIGHT_SPANS.find(({ from, to }) => frame >= from + WIPE / 2 && frame < to - WIPE / 2);
  return span ? (span.kind === "paper" ? PAPER_STYLE : FLASH_STYLE) : undefined;
};

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(2).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 3, volume: 0.11 })),
  { file: "thud", at: at("hook", "zero") - 1, volume: 0.2 },
  { file: "pop", at: at("loops", "Who") - 5, volume: 0.13 },
  { file: "pop", at: at("loops", "Why") - 2, volume: 0.1 },
  { file: "pop", at: at("loops", "And") - 2, volume: 0.1 },
  { file: "pop", at: at("few", "3,000", "end") - 2, volume: 0.13 },
  { file: "pop", at: at("who", "18", "end") - 2, volume: 0.13 },
  { file: "scribble", at: at("ballot", "back") - 2, volume: 0.16 },
  { file: "scribble", at: at("ballot", "reject") - 2, volume: 0.16 },
  { file: "scribble", at: at("ballot", "write") - 2, volume: 0.14 },
  { file: "thud", at: at("seats", "lose") - 2, volume: 0.15 },
  { file: "pop", at: at("only", "only") - 2, volume: 0.13 },
  { file: "pop", at: at("ladder", "city") - 3, volume: 0.1 },
  { file: "pop", at: at("ladder", "province") - 3, volume: 0.1 },
  { file: "pop", at: at("ladder", "nation") - 3, volume: 0.12 },
  { file: "pop", at: at("week", "week") - 4, volume: 0.13 },
  { file: "scribble", at: at("president", "one") - 2, volume: 0.15 },
  { file: "thud", at: at("limit", "2018") + 5, volume: 0.18 },
  { file: "pop", at: at("premier", "names") + 2, volume: 0.12 },
  { file: "thud", at: at("result", "Xi") - 1, volume: 0.17 },
  { file: "pop", at: at("save", "Save") - 2, volume: 0.13 },
  { file: "pop", at: at("star", "star") - 4, volume: 0.13 },
  { file: "pop", at: at("star", "Its") - 4, volume: 0.13 },
  { file: "pop", at: at("question", "choice") - 2, volume: 0.13 },
  { file: "chime", at: at("question", "choice", "end"), volume: 0.18 },
];

export const ChineseElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CN.bg }}>
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

    {/* A red-and-yellow sweep opens the closing question. */}
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Red does not read on the red background: a yellow pill with dark red text (the flag's stars), at 110 px (rule 6). */}
    <Subtitles timing={timing} hide={CN_SUBTITLES} fontSize={110} maxChars={12} highlight={CN.yellow} activeColor={CN.redDeep} activeScale={1} styleAt={subtitleStyle} />

    <Audio src={staticFile(timing.audio)} />
    <Audio
      src={staticFile(MUSIC_FILE)}
      volume={(f) => MUSIC_VOLUME * Math.min(1, (f + 1) / 6) * Math.min(1, Math.max(0, (CHINESE_ELECTION_DURATION - f) / 15))}
    />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
