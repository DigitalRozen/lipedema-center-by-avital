import json
from collections import Counter

def analyze_processed_data(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"📊 Analysis of {len(data)} processed posts:")
    print("=" * 50)
    
    # Category distribution
    categories = [post['category_slug'] for post in data]
    category_counts = Counter(categories)
    
    print("\n🏷️  Category Distribution:")
    for category, count in category_counts.items():
        display_name = data[0]['category_display'] if data else category
        for post in data:
            if post['category_slug'] == category:
                display_name = post['category_display']
                break
        print(f"  {category} ({display_name}): {count} posts")
    
    # Monetization strategy distribution
    monetization = [post['monetization_strategy'] for post in data]
    monetization_counts = Counter(monetization)
    
    print("\n💰 Monetization Strategy Distribution:")
    for strategy, count in monetization_counts.items():
        print(f"  {strategy}: {count} posts")
    
    # Sample titles by category
    print("\n📝 Sample Titles by Category:")
    for category in category_counts.keys():
        print(f"\n{category.upper()}:")
        category_posts = [post for post in data if post['category_slug'] == category]
        for i, post in enumerate(category_posts[:3]):  # Show first 3
            print(f"  {i+1}. {post['title']}")
        if len(category_posts) > 3:
            print(f"  ... and {len(category_posts) - 3} more")

if __name__ == "__main__":
    analyze_processed_data('site_content_db.json')