# Progress: "How the US votes."

- [x] Questions answered (23 Oct 2026): President + Congress with 2024 as the example and a dated 2026 midterms note, title "HOW THE US VOTES.", closing question "Should the candidate with the most votes always win?", navy background with red accents and the standard red subtitle pill; the rest per the standing brief and the Swedish look
- [x] Research on official sites, fact sheet in `script.md` (23 Oct 2026)
- [x] Narration measured (first draft 60.0 s to the last word, trimmed to 58.7 s) and approved by the user with the scene plan; the dated midterms line kept at the user's choice
- [x] Voice-over (`src/voiceover/us-election.*`), music (`public/audio/us-election/music.mp3`, `--transpose 2`)
- [x] Composition `USElection` + scenes in `src/scenes/us-election/` (tile map of the 50 states + DC in `TileMap.tsx`), typecheck passes
- [x] Draft renders checked frame by frame: fixed headlines running past x 960 (ballot, Electoral College, President), the House half-circle touching the job pills, the hook box squeezing its neighbours, text overflowing the "who can vote" cards, Harris's score showing 0 early, the inauguration line crowding the score, the long section label running into the ruler, and two notes appearing too late
- [x] Final render: `out/us-election-system.mp4`, 1080×1920, 30 fps, 59.9 s, −13.9 LUFS (peak −2.6 dBFS), sent to the user (23 Oct 2026)
- [ ] After 3 Nov 2026: update the midterms note (`MIDTERMS` in `constants.ts`) and re-render if the video is reused
