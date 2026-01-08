'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, BookOpen, Heart, Users } from 'lucide-react'
import { useLocale } from '@/lib/i18n/context'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Post } from '@/types/database'
import { Hero } from '@/components/Hero'
import { getArticleImage } from '@/lib/utils/imageUtils'

export default function HomePage() {
  const { t, locale, dir } = useLocale()
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  useEffect(() => {
    async function fetchPosts() {
      const supabase = createClient()
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false })
        .limit(3)

      if (data) setLatestPosts(data)
    }
    fetchPosts()
  }, [])

  const getCategoryLabel = (category: string) => {
    return t.categories[category as keyof typeof t.categories] || category
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero dir={dir} />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">{t.features.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center group hover:shadow-lg transition-all duration-300">
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-md">
                <Image
                  src="/images/feature-knowledge.png"
                  alt={t.features.knowledge.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-display font-semibold text-sage-700 mb-4">{t.features.knowledge.title}</h3>
              <p className="text-gray-600">
                {t.features.knowledge.description}
              </p>
            </div>
            <div className="card p-8 text-center group hover:shadow-lg transition-all duration-300">
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-md">
                <Image
                  src="/images/feature-treatment.png"
                  alt={t.features.treatments.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-display font-semibold text-sage-700 mb-4">{t.features.treatments.title}</h3>
              <p className="text-gray-600">
                {t.features.treatments.description}
              </p>
            </div>
            <div className="card p-8 text-center group hover:shadow-lg transition-all duration-300">
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-md">
                <Image
                  src="/images/feature-support.png"
                  alt={t.features.support.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-display font-semibold text-sage-700 mb-4">{t.features.support.title}</h3>
              <p className="text-gray-600">
                {t.features.support.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {latestPosts.length > 0 && (
        <section className="py-24 bg-cream-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="section-title mb-4">{t.articles.title}</h2>
                <p className="text-lg text-sage-800/70 max-w-2xl">
                  מידע מקצועי, מחקרים עדכניים וסיפורי הצלחה מהקהילה
                </p>
              </div>
              <Link href="/knowledge" className="hidden md:flex text-sage-700 hover:text-sage-900 font-semibold items-center gap-2 transition-colors">
                {t.articles.viewAll}
                <Arrow className="w-5 h-5 flip-rtl" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/knowledge/${post.slug}`} className="glass-card group overflow-hidden border-0 bg-white/40 hover:bg-white/60">
                  <div className="aspect-[16/10] relative overflow-hidden bg-sage-100">
                    <Image
                      src={getArticleImage(post)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-8">
                    <span className="inline-block text-xs font-bold text-sage-800 tracking-wider uppercase mb-3">
                      {getCategoryLabel(post.category)}
                    </span>
                    <h3 className="text-xl font-display font-bold text-sage-900 mb-3 group-hover:text-dusty-rose-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-sage-700/80 leading-relaxed line-clamp-2">{post.excerpt}</p>

                    <div className="mt-6 flex items-center text-sm font-medium text-sage-600 group-hover:text-sage-900 transition-colors">
                      <span>קראי עוד</span>
                      <Arrow className="w-4 h-4 mx-2 transition-transform group-hover:-translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link href="/knowledge" className="btn-secondary inline-flex items-center gap-2">
                {t.articles.viewAll}
                <Arrow className="w-4 h-4 flip-rtl" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-sage-500 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/wave-texture.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold !text-white mb-6">
            {t.cta.title}
          </h2>
          <p className="text-sage-50 text-lg mb-8">
            {t.cta.description}
          </p>
          <Link href="/clinic" className="bg-white text-sage-900 px-8 py-4 rounded-lg font-semibold hover:bg-dusty-rose-100 transition-colors inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
            {t.cta.button}
          </Link>
        </div>
      </section>
    </div>
  )
}
