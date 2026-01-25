// Script to add Avital's affiliate products to the database
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  console.error('URL:', supabaseUrl ? 'Found' : 'Missing')
  console.error('Key:', supabaseKey ? 'Found' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Avital's affiliate products
const affiliateProducts = [
  {
    name: 'Farad Beauty - מוצרי יופי טבעיים',
    description: 'מוצרי יופי טבעיים איכותיים לטיפוח העור והגוף',
    price: 150, // מחיר משוער
    affiliate_link: 'https://faradbeauty.com/?ref=AR10',
    type: 'Physical',
    trigger_tags: ['יופי', 'טיפוח', 'עור', 'טבעי'],
    image_url: null,
    active: true
  },
  {
    name: 'מוצר אמזון 1 - B0D47VWKD7',
    description: 'מוצר מומלץ מאמזון לטיפול בליפאדמה',
    price: 89, // מחיר משוער בדולרים -> שקלים
    affiliate_link: 'https://amazon.com/dp/B0D47VWKD7/ref=cm_sw_r_as_gl_apa_gl_i_PJCWAVEZ4BYA3HAW17FM?linkCode=ml1&tag=1210080-20&linkId=8100e4092bd630e8d734a768be114314',
    type: 'Physical',
    trigger_tags: ['ליפאדמה', 'טיפול', 'אמזון'],
    image_url: null,
    active: true
  },
  {
    name: 'מוצר אמזון 2 - B0F8NMRYKQ',
    description: 'מוצר נוסף מאמזון לטיפול בליפאדמה',
    price: 65, // מחיר משוער בדולרים -> שקלים
    affiliate_link: 'https://www.amazon.com/dp/B0F8NMRYKQ/ref=cm_sw_r_as_gl_apa_gl_i_865MG9608RCEJQK2SC52?linkCode=ml1&tag=1210080-20&linkId=cfe8a3021ba614431d204e66e3d483f2',
    type: 'Physical',
    trigger_tags: ['ליפאדמה', 'טיפול', 'אמזון', 'פיזי'],
    image_url: null,
    active: true
  },
  {
    name: 'מוצר אמזון 3 - B0FFH5GCP7',
    description: 'מוצר שלישי מאמזון לטיפול בליפאדמה',
    price: 75, // מחיר משוער בדולרים -> שקלים
    affiliate_link: 'https://amazon.com/dp/B0FFH5GCP7/ref=cm_sw_r_as_gl_apa_gl_i_KGKN0D2227P2ADV5JS0C?linkCode=ml1&tag=1210080-20&linkId=f1c8c9cc0eda5e1193e70ee6e666fe96',
    type: 'Physical',
    trigger_tags: ['ליפאדמה', 'טיפול', 'אמזון', 'שיקום'],
    image_url: null,
    active: true
  }
]

async function addProducts() {
  console.log('Adding affiliate products to database...')
  
  try {
    for (const product of affiliateProducts) {
      console.log(`Adding product: ${product.name}`)
      
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
      
      if (error) {
        console.error(`Error adding ${product.name}:`, error)
      } else {
        console.log(`✓ Successfully added: ${product.name}`)
      }
    }
    
    console.log('\n✅ Finished adding products!')
    
    // Show all products
    const { data: allProducts } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('\n📋 All products in database:')
    allProducts?.forEach(product => {
      console.log(`- ${product.name} (${product.type}) - ₪${product.price}`)
    })
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

addProducts()
