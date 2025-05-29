import type { Config } from "tailwindcss";

import { heroui } from "@heroui/react";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [heroui(), require("@tailwindcss/typography")],
};

export default config;
