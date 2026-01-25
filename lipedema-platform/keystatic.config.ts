import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: 'ליפאדמה - ניהול תוכן',
    },
  },
  collections: {
    // Main posts collection - content/posts (Keystatic managed)
    posts: collection({
      label: 'מאמרים',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ 
          name: { label: 'כותרת המאמר' },
        }),
        date: fields.date({ 
          label: 'תאריך פרסום',
          defaultValue: { kind: 'today' },
        }),
        description: fields.text({ 
          label: 'תקציר ל-SEO (עד 155 תווים)', 
          multiline: true,
          validation: { length: { max: 160 } },
        }),
        image: fields.image({
          label: 'תמונה ראשית',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        alt: fields.text({
          label: 'טקסט חלופי לתמונה',
          description: 'תיאור התמונה לנגישות ו-SEO',
        }),
        category: fields.select({
          label: 'קטגוריה',
          options: [
            { label: 'אבחון', value: 'diagnosis' },
            { label: 'תזונה', value: 'nutrition' },
            { label: 'טיפול פיזי', value: 'physical' },
            { label: 'גוף-נפש', value: 'mindset' },
          ],
          defaultValue: 'diagnosis',
        }),
        tags: fields.array(fields.text({ label: 'תגית' }), {
          label: 'תגיות',
          itemLabel: (props) => props.value,
        }),
        keywords: fields.array(fields.text({ label: 'מילת מפתח' }), {
          label: 'מילות מפתח ל-SEO',
          itemLabel: (props) => props.value,
        }),
        originalPostId: fields.text({
          label: 'מזהה אינסטגרם',
          description: 'מזהה הפוסט המקורי באינסטגרם',
        }),
        content: fields.mdx({
          label: 'תוכן המאמר',
          options: {
            bold: true,
            italic: true,
            strikethrough: true,
            code: true,
            heading: [2, 3, 4],
            blockquote: true,
            orderedList: true,
            unorderedList: true,
            table: true,
            link: true,
            image: true,
            divider: true,
          },
        }),
      },
    }),
    // Products collection
    products: collection({
      label: 'מוצרים ושירותים',
      slugField: 'name',
      path: 'content/products/*',
      format: { contentField: 'description' },
      schema: {
        name: fields.slug({ 
          name: { label: 'שם המוצר' },
        }),
        type: fields.select({
          label: 'סוג מוצר',
          options: [
            { label: 'קישור שותפים (חיצוני)', value: 'affiliate' },
            { label: 'מוצר דיגיטלי (קובץ/קורס)', value: 'digital' },
            { label: 'שירות / תור לקליניקה', value: 'service' },
          ],
          defaultValue: 'affiliate',
        }),
        price: fields.number({
          label: 'מחיר (₪)',
          description: 'השאירי 0 אם צריך ליצור קשר למחיר',
          defaultValue: 0,
        }),
        actionUrl: fields.url({
          label: 'קישור יעד',
          description: 'קישור שותפים / Calendly / WhatsApp',
        }),
        buttonText: fields.text({
          label: 'טקסט כפתור',
          description: 'לדוגמה: "קנו באמזון" או "קבעו פגישה"',
          defaultValue: 'למידע נוסף',
        }),
        isFeatured: fields.checkbox({
          label: 'להציג בדף הבית?',
          defaultValue: false,
        }),
        image: fields.image({
          label: 'תמונת מוצר',
          directory: 'public/images/products',
          publicPath: '/images/products/',
        }),
        description: fields.mdx({
          label: 'תיאור המוצר',
          options: {
            bold: true,
            italic: true,
            link: true,
            orderedList: true,
            unorderedList: true,
          },
        }),
      },
    }),
  },
});
