#!/usr/bin/env python3
"""
Lipedema Authority Platform - Data Processor
Backend Architect & Data Engineer

Processes raw Instagram JSON data into structured content for the frontend.
Handles categorization, tagging, and monetization strategy assignment.
"""

import json
import re
import hashlib
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict


@dataclass
class ProcessedPost:
    """Structured post data for frontend consumption"""
    id: str
    title: str
    content: str
    excerpt: str
    image_url: Optional[str]
    date: str
    category_slug: str
    category_display: str
    monetization_strategy: str
    original_url: str
    tags: List[str]
    slug: str
    published: bool = True
    likes_count: int = 0
    comments_count: int = 0


@dataclass
class ProcessedProduct:
    """Product data structure for affiliate/digital products"""
    id: str
    name: str
    type: str  # "Physical" or "Digital"
    price: float
    currency: str
    description: str
    image_url: Optional[str]
    affiliate_link: str
    trigger_tags: List[str]
    active: bool = True


class ContentProcessor:
    """Main data processing engine for Instagram content"""
    
    def __init__(self):
        self.categories = {
            "diagnosis": {
                "keywords": ["אבחון", "סימפטום", "סימנים", "דרגה", "שלב", "זיהוי", "רופא", "בדיקה", "מחלה", "ליפדמה", "לימפדמה"],
                "title": "אבחון וזיהוי",
                "monetization": "High Ticket (Clinic Lead)",
                "tags": ["אבחון", "סימפטומים", "זיהוי_מוקדם", "רפואי"]
            },
            "nutrition": {
                "keywords": ["תזונה", "אוכל", "מתכון", "דלקת", "סוכר", "גלוטן", "תוסף", "ויטמין", "נוטריציה", "דיאטה", "משקל"],
                "title": "תזונה ונוטריציה", 
                "monetization": "Low Ticket (Digital Guide)",
                "tags": ["תזונה", "דלקת", "דיאטה", "ויטמינים", "תוספי_מזון"]
            },
            "physical": {
                "keywords": ["עיסוי", "לימפתי", "גרבי לחץ", "ניתוח", "כאב", "נפיחות", "רגליים", "מכשיר", "יבש", "דחיסה", "תרגיל"],
                "title": "טיפול פיזי ושיקום",
                "monetization": "Affiliate (Products)",
                "tags": ["עיסוי_לימפתי", "גרבי_דחיסה", "תרגילים", "מכשירים", "טיפול_פיזי"]
            },
            "mindset": {
                "keywords": ["רגש", "נפש", "דימוי גוף", "ביטחון", "בושה", "התמודדות", "מראה", "מיינדסט", "חרדה", "דיכאון"],
                "title": "מיינדסט ורגש",
                "monetization": "High Ticket (Clinic Lead)",
                "tags": ["דימוי_גוף", "רגשות", "התמודדות", "ביטחון_עצמי", "תמיכה_נפשית"]
            }
        }
        
        # Sample product data - will be expanded
        self.products = [
            {
                "id": "lympha-press-optimal",
                "name": "Lympha Press Optimal Plus",
                "type": "Physical",
                "price": 12000,
                "currency": "₪",
                "description": "מכשיר דחיסה פנאומטי מתקדם לטיפול בליפדמה ולימפדמה",
                "image_url": "https://example.com/lympha-press.jpg",
                "affiliate_link": "https://affiliate.link/lympha-press",
                "trigger_tags": ["עיסוי_לימפתי", "מכשירים", "דחיסה", "טיפול_פיזי"]
            },
            {
                "id": "compression-socks-medical",
                "name": "גרבי דחיסה רפואיות",
                "type": "Physical", 
                "price": 299,
                "currency": "₪",
                "description": "גרבי דחיסה איכותיות לתמיכה בזרימת הלימפה",
                "image_url": "https://example.com/compression-socks.jpg",
                "affiliate_link": "https://affiliate.link/compression-socks",
                "trigger_tags": ["גרבי_דחיסה", "טיפול_פיזי", "נפיחות"]
            },
            {
                "id": "nutrition-guide-digital",
                "name": "מדריך התזונה לליפדמה",
                "type": "Digital",
                "price": 149,
                "currency": "₪", 
                "description": "מדריך מקיף עם תפריטים מותאמים לליפדמה",
                "image_url": "https://example.com/nutrition-guide.jpg",
                "affiliate_link": "https://checkout.link/nutrition-guide",
                "trigger_tags": ["תזונה", "דיאטה", "דלקת", "מדריך"]
            }
        ]

    def clean_text(self, text: str) -> str:
        """Clean and normalize text content"""
        if not text:
            return ""
        
        # Remove hashtags at the end
        text = re.sub(r'#\S+', '', text).strip()
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        
        return text

    def extract_title(self, text: str) -> str:
        """Extract meaningful title from content"""
        if not text:
            return "פוסט ללא כותרת"
        
        # Take first meaningful line, up to 60 characters
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            if len(line) > 10:  # Skip very short lines
                title = line[:60]
                if len(line) > 60:
                    title += "..."
                return title
        
        # Fallback to first 60 characters
        return text[:60] + ("..." if len(text) > 60 else "")

    def extract_excerpt(self, text: str) -> str:
        """Create excerpt for post previews"""
        if not text:
            return ""
        
        # Take first 150 characters
        excerpt = text[:150]
        if len(text) > 150:
            excerpt += "..."
        
        return excerpt

    def categorize_post(self, text: str) -> tuple[str, List[str]]:
        """Categorize post and extract relevant tags"""
        if not text:
            return "general", []
        
        text_lower = text.lower()
        scores = {cat: 0 for cat in self.categories.keys()}
        matched_tags = set()
        
        # Score categories based on keyword matches
        for cat, data in self.categories.items():
            for keyword in data['keywords']:
                if keyword in text_lower:
                    scores[cat] += 1
                    # Add relevant tags
                    matched_tags.update(data['tags'])
        
        # Find best category
        best_cat = max(scores, key=scores.get) if max(scores.values()) > 0 else "general"
        
        return best_cat, list(matched_tags)

    def generate_slug(self, title: str, post_id: str) -> str:
        """Generate URL-friendly slug"""
        # Remove Hebrew characters and special chars, keep basic structure
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        slug = slug.strip('-')
        
        # If slug is empty or too short, use post ID
        if len(slug) < 3:
            slug = f"post-{post_id}"
        
        return slug

    def process_instagram_data(self, raw_data: List[Dict]) -> Dict[str, Any]:
        """Process raw Instagram JSON into structured content database"""
        processed_posts = []
        
        print(f"Processing {len(raw_data)} Instagram posts...")
        
        for item in raw_data:
            try:
                # Extract basic data
                post_id = str(item.get('id', ''))
                caption = item.get('caption', '')
                
                if not caption or not post_id:
                    continue
                
                # Clean and process content
                clean_content = self.clean_text(caption)
                if len(clean_content) < 20:  # Skip very short posts
                    continue
                
                title = self.extract_title(clean_content)
                excerpt = self.extract_excerpt(clean_content)
                category_key, tags = self.categorize_post(clean_content)
                
                # Skip uncategorized posts
                if category_key == "general":
                    continue
                
                category_data = self.categories.get(category_key, {})
                
                # Create structured post
                post = ProcessedPost(
                    id=post_id,
                    title=title,
                    content=clean_content,
                    excerpt=excerpt,
                    image_url=item.get('displayUrl') or item.get('display_url'),
                    date=item.get('timestamp', datetime.now().isoformat()),
                    category_slug=category_key,
                    category_display=category_data.get('title', 'כללי'),
                    monetization_strategy=category_data.get('monetization', 'None'),
                    original_url=f"https://www.instagram.com/p/{item.get('shortCode')}/" if item.get('shortCode') else "",
                    tags=tags,
                    slug=self.generate_slug(title, post_id),
                    likes_count=item.get('likesCount', 0),
                    comments_count=item.get('commentsCount', 0)
                )
                
                processed_posts.append(asdict(post))
                
            except Exception as e:
                print(f"Error processing post {item.get('id', 'unknown')}: {e}")
                continue
        
        # Process products
        processed_products = []
        for product_data in self.products:
            product = ProcessedProduct(**product_data)
            processed_products.append(asdict(product))
        
        # Create final database structure
        content_db = {
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "total_posts": len(processed_posts),
                "total_products": len(processed_products),
                "categories": {
                    cat: {
                        "title": data["title"],
                        "count": len([p for p in processed_posts if p["category_slug"] == cat])
                    }
                    for cat, data in self.categories.items()
                }
            },
            "posts": processed_posts,
            "products": processed_products,
            "categories": {
                cat: {
                    "slug": cat,
                    "title": data["title"],
                    "monetization": data["monetization"]
                }
                for cat, data in self.categories.items()
            }
        }
        
        print(f"Successfully processed {len(processed_posts)} posts and {len(processed_products)} products")
        return content_db

    def save_content_db(self, content_db: Dict[str, Any], output_path: str = "shared_data/content_db.json"):
        """Save processed content database to JSON file"""
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(content_db, f, ensure_ascii=False, indent=2)
        
        print(f"Content database saved to: {output_path}")


def main():
    """Main processing function"""
    processor = ContentProcessor()
    
    # Load raw Instagram data
    try:
        with open('dataset_instagram2026-01-03.json', 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
    except FileNotFoundError:
        print("Error: dataset_instagram2026-01-03.json not found")
        return
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return
    
    # Process data
    content_db = processor.process_instagram_data(raw_data)
    
    # Save to shared data directory
    processor.save_content_db(content_db)
    
    # Print summary
    print("\n=== Processing Summary ===")
    print(f"Total posts: {content_db['metadata']['total_posts']}")
    print(f"Total products: {content_db['metadata']['total_products']}")
    print("\nCategory breakdown:")
    for cat, info in content_db['metadata']['categories'].items():
        print(f"  {info['title']}: {info['count']} posts")


if __name__ == "__main__":
    main()