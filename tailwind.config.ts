import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/common/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'color-background': 'var(--color-background)',
        'color-foreground': 'var(--color-foreground)',
        'color-subtext': 'var(--color-subtext)',
        'color-border': 'var(--color-border)',
      },
    },
  },
  plugins: [],
} satisfies Config
