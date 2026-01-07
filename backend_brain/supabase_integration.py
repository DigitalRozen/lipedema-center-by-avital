#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Supabase Integration for Transformed Articles
Integrates transformed content with the lipedema platform database
"""

import json
import os
import re
from datetime import datetime
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class SupabaseArticle:
    """Article structure for Supabase database"""
    title: str
    subtitle: str
    content: str
    slug: str
    category: str
    awareness_level: str
    monetization_strategy: str
    meta_description: str
    keywords: List[str]
    estimated_reading_time: int
    original_instagram_id: str
    original_url: str
    image_url: str
    published: bool = False
    featured: bool = False

class SupabaseIntegration:
    def __init__(self):
        self.articles_table = 'posts'
        self.categories_table = 'categories'
        
    def create_slug(self, title: str) -> str:
        """Create URL-friendly slug from Hebrew title"""
        # Remove special characters and replace spaces with hyphens
        slug = re.sub(r'[^\w\s-]', '', title)
        slug = re.sub(r'[-\s]+', '-', slug)
        slug = slug.strip('-').lower()
        
        # If slug is empty or too short, create from first few words
        if len(slug) < 3:
            words = title.split()[:3]
            slug = '-'.join(words).lower()
            slug = re.sub(r'[^\w-]', '', slug)
        
        return slug[:50]  # Limit slug length
    
    def transform_to_supabase_format(self, transformed_articles: List[Dict]) -> List[SupabaseArticle]:
        """Transform articles to Supabase format"""
        supabase_articles = []
        
        for article_data in transformed_articles:
            transformed = article_data['transformed']
            original = article_data['original_data']
            
            # Create slug
            slug = self.create_slug(transformed['title'])
            
            # Map categories
            category_mapping = {
                'nutrition': 'nutrition',
                'physical': 'physical',
                'diagnosis': 'diagnosis',
                'mindset': 'mindset'
            }
            
            category = category_mapping.get(transformed['category'], 'general')
            
            supabase_article = SupabaseArticle(
                title=transformed['title'],
                subtitle=transformed['subtitle'],
                content=transformed['content'],
                slug=slug,
                category=category,
                awareness_level=transformed['awareness_level'],
                monetization_strategy=transformed['monetization_strategy'],
                meta_description=transformed['meta_description'],
                keywords=transformed['keywords'],
                estimated_reading_time=transformed['estimated_reading_time'],
                original_instagram_id=article_data['id'],
                original_url=article_data['original_url'],
                image_url=original.get('image_url', ''),
                published=False,  # Start as draft
                featured=False
            )
            
            supabase_articles.append(supabase_article)
        
        return supabase_articles
    
    def generate_sql_insert_statements(self, articles: List[SupabaseArticle]) -> str:
        """Generate SQL INSERT statements for Supabase"""
        sql_statements = []
        
        # Create table if not exists
        create_table_sql = """
-- Create posts table if not exists
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    awareness_level TEXT,
    monetization_strategy TEXT,
    meta_description TEXT,
    keywords TEXT[],
    estimated_reading_time INTEGER,
    original_instagram_id TEXT,
    original_url TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
"""
        
        sql_statements.append(create_table_sql)
        
        # Generate INSERT statements
        for article in articles:
            keywords_array = "{" + ",".join([f'"{k}"' for k in article.keywords]) + "}"
            
            insert_sql = f"""
-- Insert article: {article.title[:50]}...
INSERT INTO posts (
    title, subtitle, content, slug, category, awareness_level,
    monetization_strategy, meta_description, keywords, estimated_reading_time,
    original_instagram_id, original_url, image_url, published, featured
) VALUES (
    $${article.title}$$,
    $${article.subtitle}$$,
    $${article.content}$$,
    '{article.slug}',
    '{article.category}',
    '{article.awareness_level}',
    '{article.monetization_strategy}',
    $${article.meta_description}$$,
    '{keywords_array}',
    {article.estimated_reading_time},
    '{article.original_instagram_id}',
    '{article.original_url}',
    '{article.image_url}',
    {str(article.published).lower()},
    {str(article.featured).lower()}
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    category = EXCLUDED.category,
    awareness_level = EXCLUDED.awareness_level,
    monetization_strategy = EXCLUDED.monetization_strategy,
    meta_description = EXCLUDED.meta_description,
    keywords = EXCLUDED.keywords,
    estimated_reading_time = EXCLUDED.estimated_reading_time,
    updated_at = NOW();
"""
            sql_statements.append(insert_sql)
        
        return "\n".join(sql_statements)
    
    def generate_nextjs_import_script(self, articles: List[SupabaseArticle]) -> str:
        """Generate Next.js script for importing articles"""
        script = '''
// Next.js script to import transformed articles into Supabase
// Run this in your Next.js project: node scripts/import-transformed-articles.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const articles = [
'''
        
        for i, article in enumerate(articles):
            article_json = {
                'title': article.title,
                'subtitle': article.subtitle,
                'content': article.content,
                'slug': article.slug,
                'category': article.category,
                'awareness_level': article.awareness_level,
                'monetization_strategy': article.monetization_strategy,
                'meta_description': article.meta_description,
                'keywords': article.keywords,
                'estimated_reading_time': article.estimated_reading_time,
                'original_instagram_id': article.original_instagram_id,
                'original_url': article.original_url,
                'image_url': article.image_url,
                'published': article.published,
                'featured': article.featured
            }
            
            script += f"  {json.dumps(article_json, ensure_ascii=False, indent=2)}"
            if i < len(articles) - 1:
                script += ","
            script += "\n"
        
        script += ''']

async function importArticles() {
  console.log(`Importing ${articles.length} transformed articles...`)
  
  for (const article of articles) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .upsert(article, { 
          onConflict: 'slug',
          ignoreDuplicates: false 
        })
      
      if (error) {
        console.error(`Error importing article "${article.title}":`, error)
      } else {
        console.log(`✓ Imported: ${article.title}`)
      }
    } catch (err) {
      console.error(`Exception importing article "${article.title}":`, err)
    }
  }
  
  console.log('Import completed!')
}

importArticles().catch(console.error)
'''
        
        return script
    
    def save_integration_files(self, articles: List[SupabaseArticle], output_dir: str = 'shared_data/supabase_integration'):
        """Save integration files"""
        os.makedirs(output_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save SQL file
        sql_content = self.generate_sql_insert_statements(articles)
        sql_file = os.path.join(output_dir, f'articles_migration_{timestamp}.sql')
        
        with open(sql_file, 'w', encoding='utf-8') as f:
            f.write(sql_content)
        
        # Save Next.js script
        nextjs_script = self.generate_nextjs_import_script(articles)
        js_file = os.path.join(output_dir, f'import_articles_{timestamp}.js')
        
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(nextjs_script)
        
        # Save articles as JSON for reference
        articles_data = []
        for article in articles:
            articles_data.append({
                'title': article.title,
                'subtitle': article.subtitle,
                'content': article.content,
                'slug': article.slug,
                'category': article.category,
                'awareness_level': article.awareness_level,
                'monetization_strategy': article.monetization_strategy,
                'meta_description': article.meta_description,
                'keywords': article.keywords,
                'estimated_reading_time': article.estimated_reading_time,
                'original_instagram_id': article.original_instagram_id,
                'original_url': article.original_url,
                'image_url': article.image_url,
                'published': article.published,
                'featured': article.featured
            })
        
        json_file = os.path.join(output_dir, f'articles_data_{timestamp}.json')
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(articles_data, f, ensure_ascii=False, indent=2)
        
        return {
            'sql_file': sql_file,
            'js_file': js_file,
            'json_file': json_file
        }
    
    def process_transformed_articles(self, transformed_articles_file: str):
        """Process transformed articles and create integration files"""
        # Load transformed articles
        with open(transformed_articles_file, 'r', encoding='utf-8') as f:
            transformed_articles = json.load(f)
        
        # Convert to Supabase format
        supabase_articles = self.transform_to_supabase_format(transformed_articles)
        
        # Save integration files
        files = self.save_integration_files(supabase_articles)
        
        print(f"✓ Created integration files:")
        print(f"  SQL Migration: {files['sql_file']}")
        print(f"  Next.js Script: {files['js_file']}")
        print(f"  JSON Data: {files['json_file']}")
        
        return files

def main():
    """Main function for Supabase integration"""
    integration = SupabaseIntegration()
    
    # Find the latest transformed articles file
    articles_dir = 'shared_data/transformed_articles'
    if not os.path.exists(articles_dir):
        print("No transformed articles found. Run batch_processor.py first.")
        return
    
    # Get the latest file
    files = [f for f in os.listdir(articles_dir) if f.startswith('transformed_articles_') and f.endswith('.json')]
    if not files:
        print("No transformed articles files found.")
        return
    
    latest_file = sorted(files)[-1]
    articles_file = os.path.join(articles_dir, latest_file)
    
    print(f"Processing: {articles_file}")
    
    # Process articles
    result = integration.process_transformed_articles(articles_file)
    
    print("\n=== INTEGRATION COMPLETE ===")
    print("You can now:")
    print("1. Run the SQL migration in your Supabase dashboard")
    print("2. Use the Next.js script to import articles programmatically")
    print("3. Review the JSON data for manual import")

if __name__ == "__main__":
    main()