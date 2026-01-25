# DALL-E 3 Image Generation Script

## Overview
This script automatically generates high-quality blog header images using OpenAI's DALL-E 3 API.

## Setup

### 1. Install Dependencies
```bash
cd lipedema-platform
npm install openai axios
```

### 2. Set Your OpenAI API Key

**Windows CMD:**
```cmd
set OPENAI_API_KEY=your-api-key-here
```

**Windows PowerShell:**
```powershell
$env:OPENAI_API_KEY="your-api-key-here"
```

**Or create a `.env` file in the lipedema-platform directory:**
```
OPENAI_API_KEY=your-api-key-here
```

## Usage

Run the script:
```bash
node scripts/generate_images_dalle.js
```

## What It Does

1. **Generates 10 images** for your blog articles using DALL-E 3
2. **Saves images** to `public/images/blog/` as JPG files
3. **Skips existing images** - won't regenerate if file already exists
4. **Rate limiting** - Waits 5 seconds between requests
5. **Creates a log** - Saves generation results to `dalle_generation_log.json`

## Image Specifications

- **Model:** DALL-E 3
- **Size:** 1792x1024 (landscape, perfect for blog headers)
- **Quality:** HD
- **Style:** Natural (photorealistic)

## Articles Included

1. anti-inflammatory-foods-lipedema
2. coping-with-lipedema-shame
3. lipedema-vs-obesity-diagnosis
4. morning-routine-lymphatic-drainage
5. natural-lipedema-treatment-guide
6. best-supplements-for-lipedema
7. lipedema-friendly-exercises
8. lipedema-liposuction-pros-cons
9. managing-lipedema-in-summer
10. clothing-tips-for-swollen-legs

## Cost Estimate

DALL-E 3 HD pricing (as of 2024):
- **1792x1024 HD:** ~$0.12 per image
- **Total for 10 images:** ~$1.20

## Output

Images will be saved as:
```
public/images/blog/anti-inflammatory-foods-lipedema.jpg
public/images/blog/coping-with-lipedema-shame.jpg
... etc
```

## Troubleshooting

**Error: OPENAI_API_KEY not set**
- Make sure you've set the environment variable before running

**Rate limit errors**
- The script includes 5-second delays between requests
- If you still hit limits, increase the delay in the code

**Image quality issues**
- All images are generated in HD quality
- Prompts are optimized for medical spa aesthetic
- If you need adjustments, modify the prompts in the script
