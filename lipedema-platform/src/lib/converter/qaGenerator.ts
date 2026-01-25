/**
 * Q&A Generator Module
 * 
 * Generates Q&A sections for articles based on user questions from Instagram.
 * Answers are written in Avital's voice - professional, empathetic, and authoritative.
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 */

import type { QASection, QAPair } from './types';

/**
 * Pattern to detect specific doctor names in Hebrew
 * Matches: ד"ר [name], דוקטור [name], פרופ' [name], פרופסור [name]
 */
export const DOCTOR_NAME_PATTERN = /(?:ד"ר|דוקטור|פרופ'|פרופסור)\s+[\u0590-\u05FF]+(?:\s+[\u0590-\u05FF]+)?/g;

/**
 * Phrases recommending professional consultation
 */
export const CONSULTATION_PHRASES = [
  'מומלץ להתייעץ עם איש מקצוע',
  'כדאי לפנות לרופא מומחה',
  'התייעצי עם מומחה בתחום',
  'פני לרופא לאבחון מדויק',
  'חשוב להיבדק אצל מומחה',
];

/**
 * Keywords indicating medical/diagnosis questions
 */
const MEDICAL_QUESTION_KEYWORDS = [
  'אבחון',
  'רופא',
  'טיפול',
  'תרופה',
  'ניתוח',
  'בדיקה',
  'תסמינים',
  'כאב',
  'נפיחות',
  'בצקת',
  'מחלה',
  'מומחה',
];

/**
 * Keywords indicating doctor recommendation questions
 */
const DOCTOR_RECOMMENDATION_KEYWORDS = [
  'רופא',
  'מומחה',
  'ממליצה',
  'המלצה',
  'לאיזה',
  'למי לפנות',
  'איפה',
  'קליניקה',
];

/**
 * Empathetic opening phrases for answers (Avital's voice)
 */
const EMPATHETIC_OPENINGS = [
  'שאלה מצוינת!',
  'אני שמחה שאת שואלת.',
  'זו שאלה שהרבה נשים שואלות.',
  'אני מבינה למה את שואלת.',
  'שאלה חשובה.',
];

/**
 * Answer templates by question type
 */
const ANSWER_TEMPLATES = {
  doctorRecommendation: [
    'אני לא ממליצה על רופאים ספציפיים, כי מה שמתאים לאחת לא בהכרח מתאים לאחרת. מה שחשוב הוא למצוא מומחה שמבין ליפאדמה ומקשיב לך. חפשי רופא עם ניסיון בתחום, ואל תפחדי לשאול שאלות בפגישה.',
    'כל אחת צריכה למצוא את המומחה שמתאים לה. אני ממליצה לחפש רופא עם התמחות בליפאדמה או לימפאדמה, לקרוא המלצות, ולהגיע לפגישה עם רשימת שאלות. הכי חשוב - שתרגישי שמקשיבים לך.',
    'אני מעדיפה לא להמליץ על שמות ספציפיים, כי הקשר בין מטופלת לרופא הוא אישי מאוד. מה שכן, חפשי מומחה שמכיר את המחלה, שלוקח את הזמן להסביר, ושאת מרגישה איתו בנוח.',
  ],
  medicalQuestion: [
    'זו שאלה רפואית חשובה. מה שאני יכולה להגיד הוא שכל מקרה שונה, ולכן חשוב להיבדק אצל מומחה שיוכל לתת לך תשובה מדויקת למצב שלך.',
    'התשובה תלויה במצב האישי שלך. מומלץ להתייעץ עם רופא מומחה שיוכל לבדוק אותך ולתת המלצות מותאמות.',
    'שאלה טובה! התשובה המדויקת דורשת הערכה אישית. פני לרופא מומחה בתחום שיוכל לבדוק את המצב שלך ולתת לך מענה מקצועי.',
  ],
  general: [
    'מניסיוני, {answer}. כמובן שכל אחת שונה, אז חשוב להקשיב לגוף שלך.',
    '{answer}. זה מה שעובד להרבה נשים, אבל תמיד כדאי להתאים לעצמך.',
    'לפי מה שאני רואה בקליניקה, {answer}. אבל זכרי - את מכירה את הגוף שלך הכי טוב.',
  ],
};

/**
 * General knowledge answers for common topics
 */
const TOPIC_ANSWERS: Record<string, string[]> = {
  תזונה: [
    'תזונה נוגדת דלקת יכולה לעזור מאוד. הפחיתי מזונות מעובדים, הוסיפי ירקות ופירות, ושתי הרבה מים',
    'אין דיאטה אחת שמתאימה לכולן, אבל הפחתת סוכר ומזונות מעובדים עוזרת לרוב הנשים',
    'תזונה בריאה תומכת במערכת הלימפה. התמקדי במזונות טבעיים ושתייה מרובה',
  ],
  טיפול: [
    'טיפול שמרני כולל ניקוז לימפתי, גרביים אלסטיות ותנועה עדינה. זה הבסיס לניהול ליפאדמה',
    'שילוב של טיפולים עובד הכי טוב - ניקוז לימפתי, תזונה נכונה ופעילות גופנית מותאמת',
    'הטיפול הוא מסע, לא ספרינט. התחילי עם הבסיס - ניקוז, תזונה ותנועה - והתקדמי משם',
  ],
  כאב: [
    'כאב בליפאדמה הוא אמיתי ומתסכל. ניקוז לימפתי וגרביים אלסטיות יכולים להקל',
    'הכאב יכול להשתנות מיום ליום. הקשיבי לגוף, נוחי כשצריך, ואל תרגישי אשמה',
    'יש דרכים להקל על הכאב - ניקוז, קירור עדין, והרמת רגליים. נסי ומצאי מה עובד לך',
  ],
  default: [
    'זו שאלה טובה. מניסיוני, הכי חשוב להקשיב לגוף ולמצוא מה עובד עבורך',
    'כל אחת שונה, אז מה שעובד לאחת לא בהכרח יעבוד לאחרת. נסי והתאימי לעצמך',
    'אין תשובה אחת נכונה, אבל עם סבלנות והקשבה לגוף, תמצאי את הדרך שלך',
  ],
};

/**
 * Checks if a question is asking for doctor recommendations
 * 
 * @param question - The question text
 * @returns true if asking for doctor recommendation
 */
export function isDoctorRecommendationQuestion(question: string): boolean {
  const lowerQuestion = question.toLowerCase();
  return DOCTOR_RECOMMENDATION_KEYWORDS.some(keyword => 
    lowerQuestion.includes(keyword)
  );
}

/**
 * Checks if a question is medical/diagnosis related
 * 
 * @param question - The question text
 * @returns true if medical question
 */
export function isMedicalQuestion(question: string): boolean {
  const lowerQuestion = question.toLowerCase();
  return MEDICAL_QUESTION_KEYWORDS.some(keyword => 
    lowerQuestion.includes(keyword)
  );
}

/**
 * Detects topic from question for answer selection
 * 
 * @param question - The question text
 * @returns Topic key or 'default'
 */
function detectQuestionTopic(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('תזונה') || lowerQuestion.includes('אוכל') || 
      lowerQuestion.includes('דיאטה') || lowerQuestion.includes('אכילה')) {
    return 'תזונה';
  }
  
  if (lowerQuestion.includes('טיפול') || lowerQuestion.includes('ניקוז') || 
      lowerQuestion.includes('עיסוי') || lowerQuestion.includes('גרביים')) {
    return 'טיפול';
  }
  
  if (lowerQuestion.includes('כאב') || lowerQuestion.includes('כואב') || 
      lowerQuestion.includes('רגישות')) {
    return 'כאב';
  }
  
  return 'default';
}

/**
 * Gets a deterministic index based on content hash
 * 
 * @param content - Content to hash
 * @param max - Maximum value (exclusive)
 * @returns Index between 0 and max-1
 */
function getContentIndex(content: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % max;
}

/**
 * Removes specific doctor names from text
 * 
 * @param text - Text to clean
 * @returns Text without specific doctor names
 */
export function removeDoctorNames(text: string): string {
  return text.replace(DOCTOR_NAME_PATTERN, 'מומחה בתחום');
}

/**
 * Checks if text contains specific doctor names
 * 
 * @param text - Text to check
 * @returns true if contains doctor names
 */
export function containsDoctorNames(text: string): boolean {
  // Create a new regex instance to avoid lastIndex issues with global flag
  const pattern = /(?:ד"ר|דוקטור|פרופ'|פרופסור)\s+[\u0590-\u05FF]+(?:\s+[\u0590-\u05FF]+)?/;
  return pattern.test(text);
}

/**
 * Generates an answer in Avital's voice
 * 
 * @param question - The user's question
 * @returns Answer text in Avital's voice
 */
export function generateAnswer(question: string): string {
  // Select empathetic opening
  const openingIndex = getContentIndex(question, EMPATHETIC_OPENINGS.length);
  const opening = EMPATHETIC_OPENINGS[openingIndex];
  
  // Determine question type and generate appropriate answer
  if (isDoctorRecommendationQuestion(question)) {
    const templateIndex = getContentIndex(question + 'doctor', ANSWER_TEMPLATES.doctorRecommendation.length);
    return `${opening} ${ANSWER_TEMPLATES.doctorRecommendation[templateIndex]}`;
  }
  
  if (isMedicalQuestion(question)) {
    const templateIndex = getContentIndex(question + 'medical', ANSWER_TEMPLATES.medicalQuestion.length);
    const consultationIndex = getContentIndex(question, CONSULTATION_PHRASES.length);
    return `${opening} ${ANSWER_TEMPLATES.medicalQuestion[templateIndex]} ${CONSULTATION_PHRASES[consultationIndex]}.`;
  }
  
  // General question - use topic-based answer
  const topic = detectQuestionTopic(question);
  const topicAnswers = TOPIC_ANSWERS[topic];
  const answerIndex = getContentIndex(question + 'answer', topicAnswers.length);
  const baseAnswer = topicAnswers[answerIndex];
  
  const templateIndex = getContentIndex(question + 'template', ANSWER_TEMPLATES.general.length);
  const template = ANSWER_TEMPLATES.general[templateIndex];
  
  // If template has placeholder, use base answer; otherwise combine
  if (template.includes('{answer}')) {
    return `${opening} ${template.replace('{answer}', baseAnswer)}`;
  }
  
  return `${opening} ${baseAnswer}`;
}

/**
 * Generates a Q&A section from user questions
 * Returns null if no questions provided.
 * 
 * @param userQuestions - Array of user questions from Instagram
 * @returns QASection or null if no questions
 */
export function generateQASection(userQuestions: string[]): QASection | null {
  // Return null if no questions (Requirement 4.5)
  if (!userQuestions || userQuestions.length === 0) {
    return null;
  }
  
  // Filter out empty questions
  const validQuestions = userQuestions.filter(q => q && q.trim().length > 0);
  
  if (validQuestions.length === 0) {
    return null;
  }
  
  // Generate Q&A pairs
  const questions: QAPair[] = validQuestions.map(question => {
    const answer = generateAnswer(question);
    // Ensure no doctor names in answer (Requirement 4.3)
    const cleanAnswer = removeDoctorNames(answer);
    
    return {
      question: question.trim(),
      answer: cleanAnswer,
    };
  });
  
  return { questions };
}

/**
 * Checks if a Q&A section contains consultation recommendations
 * 
 * @param qaSection - The Q&A section to check
 * @returns true if contains consultation phrases
 */
export function hasConsultationRecommendation(qaSection: QASection): boolean {
  return qaSection.questions.some(qa => 
    CONSULTATION_PHRASES.some(phrase => qa.answer.includes(phrase))
  );
}
