import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Sparkles, ChevronRight } from 'lucide-react'
import { getLatestPosts, categoryLabels } from '@/lib/keystatic'

export default async function HomePage() {
  const latestPosts = await getLatestPosts(3);

  return (
    <div className="bg-[#FAFAF5]" dir="rtl">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/lipedema symbol.jpeg"
            alt="ליפאדמה - מודעות וגיוון גופני"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#FAFAF5]/95 via-[#FAFAF5]/70 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-xl mr-auto lg:mr-0 lg:ml-auto text-right">
            <div className="inline-block mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full">
              <span className="text-sm font-medium tracking-[0.15em] text-dusty-rose-600">
                מומחית לליפאדמה ולימפאדמה
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-[1.15] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              אביטל רוזן
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-white to-white/50 mb-6 mr-0 ml-auto lg:ml-0 lg:mr-auto rounded-full" />
            <p className="text-lg md:text-xl text-white mb-4 font-medium leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
              ידע מקצועי, ליווי אישי וכלים מעשיים
            </p>
            <p className="text-base text-white/90 max-w-md mb-10 leading-relaxed font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
              כי את לא לבד במסע הזה. יחד נבנה את הדרך שלך לחיים טובים יותר עם ליפאדמה
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-end lg:justify-start">
              <Link
                href="/blog"
                className="px-8 py-4 bg-dusty-rose-500 text-white rounded-full font-bold text-base hover:bg-dusty-rose-600 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                למרכז הידע
              </Link>
              <Link
                href="/clinic"
                className="px-8 py-4 bg-white/90 backdrop-blur-sm text-sage-800 rounded-full font-bold text-base hover:bg-white transition-all shadow-md border border-sage-200/50 hover:border-dusty-rose-200"
              >
                לקביעת תור
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-sage-900 mb-6">
              איך אני יכולה לעזור לך?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sage-200 via-sage-500 to-sage-200 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="group p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white hover:border-sage-200 transition-all duration-500 hover:shadow-2xl hover:shadow-sage-100/50 text-center">
              <div className="relative w-40 h-40 mx-auto mb-8 rounded-[2rem] overflow-hidden shadow-xl shadow-sage-900/10">
                <Image
                  src="/images/feature-knowledge.png"
                  alt="מרכז ידע"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="160px"
                />
              </div>
              <h3 className="text-2xl font-display font-bold text-sage-900 mb-4">מרכז ידע</h3>
              <p className="text-sage-700/80 leading-relaxed font-light">
                מאמרים מקצועיים, מתכונים בריאים, וטיפים מעשיים לניהול יומיומי של ליפאדמה
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white hover:border-sage-200 transition-all duration-500 hover:shadow-2xl hover:shadow-sage-100/50 text-center">
              <div className="relative w-40 h-40 mx-auto mb-8 rounded-[2rem] overflow-hidden shadow-xl shadow-sage-900/10">
                <Image
                  src="/images/feature-treatment.png"
                  alt="טיפולים"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="160px"
                />
              </div>
              <h3 className="text-2xl font-display font-bold text-sage-900 mb-4">טיפולים מתקדמים</h3>
              <p className="text-sage-700/80 leading-relaxed font-light">
                טיפולים לימפתיים מקצועיים, ניקוז לימפתי ידני, וטכנולוגיות מתקדמות
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white hover:border-sage-200 transition-all duration-500 hover:shadow-2xl hover:shadow-sage-100/50 text-center">
              <div className="relative w-40 h-40 mx-auto mb-8 rounded-[2rem] overflow-hidden shadow-xl shadow-sage-900/10">
                <Image
                  src="/images/feature-support.png"
                  alt="תמיכה"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="160px"
                />
              </div>
              <h3 className="text-2xl font-display font-bold text-sage-900 mb-4">ליווי אישי</h3>
              <p className="text-sage-700/80 leading-relaxed font-light">
                ייעוץ תזונתי מותאם אישית, תוכניות טיפול, וליווי צמוד לאורך הדרך
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {latestPosts.length > 0 && (
        <section className="py-24 md:py-32 bg-white/30 backdrop-blur-sm border-y border-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
              <div className="text-center md:text-right">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-sage-900 mb-4">
                  מאמרים אחרונים
                </h2>
                <p className="text-lg text-sage-700/70 max-w-2xl font-light">
                  הישארי מעודכנת עם המידע המקצועי ביותר על ליפאדמה
                </p>
              </div>
              <Link 
                href="/blog" 
                className="flex text-sage-700 hover:text-dusty-rose-600 font-bold items-center gap-2 transition-all group"
              >
                לכל המאמרים
                <ArrowLeft className="w-6 h-6 group-hover:translate-x-[-4px] transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {latestPosts.map((post: { slug: string; image: string | null; title: string; category: string; date: string | null; description: string }) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full bg-white/60 backdrop-blur-md border border-white hover:border-sage-200 p-4 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:shadow-sage-100/30"
                >
                  <div className="aspect-[16/10] relative overflow-hidden rounded-[2rem] bg-sage-50 mb-6">
                    <Image
                      src={post.image || '/images/instagram-placeholder.svg'}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="px-3 pb-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-bold text-sage-500 tracking-[0.2em] uppercase">
                        {categoryLabels[post.category] || post.category}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-sage-200" />
                      <span className="text-[10px] text-sage-400">
                        {post.date ? new Date(post.date).toLocaleDateString('he-IL') : ''}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-sage-900 mb-3 group-hover:text-dusty-rose-600 transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sage-700/80 text-sm leading-relaxed line-clamp-2 font-light mb-6 flex-1">
                      {post.description}
                    </p>
                    <div className="flex items-center text-sage-900 font-bold text-xs gap-1 group-hover:gap-2 transition-all">
                      <span>קראי את המאמר</span>
                      <ChevronRight className="w-4 h-4 text-dusty-rose-500" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-sage-700">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/cta-texture.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-sage-900/60 via-sage-800/20 to-sage-900/60" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/20 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-[1.2]">
            מוכנה להתחיל את המסע?
          </h2>
          <p className="text-sage-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            קבעי פגישת ייעוץ אישית ונבנה יחד תוכנית טיפול מותאמת עבורך
          </p>
          <Link
            href="/clinic"
            className="inline-flex py-4 px-12 bg-white text-sage-900 rounded-full font-bold text-lg hover:bg-dusty-rose-100 hover:scale-105 transition-all duration-300 shadow-2xl shadow-black/20"
          >
            לקביעת תור
          </Link>
        </div>
      </section>
    </div>
  )
}
