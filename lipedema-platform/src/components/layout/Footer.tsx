'use client'

import Link from 'next/link'
import { Leaf, Mail, Instagram, MessageCircle } from 'lucide-react'
import { useLocale } from '@/lib/i18n/context'

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="bg-sage-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold !text-white">אביטל רוזן</h3>
                <p className="text-sm text-sage-100">{t.footer.expert}</p>
              </div>
            </div>
            <p className="text-sage-100 max-w-md">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 !text-white">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-sage-100 hover:text-white transition-colors">
                  {t.nav.knowledge}
                </Link>
              </li>
              <li>
                <Link href="/clinic" className="text-sage-100 hover:text-white transition-colors">
                  {t.nav.clinic}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sage-100 hover:text-white transition-colors">
                  {t.nav.about}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 !text-white">{t.footer.contact}</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:avitalyanko@gmail.com" className="flex items-center gap-2 text-sage-100 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  avitalyanko@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/972528985282" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sage-100 hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp: 052-898-5282
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/avital_naturopath/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sage-100 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                  @avital_naturopath
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sage-800 mt-8 pt-8 text-center text-sage-200 text-sm">
          <p>© {new Date().getFullYear()} אביטל רוזן. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
