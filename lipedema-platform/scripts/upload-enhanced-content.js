#!/usr/bin/env node
/**
 * Script to upload enhanced content directly to Supabase
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function mapCategory(categorySlug) {
  // Map to the exact categories expected by the database
  const categoryMap = {
    'diagnosis': 'Treatment',  // Map to existing category
    'nutrition': 'Nutrition', 
    'physical': 'Treatment',   // Map to existing category
    'mindset': 'Success'       // Map to existing category
  }
  return categoryMap[categorySlug] || 'Nutrition' // Default fallback
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\u0590-\u05FF\w\s-]/g, '') // Keep Hebrew, Latin, numbers, spaces, hyphens
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 100)
}

async function uploadContent() {
  try {
    // Read the enhanced content
    const contentPath = path.join(__dirname, '../site_content_db.json')
    const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'))
    
    console.log(`📥 Loading ${contentData.length} enhanced posts...`)
    
    // Clear existing posts (skip for now, just add new ones)
    console.log('📝 Adding new posts (keeping existing ones)...')
    
    let successCount = 0
    let errorCount = 0
    
    // Upload each post
    for (let i = 0; i < contentData.length; i++) {
      const post = contentData[i]
      
      try {
        const slug = generateSlug(post.title)
        
        const mappedCategory = mapCategory(post.category_slug)
        
        const { error } = await supabase
          .from('posts')
          .insert({
            title: post.title,
            content: post.content,
            slug: slug,
            category: mappedCategory,
            image_url: post.image_url,
            published: true
          })
        
        if (error) {
          console.error(`❌ Error uploading post ${i + 1}:`, error.message)
          errorCount++
        } else {
          console.log(`✅ [${i + 1}/${contentData.length}] Uploaded: ${post.title.substring(0, 50)}...`)
          successCount++
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (err) {
        console.error(`❌ Error processing post ${i + 1}:`, err.message)
        errorCount++
      }
    }
    
    console.log('\n📊 Upload Summary:')
    console.log(`✅ Successfully uploaded: ${successCount} posts`)
    console.log(`❌ Failed uploads: ${errorCount} posts`)
    console.log(`📝 Total processed: ${contentData.length} posts`)
    
    if (successCount > 0) {
      console.log('\n🎉 Enhanced content is now live on your website!')
      console.log('🌐 Visit http://localhost:3000/knowledge to see the results')
    }
    
  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

// Run the upload
uploadContent()