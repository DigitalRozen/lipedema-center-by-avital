
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Article: למה מתח עלול לפגוע בך יותר מלעזור
// Generated from Instagram post: https://www.instagram.com/p/DF2mcSRscvv/

export const metadata: Metadata = {
  title: 'למה מתח עלול לפגוע בך יותר מלעזור',
  description: 'למה מתח עלול לפגוע בך יותר מלעזור | מידע מקצועי על אבחון וטיפול בליפאדמה. הכרת התסמינים והדרך לטיפול נכון מאביטל רוזן.',
  keywords: ['בדיקות', 'תסמינים', 'אביטל רוזן', 'טיפול רפואי', 'בריאות נשים', 'בריא', 'אבחון', 'מומחה', 'ליפאדמה', 'אליו'],
  openGraph: {
    title: 'למה מתח עלול לפגוע בך יותר מלעזור',
    description: 'למה מתח עלול לפגוע בך יותר מלעזור | מידע מקצועי על אבחון וטיפול בליפאדמה. הכרת התסמינים והדרך לטיפול נכון מאביטל רוזן.',
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
          למה מתח עלול לפגוע בך יותר מלעזור
        </h1>
        {transformed['subtitle'] && (
          <p className="text-xl text-gray-600 mb-6">
            הבעיה שלא מדברים עליה ומה שאת יכולה לעשות בנושא
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>זמן קריאה: 1 דקות</span>
          <span>קטגוריה: diagnosis</span>
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<strong>את מרגישה שמשהו לא בסדר, אבל לא יודעת בדיוק מה?</strong>

הבעיה מתחילה כשאת מתחילה לשים לב שקיצרתי את ההרצאה השלמה שלי שעורכת כמעט שעתיים לתוך סירטון של 10 דק', אם נשארתם עד הסוף,  שאפו! הבריאות שלכם באמת חשובה לכם. זה לא משהו שקורה בין לילה, אלא תהליך הדרגתי שרבות מאיתנו חוות.

### למה זה קורה?

ליפאדמה היא מחלה כרונית של מערכת הלימפה שגורמת להצטברות נוזלים ברקמות. זה לא קשור למשקל או לאורח חיים, אלא למבנה גנטי של מערכת הלימפה.

### התסמינים שלא קישרת

התסמינים שעלולים להופיע:־<strong>מתח</strong>־תחושה שמלווה אותך יום יום

אם את מזהה חלק מהתסמינים האלה, את לא לבד. זה חלק מהתמונה הגדולה יותר.

### מה את יכולה לעשות עכשיו?

<strong>תפני לרופא מומחה</strong>־אבחון מוקדם חשוב
<strong>תתעדי תסמינים</strong>־כדי לעזור לרופא להבין
<strong>תלמדי על המחלה</strong>־ידע זה כוח
<strong>תחפשי קבוצת תמיכה</strong>־את לא לבד במסע הזה־־־<strong>רוצה ליווי אישי ומקצועי?</strong> אני כאן כדי לעזור לך למצוא את הדרך הנכונה בשבילך. [לחצי כאן לייעוץ אישי](clinic)` }} />
      </div>
      
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-4">
            מאמר זה נוצר על בסיס תוכן מקורי מאינסטגרם של אביטל רוזן
          </p>
          <a 
            href="https://www.instagram.com/p/DF2mcSRscvv/" 
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
