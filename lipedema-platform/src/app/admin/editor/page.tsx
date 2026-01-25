'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Save,
    Image as ImageIcon,
    Rocket,
    Loader2,
    CheckCircle2,
    FileText,
    Sparkles,
    Search,
    Heart,
    Calendar,
    ChevronLeft
} from 'lucide-react'
import Editor from '@monaco-editor/react'
import confetti from 'canvas-confetti'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

// Design System Constants
const COLORS = {
    primary: '#8A9A5B', // Sage Green
    accent: '#E6C2BF',  // Dusty Rose
    bg: '#FAFAF5',      // Off-White
    text: '#2C3E50',
    glass: 'rgba(255, 255, 255, 0.7)',
}

type Draft = Database['public']['Tables']['drafts']['Row']

interface InstagramPost {
    id: string
    title: string
    image_url: string
    category_slug: string
    date: string
    likes: number
    content: string
}

// --- Instagram Card Component ---
const InstagramCard = ({ 
    post, 
    onClick, 
    isSelected
}: { 
    post: InstagramPost, 
    onClick: (id: string) => void, 
    isSelected: boolean
}) => (
    <motion.div
        layoutId={post.id}
        onClick={() => onClick(post.id)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
            cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 group relative bg-white shadow-sm
            ${isSelected
                ? 'border-[#8A9A5B] ring-4 ring-[#8A9A5B]/10 shadow-xl'
                : 'border-gray-200 hover:border-[#8A9A5B]/30 hover:shadow-lg'}
        `}
    >
        {/* Image Section */}
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
            {post.image_url ? (
                <img
                    src={post.image_url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        // Replace with placeholder when Instagram image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/400/300?random=${post.id}`;
                        target.onerror = null; // Prevent infinite loop
                    }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                </div>
            )}
            
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Category Badge - Top Right */}
            <span className={`
                absolute top-3 right-3 text-[10px] font-bold px-3 py-1.5 rounded-full text-white shadow-lg backdrop-blur-md border border-white/20
                ${post.category_slug === 'nutrition' ? 'bg-[#8A9A5B]/90' :
                    post.category_slug === 'physical' ? 'bg-[#E6C2BF]/90' : 
                    post.category_slug === 'diagnosis' ? 'bg-blue-500/90' :
                    'bg-[#2C3E50]/90'}
            `}>
                {post.category_slug === 'nutrition' ? 'תזונה' :
                 post.category_slug === 'physical' ? 'פיזי' :
                 post.category_slug === 'diagnosis' ? 'אבחון' :
                 post.category_slug === 'mindset' ? 'מחשבה' :
                 post.category_slug}
            </span>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex justify-between items-end text-white">
                    <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Heart className="w-3 h-3 fill-current text-red-400" />
                        <span className="font-bold">{post.likes >= 0 ? post.likes : 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Text Content Section - Below Image */}
        <div className="p-4 bg-white">
            <h3 className="font-bold text-[#2C3E50] text-sm leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                {post.title}
            </h3>
            
            {/* Additional Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="bg-gray-50 px-2 py-1 rounded-full">
                    ID: {post.id.slice(-6)}
                </span>
                <span className={`px-2 py-1 rounded-full text-white text-[10px] font-medium
                    ${post.category_slug === 'nutrition' ? 'bg-[#8A9A5B]' :
                      post.category_slug === 'physical' ? 'bg-[#E6C2BF]' : 
                      post.category_slug === 'diagnosis' ? 'bg-blue-500' :
                      'bg-[#2C3E50]'}
                `}>
                    {post.category_slug}
                </span>
            </div>
        </div>
    </motion.div>
)

// --- Draft Card Component ---
const DraftCard = ({ 
    draft, 
    onClick, 
    isSelected
}: { 
    draft: Draft
    onClick: () => void
    isSelected: boolean
}) => (
    <motion.div
        onClick={onClick}
        className={`cursor-pointer rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 ${
            isSelected 
                ? 'border-[#8A9A5B] shadow-[#8A9A5B]/20' 
                : 'border-transparent hover:border-[#8A9A5B]/30'
        }`}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
    >
        <div className="bg-white p-4 space-y-3">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-bold text-[#2C3E50] text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                        {draft.title || 'ללא כותרת'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {draft.content?.substring(0, 100)}...
                    </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-white text-[10px] font-medium ml-2 shrink-0
                    ${draft.category === 'nutrition' ? 'bg-[#8A9A5B]' :
                      draft.category === 'physical' ? 'bg-[#E6C2BF]' : 
                      draft.category === 'diagnosis' ? 'bg-blue-500' :
                      'bg-[#2C3E50]'}
                `}>
                    {draft.category === 'nutrition' ? 'תזונה' :
                     draft.category === 'physical' ? 'פיזי' :
                     draft.category === 'diagnosis' ? 'אבחון' :
                     draft.category === 'mindset' ? 'מחשבה' :
                     draft.category}
                </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="bg-gray-50 px-2 py-1 rounded-full">
                    {draft.status === 'draft' ? 'טיוטה' : draft.status}
                </span>
                <span>
                    {draft.created_at ? new Date(draft.created_at).toLocaleDateString('he-IL') : ''}
                </span>
            </div>
        </div>
    </motion.div>
)

export default function ContentStudio() {
    const supabase = createClient()
    const [posts, setPosts] = useState<InstagramPost[]>([])
    const [drafts, setDrafts] = useState<Draft[]>([])
    const [activeTab, setActiveTab] = useState<'posts' | 'drafts'>('posts')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
    const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null)
    const [draft, setDraft] = useState<Partial<Draft> | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isGeneratingImage, setIsGeneratingImage] = useState(false)

    // Form state for the active draft
    const [formData, setFormData] = useState<Partial<Draft>>({
        title: '',
        seo_title: '',
        slug: '',
        content: '',
        image_prompt: '',
        category: 'nutrition',
    })

    useEffect(() => {
        console.log('🔍 Starting to fetch Instagram posts...')
        setIsLoading(true)
        fetch('http://localhost:8001/source/instagram_posts')
            .then(res => {
                console.log('📡 Response status:', res.status)
                return res.json()
            })
            .then(data => {
                console.log('✅ Received data:', data.length, 'posts')
                console.log('📄 First post:', data[0])
                setPosts(data)
                setIsLoading(false)
            })
            .catch(err => {
                console.error('❌ Failed to fetch posts:', err)
                setIsLoading(false)
            })
        
        // Load existing drafts
        loadDrafts()
    }, [])

    const loadDrafts = async () => {
        try {
            console.log('🔍 Loading existing drafts...')
            const { data, error } = await supabase
                .from('drafts')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (error) throw error
            
            console.log('✅ Loaded drafts:', data?.length || 0)
            setDrafts(data || [])
        } catch (err) {
            console.error('❌ Failed to load drafts:', err)
        }
    }

    const handleSelectPost = async (id: string) => {
        console.log('🎯 Selecting post for preview:', id)
        setSelectedPostId(id)
        setSelectedDraftId(null)
        setDraft(null) // Clear any existing draft
        // Just show the original content - no AI conversion yet
    }

    const handleSelectDraft = async (draftId: string) => {
        console.log('🎯 Selecting existing draft:', draftId)
        console.log('📋 Available drafts:', drafts.length)
        
        setSelectedDraftId(draftId)
        setSelectedPostId(null)
        
        const selectedDraft = drafts.find(d => d.id === draftId)
        console.log('📄 Found draft:', selectedDraft)
        
        if (selectedDraft) {
            console.log('📝 Draft content length:', selectedDraft.content?.length || 0)
            setDraft(selectedDraft) // This is the key fix!
            const newFormData = {
                title: selectedDraft.title || '',
                seo_title: selectedDraft.seo_title || '',
                slug: selectedDraft.slug || '',
                content: selectedDraft.content || '',
                image_prompt: selectedDraft.image_prompt || '',
                category: selectedDraft.category || 'nutrition',
            }
            console.log('📋 Setting formData:', newFormData)
            console.log('📄 Content preview:', newFormData.content.substring(0, 100) + '...')
            setFormData(newFormData)
            console.log('✅ Draft state updated')
        } else {
            console.error('❌ Draft not found in local state')
        }
    }

    const handleConvertToArticle = async (id: string) => {
        console.log('🎯 Converting post to article:', id)
        setIsLoading(true)
        try {
            console.log('📤 Sending request to create draft...')
            // Trigger AI conversion from Instagram to Article
            const res = await fetch(`http://localhost:8001/drafts/create/${id}`, { method: 'POST' })
            console.log('📡 Draft creation response status:', res.status)
            if (res.ok) {
                const data = await res.json()
                console.log('✅ Draft created:', data)
                setDraft(data)
                setFormData({
                    title: data.title_draft || '',
                    seo_title: data.seo_title || '',
                    slug: data.slug || '',
                    content: data.markdown_content || '',
                    image_prompt: data.image_prompt || '',
                    category: data.category || 'nutrition',
                })
                
                // Reload drafts to show the new one
                loadDrafts()
            } else {
                console.error('❌ Draft creation failed:', res.status, res.statusText)
                alert('המרת הפוסט לטיוטה נכשלה. וודאי שהשרת Backend מופעל.')
            }
        } catch (err) {
            console.error('❌ Error creating draft:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveChanges = async () => {
        if (!selectedPostId && !selectedDraftId) return
        setIsSaving(true)
        try {
            const draftData = {
                ...formData,
                status: 'draft',
                updated_at: new Date().toISOString()
            }
            
            // If we have a selected draft ID, update it; otherwise create new
            if (selectedDraftId) {
                draftData.id = selectedDraftId
            }
            
            const { error } = await supabase
                .from('drafts')
                .upsert(draftData)

            if (error) throw error
            
            alert('הטיוטה נשמרה בהצלחה!')
            
            // Reload drafts to show updated data
            loadDrafts()
        } catch (err: any) {
            alert('שגיאה בשמירה: ' + err.message)
        } finally {
            setIsSaving(false)
        }
    }

    const handlePublish = async () => {
        if (!draft || !selectedPostId) return
        setIsSaving(true)
        try {
            const { error: postError } = await supabase
                .from('posts')
                .insert([{
                    title: formData.title,
                    slug: formData.slug,
                    content: formData.content,
                    category: formData.category,
                    image_url: draft.image_url,
                    published: true,
                    date: new Date().toISOString().split('T')[0]
                }])

            if (postError) throw postError

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: [COLORS.primary, COLORS.accent, '#FFFFFF']
            })
            alert('המאמר פורסם בהצלחה!')
        } catch (err: any) {
            alert('שגיאה בפרסום: ' + err.message)
        } finally {
            setIsSaving(false)
        }
    }

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category_slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex h-[calc(100vh-100px)] bg-[#FAFAF5] text-[#2C3E50] overflow-hidden -m-8 border border-gray-200 rounded-lg shadow-inner">

            {/* Col 1: Instagram Archive & Drafts */}
            <aside className="w-[380px] border-r border-gray-200 bg-white/50 backdrop-blur-xl flex flex-col shrink-0">
                <div className="p-6 border-b border-gray-100 space-y-4">
                    <div>
                        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Content Studio</h2>
                        <h1 className="text-xl font-display font-bold text-[#8A9A5B]">מנוע יצירת תוכן</h1>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex bg-gray-50 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                                activeTab === 'posts'
                                    ? 'bg-white text-[#8A9A5B] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            פוסטים ({posts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('drafts')}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                                activeTab === 'drafts'
                                    ? 'bg-white text-[#8A9A5B] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            טיוטות ({drafts.length})
                        </button>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                            type="text"
                            placeholder={activeTab === 'posts' ? "חפשי פוסט מרחבי הפיד..." : "חפשי טיוטה..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:ring-2 focus:ring-[#8A9A5B]/20 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                    {activeTab === 'posts' ? (
                        // Posts Tab Content
                        <>
                            {isLoading && posts.length === 0 ? (
                                <div className="space-y-4">
                                    <div className="text-center py-8">
                                        <div className="animate-spin w-8 h-8 border-4 border-[#8A9A5B]/20 border-t-[#8A9A5B] rounded-full mx-auto mb-4"></div>
                                        <p className="text-sm text-gray-500">טוען פוסטים מאינסטגרם...</p>
                                    </div>
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="aspect-[4/5] bg-gray-50 animate-pulse rounded-2xl" />
                                    ))}
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">לא נמצאו פוסטים</p>
                                    <p className="text-xs text-gray-400 mt-2">בדוק שהשרת רץ על פורט 8001</p>
                                </div>
                            ) : (
                                filteredPosts.map(post => (
                                    <InstagramCard
                                        key={post.id}
                                        post={post}
                                        onClick={() => handleSelectPost(post.id)}
                                        isSelected={selectedPostId === post.id}
                                    />
                                ))
                            )}
                        </>
                    ) : (
                        // Drafts Tab Content
                        <>
                            {drafts.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">אין טיוטות עדיין</p>
                                    <p className="text-xs text-gray-400 mt-2">המירי פוסט ראשון לטיוטה</p>
                                </div>
                            ) : (
                                drafts
                                    .filter(draft => 
                                        (draft.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        (draft.content || '').toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map(draft => (
                                        <DraftCard
                                            key={draft.id}
                                            draft={draft}
                                            onClick={() => handleSelectDraft(draft.id)}
                                            isSelected={selectedDraftId === draft.id}
                                        />
                                    ))
                            )}
                        </>
                    )}
                </div>
            </aside>

            {/* Col 2: The Editor */}
            <main className="flex-1 flex flex-col relative bg-white/30 backdrop-blur-sm shadow-inner">
                {isLoading && selectedPostId && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 border-4 border-[#8A9A5B]/20 border-t-[#8A9A5B] rounded-full"
                            />
                            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#8A9A5B] animate-pulse" />
                        </div>
                        <p className="font-display font-medium text-[#8A9A5B] animate-pulse">ה-AI הופך את הפוסט למאמר מקצועי...</p>
                    </div>
                )}

                {/* Show Original Post Content First */}
                {selectedPostId && !draft && (
                    <div className="flex-1 flex flex-col p-10 space-y-8 overflow-y-auto scrollbar-thin">
                        <div className="max-w-4xl mx-auto w-full space-y-6">
                            {(() => {
                                const selectedPost = posts.find(p => p.id === selectedPostId);
                                if (!selectedPost) return null;
                                
                                return (
                                    <>
                                        <div className="text-center space-y-4">
                                            <div className="inline-flex items-center gap-2 bg-[#8A9A5B]/10 px-4 py-2 rounded-full">
                                                <FileText className="w-4 h-4 text-[#8A9A5B]" />
                                                <span className="text-sm font-medium text-[#8A9A5B]">תוכן מקורי מאינסטגרם</span>
                                            </div>
                                            <h1 className="text-3xl font-display font-bold text-[#2C3E50] leading-tight">
                                                {selectedPost.title}
                                            </h1>
                                            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{selectedPost.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Heart className="w-4 h-4 text-red-400 fill-current" />
                                                    <span>{selectedPost.likes >= 0 ? selectedPost.likes : 'N/A'} לייקים</span>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-white text-xs font-medium
                                                    ${selectedPost.category_slug === 'nutrition' ? 'bg-[#8A9A5B]' :
                                                      selectedPost.category_slug === 'physical' ? 'bg-[#E6C2BF]' : 
                                                      selectedPost.category_slug === 'diagnosis' ? 'bg-blue-500' :
                                                      'bg-[#2C3E50]'}
                                                `}>
                                                    {selectedPost.category_slug === 'nutrition' ? 'תזונה' :
                                                     selectedPost.category_slug === 'physical' ? 'פיזי' :
                                                     selectedPost.category_slug === 'diagnosis' ? 'אבחון' :
                                                     selectedPost.category_slug === 'mindset' ? 'מחשבה' :
                                                     selectedPost.category_slug}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl shadow-gray-200/50">
                                            <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                                                <span className="text-sm font-bold text-gray-600">תוכן הפוסט המקורי</span>
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#E6C2BF]/40" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#8A9A5B]/40" />
                                                </div>
                                            </div>
                                            <div className="p-8">
                                                <div className="prose prose-lg max-w-none text-right" dir="rtl">
                                                    <div className="text-gray-700 leading-relaxed space-y-4 text-base">
                                                        {(selectedPost.content || '').split('\n').map((paragraph, index) => {
                                                            // Skip empty lines but add spacing
                                                            if (paragraph.trim() === '') {
                                                                return <div key={index} className="h-3" />;
                                                            }
                                                            
                                                            const trimmed = paragraph.trim();
                                                            
                                                            // Check for different content types
                                                            const isQuotedTitle = trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length < 150;
                                                            const isEmphasis = trimmed.length < 80 && (trimmed.includes('!') || trimmed.includes('?') || trimmed.includes(':'));
                                                            const isBulletPoint = trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.startsWith('•');
                                                            const isImportantNote = trimmed.includes('חשוב') || trimmed.includes('שימו לב') || trimmed.includes('זכרו');
                                                            const isCallToAction = trimmed.includes('בואו') || trimmed.includes('תעשו') || trimmed.includes('נסו');
                                                            
                                                            if (isQuotedTitle) {
                                                                return (
                                                                    <div key={index} className="bg-[#8A9A5B]/5 border-r-4 border-[#8A9A5B] p-4 rounded-lg my-6">
                                                                        <h3 className="text-xl font-bold text-[#8A9A5B] leading-tight">
                                                                            {trimmed}
                                                                        </h3>
                                                                    </div>
                                                                );
                                                            }
                                                            
                                                            if (isImportantNote) {
                                                                return (
                                                                    <div key={index} className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
                                                                        <p className="text-amber-800 font-medium leading-relaxed">
                                                                            💡 {trimmed}
                                                                        </p>
                                                                    </div>
                                                                );
                                                            }
                                                            
                                                            if (isCallToAction) {
                                                                return (
                                                                    <div key={index} className="bg-[#E6C2BF]/10 border border-[#E6C2BF]/30 rounded-lg p-4 my-4">
                                                                        <p className="text-[#2C3E50] font-semibold leading-relaxed">
                                                                            ✨ {trimmed}
                                                                        </p>
                                                                    </div>
                                                                );
                                                            }
                                                            
                                                            if (isBulletPoint) {
                                                                return (
                                                                    <div key={index} className="flex items-start gap-3 my-3">
                                                                        <div className="w-2 h-2 bg-[#8A9A5B] rounded-full mt-2 flex-shrink-0"></div>
                                                                        <p className="text-gray-700 leading-relaxed">
                                                                            {trimmed.substring(1).trim()}
                                                                        </p>
                                                                    </div>
                                                                );
                                                            }
                                                            
                                                            if (isEmphasis) {
                                                                return (
                                                                    <p key={index} className="text-lg font-semibold text-[#2C3E50] my-4 text-center bg-gray-50 py-3 px-4 rounded-lg">
                                                                        {trimmed}
                                                                    </p>
                                                                );
                                                            }
                                                            
                                                            // Regular paragraph
                                                            return (
                                                                <p key={index} className="text-gray-700 leading-relaxed mb-4 text-justify">
                                                                    {trimmed}
                                                                </p>
                                                            );
                                                        })}
                                                        
                                                        {/* Show message if no content */}
                                                        {!selectedPost.content && (
                                                            <div className="text-center py-8">
                                                                <p className="text-gray-400 italic">אין תוכן זמין לפוסט זה</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-[#8A9A5B]/5 to-[#E6C2BF]/5 rounded-2xl p-6 border border-gray-100">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-[#8A9A5B] rounded-full flex items-center justify-center">
                                                    <Sparkles className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#2C3E50] text-lg">מוכן להמיר למאמר מקצועי?</h3>
                                                    <p className="text-gray-600 text-sm">ה-AI יהפוך את התוכן הזה למאמר SEO מקצועי בעברית</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        handleConvertToArticle(selectedPost.id);
                                                    }}
                                                    className="flex-1 py-4 bg-[#8A9A5B] text-white font-bold rounded-xl hover:bg-[#8A9A5B]/90 transition-colors flex items-center justify-center gap-3 shadow-lg"
                                                >
                                                    <Sparkles className="w-5 h-5" />
                                                    המר למאמר עכשיו
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedPostId(null);
                                                        setDraft(null);
                                                    }}
                                                    className="px-6 py-4 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                                                >
                                                    בחר פוסט אחר
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {draft ? (
                    <div className="flex-1 flex flex-col p-10 space-y-8 overflow-y-auto scrollbar-thin">
                        <div className="max-w-4xl mx-auto w-full space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">כותרת המאמר החדש</label>
                                <input
                                    value={formData.title || ''}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full text-4xl font-display font-bold bg-transparent border-none focus:ring-0 text-[#2C3E50] placeholder-gray-200 p-0"
                                    placeholder="הכניסי כותרת מנצחת..."
                                />
                            </div>

                            <div className="flex-1 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col min-h-[600px]">
                                <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-3 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Markdown Smart Editor</span>
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#E6C2BF]/40" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#8A9A5B]/40" />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col">
                                    {/* Debug info - can be removed later */}
                                    <div className="absolute top-16 left-6 z-10 bg-green-100 text-xs p-2 rounded shadow">
                                        ✅ Content: {formData.content?.length || 0} chars
                                    </div>
                                    
                                    {/* Enhanced textarea editor */}
                                    <textarea
                                        value={formData.content || ''}
                                        onChange={(e) => {
                                            console.log('📝 Textarea content changed:', e.target.value?.length || 0, 'chars')
                                            setFormData({ ...formData, content: e.target.value || '' })
                                        }}
                                        className="flex-1 w-full p-6 border-none outline-none resize-none bg-transparent text-gray-800"
                                        style={{ 
                                            fontFamily: 'Heebo, monospace',
                                            fontSize: '16px',
                                            lineHeight: '1.6',
                                            direction: 'rtl',
                                            textAlign: 'right',
                                            height: '100%',
                                            minHeight: '500px'
                                        }}
                                        placeholder="התוכן יופיע כאן... תוכלי לערוך אותו בחופשיות"
                                        spellCheck={false}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Floating Save */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="sticky bottom-0 pb-4 flex justify-center"
                        >
                            <button
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className="bg-[#2C3E50] text-white px-10 py-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-3 font-bold"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                שמירה בבסיס הנתונים
                            </button>
                        </motion.div>
                    </div>
                ) : !selectedPostId ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300 space-y-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                            <ChevronLeft className="w-12 h-12 text-gray-200" />
                        </div>
                        <p className="font-display text-lg">בחרי פוסט מהפיד כדי להתחיל המרה למאמר</p>
                    </div>
                ) : null}
            </main>

            {/* Col 3: Visuals & Launch */}
            <aside className="w-[320px] bg-white border-l border-gray-200 flex flex-col p-8 space-y-8 shrink-0">
                {draft && (
                    <>
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Visual Identity</h2>
                                <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative shadow-inner group">
                                    {/* Original Reference */}
                                    {draft.image_url && (
                                        <div className="absolute top-3 left-3 z-10 group-hover:scale-110 transition-transform">
                                            <img
                                                src={draft.image_url}
                                                className="w-12 h-12 rounded-lg border-2 border-white shadow-xl object-cover"
                                                title="Original Post Reference"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = `https://picsum.photos/48/48?random=${draft.id || 'draft'}`;
                                                    target.onerror = null;
                                                }}
                                            />
                                            <span className="absolute -bottom-1 -right-1 bg-[#2C3E50] text-white text-[8px] px-1 rounded">ORIG</span>
                                        </div>
                                    )}

                                    {formData.image_url ? (
                                        <img src={formData.image_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-2">
                                            <ImageIcon className="w-10 h-10 text-gray-100" />
                                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">AI Visualization Pending</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-[#2C3E50] uppercase tracking-widest flex justify-between">
                                    AI Art Prompt
                                    <Sparkles className="w-3 h-3 text-[#E6C2BF]" />
                                </label>
                                <textarea
                                    className="w-full text-xs bg-[#FAFAF5] border border-gray-100 rounded-xl p-4 h-32 outline-none focus:ring-2 focus:ring-[#E6C2BF]/20 transition-all resize-none shadow-sm text-gray-600 leading-relaxed"
                                    value={formData.image_prompt || ''}
                                    onChange={(e) => setFormData({ ...formData, image_prompt: e.target.value })}
                                />
                                <button className="w-full py-3 bg-white border-2 border-[#E6C2BF] text-[#E6C2BF] text-xs font-bold rounded-xl hover:bg-[#E6C2BF] hover:text-white transition-all flex items-center justify-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    ייצור הדמיה חדשה
                                </button>
                            </div>
                        </div>

                        <div className="mt-auto space-y-4">
                            <div className="p-4 bg-[#8A9A5B]/5 rounded-2xl border border-[#8A9A5B]/10 space-y-2">
                                <div className="flex items-center gap-2 text-[10px] text-[#8A9A5B] font-bold">
                                    <CheckCircle2 className="w-3 h-3" />
                                    מותאם לקידום בגוגל
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-[#8A9A5B] font-bold">
                                    <CheckCircle2 className="w-3 h-3" />
                                    מבנה כותרות תקין
                                </div>
                            </div>

                            <button
                                onClick={handlePublish}
                                disabled={isSaving}
                                className="w-full py-5 bg-[#8A9A5B] text-white font-bold rounded-2xl shadow-xl shadow-[#8A9A5B]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center gap-1 group"
                            >
                                <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                                <span>פרסמי לאתר עכשיו</span>
                                <span className="text-[8px] opacity-70 tracking-widest uppercase">Launch Live Article</span>
                            </button>
                        </div>
                    </>
                )}
            </aside>

        </div>
    )
}
