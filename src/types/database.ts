export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          post_id: string | null
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          post_id?: string | null
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          post_id?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          category: string
          category_display: string | null
          content: string
          created_at: string | null
          date: string
          excerpt: string | null
          id: string
          image_url: string | null
          monetization_strategy: string | null
          original_url: string | null
          published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          category_display?: string | null
          content: string
          created_at?: string | null
          date?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          monetization_strategy?: string | null
          original_url?: string | null
          published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          category_display?: string | null
          content?: string
          created_at?: string | null
          date?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          monetization_strategy?: string | null
          original_url?: string | null
          published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          affiliate_link: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          trigger_tags: string[] | null
          type: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          affiliate_link: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          trigger_tags?: string[] | null
          type: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          affiliate_link?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          trigger_tags?: string[] | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          quiz_answers: Json | null
          treatment_interest: string[] | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          quiz_answers?: Json | null
          treatment_interest?: string[] | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          quiz_answers?: Json | null
          treatment_interest?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type PostCategory = 'Nutrition' | 'Treatment' | 'Success' | 'diagnosis' | 'nutrition' | 'physical' | 'mindset'
export type ProductType = 'Digital' | 'Physical'

export type MonetizationStrategy =
  | 'Affiliate (Products)'
  | 'Low Ticket (Digital Guide)'
  | 'High Ticket (Clinic Lead)'

export type CategorySlug = 'diagnosis' | 'nutrition' | 'physical' | 'mindset' | 'all'

export type AnalyticsEventType = 'page_view' | 'affiliate_click' | 'lead_submit' | 'share_click'

export type Post = Database['public']['Tables']['posts']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type WaitlistEntry = Database['public']['Tables']['waitlist']['Row']
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row']

export interface ExtendedPost extends Post {
  monetization_strategy: MonetizationStrategy
  original_url: string | null
  category_display: string
}

export interface AnalyticsEventInsert {
  event_type: AnalyticsEventType
  post_id?: string | null
  product_id?: string | null
  metadata?: Json
}
