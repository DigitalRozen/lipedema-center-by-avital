import 'server-only';

import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import type { ProcessorOptions } from '@mdx-js/mdx';
import { createElement } from 'react';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

// MDX processor configuration
const config: ProcessorOptions = {
  remarkPlugins: [
    remarkGfm,      // GitHub Flavored Markdown (tables, strikethrough, etc.)
    remarkBreaks,   // Convert line breaks to <br> tags
  ],
  rehypePlugins: [],
};

// Preprocess content to handle plain text posts
function preprocessContent(content: string): string {
  // Split into lines
  const lines = content.split('\n');
  
  // Check if content has any markdown formatting
  const hasMarkdown = lines.some(line => 
    line.startsWith('#') || 
    line.startsWith('##') || 
    line.startsWith('-') || 
    line.startsWith('*') ||
    line.includes('**') ||
    line.includes('[')
  );
  
  // If it already has markdown, return as-is
  if (hasMarkdown) {
    return content;
  }
  
  // For plain text posts, convert to proper paragraphs
  const processed: string[] = [];
  let currentParagraph: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Empty line = end of paragraph
    if (!trimmed) {
      if (currentParagraph.length > 0) {
        processed.push(currentParagraph.join(' '));
        processed.push(''); // Add empty line for spacing
        currentParagraph = [];
      }
      continue;
    }
    
    // Check if line looks like a heading (short, ends with colon or is all caps)
    if (trimmed.length < 50 && (trimmed.endsWith(':') || trimmed === trimmed.toUpperCase())) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        processed.push(currentParagraph.join(' '));
        processed.push('');
        currentParagraph = [];
      }
      // Add as heading
      processed.push(`### ${trimmed.replace(/:$/, '')}`);
      processed.push('');
      continue;
    }
    
    // Check if line starts with emoji (likely a bullet point)
    if (/^[\u{1F300}-\u{1F9FF}]/u.test(trimmed)) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        processed.push(currentParagraph.join(' '));
        processed.push('');
        currentParagraph = [];
      }
      // Add as list item
      processed.push(`- ${trimmed}`);
      continue;
    }
    
    // Regular line - add to current paragraph
    currentParagraph.push(trimmed);
  }
  
  // Flush remaining paragraph
  if (currentParagraph.length > 0) {
    processed.push(currentParagraph.join(' '));
  }
  
  return processed.join('\n');
}

// Process MDX string and return React component
export async function processMdx(content: string) {
  try {
    // Preprocess content to handle plain text posts
    const processedContent = preprocessContent(content);
    
    // @ts-expect-error - MDX types are complex
    const { default: Component } = await evaluate(processedContent, {
      ...runtime,
      ...config,
    });
    
    return Component;
  } catch (error) {
    console.error('Error processing MDX:', error);
    // Return a fallback component that shows the error
    return () => createElement(
      'div',
      { className: 'text-red-600 p-4 border border-red-300 rounded' },
      createElement('p', { className: 'font-bold' }, 'שגיאה בעיבוד התוכן'),
      createElement('p', { className: 'text-sm mt-2' }, error instanceof Error ? error.message : 'Unknown error')
    );
  }
}
