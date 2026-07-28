import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#173404',
          dark: '#0e2202',
          light: '#234a08',
          card: '#1b3b05'
        },
        limeAccent: {
          DEFAULT: '#C0DD97',
          light: '#EAF3DE',
          vibrant: '#90C749',
          border: '#A9D178'
        },
        bgCanvas: '#F7F9F4',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
};
export default config;
