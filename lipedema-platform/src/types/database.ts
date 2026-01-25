/**
 * Database Types - Keystatic Compatible
 * 
 * Core types used throughout the app for content and products.
 */

export type PostCategory = 'diagnosis' | 'nutrition' | 'physical' | 'mindset'
export type ProductType = 'Digital' | 'Physical'
export type CategorySlug = 'diagnosis' | 'nutrition' | 'physical' | 'mindset' | 'all'

export type MonetizationStrategy =
  | 'Affiliate (Products)'
  | 'Low Ticket (Digital Guide)'
  | 'High Ticket (Clinic Lead)'

// Post type compatible with Keystatic
export interface Post {
  id: string
  slug: string
  title: string
  content: string
  excerpt?: string | null
  category: string
  category_display?: string | null
  date: string
  image_url?: string | null
  tags?: string[] | null
  published?: boolean | null
  original_url?: string | null
  updated_at?: string | null
  created_at?: string | null
}

// Product type for affiliate products
export interface Product {
  id: string
  name: string
  description?: string | null
  price: number
  affiliate_link: string
  image_url?: string | null
  type: ProductType
  trigger_tags?: string[] | null
  active?: boolean | null
}
