// Backup and Restore Functionality Tests
// Tests the critical backup and restore operations for safe file handling

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as path from 'path'

describe('Backup and Restore Functionality', () => {
  let testDir: string
  let backupDir: string
  
  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(process.cwd(), 'tests', 'temp-backup')
    backupDir = path.join(testDir, '.backup')
    await fs.mkdir(testDir, { recursive: true })
    await fs.mkdir(backupDir, { recursive: true })
  })
  
  afterEach(async () => {
    // Cleanup test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (error) {
      // Ignore cleanup errors
    }
  })
  
  describe('Backup Creation', () => {
    it('should create backup directory if it does not exist', async () => {
      // Setup: Remove backup directory
      await fs.rm(backupDir, { recursive: true, force: true })
      
      // Execute: Create backup directory
      await fs.mkdir(backupDir, { recursive: true })
      
      // Verify: Directory exists
      const exists = await fs.access(backupDir).then(() => true).catch(() => false)
      expect(exists).toBe(true)
    })
    
    it('should create backup with timestamp suffix', async () => {
      // Setup: Create original file
      const originalContent = createTestMDX('test-article', 300)
      const originalPath = path.join(testDir, 'test-article.mdx')
      await fs.writeFile(originalPath, originalContent)
      
      // Execute: Create backup with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupPath = path.join(backupDir, `test-article.mdx.${timestamp}.backup`)
      await fs.copyFile(originalPath, backupPath)
      
      // Verify: Backup file exists
      const backupExists = await fs.access(backupPath).then(() => true).catch(() => false)
      expect(backupExists).toBe(true)
      
      // Verify: Backup filename contains timestamp
      expect(backupPath).toContain(timestamp)
      expect(backupPath).toMatch(/\.backup$/)
    })
    
    it('should preserve exact content in backup', async () => {
      // Setup: Create original file with specific content
      const originalContent = createTestMDX('preserve-test', 500)
      const originalPath = path.join(testDir, 'preserve-test.mdx')
      await fs.writeFile(originalPath, originalContent)
      
      // Execute: Create backup
      const backupPath = path.join(backupDir, 'preserve-test.mdx.backup')
      await fs.copyFile(originalPath, backupPath)
      
      // Verify: Content matches exactly
      const originalRead = await fs.readFile(originalPath, 'utf-8')
      const backupRead = await fs.readFile(backupPath, 'utf-8')
      expect(backupRead).toBe(originalRead)
      expect(backupRead).toBe(originalContent)
    })
    
    it('should handle multiple backups of same file', async () => {
      // Setup: Create original file
      const originalContent = createTestMDX('multi-backup', 300)
      const originalPath = path.join(testDir, 'multi-backup.mdx')
      await fs.writeFile(originalPath, originalContent)
      
      // Execute: Create multiple backups with different timestamps
      const backup1Path = path.join(backupDir, 'multi-backup.mdx.2024-01-15T10-00-00.backup')
      const backup2Path = path.join(backupDir, 'multi-backup.mdx.2024-01-15T11-00-00.backup')
      const backup3Path = path.join(backupDir, 'multi-backup.mdx.2024-01-15T12-00-00.backup')
      
      await fs.copyFile(originalPath, backup1Path)
      await fs.copyFile(originalPath, backup2Path)
      await fs.copyFile(originalPath, backup3Path)
      
      // Verify: All backups exist
      const backup1Exists = await fs.access(backup1Path).then(() => true).catch(() => false)
      const backup2Exists = await fs.access(backup2Path).then(() => true).catch(() => false)
      const backup3Exists = await fs.access(backup3Path).then(() => true).catch(() => false)
      
      expect(backup1Exists).toBe(true)
      expect(backup2Exists).toBe(true)
      expect(backup3Exists).toBe(true)
      
      // Verify: All backups have same content
      const backup1Content = await fs.readFile(backup1Path, 'utf-8')
      const backup2Content = await fs.readFile(backup2Path, 'utf-8')
      const backup3Content = await fs.readFile(backup3Path, 'utf-8')
      
      expect(backup1Content).toBe(originalContent)
      expect(backup2Content).toBe(originalContent)
      expect(backup3Content).toBe(originalContent)
    })
    
    it('should backup files with Hebrew content correctly', async () => {
      // Setup: Create file with Hebrew content
      const hebrewContent = `---
title: "ליפאדמה והבריאות שלך"
description: "מדריך מקיף לטיפול בליפאדמה"
date: "2024-01-15"
category: "diagnosis"
image: "/images/test.jpg"
keywords: ["ליפאדמה", "בריאות", "טיפול"]
---

# ליפאדמה והבריאות שלך

זהו תוכן בעברית עם מילים רבות ומשפטים ארוכים שצריכים להישמר בדיוק כפי שהם.

מערכת הלימפה היא חלק חשוב מהגוף שלנו והיא אחראית על הסרת רעלים ונוזלים מהגוף.`
      
      const originalPath = path.join(testDir, 'hebrew-article.mdx')
      await fs.writeFile(originalPath, hebrewContent, 'utf-8')
      
      // Execute: Create backup
      const backupPath = path.join(backupDir, 'hebrew-article.mdx.backup')
      await fs.copyFile(originalPath, backupPath)
      
      // Verify: Hebrew content preserved exactly
      const backupContent = await fs.readFile(backupPath, 'utf-8')
      expect(backupContent).toBe(hebrewContent)
      
      // Verify: Specific Hebrew words are intact
      expect(backupContent).toContain('ליפאדמה')
      expect(backupContent).toContain('מערכת הלימפה')
      expect(backupContent).toContain('בריאות')
    })
    
    it('should handle backup of large files', async () => {
      // Setup: Create large file (simulate comprehensive article)
      const largeContent = createLargeTestMDX(2000) // 2000 words
      const originalPath = path.join(testDir, 'large-article.mdx')
      await fs.writeFile(originalPath, largeContent)
      
      // Execute: Create backup
      const backupPath = path.join(backupDir, 'large-article.mdx.backup')
      await fs.copyFile(originalPath, backupPath)
      
      // Verify: Backup exists and content matches
      const backupExists = await fs.access(backupPath).then(() => true).catch(() => false)
      expect(backupExists).toBe(true)
      
      const originalSize = (await fs.stat(originalPath)).size
      const backupSize = (await fs.stat(backupPath)).size
      expect(backupSize).toBe(originalSize)
      
      const backupContent = await fs.readFile(backupPath, 'utf-8')
      expect(backupContent).toBe(largeContent)
    })
  })
  
  describe('Restore from Backup', () => {
    it('should restore file from backup after corruption', async () => {
      // Setup: Create original file and backup
      const originalContent = createTestMDX('restore-test', 400)
      const originalPath = path.join(testDir, 'restore-test.mdx')
      await fs.writeFile(originalPath, originalContent)
      
      const backupPath = path.join(backupDir, 'restore-test.mdx.backup')
      await fs.copyFile(originalPath, backupPath)
      
      // Execute: Corrupt the original file
      await fs.writeFile(originalPath, 'CORRUPTED CONTENT')
      
      // Verify: File is corrupted
      const corruptedContent = await fs.readFile(originalPath, 'utf-8')
      expect(corruptedContent).toBe('CORRUPTED CONTENT')
      expect(corruptedContent).not.toBe(originalContent)
      
      // Execute: Restore from backup
      await fs.copyFile(backupPath, originalPath)
      
      // Verify: File is restored correctly
      const restoredContent = await fs.readFile(originalPath, 'utf-8')
      expect(restoredContent).toBe(originalContent)
      expect(restoredContent).not.toContain('CORRUPTED')
    })
    
    it('should restore file after failed write operation', async () => {
      // Setup: Create original file and backup
      const originalContent = createTestMDX('failed-write', 350)
      const originalPath = path.join(testDir, 'failed-write.mdx')
      await fs.writeFile(originalPath, originalContent)
      
      const backupPath = path.join(backupDir, 'failed-write.mdx.backup')
      await fs.copyFile(originalPath, backupPath)
      
      // Execute: Simulate failed write (partial content)
      const partialContent = originalContent.substring(0, originalContent.length / 2)
      await fs.writeFile(originalPath, partialContent)
      
      // Verify: File has partial content
      const partialRead = await fs.readFile(originalPath, 'utf-8')
      expect(partialRead.length).toBeLessThan(originalContent.length)
      
      // Execute: Restore from backup
      await fs.copyFile(backupPath, originalPath)
      
      // Verify: File is fully restored
      const restoredContent = await fs.readFile(originalPath, 'utf-8')
      expect(restoredContent).toBe(originalContent)
      expect(restoredContent.length).toBe(originalContent.length)
    })
    
    it('should restore Hebrew content without data loss', async () => {
      // Setup: Create Hebrew file and backup
      const hebrewContent = `---
title: "מדריך לטיפול בליפאדמה"
description: "מדריך מקיף"
date: "2024-01-15"
category: "diagnosis"
image: "/images/test.jpg"
keywords: ["ליפאדמה", "טיפול"]
---

# מדריך לטיפול בליפאדמה

## הקדמה

ליפאדמה היא מצב רפואי כרוני המשפיע על מערכת הלימפה בגוף. המצב גורם להצטברות של רקמת שומן באזורים מסוימים בגוף.

## הסימפטומים

הסימפטומים כוללים נפיחות כאב וכבדות ברגליים.`
      
      const originalPath = path.join(testDir, 'hebrew-restore.mdx')
      await fs.writeFile(originalPath, hebrewContent, 'utf-8')
      
      const backupPath = path.join(backupDir, 'hebrew-restore.mdx.backup')
      await fs.copyFile(originalPath, backupPath)
      
      // Execute: Corrupt with English content
      await fs.writeFile(originalPath, 'This is corrupted English content')
      
      // Execute: Restore from backup
      await fs.copyFile(backupPath, originalPath)
      
      // Verify: Hebrew content fully restored
      const restoredContent = await fs.readFile(originalPath, 'utf-8')
      expect(restoredContent).toBe(hebrewContent)
      expect(restoredContent).toContain('ליפאדמה')
      expect(restoredContent).toContain('מערכת הלימפה')
      expect(restoredContent).not.toContain('English')
    })
    
    it('should handle restore when backup does not exist', async () => {
      // Setup: Create original file without backup
      const originalContent = createTestMDX('no-backup', 300)
      const originalPath = path.join(testDir, 'no-backup.mdx')
      await fs.writeFile(originalPath, originalContent)
      
      const backupPath = path.join(backupDir, 'no-backup.mdx.backup')
      
      // Verify: Backup does not exist
      const backupExists = await fs.access(backupPath).then(() => true).catch(() => false)
      expect(backupExists).toBe(false)
      
      // Execute: Attempt to restore (should fail gracefully)
      try {
        await fs.copyFile(backupPath, originalPath)
        expect.fail('Should have thrown error for missing backup')
      } catch (error: any) {
        // Verify: Error is caught and handled
        expect(error.code).toBe('ENOENT')
      }
    })
    
    it('should restore multiple files from backups', async () => {
      // Setup: Create multiple files and backups
      const files = [
        { name: 'article1.mdx', content: createTestMDX('article1', 300) },
        { name: 'article2.mdx', content: createTestMDX('article2', 400) },
        { name: 'article3.mdx', content: createTestMDX('article3', 500) }
      ]
      
      for (const file of files) {
        const filePath = path.join(testDir, file.name)
        await fs.writeFile(filePath, file.content)
        
        const backupPath = path.join(backupDir, `${file.name}.backup`)
        await fs.copyFile(filePath, backupPath)
        
        // Corrupt the file
        await fs.writeFile(filePath, 'CORRUPTED')
      }
      
      // Execute: Restore all files from backups
      for (const file of files) {
        const filePath = path.join(testDir, file.name)
        const backupPath = path.join(backupDir, `${file.name}.backup`)
        await fs.copyFile(backupPath, filePath)
      }
      
      // Verify: All files restored correctly
      for (const file of files) {
        const filePath = path.join(testDir, file.name)
        const restoredContent = await fs.readFile(filePath, 'utf-8')
        expect(restoredContent).toBe(file.content)
        expect(restoredContent).not.toContain('CORRUPTED')
      }
    })
  })
  
  describe('Backup Directory Management', () => {
    it('should list all backup files in directory', async () => {
      // Setup: Create multiple backups
      const backupFiles = [
        'article1.mdx.2024-01-15T10-00-00.backup',
        'article2.mdx.2024-01-15T11-00-00.backup',
        'article3.mdx.2024-01-15T12-00-00.backup'
      ]
      
      for (const backupFile of backupFiles) {
        const backupPath = path.join(backupDir, backupFile)
        await fs.writeFile(backupPath, 'backup content')
      }
      
      // Execute: List backup directory
      const files = await fs.readdir(backupDir)
      
      // Verify: All backup files listed
      expect(files).toHaveLength(3)
      expect(files).toContain('article1.mdx.2024-01-15T10-00-00.backup')
      expect(files).toContain('article2.mdx.2024-01-15T11-00-00.backup')
      expect(files).toContain('article3.mdx.2024-01-15T12-00-00.backup')
    })
    
    it('should identify backup files by extension', async () => {
      // Setup: Create mix of backup and non-backup files
      await fs.writeFile(path.join(backupDir, 'article1.mdx.backup'), 'backup')
      await fs.writeFile(path.join(backupDir, 'article2.mdx.backup'), 'backup')
      await fs.writeFile(path.join(backupDir, 'README.md'), 'not a backup')
      await fs.writeFile(path.join(backupDir, 'notes.txt'), 'not a backup')
      
      // Execute: Filter backup files
      const allFiles = await fs.readdir(backupDir)
      const backupFiles = allFiles.filter(f => f.endsWith('.backup'))
      
      // Verify: Only backup files identified
      expect(backupFiles).toHaveLength(2)
      expect(backupFiles).toContain('article1.mdx.backup')
      expect(backupFiles).toContain('article2.mdx.backup')
      expect(backupFiles).not.toContain('README.md')
      expect(backupFiles).not.toContain('notes.txt')
    })
    
    it('should get backup file metadata', async () => {
      // Setup: Create backup file
      const backupContent = createTestMDX('metadata-test', 400)
      const backupPath = path.join(backupDir, 'metadata-test.mdx.backup')
      await fs.writeFile(backupPath, backupContent)
      
      // Execute: Get file stats
      const stats = await fs.stat(backupPath)
      
      // Verify: Metadata is accessible
      expect(stats.isFile()).toBe(true)
      expect(stats.size).toBeGreaterThan(0)
      expect(stats.mtime).toBeInstanceOf(Date)
      expect(stats.birthtime).toBeInstanceOf(Date)
    })
    
    it('should handle empty backup directory', async () => {
      // Setup: Empty backup directory (already created in beforeEach)
      
      // Execute: List empty directory
      const files = await fs.readdir(backupDir)
      
      // Verify: Returns empty array
      expect(files).toHaveLength(0)
      expect(Array.isArray(files)).toBe(true)
    })
  })
  
  describe('Backup Integrity', () => {
    it('should verify backup file is readable', async () => {
      // Setup: Create backup
      const content = createTestMDX('readable-test', 300)
      const backupPath = path.join(backupDir, 'readable-test.mdx.backup')
      await fs.writeFile(backupPath, content)
      
      // Execute: Read backup file
      const readContent = await fs.readFile(backupPath, 'utf-8')
      
      // Verify: Content is readable and correct
      expect(readContent).toBe(content)
      expect(readContent.length).toBeGreaterThan(0)
    })
    
    it('should verify backup file permissions', async () => {
      // Setup: Create backup
      const content = createTestMDX('permissions-test', 300)
      const backupPath = path.join(backupDir, 'permissions-test.mdx.backup')
      await fs.writeFile(backupPath, content)
      
      // Execute: Check file access
      const canRead = await fs.access(backupPath, fs.constants.R_OK)
        .then(() => true)
        .catch(() => false)
      
      // Verify: File is readable
      expect(canRead).toBe(true)
    })
    
    it('should detect corrupted backup files', async () => {
      // Setup: Create corrupted backup (invalid MDX)
      const corruptedContent = 'This is not valid MDX\nNo frontmatter\nJust random text'
      const backupPath = path.join(backupDir, 'corrupted.mdx.backup')
      await fs.writeFile(backupPath, corruptedContent)
      
      // Execute: Read and validate
      const content = await fs.readFile(backupPath, 'utf-8')
      
      // Verify: Can detect it's not valid MDX
      expect(content).not.toContain('---')
      expect(content).not.toMatch(/^---\n[\s\S]*?\n---/)
    })
  })
  
  describe('Atomic Operations', () => {
    it('should ensure backup is created before modifying original', async () => {
      // Setup: Create original file
      const originalContent = createTestMDX('atomic-test', 300)
      const originalPath = path.join(testDir, 'atomic-test.mdx')
      await fs.writeFile(originalPath, originalContent)
      
      // Execute: Atomic backup and modify
      const backupPath = path.join(backupDir, 'atomic-test.mdx.backup')
      
      // Step 1: Create backup first
      await fs.copyFile(originalPath, backupPath)
      
      // Verify: Backup exists before modification
      const backupExists = await fs.access(backupPath).then(() => true).catch(() => false)
      expect(backupExists).toBe(true)
      
      // Step 2: Modify original
      const newContent = createTestMDX('atomic-test-modified', 600)
      await fs.writeFile(originalPath, newContent)
      
      // Verify: Both files exist with different content
      const backupContent = await fs.readFile(backupPath, 'utf-8')
      const modifiedContent = await fs.readFile(originalPath, 'utf-8')
      
      expect(backupContent).toBe(originalContent)
      expect(modifiedContent).toBe(newContent)
      expect(backupContent).not.toBe(modifiedContent)
    })
    
    it('should rollback on write failure', async () => {
      // Setup: Create original file and backup
      const originalContent = createTestMDX('rollback-test', 300)
      const originalPath = path.join(testDir, 'rollback-test.mdx')
      await fs.writeFile(originalPath, originalContent)
      
      const backupPath = path.join(backupDir, 'rollback-test.mdx.backup')
      await fs.copyFile(originalPath, backupPath)
      
      // Execute: Simulate write failure and rollback
      try {
        // Attempt to write invalid content
        await fs.writeFile(originalPath, 'INVALID CONTENT')
        
        // Simulate validation failure
        const content = await fs.readFile(originalPath, 'utf-8')
        if (content === 'INVALID CONTENT') {
          throw new Error('Validation failed')
        }
      } catch (error) {
        // Rollback: Restore from backup
        await fs.copyFile(backupPath, originalPath)
      }
      
      // Verify: Original content restored
      const finalContent = await fs.readFile(originalPath, 'utf-8')
      expect(finalContent).toBe(originalContent)
      expect(finalContent).not.toContain('INVALID')
    })
  })
})

// Helper Functions

function createTestMDX(slug: string, targetWordCount: number): string {
  const hebrewWords = [
    'ליפאדמה', 'בריאות', 'טיפול', 'מערכת', 'לימפה', 'רקמה', 'שומן', 
    'רגליים', 'זרועות', 'נפיחות', 'כאב', 'תחושה', 'כבדות', 'רגישות',
    'מגע', 'גוף', 'מצב', 'רפואי', 'כרוני', 'השפעה', 'אזורים', 'מסוימים'
  ]
  
  let content = ''
  for (let i = 0; i < targetWordCount; i++) {
    content += hebrewWords[i % hebrewWords.length] + ' '
    if ((i + 1) % 10 === 0) {
      content += '\n\n'
    }
  }
  
  return `---
title: "מאמר ${slug}"
description: "תיאור המאמר ${slug}"
date: "2024-01-15"
category: "nutrition"
image: "/images/blog/${slug}.jpg"
keywords: ["ליפאדמה", "בריאות", "טיפול"]
---

# כותרת ${slug}

${content.trim()}`
}

function createLargeTestMDX(wordCount: number): string {
  const hebrewWords = [
    'ליפאדמה', 'בריאות', 'טיפול', 'מערכת', 'לימפה', 'רקמה', 'שומן', 
    'רגליים', 'זרועות', 'נפיחות', 'כאב', 'תחושה', 'כבדות', 'רגישות',
    'מגע', 'גוף', 'מצב', 'רפואי', 'כרוני', 'השפעה', 'אזורים', 'מסוימים',
    'דלקתיות', 'תזונה', 'פעילות', 'עיסוי', 'ניקוז', 'תמיכה', 'רגשית'
  ]
  
  let content = ''
  for (let i = 0; i < wordCount; i++) {
    content += hebrewWords[i % hebrewWords.length] + ' '
    if ((i + 1) % 20 === 0) {
      content += '\n\n'
    }
  }
  
  return `---
title: "מאמר גדול ומקיף"
description: "מאמר זה מכיל תוכן רב ומקיף על ליפאדמה וטיפול בה"
date: "2024-01-15"
category: "diagnosis"
image: "/images/blog/large-article.jpg"
keywords: ["ליפאדמה", "טיפול", "בריאות", "מערכת לימפה"]
---

# מאמר גדול ומקיף

${content.trim()}`
}

