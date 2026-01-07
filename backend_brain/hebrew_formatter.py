#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Hebrew RTL Formatting for Transformed Articles
Handles Hebrew text formatting, RTL considerations, and content optimization
"""

import re
from typing import Dict, List
from dataclasses import dataclass

@dataclass
class HebrewFormattingRules:
    """Hebrew formatting rules and patterns"""
    # Hebrew punctuation and formatting
    hebrew_punctuation = ['״', '׳', '־', '׀', '׃', '׆']
    
    # Common Hebrew prefixes that should not be separated
    hebrew_prefixes = ['ב', 'ל', 'מ', 'ש', 'ה', 'ו', 'כ']
    
    # Hebrew numerals
    hebrew_numerals = {
        'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
        'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
        'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
    }

class HebrewFormatter:
    def __init__(self):
        self.rules = HebrewFormattingRules()
    
    def is_hebrew_text(self, text: str) -> bool:
        """Check if text contains Hebrew characters"""
        hebrew_pattern = r'[\u0590-\u05FF]'
        return bool(re.search(hebrew_pattern, text))
    
    def add_rtl_markers(self, content: str) -> str:
        """Add RTL direction markers for proper display"""
        # Add RTL marker at the beginning of Hebrew paragraphs
        lines = content.split('\n')
        formatted_lines = []
        
        for line in lines:
            if line.strip() and self.is_hebrew_text(line):
                # Add RTL marker for Hebrew content
                if not line.startswith('<div dir="rtl">'):
                    line = f'<div dir="rtl">{line}</div>'
            formatted_lines.append(line)
        
        return '\n'.join(formatted_lines)
    
    def fix_hebrew_punctuation(self, text: str) -> str:
        """Fix Hebrew punctuation and spacing"""
        # Fix spacing around Hebrew punctuation
        text = re.sub(r'\s+([״׳])', r'\1', text)  # Remove space before geresh/gershayim
        text = re.sub(r'([״׳])\s+', r'\1 ', text)  # Ensure single space after
        
        # Fix Hebrew dash (maqaf)
        text = re.sub(r'\s*-\s*', '־', text)  # Replace regular dash with Hebrew maqaf
        
        # Fix quotation marks for Hebrew
        text = re.sub(r'"([^"]*)"', r'״\1״', text)  # Replace English quotes with Hebrew
        
        return text
    
    def optimize_hebrew_line_breaks(self, content: str) -> str:
        """Optimize line breaks for Hebrew text readability"""
        # Avoid breaking Hebrew words with prefixes
        for prefix in self.rules.hebrew_prefixes:
            pattern = f'\\b{prefix}\\s+'
            replacement = f'{prefix}'
            content = re.sub(pattern, replacement, content)
        
        return content
    
    def format_hebrew_lists(self, content: str) -> str:
        """Format Hebrew lists with proper RTL bullets"""
        # Replace regular bullets with Hebrew-appropriate ones
        content = re.sub(r'^- ', '• ', content, flags=re.MULTILINE)
        content = re.sub(r'^\* ', '• ', content, flags=re.MULTILINE)
        
        # For numbered lists, use Hebrew numerals where appropriate
        def replace_numbers(match):
            num = int(match.group(1))
            if num <= 10:
                hebrew_nums = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י']
                return f"{hebrew_nums[num-1]}. "
            return match.group(0)
        
        content = re.sub(r'^(\d+)\. ', replace_numbers, content, flags=re.MULTILINE)
        
        return content
    
    def add_hebrew_typography(self, content: str) -> str:
        """Add Hebrew typography enhancements"""
        # Enhance emphasis markers for Hebrew
        content = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', content)
        content = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', content)
        
        # Add proper spacing for Hebrew headers
        content = re.sub(r'^(#{1,6})\s*(.+)$', r'\1 \2', content, flags=re.MULTILINE)
        
        return content
    
    def format_hebrew_content(self, content: str) -> str:
        """Apply all Hebrew formatting rules"""
        # Apply formatting in order
        content = self.fix_hebrew_punctuation(content)
        content = self.optimize_hebrew_line_breaks(content)
        content = self.format_hebrew_lists(content)
        content = self.add_hebrew_typography(content)
        
        return content
    
    def create_rtl_css_classes(self) -> str:
        """Generate CSS classes for RTL Hebrew content"""
        css = """
/* Hebrew RTL Content Styles */
.hebrew-content {
    direction: rtl;
    text-align: right;
    font-family: 'Heebo', 'Assistant', 'Rubik', sans-serif;
    line-height: 1.7;
}

.hebrew-content h1,
.hebrew-content h2,
.hebrew-content h3,
.hebrew-content h4,
.hebrew-content h5,
.hebrew-content h6 {
    direction: rtl;
    text-align: right;
    font-family: 'Playfair Display', 'Frank Ruhl Libre', serif;
    font-weight: 700;
}

.hebrew-content p {
    direction: rtl;
    text-align: right;
    margin-bottom: 1rem;
}

.hebrew-content ul,
.hebrew-content ol {
    direction: rtl;
    text-align: right;
    padding-right: 1.5rem;
    padding-left: 0;
}

.hebrew-content li {
    direction: rtl;
    text-align: right;
    margin-bottom: 0.5rem;
}

.hebrew-content blockquote {
    direction: rtl;
    text-align: right;
    border-right: 4px solid #e5e7eb;
    border-left: none;
    padding-right: 1rem;
    padding-left: 0;
    margin-right: 0;
    font-style: italic;
}

.hebrew-content .cta-button {
    direction: rtl;
    text-align: center;
    font-family: 'Heebo', sans-serif;
    font-weight: 600;
}

/* Responsive Hebrew typography */
@media (max-width: 768px) {
    .hebrew-content {
        font-size: 16px;
        line-height: 1.6;
    }
    
    .hebrew-content h1 { font-size: 1.8rem; }
    .hebrew-content h2 { font-size: 1.5rem; }
    .hebrew-content h3 { font-size: 1.3rem; }
}
"""
        return css
    
    def format_article_for_web(self, article_dict: Dict) -> Dict:
        """Format article for web display with Hebrew RTL support"""
        transformed = article_dict['transformed'].copy()
        
        # Format content
        transformed['content'] = self.format_hebrew_content(transformed['content'])
        
        # Add RTL metadata
        transformed['rtl_support'] = True
        transformed['language'] = 'he'
        transformed['text_direction'] = 'rtl'
        
        # Format title and subtitle
        transformed['title'] = self.fix_hebrew_punctuation(transformed['title'])
        transformed['subtitle'] = self.fix_hebrew_punctuation(transformed['subtitle'])
        
        # Format meta description
        transformed['meta_description'] = self.fix_hebrew_punctuation(transformed['meta_description'])
        
        # Update the article
        article_dict['transformed'] = transformed
        article_dict['hebrew_formatted'] = True
        
        return article_dict
    
    def generate_nextjs_component_template(self, article: Dict) -> str:
        """Generate Next.js component template for Hebrew article"""
        transformed = article['transformed']
        
        template = f'''
import {{ Metadata }} from 'next'
import {{ notFound }} from 'next/navigation'

// Article: {transformed['title']}
// Generated from Instagram post: {article['original_url']}

export const metadata: Metadata = {{
  title: '{transformed['title']}',
  description: '{transformed['meta_description']}',
  keywords: {transformed['keywords']},
  openGraph: {{
    title: '{transformed['title']}',
    description: '{transformed['meta_description']}',
    type: 'article',
    locale: 'he_IL',
  }},
  alternates: {{
    canonical: '/knowledge/{transformed.get('slug', 'article')}',
  }},
}}

export default function ArticlePage() {{
  return (
    <article className="hebrew-content max-w-4xl mx-auto px-4 py-8" dir="rtl">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {transformed['title']}
        </h1>
        {{transformed['subtitle'] && (
          <p className="text-xl text-gray-600 mb-6">
            {transformed['subtitle']}
          </p>
        )}}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>זמן קריאה: {transformed['estimated_reading_time']} דקות</span>
          <span>קטגוריה: {transformed['category']}</span>
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{{{ __html: `{transformed['content']}` }}}} />
      </div>
      
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-4">
            מאמר זה נוצר על בסיס תוכן מקורי מאינסטגרם של אביטל רוזן
          </p>
          <a 
            href="{article['original_url']}" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            צפייה בפוסט המקורי ←
          </a>
        </div>
      </footer>
    </article>
  )
}}
'''
        return template

def main():
    """Test Hebrew formatting"""
    formatter = HebrewFormatter()
    
    # Test content
    test_content = """
# כותרת ראשית
## כותרת משנה

**זה טקסט מודגש** ו*זה טקסט נטוי*.

רשימה:
- פריט ראשון
- פריט שני
- פריט שלישי

רשימה ממוספרת:
1. פריט ראשון
2. פריט שני
3. פריט שלישי

"ציטוט בעברית"

זה טקסט רגיל עם מקף-ביניים.
"""
    
    formatted = formatter.format_hebrew_content(test_content)
    print("=== HEBREW FORMATTING TEST ===")
    print(formatted)
    
    # Generate CSS
    css = formatter.create_rtl_css_classes()
    print("\n=== GENERATED CSS ===")
    print(css[:500] + "...")

if __name__ == "__main__":
    main()