import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { theme } from "../../theme";
import { UK as MAP } from "../../components/uk";
import { DrawnArrow, ParliamentIcon } from "../../components/explainer/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { COMMONS_POSE, PALETTE as C, UK, type SceneProps } from "./constants";
import { Card, HealthIcon, SchoolIcon, UkMap, mapScale } from "./ui";

const MAP_BOX = { left: 150, top: 380, height: 800 } as const;
const k = mapScale(MAP_BOX.height);
/** Map units -> screen px. */
const toScreen = ([x, y]: readonly [number, number]) => [MAP_BOX.left + x * k, MAP_BOX.top + y * k] as const;

/** Cards in a column to the right of the map. */
const COLUMN = { left: 604, width: 356 } as const;
const PARLIAMENTS = { top: 384, height: 262 } as const;
const LAWS = { top: PARLIAMENTS.top + PARLIAMENTS.height + 20, height: 190 } as const;
const ENGLAND = { top: LAWS.top + LAWS.height + 20, height: 112 } as const;
const PARLIAMENT_POSE = COMMONS_POSE.devolved;

type Nation = { name: string; word: string; parliament: string; seat: readonly [number, number] };
const NATIONS: Nation[] = [
  { name: "Scotland", word: "Scotland", parliament: "Scottish Parliament", seat: toScreen(MAP.edinburgh) },
  { name: "Wales", word: "Wales", parliament: "Senedd (Wales)", seat: toScreen(MAP.cardiff) },
  { name: "Northern Ireland", word: "Northern", parliament: "NI Assembly", seat: toScreen(MAP.belfast) },
];
const [ENGLAND_X, ENGLAND_Y] = toScreen(MAP.regions.find((r) => r.name === "England")!.centre);

/**
 * "Scotland, Wales and Northern Ireland have their own parliaments for things like schools.
 * England doesn't." The nations light up one by one (pins on their parliaments' cities, names in
 * the card on the right); England stays grey, and an arrow shows that the UK Parliament (the small
 * half-circle from CommonsLayer) decides for it.
 */
export const DevolvedScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const mapIn = rise(frame, 0);
  const parliaments = rise(frame, cue("devolved", "Scotland") - 6);
  const lit = NATIONS.map((n) => progress(frame, cue("devolved", n.word) - 4, cue("devolved", n.word) + 6));
  const rows = NATIONS.map((n) => pop(frame, cue("devolved", n.word) - 2));
  const laws = rise(frame, cue("devolved", "things") - 4);
  const england = progress(frame, cue("devolved", "England") - 4, cue("devolved", "England") + 6);
  const englandCard = pop(frame, cue("devolved", "England") - 2);
  const arrow = progress(frame, cue("devolved", "doesn't") - 2, cue("devolved", "doesn't") + 16);
  const decides = rise(frame, cue("devolved", "doesn't") + 6);
  const ukLabel = rise(frame, 8);

  const fill = (name: string) => {
    if (name === "England") return interpolateColors(england, [0, 1], [C.paperDeep, "#D3D8E2"]);
    const i = NATIONS.findIndex((n) => n.name === name);
    return interpolateColors(lit[i], [0, 1], [C.paperDeep, UK.blue]);
  };

  return (
    <>
      <div style={{ position: "absolute", left: MAP_BOX.left, top: MAP_BOX.top, opacity: Math.min(1, mapIn * 1.4) * (1 - exit), transform: `translateY(${(1 - mapIn) * 40}px)` }}>
        <UkMap height={MAP_BOX.height} fill={fill} stroke={C.white} strokeWidth={4} />
      </div>

      {/* A pin on each devolved parliament's city: Edinburgh, Cardiff, Belfast */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - exit }}>
        {NATIONS.map((n, i) => (
          <circle key={n.name} cx={n.seat[0]} cy={n.seat[1]} r={12 * Math.min(1, Math.max(0, rows[i]))} fill={UK.gold} stroke={C.ink} strokeWidth={4} />
        ))}
      </svg>

      {/* Their own parliaments */}
      <Card left={COLUMN.left} top={PARLIAMENTS.top} width={COLUMN.width} height={PARLIAMENTS.height} style={{ padding: "22px 20px", ...riseStyle(parliaments, exit, 30) }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 2, color: C.muted, whiteSpace: "nowrap" }}>OWN PARLIAMENTS</div>
        {NATIONS.map((n, i) => (
          <div
            key={n.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
              fontSize: 27,
              fontWeight: 800,
              color: C.ink,
              whiteSpace: "nowrap",
              opacity: Math.min(1, rows[i] * 1.4),
              transform: `translateX(${(1 - rows[i]) * 30}px)`,
            }}
          >
            <ParliamentIcon width={50} palette={C} />
            {n.parliament}
          </div>
        ))}
      </Card>

      {/* For things like schools */}
      <Card left={COLUMN.left} top={LAWS.top} width={COLUMN.width} height={LAWS.height} style={{ padding: "22px 20px", ...riseStyle(laws, exit, 30) }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 2, color: C.muted, whiteSpace: "nowrap" }}>THEIR OWN LAWS ON</div>
        {[
          { icon: <SchoolIcon size={50} />, text: "Schools", more: "" },
          { icon: <HealthIcon size={50} />, text: "Health", more: "and more" },
        ].map((row) => (
          <div key={row.text} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12, fontSize: 32, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>
            {row.icon}
            {row.text}
            <span style={{ fontSize: 26, color: C.inkSoft, fontWeight: 600 }}>{row.more}</span>
          </div>
        ))}
      </Card>

      {/* England: no parliament of its own; the UK Parliament decides */}
      <Card
        left={COLUMN.left}
        top={ENGLAND.top}
        width={COLUMN.width}
        height={ENGLAND.height}
        style={{
          padding: "0 22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: Math.min(1, englandCard * 1.4) * (1 - exit),
          transform: `scale(${0.8 + 0.2 * englandCard})`,
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 800, color: C.alert }}>England</div>
        <div style={{ fontSize: 27, fontWeight: 700, color: C.ink, whiteSpace: "nowrap" }}>no parliament of its own</div>
      </Card>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - exit }}>
        <DrawnArrow
          x1={PARLIAMENT_POSE.cx - 130}
          y1={PARLIAMENT_POSE.cy - 30}
          x2={ENGLAND_X + 40}
          y2={ENGLAND_Y + 20}
          bend={-30}
          p={arrow}
          color={C.ink}
          width={6}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: PARLIAMENT_POSE.cx - 160,
          width: 320,
          top: PARLIAMENT_POSE.cy + 10,
          textAlign: "center",
          fontFamily: theme.font,
          ...riseStyle(ukLabel, exit, 16),
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 800, color: UK.commons }}>UK Parliament</div>
        <div style={{ fontSize: 25, fontWeight: 700, color: C.inkSoft, opacity: decides }}>decides for England</div>
      </div>
    </>
  );
};
