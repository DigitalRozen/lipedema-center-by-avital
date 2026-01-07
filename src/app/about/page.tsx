import { Heart, Award, BookOpen, Users } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dusty-rose-50">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-about-header.png"
            alt="רקע פרחוני עדין"
            fill
            className="object-cover opacity-60"
            quality={90}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dusty-rose-50/90 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-sage-900 mb-6">
                אביטל רוזן
              </h1>
              <p className="text-xl text-sage-600 font-medium mb-4">מומחית ליפדמה</p>
              <p className="text-lg text-sage-800 leading-relaxed">
                אני מאמינה שכל אישה ראויה להבין את הגוף שלה ולקבל טיפול מותאם אישית.
                הגישה שלי משלבת ידע מקצועי עדכני עם הקשבה אמיתית לצרכים הייחודיים של כל מטופלת.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-sage-200/50 to-dusty-rose-200/50 rounded-3xl flex items-center justify-center overflow-hidden shadow-xl">
                <Image
                  src="/images/about-portrait.png"
                  alt="אביטל רוזן - מומחית ליפדמה"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">הסיפור שלי</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              המסע שלי בעולם הליפדמה התחיל כשהבנתי שנשים רבות סובלות בשקט,
              ללא אבחון נכון וללא הבנה אמיתית של המצב שלהן.
            </p>
            <p>
              לאורך השנים צברתי ידע מעמיק בתחום, למדתי מהמומחים המובילים בעולם,
              והתמחיתי בגישה הוליסטית המשלבת תזונה, טיפולים פיזיים ותמיכה רגשית.
            </p>
            <p>
              היום אני גאה ללוות נשים בדרך להבנה עמוקה יותר של הגוף שלהן,
              ולספק להן כלים מעשיים לניהול ליפדמה בחיי היומיום.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-dusty-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">הערכים שלי</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center group hover:shadow-lg transition-all duration-300">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Image
                  src="/images/value-research.png"
                  alt="ידע מבוסס מחקר"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-display font-semibold text-sage-800 mb-4">ידע מבוסס מחקר</h3>
              <p className="text-gray-600">
                כל המידע והטיפולים שאני מציעה מבוססים על המחקרים העדכניים ביותר בתחום.
              </p>
            </div>
            <div className="card p-8 text-center group hover:shadow-lg transition-all duration-300">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Image
                  src="/images/value-personal.png"
                  alt="גישה אישית"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-display font-semibold text-sage-800 mb-4">גישה אישית</h3>
              <p className="text-gray-600">
                כל אישה היא ייחודית, ולכן כל תוכנית טיפול מותאמת אישית לצרכים שלה.
              </p>
            </div>
            <div className="card p-8 text-center group hover:shadow-lg transition-all duration-300">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Image
                  src="/images/value-community.png"
                  alt="קהילה תומכת"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-display font-semibold text-sage-800 mb-4">קהילה תומכת</h3>
              <p className="text-gray-600">
                אני מאמינה בכוח של קהילה ותמיכה הדדית בדרך להחלמה.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Award className="w-8 h-8 text-sage-500" />
            <h2 className="section-title mb-0">הכשרות והסמכות</h2>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-sage-500 rounded-full mt-2" />
              <span className="text-gray-700">הסמכה בתזונה קלינית</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-sage-500 rounded-full mt-2" />
              <span className="text-gray-700">התמחות בטיפול בליפדמה</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-sage-500 rounded-full mt-2" />
              <span className="text-gray-700">הכשרה בניקוז לימפתי ידני (MLD)</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-sage-500 rounded-full mt-2" />
              <span className="text-gray-700">קורסים מתקדמים בטיפולי אינפרא-אדום</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
