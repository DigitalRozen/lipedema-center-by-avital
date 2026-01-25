# Design Document: Batch Article Rewriter

## Overview

The Batch Article Rewriter is a Node.js-based content enhancement system that transforms weak blog articles into comprehensive, SEO-optimized Hebrew content. The system operates as a command-line tool that scans MDX files, identifies articles below quality thresholds, and rewrites them using AI-powered content generation while maintaining Avital Rozen's distinctive voice and the platform's content structure standards.

The system processes articles in batch mode with safety mechanisms (backups, validation) and generates detailed reports. It integrates with the existing Next.js blog structure, preserving metadata and file organization while dramatically improving content quality and SEO performance.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     CLI Interface                            │
│  (Command-line entry point with configuration)               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  Batch Processor                             │
│  (Orchestrates scanning, analysis, rewriting, validation)    │
└─┬───────────┬──────────────┬──────────────┬────────────────┘
  │           │              │              │
  ▼           ▼              ▼              ▼
┌──────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐
│Article│  │Content   │  │Article   │  │File System   │
│Scanner│  │Analyzer  │  │Rewriter  │  │Manager       │
└───────┘  └──────────┘  └──────────┘  └──────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  AI Content      │
                    │  Generator       │
                    │  (OpenAI API)    │
                    └──────────────────┘
```

### Component Responsibilities

**CLI Interface**
- Parse command-line arguments and configuration
- Initialize batch processor with parameters
- Display progress and final reports

**Batch Processor**
- Orchestrate the complete rewriting workflow
- Manage sequential article processing
- Handle errors and generate summary reports
- Coordinate between all components

**Article Scanner**
- Traverse content/posts directory
- Read and parse MDX files
- Extract frontmatter and content body
- Build article inventory

**Content Analyzer**
- Count Hebrew words accurately
- Classify articles as weak/strong based on thresholds
- Validate content structure and completeness
- Verify SEO requirements

**Article Rewriter**
- Generate comprehensive article content using AI
- Apply Avital Rozen's voice and tone
- Structure content following the five-part template
- Generate SEO-optimized titles and descriptions
- Add Q&A sections and internal links

**File System Manager**
- Create backup copies before modifications
- Write updated MDX files safely
- Restore from backup on failures
- Manage backup directory structure

**AI Content Generator**
- Interface with OpenAI API
- Construct prompts with voice guidelines and structure
- Parse and format AI responses
- Handle API errors and retries

## Components and Interfaces

### Article Scanner

```typescript
interface ArticleScanner {
  scanDirectory(path: string): Promise<ArticleInventory>
  readMDXFile(filePath: string): Promise<MDXArticle>
}

interface ArticleInventory {
  articles: MDXArticle[]
  totalCount: number
  weakArticles: MDXArticle[]
  strongArticles: MDXArticle[]
}

interface MDXArticle {
  filePath: string
  slug: string
  frontmatter: ArticleFrontmatter
  content: string
  wordCount: number
}

interface ArticleFrontmatter {
  title: string
  description: string
  date: string
  category: 'nutrition' | 'diagnosis' | 'physical' | 'mindset'
  image: string
  keywords: string[]
  originalPostId?: string
}
```

### Content Analyzer

```typescript
interface ContentAnalyzer {
  countWords(text: string): number
  classifyArticle(article: MDXArticle, threshold: number): ArticleClassification
  validateContent(content: string, frontmatter: ArticleFrontmatter): ValidationResult
}

interface ArticleClassification {
  isWeak: boolean
  wordCount: number
  threshold: number
}

interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
}
```

### Article Rewriter

```typescript
interface ArticleRewriter {
  rewriteArticle(article: MDXArticle, config: RewriteConfig): Promise<RewrittenArticle>
  generateTitle(article: MDXArticle): Promise<string>
  generateDescription(content: string): Promise<string>
  generateKeywords(content: string, category: string): Promise<string[]>
}

interface RewriteConfig {
  targetWordCount: number
  includeQA: boolean
  internalLinksCount: number
  voiceGuidelines: VoiceGuidelines
}

interface VoiceGuidelines {
  tone: string[]
  medicalVocabulary: string[]
  avoidPatterns: string[]
  structureTemplate: ContentStructure
}

interface ContentStructure {
  hook: string
  empathy: string
  science: string
  protocol: string
  bridge: string
}

interface RewrittenArticle {
  frontmatter: ArticleFrontmatter
  content: string
  wordCount: number
  metadata: RewriteMetadata
}

interface RewriteMetadata {
  originalWordCount: number
  newWordCount: number
  sectionsGenerated: string[]
  qaCount: number
  internalLinksCount: number
  timestamp: Date
}
```

### File System Manager

```typescript
interface FileSystemManager {
  createBackup(filePath: string): Promise<string>
  writeArticle(filePath: string, article: RewrittenArticle): Promise<void>
  restoreFromBackup(filePath: string, backupPath: string): Promise<void>
  cleanupBackups(keepRecent: number): Promise<void>
}

interface BackupInfo {
  originalPath: string
  backupPath: string
  timestamp: Date
}
```

### AI Content Generator

```typescript
interface AIContentGenerator {
  generateContent(prompt: ContentPrompt): Promise<string>
  generateTitle(context: TitleContext): Promise<string>
  generateQA(content: string, count: number): Promise<QAPair[]>
}

interface ContentPrompt {
  originalContent: string
  category: string
  targetWordCount: number
  voiceGuidelines: VoiceGuidelines
  structureTemplate: ContentStructure
}

interface TitleContext {
  originalTitle: string
  content: string
  category: string
  keywords: string[]
}

interface QAPair {
  question: string
  answer: string
}
```

### Batch Processor

```typescript
interface BatchProcessor {
  process(config: BatchConfig): Promise<BatchResult>
}

interface BatchConfig {
  contentDirectory: string
  weakThreshold: number
  targetWordCount: number
  dryRun: boolean
  specificArticles?: string[]
  outputDirectory?: string
}

interface BatchResult {
  totalProcessed: number
  successful: number
  failed: number
  skipped: number
  articles: ArticleResult[]
  duration: number
}

interface ArticleResult {
  filePath: string
  status: 'success' | 'failed' | 'skipped'
  originalWordCount: number
  newWordCount: number
  error?: string
}
```

## Data Models

### MDX File Structure

```markdown
---
title: "Article Title in Hebrew"
description: "150-160 character description"
date: "2024-01-15"
category: "nutrition"
image: "/images/blog/article-slug.jpg"
keywords: ["keyword1", "keyword2", "keyword3"]
originalPostId: "3686588726855817475"
---

# Article Title

## Hook Section
[Emotional/physical reality content...]

## Empathy Section
[Validation and understanding content...]

## Science Section
[Medical explanation content...]

## Protocol Section
[Actionable steps content...]

## Bridge Section
[Call to action content...]

## שאלות ותשובות נפוצות

### Question 1?
Answer 1...

### Question 2?
Answer 2...
```

### Hebrew Word Counting Rules

Hebrew word counting must handle:
- Hebrew characters (א-ת)
- Nikud (vowel points) - should be ignored
- Punctuation - should be treated as word separators
- Numbers in Hebrew or Arabic numerals
- Mixed Hebrew-English text
- Whitespace variations

Word boundary definition:
```typescript
// A word is a sequence of Hebrew letters (with optional nikud)
// separated by whitespace or punctuation
const HEBREW_WORD_REGEX = /[\u0590-\u05FF]+/g
```

### Content Structure Template

Each article follows this five-part structure:

1. **Hook (פתיחה)**: 100-150 words
   - Start with pain point or emotional reality
   - Example: "הרגליים שלך מרגישות כבדות בסוף היום?"

2. **Empathy (הזדהות)**: 100-150 words
   - Validate the reader's experience
   - Example: "אני יודעת בדיוק איך זה מרגיש..."

3. **Science (המדע)**: 150-200 words
   - Explain the medical mechanism
   - Use proper Hebrew medical terms
   - Example: "מערכת הלימפה שלך אחראית על..."

4. **Protocol (פרוטוקול)**: 150-200 words
   - Provide actionable steps
   - Numbered or bulleted list
   - Example: "1. התחילי עם תנועה עדינה..."

5. **Bridge (גשר)**: 50-100 words
   - Natural transition to products/consultation
   - Example: "אם את רוצה ללמוד עוד..."

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Complete Directory Scanning

*For any* valid content directory, scanning should return all MDX files present in the directory without omissions or duplicates.

**Validates: Requirements 1.1**

### Property 2: Frontmatter Extraction Accuracy

*For any* valid MDX file with frontmatter, extracting the content body should return only the content after the closing frontmatter delimiter (---), excluding the frontmatter itself.

**Validates: Requirements 1.2**

### Property 3: Hebrew Word Count Accuracy

*For any* Hebrew text string, the word count should equal the number of sequences of Hebrew characters separated by whitespace or punctuation, ignoring nikud marks.

**Validates: Requirements 1.3**

### Property 4: Article Classification Consistency

*For any* article and threshold value, classification as weak should be true if and only if word count is strictly less than the threshold.

**Validates: Requirements 1.4**

### Property 5: Report Completeness

*For any* set of scanned articles, the generated report should include all articles classified as weak with their correct word counts and titles.

**Validates: Requirements 1.5**

### Property 6: Content Structure Completeness

*For any* generated article content, all five required sections (Hook, Empathy, Science, Protocol, Bridge) should be present and identifiable by their H2 headings.

**Validates: Requirements 2.2**

### Property 7: Heading Structure Validity

*For any* generated article content, all section headings should be H2 level (##) and written in Hebrew characters.

**Validates: Requirements 2.8**

### Property 8: Q&A Section Requirements

*For any* generated article content, the Q&A section should contain between 3 and 5 question-answer pairs, each with a question in H3 format (###).

**Validates: Requirements 2.9**

### Property 9: Internal Links Count

*For any* generated article content, the number of internal links (markdown links to other articles) should be between 2 and 3 inclusive.

**Validates: Requirements 2.10**

### Property 10: Title Generation

*For any* article being rewritten, a new Hebrew title should be generated and it should contain only Hebrew characters, spaces, and allowed punctuation.

**Validates: Requirements 4.1**

### Property 11: Frontmatter Preservation and Update

*For any* article being rewritten, the output frontmatter should preserve the original slug, date, category, image, and originalPostId fields while updating the title, description, and keywords fields.

**Validates: Requirements 5.1-5.8**

### Property 12: Heading Hierarchy Validity

*For any* generated article content, the heading structure should follow proper hierarchy: exactly one H1 (title), multiple H2s (sections), and H3s only within sections, with no skipped levels.

**Validates: Requirements 6.1**

### Property 13: Sequential Processing Order

*For any* batch of articles, processing should occur in the order articles appear in the input list, with each article completing before the next begins.

**Validates: Requirements 7.1**

### Property 14: Error Logging and Continuation

*For any* batch processing run where some articles fail, the system should log each failure with the article filename and error message, and continue processing remaining articles.

**Validates: Requirements 7.2-7.4**

### Property 15: Backup Before Modification

*For any* article being rewritten, a backup copy of the original file should be created before any write operation occurs.

**Validates: Requirements 7.5**

### Property 16: Content Validation Completeness

*For any* generated article content, validation should verify: word count >= 600, all five structure sections present, at least 2 H2 headings, Q&A section with 3-5 questions, and all required frontmatter fields present.

**Validates: Requirements 8.1-8.5**

### Property 17: Validation Failure Handling

*For any* generated content that fails validation, the system should not save the file and should log all validation errors with specific field names and error messages.

**Validates: Requirements 8.6**

### Property 18: Safe File Operations with Backup Recovery

*For any* file write operation that fails, the system should restore the original file from backup, ensuring no data loss occurs.

**Validates: Requirements 9.1-9.5**

### Property 19: Configuration Parameter Acceptance

*For any* valid configuration parameters (word count threshold, target word count, dry-run flag, article list, output directory), the system should accept and apply these parameters correctly during processing.

**Validates: Requirements 10.1-10.5**

## Error Handling

### Error Categories

**File System Errors**
- Directory not found
- Permission denied
- Disk space exhausted
- File locked by another process

**Parsing Errors**
- Invalid MDX syntax
- Malformed frontmatter
- Missing required frontmatter fields
- Invalid YAML in frontmatter

**Content Generation Errors**
- AI API timeout
- AI API rate limit exceeded
- AI API authentication failure
- Generated content fails validation

**Validation Errors**
- Word count below threshold
- Missing required sections
- Invalid heading structure
- Missing Q&A section

### Error Handling Strategies

**Graceful Degradation**
```typescript
try {
  const rewritten = await rewriter.rewriteArticle(article, config)
  await fileManager.writeArticle(article.filePath, rewritten)
  return { status: 'success', article: rewritten }
} catch (error) {
  logger.error(`Failed to rewrite ${article.filePath}: ${error.message}`)
  await fileManager.restoreFromBackup(article.filePath, backupPath)
  return { status: 'failed', error: error.message }
}
```

**Retry Logic for AI API**
```typescript
async function generateWithRetry(prompt: ContentPrompt, maxRetries: number = 3): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await aiGenerator.generateContent(prompt)
    } catch (error) {
      if (attempt === maxRetries) throw error
      if (error.code === 'RATE_LIMIT') {
        await sleep(exponentialBackoff(attempt))
      } else {
        throw error // Don't retry non-transient errors
      }
    }
  }
}
```

**Validation Error Reporting**
```typescript
interface ValidationReport {
  isValid: boolean
  errors: Array<{
    field: string
    expected: string
    actual: string
    severity: 'error' | 'warning'
  }>
}

function validateAndReport(content: string): ValidationReport {
  const errors = []
  
  if (countWords(content) < 600) {
    errors.push({
      field: 'wordCount',
      expected: '>= 600',
      actual: countWords(content).toString(),
      severity: 'error'
    })
  }
  
  // Additional validation checks...
  
  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors
  }
}
```

## Testing Strategy

### Dual Testing Approach

The system requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests** focus on:
- Specific examples of MDX parsing
- Edge cases (empty files, malformed frontmatter)
- Error conditions (missing directories, API failures)
- Integration between components

**Property-Based Tests** focus on:
- Universal properties across all inputs
- Comprehensive input coverage through randomization
- Invariants that must hold for all valid data

### Property-Based Testing Configuration

**Testing Library**: fast-check (JavaScript/TypeScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: batch-article-rewriter, Property {N}: {property text}`

**Example Property Test Structure**:
```typescript
import fc from 'fast-check'
import { describe, it, expect } from 'vitest'

describe('Content Analyzer', () => {
  it('Property 3: Hebrew Word Count Accuracy', () => {
    // Feature: batch-article-rewriter, Property 3: Hebrew word count accuracy
    fc.assert(
      fc.property(
        fc.array(fc.stringOf(fc.hebrewChar(), { minLength: 1, maxLength: 20 })),
        (words) => {
          const text = words.join(' ')
          const counted = contentAnalyzer.countWords(text)
          expect(counted).toBe(words.length)
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

### Unit Test Examples

**MDX Parsing Edge Cases**:
```typescript
describe('Article Scanner - Edge Cases', () => {
  it('should handle empty frontmatter', () => {
    const mdx = '---\n---\nContent here'
    const article = scanner.parseMDX(mdx)
    expect(article.frontmatter).toEqual({})
    expect(article.content).toBe('Content here')
  })
  
  it('should handle missing closing frontmatter delimiter', () => {
    const mdx = '---\ntitle: Test\nContent here'
    expect(() => scanner.parseMDX(mdx)).toThrow('Invalid MDX')
  })
})
```

**Error Handling Tests**:
```typescript
describe('Batch Processor - Error Handling', () => {
  it('should continue processing after single article failure', async () => {
    const articles = [validArticle1, invalidArticle, validArticle2]
    const result = await processor.process({ articles })
    
    expect(result.successful).toBe(2)
    expect(result.failed).toBe(1)
    expect(result.totalProcessed).toBe(3)
  })
})
```

### Integration Tests

**End-to-End Workflow**:
```typescript
describe('Batch Article Rewriter - Integration', () => {
  it('should rewrite weak articles and preserve strong ones', async () => {
    // Setup test directory with mix of weak and strong articles
    const testDir = await createTestDirectory([
      { file: 'weak1.mdx', wordCount: 200 },
      { file: 'strong1.mdx', wordCount: 800 },
      { file: 'weak2.mdx', wordCount: 300 }
    ])
    
    const result = await batchProcessor.process({
      contentDirectory: testDir,
      weakThreshold: 500,
      targetWordCount: 600
    })
    
    expect(result.successful).toBe(2) // Only weak articles rewritten
    expect(result.skipped).toBe(1) // Strong article skipped
    
    // Verify backups created
    const backups = await fs.readdir(path.join(testDir, '.backup'))
    expect(backups).toHaveLength(2)
    
    // Verify rewritten articles meet requirements
    const rewritten1 = await readArticle(path.join(testDir, 'weak1.mdx'))
    expect(countWords(rewritten1.content)).toBeGreaterThanOrEqual(600)
    expect(rewritten1.content).toContain('## ')
  })
})
```

### Test Data Generators

**Hebrew Text Generator**:
```typescript
const hebrewChar = fc.integer({ min: 0x05D0, max: 0x05EA })
  .map(code => String.fromCharCode(code))

const hebrewWord = fc.stringOf(hebrewChar, { minLength: 2, maxLength: 15 })

const hebrewSentence = fc.array(hebrewWord, { minLength: 5, maxLength: 20 })
  .map(words => words.join(' ') + '.')

const hebrewParagraph = fc.array(hebrewSentence, { minLength: 3, maxLength: 8 })
  .map(sentences => sentences.join(' '))
```

**MDX Article Generator**:
```typescript
const articleFrontmatter = fc.record({
  title: hebrewSentence,
  description: hebrewSentence,
  date: fc.date().map(d => d.toISOString().split('T')[0]),
  category: fc.constantFrom('nutrition', 'diagnosis', 'physical', 'mindset'),
  image: fc.constant('/images/blog/test.jpg'),
  keywords: fc.array(hebrewWord, { minLength: 3, maxLength: 8 })
})

const mdxArticle = fc.record({
  frontmatter: articleFrontmatter,
  content: fc.array(hebrewParagraph, { minLength: 1, maxLength: 10 })
    .map(paras => paras.join('\n\n'))
})
```

### Testing Checklist

- [x] All 19 correctness properties implemented as property-based tests
- [x] Edge cases covered with unit tests
- [x] Error conditions tested with unit tests
- [x] Integration tests for end-to-end workflow
- [x] Backup and restore functionality tested
- [x] AI API mocking for deterministic tests
- [x] Hebrew text handling validated
- [x] File system operations tested with temporary directories
- [x] Configuration parameter validation tested
- [x] Report generation accuracy verified
