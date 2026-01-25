const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../site_content_db.json');
const mapPath = path.join(__dirname, '../src/lib/article_keyword_map.json');

try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

    console.log(`Total Articles: ${db.length}`);
    console.log(`Total Mapped Images: ${map.length}`);

    const coverage = {
        matched: [],
        unmatched: [],
        imageUsage: {}
    };

    // Initialize image usage counts
    map.forEach(entry => {
        coverage.imageUsage[entry.image] = 0;
    });

    db.forEach(post => {
        const titleLower = post.title.toLowerCase();
        const contentLower = (post.content || '').toLowerCase();

        // Logic must match page.tsx / VisualArticleRenderer.tsx
        const matchedEntry = map.find(entry =>
            entry.keywords.some(kw =>
                titleLower.includes(kw.toLowerCase()) ||
                contentLower.includes(kw.toLowerCase())
            )
        );

        if (matchedEntry) {
            coverage.matched.push({
                title: post.title,
                image: matchedEntry.image
            });
            coverage.imageUsage[matchedEntry.image]++;
        } else {
            coverage.unmatched.push(post.title);
        }
    });

    let report = `Total Articles: ${db.length}\n`;
    report += `Total Mapped Images: ${map.length}\n\n`;

    report += `--- Coverage Statistics ---\n`;
    report += `Matched Articles: ${coverage.matched.length}\n`;
    report += `Unmatched Articles: ${coverage.unmatched.length}\n\n`;

    report += `--- Unmatched Articles (Using Category Fallback) ---\n`;
    coverage.unmatched.forEach((title, i) => report += `Unmatched: ${title} | DB_ID: ${db.find(p => p.title === title).id}\n`);

    report += `\n--- Detailed Image Usage ---\n`;
    Object.keys(coverage.imageUsage).forEach(img => {
        const articles = coverage.matched.filter(m => m.image === img);
        if (articles.length > 0) {
            report += `IMAGE: ${img} (${articles.length})\n`;
            articles.forEach(a => report += `  - ${a.title}\n`);
        }
    });

    fs.writeFileSync(path.join(__dirname, 'coverage_report_detailed.txt'), report);
    console.log("Detailed report written.");

} catch (err) {
    console.error("Error:", err);
}
