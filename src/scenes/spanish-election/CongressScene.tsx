import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { LawIcon, ParliamentIcon } from "../../components/explainer/icons";
import { pop, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ES, PALETTE as C, POSE, TOTAL, type SceneProps } from "./constants";
import { PrimeMinister } from "./characters";
import { Badge, Card } from "./ui";

const P = POSE.congress;
const LABEL_TOP = P.cy + 18;
const TILES_TOP = LABEL_TOP + 112;
const TILE_H = 190;
const SENATE = { top: TILES_TOP + TILE_H + 20, height: 206 } as const;

const Tile: React.FC<{ left: number; p: number; exit: number; icon: React.ReactNode; title: string; sub: string }> = ({ left, p, exit, icon, title, sub }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: TILES_TOP,
      width: 408,
      height: TILE_H,
      borderRadius: 28,
      background: C.card,
      boxShadow: "0 22px 54px rgba(20,32,43,0.14)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: theme.font,
      opacity: Math.min(1, p * 1.4) * (1 - exit),
      transform: `translateY(${(1 - p) * 40 - exit * 30}px) scale(${0.85 + 0.15 * p})`,
    }}
  >
    {icon}
    <div style={{ fontSize: 33, fontWeight: 800, color: C.ink, letterSpacing: -0.8, textAlign: "center", lineHeight: 1.1, padding: "0 20px" }}>{title}</div>
    <div style={{ fontSize: 24, fontWeight: 600, color: C.inkSoft, textAlign: "center", padding: "0 20px" }}>{sub}</div>
  </div>
);

/**
 * "The 350 members of Congress make the laws and elect the prime minister. The Senate can amend
 * them, but Congress has the last word."
 * The half-circle (CongressLayer) sweeps in red; two tiles say what Congress does; the Senate card:
 * who sits there, what it can do, and that Congress decides in the end.
 */
export const CongressScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const label = rise(frame, cue("congress", "members") - 6);
  const laws = pop(frame, cue("congress", "make") - 4);
  const pm = pop(frame, cue("congress", "elect") - 4);
  const senate = rise(frame, cue("congress", "Senate") - 8);
  const amend = pop(frame, cue("congress", "amend") - 3);
  const last = pop(frame, cue("congress", "last") - 3);

  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 840, top: LABEL_TOP, textAlign: "center", fontFamily: theme.font, ...riseStyle(label, exit, 20) }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: C.ink, letterSpacing: -1.2, whiteSpace: "nowrap" }}>Congress of Deputies</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: ES.red, marginTop: 2, whiteSpace: "nowrap" }}>{TOTAL} members · elected at least every 4 years</div>
      </div>
      <Tile left={120} p={laws} exit={exit} icon={<LawIcon size={76} palette={C} />} title="Makes the laws" sub="and passes the budget" />
      <Tile
        left={552}
        p={pm}
        exit={exit}
        icon={<PrimeMinister size={80} id="pm-congress" />}
        title="Elects the prime minister"
        sub="and can vote them out"
      />

      <Card top={SENATE.top} height={SENATE.height} style={{ padding: "24px 32px", display: "flex", alignItems: "center", gap: 26, ...riseStyle(senate, exit) }}>
        <div style={{ width: 120, height: 120, borderRadius: 30, background: ES.sepia, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <ParliamentIcon width={88} palette={C} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 3, color: C.muted, whiteSpace: "nowrap" }}>SENATE · 266 MEMBERS</div>
          <div style={{ fontSize: 23, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap" }}>208 elected · 58 sent by the regional parliaments</div>
          <div style={{ fontSize: 31, fontWeight: 800, color: C.ink, letterSpacing: -0.5, whiteSpace: "nowrap", opacity: Math.min(1, amend * 1.4), transform: `translateX(${(1 - amend) * 30}px)` }}>
            Can amend or veto laws
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: Math.min(1, last * 1.4), transform: `translateX(${(1 - last) * 30}px)` }}>
            <Badge size={36} ok p={last} />
            <div style={{ fontSize: 27, fontWeight: 800, color: ES.red, whiteSpace: "nowrap" }}>but Congress has the last word</div>
          </div>
        </div>
      </Card>
    </>
  );
};
