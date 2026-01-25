# Technology Stack

## Core Technologies
- **Framework**: Next.js 16 with App Router
- **Runtime**: React 19 with React Compiler enabled
- **Language**: TypeScript 5 (strict mode)
- **Database**: Supabase (PostgreSQL with SSR)
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest with jsdom + Testing Library
- **Icons**: Lucide React

## Build System & Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
```

### Product Management Scripts
```bash
node scripts/check-products.js                    # Check all product status
node scripts/update-product-images.js             # Update product images
node scripts/update-premium-images.js             # Update to premium images
node scripts/manage-product-images.js [command]   # Advanced image management
```

## Configuration Standards
- **Path Aliases**: Use `@/*` for `./src/*` imports
- **TypeScript**: Strict mode with bundler module resolution
- **Tailwind**: Custom Hebrew fonts (Heebo, Playfair Display, Montserrat)
- **Testing**: Global test setup with jsdom environment
- **Environment**: `.env.local` for local development secrets

## Database
- **Supabase Client**: Server-side rendering with `@supabase/ssr`
- **Migrations**: Located in `supabase/migrations/`
- **Types**: Auto-generated in `src/types/database.ts`

## Performance
- React Compiler enabled for automatic optimization
- Next.js 16 optimizations
- Tailwind CSS 4 performance improvements