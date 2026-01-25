const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../content/posts');

console.log('🔧 Standardizing frontmatter for all posts...\n');

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));

let updatedCount = 0;

files.forEach(filename => {
  const filePath = path.join(POSTS_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract frontmatter and body
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    console.log(`⚠️  No frontmatter found in: ${filename}`);
    return;
  }
  
  const frontmatter = frontmatterMatch[1];
  const body = frontmatterMatch[2];
  
  // Parse frontmatter
  const lines = frontmatter.split('\n');
  const fields = {};
  let currentKey = null;
  let currentArray = [];
  
  lines.forEach(line => {
    if (line.match(/^[a-zA-Z]+:/)) {
      // Save previous array if exists
      if (currentKey && currentArray.length > 0) {
        fields[currentKey] = currentArray;
        currentArray = [];
      }
      
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      currentKey = key.trim();
      
      if (value.startsWith('[') || line.endsWith(':')) {
        // It's an array or empty
        currentArray = [];
      } else {
        fields[currentKey] = value.replace(/^["']|["']$/g, '');
      }
    } else if (line.trim().startsWith('-')) {
      // Array item
      currentArray.push(line.trim().substring(1).trim());
    }
  });
  
  // Save last array if exists
  if (currentKey && currentArray.length > 0) {
    fields[currentKey] = currentArray;
  }
  
  // Standardize fields
  const slug = filename.replace('.mdx', '');
  
  // Use description if exists, otherwise use excerpt
  const description = fields.description || fields.excerpt || '';
  
  // Remove slug and excerpt fields, keep only description
  delete fields.slug;
  delete fields.excerpt;
  fields.description = description;
  
  // Ensure alt field exists
  if (!fields.alt) {
    fields.alt = fields.title || slug;
  }
  
  // Ensure originalPostId exists
  if (!fields.originalPostId) {
    fields.originalPostId = '';
  }
  
  // Build new frontmatter
  let newFrontmatter = '---\n';
  newFrontmatter += `title: "${fields.title}"\n`;
  newFrontmatter += `date: ${fields.date}\n`;
  newFrontmatter += `description: "${description}"\n`;
  
  // Handle image field
  const imagePath = fields.image && fields.image !== 'undefined' 
    ? fields.image 
    : fields.coverImage || `/images/blog/${slug}.jpg`;
  newFrontmatter += `image: ${imagePath}\n`;
  
  newFrontmatter += `alt: "${fields.alt}"\n`;
  newFrontmatter += `category: ${fields.category}\n`;
  
  // Tags array
  if (Array.isArray(fields.tags)) {
    newFrontmatter += `tags:\n`;
    fields.tags.forEach(tag => {
      newFrontmatter += `  - ${tag}\n`;
    });
  } else {
    newFrontmatter += `tags:\n  - ליפאדמה\n  - טיפול\n  - בריאות\n`;
  }
  
  // Keywords array
  if (Array.isArray(fields.keywords)) {
    newFrontmatter += `keywords:\n`;
    fields.keywords.forEach(keyword => {
      newFrontmatter += `  - ${keyword}\n`;
    });
  } else {
    newFrontmatter += `keywords:\n  - ליפאדמה\n  - "${fields.title}"\n`;
  }
  
  newFrontmatter += `originalPostId: "${fields.originalPostId}"\n`;
  newFrontmatter += '---\n';
  
  // Write back
  const newContent = newFrontmatter + body;
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  console.log(`✅ Standardized: ${filename}`);
  updatedCount++;
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Successfully standardized: ${updatedCount} files`);
console.log('='.repeat(60));
console.log('\n✨ All frontmatter is now consistent!\n');

