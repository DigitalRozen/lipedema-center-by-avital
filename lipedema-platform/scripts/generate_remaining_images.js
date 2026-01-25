import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Revised prompts for the 3 blocked images
const articles = [
  {
    slug: 'lipedema-and-pregnancy',
    prompt: 'Wellness photography showing a yoga ball in a bright, peaceful room with soft natural lighting. A water bottle and comfortable cushions nearby. Focus on prenatal wellness and comfort. Rose gold and white color palette. No people. No text.'
  },
  {
    slug: 'lipedema-intimacy-relationships',
    prompt: 'Lifestyle photography of two coffee cups on a cozy couch with soft blankets. Warm, intimate home setting with gentle lighting. Focus on connection and support. Soft pastel tones. No people visible. No text.'
  },
  {
    slug: 'self-manual-lymphatic-drainage',
    prompt: 'Spa wellness still life: massage oil bottle, soft towels, and gentle candles on a clean surface. Peaceful self-care atmosphere. Focus on wellness tools and relaxation. Soft lighting. No people. No text.'
  }
];

const OUTPUT_DIR = path.join(__dirname, '../public/images/blog');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateImage(slug, prompt) {
  const outputPath = path.join(OUTPUT_DIR, `${slug}.jpg`);
  
  // Check if image already exists
  if (fs.existsSync(outputPath)) {
    console.log(`✓ Image already exists: ${slug}.jpg`);
    return { slug, status: 'exists', path: outputPath };
  }

  try {
    console.log(`\n🎨 Generating image for: ${slug}`);
    console.log(`📝 Prompt: ${prompt.substring(0, 80)}...`);

    // Generate image with DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
      style: 'natural'
    });

    const imageUrl = response.data[0].url;
    console.log(`📥 Downloading image...`);

    // Download the image
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    // Save to file
    fs.writeFileSync(outputPath, imageResponse.data);
    console.log(`✅ Saved: ${slug}.jpg`);

    return { slug, status: 'generated', path: outputPath };
  } catch (error) {
    console.error(`❌ Error generating ${slug}:`, error.message);
    return { slug, status: 'error', error: error.message };
  }
}

async function generateBatch() {
  console.log('🚀 Generating Remaining 3 Images (Revised Prompts)');
  console.log('=' .repeat(60));

  const results = [];

  for (const article of articles) {
    const result = await generateImage(article.slug, article.prompt);
    results.push(result);
    
    // Add delay between requests to avoid rate limits
    if (result.status === 'generated') {
      console.log('⏳ Waiting 5 seconds before next generation...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(60));
  
  const generated = results.filter(r => r.status === 'generated').length;
  const existing = results.filter(r => r.status === 'exists').length;
  const errors = results.filter(r => r.status === 'error').length;

  console.log(`✅ Generated: ${generated}`);
  console.log(`✓  Already existed: ${existing}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);

  if (errors > 0) {
    console.log('\n❌ Failed images:');
    results.filter(r => r.status === 'error').forEach(r => {
      console.log(`   - ${r.slug}: ${r.error}`);
    });
  }

  console.log('\n✨ Generation complete!');
}

// Run the script
generateBatch().catch(console.error);
