# Progress: "How Norway votes."

- [x] No questions asked, at the user's request (26 Oct 2026): recommended defaults picked and listed in `script.md`
  (red background, navy accents, navy subtitle pill; hook on vote weight Finnmark vs Oslo; ending on "the Storting can
  never be dissolved"; 2025 election as the worked example plus the new King)
- [x] Research, fact sheet in `script.md` (26 Oct 2026), including King Harald V's death (28 Aug 2026), confirmed on
  kongehuset.no, regjeringen.no and NRK
- [x] Narration measured (first draft 63.4 s, trimmed to 59.5 s of voice, 59.7 s total)
- [x] Voice-over (`src/voiceover/norwegian-election.*`), music (`public/audio/norwegian-election/music.mp3`, `--transpose -2`)
- [x] Composition `NorwegianElection` + scenes in `src/scenes/norwegian-election/`, typecheck passes
- [x] Stills checked: fixed the 18+ card text running into its divider, the ballot paper being clipped before the box,
  an oversized STAMPED mark, TOP-UP SEATS running off the right edge, the 4% label on top of another label, the 169
  counter over the seat dots, PRIME MINISTER too wide for its card, the King's date colliding with the name stamp, the
  ×1.9 stamp covering "per seat", the box round ON PAUSE? touching the line above
- [x] Final render: `out/norwegian-election-system.mp4`, 1080×1920, 30 fps, 59.7 s, −13.9 LUFS, sent to the user (26 Oct 2026)
