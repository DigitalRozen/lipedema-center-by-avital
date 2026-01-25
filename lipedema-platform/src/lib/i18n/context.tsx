'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, translations } from './translations'

type Translations = typeof translations.he | typeof translations.en

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
  dir: 'rtl' | 'ltr'
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('he')

  useEffect(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved && (saved === 'he' || saved === 'en')) {
      setLocaleState(saved)
    }
  }, [])

  useEffect(() => {
    // Update document direction and lang
    document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
    localStorage.setItem('locale', locale)
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
  }

  const value: LocaleContextType = {
    locale,
    setLocale,
    t: translations[locale],
    dir: locale === 'he' ? 'rtl' : 'ltr',
  }

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
