# Posting kit: "Britain's new PM won under 25,000 votes."

## 3 alternative hook lines (A/B test; each replaces the frame-0 line, max 8 words)
1. **NOBODY ELECTED BRITAIN'S PRIME MINISTER. ON PURPOSE.** (contrarian; the "No vote for PM" section pays it off at 6 s)
2. **TO BECOME PM, HE NEEDED SOMEONE ELSE'S CHAIR.** (the premise first; re-hook 2 pays it off)
3. **HOW DO YOU QUIT AS AN MP? YOU CAN'T.** (specific question; the crown-tag payoff answers it, so the last frame should
   then ask it again instead of the voters question)

To test one, change the five hook rows in `src/scenes/burnham-pm/HookScene.tsx` and the first sentence in
`src/voiceover/burnham-pm.script.json`, regenerate the voice-over and the music (see CLAUDE.md), and re-check the length.
Keep each row inside x 120–960 (measure with fontTools, as in CLAUDE.md).

## Caption (5 hashtags)
Britain has a new prime minister, and only one town got to vote. How Andy Burnham went from "no seat" to No. 10 in a
game of musical chairs (watch the tag on the chair). 🇬🇧 #UKPolitics #AndyBurnham #PrimeMinister #LearnOnTikTok #Explained

## Pinned comment
Before you answer: this is the third PM in a row to arrive without a general election (Truss, Sunak, now Burnham), and
it's the third time Burnham ran for Labour leader (he lost in 2010 and 2015). The system says you vote for a party and
its MPs, not a person, so a swap mid-term is fair game. But if the person is the whole pitch, shouldn't the country get a
say? Would you force an election within six months of a new PM? 👇
