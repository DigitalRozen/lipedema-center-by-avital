#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Process new articles with content transformation and product matching
"""

import json
import sys
import os

# Add backend_brain to path
sys.path.append('backend_brain')

from backend_brain.content_transformer import ContentTransformer
from backend_brain.product_manager import ProductManager

def main():
    # Load new articles
    with open('new_articles_input.json', 'r', encoding='utf-8') as f:
        articles = json.load(f)

    # Initialize transformer and product manager
    transformer = ContentTransformer()
    product_manager = ProductManager()

    # Process each article
    processed_articles = []

    for article in articles:
        print(f'Processing: {article["title"]}')
        
        # Transform the article
        transformed = transformer.transform_post(article)
        
        # Get relevant products based on category and content
        relevant_products = product_manager.get_products_by_category(transformed.category.value)
        
        # Also get products by content tags (extract key terms from content)
        content_tags = []
        content_lower = transformed.content.lower()
        
        # Extract relevant tags from content
        tag_mapping = {
            'עיסוי': 'עיסוי_לימפתי',
            'לימפה': 'עיסוי_לימפתי', 
            'נפיחות': 'נפיחות',
            'דחיסה': 'דחיסה',
            'גרבי': 'גרבי_דחיסה',
            'מכשיר': 'מכשירים',
            'תזונה': 'תזונה',
            'דלקת': 'דלקת',
            'ויטמין': 'ויטמינים',
            'תרגיל': 'תרגילים'
        }
        
        for keyword, tag in tag_mapping.items():
            if keyword in content_lower:
                content_tags.append(tag)
        
        # Get additional products by tags
        if content_tags:
            tag_products = product_manager.get_products_by_tags(content_tags)
            # Merge and deduplicate
            product_ids = {p['id'] for p in relevant_products}
            for product in tag_products:
                if product['id'] not in product_ids:
                    relevant_products.append(product)
                    product_ids.add(product['id'])
        
        # Limit to top 5 most relevant products
        relevant_products = relevant_products[:5]
        
        # Create processed article
        processed_article = {
            'id': article['id'],
            'original': article,
            'transformed': {
                'title': transformed.title,
                'subtitle': transformed.subtitle,
                'content': transformed.content,
                'awareness_level': transformed.awareness_level.value,
                'category': transformed.category.value,
                'monetization_strategy': transformed.monetization_strategy,
                'call_to_action': transformed.call_to_action,
                'meta_description': transformed.meta_description,
                'keywords': transformed.keywords,
                'estimated_reading_time': transformed.estimated_reading_time
            },
            'relevant_products': relevant_products,
            'processing_timestamp': '2026-01-07T18:30:00'
        }
        
        processed_articles.append(processed_article)
        print(f'✓ Processed with {len(relevant_products)} relevant products')

    # Ensure output directory exists
    os.makedirs('shared_data', exist_ok=True)

    # Save processed articles
    with open('shared_data/new_processed_articles.json', 'w', encoding='utf-8') as f:
        json.dump(processed_articles, f, ensure_ascii=False, indent=2)

    print(f'\n✅ Successfully processed {len(processed_articles)} articles')
    print('📁 Saved to: shared_data/new_processed_articles.json')

    # Print summary
    print('\n📊 Processing Summary:')
    for article in processed_articles:
        print(f"- {article['transformed']['title']}")
        print(f"  Category: {article['transformed']['category']}")
        print(f"  Awareness: {article['transformed']['awareness_level']}")
        print(f"  Products: {len(article['relevant_products'])}")
        print(f"  Reading time: {article['transformed']['estimated_reading_time']} min")
        print()

if __name__ == "__main__":
    main()