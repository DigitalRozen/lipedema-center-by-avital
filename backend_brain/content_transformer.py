#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Content Transformation System for Avital Rosen's Lipedema Platform
Transforms raw Instagram posts into high-quality Hebrew articles
"""

import json
import re
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from dataclasses import dataclass
from enum import Enum

class AwarenessLevel(Enum):
    PROBLEM = "problem"  # Pain awareness - מודעות לכאב
    SOLUTION = "solution"  # Solution awareness - מודעות לפתרון  
    PRODUCT = "product"  # Product awareness - מודעות למוצר

class ContentCategory(Enum):
    NUTRITION = "nutrition"
    PHYSICAL = "physical" 
    DIAGNOSIS = "diagnosis"
    MINDSET = "mindset"

@dataclass
class TransformedArticle:
    title: str
    subtitle: str
    content: str
    awareness_level: AwarenessLevel
    category: ContentCategory
    monetization_strategy: str
    call_to_action: str
    meta_description: str
    keywords: List[str]
    estimated_reading_time: int

class ContentTransformer:
    def __init__(self):
        self.awareness_templates = self._load_awareness_templates()
        self.category_keywords = self._load_category_keywords()
        self.avital_voice_patterns = self._load_voice_patterns()
        
    def _load_awareness_templates(self) -> Dict[AwarenessLevel, Dict]:
        """Load templates for different awareness levels"""
        return {
            AwarenessLevel.PROBLEM: {
                "opening_patterns": [
                    "את מרגישה {symptom}? {question}",
                    "למה {problem} קורה לך שוב ושוב?",
                    "התסמינים שלא קישרת ל{condition}",
                    "האמת על {topic} שאף אחד לא מספר לך"
                ],
                "structure": ["problem_identification", "scientific_explanation", "symptoms", "solution_preview"],
                "cta_focus": "awareness_building"
            },
            AwarenessLevel.SOLUTION: {
                "opening_patterns": [
                    "איך {solution} שינה את החיים שלי",
                    "הפתרון הטבעי ל{problem}",
                    "מה עשיתי כדי להתמודד עם {condition}",
                    "השילוב הנכון של {elements} יכול לשנות הכל"
                ],
                "structure": ["personal_story", "solution_explanation", "benefits", "implementation"],
                "cta_focus": "solution_education"
            },
            AwarenessLevel.PRODUCT: {
                "opening_patterns": [
                    "המתכון/הטיפ שיחליף לך את {alternative}",
                    "איך להכין {product} ביתי ובריא",
                    "הדרך הפשוטה ל{goal}",
                    "המדריך המלא ל{topic}"
                ],
                "structure": ["practical_introduction", "step_by_step", "benefits", "usage_tips"],
                "cta_focus": "product_recommendation"
            }
        }
    
    def _load_category_keywords(self) -> Dict[ContentCategory, List[str]]:
        """Load keywords for content categorization"""
        return {
            ContentCategory.NUTRITION: [
                "מזון", "תזונה", "מתכון", "ויטמין", "מינרל", "חלבון", "שומן", 
                "פחמימות", "אוקסלט", "דלקת", "עיכול", "מעי", "כבד", "סוכר",
                "אנטי דלקתי", "פרוביוטיקה", "אנזים", "חומצה", "בריא", "טבעי"
            ],
            ContentCategory.PHYSICAL: [
                "תנועה", "עיסוי", "לימפה", "נפיחות", "כאב", "שיקום", "פיזיותרפיה",
                "טרמפולינה", "מכשיר", "טיפול", "גוואשה", "עור", "שריר", "זרימה",
                "לחץ", "מתיחה", "תרגיל", "פעילות", "גוף", "רגליים"
            ],
            ContentCategory.DIAGNOSIS: [
                "ליפאדמה", "לימפאדמה", "אבחון", "תסמין", "רופא", "בדיקה", "מחלה",
                "הפרעה", "סימפטום", "זיהוי", "טיפול רפואי", "מומחה", "קליניקה",
                "בריאות", "רפואי", "פתולוגיה", "מצב רפואי"
            ],
            ContentCategory.MINDSET: [
                "רגש", "מיינדסט", "חרדה", "דיכאון", "מצב רוח", "סטרס", "שינה",
                "הורמון", "מחזור", "אמא", "הריון", "לידה", "משפחה", "זוגיות",
                "ביטחון עצמי", "בושה", "פחד", "תמיכה", "כוח", "אהבה עצמית"
            ]
        }
    
    def _load_voice_patterns(self) -> Dict[str, List[str]]:
        """Load Avital's voice patterns and phrases"""
        return {
            "empathetic_openings": [
                "את מרגישה", "אני מכירה את ההרגשה", "הייתי שם", 
                "זה שלפעמים", "תארי לעצמך", "בואי נסתכל על"
            ],
            "direct_statements": [
                "האמת היא", "בואי נהיה כנות", "זה לא בגללך", 
                "יש מה לעשות", "זה בידיים שלך", "הבעיה היא"
            ],
            "encouraging_phrases": [
                "יש תקווה", "את לא לבד", "זה אפשרי", "את יכולה", 
                "יש פתרון", "זה יעבור", "את חזקה"
            ],
            "scientific_credibility": [
                "מחקרים מראים", "מדעית מוכח", "לפי המחקרים", 
                "הרפואה יודעת", "זה מבוסס על", "העובדות מלמדות"
            ],
            "call_to_action": [
                "רוצה לדעת איך", "מוכנה לשנות", "בואי נתחיל", 
                "הצעד הבא", "מה שחשוב עכשיו", "אם את מוכנה"
            ]
        }
    
    def determine_awareness_level(self, post: Dict) -> AwarenessLevel:
        """Determine the awareness level based on post content and category"""
        content = post.get('content', '').lower()
        title = post.get('title', '').lower()
        category = post.get('category_slug', '')
        monetization = post.get('monetization_strategy', '')
        
        # Problem awareness indicators
        problem_indicators = [
            'למה', 'מה קורה', 'תסמין', 'כאב', 'בעיה', 'קושי', 
            'מרגיש', 'סובל', 'נפיחות', 'עייפות', 'דלקת'
        ]
        
        # Solution awareness indicators  
        solution_indicators = [
            'איך', 'דרך', 'פתרון', 'טיפול', 'שיטה', 'גישה',
            'עזר', 'שיפור', 'הקלה', 'התמודדות'
        ]
        
        # Product awareness indicators
        product_indicators = [
            'מתכון', 'הכנה', 'שימוש', 'מדריך', 'הוראות',
            'צעדים', 'טיפ', 'המלצה', 'מוצר'
        ]
        
        combined_text = f"{title} {content}"
        
        problem_score = sum(1 for indicator in problem_indicators if indicator in combined_text)
        solution_score = sum(1 for indicator in solution_indicators if indicator in combined_text)  
        product_score = sum(1 for indicator in product_indicators if indicator in combined_text)
        
        # Recipes and practical content are usually product level
        if any(word in combined_text for word in ['מתכון', 'הכנה', 'מרכיבים', 'הוראות']):
            return AwarenessLevel.PRODUCT
            
        # Personal stories and explanations are usually solution level
        if any(word in combined_text for word in ['סיפור', 'חוויה', 'למדתי', 'גיליתי', 'עברתי']):
            return AwarenessLevel.SOLUTION
            
        # Highest score wins
        if problem_score >= solution_score and problem_score >= product_score:
            return AwarenessLevel.PROBLEM
        elif solution_score >= product_score:
            return AwarenessLevel.SOLUTION
        else:
            return AwarenessLevel.PRODUCT
    def determine_content_category(self, post: Dict) -> ContentCategory:
        """Determine content category based on keywords and existing category"""
        existing_category = post.get('category_slug', '')
        
        # Map existing categories
        category_mapping = {
            'nutrition': ContentCategory.NUTRITION,
            'physical': ContentCategory.PHYSICAL,
            'diagnosis': ContentCategory.DIAGNOSIS,
            'mindset': ContentCategory.MINDSET
        }
        
        if existing_category in category_mapping:
            return category_mapping[existing_category]
        
        # Fallback to keyword analysis
        content = f"{post.get('title', '')} {post.get('content', '')}".lower()
        
        category_scores = {}
        for category, keywords in self.category_keywords.items():
            score = sum(1 for keyword in keywords if keyword in content)
            category_scores[category] = score
        
        return max(category_scores, key=category_scores.get)
    
    def generate_title_and_subtitle(self, post: Dict, awareness_level: AwarenessLevel) -> Tuple[str, str]:
        """Generate compelling title and subtitle"""
        original_title = post.get('title', '').strip()
        content = post.get('content', '')
        
        # Extract key topics from content
        key_topics = self._extract_key_topics(content)
        main_topic = key_topics[0] if key_topics else "בריאות"
        
        templates = self.awareness_templates[awareness_level]
        
        if awareness_level == AwarenessLevel.PROBLEM:
            title_patterns = [
                f"למה {main_topic} עלול לפגוע בך יותר מלעזור",
                f"התסמינים של {main_topic} שלא קישרת",
                f"האמת על {main_topic} שאף אחד לא מספר לך",
                f"איך {main_topic} משפיע על הבריאות שלך"
            ]
            subtitle = f"הבעיה שלא מדברים עליה ומה שאת יכולה לעשות בנושא"
            
        elif awareness_level == AwarenessLevel.SOLUTION:
            title_patterns = [
                f"איך {main_topic} שינה את החיים שלי",
                f"הסיפור שישנה את הדרך שבה את מסתכלת על {main_topic}",
                f"מה למדתי על {main_topic} שרוצה לשתף איתך",
                f"הדרך הטבעית להתמודד עם {main_topic}"
            ]
            subtitle = f"המסע האישי שלי והכלים שעזרו לי להתמודד"
            
        else:  # PRODUCT
            if 'מתכון' in content.lower():
                title_patterns = [
                    f"המתכון ל{main_topic} שיחליף לך את הקנוי",
                    f"איך להכין {main_topic} ביתי ובריא",
                    f"המדריך המלא להכנת {main_topic}",
                    f"{main_topic} ביתי - פשוט, בריא ויעיל"
                ]
                subtitle = f"מתכון פשוט ובריא שיעשה לך את ההבדל"
            else:
                title_patterns = [
                    f"המדריך המלא ל{main_topic}",
                    f"כל מה שצריך לדעת על {main_topic}",
                    f"איך להשתמש ב{main_topic} בצורה הנכונה",
                    f"הטיפים החשובים ביותר על {main_topic}"
                ]
                subtitle = f"המידע המעשי שתצטרכי כדי להתחיל"
        
        # Choose the most relevant title pattern
        title = title_patterns[0]  # For now, use the first pattern
        
        return title, subtitle
    
    def _extract_key_topics(self, content: str) -> List[str]:
        """Extract key topics from content"""
        # Simple keyword extraction - can be enhanced with NLP
        common_topics = [
            'ליפאדמה', 'תזונה', 'חומצה אוקסלית', 'דלקת', 'נפיחות',
            'כאב', 'עיכול', 'הורמונים', 'מתח', 'שינה', 'תנועה',
            'עיסוי', 'מתכון', 'ויטמינים', 'מינרלים'
        ]
        
        found_topics = []
        content_lower = content.lower()
        
        for topic in common_topics:
            if topic in content_lower:
                found_topics.append(topic)
        
        return found_topics[:3]  # Return top 3 topics
    
    def transform_content_structure(self, post: Dict, awareness_level: AwarenessLevel, category: ContentCategory) -> str:
        """Transform the content into structured article format"""
        original_content = post.get('content', '')
        
        # Get structure template for awareness level
        structure = self.awareness_templates[awareness_level]['structure']
        
        if awareness_level == AwarenessLevel.PROBLEM:
            return self._create_problem_awareness_content(original_content, category)
        elif awareness_level == AwarenessLevel.SOLUTION:
            return self._create_solution_awareness_content(original_content, category)
        else:  # PRODUCT
            return self._create_product_awareness_content(original_content, category)
    
    def _create_problem_awareness_content(self, content: str, category: ContentCategory) -> str:
        """Create problem awareness content structure"""
        sections = []
        
        # Empathetic opening
        sections.append("**את מרגישה שמשהו לא בסדר, אבל לא יודעת בדיוק מה?**")
        sections.append("")
        
        # Problem identification
        problem_intro = self._extract_problem_from_content(content)
        sections.append(problem_intro)
        sections.append("")
        
        # Scientific explanation
        sections.append("### למה זה קורה?")
        sections.append("")
        scientific_explanation = self._create_scientific_explanation(content, category)
        sections.append(scientific_explanation)
        sections.append("")
        
        # Symptoms section
        sections.append("### התסמינים שלא קישרת")
        sections.append("")
        symptoms = self._extract_symptoms(content)
        sections.append(symptoms)
        sections.append("")
        
        # What you can do
        sections.append("### מה את יכולה לעשות עכשיו?")
        sections.append("")
        action_steps = self._create_action_steps(content, category)
        sections.append(action_steps)
        sections.append("")
        
        return "\n".join(sections)
    
    def _create_solution_awareness_content(self, content: str, category: ContentCategory) -> str:
        """Create solution awareness content structure"""
        sections = []
        
        # Personal story opening
        sections.append("**הסיפור שלי עם הבעיה הזו התחיל לפני כמה שנים...**")
        sections.append("")
        
        # The journey
        sections.append("### המסע שהוביל אותי לפתרון")
        sections.append("")
        journey_story = self._create_personal_journey(content)
        sections.append(journey_story)
        sections.append("")
        
        # The solution
        sections.append("### הפתרון שמצאתי")
        sections.append("")
        solution_explanation = self._extract_solution_from_content(content)
        sections.append(solution_explanation)
        sections.append("")
        
        # Benefits and results
        sections.append("### התוצאות שקיבלתי")
        sections.append("")
        benefits = self._create_benefits_section(content, category)
        sections.append(benefits)
        sections.append("")
        
        # How to implement
        sections.append("### איך את יכולה להתחיל")
        sections.append("")
        implementation = self._create_implementation_guide(content, category)
        sections.append(implementation)
        sections.append("")
        
        return "\n".join(sections)
    
    def _create_product_awareness_content(self, content: str, category: ContentCategory) -> str:
        """Create product awareness content structure"""
        sections = []
        
        # Practical introduction
        sections.append("**מחפשת פתרון פשוט ויעיל? הנה בדיוק מה שאת צריכה.**")
        sections.append("")
        
        # Why this solution
        sections.append("### למה זה עובד כל כך טוב?")
        sections.append("")
        why_it_works = self._explain_why_solution_works(content, category)
        sections.append(why_it_works)
        sections.append("")
        
        # Step by step guide
        if 'מתכון' in content.lower() or any(word in content.lower() for word in ['מרכיבים', 'הכנה', 'הוראות']):
            sections.append("### המתכון המלא")
            sections.append("")
            recipe_content = self._format_recipe_content(content)
            sections.append(recipe_content)
        else:
            sections.append("### המדריך המעשי")
            sections.append("")
            practical_guide = self._create_practical_guide(content)
            sections.append(practical_guide)
        
        sections.append("")
        
        # Usage tips
        sections.append("### טיפים לשימוש מיטבי")
        sections.append("")
        usage_tips = self._create_usage_tips(content, category)
        sections.append(usage_tips)
        sections.append("")
        
        return "\n".join(sections)
    def _extract_problem_from_content(self, content: str) -> str:
        """Extract and reformulate the problem from original content"""
        # Look for problem indicators in the content
        problem_patterns = [
            r'בעיה|קושי|תסמין|כאב|נפיחות|עייפות|דלקת',
            r'למה|מה קורה|איך זה|מדוע'
        ]
        
        sentences = content.split('.')
        problem_sentences = []
        
        for sentence in sentences[:3]:  # Look at first 3 sentences
            if any(re.search(pattern, sentence, re.IGNORECASE) for pattern in problem_patterns):
                problem_sentences.append(sentence.strip())
        
        if problem_sentences:
            return f"הבעיה מתחילה כשאת מתחילה לשים לב ש{problem_sentences[0].lower()}. זה לא משהו שקורה בין לילה, אלא תהליך הדרגתי שרבות מאיתנו חוות."
        
        return "יש בעיה שרבות מאיתנו חוות, אבל לא תמיד יודעות לקרוא לה בשם. זה מתחיל בתחושות קטנות שהופכות לגדולות יותר."
    
    def _create_scientific_explanation(self, content: str, category: ContentCategory) -> str:
        """Create scientific explanation based on category and content"""
        explanations = {
            ContentCategory.NUTRITION: "מחקרים מראים שהמזון שאנחנו אוכלות משפיע ישירות על רמות הדלקת בגוף. כשאנחנו צורכות מזונות מסוימים, הגוף מגיב בדלקתיות שיכולה להחמיר תסמינים קיימים.",
            
            ContentCategory.PHYSICAL: "מערכת הלימפה שלנו אחראית על פינוי רעלים ונוזלים עודפים מהגוף. כשהיא לא פועלת בצורה מיטבית, נוצרות נפיחות וכאבים שמשפיעים על איכות החיים.",
            
            ContentCategory.DIAGNOSIS: "ליפאדמה היא מחלה כרונית של מערכת הלימפה שגורמת להצטברות נוזלים ברקמות. זה לא קשור למשקל או לאורח חיים, אלא למבנה גנטי של מערכת הלימפה.",
            
            ContentCategory.MINDSET: "מערכת העצבים והמערכת ההורמונלית שלנו קשורות קשר הדוק. כשאנחנו במתח כרוני, הגוף מפריש הורמונים שמשפיעים על השינה, מצב הרוח והבריאות הכללית."
        }
        
        return explanations.get(category, "הגוף שלנו הוא מערכת מורכבת שבה הכל קשור לכל. כשחלק אחד לא פועל כמו שצריך, זה משפיע על כל השאר.")
    
    def _extract_symptoms(self, content: str) -> str:
        """Extract and format symptoms from content"""
        symptom_keywords = [
            'כאב', 'נפיחות', 'עייפות', 'דלקת', 'כבדות', 'קושי',
            'בעיות שינה', 'מצב רוח', 'חרדה', 'מתח', 'עיכול'
        ]
        
        found_symptoms = []
        content_lower = content.lower()
        
        for symptom in symptom_keywords:
            if symptom in content_lower:
                found_symptoms.append(symptom)
        
        if found_symptoms:
            symptoms_list = "\n".join([f"- **{symptom.title()}** - תחושה שמלווה אותך יום יום" for symptom in found_symptoms[:5]])
            return f"התסמינים שעלולים להופיע:\n\n{symptoms_list}\n\nאם את מזהה חלק מהתסמינים האלה, את לא לבד. זה חלק מהתמונה הגדולה יותר."
        
        return "התסמינים יכולים להיות מגוונים ולהשתנות מאישה לאישה. החשוב הוא להקשיב לגוף ולהבין מה הוא מנסה לומר לנו."
    
    def _create_action_steps(self, content: str, category: ContentCategory) -> str:
        """Create actionable steps based on category"""
        action_steps = {
            ContentCategory.NUTRITION: [
                "**תתחילי לקרוא תוויות** - תבדקי מה באמת יש במוצרים שלך",
                "**תשלבי מזונות אנטי דלקתיים** - דגים שומניים, ירקות עלים ירוקים",
                "**תפחיתי מזונות מעובדים** - ככל שהמזון פשוט יותר, טוב יותר לגוף",
                "**תשתי מים עם מינרלים** - כדי לפצות על מה שהגוף מאבד"
            ],
            ContentCategory.PHYSICAL: [
                "**תתחילי בתנועה עדינה** - הליכה, שחייה או יוגה",
                "**תשלבי עיסוי עצמי** - 5 דקות ביום יכולות לעשות הבדל",
                "**תשימי לב ליציבה** - איך את יושבת ועומדת משפיע על הזרימה",
                "**תיצרי שגרת מתיחות** - בבוקר ובערב"
            ],
            ContentCategory.DIAGNOSIS: [
                "**תפני לרופא מומחה** - אבחון מוקדם חשוב",
                "**תתעדי תסמינים** - כדי לעזור לרופא להבין",
                "**תלמדי על המחלה** - ידע זה כוח",
                "**תחפשי קבוצת תמיכה** - את לא לבד במסע הזה"
            ],
            ContentCategory.MINDSET: [
                "**תתחילי ביומן רגשות** - כדי להבין את הדפוסים",
                "**תשלבי טכניקות הרגעה** - נשימות עמוקות או מדיטציה",
                "**תיצרי שגרת שינה** - שינה איכותית חיונית",
                "**תחפשי תמיכה מקצועית** - אין בושה בלבקש עזרה"
            ]
        }
        
        steps = action_steps.get(category, [
            "**תתחילי בצעדים קטנים** - שינוי הדרגתי יותר יעיל",
            "**תקשיבי לגוף שלך** - הוא יודע לספר לך מה הוא צריך",
            "**תחפשי תמיכה** - מקצועית או מקבוצת נשים דומות",
            "**תהיי סבלנית עם עצמך** - שינוי לוקח זמן"
        ])
        
        return "\n".join(steps)
    
    def _create_personal_journey(self, content: str) -> str:
        """Create a personal journey narrative"""
        return """גם אני הייתי שם. הרגשתי שמשהו לא בסדר, אבל לא ידעתי בדיוק מה. רופאים אמרו לי שזה נורמלי, שזה חלק מלהיות אישה, שזה קשור למשקל או לגיל.

אבל אני ידעתי שזה לא נכון. הגוף שלי צעק אליי, והרגשתי שאני לא מקבלת את התשובות שאני צריכה.

אז התחלתי לחפש בעצמי. קראתי מחקרים, התייעצתי עם מומחים, וחשוב מכל - התחלתי להקשיב לגוף שלי באמת."""
    
    def _extract_solution_from_content(self, content: str) -> str:
        """Extract solution information from content"""
        # Look for solution-related content
        solution_sentences = []
        sentences = content.split('.')
        
        for sentence in sentences:
            if any(word in sentence.lower() for word in ['פתרון', 'עזר', 'שיפור', 'הקלה', 'טיפול']):
                solution_sentences.append(sentence.strip())
        
        if solution_sentences:
            return f"הפתרון שמצאתי היה פשוט יותר ממה שחשבתי. {solution_sentences[0]}. זה לא קרה בין לילה, אבל בהדרגה התחלתי לראות שינוי."
        
        return "הפתרון שמצאתי היה שילוב של כמה גישות - תזונה נכונה, תנועה מותאמת, וחשוב מכל, הבנה של מה הגוף שלי באמת צריך."
    
    def _create_benefits_section(self, content: str, category: ContentCategory) -> str:
        """Create benefits section based on category"""
        benefits = {
            ContentCategory.NUTRITION: [
                "**אנרגיה יציבה לאורך היום** - בלי עליות וירידות חדות",
                "**שיפור בעיכול** - פחות נפיחות ואי נוחות",
                "**שינה איכותית יותר** - הגוף מרגיש יותר רגוע",
                "**מצב רוח מאוזן** - פחות תנודות רגשיות"
            ],
            ContentCategory.PHYSICAL: [
                "**הפחתה בנפיחות** - הרגליים מרגישות קלות יותר",
                "**שיפור בכאבים** - פחות אי נוחות יום יומית",
                "**תחושת קלילות** - הגוף זז בקלות רבה יותר",
                "**שיפור בזרימה** - תחושה של חיוניות"
            ],
            ContentCategory.DIAGNOSIS: [
                "**הבנה של המצב** - ידיעה מה קורה בגוף",
                "**טיפול מותאם** - פתרונות ספציפיים למצב",
                "**שקט נפשי** - הבנה שזה לא באשמתך",
                "**תמיכה מקצועית** - ליווי לאורך הדרך"
            ],
            ContentCategory.MINDSET: [
                "**רוגע פנימי** - פחות חרדה ומתח",
                "**ביטחון עצמי** - הרגשה טובה יותר עם הגוף",
                "**שינה איכותית** - מנוחה אמיתית בלילה",
                "**יחסים טובים יותר** - כשאת מרגישה טוב, זה משפיע על הכל"
            ]
        }
        
        category_benefits = benefits.get(category, [
            "**שיפור כללי בתחושה** - הגוף מרגיש יותר בריא",
            "**אנרגיה גבוהה יותר** - כוח לעשות מה שחשוב לך",
            "**ביטחון עצמי** - הרגשה שאת שולטת במצב",
            "**איכות חיים טובה יותר** - יותר שמחה ופחות דאגות"
        ])
        
        return "התוצאות שקיבלתי:\n\n" + "\n".join(category_benefits) + "\n\nהשינוי לא היה מיידי, אבל הוא היה מתמיד. וזה מה שחשוב."
    def _create_implementation_guide(self, content: str, category: ContentCategory) -> str:
        """Create implementation guide based on category"""
        guides = {
            ContentCategory.NUTRITION: """**התחילי בהדרגה:**

1. **השבוע הראשון** - תחליפי משקה אחד ביום במים עם לימון
2. **השבוע השני** - תוסיפי ירק אחד לכל ארוחה
3. **השבוע השלישי** - תפחיתי מזון מעובד אחד ביום
4. **השבוע הרביעי** - תשלבי מקור חלבון איכותי בכל ארוחה

**זכרי:** שינוי הדרגתי הוא שינוי מתמיד.""",
            
            ContentCategory.PHYSICAL: """**תתחילי עם 10 דקות ביום:**

1. **בוקר** - 3 דקות מתיחות עדינות
2. **צהריים** - 2 דקות הליכה או תנועה קלה
3. **ערב** - 5 דקות עיסוי עצמי או רגליים למעלה

**טיפ חשוב:** עדיף 10 דקות כל יום מאשר שעה פעם בשבוע.""",
            
            ContentCategory.DIAGNOSIS: """**הצעדים הראשונים:**

1. **תתעדי תסמינים** - מתי, איך ובאיזה עוצמה
2. **תחפשי רופא מומחה** - רופא שמכיר את המחלה
3. **תכיני שאלות** - רשימה של מה שחשוב לך לדעת
4. **תביאי תמיכה** - בן משפחה או חברה לביקור

**זכרי:** אבחון מוקדם יכול לשנות הכל.""",
            
            ContentCategory.MINDSET: """**בואי נתחיל ברגש:**

1. **יומן רגשות** - 5 דקות בערב, איך הרגשת היום
2. **נשימות עמוקות** - 3 נשימות לפני כל ארוחה
3. **שגרת שינה** - אותה שעה כל ערב
4. **זמן לעצמך** - 15 דקות ביום רק בשבילך

**החשוב ביותר:** תהיי רכה עם עצמך."""
        }
        
        return guides.get(category, """**התחילי בצעד אחד:**

1. **בחרי דבר אחד** שמרגיש לך הכי נכון עכשיו
2. **תתחייבי ל-7 ימים** - לא יותר, לא פחות
3. **תעקבי אחרי השינויים** - איך את מרגישה
4. **תתאימי לעצמך** - כל אחת שונה

**זכרי:** המסע שלך הוא ייחודי לך.""")
    
    def _explain_why_solution_works(self, content: str, category: ContentCategory) -> str:
        """Explain why the solution works"""
        explanations = {
            ContentCategory.NUTRITION: "התזונה הנכונה עובדת כי היא נותנת לגוף בדיוק מה שהוא צריך כדי לתפקד בצורה מיטבית. במקום להילחם נגד דלקתיות, אנחנו נותנות לגוף את הכלים לרפא את עצמו.",
            
            ContentCategory.PHYSICAL: "תנועה עדינה ועיסוי עובדים כי הם מעודדים את זרימת הלימפה והדם. זה כמו לפתוח ברזים שהיו סתומים - הנוזלים מתחילים לזרום שוב בחופשיות.",
            
            ContentCategory.DIAGNOSIS: "אבחון נכון עובד כי הוא נותן לנו מפה לדרך. במקום לנחש מה קורה, אנחנו יודעות בדיוק עם מה אנחנו מתמודדות ויכולות לטפל בצורה מדויקת.",
            
            ContentCategory.MINDSET: "עבודה על המיינדסט עובדת כי הקשר בין הנפש לגוף הוא אמיתי. כשאנחנו מרגיעות את מערכת העצבים, כל הגוף מתחיל לפעול טוב יותר."
        }
        
        return explanations.get(category, "הפתרון עובד כי הוא מתייחס לגוף כמערכת שלמה. במקום לטפל רק בתסמינים, אנחנו מטפלות בשורש הבעיה.")
    
    def _format_recipe_content(self, content: str) -> str:
        """Format recipe content in a structured way"""
        lines = content.split('\n')
        formatted_lines = []
        
        in_ingredients = False
        in_instructions = False
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Detect ingredients section
            if any(word in line.lower() for word in ['מרכיבים', 'צריכים', 'חומרים']):
                formatted_lines.append("**מרכיבים:**")
                in_ingredients = True
                continue
            
            # Detect instructions section
            if any(word in line.lower() for word in ['הוראות', 'הכנה', 'עושים', 'מכינים']):
                formatted_lines.append("\n**הוראות הכנה:**")
                in_instructions = True
                continue
            
            # Format ingredients
            if in_ingredients and not in_instructions:
                if any(char.isdigit() for char in line):
                    formatted_lines.append(f"- {line}")
                else:
                    formatted_lines.append(line)
            
            # Format instructions
            elif in_instructions:
                if line and not line.startswith('-'):
                    formatted_lines.append(f"{len([l for l in formatted_lines if l.startswith('1.') or l.startswith('2.') or l.startswith('3.')]) + 1}. {line}")
                else:
                    formatted_lines.append(line)
            
            else:
                formatted_lines.append(line)
        
        return '\n'.join(formatted_lines)
    
    def _create_practical_guide(self, content: str) -> str:
        """Create practical guide from content"""
        # Extract practical information from content
        sentences = [s.strip() for s in content.split('.') if s.strip()]
        
        guide_steps = []
        step_counter = 1
        
        for sentence in sentences:
            if any(word in sentence.lower() for word in ['צריך', 'חשוב', 'מומלץ', 'כדאי']):
                guide_steps.append(f"{step_counter}. {sentence}")
                step_counter += 1
                
                if len(guide_steps) >= 5:  # Limit to 5 steps
                    break
        
        if not guide_steps:
            guide_steps = [
                "1. התחילי בהדרגה ובקצב שמתאים לך",
                "2. תקשיבי לגוף שלך ותתאימי בהתאם",
                "3. תהיי עקבית - עדיף מעט כל יום מאשר הרבה פעם בשבוע",
                "4. תחפשי תמיכה ממומחים או מקבוצת נשים",
                "5. תהיי סבלנית - שינוי אמיתי לוקח זמן"
            ]
        
        return '\n'.join(guide_steps)
    
    def _create_usage_tips(self, content: str, category: ContentCategory) -> str:
        """Create usage tips based on category"""
        tips = {
            ContentCategory.NUTRITION: [
                "**תתחילי בכמויות קטנות** - תני לגוף להתרגל",
                "**תשלבי עם מזונות שאת אוהבת** - זה יעזור לך להחזיק מעמד",
                "**תכיני מראש** - הכנה מוקדמת מבטיחה הצלחה",
                "**תקשיבי לגוף** - הוא יגיד לך מה עובד ומה לא"
            ],
            ContentCategory.PHYSICAL: [
                "**תתחילי לאט** - עדיף להתקדם בהדרגה",
                "**תשימי לב לתחושות** - אי נוחות זה בסדר, כאב זה לא",
                "**תהיי עקבית** - 10 דקות כל יום עדיף משעה פעם בשבוע",
                "**תתאימי לעצמך** - כל גוף שונה ויש לו צרכים שונים"
            ],
            ContentCategory.DIAGNOSIS: [
                "**תכיני שאלות מראש** - כדי לא לשכוח בביקור",
                "**תביאי רשימת תסמינים** - מתועדת ומפורטת",
                "**תחפשי חוות דעת שנייה** - אם משהו לא מרגיש נכון",
                "**תהיי המגינה על עצמך** - את יודעת את הגוף שלך הכי טוב"
            ],
            ContentCategory.MINDSET: [
                "**תתחילי בצעדים קטנים** - 5 דקות ביום יכולות לעשות הבדל",
                "**תמצאי מה עובד עליך** - מדיטציה, יוגה, כתיבה או משהו אחר",
                "**תהיי סבלנית** - שינוי במיינדסט לוקח זמן",
                "**תחפשי תמיכה** - לא צריך לעשות את זה לבד"
            ]
        }
        
        category_tips = tips.get(category, [
            "**תתחילי בהדרגה** - שינוי קטן כל יום",
            "**תהיי עקבית** - עדיף מעט כל יום",
            "**תקשיבי לגוף** - הוא המדריך הטוב ביותר שלך",
            "**תחפשי תמיכה** - את לא לבד במסע הזה"
        ])
        
        return '\n'.join(category_tips)
    def generate_call_to_action(self, awareness_level: AwarenessLevel, category: ContentCategory, monetization_strategy: str) -> str:
        """Generate appropriate call to action"""
        
        if "High Ticket" in monetization_strategy:
            # Clinic consultation CTA
            cta_options = [
                "**רוצה ליווי אישי ומקצועי?** אני כאן כדי לעזור לך למצוא את הדרך הנכונה בשבילך. [לחצי כאן לייעוץ אישי](clinic)",
                "**מוכנה לקחת שליטה על הבריאות שלך?** בואי נעבוד יחד על תוכנית מותאמת אישית. [הזמיני ייעוץ](clinic)",
                "**רוצה תשובות מדויקות למצב שלך?** אני מזמינה אותך לייעוץ אישי שיתן לך כלים קונקרטיים. [לפרטים נוספים](clinic)"
            ]
        elif "Low Ticket" in monetization_strategy:
            # Digital guide CTA
            cta_options = [
                "**רוצה מדריך מפורט עם כל הטיפים והמתכונים?** הספר הדיגיטלי שלי מכיל הכל במקום אחד. [לפרטים על הספר](digital-guide)",
                "**מחפשת מדריך מעשי שילווה אותך צעד אחר צעד?** יצרתי בשבילך מדריך מלא עם כל המידע. [לרכישת המדריך](digital-guide)",
                "**רוצה את כל הכלים במקום אחד?** המדריך הדיגיטלי שלי יעזור לך להתחיל נכון. [לפרטים נוספים](digital-guide)"
            ]
        else:
            # Affiliate product CTA
            cta_options = [
                "**רוצה את המוצרים המדויקים שאני ממליצה?** הכנתי בשבילך רשימה של המוצרים הכי איכותיים. [לרשימת המוצרים](products)",
                "**מחפשת בדיוק את המוצרים הנכונים?** אני בדקתי בשבילך ומצאתי את הטובים ביותר. [לצפייה במוצרים](products)",
                "**רוצה לדעת איפה לקנות את המוצרים האיכותיים?** הכנתי רשימה מעודכנת. [לרשימת המוצרים המומלצים](products)"
            ]
        
        return cta_options[0]  # Return first option for now
    
    def generate_meta_description(self, title: str, category: ContentCategory) -> str:
        """Generate SEO meta description"""
        category_descriptions = {
            ContentCategory.NUTRITION: f"{title} | מדריך תזונה מקצועי לנשים עם ליפאדמה. טיפים מעשיים, מתכונים בריאים ומידע מבוסס מחקר מאביטל רוזן.",
            ContentCategory.PHYSICAL: f"{title} | טיפול פיזי וטכניקות שיקום לליפאדמה. עיסויים, תנועה ופתרונות מעשיים מאביטל רוזן נטורופתית.",
            ContentCategory.DIAGNOSIS: f"{title} | מידע מקצועי על אבחון וטיפול בליפאדמה. הכרת התסמינים והדרך לטיפול נכון מאביטל רוזן.",
            ContentCategory.MINDSET: f"{title} | תמיכה רגשית ומיינדסט חיובי לנשים עם ליפאדמה. כלים מעשיים להתמודדות מאביטל רוזן."
        }
        
        return category_descriptions.get(category, f"{title} | מידע מקצועי ומעשי לנשים עם ליפאדמה מאביטל רוזן נטורופתית מוסמכת.")
    
    def generate_keywords(self, content: str, category: ContentCategory) -> List[str]:
        """Generate SEO keywords"""
        base_keywords = ["ליפאדמה", "אביטל רוזן", "נטורופתיה", "בריאות נשים"]
        
        category_keywords = {
            ContentCategory.NUTRITION: ["תזונה בריאה", "מתכונים", "דלקת", "אוקסלט", "עיכול", "ויטמינים"],
            ContentCategory.PHYSICAL: ["עיסוי", "תנועה", "לימפה", "נפיחות", "שיקום", "פיזיותרפיה"],
            ContentCategory.DIAGNOSIS: ["אבחון", "תסמינים", "טיפול רפואי", "מומחה", "בדיקות"],
            ContentCategory.MINDSET: ["מצב רוח", "חרדה", "הורמונים", "שינה", "סטרס", "תמיכה רגשית"]
        }
        
        # Extract keywords from content
        content_words = re.findall(r'\b\w+\b', content.lower())
        common_words = [word for word in content_words if len(word) > 3 and content_words.count(word) > 1]
        
        all_keywords = base_keywords + category_keywords.get(category, []) + common_words[:5]
        return list(set(all_keywords))[:10]  # Return unique keywords, max 10
    
    def estimate_reading_time(self, content: str) -> int:
        """Estimate reading time in minutes"""
        word_count = len(content.split())
        # Average reading speed: 200 words per minute in Hebrew
        reading_time = max(1, round(word_count / 200))
        return reading_time
    
    def transform_post(self, post: Dict) -> TransformedArticle:
        """Main transformation method"""
        # Determine awareness level and category
        awareness_level = self.determine_awareness_level(post)
        category = self.determine_content_category(post)
        
        # Generate title and subtitle
        title, subtitle = self.generate_title_and_subtitle(post, awareness_level)
        
        # Transform content structure
        content = self.transform_content_structure(post, awareness_level, category)
        
        # Generate call to action
        monetization_strategy = post.get('monetization_strategy', 'Low Ticket (Digital Guide)')
        call_to_action = self.generate_call_to_action(awareness_level, category, monetization_strategy)
        
        # Add CTA to content
        full_content = f"{content}\n\n---\n\n{call_to_action}"
        
        # Generate metadata
        meta_description = self.generate_meta_description(title, category)
        keywords = self.generate_keywords(post.get('content', ''), category)
        reading_time = self.estimate_reading_time(full_content)
        
        return TransformedArticle(
            title=title,
            subtitle=subtitle,
            content=full_content,
            awareness_level=awareness_level,
            category=category,
            monetization_strategy=monetization_strategy,
            call_to_action=call_to_action,
            meta_description=meta_description,
            keywords=keywords,
            estimated_reading_time=reading_time
        )

def main():
    """Main function to demonstrate the transformer"""
    # Load Instagram data
    with open('lipedema-platform/site_content_db.json', 'r', encoding='utf-8') as f:
        posts_data = json.load(f)
    
    # Initialize transformer
    transformer = ContentTransformer()
    
    # Transform a sample post
    if posts_data:
        sample_post = posts_data[0]  # Take first post as example
        
        print("=== ORIGINAL POST ===")
        print(f"Title: {sample_post.get('title', '')}")
        print(f"Content: {sample_post.get('content', '')[:200]}...")
        print(f"Category: {sample_post.get('category_display', '')}")
        print(f"Monetization: {sample_post.get('monetization_strategy', '')}")
        
        # Transform the post
        transformed = transformer.transform_post(sample_post)
        
        print("\n=== TRANSFORMED ARTICLE ===")
        print(f"Title: {transformed.title}")
        print(f"Subtitle: {transformed.subtitle}")
        print(f"Awareness Level: {transformed.awareness_level.value}")
        print(f"Category: {transformed.category.value}")
        print(f"Reading Time: {transformed.estimated_reading_time} minutes")
        print(f"Keywords: {', '.join(transformed.keywords)}")
        print(f"\nContent:\n{transformed.content}")

if __name__ == "__main__":
    main()