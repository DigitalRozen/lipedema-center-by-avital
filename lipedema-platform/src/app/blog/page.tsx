import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { getAllPosts } from '@/lib/keystatic'
import { BlogGrid } from '@/components/knowledge/BlogGrid'

export const metadata = {
  title: 'בלוג | אביטל רוזן - מומחית ליפאדמה',
  description: 'מאמרים מקצועיים על ליפאדמה, תזונה, טיפולים ומיינדסט. מידע מבוסס מחקר וניסיון קליני.',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-[#FAFAF5]" dir="rtl">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-knowledge-header-new.png"
            alt="מרכז ידע ליפאדמה"
            fill
            className="object-cover opacity-60"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-[#FAFAF5]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-100/80 backdrop-blur-sm text-sage-800 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>הספרייה הלימפתית שלך</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-sage-900 mb-6 leading-tight">
              מרכז הידע
            </h1>
            <p className="text-lg md:text-xl text-sage-800 max-w-2xl font-light leading-relaxed mx-auto md:mx-0">
              מאמרים מקצועיים, מתכונים בריאים, וטיפים מעשיים לניהול ליפאדמה
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid with Search and Filter */}
      <BlogGrid posts={posts} />
    </div>
  )
}
