import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      'source-sans3-regular': ['Source-Sans3-Regular', 'sans-serif'],
      'source-sans3-medium': ['Source-Sans3-Medium', 'sans-serif'],
      'source-sans3-bold': ['Source-Sans3-Bold', 'sans-serif'], 
    },
    screens: {
      'tablet': '480px',
      'ultrawide': '1400px',
    },
    extend: {
      padding: {
        'commonPadding': '1.5rem',
      },
      colors: {
        'borderWhite': 'rgba(255, 255, 255, 0.1)',
      },
      gridTemplateColumns: {
        'clientLayout': '1fr 20fr',
      }
    },
  },
  plugins: [],
};
export default config;
