import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ClinicCTA } from './ClinicCTA'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
}))

// Mock the i18n context
vi.mock('@/lib/i18n/context', () => ({
  useLocale: () => ({
    t: {
      sidebar: {
        personalSupport: 'רוצה ליווי אישי?',
        personalSupportDesc: 'הצטרפי לרשימת ההמתנה וקבלי גישה ראשונה לטיפולים החדשים בקליניקה'
      },
      cta: {
        button: 'הצטרפי עכשיו'
      }
    },
    dir: 'rtl'
  })
}))

describe('ClinicCTA', () => {
  describe('inline variant', () => {
    it('renders inline CTA with Hebrew text', () => {
      render(<ClinicCTA variant="inline" />)
      
      expect(screen.getByText('התאמת תוכנית טיפול אישית')).toBeInTheDocument()
      expect(screen.getByText(/מוכנה לקבל טיפול מותאם אישית/)).toBeInTheDocument()
      expect(screen.getByText('הצטרפי לרשימת ההמתנה')).toBeInTheDocument()
    })

    it('renders link to clinic page', () => {
      render(<ClinicCTA variant="inline" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/clinic')
    })

    it('includes trust indicators', () => {
      render(<ClinicCTA variant="inline" />)
      
      expect(screen.getByText(/ללא התחייבות/)).toBeInTheDocument()
      expect(screen.getByText(/מענה תוך 24 שעות/)).toBeInTheDocument()
    })

    it('has prominent styling classes', () => {
      const { container } = render(<ClinicCTA variant="inline" />)
      
      const ctaElement = container.firstChild as HTMLElement
      expect(ctaElement).toHaveClass('bg-gradient-to-br', 'from-sage-600', 'to-sage-700')
      expect(ctaElement).toHaveClass('rounded-3xl', 'p-8', 'shadow-xl')
    })
  })

  describe('sidebar variant', () => {
    it('renders sidebar CTA with Hebrew text', () => {
      render(<ClinicCTA variant="sidebar" />)
      
      expect(screen.getByText(/רוצה ליווי אישי/)).toBeInTheDocument()
      expect(screen.getByText(/הצטרפי עכשיו/)).toBeInTheDocument()
    })

    it('has different styling than inline variant', () => {
      const { container } = render(<ClinicCTA variant="sidebar" />)
      
      const ctaElement = container.firstChild as HTMLElement
      expect(ctaElement).toHaveClass('bg-sage-600', 'rounded-2xl', 'p-6')
      expect(ctaElement).not.toHaveClass('bg-gradient-to-br', 'shadow-xl')
    })
  })

  describe('default behavior', () => {
    it('defaults to inline variant when no variant specified', () => {
      render(<ClinicCTA />)
      
      expect(screen.getByText('התאמת תוכנית טיפול אישית')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(<ClinicCTA className="custom-class" />)
      
      const ctaElement = container.firstChild as HTMLElement
      expect(ctaElement).toHaveClass('custom-class')
    })
  })
})