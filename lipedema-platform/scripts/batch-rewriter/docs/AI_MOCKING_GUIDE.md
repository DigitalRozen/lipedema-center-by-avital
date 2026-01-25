# AI API Mocking Guide

## Overview

The batch article rewriter includes comprehensive AI API mocking capabilities for deterministic, fast, and reliable testing without external API dependencies.

## Why Mock the AI API?

1. **Deterministic Tests**: Same input always produces same output
2. **Fast Execution**: No network latency or API rate limits
3. **Cost Effective**: No API usage charges during testing
4. **Offline Development**: Work without internet connection
5. **Error Simulation**: Test error handling without triggering real failures

## Available Mock Implementations

### 1. MockAIGenerator

The standard mock for most testing scenarios. Provides deterministic, valid Hebrew content.

```typescript
import { MockAIGenerator } from '../src/ai-generator-mock'

const mock = new MockAIGenerator()

// Generate deterministic title
const title = await mock.generateTitle('', '', 'nutrition')
// Returns: "תזונה נכונה לטיפול בליפאדמה"

// Generate complete article content
const content = await mock.generateContent(600, 'nutrition')
// Returns: Content with all 5 sections, Q&A, and internal links

// Generate description
const description = await mock.generateDescription('content')
// Returns: 150-160 character Hebrew description

// Generate keywords
const keywords = await mock.generateKeywords('', 'nutrition')
// Returns: ['ליפאדמה', 'תזונה', 'דיאטה', ...]

// Generate Q&A pairs
const qa = await mock.generateQA('', 3)
// Returns: 3 question-answer pairs
```

**Features:**
- Category-specific responses (nutrition, diagnosis, physical, mindset)
- All content in Hebrew with proper structure
- Tracks call count for verification
- Deterministic across multiple calls

**Use Cases:**
- Unit tests for content processing
- Integration tests for workflow
- Property-based tests for validation
- Performance benchmarks

### 2. ConfigurableMockAIGenerator

Customizable mock for testing specific scenarios and edge cases.

```typescript
import { ConfigurableMockAIGenerator } from '../src/ai-generator-mock'

const mock = new ConfigurableMockAIGenerator()

// Configure custom responses
mock.configure({
  title: 'כותרת מותאמת אישית',
  content: '## Hook\n\nתוכן מיוחד...',
  keywords: ['מילה1', 'מילה2', 'מילה3'],
  qa: [
    { question: 'שאלה?', answer: 'תשובה' }
  ]
})

// Use configured responses
const title = await mock.generateTitle('', '', 'nutrition')
// Returns: "כותרת מותאמת אישית"
```

**Features:**
- Full control over responses
- Partial configuration (only override what you need)
- Test edge cases and boundary conditions
- Simulate specific content patterns

**Use Cases:**
- Testing validation logic with invalid content
- Testing edge cases (empty content, very long content)
- Testing specific content patterns
- Regression tests for known issues

### 3. FailingMockAIGenerator

Simulates API failures for error handling tests.

```typescript
import { FailingMockAIGenerator } from '../src/ai-generator-mock'

// Simulate timeout
const timeoutMock = new FailingMockAIGenerator('timeout')
await timeoutMock.generateTitle('', '', 'nutrition')
// Throws: Error('Request timeout after 30 seconds')

// Simulate rate limit
const rateLimitMock = new FailingMockAIGenerator('rate-limit')
await rateLimitMock.generateTitle('', '', 'nutrition')
// Throws: Error('Rate limit exceeded. Please try again later.')

// Simulate authentication failure
const authMock = new FailingMockAIGenerator('auth')
await authMock.generateTitle('', '', 'nutrition')
// Throws: Error('Authentication failed. Invalid API key.')

// Simulate invalid response
const invalidMock = new FailingMockAIGenerator('invalid-response')
await invalidMock.generateTitle('', '', 'nutrition')
// Throws: Error('Invalid response format from API')
```

**Features:**
- Simulates common API failure modes
- Includes error codes for specific handling
- Consistent error behavior across all methods
- Tests retry logic and error recovery

**Use Cases:**
- Testing error handling and recovery
- Testing retry logic with exponential backoff
- Testing graceful degradation
- Testing error logging and reporting

## Integration with Tests

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest'
import { MockAIGenerator } from '../src/ai-generator-mock'
import { ContentGenerator } from '../src/content-generator'

describe('Content Generator', () => {
  it('should generate valid article', async () => {
    const mock = new MockAIGenerator()
    const content = await mock.generateContent(600, 'nutrition')
    
    // Verify structure
    expect(content).toContain('Hook')
    expect(content).toContain('Empathy')
    expect(content).toContain('Science')
    expect(content).toContain('Protocol')
    expect(content).toContain('Bridge')
  })
})
```

### Property-Based Tests

```typescript
import fc from 'fast-check'
import { MockAIGenerator } from '../src/ai-generator-mock'

describe('Property Tests', () => {
  it('should always generate valid Hebrew titles', () => {
    fc.assert(
      fc.asyncProperty(
        fc.constantFrom('nutrition', 'diagnosis', 'physical', 'mindset'),
        async (category) => {
          const mock = new MockAIGenerator()
          const title = await mock.generateTitle('', '', category)
          
          // Should only contain Hebrew characters
          const hebrewRegex = /^[\u0590-\u05FF\s]+$/
          expect(hebrewRegex.test(title)).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

### Integration Tests

```typescript
import { MockAIGenerator } from '../src/ai-generator-mock'
import { ArticleRewriter } from '../src/rewriter'

describe('Integration Tests', () => {
  it('should rewrite article end-to-end', async () => {
    const mock = new MockAIGenerator()
    const rewriter = new ArticleRewriter(mock)
    
    const article = { /* ... */ }
    const rewritten = await rewriter.rewriteArticle(article, config)
    
    expect(rewritten.wordCount).toBeGreaterThanOrEqual(600)
    expect(mock.getCallCount()).toBeGreaterThan(0)
  })
})
```

## Best Practices

### 1. Use MockAIGenerator by Default

For most tests, the standard mock provides everything you need:

```typescript
const mock = new MockAIGenerator()
```

### 2. Use ConfigurableMockAIGenerator for Edge Cases

When testing specific scenarios:

```typescript
const mock = new ConfigurableMockAIGenerator()
mock.configure({ 
  content: '## Only One Section' // Test validation failure
})
```

### 3. Use FailingMockAIGenerator for Error Handling

When testing error recovery:

```typescript
const mock = new FailingMockAIGenerator('rate-limit')
// Test retry logic
```

### 4. Verify Call Counts

Track that AI methods are called correctly:

```typescript
const mock = new MockAIGenerator()
await processArticle(mock)
expect(mock.getCallCount()).toBe(5) // title, content, description, keywords, qa
```

### 5. Reset State Between Tests

```typescript
beforeEach(() => {
  mock.resetCallCount()
})
```

## Performance Characteristics

### MockAIGenerator Performance

- **Speed**: < 1ms per call (no network)
- **Memory**: Minimal (no caching)
- **Reliability**: 100% success rate
- **Determinism**: Same input → same output

### Comparison with Real API

| Metric | Real API | Mock API |
|--------|----------|----------|
| Latency | 1-5 seconds | < 1ms |
| Cost | $0.01-0.10 per call | $0 |
| Rate Limit | 60 calls/min | Unlimited |
| Reliability | 99.9% | 100% |
| Determinism | No | Yes |

## Common Patterns

### Pattern 1: Test Content Structure

```typescript
const mock = new MockAIGenerator()
const content = await mock.generateContent(600, 'nutrition')

// Verify all sections present
const sections = ['Hook', 'Empathy', 'Science', 'Protocol', 'Bridge']
for (const section of sections) {
  expect(content).toContain(section)
}
```

### Pattern 2: Test Validation Logic

```typescript
const mock = new ConfigurableMockAIGenerator()
mock.configure({ 
  content: 'Too short' // Only 2 words
})

const content = await mock.generateContent(600, 'nutrition')
const validation = validator.validate(content)

expect(validation.isValid).toBe(false)
expect(validation.errors).toContainEqual({
  field: 'wordCount',
  message: expect.stringContaining('below minimum')
})
```

### Pattern 3: Test Error Recovery

```typescript
const failingMock = new FailingMockAIGenerator('rate-limit')
const fallbackMock = new MockAIGenerator()

try {
  await failingMock.generateTitle('', '', 'nutrition')
} catch (error) {
  // Fallback to working mock
  const title = await fallbackMock.generateTitle('', '', 'nutrition')
  expect(title).toBeTruthy()
}
```

### Pattern 4: Test Retry Logic

```typescript
let attempts = 0
const mock = new FailingMockAIGenerator('timeout')

async function generateWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    attempts++
    try {
      return await mock.generateTitle('', '', 'nutrition')
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await sleep(100 * Math.pow(2, i)) // Exponential backoff
    }
  }
}

await expect(generateWithRetry()).rejects.toThrow()
expect(attempts).toBe(3)
```

## Troubleshooting

### Issue: Tests are slow

**Solution**: Make sure you're using mocks, not real API:

```typescript
// ❌ Slow - uses real API
const generator = new OpenAIGenerator(apiKey)

// ✅ Fast - uses mock
const generator = new MockAIGenerator()
```

### Issue: Tests are flaky

**Solution**: Ensure deterministic behavior:

```typescript
// ❌ Flaky - random behavior
const content = generateRandomContent()

// ✅ Deterministic - same every time
const mock = new MockAIGenerator()
const content = await mock.generateContent(600, 'nutrition')
```

### Issue: Can't test error cases

**Solution**: Use FailingMockAIGenerator:

```typescript
// ✅ Test error handling
const mock = new FailingMockAIGenerator('rate-limit')
await expect(mock.generateTitle()).rejects.toThrow('Rate limit')
```

## Migration Guide

### From Real API to Mock

**Before:**
```typescript
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: prompt }]
})
```

**After:**
```typescript
import { MockAIGenerator } from '../src/ai-generator-mock'

const mock = new MockAIGenerator()
const title = await mock.generateTitle(originalTitle, content, category)
```

### Benefits of Migration

1. **10-100x faster tests**
2. **No API costs during testing**
3. **Deterministic test results**
4. **Offline development**
5. **No rate limiting**

## Future Enhancements

Potential improvements to the mocking system:

1. **Configurable word counts**: Generate content with exact word counts
2. **Template-based generation**: Use templates for more realistic content
3. **Multilingual support**: Add English content generation
4. **Performance profiling**: Track and optimize mock performance
5. **Snapshot testing**: Save and compare generated content

## Conclusion

The AI API mocking system provides a robust, fast, and reliable way to test the batch article rewriter without external dependencies. Use the appropriate mock for your testing needs:

- **MockAIGenerator**: Standard testing
- **ConfigurableMockAIGenerator**: Edge cases and custom scenarios
- **FailingMockAIGenerator**: Error handling and recovery

All mocks implement the same `AIGeneratorInterface`, making them drop-in replacements for the real API.

