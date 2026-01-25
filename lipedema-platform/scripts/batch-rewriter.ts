#!/usr/bin/env node
/**
 * Batch Article Rewriter
 * Scans MDX files, identifies weak articles (< 500 words), and rewrites them
 * into comprehensive 600+ word articles following Avital Rozen's voice.
 */

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

// Configuration - adjust these values to customize behavior
const CONFIG = {
  contentDir: path.join(process.cwd(), 'content/posts'),
  backupDir: path.join(process.cwd(), 'content/posts/.backup'),
  weakThreshold: 500,      // Articles below this word count are considered weak
  targetWordCount: 600,    // Minimum word count for rewritten articles
  dryRun: process.argv.includes('--dry-run'),  // Preview mode without file writes
}

// Types
interface ArticleFrontmatter {
  title: string
  description: string
  date: string
  category: 'nutrition' | 'diagnosis' | 'physical' | 'mindset'
  image: string
  keywords: string[]
  originalPostId?: string
  alt?: string
  tags?: string[]
}

interface MDXArticle {
  filePath: string
  slug: string
  frontmatter: ArticleFrontmatter
  content: string
  wordCount: number
}

interface ScanResult {
  total: number
  weak: MDXArticle[]
  strong: MDXArticle[]
}

/**
 * Counts Hebrew words in text content
 * Removes frontmatter and counts sequences of Hebrew characters (U+0590 to U+05FF)
 * Ignores nikud marks, punctuation, and non-Hebrew text
 */
function countHebrewWords(text: string): number {
  const contentOnly = text.replace(/^---[\s\S]*?---/, '').trim()
  const hebrewWordRegex = /[\u0590-\u05FF]+/g
  const matches = contentOnly.match(hebrewWordRegex)
  
  return matches ? matches.length : 0
}

/**
 * Scans content directory for MDX files and classifies them as weak or strong
 * Returns inventory with word counts and metadata for each article
 */
async function scanArticles(): Promise<ScanResult> {
  const files = await fs.readdir(CONFIG.contentDir)
  const mdxFiles = files.filter(f => f.endsWith('.mdx'))
  
  const articles: MDXArticle[] = []
  
  for (const file of mdxFiles) {
    const filePath = path.join(CONFIG.contentDir, file)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    
    const wordCount = countHebrewWords(content)
    const slug = file.replace('.mdx', '')
    
    articles.push({
      filePath,
      slug,
      frontmatter: data as ArticleFrontmatter,
      content,
      wordCount,
    })
  }
  
  const weak = articles.filter(a => a.wordCount < CONFIG.weakThreshold)
  const strong = articles.filter(a => a.wordCount >= CONFIG.weakThreshold)
  
  return {
    total: articles.length,
    weak,
    strong,
  }
}

// Category-specific content templates following Avital Rozen's voice
// Each template includes: Hook, Empathy, Science, and Protocol sections
const CATEGORY_TEMPLATES = {
  diagnosis: {
    hook: 'את מרגישה שמשהו לא בסדר, אבל אף רופא לא לוקח אותך ברצינות? הרגליים שלך נפוחות, כואבות, ושונות מהרגליים של כולם? את לא משוגעת, ואת לא לבד.',
    empathy: 'אני מכירה את התחושה הזו מקרוב. שנים של ביקורים אצל רופאים שאמרו לי "זה רק משקל" או "זה גנטי, אין מה לעשות". התסכול, הבושה, והתחושה שאף אחד לא מבין. אבל יש לי חדשות טובות: יש שם, יש אבחנה, ויש דרך להתמודד.',
    science: 'ליפאדמה היא מחלה כרונית של מערכת הלימפה שגורמת להצטברות לא תקינה של רקמת שומן, בעיקר ברגליים. זה לא "רק צלוליט" וזה לא קשור לתזונה או פעילות גופנית. המחלה משפיעה על כ-11% מהנשים בעולם, אבל רוב הרופאים לא מכירים אותה. הרקמה הפיברוטית שנוצרת גורמת לכאב, נפיחות, וקושי בתנועה.',
    protocol: 'האבחנה המדויקת היא הצעד הראשון. חפשי רופא שמכיר את המחלה - רופא כלי דם, פיזיותרפיסט לימפטי, או נטורופת מומחית. לאחר האבחנה, הטיפול כולל: עיסוי לימפטי קבוע, לבישת גרבי לחץ, תזונה אנטי-דלקתית, ותנועה עדינה. זה לא ריפוי, אבל זה שיפור משמעותי באיכות החיים.',
  },
  nutrition: {
    hook: 'את אוכלת "בריא", מתאמנת, אבל הנפיחות לא יורדת? הבטן תפוחה, הרגליים כבדות, והמשקל עולה למרות הכל? הבעיה היא לא בכמות האוכל, אלא במה שאת אוכלת.',
    empathy: 'אני יודעת כמה זה מתסכל. את עושה הכל "נכון" לפי המדריכים, אבל הגוף שלך לא משתף פעולה. זה לא חוסר משמעת, זו דלקתיות כרונית שהתזונה הרגילה רק מחמירה אותה. הגוף שלך זקוק לגישה אחרת.',
    science: 'דלקתיות כרונית היא אויב מספר אחד של מערכת הלימפה. מזונות מעובדים, סוכר, גלוטן, ומוצרי חלב יוצרים תגובה דלקתית שמחמירה את הבצקת והנפיחות. מנגד, תזונה עשירה בנוגדי חמצון, אומגה 3, וירקות עלים ירוקים מפחיתה דלקתיות ומשפרת את זרימת הלימפה.',
    protocol: 'התזונה האנטי-דלקתית שלי כוללת: הפחתה דרסטית של סוכר ומזונות מעובדים, הגברת צריכת ירקות (במיוחד עלים ירוקים), הוספת דגים שמנים ואגוזים, שתיית 2-3 ליטר מים ביום, והימנעות מגלוטן ומוצרי חלב למשך 30 יום לפחות. התוצאות מדברות בעד עצמן.',
  },
  physical: {
    hook: 'הרגליים שלך כבדות כמו עופרת? קשה לך לעלות מדרגות? התנועה הפכה למאמץ? את לא חלשה, את מתמודדת עם מערכת לימפה שלא עובדת כמו שצריך.',
    empathy: 'אני זוכרת ימים שבהם פשוט לקום מהכיסא היה מאתגר. הכאב, הכבדות, והתחושה שהגוף שלך עובד נגדך. אבל גיליתי שתנועה נכונה - לא אינטנסיבית, אלא מותאמת - יכולה לשנות הכל.',
    science: 'מערכת הלימפה שלך לא עובדת לבד - היא זקוקה לתנועת השרירים כדי לדחוף את הנוזלים. בניגוד למערכת הדם שיש לה לב שמזרים אותה, הלימפה תלויה בתנועה שלך. תנועה עדינה וקבועה מפעילה את משאבות הלימפה הטבעיות בגוף.',
    protocol: 'התנועה המומלצת: הליכה 20-30 דקות ביום, שחייה או אקווה-אירוביקה (המים יוצרים לחץ טבעי), יוגה עדינה או פילאטיס, ותרגילי נשימה עמוקה. הכלל: תנועה עדינה וקבועה עדיפה על אימון אינטנסיבי מדי פעם. תקשיבי לגוף שלך.',
  },
  mindset: {
    hook: 'את מרגישה שונה? מסתירה את הרגליים? נמנעת ממצבים חברתיים? המחלה הזו לא רק פיזית - היא משפיעה על הנפש, על הביטחון העצמי, ועל איכות החיים.',
    empathy: 'אני הייתי שם. הבושה, הייאוש, התחושה שאני לא מספיק טובה. שנים של הסתרה, של הימנעות, של תחושה שאני לבד. אבל למדתי שהמסע הזה הוא לא רק פיזי - הוא נפשי לא פחות.',
    science: 'מחקרים מראים שמחלות כרוניות משפיעות על בריאות הנפש באופן משמעותי. הקשר בין גוף לנפש הוא דו-כיווני - מתח ודיכאון מחמירים דלקתיות, ודלקתיות מחמירה מצב רוח. שבירת המעגל הזה היא חלק מהטיפול.',
    protocol: 'הטיפול הנפשי כולל: קבלה עצמית - את לא אשמה במחלה, קהילה - התחברות לנשים אחרות עם ליפאדמה, מיינדפולנס ומדיטציה להפחתת מתח, ייעוץ מקצועי בעת הצורך, וחגיגה של כל הישג קטן. את חזקה יותר ממה שאת חושבת.',
  },
}

/**
 * Generates comprehensive article content using category-specific templates
 * Follows five-part structure: Hook, Empathy, Science, Protocol, Bridge
 * Includes Q&A section and call-to-action
 */
async function generateArticleContent(article: MDXArticle): Promise<string> {
  const { frontmatter, content: originalContent } = article
  const template = CATEGORY_TEMPLATES[frontmatter.category] || CATEGORY_TEMPLATES.diagnosis
  
  // Generate improved title if current title is too short or generic
  const newTitle = frontmatter.title.length < 20 || frontmatter.title === 'ליפאדמה זה לא צחוק'
    ? generateBetterTitle(frontmatter, originalContent)
    : frontmatter.title
  
  const newContent = `# ${newTitle}

## הכאב שאת מרגישה

${template.hook}

${frontmatter.description && frontmatter.description.length > 50 ? frontmatter.description : ''}

כל יום את מתעוררת ומקווה שהיום יהיה שונה. שהנפיחות תרד, שהכאב יפחת, שהגוף שלך סוף סוף ישתף פעולה. אבל המציאות היא שליפאדמה ובעיות לימפה הן מחלות כרוניות שדורשות גישה שונה לחלוטין מכל דיאטה או תוכנית אימונים רגילה.

## אני מבינה אותך

${template.empathy}

המסע שלי עם ליפאדמה התחיל לפני שנים, כשעדיין לא ידעתי מה זה. עברתי ניתוחים כואבים, טיפולים אגרסיביים, והאשמות מרופאים שלא הבינו. אבל היום, אחרי שנים של לימוד, מחקר, והתנסות על עצמי, אני יכולה להגיד לך בביטחון: יש תקווה. יש דרך. ויש חיים טובים עם המחלה הזו.

## המדע מאחורי המחלה

${template.science}

הבנת המנגנון הזה היא קריטית. כשאת מבינה מה קורה בגוף שלך, את יכולה לקבל החלטות מושכלות לגבי הטיפול. מערכת הלימפה היא מערכת מורכבת שאחראית על ניקוי רעלים, הובלת נוזלים, ותפקוד מערכת החיסון. כשהיא לא עובדת כמו שצריך, כל הגוף סובל.

הרקמה הפיברוטית שנוצרת עם הזמן היא כמו צלקת פנימית - היא קשה, כואבת, ומקשה על זרימת הלימפה. זו הסיבה שדיאטה רגילה לא עוזרת - הבעיה היא לא בכמות הקלוריות, אלא במבנה הרקמה עצמה.

דלקתיות כרונית היא הגורם המרכזי להחמרה. כל מה שיוצר דלקת בגוף - מזון מעובד, מתח, חוסר שינה, רעלים סביבתיים - מחמיר את המצב. לכן הטיפול חייב להיות הוליסטי ולטפל בכל הגורמים האלה.

## מה את יכולה לעשות עכשיו

${template.protocol}

אבל זה לא מספיק. הטיפול בליפאדמה דורש גישה רב-מערכתית:

**עיסוי לימפטי מקצועי** - לא עיסוי רגיל, אלא עיסוי לימפטי ידני (MLD) שמבוצע על ידי פיזיותרפיסט מוסמך. זה הטיפול הכי יעיל שיש.

**גרבי לחץ** - כן, הם לא נוחים. כן, הם חמים. אבל הם עובדים. התרגלות לוקחת זמן, אבל התוצאות שוות את זה.

**תזונה אנטי-דלקתית** - הפחתה דרסטית של סוכר, גלוטן, ומוצרי חלב. הגברה של ירקות, דגים, ואגוזים. זה לא דיאטה, זה אורח חיים.

**תנועה מותאמת** - לא כושר אינטנסיבי, אלא תנועה עדינה וקבועה. הליכה, שחייה, יוגה. המטרה היא להזרים את הלימפה, לא לשרוף קלוריות.

**שינה איכותית** - 7-8 שעות בלילה. הגוף מתקן את עצמו בזמן השינה, והמערכת הלימפטית עובדת בשיא ביעילות בלילה.

**ניהול מתח** - מדיטציה, נשימות, יוגה, או כל דבר שעוזר לך להירגע. מתח מחמיר דלקתיות, ודלקתיות מחמירה את המחלה.

## הצעד הבא שלך

אני יודעת שזה נשמע הרבה. אני יודעת שזה מפחיד. אבל את לא צריכה לעשות את זה לבד.

במרפאה שלי, אני עובדת עם נשים עם ליפאדמה ובעיות לימפה כבר שנים. אני בונה תוכנית טיפול מותאמת אישית שלוקחת בחשבון את המצב הספציפי שלך, את אורח החיים שלך, ואת המטרות שלך. כל אישה היא עולם ומלואו, והטיפול צריך להיות מותאם בדיוק לצרכים שלך.

הטיפול כולל: ייעוץ תזונתי מותאם, תוכנית תנועה אישית, המלצות לטיפולים משלימים, ליווי צמוד לאורך כל הדרך, וקהילה של נשים שעוברות את אותו המסע.

## שאלות ותשובות נפוצות

### האם ליפאדמה יכולה להיעלם לגמרי?

ליפאדמה היא מחלה כרונית, ולכן לא ניתן "לרפא" אותה במובן המסורתי. אבל - וזה "אבל" גדול - ניתן לנהל אותה ולשפר משמעותית את איכות החיים. עם הטיפול הנכון, רוב הנשים רואות שיפור דרמטי בתסמינים: פחות נפיחות, פחות כאב, יותר תנועתיות, וחזרה לחיים מלאים. זה לא ריפוי, אבל זה חיים טובים.

### כמה זמן לוקח לראות שיפור?

זה משתנה מאישה לאישה, תלוי בחומרת המצב ובעקביות הטיפול. בדרך כלל, תתחילי לראות שינויים קטנים תוך 2-3 שבועות - פחות נפיחות בבוקר, קצת פחות כאב. שיפור משמעותי לוקח בדרך כלל 2-3 חודשים של טיפול עקבי. הסבלנות היא המפתח - זו מחלה כרונית שהתפתחה שנים, והיא לא תיעלם בן לילה.

### האם דיאטה רגילה יכולה לעזור?

לא. זו אחת התפיסות המוטעות הכי נפוצות. ליפאדמה היא לא "רק משקל", והיא לא תגיב לדיאטה רגילה. למעשה, דיאטות קיצוניות יכולות להחמיר את המצב. מה שכן עוזר זו תזונה אנטי-דלקתית ספציפית, בשילוב עם עיסוי לימפטי, תנועה מותאמת, וגרבי לחץ. זו גישה הוליסטית, לא דיאטה.

### האם אני צריכה לקחת תוספי תזונה?

תוספי תזונה יכולים לעזור, אבל הם לא תחליף לתזונה נכונה ולטיפול מקיף. אני בדרך כלל ממליצה על: אומגה 3 (להפחתת דלקתיות), ויטמין D (רוב הנשים עם ליפאדמה סובלות ממחסור), מגנזיום (לשיפור שינה והפחתת כאב), ופרוביוטיקה (לבריאות המעיים). אבל - וזה חשוב - רק אחרי בדיקת דם ובהתאמה אישית. לא כל תוסף מתאים לכל אישה.

### האם יש תרופות לליפאדמה?

נכון להיום, אין תרופה ספציפית שמאושרת לטיפול בליפאדמה. יש מחקרים על תרופות שונות, אבל הטיפול העיקרי הוא שמרני: עיסוי לימפטי, גרבי לחץ, תזונה, ותנועה. במקרים קיצוניים, ניתן לשקול ניתוח (ליפוסוקציה מיוחדת), אבל זה לא פתרון לכולן. הגישה השמרנית היא הבסיס, והיא עובדת.

---

**לקביעת תור לייעוץ אישי ובניית תוכנית טיפול מותאמת, שלחי הודעה לאביטל רוזן.**

*המידע במאמר זה הוא למטרות חינוכיות בלבד ואינו מהווה תחליף לייעוץ רפואי מקצועי.*`

  return newContent
}

/**
 * Generates SEO-optimized title based on article category
 * Returns random title from category-specific title pool
 */
function generateBetterTitle(frontmatter: ArticleFrontmatter, content: string): string {
  const categoryTitles = {
    diagnosis: [
      'המדריך המלא לאבחון ליפאדמה - כל מה שצריך לדעת',
      'איך לדעת אם יש לי ליפאדמה? סימנים ואבחון',
      'ליפאדמה: המחלה שרופאים לא מכירים',
      'האבחנה ששינתה את חיי - הסיפור שלי עם ליפאדמה',
    ],
    nutrition: [
      'התזונה שמפחיתה נפיחות ודלקתיות בליפאדמה',
      'מה לאכול כשיש ליפאדמה? המדריך המלא',
      'תזונה אנטי-דלקתית לליפאדמה - תוכנית מעשית',
      'המזונות שמחמירים ליפאדמה (ומה לאכול במקום)',
    ],
    physical: [
      'התנועה הנכונה לליפאדמה - מדריך מעשי',
      'איך לזרום את הלימפה בתנועה עדינה',
      'עיסוי לימפטי בבית - טכניקות שעובדות',
      'הפעילות הגופנית שמשפרת ליפאדמה',
    ],
    mindset: [
      'איך להתמודד נפשית עם ליפאדמה',
      'מליפאדמה לחיים מלאים - המסע הנפשי',
      'את לא לבד: קהילת נשים עם ליפאדמה',
      'לחיות עם ליפאדמה בביטחון ושמחה',
    ],
  }
  
  const titles = categoryTitles[frontmatter.category] || categoryTitles.diagnosis
  return titles[Math.floor(Math.random() * titles.length)]
}

/**
 * Creates timestamped backup of original file before modification
 * Ensures backup directory exists and returns backup file path
 */
async function createBackup(filePath: string): Promise<string> {
  await fs.mkdir(CONFIG.backupDir, { recursive: true })
  
  const fileName = path.basename(filePath)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(CONFIG.backupDir, `${fileName}.${timestamp}.backup`)
  
  await fs.copyFile(filePath, backupPath)
  return backupPath
}

/**
 * Rewrites a single article with comprehensive content
 * Creates backup before modification and validates word count
 */
async function rewriteArticle(article: MDXArticle): Promise<void> {
  console.log(`\n📝 Rewriting: ${article.slug}`)
  console.log(`   Current word count: ${article.wordCount}`)
  
  // Generate new comprehensive content using category-specific templates
  const newContent = await generateArticleContent(article)
  const newWordCount = countHebrewWords(newContent)
  
  console.log(`   New word count: ${newWordCount}`)
  
  // Validate generated content meets minimum requirements
  if (newWordCount < CONFIG.targetWordCount) {
    console.log(`   ⚠️  Warning: Generated content is below target (${newWordCount} < ${CONFIG.targetWordCount})`)
  }
  
  // Reconstruct MDX file with preserved frontmatter
  const fullContent = matter.stringify(newContent, article.frontmatter)
  
  if (CONFIG.dryRun) {
    console.log(`   🔍 DRY RUN - Would write ${newWordCount} words`)
    return
  }
  
  // Create timestamped backup before any modifications
  const backupPath = await createBackup(article.filePath)
  console.log(`   💾 Backup created: ${path.basename(backupPath)}`)
  
  // Write new content to original file path
  await fs.writeFile(article.filePath, fullContent, 'utf-8')
  console.log(`   ✅ Article rewritten successfully`)
}

/**
 * Main execution function
 * Scans articles, identifies weak ones, and rewrites them sequentially
 * Supports dry-run mode for preview without file modifications
 */
async function main() {
  console.log('🚀 Batch Article Rewriter')
  console.log('=' .repeat(50))
  console.log(`Content directory: ${CONFIG.contentDir}`)
  console.log(`Weak threshold: ${CONFIG.weakThreshold} words`)
  console.log(`Target word count: ${CONFIG.targetWordCount} words`)
  console.log(`Dry run: ${CONFIG.dryRun ? 'YES' : 'NO'}`)
  console.log('=' .repeat(50))
  
  // Scan articles
  console.log('\n📊 Scanning articles...')
  const result = await scanArticles()
  
  console.log(`\nTotal articles: ${result.total}`)
  console.log(`Strong articles (>= ${CONFIG.weakThreshold} words): ${result.strong.length}`)
  console.log(`Weak articles (< ${CONFIG.weakThreshold} words): ${result.weak.length}`)
  
  if (result.weak.length === 0) {
    console.log('\n✨ No weak articles found! All articles meet the threshold.')
    return
  }
  
  // List weak articles
  console.log('\n📋 Weak articles to rewrite:')
  result.weak.forEach((article, index) => {
    console.log(`${index + 1}. ${article.slug} (${article.wordCount} words)`)
  })
  
  // Rewrite articles
  console.log('\n🔄 Starting batch rewrite...')
  let successful = 0
  let failed = 0
  
  for (const article of result.weak) {
    try {
      await rewriteArticle(article)
      successful++
    } catch (error) {
      console.log(`   ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      failed++
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 SUMMARY')
  console.log('='.repeat(50))
  console.log(`Total processed: ${result.weak.length}`)
  console.log(`Successful: ${successful}`)
  console.log(`Failed: ${failed}`)
  console.log('\n✨ Batch rewrite complete!')
}

// Run
main().catch(console.error)
