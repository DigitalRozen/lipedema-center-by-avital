// Quick script to check all products and their images
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

async function checkProducts() {
  console.log('🔍 Checking all affiliate products and images...\n')
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('type', { ascending: true })
      .order('price', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching products:', error)
      return
    }
    
    if (!products || products.length === 0) {
      console.log('❌ No active products found!')
      return
    }
    
    console.log(`📦 Found ${products.length} active products:\n`)
    
    // Group by type
    const productsByType = products.reduce((acc, product) => {
      if (!acc[product.type]) acc[product.type] = []
      acc[product.type].push(product)
      return acc
    }, {})
    
    Object.entries(productsByType).forEach(([type, typeProducts]) => {
      console.log(`📂 ${type} Products (${typeProducts.length}):`)
      console.log('─'.repeat(50))
      
      typeProducts.forEach((product, index) => {
        const hasImage = !!product.image_url
        const isPremium = hasImage && product.image_url.includes('q=90')
        const status = hasImage ? (isPremium ? '✅⭐' : '✅') : '❌'
        
        console.log(`${index + 1}. ${status} ${product.name}`)
        console.log(`   💰 Price: ₪${product.price}`)
        console.log(`   🏷️  Tags: ${(product.trigger_tags || []).join(', ')}`)
        
        if (hasImage) {
          console.log(`   🖼️  Image: ${product.image_url}`)
          const quality = isPremium ? 'Premium (90%)' : 'Standard (80%)'
          console.log(`   📊 Quality: ${quality}`)
        } else {
          console.log(`   ⚠️  No image`)
        }
        
        if (product.affiliate_link) {
          console.log(`   🔗 Link: ${product.affiliate_link}`)
        }
        
        if (product.description) {
          const shortDesc = product.description.length > 80 
            ? product.description.substring(0, 80) + '...' 
            : product.description
          console.log(`   📝 Description: ${shortDesc}`)
        }
        
        console.log('')
      })
      
      console.log('')
    })
    
    // Summary statistics
    const totalProducts = products.length
    const withImages = products.filter(p => p.image_url).length
    const premiumImages = products.filter(p => p.image_url && p.image_url.includes('q=90')).length
    const physicalProducts = products.filter(p => p.type === 'Physical').length
    const digitalProducts = products.filter(p => p.type === 'Digital').length
    
    console.log('📊 Summary Statistics:')
    console.log('═'.repeat(40))
    console.log(`📦 Total Products: ${totalProducts}`)
    console.log(`🏥 Physical Products: ${physicalProducts}`)
    console.log(`💻 Digital Products: ${digitalProducts}`)
    console.log(`📸 Products with Images: ${withImages}/${totalProducts} (${Math.round(withImages/totalProducts*100)}%)`)
    console.log(`⭐ Premium Quality Images: ${premiumImages}/${totalProducts} (${Math.round(premiumImages/totalProducts*100)}%)`)
    
    const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0)
    const avgPrice = Math.round(totalValue / totalProducts)
    console.log(`💰 Average Price: ₪${avgPrice}`)
    console.log(`💎 Total Portfolio Value: ₪${totalValue}`)
    
    // Price ranges
    const priceRanges = {
      'Budget (₪0-200)': products.filter(p => p.price <= 200).length,
      'Mid-range (₪201-500)': products.filter(p => p.price > 200 && p.price <= 500).length,
      'Premium (₪501-1000)': products.filter(p => p.price > 500 && p.price <= 1000).length,
      'Luxury (₪1000+)': products.filter(p => p.price > 1000).length
    }
    
    console.log('\n💰 Price Distribution:')
    Object.entries(priceRanges).forEach(([range, count]) => {
      if (count > 0) {
        console.log(`   ${range}: ${count} products`)
      }
    })
    
    // Check for potential issues
    console.log('\n🔍 Quality Check:')
    const issues = []
    
    if (withImages < totalProducts) {
      issues.push(`${totalProducts - withImages} products missing images`)
    }
    
    if (premiumImages < withImages) {
      issues.push(`${withImages - premiumImages} products with standard quality images`)
    }
    
    const withoutLinks = products.filter(p => !p.affiliate_link).length
    if (withoutLinks > 0) {
      issues.push(`${withoutLinks} products missing affiliate links`)
    }
    
    const withoutDescriptions = products.filter(p => !p.description).length
    if (withoutDescriptions > 0) {
      issues.push(`${withoutDescriptions} products missing descriptions`)
    }
    
    if (issues.length === 0) {
      console.log('✅ All products are properly configured!')
    } else {
      console.log('⚠️  Issues found:')
      issues.forEach(issue => console.log(`   - ${issue}`))
    }
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

checkProducts()