import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'פלטפורמת הליפאדמה של אביטל'
    const category = searchParams.get('category') || ''
    const excerpt = searchParams.get('excerpt') || ''

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fdf2f8',
            backgroundImage: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            direction: 'rtl',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#059669',
                backgroundColor: '#d1fae5',
                padding: '12px 24px',
                borderRadius: '50px',
              }}
            >
              פלטפורמת הליפאדמה של אביטל
            </div>
          </div>

          {/* Category Badge */}
          {category && (
            <div
              style={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: '#f3f4f6',
                padding: '8px 16px',
                borderRadius: '20px',
                marginBottom: '20px',
              }}
            >
              {category}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#1f2937',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: '1.2',
              marginBottom: '20px',
            }}
          >
            {title}
          </div>

          {/* Excerpt */}
          {excerpt && (
            <div
              style={{
                fontSize: '24px',
                color: '#6b7280',
                textAlign: 'center',
                maxWidth: '800px',
                lineHeight: '1.4',
              }}
            >
              {excerpt.length > 120 ? excerpt.substring(0, 120) + '...' : excerpt}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '20px',
              color: '#9ca3af',
            }}
          >
            מאמר מקצועי על ליפאדמה • אביטל רוזן ND
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}