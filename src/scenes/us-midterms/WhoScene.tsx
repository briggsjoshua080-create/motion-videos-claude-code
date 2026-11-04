import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/explainer/motion";
import { FONT, US, VOTING_AGE, type SceneProps } from "./constants";
import { Accent, Aside, Clipboard, Headline, Mark, SectionNumeral, StateTile, roll } from "./ui";

/**
 * "The graders: citizens from 18 who registered. North Dakota skips that." Section 03, the Vote
 * step, opens with who can vote (short, rule 3) and closes loop 2 (who grades him): THE GRADERS, a
 * huge 18+ that counts up on "18", "who registered." with a sign-up clipboard; then the North Dakota
 * tile drops onto the clipboard and a red cross strikes the form (the only state with no voter
 * registration). The tile lands a little before "North" so it stays up almost 2 s.
 */
export const WhoScene: React.FC<SceneProps> = ({ cue, duration }) => {
  const frame = useCurrentFrame();
  const exit = sceneExit(frame, duration);
  const numeral = rise(frame, 0);
  const head = [rise(frame, 1), rise(frame, 4)];
  const age = rise(frame, cue("who", "from") - 6);
  const count = progress(frame, cue("who", "from"), cue("who", "18", "end"), Easing.out(Easing.cubic));
  const plus = pop(frame, cue("who", "18", "end") - 2);
  const aside = rise(frame, cue("who", "who") - 6);
  const board = pop(frame, cue("who", "registered") - 6);
  const tileAt = cue("who", "North") - 10;
  const tile = progress(frame, tileAt, tileAt + 8, Easing.in(Easing.quad));
  const land = frame >= tileAt + 8 && frame < tileAt + 14 ? Math.sin((frame - tileAt - 8) * 2.2) * 6 * (1 - (frame - tileAt - 8) / 6) : 0;
  const cross = progress(frame, cue("who", "skips") - 4, cue("who", "skips") + 6);

  return (
    <>
      <SectionNumeral n="03" p={numeral * (1 - exit)} />
      <Headline size={150} style={{ top: 250, ...riseStyle(head[0], exit, 50) }}>
        THE
      </Headline>
      <Headline size={150} style={{ top: 250 + 147, ...riseStyle(head[1], exit, 50) }}>
        <Accent>GRADERS</Accent>
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 600,
          fontFamily: FONT.display,
          fontSize: 300,
          lineHeight: 0.92,
          letterSpacing: -6,
          color: US.white,
          textShadow: "0 0 60px rgba(255,255,255,0.35)",
          whiteSpace: "nowrap",
          ...riseStyle(age, exit, 60),
        }}
      >
        {roll(0, VOTING_AGE, count)}
        <span style={{ display: "inline-block", color: US.redLight, opacity: Math.min(1, Math.max(0, plus) * 1.5), transform: `scale(${0.5 + 0.5 * Math.min(1.1, Math.max(0, plus))})` }}>+</span>
      </div>
      <Aside size={118} style={{ top: 920, ...riseStyle(aside, exit, 30) }}>
        who registered.
      </Aside>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 40}px)` }}>
        <div style={{ position: "absolute", left: 750, top: 650, width: 200, height: 250, opacity: Math.min(1, Math.max(0, board) * 1.5), transform: `scale(${0.5 + 0.5 * Math.min(1.1, Math.max(0, board))}) rotate(6deg)` }}>
          <Clipboard size={250} style={{ filter: "drop-shadow(0 20px 30px rgba(0,8,30,0.45))" }} />
          {cross > 0 && (
            <div style={{ position: "absolute", left: -20, top: 10 }}>
              <Mark ok={false} size={240} p={cross} color={US.red} width={11} />
            </div>
          )}
        </div>
        {tile > 0 && (
          <StateTile
            code="ND"
            size={170}
            fill={US.white}
            color={US.red}
            style={{ left: 735 + land, top: 610 + (1 - tile) * -620, transform: `rotate(${-10 + land}deg)`, opacity: Math.min(1, tile * 3) }}
          />
        )}
      </div>
    </>
  );
};
