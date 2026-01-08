'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Post, PostCategory } from '@/types/database'
import { useLocale } from '@/lib/i18n/context'
import { getArticleImage } from '@/lib/utils/imageUtils'


export default function KnowledgePage() {
  const { t } = useLocale()
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all')
  const [loading, setLoading] = useState(true)

  const categories: { value: PostCategory | 'all'; label: string }[] = [
    { value: 'all', label: t.categories.all },
    { value: 'diagnosis', label: t.categories.diagnosis },
    { value: 'nutrition', label: t.categories.nutrition },
    { value: 'physical', label: t.categories.physical },
    { value: 'mindset', label: t.categories.mindset },
    // Keep legacy categories for backward compatibility
    { value: 'Nutrition', label: t.categories.Nutrition },
    { value: 'Treatment', label: t.categories.Treatment },
    { value: 'Success', label: t.categories.Success },
  ]

  useEffect(() => {
    async function fetchPosts() {
      const supabase = createClient()
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false })

      if (data) {
        setPosts(data)
        setFilteredPosts(data)
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    let result = posts

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(post => post.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        (post.tags || []).some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredPosts(result)
  }, [searchQuery, selectedCategory, posts])

  const getCategoryLabel = (category: string, categoryDisplay?: string | null) => {
    // Use category_display if available, otherwise fall back to translation
    if (categoryDisplay) {
      return categoryDisplay
    }
    return t.categories[category as keyof typeof t.categories] || category
  }

  return (
    <div className="min-h-screen bg-dusty-rose-50">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-knowledge-header.png"
            alt="ספרייה רפואית מודרנית ומרגיעה"
            fill
            className="object-cover opacity-30"
            quality={90}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dusty-rose-100/80 to-dusty-rose-50/90" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-sage-900 mb-4">
            {t.knowledge.title}
          </h1>
          <p className="text-lg text-sage-800 max-w-2xl font-medium">
            {t.knowledge.description}
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white shadow-sm sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.articles.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field ps-12"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.value
                      ? 'bg-sage-600 text-white'
                      : 'bg-cream-200 text-gray-700 hover:bg-cream-300'
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{t.articles.noResults}</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="mt-4 text-sage-600 hover:text-sage-800 font-medium"
              >
                {t.articles.clearSearch}
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-6">{filteredPosts.length} {t.articles.found}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => {
                  const finalImage = getArticleImage(post);

                  return (
                    <Link key={post.id} href={`/knowledge/${post.slug}`} className="card group">
                      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-sage-200/50 to-dusty-rose-100/50">
                        <Image
                          src={finalImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium text-sage-600 bg-sage-50 px-3 py-1 rounded-full">
                            {post.category_display || post.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(post.date).toLocaleDateString('he-IL')}
                          </span>
                        </div>
                        <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-sage-700 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2">
                          {post.excerpt || post.content.substring(0, 100) + "..."}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
