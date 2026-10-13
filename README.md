# motion-videos-claude-code

Programmatic motion graphics with [Remotion](https://www.remotion.dev) (4.0.535), set up for AI coding agents.
See `CLAUDE.md` for the agent guide.

```bash
npm install          # once
npm run studio       # live preview at http://localhost:3000
npm run render       # -> out/sample-showcase.mp4  (1920x1080, 30 fps)
```

Change resolution, fps and duration in `src/config.ts`. Register new videos in `src/Root.tsx`.
