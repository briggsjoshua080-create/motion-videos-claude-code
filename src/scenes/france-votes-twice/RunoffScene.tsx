import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { ease } from "../../lib/animation";
import { FR, PersonIcon, Pill, SAFE, SceneFrame, SceneHeader, lerp, pop, span, type SceneProps } from "./ui";

/** Example shares (not real results): nobody reaches 50%. */
const SHARES = [32, 27, 22, 19];
const XS = [215, 415, 615, 815];
const BASE = 800;
const PX = 6.6;
const LINE = BASE - 50 * PX;
const ICON = 120;
/** Where the two finalists meet. */
const FACE_Y = 600;
const FACE_XS = [360, 720];

export const RunoffScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const grow = ease(frame, span(cue("runoff", "no") - 4, cue("runoff", "does", "end")));
  const top2 = ease(frame, span(cue("runoff", "top") - 3, cue("runoff", "top") + 10));
  const face = ease(frame, span(cue("runoff", "run-off") - 4, cue("runoff", "run-off") + 16));
  const weeks = pop(frame, cue("runoff", "two#2") - 3);

  return (
    <SceneFrame duration={duration}>
      <SceneHeader kicker="NOBODY OVER 50%?" title="Top two go to round 2" />

      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: LINE,
          borderTop: `4px dashed ${FR.white}`,
          opacity: 0.8 * (1 - face),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.width,
          top: LINE - 46,
          textAlign: "right",
          fontFamily: theme.font,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: 2,
          color: FR.white,
          opacity: 0.8 * (1 - face),
        }}
      >
        50%
      </div>

      {SHARES.map((share, i) => {
        const finalist = i < 2;
        const others = finalist ? 1 : 1 - 0.75 * top2;
        const h = share * PX * grow;
        const cx = finalist ? lerp(XS[i], FACE_XS[i], face) : XS[i];
        const cy = finalist ? lerp(BASE + 15 + ICON / 2, FACE_Y, face) : BASE + 15 + ICON / 2;
        return (
          <React.Fragment key={share}>
            <div
              style={{
                position: "absolute",
                left: XS[i] - 60,
                width: 120,
                top: BASE - h,
                height: h,
                borderRadius: "18px 18px 0 0",
                background: finalist ? FR.white : FR.mist,
                opacity: others * (1 - face),
              }}
            />
            {finalist ? (
              <div
                style={{
                  position: "absolute",
                  left: XS[i] - 100,
                  width: 200,
                  top: BASE - h - 72,
                  display: "flex",
                  justifyContent: "center",
                  opacity: top2 * (1 - face),
                  transform: `scale(${top2})`,
                }}
              >
                <Pill size={28}>TOP 2</Pill>
              </div>
            ) : null}
            <div
              style={{
                position: "absolute",
                left: cx - ICON / 2,
                top: cy - ICON / 2,
                opacity: finalist ? 1 : others * (1 - face),
                transform: `scale(${finalist ? 1 + 0.6 * face : 1})`,
              }}
            >
              <PersonIcon size={ICON} color={finalist ? FR.white : FR.mist} />
            </div>
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: SAFE.center - 70,
          top: FACE_Y - 70,
          width: 140,
          height: 140,
          borderRadius: 70,
          background: FR.red,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.font,
          fontSize: 60,
          fontWeight: 900,
          color: FR.white,
          opacity: face,
          transform: `scale(${face})`,
        }}
      >
        VS
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE.center - 230,
          top: 900,
          width: 460,
          borderRadius: 28,
          overflow: "hidden",
          background: FR.white,
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
          fontFamily: theme.font,
          textAlign: "center",
          opacity: weeks,
          transform: `translateY(${(1 - weeks) * 60}px) scale(${0.8 + 0.2 * weeks})`,
        }}
      >
        <div style={{ background: FR.red, color: FR.white, fontSize: 30, fontWeight: 800, letterSpacing: 4, padding: "10px 0" }}>
          ROUND 2
        </div>
        <div style={{ color: FR.navy, fontSize: 84, fontWeight: 900, letterSpacing: -2, padding: "14px 0 18px" }}>
          +2 WEEKS
        </div>
      </div>
    </SceneFrame>
  );
};
