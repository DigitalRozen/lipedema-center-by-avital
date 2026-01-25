import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { 
  matchProductsToPost, 
  getProductsByType, 
  productMatchesTags, 
  getProductMatchScore 
} from './matchingEngine'
import { Product } from '@/types/database'

// Mock products for testing
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Compression Socks',
    type: 'Physical',
    price: 150,
    affiliate_link: 'https://example.com/socks',
    description: 'Medical compression socks',
    image_url: 'https://example.com/socks.jpg',
    trigger_tags: ['compression', 'socks', 'lymphatic'],
    active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '2',
    name: 'Nutrition Guide PDF',
    type: 'Digital',
    price: 99,
    affiliate_link: 'https://example.com/nutrition-guide',
    description: 'Anti-inflammatory nutrition guide',
    image_url: 'https://example.com/guide.jpg',
    trigger_tags: ['nutrition', 'diet', 'anti-inflammatory'],
    active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '3',
    name: 'Lymphatic Massage Oil',
    type: 'Physical',
    price: 80,
    affiliate_link: 'https://example.com/massage-oil',
    description: 'Essential oils for lymphatic massage',
    image_url: 'https://example.com/oil.jpg',
    trigger_tags: ['massage', 'lymphatic', 'oil'],
    active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '4',
    name: 'Inactive Product',
    type: 'Physical',
    price: 200,
    affiliate_link: 'https://example.com/inactive',
    description: 'This product is inactive',
    image_url: 'https://example.com/inactive.jpg',
    trigger_tags: ['compression', 'test'],
    active: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
]

describe('matchProductsToPost', () => {
  it('should return products that match post tags', () => {
    const postTags = ['compression', 'lymphatic']
    const matches = matchProductsToPost(postTags, mockProducts)
    
    expect(matches).toHaveLength(2)
    expect(matches[0].product.name).toBe('Compression Socks')
    expect(matches[0].matchScore).toBe(2) // matches 'compression' and 'lymphatic'
    expect(matches[1].product.name).toBe('Lymphatic Massage Oil')
    expect(matches[1].matchScore).toBe(1) // matches 'lymphatic'
  })

  it('should filter by product type when specified', () => {
    const postTags = ['nutrition', 'lymphatic']
    const matches = matchProductsToPost(postTags, mockProducts, 'Digital')
    
    expect(matches).toHaveLength(1)
    expect(matches[0].product.name).toBe('Nutrition Guide PDF')
    expect(matches[0].product.type).toBe('Digital')
  })

  it('should exclude inactive products', () => {
    const postTags = ['compression']
    const matches = matchProductsToPost(postTags, mockProducts)
    
    // Should only return active compression product, not the inactive one
    expect(matches).toHaveLength(1)
    expect(matches[0].product.name).toBe('Compression Socks')
    expect(matches[0].product.active).toBe(true)
  })

  it('should prioritize Physical products over Digital when match scores are equal', () => {
    const physicalProduct: Product = {
      id: '5',
      name: 'Physical Lymphatic Product',
      type: 'Physical',
      price: 100,
      affiliate_link: 'https://example.com/physical',
      description: 'Physical product',
      image_url: 'https://example.com/physical.jpg',
      trigger_tags: ['test-tag'],
      active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    const digitalProduct: Product = {
      id: '6',
      name: 'Digital Lymphatic Product',
      type: 'Digital',
      price: 100,
      affiliate_link: 'https://example.com/digital',
      description: 'Digital product',
      image_url: 'https://example.com/digital.jpg',
      trigger_tags: ['test-tag'],
      active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    const testProducts = [digitalProduct, physicalProduct] // Digital first in array
    const matches = matchProductsToPost(['test-tag'], testProducts)
    
    expect(matches).toHaveLength(2)
    expect(matches[0].product.type).toBe('Physical') // Should be first despite array order
    expect(matches[1].product.type).toBe('Digital')
  })

  it('should return empty array when no tags match', () => {
    const postTags = ['non-existent-tag']
    const matches = matchProductsToPost(postTags, mockProducts)
    
    expect(matches).toHaveLength(0)
  })

  it('should handle case-insensitive tag matching', () => {
    const postTags = ['COMPRESSION', 'Lymphatic']
    const matches = matchProductsToPost(postTags, mockProducts)
    
    expect(matches).toHaveLength(2)
    expect(matches[0].matchedTags).toContain('compression')
    expect(matches[0].matchedTags).toContain('lymphatic')
  })
})

describe('getProductsByType', () => {
  it('should filter products by type', () => {
    const physicalProducts = getProductsByType(mockProducts, 'Physical')
    const digitalProducts = getProductsByType(mockProducts, 'Digital')
    
    expect(physicalProducts).toHaveLength(2) // Only active physical products
    expect(digitalProducts).toHaveLength(1)
    
    physicalProducts.forEach(product => {
      expect(product.type).toBe('Physical')
      expect(product.active).toBe(true)
    })
  })

  it('should include inactive products when activeOnly is false', () => {
    const allPhysicalProducts = getProductsByType(mockProducts, 'Physical', false)
    
    expect(allPhysicalProducts).toHaveLength(3) // Including inactive product
  })
})

describe('productMatchesTags', () => {
  it('should return true when product has matching tags', () => {
    const product = mockProducts[0] // Compression Socks
    const tags = ['compression', 'other-tag']
    
    expect(productMatchesTags(product, tags)).toBe(true)
  })

  it('should return false when product has no matching tags', () => {
    const product = mockProducts[0] // Compression Socks
    const tags = ['nutrition', 'diet']
    
    expect(productMatchesTags(product, tags)).toBe(false)
  })

  it('should handle products with no trigger_tags', () => {
    const productWithoutTags: Product = {
      ...mockProducts[0],
      trigger_tags: null
    }
    
    expect(productMatchesTags(productWithoutTags, ['compression'])).toBe(false)
  })
})

describe('getProductMatchScore', () => {
  it('should return correct match score', () => {
    const product = mockProducts[0] // Compression Socks with tags: ['compression', 'socks', 'lymphatic']
    const tags = ['compression', 'lymphatic', 'non-matching']
    
    expect(getProductMatchScore(product, tags)).toBe(2)
  })

  it('should return 0 for no matches', () => {
    const product = mockProducts[0]
    const tags = ['nutrition', 'diet']
    
    expect(getProductMatchScore(product, tags)).toBe(0)
  })

  it('should handle products with no trigger_tags', () => {
    const productWithoutTags: Product = {
      ...mockProducts[0],
      trigger_tags: null
    }
    
    expect(getProductMatchScore(productWithoutTags, ['compression'])).toBe(0)
  })
})

// Property-Based Tests
describe('Property-Based Tests', () => {
  // Generators for property-based testing
  const tagArbitrary = fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/.test(s))
  const tagsArrayArbitrary = fc.array(tagArbitrary, { minLength: 0, maxLength: 10 })
  
  const productArbitrary = fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 50 }),
    type: fc.constantFrom('Physical', 'Digital'),
    price: fc.integer({ min: 1, max: 1000 }),
    affiliate_link: fc.webUrl(),
    description: fc.string({ minLength: 1, maxLength: 200 }),
    image_url: fc.webUrl(),
    trigger_tags: fc.option(tagsArrayArbitrary, { nil: null }),
    active: fc.boolean(),
    created_at: fc.date().map(d => d.toISOString()),
    updated_at: fc.date().map(d => d.toISOString())
  }) as fc.Arbitrary<Product>

  describe('Property 6: Product-Post Tag Matching', () => {
    it('Feature: lipedema-authority-platform, Property 6: For any post tags and products, all returned matches should have trigger_tags that overlap with post tags', () => {
      fc.assert(fc.property(
        tagsArrayArbitrary,
        fc.array(productArbitrary, { minLength: 0, maxLength: 20 }),
        (postTags, products) => {
          const matches = matchProductsToPost(postTags, products)
          
          // Every matched product should have at least one trigger_tag that overlaps with post tags
          matches.forEach(match => {
            const productTriggerTags = match.product.trigger_tags || []
            const hasOverlap = productTriggerTags.some(triggerTag =>
              postTags.some(postTag => 
                postTag.toLowerCase().trim() === triggerTag.toLowerCase().trim()
              )
            )
            expect(hasOverlap).toBe(true)
          })
          
          // Match score should equal the number of overlapping tags
          matches.forEach(match => {
            const productTriggerTags = match.product.trigger_tags || []
            const expectedScore = productTriggerTags.filter(triggerTag =>
              postTags.some(postTag => 
                postTag.toLowerCase().trim() === triggerTag.toLowerCase().trim()
              )
            ).length
            expect(match.matchScore).toBe(expectedScore)
          })
          
          // Only active products should be returned
          matches.forEach(match => {
            expect(match.product.active).not.toBe(false)
          })
        }
      ), { numRuns: 100 })
    })

    it('Feature: lipedema-authority-platform, Property 6: For any post tags and product type filter, all returned matches should be of the specified type', () => {
      fc.assert(fc.property(
        tagsArrayArbitrary,
        fc.array(productArbitrary, { minLength: 0, maxLength: 20 }),
        fc.constantFrom('Physical', 'Digital'),
        (postTags, products, productType) => {
          const matches = matchProductsToPost(postTags, products, productType)
          
          // All returned products should be of the specified type
          matches.forEach(match => {
            expect(match.product.type).toBe(productType)
          })
        }
      ), { numRuns: 100 })
    })
  })

  describe('Property 10: Product Type Prioritization', () => {
    it('Feature: lipedema-authority-platform, Property 10: For any products with equal match scores, Physical products should appear before Digital products', () => {
      fc.assert(fc.property(
        tagsArrayArbitrary.filter(tags => tags.length > 0), // Need at least one tag for matches
        (postTags) => {
          // Create two products with the same trigger tags (ensuring equal match scores)
          const sharedTags = postTags.slice(0, Math.min(3, postTags.length))
          
          const physicalProduct: Product = {
            id: 'physical-1',
            name: 'Physical Product',
            type: 'Physical',
            price: 100,
            affiliate_link: 'https://example.com/physical',
            description: 'Physical product',
            image_url: 'https://example.com/physical.jpg',
            trigger_tags: sharedTags,
            active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01'
          }

          const digitalProduct: Product = {
            id: 'digital-1',
            name: 'Digital Product',
            type: 'Digital',
            price: 100,
            affiliate_link: 'https://example.com/digital',
            description: 'Digital product',
            image_url: 'https://example.com/digital.jpg',
            trigger_tags: sharedTags,
            active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01'
          }

          // Test with Digital product first in array to ensure sorting works
          const products = [digitalProduct, physicalProduct]
          const matches = matchProductsToPost(postTags, products)
          
          if (matches.length === 2) {
            // Both products should have the same match score
            expect(matches[0].matchScore).toBe(matches[1].matchScore)
            
            // Physical product should come first
            expect(matches[0].product.type).toBe('Physical')
            expect(matches[1].product.type).toBe('Digital')
          }
        }
      ), { numRuns: 100 })
    })

    it('Feature: lipedema-authority-platform, Property 10: For any products, higher match scores should always take priority over type prioritization', () => {
      fc.assert(fc.property(
        tagsArrayArbitrary.filter(tags => tags.length >= 2), // Need at least 2 tags
        (postTags) => {
          const tag1 = postTags[0]
          const tag2 = postTags[1]
          
          // Create Digital product with higher match score
          const digitalProduct: Product = {
            id: 'digital-high-score',
            name: 'Digital High Score',
            type: 'Digital',
            price: 100,
            affiliate_link: 'https://example.com/digital',
            description: 'Digital product with more matches',
            image_url: 'https://example.com/digital.jpg',
            trigger_tags: [tag1, tag2], // 2 matches
            active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01'
          }

          // Create Physical product with lower match score
          const physicalProduct: Product = {
            id: 'physical-low-score',
            name: 'Physical Low Score',
            type: 'Physical',
            price: 100,
            affiliate_link: 'https://example.com/physical',
            description: 'Physical product with fewer matches',
            image_url: 'https://example.com/physical.jpg',
            trigger_tags: [tag1], // 1 match
            active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01'
          }

          const products = [physicalProduct, digitalProduct]
          const matches = matchProductsToPost(postTags, products)
          
          if (matches.length === 2) {
            // Digital product should come first despite being Digital type
            // because it has a higher match score
            expect(matches[0].product.type).toBe('Digital')
            expect(matches[0].matchScore).toBeGreaterThan(matches[1].matchScore)
            expect(matches[1].product.type).toBe('Physical')
          }
        }
      ), { numRuns: 100 })
    })
  })
})