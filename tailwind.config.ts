import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",         // App directory
    "./components/**/*.{ts,tsx}",  // Reusable components
    "./pages/**/*.{ts,tsx}",       // (if you're mixing Pages Router)
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)"
      },
    },
  },
  plugins: ['daisyui'],
  dai 
};

export default config;
