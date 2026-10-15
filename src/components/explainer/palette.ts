/**
 * Colours for the white "explainer" look (the GermanElection style, reusable for any country).
 * Make one palette per video from the country's national colours; every explainer component
 * takes it as a prop, so no colour is hard-coded in the components.
 */
export type ExplainerPalette = {
  /** Page background (white). */
  paper: string;
  /** Slightly darker paper for vignettes and placeholders. */
  paperDeep: string;
  /** Card background. */
  card: string;
  /** Main text and dark shapes. */
  ink: string;
  /** Secondary text. */
  inkSoft: string;
  /** Inactive text and idle seats. */
  muted: string;
  /** Borders and dividers. */
  line: string;
  /** The national accent colour (e.g. Dutch orange, German gold). */
  accent: string;
  /** A darker accent that stays readable as text on white. */
  accentDeep: string;
  /** Text on accent fills, e.g. the header's step numbers and ticks (default: ink; use white on a dark accent). */
  onAccent?: string;
  /** Strong colour for warnings, "no" and majority lines (usually the flag's red). */
  alert: string;
  /** Flag stripes, top to bottom (or left to right for vertical flags). */
  flag: readonly string[];
  /** Vertical stripes (France, Italy, ...) instead of horizontal ones. */
  flagVertical?: boolean;
  /**
   * "eu": draw the EU flag (blue with a ring of 12 yellow stars; flag[0] = blue, accent = yellow)
   * instead of stripes, in the header chip, the top bar and the parliament icon.
   * "uk": draw the Union flag (flag = [blue, white, red]) the same way.
   * "nordic": draw a Nordic cross flag (flag = [field, cross], e.g. Denmark's red with a white cross).
   */
  emblem?: "eu" | "uk" | "nordic";
  /** Two soft background glows. */
  glows: readonly [string, string];
  skin: string;
  skinShade: string;
  white: string;
};
