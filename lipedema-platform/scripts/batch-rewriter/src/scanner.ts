// Article Scanner - scans directory and parses MDX files

import * as fs from 'fs/promises'
import * as path from 'path'
import matter from 'gray-matter'
import { MDXArticle, ArticleInventory, ArticleFrontmatter } from './types'
import { countWords } from './analyzer'

export class ArticleScanner {
  async scanDirectory(dirPath: string): Promise<ArticleInventory> {
    const files = await fs.readdir(dirPath)
    const mdxFiles = files.filter(f => f.endsWith('.mdx'))
    
    const articles: MDXArticle[] = []
    
    for (const file of mdxFiles) {
      const filePath = path.join(dirPath, file)
      try {
        const article = await this.readMDXFile(filePath)
        articles.push(article)
      } catch (error) {
        // Skip invalid files
        continue
      }
    }
    
    return {
      articles,
      totalCount: articles.length,
      weakArticles: [],
      strongArticles: []
    }
  }
  
  async readMDXFile(filePath: string): Promise<MDXArticle> {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const { data, content } = this.parseMDX(fileContent)
    
    const slug = path.basename(filePath, '.mdx')
    const wordCount = countWords(content)
    
    return {
      filePath,
      slug,
      frontmatter: data as ArticleFrontmatter,
      content,
      wordCount
    }
  }
  
  parseMDX(fileContent: string): { data: any; content: string } {
    // Find frontmatter delimiters
    const lines = fileContent.split('\n')
    
    if (lines[0] !== '---') {
      throw new Error('Invalid MDX: Missing opening frontmatter delimiter')
    }
    
    let closingIndex = -1
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        closingIndex = i
        break
      }
    }
    
    if (closingIndex === -1) {
      throw new Error('Invalid MDX: Missing closing frontmatter delimiter')
    }
    
    // Extract content after closing delimiter
    const content = lines.slice(closingIndex + 1).join('\n').trim()
    
    // Parse with gray-matter
    const parsed = matter(fileContent)
    
    return {
      data: parsed.data,
      content
    }
  }
}
