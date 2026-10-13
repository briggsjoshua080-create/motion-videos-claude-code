import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { enter, float } from "../../lib/animation";
import { Crown, NL, SAFE, SceneFrame, SceneHeader, Stamp, pop, type SceneProps } from "./ui";

const CARD = { width: 580, height: 640, top: 420 } as const;

/** "The Dutch never vote for their head of state. So who's in charge?" */
export const HookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  // The ballot is on screen from frame 0, so the first frame (the TikTok thumbnail) is never empty.
  const card = enter(frame, 0);
  const crown = pop(frame, -12);
  const stamp = enter(frame, cue("hook", "never") - 2, { damping: 10, stiffness: 220 });
  const question = pop(frame, cue("hook", "who's") - 3);

  return (
    <SceneFrame duration={duration} fadeIn={false}>
      <SceneHeader kicker="THE NETHERLANDS" title="WHO'S IN CHARGE?" delay={cue("hook", "So") - 4} titleSize={84} />

      <div
        style={{
          position: "absolute",
          left: SAFE.center - CARD.width / 2,
          top: CARD.top + float(frame, 8, 100),
          width: CARD.width,
          height: CARD.height,
          borderRadius: 36,
          background: NL.paper,
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          transform: `rotate(-3deg) scale(${0.9 + 0.1 * card}) translateY(${(1 - card) * 40}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 44,
          fontFamily: theme.font,
          color: NL.ink,
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 6, color: NL.inkSoft }}>BALLOT PAPER</div>
        <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: -1, marginTop: 8 }}>HEAD OF STATE</div>
        <div style={{ width: 460, height: 4, borderRadius: 2, background: NL.orange, marginTop: 24 }} />
        <div style={{ marginTop: 48, transform: `scale(${crown})` }}>
          <Crown size={250} id="hook-crown" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", border: `6px solid ${NL.ink}` }} />
          <div style={{ fontSize: 40, fontWeight: 800, color: NL.inkSoft }}>VOTE HERE</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: CARD.top + 430,
          left: SAFE.left,
          width: SAFE.width,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stamp text="NO VOTE" p={stamp} size={96} rotate={-12} />
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE.center + 190,
          top: CARD.top - 60 + float(frame, 10, 70, 20),
          width: 190,
          height: 190,
          borderRadius: "50%",
          background: NL.orange,
          color: NL.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.font,
          fontSize: 150,
          fontWeight: 900,
          boxShadow: "0 18px 50px rgba(0,0,0,0.4)",
          opacity: Math.min(1, question * 1.4),
          transform: `scale(${question}) rotate(${(1 - question) * -30 + 8}deg)`,
        }}
      >
        ?
      </div>
    </SceneFrame>
  );
};
