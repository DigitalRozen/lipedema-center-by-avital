import json
import re

# --- קונפיגורציה: מילות מפתח לסיווג ---
CATEGORIES = {
    "nutrition": {
        "keywords": ["תזונה", "אוכל", "מתכון", "דלקת", "סוכר", "גלוטן", "תוסף", "ויטמין", "נוטריציה"],
        "title": "תזונה ונוטריציה",
        "monetization": "Low Ticket (Digital Guide)"
    },
    "physical": {
        "keywords": ["עיסוי", "לימפתי", "גרבי לחץ", "ניתוח", "כאב", "נפיחות", "רגליים", "מכשיר", "יבש"],
        "title": "טיפול פיזי ושיקום",
        "monetization": "Affiliate (Products)"
    },
    "mindset": {
        "keywords": ["רגש", "נפש", "דימוי גוף", "ביטחון", "בושה", "התמודדות", "מראה", "מיינדסט"],
        "title": "מיינדסט ורגש",
        "monetization": "High Ticket (Clinic Lead)"
    },
    "diagnosis": {
        "keywords": ["אבחון", "סימפטום", "סימנים", "דרגה", "שלב", "זיהוי", "רופא"],
        "title": "אבחון וזיהוי",
        "monetization": "High Ticket (Clinic Lead)"
    }
}

def clean_text(text):
    if not text: 
        return ""
    # הסרת האשטאגים בסוף הפוסט (פשוטה)
    text = re.sub(r'#\S+', '', text).strip()
    return text

def extract_title(text):
    if not text: 
        return "פוסט ללא כותרת"
    # לוקח את השורה הראשונה ככותרת, עד 10 מילים
    first_line = text.split('\n')[0]
    return ' '.join(first_line.split()[:10])

def categorize_post(text):
    score = {k: 0 for k in CATEGORIES.keys()}
    
    for word in text.split():
        for cat, data in CATEGORIES.items():
            if any(keyword in word for keyword in data['keywords']):
                score[cat] += 1
    
    # החזרת הקטגוריה עם הניקוד הגבוה ביותר, או "general" אם לא נמצא כלום
    best_cat = max(score, key=score.get)
    return best_cat if score[best_cat] > 0 else "general"

def process_instagram_json(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    processed_posts = []
    
    # התאמה למבנה של Apify (בדרך כלל רשימה של אובייקטים)
    # אם המבנה שונה, יש לשנות את הלולאה הזו
    items = raw_data if isinstance(raw_data, list) else raw_data.get('items', [])
    
    print(f"Analyzing {len(items)} posts...")
    
    for item in items:
        # חילוץ הטקסט (caption) - תלוי במבנה ה-JSON הספציפי
        # ברוב הסקרייפרים זה תחת 'caption' או 'edge_media_to_caption'
        caption = item.get('caption', '')
        
        if not caption and 'edge_media_to_caption' in item:
            # טיפול במבני JSON שונים
            try:
                caption = item['edge_media_to_caption']['edges'][0]['node']['text']
            except:
                caption = ""
        
        if not caption: 
            continue  # דילוג על פוסטים ללא טקסט
        
        clean_caption = clean_text(caption)
        category_key = categorize_post(clean_caption)
        
        if category_key == "general": 
            continue  # אופציונלי: סינון פוסטים לא רלוונטיים
        
        category_data = CATEGORIES.get(category_key, {})
        
        post_struct = {
            "id": item.get('id') or item.get('shortCode'),
            "title": extract_title(clean_caption),
            "content": clean_caption,
            "image_url": item.get('displayUrl') or item.get('display_url'),
            "date": item.get('timestamp'),
            "likes": item.get('likesCount', 0),
            "category_slug": category_key,
            "category_display": category_data.get('title', 'כללי'),
            "monetization_strategy": category_data.get('monetization', 'None'),
            "original_url": f"https://www.instagram.com/p/{item.get('shortCode')}/" if item.get('shortCode') else ""
        }
        
        processed_posts.append(post_struct)
    
    # שמירה לקובץ נקי
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(processed_posts, f, ensure_ascii=False, indent=2)
    
    print(f"Success! Processed {len(processed_posts)} posts into '{output_file}'")
    return len(processed_posts)

# --- הרצה ---
if __name__ == "__main__":
    # החלף את השם לשם הקובץ האמיתי שלך
    processed_count = process_instagram_json('dataset_instagram2026-01-03.json', 'site_content_db.json')
    print(f"Total posts processed: {processed_count}")