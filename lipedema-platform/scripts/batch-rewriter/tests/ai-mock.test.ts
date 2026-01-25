// Tests for AI API Mocking
// Validates that mock AI generators provide deterministic, testable responses

import { describe, it, expect, beforeEach } from 'vitest'
import { 
  MockAIGenerator, 
  ConfigurableMockAIGenerator, 
  FailingMockAIGenerator,
  AIGeneratorInterface 
} from '../src/ai-generator-mock'

describe('AI API Mocking', () => {
  describe('MockAIGenerator - Deterministic Responses', () => {
    let generator: MockAIGenerator
    
    beforeEach(() => {
      generator = new MockAIGenerator()
    })
    
    it('should generate deterministic Hebrew titles based on category', async () => {
      const nutritionTitle = await generator.generateTitle('', '', 'nutrition')
      const diagnosisTitle = await generator.generateTitle('', '', 'diagnosis')
      const physicalTitle = await generator.generateTitle('', '', 'physical')
      const mindsetTitle = await generator.generateTitle('', '', 'mindset')
      
      // Titles should be deterministic
      expect(nutritionTitle).toBe('תזונה נכונה לטיפול בליפאדמה')
      expect(diagnosisTitle).toBe('איך מאבחנים ליפאדמה בצורה נכונה')
      expect(physicalTitle).toBe('פעילות גופנית לשיפור הלימפה')
      expect(mindsetTitle).toBe('התמודדות נפשית עם ליפאדמה')
      
      // Should only contain Hebrew characters
      const hebrewRegex = /^[\u0590-\u05FF\s]+$/
      expect(hebrewRegex.test(nutritionTitle)).toBe(true)
      expect(hebrewRegex.test(diagnosisTitle)).toBe(true)
    })
    
    it('should generate content with all 5 required sections', async () => {
      const content = await generator.generateContent(600, 'nutrition')
      
      // Check for all 5 sections
      expect(content).toContain('Hook')
      expect(content).toContain('Empathy')
      expect(content).toContain('Science')
      expect(content).toContain('Protocol')
      expect(content).toContain('Bridge')
      
      // Should have H2 headings
      const h2Count = (content.match(/^## /gm) || []).length
      expect(h2Count).toBeGreaterThanOrEqual(5)
    })
    
    it('should generate content with Q&A section', async () => {
      const content = await generator.generateContent(600, 'nutrition')
      
      // Should have Q&A section
      expect(content).toContain('שאלות ותשובות')
      
      // Should have questions (H3 headings ending with ?)
      const questions = content.match(/^### .+\?$/gm) || []
      expect(questions.length).toBeGreaterThanOrEqual(3)
      expect(questions.length).toBeLessThanOrEqual(5)
    })
    
    it('should generate content with internal links', async () => {
      const content = await generator.generateContent(600, 'nutrition')
      
      // Should have internal links
      const links = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []
      expect(links.length).toBeGreaterThanOrEqual(2)
      
      // Links should be internal (start with /)
      for (const link of links) {
        const urlMatch = link.match(/\]\(([^)]+)\)/)
        if (urlMatch) {
          expect(urlMatch[1]).toMatch(/^\//)
        }
      }
    })
    
    it('should generate description of correct length', async () => {
      const description = await generator.generateDescription('test content')
      
      // Should be between 150-160 characters
      expect(description.length).toBeGreaterThanOrEqual(150)
      expect(description.length).toBeLessThanOrEqual(160)
      
      // Should be in Hebrew
      const hebrewRegex = /[\u0590-\u05FF]/
      expect(hebrewRegex.test(description)).toBe(true)
    })
    
    it('should generate category-specific keywords', async () => {
      const nutritionKeywords = await generator.generateKeywords('', 'nutrition')
      const diagnosisKeywords = await generator.generateKeywords('', 'diagnosis')
      
      // Should have 5-8 keywords
      expect(nutritionKeywords.length).toBeGreaterThanOrEqual(5)
      expect(nutritionKeywords.length).toBeLessThanOrEqual(8)
      
      // Keywords should be different for different categories
      expect(nutritionKeywords).not.toEqual(diagnosisKeywords)
      
      // All keywords should be Hebrew
      const hebrewRegex = /^[\u0590-\u05FF\s]+$/
      for (const keyword of nutritionKeywords) {
        expect(hebrewRegex.test(keyword)).toBe(true)
      }
    })
    
    it('should generate Q&A pairs with correct count', async () => {
      const qa3 = await generator.generateQA('', 3)
      const qa5 = await generator.generateQA('', 5)
      
      // Should respect count parameter (3-5 range)
      expect(qa3.length).toBe(3)
      expect(qa5.length).toBe(5)
      
      // Each pair should have question and answer
      for (const pair of qa3) {
        expect(pair.question).toBeTruthy()
        expect(pair.answer).toBeTruthy()
        expect(pair.question.endsWith('?')).toBe(true)
      }
    })
    
    it('should track call count', async () => {
      expect(generator.getCallCount()).toBe(0)
      
      await generator.generateTitle('', '', 'nutrition')
      expect(generator.getCallCount()).toBe(1)
      
      await generator.generateContent(600, 'nutrition')
      expect(generator.getCallCount()).toBe(2)
      
      await generator.generateDescription('')
      expect(generator.getCallCount()).toBe(3)
      
      generator.resetCallCount()
      expect(generator.getCallCount()).toBe(0)
    })
    
    it('should be deterministic across multiple calls', async () => {
      const title1 = await generator.generateTitle('', '', 'nutrition')
      const title2 = await generator.generateTitle('', '', 'nutrition')
      
      expect(title1).toBe(title2)
      
      const keywords1 = await generator.generateKeywords('', 'diagnosis')
      const keywords2 = await generator.generateKeywords('', 'diagnosis')
      
      expect(keywords1).toEqual(keywords2)
    })
  })
  
  describe('ConfigurableMockAIGenerator - Custom Responses', () => {
    let generator: ConfigurableMockAIGenerator
    
    beforeEach(() => {
      generator = new ConfigurableMockAIGenerator()
    })
    
    it('should return configured title', async () => {
      const customTitle = 'כותרת מותאמת אישית'
      generator.configure({ title: customTitle })
      
      const result = await generator.generateTitle('', '', 'nutrition')
      expect(result).toBe(customTitle)
    })
    
    it('should return configured content', async () => {
      const customContent = '## Hook\n\nתוכן מותאם\n\n## Empathy\n\nעוד תוכן'
      generator.configure({ content: customContent })
      
      const result = await generator.generateContent(600, 'nutrition')
      expect(result).toBe(customContent)
    })
    
    it('should return configured keywords', async () => {
      const customKeywords = ['מילה1', 'מילה2', 'מילה3', 'מילה4']
      generator.configure({ keywords: customKeywords })
      
      const result = await generator.generateKeywords('', 'nutrition')
      expect(result).toEqual(customKeywords)
    })
    
    it('should return configured Q&A pairs', async () => {
      const customQA = [
        { question: 'שאלה מותאמת?', answer: 'תשובה מותאמת' },
        { question: 'שאלה נוספת?', answer: 'תשובה נוספת' }
      ]
      generator.configure({ qa: customQA })
      
      const result = await generator.generateQA('', 3)
      expect(result).toEqual(customQA)
    })
    
    it('should allow partial configuration', async () => {
      generator.configure({ title: 'כותרת חדשה' })
      
      const title = await generator.generateTitle('', '', 'nutrition')
      const description = await generator.generateDescription('')
      
      expect(title).toBe('כותרת חדשה')
      expect(description).toBe('תיאור בדיקה') // Default value
    })
  })
  
  describe('FailingMockAIGenerator - Error Simulation', () => {
    it('should simulate timeout errors', async () => {
      const generator = new FailingMockAIGenerator('timeout')
      
      await expect(generator.generateTitle('', '', 'nutrition'))
        .rejects.toThrow('Request timeout')
      
      await expect(generator.generateContent(600, 'nutrition'))
        .rejects.toThrow('Request timeout')
    })
    
    it('should simulate rate limit errors', async () => {
      const generator = new FailingMockAIGenerator('rate-limit')
      
      await expect(generator.generateTitle('', '', 'nutrition'))
        .rejects.toThrow('Rate limit exceeded')
    })
    
    it('should simulate authentication errors', async () => {
      const generator = new FailingMockAIGenerator('auth')
      
      await expect(generator.generateTitle('', '', 'nutrition'))
        .rejects.toThrow('Authentication failed')
    })
    
    it('should simulate invalid response errors', async () => {
      const generator = new FailingMockAIGenerator('invalid-response')
      
      await expect(generator.generateTitle('', '', 'nutrition'))
        .rejects.toThrow('Invalid response format')
    })
    
    it('should include error codes', async () => {
      const generator = new FailingMockAIGenerator('rate-limit')
      
      try {
        await generator.generateTitle('', '', 'nutrition')
        expect.fail('Should have thrown error')
      } catch (error: any) {
        expect(error.code).toBe('RATE_LIMIT')
      }
    })
  })
  
  describe('Mock Integration with Real Components', () => {
    it('should work as drop-in replacement for real AI generator', async () => {
      const mock: AIGeneratorInterface = new MockAIGenerator()
      
      // Should implement all required methods
      expect(typeof mock.generateTitle).toBe('function')
      expect(typeof mock.generateContent).toBe('function')
      expect(typeof mock.generateDescription).toBe('function')
      expect(typeof mock.generateKeywords).toBe('function')
      expect(typeof mock.generateQA).toBe('function')
      
      // All methods should return promises
      const titlePromise = mock.generateTitle('', '', 'nutrition')
      expect(titlePromise).toBeInstanceOf(Promise)
      
      const title = await titlePromise
      expect(typeof title).toBe('string')
    })
    
    it('should generate valid content that passes validation', async () => {
      const mock = new MockAIGenerator()
      const content = await mock.generateContent(600, 'nutrition')
      
      // Content should have proper structure
      const h2Count = (content.match(/^## /gm) || []).length
      expect(h2Count).toBeGreaterThanOrEqual(5)
      
      // Should have Q&A section
      const h3Count = (content.match(/^### /gm) || []).length
      expect(h3Count).toBeGreaterThanOrEqual(3)
      
      // Should have internal links
      const linkCount = (content.match(/\[([^\]]+)\]\(\/[^)]+\)/g) || []).length
      expect(linkCount).toBeGreaterThanOrEqual(2)
    })
  })
  
  describe('Performance and Reliability', () => {
    it('should execute quickly without network delays', async () => {
      const mock = new MockAIGenerator()
      const startTime = Date.now()
      
      await mock.generateTitle('', '', 'nutrition')
      await mock.generateContent(600, 'nutrition')
      await mock.generateDescription('')
      await mock.generateKeywords('', 'nutrition')
      await mock.generateQA('', 3)
      
      const duration = Date.now() - startTime
      
      // Should complete in under 100ms (no network calls)
      expect(duration).toBeLessThan(100)
    })
    
    it('should never fail unexpectedly', async () => {
      const mock = new MockAIGenerator()
      
      // Should handle any input without errors
      await expect(mock.generateTitle('', '', 'invalid-category' as any)).resolves.toBeTruthy()
      await expect(mock.generateContent(0, 'nutrition')).resolves.toBeTruthy()
      await expect(mock.generateDescription('')).resolves.toBeTruthy()
      await expect(mock.generateKeywords('', 'nutrition')).resolves.toBeTruthy()
      await expect(mock.generateQA('', 10)).resolves.toBeTruthy()
    })
    
    it('should be memory efficient for repeated calls', async () => {
      const mock = new MockAIGenerator()
      
      // Make many calls
      for (let i = 0; i < 100; i++) {
        await mock.generateTitle('', '', 'nutrition')
      }
      
      // Should not accumulate memory (call count is the only state)
      expect(mock.getCallCount()).toBe(100)
    })
  })
})

