import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg:     '#0a0e1a',
          panel:  '#0f1629',
          border: '#1e2d4a',
          accent: '#00d4ff',
          green:  '#00ff88',
          yellow: '#ffd700',
          red:    '#ff4444',
          text:   '#e2e8f0',
          muted:  '#64748b',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
