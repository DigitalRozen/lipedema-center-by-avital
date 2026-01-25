'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'
import { ArrowRight, ArrowLeft, Calendar, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { RecommendedProducts } from '@/components/products/RecommendedProducts'
import { ClinicCTA } from '@/components/clinic/ClinicCTA'
import { VisualArticleRenderer } from '@/components/knowledge/VisualArticleRenderer'
import { ShareButtons } from '@/components/knowledge/ShareButtons'
import { generatePostJsonLd } from '@/components/knowledge/PostMetadata'
import { useLocale } from '@/lib/i18n/context'
import { trackPageView } from '@/lib/analytics/analyticsService'
import { Post, MonetizationStrategy } from '@/types/database'
import { getArticleImage } from '@/lib/utils/imageUtils'

export default function PostPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t, dir } = useLocale()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUrl, setCurrentUrl] = useState('')

  const BackArrow = dir === 'rtl' ? ArrowRight : ArrowLeft

  useEffect(() => {
    async function fetchPost() {
      const supabase = createClient()
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      setPost(data)
      setLoading(false)

      // Track page view if post was found
      if (data) {
        try {
          await trackPageView(data.id, {
            slug,
            category: data.category,
            monetization_strategy: data.monetization_strategy,
            referrer: document.referrer || 'direct',
            user_agent: navigator.userAgent
          })
        } catch (error) {
          // Don't block the page if analytics fails
          console.warn('Failed to track page view:', error)
        }
      }
    }
    fetchPost()
  }, [slug])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [slug])

  // Generate dynamic metadata for SEO and social sharing
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://lipedema-platform.vercel.app'
  const postUrl = `${baseUrl}/knowledge/${slug}`
  const pageTitle = post ? `${post.title} | פלטפורמת הליפאדמה של אביטל` : 'טוען...'
  const pageDescription = post?.excerpt ||
    (post?.content ? post.content.substring(0, 160).replace(/<[^>]*>/g, '') + '...' :
      'מאמר מקצועי על ליפאדמה ודרכי טיפול')
  const imageUrl = post ? getArticleImage(post) :
    `${baseUrl}/api/og?title=${encodeURIComponent('')}&category=${encodeURIComponent('')}&excerpt=${encodeURIComponent(pageDescription)}`

  const getCategoryLabel = (category: string, categoryDisplay?: string | null) => {
    // Use category_display if available, otherwise fall back to translation
    if (categoryDisplay) {
      return categoryDisplay
    }
    return t.categories[category as keyof typeof t.categories] || category
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-dusty-rose-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display text-sage-900 mb-4">המאמר לא נמצא</h1>
          <Link href="/knowledge" className="text-sage-700 hover:underline">
            {t.knowledge.backToHub}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Dynamic Head for SEO and Social Sharing */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`ליפאדמה, טיפול בליפאדמה, אביטל רוזן, נטורופתיה${post?.tags ? ', ' + post.tags.join(', ') : ''}`} />
        <meta name="author" content="אביטל רוזן ND" />
        <link rel="canonical" href={postUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post?.title || 'טוען...'} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:site_name" content="פלטפורמת הליפאדמה של אביטל" />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post?.title || 'מאמר על ליפאדמה'} />
        <meta property="og:locale" content="he_IL" />
        {post && (
          <>
            <meta property="article:author" content="אביטל רוזן ND" />
            <meta property="article:published_time" content={post.date} />
            <meta property="article:modified_time" content={post.updated_at || post.date} />
            <meta property="article:section" content={post.category_display || post.category} />
            {post.tags && post.tags.map(tag => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
          </>
        )}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post?.title || 'טוען...'} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:creator" content="@avital_rozen" />

        {/* JSON-LD Structured Data */}
        {post && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generatePostJsonLd(post, baseUrl))
            }}
          />
        )}
      </Head>

      <div className="min-h-screen bg-dusty-rose-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-dusty-rose-100 to-dusty-rose-200 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-2 text-sage-700 hover:text-sage-900 mb-6"
            >
              <BackArrow className="w-4 h-4" />
              {t.knowledge.backToHub}
            </Link>
            <span className="inline-block text-sm font-medium text-sage-700 bg-sage-100 px-3 py-1 rounded-full mb-4">
              {getCategoryLabel(post.category, post.category_display)}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-sage-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 flex-wrap">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString(dir === 'rtl' ? 'he-IL' : 'en-US')}
              </span>
              {post.original_url && (
                <a
                  href={post.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-600 hover:text-sage-800 text-sm font-medium underline"
                >
                  צפייה בפוסט המקורי באינסטגרם
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <article className="lg:col-span-2">
                <VisualArticleRenderer
                  content={post.content}
                  imageUrl={post.image_url}
                  title={post.title}
                  category={post.category}
                />

                {/* High Ticket Clinic CTA - Prominent inline display */}
                {post.monetization_strategy === 'High Ticket (Clinic Lead)' && (
                  <ClinicCTA variant="inline" />
                )}

                {/* Share Buttons */}
                <ShareButtons
                  postId={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  url={currentUrl || postUrl}
                  className="mt-6 pt-6 border-t border-gray-200"
                />

                {/* Tags */}
                {(post.tags || []).length > 0 && (
                  <div className="mt-8 flex items-center gap-3 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {(post.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-sage-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>

              {/* Sidebar */}
              <aside className="space-y-6">
                <RecommendedProducts
                  postTags={post.tags || []}
                  monetizationStrategy={post.monetization_strategy as MonetizationStrategy}
                  postId={post.id}
                />

                {/* CTA */}
                <div className="bg-sage-600 rounded-2xl p-6 text-white">
                  <h3 className="font-display font-semibold text-xl mb-3">
                    {t.sidebar.personalSupport}
                  </h3>
                  <p className="text-sage-100 text-sm mb-4">
                    {t.sidebar.personalSupportDesc}
                  </p>
                  <Link
                    href="/clinic"
                    className="block text-center bg-white text-sage-800 py-3 rounded-lg font-medium hover:bg-dusty-rose-100 transition-colors"
                  >
                    {t.cta.button}
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
