import { Quote } from 'lucide-react';
import React from 'react';
import keywordImageMap from '@/lib/article_keyword_map.json';

interface VisualArticleRendererProps {
    content: string;
    imageUrl?: string | null;
    title: string;
    category: string;
}

export const VisualArticleRenderer: React.FC<VisualArticleRendererProps> = ({
    content,
    imageUrl,
    title,
    category,
}) => {
    // Simple heuristic to strip HTML tags for length check
    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, '');
    };

    const plainText = stripHtml(content);
    // Short content threshold: < 300 characters
    const isShort = plainText.length < 300;

    const [imgError, setImgError] = React.useState(false);

    const getFallbackImage = (cat: string) => {
        // Map categories (slugs) to our generated assets
        if (cat?.includes('nutrition') || cat?.includes('diet')) return '/assets/generated/nutrition_fallback.png';
        if (cat?.includes('physical') || cat?.includes('massage')) return '/assets/generated/physical_fallback.png';
        if (cat?.includes('diagnosis') || cat?.includes('consult')) return '/assets/generated/diagnosis_fallback.png';
        // Default fallback
        return '/assets/generated/nutrition_fallback.png';
    };

    if (isShort) {
        return (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sage-50 to-dusty-rose-50 p-12 shadow-sm border border-sage-100 transition-all duration-500 hover:shadow-md mb-8">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-sage-100/50 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-dusty-rose-100/50 blur-3xl" />

                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8">
                    <Quote className="w-12 h-12 text-sage-400 rotate-180" />

                    <div
                        className="prose prose-xl prose-headings:font-display prose-p:text-sage-800 prose-p:font-medium prose-p:leading-relaxed max-w-2xl mx-auto"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                    <div className="w-16 h-1 bg-gradient-to-r from-sage-300 to-dusty-rose-300 rounded-full opacity-50" />
                </div>
            </div>
        );
    }

    // Long Content Layout

    // Priority: 1. Image URL (if valid), 2. Category Fallback
    // Priority: 1. Keyword search (Robust Fallback) 2. Image URL (if valid) 3. Category Fallback
    const titleLower = title.toLowerCase();

    // Check keyword map
    const matchedEntry = keywordImageMap.find(entry =>
        entry.keywords.some(kw => titleLower.includes(kw.toLowerCase()))
    );

    const mappedImage = matchedEntry ? matchedEntry.image : null;

    const finalImage = (mappedImage ? `/articles/${mappedImage}.png` : (imageUrl && !imgError) ? imageUrl : getFallbackImage(category));

    return (
        <>
            <div className="mb-8 group overflow-hidden rounded-2xl relative shadow-md">
                <img
                    src={finalImage}
                    alt={title}
                    onError={() => setImgError(true)}
                    className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Glass overlay at the bottom for text contrast if needed, mostly decoration */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badge if using fallback */}
                {(imgError || !imageUrl) && (
                    <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-sage-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {category ? category.toUpperCase() : 'LIFESTYLE'} SERIES
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-sage-100">
                <div
                    className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-sage-900 prose-a:text-sage-700 prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </>
    );
};
