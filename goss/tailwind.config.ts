import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        customPurple: '#1b1a57',
        customBlueGray: '#4f5e7b',
        darkModePrimaryBackground: '#1D283B',
        darkModeSecondaryBackground: '#475569',
        darkModeThirdBackground: '#0EA5E9',
        darkModeHeader: '#E2E8F0',
        darkModeParaText: '#e9e9e9',
        darkModeDimText: '#C7C7C7',
        darkModePurpleBtn: '#7d1fc0',
        darkModePostBackground: '#77849A',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },
      },
      animation: {
        pulse: 'pulse 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
