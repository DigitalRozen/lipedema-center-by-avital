'use client'

import { usePathname } from 'next/navigation'
import { LocaleProvider } from '@/lib/i18n/context'
import { Header } from './Header'
import { Footer } from './Footer'
import { AccessibilityWidget } from '@/components/ui/AccessibilityWidget'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Keystatic has its own layout, render children directly
  if (pathname?.startsWith('/keystatic')) {
    return <>{children}</>
  }

  return (
    <LocaleProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <AccessibilityWidget />
      <Footer />
    </LocaleProvider>
  )
}
