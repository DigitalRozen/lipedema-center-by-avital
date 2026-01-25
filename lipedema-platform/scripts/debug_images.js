const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function debugImages() {
    console.log('--- Starting Image Diagnostics ---');

    if (!fs.existsSync(POSTS_DIR)) {
        console.error(`❌ Posts directory not found: ${POSTS_DIR}`);
        return;
    }

    const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.mdx'));
    console.log(`Found ${files.length} MDX files.\n`);

    for (const file of files) {
        const filePath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(content);

        const title = data.title || file;
        const imagePath = data.image;

        if (!imagePath) {
            console.log(`⚠️  NO IMAGE FIELD: [${title}] (${file})`);
            continue;
        }

        // Handle relative vs absolute paths in frontmatter
        // Standard Next.js public folder usage: /images/blog/img.jpg refers to public/images/blog/img.jpg
        const fullImagePath = path.join(PUBLIC_DIR, imagePath.startsWith('/') ? imagePath.slice(1) : imagePath);
        const exists = fs.existsSync(fullImagePath);

        if (exists) {
            console.log(`✅ FOUND: [${title}] -> Found at: ${imagePath}`);
        } else {
            console.log(`❌ MISSING: [${title}]`);
            console.log(`   Looking for: ${fullImagePath}`);

            // Auto-Fix Attempt: Check for alternative extensions or casing
            const imgDir = path.dirname(fullImagePath);
            const imgBasename = path.basename(fullImagePath, path.extname(fullImagePath));

            if (fs.existsSync(imgDir)) {
                const potentialFiles = fs.readdirSync(imgDir);
                const alternative = potentialFiles.find(f => {
                    const fBase = path.basename(f, path.extname(f));
                    return fBase.toLowerCase() === imgBasename.toLowerCase();
                });

                if (alternative) {
                    console.log(`   💡 Found alternative! Filename: ${alternative}`);
                } else {
                    console.log(`   ⛔ No alternative found in ${imgDir}`);
                }
            } else {
                console.log(`   ⛔ Directory does not exist: ${imgDir}`);
            }
        }
        console.log('---');
    }
}

debugImages().catch(err => {
    console.error('Fatal error during diagnostics:', err);
});
