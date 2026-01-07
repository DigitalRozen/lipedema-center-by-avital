
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Article: למה ליפאדמה עלול לפגוע בך יותר מלעזור
// Generated from Instagram post: https://www.instagram.com/p/DOBUw84DMbq/

export const metadata: Metadata = {
  title: 'למה ליפאדמה עלול לפגוע בך יותר מלעזור',
  description: 'למה ליפאדמה עלול לפגוע בך יותר מלעזור | מדריך תזונה מקצועי לנשים עם ליפאדמה. טיפים מעשיים, מתכונים בריאים ומידע מבוסס מחקר מאביטל רוזן.',
  keywords: ['חמאת', 'קוקוס', 'ויטמינים', 'דלקת', 'ליפאדמה', 'אוקסלט', 'טחון', 'בריאות נשים', 'נטורופתיה', 'מתכונים'],
  openGraph: {
    title: 'למה ליפאדמה עלול לפגוע בך יותר מלעזור',
    description: 'למה ליפאדמה עלול לפגוע בך יותר מלעזור | מדריך תזונה מקצועי לנשים עם ליפאדמה. טיפים מעשיים, מתכונים בריאים ומידע מבוסס מחקר מאביטל רוזן.',
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
          למה ליפאדמה עלול לפגוע בך יותר מלעזור
        </h1>
        {transformed['subtitle'] && (
          <p className="text-xl text-gray-600 mb-6">
            הבעיה שלא מדברים עליה ומה שאת יכולה לעשות בנושא
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>זמן קריאה: 1 דקות</span>
          <span>קטגוריה: nutrition</span>
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<strong>את מרגישה שמשהו לא בסדר, אבל לא יודעת בדיוק מה?</strong>

יש בעיה שרבות מאיתנו חוות, אבל לא תמיד יודעות לקרוא לה בשם. זה מתחיל בתחושות קטנות שהופכות לגדולות יותר.

### למה זה קורה?

מחקרים מראים שהמזון שאנחנו אוכלות משפיע ישירות על רמות הדלקת בגוף. כשאנחנו צורכות מזונות מסוימים, הגוף מגיב בדלקתיות שיכולה להחמיר תסמינים קיימים.

### התסמינים שלא קישרת

התסמינים שעלולים להופיע:־<strong>דלקת</strong>־תחושה שמלווה אותך יום יום־<strong>מתח</strong>־תחושה שמלווה אותך יום יום־<strong>עיכול</strong>־תחושה שמלווה אותך יום יום

אם את מזהה חלק מהתסמינים האלה, את לא לבד. זה חלק מהתמונה הגדולה יותר.

### מה את יכולה לעשות עכשיו?

<strong>תתחילי לקרוא תוויות</strong>־תבדקי מה באמת יש במוצרים שלך
<strong>תשלבי מזונות אנטי דלקתיים</strong>־דגים שומניים, ירקות עלים ירוקים
<strong>תפחיתי מזונות מעובדים</strong>־ככל שהמזון פשוט יותר, טוב יותר לגוף
<strong>תשתי מים עם מינרלים</strong>־כדי לפצות על מה שהגוף מאבד־־־<strong>רוצה מדריך מפורט עם כל הטיפים והמתכונים?</strong> הספר הדיגיטלי שלי מכיל הכל במקום אחד. [לפרטים על הספר](digital־guide)` }} />
      </div>
      
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-4">
            מאמר זה נוצר על בסיס תוכן מקורי מאינסטגרם של אביטל רוזן
          </p>
          <a 
            href="https://www.instagram.com/p/DOBUw84DMbq/" 
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
