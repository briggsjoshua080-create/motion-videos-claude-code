import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, RU, TERMS_BEFORE_RESET, TERM_YEARS, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Glass, Headline, Mono } from "./ui";

const RULES = { top: 690, height: 150 } as const;
const CHAIN = { top: 858, height: 200 } as const;
const RESET = { top: 1076, height: 172 } as const;
const TERMS = ["2000", "2004", "2012", "2018"] as const;

/**
 * "The president is elected for six years, with a run-off if no one gets half. He picks the prime
 * minister; the Duma approves. In 2020, Putin's terms were reset to zero." The rules pop in on "six
 * years" and "run-off"; a chain PRESIDENT → PRIME MINISTER ← DUMA builds on "picks", "prime" and
 * "approves"; Putin's four earlier terms are struck through on "reset" and the counter drops from 4
 * to 0 on "zero".
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 0);
  const head = [rise(frame, 3), rise(frame, 7)];
  const aside = rise(frame, cue("president", "elected") - 4);
  const rules = rise(frame, cue("president", "six") - 8);
  const r1 = pop(frame, cue("president", "six") - 3);
  const r2 = pop(frame, cue("president", "run-off") - 3);
  const chain = rise(frame, cue("president", "picks") - 8);
  const c1 = pop(frame, cue("president", "He") - 2);
  const arrow1 = progress(frame, cue("president", "picks") - 2, cue("president", "picks") + 6);
  const c2 = pop(frame, cue("president", "prime") - 3);
  const c3 = pop(frame, cue("president", "Duma") - 3);
  const arrow2 = progress(frame, cue("president", "approves") - 2, cue("president", "approves") + 6);
  const reset = rise(frame, cue("president", "2020") - 8);
  const strikes = TERMS.map((_, i) => progress(frame, cue("president", "reset") - 4 + i * 3, cue("president", "reset") + 4 + i * 3));
  const zero = pop(frame, cue("president", "zero") - 2);

  const rule = (big: string, text: string, p: number, x: number) => (
    <div style={{ position: "absolute", left: x, top: 62, display: "flex", alignItems: "center", gap: 16, opacity: Math.min(1, Math.max(0, p) * 1.5), transform: `translateX(${(1 - Math.min(1, p)) * -20}px)` }}>
      <div style={{ padding: "0 18px", height: 60, borderRadius: 12, background: RU.red, border: `2px solid ${RU.white}`, display: "flex", alignItems: "center", fontFamily: FONT.display, fontSize: 34, color: RU.white, boxShadow: `0 0 24px ${RU.redGlow}` }}>{big}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: RU.white, whiteSpace: "nowrap", lineHeight: 1.1 }}>{text}</div>
    </div>
  );

  const box = (label: string, sub: string, p: number, x: number, w: number, strong = false) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 62,
        width: w,
        height: 96,
        borderRadius: 16,
        background: strong ? RU.white : "rgba(255,255,255,0.1)",
        border: `2px solid ${RU.white}`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(1, Math.max(0, p) * 1.5),
        transform: `scale(${0.6 + 0.4 * Math.min(1.1, p)})`,
      }}
    >
      <div style={{ fontFamily: FONT.display, fontSize: 24, lineHeight: 1.05, color: strong ? RU.blueDeep : RU.white, textAlign: "center", whiteSpace: "pre-line" }}>{label}</div>
      <Mono size={13} color={strong ? RU.inkSoft : RU.textSoft} style={{ marginTop: 6, letterSpacing: 1.2 }}>
        {sub}
      </Mono>
    </div>
  );

  const arrow = (x: number, w: number, p: number, label: string, flip = false) => (
    <div style={{ position: "absolute", left: x, top: 92, width: w, opacity: p > 0 ? 1 : 0 }}>
      <Mono size={13} color={RU.white} style={{ position: "absolute", left: 0, width: w, top: -22, textAlign: "center", letterSpacing: 1.2 }}>
        {label}
      </Mono>
      <svg width={w} height={30} style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
        <line x1={4} y1={15} x2={4 + (w - 18) * p} y2={15} stroke={RU.red} strokeWidth={5} strokeLinecap="round" />
        {p > 0.9 && <path d={`M${w - 18} 5 L${w - 4} 15 L${w - 18} 25`} fill="none" stroke={RU.red} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </div>
  );

  return (
    <>
      <Eyebrow style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>06 — THE PRESIDENT</Eyebrow>
      <Headline size={112} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        THE
      </Headline>
      <Headline size={112} style={{ top: 352 + 110, ...riseStyle(head[1], exit, 50) }}>
        <Accent>PRESIDENT</Accent>
      </Headline>
      <Aside size={42} style={{ top: 604, ...riseStyle(aside, exit, 24) }}>
        Head of state: leads foreign policy and the army.
      </Aside>

      <Glass top={RULES.top} height={RULES.height} tick={RU.red} style={riseStyle(rules, exit, 30)}>
        <Mono size={18} color={RU.textSoft} style={{ position: "absolute", left: 36, top: 22, letterSpacing: 2.5 }}>
          ELECTED BY THE PEOPLE
        </Mono>
        {rule(`${TERM_YEARS} YRS`, "per term", r1, 36)}
        {rule("50%+", "or a run-off", r2, 380)}
      </Glass>

      <Glass top={CHAIN.top} height={CHAIN.height} tick={RU.white} style={riseStyle(chain, exit, 30)}>
        <Mono size={18} color={RU.textSoft} style={{ position: "absolute", left: 36, top: 22, letterSpacing: 2.5 }}>
          THE GOVERNMENT
        </Mono>
        {box("PRESIDENT", "PICKS", c1, 30, 220, true)}
        {arrow(258, 70, arrow1, "")}
        {box("PRIME\nMINISTER", "RUNS THE CABINET", c2, 334, 230)}
        {arrow(572, 70, arrow2, "", true)}
        {box("STATE DUMA", "APPROVES", c3, 650, 160)}
        <div style={{ position: "absolute", left: 36, top: 168, fontSize: 19, fontWeight: 500, color: RU.textSoft, opacity: Math.min(1, Math.max(0, c3)) }}>
          Say no three times and the president can dissolve the Duma.
        </div>
      </Glass>

      <Glass top={RESET.top} height={RESET.height} tick={RU.red} style={{ ...riseStyle(reset, exit, 30), border: `2px solid ${RU.red}` }}>
        <Mono size={18} color={RU.textSoft} style={{ position: "absolute", left: 36, top: 22, letterSpacing: 2.5 }}>
          PUTIN'S TERMS THAT COUNT · 2020 CHANGE
        </Mono>
        <div style={{ position: "absolute", left: 36, top: 70, display: "flex", gap: 14 }}>
          {TERMS.map((t, i) => (
            <div key={t} style={{ position: "relative", padding: "8px 14px", borderRadius: 10, background: "rgba(255,255,255,0.12)", fontFamily: FONT.mono, fontWeight: 700, fontSize: 22, color: RU.white, opacity: 1 - 0.5 * strikes[i] }}>
              {t}
              <div style={{ position: "absolute", left: 6, top: "50%", height: 4, width: `calc(${strikes[i] * 100}% - 12px)`, background: RU.red, borderRadius: 2 }} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", right: 40, top: 46, width: 150, textAlign: "center" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 84, lineHeight: 1, color: zero > 0.3 ? RU.red : RU.white, textShadow: zero > 0.3 ? `0 0 30px ${RU.redGlow}` : "none", transform: `scale(${zero > 0.3 ? 0.8 + 0.2 * Math.min(1.1, zero) : 1})` }}>
            {zero > 0.3 ? 0 : TERMS_BEFORE_RESET}
          </div>
        </div>
        <Mono size={15} color={RU.textSoft} style={{ position: "absolute", left: 36, top: 132, letterSpacing: 1.4 }}>
          NOW: MAX 2 TERMS IN TOTAL · HIS FIRST 4 DON'T COUNT
        </Mono>
      </Glass>
    </>
  );
};
