const fs = require('fs');
const path = require('path');

const mapPath = path.join(process.cwd(), 'src', 'lib', 'article_image_map.json');
const outPath = path.join(process.cwd(), 'scripts', 'update_images.sql');

if (!fs.existsSync(mapPath)) {
    console.error(`Error: Map file not found at ${mapPath}`);
    process.exit(1);
}

const imageMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
let sql = '-- Update article images based on generated assets\n\n';

for (const [id, filename] of Object.entries(imageMap)) {
    const imageUrl = `/articles/${filename}.png`;
    // Escaping single quotes in ID if necessary (though they seem numeric/string)
    sql += `UPDATE posts SET image_url = '${imageUrl}' WHERE id = '${id}';\n`;
}

fs.writeFileSync(outPath, sql);
console.log(`Generated SQL file at ${outPath} with ${Object.keys(imageMap).length} updates.`);
