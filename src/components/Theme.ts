type Colors =
  | "purple"
  | "red"
  | "blue"
  | /* "yellow" | */ "green"
  | "pink"
  | "coral"
  | "teal"
  | "rust"
  | "cerulean"
  | "fuchsia"
  | "Indigo"
  | "Emerald"
  | "Rose"
  | "Sky"
  | "Amber"
  | "Violet"
  | "Fuchsia"
  | "Lime"
  | "Cyan";

export const ThemeColors: { [_ in Colors]: string } = {
  purple: "#7c5cff",
  blue: "#0066ff",
  green: "#24b158",
  red: "#f1003c",
  // yellow: "#f2f700",
  pink: "#ff3e88",
  coral: "#FF6B6B",
  teal: "#008080",
  rust: "#B7410E",
  cerulean: "#007BA7",
  fuchsia: "#FF00FF",
  Indigo: "#4F46E5",
  Emerald: "#10B981",
  Rose: "#F43F5E",
  Amber: "#F59E0B",
  Sky: "#0EA5E9",
  Violet: "#8B5CF6",
  Fuchsia: "#D946EF",
  Lime: "#84CC16",
  Cyan: "#06B6D4",
};
