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
  UA,
  UA_SUBTITLES,
  UKRAINIAN_ELECTION_DURATION,
  WIPE,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/ukrainian-election/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/ukrainian-election/ui";
import { HookScene } from "../scenes/ukrainian-election/HookScene";
import { LoopsScene } from "../scenes/ukrainian-election/LoopsScene";
import { StillScene } from "../scenes/ukrainian-election/StillScene";
import { BanScene } from "../scenes/ukrainian-election/BanScene";
import { RehookScene } from "../scenes/ukrainian-election/RehookScene";
import { WhoScene } from "../scenes/ukrainian-election/WhoScene";
import { PresidentScene } from "../scenes/ukrainian-election/PresidentScene";
import { BallotScene } from "../scenes/ukrainian-election/BallotScene";
import { ComedianScene } from "../scenes/ukrainian-election/ComedianScene";
import { ParliamentScene } from "../scenes/ukrainian-election/ParliamentScene";
import { PMScene } from "../scenes/ukrainian-election/PMScene";
import { NextBallotScene } from "../scenes/ukrainian-election/NextBallotScene";
import { ThresholdScene } from "../scenes/ukrainian-election/ThresholdScene";
import { SaveScene } from "../scenes/ukrainian-election/SaveScene";
import { EmptySeatsScene } from "../scenes/ukrainian-election/EmptySeatsScene";
import { QuestionScene } from "../scenes/ukrainian-election/QuestionScene";

export { UKRAINIAN_ELECTION_DURATION };

/**
 * "Elections are banned in Ukraine.": the first video made to the TikTok Retention Rules (CLAUDE.md)
 * and the template for new ones. The hook line on frame 0; three open loops (why, who, what next);
 * the 2019 leaders still in office; martial law since the full-scale invasion banning every vote;
 * a re-hook ("sounds made up"); who can vote; the president (leads the army; tick one name, over
 * half or a run-off); 2019: TV comedian Zelensky's 73%; re-hook 2: his party, named after his TV
 * show, winning the Rada outright; what the Rada does and the July 2026 change of PM; the
 * never-used Rada ballot (tick a party, write a candidate's number, 5% line); save this; the 26
 * grey seats (the rewatch detail: occupied districts in 2019); and "Should Ukraine vote before the
 * war ends?" in the hook's layout, so the video loops. The look is the Swedish video's (the user's
 * Belgian reference) in Ukraine's blue and yellow. Plan, facts and sources: briefs/ukrainian-election-system/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  hook: HookScene,
  loops: LoopsScene,
  still: StillScene,
  why: BanScene,
  rehook: RehookScene,
  who: WhoScene,
  role: PresidentScene,
  ballot: BallotScene,
  comedian: ComedianScene,
  stranger: ParliamentScene,
  pm: PMScene,
  next: NextBallotScene,
  threshold: ThresholdScene,
  save: SaveScene,
  empty: EmptySeatsScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/ukrainian-election/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** Subtitles turn dark blue (with a dark blue pill) while the background is paper or yellow. */
const LIGHT_STYLE: SubtitleStyle = { color: UA.navy, shadow: "0 0 18px rgba(255,255,255,0.35)", highlight: UA.navy, activeColor: UA.yellow };
const subtitleStyle = (seconds: number): SubtitleStyle | undefined => {
  const frame = seconds * FPS;
  return LIGHT_SPANS.some(({ from, to }) => frame >= from + WIPE / 2 && frame < to - WIPE / 2) ? LIGHT_STYLE : undefined;
};

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENE_ORDER.slice(2).map((id) => ({ file: "whoosh", at: sceneFrom(id) - 3, volume: 0.11 })),
  { file: "thud", at: at("hook", "banned") - 1, volume: 0.2 },
  { file: "pop", at: at("loops", "Why") - 5, volume: 0.13 },
  { file: "pop", at: at("loops", "Who's") - 2, volume: 0.1 },
  { file: "pop", at: at("loops", "next") - 2, volume: 0.1 },
  { file: "pop", at: at("still", "president") - 4, volume: 0.12 },
  { file: "pop", at: at("still", "parliament") - 4, volume: 0.12 },
  { file: "thud", at: at("still", "2019", "end") - 4, volume: 0.14 },
  { file: "thud", at: at("why", "Since") - 2, volume: 0.18 },
  { file: "scribble", at: at("why", "invasion") - 2, volume: 0.12 },
  { file: "pop", at: at("why", "it") - 3, volume: 0.11 },
  { file: "pop", at: at("who", "18", "end") - 2, volume: 0.13 },
  { file: "pop", at: at("who", "abroad") - 4, volume: 0.11 },
  { file: "pop", at: at("role", "leads") - 6, volume: 0.13 },
  { file: "scribble", at: at("ballot", "tick") - 1, volume: 0.16 },
  { file: "thud", at: at("ballot", "or") - 6, volume: 0.17 },
  { file: "pop", at: at("comedian", "won") - 1, volume: 0.13 },
  { file: "pop", at: at("comedian", "73%") + 1, volume: 0.14 },
  { file: "pop", at: at("stranger", "named") - 4, volume: 0.12 },
  { file: "thud", at: at("stranger", "outright") - 2, volume: 0.17 },
  { file: "pop", at: at("rada", "makes") - 6, volume: 0.11 },
  { file: "whoosh", at: at("pm", "July") - 4, volume: 0.1 },
  { file: "scribble", at: at("next", "tick") - 1, volume: 0.16 },
  { file: "scribble", at: at("next", "write") - 1, volume: 0.18 },
  { file: "pop", at: sceneFrom("threshold") + 1, volume: 0.13 },
  { file: "thud", at: at("threshold", "seats") - 4, volume: 0.13 },
  { file: "pop", at: at("save", "Save") - 2, volume: 0.13 },
  { file: "pop", at: at("empty", "26") - 6, volume: 0.13 },
  { file: "pop", at: at("question", "ends") - 2, volume: 0.13 },
  { file: "chime", at: at("question", "ends", "end"), volume: 0.18 },
];

export const UkrainianElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: UA.bg }}>
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

    {/* A blue-and-yellow sweep (the flag's two stripes) opens the closing question, like the reference's colour wipes. */}
    <Sweep from={sceneFrom("question") - 8} length={16} />

    <Hud />
    <Grain />
    {/* Red is not in the flag: a yellow pill with dark blue text, at 110 px (rule 6), dark blue on light backgrounds. */}
    <Subtitles
      timing={timing}
      hide={UA_SUBTITLES}
      fontSize={110}
      maxChars={12}
      highlight={UA.yellow}
      activeColor={UA.navy}
      activeScale={1}
      styleAt={subtitleStyle}
    />

    <Audio src={staticFile(timing.audio)} />
    <Audio
      src={staticFile(MUSIC_FILE)}
      volume={(f) => MUSIC_VOLUME * Math.min(1, (f + 1) / 6) * Math.min(1, Math.max(0, (UKRAINIAN_ELECTION_DURATION - f) / 15))}
    />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
