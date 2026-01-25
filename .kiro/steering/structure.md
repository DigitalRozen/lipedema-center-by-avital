# Project Structure

## Directory Organization

### Core Application (`src/`)
```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel routes
│   │   ├── import/        # Content import interface
│   │   ├── posts/         # Post management
│   │   ├── products/      # Product management
│   │   └── waitlist/      # Lead management
│   ├── knowledge/         # Knowledge hub pages
│   │   └── [slug]/        # Dynamic post pages
│   └── clinic/            # Clinic information page
├── components/            # Reusable React components
│   ├── layout/           # Header, Footer, Navigation
│   └── products/         # Product recommendation components
├── lib/                  # Business logic and utilities
│   ├── supabase/        # Database client configuration
│   ├── products/        # Product matching engine
│   ├── import/          # Content import logic
│   ├── analytics/       # Analytics service
│   └── i18n/            # Internationalization (Hebrew/English)
└── types/               # TypeScript type definitions
```

### Supporting Files
```
scripts/                 # Product management automation
supabase/migrations/     # Database schema changes
public/                  # Static assets (SVG icons)
```

## Naming Conventions
- **Files**: kebab-case for components, camelCase for utilities
- **Components**: PascalCase React components with `.tsx` extension
- **Pages**: Next.js App Router convention (`page.tsx`, `layout.tsx`)
- **Tests**: Co-located with `.test.tsx` or `.test.ts` suffix
- **Database**: snake_case for tables and columns

## Key Architectural Patterns
- **Server Components**: Default for data fetching pages
- **Client Components**: Only when interactivity needed (`'use client'`)
- **Barrel Exports**: Use index files for clean imports
- **Type Safety**: Strict TypeScript with database type generation
- **Testing**: Unit tests co-located with components/utilities

## Content Organization
- **Posts**: Hierarchical categories (diagnosis, nutrition, physical, mindset)
- **Products**: Type-based (Physical/Digital) with trigger tags
- **Analytics**: Event-based tracking for user interactions
- **Internationalization**: Hebrew RTL primary, English secondary