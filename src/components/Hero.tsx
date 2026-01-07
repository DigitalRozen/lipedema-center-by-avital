import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Activity } from 'lucide-react'

interface HeroProps {
    dir?: 'rtl' | 'ltr'
}

export function Hero({ dir = 'rtl' }: HeroProps) {
    const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-cream-100 via-sage-50 to-dusty-rose-100">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sage-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-dusty-rose-200/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="container-custom relative z-10 py-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Content */}
                    <div className="text-center lg:text-right max-w-2xl mx-auto lg:mx-0">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/60 backdrop-blur-sm text-sage-700 text-sm font-medium mb-8 animate-fade-in">
                            <Sparkles className="w-4 h-4 text-dusty-rose-600" />
                            <span>מסע אל הריפוי והקבלה</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-display font-bold text-sage-900 leading-[1.1] mb-6 drop-shadow-sm">
                            המגדלור שלך <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-sage-600 to-sage-800">
                                במסע הליפדמה
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mr-0 font-light">
                            מקום בטוח המשלב ידע רפואי מתקדם עם תמיכה רגשית עוטפת.
                            אנחנו כאן כדי להאיר את הדרך ולהעניק לך את הכלים לחיים מלאים וטובים יותר.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/patient-journey" className="btn-primary flex items-center justify-center gap-2 group shadow-sage-200/50 shadow-xl">
                                <span>התחילי את המסע שלך</span>
                                <Arrow className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            </Link>

                            <Link href="/about" className="btn-secondary flex items-center justify-center gap-2">
                                <span>הכירי את השיטה</span>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-80">
                            <div className="flex -space-x-3 space-x-reverse">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-sage-100 border-2 border-white flex items-center justify-center text-xs font-bold text-sage-700">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-gray-500">
                                <span className="font-bold text-sage-700 block">קהילה תומכת</span>
                                אלפי נשים כבר איתנו
                            </div>
                        </div>
                    </div>

                    {/* Visuals */}
                    <div className="relative h-[600px] hidden lg:block">
                        {/* Main Visual Card */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md animate-float">
                            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-2xl shadow-sage-900/10">
                                <Image
                                    src="/images/hero.png"
                                    alt="מגדלור של תקווה ורוגע"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />

                                {/* Glass Overlay Card */}
                                <div className="absolute bottom-6 left-6 right-6 glass p-6 rounded-2xl">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-sage-900">גישה הוליסטית</div>
                                            <div className="text-xs text-sage-600">גוף ונפש כאחד</div>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-sage-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-sage-500 w-3/4 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute top-20 right-0 glass-card p-4 animate-float-delayed max-w-[180px]">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-sage-500" />
                                <span className="text-sm font-medium text-sage-800">מבוסס מחקר</span>
                            </div>
                        </div>

                        <div className="absolute bottom-40 -left-4 glass-card p-5 animate-float shadow-xl max-w-[200px]" style={{ animationDelay: '1.5s' }}>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-dusty-rose-600">
                                    <HeartIcon className="w-5 h-5 fill-current" />
                                    <span className="font-bold">אמפתיה</span>
                                </div>
                                <p className="text-xs text-gray-500">מרחב בטוח ונטול שיפוטיות</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function HeartIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    )
}
