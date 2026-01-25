const fs = require('fs');
const path = require('path');

const mapPath = path.join(process.cwd(), 'src', 'lib', 'article_image_map.json');
const dbPath = path.join(process.cwd(), 'site_content_db.json');
const outPath = path.join(process.cwd(), 'scripts', 'update_images_by_title.sql');

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

let sql = '-- Update article images matching by exact Title (handling potential ID mismatches)\n\n';
let matchCount = 0;

for (const [id, filename] of Object.entries(imageMap)) {
    const title = idToTitle[id];
    if (title) {
        const imageUrl = `/articles/${filename}.png`;
        // Escape single quotes for SQL
        const safeTitle = title.replace(/'/g, "''");
        sql += `UPDATE posts SET image_url = '${imageUrl}' WHERE title = '${safeTitle}';\n`;
        matchCount++;
    } else {
        console.warn(`Warning: ID ${id} from map not found in content DB.`);
    }
}

fs.writeFileSync(outPath, sql);
console.log(`Generated SQL file at ${outPath}`);
console.log(`Matched ${matchCount} out of ${Object.keys(imageMap).length} images.`);
