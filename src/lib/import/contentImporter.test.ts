import { describe, it, expect } from 'vitest'
import { parseInstagramExport, generateSlug } from './contentImporter'

describe('Content Importer', () => {
  describe('parseInstagramExport', () => {
    it('should parse valid Instagram export JSON', () => {
      const validJson = JSON.stringify([
        {
          id: "123",
          title: "Test Post",
          content: "Test content",
          image_url: "https://example.com/image.jpg",
          date: "2025-01-01T00:00:00.000Z",
          likes: 10,
          category_slug: "nutrition",
          category_display: "תזונה ונוטריציה",
          monetization_strategy: "Low Ticket (Digital Guide)",
          original_url: "https://instagram.com/p/test"
        }
      ])

      const result = parseInstagramExport(validJson)
      expect(result).toHaveLength(1)
      expect(result![0].id).toBe("123")
      expect(result![0].title).toBe("Test Post")
    })

    it('should return null for invalid JSON', () => {
      const invalidJson = "invalid json"
      const result = parseInstagramExport(invalidJson)
      expect(result).toBeNull()
    })

    it('should return null for non-array JSON', () => {
      const nonArrayJson = JSON.stringify({ not: "array" })
      const result = parseInstagramExport(nonArrayJson)
      expect(result).toBeNull()
    })

    it('should filter out invalid posts', () => {
      const mixedJson = JSON.stringify([
        {
          id: "123",
          title: "Valid Post",
          content: "Test content",
          image_url: "https://example.com/image.jpg",
          date: "2025-01-01T00:00:00.000Z",
          likes: 10,
          category_slug: "nutrition",
          category_display: "תזונה ונוטריציה",
          monetization_strategy: "Low Ticket (Digital Guide)",
          original_url: "https://instagram.com/p/test"
        },
        {
          id: "456",
          // Missing required fields
          title: "Invalid Post"
        }
      ])

      const result = parseInstagramExport(mixedJson)
      expect(result).toHaveLength(1)
      expect(result![0].id).toBe("123")
    })

    it('should validate category_slug values', () => {
      const invalidCategoryJson = JSON.stringify([
        {
          id: "123",
          title: "Test Post",
          content: "Test content",
          image_url: "https://example.com/image.jpg",
          date: "2025-01-01T00:00:00.000Z",
          likes: 10,
          category_slug: "invalid_category",
          category_display: "Invalid Category",
          monetization_strategy: "Low Ticket (Digital Guide)",
          original_url: "https://instagram.com/p/test"
        }
      ])

      const result = parseInstagramExport(invalidCategoryJson)
      expect(result).toBeNull()
    })

    it('should validate monetization_strategy values', () => {
      const invalidStrategyJson = JSON.stringify([
        {
          id: "123",
          title: "Test Post",
          content: "Test content",
          image_url: "https://example.com/image.jpg",
          date: "2025-01-01T00:00:00.000Z",
          likes: 10,
          category_slug: "nutrition",
          category_display: "תזונה ונוטריציה",
          monetization_strategy: "Invalid Strategy",
          original_url: "https://instagram.com/p/test"
        }
      ])

      const result = parseInstagramExport(invalidStrategyJson)
      expect(result).toBeNull()
    })
  })

  describe('generateSlug', () => {
    it('should generate slug from Hebrew title', () => {
      const hebrewTitle = "מה זה ליפאדמה?"
      const slug = generateSlug(hebrewTitle)
      expect(slug).toBe("mah-mah")
    })

    it('should handle mixed Hebrew and English', () => {
      const mixedTitle = "תזונה healthy eating"
      const slug = generateSlug(mixedTitle)
      expect(slug).toBe("tezuna-healthy-eating")
    })

    it('should remove HTML tags', () => {
      const htmlTitle = "<p>מתכון בריא</p>"
      const slug = generateSlug(htmlTitle)
      expect(slug).toBe("matakon")
    })

    it('should handle empty or very short titles', () => {
      const emptyTitle = ""
      const slug = generateSlug(emptyTitle)
      expect(slug).toMatch(/^hebrew-post-\d+$/)
    })

    it('should handle titles with only punctuation', () => {
      const punctuationTitle = "!@#$%"
      const slug = generateSlug(punctuationTitle)
      expect(slug).toMatch(/^hebrew-post-\d+$/)
    })

    it('should truncate long titles', () => {
      const longTitle = "א".repeat(100) + " test"
      const slug = generateSlug(longTitle)
      expect(slug.length).toBeLessThan(100)
    })

    it('should handle common Hebrew words correctly', () => {
      const commonWords = "איך לטפל בליפאדמה עם תזונה נכונה"
      const slug = generateSlug(commonWords)
      expect(slug).toBe("eich-mah-tezuna")
    })
  })
})