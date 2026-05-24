import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563eb',
          blue2: '#1d4ed8',
          'blue-soft': '#dbeafe',
        },
        solar: {
          DEFAULT: '#f59e0b',
          2: '#fbbf24',
          deep: '#d97706',
          soft: '#fef3c7',
        },
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
