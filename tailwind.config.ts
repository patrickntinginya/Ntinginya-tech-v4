import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces
        mist: "#EAF0E9",
        paper: "#F8FAF6",
        sage: "#D9E4D8",
        // Deep Indian-Ocean teal used for text and dark surfaces
        deep: { DEFAULT: "#0A2A30", 800: "#0F3A42", 700: "#16505A" },
        // Field green: agriculture
        field: {
          100: "#DCEEE2",
          300: "#9AD3B0",
          500: "#3A9A62",
          600: "#2A7A4B",
          700: "#1F5F3A",
          800: "#164A2D",
        },
        // Maize: the single warm accent
        maize: { 300: "#FAD25C", 400: "#F5B700", 500: "#DB9F00", 700: "#7A5600" },
      },
      // Design tokens: change the CSS variables in src/app/globals.css to restyle the whole site.
      borderRadius: {
        card: "var(--radius-card)",
        control: "var(--radius-control)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
      },
      transitionDuration: {
        base: "var(--duration-base)",
      },
      transitionTimingFunction: {
        brand: "var(--ease-brand)",
      },
      fontFamily: {
        sans: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-body)", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
