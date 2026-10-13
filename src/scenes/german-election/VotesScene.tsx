import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, localCue, sceneOf } from "../../compositions/german-election/constants";
import { DrawnArrow, DrawnCross, PersonBust } from "../../components/german-election/icons";
import { pop, progress, rise, riseStyle, sceneExit } from "../../components/german-election/motion";

const at = localCue("votes");

const BALLOT = { x: 140, y: 370, w: 800, h: 470 };
const ROW_Y0 = 190;
const ROW_H = 66;
const LEFT_CIRCLE_X = 352;
const RIGHT_CIRCLE_X = 448;
const LEFT_NAMES = [190, 230, 160, 205];
const RIGHT_NAMES = [210, 170, 240, 150];

/** Scene 2: the ballot with two votes; first vote -> local candidate, second vote -> party strength. */
export const VotesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = sceneOf("votes");
  const exit = sceneExit(frame, durationInFrames);

  const ballotIn = rise(frame, 1);
  const cross1 = progress(frame, at("twoVotes", "two") - 2, at("twoVotes", "two") + 8);
  const cross2 = progress(frame, at("twoVotes", "votes") + 4, at("twoVotes", "votes") + 14);

  const firstOn = progress(frame, at("firstVote", "first") - 6, at("firstVote", "first") + 4);
  const secondOn = progress(frame, at("secondVote", "second") - 6, at("secondVote", "second") + 4);
  const leftEmph = firstOn * (1 - secondOn);
  const rightEmph = secondOn;
  const dimLeft = 1 - 0.6 * secondOn;
  const dimRight = 1 - 0.6 * firstOn * (1 - secondOn);

  const leftArrow = progress(frame, at("firstVote", "local") - 4, at("firstVote", "local") + 8);
  const leftCard = pop(frame, at("firstVote", "local"));
  const rightArrow = progress(frame, at("secondVote", "decides") - 4, at("secondVote", "decides") + 8);
  const rightCard = pop(frame, at("secondVote", "decides"));
  const barsStart = at("secondVote", "party's") - 4;

  // Gold frame that slides to whichever column is being explained.
  const frameX = 22 + (414 - 22) * secondOn;
  const frameOpacity = Math.max(leftEmph, rightEmph);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: 1 - exit, transform: `translateY(${-exit * 60}px)` }}>
      {/* Ballot paper */}
      <div
        style={{
          position: "absolute",
          left: BALLOT.x,
          top: BALLOT.y,
          width: BALLOT.w,
          height: BALLOT.h,
          borderRadius: 26,
          background: COLORS.card,
          boxShadow: "0 24px 60px rgba(22,22,26,0.14)",
          ...riseStyle(ballotIn, 0, 90),
        }}
      >
        <div
          style={{
            height: 72,
            borderRadius: "26px 26px 0 0",
            background: COLORS.ink,
            color: COLORS.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
          }}
        >
          <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4 }}>BALLOT</span>
          <span style={{ fontSize: 26, fontWeight: 600 }}>
            You have <span style={{ color: COLORS.gold, fontWeight: 800 }}>2 votes</span>
          </span>
        </div>
        <svg width={BALLOT.w} height={BALLOT.h - 72} viewBox={`0 72 ${BALLOT.w} ${BALLOT.h - 72}`} style={{ display: "block" }}>
          <line x1={400} y1={96} x2={400} y2={BALLOT.h - 26} stroke={COLORS.line} strokeWidth={3} />
          <g opacity={dimLeft}>
            <text x={40} y={128} fontSize={34} fontWeight={800} fill={COLORS.ink}>1st vote</text>
            <text x={40} y={160} fontSize={23} fontWeight={600} fill={COLORS.inkSoft}>for a local candidate</text>
            {LEFT_NAMES.map((w, i) => (
              <g key={i} transform={`translate(0 ${ROW_Y0 + i * ROW_H})`}>
                <rect x={40} y={10} width={w} height={16} rx={8} fill={COLORS.inkSoft} opacity={0.75} />
                <rect x={40} y={34} width={w * 0.5} height={11} rx={5.5} fill={COLORS.muted} opacity={0.6} />
                <circle cx={LEFT_CIRCLE_X} cy={28} r={22} fill="none" stroke={COLORS.ink} strokeWidth={4} />
              </g>
            ))}
          </g>
          <g opacity={dimRight}>
            <text x={760} y={128} fontSize={34} fontWeight={800} fill={COLORS.red} textAnchor="end">2nd vote</text>
            <text x={760} y={160} fontSize={23} fontWeight={600} fill={COLORS.inkSoft} textAnchor="end">for a party</text>
            {RIGHT_NAMES.map((w, i) => (
              <g key={i} transform={`translate(0 ${ROW_Y0 + i * ROW_H})`}>
                <circle cx={RIGHT_CIRCLE_X} cy={28} r={22} fill="none" stroke={COLORS.red} strokeWidth={4} />
                <rect x={760 - w} y={10} width={w} height={16} rx={8} fill={COLORS.red} opacity={0.75} />
                <rect x={760 - w * 0.6} y={34} width={w * 0.6} height={11} rx={5.5} fill={COLORS.muted} opacity={0.6} />
              </g>
            ))}
          </g>
          <rect
            x={frameX}
            y={96}
            width={364}
            height={BALLOT.h - 96 - 24}
            rx={18}
            fill="none"
            stroke={COLORS.gold}
            strokeWidth={7}
            opacity={frameOpacity}
          />
          <g transform={`translate(${LEFT_CIRCLE_X - 24} ${ROW_Y0 + ROW_H + 4})`}>
            <DrawnCross size={48} p={cross1} />
          </g>
          <g transform={`translate(${RIGHT_CIRCLE_X - 24} ${ROW_Y0 + 2 * ROW_H + 4})`}>
            <DrawnCross size={48} p={cross2} color={COLORS.ink} />
          </g>
        </svg>
      </div>

      {/* Connecting arrows (canvas coordinates) */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <DrawnArrow x1={330} y1={850} x2={330} y2={898} p={leftArrow} />
        <DrawnArrow x1={750} y1={850} x2={750} y2={898} p={rightArrow} color={COLORS.red} />
      </svg>

      {/* Result cards */}
      <ResultCard x={140} p={leftCard} title="Local candidate" sub="299 districts">
        <PersonBust id="candidate" size={150} bg={COLORS.paperDeep} suit={COLORS.ink} hair={COLORS.hairDark} rosette />
      </ResultCard>
      <ResultCard x={560} p={rightCard} title="Party strength" sub="share of seats">
        <svg width={190} height={150} viewBox="0 0 190 150">
          <line x1={6} y1={146} x2={184} y2={146} stroke={COLORS.line} strokeWidth={4} strokeLinecap="round" />
          {[0.95, 0.7, 0.5, 0.32].map((h, i) => {
            const g = rise(frame, barsStart + i * 4);
            const height = 136 * h * g;
            return (
              <rect
                key={i}
                x={14 + i * 44}
                y={144 - height}
                width={32}
                height={height}
                rx={7}
                fill={[COLORS.ink, COLORS.red, COLORS.goldDeep, COLORS.inkSoft][i]}
              />
            );
          })}
        </svg>
      </ResultCard>
    </AbsoluteFill>
  );
};

const ResultCard: React.FC<{ x: number; p: number; title: string; sub: string; children: React.ReactNode }> = ({
  x,
  p,
  title,
  sub,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 905,
      width: 380,
      height: 300,
      borderRadius: 26,
      background: COLORS.card,
      boxShadow: "0 18px 44px rgba(22,22,26,0.12)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      opacity: Math.min(1, p * 1.4),
      transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})`,
    }}
  >
    {children}
    <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.ink, letterSpacing: -0.5 }}>{title}</div>
    <div style={{ fontSize: 26, fontWeight: 600, color: COLORS.inkSoft, marginTop: -6 }}>{sub}</div>
  </div>
);
