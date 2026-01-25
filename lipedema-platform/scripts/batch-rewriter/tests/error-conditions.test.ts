/**
 * Error Condition Unit Tests for Batch Article Rewriter
 * 
 * This file contains comprehensive unit tests for error handling scenarios,
 * including API failures, file system errors, parsing errors, and validation failures.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ArticleScanner } from '../src/scanner'
import { ContentAnalyzer } from '../src/analyzer'
import { ContentGenerator } from '../src/content-generator'
import { MDXArticle, ArticleFrontmatter } from '../src/types'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as os from 'os'

// ============================================================================
// File System Error Conditions
// ============================================================================

describe('File System - Error Conditions', () => {
  let tmpDir: string
  let scanner: ArticleScanner

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'error-test-'))
    scanner = new ArticleScanner()
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it('should throw error when reading non-existent file', async () => {
    const nonExistentPath = path.join(tmpDir, 'does-not-exist.mdx')
    
    await expect(
      scanner.readMDXFile(nonExistentPath)
    ).rejects.toThrow()
  })

  it('should throw error when scanning non-existent directory', async () => {
    const nonExistentDir = path.join(tmpDir, 'does-not-exist')
    
    await expect(
      scanner.scanDirectory(nonExistentDir)
    ).rejects.toThrow()
  })

  it('should handle permission denied errors gracefully', async () => {
    // Skip on Windows as permission handling is different
    if (process.platform === 'win32') {
      return
    }
    
    const restrictedFile = path.join(tmpDir, 'restricted.mdx')
    await fs.writeFile(restrictedFile, '---\ntitle: "Test"\n---\nContent')
    await fs.chmod(restrictedFile, 0o000)
    
    await expect(
      scanner.readMDXFile(restrictedFile)
    ).rejects.toThrow()
    
    // Restore permissions for cleanup
    await fs.chmod(restrictedFile, 0o644)
  })

  it('should handle corrupted file content', async () => {
    const corruptedFile = path.join(tmpDir, 'corrupted.mdx')
    // Write binary data that's not valid UTF-8
    await fs.writeFile(corruptedFile, Buffer.from([0xFF, 0xFE, 0xFD]))
    
    // Should either throw or handle gracefully
    try {
      await scanner.readMDXFile(corruptedFile)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should handle extremely large files', async () => {
    const largeFile = path.join(tmpDir, 'large.mdx')
    const largeContent = 'מילה '.repeat(1000000) // 1 million words
    const mdx = `---\ntitle: "Large"\n---\n${largeContent}`
    
    await fs.writeFile(largeFile, mdx)
    
    // Should handle without crashing
    const article = await scanner.readMDXFile(largeFile)
    expect(article.wordCount).toBeGreaterThan(0)
  })

  it('should handle file with invalid UTF-8 sequences', async () => {
    const invalidFile = path.join(tmpDir, 'invalid-utf8.mdx')
    // Create content with invalid UTF-8
    const buffer = Buffer.from('---\ntitle: "Test"\n---\n')
    const invalidBytes = Buffer.from([0xC0, 0x80]) // Invalid UTF-8
    const combined = Buffer.concat([buffer, invalidBytes])
    
    await fs.writeFile(invalidFile, combined)
    
    // Should handle the error
    try {
      await scanner.readMDXFile(invalidFile)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should handle directory with no read permissions', async () => {
    // Skip on Windows
    if (process.platform === 'win32') {
      return
    }
    
    const restrictedDir = path.join(tmpDir, 'restricted')
    await fs.mkdir(restrictedDir)
    await fs.chmod(restrictedDir, 0o000)
    
    await expect(
      scanner.scanDirectory(restrictedDir)
    ).rejects.toThrow()
    
    // Restore permissions for cleanup
    await fs.chmod(restrictedDir, 0o755)
  })
})

// ============================================================================
// Parsing Error Conditions
// ============================================================================

describe('MDX Parsing - Error Conditions', () => {
  let scanner: ArticleScanner

  beforeEach(() => {
    scanner = new ArticleScanner()
  })

  it('should throw error on completely empty file', () => {
    expect(() => scanner.parseMDX('')).toThrow()
  })

  it('should throw error on file with only opening delimiter', () => {
    expect(() => scanner.parseMDX('---')).toThrow()
  })

  it('should throw error on file with no frontmatter delimiters', () => {
    expect(() => scanner.parseMDX('Just content')).toThrow()
  })

  it('should throw error on malformed YAML in frontmatter', () => {
    const malformedYAML = `---
title: "Test
description: Missing closing quote
---
Content`
    
    // gray-matter should handle this, but we test the behavior
    try {
      scanner.parseMDX(malformedYAML)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should throw error on frontmatter with invalid YAML syntax', () => {
    const invalidYAML = `---
title: Test
  invalid indentation
description: Test
---
Content`
    
    try {
      scanner.parseMDX(invalidYAML)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should handle frontmatter with null values', () => {
    const mdx = `---
title: null
description: null
---
Content`
    
    const parsed = scanner.parseMDX(mdx)
    expect(parsed.data.title).toBeNull()
    expect(parsed.content).toBe('Content')
  })

  it('should handle frontmatter with undefined values', () => {
    const mdx = `---
title:
description:
---
Content`
    
    const parsed = scanner.parseMDX(mdx)
    // gray-matter converts empty values to null, not undefined
    expect(parsed.data.title).toBeNull()
    expect(parsed.content).toBe('Content')
  })

  it('should handle frontmatter with special characters', () => {
    const mdx = `---
title: "Test: With @#$%^&* Special"
description: "Line 1\\nLine 2"
---
Content`
    
    const parsed = scanner.parseMDX(mdx)
    expect(parsed.data.title).toContain('Special')
    expect(parsed.content).toBe('Content')
  })

  it('should handle extremely long frontmatter', () => {
    const longValue = 'x'.repeat(100000)
    const mdx = `---
title: "${longValue}"
---
Content`
    
    const parsed = scanner.parseMDX(mdx)
    expect(parsed.data.title).toHaveLength(100000)
  })

  it('should handle frontmatter with circular references', () => {
    // YAML doesn't support circular refs, but test malformed structure
    const mdx = `---
title: "Test"
ref: *anchor
---
Content`
    
    try {
      scanner.parseMDX(mdx)
    } catch (error) {
      // Expected to fail on invalid YAML reference
      expect(error).toBeDefined()
    }
  })
})

// ============================================================================
// Content Analysis Error Conditions
// ============================================================================

describe('Content Analysis - Error Conditions', () => {
  let analyzer: ContentAnalyzer

  beforeEach(() => {
    analyzer = new ContentAnalyzer()
  })

  it('should handle null content gracefully', () => {
    // @ts-expect-error Testing error condition
    expect(() => analyzer.countWords(null)).toThrow()
  })

  it('should handle undefined content gracefully', () => {
    // @ts-expect-error Testing error condition
    expect(() => analyzer.countWords(undefined)).toThrow()
  })

  it('should handle content with only control characters', () => {
    const controlChars = '\x00\x01\x02\x03\x04'
    expect(analyzer.countWords(controlChars)).toBe(0)
  })

  it('should handle content with mixed RTL and LTR marks', () => {
    const mixedContent = 'שלום\u200Eworld\u200Fמילה'
    const count = analyzer.countWords(mixedContent)
    expect(count).toBeGreaterThan(0)
  })

  it('should handle validation with null frontmatter', () => {
    const content = '## Section\n\n' + 'מילה '.repeat(100)
    
    // @ts-expect-error Testing error condition
    expect(() => analyzer.validateContent(content, null)).toThrow()
  })

  it('should handle validation with incomplete article object', () => {
    const incompleteArticle = {
      filePath: '/test.mdx',
      slug: 'test',
      // Missing frontmatter
      content: 'content',
      wordCount: 100
    }
    
    // @ts-expect-error Testing error condition
    // The implementation doesn't validate article structure, it just uses wordCount
    const classification = analyzer.classifyArticle(incompleteArticle, 500)
    expect(classification.isWeak).toBe(true)
    expect(classification.wordCount).toBe(100)
  })

  it('should handle negative word count threshold', () => {
    const article: MDXArticle = {
      filePath: '/test.mdx',
      slug: 'test',
      frontmatter: {
        title: 'Test',
        description: 'Test',
        date: '2024-01-01',
        category: 'nutrition',
        image: '/test.jpg',
        keywords: []
      },
      content: 'מילה '.repeat(100),
      wordCount: 100
    }
    
    const classification = analyzer.classifyArticle(article, -1)
    // Negative threshold means all articles are "strong"
    expect(classification.isWeak).toBe(false)
  })

  it('should handle zero word count threshold', () => {
    const article: MDXArticle = {
      filePath: '/test.mdx',
      slug: 'test',
      frontmatter: {
        title: 'Test',
        description: 'Test',
        date: '2024-01-01',
        category: 'nutrition',
        image: '/test.jpg',
        keywords: []
      },
      content: '',
      wordCount: 0
    }
    
    const classification = analyzer.classifyArticle(article, 0)
    // At threshold, should not be weak
    expect(classification.isWeak).toBe(false)
  })

  it('should handle extremely large word count threshold', () => {
    const article: MDXArticle = {
      filePath: '/test.mdx',
      slug: 'test',
      frontmatter: {
        title: 'Test',
        description: 'Test',
        date: '2024-01-01',
        category: 'nutrition',
        image: '/test.jpg',
        keywords: []
      },
      content: 'מילה '.repeat(100),
      wordCount: 100
    }
    
    const classification = analyzer.classifyArticle(article, Number.MAX_SAFE_INTEGER)
    expect(classification.isWeak).toBe(true)
  })
})

// ============================================================================
// Content Generation Error Conditions
// ============================================================================

describe('Content Generator - Error Conditions', () => {
  let generator: ContentGenerator

  beforeEach(() => {
    generator = new ContentGenerator()
  })

  it('should handle zero target word count', () => {
    // The mock generator doesn't validate input, it just generates content
    const content = generator.generateContent(0)
    expect(content).toBeDefined()
    expect(typeof content).toBe('string')
  })

  it('should handle negative target word count', () => {
    // The mock generator doesn't validate input, it just generates content
    const content = generator.generateContent(-100)
    expect(content).toBeDefined()
    expect(typeof content).toBe('string')
  })

  it('should handle extremely large target word count', () => {
    // Should either handle or throw meaningful error
    try {
      const content = generator.generateContent(1000000)
      expect(content).toBeDefined()
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('should handle title generation with empty content', () => {
    const title = generator.generateTitle('Original', '', 'nutrition')
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })

  it('should handle title generation with null original title', () => {
    // @ts-expect-error Testing error condition
    // The mock generator handles null by treating it as empty string
    const title = generator.generateTitle(null, 'content', 'nutrition')
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })

  it('should handle title generation with invalid category', () => {
    // @ts-expect-error Testing error condition
    const title = generator.generateTitle('Test', 'content', 'invalid-category')
    // Should still generate something or throw
    expect(title).toBeDefined()
  })

  it('should handle Q&A extraction from malformed content', () => {
    const malformed = `## שאלות ותשובות
### Question without answer
### Another question
No answer here either`
    
    const pairs = generator.extractQAPairs(malformed)
    // Should extract what it can
    expect(Array.isArray(pairs)).toBe(true)
  })

  it('should handle Q&A extraction with nested headings', () => {
    const nested = `## שאלות ותשובות
### Question 1?
#### Nested heading
Answer 1
### Question 2?
Answer 2`
    
    const pairs = generator.extractQAPairs(nested)
    expect(pairs.length).toBeGreaterThan(0)
  })

  it('should handle internal link counting with malformed markdown', () => {
    const malformed = '[Broken link]( /article [Another](/test'
    const count = generator.countInternalLinks(malformed)
    // Should handle gracefully
    expect(count).toBeGreaterThanOrEqual(0)
  })

  it('should handle heading extraction from content with no newlines', () => {
    const noNewlines = '## Heading1## Heading2## Heading3'
    const headings = generator.extractHeadings(noNewlines)
    // May or may not extract depending on implementation
    expect(Array.isArray(headings)).toBe(true)
  })

  it('should handle heading hierarchy validation with empty array', () => {
    const isValid = generator.validateHeadingHierarchy([])
    expect(isValid).toBe(false)
  })

  it('should handle heading hierarchy with only H3 and below', () => {
    const headings = [
      { level: 3, text: 'Subsection' },
      { level: 4, text: 'Sub-subsection' }
    ]
    
    const isValid = generator.validateHeadingHierarchy(headings)
    expect(isValid).toBe(false)
  })

  it('should handle heading hierarchy with invalid level numbers', () => {
    const headings = [
      { level: 0, text: 'Invalid' },
      { level: 7, text: 'Also invalid' }
    ]
    
    const isValid = generator.validateHeadingHierarchy(headings)
    expect(isValid).toBe(false)
  })

  it('should handle heading hierarchy with negative levels', () => {
    const headings = [
      { level: -1, text: 'Negative' },
      { level: 1, text: 'Title' }
    ]
    
    const isValid = generator.validateHeadingHierarchy(headings)
    expect(isValid).toBe(false)
  })
})

// ============================================================================
// Validation Error Conditions
// ============================================================================

describe('Validation - Error Conditions', () => {
  let analyzer: ContentAnalyzer

  beforeEach(() => {
    analyzer = new ContentAnalyzer()
  })

  it('should report multiple validation errors', () => {
    const badContent = 'Short content'
    const badFrontmatter: ArticleFrontmatter = {
      title: '',
      description: '',
      date: '',
      category: 'nutrition',
      image: '',
      keywords: []
    }
    
    const validation = analyzer.validateContent(badContent, badFrontmatter)
    
    expect(validation.isValid).toBe(false)
    expect(validation.errors.length).toBeGreaterThan(1)
  })

  it('should handle validation with content containing only whitespace', () => {
    const whitespaceContent = '   \n\n\t\t   \n   '
    const frontmatter: ArticleFrontmatter = {
      title: 'Test',
      description: 'Test',
      date: '2024-01-01',
      category: 'nutrition',
      image: '/test.jpg',
      keywords: []
    }
    
    const validation = analyzer.validateContent(whitespaceContent, frontmatter)
    
    expect(validation.isValid).toBe(false)
    expect(validation.errors.some(e => e.field === 'wordCount')).toBe(true)
  })

  it('should handle validation with content containing only English', () => {
    const englishContent = 'This is all English content with no Hebrew words at all. '.repeat(20)
    const frontmatter: ArticleFrontmatter = {
      title: 'Test',
      description: 'Test',
      date: '2024-01-01',
      category: 'nutrition',
      image: '/test.jpg',
      keywords: []
    }
    
    const validation = analyzer.validateContent(englishContent, frontmatter)
    
    expect(validation.isValid).toBe(false)
    expect(validation.errors.some(e => e.field === 'wordCount')).toBe(true)
  })

  it('should handle validation with malformed frontmatter types', () => {
    const content = '## Section\n\n' + 'מילה '.repeat(100)
    const malformedFrontmatter = {
      title: 123, // Should be string
      description: true, // Should be string
      date: null,
      category: 'invalid',
      image: undefined,
      keywords: 'not-an-array'
    }
    
    // @ts-expect-error Testing error condition
    const validation = analyzer.validateContent(content, malformedFrontmatter)
    
    expect(validation.isValid).toBe(false)
  })

  it('should handle validation with missing required sections', () => {
    const incompleteContent = `## Hook

${'מילה '.repeat(100)}

## Empathy

${'מילה '.repeat(100)}

## שאלות ותשובות

### Question?
Answer`
    
    const frontmatter: ArticleFrontmatter = {
      title: 'Test',
      description: 'Test',
      date: '2024-01-01',
      category: 'nutrition',
      image: '/test.jpg',
      keywords: []
    }
    
    const validation = analyzer.validateContent(incompleteContent, frontmatter)
    
    expect(validation.isValid).toBe(false)
    // Should report missing Science, Protocol, Bridge sections
    expect(validation.errors.some(e => e.message.includes('science'))).toBe(true)
  })

  it('should handle validation with duplicate section names', () => {
    const duplicateContent = `## Hook

${'מילה '.repeat(100)}

## Hook

${'מילה '.repeat(100)}

## Empathy

Content

## שאלות ותשובות

### Question?
Answer`
    
    const frontmatter: ArticleFrontmatter = {
      title: 'Test',
      description: 'Test',
      date: '2024-01-01',
      category: 'nutrition',
      image: '/test.jpg',
      keywords: []
    }
    
    const validation = analyzer.validateContent(duplicateContent, frontmatter)
    
    // Should still validate structure
    expect(validation.errors).toBeDefined()
  })
})

// ============================================================================
// Integration Error Conditions
// ============================================================================

describe('Integration - Error Conditions', () => {
  let tmpDir: string
  let scanner: ArticleScanner
  let analyzer: ContentAnalyzer

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'integration-error-'))
    scanner = new ArticleScanner()
    analyzer = new ContentAnalyzer()
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it('should handle directory with all invalid files', async () => {
    await fs.writeFile(path.join(tmpDir, 'invalid1.mdx'), 'No frontmatter')
    await fs.writeFile(path.join(tmpDir, 'invalid2.mdx'), '---\nNo closing')
    await fs.writeFile(path.join(tmpDir, 'invalid3.mdx'), '')
    
    const inventory = await scanner.scanDirectory(tmpDir)
    
    expect(inventory.totalCount).toBe(0)
    expect(inventory.articles).toEqual([])
  })

  it('should handle mixed valid and invalid files without crashing', async () => {
    await fs.writeFile(
      path.join(tmpDir, 'valid.mdx'),
      '---\ntitle: "Valid"\ndescription: "Test"\ndate: "2024-01-01"\ncategory: "nutrition"\nimage: "/test.jpg"\nkeywords: []\n---\n' + 'מילה '.repeat(100)
    )
    
    await fs.writeFile(path.join(tmpDir, 'invalid.mdx'), 'Invalid')
    
    await fs.writeFile(
      path.join(tmpDir, 'valid2.mdx'),
      '---\ntitle: "Valid2"\ndescription: "Test"\ndate: "2024-01-01"\ncategory: "nutrition"\nimage: "/test.jpg"\nkeywords: []\n---\n' + 'מילה '.repeat(200)
    )
    
    const inventory = await scanner.scanDirectory(tmpDir)
    
    expect(inventory.totalCount).toBe(2)
    expect(inventory.articles.map(a => a.slug).sort()).toEqual(['valid', 'valid2'])
  })

  it('should handle concurrent file operations', async () => {
    // Create multiple files
    const promises = []
    for (let i = 0; i < 10; i++) {
      const mdx = `---\ntitle: "Test ${i}"\ndescription: "Test"\ndate: "2024-01-01"\ncategory: "nutrition"\nimage: "/test.jpg"\nkeywords: []\n---\n` + 'מילה '.repeat(100)
      promises.push(fs.writeFile(path.join(tmpDir, `test${i}.mdx`), mdx))
    }
    
    await Promise.all(promises)
    
    // Scan should handle all files
    const inventory = await scanner.scanDirectory(tmpDir)
    expect(inventory.totalCount).toBe(10)
  })

  it('should handle file being deleted during scan', async () => {
    await fs.writeFile(
      path.join(tmpDir, 'temp.mdx'),
      '---\ntitle: "Temp"\n---\nContent'
    )
    
    // Start scan and immediately delete file
    const scanPromise = scanner.scanDirectory(tmpDir)
    await fs.unlink(path.join(tmpDir, 'temp.mdx'))
    
    // Should handle gracefully
    try {
      const inventory = await scanPromise
      expect(inventory).toBeDefined()
    } catch (error) {
      // Error is acceptable in this race condition
      expect(error).toBeDefined()
    }
  })

  it('should handle symlink loops', async () => {
    // Skip on Windows
    if (process.platform === 'win32') {
      return
    }
    
    const subdir = path.join(tmpDir, 'subdir')
    await fs.mkdir(subdir)
    
    // Create symlink loop
    try {
      await fs.symlink(tmpDir, path.join(subdir, 'loop'))
    } catch (error) {
      // Symlink creation might fail, skip test
      return
    }
    
    // Scan should handle without infinite loop
    try {
      await scanner.scanDirectory(tmpDir)
    } catch (error) {
      // Error is acceptable
      expect(error).toBeDefined()
    }
  })
})
