#!/usr/bin/env node

/**
 * Clean AI Hyphens Script
 * 
 * Removes robotic hyphen patterns from Hebrew content:
 * - "תזונה - המדריך" → "תזונה, המדריך"
 * - Preserves English hyphens (anti-inflammatory)
 * - Preserves markdown list bullets
 * - Preserves slug fields
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../content/posts');

// Hebrew Unicode ranges
const HEBREW_CHAR = '[\\u0590-\\u05FF]';
const HEBREW_WORD = `${HEBREW_CHAR}+`;

/**
 * Check if a string contains Hebrew characters
 */
function containsHebrew(text) {
  return /[\u0590-\u05FF]/.test(text);
}

/**
 * Process frontmatter and body separately
 */
function processMDXFile(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    console.warn('  ⚠️  No frontmatter found, processing entire file');
    return processBody(content);
  }

  const [, frontmatter, body] = frontmatterMatch;
  
  const processedFrontmatter = processFrontmatter(frontmatter);
  const processedBody = processBody(body);
  
  return `---\n${processedFrontmatter}\n---\n${processedBody}`;
}

/**
 * Process frontmatter (title, description, etc.)
 * SKIP slug field entirely
 */
function processFrontmatter(frontmatter) {
  const lines = frontmatter.split('\n');
  
  return lines.map(line => {
    // Skip slug lines completely
    if (line.trim().startsWith('slug:')) {
      return line;
    }
    
    // Process title and description fields
    if (line.includes('title:') || line.includes('description:')) {
      return processHebrewHyphens(line);
    }
    
    return line;
  }).join('\n');
}

/**
 * Process body content
 * Skip markdown list bullets (lines starting with "- ")
 */
function processBody(body) {
  const lines = body.split('\n');
  
  return lines.map(line => {
    // Skip markdown list bullets
    if (/^\s*-\s/.test(line)) {
      return line;
    }
    
    // Process the rest
    return processHebrewHyphens(line);
  }).join('\n');
}

/**
 * Replace Hebrew hyphen patterns with commas
 */
function processHebrewHyphens(text) {
  let processed = text;
  let changeCount = 0;
  
  // Pattern 1: Space-Hyphen-Space between Hebrew words
  // "תזונה - המדריך" → "תזונה, המדריך"
  const pattern1 = new RegExp(`(${HEBREW_WORD})\\s+-\\s+(${HEBREW_WORD})`, 'g');
  processed = processed.replace(pattern1, (match, before, after) => {
    // Double-check both sides are Hebrew
    if (containsHebrew(before) && containsHebrew(after)) {
      changeCount++;
      return `${before}, ${after}`;
    }
    return match;
  });
  
  // Pattern 2: Hyphen without spaces between Hebrew words (less common)
  // "תזונה-המדריך" → "תזונה, המדריך"
  const pattern2 = new RegExp(`(${HEBREW_WORD})-(${HEBREW_WORD})`, 'g');
  processed = processed.replace(pattern2, (match, before, after) => {
    // Double-check both sides are Hebrew
    if (containsHebrew(before) && containsHebrew(after)) {
      changeCount++;
      return `${before}, ${after}`;
    }
    return match;
  });
  
  return processed;
}

/**
 * Process a single MDX file
 */
function processFile(filePath) {
  const fileName = path.basename(filePath);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    const processed = processMDXFile(content);
    
    // Count actual changes
    const changes = (originalContent.match(/[\u0590-\u05FF]+\s+-\s+[\u0590-\u05FF]+/g) || []).length +
                    (originalContent.match(/[\u0590-\u05FF]+-[\u0590-\u05FF]+/g) || []).length;
    
    if (changes > 0) {
      fs.writeFileSync(filePath, processed, 'utf8');
      console.log(`  ✅ ${fileName}: ${changes} hyphen(s) replaced with commas`);
      return changes;
    } else {
      console.log(`  ⚪ ${fileName}: No AI hyphens found`);
      return 0;
    }
    
  } catch (error) {
    console.error(`  ❌ ${fileName}: Error - ${error.message}`);
    return 0;
  }
}

/**
 * Main execution
 */
function main() {
  console.log('\n🧹 Cleaning AI Hyphens from Hebrew Content\n');
  console.log('📂 Scanning:', POSTS_DIR);
  console.log('');
  
  if (!fs.existsSync(POSTS_DIR)) {
    console.error('❌ Posts directory not found:', POSTS_DIR);
    process.exit(1);
  }
  
  const files = fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(POSTS_DIR, file));
  
  console.log(`📄 Found ${files.length} MDX files\n`);
  
  let totalChanges = 0;
  
  files.forEach(file => {
    totalChanges += processFile(file);
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`✨ Complete! ${totalChanges} total hyphen(s) humanized`);
  console.log('='.repeat(50) + '\n');
}

// Run the script
main();
