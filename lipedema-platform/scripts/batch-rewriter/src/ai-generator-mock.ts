// Mock AI Generator for deterministic testing
// Provides predictable responses without calling external APIs

import { QAPair } from './types'

export interface AIGeneratorInterface {
  generateTitle(originalTitle: string, content: string, category: string): Promise<string>
  generateContent(targetWordCount: number, category: string): Promise<string>
  generateDescription(content: string): Promise<string>
  generateKeywords(content: string, category: string): Promise<string[]>
  generateQA(content: string, count: number): Promise<QAPair[]>
}

/**
 * Mock AI Generator for testing
 * Returns deterministic, valid Hebrew content without API calls
 */
export class MockAIGenerator implements AIGeneratorInterface {
  private callCount: number = 0
  
  async generateTitle(originalTitle: string, content: string, category: string): Promise<string> {
    this.callCount++
    
    // Return deterministic Hebrew title based on category
    const titles: Record<string, string> = {
      nutrition: 'תזונה נכונה לטיפול בליפאדמה',
      diagnosis: 'איך מאבחנים ליפאדמה בצורה נכונה',
      physical: 'פעילות גופנית לשיפור הלימפה',
      mindset: 'התמודדות נפשית עם ליפאדמה'
    }
    
    return titles[category] || 'כותרת חדשה בעברית'
  }
  
  async generateContent(targetWordCount: number, category: string): Promise<string> {
    this.callCount++
    
    // Generate deterministic content with all 5 required sections
    const hebrewWords = [
      'ליפאדמה', 'בריאות', 'טיפול', 'מערכת', 'לימפה', 'רקמה', 'שומן',
      'רגליים', 'זרועות', 'נפיחות', 'כאב', 'תחושה', 'כבדות', 'רגישות',
      'מגע', 'גוף', 'מצב', 'רפואי', 'כרוני', 'השפעה', 'אזורים', 'מסוימים',
      'דלקתיות', 'תזונה', 'פעילות', 'עיסוי', 'ניקוז', 'תמיכה', 'רגשית'
    ]
    
    // Calculate words per section to reach target
    const wordsPerSection = Math.floor(targetWordCount / 5)
    
    const generateSection = (sectionName: string, wordCount: number): string => {
      let content = `## ${sectionName}\n\n`
      for (let i = 0; i < wordCount; i++) {
        content += hebrewWords[i % hebrewWords.length] + ' '
        if ((i + 1) % 15 === 0) {
          content += '\n\n'
        }
      }
      return content.trim() + '\n\n'
    }
    
    let content = '# כותרת המאמר\n\n'
    content += generateSection('פתיחה - Hook', wordsPerSection)
    content += generateSection('הזדהות - Empathy', wordsPerSection)
    content += generateSection('המדע - Science', wordsPerSection)
    content += generateSection('פרוטוקול - Protocol', wordsPerSection)
    content += generateSection('גשר - Bridge', wordsPerSection)
    
    // Add Q&A section
    content += '## שאלות ותשובות נפוצות\n\n'
    content += '### מהי ליפאדמה?\n\n'
    content += 'ליפאדמה היא מצב רפואי כרוני המשפיע על מערכת הלימפה בגוף.\n\n'
    content += '### איך מטפלים בליפאדמה?\n\n'
    content += 'הטיפול כולל תזונה נכונה פעילות גופנית ועיסוי לימפתי.\n\n'
    content += '### האם ליפאדמה יכולה להיעלם?\n\n'
    content += 'ליפאדמה היא מצב כרוני אבל ניתן לשפר את הסימפטומים באופן משמעותי.\n\n'
    
    // Add internal links
    content += 'למידע נוסף ראי [מדריך תזונה](/blog/nutrition-guide) ו[טיפולים זמינים](/blog/treatments).\n'
    
    return content
  }
  
  async generateDescription(content: string): Promise<string> {
    this.callCount++
    
    // Return deterministic 150-160 character description
    return 'מדריך מקיף לטיפול בליפאדמה כולל תזונה נכונה פעילות גופנית עדינה ותמיכה רגשית מלאה לשיפור איכות החיים והפחתת הסימפטומים באופן משמעותי ומתמשך לאורך זמן רב'
  }
  
  async generateKeywords(content: string, category: string): Promise<string[]> {
    this.callCount++
    
    // Return deterministic keywords based on category
    const keywordSets: Record<string, string[]> = {
      nutrition: ['ליפאדמה', 'תזונה', 'דיאטה', 'בריאות', 'מזון', 'דלקתיות', 'אנטי דלקתי'],
      diagnosis: ['ליפאדמה', 'אבחון', 'סימפטומים', 'רופא', 'בדיקות', 'מחלה', 'זיהוי'],
      physical: ['ליפאדמה', 'פעילות', 'תרגילים', 'עיסוי', 'לימפה', 'ניקוז', 'תנועה'],
      mindset: ['ליפאדמה', 'נפש', 'רגשות', 'תמיכה', 'התמודדות', 'חיובי', 'כוח']
    }
    
    return keywordSets[category] || ['ליפאדמה', 'בריאות', 'טיפול', 'מידע', 'עזרה']
  }
  
  async generateQA(content: string, count: number): Promise<QAPair[]> {
    this.callCount++
    
    // Return deterministic Q&A pairs
    const allPairs: QAPair[] = [
      {
        question: 'מהי ליפאדמה?',
        answer: 'ליפאדמה היא מצב רפואי כרוני המשפיע על מערכת הלימפה בגוף וגורם להצטברות של רקמת שומן באזורים מסוימים.'
      },
      {
        question: 'מהם הסימפטומים העיקריים?',
        answer: 'הסימפטומים כוללים נפיחות ברגליים כאב תחושת כבדות ורגישות מוגברת למגע באזורים הפגועים.'
      },
      {
        question: 'איך מטפלים בליפאדמה?',
        answer: 'הטיפול כולל תזונה אנטי דלקתית פעילות גופנית עדינה עיסוי לימפתי ובגדי לחץ מתאימים.'
      },
      {
        question: 'האם ליפאדמה יכולה להיעלם לגמרי?',
        answer: 'ליפאדמה היא מצב כרוני אבל עם הטיפול הנכון אפשר לשפר משמעותית את הסימפטומים ואת איכות החיים.'
      },
      {
        question: 'כמה זמן לוקח לראות שיפור?',
        answer: 'רוב האנשים רואים שיפור תוך ארבעה עד שישה שבועות של טיפול עקבי ומסור.'
      }
    ]
    
    // Return requested number of pairs (3-5)
    const validCount = Math.max(3, Math.min(5, count))
    return allPairs.slice(0, validCount)
  }
  
  getCallCount(): number {
    return this.callCount
  }
  
  resetCallCount(): void {
    this.callCount = 0
  }
}

/**
 * Configurable Mock AI Generator for testing edge cases
 * Allows customization of responses for specific test scenarios
 */
export class ConfigurableMockAIGenerator implements AIGeneratorInterface {
  private responses: {
    title?: string
    content?: string
    description?: string
    keywords?: string[]
    qa?: QAPair[]
  } = {}
  
  configure(responses: {
    title?: string
    content?: string
    description?: string
    keywords?: string[]
    qa?: QAPair[]
  }): void {
    this.responses = responses
  }
  
  async generateTitle(originalTitle: string, content: string, category: string): Promise<string> {
    return this.responses.title || 'כותרת בדיקה'
  }
  
  async generateContent(targetWordCount: number, category: string): Promise<string> {
    return this.responses.content || '## Hook\n\nתוכן בדיקה\n\n## Empathy\n\nתוכן\n\n## Science\n\nתוכן\n\n## Protocol\n\nתוכן\n\n## Bridge\n\nתוכן'
  }
  
  async generateDescription(content: string): Promise<string> {
    return this.responses.description || 'תיאור בדיקה'
  }
  
  async generateKeywords(content: string, category: string): Promise<string[]> {
    return this.responses.keywords || ['מילה1', 'מילה2', 'מילה3']
  }
  
  async generateQA(content: string, count: number): Promise<QAPair[]> {
    return this.responses.qa || [
      { question: 'שאלה?', answer: 'תשובה' },
      { question: 'שאלה נוספת?', answer: 'תשובה נוספת' },
      { question: 'שאלה שלישית?', answer: 'תשובה שלישית' }
    ]
  }
}

/**
 * Failing Mock AI Generator for testing error handling
 * Simulates API failures and errors
 */
export class FailingMockAIGenerator implements AIGeneratorInterface {
  private failureMode: 'timeout' | 'rate-limit' | 'auth' | 'invalid-response'
  
  constructor(failureMode: 'timeout' | 'rate-limit' | 'auth' | 'invalid-response' = 'timeout') {
    this.failureMode = failureMode
  }
  
  async generateTitle(): Promise<string> {
    throw this.createError()
  }
  
  async generateContent(): Promise<string> {
    throw this.createError()
  }
  
  async generateDescription(): Promise<string> {
    throw this.createError()
  }
  
  async generateKeywords(): Promise<string[]> {
    throw this.createError()
  }
  
  async generateQA(): Promise<QAPair[]> {
    throw this.createError()
  }
  
  private createError(): Error {
    const errors = {
      'timeout': new Error('Request timeout after 30 seconds'),
      'rate-limit': new Error('Rate limit exceeded. Please try again later.'),
      'auth': new Error('Authentication failed. Invalid API key.'),
      'invalid-response': new Error('Invalid response format from API')
    }
    
    const error = errors[this.failureMode]
    ;(error as any).code = this.failureMode.toUpperCase().replace('-', '_')
    return error
  }
}

