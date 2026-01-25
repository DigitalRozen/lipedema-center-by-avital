/**
 * Analytics Service - Stub Implementation
 * 
 * This is a no-op stub after migrating from Supabase.
 * Analytics can be re-implemented with Google Analytics or another service.
 */

export type AnalyticsEventType = 'page_view' | 'affiliate_click' | 'lead_submit' | 'share_click'

// No-op analytics functions - can be connected to GA4 or other analytics later
export async function trackPageView(postId?: string, metadata?: Record<string, unknown>): Promise<void> {
  // TODO: Implement with Google Analytics or other service
  console.debug('[Analytics] Page view:', { postId, metadata })
}

export async function trackAffiliateClick(
  productId: string,
  postId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  // TODO: Implement with Google Analytics or other service
  console.debug('[Analytics] Affiliate click:', { productId, postId, metadata })
}

export async function trackLeadSubmit(
  postId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  // TODO: Implement with Google Analytics or other service
  console.debug('[Analytics] Lead submit:', { postId, metadata })
}

export async function trackShareClick(
  postId: string,
  platform: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  // TODO: Implement with Google Analytics or other service
  console.debug('[Analytics] Share click:', { postId, platform, metadata })
}
