import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Import script for new articles
 * Run this component to import the new processed articles into the platform
 */

interface ArticleData {
  id: string
  title: string
  subtitle: string
  content: string
  slug: string
  category: string
  awareness_level: string
  monetization_strategy: string
  meta_description: string
  keywords: string[]
  estimated_reading_time: number
  featured: boolean
  published: boolean
}

const newArticles: ArticleData[] = [
  {
    id: 'article_2_nutrition_revolution',
    title: 'למה ליפאדמה עלול לפגוע בך יותר מלעזור',
    subtitle: 'הבעיה שלא מדברים עליה ומה שאת יכולה לעשות בנושא',
    content: `**את מרגישה שמשהו לא בסדר, אבל לא יודעת בדיוק מה?**

הבעיה מתחילה כשאת מתחילה לשים לב שהמפתח המרכזי בתזונה המוצעת על ידי אביטל רוזן הוא זיהוי ונטרול של קבוצות מזון רעילות המגבירות דלקתיות. זה לא משהו שקורה בין לילה, אלא תהליך הדרגתי שרבות מאיתנו חוות.

### למה זה קורה?

מחקרים מראים שהמזון שאנחנו אוכלות משפיע ישירות על רמות הדלקת בגוף. כשאנחנו צורכות מזונות מסוימים, הגוף מגיב בדלקתיות שיכולה להחמיר תסמינים קיימים.

### התסמינים שלא קישרת

התסמינים שעלולים להופיע:

- **כאב** - תחושה שמלווה אותך יום יום
- **דלקת** - תחושה שמלווה אותך יום יום

אם את מזהה חלק מהתסמינים האלה, את לא לבד. זה חלק מהתמונה הגדולה יותר.

### מה את יכולה לעשות עכשיו?

**תתחילי לקרוא תוויות** - תבדקי מה באמת יש במוצרים שלך
**תשלבי מזונות אנטי דלקתיים** - דגים שומניים, ירקות עלים ירוקים
**תפחיתי מזונות מעובדים** - ככל שהמזון פשוט יותר, טוב יותר לגוף
**תשתי מים עם מינרלים** - כדי לפצות על מה שהגוף מאבד


---

**רוצה את המוצרים המדויקים שאני ממליצה?** הכנתי בשבילך רשימה של המוצרים הכי איכותיים. [לרשימת המוצרים](products)`,
    slug: 'nutrition-revolution-healing-diet',
    category: 'nutrition',
    awareness_level: 'problem',
    monetization_strategy: 'Contextual Upsell (Affiliate)',
    meta_description: 'למה ליפאדמה עלול לפגוע בך יותר מלעזור | מדריך תזונה מקצועי לנשים עם ליפאדמה. טיפים מעשיים, מתכונים בריאים ומידע מבוסס מחקר מאביטל רוזן.',
    keywords: ['חייב', 'ויטמינים', 'בריאות נשים', 'עיכול', 'ליפאדמה', 'דלקת', 'הליפאדמה', 'נטורופתיה', 'אביטל', 'מתכונים'],
    estimated_reading_time: 1,
    featured: true,
    published: true
  },
  {
    id: 'article_3_technology_tools',
    title: 'איך ליפאדמה שינה את החיים שלי',
    subtitle: 'המסע האישי שלי והכלים שעזרו לי להתמודד',
    content: `**הסיפור שלי עם הבעיה הזו התחיל לפני כמה שנים...**

### המסע שהוביל אותי לפתרון

גם אני הייתי שם. הרגשתי שמשהו לא בסדר, אבל לא ידעתי בדיוק מה. רופאים אמרו לי שזה נורמלי, שזה חלק מלהיות אישה, שזה קשור למשקל או לגיל.

אבל אני ידעתי שזה לא נכון. הגוף שלי צעק אליי, והרגשתי שאני לא מקבלת את התשובות שאני צריכה.

אז התחלתי לחפש בעצמי. קראתי מחקרים, התייעצתי עם מומחים, וחשוב מכל - התחלתי להקשיב לגוף שלי באמת.

### הפתרון שמצאתי

הפתרון שמצאתי היה פשוט יותר ממה שחשבתי. ניהול יעיל של ליפאדמה דורש שילוב מדויק בין טיפול מקצועי בקליניקה לבין תחזוקה יומיומית בבית. זה לא קרה בין לילה, אבל בהדרגה התחלתי לראות שינוי.

### התוצאות שקיבלתי

התוצאות שקיבלתי:

**הפחתה בנפיחות** - הרגליים מרגישות קלות יותר
**שיפור בכאבים** - פחות אי נוחות יום יומית
**תחושת קלילות** - הגוף זז בקלות רבה יותר
**שיפור בזרימה** - תחושה של חיוניות

השינוי לא היה מיידי, אבל הוא היה מתמיד. וזה מה שחשוב.

### איך את יכולה להתחיל

**תתחילי עם 10 דקות ביום:**

1. **בוקר** - 3 דקות מתיחות עדינות
2. **צהריים** - 2 דקות הליכה או תנועה קלה
3. **ערב** - 5 דקות עיסוי עצמי או רגליים למעלה

**טיפ חשוב:** עדיף 10 דקות כל יום מאשר שעה פעם בשבוע.


---

**רוצה את המוצרים המדויקים שאני ממליצה?** הכנתי בשבילך רשימה של המוצרים הכי איכותיים. [לרשימת המוצרים](products)`,
    slug: 'technology-tools-conservative-management',
    category: 'physical',
    awareness_level: 'solution',
    monetization_strategy: 'Contextual Upsell (Affiliate)',
    meta_description: 'איך ליפאדמה שינה את החיים שלי | טיפול פיזי וטכניקות שיקום לליפאדמה. עיסויים, תנועה ופתרונות מעשיים מאביטל רוזן נטורופתית.',
    keywords: ['בריאות נשים', 'עיסוי', 'טיפול', 'ליפאדמה', 'שיקום', 'הכלים', 'תנועה', 'נטורופתיה', 'יעיל', 'נפיחות'],
    estimated_reading_time: 1,
    featured: true,
    published: true
  },
  {
    id: 'article_4_femininity_emotions',
    title: 'למה ליפאדמה עלול לפגוע בך יותר מלעזור',
    subtitle: 'הבעיה שלא מדברים עליה ומה שאת יכולה לעשות בנושא',
    content: `**את מרגישה שמשהו לא בסדר, אבל לא יודעת בדיוק מה?**

יש בעיה שרבות מאיתנו חוות, אבל לא תמיד יודעות לקרוא לה בשם. זה מתחיל בתחושות קטנות שהופכות לגדולות יותר.

### למה זה קורה?

מערכת העצבים והמערכת ההורמונלית שלנו קשורות קשר הדוק. כשאנחנו במתח כרוני, הגוף מפריש הורמונים שמשפיעים על השינה, מצב הרוח והבריאות הכללית.

### התסמינים שלא קישרת

התסמינים שעלולים להופיע:

- **דלקת** - תחושה שמלווה אותך יום יום
- **חרדה** - תחושה שמלווה אותך יום יום

אם את מזהה חלק מהתסמינים האלה, את לא לבד. זה חלק מהתמונה הגדולה יותר.

### מה את יכולה לעשות עכשיו?

**תתחילי ביומן רגשות** - כדי להבין את הדפוסים
**תשלבי טכניקות הרגעה** - נשימות עמוקות או מדיטציה
**תיצרי שגרת שינה** - שינה איכותית חיונית
**תחפשי תמיכה מקצועית** - אין בושה בלבקש עזרה


---

**רוצה ליווי אישי ומקצועי?** אני כאן כדי לעזור לך למצוא את הדרך הנכונה בשבילך. [לחצי כאן לייעוץ אישי](clinic)`,
    slug: 'femininity-emotions-relationships',
    category: 'mindset',
    awareness_level: 'problem',
    monetization_strategy: 'High Ticket (Clinic Consultation)',
    meta_description: 'למה ליפאדמה עלול לפגוע בך יותר מלעזור | תמיכה רגשית ומיינדסט חיובי לנשים עם ליפאדמה. כלים מעשיים להתמודדות מאביטל רוזן.',
    keywords: ['תמיכה רגשית', 'העצמי', 'מצב רוח', 'רבות', 'בריאות נשים', 'חרדה', 'שינה', 'ליפאדמה', 'נשים', 'נטורופתיה'],
    estimated_reading_time: 1,
    featured: true,
    published: true
  }
]

export default async function ImportNewArticles() {
  const supabase = createClient()

  // Import articles
  for (const article of newArticles) {
    const { error } = await supabase
      .from('posts')
      .insert({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        content: article.content,
        slug: article.slug,
        category: article.category,
        awareness_level: article.awareness_level,
        monetization_strategy: article.monetization_strategy,
        meta_description: article.meta_description,
        keywords: article.keywords,
        estimated_reading_time: article.estimated_reading_time,
        featured: article.featured,
        published: article.published,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error(`Error importing article ${article.id}:`, error)
    } else {
      console.log(`✅ Successfully imported: ${article.title}`)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Import New Articles</h1>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          ✅ Articles Ready for Import
        </h2>
        <ul className="space-y-2">
          {newArticles.map((article) => (
            <li key={article.id} className="text-green-700">
              <strong>{article.title}</strong> - {article.category} ({article.awareness_level})
            </li>
          ))}
        </ul>
        <div className="mt-4 text-sm text-green-600">
          <p>Total articles: {newArticles.length}</p>
          <p>Categories: nutrition (1), physical (1), mindset (1)</p>
          <p>Monetization: Affiliate (2), Clinic (1)</p>
        </div>
      </div>
    </div>
  )
}