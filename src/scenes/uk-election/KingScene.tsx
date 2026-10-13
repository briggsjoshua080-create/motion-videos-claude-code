import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Character } from "../../components/explainer/Character";
import { NameCard } from "../../components/explainer/NameCard";
import { BallotBoxIcon, DrawnCross } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CARD_SHADOW, HAIR, PALETTE as C, UK, type SceneProps } from "./constants";
import { Pill } from "./ui";

const KING = { left: 130, top: 360, size: 330 } as const;
const LAW = { left: 500, top: 360, width: 460, height: 350 } as const;
/** The Garter sash is dark blue. */
const GARTER_BLUE = "#23387A";

/**
 * "And the head of state? King Charles inherited the crown. He approves every law, but stays out
 * of politics." Cartoon King (no likeness), not elected, Royal Assent on an Act, next in line.
 */
export const KingScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const king = pop(frame, cue("king", "head") - 6);
  const ballot = pop(frame, cue("king", "inherited") - 6);
  const cross = progress(frame, cue("king", "inherited") - 1, cue("king", "crown", "end") + 4);
  const notElected = rise(frame, cue("king", "crown") - 4);
  const ballotOut = progress(frame, cue("king", "He") - 8, cue("king", "He") + 2);
  const card = pop(frame, cue("king", "King") - 4);
  const name = progress(frame, cue("king", "King") - 2, cue("king", "Charles", "end") + 4);
  const heir = pop(frame, cue("king", "crown") - 2);
  const law = rise(frame, cue("king", "He") - 2);
  const stamp = progress(frame, cue("king", "approves") - 2, cue("king", "approves") + 5);
  const neutral = pop(frame, cue("king", "stays") - 4);

  return (
    <>
      {/* The King: crown, royal robe with ermine collar and the blue Garter sash (no real likeness) */}
      <div
        style={{
          position: "absolute",
          left: KING.left,
          top: KING.top,
          opacity: Math.min(1, king * 1.4) * (1 - exit),
          transform: `translateY(${-exit * 40}px) scale(${0.85 + 0.15 * king})`,
          filter: "drop-shadow(0 18px 30px rgba(14,26,58,0.18))",
        }}
      >
        <Character
          size={KING.size}
          bg={UK.goldSoft}
          palette={C}
          outfit="robe"
          clothes={UK.robe}
          sash={GARTER_BLUE}
          hair={HAIR.white}
          hairStyle="short"
          headwear="crown"
          jewels={[UK.gold, UK.red]}
          id="king"
        />
      </div>

      {/* Inherited, not elected */}
      <div
        style={{
          position: "absolute",
          left: 610,
          top: 384,
          width: 260,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: Math.min(1, ballot * 1.4) * (1 - Math.max(ballotOut, exit)),
          transform: `scale(${0.7 + 0.3 * ballot})`,
        }}
      >
        <div style={{ position: "relative", width: 210, height: 210 }}>
          <BallotBoxIcon size={210} palette={C} />
          <div style={{ position: "absolute", left: 10, top: 10 }}>
            <DrawnCross size={190} p={cross} color={C.alert} stroke={5.5} />
          </div>
        </div>
        <div style={{ fontFamily: theme.font, fontSize: 40, fontWeight: 800, letterSpacing: 2, color: C.alert, opacity: notElected, whiteSpace: "nowrap" }}>
          NOT ELECTED
        </div>
      </div>

      {/* He approves every law: Royal Assent */}
      <div
        style={{
          position: "absolute",
          left: LAW.left,
          top: LAW.top,
          width: LAW.width,
          height: LAW.height,
          borderRadius: 28,
          background: C.card,
          boxShadow: CARD_SHADOW,
          fontFamily: theme.font,
          ...riseStyle(law, exit),
        }}
      >
        <div style={{ position: "absolute", left: 30, top: 26, fontSize: 32, fontWeight: 800, letterSpacing: 2, color: C.ink }}>ACT OF PARLIAMENT</div>
        {[80, 106, 132, 158, 184].map((y, i) => (
          <div key={y} style={{ position: "absolute", left: 30, top: y, width: [380, 340, 395, 300, 250][i], height: 12, borderRadius: 6, background: C.muted, opacity: 0.4 }} />
        ))}
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 226,
            padding: "10px 22px",
            borderRadius: 14,
            border: `6px solid ${UK.goldDeep}`,
            color: UK.goldDeep,
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: 2,
            whiteSpace: "nowrap",
            opacity: Math.min(1, stamp * 2),
            transform: `rotate(-7deg) scale(${interpolate(stamp, [0, 1], [1.7, 1])})`,
          }}
        >
          ROYAL ASSENT ✓
        </div>
      </div>

      <NameCard
        top={740}
        height={200}
        role="HEAD OF STATE"
        name="King Charles III"
        sub="Inherited the crown in 2022"
        cardP={card}
        nameP={name}
        exitP={exit}
        palette={C}
      />

      {/* Next in line */}
      <div
        style={{
          position: "absolute",
          left: 230,
          top: 966,
          width: 620,
          height: 160,
          borderRadius: 28,
          background: C.card,
          boxShadow: CARD_SHADOW,
          display: "flex",
          alignItems: "center",
          gap: 28,
          padding: "0 32px",
          boxSizing: "border-box",
          fontFamily: theme.font,
          opacity: Math.min(1, heir * 1.4) * (1 - exit),
          transform: `translateY(${(1 - heir) * 40 - exit * 40}px) scale(${0.92 + 0.08 * heir})`,
        }}
      >
        <Character size={112} bg={C.paperDeep} palette={C} clothes={UK.suit} tie={GARTER_BLUE} hair={HAIR.light} hairStyle="short" id="heir" />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color: C.alert }}>NEXT IN LINE</div>
          <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: -1, color: C.ink }}>Prince William</div>
        </div>
      </div>

      {/* But stays out of politics */}
      <div style={{ position: "absolute", left: 120, width: 840, top: 1158, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={neutral} bg={C.ink} color={C.white} size={34} style={{ letterSpacing: 2 }}>
          STAYS OUT OF POLITICS
        </Pill>
      </div>
    </>
  );
};
