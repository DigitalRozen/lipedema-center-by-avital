
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Article: איך ליפאדמה שינה את החיים שלי
// Generated from Instagram post: https://www.instagram.com/p/DOa64rIjNks/

export const metadata: Metadata = {
  title: 'איך ליפאדמה שינה את החיים שלי',
  description: 'איך ליפאדמה שינה את החיים שלי | מדריך תזונה מקצועי לנשים עם ליפאדמה. טיפים מעשיים, מתכונים בריאים ומידע מבוסס מחקר מאביטל רוזן.',
  keywords: ['אוקסלט', 'סירופ', 'אונג', 'אביטל רוזן', 'דלקת', 'עיכול', 'בריאות נשים', 'מתכונים', 'מסורתי', 'תזונה בריאה'],
  openGraph: {
    title: 'איך ליפאדמה שינה את החיים שלי',
    description: 'איך ליפאדמה שינה את החיים שלי | מדריך תזונה מקצועי לנשים עם ליפאדמה. טיפים מעשיים, מתכונים בריאים ומידע מבוסס מחקר מאביטל רוזן.',
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
          איך ליפאדמה שינה את החיים שלי
        </h1>
        {transformed['subtitle'] && (
          <p className="text-xl text-gray-600 mb-6">
            המסע האישי שלי והכלים שעזרו לי להתמודד
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>זמן קריאה: 1 דקות</span>
          <span>קטגוריה: nutrition</span>
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<strong>הסיפור שלי עם הבעיה הזו התחיל לפני כמה שנים...</strong>

### המסע שהוביל אותי לפתרון

גם אני הייתי שם. הרגשתי שמשהו לא בסדר, אבל לא ידעתי בדיוק מה. רופאים אמרו לי שזה נורמלי, שזה חלק מלהיות אישה, שזה קשור למשקל או לגיל.

אבל אני ידעתי שזה לא נכון. הגוף שלי צעק אליי, והרגשתי שאני לא מקבלת את התשובות שאני צריכה.

אז התחלתי לחפש בעצמי. קראתי מחקרים, התייעצתי עם מומחים, וחשוב מכל־התחלתי להקשיב לגוף שלי באמת.

### הפתרון שמצאתי

הפתרון שמצאתי היה שילוב של כמה גישות־תזונה נכונה, תנועה מותאמת, וחשוב מכל, הבנה של מה הגוף שלי באמת צריך.

### התוצאות שקיבלתי

התוצאות שקיבלתי:

<strong>אנרגיה יציבה לאורך היום</strong>־בלי עליות וירידות חדות
<strong>שיפור בעיכול</strong>־פחות נפיחות ואי נוחות
<strong>שינה איכותית יותר</strong>־הגוף מרגיש יותר רגוע
<strong>מצב רוח מאוזן</strong>־פחות תנודות רגשיות

השינוי לא היה מיידי, אבל הוא היה מתמיד. וזה מה שחשוב.

### איך את יכולה להתחיל

<strong>התחילי בהדרגה:</strong>

א. <strong>השבוע הראשון</strong>־תחליפי משקה אחד ביום במים עם לימון
ב. <strong>השבוע השני</strong>־תוסיפי ירק אחד לכל ארוחה
ג. <strong>השבוע השלישי</strong>־תפחיתי מזון מעובד אחד ביום
ד. <strong>השבוע הרביעי</strong>־תשלבי מקור חלבון איכותי בכל ארוחה

<strong>זכרי:</strong> שינוי הדרגתי הוא שינוי מתמיד.־־־<strong>רוצה מדריך מפורט עם כל הטיפים והמתכונים?</strong> הספר הדיגיטלי שלי מכיל הכל במקום אחד. [לפרטים על הספר](digital־guide)` }} />
      </div>
      
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-4">
            מאמר זה נוצר על בסיס תוכן מקורי מאינסטגרם של אביטל רוזן
          </p>
          <a 
            href="https://www.instagram.com/p/DOa64rIjNks/" 
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
