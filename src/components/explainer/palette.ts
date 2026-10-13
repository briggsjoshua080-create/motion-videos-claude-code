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
  /** Strong colour for warnings, "no" and majority lines (usually the flag's red). */
  alert: string;
  /** Flag stripes, top to bottom (or left to right for vertical flags). */
  flag: readonly string[];
  /** Vertical stripes (France, Italy, ...) instead of horizontal ones. */
  flagVertical?: boolean;
  /** Two soft background glows. */
  glows: readonly [string, string];
  skin: string;
  skinShade: string;
  white: string;
};
