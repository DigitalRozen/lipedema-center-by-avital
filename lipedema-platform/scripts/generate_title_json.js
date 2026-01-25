const fs = require('fs');
const path = require('path');

const mapPath = path.join(process.cwd(), 'src', 'lib', 'article_image_map.json');
const dbPath = path.join(process.cwd(), 'site_content_db.json');
const outPath = path.join(process.cwd(), 'src', 'lib', 'article_title_map.json');

if (!fs.existsSync(mapPath) || !fs.existsSync(dbPath)) {
    console.error('Error: Required JSON files not found.');
    process.exit(1);
}

const imageMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const contentDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Create a lookup: ID (from JSON) -> Title
const idToTitle = {};
contentDb.forEach(post => {
    idToTitle[post.id] = post.title;
});

const titleMap = {};
let matchCount = 0;

for (const [id, filename] of Object.entries(imageMap)) {
    const title = idToTitle[id];
    if (title) {
        titleMap[title] = filename;
        matchCount++;
    }
}

fs.writeFileSync(outPath, JSON.stringify(titleMap, null, 2));
console.log(`Generated Title Map at ${outPath}`);
console.log(`Mapped ${matchCount} titles.`);
