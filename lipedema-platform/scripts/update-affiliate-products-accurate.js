// Script to update affiliate products with accurate information based on research
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

// Updated product information based on research
const updatedProducts = [
  {
    oldName: 'Farad Beauty - מוצרי יופי טבעיים',
    newData: {
      name: 'FaradBeauty מברשת לימפה מחוממת',
      description: 'מברשת לימפה מחוממת עם טכנולוגיה 4-ב-1: חום, רטט, מיקרו-זרם ואור אדום. מעודדת ניקוז לימפתי, מפחיתה נפיחות ומשפרת את מראה העור',
      price: 480, // $129 USD ≈ ₪480
      affiliate_link: 'https://faradbeauty.com/?ref=AR10',
      type: 'Physical',
      trigger_tags: ['לימפה', 'ניקוז לימפתי', 'נפיחות', 'עיסוי', 'חום', 'רטט', 'ליפאדמה'],
      image_url: null,
      active: true
    }
  },
  {
    oldName: 'מוצר אמזון 1 - B0D47VWKD7',
    newData: {
      name: 'שרוול דחיסה רפואי לזרוע - ליפאדמה ולימפדמה',
      description: 'שרוול דחיסה רפואי 15-20 mmHg לטיפול בליפאדמה ולימפדמה. מספק תמיכה מדורגת מהיד עד הכתף, משפר זרימת דם ומפחית נפיחות',
      price: 320, // מחיר משוער לשרוול דחיסה איכותי
      affiliate_link: 'https://amazon.com/dp/B0D47VWKD7/ref=cm_sw_r_as_gl_apa_gl_i_PJCWAVEZ4BYA3HAW17FM?linkCode=ml1&tag=1210080-20&linkId=8100e4092bd630e8d734a768be114314',
      type: 'Physical',
      trigger_tags: ['דחיסה', 'שרוול', 'זרוע', 'ליפאדמה', 'לימפדמה', 'נפיחות', 'זרימת דם'],
      image_url: null,
      active: true
    }
  },
  {
    oldName: 'מוצר אמזון 2 - B0F8NMRYKQ',
    newData: {
      name: 'גרבי דחיסה רפואיות לליפאדמה',
      description: 'גרבי דחיסה רפואיות 20-30 mmHg מיוחדות לטיפול בליפאדמה ולימפדמה ברגליים. עשויות מחומרים נושמים ומספקות תמיכה אופטימלית',
      price: 240, // מחיר משוער לגרבי דחיסה רפואיות
      affiliate_link: 'https://www.amazon.com/dp/B0F8NMRYKQ/ref=cm_sw_r_as_gl_apa_gl_i_865MG9608RCEJQK2SC52?linkCode=ml1&tag=1210080-20&linkId=cfe8a3021ba614431d204e66e3d483f2',
      type: 'Physical',
      trigger_tags: ['גרבי דחיסה', 'רגליים', 'ליפאדמה', 'לימפדמה', 'דחיסה רפואית', 'נפיחות'],
      image_url: null,
      active: true
    }
  },
  {
    oldName: 'מוצר אמזון 3 - B0FFH5GCP7',
    newData: {
      name: 'תחבושות דחיסה קצרות למפדמה',
      description: 'סט תחבושות דחיסה קצרות מיוחדות לטיפול בליפאדמה ולימפדמה. כוללות תחבושות אלסטיות, רפידות וסרט לקיבוע - מערכת דחיסה רב-שכבתית',
      price: 280, // מחיר משוער לסט תחבושות מקצועי
      affiliate_link: 'https://amazon.com/dp/B0FFH5GCP7/ref=cm_sw_r_as_gl_apa_gl_i_KGKN0D2227P2ADV5JS0C?linkCode=ml1&tag=1210080-20&linkId=f1c8c9cc0eda5e1193e70ee6e666fe96',
      type: 'Physical',
      trigger_tags: ['תחבושות דחיסה', 'דחיסה רב-שכבתית', 'ליפאדמה', 'לימפדמה', 'טיפול מקצועי'],
      image_url: null,
      active: true
    }
  }
]

// Additional high-quality products to add
const newProducts = [
  {
    name: 'FaradBeauty מסכת LED לטיפוח פנים',
    description: 'מסכת LED קלת משקל (93 גרם) עם 4 סוגי אור לטיפוח העור. נושמת, עמידה למים ומתאימה לשימוש יומיומי',
    price: 620, // $167 USD ≈ ₪620
    affiliate_link: 'https://faradbeauty.com/products/luxehalo-led-mask?ref=AR10',
    type: 'Physical',
    trigger_tags: ['LED', 'טיפוח פנים', 'אור אדום', 'אנטי אייג\'ינג', 'עור'],
    image_url: null,
    active: true
  },
  {
    name: 'JOBST Elvarex Soft - גרבי דחיסה רכות',
    description: 'גרבי דחיסה רפואיות מיוחדות לליפאדמה עם חומרים רכים לעור רגיש. המותג המוביל בעולם לטיפול בליפאדמה ולימפדמה',
    price: 450, // מחיר משוער למוצר JOBST איכותי
    affiliate_link: 'https://amazon.com/s?k=JOBST+Elvarex+Soft&tag=1210080-20',
    type: 'Physical',
    trigger_tags: ['JOBST', 'גרבי דחיסה', 'עור רגיש', 'ליפאדמה', 'לימפדמה', 'איכות פרימיום'],
    image_url: null,
    active: true
  },
  {
    name: 'Lympha Press Optimal Plus - מכשיר דחיסה פנאומטי',
    description: 'מכשיר דחיסה פנאומטי מתקדם לטיפול בליפאדמה ולימפדמה. אושר FDA לטיפול בליפאדמה בארה"ב',
    price: 12000, // מחיר משוער למכשיר מקצועי
    affiliate_link: 'https://amazon.com/s?k=Lympha+Press+Optimal+Plus&tag=1210080-20',
    type: 'Physical',
    trigger_tags: ['מכשיר דחיסה', 'פנאומטי', 'ליפאדמה', 'לימפדמה', 'FDA', 'מקצועי'],
    image_url: null,
    active: true
  }
]

async function updateProducts() {
  console.log('🔄 Updating affiliate products with accurate information...\n')
  
  try {
    // Update existing products
    for (const update of updatedProducts) {
      console.log(`Updating: ${update.oldName} → ${update.newData.name}`)
      
      const { data, error } = await supabase
        .from('products')
        .update(update.newData)
        .eq('name', update.oldName)
        .select()
      
      if (error) {
        console.error(`❌ Error updating ${update.oldName}:`, error)
      } else if (data && data.length > 0) {
        console.log(`✅ Successfully updated: ${update.newData.name}`)
      } else {
        console.log(`⚠️  Product not found: ${update.oldName}`)
      }
    }
    
    console.log('\n➕ Adding new high-quality products...\n')
    
    // Add new products
    for (const product of newProducts) {
      console.log(`Adding: ${product.name}`)
      
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
      
      if (error) {
        console.error(`❌ Error adding ${product.name}:`, error)
      } else {
        console.log(`✅ Successfully added: ${product.name}`)
      }
    }
    
    console.log('\n🎉 Finished updating products!')
    
    // Show all products
    const { data: allProducts } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('\n📋 All products in database:')
    allProducts?.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   Type: ${product.type} | Price: ₪${product.price} | Active: ${product.active}`)
      console.log(`   Tags: ${(product.trigger_tags || []).join(', ')}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

updateProducts()
