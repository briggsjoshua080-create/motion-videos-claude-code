import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FIRST, MAJORITY, PALETTE as C, POSE, PT, REJECT_YES, TOTAL, type SceneProps } from "./constants";
import { President, PrimeMinister } from "./characters";
import { Badge, Card } from "./ui";

const P = POSE.gov;
const ROW = { top: P.cy + 80, height: 150, gap: 16 } as const;
const NOTE_TOP = ROW.top + 2 * (ROW.height + ROW.gap) + 14;

const Step: React.FC<{ top: number; p: number; exit: number; portrait: React.ReactNode; kicker: string; title: string; sub: string }> = ({
  top,
  p,
  exit,
  portrait,
  kicker,
  title,
  sub,
}) => (
  <Card top={top} height={ROW.height} style={{ padding: "0 28px", display: "flex", alignItems: "center", gap: 24, opacity: Math.min(1, p * 1.4) * (1 - exit), transform: `translateX(${(1 - p) * 50}px)` }}>
    {portrait}
    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.muted, whiteSpace: "nowrap" }}>{kicker}</div>
      <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, letterSpacing: -0.6, whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ fontSize: 23, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
  </Card>
);

/**
 * "But he didn't need a majority. The President appointed him, and he governs until a majority
 * votes him out."
 * No vote to take office: the President appoints the prime minister after hearing the parties, and
 * the government stays unless 116 MPs vote it out. In June 2025 a motion to reject Montenegro's
 * programme got only 10 votes (lit in AssemblyLayer above), so his minority government carried on.
 */
export const GovScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const noVote = pop(frame, cue("gov", "need") - 4);
  const appointed = pop(frame, cue("gov", "President") - 6);
  const governs = pop(frame, cue("gov", "governs") - 4);
  const note = rise(frame, cue("gov", "votes") + 2);
  const ok = pop(frame, cue("gov", "out", "end") + 2);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: P.cy + 14, display: "flex", justifyContent: "center", fontFamily: theme.font, opacity: 1 - exit }}>
        <div
          style={{
            padding: "6px 20px",
            borderRadius: 999,
            background: PT.greenSoft,
            color: PT.greenDeep,
            fontSize: 25,
            fontWeight: 800,
            whiteSpace: "nowrap",
            opacity: Math.min(1, noVote * 1.4),
            transform: `scale(${0.6 + 0.4 * noVote})`,
          }}
        >
          No vote needed to take office
        </div>
      </div>

      <Step
        top={ROW.top}
        p={appointed}
        exit={exit}
        portrait={<President size={104} id="pres-gov" />}
        kicker="1 · THE PRESIDENT"
        title="Appoints the prime minister"
        sub="after hearing every party, based on the result"
      />
      <Step
        top={ROW.top + ROW.height + ROW.gap}
        p={governs}
        exit={exit}
        portrait={<PrimeMinister size={104} id="pm-gov" />}
        kicker="2 · LUÍS MONTENEGRO"
        title="Governs with 91 of 230"
        sub={`until ${MAJORITY} MPs vote the government out`}
      />

      <div style={{ position: "absolute", left: 120, width: 840, top: NOTE_TOP, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: theme.font, ...riseStyle(note, exit, 16) }}>
        <Badge size={44} ok p={ok} />
        <div style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, whiteSpace: "nowrap" }}>
          June 2025: only <span style={{ color: PT.red, fontWeight: 800 }}>{REJECT_YES}</span> of {TOTAL} voted to reject his plan
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, width: 840, top: NOTE_TOP + 54, textAlign: "center", fontFamily: theme.font, fontSize: 24, fontWeight: 600, color: C.inkSoft, opacity: Math.min(1, ok * 1.4) * (1 - exit), whiteSpace: "nowrap" }}>
        A minority government: <span style={{ color: FIRST.color, fontWeight: 800 }}>{FIRST.name}</span>
      </div>
    </>
  );
};
