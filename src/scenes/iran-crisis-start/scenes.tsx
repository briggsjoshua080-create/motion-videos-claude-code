import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { CARRIERS, FONT, HORMUZ_SHARE, IR, MIN_TEXT, TWELVE_DAY_WAR, US_DEAD, type SceneProps } from "./constants";
import { Accent, Aside, Bookmark, Headline, PersonIcon, SectionNumeral, Stamp, WipeLayer, roll } from "./ui";
import { Arc, HOOK_VIEW, IRAN_SITES, Impact, MAP_VIEW, RegionMap, geo } from "./map";

/** Key places (map units). */
const TEHRAN = geo(51.4, 35.7);
const ISRAEL = geo(34.9, 32.1);
const LEBANON = geo(35.7, 33.8);
const KUWAIT = geo(47.9, 29.4);
const BAHRAIN = geo(50.55, 26.2);
const QATAR = geo(51.2, 25.3);
const UAE = geo(54.4, 24.4);
const GULF_FLEET = geo(58.2, 24.8);

/**
 * The text block shared by the hook (frame 0) and the closing question (the last frame), so the
 * video loops back seamlessly (rule 8): two big lines, one accent block, then a smaller line.
 */
export const BLOCK = { top: 300, big: 130, accent: 175, small: 110 } as const;
export const BLOCK_TOPS = (() => {
  const t0 = BLOCK.top;
  const t1 = t0 + BLOCK.big * 0.98;
  const t2 = t1 + BLOCK.big * 0.98 + 8;
  const t3 = t2 + BLOCK.accent * 0.98 + 14;
  return [t0, t1, t2, t3];
})();

/**
 * "ONE NIGHT / KILLED / IRAN'S / LEADER." Rule 1: frame 0 already shows the whole hook line, huge,
 * with IRAN'S in an amber block (works on mute; no title card, no logo). A big outlined 26 sits
 * behind it (the rewatch detail: explained near the end) and a dark map of Iran and the Gulf below
 * it, with a pulsing red marker on Tehran. No subtitles here.
 */
export const HookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const hit = cue("hook", "Iran's");
  const pulse = progress(frame, hit - 2, hit + 4) * (1 - progress(frame, hit + 14, hit + 30));
  const zoom = 1 + 0.02 * progress(frame, 0, duration, Easing.linear);
  const lift = { opacity: 1 - exit, transform: `translateY(${-exit * 60}px) scale(${zoom})`, transformOrigin: "120px 300px" } as const;
  const beat = (frame % 45) / 45;

  return (
    <>
      <SectionNumeral n="26" p={1 - exit} style={{ top: 330 }} />
      <div style={{ position: "absolute", inset: 0, ...lift }}>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[0] }}>
          ONE NIGHT
        </Headline>
        <Headline size={BLOCK.big} style={{ top: BLOCK_TOPS[1] }}>
          KILLED
        </Headline>
        <Headline
          size={BLOCK.accent}
          style={{ top: BLOCK_TOPS[2], transform: `scale(${1 + 0.05 * pulse})`, transformOrigin: "0 50%", filter: pulse > 0 ? `drop-shadow(0 0 ${30 * pulse}px rgba(255,255,255,0.7))` : undefined }}
        >
          <Accent>IRAN'S</Accent>
        </Headline>
        <Headline size={BLOCK.small} style={{ top: BLOCK_TOPS[3] }}>
          LEADER.
        </Headline>
      </div>
      <RegionMap top={HOOK_VIEW.top} height={HOOK_VIEW.height} vb={HOOK_VIEW.vb} opacity={1 - exit} style={{ transform: `translateY(${exit * 80}px)` }}>
        <circle cx={TEHRAN[0]} cy={TEHRAN[1]} r={12} fill={IR.strike} />
        <circle cx={TEHRAN[0]} cy={TEHRAN[1]} r={12 + beat * 50} fill="none" stroke={IR.strike} strokeWidth={4} opacity={1 - beat} />
      </RegionMap>
    </>
  );
};

/** "Who struck? Why then? And who took over?" Rule 2: three curiosity gaps in the first 5 s, one big word each. */
export const LoopsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const p = [rise(frame, cue("loops", "Who") - 3), pop(frame, cue("loops", "Why") - 3), rise(frame, cue("loops", "And") - 3), pop(frame, cue("loops", "over") - 4)];
  const style = (v: number): React.CSSProperties => ({ opacity: Math.min(1, Math.max(0, v) * 1.4) * (1 - exit), transform: `translateY(${(1 - Math.min(1, v)) * 40 - exit * 50}px)` });
  return (
    <>
      <Headline size={200} style={{ top: 280, ...style(p[0]) }}>
        <Accent>WHO?</Accent>
      </Headline>
      <Headline size={130} style={{ top: 520, ...style(p[1]) }}>
        WHY THEN?
      </Headline>
      <Headline size={130} style={{ top: 720, ...style(p[2]) }}>
        WHO TOOK
      </Headline>
      <Headline size={175} style={{ top: 850, ...style(p[3]), transformOrigin: "0 50%" }}>
        <Accent>OVER?</Accent>
      </Headline>
    </>
  );
};

/** "On 28 February, the US and Israel hit Iran together: hundreds of strikes in one day." Rule 3: the first payoff. */
export const StrikeScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const date = pop(frame, cue("strike", "28") - 6);
  const who = rise(frame, cue("strike", "US") - 4);
  const many = pop(frame, cue("strike", "hundreds") - 4);
  const israelArc = progress(frame, cue("strike", "Israel") - 8, cue("strike", "Israel") + 14);
  const usArc = progress(frame, cue("strike", "US") - 8, cue("strike", "US") + 14);
  const start = cue("strike", "hit") + 4;
  return (
    <>
      <Headline size={175} style={{ top: 250, transformOrigin: "0 50%", opacity: Math.min(1, date * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, date)})` }}>
        <Accent>28 FEB</Accent>
      </Headline>
      <Aside size={125} style={{ top: 440, ...riseStyle(who, exit, 40) }}>
        US + Israel
      </Aside>
      <Headline size={130} style={{ top: 560, opacity: Math.min(1, many * 1.5) * (1 - exit), transform: `scale(${0.85 + 0.15 * Math.min(1.06, many)})`, transformOrigin: "0 50%" }}>
        HUNDREDS
      </Headline>
      <RegionMap top={MAP_VIEW.top + 60} height={MAP_VIEW.height - 60} vb={[180, 140, 1040, 400]} opacity={1 - exit}>
        <Arc a={ISRAEL} b={TEHRAN} lift={90} p={israelArc} color={IR.white} />
        <Arc a={GULF_FLEET} b={geo(51.7, 32.65)} lift={70} p={usArc} color={IR.white} />
        {IRAN_SITES.slice(0, 14).map((s, i) => (
          <Impact key={i} at={s} p={progress(frame, start + i * 3, start + i * 3 + 18)} />
        ))}
      </RegionMap>
    </>
  );
};

/** "Supreme Leader Ali Khamenei was killed, and Iran's state media later confirmed it." A generic figure, a stamp, no likeness. */
export const DeadScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 2), rise(frame, 7)];
  const kill = progress(frame, cue("dead", "killed") - 6, cue("dead", "killed") + 6);
  const stamp = pop(frame, cue("dead", "killed") + 2);
  const confirm = pop(frame, cue("dead", "confirmed") - 2);
  return (
    <>
      <Headline size={130} style={{ top: 280, ...riseStyle(head[0], exit, 40) }}>
        SUPREME
      </Headline>
      <Headline size={130} style={{ top: 408, ...riseStyle(head[1], exit, 40) }}>
        LEADER
      </Headline>
      <Aside size={125} style={{ top: 545, ...riseStyle(rise(frame, 12), exit, 40) }}>
        Ali Khamenei
      </Aside>
      <div style={{ position: "absolute", left: 400, top: 640, opacity: (1 - exit) * (1 - 0.7 * kill), transform: `translateY(${kill * 30}px)` }}>
        <PersonIcon size={280} color={IR.white} />
      </div>
      <Stamp p={stamp} color={IR.strike} size={150} rotate={-7} style={{ left: 120, top: 830, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
        KILLED
      </Stamp>
      <Stamp p={confirm} color={IR.amber} size={MIN_TEXT} rotate={3} style={{ left: 120, top: 1040, opacity: Math.min(1, Math.max(0, confirm) * 2) * (1 - exit) }}>
        CONFIRMED
      </Stamp>
    </>
  );
};

/** "But the fuse was lit months earlier." Re-hook 1 (rule 5) on a full amber flash: a fuse burns toward a bomb. */
export const RehookScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 2), rise(frame, 6), pop(frame, 10)];
  const burn = progress(frame, cue("rehook", "fuse") - 4, cue("rehook", "earlier") + 14);
  const path = "M900 1050 C 760 1000, 700 1120, 560 1060 C 430 1005, 380 1110, 270 1070";
  const spark = { x: 900 - 630 * burn, y: 1050 + 20 * Math.sin(burn * 9) };
  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <Headline size={130} tone="flash" style={{ top: 270, ...riseStyle(head[0], exit, 40) }}>
        THE FUSE
      </Headline>
      <Headline size={175} tone="flash" style={{ top: 400, opacity: Math.min(1, head[1] * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, head[1])})`, transformOrigin: "0 50%" }}>
        <Accent tone="flash">MONTHS</Accent>
      </Headline>
      <Headline size={130} tone="flash" style={{ top: 590, ...riseStyle(head[2], exit, 40) }}>
        EARLIER
      </Headline>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <path d={path} fill="none" stroke="rgba(11,16,48,0.25)" strokeWidth={14} strokeLinecap="round" />
        <path d={path} fill="none" stroke={IR.navy} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={burn} />
        <circle cx={spark.x} cy={spark.y} r={22} fill="#FFFFFF" opacity={burn > 0 && burn < 1 ? 1 : 0} />
        <circle cx={spark.x} cy={spark.y} r={44} fill="none" stroke={IR.navy} strokeWidth={5} opacity={burn > 0 && burn < 1 ? 0.6 : 0} />
        <circle cx={215} cy={1075} r={78} fill={IR.navy} />
        <rect x={190} y={985} width={50} height={44} rx={8} fill={IR.navy} />
      </svg>
    </>
  );
};

/** "June 2025: Israel and Iran fight a twelve-day war." Missiles go both ways; a day counter rolls to 12. */
export const JuneScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 2), pop(frame, cue("june", "twelve-day") - 4)];
  const days = roll(1, TWELVE_DAY_WAR, progress(frame, cue("june", "twelve-day") - 2, cue("june", "twelve-day") + 26));
  const loop = (frame % 40) / 40;
  return (
    <>
      <Headline size={130} style={{ top: 270, ...riseStyle(head[0], exit, 40) }}>
        JUN 2025
      </Headline>
      <Headline size={150} style={{ top: 410, opacity: Math.min(1, head[1] * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, head[1])})`, transformOrigin: "0 50%" }}>
        <Accent>{days} DAYS</Accent>
      </Headline>
      <RegionMap top={MAP_VIEW.top - 10} height={MAP_VIEW.height + 10} vb={[0, 125, 1040, 443]} opacity={1 - exit}>
        <Arc a={ISRAEL} b={TEHRAN} lift={110} p={loop} color={IR.white} />
        <Arc a={TEHRAN} b={ISRAEL} lift={170} p={(loop + 0.5) % 1} color={IR.strike} />
      </RegionMap>
    </>
  );
};

/** "A ceasefire stops it, but the nuclear dispute stays unsolved." A ceasefire stamp, then an atom stamped UNSOLVED. */
export const TalksScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const stamp = pop(frame, cue("talks", "ceasefire") - 2);
  const head = [rise(frame, cue("talks", "nuclear") - 4), pop(frame, cue("talks", "unsolved") - 4)];
  const spin = (frame / 40) * Math.PI * 2;
  return (
    <>
      <Stamp p={stamp} color={IR.white} size={MIN_TEXT} rotate={-5} style={{ left: 120, top: 260, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
        CEASEFIRE
      </Stamp>
      <Headline size={150} style={{ top: 470, ...riseStyle(head[0], exit, 40) }}>
        NUCLEAR
      </Headline>
      <Headline size={130} style={{ top: 620, opacity: Math.min(1, head[1] * 1.5) * (1 - exit), transform: `scale(${0.85 + 0.15 * Math.min(1.06, head[1])})`, transformOrigin: "0 50%" }}>
        <Accent>UNSOLVED</Accent>
      </Headline>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <g transform="translate(540 960)">
          {[0, 60, 120].map((a) => (
            <ellipse key={a} rx={230} ry={78} fill="none" stroke={IR.white} strokeWidth={5} opacity={0.7} transform={`rotate(${a})`} />
          ))}
          <circle r={34} fill={IR.amber} />
          {[0, 60, 120].map((a, i) => {
            const t = spin + i * 2.1;
            const x = Math.cos(t) * 230;
            const y = Math.sin(t) * 78;
            const rot = (a * Math.PI) / 180;
            return <circle key={a} cx={x * Math.cos(rot) - y * Math.sin(rot)} cy={x * Math.sin(rot) + y * Math.cos(rot)} r={17} fill={IR.white} />;
          })}
        </g>
      </svg>
    </>
  );
};

/** "Then, in late December, Iran's money crashes, shops shut in Tehran, and protests spread." Dots spread from Tehran. */
export const ProtestsScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 2), pop(frame, cue("protests", "protests") - 4)];
  const start = cue("protests", "shops") - 2;
  const end = cue("protests", "spread") + 6;
  const dist = (s: readonly [number, number]) => Math.hypot(s[0] - TEHRAN[0], s[1] - TEHRAN[1]);
  const maxDist = Math.max(...IRAN_SITES.map(dist));
  return (
    <>
      <Headline size={130} style={{ top: 270, ...riseStyle(head[0], exit, 40) }}>
        DEC 2025
      </Headline>
      <Headline size={130} style={{ top: 405, opacity: Math.min(1, head[1] * 1.5) * (1 - exit), transform: `scale(${0.85 + 0.15 * Math.min(1.06, head[1])})`, transformOrigin: "0 50%" }}>
        <Accent>PROTESTS</Accent>
      </Headline>
      <RegionMap top={MAP_VIEW.top - 20} height={MAP_VIEW.height + 20} vb={[180, 100, 1040, 443]} opacity={1 - exit}>
        {IRAN_SITES.map((s, i) => {
          const t = start + (dist(s) / maxDist) * (end - start);
          return <Impact key={i} at={s} p={progress(frame, t, t + 16)} color={IR.amber} r={10} />;
        })}
      </RegionMap>
    </>
  );
};

/** "Rights groups say thousands were killed in the crackdown. Iran's government gives a lower count." Neutral, both claims attributed. */
export const CrackdownScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = rise(frame, 2);
  const rights = rise(frame, cue("crackdown", "Rights") - 4);
  const gov = rise(frame, cue("crackdown", "government") - 4);
  const govIn = progress(frame, cue("crackdown", "government") - 3, cue("crackdown", "government") + 5);
  const fade = progress(frame, cue("crackdown", "killed") - 4, cue("crackdown", "crackdown") + 8);
  return (
    <>
      <Headline size={130} style={{ top: 270, ...riseStyle(head, exit, 40) }}>
        THOUSANDS
      </Headline>
      <Aside size={125} style={{ top: 410, ...riseStyle(rights, exit, 40), opacity: Math.min(1, rights) * (1 - exit) * (1 - govIn) }}>
        rights groups say
      </Aside>
      <Aside size={125} style={{ top: 410, ...riseStyle(gov, exit, 40), opacity: Math.min(1, gov) * (1 - exit) * govIn }}>
        government: fewer
      </Aside>
      <RegionMap top={MAP_VIEW.top + 20} height={MAP_VIEW.height - 20} vb={[180, 125, 1040, 443]} opacity={1 - exit}>
        {IRAN_SITES.map((s, i) => {
          const f = Math.min(1, Math.max(0, fade * 1.6 - (i / IRAN_SITES.length) * 0.6));
          return (
            <g key={i}>
              <circle cx={s[0]} cy={s[1]} r={10} fill={IR.amber} opacity={1 - f} />
              <circle cx={s[0]} cy={s[1]} r={10} fill="none" stroke={IR.white} strokeWidth={3} opacity={f * 0.85} />
            </g>
          );
        })}
      </RegionMap>
    </>
  );
};

/** A flat aircraft carrier silhouette (generic): hull, deck and island. */
const Carrier: React.FC<{ x: number; y: number; scale?: number; color: string }> = ({ x, y, scale = 1, color }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} fill={color}>
    <path d="M0 40 L40 70 L420 70 L470 30 L470 18 L0 18 Z" />
    <rect x={300} y={-14} width={46} height={32} rx={4} />
    <rect x={318} y={-34} width={10} height={22} />
  </g>
);

/** "Now it gets strange: America is sending warships." Re-hook 2 on an amber flash: two carriers sail in. */
export const FleetScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 2), pop(frame, 6)];
  const count = roll(0, CARRIERS, progress(frame, cue("fleet", "warships") - 2, cue("fleet", "warships") + 20));
  const sail = [progress(frame, 4, cue("fleet", "America") + 16), progress(frame, 12, cue("fleet", "warships") + 22)];
  const bob = Math.sin(frame / 9) * 5;
  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <Headline size={130} tone="flash" style={{ top: 270, ...riseStyle(head[0], exit, 40) }}>
        WARSHIPS
      </Headline>
      <Headline size={175} tone="flash" style={{ top: 400, opacity: Math.min(1, head[1] * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, head[1])})`, transformOrigin: "0 50%" }}>
        <Accent tone="flash">{count}</Accent>
      </Headline>
      <Headline size={130} tone="flash" style={{ top: 590, ...riseStyle(head[1], exit, 40) }}>
        CARRIERS
      </Headline>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {[0, 1].map((i) => (
          <Carrier key={i} x={-480 + sail[i] * (i === 0 ? 560 : 800)} y={800 + i * 190 + bob * (i ? -1 : 1)} scale={1.05} color={IR.navy} />
        ))}
        {[0, 1].map((i) => (
          <path key={i} d={`M0 ${900 + i * 190} q60 -16 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0`} fill="none" stroke="rgba(11,16,48,0.35)" strokeWidth={6} />
        ))}
      </svg>
    </>
  );
};

/** "So when the strikes come, Iran hits back within hours: missiles and drones at US bases in Bahrain, Qatar, Kuwait and the UAE." */
export const RetaliateScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 2), pop(frame, cue("retaliate", "hits") - 3)];
  const targets: { at: readonly [number, number]; word: string }[] = [
    { at: BAHRAIN, word: "Bahrain" },
    { at: QATAR, word: "Qatar" },
    { at: KUWAIT, word: "Kuwait" },
    { at: UAE, word: "UAE" },
  ];
  const sources = [geo(50.8, 28.9), geo(52.5, 29.6), geo(48.7, 31.3), geo(56.3, 27.2)];
  return (
    <>
      <Headline size={130} style={{ top: 270, ...riseStyle(head[0], exit, 40) }}>
        IRAN HITS
      </Headline>
      <Headline size={175} style={{ top: 400, opacity: Math.min(1, head[1] * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, head[1])})`, transformOrigin: "0 50%" }}>
        <Accent>BACK</Accent>
      </Headline>
      <Aside size={125} style={{ top: 600, ...riseStyle(rise(frame, cue("retaliate", "US") - 4), exit, 40) }}>
        US bases
      </Aside>
      <RegionMap top={MAP_VIEW.top + 40} height={MAP_VIEW.height - 40} vb={[320, 380, 620, 241]} opacity={1 - exit}>
        {targets.map((t, i) => {
          const t0 = cue("retaliate", t.word) - 14;
          return (
            <g key={t.word}>
              <Arc a={sources[i]} b={t.at} lift={30} p={progress(frame, t0, t0 + 14)} width={3} head={5} />
              <Impact at={t.at} p={progress(frame, t0 + 14, t0 + 34)} r={7} />
            </g>
          );
        })}
      </RegionMap>
    </>
  );
};

/** "On 1 March, a drone strike in Kuwait kills American soldiers: the first US deaths of the war." */
export const UsDeadScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const stamp = pop(frame, 2);
  const head = [rise(frame, cue("usdead", "Kuwait") - 4), rise(frame, cue("usdead", "first") - 4)];
  const row = (i: number) => progress(frame, cue("usdead", "kills") + i * 3, cue("usdead", "kills") + i * 3 + 14);
  return (
    <>
      <Stamp p={stamp} color={IR.white} size={MIN_TEXT} rotate={-5} style={{ left: 120, top: 260, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - exit) }}>
        1 MARCH
      </Stamp>
      <Headline size={175} style={{ top: 440, ...riseStyle(head[0], exit, 40) }}>
        <Accent>KUWAIT</Accent>
      </Headline>
      <Headline size={130} style={{ top: 650, ...riseStyle(head[1], exit, 40) }}>
        FIRST US
      </Headline>
      <Headline size={130} style={{ top: 778, ...riseStyle(head[1], exit, 40) }}>
        DEATHS
      </Headline>
      <div style={{ position: "absolute", left: 120, top: 960, display: "flex", gap: 8, opacity: 1 - exit }}>
        {Array.from({ length: US_DEAD }, (_, i) => (
          <div key={i} style={{ opacity: row(i), transform: `translateY(${(1 - row(i)) * 30}px)` }}>
            <PersonIcon size={130} color={IR.white} />
          </div>
        ))}
      </div>
    </>
  );
};

/** "Then tankers stop crossing the Strait of Hormuz, the route for a fifth of the world's oil." A channel with tankers that halt, and a 1/5 ring. */
export const HormuzScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 2), pop(frame, 6)];
  const halt = cue("hormuz", "stop");
  const share = progress(frame, cue("hormuz", "fifth") - 4, cue("hormuz", "fifth") + 24);
  const tankers = [0, 1, 2, 3];
  // Each tanker sails right-to-left through the channel and stops at its own place once "stop" is spoken.
  const stops = [180, 360, 540, 720];
  const x = (i: number) => {
    const travel = (frame + i * 40) * 6;
    const natural = 1100 - (travel % 1500);
    const stopAt = stops[i];
    const frozen = progress(frame, halt + i * 4, halt + i * 4 + 6);
    return natural * (1 - frozen) + Math.max(stopAt, natural) * frozen;
  };
  const r = 120;
  const c = 2 * Math.PI * r;
  return (
    <>
      <Headline size={130} style={{ top: 270, ...riseStyle(head[0], exit, 40) }}>
        STRAIT OF
      </Headline>
      <Headline size={175} style={{ top: 400, opacity: Math.min(1, head[1] * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, head[1])})`, transformOrigin: "0 50%" }}>
        <Accent>HORMUZ</Accent>
      </Headline>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <rect x={0} y={640} width={1080} height={110} fill={IR.iran} />
        <rect x={0} y={900} width={1080} height={120} fill={IR.land} />
        <rect x={0} y={750} width={1080} height={150} fill={IR.water} />
        {tankers.map((i) => {
          const tx = x(i);
          return (
            <g key={i} transform={`translate(${tx} 800)`}>
              <path d="M0 14 L20 44 L150 44 L170 14 Z" fill={IR.amber} />
              <rect x={115} y={-6} width={26} height={20} fill={IR.white} />
              <rect x={30} y={2} width={80} height={12} fill={IR.amberDeep} />
            </g>
          );
        })}
        <g transform="translate(260 1120)">
          <circle r={r} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={34} />
          <circle r={r} fill="none" stroke={IR.amber} strokeWidth={34} strokeDasharray={`${c * HORMUZ_SHARE * share} ${c}`} transform="rotate(-90)" strokeLinecap="butt" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 150, top: 1062, width: 220, textAlign: "center", fontFamily: FONT.display, fontSize: 110, color: IR.white, opacity: (1 - exit) * share }}>1/5</div>
      <Aside size={118} style={{ left: 440, top: 1055, opacity: (1 - exit) * share }}>
        of the world's
        <br />
        oil
      </Aside>
    </>
  );
};

/** "And it spreads: on 2 March, Hezbollah fires on Israel, and Israel strikes back across Lebanon." Re-hook 3 on an amber flash. */
export const SpreadScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 2), pop(frame, 6)];
  const out = progress(frame, cue("spread", "Hezbollah") - 6, cue("spread", "Hezbollah") + 14);
  const back = progress(frame, cue("spread", "strikes") - 6, cue("spread", "strikes") + 14);
  return (
    <>
      <WipeLayer duration={duration} kind="flash" />
      <Headline size={130} tone="flash" style={{ top: 270, ...riseStyle(head[0], exit, 40) }}>
        AND IT
      </Headline>
      <Headline size={150} tone="flash" style={{ top: 400, opacity: Math.min(1, head[1] * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, head[1])})`, transformOrigin: "0 50%" }}>
        <Accent tone="flash">SPREADS</Accent>
      </Headline>
      <RegionMap top={640} height={440} vb={[-45, 245, 300, 150]} tone="flash" lit={["Lebanon", "Israel"]} opacity={1 - exit}>
        <Arc a={LEBANON} b={ISRAEL} lift={22} p={out} color={IR.navy} width={3} head={4} />
        <Arc a={ISRAEL} b={LEBANON} lift={40} p={back} color={IR.navy} width={3} head={4} />
        <Impact at={ISRAEL} p={progress(frame, cue("spread", "Hezbollah") + 12, cue("spread", "Hezbollah") + 30)} color={IR.navy} r={4} />
        <Impact at={LEBANON} p={progress(frame, cue("spread", "strikes") + 12, cue("spread", "strikes") + 30)} color={IR.navy} r={4} />
      </RegionMap>
      <Aside size={125} tone="flash" style={{ top: 1110, ...riseStyle(rise(frame, cue("spread", "Hezbollah") - 6), exit, 40) }}>
        Hezbollah vs Israel
      </Aside>
    </>
  );
};

/** "Within ten days, Iran names Khamenei's son, Mojtaba, its new leader." The old figure fades, the new one lights up. */
export const SonScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [rise(frame, 2), pop(frame, cue("son", "new") - 4)];
  const swap = progress(frame, cue("son", "son") - 4, cue("son", "son") + 14);
  const name = rise(frame, cue("son", "Mojtaba") - 4);
  return (
    <>
      <Headline size={130} style={{ top: 270, ...riseStyle(head[0], exit, 40) }}>
        NEW
      </Headline>
      <Headline size={175} style={{ top: 400, opacity: Math.min(1, head[1] * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, head[1])})`, transformOrigin: "0 50%" }}>
        <Accent>LEADER</Accent>
      </Headline>
      <div style={{ position: "absolute", left: 150, top: 720, opacity: (1 - exit) * (1 - 0.65 * swap) }}>
        <PersonIcon size={300} color={IR.white} />
      </div>
      <div style={{ position: "absolute", left: 470, top: 780, opacity: 1 - exit, color: IR.amber, fontFamily: FONT.display, fontSize: 130 }}>{swap > 0.2 ? "→" : ""}</div>
      <div style={{ position: "absolute", left: 650, top: 690 + (1 - swap) * 30, opacity: (1 - exit) * swap, filter: `drop-shadow(0 0 ${30 * swap}px ${IR.amber})`, transform: `scale(${0.8 + 0.2 * swap})`, transformOrigin: "50% 100%" }}>
        <PersonIcon size={330} color={IR.amber} fill="rgba(255,176,32,0.25)" />
      </div>
      <Aside size={125} style={{ top: 1080, ...riseStyle(name, exit, 40) }}>
        Mojtaba Khamenei
      </Aside>
    </>
  );
};

/** "And the huge number at the start? 26 February: the US and Iran were still talking in Geneva." The rewatch detail is paid off. */
export const Talk26Scene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const num = pop(frame, 2);
  const head = [pop(frame, cue("talk26", "26") - 2), rise(frame, cue("talk26", "still") - 4)];
  const geneva = rise(frame, cue("talk26", "Geneva") - 4);
  return (
    <>
      <SectionNumeral n="26" p={num * (1 - exit)} style={{ top: 330 }} />
      <Headline size={175} style={{ top: 270, opacity: Math.min(1, head[0] * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, head[0])})`, transformOrigin: "0 50%" }}>
        <Accent>26 FEB</Accent>
      </Headline>
      <Headline size={130} style={{ top: 480, ...riseStyle(head[1], exit, 40) }}>
        STILL
      </Headline>
      <Headline size={130} style={{ top: 608, ...riseStyle(head[1], exit, 40) }}>
        TALKING
      </Headline>
      <Aside size={125} style={{ top: 770, ...riseStyle(geneva, exit, 40) }}>
        in Geneva
      </Aside>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: (1 - exit) * geneva }}>
        <line x1={160} x2={920} y1={1090} y2={1090} stroke={IR.white} strokeWidth={10} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 170, top: 900, opacity: (1 - exit) * geneva }}>
        <PersonIcon size={200} color={IR.white} />
      </div>
      <div style={{ position: "absolute", left: 710, top: 900, opacity: (1 - exit) * geneva }}>
        <PersonIcon size={200} color={IR.amber} />
      </div>
    </>
  );
};

/** "Two days later, the bombs fell." The punchline: a 2 DAYS block, then BOMBS in red with a short red pulse. */
export const TwoDaysScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const head = [pop(frame, cue("twodays", "Two") - 3), rise(frame, cue("twodays", "later") - 3), pop(frame, cue("twodays", "bombs") - 3)];
  const flash = progress(frame, cue("twodays", "bombs") - 2, cue("twodays", "bombs") + 3) * (1 - progress(frame, cue("twodays", "bombs") + 3, cue("twodays", "bombs") + 14));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: IR.strike, opacity: flash * 0.35 }} />
      <Headline size={175} style={{ top: 360, opacity: Math.min(1, head[0] * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, head[0])})`, transformOrigin: "0 50%" }}>
        <Accent>2 DAYS</Accent>
      </Headline>
      <Headline size={130} style={{ top: 580, ...riseStyle(head[1], exit, 40) }}>
        LATER:
      </Headline>
      <Headline size={175} style={{ top: 730, color: IR.strike, opacity: Math.min(1, head[2] * 1.5) * (1 - exit), transform: `scale(${0.7 + 0.3 * Math.min(1.1, head[2])})`, transformOrigin: "0 50%" }}>
        BOMBS
      </Headline>
    </>
  );
};

/** "Part two covers where it stands now. Save this." The share/save reason, with a bookmark. */
export const SaveScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const part = pop(frame, cue("save", "Part") - 2);
  const where = rise(frame, cue("save", "covers") - 3);
  const save = pop(frame, cue("save", "Save") - 3);
  return (
    <>
      <Headline size={175} style={{ top: 300, opacity: Math.min(1, part * 1.5) * (1 - exit), transform: `scale(${0.8 + 0.2 * Math.min(1.06, part)})`, transformOrigin: "0 50%" }}>
        <Accent>PART 2</Accent>
      </Headline>
      <Headline size={120} style={{ top: 520, ...riseStyle(where, exit, 40) }}>
        WHERE IT
      </Headline>
      <Headline size={120} style={{ top: 640, ...riseStyle(where, exit, 40) }}>
        STANDS NOW
      </Headline>
      <Aside size={125} style={{ top: 840, ...riseStyle(save, exit, 40) }}>
        Save this
      </Aside>
      <Bookmark size={300} p={save} style={{ position: "absolute", left: 620, top: 800, opacity: 1 - exit }} />
    </>
  );
};

/**
 * "Was striking Iran justified?" Rules 8 and 9: one YES/NO question in exactly the hook's layout (same
 * sizes, same amber block, same position): WAS / STRIKING / IRAN / JUSTIFIED?, so the last frame flows
 * straight back into frame 0 when TikTok loops it. The dark map sits where it does on frame 0, with
 * YES / NO over it. It holds for 1.2 s. No subtitles: the words are on screen.
 */
export const QuestionScene: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const words = [
    rise(frame, cue("question", "Was") - 6),
    rise(frame, cue("question", "striking") - 6),
    pop(frame, cue("question", "Iran") - 5),
    rise(frame, cue("question", "justified") - 6),
  ];
  const answers = [pop(frame, cue("question", "justified", "end") - 2), pop(frame, cue("question", "justified", "end") + 3)];
  const style = (p: number, i: number): React.CSSProperties => ({
    top: BLOCK_TOPS[i],
    opacity: Math.min(1, Math.max(0, p) * 1.4),
    transform: `translateY(${(1 - Math.min(1, p)) * 40}px)`,
  });
  return (
    <>
      <SectionNumeral n="26" p={1} style={{ top: 330 }} />
      <Headline size={BLOCK.big} style={style(words[0], 0)}>
        WAS
      </Headline>
      <Headline size={BLOCK.big} style={style(words[1], 1)}>
        STRIKING
      </Headline>
      <Headline size={BLOCK.accent} style={{ ...style(words[2], 2), transform: `scale(${0.8 + 0.2 * Math.min(1.06, Math.max(0, words[2]))})`, transformOrigin: "0 50%" }}>
        <Accent>IRAN</Accent>
      </Headline>
      <Headline size={BLOCK.small} style={style(words[3], 3)}>
        JUSTIFIED?
      </Headline>
      <RegionMap top={HOOK_VIEW.top} height={HOOK_VIEW.height} vb={HOOK_VIEW.vb} opacity={0.35} />
      <div style={{ position: "absolute", left: 120, top: 1010, display: "flex", gap: 40 }}>
        {[
          { label: "YES", fill: IR.amber, color: IR.navy },
          { label: "NO", fill: IR.white, color: IR.navy },
        ].map((a, i) => (
          <div
            key={a.label}
            style={{
              width: 400,
              height: 170,
              borderRadius: 85,
              background: a.fill,
              border: i === 0 ? `4px solid ${IR.white}` : "none",
              boxSizing: "border-box",
              boxShadow: i === 0 ? "0 0 50px rgba(255,176,32,0.5)" : "0 20px 40px rgba(5,7,24,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT.display,
              fontSize: 120,
              lineHeight: 1,
              color: a.color,
              opacity: Math.min(1, Math.max(0, answers[i]) * 1.5),
              transform: `scale(${0.6 + 0.4 * Math.min(1.08, Math.max(0, answers[i]))})`,
            }}
          >
            {a.label}
          </div>
        ))}
      </div>
    </>
  );
};
