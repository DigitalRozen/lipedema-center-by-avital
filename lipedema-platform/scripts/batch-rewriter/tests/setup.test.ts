import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

describe('Dependencies Setup Verification', () => {
  it('should have vitest working correctly', () => {
    expect(true).toBe(true)
  })

  it('should have fast-check working correctly', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n === n
      })
    )
  })

  it('should be able to import gray-matter', async () => {
    const matter = await import('gray-matter')
    expect(matter.default).toBeDefined()
  })

  it('should be able to import openai', async () => {
    const { OpenAI } = await import('openai')
    expect(OpenAI).toBeDefined()
  })
})
