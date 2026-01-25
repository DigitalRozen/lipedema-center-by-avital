// Script to update affiliate products with premium, more specific images
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

// Premium product images - more specific and professional
const premiumImageUpdates = [
  {
    productName: 'FaradBeauty מברשת לימפה מחוממת',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=faces&auto=format&q=90',
    description: 'מברשת עיסוי מתקדמת עם חום ורטט'
  },
  {
    productName: 'שרוול דחיסה רפואי לזרוע - ליפאדמה ולימפדמה',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    description: 'שרוול דחיסה רפואי מקצועי'
  },
  {
    productName: 'גרבי דחיסה רפואיות לליפאדמה',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    description: 'גרבי דחיסה רפואיות איכותיות'
  },
  {
    productName: 'תחבושות דחיסה קצרות למפדמה',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    description: 'תחבושות דחיסה מקצועיות'
  },
  {
    productName: 'FaradBeauty מסכת LED לטיפוח פנים',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop&crop=faces&auto=format&q=90',
    description: 'מסכת LED מתקדמת לטיפוח'
  },
  {
    productName: 'JOBST Elvarex Soft - גרבי דחיסה רכות',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    description: 'גרבי דחיסה רכות פרימיום'
  },
  {
    productName: 'Lympha Press Optimal Plus - מכשיר דחיסה פנאומטי',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    description: 'מכשיר דחיסה פנאומטי מתקדם'
  },
  {
    productName: 'ספר דיגיטלי: מדריך התזונה לליפאדמה',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    description: 'ספר דיגיטלי מקצועי'
  },
  {
    productName: 'קורס וידאו: תרגילים לליפאדמה',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    description: 'קורס וידאו מקצועי'
  },
  {
    productName: 'גרביים דחיסה רפואיות',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    description: 'גרביים דחיסה רפואיות'
  }
]

// Alternative premium images for different categories
const premiumImageCategories = {
  compression: [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=center&auto=format&q=90'
  ],
  beauty: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=faces&auto=format&q=90',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop&crop=faces&auto=format&q=90',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop&crop=faces&auto=format&q=90'
  ],
  medical: [
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop&crop=center&auto=format&q=90',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=center&auto=format&q=90'
  ],
  digital: [
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center&auto=format&q=90', // books
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&auto=format&q=90', // video/course
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop&crop=center&auto=format&q=90', // digital content
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop&crop=center&auto=format&q=90'  // online learning
  ]
}

async function updatePremiumImages() {
  console.log('✨ Updating affiliate products with premium images...\n')
  
  try {
    // Get all current products
    const { data: allProducts, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
    
    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError)
      return
    }
    
    console.log(`📋 Found ${allProducts?.length || 0} active products\n`)
    
    // Update images for specific products
    for (const update of premiumImageUpdates) {
      console.log(`✨ Updating premium image for: ${update.productName}`)
      
      const { data, error } = await supabase
        .from('products')
        .update({ 
          image_url: update.imageUrl
        })
        .eq('name', update.productName)
        .select()
      
      if (error) {
        console.error(`❌ Error updating ${update.productName}:`, error)
      } else if (data && data.length > 0) {
        console.log(`✅ Successfully updated premium image for: ${update.productName}`)
        console.log(`   Premium Image URL: ${update.imageUrl}`)
      } else {
        console.log(`⚠️  Product not found: ${update.productName}`)
      }
      console.log('')
    }
    
    // Show final status with image quality info
    const { data: updatedProducts } = await supabase
      .from('products')
      .select('name, image_url, type, price')
      .eq('active', true)
      .order('created_at', { ascending: false })
    
    console.log('📊 Premium image status:')
    updatedProducts?.forEach((product, index) => {
      const hasImage = product.image_url ? '✅' : '❌'
      const isPremium = product.image_url && product.image_url.includes('q=90') ? '⭐' : ''
      console.log(`${index + 1}. ${hasImage}${isPremium} ${product.name}`)
      console.log(`   Type: ${product.type} | Price: ₪${product.price}`)
      if (product.image_url) {
        const quality = product.image_url.includes('q=90') ? 'Premium (90% quality)' : 'Standard (80% quality)'
        console.log(`   Image Quality: ${quality}`)
      }
      console.log('')
    })
    
    const withImages = updatedProducts?.filter(p => p.image_url).length || 0
    const premiumImages = updatedProducts?.filter(p => p.image_url && p.image_url.includes('q=90')).length || 0
    const total = updatedProducts?.length || 0
    
    console.log(`🎯 Summary:`)
    console.log(`   📸 ${withImages}/${total} products have images (${Math.round(withImages/total*100)}%)`)
    console.log(`   ⭐ ${premiumImages}/${total} products have premium images (${Math.round(premiumImages/total*100)}%)`)
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

// Function to optimize existing images to premium quality
async function optimizeExistingImages() {
  console.log('🔧 Optimizing existing images to premium quality...\n')
  
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
    
    for (const product of products) {
      if (product.image_url && !product.image_url.includes('q=90')) {
        // Upgrade image quality to 90%
        const optimizedUrl = product.image_url.replace(/q=\d+/, 'q=90')
        
        console.log(`🔄 Optimizing image for: ${product.name}`)
        
        const { error } = await supabase
          .from('products')
          .update({ 
            image_url: optimizedUrl
          })
          .eq('id', product.id)
        
        if (error) {
          console.error(`❌ Error optimizing ${product.name}:`, error)
        } else {
          console.log(`✅ Optimized image for: ${product.name}`)
          console.log(`   From: ${product.image_url}`)
          console.log(`   To: ${optimizedUrl}`)
        }
      }
    }
    
  } catch (error) {
    console.error('Error optimizing images:', error)
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--optimize')) {
    await optimizeExistingImages()
  } else {
    await updatePremiumImages()
  }
}

main()
