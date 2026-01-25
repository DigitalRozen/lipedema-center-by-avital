import Link from 'next/link'
import { LayoutDashboard, FileText, Package, Users, Upload, Activity, Sparkles } from 'lucide-react'

const adminLinks = [
  { href: '/admin', label: 'דשבורד', icon: LayoutDashboard },
  { href: '/admin/editor', label: 'קוקפיט עריכה', icon: Sparkles },
  { href: '/admin/posts', label: 'מאמרים', icon: FileText },
  { href: '/admin/products', label: 'מוצרים', icon: Package },
  { href: '/admin/waitlist', label: 'רשימת המתנה', icon: Users },
  { href: '/admin/import', label: 'ייבוא JSON', icon: Upload },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-l border-gray-200 min-h-screen p-6">
          <h2 className="text-xl font-display font-semibold text-teal mb-6">
            ניהול האתר
          </h2>
          <nav className="space-y-2">
            {adminLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-teal/5 hover:text-teal transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
