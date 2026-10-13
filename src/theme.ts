// Inter is bundled locally (npm package) so renders work offline and never
// depend on a network font fetch. For other Google fonts see CLAUDE.md.
import "@fontsource-variable/inter";

export const theme = {
  colors: {
    bg: "#0b0f1a",
    bgAlt: "#131a2e",
    text: "#f5f7ff",
    muted: "#9aa4c7",
    accent: "#6c8cff",
    accent2: "#ff6ad5",
    accent3: "#ffd36c",
  },
  font: "'Inter Variable', Inter, system-ui, sans-serif",
} as const;
