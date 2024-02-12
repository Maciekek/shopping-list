import type { Config } from 'tailwindcss';
const { fontFamily } = require("tailwindcss/defaultTheme")

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    // transparent: 'transparent',
    // current: 'currentColor',
    container: {
      padding: '3rem',
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // light mode
        // tremor: {
        //   brand: {
        //     faint: '#eff6ff', // blue-50
        //     muted: '#bfdbfe', // blue-200
        //     subtle: '#60a5fa', // blue-400
        //     DEFAULT: '#3b82f6', // blue-500
        //     emphasis: '#1d4ed8', // blue-700
        //     inverted: '#ffffff' // white
        //   },
        //   background: {
        //     muted: '#f9fafb', // gray-50
        //     subtle: '#f3f4f6', // gray-100
        //     DEFAULT: '#ffffff', // white
        //     emphasis: '#374151' // gray-700
        //   },
        //   border: {
        //     DEFAULT: '#e5e7eb' // gray-200
        //   },
        //   ring: {
        //     DEFAULT: '#e5e7eb' // gray-200
        //   },
        //   content: {
        //     subtle: '#9ca3af', // gray-400
        //     DEFAULT: '#6b7280', // gray-500
        //     emphasis: '#374151', // gray-700
        //     strong: '#111827', // gray-900
        //     inverted: '#ffffff' // white
        //   }
        // }
      },
      boxShadow: {
        // light
        'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'tremor-card':
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'tremor-dropdown':
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      },
      borderRadius: {
        'tremor-small': '0.375rem',
        'tremor-default': '0.5rem',
        'tremor-full': '9999px'
      },
      fontSize: {
        'tremor-label': '0.75rem',
        'tremor-default': ['0.875rem', { lineHeight: '1.25rem' }],
        'tremor-title': ['1.125rem', { lineHeight: '1.75rem' }],
        'tremor-metric': ['1.875rem', { lineHeight: '2.25rem' }]
      }
    }
  },

  plugins: []
} satisfies Config;
