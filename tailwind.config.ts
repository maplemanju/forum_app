import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
export default {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-noto-sans)',
          'var(--font-noto-sans-jp)',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      colors: {
        'color-background': 'var(--color-background)',
        'color-background-secondary': 'var(--color-background-secondary)',
        'color-background-tertiary': 'var(--color-background-tertiary)',
        'color-foreground': 'var(--color-foreground)',
        'color-subtext': 'var(--color-subtext)',
        'color-border': 'var(--color-border)',
        'color-primary': 'var(--color-primary)',
        'color-primary-hover': 'var(--color-primary-hover)',
        'color-gray': 'var(--color-gray)',
        'color-gray-hover': 'var(--color-gray-hover)',
        'color-danger': 'var(--color-danger)',
        'color-danger-hover': 'var(--color-danger-hover)',
        'color-neutral': 'var(--color-neutral)',
        'color-neutral-hover': 'var(--color-neutral-hover)',
        'color-overlay': 'var(--color-overlay)',
      },
    },
  },
  plugins: [],
} satisfies Config
