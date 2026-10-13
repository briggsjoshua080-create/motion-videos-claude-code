import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { Character } from "../../components/explainer/Character";
import { NameCard } from "../../components/explainer/NameCard";
import { BallotBoxIcon, DrawnCross, DrawnPath } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { HAIR, NL, PALETTE as C, type SceneProps } from "./constants";

const KING = { left: 130, top: 360, size: 330 } as const;
const LAW = { left: 500, top: 360, width: 460, height: 360 } as const;

/** A loose handwritten signature ending at (x, y) on the signature line. */
const signature = (x: number, y: number) =>
  `M${x} ${y - 10} C${x + 14} ${y - 50} ${x + 34} ${y - 52} ${x + 38} ${y - 20} S${x + 58} ${y + 6} ${x + 74} ${y - 30} ` +
  `S${x + 100} ${y - 66} ${x + 112} ${y - 20} S${x + 134} ${y - 2} ${x + 150} ${y - 36} S${x + 178} ${y - 56} ${x + 192} ${y - 18}`;

/**
 * "And the head of state? Nobody votes for him. King Willem-Alexander inherited the crown. He signs
 * every law, but his ministers carry the responsibility."
 */
export const KingScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const king = pop(frame, cue("king", "head") - 6);
  const ballot = pop(frame, cue("king", "Nobody") - 6);
  const cross = progress(frame, cue("king", "Nobody") - 1, cue("king", "votes") + 8);
  const notElected = rise(frame, cue("king", "votes") - 2);
  const ballotOut = progress(frame, cue("kingRole", "He") - 8, cue("kingRole", "He") + 2);
  const card = pop(frame, cue("kingInherit", "King") - 4);
  const name = progress(frame, cue("kingInherit", "Willem-Alexander") - 4, cue("kingInherit", "inherited"));
  const heir = pop(frame, cue("kingInherit", "crown") - 4);
  const law = rise(frame, cue("kingRole", "He") - 2);
  const kingSig = progress(frame, cue("kingRole", "signs") - 1, cue("kingRole", "law", "end") + 2);
  const ministerSig = progress(frame, cue("kingRole", "ministers") - 1, cue("kingRole", "carry", "end") + 2);
  const responsible = pop(frame, cue("kingRole", "responsibility") - 3);

  return (
    <>
      {/* The King: crown, royal robe with ermine collar and an orange sash (no real likeness) */}
      <div
        style={{
          position: "absolute",
          left: KING.left,
          top: KING.top,
          opacity: Math.min(1, king * 1.4) * (1 - exit),
          transform: `translateY(${-exit * 40}px) scale(${0.85 + 0.15 * king})`,
          filter: "drop-shadow(0 18px 30px rgba(20,33,61,0.18))",
        }}
      >
        <Character
          size={KING.size}
          bg={NL.orangeSoft}
          palette={C}
          outfit="robe"
          clothes={NL.robe}
          sash={NL.orange}
          hair={HAIR.light}
          hairStyle="short"
          headwear="crown"
          jewels={[NL.orange, NL.blue]}
          id="king"
        />
      </div>

      {/* Nobody votes for him */}
      <div
        style={{
          position: "absolute",
          left: 620,
          top: 380,
          width: 240,
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

      {/* He signs every law, but the ministers are responsible */}
      <div
        style={{
          position: "absolute",
          left: LAW.left,
          top: LAW.top,
          width: LAW.width,
          height: LAW.height,
          borderRadius: 28,
          background: C.card,
          boxShadow: "0 22px 54px rgba(20,33,61,0.14)",
          fontFamily: theme.font,
          ...riseStyle(law, exit),
        }}
      >
        <div style={{ position: "absolute", left: 30, top: 26, fontSize: 32, fontWeight: 800, letterSpacing: 2, color: C.ink }}>ACT OF PARLIAMENT</div>
        {[78, 102, 126].map((y, i) => (
          <div key={y} style={{ position: "absolute", left: 30, top: y, width: [380, 330, 250][i], height: 12, borderRadius: 6, background: C.muted, opacity: 0.4 }} />
        ))}
        <svg width={LAW.width} height={LAW.height} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={26} y1={200} x2={240} y2={200} stroke={C.line} strokeWidth={4} />
          <line x1={26} y1={290} x2={240} y2={290} stroke={C.line} strokeWidth={4} />
          <DrawnPath d={signature(36, 196)} p={kingSig} color={NL.blue} width={6} />
          <DrawnPath d={signature(36, 286)} p={ministerSig} color={NL.blue} width={6} />
        </svg>
        <div style={{ position: "absolute", left: 262, top: 160, fontSize: 34, fontWeight: 800, color: C.ink, opacity: Math.min(1, kingSig * 3) }}>The King</div>
        <div style={{ position: "absolute", left: 262, top: 250, fontSize: 34, fontWeight: 800, color: C.ink, opacity: Math.min(1, ministerSig * 3) }}>Minister</div>
        <div
          style={{
            position: "absolute",
            right: 22,
            top: 302,
            padding: "6px 16px",
            borderRadius: 999,
            background: C.accent,
            color: C.white,
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: 1,
            opacity: Math.min(1, responsible * 1.4),
            transform: `scale(${0.6 + 0.4 * responsible})`,
          }}
        >
          RESPONSIBLE
        </div>
      </div>

      <NameCard
        top={740}
        height={200}
        role="HEAD OF STATE"
        name="King Willem-Alexander"
        sub="Inherited the crown in 2013"
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
          height: 170,
          borderRadius: 28,
          background: C.card,
          boxShadow: "0 22px 54px rgba(20,33,61,0.12)",
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
        <Character
          size={120}
          bg={C.paperDeep}
          palette={C}
          outfit="dress"
          clothes={NL.blue}
          hair={HAIR.auburn}
          hairStyle="long"
          headwear="tiara"
          jewels={[NL.silver, NL.orange]}
          id="princess"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 4, color: C.alert }}>NEXT IN LINE</div>
          <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: -1, color: C.ink }}>Princess Amalia</div>
        </div>
      </div>
    </>
  );
};
