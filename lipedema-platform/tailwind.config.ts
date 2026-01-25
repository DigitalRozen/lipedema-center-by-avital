import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}", // Crucial: Scan content files
  ],
  theme: {
    extend: {
      fontFamily: {
        hebrew: ['Heebo', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        body: ['Montserrat', 'sans-serif'],
        'heading-hebrew': ['Frank Ruhl Libre', 'serif'],
        'heading-english': ['Cinzel Decorative', 'serif'],
      },
      colors: {
        brand: {
          rose: '#C08B8B',       // Deep Rose Gold (for headings)
          blush: '#FFF5F5',      // Very light pink (backgrounds)
          sage: '#E2E8F0',       // Soft neutral (borders)
          text: '#4A5568',       // Softer dark gray (easier on eyes)
          accent: '#D6BCFA',     // Soft lavender for links
          cream: '#FFFBF7',      // Warm cream background
          peach: '#FFE4E1',      // Soft peach for highlights
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#4A5568',
            lineHeight: '2',
            fontSize: '1.125rem',
            h1: { 
              color: '#C08B8B',
              fontFamily: 'Frank Ruhl Libre, serif',
              fontWeight: '700',
              letterSpacing: '-0.02em',
            },
            h2: { 
              color: '#C08B8B', 
              marginTop: '2em',
              marginBottom: '1em',
              fontFamily: 'Frank Ruhl Libre, serif',
              fontWeight: '600',
              borderBottom: '1px solid #FFE4E1',
              paddingBottom: '0.75rem',
            },
            h3: { 
              color: '#4A5568', 
              marginTop: '1.75em',
              marginBottom: '0.75em',
              fontFamily: 'Frank Ruhl Libre, serif',
              fontWeight: '600',
            },
            h4: {
              color: '#4A5568',
              fontFamily: 'Frank Ruhl Libre, serif',
              fontWeight: '500',
            },
            strong: { 
              color: '#C08B8B',
              fontWeight: '600',
            },
            a: { 
              color: '#D6BCFA', 
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: '#C08B8B',
              },
            },
            blockquote: {
              borderLeftWidth: '0',
              borderRightWidth: '3px',
              borderRightColor: '#C08B8B',
              paddingRight: '1.5rem',
              paddingLeft: '0',
              fontStyle: 'italic',
              color: '#718096',
              backgroundColor: '#FFF5F5',
              borderRadius: '0 0.75rem 0.75rem 0',
              padding: '1.25rem 1.5rem 1.25rem 0',
            },
            'ul > li::marker': { 
              color: '#C08B8B',
            },
            'ol > li::marker': { 
              color: '#C08B8B',
            },
            li: {
              marginBottom: '0.75em',
              lineHeight: '1.9',
            },
            img: {
              borderRadius: '1rem',
              boxShadow: '0 4px 20px rgba(192, 139, 139, 0.15)',
            },
            hr: {
              borderColor: '#FFE4E1',
              opacity: '0.5',
            },
            code: {
              backgroundColor: '#FFF5F5',
              color: '#4A5568',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              fontWeight: '400',
              fontSize: '0.9em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;
