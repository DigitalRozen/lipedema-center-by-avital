import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Calendar, Sparkles, Heart } from 'lucide-react';
import { getPostBySlug, getAllSlugs, categoryLabels } from '@/lib/keystatic';
import { calculateReadingTime, getFallbackImage } from '@/lib/blog/utils';
import { processMdx } from '@/lib/mdx-processor';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'מאמר לא נמצא | אביטל רוזן' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://avitalrozen.co.il';

  return {
    title: `${post.title} | אביטל רוזן - מומחית ליפאדמה`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      images: post.image ? [post.image] : [getFallbackImage(post.category)],
      locale: 'he_IL',
      url: `${siteUrl}/blog/${slug}`,
    },
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
  };
}

// Image placeholder component for broken images
function ImagePlaceholder({ title, category }: { title: string; category: string }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#FFF5F5] via-[#FFFBF7] to-[#FFE4E1]/30 flex flex-col items-center justify-center p-8">
      <Sparkles className="w-16 h-16 text-[#C08B8B] mb-4 opacity-60" />
      <p className="text-[#4A5568] font-heading-hebrew text-xl text-center font-semibold">
        {title}
      </p>
      <span className="mt-3 px-4 py-1.5 rounded-full bg-[#C08B8B]/10 text-[#C08B8B] text-sm border border-[#C08B8B]/20">
        {categoryLabels[category] || category}
      </span>
    </div>
  );
}

// Main page component
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Handle 404 case
  if (!post) {
    notFound();
  }

  // Calculate reading time from content
  const contentText = typeof post.content === 'string' ? post.content : '';
  const readingTime = calculateReadingTime(post.description + ' ' + contentText);

  // Format date in Hebrew locale
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // Get image with fallback
  const imageUrl = post.image || getFallbackImage(post.category);
  const categoryLabel = categoryLabels[post.category] || post.category;

  // Process MDX content
  const MdxContent = await processMdx(post.content);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F5] to-white" dir="rtl">
      {/* Hero Section - Soft & Elegant */}
      <header className="relative overflow-hidden">
        {/* Decorative soft background elements */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C08B8B]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D6BCFA]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 pt-8 pb-12">
          {/* Back Navigation */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#4A5568]/60 hover:text-[#C08B8B] transition-colors mb-6 group"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <span className="font-medium font-hebrew text-sm">חזרה לבלוג</span>
          </Link>

          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#C08B8B]/10 text-[#C08B8B] text-sm font-medium border border-[#C08B8B]/20">
              {categoryLabel}
            </span>
          </div>

          {/* Title - Elegant Serif */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-[#C08B8B] mb-6 leading-[1.3] text-center">
            {post.title}
          </h1>

          {/* Meta Data Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[#4A5568]/60 text-sm mb-10">
            {formattedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C08B8B]" />
                <time dateTime={post.date || undefined}>{formattedDate}</time>
              </div>
            )}
            <span className="text-[#C08B8B]">•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C08B8B]" />
              <span>{readingTime} דקות קריאה</span>
            </div>
          </div>

          {/* Featured Image - Rounded with Soft Shadow */}
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl shadow-[#C08B8B]/10">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            ) : (
              <ImagePlaceholder title={post.title} category={post.category} />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Quick Summary Box - The Hook */}
          <div className="summary-box glass-card -mt-8 relative z-10">
            <h3>מה נגלה במאמר הזה?</h3>
            <p>
              {post.description || 'במאמר זה נצלול לעומק הסיבות והפתרונות, ונלמד איך לטפל בצורה נכונה ומותאמת אישית.'}
            </p>
          </div>

          {/* Article Content - Glass Card */}
          <article className="glass-card p-8 sm:p-10 md:p-14 mt-8">
            {/* 
              The Content - Beautiful Prose
              prose-headings:text-brand-rose
              prose-a:text-brand-rose
              prose-blockquote styles from globals.css
            */}
            <div className="prose prose-lg prose-slate max-w-none
              prose-headings:text-[#C08B8B]
              prose-headings:font-heading-hebrew
              prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
              prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
              prose-p:text-[#4A5568] prose-p:leading-[2] prose-p:mb-6
              prose-a:text-[#C08B8B] prose-a:no-underline hover:prose-a:text-[#D6BCFA]
              prose-strong:text-[#C08B8B] prose-strong:font-semibold
              prose-blockquote:border-r-[#C08B8B] prose-blockquote:border-r-4 prose-blockquote:border-l-0
              prose-blockquote:bg-[#FFF5F5] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-lg
              prose-blockquote:not-italic prose-blockquote:text-[#4A5568]
              prose-ul:list-disc prose-ul:mr-6
              prose-ol:list-decimal prose-ol:mr-6
              prose-li:text-[#4A5568] prose-li:mb-2
              prose-li:marker:text-[#C08B8B]
              prose-img:rounded-2xl prose-img:shadow-lg
            ">
              <MdxContent />
            </div>
          </article>

          {/* Author Signature - Emotional Connection */}
          <div className="mt-12 glass-card p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C08B8B] to-[#D6BCFA] p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <Heart className="w-10 h-10 text-[#C08B8B]" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-right">
                <p className="text-sm text-[#4A5568]/60 mb-2 font-hebrew">כתבה באהבה</p>
                <h3 className="text-2xl font-heading-hebrew font-bold text-[#C08B8B] mb-2">
                  אביטל רוזן
                </h3>
                <p className="text-[#4A5568]/80 font-hebrew mb-1">
                  נטורופתית N.D | מומחית ליפאדמה ולימפאדמה
                </p>
                <p className="text-[#4A5568]/70 font-hebrew text-sm leading-relaxed mb-6">
                  מלווה נשים במסע לבריאות טובה יותר, עם גישה אישית ומקצועית המשלבת תזונה, טיפול טבעי ותמיכה רגשית.
                </p>

                {/* WhatsApp CTA Button */}
                <a
                  href="https://wa.me/972XXXXXXXXX?text=היי%20אביטל,%20אשמח%20לקבוע%20שיחת%20ייעוץ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C08B8B] to-[#D6BCFA] text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl hover:shadow-[#C08B8B]/30 transition-all hover:-translate-y-1 group"
                >
                  <span>לקביעת שיחת ייעוץ בוואטסאפ</span>
                  <svg 
                    className="w-6 h-6 transition-transform group-hover:scale-110" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Related Articles Placeholder */}
          <div className="mt-12 text-center">
            <p className="text-sm text-[#4A5568]/60 font-hebrew">
              רוצה לקרוא עוד? <Link href="/blog" className="text-[#C08B8B] hover:text-[#D6BCFA] font-medium">חזרה לכל המאמרים</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
