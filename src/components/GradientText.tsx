import React from "react";
import { theme } from "../theme";

/** Text filled with the accent gradient. */
export const GradientText: React.FC<{ children: React.ReactNode; fontSize?: number }> = ({
  children,
  fontSize = 48,
}) => (
  <span
    style={{
      fontFamily: theme.font,
      fontSize,
      fontWeight: 600,
      background: `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.accent2})`,
      WebkitBackgroundClip: "text",
      color: "transparent",
    }}
  >
    {children}
  </span>
);
