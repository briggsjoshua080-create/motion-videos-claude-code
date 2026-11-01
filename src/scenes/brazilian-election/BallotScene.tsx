import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { BR, FONT, SIX_VOTES, TYPED, type SceneProps } from "./constants";
import { Accent, Aside, Eyebrow, Headline, Mark, Mono, PaperLayer } from "./ui";

const MACHINE = { left: 120, top: 668, w: 840, h: 440 } as const;
const SCREEN = { left: 28, top: 28, w: 480, h: 384 } as const;
const KEYS = { left: 548, top: 36, w: 80, h: 56, gapX: 12, gapY: 10 } as const;
const STRIP = { top: 1128, h: 96, gap: 10 } as const;
const KEY_ORDER = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""] as const;

/**
 * "There's no paper ballot. You type each candidate's number into a machine, check the photo, and
 * press green. Six votes in a row." On light paper like the reference's ballot scene: a generic
 * electronic voting machine (screen + keypad, not a copy of the real one's design). On "type" the
 * made-up number 77 12 is keyed in digit by digit (each key lights up); the candidate's photo,
 * name and party appear and get a ring on "photo"; the green CONFIRM key is pressed on "green" and
 * the screen shows FIM ("end"). Then six chips, one per vote in 2026, light up in order.
 */
export const BallotScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const kicker = rise(frame, 4);
  const head = [rise(frame, 6), rise(frame, 10)];
  const aside = rise(frame, cue("ballot", "paper") - 4);
  const strike = progress(frame, cue("ballot", "paper") - 1, cue("ballot", "ballot") + 4);
  const machine = rise(frame, cue("ballot", "type") - 14);
  const typeFrom = cue("ballot", "type");
  const typeTo = cue("ballot", "number", "end") + 2;
  const typed = Math.max(0, Math.min(TYPED.length, Math.floor(((frame - typeFrom) / Math.max(1, typeTo - typeFrom)) * TYPED.length) + 1));
  const shown = frame >= typeFrom ? typed : 0;
  const keyDown = frame >= typeFrom && frame < typeTo + 2 ? TYPED[Math.min(TYPED.length - 1, shown - 1)] : null;
  const card = rise(frame, typeTo - 2);
  const ring = progress(frame, cue("ballot", "photo") - 4, cue("ballot", "photo") + 8);
  const press = frame >= cue("ballot", "green") - 2 && frame < cue("ballot", "green") + 6;
  const done = progress(frame, cue("ballot", "green") + 2, cue("ballot", "green") + 8);
  const glow = pop(frame, cue("ballot", "press") - 3);
  const chips = SIX_VOTES.map((_, i) => pop(frame, cue("ballot", "Six") - 4 + i * 2));
  const lit = progress(frame, cue("ballot", "votes") - 2, cue("ballot", "row", "end") - 4);

  const key = (label: string, x: number, y: number, w: number, h: number, bg: string, color: string, down: boolean, text = 26) => (
    <div
      key={`${label}-${x}-${y}`}
      style={{
        position: "absolute",
        left: x,
        top: y + (down ? 3 : 0),
        width: w,
        height: h,
        borderRadius: 8,
        background: bg,
        boxShadow: down ? `0 0 0 3px ${BR.yellow}, 0 0 18px rgba(255,223,0,0.8)` : "0 4px 0 rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: label.length > 1 ? FONT.mono : FONT.display,
        fontWeight: 700,
        fontSize: text,
        letterSpacing: label.length > 1 ? 0.5 : 0,
        color,
      }}
    >
      {label}
    </div>
  );

  return (
    <>
      <PaperLayer duration={duration} />
      <Eyebrow light style={{ top: 300, ...riseStyle(kicker, exit, 24) }}>
        03 — THE BALLOT
      </Eyebrow>
      <Headline light size={120} style={{ top: 352, ...riseStyle(head[0], exit, 50) }}>
        TYPE THE
      </Headline>
      <Headline light size={120} style={{ top: 352 + 118, ...riseStyle(head[1], exit, 50) }}>
        <Accent light>NUMBER</Accent>
      </Headline>
      <Aside light size={40} style={{ top: 606, ...riseStyle(aside, exit, 20) }}>
        <span style={{ position: "relative" }}>
          No paper ballot
          <span style={{ position: "absolute", left: -4, top: "54%", height: 4, width: `calc(${strike * 100}% + 8px)`, background: BR.green, borderRadius: 2 }} />
        </span>{" "}
        — an electronic voting machine.
      </Aside>

      {/* The voting machine. */}
      <div
        style={{
          position: "absolute",
          left: MACHINE.left,
          top: MACHINE.top,
          width: MACHINE.w,
          height: MACHINE.h,
          borderRadius: 26,
          background: `linear-gradient(180deg, ${BR.machine} 0%, ${BR.machineDeep} 100%)`,
          boxShadow: "0 26px 50px rgba(10,30,20,0.3), inset 0 2px 0 rgba(255,255,255,0.08)",
          fontFamily: FONT.body,
          ...riseStyle(machine, exit, 50),
        }}
      >
        {/* Screen. */}
        <div style={{ position: "absolute", left: SCREEN.left, top: SCREEN.top, width: SCREEN.w, height: SCREEN.h, borderRadius: 10, background: "#E9EEF0", overflow: "hidden" }}>
          <div style={{ opacity: 1 - done }}>
            <Mono size={15} color={BR.inkSoft} style={{ position: "absolute", left: 22, top: 18, letterSpacing: 2 }}>
              YOUR VOTE FOR
            </Mono>
            <div style={{ position: "absolute", left: 22, top: 42, fontFamily: FONT.display, fontSize: 30, color: BR.ink }}>FEDERAL DEPUTY</div>
            <div style={{ position: "absolute", left: 22, top: 98, fontSize: 20, fontWeight: 700, color: BR.inkSoft }}>Number:</div>
            <div style={{ position: "absolute", left: 22, top: 128, display: "flex", gap: 10 }}>
              {TYPED.split("").map((d, i) => (
                <div
                  key={i}
                  style={{
                    width: 54,
                    height: 66,
                    borderRadius: 6,
                    border: `3px solid ${i === shown && shown < TYPED.length && frame >= typeFrom ? BR.green : "#9AA4AA"}`,
                    background: BR.white,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT.display,
                    fontSize: 42,
                    color: BR.ink,
                  }}
                >
                  {i < shown ? d : ""}
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 22, top: 220, width: 300, ...riseStyle(card, 0, 12) }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: BR.inkSoft }}>Name:</div>
              <div style={{ fontFamily: FONT.display, fontSize: 26, color: BR.ink, marginTop: 2 }}>CANDIDATE X</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: BR.inkSoft, marginTop: 8 }}>Party: PARTY 77</div>
            </div>
            {/* Photo (a neutral silhouette, made-up candidate). */}
            <div style={{ position: "absolute", right: 22, top: 26, width: 126, height: 160, borderRadius: 8, background: "#C9D1D6", overflow: "hidden", ...riseStyle(card, 0, 12) }}>
              <svg width={126} height={160} viewBox="0 0 126 160">
                <circle cx={63} cy={62} r={28} fill="#8D979D" />
                <path d="M14 160 C14 116 36 102 63 102 C90 102 112 116 112 160 Z" fill="#8D979D" />
              </svg>
            </div>
            <svg width={160} height={194} style={{ position: "absolute", right: 5, top: 9, overflow: "visible" }}>
              <rect x={4} y={4} width={152} height={186} rx={12} fill="none" stroke={BR.green} strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring} opacity={ring > 0.01 ? 1 : 0} />
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 46, background: "#D5DCE0", display: "flex", alignItems: "center", paddingLeft: 22, gap: 8, fontSize: 18, fontWeight: 700, color: BR.inkSoft }}>
              Press
              <span style={{ padding: "2px 10px", borderRadius: 5, background: BR.confirm, color: BR.white, boxShadow: glow > 0.2 ? `0 0 0 ${3 * Math.min(1, glow)}px ${BR.yellow}` : "none" }}>GREEN</span>
              to confirm
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: done }}>
            <div style={{ fontFamily: FONT.display, fontSize: 140, lineHeight: 1, color: BR.ink, letterSpacing: 6 }}>FIM</div>
            <Mono size={18} color={BR.inkSoft} style={{ marginTop: 10, letterSpacing: 3 }}>
              = "END" · VOTE SAVED
            </Mono>
          </div>
        </div>

        {/* Keypad. */}
        <Mono size={13} color="rgba(255,255,255,0.55)" style={{ position: "absolute", left: KEYS.left, top: 12, letterSpacing: 3 }}>
          ELECTRONIC BALLOT
        </Mono>
        {KEY_ORDER.map((k, i) =>
          k === "" ? null : key(k, KEYS.left + (i % 3) * (KEYS.w + KEYS.gapX), KEYS.top + Math.floor(i / 3) * (KEYS.h + KEYS.gapY), KEYS.w, KEYS.h, "#111315", BR.white, keyDown === k),
        )}
        {key("BLANK", KEYS.left, 312, 80, 76, "#F2F2F2", BR.ink, false, 13)}
        {key("CORRECT", KEYS.left + 90, 312, 80, 76, "#E8822A", BR.ink, false, 12)}
        {key("CONFIRM", KEYS.left + 180, 300, 84, 100, BR.confirm, BR.white, press, 12)}
      </div>

      {/* The six votes of 2026, in order. */}
      <div style={{ position: "absolute", left: 120, top: STRIP.top, width: 840, display: "flex", gap: STRIP.gap, opacity: 1 - exit }}>
        {SIX_VOTES.map((v, i) => {
          const on = Math.min(1, Math.max(0, lit * SIX_VOTES.length - i));
          return (
            <div
              key={v.office}
              style={{
                flex: 1,
                height: STRIP.h,
                borderRadius: 12,
                background: on > 0.5 ? BR.green : BR.card,
                border: `2px solid ${on > 0.5 ? BR.green : "#D5CDBE"}`,
                boxSizing: "border-box",
                padding: "10px 10px",
                position: "relative",
                opacity: Math.min(1, Math.max(0, chips[i]) * 1.5),
                transform: `scale(${0.6 + 0.4 * chips[i]})`,
                boxShadow: "0 10px 20px rgba(10,30,20,0.12)",
              }}
            >
              <Mono size={11} color={on > 0.5 ? "rgba(255,255,255,0.8)" : BR.inkSoft} style={{ letterSpacing: 1 }}>
                {i + 1} · {v.digits} DIGITS
              </Mono>
              <div style={{ marginTop: 6, fontFamily: FONT.display, fontSize: 16, lineHeight: 1.05, color: on > 0.5 ? BR.white : BR.ink, whiteSpace: "pre-line" }}>
                {v.office.replace(" ", "\n")}
              </div>
              <div style={{ position: "absolute", right: 8, top: 8, opacity: on }}>
                <Mark ok size={20} p={on} color={BR.yellow} width={10} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
