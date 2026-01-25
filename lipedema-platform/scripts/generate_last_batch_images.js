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

// The final batch of 6 articles
const articles = [
  {
    slug: 'lipedema-and-pregnancy',
    prompt: 'A pregnant woman sitting comfortably on a yoga ball, gently holding her belly. Soft lighting, cozy home atmosphere. Focus on maternal health and wellness. Rose gold and white tones. No text.'
  },
  {
    slug: 'keto-diet-for-lipedema',
    prompt: 'High-end food photography of a Ketogenic meal ideal for Lipedema: Avocado, Salmon, Leafy greens, and olive oil on a ceramic plate. Clean, fresh, anti-inflammatory vibe. No text.'
  },
  {
    slug: 'flying-with-lipedema-travel-tips',
    prompt: 'Travel lifestyle photography. A view from an airplane window (clouds). On the seat, a pair of compression socks and a bottle of water. Focus on safe travel preparation. Aesthetic and calm.'
  },
  {
    slug: 'lipedema-at-work-ergonomics',
    prompt: 'Office setting. An ergonomic footrest under a desk, with a woman legs resting comfortably (wearing stylish pants). A standing desk in the background. Focus on workplace comfort. Professional vibe.'
  },
  {
    slug: 'lipedema-intimacy-relationships',
    prompt: 'A romantic, soft-focus image of a couple holding hands on a couch. Only hands and part of the legs are visible. The mood is supportive, loving, and intimate. Warm lighting. No faces.'
  },
  {
    slug: 'self-manual-lymphatic-drainage',
    prompt: 'Close up of a woman hands applying body oil to her legs in a gentle upward massage motion. Spa setting, candles in the background. Focus on self-care and healing touch.'
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
  console.log('🚀 Starting DALL-E 3 Image Generation - Final Batch (6 images)');
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

  console.log('\n✨ Batch generation complete!');
}

// Run the script
generateBatch().catch(console.error);
