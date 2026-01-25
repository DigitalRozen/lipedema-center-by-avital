const { createReader } = require('@keystatic/core/reader');
const keystaticConfig = require('../keystatic.config.ts').default;

async function testReader() {
  console.log('🔍 Testing Keystatic reader...\n');
  
  const reader = createReader(process.cwd(), keystaticConfig);
  
  try {
    const allPosts = await reader.collections.posts.list();
    console.log(`✅ Found ${allPosts.length} posts:\n`);
    
    for (const slug of allPosts) {
      try {
        const post = await reader.collections.posts.read(slug);
        if (post) {
          console.log(`✅ ${slug}`);
          console.log(`   Title: ${post.title}`);
          console.log(`   Category: ${post.category}`);
          console.log(`   Date: ${post.date}`);
        } else {
          console.log(`❌ ${slug} - Could not read post`);
        }
      } catch (err) {
        console.log(`❌ ${slug} - Error: ${err.message}`);
      }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 Total valid posts: ${allPosts.length}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

testReader();
