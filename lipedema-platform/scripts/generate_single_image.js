const fs = require('fs');
const path = require('path');
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const OUTPUT_DIR = path.join(__dirname, '../public/images/blog');

// Alternative prompt that should pass content filters
const article = {
  slug: 'coping-with-lipedema-shame',
  prompt: 'A serene wellness photograph of a peaceful meditation space near a large window with natural light. Soft linen cushions in rose gold and sage colors. A journal and tea cup on a wooden table. Calm, introspective atmosphere. High-end spa aesthetic. No people. No text.'
};

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

async function generateImage() {
  const outputPath = path.join(OUTPUT_DIR, `${article.slug}.jpg`);

  try {
    console.log(`🎨 Generating image for: ${article.slug}`);
    console.log(`   Prompt: ${article.prompt}\n`);

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
    console.log(`✅ Saved: ${outputPath}`);

  } catch (error) {
    console.error(`❌ Error:`, error.message);
  }
}

generateImage();
