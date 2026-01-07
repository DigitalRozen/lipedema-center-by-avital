'use client'

import { useLocale } from '@/lib/i18n/context'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <button
      onClick={() => setLocale(locale === 'he' ? 'en' : 'he')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sand-50 hover:bg-sand-100 transition-colors text-sm font-medium"
      aria-label={locale === 'he' ? 'Switch to English' : 'החלף לעברית'}
    >
      {locale === 'he' ? (
        <>
          <span className="text-base">🇺🇸</span>
          <span className="text-gray-600">EN</span>
        </>
      ) : (
        <>
          <span className="text-base">🇮🇱</span>
          <span className="text-gray-600">עב</span>
        </>
      )}
    </button>
  )
}
