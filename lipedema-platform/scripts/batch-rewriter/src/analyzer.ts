// Content Analyzer - analyzes article quality and validates content

import { MDXArticle, ArticleClassification, ValidationResult, ValidationError, ArticleFrontmatter } from './types'

// Hebrew word counting - matches sequences of Hebrew characters
const HEBREW_WORD_REGEX = /[\u0590-\u05FF]+/g

export function countWords(text: string): number {
  const matches = text.match(HEBREW_WORD_REGEX)
  return matches ? matches.length : 0
}

export class ContentAnalyzer {
  countWords(text: string): number {
    return countWords(text)
  }
  
  classifyArticle(article: MDXArticle, threshold: number): ArticleClassification {
    return {
      isWeak: article.wordCount < threshold,
      wordCount: article.wordCount,
      threshold
    }
  }
  
  validateContent(content: string, frontmatter: ArticleFrontmatter): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationError[] = []
    
    // Validate word count
    const wordCount = this.countWords(content)
    if (wordCount < 600) {
      errors.push({
        field: 'wordCount',
        message: `Word count ${wordCount} is below minimum 600`,
        severity: 'error'
      })
    }
    
    // Validate structure sections
    const sections = this.extractSections(content)
    const requiredSections = ['hook', 'empathy', 'science', 'protocol', 'bridge']
    
    for (const section of requiredSections) {
      if (!sections.some(s => s.toLowerCase().includes(section))) {
        errors.push({
          field: 'structure',
          message: `Missing required section: ${section}`,
          severity: 'error'
        })
      }
    }
    
    // Validate H2 headings
    const h2Count = (content.match(/^## /gm) || []).length
    if (h2Count < 2) {
      errors.push({
        field: 'headings',
        message: `Only ${h2Count} H2 headings found, need at least 2`,
        severity: 'error'
      })
    }
    
    // Validate Q&A section
    const qaSection = content.match(/## שאלות ותשובות/i)
    if (!qaSection) {
      errors.push({
        field: 'qa',
        message: 'Missing Q&A section',
        severity: 'error'
      })
    } else {
      const qaQuestions = (content.match(/^### .+\?/gm) || []).length
      if (qaQuestions < 3 || qaQuestions > 5) {
        errors.push({
          field: 'qa',
          message: `Q&A section has ${qaQuestions} questions, need 3-5`,
          severity: 'error'
        })
      }
    }
    
    // Validate frontmatter
    const requiredFields = ['title', 'description', 'date', 'category', 'image']
    for (const field of requiredFields) {
      if (!frontmatter[field as keyof ArticleFrontmatter]) {
        errors.push({
          field: 'frontmatter',
          message: `Missing required frontmatter field: ${field}`,
          severity: 'error'
        })
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }
  
  private extractSections(content: string): string[] {
    const h2Matches = content.match(/^## (.+)$/gm) || []
    return h2Matches.map(h => h.replace(/^## /, ''))
  }
}
