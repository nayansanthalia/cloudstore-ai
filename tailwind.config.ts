import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      /* ── Brand Color System ─────────────────────────────────────── */
      colors: {
        brandNavy: '#1F3753',
        brandSky: '#83E9FF',
        brandCoral: '#F79256',
        brandEmerald: '#0EC073',

        // Deep space background palette
        space: {
          950: '#F0F9FF', // Toned for light glassmorphism
          900: '#E0F2FE',
          800: '#BAE6FD',
          705: '#7DD3FC',
          700: '#7DD3FC',
          600: '#38BDF8',
          500: '#0EA5E9',
          400: '#0284C7',
          300: '#0369A1',
          200: '#075985',
          100: '#0C4A6E',
        },

        // Primary electric blue
        brand: {
          950: '#0A1628',
          900: '#0F2040',
          800: '#1A3A6E',
          700: '#1D4ED8',
          600: '#2563EB',
          500: '#3B82F6',
          400: '#60A5FA',
          300: '#93C5FD',
          200: '#BFDBFE',
          100: '#DBEAFE',
        },

        // Accent violet
        accent: {
          900: '#2E1065',
          800: '#4C1D95',
          700: '#6D28D9',
          600: '#7C3AED',
          500: '#8B5CF6',
          400: '#A78BFA',
          300: '#C4B5FD',
          200: '#DDD6FE',
          100: '#EDE9FE',
        },

        // Status colors
        emerald: {
          600: '#059669',
          500: '#10B981',
          400: '#34D399',
        },
        amber: {
          600: '#D97706',
          500: '#F59E0B',
          400: '#FBBF24',
        },
        rose: {
          600: '#E11D48',
          500: '#F43F5E',
          400: '#FB7185',
        },

        // Neutral text
        slate: {
          950: '#020617',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
      },

      /* ── Typography ─────────────────────────────────────────────── */
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', '"Inter"', '-apple-system', 'sans-serif'],
        display: ['"Helvetica Neue"', 'Helvetica', '"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },

      /* ── Spacing ────────────────────────────────────────────────── */
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },

      /* ── Border Radius ──────────────────────────────────────────── */
      borderRadius: {
        '2xs': '2px',
        xs: '4px',
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },

      /* ── Shadows ────────────────────────────────────────────────── */
      boxShadow: {
        'glow-sm': '0 0 8px rgba(37, 99, 235, 0.3)',
        'glow-md': '0 0 16px rgba(37, 99, 235, 0.4)',
        'glow-lg': '0 0 32px rgba(37, 99, 235, 0.5)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.4)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.6)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.5)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },

      /* ── Animations ─────────────────────────────────────────────── */
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(37, 99, 235, 0.3)' },
          '50%': { boxShadow: '0 0 24px rgba(37, 99, 235, 0.7)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },

      /* ── Transitions ────────────────────────────────────────────── */
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-in': 'cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      },

      /* ── Backdrop Blur ──────────────────────────────────────────── */
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },

      /* ── Background Size ────────────────────────────────────────── */
      backgroundSize: {
        '200%': '200% 200%',
        '300%': '300% 300%',
      },

      /* ── Z-index ────────────────────────────────────────────────── */
      zIndex: {
        '1': '1',
        '2': '2',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },

  plugins: [],
}

export default config