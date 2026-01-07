import { createClient } from '@/lib/supabase/client'
import { AnalyticsEventType, AnalyticsEventInsert, Json } from '@/types/database'

export class AnalyticsService {
  private supabase = createClient()

  /**
   * Track a page view event
   * @param postId - The ID of the post being viewed
   * @param metadata - Additional metadata (e.g., referrer, user agent)
   */
  async trackPageView(postId: string, metadata?: Record<string, unknown>): Promise<void> {
    try {
      const event: AnalyticsEventInsert = {
        event_type: 'page_view',
        post_id: postId,
        metadata: (metadata || {}) as Json
      }

      const { error } = await this.supabase
        .from('analytics_events')
        .insert(event)

      if (error) {
        console.error('Failed to track page view:', JSON.stringify(error, null, 2))
        throw error
      }
    } catch (error) {
      console.error('Error tracking page view:', error instanceof Error ? error.message : JSON.stringify(error, null, 2))
      // Don't throw to prevent crashing the app
      // throw error 
    }
  }

  /**
   * Track an affiliate link click event
   * @param productId - The ID of the product whose affiliate link was clicked
   * @param postId - The ID of the post where the click occurred (optional)
   * @param metadata - Additional metadata (e.g., click position, user context)
   */
  async trackAffiliateClick(
    productId: string,
    postId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      const event: AnalyticsEventInsert = {
        event_type: 'affiliate_click',
        product_id: productId,
        post_id: postId || null,
        metadata: (metadata || {}) as Json
      }

      const { error } = await this.supabase
        .from('analytics_events')
        .insert(event)

      if (error) {
        console.error('Failed to track affiliate click:', JSON.stringify(error, null, 2))
        throw error
      }
    } catch (error) {
      console.error('Error tracking affiliate click:', error instanceof Error ? error.message : JSON.stringify(error, null, 2))
      // Don't throw
    }
  }

  /**
   * Track a lead form submission event
   * @param postId - The ID of the post where the lead was captured (optional)
   * @param metadata - Additional metadata (e.g., form source, lead qualification data)
   */
  async trackLeadSubmit(postId?: string, metadata?: Record<string, unknown>): Promise<void> {
    try {
      const event: AnalyticsEventInsert = {
        event_type: 'lead_submit',
        post_id: postId || null,
        metadata: (metadata || {}) as Json
      }

      const { error } = await this.supabase
        .from('analytics_events')
        .insert(event)

      if (error) {
        console.error('Failed to track lead submission:', error)
        throw error
      }
    } catch (error) {
      console.error('Error tracking lead submission:', error)
      throw error
    }
  }

  /**
   * Track a share click event
   * @param postId - The ID of the post being shared
   * @param platform - The platform where the post is being shared (facebook, whatsapp, instagram, copy_link)
   * @param metadata - Additional metadata (e.g., share URL, title)
   */
  async trackShareClick(
    postId: string,
    platform: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      const event: AnalyticsEventInsert = {
        event_type: 'share_click' as AnalyticsEventType,
        post_id: postId,
        metadata: {
          platform,
          timestamp: new Date().toISOString(),
          ...metadata
        } as Json
      }

      const { error } = await this.supabase
        .from('analytics_events')
        .insert(event)

      if (error) {
        console.error('Failed to track share click:', JSON.stringify(error, null, 2))
        throw error
      }
    } catch (error) {
      console.error('Error tracking share click:', error instanceof Error ? error.message : JSON.stringify(error, null, 2))
      // Don't throw to prevent crashing the app
    }
  }
  /**
   * Get analytics summary for a specific time period
   * @param startDate - Start date for the analytics period
   * @param endDate - End date for the analytics period
   */
  async getAnalyticsSummary(startDate?: string, endDate?: string) {
    try {
      let query = this.supabase
        .from('analytics_events')
        .select('event_type, post_id, product_id, created_at')

      if (startDate) {
        query = query.gte('created_at', startDate)
      }
      if (endDate) {
        query = query.lte('created_at', endDate)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to get analytics summary:', error)
        throw error
      }

      // Group events by type for summary
      const summary = {
        page_views: data?.filter(event => event.event_type === 'page_view').length || 0,
        affiliate_clicks: data?.filter(event => event.event_type === 'affiliate_click').length || 0,
        lead_submissions: data?.filter(event => event.event_type === 'lead_submit').length || 0,
        share_clicks: data?.filter(event => event.event_type === 'share_click').length || 0,
        total_events: data?.length || 0
      }

      return { summary, events: data }
    } catch (error) {
      console.error('Error getting analytics summary:', error)
      throw error
    }
  }
}

// Export a singleton instance
export const analyticsService = new AnalyticsService()

// Export convenience functions for easier usage
export const trackPageView = (postId: string, metadata?: Record<string, unknown>) =>
  analyticsService.trackPageView(postId, metadata)

export const trackAffiliateClick = (
  productId: string,
  postId?: string,
  metadata?: Record<string, unknown>
) => analyticsService.trackAffiliateClick(productId, postId, metadata)

export const trackLeadSubmit = (postId?: string, metadata?: Record<string, unknown>) =>
  analyticsService.trackLeadSubmit(postId, metadata)

export const trackShareClick = (
  postId: string,
  platform: string,
  metadata?: Record<string, unknown>
) => analyticsService.trackShareClick(postId, platform, metadata)