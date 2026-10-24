import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CRISIS, FONT, INVESTITURE, JOINT, RO, type SceneProps } from "./constants";
import { Accent, Eyebrow, Glass, Headline, Mark, Mono, PersonIcon, Stamp } from "./ui";

const OUT = { top: 640, height: 150 } as const;
const FAILS = { top: 812 } as const;
const IN = { top: 880, height: 330 } as const;
const BAR = { left: 40, top: 168, width: 760, height: 50 } as const;

/**
 * "In 2026, parliament ousted the prime minister. The president's fourth pick, Luca Niculescu, won
 * 280 votes." The 2026 crisis: Ilie Bolojan's card gets an OUSTED stamp, three crossed-out failed
 * picks, then Luca Niculescu's card with the vote of 20 Oct 2026 (280 yes, 58 no, past the 233
 * line) and APPROVED. Facts and the date they were checked: briefs/romanian-election-system/.
 */
export const NowScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 2), rise(frame, 6)];
  const outCard = rise(frame, cue("now", "parliament") - 8);
  const ousted = pop(frame, cue("now", "ousted") - 3);
  const fails = [0, 1, 2].map((i) => progress(frame, cue("now", "president's") - 2 + i * 4, cue("now", "president's") + 8 + i * 4));
  const failsLabel = rise(frame, cue("now", "president's") - 4);
  const inCard = rise(frame, cue("now", "Luca") - 8);
  const fill = progress(frame, cue("now", "won") - 4, cue("now", "votes") + 2, Easing.out(Easing.quad));
  const approved = pop(frame, cue("now", "votes") - 2);
  const note = rise(frame, cue("now", "votes"));

  const lineX = BAR.left + (BAR.width * INVESTITURE) / JOINT;
  const yesW = (BAR.width * CRISIS.pm.yes) / JOINT;
  const noW = (BAR.width * CRISIS.pm.no) / JOINT;

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>08 — SINCE THEN</Eyebrow>
      <Headline size={132} style={{ top: 350, ...riseStyle(head[0], exit, 50) }}>
        <Accent>2026:</Accent>
      </Headline>
      <Headline size={112} style={{ top: 350 + 136, ...riseStyle(head[1], exit, 50) }}>
        A NEW PM
      </Headline>

      <Glass top={OUT.top} height={OUT.height} tick={RO.white} style={riseStyle(outCard, exit, 40)}>
        <div style={{ position: "absolute", left: 30, top: 34, opacity: 1 - 0.4 * Math.min(1, Math.max(0, ousted)) }}>
          <PersonIcon size={80} />
        </div>
        <div style={{ position: "absolute", left: 136, top: 32, fontFamily: FONT.display, fontSize: 42, lineHeight: 1, color: RO.white, whiteSpace: "nowrap" }}>
          {CRISIS.ousted.name.toUpperCase()}
        </div>
        <div style={{ position: "absolute", left: 138, top: 88, fontSize: 25, fontWeight: 500, color: RO.textSoft }}>
          {CRISIS.ousted.party} · out on {CRISIS.ousted.dateText}
        </div>
        <Stamp p={ousted} size={44} color={RO.red} rotate={-8} style={{ left: 600, top: 22, background: "rgba(255,255,255,0.92)" }}>
          OUSTED
        </Stamp>
      </Glass>

      <div style={{ position: "absolute", left: 120, top: FAILS.top, display: "flex", alignItems: "center", gap: 16, ...riseStyle(failsLabel, exit, 20) }}>
        {fails.map((p, i) => (
          <div key={i} style={{ width: 44, height: 44, borderRadius: 22, border: `2px solid ${RO.glassEdge}`, background: RO.glass, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mark ok={false} size={24} p={p} color={RO.red} width={12} />
          </div>
        ))}
        <Mono size={20} color={RO.textSoft} style={{ marginLeft: 6, letterSpacing: 3 }}>
          {CRISIS.failedPicks} PICKS FAILED · THEN THE 4TH
        </Mono>
      </div>

      <Glass top={IN.top} height={IN.height} tick={RO.yellow} style={riseStyle(inCard, exit, 40)}>
        <div style={{ position: "absolute", left: 30, top: 30 }}>
          <PersonIcon size={80} color={RO.yellow} />
        </div>
        <div style={{ position: "absolute", left: 136, top: 30, fontFamily: FONT.display, fontSize: 42, lineHeight: 1, color: RO.white, whiteSpace: "nowrap" }}>
          {CRISIS.pm.name.toUpperCase()}
        </div>
        <div style={{ position: "absolute", left: 138, top: 86, fontSize: 25, fontWeight: 500, color: RO.textSoft }}>{CRISIS.pm.note} · prime minister</div>

        <div style={{ position: "absolute", left: BAR.left, top: BAR.top, width: BAR.width, height: BAR.height, borderRadius: 12, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: yesW * fill, height: "100%", background: RO.yellow }} />
          <div style={{ position: "absolute", right: 0, top: 0, width: noW * fill, height: "100%", background: RO.white, opacity: 0.85 }} />
        </div>
        <div style={{ position: "absolute", left: lineX - 3, top: BAR.top - 18, width: 6, height: BAR.height + 36, borderRadius: 3, background: RO.blueNight, boxShadow: "0 0 0 2px rgba(252,209,22,0.9)" }} />
        <Mono size={17} color={RO.yellow} style={{ position: "absolute", left: lineX + 12, top: BAR.top - 32, letterSpacing: 2 }}>
          {INVESTITURE}
        </Mono>
        <div style={{ position: "absolute", left: 40, top: 246, fontFamily: FONT.display, fontSize: 52, lineHeight: 1, color: RO.yellow, opacity: fill > 0 ? 1 : 0 }}>
          {Math.round(CRISIS.pm.yes * fill)} <span style={{ fontSize: 30 }}>YES</span>
        </div>
        <div style={{ position: "absolute", right: 40, top: 246, fontFamily: FONT.display, fontSize: 52, lineHeight: 1, color: RO.white, opacity: fill > 0 ? 1 : 0 }}>
          {Math.round(CRISIS.pm.no * fill)} <span style={{ fontSize: 30 }}>NO</span>
        </div>
        <Stamp p={approved} size={44} rotate={-7} style={{ left: 250, top: 240 }}>
          APPROVED
        </Stamp>
      </Glass>

      <Mono size={20} color={RO.yellow} style={{ position: "absolute", left: 120, top: 1230, letterSpacing: 3, ...riseStyle(note, exit, 20) }}>
        {CRISIS.pm.date} · MINORITY GOVERNMENT · AS OF {CRISIS.asOf}
      </Mono>
    </>
  );
};
