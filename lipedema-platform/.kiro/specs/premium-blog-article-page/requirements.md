# Requirements Document

## Introduction

This feature redesigns the Single Blog Article Page (`app/blog/[slug]/page.tsx`) to look like a premium health magazine. The page will display Keystatic MDX content with a luxurious, spa-like aesthetic that matches the Lipedema Authority Platform brand. The design emphasizes readability, visual hierarchy, and a calming user experience for Hebrew-speaking women seeking medical information.

## Glossary

- **Blog_Article_Page**: The dynamic Next.js page component at `app/blog/[slug]/page.tsx` that renders individual blog posts
- **Prose_Container**: The Tailwind Typography plugin's styled container for rendering rich text content
- **Hero_Section**: The top section of the article containing category badge, title, metadata, and featured image
- **Content_Body**: The main article content area with custom prose styling for RTL Hebrew text
- **Category_Badge**: A styled label showing the article's category (diagnosis, nutrition, physical, mindset)
- **Reading_Time**: Estimated time to read the article based on word count
- **MDX_Content**: Markdown content with JSX support stored in Keystatic
- **RTL_Layout**: Right-to-left text direction for Hebrew content

## Requirements

### Requirement 1: Page Structure and Layout

**User Story:** As a reader, I want a clean, centered article layout, so that I can focus on the content without distractions.

#### Acceptance Criteria

1. THE Blog_Article_Page SHALL render with a maximum width of `max-w-3xl` (768px) centered on the page
2. THE Blog_Article_Page SHALL use RTL text direction (`dir="rtl"`) for Hebrew content
3. THE Blog_Article_Page SHALL have a cream/off-white background (`bg-[#FAFAF5]`) matching the site theme
4. THE Blog_Article_Page SHALL include responsive horizontal padding (16px mobile, 24px tablet, 32px desktop)

### Requirement 2: Hero Section Design

**User Story:** As a reader, I want an elegant hero section with the article title and image, so that I immediately understand what the article is about.

#### Acceptance Criteria

1. WHEN the page loads, THE Hero_Section SHALL display a Category_Badge with the article's category in Hebrew
2. THE Category_Badge SHALL use a pill shape with sage-green background and white text
3. THE Hero_Section SHALL display the article title using the `font-heading-hebrew` (Frank Ruhl Libre) font family
4. THE Hero_Section SHALL display the title at large sizes (text-3xl mobile, text-4xl tablet, text-5xl desktop)
5. WHEN the article has a date, THE Hero_Section SHALL display the formatted date in Hebrew locale
6. THE Hero_Section SHALL display the estimated Reading_Time in Hebrew (e.g., "5 דקות קריאה")
7. WHEN the article has a featured image, THE Hero_Section SHALL display it with rounded corners (`rounded-2xl`) and shadow
8. THE featured image SHALL span the full container width with aspect ratio 16:9 or 3:2
9. IF the article has no featured image, THEN THE Hero_Section SHALL display a category-appropriate fallback image

### Requirement 3: Content Body with Custom Prose Styling

**User Story:** As a reader, I want beautifully styled article content, so that I can read comfortably for extended periods.

#### Acceptance Criteria

1. THE Content_Body SHALL use Tailwind Typography's `prose` classes for base styling
2. THE Content_Body SHALL apply `prose-lg` for comfortable reading size
3. THE Prose_Container SHALL override h2 headings with dusty-rose accent color (`text-dusty-rose-600`)
4. THE Prose_Container SHALL set paragraph line-height to 1.8 for improved Hebrew readability
5. THE Prose_Container SHALL style images with `rounded-xl` corners and subtle shadow
6. THE Prose_Container SHALL style links with sage-green color (`text-sage-600`) and hover underline
7. THE Prose_Container SHALL position list bullets/numbers on the right side for RTL layout
8. THE Prose_Container SHALL style blockquotes with right border (instead of left) for RTL layout
9. THE Prose_Container SHALL use the Hebrew body font (`font-hebrew`) for paragraph text

### Requirement 4: Mobile Optimization

**User Story:** As a mobile reader, I want the article to be easy to read on my phone, so that I can access content anywhere.

#### Acceptance Criteria

1. THE Blog_Article_Page SHALL have adequate padding on mobile (minimum 16px horizontal)
2. THE Blog_Article_Page SHALL use responsive font sizes that scale appropriately for mobile screens
3. THE featured image SHALL maintain aspect ratio and not overflow on mobile screens
4. THE Content_Body SHALL have comfortable touch targets for links (minimum 44px tap area)

### Requirement 5: Data Fetching and Content Rendering

**User Story:** As a reader, I want the article content to load correctly, so that I can read the full article.

#### Acceptance Criteria

1. WHEN a valid slug is provided, THE Blog_Article_Page SHALL fetch the post data from Keystatic
2. THE Blog_Article_Page SHALL render the MDX_Content with proper formatting
3. IF the slug does not match any post, THEN THE Blog_Article_Page SHALL display a 404 message with link back to blog listing
4. THE Blog_Article_Page SHALL be a Server Component for optimal performance and SEO
5. THE Blog_Article_Page SHALL generate static params for all existing posts

### Requirement 6: SEO and Metadata

**User Story:** As a content creator, I want proper SEO metadata, so that articles rank well in search engines.

#### Acceptance Criteria

1. THE Blog_Article_Page SHALL generate dynamic metadata including title and description
2. THE Blog_Article_Page SHALL include Open Graph tags for social sharing
3. THE Blog_Article_Page SHALL include the article's featured image in OG metadata
4. THE Blog_Article_Page SHALL set the canonical URL for the article

### Requirement 7: Visual Polish and Brand Consistency

**User Story:** As a brand owner, I want the article page to match our premium spa aesthetic, so that readers trust our authority.

#### Acceptance Criteria

1. THE Blog_Article_Page SHALL use the brand color palette (sage, dusty-rose, cream)
2. THE Blog_Article_Page SHALL use smooth transitions and subtle hover effects
3. THE Hero_Section SHALL include decorative gradient overlays for visual depth
4. THE Content_Body SHALL have a white/cream card background with subtle border and shadow
5. THE Blog_Article_Page SHALL include a "back to blog" navigation link with appropriate RTL arrow icon
