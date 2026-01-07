
-- Create posts table if not exists
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    awareness_level TEXT,
    monetization_strategy TEXT,
    meta_description TEXT,
    keywords TEXT[],
    estimated_reading_time INTEGER,
    original_instagram_id TEXT,
    original_url TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);


-- Insert article: למה מתח עלול לפגוע בך יותר מלעזור...
INSERT INTO posts (
    title, subtitle, content, slug, category, awareness_level,
    monetization_strategy, meta_description, keywords, estimated_reading_time,
    original_instagram_id, original_url, image_url, published, featured
) VALUES (
    $$למה מתח עלול לפגוע בך יותר מלעזור$$,
    $$הבעיה שלא מדברים עליה ומה שאת יכולה לעשות בנושא$$,
    $$**את מרגישה שמשהו לא בסדר, אבל לא יודעת בדיוק מה?**

הבעיה מתחילה כשאת מתחילה לשים לב שקיצרתי את ההרצאה השלמה שלי שעורכת כמעט שעתיים לתוך סירטון של 10 דק', אם נשארתם עד הסוף,  שאפו! הבריאות שלכם באמת חשובה לכם. זה לא משהו שקורה בין לילה, אלא תהליך הדרגתי שרבות מאיתנו חוות.

### למה זה קורה?

ליפאדמה היא מחלה כרונית של מערכת הלימפה שגורמת להצטברות נוזלים ברקמות. זה לא קשור למשקל או לאורח חיים, אלא למבנה גנטי של מערכת הלימפה.

### התסמינים שלא קישרת

התסמינים שעלולים להופיע:

- **מתח** - תחושה שמלווה אותך יום יום

אם את מזהה חלק מהתסמינים האלה, את לא לבד. זה חלק מהתמונה הגדולה יותר.

### מה את יכולה לעשות עכשיו?

**תפני לרופא מומחה** - אבחון מוקדם חשוב
**תתעדי תסמינים** - כדי לעזור לרופא להבין
**תלמדי על המחלה** - ידע זה כוח
**תחפשי קבוצת תמיכה** - את לא לבד במסע הזה


---

**רוצה ליווי אישי ומקצועי?** אני כאן כדי לעזור לך למצוא את הדרך הנכונה בשבילך. [לחצי כאן לייעוץ אישי](clinic)$$,
    'למה-מתח-עלול-לפגוע-בך-יותר-מלעזור',
    'diagnosis',
    'problem',
    'High Ticket (Clinic Lead)',
    $$למה מתח עלול לפגוע בך יותר מלעזור | מידע מקצועי על אבחון וטיפול בליפאדמה. הכרת התסמינים והדרך לטיפול נכון מאביטל רוזן.$$,
    '{"בריאות נשים","אבחון","טיפול רפואי","נטורופתיה","ליפאדמה","תסמינים","בריא","מומחה","אליו","בדיקות"}',
    1,
    '3564205224647314415',
    'https://www.instagram.com/p/DF2mcSRscvv/',
    'https://scontent-mia3-2.cdninstagram.com/v/t51.2885-15/475324270_18486483586026233_5347722524130950284_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-mia3-2.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2QGPsGAXmhbWgzmqft0H_6fzSPDz9PbzdDYNoy7FC_n7ZTDfwiq6BsiDlvMiAHgcfazjzSAt0E6P5hdQHRo2ThAt&_nc_ohc=YtQ1W4VAIhYQ7kNvwFalUyg&_nc_gid=ni0VU_c2YpuSrtSNtY98aA&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfplahqpdqNRwLZYVk_lAJgxipaIkJo7FKj_AH-5ao_6Yg&oe=695F5A13&_nc_sid=10d13b',
    false,
    false
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    category = EXCLUDED.category,
    awareness_level = EXCLUDED.awareness_level,
    monetization_strategy = EXCLUDED.monetization_strategy,
    meta_description = EXCLUDED.meta_description,
    keywords = EXCLUDED.keywords,
    estimated_reading_time = EXCLUDED.estimated_reading_time,
    updated_at = NOW();


-- Insert article: המדריך המלא לבריאות...
INSERT INTO posts (
    title, subtitle, content, slug, category, awareness_level,
    monetization_strategy, meta_description, keywords, estimated_reading_time,
    original_instagram_id, original_url, image_url, published, featured
) VALUES (
    $$המדריך המלא לבריאות$$,
    $$המידע המעשי שתצטרכי כדי להתחיל$$,
    $$**מחפשת פתרון פשוט ויעיל? הנה בדיוק מה שאת צריכה.**

### למה זה עובד כל כך טוב?

תנועה עדינה ועיסוי עובדים כי הם מעודדים את זרימת הלימפה והדם. זה כמו לפתוח ברזים שהיו סתומים - הנוזלים מתחילים לזרום שוב בחופשיות.

### המדריך המעשי

1. מה חשוב לדעת👌
ניתן להשאיל מכשיר מיד שרה- התחילי בהשכרה קצרת טווח - זו הדרך הכי חכמה לבדוק אם המכשיר מתאים לך ללא השקעה כספית גדולה

זכאות: ניתן לבדוק זכאות להחזר במסגרת סל הבריאות (כמו בכללית) אם ישנו מצב רפואי מתאים
2. טיפ לרכישה
מומלץ להתייעץ עם איש מקצוע (רופא/פיזיותרפיסט) כדי להתאים את המכשיר הנכון לצרכים הרפואיים הספציפיים שלך, ולהשוות בין הדגמים השונים המוצעים

### טיפים לשימוש מיטבי

**תתחילי לאט** - עדיף להתקדם בהדרגה
**תשימי לב לתחושות** - אי נוחות זה בסדר, כאב זה לא
**תהיי עקבית** - 10 דקות כל יום עדיף משעה פעם בשבוע
**תתאימי לעצמך** - כל גוף שונה ויש לו צרכים שונים


---

**רוצה את המוצרים המדויקים שאני ממליצה?** הכנתי בשבילך רשימה של המוצרים הכי איכותיים. [לרשימת המוצרים](products)$$,
    'המדריך-המלא-לבריאות',
    'physical',
    'product',
    'Affiliate (Products)',
    $$המדריך המלא לבריאות | טיפול פיזי וטכניקות שיקום לליפאדמה. עיסויים, תנועה ופתרונות מעשיים מאביטל רוזן נטורופתית.$$,
    '{"לימפה","בריאות נשים","מכשירי","מציעים","נטורופתיה","נפיחות","ליפאדמה","תנועה","עיסוי","שיקום"}',
    1,
    '3801283406567593370',
    'https://www.instagram.com/p/DTA3x5DDFWa/',
    'https://scontent-hou1-1.cdninstagram.com/v/t51.2885-15/610801461_18551130877026233_5192102174102877798_n.heic?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=scontent-hou1-1.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2QFgM4ywASDfMugxDGt3uhFTH7m0a3w391YCESSXKi248RPgqf0GBLJkvEYoSLAxJmc&_nc_ohc=-6Jkh0mDLhsQ7kNvwH3dVXk&_nc_gid=7nb3FtXjWYqzNnBXj2sy3w&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfppT8lXxyy3Xr6o3r2VjOZQvb1d7hTxACfNBmmCwNoh9w&oe=695F4BDB&_nc_sid=10d13b',
    false,
    false
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    category = EXCLUDED.category,
    awareness_level = EXCLUDED.awareness_level,
    monetization_strategy = EXCLUDED.monetization_strategy,
    meta_description = EXCLUDED.meta_description,
    keywords = EXCLUDED.keywords,
    estimated_reading_time = EXCLUDED.estimated_reading_time,
    updated_at = NOW();


-- Insert article: למה דלקת עלול לפגוע בך יותר מלעזור...
INSERT INTO posts (
    title, subtitle, content, slug, category, awareness_level,
    monetization_strategy, meta_description, keywords, estimated_reading_time,
    original_instagram_id, original_url, image_url, published, featured
) VALUES (
    $$למה דלקת עלול לפגוע בך יותר מלעזור$$,
    $$הבעיה שלא מדברים עליה ומה שאת יכולה לעשות בנושא$$,
    $$**את מרגישה שמשהו לא בסדר, אבל לא יודעת בדיוק מה?**

הבעיה מתחילה כשאת מתחילה לשים לב שמזונות אלה משפרים עיכול, מחזקים מערכת חיסונית ומפחיתים דלקת, אך כמו בכל דבר בחיים -מינון-. זה לא משהו שקורה בין לילה, אלא תהליך הדרגתי שרבות מאיתנו חוות.

### למה זה קורה?

מחקרים מראים שהמזון שאנחנו אוכלות משפיע ישירות על רמות הדלקת בגוף. כשאנחנו צורכות מזונות מסוימים, הגוף מגיב בדלקתיות שיכולה להחמיר תסמינים קיימים.

### התסמינים שלא קישרת

התסמינים שעלולים להופיע:

- **דלקת** - תחושה שמלווה אותך יום יום
- **עיכול** - תחושה שמלווה אותך יום יום

אם את מזהה חלק מהתסמינים האלה, את לא לבד. זה חלק מהתמונה הגדולה יותר.

### מה את יכולה לעשות עכשיו?

**תתחילי לקרוא תוויות** - תבדקי מה באמת יש במוצרים שלך
**תשלבי מזונות אנטי דלקתיים** - דגים שומניים, ירקות עלים ירוקים
**תפחיתי מזונות מעובדים** - ככל שהמזון פשוט יותר, טוב יותר לגוף
**תשתי מים עם מינרלים** - כדי לפצות על מה שהגוף מאבד


---

**רוצה מדריך מפורט עם כל הטיפים והמתכונים?** הספר הדיגיטלי שלי מכיל הכל במקום אחד. [לפרטים על הספר](digital-guide)$$,
    'למה-דלקת-עלול-לפגוע-בך-יותר-מלעזור',
    'nutrition',
    'problem',
    'Low Ticket (Digital Guide)',
    $$למה דלקת עלול לפגוע בך יותר מלעזור | מדריך תזונה מקצועי לנשים עם ליפאדמה. טיפים מעשיים, מתכונים בריאים ומידע מבוסס מחקר מאביטל רוזן.$$,
    '{"בריאות נשים","דלקת","שלהם","נטורופתיה","ליפאדמה","ויטמינים","אוקסלט","אביטל רוזן","תזונה בריאה","עיכול"}',
    1,
    '3688847223521781858',
    'https://www.instagram.com/p/DMxawFks6hi/',
    'https://instagram.fjan1-1.fna.fbcdn.net/v/t51.2885-15/526124947_1345138670955279_7004994508902769200_n.heic?stp=dst-jpg_e35_s1080x1080_tt6&_nc_ht=instagram.fjan1-1.fna.fbcdn.net&_nc_cat=103&_nc_oc=Q6cZ2QHEPkp-CwGQ2RQpG49ZFi7svEGHQOEbRknLbhJdeIKO4rroz4ibDLoBdckkDRS3aOY&_nc_ohc=t0MT0A30348Q7kNvwFQT7vJ&_nc_gid=JhekMmgmPAwNvK8nQMKNxw&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfoWnbdhRG326qsI4J6NtKA6jcsecQl52gJpp1Rni-Sh0A&oe=695F409F&_nc_sid=10d13b',
    false,
    false
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    category = EXCLUDED.category,
    awareness_level = EXCLUDED.awareness_level,
    monetization_strategy = EXCLUDED.monetization_strategy,
    meta_description = EXCLUDED.meta_description,
    keywords = EXCLUDED.keywords,
    estimated_reading_time = EXCLUDED.estimated_reading_time,
    updated_at = NOW();


-- Insert article: המדריך המלא לכאב...
INSERT INTO posts (
    title, subtitle, content, slug, category, awareness_level,
    monetization_strategy, meta_description, keywords, estimated_reading_time,
    original_instagram_id, original_url, image_url, published, featured
) VALUES (
    $$המדריך המלא לכאב$$,
    $$המידע המעשי שתצטרכי כדי להתחיל$$,
    $$**מחפשת פתרון פשוט ויעיל? הנה בדיוק מה שאת צריכה.**

### למה זה עובד כל כך טוב?

תנועה עדינה ועיסוי עובדים כי הם מעודדים את זרימת הלימפה והדם. זה כמו לפתוח ברזים שהיו סתומים - הנוזלים מתחילים לזרום שוב בחופשיות.

### המדריך המעשי

1. התחילי בהדרגה ובקצב שמתאים לך
2. תקשיבי לגוף שלך ותתאימי בהתאם
3. תהיי עקבית - עדיף מעט כל יום מאשר הרבה פעם בשבוע
4. תחפשי תמיכה ממומחים או מקבוצת נשים
5. תהיי סבלנית - שינוי אמיתי לוקח זמן

### טיפים לשימוש מיטבי

**תתחילי לאט** - עדיף להתקדם בהדרגה
**תשימי לב לתחושות** - אי נוחות זה בסדר, כאב זה לא
**תהיי עקבית** - 10 דקות כל יום עדיף משעה פעם בשבוע
**תתאימי לעצמך** - כל גוף שונה ויש לו צרכים שונים


---

**רוצה את המוצרים המדויקים שאני ממליצה?** הכנתי בשבילך רשימה של המוצרים הכי איכותיים. [לרשימת המוצרים](products)$$,
    'המדריך-המלא-לכאב',
    'physical',
    'product',
    'Affiliate (Products)',
    $$המדריך המלא לכאב | טיפול פיזי וטכניקות שיקום לליפאדמה. עיסויים, תנועה ופתרונות מעשיים מאביטל רוזן נטורופתית.$$,
    '{"לימפה","בריאות נשים","ביתיים","נטורופתיה","נפיחות","זהירות","ליפאדמה","תנועה","עיסוי","שיקום"}',
    1,
    '3756378655711565241',
    'https://www.instagram.com/p/DQhVnw3jBW5/',
    'https://scontent-lga3-2.cdninstagram.com/v/t51.2885-15/572158635_18539341678026233_3315816284797298584_n.heic?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2QH_dTLXO9ioAVV_3m0Frx27Zz1S9as2axycrMwQi9PmdMRXT_lwEQalF77I_4K--Uk&_nc_ohc=xcpp1vxVzeoQ7kNvwHj-Il-&_nc_gid=kam-ylKdtkVxthfkj0cw2w&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfpSErBiR_0lecIuubpZaUz1VOEWtZhyCpvUfepDcdjgSg&oe=695F4445&_nc_sid=10d13b',
    false,
    false
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    category = EXCLUDED.category,
    awareness_level = EXCLUDED.awareness_level,
    monetization_strategy = EXCLUDED.monetization_strategy,
    meta_description = EXCLUDED.meta_description,
    keywords = EXCLUDED.keywords,
    estimated_reading_time = EXCLUDED.estimated_reading_time,
    updated_at = NOW();


-- Insert article: איך ליפאדמה שינה את החיים שלי...
INSERT INTO posts (
    title, subtitle, content, slug, category, awareness_level,
    monetization_strategy, meta_description, keywords, estimated_reading_time,
    original_instagram_id, original_url, image_url, published, featured
) VALUES (
    $$איך ליפאדמה שינה את החיים שלי$$,
    $$המסע האישי שלי והכלים שעזרו לי להתמודד$$,
    $$**הסיפור שלי עם הבעיה הזו התחיל לפני כמה שנים...**

### המסע שהוביל אותי לפתרון

גם אני הייתי שם. הרגשתי שמשהו לא בסדר, אבל לא ידעתי בדיוק מה. רופאים אמרו לי שזה נורמלי, שזה חלק מלהיות אישה, שזה קשור למשקל או לגיל.

אבל אני ידעתי שזה לא נכון. הגוף שלי צעק אליי, והרגשתי שאני לא מקבלת את התשובות שאני צריכה.

אז התחלתי לחפש בעצמי. קראתי מחקרים, התייעצתי עם מומחים, וחשוב מכל - התחלתי להקשיב לגוף שלי באמת.

### הפתרון שמצאתי

הפתרון שמצאתי היה פשוט יותר ממה שחשבתי. קראתי כל מחקר אפשרי (עדיין, כל הזמן יוצאים חדשים), למדתי את גוף האישה מחדש (למרות ה4 שנים לימודים שלי), שמעתי כל ראיון או פודקסט וקראתי כל עדות של נשים עם ליפאדמה שיכולתי,קראתי כל מאמר מדעי של מומחים וחוקרים ברחבי העולם וחייתי את חיי בתחושת ייעוד ענקית - להעניק לנשים חולות ליפאדמה את ההקלה, הביטחון, הבריאות והאיכות חיים שמגיעה להן!

אני מכירה את ההרגשה שלכן. זה לא קרה בין לילה, אבל בהדרגה התחלתי לראות שינוי.

### התוצאות שקיבלתי

התוצאות שקיבלתי:

**הפחתה בנפיחות** - הרגליים מרגישות קלות יותר
**שיפור בכאבים** - פחות אי נוחות יום יומית
**תחושת קלילות** - הגוף זז בקלות רבה יותר
**שיפור בזרימה** - תחושה של חיוניות

השינוי לא היה מיידי, אבל הוא היה מתמיד. וזה מה שחשוב.

### איך את יכולה להתחיל

**תתחילי עם 10 דקות ביום:**

1. **בוקר** - 3 דקות מתיחות עדינות
2. **צהריים** - 2 דקות הליכה או תנועה קלה
3. **ערב** - 5 דקות עיסוי עצמי או רגליים למעלה

**טיפ חשוב:** עדיף 10 דקות כל יום מאשר שעה פעם בשבוע.


---

**רוצה את המוצרים המדויקים שאני ממליצה?** הכנתי בשבילך רשימה של המוצרים הכי איכותיים. [לרשימת המוצרים](products)$$,
    'איך-ליפאדמה-שינה-את-החיים-שלי',
    'physical',
    'solution',
    'Affiliate (Products)',
    $$איך ליפאדמה שינה את החיים שלי | טיפול פיזי וטכניקות שיקום לליפאדמה. עיסויים, תנועה ופתרונות מעשיים מאביטל רוזן נטורופתית.$$,
    '{"לימפה","בריאות נשים","שנים","הבנתי","פשוט","נטורופתיה","נפיחות","ליפאדמה","במחלות","תנועה"}',
    1,
    '3702690855559330175',
    'https://www.instagram.com/p/DNimbcms3l_/',
    'https://scontent-atl3-2.cdninstagram.com/v/t51.2885-15/534693859_752155750859077_1742844492884797919_n.heic?stp=dst-jpg_e35_p1080x1080_tt6&_nc_ht=scontent-atl3-2.cdninstagram.com&_nc_cat=101&_nc_oc=Q6cZ2QFlzdEFYxsIsbKK_-B9FWZAXJp3yYTyjE9xRs_sKzQEMXye4ykMaUKDcJHQ-oW9po0&_nc_ohc=8MQIVegxg1YQ7kNvwEDXmOr&_nc_gid=_L0lui8zSQCCQrqMN-Rp0w&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfryQr2nmVD8nzpA4DgvMdbZg40RgvSPQKxoNbYny5_NVQ&oe=695F41C7&_nc_sid=10d13b',
    false,
    false
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    category = EXCLUDED.category,
    awareness_level = EXCLUDED.awareness_level,
    monetization_strategy = EXCLUDED.monetization_strategy,
    meta_description = EXCLUDED.meta_description,
    keywords = EXCLUDED.keywords,
    estimated_reading_time = EXCLUDED.estimated_reading_time,
    updated_at = NOW();
