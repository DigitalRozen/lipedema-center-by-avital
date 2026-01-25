import { Metadata } from 'next'
import { Post } from '@/types/database'

interface GeneratePostMetadataProps {
  post: Post
  baseUrl: string
}

export function generatePostMetadata({ post, baseUrl }: GeneratePostMetadataProps): Metadata {
  const postUrl = `${baseUrl}/knowledge/${post.slug}`
  const siteName = 'פלטפורמת הליפאדמה של אביטל'
  
  // Create a clean description from excerpt or content
  const description = post.excerpt || 
    (post.content ? post.content.substring(0, 160).replace(/<[^>]*>/g, '') + '...' : 
    'מאמר מקצועי על ליפאדמה ודרכי טיפול')

  // Use post image or generate dynamic OG image
  const imageUrl = post.image_url || 
    `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category_display || post.category)}&excerpt=${encodeURIComponent(description)}`
  
  return {
    title: `${post.title} | ${siteName}`,
    description,
    keywords: [
      'ליפאדמה',
      'טיפול בליפאדמה',
      'אביטל רוזן',
      'נטורופתיה',
      ...(post.tags || [])
    ],
    authors: [{ name: 'אביטל רוזן ND' }],
    creator: 'אביטל רוזן ND',
    publisher: siteName,
    
    // Open Graph
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: postUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      locale: 'he_IL',
      authors: ['אביטל רוזן ND'],
      publishedTime: post.date,
      modifiedTime: post.updated_at || post.date,
      section: post.category_display || post.category,
      tags: post.tags || [],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [imageUrl],
      creator: '@avital_rozen', // Replace with actual Twitter handle
    },

    // Additional metadata
    alternates: {
      canonical: postUrl,
    },
    
    robots: {
      index: post.published !== false,
      follow: true,
      googleBot: {
        index: post.published !== false,
        follow: true,
      },
    },

    // Schema.org structured data
    other: {
      'article:author': 'אביטל רוזן ND',
      'article:published_time': post.date,
      'article:modified_time': post.updated_at || post.date,
      'article:section': post.category_display || post.category,
      'article:tag': post.tags?.join(', ') || '',
    },
  }
}

// Helper function to generate JSON-LD structured data
export function generatePostJsonLd(post: Post, baseUrl: string) {
  const postUrl = `${baseUrl}/knowledge/${post.slug}`
  const description = post.excerpt || post.content?.substring(0, 160).replace(/<[^>]*>/g, '')
  const imageUrl = post.image_url || 
    `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category_display || post.category)}&excerpt=${encodeURIComponent(description || '')}`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: description,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: 'אביטל רוזן ND',
      url: `${baseUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'פלטפורמת הליפאדמה של אביטל',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
    datePublished: post.date,
    dateModified: post.updated_at || post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    articleSection: post.category_display || post.category,
    keywords: post.tags?.join(', ') || '',
    url: postUrl,
  }
}