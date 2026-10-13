import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { VERTICAL } from "../config";
import { fadeInOut } from "../lib/animation";
import { Subtitles } from "../components/Subtitles";
import { getSentence, getWordTime, makeCue, type VoiceTiming } from "../voiceover/timing";
import timingJson from "../voiceover/dutch-election.timing.json";
import { Backdrop, NL, type SceneProps } from "../scenes/dutch-election/ui";
import { HookScene } from "../scenes/dutch-election/HookScene";
import { KingScene } from "../scenes/dutch-election/KingScene";
import { RoleScene } from "../scenes/dutch-election/RoleScene";
import { VotersScene } from "../scenes/dutch-election/VotersScene";
import { SenateScene } from "../scenes/dutch-election/SenateScene";
import { ResultScene } from "../scenes/dutch-election/ResultScene";
import { CabinetScene } from "../scenes/dutch-election/CabinetScene";
import { QuestionScene } from "../scenes/dutch-election/QuestionScene";

/**
 * "Who runs the Netherlands?" — the Dutch election system and head of state, TikTok style.
 * Made to the standing brief in CLAUDE.md; script and sources in briefs/dutch-election-system/.
 */
const timing = timingJson as VoiceTiming;
const fps = VERTICAL.fps;
const toFrame = (seconds: number) => Math.round(seconds * fps);

/** Each scene starts this many frames before its first word, so visuals lead the voice. */
const LEAD = 6;
/** Seconds the closing question stays up after the final word. */
const TAIL = 1.4;
const MUSIC_FILE = "audio/dutch-election/music.mp3";
/** Soft bed, well under the voice. */
const MUSIC_VOLUME = 0.11;

/** Scenes in order, each starting at the voice-over sentence it illustrates. */
const SCENES: { sentence: string; Scene: React.FC<SceneProps> }[] = [
  { sentence: "hook", Scene: HookScene },
  { sentence: "king", Scene: KingScene },
  { sentence: "role", Scene: RoleScene },
  { sentence: "voters", Scene: VotersScene },
  { sentence: "senate", Scene: SenateScene },
  { sentence: "result", Scene: ResultScene },
  { sentence: "cabinet", Scene: CabinetScene },
  { sentence: "question", Scene: QuestionScene },
];

const lastSentence = timing.sentences[timing.sentences.length - 1];
export const DUTCH_ELECTION_DURATION = toFrame(lastSentence.end + TAIL);

const sceneStarts = SCENES.map((s, i) => (i === 0 ? 0 : toFrame(getSentence(timing, s.sentence).start) - LEAD));

/** Frame (in the composition) at which a word of the voice-over starts or ends. */
const word = (sentence: string, text: string, edge: "start" | "end" = "start") =>
  toFrame(getWordTime(timing, sentence, text, edge));

/** Light sound effects (public/audio/sfx/), each tied to a scene change or a spoken word. */
const SFX: { file: string; at: number; volume: number }[] = [
  ...sceneStarts.slice(1).map((at) => ({ file: "whoosh", at: at - 6, volume: 0.13 })),
  { file: "thud", at: word("hook", "never") + 3, volume: 0.3 },
  { file: "pop", at: word("hook", "who's"), volume: 0.2 },
  { file: "pop", at: word("king", "King"), volume: 0.16 },
  { file: "pop", at: word("king", "Amalia"), volume: 0.16 },
  { file: "scribble", at: word("role", "signs"), volume: 0.22 },
  { file: "scribble", at: word("role", "ministers"), volume: 0.22 },
  { file: "pop", at: word("role", "responsibility"), volume: 0.18 },
  { file: "scribble", at: word("voters", "fill") - 2, volume: 0.2 },
  { file: "pop", at: word("voters", "least"), volume: 0.16 },
  { file: "pop", at: word("senate", "Provincial"), volume: 0.16 },
  { file: "thud", at: word("senate", "not") + 3, volume: 0.28 },
  { file: "pop", at: word("result", "D66"), volume: 0.16 },
  { file: "pop", at: word("result", "PVV"), volume: 0.16 },
  { file: "pop", at: word("result", "majority"), volume: 0.16 },
  { file: "pop", at: word("cabinet", "coalition"), volume: 0.16 },
  { file: "chime", at: word("cabinet", "swore"), volume: 0.16 },
  { file: "pop", at: word("cabinet", "Rob"), volume: 0.16 },
  { file: "chime", at: word("question", "state", "end") + 4, volume: 0.2 },
];

export const DutchElection: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NL.deep }}>
    <Backdrop />

    {SCENES.map(({ sentence, Scene }, i) => {
      const from = sceneStarts[i];
      const duration = (sceneStarts[i + 1] ?? DUTCH_ELECTION_DURATION) - from;
      return (
        <Sequence key={sentence} name={sentence} from={from} durationInFrames={duration}>
          <Scene cue={makeCue(timing, fps, from)} duration={duration} />
        </Sequence>
      );
    })}

    {/* The closing question already shows its words big on screen. */}
    <Subtitles timing={timing} hide={["question"]} highlight={NL.orange} activeColor={NL.deep} />

    <Audio src={staticFile(timing.audio)} />
    <Audio src={staticFile(MUSIC_FILE)} volume={(f) => MUSIC_VOLUME * fadeInOut(f, DUTCH_ELECTION_DURATION, toFrame(1))} />
    {SFX.map(({ file, at, volume }, i) => (
      <Sequence key={`${file}-${i}`} name={`sfx ${file}`} from={Math.max(0, at)} durationInFrames={toFrame(2)} layout="none">
        <Audio src={staticFile(`audio/sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
