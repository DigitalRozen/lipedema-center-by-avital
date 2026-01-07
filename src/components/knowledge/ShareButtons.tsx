'use client'

import { useState } from 'react'
import { Share2, Facebook, Instagram, MessageCircle, Link, Check } from 'lucide-react'
import { useLocale } from '@/lib/i18n/context'
import { trackShareClick } from '@/lib/analytics/analyticsService'

interface ShareButtonsProps {
  postId: string
  title: string
  excerpt?: string | null
  url: string
  className?: string
}

export function ShareButtons({ postId, title, excerpt, url, className = '' }: ShareButtonsProps) {
  const { t } = useLocale()
  const [copied, setCopied] = useState(false)

  const shareText = excerpt ? `${title}\n\n${excerpt}` : title
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(shareText)
  const encodedUrl = encodeURIComponent(url)

  const handleShare = async (platform: string, shareUrl?: string) => {
    try {
      await trackShareClick(postId, platform, { url, title })
    } catch (error) {
      console.warn('Failed to track share click:', error)
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      await handleShare('copy_link')
    } catch (error) {
      console.warn('Failed to copy link:', error)
    }
  }

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    // Instagram doesn't support direct URL sharing, so we'll copy the link
    instagram: null
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        {t.share.title}:
      </span>
      
      <div className="flex items-center gap-2">
        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook', shareUrls.facebook)}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          title={t.share.facebook}
        >
          <Facebook className="w-4 h-4" />
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => handleShare('whatsapp', shareUrls.whatsapp)}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
          title={t.share.whatsapp}
        >
          <MessageCircle className="w-4 h-4" />
        </button>

        {/* Instagram (Copy Link) */}
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors"
          title={t.share.instagram}
        >
          <Instagram className="w-4 h-4" />
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
            copied 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          title={copied ? t.share.linkCopied : t.share.copyLink}
        >
          {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}