/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background, #F8FAFC)',
        foreground: 'var(--foreground, #0F172A)',
        card: {
          DEFAULT: 'var(--card, #FFFFFF)',
          foreground: 'var(--card-foreground, #0F172A)',
        },
        muted: {
          DEFAULT: 'var(--muted, #F1F5F9)',
          foreground: 'var(--muted-foreground, #64748B)',
        },
        border: 'var(--border, #E2E8F0)',
        primary: {
          DEFAULT: '#6366F1', // Indigo / Studio
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#10B981', // Emerald / Wallet
          foreground: '#FFFFFF',
        },
        accent: {
          violet: '#6366F1',
          emerald: '#10B981',
          amber: '#F59E0B',
          cyan: '#06B6D4',
          rose: '#F43F5E',
        },
      },
      borderRadius: {
        lg: 'var(--radius, 0.5rem)',
        md: 'calc(var(--radius, 0.5rem) - 2px)',
        sm: 'calc(var(--radius, 0.5rem) - 4px)',
      },
    },
  },
  plugins: [],
};
