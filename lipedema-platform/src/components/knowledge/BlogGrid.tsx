'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ChevronRight } from 'lucide-react'
import { categoryLabels } from '@/lib/blog/categories'

interface Post {
  slug: string
  title: string
  date: string | null
  description: string
  image: string | null
  category: string
  tags: readonly string[]
  originalPostId: string
}

interface BlogGridProps {
  posts: Post[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = 
        selectedCategory === 'all' || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [posts, searchQuery, selectedCategory])

  const categories = [
    { value: 'all', label: 'הכל' },
    { value: 'diagnosis', label: categoryLabels.diagnosis },
    { value: 'nutrition', label: categoryLabels.nutrition },
    { value: 'physical', label: categoryLabels.physical },
    { value: 'mindset', label: categoryLabels.mindset },
  ]

  return (
    <>
      {/* Search and Filter Section */}
      <section className="py-8 border-b border-sage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
              <input
                type="text"
                placeholder="חיפוש מאמרים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-sage-200 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all text-sage-900 placeholder:text-sage-400"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                    selectedCategory === category.value
                      ? 'bg-sage-700 text-white shadow-md'
                      : 'bg-white/60 text-sage-700 hover:bg-white border border-sage-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-sage-200" />
              </div>
              <h3 className="text-xl font-bold text-sage-900 mb-2">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'לא נמצאו מאמרים' 
                  : 'אין מאמרים עדיין'}
              </h3>
              <p className="text-sage-600">
                {searchQuery || selectedCategory !== 'all'
                  ? 'נסי לשנות את החיפוש או הסינון'
                  : 'מאמרים חדשים יתווספו בקרוב'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-10">
                <div className="h-[1px] flex-1 bg-gradient-to-l from-sage-100 to-transparent ml-8" />
                <p className="text-sage-500 font-medium px-4">
                  {filteredPosts.length} מאמרים
                  {(searchQuery || selectedCategory !== 'all') && ` מתוך ${posts.length}`}
                </p>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-sage-100 to-transparent mr-8" />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block bg-white/40 hover:bg-white/80 backdrop-blur-sm border border-white/60 hover:border-sage-200 p-4 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:shadow-sage-100/50"
                  >
                    <div className="aspect-[16/10] relative overflow-hidden rounded-[2rem] bg-sage-50 mb-6">
                      <Image
                        src={post.image || '/images/instagram-placeholder.svg'}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-xs font-bold text-sage-900 shadow-sm">
                          {categoryLabels[post.category] || post.category}
                        </span>
                      </div>
                    </div>

                    <div className="px-4 pb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-sage-400 font-medium tracking-wider uppercase">
                          {post.date ? new Date(post.date).toLocaleDateString('he-IL') : ''}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-sage-200" />
                        <span className="text-xs text-sage-400">קריאה קצרה</span>
                      </div>

                      <h3 className="text-xl font-display font-bold text-sage-900 mb-3 group-hover:text-dusty-rose-600 transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-sage-600 line-clamp-2 text-sm leading-relaxed mb-6 font-light">
                        {post.description}
                      </p>

                      <div className="flex items-center text-sage-900 font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                        <span>לקריאת המאמר</span>
                        <ChevronRight className="w-4 h-4 text-dusty-rose-500" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
