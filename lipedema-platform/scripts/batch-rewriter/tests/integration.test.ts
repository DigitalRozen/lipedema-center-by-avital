// Integration Tests - End-to-End Workflow
// Tests the complete batch article rewriting workflow

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as path from 'path'
import { ArticleScanner } from '../src/scanner'
import { ContentAnalyzer } from '../src/analyzer'

describe('Integration Tests - End-to-End Workflow', () => {
  let testDir: string
  let scanner: ArticleScanner
  let analyzer: ContentAnalyzer
  
  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(process.cwd(), 'tests', 'temp-integration')
    await fs.mkdir(testDir, { recursive: true })
    
    scanner = new ArticleScanner()
    analyzer = new ContentAnalyzer()
  })
  
  afterEach(async () => {
    // Cleanup test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (error) {
      // Ignore cleanup errors
    }
  })
  
  describe('Complete Workflow: Scan → Classify → Process', () => {
    it('should scan directory and classify articles correctly', async () => {
      // Setup: Create test articles
      const weakArticle = createTestMDX('weak-article.mdx', 200)
      const strongArticle = createTestMDX('strong-article.mdx', 800)
      
      await fs.writeFile(path.join(testDir, 'weak-article.mdx'), weakArticle)
      await fs.writeFile(path.join(testDir, 'strong-article.mdx'), strongArticle)
      
      // Execute: Scan directory
      const inventory = await scanner.scanDirectory(testDir)
      
      // Verify: Correct number of articles found
      expect(inventory.totalCount).toBe(2)
      expect(inventory.articles).toHaveLength(2)
      
      // Execute: Classify articles
      const threshold = 500
      const classifications = inventory.articles.map(article => 
        analyzer.classifyArticle(article, threshold)
      )
      
      // Verify: Correct classification
      const weakCount = classifications.filter(c => c.isWeak).length
      const strongCount = classifications.filter(c => !c.isWeak).length
      
      expect(weakCount).toBe(1)
      expect(strongCount).toBe(1)
    })
    
    it('should handle mixed article quality in batch', async () => {
      // Setup: Create multiple articles with varying quality
      const articles = [
        { name: 'weak1.mdx', wordCount: 150 },
        { name: 'weak2.mdx', wordCount: 300 },
        { name: 'strong1.mdx', wordCount: 700 },
        { name: 'weak3.mdx', wordCount: 250 },
        { name: 'strong2.mdx', wordCount: 900 }
      ]
      
      for (const article of articles) {
        const mdx = createTestMDX(article.name, article.wordCount)
        await fs.writeFile(path.join(testDir, article.name), mdx)
      }
      
      // Execute: Scan and classify
      const inventory = await scanner.scanDirectory(testDir)
      const threshold = 500
      
      const weak = inventory.articles.filter(a => 
        analyzer.classifyArticle(a, threshold).isWeak
      )
      const strong = inventory.articles.filter(a => 
        !analyzer.classifyArticle(a, threshold).isWeak
      )
      
      // Verify: Correct separation
      expect(inventory.totalCount).toBe(5)
      expect(weak).toHaveLength(3)
      expect(strong).toHaveLength(2)
      
      // Verify: Word counts are accurate
      weak.forEach(article => {
        expect(article.wordCount).toBeLessThan(threshold)
      })
      strong.forEach(article => {
        expect(article.wordCount).toBeGreaterThanOrEqual(threshold)
      })
    })
  })
  
  describe('Backup and Restore Workflow', () => {
    it('should create backups before processing', async () => {
      // Setup: Create test article
      const article = createTestMDX('test-article.mdx', 300)
      const articlePath = path.join(testDir, 'test-article.mdx')
      await fs.writeFile(articlePath, article)
      
      // Execute: Create backup
      const backupDir = path.join(testDir, '.backup')
      await fs.mkdir(backupDir, { recursive: true })
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupPath = path.join(backupDir, `test-article.mdx.${timestamp}.backup`)
      await fs.copyFile(articlePath, backupPath)
      
      // Verify: Backup exists
      const backupExists = await fs.access(backupPath).then(() => true).catch(() => false)
      expect(backupExists).toBe(true)
      
      // Verify: Backup content matches original
      const originalContent = await fs.readFile(articlePath, 'utf-8')
      const backupContent = await fs.readFile(backupPath, 'utf-8')
      expect(backupContent).toBe(originalContent)
    })
    
    it('should restore from backup on failure', async () => {
      // Setup: Create original article and backup
      const originalContent = createTestMDX('test-article.mdx', 300)
      const articlePath = path.join(testDir, 'test-article.mdx')
      await fs.writeFile(articlePath, originalContent)
      
      const backupDir = path.join(testDir, '.backup')
      await fs.mkdir(backupDir, { recursive: true })
      
      const backupPath = path.join(backupDir, 'test-article.mdx.backup')
      await fs.copyFile(articlePath, backupPath)
      
      // Execute: Simulate failed write (corrupt the file)
      await fs.writeFile(articlePath, 'CORRUPTED CONTENT')
      
      // Execute: Restore from backup
      await fs.copyFile(backupPath, articlePath)
      
      // Verify: Content restored correctly
      const restoredContent = await fs.readFile(articlePath, 'utf-8')
      expect(restoredContent).toBe(originalContent)
    })
  })
  
  describe('Content Validation Workflow', () => {
    it('should validate complete article structure', async () => {
      // Setup: Create comprehensive article
      const comprehensiveArticle = createComprehensiveTestMDX()
      const articlePath = path.join(testDir, 'comprehensive.mdx')
      await fs.writeFile(articlePath, comprehensiveArticle)
      
      // Execute: Read and validate
      const article = await scanner.readMDXFile(articlePath)
      const validation = analyzer.validateContent(article.content, article.frontmatter)
      
      // Verify: Validation passes
      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })
    
    it('should detect missing required sections', async () => {
      // Setup: Create incomplete article (missing sections)
      const incompleteArticle = createIncompleteTestMDX()
      const articlePath = path.join(testDir, 'incomplete.mdx')
      await fs.writeFile(articlePath, incompleteArticle)
      
      // Execute: Read and validate
      const article = await scanner.readMDXFile(articlePath)
      const validation = analyzer.validateContent(article.content, article.frontmatter)
      
      // Verify: Validation fails with specific errors
      expect(validation.isValid).toBe(false)
      expect(validation.errors.length).toBeGreaterThan(0)
      
      // Verify: Specific error messages
      const structureErrors = validation.errors.filter(e => e.field === 'structure')
      expect(structureErrors.length).toBeGreaterThan(0)
    })
    
    it('should detect insufficient word count', async () => {
      // Setup: Create short article
      const shortArticle = createTestMDX('short.mdx', 200)
      const articlePath = path.join(testDir, 'short.mdx')
      await fs.writeFile(articlePath, shortArticle)
      
      // Execute: Read and validate
      const article = await scanner.readMDXFile(articlePath)
      const validation = analyzer.validateContent(article.content, article.frontmatter)
      
      // Verify: Word count error detected
      expect(validation.isValid).toBe(false)
      const wordCountError = validation.errors.find(e => e.field === 'wordCount')
      expect(wordCountError).toBeDefined()
      expect(wordCountError?.message).toContain('below minimum 600')
    })
  })
  
  describe('Error Handling and Recovery', () => {
    it('should handle invalid MDX files gracefully', async () => {
      // Setup: Create invalid MDX file
      const invalidMDX = 'This is not valid MDX\nNo frontmatter here'
      await fs.writeFile(path.join(testDir, 'invalid.mdx'), invalidMDX)
      
      // Execute: Scan directory (should skip invalid file)
      const inventory = await scanner.scanDirectory(testDir)
      
      // Verify: Invalid file skipped, no crash
      expect(inventory.totalCount).toBe(0)
      expect(inventory.articles).toHaveLength(0)
    })
    
    it('should continue processing after single article failure', async () => {
      // Setup: Create mix of valid and invalid articles
      const validArticle1 = createTestMDX('valid1.mdx', 300)
      const invalidArticle = 'Invalid content without frontmatter'
      const validArticle2 = createTestMDX('valid2.mdx', 400)
      
      await fs.writeFile(path.join(testDir, 'valid1.mdx'), validArticle1)
      await fs.writeFile(path.join(testDir, 'invalid.mdx'), invalidArticle)
      await fs.writeFile(path.join(testDir, 'valid2.mdx'), validArticle2)
      
      // Execute: Scan directory
      const inventory = await scanner.scanDirectory(testDir)
      
      // Verify: Valid articles processed, invalid skipped
      expect(inventory.totalCount).toBe(2)
      expect(inventory.articles).toHaveLength(2)
      
      // Verify: Both valid articles are present
      const slugs = inventory.articles.map(a => a.slug)
      expect(slugs).toContain('valid1')
      expect(slugs).toContain('valid2')
      expect(slugs).not.toContain('invalid')
    })
    
    it('should handle empty directory gracefully', async () => {
      // Setup: Empty directory (already created in beforeEach)
      
      // Execute: Scan empty directory
      const inventory = await scanner.scanDirectory(testDir)
      
      // Verify: Returns empty inventory without errors
      expect(inventory.totalCount).toBe(0)
      expect(inventory.articles).toHaveLength(0)
      expect(inventory.weakArticles).toHaveLength(0)
      expect(inventory.strongArticles).toHaveLength(0)
    })
  })
  
  describe('Frontmatter Preservation', () => {
    it('should preserve all required frontmatter fields', async () => {
      // Setup: Create article with complete frontmatter
      const article = createTestMDX('test.mdx', 300)
      const articlePath = path.join(testDir, 'test.mdx')
      await fs.writeFile(articlePath, article)
      
      // Execute: Read article
      const parsed = await scanner.readMDXFile(articlePath)
      
      // Verify: All frontmatter fields preserved
      expect(parsed.frontmatter.title).toBeDefined()
      expect(parsed.frontmatter.description).toBeDefined()
      expect(parsed.frontmatter.date).toBeDefined()
      expect(parsed.frontmatter.category).toBeDefined()
      expect(parsed.frontmatter.image).toBeDefined()
      expect(parsed.frontmatter.keywords).toBeDefined()
      expect(Array.isArray(parsed.frontmatter.keywords)).toBe(true)
    })
    
    it('should preserve originalPostId when present', async () => {
      // Setup: Create article with originalPostId
      const mdx = `---
title: "מאמר בדיקה"
description: "תיאור המאמר"
date: "2024-01-15"
category: "nutrition"
image: "/images/test.jpg"
keywords: ["מילה1", "מילה2"]
originalPostId: "3686588726855817475"
---

# כותרת המאמר

זהו תוכן המאמר בעברית עם מילים רבות מספיק.`

      
      const articlePath = path.join(testDir, 'with-id.mdx')
      await fs.writeFile(articlePath, mdx)
      
      // Execute: Read article
      const parsed = await scanner.readMDXFile(articlePath)
      
      // Verify: originalPostId preserved
      expect(parsed.frontmatter.originalPostId).toBe('3686588726855817475')
    })
  })
  
  describe('Hebrew Content Processing', () => {
    it('should accurately count Hebrew words in real content', async () => {
      // Setup: Create article with Hebrew content
      const hebrewContent = `---
title: "ליפאדמה והבריאות שלך"
description: "מדריך מקיף לטיפול בליפאדמה"
date: "2024-01-15"
category: "diagnosis"
image: "/images/test.jpg"
keywords: ["ליפאדמה", "בריאות", "טיפול"]
---

# ליפאדמה והבריאות שלך

## מהי ליפאדמה

ליפאדמה היא מצב רפואי כרוני המשפיע על מערכת הלימפה בגוף. המצב גורם להצטברות של רקמת שומן באזורים מסוימים בגוף, בעיקר ברגליים ובזרועות.

## הסימפטומים

הסימפטומים העיקריים כוללים נפיחות, כאב, תחושת כבדות ברגליים, ורגישות מוגברת למגע.`

      
      const articlePath = path.join(testDir, 'hebrew.mdx')
      await fs.writeFile(articlePath, hebrewContent)
      
      // Execute: Read and count words
      const article = await scanner.readMDXFile(articlePath)
      
      // Verify: Word count is accurate (manual count: ~40 Hebrew words)
      expect(article.wordCount).toBeGreaterThan(30)
      expect(article.wordCount).toBeLessThan(50)
    })
    
    it('should handle mixed Hebrew and English content', async () => {
      // Setup: Create article with mixed content
      const mixedContent = `---
title: "ליפאדמה - Lipedema Guide"
description: "מדריך מקיף"
date: "2024-01-15"
category: "diagnosis"
image: "/images/test.jpg"
keywords: ["ליפאדמה"]
---

# ליפאדמה והבריאות

זהו מאמר בעברית עם כמה מילים באנגלית כמו lipedema ו-lymphatic system.

המערכת הלימפתית (lymphatic system) היא חלק חשוב מהגוף שלנו.`
      
      const articlePath = path.join(testDir, 'mixed.mdx')
      await fs.writeFile(articlePath, mixedContent)
      
      // Execute: Read and count words
      const article = await scanner.readMDXFile(articlePath)
      
      // Verify: Only Hebrew words counted (English words ignored)
      // Manual count: ~20 Hebrew words
      expect(article.wordCount).toBeGreaterThan(15)
      expect(article.wordCount).toBeLessThan(25)
    })
  })
})

// Helper Functions

function createTestMDX(filename: string, targetWordCount: number): string {
  const hebrewWords = [
    'ליפאדמה', 'בריאות', 'טיפול', 'מערכת', 'לימפה', 'רקמה', 'שומן', 
    'רגליים', 'זרועות', 'נפיחות', 'כאב', 'תחושה', 'כבדות', 'רגישות',
    'מגע', 'גוף', 'מצב', 'רפואי', 'כרוני', 'השפעה', 'אזורים', 'מסוימים'
  ]
  
  // Generate content with approximately targetWordCount Hebrew words
  const wordsNeeded = targetWordCount
  let content = ''
  
  for (let i = 0; i < wordsNeeded; i++) {
    content += hebrewWords[i % hebrewWords.length] + ' '
    if ((i + 1) % 10 === 0) {
      content += '\n\n'
    }
  }
  
  return `---
title: "מאמר בדיקה"
description: "תיאור המאמר לצורכי בדיקה"
date: "2024-01-15"
category: "nutrition"
image: "/images/blog/test.jpg"
keywords: ["ליפאדמה", "בריאות", "טיפול"]
---

# כותרת המאמר

${content.trim()}`
}


function createComprehensiveTestMDX(): string {
  // Create article with section names that include the required keywords
  const hebrewWords = [
    'ליפאדמה', 'בריאות', 'טיפול', 'מערכת', 'לימפה', 'רקמה', 'שומן', 
    'רגליים', 'זרועות', 'נפיחות', 'כאב', 'תחושה', 'כבדות', 'רגישות',
    'מגע', 'גוף', 'מצב', 'רפואי', 'כרוני', 'השפעה', 'אזורים', 'מסוימים',
    'דלקתיות', 'תזונה', 'פעילות', 'עיסוי', 'ניקוז', 'תמיכה', 'רגשית',
    'חשוב', 'מאוד', 'להבין', 'שהמצב', 'הזה', 'דורש', 'טיפול', 'מקיף',
    'ומסור', 'לאורך', 'זמן', 'ארוך', 'יחסית', 'אבל', 'התוצאות', 'שווה',
    'את', 'המאמץ', 'והמסירות', 'שאת', 'משקיעה', 'בתהליך', 'הריפוי'
  ]
  
  // Generate enough content to reach 600+ words
  let additionalContent = ''
  for (let i = 0; i < 350; i++) {
    additionalContent += hebrewWords[i % hebrewWords.length] + ' '
    if ((i + 1) % 15 === 0) {
      additionalContent += '\n\n'
    }
  }
  
  return `---
title: "מדריך מקיף לטיפול בליפאדמה"
description: "מדריך מקיף המסביר את כל ההיבטים של טיפול בליפאדמה, כולל תזונה, פעילות גופנית ותמיכה רגשית"
date: "2024-01-15"
category: "diagnosis"
image: "/images/blog/comprehensive.jpg"
keywords: ["ליפאדמה", "טיפול", "תזונה", "פעילות", "בריאות"]
---

# מדריך מקיף לטיפול בליפאדמה

## Hook - הכאב שאת מרגישה

הרגליים שלך מרגישות כבדות בסוף היום את מרגישה את הנפיחות את הכאב ואת התסכול זה לא רק בראש שלך זה אמיתי וזה קשה מאוד ${additionalContent.substring(0, 400)}

## Empathy - את לא לבד

אני יודעת בדיוק איך זה מרגיש אני עברתי את זה בעצמי המסע הזה לא קל אבל יש תקווה ויש פתרונות שעובדים ${additionalContent.substring(400, 800)}

## Science - מה קורה בגוף שלך

מערכת הלימפה שלך אחראית על הסרת נוזלים ורעלים מהגוף בליפאדמה המערכת הזו לא עובדת כמו שצריך וזה גורם להצטברות של נוזלים ורקמת שומן באזורים מסוימים ${additionalContent.substring(800, 1200)}

הרקמה הפיברוטית שנוצרת היא תוצאה של דלקתיות כרונית הדלקתיות הזו פוגעת בתאים ויוצרת מעגל קסמים של נזק ונפיחות ${additionalContent.substring(1200, 1600)}

## Protocol - מה את יכולה לעשות

התחילי עם תנועה עדינה הליכה שחייה או יוגה שתי מים לפחות שמונה כוסות ביום אכלי מזון אנטי דלקתי ירקות פירות דגים טיפול לימפתי עיסוי ניקוז לימפתי פעמיים בשבוע לבשי בגדי לחץ הם עוזרים למערכת הלימפה לעבוד טוב יותר ${additionalContent.substring(1600, 2000)}

## Bridge - הצעד הבא

אם את רוצה ללמוד עוד על הטיפולים הזמינים אני ממליצה לקרוא על [מכשירי לחץ לימפתי](/blog/lympha-press) ועל [תזונה אנטי דלקתית](/blog/anti-inflammatory-diet) ${additionalContent.substring(2000, 2300)}

## שאלות ותשובות נפוצות

### האם ליפאדמה יכולה להיעלם לגמרי?

ליפאדמה היא מצב כרוני אבל עם הטיפול הנכון אפשר לשפר משמעותית את הסימפטומים ואת איכות החיים ${additionalContent.substring(2300, 2500)}

### כמה זמן לוקח לראות שיפור?

רוב האנשים רואים שיפור תוך ארבעה עד שישה שבועות של טיפול עקבי ומסור ${additionalContent.substring(2500, 2700)}

### האם דיאטה יכולה לעזור?

כן בהחלט תזונה אנטי דלקתית יכולה להפחית משמעותית את הנפיחות והכאב ולשפר את איכות החיים ${additionalContent.substring(2700, 2900)}

### האם צריך לעשות ניתוח?

ניתוח הוא אופציה למקרים חמורים אבל רוב האנשים יכולים לנהל את המצב עם טיפולים שמרניים ויעילים ${additionalContent.substring(2900, 3100)}`
}


function createIncompleteTestMDX(): string {
  return `---
title: "מאמר לא שלם"
description: "מאמר זה חסר חלקים חשובים"
date: "2024-01-15"
category: "nutrition"
image: "/images/blog/incomplete.jpg"
keywords: ["ליפאדמה"]
---

# מאמר לא שלם

## רק חלק אחד

זהו מאמר שחסר לו את רוב החלקים הנדרשים. אין כאן את כל חמשת החלקים של המבנה הנדרש.

אין כאן מספיק תוכן, אין שאלות ותשובות, ואין קישורים פנימיים.

זהו תוכן מינימלי שלא עומד בדרישות האיכות.`
}

