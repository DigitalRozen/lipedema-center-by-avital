# Implementation Plan: Premium Blog Article Page

## Overview

This plan implements a premium health magazine-style blog article page at `app/blog/[slug]/page.tsx`. The implementation uses Next.js 16 Server Components with Keystatic for content, custom Tailwind Typography styling for RTL Hebrew content, and follows the existing project patterns.

## Tasks

- [x] 1. Create the blog article page with data fetching
  - [x] 1.1 Create `app/blog/[slug]/page.tsx` as a Server Component
    - Import `getPostBySlug`, `getAllSlugs` from `@/lib/keystatic`
    - Implement `generateStaticParams()` to pre-render all posts
    - Implement main page component with async data fetching
    - Handle 404 case when post not found
    - _Requirements: 5.1, 5.3, 5.4, 5.5_

  - [x] 1.2 Implement `generateMetadata()` for SEO
    - Generate dynamic title with site name suffix
    - Include post description
    - Add Open Graph tags (title, description, type, image, locale)
    - Set canonical URL
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 2. Implement Hero Section components
  - [x] 2.1 Create Hero Section with category badge and title
    - Add back navigation link with RTL arrow (ArrowRight from lucide-react)
    - Render category badge with Hebrew label using `categoryLabels` map
    - Display title with `font-heading-hebrew` styling
    - _Requirements: 2.1, 2.2, 2.3, 7.5_

  - [x] 2.2 Add date and reading time display
    - Format date using Hebrew locale (`he-IL`)
    - Calculate reading time from content word count
    - Display in format "X דקות קריאה"
    - _Requirements: 2.5, 2.6_

  - [x] 2.3 Implement featured image with fallback
    - Display featured image with `rounded-2xl` and shadow
    - Implement `getFallbackImage()` function for category-based fallbacks
    - Use Next.js Image component with proper sizing
    - _Requirements: 2.7, 2.8, 2.9_

- [x] 3. Implement Content Body with custom prose styling
  - [x] 3.1 Create prose container with RTL overrides
    - Apply `prose prose-lg` base classes
    - Add custom CSS for RTL-specific styling in globals.css or inline
    - Style h2 with dusty-rose color
    - Set paragraph line-height to 1.8
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.9_

  - [x] 3.2 Add RTL-specific list and blockquote styling
    - Position list bullets/numbers on right side
    - Style blockquotes with right border instead of left
    - Style links with sage-green color and hover underline
    - Style images with rounded corners and shadow
    - _Requirements: 3.5, 3.6, 3.7, 3.8_

- [x] 4. Apply page layout and visual polish
  - [x] 4.1 Implement page container and layout
    - Set `max-w-3xl` centered container
    - Apply RTL direction (`dir="rtl"`)
    - Set cream background color
    - Add responsive padding
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 4.2 Add content card styling
    - Wrap content in white/cream card with rounded corners
    - Add subtle border and shadow
    - Apply backdrop blur for glass effect
    - _Requirements: 7.4_

- [x] 5. Checkpoint - Verify page renders correctly
  - Ensure the page renders with sample content
  - Verify RTL layout displays correctly
  - Check image fallbacks work
  - Test 404 state with invalid slug

- [-] 6. Add utility functions and tests
  - [x] 6.1 Create utility functions
    - Extract `calculateReadingTime()` function
    - Extract `getFallbackImage()` function
    - Add to `@/lib/blog/utils.ts` or inline in page
    - _Requirements: 2.6, 2.9_

  - [x] 6.2 Write property test for category mapping completeness

    - **Property 1: Category Mapping Completeness**
    - **Validates: Requirements 2.1, 2.9**

  - [x] 6.3 Write property test for reading time calculation

    - **Property 3: Reading Time Calculation**
    - **Validates: Requirements 2.6**

  - [x] 6.4 Write unit tests for page rendering

    - Test 404 renders for invalid slug
    - Test RTL direction is applied
    - Test back navigation link exists
    - _Requirements: 5.3, 1.2, 7.5_

- [x] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The page uses existing `getPostBySlug` and `getAllSlugs` from `@/lib/keystatic.ts`
- Category labels map already exists in `@/lib/keystatic.ts`
- Fallback images exist at `/assets/generated/` directory
- The `@tailwindcss/typography` plugin is already installed and configured
