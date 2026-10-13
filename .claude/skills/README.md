# Project skills for motion videos

These skills are part of this repo, so every session on this repo can use them.
Claude loads them automatically. For a new video, just ask for it. `CLAUDE.md` ("Motion videos") says how to use them.

| Skill | What it does | Source | Licence |
|---|---|---|---|
| `educational-video-creator/` | Workflow for explainer videos: script, storyboard, visuals, audio, QA | [skindhu/skind-skills](https://github.com/skindhu/skind-skills) at `cda40dc` (copied from `skills/educational-video-creator`) | MIT |
| `remotion-best-practices/` | Rules for writing correct Remotion code (audio, transitions, timing, rendering) | [remotion-dev/skills](https://github.com/remotion-dev/skills) at `7ba4dcf` (copied from `skills/remotion-best-practices`) | See upstream repo |
| `xlsx/` | Creating and editing spreadsheets (used for the motion video brief) | Anthropic skill, from the user's account | See `xlsx/LICENSE.txt` |

Notes:
- `educational-video-creator` says to use a `remotion_video/` folder and edge-tts. Don't do that in this repo. Follow the overrides in `CLAUDE.md` instead.
- The upstream commit IDs above are the versions copied here. Check the upstream repos before updating.
