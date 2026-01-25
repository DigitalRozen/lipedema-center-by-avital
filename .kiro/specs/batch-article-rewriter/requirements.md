# Requirements Document

## Introduction

The Batch Article Rewriter is a content enhancement system for the lipedema-platform blog. The system identifies weak articles (< 500 words) and rewrites them into comprehensive, SEO-optimized Hebrew articles following Avital Rozen's authoritative voice and structured content methodology. This addresses the critical issue of 15 out of 20 blog posts being too short to provide value or rank in search engines.

## Glossary

- **Article_Scanner**: Component that analyzes MDX files in the content directory
- **Content_Analyzer**: Component that evaluates article quality based on word count and structure
- **Article_Rewriter**: Component that generates new comprehensive articles
- **Frontmatter_Manager**: Component that handles MDX metadata updates
- **Voice_Engine**: Component that ensures content matches Avital Rozen's tone and style
- **SEO_Optimizer**: Component that structures content for search engine optimization
- **Weak_Article**: Article with content length < 500 words
- **Target_Article**: Comprehensive article with 600+ words following proper structure
- **MDX_File**: Markdown file with JSX and frontmatter metadata
- **Content_Structure**: Five-part article format (Hook, Empathy, Science, Protocol, Bridge)

## Requirements

### Requirement 1: Article Discovery and Analysis

**User Story:** As a content manager, I want to automatically identify weak articles, so that I can prioritize which content needs rewriting.

#### Acceptance Criteria

1. WHEN the system scans the content/posts directory, THE Article_Scanner SHALL read all MDX files
2. WHEN an MDX file is read, THE Content_Analyzer SHALL extract the content body excluding frontmatter
3. WHEN content is extracted, THE Content_Analyzer SHALL count Hebrew words accurately
4. WHEN word count is calculated, THE Content_Analyzer SHALL classify articles as weak if word count < 500
5. WHEN classification is complete, THE Article_Scanner SHALL generate a report listing all weak articles with their current word counts and titles

### Requirement 2: Content Generation

**User Story:** As a content manager, I want weak articles rewritten into comprehensive pieces, so that they provide real value to readers and rank in search engines.

#### Acceptance Criteria

1. WHEN a weak article is selected for rewriting, THE Article_Rewriter SHALL generate content with minimum 600 words
2. WHEN generating content, THE Article_Rewriter SHALL follow the five-part Content_Structure (Hook, Empathy, Science, Protocol, Bridge)
3. WHEN writing the Hook section, THE Article_Rewriter SHALL start with emotional or physical reality the reader faces
4. WHEN writing the Empathy section, THE Article_Rewriter SHALL acknowledge the reader's struggle with genuine understanding
5. WHEN writing the Science section, THE Article_Rewriter SHALL explain medical mechanisms using accessible Hebrew medical vocabulary
6. WHEN writing the Protocol section, THE Article_Rewriter SHALL provide clear, actionable steps the reader can implement
7. WHEN writing the Bridge section, THE Article_Rewriter SHALL include natural transitions to product recommendations or clinic consultations
8. WHEN generating content, THE Article_Rewriter SHALL include H2 section headings in Hebrew
9. WHEN generating content, THE Article_Rewriter SHALL add a Q&A section with 3-5 common questions and answers
10. WHEN generating content, THE Article_Rewriter SHALL include 2-3 internal links to related articles

### Requirement 3: Voice and Tone Compliance

**User Story:** As Avital Rozen, I want all rewritten content to match my authoritative yet empathetic voice, so that readers trust the information and feel understood.

#### Acceptance Criteria

1. WHEN generating content, THE Voice_Engine SHALL use direct medical statements avoiding false hope
2. WHEN generating content, THE Voice_Engine SHALL balance scientific truth with emotional support
3. WHEN generating content, THE Voice_Engine SHALL avoid translationese (עברית מתורגמת) patterns
4. WHEN generating content, THE Voice_Engine SHALL use natural Hebrew sentence structures
5. WHEN medical terms are needed, THE Voice_Engine SHALL use specific Hebrew vocabulary (לימפה, בצקת, רקמה פיברוטית, דלקתיות, נוגדי חמצון, מערכת הלימפה)
6. WHEN addressing the reader, THE Voice_Engine SHALL use second person feminine singular (את, שלך)
7. WHEN providing advice, THE Voice_Engine SHALL be authoritative but approachable

### Requirement 4: Title Generation

**User Story:** As a content manager, I want compelling SEO-optimized titles, so that articles attract clicks and rank well in search results.

#### Acceptance Criteria

1. WHEN rewriting an article, THE Article_Rewriter SHALL generate a new Hebrew title
2. WHEN generating a title, THE Article_Rewriter SHALL make it descriptive and benefit-focused
3. WHEN generating a title, THE Article_Rewriter SHALL keep length between 40-60 characters
4. WHEN generating a title, THE Article_Rewriter SHALL include relevant keywords from the article category
5. WHEN generating a title, THE Article_Rewriter SHALL avoid clickbait or misleading phrasing

### Requirement 5: Metadata Management

**User Story:** As a content manager, I want article metadata preserved and updated correctly, so that the blog structure remains intact.

#### Acceptance Criteria

1. WHEN rewriting an article, THE Frontmatter_Manager SHALL preserve the original slug
2. WHEN rewriting an article, THE Frontmatter_Manager SHALL preserve the original date
3. WHEN rewriting an article, THE Frontmatter_Manager SHALL preserve the original category
4. WHEN rewriting an article, THE Frontmatter_Manager SHALL preserve the original image path
5. WHEN rewriting an article, THE Frontmatter_Manager SHALL preserve the originalPostId if present
6. WHEN rewriting an article, THE Frontmatter_Manager SHALL update the title field with the new title
7. WHEN rewriting an article, THE Frontmatter_Manager SHALL update the description field with a new 150-160 character summary
8. WHEN rewriting an article, THE Frontmatter_Manager SHALL update or add keywords array with 5-8 relevant Hebrew keywords

### Requirement 6: SEO Optimization

**User Story:** As a content manager, I want articles optimized for search engines, so that they rank well and attract organic traffic.

#### Acceptance Criteria

1. WHEN generating content, THE SEO_Optimizer SHALL structure content with proper heading hierarchy (H1 title, H2 sections)
2. WHEN generating content, THE SEO_Optimizer SHALL include the primary keyword in the first 100 words
3. WHEN generating content, THE SEO_Optimizer SHALL distribute keywords naturally throughout the content
4. WHEN generating content, THE SEO_Optimizer SHALL create descriptive meta descriptions between 150-160 characters
5. WHEN generating content, THE SEO_Optimizer SHALL include semantic variations of main keywords

### Requirement 7: Batch Processing

**User Story:** As a content manager, I want to process multiple articles efficiently, so that I can update the entire blog quickly.

#### Acceptance Criteria

1. WHEN batch processing is initiated, THE Article_Rewriter SHALL process articles sequentially
2. WHEN processing an article, THE Article_Rewriter SHALL log progress with article filename and status
3. WHEN an article rewrite fails, THE Article_Rewriter SHALL log the error and continue with remaining articles
4. WHEN batch processing completes, THE Article_Rewriter SHALL generate a summary report showing successful and failed rewrites
5. WHEN processing articles, THE Article_Rewriter SHALL create backup copies of original files before overwriting

### Requirement 8: Content Validation

**User Story:** As a content manager, I want rewritten articles validated before saving, so that only quality content is published.

#### Acceptance Criteria

1. WHEN content is generated, THE Content_Analyzer SHALL verify word count is >= 600 words
2. WHEN content is generated, THE Content_Analyzer SHALL verify all five Content_Structure sections are present
3. WHEN content is generated, THE Content_Analyzer SHALL verify at least 2 H2 headings exist
4. WHEN content is generated, THE Content_Analyzer SHALL verify Q&A section exists with at least 3 questions
5. WHEN content is generated, THE Content_Analyzer SHALL verify frontmatter contains all required fields
6. IF validation fails, THEN THE Article_Rewriter SHALL log validation errors and skip saving the file

### Requirement 9: File System Operations

**User Story:** As a content manager, I want safe file operations, so that original content is never lost accidentally.

#### Acceptance Criteria

1. WHEN rewriting begins, THE Article_Rewriter SHALL create a backup directory at content/posts/.backup
2. WHEN backing up an article, THE Article_Rewriter SHALL copy the original file with timestamp suffix
3. WHEN writing a new article, THE Article_Rewriter SHALL write to the original file path
4. WHEN a write operation fails, THE Article_Rewriter SHALL restore from backup
5. WHEN batch processing completes, THE Article_Rewriter SHALL keep backup files for manual review

### Requirement 10: Configuration and Control

**User Story:** As a content manager, I want to control the rewriting process, so that I can customize behavior for different scenarios.

#### Acceptance Criteria

1. THE Article_Rewriter SHALL accept a word count threshold parameter (default: 500)
2. THE Article_Rewriter SHALL accept a target word count parameter (default: 600)
3. THE Article_Rewriter SHALL accept a dry-run flag to preview changes without writing files
4. THE Article_Rewriter SHALL accept a specific article list to process instead of scanning all files
5. THE Article_Rewriter SHALL accept an output directory parameter for saving rewritten articles
