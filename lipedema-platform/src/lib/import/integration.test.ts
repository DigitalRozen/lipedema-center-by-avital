import { describe, it, expect } from 'vitest'
import { parseInstagramExport } from './contentImporter'
import fs from 'fs'
import path from 'path'

describe('Import Integration', () => {
  it('should successfully parse the sample site_content_db.json file', () => {
    // Read the actual sample file
    const sampleFilePath = path.join(process.cwd(), 'site_content_db.json')
    
    // Check if file exists
    if (!fs.existsSync(sampleFilePath)) {
      console.log('Sample file not found, skipping integration test')
      return
    }

    const fileContent = fs.readFileSync(sampleFilePath, 'utf-8')
    
    // Parse the content
    const posts = parseInstagramExport(fileContent)
    
    // Verify parsing succeeded
    expect(posts).not.toBeNull()
    expect(posts!.length).toBeGreaterThan(0)
    
    // Verify first post structure
    const firstPost = posts![0]
    expect(firstPost).toHaveProperty('id')
    expect(firstPost).toHaveProperty('title')
    expect(firstPost).toHaveProperty('content')
    expect(firstPost).toHaveProperty('image_url')
    expect(firstPost).toHaveProperty('date')
    expect(firstPost).toHaveProperty('category_slug')
    expect(firstPost).toHaveProperty('category_display')
    expect(firstPost).toHaveProperty('monetization_strategy')
    expect(firstPost).toHaveProperty('original_url')
    
    // Verify valid category and strategy values
    const validCategories = ['diagnosis', 'nutrition', 'physical', 'mindset', 'all']
    const validStrategies = [
      'Affiliate (Products)',
      'Low Ticket (Digital Guide)', 
      'High Ticket (Clinic Lead)'
    ]
    
    expect(validCategories).toContain(firstPost.category_slug)
    expect(validStrategies).toContain(firstPost.monetization_strategy)
    
    console.log(`Successfully parsed ${posts!.length} posts from sample file`)
  })
})