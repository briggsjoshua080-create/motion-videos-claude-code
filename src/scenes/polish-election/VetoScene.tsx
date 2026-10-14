import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { LawIcon } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { OVERRIDE, PALETTE as C, PL, SEJM_POSE, SEJM_TOTAL, VETOES_FIRST_YEAR, type SceneProps } from "./constants";
import { President } from "./PresidentScene";
import { Pill } from "./ui";

const PORTRAIT = { left: 140, top: 372, size: 170 } as const;
const LAW = { x: 520, y: 462, size: 120 } as const;
const NOTE = { left: 652, top: 392 } as const;
const BOTTOM = SEJM_POSE.veto.cy + 26;

/**
 * "He can veto laws, and overriding him takes three fifths of the Sejm, more than the government has."
 * The President stamps a law "VETO"; the Sejm half-circle (SejmLayer) comes back: the line swings from
 * a majority to three fifths (276) and the governing side (about 240) stops short of it.
 */
export const VetoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const portrait = rise(frame, 0);
  const fly = progress(frame, 2, cue("veto", "veto") - 2);
  const stamp = pop(frame, cue("veto", "veto") - 2);
  const note = rise(frame, cue("veto", "laws") - 2);
  const override = rise(frame, cue("veto", "fifths", "end") - 2);
  const short = pop(frame, cue("veto", "government", "end") - 2);

  const lawX = interpolate(fly, [0, 1], [1000, LAW.x]);
  const lawOn = Math.min(1, fly * 4) * (1 - exit);

  return (
    <>
      <div style={{ position: "absolute", left: PORTRAIT.left, top: PORTRAIT.top, ...riseStyle(portrait, exit, 30), filter: "drop-shadow(0 14px 24px rgba(20,32,43,0.16))" }}>
        <President size={PORTRAIT.size} id="president-veto" />
      </div>

      {/* A law reaches the President: VETO */}
      <div style={{ position: "absolute", left: lawX - LAW.size / 2, top: LAW.y - LAW.size / 2, opacity: lawOn, transform: `rotate(${(1 - fly) * 10}deg)` }}>
        <LawIcon size={LAW.size} palette={C} />
        <div
          style={{
            position: "absolute",
            left: -18,
            top: 34,
            padding: "6px 14px",
            borderRadius: 10,
            border: `5px solid ${PL.red}`,
            background: "rgba(255,255,255,0.9)",
            color: PL.red,
            fontFamily: theme.font,
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: 3,
            opacity: Math.min(1, stamp * 1.4),
            transform: `rotate(-14deg) scale(${1.6 - 0.6 * Math.min(1, stamp)})`,
          }}
        >
          VETO
        </div>
      </div>

      {/* How often: his first year */}
      <div style={{ position: "absolute", left: NOTE.left, top: NOTE.top, width: 308, fontFamily: theme.font, ...riseStyle(note, exit, 16) }}>
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -2, lineHeight: 1, color: PL.red }}>{VETOES_FIRST_YEAR}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.ink, marginTop: 4 }}>vetoes in his</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.ink }}>first year</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.inkSoft, marginTop: 4, whiteSpace: "nowrap" }}>Aug 2025 – Aug 2026</div>
      </div>

      {/* Override: three fifths of the Sejm */}
      <div style={{ position: "absolute", left: 120, width: 840, top: BOTTOM, textAlign: "center", fontFamily: theme.font, fontSize: 28, fontWeight: 700, color: C.inkSoft, whiteSpace: "nowrap", ...riseStyle(override, exit, 12) }}>
        To override: <span style={{ color: PL.red, fontWeight: 800 }}>{OVERRIDE}</span> of {SEJM_TOTAL} MPs (if all vote)
      </div>
      <div style={{ position: "absolute", left: 120, width: 840, top: BOTTOM + 52, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={short} bg={PL.redSoft} color={PL.redDeep} border={PL.red} size={30}>
          ✕ The government side is too small
        </Pill>
      </div>
    </>
  );
};
