/**
 * Markdown Formatter Module
 * 
 * Formats articles into Markdown with YAML frontmatter.
 * Validates: Requirements 5.1, 5.2, 5.3, 5.5, 7.1, 7.2, 7.3
 */

import type {
  InstagramPost,
  SEOMetadata,
  CategoryMapping,
  ExpandedContent,
  QASection,
  ArticleFrontmatter,
  FormattedArticle,
  ConversionStatistics,
} from './types';
import { SEO_KEYWORDS } from './seoGenerator';
import { CTA_PHRASES } from './contentExpander';

/**
 * Article separator for multiple articles in output
 */
export const ARTICLE_SEPARATOR = '\n\n---\n\n';

/**
 * Required frontmatter fields
 */
export const REQUIRED_FRONTMATTER_FIELDS = [
  'title',
  'slug',
  'meta_description',
  'tags',
  'category',
  'original_post_id',
  'image_url',
] as const;

/**
 * Formats frontmatter object to YAML string
 * 
 * @param frontmatter - The frontmatter object
 * @returns YAML formatted string
 */
export function formatFrontmatter(frontmatter: ArticleFrontmatter): string {
  const lines: string[] = [];
  
  // Title (quoted to handle special characters)
  lines.push(`title: "${escapeYamlString(frontmatter.title)}"`);
  
  // Slug
  lines.push(`slug: "${frontmatter.slug}"`);
  
  // Meta description (quoted)
  lines.push(`meta_description: "${escapeYamlString(frontmatter.meta_description)}"`);
  
  // Tags as YAML array
  lines.push('tags:');
  for (const tag of frontmatter.tags) {
    lines.push(`  - "${escapeYamlString(tag)}"`);
  }
  
  // Category
  lines.push(`category: "${frontmatter.category}"`);
  
  // Original post ID
  lines.push(`original_post_id: "${frontmatter.original_post_id}"`);
  
  // Image URL
  lines.push(`image_url: "${escapeYamlString(frontmatter.image_url)}"`);
  
  return lines.join('\n');
}

/**
 * Escapes special characters in YAML strings
 * 
 * @param str - String to escape
 * @returns Escaped string
 */
function escapeYamlString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}


/**
 * Builds the Markdown content body from expanded content and Q&A
 * 
 * @param expandedContent - The expanded article content
 * @param qaSection - Optional Q&A section
 * @returns Markdown formatted content string
 */
export function buildMarkdownContent(
  expandedContent: ExpandedContent,
  qaSection: QASection | null
): string {
  const parts: string[] = [];
  
  // Introduction
  parts.push(expandedContent.introduction);
  
  // Content sections with H2 headings
  for (const section of expandedContent.sections) {
    parts.push(`## ${section.heading}`);
    parts.push(section.content);
  }
  
  // Q&A section if present
  if (qaSection && qaSection.questions.length > 0) {
    parts.push('## שאלות ותשובות');
    
    for (const qa of qaSection.questions) {
      parts.push(`**שאלה:** ${qa.question}`);
      parts.push(`**תשובה:** ${qa.answer}`);
      parts.push(''); // Empty line between Q&A pairs
    }
  }
  
  // Conclusion
  parts.push('## לסיכום');
  parts.push(expandedContent.conclusion);
  
  return parts.join('\n\n');
}

/**
 * Formats a single article with frontmatter and content
 * 
 * @param post - Original Instagram post
 * @param seo - SEO metadata
 * @param category - Category mapping
 * @param expandedContent - Expanded content
 * @param qaSection - Optional Q&A section
 * @returns Formatted article object
 */
export function formatArticle(
  post: InstagramPost,
  seo: SEOMetadata,
  category: CategoryMapping,
  expandedContent: ExpandedContent,
  qaSection: QASection | null
): FormattedArticle {
  const frontmatter: ArticleFrontmatter = {
    title: seo.title,
    slug: seo.slug,
    meta_description: seo.metaDescription,
    tags: seo.tags,
    category: category.slug,
    original_post_id: post.id,
    image_url: post.image_url,
  };
  
  const content = buildMarkdownContent(expandedContent, qaSection);
  
  return { frontmatter, content };
}

/**
 * Formats a single article to complete Markdown string
 * 
 * @param article - Formatted article object
 * @returns Complete Markdown string with frontmatter
 */
export function formatSingleArticle(article: FormattedArticle): string {
  const frontmatterYaml = formatFrontmatter(article.frontmatter);
  return `---\n${frontmatterYaml}\n---\n\n${article.content}`;
}

/**
 * Formats multiple articles into a single output string
 * 
 * @param articles - Array of formatted articles
 * @returns Combined Markdown string with articles separated by "---"
 */
export function formatOutput(articles: FormattedArticle[]): string {
  if (articles.length === 0) {
    return '';
  }
  
  return articles
    .map(article => formatSingleArticle(article))
    .join(ARTICLE_SEPARATOR);
}


/**
 * Validates that frontmatter contains all required fields
 * 
 * @param frontmatter - Frontmatter object to validate
 * @returns true if all required fields are present and non-empty
 */
export function validateFrontmatter(frontmatter: ArticleFrontmatter): boolean {
  // Check title
  if (!frontmatter.title || frontmatter.title.trim().length === 0) {
    return false;
  }
  
  // Check slug
  if (!frontmatter.slug || frontmatter.slug.trim().length === 0) {
    return false;
  }
  
  // Check meta_description
  if (!frontmatter.meta_description || frontmatter.meta_description.trim().length === 0) {
    return false;
  }
  
  // Check tags (must have at least one)
  if (!frontmatter.tags || frontmatter.tags.length === 0) {
    return false;
  }
  
  // Check category
  if (!frontmatter.category || frontmatter.category.trim().length === 0) {
    return false;
  }
  
  // Check original_post_id
  if (!frontmatter.original_post_id || frontmatter.original_post_id.trim().length === 0) {
    return false;
  }
  
  // Check image_url
  if (!frontmatter.image_url || frontmatter.image_url.trim().length === 0) {
    return false;
  }
  
  return true;
}

/**
 * Checks if article content has proper structure
 * - Has introduction
 * - Has at least one H2 heading
 * - Has conclusion with CTA
 * 
 * @param content - Article content string
 * @returns true if structure is complete
 */
export function hasCompleteStructure(content: string): boolean {
  // Check for at least one H2 heading
  const hasH2 = /^## .+$/m.test(content);
  if (!hasH2) {
    return false;
  }
  
  // Check for conclusion section
  const hasConclusion = content.includes('## לסיכום');
  if (!hasConclusion) {
    return false;
  }
  
  // Check for CTA phrases in conclusion
  const conclusionMatch = content.match(/## לסיכום\s*\n\n([\s\S]*?)(?:$|(?=\n\n---))/);
  if (!conclusionMatch) {
    return false;
  }
  
  const conclusionText = conclusionMatch[1];
  const hasCTA = CTA_PHRASES.some(phrase => conclusionText.includes(phrase));
  
  return hasCTA;
}

/**
 * Checks if article content contains SEO keywords
 * 
 * @param content - Article content string
 * @returns true if at least one SEO keyword is present
 */
export function containsSEOKeywords(content: string): boolean {
  return SEO_KEYWORDS.some(keyword => content.includes(keyword));
}

/**
 * Parses frontmatter from a Markdown string
 * 
 * @param markdown - Complete Markdown string with frontmatter
 * @returns Parsed frontmatter object or null if invalid
 */
export function parseFrontmatter(markdown: string): ArticleFrontmatter | null {
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return null;
  }
  
  const yamlContent = frontmatterMatch[1];
  const result: Partial<ArticleFrontmatter> = {};
  
  // Parse simple key-value pairs
  const titleMatch = yamlContent.match(/^title:\s*"(.*)"/m);
  if (titleMatch) result.title = unescapeYamlString(titleMatch[1]);
  
  const slugMatch = yamlContent.match(/^slug:\s*"(.*)"/m);
  if (slugMatch) result.slug = slugMatch[1];
  
  const metaMatch = yamlContent.match(/^meta_description:\s*"(.*)"/m);
  if (metaMatch) result.meta_description = unescapeYamlString(metaMatch[1]);
  
  const categoryMatch = yamlContent.match(/^category:\s*"(.*)"/m);
  if (categoryMatch) result.category = categoryMatch[1];
  
  const postIdMatch = yamlContent.match(/^original_post_id:\s*"(.*)"/m);
  if (postIdMatch) result.original_post_id = postIdMatch[1];
  
  const imageMatch = yamlContent.match(/^image_url:\s*"(.*)"/m);
  if (imageMatch) result.image_url = unescapeYamlString(imageMatch[1]);
  
  // Parse tags array
  const tagsMatch = yamlContent.match(/^tags:\n((?:\s+-\s+".*"\n?)+)/m);
  if (tagsMatch) {
    const tagLines = tagsMatch[1].match(/- "(.*)"/g) || [];
    result.tags = tagLines.map(line => {
      const match = line.match(/- "(.*)"/);
      return match ? unescapeYamlString(match[1]) : '';
    }).filter(tag => tag.length > 0);
  }
  
  // Validate all required fields are present
  if (!result.title || !result.slug || !result.meta_description || 
      !result.tags || !result.category || !result.original_post_id || !result.image_url) {
    return null;
  }
  
  return result as ArticleFrontmatter;
}

/**
 * Unescapes YAML string special characters
 * 
 * @param str - Escaped string
 * @returns Unescaped string
 */
function unescapeYamlString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

/**
 * Counts articles in a formatted output string
 * 
 * @param output - Formatted output with multiple articles
 * @returns Number of articles
 */
export function countArticles(output: string): number {
  if (!output || output.trim().length === 0) {
    return 0;
  }
  
  // Count frontmatter opening markers (each article starts with ^--- at line start)
  // We need to count only the opening --- that starts a frontmatter block
  // Each article has format: ---\n{yaml}\n---\n\n{content}
  // Articles are separated by \n\n---\n\n
  
  // Split by article separator first
  const parts = output.split(ARTICLE_SEPARATOR);
  
  // Count parts that have valid frontmatter (start with ---)
  return parts.filter(part => part.trim().startsWith('---')).length;
}

/**
 * Generates conversion statistics
 * 
 * @param totalProcessed - Total posts processed
 * @param articlesGenerated - Number of articles generated
 * @param postsSkipped - Number of posts skipped
 * @returns ConversionStatistics object
 */
export function generateStatistics(
  totalProcessed: number,
  articlesGenerated: number,
  postsSkipped: number
): ConversionStatistics {
  return {
    totalProcessed,
    articlesGenerated,
    postsSkipped,
  };
}

/**
 * Validates statistics consistency
 * totalProcessed should equal articlesGenerated + postsSkipped
 * 
 * @param stats - Statistics to validate
 * @returns true if consistent
 */
export function validateStatistics(stats: ConversionStatistics): boolean {
  return stats.totalProcessed === stats.articlesGenerated + stats.postsSkipped;
}
