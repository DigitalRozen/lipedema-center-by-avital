#!/usr/bin/env node

/**
 * Upload SEO Articles to Supabase
 * Run this script from the lipedema-platform directory:
 * node scripts/upload-seo-articles.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const ARTICLES_JSON = '../seo_articles_for_upload.json';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

class SEOArticleUploader {
  constructor() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('❌ Error: Missing Supabase environment variables');
      console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }

    this.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    console.log('✅ Connected to Supabase');
  }

  loadArticles() {
    const articlesPath = path.resolve(__dirname, ARTICLES_JSON);
    
    if (!fs.existsSync(articlesPath)) {
      console.error(`❌ Error: ${ARTICLES_JSON} not found!`);
      console.error('Please run upload_seo_articles.py first to generate the JSON file.');
      return null;
    }

    try {
      const data = fs.readFileSync(articlesPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`❌ Error reading articles file: ${error.message}`);
      return null;
    }
  }

  async checkExistingPost(originalUrl) {
    if (!originalUrl) return false;

    try {
      const { data, error } = await this.supabase
        .from('posts')
        .select('id')
        .eq('original_url', originalUrl)
        .single();

      return !error && data;
    } catch (error) {
      console.warn(`Warning: Could not check existing post: ${error.message}`);
      return false;
    }
  }

  async uploadArticle(article) {
    try {
      // Check if already exists
      if (article.original_url && await this.checkExistingPost(article.original_url)) {
        return { success: false, message: 'Article already exists' };
      }

      // Prepare data for Supabase posts table
      const postData = {
        title: article.title,
        content: article.content,
        slug: article.slug,
        category: article.category,
        category_display: article.category_display || '',
        image_url: article.image_url || '',
        date: article.date || new Date().toISOString(),
        monetization_strategy: article.monetization_strategy || '',
        original_url: article.original_url || '',
        published: false, // Start as draft
        excerpt: article.excerpt || '',
        tags: article.tags || []
      };

      // Insert into Supabase
      const { data, error } = await this.supabase
        .from('posts')
        .insert(postData)
        .select();

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data[0] };

    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async uploadAllArticles() {
    console.log('🚀 Starting SEO Articles Upload...');

    // Load articles
    const articles = this.loadArticles();
    if (!articles) {
      return;
    }

    console.log(`📄 Loaded ${articles.length} articles`);

    // Upload statistics
    let uploaded = 0;
    let skipped = 0;
    let failed = 0;
    const errors = [];

    // Upload each article
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const titlePreview = (article.title || 'Unknown').substring(0, 50);
      
      console.log(`[${i + 1}/${articles.length}] Uploading: ${titlePreview}...`);

      const result = await this.uploadArticle(article);

      if (result.success) {
        uploaded++;
        console.log('✅ Success');
      } else if (result.message.includes('already exists')) {
        skipped++;
        console.log('⏭️  Skipped (already exists)');
      } else {
        failed++;
        errors.push({
          title: titlePreview,
          error: result.message
        });
        console.log(`❌ Failed: ${result.message}`);
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Print summary
    console.log('\n📊 Upload Summary:');
    console.log(`✅ Successfully uploaded: ${uploaded}`);
    console.log(`⏭️  Skipped (existing): ${skipped}`);
    console.log(`❌ Failed uploads: ${failed}`);
    console.log(`📄 Total processed: ${articles.length}`);

    if (errors.length > 0) {
      console.log('\n❌ Upload Errors:');
      errors.slice(0, 5).forEach(error => {
        console.log(`   - ${error.title}: ${error.error}`);
      });
      if (errors.length > 5) {
        console.log(`   ... and ${errors.length - 5} more errors`);
      }
    }

    // Generate report
    this.generateReport(uploaded, skipped, failed, errors);
  }

  generateReport(uploaded, skipped, failed, errors) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        uploaded,
        skipped,
        failed,
        total: uploaded + skipped + failed
      },
      errors
    };

    const reportFile = `seo_upload_report_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');
    console.log(`📋 Upload report saved: ${reportFile}`);
  }
}

// Main execution
async function main() {
  try {
    const uploader = new SEOArticleUploader();
    await uploader.uploadAllArticles();
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    process.exit(1);
  }
}

main();