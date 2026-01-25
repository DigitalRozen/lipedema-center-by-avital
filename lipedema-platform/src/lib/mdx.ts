
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'src/content/articles');

export interface Article {
    slug: string;
    title: string;
    date: string;
    description: string;
    category?: string;
    image?: string;
    alt?: string;
    keywords?: string[];
    content: string;
    [key: string]: any;
}

export function getPostSlugs() {
    return fs.readdirSync(articlesDirectory);
}

export function getPostBySlug(slug: string): Article {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = path.join(articlesDirectory, `${realSlug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug: realSlug,
        title: data.title,
        date: data.date,
        description: data.description,
        content,
        ...data,
    };
}

export function getAllPosts(): Article[] {
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug))
        // Sort posts by date in descending order
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return posts;
}
