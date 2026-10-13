import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { BudgetIcon, LawIcon, MagnifierIcon, ParliamentIcon, VoteOutIcon } from "../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import type { ExplainerPalette } from "../../components/explainer/palette";
import { PALETTE as C, type SceneProps } from "./constants";

/** What the House of Representatives does, each card popping in on its word. */
const JOBS: { label: string; word: string; Icon: React.FC<{ size: number; palette: ExplainerPalette }> }[] = [
  { label: "Makes laws", word: "laws", Icon: LawIcon },
  { label: "Approves the budget", word: "approves", Icon: BudgetIcon },
  { label: "Checks the government", word: "checks", Icon: MagnifierIcon },
  { label: "Can vote it out", word: "vote", Icon: VoteOutIcon },
];
const CARD = { width: 410, height: 150, top: 950, gapX: 20, gapY: 20 } as const;

/**
 * "Together, they fill the 150 seats of the House of Representatives. It makes laws, approves the
 * budget, checks the government and can even vote it out." The half-circle itself is HouseLayer.
 */
export const HouseScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const label = rise(frame, cue("house", "House") - 4);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 826,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 22,
          fontFamily: theme.font,
          ...riseStyle(label, exit, 30),
        }}
      >
        <ParliamentIcon width={124} palette={C} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: -1, color: C.ink, lineHeight: 1.05 }}>House of Representatives</div>
          <div style={{ fontSize: 32, fontWeight: 600, color: C.inkSoft }}>Tweede Kamer · elected by you</div>
        </div>
      </div>

      {JOBS.map(({ label: text, word, Icon }, i) => {
        const p = pop(frame, cue("houseJob", word) - 5);
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div
            key={text}
            style={{
              position: "absolute",
              left: 120 + col * (CARD.width + CARD.gapX),
              top: CARD.top + row * (CARD.height + CARD.gapY),
              width: CARD.width,
              height: CARD.height,
              borderRadius: 24,
              background: C.card,
              boxShadow: "0 18px 44px rgba(20,33,61,0.13)",
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "0 24px",
              boxSizing: "border-box",
              fontFamily: theme.font,
              opacity: Math.min(1, p * 1.4) * (1 - exit),
              transform: `translateY(${(1 - p) * 40 - exit * 40}px) scale(${0.9 + 0.1 * p})`,
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <Icon size={92} palette={C} />
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.12, color: C.ink, letterSpacing: -0.5 }}>{text}</div>
          </div>
        );
      })}
    </>
  );
};
