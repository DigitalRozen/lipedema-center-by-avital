import { Product, ProductType } from '@/types/database'

export interface ProductMatch {
  product: Product
  matchScore: number
  matchedTags: string[]
}

/**
 * Matches products to a post based on tag overlap and product type filtering
 * @param postTags - Array of tags from the post
 * @param products - Array of all available products
 * @param productType - Optional filter by product type ('Physical' | 'Digital')
 * @returns Array of ProductMatch objects sorted by match score and type priority
 */
export function matchProductsToPost(
  postTags: string[],
  products: Product[],
  productType?: ProductType
): ProductMatch[] {
  // Filter active products first
  let filteredProducts = products.filter(p => p.active !== false)
  
  // Filter by product type if specified
  if (productType) {
    filteredProducts = filteredProducts.filter(p => p.type === productType)
  }
  
  // Calculate matches and scores
  const matches = filteredProducts
    .map(product => {
      const productTriggerTags = product.trigger_tags || []
      const matchedTags = productTriggerTags.filter(tag => 
        postTags.some(postTag => 
          postTag.toLowerCase().trim() === tag.toLowerCase().trim()
        )
      )
      
      return {
        product,
        matchScore: matchedTags.length,
        matchedTags
      }
    })
    .filter(match => match.matchScore > 0) // Only include products with at least one matching tag
  
  // Sort by match score (descending) and then by type priority (Physical first for affiliate posts)
  return matches.sort((a, b) => {
    // First sort by match score (higher is better)
    if (a.matchScore !== b.matchScore) {
      return b.matchScore - a.matchScore
    }
    
    // If match scores are equal, prioritize Physical products for affiliate posts
    // This implements the type priority requirement from 3.6
    if (a.product.type !== b.product.type) {
      if (a.product.type === 'Physical') return -1
      if (b.product.type === 'Physical') return 1
    }
    
    // If everything else is equal, sort by product name for consistency
    return a.product.name.localeCompare(b.product.name)
  })
}

/**
 * Gets products filtered by type and active status
 * @param products - Array of all products
 * @param type - Product type to filter by
 * @param activeOnly - Whether to include only active products (default: true)
 * @returns Filtered array of products
 */
export function getProductsByType(
  products: Product[],
  type: ProductType,
  activeOnly: boolean = true
): Product[] {
  return products.filter(product => {
    if (activeOnly && product.active === false) {
      return false
    }
    return product.type === type
  })
}

/**
 * Checks if a product matches any of the given tags
 * @param product - Product to check
 * @param tags - Array of tags to match against
 * @returns True if product has at least one matching trigger tag
 */
export function productMatchesTags(product: Product, tags: string[]): boolean {
  const productTriggerTags = product.trigger_tags || []
  return productTriggerTags.some(triggerTag =>
    tags.some(tag => 
      tag.toLowerCase().trim() === triggerTag.toLowerCase().trim()
    )
  )
}

/**
 * Gets the match score between a product and a set of tags
 * @param product - Product to score
 * @param tags - Array of tags to match against
 * @returns Number of matching tags (0 if no matches)
 */
export function getProductMatchScore(product: Product, tags: string[]): number {
  const productTriggerTags = product.trigger_tags || []
  return productTriggerTags.filter(triggerTag =>
    tags.some(tag => 
      tag.toLowerCase().trim() === triggerTag.toLowerCase().trim()
    )
  ).length
}