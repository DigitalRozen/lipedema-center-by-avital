import { describe, it, expect } from 'vitest'
import { 
  validateLeadForm, 
  validateField, 
  isValidEmail, 
  isValidPhone, 
  sanitizeFormData,
  ERROR_MESSAGES,
  type LeadFormData 
} from './formValidation'

describe('Form Validation', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.il')).toBe(true)
      expect(isValidEmail('test+tag@gmail.com')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('test..test@domain.com')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isValidEmail(null as any)).toBe(false)
      expect(isValidEmail(undefined as any)).toBe(false)
      expect(isValidEmail('  test@example.com  ')).toBe(true) // trimmed internally
    })
  })

  describe('isValidPhone', () => {
    it('should validate Israeli phone numbers', () => {
      expect(isValidPhone('0501234567')).toBe(true)
      expect(isValidPhone('050-123-4567')).toBe(true)
      expect(isValidPhone('050 123 4567')).toBe(true)
      expect(isValidPhone('+972501234567')).toBe(true)
    })

    it('should accept empty phone (optional field)', () => {
      expect(isValidPhone('')).toBe(true)
      expect(isValidPhone('   ')).toBe(true)
    })

    it('should reject invalid phone formats', () => {
      expect(isValidPhone('123')).toBe(false)
      expect(isValidPhone('0501234')).toBe(false)
      expect(isValidPhone('abc123')).toBe(false)
    })
  })

  describe('validateLeadForm', () => {
    it('should pass validation for valid form data', () => {
      const validData: LeadFormData = {
        name: 'שרה כהן',
        email: 'sarah@example.com',
        phone: '050-123-4567',
        treatment_interest: ['consultation'],
        quiz_answers: { diagnosed: true }
      }

      const result = validateLeadForm(validData)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('should fail validation for missing required fields', () => {
      const invalidData: LeadFormData = {
        name: '',
        email: '',
      }

      const result = validateLeadForm(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe(ERROR_MESSAGES.name.required)
      expect(result.errors.email).toBe(ERROR_MESSAGES.email.required)
    })

    it('should fail validation for invalid email format', () => {
      const invalidData: LeadFormData = {
        name: 'שרה כהן',
        email: 'invalid-email',
      }

      const result = validateLeadForm(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe(ERROR_MESSAGES.email.invalid)
    })

    it('should fail validation for short name', () => {
      const invalidData: LeadFormData = {
        name: 'א',
        email: 'test@example.com',
      }

      const result = validateLeadForm(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe(ERROR_MESSAGES.name.minLength)
    })

    it('should fail validation for invalid phone format', () => {
      const invalidData: LeadFormData = {
        name: 'שרה כהן',
        email: 'test@example.com',
        phone: 'invalid-phone',
      }

      const result = validateLeadForm(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.phone).toBe(ERROR_MESSAGES.phone.invalid)
    })
  })

  describe('validateField', () => {
    it('should validate individual fields correctly', () => {
      expect(validateField('name', 'שרה כהן', true)).toBeNull()
      expect(validateField('name', '', true)).toBe(ERROR_MESSAGES.general.required)
      expect(validateField('name', 'א', false)).toBe(ERROR_MESSAGES.name.minLength)
      
      expect(validateField('email', 'test@example.com', true)).toBeNull()
      expect(validateField('email', 'invalid', false)).toBe(ERROR_MESSAGES.email.invalid)
      
      expect(validateField('phone', '050-123-4567', false)).toBeNull()
      expect(validateField('phone', 'invalid', false)).toBe(ERROR_MESSAGES.phone.invalid)
    })
  })

  describe('sanitizeFormData', () => {
    it('should trim whitespace and normalize data', () => {
      const dirtyData: LeadFormData = {
        name: '  שרה כהן  ',
        email: '  TEST@EXAMPLE.COM  ',
        phone: '  050-123-4567  ',
        treatment_interest: ['consultation'],
        quiz_answers: { diagnosed: true }
      }

      const sanitized = sanitizeFormData(dirtyData)
      expect(sanitized.name).toBe('שרה כהן')
      expect(sanitized.email).toBe('test@example.com')
      expect(sanitized.phone).toBe('050-123-4567')
    })

    it('should handle missing optional fields', () => {
      const minimalData: LeadFormData = {
        name: 'שרה כהן',
        email: 'test@example.com',
      }

      const sanitized = sanitizeFormData(minimalData)
      expect(sanitized.phone).toBeUndefined()
      expect(sanitized.treatment_interest).toEqual([])
      expect(sanitized.quiz_answers).toEqual({})
    })
  })
})