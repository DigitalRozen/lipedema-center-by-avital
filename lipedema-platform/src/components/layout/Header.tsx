'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Leaf } from 'lucide-react'
import { useLocale } from '@/lib/i18n/context'
import { LanguageSwitcher } from '../LanguageSwitcher'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLocale()

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/blog', label: t.nav.knowledge },
    { href: '/clinic', label: t.nav.clinic },
    { href: '/about', label: t.nav.about },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-700 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-sage-900">אביטל רוזן</h1>
              <p className="text-xs text-sage-600">{t.footer.expert}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sage-700 hover:text-sage-900 transition-colors font-medium group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sage-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
              </Link>
            ))}
            <LanguageSwitcher />
            <Link href="/clinic" className="btn-primary">
              {t.nav.joinWaitlist}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="תפריט"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden py-4 border-t border-sand-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-sage-700 hover:text-sage-900 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/clinic"
              className="btn-primary block text-center mt-4"
              onClick={() => setIsOpen(false)}
            >
              {t.nav.joinWaitlist}
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
