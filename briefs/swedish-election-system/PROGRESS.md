# Progress: "How Sweden votes."

- [x] Studied the user's reference video `belgian-elections-explained.mp4` (1920×1080, 60 fps, 60 s, music only, black/yellow/red); the user set the rule: use the country's flag colours (Belgium's is only dark because its flag is black)
- [x] Questions answered (19 Oct 2026): vertical 9:16, AI narrator + subtitles, about 60 s, 2022 as the worked example plus a 2026 note, title "HOW SWEDEN VOTES.", closing question "Should a PM need a YES vote?", yellow subtitle pill, short seat maths
- [x] Research on official sites, fact sheet in `script.md` (19 Oct 2026; 2026 talks re-checked 23 Oct 2026)
- [x] Narration measured (first draft 64.4 s, trimmed to 58.6 s) and approved by the user with the scene plan
- [x] Voice-over (`src/voiceover/swedish-election.*`), music (`public/audio/swedish-election/music.mp3`, `--transpose 2`)
- [x] Fonts bundled (`@fontsource/archivo-black`, `instrument-serif`, `jetbrains-mono` 5.3.0), loaded before rendering (`fonts.ts`)
- [x] Composition `SwedishElection` + scenes in `src/scenes/swedish-election/`, typecheck passes
- [x] Stills checked (frame 0 shows the title and frame; every scene's key moment); fixed a green tint from a yellow glow on blue, the hook line wrapping into the strip, the bottom label running into the ruler, ballot step text past x 960, the Riksdag aside touching the half-circle, the "175 NO = OUT" label under the stamp, and the 2026 note showing too late
- [x] First full render checked frame by frame (1080×1920, 30 fps, 59.78 s, −13.9 LUFS): fixed the 2022 party list not fading (it showed through Ulf Kristersson's card and during the wipe out) and made the paper wipes' yellow band enter at once
- [ ] Final render: `out/swedish-election-system.mp4`, checked (size, fps, duration, loudness) and sent to the user
