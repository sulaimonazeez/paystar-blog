import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#FF5B2E',
          light: '#FF7A50',
          dark: '#E04020',
        },
        dark: {
          DEFAULT: '#0A0A0F',
          card: '#111118',
          card2: '#16161F',
          border: 'rgba(255,255,255,0.07)',
          border2: 'rgba(255,255,255,0.12)',
        },
        text: {
          DEFAULT: '#F0EEF5',
          muted: '#7A7890',
          dim: '#4A4860',
        },
        green: '#22D882',
        blue: '#4B9EFF',
        purple: '#9B6DFF',
        gold: '#FFB830',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm-sans)', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#C0BDD0',
            '--tw-prose-headings': '#F0EEF5',
            '--tw-prose-links': '#FF5B2E',
            '--tw-prose-bold': '#F0EEF5',
            '--tw-prose-counters': '#7A7890',
            '--tw-prose-bullets': '#7A7890',
            '--tw-prose-hr': 'rgba(255,255,255,0.07)',
            '--tw-prose-quotes': '#F0EEF5',
            '--tw-prose-quote-borders': '#FF5B2E',
            '--tw-prose-captions': '#7A7890',
            '--tw-prose-code': '#FF7A50',
            '--tw-prose-pre-code': '#F0EEF5',
            '--tw-prose-pre-bg': '#16161F',
            '--tw-prose-th-borders': 'rgba(255,255,255,0.12)',
            '--tw-prose-td-borders': 'rgba(255,255,255,0.07)',
          },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
