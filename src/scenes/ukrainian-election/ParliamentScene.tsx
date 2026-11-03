import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, UA, type SceneProps } from "./constants";
import { Accent, Aside, Headline, SectionNumeral, Stamp, TVFrame, WipeLayer } from "./ui";
import { RADA_LAYOUT, RadaSeats } from "./RadaSeats";

const TV = { left: 140, top: 650, w: 800, h: 460 } as const;

/**
 * "Then it got stranger: his party, named after his TV show, won parliament outright. The Rada makes
 * the laws and picks who runs the government." Re-hook 2 (rule 5, at about 31 s) on a yellow flash: IT
 * GOT STRANGER and a TV whose static clears into the show's title, SERVANT OF THE PEOPLE (the
 * party's name). On "won" the flash wipes away into section 03: THE RADA, the 450-seat hemicycle
 * builds with the party's yellow block past the halfway line and a MAJORITY stamp on "outright", then
 * "makes the laws," and "picks the PM.". The 26 grey seats at the right end are never mentioned here:
 * they are the rewatch detail, explained at the end (rule 10). No seat counts on screen (rule 7).
 */
export const ParliamentScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const won = cue("stranger", "won");

  // Half 1: the re-hook on yellow.
  const swap = progress(frame, won - 6, won + 1, Easing.in(Easing.cubic));
  const head = [rise(frame, 2), rise(frame, 6)];
  const tv = pop(frame, 6);
  const title = progress(frame, cue("stranger", "named") - 4, cue("stranger", "named") + 6);
  const lines = [0, 1, 2].map((i) => rise(frame, cue("stranger", "named") - 2 + i * 4));
  const underline = progress(frame, cue("stranger", "TV") - 2, cue("stranger", "show") + 4);

  // Half 2: the Rada.
  const numeral = rise(frame, won + 2);
  const build = progress(frame, won - 1, won + 22, Easing.out(Easing.quad));
  const rada = rise(frame, cue("stranger", "parliament") - 6);
  const line = progress(frame, won + 14, won + 26);
  const stamp = pop(frame, cue("stranger", "outright") - 2);
  const stampOut = progress(frame, cue("rada", "picks") - 4, cue("rada", "picks") + 4);
  const roles = [rise(frame, cue("rada", "makes") - 6), rise(frame, cue("rada", "makes") - 2)];
  const top = RADA_LAYOUT.cy - RADA_LAYOUT.rOut - 30;

  return (
    <>
      <WipeLayer duration={duration} kind="flash" outAt={won} />

      <div style={{ position: "absolute", inset: 0, opacity: 1 - swap, transform: `translateY(${-swap * 50}px)` }}>
        <Headline size={140} tone="flash" style={{ top: 270, ...riseStyle(head[0], 0, 40) }}>
          IT GOT
        </Headline>
        <Headline size={137} tone="flash" style={{ top: 270 + 137, ...riseStyle(head[1], 0, 40) }}>
          <Accent tone="flash">STRANGER</Accent>
        </Headline>
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, Math.max(0, tv) * 1.5), transform: `scale(${0.85 + 0.15 * Math.min(1.05, tv)})`, transformOrigin: "540px 880px" }}>
          <TVFrame left={TV.left} top={TV.top} width={TV.w} height={TV.h} tone="flash" staticAmount={0.6 * (1 - title)}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", flexDirection: "column", alignItems: "center" }}>
              {["SERVANT", "OF THE", "PEOPLE"].map((w, i) => (
                <div
                  key={w}
                  style={{
                    fontFamily: FONT.display,
                    fontSize: 112,
                    lineHeight: 0.98,
                    letterSpacing: -1.3,
                    color: i === 2 ? UA.yellow : UA.white,
                    textShadow: "0 0 30px rgba(255,255,255,0.35)",
                    whiteSpace: "nowrap",
                    ...riseStyle(lines[i], 0, 30),
                  }}
                >
                  {w}
                </div>
              ))}
              <div style={{ marginTop: 6, height: 8, width: 420 * underline, borderRadius: 4, background: UA.yellow }} />
            </div>
          </TVFrame>
        </div>
      </div>

      <SectionNumeral n="03" p={numeral * (1 - exit)} />
      <Headline size={148} style={{ top: 255, ...riseStyle(rada, exit, 40) }}>
        THE <Accent>RADA</Accent>
      </Headline>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <RadaSeats build={build} />
        {/* The halfway line: more seats than this is a majority. */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: line * 0.7 }}>
          <line x1={540} x2={540} y1={top} y2={top + (RADA_LAYOUT.cy - top) * line} stroke={UA.white} strokeWidth={4} strokeDasharray="10 10" />
        </svg>
      </div>
      <Stamp p={stamp} color={UA.navy} fill={UA.yellow} size={116} rotate={-6} style={{ left: 205, top: 690, opacity: Math.min(1, Math.max(0, stamp) * 2) * (1 - stampOut) * (1 - exit), border: `10px solid ${UA.navy}` }}>
        MAJORITY
      </Stamp>
      <Aside size={120} style={{ top: 905, ...riseStyle(roles[0], exit, 30) }}>
        makes the laws,
      </Aside>
      <Aside size={120} style={{ top: 1025, ...riseStyle(roles[1], exit, 30) }}>
        picks the PM.
      </Aside>
    </>
  );
};
