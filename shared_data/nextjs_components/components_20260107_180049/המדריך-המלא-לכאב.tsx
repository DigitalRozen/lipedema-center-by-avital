
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Article: המדריך המלא לכאב
// Generated from Instagram post: https://www.instagram.com/p/DQhVnw3jBW5/

export const metadata: Metadata = {
  title: 'המדריך המלא לכאב',
  description: 'המדריך המלא לכאב | טיפול פיזי וטכניקות שיקום לליפאדמה. עיסויים, תנועה ופתרונות מעשיים מאביטל רוזן נטורופתית.',
  keywords: ['ליפאדמה', 'שיקום', 'עיסוי', 'בריאות נשים', 'לימפה', 'פיזיותרפיה', 'נטורופתיה', 'ביתיים', 'זהירות', 'נפיחות'],
  openGraph: {
    title: 'המדריך המלא לכאב',
    description: 'המדריך המלא לכאב | טיפול פיזי וטכניקות שיקום לליפאדמה. עיסויים, תנועה ופתרונות מעשיים מאביטל רוזן נטורופתית.',
    type: 'article',
    locale: 'he_IL',
  },
  alternates: {
    canonical: '/knowledge/article',
  },
}

export default function ArticlePage() {
  return (
    <article className="hebrew-content max-w-4xl mx-auto px-4 py-8" dir="rtl">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          המדריך המלא לכאב
        </h1>
        {transformed['subtitle'] && (
          <p className="text-xl text-gray-600 mb-6">
            המידע המעשי שתצטרכי כדי להתחיל
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>זמן קריאה: 1 דקות</span>
          <span>קטגוריה: physical</span>
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<strong>מחפשת פתרון פשוט ויעיל? הנה בדיוק מה שאת צריכה.</strong>

### למה זה עובד כל כך טוב?

תנועה עדינה ועיסוי עובדים כי הם מעודדים את זרימת הלימפה והדם. זה כמו לפתוח ברזים שהיו סתומים־הנוזלים מתחילים לזרום שוב בחופשיות.

### המדריך המעשי

א. התחילי בהדרגה ובקצב שמתאים לך
ב. תקשיבי לגוף שלך ותתאימי בהתאם
ג. תהיי עקבית־עדיף מעט כל יום מאשר הרבה פעם בשבוע
ד. תחפשי תמיכה ממומחים או מקבוצת נשים
ה. תהיי סבלנית־שינוי אמיתי לוקח זמן

### טיפים לשימוש מיטבי

<strong>תתחילי לאט</strong>־עדיף להתקדם בהדרגה
<strong>תשימי לב לתחושות</strong>־אי נוחות זה בסדר, כאב זה לא
<strong>תהיי עקבית</strong>־10 דקות כל יום עדיף משעה פעם בשבוע
<strong>תתאימי לעצמך</strong>־כל גוף שונה ויש לו צרכים שונים־־־<strong>רוצה את המוצרים המדויקים שאני ממליצה?</strong> הכנתי בשבילך רשימה של המוצרים הכי איכותיים. [לרשימת המוצרים](products)` }} />
      </div>
      
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-4">
            מאמר זה נוצר על בסיס תוכן מקורי מאינסטגרם של אביטל רוזן
          </p>
          <a 
            href="https://www.instagram.com/p/DQhVnw3jBW5/" 
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
}
