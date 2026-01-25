import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { categoryLabels } from './blog/categories';

// Create a reader instance for accessing Keystatic content
export const reader = createReader(process.cwd(), keystaticConfig);

// Re-export categoryLabels for backward compatibility
export { categoryLabels };

// Type definitions for posts
export interface KeystaticPost {
  slug: string;
  title: string;
  date: string | null;
  description: string;
  image: string | null;
  category: 'diagnosis' | 'nutrition' | 'physical' | 'mindset';
  tags: readonly string[];
  originalPostId: string;
}

export interface KeystaticArticle {
  slug: string;
  title: string;
  date: string | null;
  description: string;
  image: string | null;
  alt: string;
  category: 'diagnosis' | 'nutrition' | 'physical' | 'mindset';
  keywords: readonly string[];
  originalPostId: string;
}

// Helper to get all posts sorted by date (from posts collection)
export async function getAllPosts() {
  try {
    const allPosts = await reader.collections.posts.list();
    
    const mappedPosts = await Promise.all(
      allPosts.map(async (slug) => {
        try {
          const post = await reader.collections.posts.read(slug);
          if (!post) return null;
          
          return {
            slug,
            title: post.title,
            date: post.date,
            description: post.description,
            image: post.image,
            category: post.category,
            tags: post.tags || [],
            originalPostId: post.originalPostId,
          };
        } catch (err) {
          console.warn(`Skipping invalid post: ${slug}`, err);
          return null;
        }
      })
    );

    const validPosts = mappedPosts.filter((post): post is NonNullable<typeof post> => post !== null);

    return validPosts.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Helper to get latest N posts
export async function getLatestPosts(limit: number = 3) {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

// Helper to get a single post by slug (checks both collections)
export async function getPostBySlug(slug: string) {
  // Try posts collection first
  try {
    const post = await reader.collections.posts.read(slug);
    if (post) {
      // Read the MDX file directly
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.mdx`);
      
      let contentString = '';
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        // Extract content after frontmatter
        const parts = fileContent.split('---');
        contentString = parts.length >= 3 ? parts.slice(2).join('---').trim() : fileContent;
      } catch (err) {
        console.error('Error reading MDX file:', err);
        contentString = '';
      }
      
      return {
        slug,
        title: post.title,
        date: post.date,
        description: post.description,
        image: post.image,
        category: post.category,
        tags: post.tags || [],
        originalPostId: post.originalPostId,
        content: contentString,
      };
    }
  } catch (error) {
    console.error('Post not found:', slug);
  }

  return null;
}

// Helper to get posts by category
export async function getPostsByCategory(category: string) {
  const posts = await getAllPosts();
  return posts.filter((post) => post.category === category);
}

// Get all slugs for static generation
export async function getAllSlugs() {
  const postSlugs = await reader.collections.posts.list();
  return postSlugs;
}
