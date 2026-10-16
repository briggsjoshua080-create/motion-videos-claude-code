import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { BallotBoxIcon, LawIcon, ParliamentIcon } from "../../components/explainer/icons";
import { NameCard } from "../../components/explainer/NameCard";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { ELECTIONS, MAJORITY, PALETTE as C, PT, type SceneProps } from "./constants";
import { President } from "./characters";
import { Badge, Card, Pill } from "./ui";

const PRES = { size: 176, top: 306 } as const;
const NAME = { top: 500, height: 140 } as const;
const PILL_TOP = NAME.top + NAME.height + 20;
const TILES_TOP = PILL_TOP + 78;
const TILE_H = 210;
const LIST = { top: TILES_TOP + TILE_H + 22, height: 230 } as const;

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
    <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, letterSpacing: -0.8, textAlign: "center", lineHeight: 1.1, padding: "0 20px" }}>{title}</div>
    <div style={{ fontSize: 23, fontWeight: 600, color: C.inkSoft, textAlign: "center", padding: "0 20px", lineHeight: 1.25, whiteSpace: "pre-line" }}>{sub}</div>
  </div>
);

/**
 * "And the President? Directly elected, he can veto laws and dissolve parliament. That's how
 * Portugal got its last three elections."
 * The President (generic cartoon with the green-red sash), his name card, "elected directly" with
 * the 2026 run-off, two tiles (veto, which parliament can override with 116 votes; dissolve and
 * call elections), then the three dissolutions (by his predecessor, Marcelo Rebelo de Sousa) behind the 2022, 2024
 * and 2025 elections.
 */
export const PresidentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const pres = pop(frame, cue("president", "President") - 8);
  const card = pop(frame, cue("president", "President") - 2);
  const name = progress(frame, cue("president", "President"), cue("president", "Directly"));
  const direct = pop(frame, cue("president", "Directly") - 3);
  const veto = pop(frame, cue("president", "veto") - 4);
  const dissolve = pop(frame, cue("president", "dissolve") - 4);
  const list = rise(frame, cue("president", "That's") - 6);
  const items = ELECTIONS.map((_, i) => pop(frame, cue("president", "last") - 4 + i * 5));

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 540 - PRES.size / 2,
          top: PRES.top,
          opacity: Math.min(1, pres * 1.4) * (1 - exit),
          transform: `translateY(${-exit * 40}px) scale(${0.85 + 0.15 * pres})`,
          filter: "drop-shadow(0 18px 30px rgba(20,32,43,0.18))",
        }}
      >
        <President size={PRES.size} id="pres-scene" />
      </div>

      <NameCard
        top={NAME.top}
        height={NAME.height}
        left={120}
        width={840}
        role="PRESIDENT · HEAD OF STATE"
        name="António José Seguro"
        sub="since 9 March 2026 · a 5-year term"
        cardP={card}
        nameP={name}
        exitP={exit}
        palette={C}
      />

      <div style={{ position: "absolute", left: 120, width: 840, top: PILL_TOP, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Pill p={direct} bg={PT.greenSoft} color={PT.greenDeep} border={PT.green} size={27}>
          Elected by the people · run-off Feb 2026: 66.8% to 33.2%
        </Pill>
      </div>

      <Tile
        left={120}
        p={veto}
        exit={exit}
        icon={
          <div style={{ position: "relative" }}>
            <LawIcon size={76} palette={C} />
            <Badge size={42} ok={false} p={veto} style={{ position: "absolute", right: -16, bottom: -6 }} />
          </div>
        }
        title="Can veto laws"
        sub={`but parliament can override\nhim with ${MAJORITY} votes`}
      />
      <Tile
        left={552}
        p={dissolve}
        exit={exit}
        icon={
          <div style={{ position: "relative" }}>
            <ParliamentIcon width={86} palette={C} />
            <Badge size={42} ok={false} p={dissolve} style={{ position: "absolute", right: -18, bottom: -8 }} />
          </div>
        }
        title="Can dissolve parliament"
        sub={"and call new elections,\nafter hearing the parties"}
      />

      <Card top={LIST.top} height={LIST.height} style={{ padding: "22px 36px", ...riseStyle(list, exit) }}>
        <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: 2, color: C.muted, whiteSpace: "nowrap", textAlign: "center" }}>DISSOLVED BY THE LAST PRESIDENT → NEW ELECTION</div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between" }}>
          {ELECTIONS.map((e, i) => {
            const p = items[i];
            return (
              <div
                key={e.date}
                style={{
                  width: 240,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  opacity: Math.min(1, Math.max(0, p) * 1.4),
                  transform: `scale(${0.7 + 0.3 * p})`,
                }}
              >
                <BallotBoxIcon size={80} palette={C} mark={PT.red} />
                <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, lineHeight: 1.05 }}>{e.year}</div>
                <div style={{ fontSize: 21, fontWeight: 600, color: C.inkSoft, whiteSpace: "nowrap" }}>{e.why}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};
