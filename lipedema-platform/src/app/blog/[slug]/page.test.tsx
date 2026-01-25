/**
 * Unit Tests for Blog Article Page
 * 
 * Tests page rendering, 404 handling, RTL layout, and navigation
 * 
 * @module app/blog/[slug]/page.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => {
    return <a href={href} className={className}>{children}</a>;
  },
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    return <img src={src} alt={alt} className={className} />;
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ArrowRight: ({ className }: { className?: string }) => (
    <svg data-testid="arrow-right-icon" className={className} />
  ),
}));

// Mock keystatic functions
const mockGetPostBySlug = vi.fn();
const mockGetAllSlugs = vi.fn();

vi.mock('@/lib/keystatic', () => ({
  getPostBySlug: (...args: unknown[]) => mockGetPostBySlug(...args),
  getAllSlugs: (...args: unknown[]) => mockGetAllSlugs(...args),
  categoryLabels: {
    diagnosis: 'אבחון',
    nutrition: 'תזונה',
    physical: 'טיפול פיזי',
    mindset: 'מיינדסט',
  },
}));

// Mock blog utils
vi.mock('@/lib/blog/utils', () => ({
  calculateReadingTime: vi.fn(() => 5),
  getFallbackImage: vi.fn((category: string) => `/assets/generated/${category}_fallback.png`),
}));

// Import the page component after mocks are set up
import BlogPostPage from './page';

describe('BlogPostPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test 404 renders for invalid slug
   * Validates: Requirements 5.3
   */
  describe('404 handling', () => {
    it('calls notFound() when post does not exist', async () => {
      mockGetPostBySlug.mockResolvedValue(null);

      await expect(
        BlogPostPage({ params: Promise.resolve({ slug: 'non-existent-post' }) })
      ).rejects.toThrow('NEXT_NOT_FOUND');

      expect(mockGetPostBySlug).toHaveBeenCalledWith('non-existent-post');
    });

    it('calls notFound() for empty slug', async () => {
      mockGetPostBySlug.mockResolvedValue(null);

      await expect(
        BlogPostPage({ params: Promise.resolve({ slug: '' }) })
      ).rejects.toThrow('NEXT_NOT_FOUND');
    });
  });

  /**
   * Test RTL direction is applied
   * Validates: Requirements 1.2
   */
  describe('RTL layout', () => {
    const mockPost = {
      slug: 'test-post',
      title: 'כותרת בדיקה',
      date: '2024-01-15',
      description: 'תיאור בדיקה',
      image: '/images/test.jpg',
      category: 'nutrition' as const,
      tags: ['tag1', 'tag2'],
      originalPostId: '123',
      content: 'תוכן המאמר',
    };

    it('applies RTL direction to main container', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);

      const page = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) });
      const { container } = render(page);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveAttribute('dir', 'rtl');
    });

    it('renders Hebrew content correctly', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);

      const page = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) });
      render(page);

      expect(screen.getByText('כותרת בדיקה')).toBeInTheDocument();
    });
  });

  /**
   * Test back navigation link exists
   * Validates: Requirements 7.5
   */
  describe('back navigation', () => {
    const mockPost = {
      slug: 'test-post',
      title: 'כותרת בדיקה',
      date: '2024-01-15',
      description: 'תיאור בדיקה',
      image: '/images/test.jpg',
      category: 'nutrition' as const,
      tags: ['tag1', 'tag2'],
      originalPostId: '123',
      content: 'תוכן המאמר',
    };

    it('renders back navigation link to blog listing', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);

      const page = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) });
      render(page);

      const backLink = screen.getByRole('link', { name: /חזרה לבלוג/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/blog');
    });

    it('includes RTL arrow icon in back link', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);

      const page = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) });
      render(page);

      const arrowIcon = screen.getByTestId('arrow-right-icon');
      expect(arrowIcon).toBeInTheDocument();
    });

    it('back link has proper styling classes', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);

      const page = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) });
      render(page);

      const backLink = screen.getByRole('link', { name: /חזרה לבלוג/i });
      expect(backLink).toHaveClass('inline-flex', 'items-center');
    });
  });

  /**
   * Additional rendering tests
   */
  describe('page rendering', () => {
    const mockPost = {
      slug: 'test-post',
      title: 'כותרת בדיקה',
      date: '2024-01-15',
      description: 'תיאור בדיקה',
      image: '/images/test.jpg',
      category: 'nutrition' as const,
      tags: ['tag1', 'tag2'],
      originalPostId: '123',
      content: 'תוכן המאמר',
    };

    it('renders category badge with Hebrew label', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);

      const page = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) });
      render(page);

      expect(screen.getByText('תזונה')).toBeInTheDocument();
    });

    it('renders reading time in Hebrew', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);

      const page = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) });
      render(page);

      expect(screen.getByText(/דקות קריאה/)).toBeInTheDocument();
    });

    it('renders featured image when provided', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);

      const page = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) });
      render(page);

      const image = screen.getByRole('img', { name: 'כותרת בדיקה' });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/test.jpg');
    });

    it('uses fallback image when no featured image provided', async () => {
      const postWithoutImage = { ...mockPost, image: null };
      mockGetPostBySlug.mockResolvedValue(postWithoutImage);

      const page = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) });
      render(page);

      const image = screen.getByRole('img', { name: 'כותרת בדיקה' });
      expect(image).toHaveAttribute('src', '/assets/generated/nutrition_fallback.png');
    });

    it('has cream background color', async () => {
      mockGetPostBySlug.mockResolvedValue(mockPost);

      const page = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) });
      const { container } = render(page);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('bg-[#FAFAF5]');
    });
  });
});
