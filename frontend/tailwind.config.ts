import type { Config } from "tailwindcss";
import { theme } from "./src/lib/theme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: theme.colors,
      spacing: theme.spacing,
      fontFamily: theme.fontFamily,
      boxShadow: theme.boxShadow,
      borderRadius: theme.borderRadius,
    },
  },
  plugins: [],
};

export default config;
