'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, X, ChevronRight, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Post, PostCategory } from '@/types/database'
import { useLocale } from '@/lib/i18n/context'
import { getArticleImage } from '@/lib/utils/imageUtils'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

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

    if (selectedCategory !== 'all') {
      result = result.filter(post => post.category === selectedCategory)
    }

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

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      {/* Premium Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-knowledge-header-new.png"
            alt="מרכז ידע ליפאדמה - אווירת ספא וריפוי"
            fill
            className="object-cover opacity-60"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-[#FAFAF5]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center md:text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-100/80 backdrop-blur-sm text-sage-800 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>הספרייה הלימפתית שלך</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-sage-900 mb-6 leading-tight">
              {t.knowledge.title}
            </h1>
            <p className="text-lg md:text-xl text-sage-800 max-w-2xl font-light leading-relaxed mx-auto md:mx-0">
              {t.knowledge.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Glassmorphism Search & Filter Bar */}
      <section className="sticky top-20 z-40 px-4 -mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg rounded-3xl p-4 md:p-6 transition-all border-opacity-40 hover:border-opacity-100">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="text"
                  placeholder={t.articles.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 ps-12 pe-4 bg-sage-50/50 border border-sage-100 focus:border-sage-300 focus:ring-2 focus:ring-sage-200/50 rounded-2xl outline-none transition-all text-sage-900 placeholder:text-sage-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute end-4 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                <Filter className="w-5 h-5 text-sage-500 shrink-0 hidden sm:block" />
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${selectedCategory === cat.value
                          ? 'bg-sage-600 text-white shadow-md shadow-sage-200 ring-2 ring-sage-100'
                          : 'bg-white/50 text-sage-700 hover:bg-sage-100 border border-sage-100'
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/40 rounded-[2rem] border border-white p-4 h-[400px] animate-pulse">
                  <div className="aspect-video bg-sage-100/50 rounded-2xl mb-6" />
                  <div className="space-y-4 px-2">
                    <div className="h-4 bg-sage-100/50 rounded w-24" />
                    <div className="h-8 bg-sage-100/50 rounded w-full" />
                    <div className="h-4 bg-sage-100/50 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-sage-200" />
              </div>
              <h3 className="text-xl font-bold text-sage-900 mb-2">לא מצאנו תוצאות...</h3>
              <p className="text-sage-600 mb-8">{t.articles.noResults}</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="px-6 py-3 bg-sage-600 text-white rounded-2xl font-medium hover:bg-sage-700 transition-all shadow-lg shadow-sage-100"
              >
                {t.articles.clearSearch}
              </button>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-10">
                <div className="h-[1px] flex-1 bg-gradient-to-l from-sage-100 to-transparent ml-8" />
                <p className="text-sage-500 font-medium px-4">מצאנו {filteredPosts.length} {t.articles.found}</p>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-sage-100 to-transparent mr-8" />
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post) => {
                    const finalImage = getArticleImage(post);

                    return (
                      <motion.div
                        key={post.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link
                          href={`/knowledge/${post.slug}`}
                          className="group block bg-white/40 hover:bg-white/80 backdrop-blur-sm border border-white/60 hover:border-sage-200 p-4 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:shadow-sage-100/50"
                        >
                          <div className="aspect-[16/10] relative overflow-hidden rounded-[2rem] bg-sage-50 mb-6">
                            <Image
                              src={finalImage}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Category Badge Over Image */}
                            <div className="absolute top-4 right-4">
                              <span className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-xs font-bold text-sage-900 shadow-sm">
                                {post.category_display || post.category}
                              </span>
                            </div>
                          </div>

                          <div className="px-4 pb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xs text-sage-400 font-medium tracking-wider uppercase">
                                {new Date(post.date).toLocaleDateString('he-IL')}
                              </span>
                              <div className="w-1 h-1 rounded-full bg-sage-200" />
                              <span className="text-xs text-sage-400">קריאה קצרה</span>
                            </div>

                            <h3 className="text-xl font-display font-bold text-sage-900 mb-3 group-hover:text-dusty-rose-600 transition-colors leading-tight">
                              {post.title}
                            </h3>

                            <p className="text-sage-600 line-clamp-2 text-sm leading-relaxed mb-6 font-light">
                              {post.excerpt || post.content.substring(0, 100) + "..."}
                            </p>

                            <div className="flex items-center text-sage-900 font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                              <span>לקריאת המאמר</span>
                              <ChevronRight className="w-4 h-4 text-dusty-rose-500" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
