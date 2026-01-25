import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Use process.cwd() which is the project root when running 'node scripts/...'
const envPath = path.join(process.cwd(), '.env.local');

function getEnvValue(key) {
    try {
        if (!fs.existsSync(envPath)) {
            console.error(`File not found: ${envPath}`);
            return null;
        }
        const content = fs.readFileSync(envPath, 'utf8');
        const regex = new RegExp(`^${key}=\\s*(?:["']?)(.*?)(?:["']?)\\s*$`, 'm');
        const match = content.match(regex);
        return match ? match[1] : null;
    } catch (e) {
        console.error('Error reading .env.local', e);
        return null;
    }
}

const supabaseUrl = getEnvValue('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnvValue('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Failed to extract credentials from .env.local');
    // Debug output (safe)
    console.log(`Path used: ${envPath}`);
    console.log('Keys found:', {
        URL: !!supabaseUrl,
        KEY: !!supabaseServiceKey
    });
    process.exit(1);
}

console.log('Credentials loaded. Connecting to Supabase...');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncImages() {
    const mapPath = path.join(process.cwd(), 'src', 'lib', 'article_image_map.json');

    if (!fs.existsSync(mapPath)) {
        console.error(`Error: Map file not found at ${mapPath}`);
        process.exit(1);
    }

    const imageMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

    console.log(`Found ${Object.keys(imageMap).length} images to sync.`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const [id, filename] of Object.entries(imageMap)) {
        const imageUrl = `/articles/${filename}.png`;

        // console.log(`Syncing ID: ${id} -> ${imageUrl}`);

        const { error } = await supabase
            .from('posts')
            .update({ image_url: imageUrl })
            .eq('id', id);

        if (error) {
            console.error(`Failed to update post ${id}:`, error.message);
            errorCount++;
        } else {
            updatedCount++;
        }
    }
    console.log(`\nJob Complete!`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Failed:  ${errorCount}`);
}

syncImages().catch(console.error);
