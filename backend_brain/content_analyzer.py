#!/usr/bin/env python3
"""
Content Analysis Engine
Backend Architect & Data Engineer

Analyzes content for quality, categorization accuracy, and monetization optimization.
"""

import json
import re
from typing import Dict, List, Tuple, Any
from collections import Counter
from datetime import datetime


class ContentAnalyzer:
    """Analyzes processed content for insights and optimization"""
    
    def __init__(self):
        self.hebrew_stopwords = {
            'של', 'את', 'על', 'עם', 'אל', 'מן', 'כל', 'זה', 'זו', 'זאת', 'הוא', 'היא', 'הם', 'הן',
            'אני', 'אתה', 'את', 'אנחנו', 'אתם', 'אתן', 'לא', 'כן', 'גם', 'רק', 'עוד', 'כבר',
            'אם', 'כי', 'מה', 'מי', 'איך', 'איפה', 'מתי', 'למה', 'אבל', 'או', 'ו', 'ה', 'ל', 'ב', 'כ', 'מ'
        }
    
    def analyze_content_quality(self, posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze overall content quality metrics"""
        if not posts:
            return {"error": "No posts to analyze"}
        
        # Basic metrics
        total_posts = len(posts)
        avg_content_length = sum(len(post.get('content', '')) for post in posts) / total_posts
        avg_title_length = sum(len(post.get('title', '')) for post in posts) / total_posts
        
        # Content length distribution
        content_lengths = [len(post.get('content', '')) for post in posts]
        short_posts = len([l for l in content_lengths if l < 100])
        medium_posts = len([l for l in content_lengths if 100 <= l < 300])
        long_posts = len([l for l in content_lengths if l >= 300])
        
        # Engagement metrics
        total_likes = sum(post.get('likes_count', 0) for post in posts)
        total_comments = sum(post.get('comments_count', 0) for post in posts)
        avg_likes = total_likes / total_posts if total_posts > 0 else 0
        avg_comments = total_comments / total_posts if total_posts > 0 else 0
        
        # Posts with images
        posts_with_images = len([p for p in posts if p.get('image_url')])
        image_percentage = (posts_with_images / total_posts) * 100
        
        return {
            "total_posts": total_posts,
            "content_metrics": {
                "avg_content_length": round(avg_content_length, 1),
                "avg_title_length": round(avg_title_length, 1),
                "length_distribution": {
                    "short_posts": short_posts,
                    "medium_posts": medium_posts,
                    "long_posts": long_posts
                }
            },
            "engagement_metrics": {
                "total_likes": total_likes,
                "total_comments": total_comments,
                "avg_likes_per_post": round(avg_likes, 1),
                "avg_comments_per_post": round(avg_comments, 1)
            },
            "media_metrics": {
                "posts_with_images": posts_with_images,
                "image_percentage": round(image_percentage, 1)
            }
        }
    
    def analyze_category_distribution(self, posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze category distribution and balance"""
        category_counts = Counter(post.get('category_slug', 'unknown') for post in posts)
        total_posts = len(posts)
        
        category_stats = {}
        for category, count in category_counts.items():
            percentage = (count / total_posts) * 100
            category_posts = [p for p in posts if p.get('category_slug') == category]
            
            # Calculate average engagement for this category
            avg_likes = sum(p.get('likes_count', 0) for p in category_posts) / count if count > 0 else 0
            avg_comments = sum(p.get('comments_count', 0) for p in category_posts) / count if count > 0 else 0
            
            category_stats[category] = {
                "count": count,
                "percentage": round(percentage, 1),
                "avg_likes": round(avg_likes, 1),
                "avg_comments": round(avg_comments, 1)
            }
        
        return {
            "total_categories": len(category_counts),
            "category_distribution": category_stats,
            "most_popular_category": category_counts.most_common(1)[0] if category_counts else None,
            "least_popular_category": category_counts.most_common()[-1] if category_counts else None
        }
    
    def analyze_monetization_strategy(self, posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze monetization strategy distribution"""
        monetization_counts = Counter(post.get('monetization_strategy', 'None') for post in posts)
        total_posts = len(posts)
        
        monetization_stats = {}
        for strategy, count in monetization_counts.items():
            percentage = (count / total_posts) * 100
            strategy_posts = [p for p in posts if p.get('monetization_strategy') == strategy]
            
            # Calculate average engagement for this strategy
            avg_likes = sum(p.get('likes_count', 0) for p in strategy_posts) / count if count > 0 else 0
            
            monetization_stats[strategy] = {
                "count": count,
                "percentage": round(percentage, 1),
                "avg_engagement": round(avg_likes, 1)
            }
        
        return {
            "monetization_distribution": monetization_stats,
            "revenue_potential": self._calculate_revenue_potential(monetization_stats)
        }
    
    def _calculate_revenue_potential(self, monetization_stats: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate estimated revenue potential based on content distribution"""
        # Rough estimates based on industry standards
        revenue_multipliers = {
            "Affiliate (Products)": 0.02,  # 2% conversion rate
            "Low Ticket (Digital Guide)": 0.05,  # 5% conversion rate
            "High Ticket (Clinic Lead)": 0.10,  # 10% lead conversion
            "None": 0.0
        }
        
        estimated_values = {
            "Affiliate (Products)": 300,  # Average affiliate commission
            "Low Ticket (Digital Guide)": 149,  # Digital product price
            "High Ticket (Clinic Lead)": 2000,  # Estimated clinic value
            "None": 0
        }
        
        potential_revenue = 0
        for strategy, stats in monetization_stats.items():
            if strategy in revenue_multipliers:
                # Estimate based on engagement and conversion rates
                estimated_visitors = stats.get('avg_engagement', 0) * 10  # Rough visitor estimate
                conversion_rate = revenue_multipliers[strategy]
                avg_value = estimated_values[strategy]
                
                strategy_revenue = estimated_visitors * conversion_rate * avg_value * stats['count']
                potential_revenue += strategy_revenue
        
        return {
            "estimated_monthly_revenue": round(potential_revenue, 0),
            "currency": "₪",
            "calculation_note": "Based on estimated traffic and industry conversion rates"
        }
    
    def extract_top_keywords(self, posts: List[Dict[str, Any]], limit: int = 20) -> List[Tuple[str, int]]:
        """Extract most common keywords from content"""
        all_text = " ".join(post.get('content', '') for post in posts)
        
        # Clean and tokenize Hebrew text
        words = re.findall(r'[\u0590-\u05FF]+', all_text.lower())
        
        # Filter out stopwords and short words
        filtered_words = [
            word for word in words 
            if len(word) > 2 and word not in self.hebrew_stopwords
        ]
        
        # Count and return top keywords
        word_counts = Counter(filtered_words)
        return word_counts.most_common(limit)
    
    def analyze_tag_effectiveness(self, posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze tag usage and effectiveness"""
        all_tags = []
        tag_engagement = {}
        
        for post in posts:
            post_tags = post.get('tags', [])
            likes = post.get('likes_count', 0)
            
            all_tags.extend(post_tags)
            
            for tag in post_tags:
                if tag not in tag_engagement:
                    tag_engagement[tag] = {'total_likes': 0, 'post_count': 0}
                tag_engagement[tag]['total_likes'] += likes
                tag_engagement[tag]['post_count'] += 1
        
        # Calculate average engagement per tag
        tag_stats = {}
        for tag, stats in tag_engagement.items():
            avg_engagement = stats['total_likes'] / stats['post_count'] if stats['post_count'] > 0 else 0
            tag_stats[tag] = {
                'usage_count': stats['post_count'],
                'avg_engagement': round(avg_engagement, 1),
                'total_engagement': stats['total_likes']
            }
        
        # Sort by average engagement
        top_performing_tags = sorted(
            tag_stats.items(), 
            key=lambda x: x[1]['avg_engagement'], 
            reverse=True
        )[:10]
        
        return {
            "total_unique_tags": len(tag_stats),
            "most_used_tags": Counter(all_tags).most_common(10),
            "top_performing_tags": top_performing_tags,
            "tag_usage_stats": tag_stats
        }
    
    def generate_content_report(self, content_db: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive content analysis report"""
        posts = content_db.get('posts', [])
        
        if not posts:
            return {"error": "No posts found in content database"}
        
        report = {
            "analysis_timestamp": datetime.now().isoformat(),
            "content_overview": self.analyze_content_quality(posts),
            "category_analysis": self.analyze_category_distribution(posts),
            "monetization_analysis": self.analyze_monetization_strategy(posts),
            "keyword_analysis": {
                "top_keywords": self.extract_top_keywords(posts),
                "keyword_count": len(self.extract_top_keywords(posts, limit=100))
            },
            "tag_analysis": self.analyze_tag_effectiveness(posts),
            "recommendations": self._generate_recommendations(posts)
        }
        
        return report
    
    def _generate_recommendations(self, posts: List[Dict[str, Any]]) -> List[str]:
        """Generate actionable recommendations based on analysis"""
        recommendations = []
        
        # Analyze content length
        avg_length = sum(len(post.get('content', '')) for post in posts) / len(posts)
        if avg_length < 150:
            recommendations.append("Consider expanding content length - posts under 150 characters may lack depth")
        
        # Analyze category balance
        category_counts = Counter(post.get('category_slug') for post in posts)
        if len(category_counts) < 3:
            recommendations.append("Diversify content across more categories for broader audience appeal")
        
        # Analyze monetization balance
        monetization_counts = Counter(post.get('monetization_strategy') for post in posts)
        affiliate_percentage = (monetization_counts.get('Affiliate (Products)', 0) / len(posts)) * 100
        
        if affiliate_percentage < 30:
            recommendations.append("Increase affiliate product content - currently under 30% of posts")
        elif affiliate_percentage > 60:
            recommendations.append("Balance affiliate content with educational content for better authority building")
        
        # Analyze engagement
        avg_likes = sum(post.get('likes_count', 0) for post in posts) / len(posts)
        if avg_likes < 10:
            recommendations.append("Focus on improving content engagement - consider more interactive or visual content")
        
        return recommendations


def main():
    """Test content analyzer with sample data"""
    analyzer = ContentAnalyzer()
    
    # Load content database
    try:
        with open('shared_data/content_db.json', 'r', encoding='utf-8') as f:
            content_db = json.load(f)
    except FileNotFoundError:
        print("Content database not found. Run data_processor.py first.")
        return
    
    # Generate analysis report
    report = analyzer.generate_content_report(content_db)
    
    # Save report
    with open('shared_data/content_analysis_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print("Content analysis report generated: shared_data/content_analysis_report.json")
    
    # Print summary
    if 'error' not in report:
        overview = report['content_overview']
        print(f"\n=== Content Analysis Summary ===")
        print(f"Total Posts: {overview['total_posts']}")
        print(f"Average Content Length: {overview['content_metrics']['avg_content_length']} characters")
        print(f"Average Engagement: {overview['engagement_metrics']['avg_likes_per_post']} likes per post")
        print(f"Posts with Images: {overview['media_metrics']['image_percentage']}%")
        
        if report['recommendations']:
            print(f"\n=== Recommendations ===")
            for i, rec in enumerate(report['recommendations'], 1):
                print(f"{i}. {rec}")


if __name__ == "__main__":
    main()