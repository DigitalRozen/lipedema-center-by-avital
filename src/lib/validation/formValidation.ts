/**
 * Form validation utilities for the Lipedema Authority Platform
 * Provides validation functions with Hebrew error messages
 */

export interface LeadFormData {
  name: string
  email: string
  phone?: string
  treatment_interest?: string[]
  quiz_answers?: Record<string, unknown>
}

export interface FormValidation {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * Validates email format using a comprehensive regex pattern
 * @param email - Email string to validate
 * @returns true if email format is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }

  // Email regex that allows common characters but rejects consecutive dots
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/
  
  const trimmedEmail = email.trim()
  
  // Additional checks for invalid patterns
  if (trimmedEmail.includes('..') || trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
    return false
  }
  
  return emailRegex.test(trimmedEmail)
}

/**
 * Validates Israeli phone number format (optional validation)
 * @param phone - Phone string to validate
 * @returns true if phone format is valid or empty, false otherwise
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || phone.trim() === '') {
    return true // Phone is optional
  }

  // Israeli phone number patterns: 05X-XXX-XXXX, 0X-XXX-XXXX, or international format
  const phoneRegex = /^(\+972|0)([2-9]\d{7,8}|5[0-9]\d{7})$/
  const cleanPhone = phone.replace(/[-\s]/g, '') // Remove dashes and spaces
  
  return phoneRegex.test(cleanPhone)
}

/**
 * Hebrew error messages for form validation
 */
export const ERROR_MESSAGES = {
  name: {
    required: 'נא להזין שם מלא',
    minLength: 'השם חייב להכיל לפחות 2 תווים',
  },
  email: {
    required: 'נא להזין כתובת אימייל',
    invalid: 'פורמט האימייל אינו תקין',
  },
  phone: {
    invalid: 'פורמט מספר הטלפון אינו תקין',
  },
  general: {
    required: 'שדה זה הוא חובה',
  },
} as const

/**
 * Validates lead capture form data
 * @param data - Form data to validate
 * @returns Validation result with isValid flag and error messages
 */
export function validateLeadForm(data: LeadFormData): FormValidation {
  const errors: Record<string, string> = {}

  // Validate name (required, minimum length)
  if (!data.name || typeof data.name !== 'string') {
    errors.name = ERROR_MESSAGES.name.required
  } else if (data.name.trim().length < 2) {
    errors.name = ERROR_MESSAGES.name.minLength
  }

  // Validate email (required, format)
  if (!data.email || typeof data.email !== 'string') {
    errors.email = ERROR_MESSAGES.email.required
  } else if (!isValidEmail(data.email)) {
    errors.email = ERROR_MESSAGES.email.invalid
  }

  // Validate phone (optional, format if provided)
  if (data.phone && typeof data.phone === 'string' && !isValidPhone(data.phone)) {
    errors.phone = ERROR_MESSAGES.phone.invalid
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validates individual form field
 * @param fieldName - Name of the field to validate
 * @param value - Value to validate
 * @param isRequired - Whether the field is required
 * @returns Error message if validation fails, null if valid
 */
export function validateField(
  fieldName: keyof LeadFormData,
  value: string,
  isRequired: boolean = false
): string | null {
  if (isRequired && (!value || value.trim() === '')) {
    return ERROR_MESSAGES.general.required
  }

  switch (fieldName) {
    case 'name':
      if (value && value.trim().length < 2) {
        return ERROR_MESSAGES.name.minLength
      }
      break
    
    case 'email':
      if (value && !isValidEmail(value)) {
        return ERROR_MESSAGES.email.invalid
      }
      break
    
    case 'phone':
      if (value && !isValidPhone(value)) {
        return ERROR_MESSAGES.phone.invalid
      }
      break
  }

  return null
}

/**
 * Sanitizes form data by trimming whitespace and normalizing values
 * @param data - Raw form data
 * @returns Sanitized form data
 */
export function sanitizeFormData(data: LeadFormData): LeadFormData {
  return {
    name: data.name?.trim() || '',
    email: data.email?.trim().toLowerCase() || '',
    phone: data.phone?.trim() || undefined,
    treatment_interest: data.treatment_interest || [],
    quiz_answers: data.quiz_answers || {},
  }
}