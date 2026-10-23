import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, MAJORITY, PM_2026, SE, TOTAL, type SceneProps } from "./constants";
import { Accent, Eyebrow, Glass, Headline, Mono, PersonIcon, Stamp } from "./ui";

const NAME = { top: 640, height: 150 } as const;
const VOTE = { top: 820, height: 262 } as const;
const BAR = { left: 40, top: 92, width: 760, height: 56 } as const;

/**
 * "In 2026, the Speaker's first pick was voted down." The 2026 note: the Speaker's first proposal,
 * Magdalena Andersson, 99 yes and 248 no (the 175 line is crossed) on 15 Oct 2026, REJECTED, and
 * a date-stamped "talks go on". Facts and the date they were checked: briefs/swedish-election-system/.
 */
export const NowScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const name = rise(frame, cue("now", "Speaker's") - 8);
  const vote = rise(frame, cue("now", "first") - 6);
  const fill = progress(frame, cue("now", "first") - 4, cue("now", "was") + 2, Easing.out(Easing.quad));
  const stamp = pop(frame, cue("now", "voted") - 4);
  const talks = rise(frame, cue("now", "first"));

  const yesW = (BAR.width * PM_2026.yes) / TOTAL;
  const noW = (BAR.width * PM_2026.no) / TOTAL;
  const lineX = BAR.left + (BAR.width * MAJORITY) / TOTAL;

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>07 — ELECTION OF 13 SEPT 2026</Eyebrow>
      <Headline size={132} style={{ top: 350, ...riseStyle(head[0], exit, 50) }}>
        <Accent>2026:</Accent>
      </Headline>
      <Headline size={112} style={{ top: 350 + 136, ...riseStyle(head[1], exit, 50) }}>
        VOTED DOWN
      </Headline>

      <Glass top={NAME.top} height={NAME.height} tick={SE.white} style={riseStyle(name, exit, 40)}>
        <div style={{ position: "absolute", left: 30, top: 34 }}>
          <PersonIcon size={80} />
        </div>
        <div style={{ position: "absolute", left: 136, top: 32, fontFamily: FONT.display, fontSize: 42, lineHeight: 1, color: SE.white, whiteSpace: "nowrap" }}>
          {PM_2026.name.toUpperCase()}
        </div>
        <div style={{ position: "absolute", left: 138, top: 88, fontSize: 26, fontWeight: 500, color: SE.textSoft }}>
          {PM_2026.party} · the Speaker's first pick
        </div>
      </Glass>

      <Glass top={VOTE.top} height={VOTE.height} tick={SE.yellow} style={riseStyle(vote, exit, 40)}>
        <Mono size={21} style={{ position: "absolute", left: 40, top: 32 }}>
          {PM_2026.date.toUpperCase()} · {TOTAL} MEMBERS
        </Mono>
        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.width, height: BAR.height, borderRadius: 12, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: yesW * Math.min(1, fill * 2), height: "100%", background: SE.yellow }} />
          <div style={{ position: "absolute", right: 0, top: 0, width: noW * fill, height: "100%", background: SE.white, boxShadow: "0 0 24px rgba(255,255,255,0.4)" }} />
        </div>
        <div style={{ position: "absolute", left: lineX - 3, top: BAR.top - 20, width: 6, height: BAR.height + 40, borderRadius: 3, background: SE.blueNight, boxShadow: "0 0 0 2px rgba(254,204,2,0.9)" }} />
        <div style={{ position: "absolute", left: 40, top: 172, fontFamily: FONT.display, fontSize: 52, lineHeight: 1, color: SE.yellow, opacity: fill > 0 ? 1 : 0 }}>
          {Math.round(PM_2026.yes * Math.min(1, fill * 2))} <span style={{ fontSize: 30 }}>YES</span>
        </div>
        <div style={{ position: "absolute", right: 40, top: 172, fontFamily: FONT.display, fontSize: 52, lineHeight: 1, color: SE.white, opacity: fill > 0 ? 1 : 0 }}>
          {Math.round(PM_2026.no * fill)} <span style={{ fontSize: 30 }}>NO</span>
        </div>
        <Stamp p={stamp} size={54} rotate={-7} style={{ left: 246, top: 156 }}>
          REJECTED
        </Stamp>
      </Glass>

      <Mono size={21} color={SE.yellow} style={{ position: "absolute", left: 120, top: 1120, ...riseStyle(talks, exit, 20) }}>
        TALKS GO ON — AS OF {PM_2026.asOf}
      </Mono>
    </>
  );
};
