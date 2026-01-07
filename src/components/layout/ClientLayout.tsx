'use client'

import { LocaleProvider } from '@/lib/i18n/context'
import { Header } from './Header'
import { Footer } from './Footer'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </LocaleProvider>
  )
}
