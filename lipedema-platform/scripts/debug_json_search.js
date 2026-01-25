const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../site_content_db.json');
const mapPath = path.join(__dirname, '../src/lib/article_image_map.json');

try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

    console.log(`DB has ${db.length} entries.`);
    console.log(`Map has ${Object.keys(map).length} entries.`);

    const keywords = ['סאונה', 'אינפרא', 'מיכל', 'זוגיות', 'ליפאדמה'];

    console.log('\n--- Searching for Keywords ---');
    keywords.forEach(kw => {
        const matches = db.filter(item =>
            (item.title && item.title.includes(kw)) ||
            (item.content && item.content.includes(kw))
        );
        console.log(`Keyword "${kw}": Found ${matches.length} matches.`);
        matches.forEach(m => console.log(`  Found: [${m.id}] ${m.title.substring(0, 50)}...`));
    });

    console.log('\n--- Checking Map IDs in DB ---');
    let foundCount = 0;
    Object.keys(map).forEach(mapId => {
        const exists = db.find(item => item.id === mapId);
        if (!exists) {
            // console.log(`Map ID ${mapId} NOT found in DB.`);
        } else {
            foundCount++;
        }
    });
    console.log(`Found ${foundCount} / ${Object.keys(map).length} map IDs in DB.`);

} catch (err) {
    console.error("Error:", err);
}

