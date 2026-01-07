import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { RecommendedProducts } from './RecommendedProducts'
import { Product, MonetizationStrategy } from '@/types/database'
import * as fc from 'fast-check'

// Create a mock Supabase client that can be controlled per test
const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: [] }))
    }))
  }))
}

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabaseClient
}))

// Mock the analytics service
vi.mock('@/lib/analytics/analyticsService', () => ({
  trackAffiliateClick: vi.fn()
}))

// Mock the i18n context
vi.mock('@/lib/i18n/context', () => ({
  useLocale: () => ({
    t: {
      sidebar: {
        recommended: 'מוצרים מומלצים',
        digitalProduct: 'מוצר דיגיטלי',
        physicalProduct: 'מוצר פיזי'
      }
    }
  })
}))

// Mock the matching engine
vi.mock('@/lib/products/matchingEngine', () => ({
  matchProductsToPost: vi.fn()
}))

import { matchProductsToPost } from '@/lib/products/matchingEngine'

describe('RecommendedProducts Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Helper function to setup Supabase mock with test data
  const setupSupabaseMock = (products: Product[]) => {
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: products }))
      }))
    })
  }

  describe('Property 7: Product Display Completeness', () => {
    /**
     * Feature: lipedema-authority-platform, Property 7: Product Display Completeness
     * For any product object with all required fields (name, image_url, description, price, affiliate_link), 
     * the rendered product display should contain all of these fields in the output.
     * Validates: Requirements 3.2, 4.2
     */
    it('should display all required product fields when present', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate products with all required fields
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            image_url: fc.webUrl(),
            description: fc.string({ minLength: 1, maxLength: 500 }),
            price: fc.integer({ min: 1, max: 10000 }),
            affiliate_link: fc.webUrl(),
            type: fc.constantFrom('Digital', 'Physical'),
            active: fc.constant(true),
            trigger_tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
            created_at: fc.date().map(d => d.toISOString()),
            updated_at: fc.date().map(d => d.toISOString())
          }),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          async (product: Product, postTags: string[]) => {
            // Setup Supabase mock to return our test product
            setupSupabaseMock([product])
            
            // Mock the matching engine to return our test product
            vi.mocked(matchProductsToPost).mockReturnValue([
              {
                product,
                matchScore: 1,
                matchedTags: [postTags[0]]
              }
            ])

            const { container } = render(
              <RecommendedProducts 
                postTags={postTags}
                monetizationStrategy="Affiliate (Products)"
              />
            )

            // Wait for the component to finish loading and render products
            await waitFor(() => {
              expect(screen.getByText(product.name)).toBeInTheDocument()
            }, { timeout: 3000 })

            // Check that all required fields are displayed
            expect(screen.getByText(product.description!)).toBeInTheDocument()
            expect(screen.getByText(`₪${product.price}`)).toBeInTheDocument()
            
            // Check that image is displayed
            const image = screen.getByAltText(product.name)
            expect(image).toBeInTheDocument()
            expect(image).toHaveAttribute('src', product.image_url)
            
            // Check that affiliate link is present
            const link = container.querySelector(`a[href="${product.affiliate_link}"]`)
            expect(link).toBeInTheDocument()
          }
        ),
        { numRuns: 10 } // Reduced for faster execution
      )
    })
  })

  describe('Property 8: Affiliate Link Security Attributes', () => {
    /**
     * Feature: lipedema-authority-platform, Property 8: Affiliate Link Security Attributes
     * For any rendered affiliate link element, the element should have target="_blank" 
     * and rel="noopener noreferrer" attributes.
     * Validates: Requirements 3.3
     */
    it('should have correct security attributes on all affiliate links', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate products with affiliate links
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            image_url: fc.webUrl(),
            description: fc.string({ minLength: 1, maxLength: 500 }),
            price: fc.integer({ min: 1, max: 10000 }),
            affiliate_link: fc.webUrl(),
            type: fc.constantFrom('Digital', 'Physical'),
            active: fc.constant(true),
            trigger_tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
            created_at: fc.date().map(d => d.toISOString()),
            updated_at: fc.date().map(d => d.toISOString())
          }),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          async (product: Product, postTags: string[]) => {
            // Setup Supabase mock to return our test product
            setupSupabaseMock([product])
            
            // Mock the matching engine to return our test product
            vi.mocked(matchProductsToPost).mockReturnValue([
              {
                product,
                matchScore: 1,
                matchedTags: [postTags[0]]
              }
            ])

            const { container } = render(
              <RecommendedProducts 
                postTags={postTags}
                monetizationStrategy="Affiliate (Products)"
              />
            )

            // Wait for the component to finish loading and render products
            await waitFor(() => {
              const link = container.querySelector(`a[href="${product.affiliate_link}"]`)
              expect(link).toBeInTheDocument()
            }, { timeout: 3000 })

            // Find the affiliate link and check security attributes
            const link = container.querySelector(`a[href="${product.affiliate_link}"]`)
            expect(link).toHaveAttribute('target', '_blank')
            expect(link).toHaveAttribute('rel', 'noopener noreferrer')
          }
        ),
        { numRuns: 10 } // Reduced for faster execution
      )
    })
  })

  describe('Property 11: Recommended Label for Matching Products', () => {
    /**
     * Feature: lipedema-authority-platform, Property 11: Recommended Label for Matching Products
     * For any Digital product that matches a post's tags, the rendered display should include 
     * the "מומלץ עבורך" label.
     * Validates: Requirements 4.5
     */
    it('should show recommended label for Digital products with matching tags', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate Digital products with matching tags
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            image_url: fc.webUrl(),
            description: fc.string({ minLength: 1, maxLength: 500 }),
            price: fc.integer({ min: 1, max: 10000 }),
            affiliate_link: fc.webUrl(),
            type: fc.constant('Digital'),
            active: fc.constant(true),
            trigger_tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
            created_at: fc.date().map(d => d.toISOString()),
            updated_at: fc.date().map(d => d.toISOString())
          }),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          async (product: Product, postTags: string[]) => {
            // Ensure there's at least one matching tag
            const matchingTag = postTags[0]
            const productWithMatchingTag = {
              ...product,
              trigger_tags: [matchingTag, ...(product.trigger_tags || [])]
            }

            // Setup Supabase mock to return our test product
            setupSupabaseMock([productWithMatchingTag])

            // Mock the matching engine to return our test product with a match score > 0
            vi.mocked(matchProductsToPost).mockReturnValue([
              {
                product: productWithMatchingTag,
                matchScore: 1,
                matchedTags: [matchingTag]
              }
            ])

            render(
              <RecommendedProducts 
                postTags={postTags}
                monetizationStrategy="Low Ticket (Digital Guide)"
              />
            )

            // Wait for the component to finish loading and check for recommended label
            await waitFor(() => {
              expect(screen.getByText('מומלץ עבורך')).toBeInTheDocument()
            }, { timeout: 3000 })
          }
        ),
        { numRuns: 10 } // Reduced for faster execution
      )
    })

    it('should NOT show recommended label for Physical products even with matching tags', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate Physical products with matching tags
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            image_url: fc.webUrl(),
            description: fc.string({ minLength: 1, maxLength: 500 }),
            price: fc.integer({ min: 1, max: 10000 }),
            affiliate_link: fc.webUrl(),
            type: fc.constant('Physical'),
            active: fc.constant(true),
            trigger_tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
            created_at: fc.date().map(d => d.toISOString()),
            updated_at: fc.date().map(d => d.toISOString())
          }),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          async (product: Product, postTags: string[]) => {
            // Ensure there's at least one matching tag
            const matchingTag = postTags[0]
            const productWithMatchingTag = {
              ...product,
              trigger_tags: [matchingTag, ...(product.trigger_tags || [])]
            }

            // Setup Supabase mock to return our test product
            setupSupabaseMock([productWithMatchingTag])

            // Mock the matching engine to return our test product with a match score > 0
            vi.mocked(matchProductsToPost).mockReturnValue([
              {
                product: productWithMatchingTag,
                matchScore: 1,
                matchedTags: [matchingTag]
              }
            ])

            render(
              <RecommendedProducts 
                postTags={postTags}
                monetizationStrategy="Affiliate (Products)"
              />
            )

            // Wait for the component to finish loading
            await waitFor(() => {
              expect(screen.getByText(product.name)).toBeInTheDocument()
            }, { timeout: 3000 })

            // Check that the recommended label is NOT present for Physical products
            expect(screen.queryByText('מומלץ עבורך')).not.toBeInTheDocument()
          }
        ),
        { numRuns: 10 } // Reduced for faster execution
      )
    })

    it('should NOT show recommended label for Digital products with no matching tags', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate Digital products with no matching tags
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            image_url: fc.webUrl(),
            description: fc.string({ minLength: 1, maxLength: 500 }),
            price: fc.integer({ min: 1, max: 10000 }),
            affiliate_link: fc.webUrl(),
            type: fc.constant('Digital'),
            active: fc.constant(true),
            trigger_tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
            created_at: fc.date().map(d => d.toISOString()),
            updated_at: fc.date().map(d => d.toISOString())
          }),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          async (product: Product, postTags: string[]) => {
            // Setup Supabase mock to return our test product
            setupSupabaseMock([product])

            // Mock the matching engine to return our test product with match score = 0 (no matches)
            vi.mocked(matchProductsToPost).mockReturnValue([
              {
                product,
                matchScore: 0,
                matchedTags: []
              }
            ])

            render(
              <RecommendedProducts 
                postTags={postTags}
                monetizationStrategy="Low Ticket (Digital Guide)"
              />
            )

            // Wait for the component to finish loading
            await waitFor(() => {
              expect(screen.getByText(product.name)).toBeInTheDocument()
            }, { timeout: 3000 })

            // Check that the recommended label is NOT present when matchScore is 0
            expect(screen.queryByText('מומלץ עבורך')).not.toBeInTheDocument()
          }
        ),
        { numRuns: 10 } // Reduced for faster execution
      )
    })
  })
})