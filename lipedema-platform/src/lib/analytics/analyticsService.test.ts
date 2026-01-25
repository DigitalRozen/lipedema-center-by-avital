import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fc from 'fast-check'

// Mock the Supabase client
const mockInsert = vi.fn()
const mockSelect = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      insert: mockInsert,
      select: mockSelect
    })
  })
}))

// Import after mocking
const { AnalyticsService } = await import('./analyticsService')

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService

  beforeEach(() => {
    vi.clearAllMocks()
    analyticsService = new AnalyticsService()
    
    // Default successful response
    mockInsert.mockResolvedValue({ error: null })
    mockSelect.mockReturnValue({
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null })
    })
  })

  describe('trackPageView', () => {
    it('should track page view with post ID', async () => {
      const postId = 'test-post-id'
      const metadata = { referrer: 'google.com' }

      await analyticsService.trackPageView(postId, metadata)

      expect(mockInsert).toHaveBeenCalledWith({
        event_type: 'page_view',
        post_id: postId,
        metadata
      })
    })

    it('should track page view without metadata', async () => {
      const postId = 'test-post-id'

      await analyticsService.trackPageView(postId)

      expect(mockInsert).toHaveBeenCalledWith({
        event_type: 'page_view',
        post_id: postId,
        metadata: {}
      })
    })

    it('should throw error when database operation fails', async () => {
      const error = new Error('Database error')
      mockInsert.mockResolvedValue({ error })

      await expect(analyticsService.trackPageView('test-id')).rejects.toThrow('Database error')
    })
  })

  describe('trackAffiliateClick', () => {
    it('should track affiliate click with product and post ID', async () => {
      const productId = 'test-product-id'
      const postId = 'test-post-id'
      const metadata = { position: 'sidebar' }

      await analyticsService.trackAffiliateClick(productId, postId, metadata)

      expect(mockInsert).toHaveBeenCalledWith({
        event_type: 'affiliate_click',
        product_id: productId,
        post_id: postId,
        metadata
      })
    })

    it('should track affiliate click without post ID', async () => {
      const productId = 'test-product-id'

      await analyticsService.trackAffiliateClick(productId)

      expect(mockInsert).toHaveBeenCalledWith({
        event_type: 'affiliate_click',
        product_id: productId,
        post_id: null,
        metadata: {}
      })
    })

    it('should throw error when database operation fails', async () => {
      const error = new Error('Database error')
      mockInsert.mockResolvedValue({ error })

      await expect(analyticsService.trackAffiliateClick('test-id')).rejects.toThrow('Database error')
    })
  })

  describe('trackLeadSubmit', () => {
    it('should track lead submission with post ID', async () => {
      const postId = 'test-post-id'
      const metadata = { source: 'article-cta' }

      await analyticsService.trackLeadSubmit(postId, metadata)

      expect(mockInsert).toHaveBeenCalledWith({
        event_type: 'lead_submit',
        post_id: postId,
        metadata
      })
    })

    it('should track lead submission without post ID', async () => {
      await analyticsService.trackLeadSubmit()

      expect(mockInsert).toHaveBeenCalledWith({
        event_type: 'lead_submit',
        post_id: null,
        metadata: {}
      })
    })

    it('should throw error when database operation fails', async () => {
      const error = new Error('Database error')
      mockInsert.mockResolvedValue({ error })

      await expect(analyticsService.trackLeadSubmit()).rejects.toThrow('Database error')
    })
  })

  describe('getAnalyticsSummary', () => {
    it('should return analytics summary with correct counts', async () => {
      const mockEvents = [
        { event_type: 'page_view', post_id: '1', product_id: null, created_at: '2024-01-01' },
        { event_type: 'page_view', post_id: '2', product_id: null, created_at: '2024-01-02' },
        { event_type: 'affiliate_click', post_id: '1', product_id: '1', created_at: '2024-01-03' },
        { event_type: 'lead_submit', post_id: null, product_id: null, created_at: '2024-01-04' }
      ]

      const mockQuery = {
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockEvents, error: null })
      }
      mockSelect.mockReturnValue(mockQuery)

      const result = await analyticsService.getAnalyticsSummary()

      expect(result.summary).toEqual({
        page_views: 2,
        affiliate_clicks: 1,
        lead_submissions: 1,
        total_events: 4
      })
      expect(result.events).toEqual(mockEvents)
    })

    it('should filter by date range when provided', async () => {
      const startDate = '2024-01-01'
      const endDate = '2024-01-31'

      const mockQuery = {
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null })
      }
      mockSelect.mockReturnValue(mockQuery)

      await analyticsService.getAnalyticsSummary(startDate, endDate)

      expect(mockQuery.gte).toHaveBeenCalledWith('created_at', startDate)
      expect(mockQuery.lte).toHaveBeenCalledWith('created_at', endDate)
    })

    it('should handle empty results', async () => {
      const mockQuery = {
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: null })
      }
      mockSelect.mockReturnValue(mockQuery)

      const result = await analyticsService.getAnalyticsSummary()

      expect(result.summary).toEqual({
        page_views: 0,
        affiliate_clicks: 0,
        lead_submissions: 0,
        total_events: 0
      })
    })

    it('should throw error when database operation fails', async () => {
      const error = new Error('Database error')
      const mockQuery = {
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error })
      }
      mockSelect.mockReturnValue(mockQuery)

      await expect(analyticsService.getAnalyticsSummary()).rejects.toThrow('Database error')
    })
  })

  // Property-based tests
  describe('Property 9: Analytics Event Creation', () => {
    /**
     * Feature: lipedema-authority-platform, Property 9: Analytics Event Creation
     * For any tracked action (page view, affiliate click, lead submission), 
     * an analytics event should be created with the correct event_type and associated post_id or product_id.
     * Validates: Requirements 3.4, 8.1, 8.3
     */
    it('should create analytics events with correct structure for any valid input', async () => {
      await fc.assert(fc.asyncProperty(
        fc.record({
          eventType: fc.constantFrom('page_view', 'affiliate_click', 'lead_submit'),
          postId: fc.option(fc.uuid(), { nil: null }),
          productId: fc.option(fc.uuid(), { nil: null }),
          metadata: fc.option(fc.dictionary(fc.string(), fc.anything()), { nil: {} })
        }),
        async ({ eventType, postId, productId, metadata }) => {
          // Reset mock before each test
          mockInsert.mockClear()
          mockInsert.mockResolvedValue({ error: null })

          let insertedEvent: any = null
          mockInsert.mockImplementation((event) => {
            insertedEvent = event
            return Promise.resolve({ error: null })
          })

          // Call the appropriate tracking method based on event type
          switch (eventType) {
            case 'page_view':
              if (postId) {
                await analyticsService.trackPageView(postId, metadata || undefined)
              }
              break
            case 'affiliate_click':
              if (productId) {
                await analyticsService.trackAffiliateClick(productId, postId || undefined, metadata || undefined)
              }
              break
            case 'lead_submit':
              await analyticsService.trackLeadSubmit(postId || undefined, metadata || undefined)
              break
          }

          // Skip validation if required parameters are missing
          if (eventType === 'page_view' && !postId) return
          if (eventType === 'affiliate_click' && !productId) return

          // Verify that an event was inserted
          expect(mockInsert).toHaveBeenCalledTimes(1)
          expect(insertedEvent).toBeDefined()

          // Verify event structure
          expect(insertedEvent.event_type).toBe(eventType)
          expect(insertedEvent.metadata).toBeDefined()

          // Verify correct ID associations based on event type
          switch (eventType) {
            case 'page_view':
              expect(insertedEvent.post_id).toBe(postId)
              expect(insertedEvent.product_id).toBeUndefined()
              break
            case 'affiliate_click':
              expect(insertedEvent.product_id).toBe(productId)
              expect(insertedEvent.post_id).toBe(postId)
              break
            case 'lead_submit':
              expect(insertedEvent.post_id).toBe(postId)
              expect(insertedEvent.product_id).toBeUndefined()
              break
          }

          // Verify metadata is preserved
          if (metadata && Object.keys(metadata).length > 0) {
            expect(insertedEvent.metadata).toEqual(metadata)
          } else {
            expect(insertedEvent.metadata).toEqual({})
          }
        }
      ), { numRuns: 100 })
    })
  })
})