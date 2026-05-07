import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:         '#0E1020',
        'primary-surface': '#1a1d30',
        'sidebar-bg':    '#080a14',
        accent:          '#FF7E51',
        'accent-light':  '#FFA962',
        'accent-warm':   '#FFB87E',
        blue:            '#6399F0',
        mauve:           '#B88A99',
        green:           '#00a864',
        bg:              '#F6F3F0',
        'bg-alt':        '#EDEBE8',
        'bg-dark':       '#0E1020',
        text:            '#0E1020',
        'text-mid':      '#44445a',
        'text-light':    '#6b6b80',
        border:          '#e2e0dc',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['"GT Standard"', 'Epilogue', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        sm:      '6px',
        lg:      '18px',
        xl:      '18px',
        '2xl':   '18px',
      },
      maxWidth: {
        site: '1320px',
      },
      width: {
        sidebar: '280px',
      },
      spacing: {
        sidebar: '280px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(14,16,32,.06)',
        md: '0 4px 20px rgba(14,16,32,.10)',
      },
    },
  },
  plugins: [],
}

export default config
