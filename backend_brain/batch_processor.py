#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Batch Content Transformation System
Processes multiple Instagram posts and saves transformed articles
"""

import json
import os
from datetime import datetime
from typing import List, Dict
from content_transformer import ContentTransformer, TransformedArticle

class BatchProcessor:
    def __init__(self, input_file: str = 'lipedema-platform/site_content_db.json'):
        self.input_file = input_file
        self.transformer = ContentTransformer()
        self.output_dir = 'shared_data/transformed_articles'
        self.ensure_output_directory()
    
    def ensure_output_directory(self):
        """Create output directory if it doesn't exist"""
        os.makedirs(self.output_dir, exist_ok=True)
    
    def load_posts(self) -> List[Dict]:
        """Load Instagram posts from JSON file"""
        try:
            with open(self.input_file, 'r', encoding='utf-8') as f:
                posts = json.load(f)
            print(f"Loaded {len(posts)} posts from {self.input_file}")
            return posts
        except FileNotFoundError:
            print(f"Error: File {self.input_file} not found")
            return []
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            return []
    
    def transform_post_to_dict(self, article: TransformedArticle, original_post: Dict) -> Dict:
        """Convert TransformedArticle to dictionary for JSON serialization"""
        return {
            'id': original_post.get('id', ''),
            'original_title': original_post.get('title', ''),
            'original_url': original_post.get('original_url', ''),
            'transformed': {
                'title': article.title,
                'subtitle': article.subtitle,
                'content': article.content,
                'awareness_level': article.awareness_level.value,
                'category': article.category.value,
                'monetization_strategy': article.monetization_strategy,
                'call_to_action': article.call_to_action,
                'meta_description': article.meta_description,
                'keywords': article.keywords,
                'estimated_reading_time': article.estimated_reading_time
            },
            'transformation_date': datetime.now().isoformat(),
            'original_data': {
                'date': original_post.get('date', ''),
                'likes': original_post.get('likes', -1),
                'category_slug': original_post.get('category_slug', ''),
                'category_display': original_post.get('category_display', ''),
                'image_url': original_post.get('image_url', '')
            }
        }
    
    def process_batch(self, limit: int = None, start_index: int = 0) -> List[Dict]:
        """Process a batch of posts"""
        posts = self.load_posts()
        
        if not posts:
            return []
        
        # Apply limits
        if limit:
            posts = posts[start_index:start_index + limit]
        else:
            posts = posts[start_index:]
        
        transformed_articles = []
        
        print(f"Processing {len(posts)} posts...")
        
        for i, post in enumerate(posts, 1):
            try:
                print(f"Processing post {i}/{len(posts)}: {post.get('title', 'No title')[:50]}...")
                
                # Transform the post
                transformed = self.transformer.transform_post(post)
                
                # Convert to dictionary
                article_dict = self.transform_post_to_dict(transformed, post)
                transformed_articles.append(article_dict)
                
                print(f"✓ Transformed: {transformed.title[:50]}...")
                
            except Exception as e:
                print(f"✗ Error processing post {i}: {e}")
                continue
        
        return transformed_articles
    
    def save_transformed_articles(self, articles: List[Dict], filename: str = None):
        """Save transformed articles to JSON file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"transformed_articles_{timestamp}.json"
        
        output_path = os.path.join(self.output_dir, filename)
        
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(articles, f, ensure_ascii=False, indent=2)
            
            print(f"✓ Saved {len(articles)} transformed articles to {output_path}")
            return output_path
            
        except Exception as e:
            print(f"✗ Error saving articles: {e}")
            return None
    
    def generate_summary_report(self, articles: List[Dict]) -> Dict:
        """Generate summary report of transformation results"""
        if not articles:
            return {}
        
        # Count by awareness level
        awareness_counts = {}
        category_counts = {}
        monetization_counts = {}
        
        for article in articles:
            transformed = article['transformed']
            
            # Count awareness levels
            awareness = transformed['awareness_level']
            awareness_counts[awareness] = awareness_counts.get(awareness, 0) + 1
            
            # Count categories
            category = transformed['category']
            category_counts[category] = category_counts.get(category, 0) + 1
            
            # Count monetization strategies
            monetization = transformed['monetization_strategy']
            monetization_counts[monetization] = monetization_counts.get(monetization, 0) + 1
        
        # Calculate average reading time
        reading_times = [article['transformed']['estimated_reading_time'] for article in articles]
        avg_reading_time = sum(reading_times) / len(reading_times) if reading_times else 0
        
        return {
            'total_articles': len(articles),
            'awareness_level_distribution': awareness_counts,
            'category_distribution': category_counts,
            'monetization_distribution': monetization_counts,
            'average_reading_time': round(avg_reading_time, 1),
            'transformation_date': datetime.now().isoformat()
        }
    
    def save_summary_report(self, articles: List[Dict], filename: str = None):
        """Save summary report"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"transformation_summary_{timestamp}.json"
        
        output_path = os.path.join(self.output_dir, filename)
        summary = self.generate_summary_report(articles)
        
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(summary, f, ensure_ascii=False, indent=2)
            
            print(f"✓ Saved summary report to {output_path}")
            return output_path
            
        except Exception as e:
            print(f"✗ Error saving summary: {e}")
            return None
    
    def run_full_batch(self, limit: int = None, start_index: int = 0):
        """Run complete batch processing workflow"""
        print("=== BATCH CONTENT TRANSFORMATION ===")
        print(f"Input file: {self.input_file}")
        print(f"Output directory: {self.output_dir}")
        
        # Process articles
        articles = self.process_batch(limit=limit, start_index=start_index)
        
        if not articles:
            print("No articles were processed successfully.")
            return
        
        # Save articles
        articles_file = self.save_transformed_articles(articles)
        
        # Save summary
        summary_file = self.save_summary_report(articles)
        
        # Print summary
        summary = self.generate_summary_report(articles)
        print("\n=== TRANSFORMATION SUMMARY ===")
        print(f"Total articles processed: {summary['total_articles']}")
        print(f"Average reading time: {summary['average_reading_time']} minutes")
        
        print("\nAwareness Level Distribution:")
        for level, count in summary['awareness_level_distribution'].items():
            print(f"  {level}: {count}")
        
        print("\nCategory Distribution:")
        for category, count in summary['category_distribution'].items():
            print(f"  {category}: {count}")
        
        print("\nMonetization Strategy Distribution:")
        for strategy, count in summary['monetization_distribution'].items():
            print(f"  {strategy}: {count}")
        
        return {
            'articles_file': articles_file,
            'summary_file': summary_file,
            'summary': summary
        }

def main():
    """Main function for batch processing"""
    processor = BatchProcessor()
    
    # Process first 5 posts as a test
    print("Running test batch with first 5 posts...")
    result = processor.run_full_batch(limit=5, start_index=0)
    
    if result:
        print(f"\n✓ Batch processing completed successfully!")
        print(f"Articles saved to: {result['articles_file']}")
        print(f"Summary saved to: {result['summary_file']}")

if __name__ == "__main__":
    main()