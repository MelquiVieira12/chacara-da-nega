import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9f4",
          500: "#2f9e5c",
          600: "#25844c",
          700: "#1d6a3d"
        }
      }
    },
  },
  plugins: [],
};
export default config;
