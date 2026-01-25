'use client'

import { Heart, Award, Sparkles, BookOpen, Quote, Target, Sun } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-about-header.png"
            alt="רקע עדין"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-[#FAFAF5]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center lg:text-right"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-sage-100 text-sage-800 text-sm font-medium mb-6">
                נעים מאוד, אני אביטל
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-sage-900 mb-6 leading-tight">
                אמא, נטורופתית <br />
                <span className="text-dusty-rose-600 font-display">ושותפה למסע שלכן</span>
              </h1>
              <p className="text-lg md:text-xl text-sage-800 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                נטורופתית מוסמכת המתמחה במחלות כרוניות, מישהי שהבינה יום אחד שהיא לא רק מטפלת - היא גם חלק מהסטטיסטיקה.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-md mx-auto lg:max-w-none"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
                <Image
                  src="/images/avital rozen profile.jpg"
                  alt="אביטל רוזן"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-dusty-rose-200 rounded-full blur-3xl opacity-50 -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-sage-200 rounded-full blur-3xl opacity-50 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Story Section - Glassmorphism */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-sage-900 mb-4">הכל פשוט התחבר</h2>
              <div className="h-1 w-20 bg-dusty-rose-400 mx-auto rounded-full" />
            </motion.div>

            {/* Part 1: Discovery */}
            <motion.div variants={fadeInUp} className="bg-white/40 backdrop-blur-md border border-white/60 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm">
              <Quote className="w-8 h-8 md:w-10 md:h-10 text-dusty-rose-300 mb-6 opacity-50" />
              <p className="text-lg md:text-xl text-sage-900 leading-relaxed font-light italic">
                "את השם ליפאדמה יצא לי להכיר לפני בערך 3 שנים ומאותו הרגע הבנתי שגם אני בסטטיסטיקה.
                הכל פשוט התחבר! סוף סוף הבנתי מה 'לא בסדר בי'."
              </p>
              <p className="text-sage-600 mt-4 text-xs md:text-sm font-medium">
                (אין שום דבר לא בסדר, אבל זאת הייתה ההרגשה ואני לא מתכוונת להסתיר אותה).
              </p>
            </motion.div>

            {/* Part 2: The Struggle */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <motion.div variants={fadeInUp} className="bg-white/60 p-6 md:p-8 rounded-3xl border border-white shadow-sm">
                <div className="w-12 h-12 bg-sage-100 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="text-sage-600" />
                </div>
                <h3 className="text-xl font-bold text-sage-900 mb-4">השנים המאתגרות</h3>
                <p className="text-sage-800 leading-relaxed text-sm md:text-base">
                  החל מגיל 17 עברתי הליכים כירורגים אגרסיביים, כואבים ומייגעים. באחד מהם כמעט איבדתי את חיי. עברתי אינספור מכשירים כואבים שנועדו "להעלים צלוליט", כשבזמנו פשוט קראו לזה "מבנה גוף".
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-white/60 p-6 md:p-8 rounded-3xl border border-white shadow-sm">
                <div className="w-12 h-12 bg-dusty-rose-100 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="text-dusty-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-sage-900 mb-4">תחושת השליחות</h3>
                <p className="text-sage-800 leading-relaxed text-sm md:text-base">
                  לאחר שגיליתי את המחלה, הקדשתי את חיי ללמידה מכל כיוון אפשרי. התנסיתי על עצמי בכלים נטורופתיים, ארומתרפיים ותזונתיים, ולמדתי את גוף האישה מחדש כדי להעניק לכן את ההקלה שמגיעה לכן.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Connection & Mission Section */}
      <section className="py-20 md:py-24 bg-sage-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage-800 rounded-full blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-display font-medium leading-tight">
              אני מכירה את ההרגשה שלכן... <br />
              <span className="text-dusty-rose-300 font-display">הכאבים, הבושה, הייאוש.</span>
            </h2>
            <p className="text-lg md:text-xl text-sage-200 leading-relaxed max-w-3xl mx-auto font-light">
              הייתי שם. אני יודעת מה זה כשקשה לעמוד על הרגליים, כשאין כוח לקום לשחק עם הילד כי פשוט כואב. אני חיה את הייעוד שלי - להחזיר לכן את הביטחון ואיכות החיים.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-8 md:pt-12">
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-dusty-rose-300">4</div>
                <div className="text-xs md:text-sm text-sage-300">שנות לימודי נטורופתיה</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-dusty-rose-300">3</div>
                <div className="text-xs md:text-sm text-sage-300">שנות מחקר מעמיק בליפאדמה</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-dusty-rose-300">100%</div>
                <div className="text-xs md:text-sm text-sage-300">מסירות להקלה וביטחון</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-dusty-rose-300">∞</div>
                <div className="text-xs md:text-sm text-sage-300">תקווה לשינוי אמיתי</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hope & Management Section */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-dusty-rose-50 p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] text-center border border-dusty-rose-100 relative shadow-inner"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Sun className="w-6 h-6 md:w-8 md:h-8 text-dusty-rose-500 animate-pulse" />
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-sage-900 mb-6">יש תקווה 🩵</h2>
            <p className="text-xl md:text-2xl text-sage-800 font-light leading-relaxed mb-6 md:mb-8">
              ליפאדמה היא מחלה כרונית שאי אפשר לרפא,
              <br />
              <strong className="text-dusty-rose-600 font-bold block mt-4 text-2xl md:text-3xl">אבל אפשר להקל!</strong>
            </p>
            <p className="text-lg md:text-xl text-sage-700 leading-relaxed max-w-2xl mx-auto">
              אפשר להפחית תסמינים, להוריד נפיחות, לטפל בדלקתיות ולחיות את החיים בדיוק כמו כולם. אני כאן כדי להראות לכן איך.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Credentials Summary */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Award className="w-8 h-8 text-sage-600" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-sage-900">הכשרות מקצועיות</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            {['נטורופתית מוסמכת ND', 'ארומתרפיסטית', 'מומחית תזונה קלינית', 'מלווה לניהול מחלות דלקתיות'].map((item, i) => (
              <span key={i} className="px-4 md:px-6 py-2 rounded-xl bg-[#FAFAF5] border border-sage-100 text-sage-800 text-xs md:text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}



