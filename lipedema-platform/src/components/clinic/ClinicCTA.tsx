'use client'

import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { useLocale } from '@/lib/i18n/context'

interface ClinicCTAProps {
  variant?: 'inline' | 'sidebar'
  className?: string
}

export function ClinicCTA({ variant = 'inline', className = '' }: ClinicCTAProps) {
  const { t, dir } = useLocale()

  if (variant === 'sidebar') {
    // Existing sidebar variant (already implemented in the post page)
    return (
      <div className={`bg-sage-500 rounded-2xl p-6 text-white ${className}`}>
        <h3 className="font-display font-semibold text-xl mb-3 !text-white">
          {t.sidebar.personalSupport}
        </h3>
        <p className="text-sage-50 text-sm mb-4">
          {t.sidebar.personalSupportDesc}
        </p>
        <Link
          href="/clinic"
          className="block text-center bg-white text-sage-800 py-3 rounded-lg font-medium hover:bg-dusty-rose-100 transition-colors"
        >
          {t.cta.button}
        </Link>
      </div>
    )
  }

  // Inline variant for High Ticket posts - more prominent
  return (
    <div className={`bg-gradient-to-br from-sage-500 to-sage-600 rounded-3xl p-8 text-white shadow-xl border-2 border-sage-400 my-8 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-2xl mb-3 !text-white">
            התאמת תוכנית טיפול אישית
          </h3>
          <p className="text-sage-100 text-lg mb-6 leading-relaxed">
            מוכנה לקבל טיפול מותאם אישית? הצטרפי לרשימת ההמתנה לקליניקה שלי וקבלי גישה ראשונה לטיפולים המתקדמים ביותר לליפאדמה.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/clinic"
              className="inline-flex items-center justify-center gap-2 bg-white text-sage-800 px-6 py-4 rounded-xl font-semibold hover:bg-dusty-rose-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>הצטרפי לרשימת ההמתנה</span>
              <ArrowLeft className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
            <div className="text-sage-200 text-sm flex items-center">
              ✓ ללא התחייבות • ✓ מענה תוך 24 שעות
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}