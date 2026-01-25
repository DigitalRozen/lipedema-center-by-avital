import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center" dir="rtl">
      <div className="text-center px-4">
        <h1 className="text-2xl md:text-3xl font-heading-hebrew font-bold text-sage-900 mb-4">
          המאמר לא נמצא
        </h1>
        <p className="text-sage-600 mb-6 max-w-md mx-auto">
          המאמר שחיפשת אינו קיים או הוסר. אולי תמצאי מאמר מעניין אחר בבלוג שלנו.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-sage-600 text-white rounded-full font-medium hover:bg-sage-700 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>חזרה לבלוג</span>
        </Link>
      </div>
    </div>
  );
}
