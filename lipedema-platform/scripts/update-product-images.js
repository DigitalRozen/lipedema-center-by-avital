// Script to update affiliate product images with high-quality URLs
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

// Product image updates - using high-quality, relevant images
const productImageUpdates = [
  {
    productName: 'FaradBeauty מברשת לימפה מחוממת',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    altText: 'מברשת לימפה מחוממת עם טכנולוגיה מתקדמת'
  },
  {
    productName: 'שרוול דחיסה רפואי לזרוע - ליפאדמה ולימפדמה',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    altText: 'שרוול דחיסה רפואי לזרוע'
  },
  {
    productName: 'גרבי דחיסה רפואיות לליפאדמה',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    altText: 'גרבי דחיסה רפואיות'
  },
  {
    productName: 'תחבושות דחיסה קצרות למפדמה',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    altText: 'תחבושות דחיסה רפואיות'
  },
  {
    productName: 'FaradBeauty מסכת LED לטיפוח פנים',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    altText: 'מסכת LED לטיפוח פנים'
  },
  {
    productName: 'JOBST Elvarex Soft - גרבי דחיסה רכות',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    altText: 'גרבי דחיסה רכות איכותיות'
  },
  {
    productName: 'Lympha Press Optimal Plus - מכשיר דחיסה פנאומטי',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    altText: 'מכשיר דחיסה פנאומטי מתקדם'
  }
]

// Alternative high-quality medical/wellness images for variety
const alternativeImages = {
  compression: [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
  ],
  beauty: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
  ],
  medical: [
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
  ]
}

async function updateProductImages() {
  console.log('🖼️  Updating affiliate product images...\n')
  
  try {
    // Get all current products to see what we're working with
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
    for (const update of productImageUpdates) {
      console.log(`🔄 Updating image for: ${update.productName}`)
      
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
        console.log(`✅ Successfully updated image for: ${update.productName}`)
        console.log(`   Image URL: ${update.imageUrl}`)
      } else {
        console.log(`⚠️  Product not found: ${update.productName}`)
      }
      console.log('')
    }
    
    // Check for products without images and suggest alternatives
    console.log('🔍 Checking for products without images...\n')
    
    const productsWithoutImages = allProducts?.filter(product => !product.image_url) || []
    
    if (productsWithoutImages.length > 0) {
      console.log(`Found ${productsWithoutImages.length} products without images:`)
      productsWithoutImages.forEach(product => {
        console.log(`- ${product.name}`)
        
        // Suggest image based on product type/tags
        let suggestedCategory = 'medical'
        if (product.name.includes('LED') || product.name.includes('יופי') || product.name.includes('Beauty')) {
          suggestedCategory = 'beauty'
        } else if (product.name.includes('דחיסה') || product.name.includes('גרבי') || product.name.includes('שרוול')) {
          suggestedCategory = 'compression'
        }
        
        const suggestedImage = alternativeImages[suggestedCategory][0]
        console.log(`  💡 Suggested image: ${suggestedImage}`)
      })
      console.log('')
    }
    
    // Show final status
    const { data: updatedProducts } = await supabase
      .from('products')
      .select('name, image_url, type, price')
      .eq('active', true)
      .order('created_at', { ascending: false })
    
    console.log('📊 Final product status:')
    updatedProducts?.forEach((product, index) => {
      const hasImage = product.image_url ? '✅' : '❌'
      console.log(`${index + 1}. ${hasImage} ${product.name}`)
      console.log(`   Type: ${product.type} | Price: ₪${product.price}`)
      if (product.image_url) {
        console.log(`   Image: ${product.image_url}`)
      }
      console.log('')
    })
    
    const withImages = updatedProducts?.filter(p => p.image_url).length || 0
    const total = updatedProducts?.length || 0
    console.log(`🎯 Summary: ${withImages}/${total} products have images (${Math.round(withImages/total*100)}%)`)
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

// Function to add images to products without them
async function addMissingImages() {
  console.log('🔧 Adding images to products without them...\n')
  
  try {
    const { data: productsWithoutImages } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .is('image_url', null)
    
    if (!productsWithoutImages || productsWithoutImages.length === 0) {
      console.log('✅ All products already have images!')
      return
    }
    
    for (const product of productsWithoutImages) {
      let imageUrl = ''
      let altText = ''
      
      // Choose image based on product characteristics
      if (product.name.includes('LED') || product.name.includes('יופי') || product.name.includes('Beauty')) {
        imageUrl = alternativeImages.beauty[Math.floor(Math.random() * alternativeImages.beauty.length)]
        altText = `מוצר יופי וטיפוח - ${product.name}`
      } else if (product.name.includes('דחיסה') || product.name.includes('גרבי') || product.name.includes('שרוול')) {
        imageUrl = alternativeImages.compression[Math.floor(Math.random() * alternativeImages.compression.length)]
        altText = `מוצר דחיסה רפואי - ${product.name}`
      } else {
        imageUrl = alternativeImages.medical[Math.floor(Math.random() * alternativeImages.medical.length)]
        altText = `מוצר רפואי - ${product.name}`
      }
      
      console.log(`🔄 Adding image to: ${product.name}`)
      
      const { error } = await supabase
        .from('products')
        .update({ 
          image_url: imageUrl
        })
        .eq('id', product.id)
      
      if (error) {
        console.error(`❌ Error updating ${product.name}:`, error)
      } else {
        console.log(`✅ Added image to: ${product.name}`)
        console.log(`   Image: ${imageUrl}`)
      }
    }
    
  } catch (error) {
    console.error('Error adding missing images:', error)
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--add-missing')) {
    await addMissingImages()
  } else {
    await updateProductImages()
  }
}

main()
