/**
 * Form Validation Utilities
 * 
 * Client-side validation for lead forms.
 */

export interface LeadFormData {
  name: string
  email: string
  phone?: string
  treatment_interest?: string[]
  quiz_answers?: Record<string, string>
}

export interface FormValidation {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * Validate a single form field
 */
export function validateField(
  fieldName: keyof LeadFormData,
  value: string,
  isRequired: boolean = false
): string | null {
  // Check required fields
  if (isRequired && (!value || value.trim() === '')) {
    return 'שדה חובה'
  }

  // Skip validation for empty optional fields
  if (!value || value.trim() === '') {
    return null
  }

  switch (fieldName) {
    case 'name':
      if (value.trim().length < 2) {
        return 'שם חייב להכיל לפחות 2 תווים'
      }
      if (value.trim().length > 100) {
        return 'שם ארוך מדי'
      }
      break

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'כתובת אימייל לא תקינה'
      }
      break

    case 'phone':
      // Israeli phone number validation (optional field)
      const phoneRegex = /^0[2-9]\d{7,8}$/
      const cleanPhone = value.replace(/[-\s]/g, '')
      if (cleanPhone && !phoneRegex.test(cleanPhone)) {
        return 'מספר טלפון לא תקין'
      }
      break
  }

  return null
}

/**
 * Validate the entire lead form
 */
export function validateLeadForm(data: LeadFormData): FormValidation {
  const errors: Record<string, string> = {}

  // Required fields
  const nameError = validateField('name', data.name, true)
  if (nameError) errors.name = nameError

  const emailError = validateField('email', data.email, true)
  if (emailError) errors.email = emailError

  // Optional fields
  if (data.phone) {
    const phoneError = validateField('phone', data.phone, false)
    if (phoneError) errors.phone = phoneError
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Sanitize form data before submission
 */
export function sanitizeFormData(data: LeadFormData): LeadFormData {
  return {
    name: data.name?.trim() || '',
    email: data.email?.trim().toLowerCase() || '',
    phone: data.phone?.replace(/[-\s]/g, '').trim() || undefined,
    treatment_interest: data.treatment_interest || [],
    quiz_answers: data.quiz_answers || {}
  }
}
