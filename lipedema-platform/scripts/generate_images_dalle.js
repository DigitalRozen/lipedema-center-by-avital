const fs = require('fs');
const path = require('path');
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const OUTPUT_DIR = path.join(__dirname, '../public/images/blog');

// Article data with prompts
const articles = [
  // BATCH 1
  {
    slug: 'anti-inflammatory-foods-lipedema',
    prompt: 'A close-up photograph of a beautifully arranged bowl of anti-inflammatory foods (dark berries, leafy greens, fatty fish, turmeric root). In the softly blurred background, a woman hands gently hold her thigh. Natural light, high end wellness aesthetic. No text.'
  },
  {
    slug: 'coping-with-lipedema-shame',
    prompt: 'An emotive, candid-style photograph of a woman sitting pensively near a large window, wearing soft linen clothing. She is hugging her knees to her chest. Soft lighting, introspective mood, spa colors (rose gold, sage). No text.'
  },
  {
    slug: 'lipedema-vs-obesity-diagnosis',
    prompt: 'A clinical yet warm photograph focusing on the lower legs and ankles. The image clearly shows the "cuff sign" above the ankle bone. A doctor hand gently points to the area. Soft medical setting background. Photorealistic.'
  },
  {
    slug: 'morning-routine-lymphatic-drainage',
    prompt: 'An action photograph in a bright, spa-like bathroom. A woman is using a natural bristle dry brush on her thigh in an upward motion. Next to her, a glass of water with lemon. Clean, bright, airy. No text.'
  },
  {
    slug: 'natural-lipedema-treatment-guide',
    prompt: 'A flat lay photograph of professional lipedema treatment tools on light wood: beige medical grade compression garments folded, a manual lymphatic drainage device, kinesio tape, and arnica cream. High-end product photography.'
  },
  // BATCH 2
  {
    slug: 'best-supplements-for-lipedema',
    prompt: 'Photorealistic wellness photography. Amber glass medicine jars labeled "Selenium" and "Magnesium" arranged neatly on a white marble table next to a cup of herbal tea. Soft morning light. High end spa aesthetic.'
  },
  {
    slug: 'lipedema-friendly-exercises',
    prompt: 'Underwater photography of a woman swimming gracefully in a clear blue pool. The water supports her body. Focus on the gentle movement. Sunlight refracting through the water. Serene atmosphere.'
  },
  {
    slug: 'lipedema-liposuction-pros-cons',
    prompt: 'A professional consultation scene in a modern medical clinic. A doctor pointing to a lymphatic system diagram on a screen. Soft focus background. Clean, white, rose-gold aesthetic. Serious but hopeful atmosphere.'
  },
  {
    slug: 'managing-lipedema-in-summer',
    prompt: 'Lifestyle photography. A woman sitting comfortably by a pool, wearing light breathable linen clothing. She is applying a cooling gel to her legs. Summer vibe, bright and airy but classy.'
  },
  {
    slug: 'clothing-tips-for-swollen-legs',
    prompt: 'Fashion boutique setting. A rack of flattering clothing for pear-shaped bodies: wide-leg linen trousers and flowing maxi dresses. A woman looking at the clothes happily. Soft warm lighting.'
  }
];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function generateImage(article) {
  const outputPath = path.join(OUTPUT_DIR, `${article.slug}.jpg`);

  // Check if image already exists
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipping ${article.slug} - image already exists`);
    return { slug: article.slug, status: 'skipped', path: outputPath };
  }

  try {
    console.log(`🎨 Generating image for: ${article.slug}`);
    console.log(`   Prompt: ${article.prompt.substring(0, 80)}...`);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: article.prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    });

    const imageUrl = response.data[0].url;
    console.log(`📥 Downloading image...`);

    await downloadImage(imageUrl, outputPath);
    console.log(`✅ Saved: ${outputPath}\n`);

    return { 
      slug: article.slug, 
      status: 'success', 
      path: outputPath,
      url: imageUrl 
    };

  } catch (error) {
    console.error(`❌ Error generating ${article.slug}:`, error.message);
    return { 
      slug: article.slug, 
      status: 'error', 
      error: error.message 
    };
  }
}

async function main() {
  console.log('🚀 Starting DALL-E 3 Image Generation\n');
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is not set');
    process.exit(1);
  }

  const results = [];

  for (const article of articles) {
    const result = await generateImage(article);
    results.push(result);
    
    // Add delay between requests to avoid rate limits
    if (result.status === 'success') {
      console.log('⏳ Waiting 5 seconds before next request...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.status === 'success').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const failed = results.filter(r => r.status === 'error').length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total: ${results.length}`);

  if (failed > 0) {
    console.log('\n❌ Failed articles:');
    results
      .filter(r => r.status === 'error')
      .forEach(r => console.log(`   - ${r.slug}: ${r.error}`));
  }

  // Save results log
  const logPath = path.join(__dirname, 'dalle_generation_log.json');
  fs.writeFileSync(logPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Full log saved to: ${logPath}`);
}

main().catch(console.error);
