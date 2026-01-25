/**
 * Content Expander Module
 * 
 * Expands Instagram captions into full SEO articles using Avital's voice.
 * Validates: Requirements 3.1, 3.3, 3.4, 3.5
 */

import type { TopicType, ExpandedContent, ContentSection, CategorySlug } from './types';
import { mapTopicToCategory } from './topicMapper';

/**
 * Medical vocabulary terms that should appear in medical content
 */
export const MEDICAL_VOCABULARY = [
  'לימפה',
  'בצקת',
  'רקמה פיברוטית',
  'דלקתיות',
  'נוגדי חמצון',
  'מערכת הלימפה',
  'ניקוז לימפתי',
  'רקמת שומן',
  'תאי שומן',
  'מחזור הדם',
  'נפיחות',
  'כאב',
  'רגישות',
  'לחץ',
  'עיסוי',
  'טיפול',
  'אבחון',
  'תסמינים',
];

/**
 * Threshold for short captions (under 200 characters)
 */
export const SHORT_CAPTION_THRESHOLD = 200;

/**
 * CTA phrases for conclusions
 */
export const CTA_PHRASES = [
  'לפרטים נוספים',
  'צרי קשר',
  'הזמיני תור',
  'קבעי פגישה',
  'התייעצי',
  'למידע נוסף',
  'בקליניקה',
  'לייעוץ',
];

/**
 * Topic-specific domain knowledge for content expansion
 */
const TOPIC_KNOWLEDGE: Record<TopicType, {
  hooks: string[];
  empathy: string[];
  science: string[];
  protocols: string[];
  ctas: string[];
}> = {
  'Treatment': {
    hooks: [
      'הרגליים שלך מרגישות כבדות? את לא לבד.',
      'כאב שלא נעלם עם מנוחה? יש מה לעשות.',
      'טיפול נכון יכול לשנות את החיים שלך.',
    ],
    empathy: [
      'אני מבינה כמה זה מתסכל כשהגוף לא משתף פעולה.',
      'הרבה נשים מרגישות בדיוק כמוך.',
      'המסע הזה לא קל, אבל את לא צריכה לעבור אותו לבד.',
    ],
    science: [
      'מערכת הלימפה אחראית על ניקוז נוזלים מהגוף.',
      'ניקוז לימפתי עוזר להפחית בצקת ולשפר את זרימת הלימפה.',
      'טיפול שמרני כולל עיסוי, לחיצות ותרגילים ייעודיים.',
    ],
    protocols: [
      'התחילי עם ניקוז לימפתי עדין פעמיים בשבוע.',
      'לבשי גרביים אלסטיות באופן קבוע.',
      'שלבי תנועה עדינה ביומיום.',
    ],
    ctas: [
      'רוצה ללמוד עוד על טיפולים מתקדמים? צרי קשר לייעוץ אישי.',
      'בקליניקה שלנו נבנה לך תוכנית טיפול מותאמת אישית.',
    ],
  },
  'Anti-Inflammatory': {
    hooks: [
      'דלקתיות היא האויב השקט של ליפאדמה.',
      'מה שאת אוכלת משפיע ישירות על הדלקת בגוף.',
      'הפחתת דלקת יכולה לשנות את ההרגשה שלך.',
    ],
    empathy: [
      'אני יודעת כמה קשה לשנות הרגלי אכילה.',
      'לא מדובר בדיאטה קשוחה, אלא בבחירות חכמות.',
      'כל שינוי קטן הוא צעד בכיוון הנכון.',
    ],
    science: [
      'מזונות מעובדים וסוכר מגבירים דלקתיות בגוף.',
      'נוגדי חמצון עוזרים להילחם בדלקת ולהגן על התאים.',
      'תזונה נוגדת דלקת מפחיתה נפיחות וכאב.',
    ],
    protocols: [
      'הוסיפי ירקות ירוקים לכל ארוחה.',
      'הפחיתי מזונות מעובדים וסוכר.',
      'שתי מספיק מים לתמיכה במערכת הלימפה.',
    ],
    ctas: [
      'רוצה תפריט מותאם אישית? בואי לייעוץ תזונתי.',
      'למידע נוסף על תזונה נוגדת דלקת, צרי קשר.',
    ],
  },
  'Nutrition': {
    hooks: [
      'תזונה נכונה היא הבסיס לניהול ליפאדמה.',
      'מה שאת אוכלת משפיע על איך שאת מרגישה.',
      'אוכל הוא תרופה - בואי נבחר נכון.',
    ],
    empathy: [
      'אני יודעת שיש המון מידע סותר בחוץ.',
      'לא צריך להיות מושלמת, צריך להיות עקבית.',
      'כל גוף שונה, ומה שעובד לאחת לא בהכרח יעבוד לך.',
    ],
    science: [
      'תזונה עשירה בירקות ופירות תומכת במערכת הלימפה.',
      'חלבון איכותי חשוב לבניית רקמות בריאות.',
      'שומנים בריאים עוזרים להפחית דלקתיות.',
    ],
    protocols: [
      'התחילי את היום עם ארוחת בוקר מאוזנת.',
      'אכלי ירקות בכל ארוחה.',
      'הימנעי ממזונות מעובדים ככל האפשר.',
    ],
    ctas: [
      'רוצה תוכנית תזונה מותאמת? הזמיני ייעוץ.',
      'בקליניקה נבנה לך תפריט שמתאים לאורח החיים שלך.',
    ],
  },
  'Lymphedema': {
    hooks: [
      'לימפאדמה וליפאדמה - מה ההבדל ולמה זה חשוב?',
      'הבנת מערכת הלימפה היא המפתח לטיפול נכון.',
      'בצקת לימפתית דורשת טיפול מיוחד.',
    ],
    empathy: [
      'אני יודעת כמה מבלבל כל המידע הרפואי.',
      'הרבה נשים מתמודדות עם שתי הבעיות במקביל.',
      'הבנה נכונה של המצב היא הצעד הראשון לשיפור.',
    ],
    science: [
      'מערכת הלימפה מנקזת נוזלים ופסולת מהגוף.',
      'כשהמערכת לא עובדת כראוי, נוצרת בצקת.',
      'ליפאדמה משפיעה על רקמת השומן, לימפאדמה על מערכת הלימפה.',
    ],
    protocols: [
      'ניקוז לימפתי ידני הוא טיפול מרכזי.',
      'גרביים אלסטיות עוזרות לשמור על הניקוז.',
      'תנועה עדינה מפעילה את מערכת הלימפה.',
    ],
    ctas: [
      'לאבחון מדויק ותוכנית טיפול, קבעי פגישה.',
      'צרי קשר לייעוץ מקצועי על מצבך.',
    ],
  },
  'Diagnosis': {
    hooks: [
      'אבחון מוקדם של ליפאדמה יכול לשנות הכל.',
      'איך יודעים אם זה ליפאדמה או משהו אחר?',
      'הסימנים שאת צריכה להכיר.',
    ],
    empathy: [
      'אני יודעת כמה מתסכל לחפש תשובות.',
      'הרבה נשים עוברות שנים בלי אבחון נכון.',
      'את לא משוגעת - מה שאת מרגישה אמיתי.',
    ],
    science: [
      'ליפאדמה היא מחלה של רקמת השומן.',
      'התסמינים כוללים נפיחות סימטרית ברגליים וכאב.',
      'אבחון נעשה על ידי בדיקה קלינית ולפעמים אולטרסאונד.',
    ],
    protocols: [
      'פני לרופא מומחה לאבחון מדויק.',
      'תעדי את התסמינים שלך לפני הפגישה.',
      'אל תוותרי עד שתקבלי תשובות.',
    ],
    ctas: [
      'חושבת שיש לך ליפאדמה? בואי לאבחון מקצועי.',
      'לפרטים נוספים על תהליך האבחון, צרי קשר.',
    ],
  },
  'General Lipedema': {
    hooks: [
      'ליפאדמה היא לא אשמתך.',
      'חיים עם ליפאדמה - מה שאף אחד לא מספר לך.',
      'המסע שלך עם ליפאדמה הוא ייחודי.',
    ],
    empathy: [
      'אני מבינה את התסכול, הכעס והעצב.',
      'את לא לבד במסע הזה.',
      'כל יום הוא הזדמנות חדשה.',
    ],
    science: [
      'ליפאדמה היא מחלה כרונית של רקמת השומן.',
      'המחלה משפיעה על כ-11% מהנשים.',
      'גורמים גנטיים והורמונליים משחקים תפקיד.',
    ],
    protocols: [
      'בני לעצמך צוות תמיכה מקצועי.',
      'למדי להקשיב לגוף שלך.',
      'חגגי כל הצלחה קטנה בדרך.',
    ],
    ctas: [
      'רוצה ללמוד עוד על ניהול ליפאדמה? צרי קשר.',
      'הצטרפי לקהילה שלנו לתמיכה ומידע.',
    ],
  },
};

/**
 * Checks if a caption is considered short (under threshold)
 * 
 * @param caption - The raw caption text
 * @returns true if caption is under the threshold
 */
export function isShortCaption(caption: string): boolean {
  // Remove hashtags and trim for accurate length check
  const cleanCaption = caption.replace(/#[\w\u0590-\u05FF]+/g, '').trim();
  return cleanCaption.length < SHORT_CAPTION_THRESHOLD;
}

/**
 * Extracts the main content from a caption (removes hashtags)
 * 
 * @param caption - The raw caption text
 * @returns Clean caption without hashtags
 */
export function cleanCaption(caption: string): string {
  return caption.replace(/#[\w\u0590-\u05FF]+/g, '').trim();
}

/**
 * Generates a deterministic index based on content hash
 * 
 * @param content - Content to hash
 * @param max - Maximum value (exclusive)
 * @returns Index between 0 and max-1
 */
function getContentIndex(content: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % max;
}

/**
 * Expands a short caption into a full article using domain knowledge
 * 
 * @param caption - The short caption to expand
 * @param topic - The topic type for domain knowledge
 * @returns Expanded content structure
 */
export function expandShortCaption(caption: string, topic: TopicType): ExpandedContent {
  const knowledge = TOPIC_KNOWLEDGE[topic];
  const cleanContent = cleanCaption(caption);
  
  // Select content deterministically based on caption
  const hookIndex = getContentIndex(cleanContent, knowledge.hooks.length);
  const empathyIndex = getContentIndex(cleanContent + 'empathy', knowledge.empathy.length);
  const scienceIndex = getContentIndex(cleanContent + 'science', knowledge.science.length);
  const protocolIndex = getContentIndex(cleanContent + 'protocol', knowledge.protocols.length);
  const ctaIndex = getContentIndex(cleanContent + 'cta', knowledge.ctas.length);
  
  // Build introduction with hook and empathy
  const introduction = `${knowledge.hooks[hookIndex]}\n\n${knowledge.empathy[empathyIndex]}\n\n${cleanContent}`;
  
  // Build sections with science and protocol
  const sections: ContentSection[] = [
    {
      heading: 'מה חשוב לדעת',
      content: knowledge.science[scienceIndex],
    },
    {
      heading: 'מה אפשר לעשות',
      content: knowledge.protocols[protocolIndex],
    },
  ];
  
  // Build conclusion with CTA
  const conclusion = knowledge.ctas[ctaIndex];
  
  return {
    introduction,
    sections,
    conclusion,
  };
}

/**
 * Restructures a detailed caption into organized article sections
 * 
 * @param caption - The detailed caption to restructure
 * @param topic - The topic type for context
 * @returns Expanded content structure
 */
export function restructureDetailedCaption(caption: string, topic: TopicType): ExpandedContent {
  const knowledge = TOPIC_KNOWLEDGE[topic];
  const cleanContent = cleanCaption(caption);
  
  // Split content into paragraphs
  const paragraphs = cleanContent.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  // Select hook and CTA deterministically
  const hookIndex = getContentIndex(cleanContent, knowledge.hooks.length);
  const ctaIndex = getContentIndex(cleanContent + 'cta', knowledge.ctas.length);
  
  // Build introduction with hook and first paragraph
  const firstParagraph = paragraphs[0] || cleanContent;
  const introduction = `${knowledge.hooks[hookIndex]}\n\n${firstParagraph}`;
  
  // Build sections from remaining paragraphs
  const sections: ContentSection[] = [];
  const remainingParagraphs = paragraphs.slice(1);
  
  if (remainingParagraphs.length > 0) {
    // Group paragraphs into sections
    const sectionHeadings = ['הנקודות החשובות', 'מה כדאי לזכור', 'לסיכום'];
    
    remainingParagraphs.forEach((paragraph, index) => {
      const headingIndex = Math.min(index, sectionHeadings.length - 1);
      sections.push({
        heading: sectionHeadings[headingIndex],
        content: paragraph,
      });
    });
  } else {
    // If no additional paragraphs, add science section
    const scienceIndex = getContentIndex(cleanContent + 'science', knowledge.science.length);
    sections.push({
      heading: 'מידע נוסף',
      content: knowledge.science[scienceIndex],
    });
  }
  
  // Build conclusion with CTA
  const conclusion = knowledge.ctas[ctaIndex];
  
  return {
    introduction,
    sections,
    conclusion,
  };
}

/**
 * Main function to expand content based on caption length
 * 
 * @param rawCaption - The original Instagram caption
 * @param topic - The topic type for domain knowledge
 * @returns Expanded content structure
 */
export function expandContent(rawCaption: string, topic: TopicType): ExpandedContent {
  if (isShortCaption(rawCaption)) {
    return expandShortCaption(rawCaption, topic);
  } else {
    return restructureDetailedCaption(rawCaption, topic);
  }
}

/**
 * Checks if content contains medical vocabulary
 * 
 * @param content - The content to check
 * @returns true if content contains at least one medical term
 */
export function containsMedicalVocabulary(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return MEDICAL_VOCABULARY.some(term => lowerContent.includes(term.toLowerCase()));
}

/**
 * Gets the total content length of expanded content
 * 
 * @param expandedContent - The expanded content structure
 * @returns Total character count
 */
export function getExpandedContentLength(expandedContent: ExpandedContent): number {
  let total = expandedContent.introduction.length;
  total += expandedContent.sections.reduce((sum, section) => 
    sum + section.heading.length + section.content.length, 0);
  total += expandedContent.conclusion.length;
  return total;
}

/**
 * Converts expanded content to plain text for analysis
 * 
 * @param expandedContent - The expanded content structure
 * @returns Plain text representation
 */
export function expandedContentToText(expandedContent: ExpandedContent): string {
  const parts = [expandedContent.introduction];
  
  for (const section of expandedContent.sections) {
    parts.push(`## ${section.heading}`);
    parts.push(section.content);
  }
  
  parts.push(expandedContent.conclusion);
  
  return parts.join('\n\n');
}
