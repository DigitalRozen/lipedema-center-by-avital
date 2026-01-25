'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, ShoppingBag, Star } from 'lucide-react'
import { Product, MonetizationStrategy, ProductType } from '@/types/database'
import { matchProductsToPost, ProductMatch } from '@/lib/products/matchingEngine'
import { useLocale } from '@/lib/i18n/context'

// Simple analytics tracking (no-op for now)
async function trackAffiliateClick(productId: string, postId?: string, metadata?: Record<string, unknown>) {
  console.debug('[Analytics] Affiliate click:', { productId, postId, metadata })
}

interface RecommendedProductsProps {
  postTags: string[]
  monetizationStrategy?: MonetizationStrategy
  postId?: string
}

// Static products data (can be moved to Keystatic later)
const staticProducts: Product[] = [
  // Add your products here or load from a JSON file
]

export function RecommendedProducts({ postTags, monetizationStrategy, postId }: RecommendedProductsProps) {
  const { t } = useLocale()
  const [productMatches, setProductMatches] = useState<ProductMatch[]>([])
  const [loading, setLoading] = useState(true)

  const handleAffiliateClick = async (product: Product) => {
    try {
      await trackAffiliateClick(product.id, postId, {
        product_name: product.name,
        product_type: product.type,
        price: product.price,
        monetization_strategy: monetizationStrategy,
        click_timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.warn('Failed to track affiliate click:', error)
    }
  }

  useEffect(() => {
    async function fetchProducts() {
      // Use static products for now (can be replaced with Keystatic collection later)
      const products = staticProducts

      if (products.length > 0) {
        // Determine product type filter based on monetization strategy
        let productType: ProductType | undefined
        if (monetizationStrategy === 'Affiliate (Products)') {
          productType = 'Physical'
        } else if (monetizationStrategy === 'Low Ticket (Digital Guide)') {
          productType = 'Digital'
        }

        // Use matching engine to get filtered and sorted products
        const matches = matchProductsToPost(postTags, products, productType)
        setProductMatches(matches)
      }
      setLoading(false)
    }

    if (postTags.length > 0) {
      fetchProducts()
    } else {
      setLoading(false)
    }
  }, [postTags, monetizationStrategy])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
        <div className="space-y-4">
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (productMatches.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-100">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-sage-500" />
        <h3 className="font-display font-semibold text-sage-900">{t.sidebar.recommended}</h3>
      </div>
      <div className="space-y-4">
        {productMatches.map(({ product, matchScore, matchedTags }) => (
          <a
            key={product.id}
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleAffiliateClick(product)}
            className="block p-4 bg-dusty-rose-50/50 border border-transparent hover:border-dusty-rose-200 rounded-2xl hover:bg-dusty-rose-50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="flex items-start gap-3">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg shrink-0"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-sage-200/50 to-dusty-rose-100/50 rounded-lg flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6 text-sage-500/50" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-gray-800 group-hover:text-sage-700 transition-colors">
                    {product.name}
                  </h4>
                  {product.type === 'Digital' && matchScore > 0 && (
                    <div className="flex items-center gap-1 bg-sage-100 text-sage-700 text-xs px-2 py-1 rounded-full shrink-0">
                      <Star className="w-3 h-3 fill-current" />
                      <span>מומלץ עבורך</span>
                    </div>
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sage-600 font-semibold">₪{product.price}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    {product.type === 'Digital' ? t.sidebar.digitalProduct : t.sidebar.physicalProduct}
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
