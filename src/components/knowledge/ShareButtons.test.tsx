import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ShareButtons } from './ShareButtons'
import { useLocale } from '@/lib/i18n/context'
import * as analyticsService from '@/lib/analytics/analyticsService'

// Mock the analytics service
vi.mock('@/lib/analytics/analyticsService', () => ({
  trackShareClick: vi.fn(),
}))

// Mock the i18n context
vi.mock('@/lib/i18n/context', () => ({
  useLocale: vi.fn(),
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

// Mock window.open
global.window.open = vi.fn()

const mockUseLocale = vi.mocked(useLocale)
const mockTrackShareClick = vi.mocked(analyticsService.trackShareClick)

describe('ShareButtons', () => {
  const defaultProps = {
    postId: 'test-post-id',
    title: 'Test Article Title',
    excerpt: 'Test article excerpt',
    url: 'https://example.com/knowledge/test-article',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLocale.mockReturnValue({
      t: {
        share: {
          title: 'שיתוף',
          facebook: 'שיתוף בפייסבוק',
          whatsapp: 'שיתוף בווטסאפ',
          instagram: 'העתקת קישור לאינסטגרם',
          copyLink: 'העתקת קישור',
          linkCopied: 'הקישור הועתק!',
        },
      },
      dir: 'rtl',
      locale: 'he',
    })
  })

  it('renders all share buttons with correct labels', () => {
    render(<ShareButtons {...defaultProps} />)

    expect(screen.getByText('שיתוף:')).toBeInTheDocument()
    expect(screen.getByTitle('שיתוף בפייסבוק')).toBeInTheDocument()
    expect(screen.getByTitle('שיתוף בווטסאפ')).toBeInTheDocument()
    expect(screen.getByTitle('העתקת קישור לאינסטגרם')).toBeInTheDocument()
    expect(screen.getByTitle('העתקת קישור')).toBeInTheDocument()
  })

  it('opens Facebook share URL when Facebook button is clicked', async () => {
    render(<ShareButtons {...defaultProps} />)

    const facebookButton = screen.getByTitle('שיתוף בפייסבוק')
    fireEvent.click(facebookButton)

    await waitFor(() => {
      expect(mockTrackShareClick).toHaveBeenCalledWith(
        'test-post-id',
        'facebook',
        expect.objectContaining({
          url: defaultProps.url,
          title: defaultProps.title,
        })
      )
    })

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('facebook.com/sharer'),
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('opens WhatsApp share URL when WhatsApp button is clicked', async () => {
    render(<ShareButtons {...defaultProps} />)

    const whatsappButton = screen.getByTitle('שיתוף בווטסאפ')
    fireEvent.click(whatsappButton)

    await waitFor(() => {
      expect(mockTrackShareClick).toHaveBeenCalledWith(
        'test-post-id',
        'whatsapp',
        expect.objectContaining({
          url: defaultProps.url,
          title: defaultProps.title,
        })
      )
    })

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('wa.me'),
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('copies link to clipboard when copy button is clicked', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    navigator.clipboard.writeText = mockWriteText

    render(<ShareButtons {...defaultProps} />)

    const copyButton = screen.getByTitle('העתקת קישור')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(defaultProps.url)
      expect(mockTrackShareClick).toHaveBeenCalledWith(
        'test-post-id',
        'copy_link',
        expect.objectContaining({
          url: defaultProps.url,
          title: defaultProps.title,
        })
      )
    })

    // Check that the button shows "copied" state
    expect(screen.getByTitle('הקישור הועתק!')).toBeInTheDocument()
  })

  it('handles Instagram button click (copies link)', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    navigator.clipboard.writeText = mockWriteText

    render(<ShareButtons {...defaultProps} />)

    const instagramButton = screen.getByTitle('העתקת קישור לאינסטגרם')
    fireEvent.click(instagramButton)

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(defaultProps.url)
      expect(mockTrackShareClick).toHaveBeenCalledWith(
        'test-post-id',
        'copy_link',
        expect.objectContaining({
          url: defaultProps.url,
          title: defaultProps.title,
        })
      )
    })
  })

  it('handles analytics tracking errors gracefully', async () => {
    mockTrackShareClick.mockRejectedValue(new Error('Analytics error'))
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(<ShareButtons {...defaultProps} />)

    const facebookButton = screen.getByTitle('שיתוף בפייסבוק')
    fireEvent.click(facebookButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to track share click:',
        expect.any(Error)
      )
    })

    // Should still open the share URL despite analytics error
    expect(window.open).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('handles clipboard API errors gracefully', async () => {
    const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard error'))
    navigator.clipboard.writeText = mockWriteText
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(<ShareButtons {...defaultProps} />)

    const copyButton = screen.getByTitle('העתקת קישור')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to copy link:',
        expect.any(Error)
      )
    })

    consoleSpy.mockRestore()
  })

  it('works without excerpt', () => {
    const propsWithoutExcerpt = { ...defaultProps, excerpt: null }
    render(<ShareButtons {...propsWithoutExcerpt} />)

    expect(screen.getByText('שיתוף:')).toBeInTheDocument()
    expect(screen.getByTitle('שיתוף בפייסבוק')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ShareButtons {...defaultProps} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })
})