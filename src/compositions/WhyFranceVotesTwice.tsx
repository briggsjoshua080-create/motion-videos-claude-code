import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { VIDEO } from "../config";
import { fadeInOut } from "../lib/animation";
import { Subtitles } from "../components/Subtitles";
import { getSentence, makeCue, type VoiceTiming } from "../voiceover/timing";
import timingJson from "../voiceover/why-france-votes-twice.timing.json";
import { FlagBackdrop, type SceneProps } from "../scenes/france-votes-twice/ui";
import { HookScene } from "../scenes/france-votes-twice/HookScene";
import { SignaturesScene } from "../scenes/france-votes-twice/SignaturesScene";
import { RuleScene } from "../scenes/france-votes-twice/RuleScene";
import { RunoffScene } from "../scenes/france-votes-twice/RunoffScene";
import { Round1Scene } from "../scenes/france-votes-twice/Round1Scene";
import { Round2Scene } from "../scenes/france-votes-twice/Round2Scene";
import { TermScene } from "../scenes/france-votes-twice/TermScene";
import { QuestionScene } from "../scenes/france-votes-twice/QuestionScene";

/** Vertical format for TikTok / Reels / Shorts. */
export const WHY_FRANCE_SIZE = { width: 1080, height: 1920 } as const;

const timing = timingJson as VoiceTiming;
const fps = VIDEO.fps;
const toFrame = (seconds: number) => Math.round(seconds * fps);

/** Each scene starts this many frames before its first word, so visuals lead the voice. */
const LEAD = 6;
/** Seconds the last scene stays up after the final word. */
const TAIL = 1.6;
const MUSIC_FILE = "audio/pad.mp3";
/** pad.mp3 is ~12 s; copies overlap by 1 s and cross-fade so the music never stops. */
const MUSIC_SECONDS = 12;
const MUSIC_OVERLAP = 1;
/** About 20 dB under the voice: there, but never in the way. */
const MUSIC_VOLUME = 0.19;

/** Scenes in order, each starting at the voice-over sentence it illustrates. */
const SCENES: { sentence: string; Scene: React.FC<SceneProps> }[] = [
  { sentence: "hook", Scene: HookScene },
  { sentence: "signatures", Scene: SignaturesScene },
  { sentence: "rule", Scene: RuleScene },
  { sentence: "runoff", Scene: RunoffScene },
  { sentence: "r1a", Scene: Round1Scene },
  { sentence: "r2", Scene: Round2Scene },
  { sentence: "term", Scene: TermScene },
  { sentence: "question", Scene: QuestionScene },
];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const WHY_FRANCE_DURATION_FRAMES = toFrame(lastSentence.end + TAIL);

const sceneStarts = SCENES.map((s, i) => (i === 0 ? 0 : toFrame(getSentence(timing, s.sentence).start) - LEAD));

const musicStep = toFrame(MUSIC_SECONDS - MUSIC_OVERLAP);
const musicCopies = Math.ceil(WHY_FRANCE_DURATION_FRAMES / musicStep);

export const WhyFranceVotesTwice: React.FC = () => (
  <AbsoluteFill>
    <FlagBackdrop />

    {SCENES.map(({ sentence, Scene }, i) => {
      const from = sceneStarts[i];
      const duration = (sceneStarts[i + 1] ?? WHY_FRANCE_DURATION_FRAMES) - from;
      return (
        <Sequence key={sentence} name={sentence} from={from} durationInFrames={duration}>
          <Scene cue={makeCue(timing, fps, from)} duration={duration} />
        </Sequence>
      );
    })}

    {/* The hook and the closing question already show their words big on screen. */}
    <Subtitles timing={timing} hide={["hook", "question"]} />

    <Audio src={staticFile(timing.audio)} />
    {Array.from({ length: musicCopies }, (_, k) => (
      <Sequence key={k} name={`music ${k + 1}`} from={k * musicStep} durationInFrames={toFrame(MUSIC_SECONDS)} layout="none">
        <Audio
          src={staticFile(MUSIC_FILE)}
          volume={(f) =>
            MUSIC_VOLUME *
            fadeInOut(f, toFrame(MUSIC_SECONDS), toFrame(MUSIC_OVERLAP)) *
            fadeInOut(k * musicStep + f, WHY_FRANCE_DURATION_FRAMES, toFrame(1))
          }
        />
      </Sequence>
    ))}
  </AbsoluteFill>
);
