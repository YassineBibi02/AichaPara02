import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(220 13% 91%)",
        input: "hsl(220 13% 91%)",
        ring: "hsl(346.8 77.2% 49.8%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(224 71% 4%)",
        text: {
          primary: "hsl(224 71% 4%)",
          secondary: "hsl(220 9% 46%)",
          muted: "hsl(220 14% 96%)",
        },
        primary: {
          DEFAULT: "hsl(346.8 77.2% 49.8%)",
          foreground: "hsl(355.7 100% 97.3%)",
        },
        secondary: {
          DEFAULT: "hsl(220 14% 96%)",
          foreground: "hsl(224 71% 4%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(220 14% 96%)",
          foreground: "hsl(220 9% 46%)",
        },
        accent: {
          DEFAULT: "hsl(220 14% 96%)",
          foreground: "hsl(224 71% 4%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 84% 4.9%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 84% 4.9%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;