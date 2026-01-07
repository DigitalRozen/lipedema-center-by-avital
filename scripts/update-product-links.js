// Script to update specific affiliate links
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

// Function to update a specific product's affiliate link
async function updateProductLink(productName, newLink, newPrice = null) {
  console.log(`Updating ${productName}...`)
  
  const updateData = { affiliate_link: newLink }
  if (newPrice) {
    updateData.price = newPrice
  }
  
  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('name', productName)
    .select()
  
  if (error) {
    console.error(`Error updating ${productName}:`, error)
  } else if (data && data.length > 0) {
    console.log(`✓ Successfully updated: ${productName}`)
    console.log(`  New link: ${newLink}`)
    if (newPrice) console.log(`  New price: ₪${newPrice}`)
  } else {
    console.log(`⚠️  Product not found: ${productName}`)
  }
}

// Function to list all products
async function listAllProducts() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  console.log('\n📋 All products in database:')
  products?.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`)
    console.log(`   Type: ${product.type} | Price: ₪${product.price} | Active: ${product.active}`)
    console.log(`   Link: ${product.affiliate_link}`)
    console.log(`   Tags: ${(product.trigger_tags || []).join(', ')}`)
    console.log('')
  })
}

// Main function
async function main() {
  console.log('🔗 Affiliate Link Management Tool\n')
  
  // Show current products
  await listAllProducts()
  
  // Example updates (uncomment and modify as needed):
  
  // await updateProductLink(
  //   'Farad Beauty - מוצרי יופי טבעיים',
  //   'https://faradbeauty.com/?ref=AR10&campaign=lipedema',
  //   180 // new price
  // )
  
  // await updateProductLink(
  //   'מוצר אמזון 1 - B0D47VWKD7',
  //   'https://amazon.com/dp/B0D47VWKD7/ref=cm_sw_r_as_gl_apa_gl_i_NEWLINK?linkCode=ml1&tag=1210080-20'
  // )
  
  console.log('✅ Script completed!')
}

main().catch(console.error)