// Core type definitions for the batch article rewriter

export interface ArticleFrontmatter {
  title: string
  description: string
  date: string
  category: 'nutrition' | 'diagnosis' | 'physical' | 'mindset'
  image: string
  keywords: string[]
  originalPostId?: string
}

export interface MDXArticle {
  filePath: string
  slug: string
  frontmatter: ArticleFrontmatter
  content: string
  wordCount: number
}

export interface ArticleInventory {
  articles: MDXArticle[]
  totalCount: number
  weakArticles: MDXArticle[]
  strongArticles: MDXArticle[]
}

export interface ArticleClassification {
  isWeak: boolean
  wordCount: number
  threshold: number
}

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

export interface RewrittenArticle {
  frontmatter: ArticleFrontmatter
  content: string
  wordCount: number
  metadata: RewriteMetadata
}

export interface RewriteMetadata {
  originalWordCount: number
  newWordCount: number
  sectionsGenerated: string[]
  qaCount: number
  internalLinksCount: number
  timestamp: Date
}

export interface QAPair {
  question: string
  answer: string
}
