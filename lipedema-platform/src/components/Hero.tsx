'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

interface HeroProps {
    dir?: 'rtl' | 'ltr'
}

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const floatAnimation = {
    y: [0, -15, 0],
    transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const
    }
};

export function Hero({ dir = 'rtl' }: HeroProps) {
    const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

    return (
        <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-[#FAFAF5]">
            {/* Background Image with Glass Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/home-hero-bg.png"
                    alt="אוירת ספא יוקרתית ורגועה"
                    fill
                    className="object-cover opacity-60"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-[#FAFAF5]" />
                {/* Decorative Blurs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sage-200/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-dusty-rose-200/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="container-custom relative z-10 py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Content Section */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="text-center lg:text-right max-w-3xl mx-auto lg:mx-0"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-sage-800 text-sm font-medium mb-8 shadow-sm">
                            <Sparkles className="w-4 h-4 text-dusty-rose-500" />
                            <span>מסע אישי אל הריפוי והקבלה</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-sage-900 leading-[1.1] mb-8 drop-shadow-sm tracking-tight">
                            המגדלור שלך <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-sage-600 to-sage-800">
                                במסע הליפאדמה
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-sage-800/80 mb-10 leading-relaxed max-w-xl mx-auto lg:mr-0 font-light">
                            שילוב ייחודי של מצוינות רפואית, ליווי רגשי עוטף וקהילה תומכת.
                            אנחנו כאן כדי להאיר לך את הדרך לחיים בריאים, מאוזנים ומלאי ביטחון.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                            <Link href="/patient-journey" className="btn-primary group !py-4 !px-10 flex items-center justify-center gap-3 shadow-xl shadow-sage-900/10">
                                <span className="text-lg">התחילי את המסע שלך</span>
                                <Arrow className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            </Link>

                            <Link href="/about" className="btn-secondary !py-4 !px-10 flex items-center justify-center gap-2 bg-white/40 backdrop-blur-md border-white/60 hover:bg-white/60">
                                <span className="text-lg">הכירי את הגישה</span>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                            <div className="flex -space-x-3 space-x-reverse">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border-2 border-white flex items-center justify-center text-sage-600 shadow-sm overflow-hidden">
                                        <Image
                                            src={`/images/trust-${i}.png`}
                                            alt="Social Proof"
                                            width={48}
                                            height={48}
                                            className="object-cover opacity-80"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                        <ShieldCheck className="w-6 h-6 text-sage-400 absolute" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-sage-900 text-lg block">קהילה תומכת ומעצימה</span>
                                <span className="text-sage-600/80 text-sm">אלפי נשים כבר עברו את התהליך איתנו</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual Section */}
                    <div className="relative h-[500px] lg:h-[650px] hidden lg:block">
                        {/* Main Image Frame */}
                        <motion.div
                            animate={floatAnimation}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
                        >
                            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-sage-900/15 border-[12px] border-white/40 backdrop-blur-sm">
                                <Image
                                    src="/images/hero.png"
                                    alt="Avital Rosen - Lipedema Specialist"
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="500px"
                                />

                                {/* Floating Glass Status Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                    className="absolute bottom-8 left-8 right-8 bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-xl"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center text-sage-600">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-sage-900 font-bold">ליווי הוליסטי אישי</div>
                                            <div className="text-sage-600 text-xs">יותר מ-90% אחוזי הצלחה</div>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-sage-100/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-sage-500 to-sage-600 w-[92%] rounded-full" />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Floating Decorative Elements */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="absolute top-10 right-0 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-white shadow-lg flex items-center gap-3 max-w-[200px]"
                        >
                            <div className="w-3 h-3 rounded-full bg-sage-500 animate-pulse" />
                            <span className="text-sage-900 font-medium text-sm">גישה מבוססת מחקר</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="absolute bottom-1/4 -left-10 bg-[#E6C2BF]/90 backdrop-blur-md p-5 rounded-3xl border border-white shadow-lg flex flex-col gap-2 max-w-[220px]"
                        >
                            <div className="flex items-center gap-2 text-white font-bold">
                                <Sparkles className="w-5 h-5 fill-current" />
                                <span>יחס אישי ועוטף</span>
                            </div>
                            <p className="text-white/80 text-xs leading-relaxed">מרחב בטוח לשיתוף, ריפוי וקבלה עצמית</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

