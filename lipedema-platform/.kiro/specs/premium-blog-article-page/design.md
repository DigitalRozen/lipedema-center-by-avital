# Design Document: Premium Blog Article Page

## Overview

This design document outlines the technical implementation for a premium health magazine-style blog article page. The page will be built as a Next.js 16 Server Component using the App Router, fetching content from Keystatic and rendering it with custom Tailwind Typography styling optimized for RTL Hebrew content.

The design prioritizes:
- **Readability**: Optimal line length (max-w-3xl), generous line-height (1.8), and comfortable font sizes
- **Visual Hierarchy**: Clear distinction between hero, content, and navigation elements
- **Brand Consistency**: Sage green, dusty rose, and cream color palette with spa-like aesthetics
- **Performance**: Server-side rendering with static generation for SEO and fast loading

## Architecture

```mermaid
graph TD
    A[app/blog/[slug]/page.tsx] --> B[getPostBySlug - Keystatic]
    A --> C[generateStaticParams]
    A --> D[generateMetadata]
    
    B --> E[MDX Content]
    B --> F[Post Metadata]
    
    A --> G[Hero Section]
    A --> H[Article Content]
    A --> I[Back Navigation]
    
    G --> J[Category Badge]
    G --> K[Title]
    G --> L[Date & Reading Time]
    G --> M[Featured Image]
    
    H --> N[Prose Container]
    N --> O[Custom RTL Styles]
    N --> P[MDX Renderer]
```

### Component Structure

```
app/blog/[slug]/
├── page.tsx          # Main Server Component
└── (components)      # Inline or extracted components
    ├── HeroSection   # Title, badge, image, metadata
    ├── ArticleBody   # Prose-styled content
    └── BackLink      # Navigation back to blog
```

## Components and Interfaces

### Page Component Interface

```typescript
// app/blog/[slug]/page.tsx

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

interface PostData {
  slug: string;
  title: string;
  date: string | null;
  description: string;
  image: string | null;
  category: 'diagnosis' | 'nutrition' | 'physical' | 'mindset';
  tags: readonly string[];
  originalPostId: string;
  content: React.ReactNode; // Rendered MDX
}
```

### Category Labels Map

```typescript
const categoryLabels: Record<string, string> = {
  diagnosis: 'אבחון',
  nutrition: 'תזונה',
  physical: 'טיפול פיזי',
  mindset: 'מיינדסט',
};
```

### Reading Time Calculator

```typescript
function calculateReadingTime(content: string): number {
  // Hebrew reading speed: ~200 words per minute
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}
```

## Data Models

### Keystatic Post Schema (existing)

```typescript
// From keystatic.config.ts - posts collection
{
  title: fields.text({ label: 'Title' }),
  date: fields.date({ label: 'Date' }),
  description: fields.text({ label: 'Description', multiline: true }),
  image: fields.image({ label: 'Featured Image' }),
  category: fields.select({
    label: 'Category',
    options: [
      { label: 'אבחון', value: 'diagnosis' },
      { label: 'תזונה', value: 'nutrition' },
      { label: 'טיפול פיזי', value: 'physical' },
      { label: 'מיינדסט', value: 'mindset' },
    ],
  }),
  tags: fields.array(fields.text({ label: 'Tag' })),
  originalPostId: fields.text({ label: 'Original Post ID' }),
  content: fields.mdx({ label: 'Content' }),
}
```

### Metadata Generation

```typescript
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return { title: 'מאמר לא נמצא' };
  }
  
  return {
    title: `${post.title} | אביטל רוזן - מומחית ליפאדמה`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      images: post.image ? [post.image] : [],
      locale: 'he_IL',
    },
  };
}
```

## UI Component Design

### Hero Section Layout

```
┌─────────────────────────────────────────────────────────┐
│  ← חזרה לבלוג                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐                                          │
│  │  תזונה   │  ← Category Badge (pill, sage bg)        │
│  └──────────┘                                          │
│                                                         │
│  הטעות הגדולה שכולן עושות                              │
│  עם ארוחת בוקר                                         │
│  ← Title (Frank Ruhl Libre, 3xl-5xl)                   │
│                                                         │
│  31 ביולי 2022  •  5 דקות קריאה                        │
│  ← Date & Reading Time (sage-500)                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │              Featured Image                     │   │
│  │           (rounded-2xl, shadow-lg)              │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Content Body Styling

```css
/* Custom prose overrides for RTL Hebrew */
.prose-rtl {
  /* Headings */
  h2 { color: var(--color-dusty-rose-600); }
  
  /* Paragraphs */
  p { line-height: 1.8; }
  
  /* Images */
  img { 
    border-radius: 0.75rem; /* rounded-xl */
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }
  
  /* Links */
  a { 
    color: var(--color-sage-600);
    text-decoration: none;
  }
  a:hover { text-decoration: underline; }
  
  /* Lists - RTL bullets on right */
  ul, ol { 
    padding-right: 1.5rem;
    padding-left: 0;
  }
  
  /* Blockquotes - border on right for RTL */
  blockquote {
    border-right: 4px solid var(--color-dusty-rose-300);
    border-left: none;
    padding-right: 1rem;
    padding-left: 0;
  }
}
```

### Tailwind Classes Structure

```tsx
// Page container
<div className="min-h-screen bg-[#FAFAF5]" dir="rtl">

// Hero section
<section className="py-12 md:py-16 lg:py-20">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    
    // Back link
    <Link className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-800 mb-8">
      <ArrowRight className="w-4 h-4" />
      <span>חזרה לבלוג</span>
    </Link>
    
    // Category badge
    <span className="inline-block px-4 py-1.5 rounded-full bg-sage-600 text-white text-sm font-medium mb-4">
      {categoryLabel}
    </span>
    
    // Title
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading-hebrew font-bold text-sage-900 mb-6 leading-tight">
      {title}
    </h1>
    
    // Metadata
    <div className="flex items-center gap-3 text-sage-500 text-sm mb-8">
      <time>{formattedDate}</time>
      <span>•</span>
      <span>{readingTime} דקות קריאה</span>
    </div>
    
    // Featured image
    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg mb-12">
      <Image src={image} alt={title} fill className="object-cover" />
    </div>
  </div>
</section>

// Content section
<section className="pb-16 md:pb-24">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <article className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-sm border border-sage-100">
      <div className="prose prose-lg prose-rtl max-w-none">
        {content}
      </div>
    </article>
  </div>
</section>
```

## Error Handling

### 404 Not Found State

```tsx
if (!post) {
  return (
    <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <h1 className="text-2xl font-heading-hebrew text-sage-900 mb-4">
          המאמר לא נמצא
        </h1>
        <p className="text-sage-600 mb-6">
          המאמר שחיפשת אינו קיים או הוסר
        </p>
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-800"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לבלוג
        </Link>
      </div>
    </div>
  );
}
```

### Image Fallback Strategy

```typescript
function getFallbackImage(category: string): string {
  const fallbacks: Record<string, string> = {
    nutrition: '/assets/generated/nutrition_fallback.png',
    physical: '/assets/generated/physical_fallback.png',
    diagnosis: '/assets/generated/diagnosis_fallback.png',
    mindset: '/assets/generated/mindset_fallback.png',
  };
  return fallbacks[category] || '/assets/generated/nutrition_fallback.png';
}
```

## Testing Strategy

### Unit Tests

Unit tests will verify individual utility functions:

1. **Reading time calculation**: Test that word count correctly maps to reading time
2. **Category label mapping**: Test Hebrew labels for all categories
3. **Date formatting**: Test Hebrew locale date formatting
4. **Fallback image selection**: Test category-to-image mapping

### Property-Based Tests

Property tests will verify universal behaviors:

1. **Reading time is always positive**: For any non-empty content, reading time > 0
2. **Category labels are always defined**: For any valid category, a Hebrew label exists
3. **Slug fetching consistency**: For any valid slug, fetching returns consistent data

### Integration Tests

Integration tests will verify the full page rendering:

1. **Page renders with valid slug**: Verify all sections appear
2. **404 renders for invalid slug**: Verify error state
3. **Metadata is generated correctly**: Verify SEO tags



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following properties have been identified for property-based testing:

### Property 1: Category Mapping Completeness

*For any* valid category value ('diagnosis', 'nutrition', 'physical', 'mindset'), both a Hebrew label and a fallback image path SHALL be defined and non-empty.

**Validates: Requirements 2.1, 2.9**

This property ensures that the category system is complete—no category can exist without proper Hebrew localization and visual fallback.

### Property 2: Date Formatting Consistency

*For any* valid Date object, formatting with Hebrew locale ('he-IL') SHALL produce a non-empty string containing Hebrew characters.

**Validates: Requirements 2.5**

This property ensures date formatting works correctly for all possible dates, not just specific examples.

### Property 3: Reading Time Calculation

*For any* non-empty content string, the calculated reading time SHALL be a positive integer greater than zero.

**Validates: Requirements 2.6**

This property ensures the reading time calculator never returns zero or negative values for valid content.

### Property 4: Post Fetching Consistency

*For any* slug that exists in the Keystatic posts collection, calling `getPostBySlug(slug)` SHALL return a post object with all required fields (title, category, content) defined.

**Validates: Requirements 5.1**

This property ensures data fetching is reliable and returns complete data for all existing posts.

### Property 5: Static Params Generation

*For any* post in the Keystatic collection, `generateStaticParams()` SHALL include that post's slug in the returned array.

**Validates: Requirements 5.5**

This property ensures all posts are included in static generation, preventing 404s for valid content.

### Property 6: Metadata Generation Completeness

*For any* valid post object, `generateMetadata()` SHALL return an object containing: title (non-empty string), description (non-empty string), openGraph.title, openGraph.description, and openGraph.type set to 'article'.

**Validates: Requirements 6.1, 6.2, 6.4**

This property ensures SEO metadata is complete for all posts, not just tested examples.

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests** (specific examples and edge cases):
- Rendering with valid post data
- 404 state for invalid slugs
- Image fallback when no featured image
- RTL-specific styling classes applied
- Back navigation link presence

**Property-Based Tests** (universal properties):
- Category mapping completeness
- Date formatting consistency
- Reading time calculation
- Post fetching consistency
- Static params generation
- Metadata generation completeness

### Property-Based Testing Configuration

- **Library**: fast-check (already installed in project)
- **Minimum iterations**: 100 per property test
- **Tag format**: `Feature: premium-blog-article-page, Property N: {property_text}`

### Test File Structure

```
src/app/blog/[slug]/
├── page.tsx
└── __tests__/
    ├── page.test.tsx           # Unit tests
    └── page.property.test.ts   # Property-based tests
```

### Example Property Test

```typescript
import fc from 'fast-check';
import { categoryLabels, getFallbackImage } from '../utils';

// Feature: premium-blog-article-page, Property 1: Category Mapping Completeness
describe('Category Mapping Completeness', () => {
  const validCategories = ['diagnosis', 'nutrition', 'physical', 'mindset'] as const;
  
  it('should have Hebrew label and fallback image for all categories', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...validCategories),
        (category) => {
          const label = categoryLabels[category];
          const fallback = getFallbackImage(category);
          
          return (
            typeof label === 'string' &&
            label.length > 0 &&
            typeof fallback === 'string' &&
            fallback.startsWith('/assets/')
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Examples

```typescript
import { render, screen } from '@testing-library/react';
import BlogPostPage from '../page';

describe('BlogPostPage', () => {
  it('renders 404 for invalid slug', async () => {
    const { container } = render(
      await BlogPostPage({ params: Promise.resolve({ slug: 'non-existent-post' }) })
    );
    
    expect(screen.getByText('המאמר לא נמצא')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /חזרה לבלוג/ })).toBeInTheDocument();
  });
  
  it('applies RTL direction to container', async () => {
    const { container } = render(
      await BlogPostPage({ params: Promise.resolve({ slug: 'valid-post' }) })
    );
    
    expect(container.firstChild).toHaveAttribute('dir', 'rtl');
  });
});
```
