// Advanced script for managing affiliate product images
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Curated image collections for different product types
const imageCollections = {
  // Compression garments and medical devices
  compression: {
    socks: [
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop&crop=center&auto=format&q=90'
    ],
    sleeves: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop&crop=center&auto=format&q=90'
    ],
    bandages: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=center&auto=format&q=90'
    ]
  },
  
  // Beauty and wellness devices
  beauty: {
    brushes: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=faces&auto=format&q=90',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop&crop=faces&auto=format&q=90'
    ],
    masks: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop&crop=faces&auto=format&q=90',
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop&crop=faces&auto=format&q=90'
    ],
    devices: [
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop&crop=center&auto=format&q=90'
    ]
  },
  
  // Medical equipment
  medical: {
    devices: [
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=center&auto=format&q=90'
    ],
    equipment: [
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop&crop=center&auto=format&q=90'
    ]
  },
  
  // Digital products
  digital: {
    books: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center&auto=format&q=90'
    ],
    courses: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&crop=center&auto=format&q=90'
    ],
    guides: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center&auto=format&q=90'
    ]
  }
}

// Smart image selection based on product name and type
function selectBestImage(productName, productType) {
  const name = productName.toLowerCase()
  
  // Digital products
  if (productType === 'Digital') {
    if (name.includes('ספר') || name.includes('מדריך')) {
      return imageCollections.digital.books[Math.floor(Math.random() * imageCollections.digital.books.length)]
    } else if (name.includes('קורס') || name.includes('וידאו')) {
      return imageCollections.digital.courses[Math.floor(Math.random() * imageCollections.digital.courses.length)]
    } else {
      return imageCollections.digital.guides[Math.floor(Math.random() * imageCollections.digital.guides.length)]
    }
  }
  
  // Physical products
  if (name.includes('מברשת') || name.includes('brush')) {
    return imageCollections.beauty.brushes[Math.floor(Math.random() * imageCollections.beauty.brushes.length)]
  } else if (name.includes('מסכת') || name.includes('mask') || name.includes('led')) {
    return imageCollections.beauty.masks[Math.floor(Math.random() * imageCollections.beauty.masks.length)]
  } else if (name.includes('גרבי') || name.includes('גרביים') || name.includes('socks')) {
    return imageCollections.compression.socks[Math.floor(Math.random() * imageCollections.compression.socks.length)]
  } else if (name.includes('שרוול') || name.includes('sleeve')) {
    return imageCollections.compression.sleeves[Math.floor(Math.random() * imageCollections.compression.sleeves.length)]
  } else if (name.includes('תחבושות') || name.includes('bandage')) {
    return imageCollections.compression.bandages[Math.floor(Math.random() * imageCollections.compression.bandages.length)]
  } else if (name.includes('מכשיר') || name.includes('device') || name.includes('press')) {
    return imageCollections.medical.devices[Math.floor(Math.random() * imageCollections.medical.devices.length)]
  } else {
    // Default to medical equipment for other physical products
    return imageCollections.medical.equipment[Math.floor(Math.random() * imageCollections.medical.equipment.length)]
  }
}

async function analyzeCurrentImages() {
  console.log('🔍 Analyzing current product images...\n')
  
  try {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    
    if (!products || products.length === 0) {
      console.log('❌ No products found!')
      return
    }
    
    console.log(`📊 Image Analysis Report:`)
    console.log(`Total Products: ${products.length}\n`)
    
    let withImages = 0
    let premiumImages = 0
    let needsUpdate = 0
    
    const categories = {
      Physical: { total: 0, withImages: 0 },
      Digital: { total: 0, withImages: 0 }
    }
    
    products.forEach((product, index) => {
      const hasImage = !!product.image_url
      const isPremium = hasImage && product.image_url.includes('q=90')
      const needsImprovement = hasImage && !isPremium
      
      if (hasImage) withImages++
      if (isPremium) premiumImages++
      if (needsImprovement) needsUpdate++
      
      categories[product.type].total++
      if (hasImage) categories[product.type].withImages++
      
      const status = hasImage ? (isPremium ? '✅⭐' : '✅') : '❌'
      console.log(`${index + 1}. ${status} ${product.name}`)
      console.log(`   Type: ${product.type} | Price: ₪${product.price}`)
      
      if (hasImage) {
        const quality = isPremium ? 'Premium (90%)' : 'Standard (80%)'
        console.log(`   Image Quality: ${quality}`)
      } else {
        const suggested = selectBestImage(product.name, product.type)
        console.log(`   💡 Suggested: ${suggested}`)
      }
      console.log('')
    })
    
    console.log('📈 Summary Statistics:')
    console.log(`   📸 Images: ${withImages}/${products.length} (${Math.round(withImages/products.length*100)}%)`)
    console.log(`   ⭐ Premium: ${premiumImages}/${products.length} (${Math.round(premiumImages/products.length*100)}%)`)
    console.log(`   🔄 Need Update: ${needsUpdate} products`)
    console.log('')
    
    console.log('📋 By Category:')
    Object.entries(categories).forEach(([type, stats]) => {
      const percentage = stats.total > 0 ? Math.round(stats.withImages/stats.total*100) : 0
      console.log(`   ${type}: ${stats.withImages}/${stats.total} (${percentage}%)`)
    })
    
  } catch (error) {
    console.error('Error analyzing images:', error)
  }
}

async function smartUpdateImages() {
  console.log('🤖 Smart image update based on product analysis...\n')
  
  try {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
    
    if (!products || products.length === 0) {
      console.log('❌ No products found!')
      return
    }
    
    let updated = 0
    
    for (const product of products) {
      const needsImage = !product.image_url
      const needsUpgrade = product.image_url && !product.image_url.includes('q=90')
      
      if (needsImage || needsUpgrade) {
        const bestImage = selectBestImage(product.name, product.type)
        
        console.log(`🔄 ${needsImage ? 'Adding' : 'Upgrading'} image for: ${product.name}`)
        
        const { error } = await supabase
          .from('products')
          .update({ image_url: bestImage })
          .eq('id', product.id)
        
        if (error) {
          console.error(`❌ Error updating ${product.name}:`, error)
        } else {
          console.log(`✅ ${needsImage ? 'Added' : 'Upgraded'} image for: ${product.name}`)
          console.log(`   Image: ${bestImage}`)
          updated++
        }
        console.log('')
      }
    }
    
    console.log(`🎯 Updated ${updated} product images`)
    
  } catch (error) {
    console.error('Error in smart update:', error)
  }
}

async function validateImages() {
  console.log('🔍 Validating product images...\n')
  
  try {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .not('image_url', 'is', null)
    
    if (!products || products.length === 0) {
      console.log('❌ No products with images found!')
      return
    }
    
    console.log(`🔗 Checking ${products.length} product images...\n`)
    
    for (const product of products) {
      const url = product.image_url
      console.log(`Checking: ${product.name}`)
      console.log(`URL: ${url}`)
      
      // Basic URL validation
      if (!url.startsWith('https://')) {
        console.log('⚠️  Warning: Not using HTTPS')
      }
      
      if (!url.includes('unsplash.com')) {
        console.log('⚠️  Warning: Not from Unsplash (may have licensing issues)')
      }
      
      if (!url.includes('w=400') || !url.includes('h=400')) {
        console.log('⚠️  Warning: Not optimized dimensions (400x400)')
      }
      
      if (!url.includes('q=90')) {
        console.log('⚠️  Warning: Not premium quality (q=90)')
      }
      
      console.log('✅ Image URL validated')
      console.log('')
    }
    
  } catch (error) {
    console.error('Error validating images:', error)
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'analyze'
  
  switch (command) {
    case 'analyze':
      await analyzeCurrentImages()
      break
    case 'update':
      await smartUpdateImages()
      break
    case 'validate':
      await validateImages()
      break
    case 'full':
      console.log('🚀 Running full image management workflow...\n')
      await analyzeCurrentImages()
      console.log('\n' + '='.repeat(60) + '\n')
      await smartUpdateImages()
      console.log('\n' + '='.repeat(60) + '\n')
      await validateImages()
      break
    default:
      console.log('📖 Usage:')
      console.log('  node manage-product-images.js [command]')
      console.log('')
      console.log('Commands:')
      console.log('  analyze   - Analyze current image status (default)')
      console.log('  update    - Smart update missing/low-quality images')
      console.log('  validate  - Validate existing image URLs')
      console.log('  full      - Run complete workflow (analyze + update + validate)')
      break
  }
}

main()