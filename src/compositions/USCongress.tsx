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
  US_CONGRESS_DURATION,
  US_SUBTITLES,
  WIPE,
  type SceneId,
  type SceneProps,
  at,
  sceneEnd,
  sceneFrom,
  timing,
} from "../scenes/us-congress/constants";
import { Backdrop, Grain, Hud, Sweep } from "../scenes/us-congress/ui";
import { HookScene } from "../scenes/us-congress/HookScene";
import { LoopsScene } from "../scenes/us-congress/LoopsScene";
import { ApprovalScene } from "../scenes/us-congress/ApprovalScene";
import { MembersScene } from "../scenes/us-congress/MembersScene";
import { HouseScene } from "../scenes/us-congress/HouseScene";
import { RehookScene } from "../scenes/us-congress/RehookScene";
import { WyomingScene } from "../scenes/us-congress/WyomingScene";
import { PowerScene } from "../scenes/us-congress/PowerScene";
import { PresidentScene } from "../scenes/us-congress/PresidentScene";
import { LawScene } from "../scenes/us-congress/LawScene";
import { StrangeScene } from "../scenes/us-congress/StrangeScene";
import { ShutdownScene } from "../scenes/us-congress/ShutdownScene";
import { ResultScene } from "../scenes/us-congress/ResultScene";
import { NextScene } from "../scenes/us-congress/NextScene";
import { ShareScene } from "../scenes/us-congress/ShareScene";
import { DotsScene } from "../scenes/us-congress/DotsScene";
import { QuestionScene } from "../scenes/us-congress/QuestionScene";

export { US_CONGRESS_DURATION };

/**
 * "America's most hated group chat writes every law.": how the US Congress works, explained as a
 * comedy (briefs/comedy-explainer-formula.md) on top of the TikTok Retention Rules (CLAUDE.md). The
 * premise: Congress is America's group chat. The hook over a chat window with a hidden "typing…"
 * bubble; who's in it, why does nothing get sent, where's the president; 14% approval ("Ouch.");
 * 535 members, the House (435, one per district, every two years) and the Senate (two per state,
 * six years); re-hook 1: Wyoming gets as many senators as California, with 68× fewer people; every
 * law, tax and dollar goes through Congress; the president isn't in the chat, he signs or vetoes,
 * two thirds overrule him; re-hook 2: ignore a bill ten days and it's law anyway; shutdowns (43 days
 * in 2025); 3 Nov 2026: Democrats took both chambers; every law needs both parties ("left on
 * read"); send this; the typing dots (senators talking, the 25-hour record, 60 votes to end it);
 * and "Should the Senate scrap 60-vote rules?" in the hook's layout, so the video loops. The
 * standard look in Old Glory blue with red accents and red re-hook flashes. The narrator's
 * delivery changes per line (speed and punctuation in the voice-over script).
 * Plan, facts and sources: briefs/us-congress/.
 */
const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  hook: HookScene,
  loops: LoopsScene,
  approval: ApprovalScene,
  members: MembersScene,
  house: HouseScene,
  rehook: RehookScene,
  wyoming: WyomingScene,
  power: PowerScene,
  president: PresidentScene,
  law: LawScene,
  strange: StrangeScene,
  shutdown: ShutdownScene,
  result: ResultScene,
  next: NextScene,
  share: ShareScene,
  dots: DotsScene,
  question: QuestionScene,
};

const MUSIC_FILE = "audio/us-congress/music.mp3";
/** Soft bed, about 16 LU under the voice. */
const MUSIC_VOLUME = 0.11;

/** On a red flash the pill turns white with red text. */
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
  { file: "pop", at: at("hook", "law") - 3, volume: 0.14 },
  { file: "pop", at: at("loops", "Who's") - 5, volume: 0.13 },
  { file: "pop", at: at("loops", "Why") - 2, volume: 0.1 },
  { file: "pop", at: at("loops", "Where's") - 2, volume: 0.1 },
  { file: "thud", at: at("approval", "Ouch") - 1, volume: 0.2 },
  { file: "pop", at: at("members", "535", "end") - 2, volume: 0.13 },
  { file: "pop", at: at("house", "435") - 3, volume: 0.12 },
  { file: "thud", at: at("house", "every") - 1, volume: 0.15 },
  { file: "pop", at: at("senate", "six") - 3, volume: 0.12 },
  { file: "thud", at: at("rehook", "Wyoming"), volume: 0.15 },
  { file: "thud", at: at("rehook", "California") - 2, volume: 0.2 },
  { file: "pop", at: at("wyoming", "68") - 3, volume: 0.14 },
  { file: "pop", at: at("power", "law") - 4, volume: 0.12 },
  { file: "pop", at: at("power", "tax") - 4, volume: 0.12 },
  { file: "pop", at: at("power", "dollar") - 4, volume: 0.13 },
  { file: "whoosh", at: at("power", "through") - 4, volume: 0.12 },
  { file: "thud", at: at("president", "Not") - 2, volume: 0.17 },
  { file: "pop", at: at("law", "Both") + 2, volume: 0.11 },
  { file: "pop", at: at("law", "chats") + 2, volume: 0.11 },
  { file: "scribble", at: at("law", "signs") - 2, volume: 0.15 },
  { file: "thud", at: at("law", "vetoes") - 1, volume: 0.2 },
  { file: "pop", at: at("override", "Two") - 3, volume: 0.13 },
  { file: "scribble", at: at("override", "overrule") - 2, volume: 0.15 },
  { file: "pop", at: at("strange", "ignore"), volume: 0.1 },
  { file: "thud", at: at("strange", "law") - 1, volume: 0.2 },
  { file: "thud", at: at("shutdown", "Shutdown") - 1, volume: 0.18 },
  { file: "pop", at: at("shutdown", "43") - 3, volume: 0.13 },
  { file: "pop", at: at("result", "both") - 3, volume: 0.14 },
  { file: "pop", at: at("next", "both") - 3, volume: 0.12 },
  { file: "chime", at: at("next", "lot") - 2, volume: 0.1 },
  { file: "thud", at: at("next", "read") - 2, volume: 0.16 },
  { file: "whoosh", at: at("share", "Send") - 5, volume: 0.12 },
  { file: "pop", at: at("dots", "dots", "end") - 3, volume: 0.13 },
  { file: "pop", at: at("dots", "25") - 3, volume: 0.13 },
  { file: "thud", at: at("dots", "60") - 2, volume: 0.16 },
  { file: "pop", at: at("question", "scrap") - 2, volume: 0.13 },
  { file: "chime", at: at("question", "rule", "end"), volume: 0.18 },
];

export const USCongress: React.FC = () => (
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
      volume={(f) => MUSIC_VOLUME * Math.min(1, (f + 1) / 6) * Math.min(1, Math.max(0, (US_CONGRESS_DURATION - f) / 15))}
    />
    {SFX.map(({ file, at: frame, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, frame)} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
