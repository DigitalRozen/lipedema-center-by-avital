'use client'

import { useState } from 'react'
import { Sparkles, ThermometerSun, Vibrate, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useLocale } from '@/lib/i18n/context'
import { validateLeadForm, validateField, sanitizeFormData, type LeadFormData, type FormValidation } from '@/lib/validation/formValidation'
import { trackLeadSubmit } from '@/lib/analytics/analyticsService'

export default function ClinicPage() {
  const { t, dir } = useLocale()
  const [step, setStep] = useState<'info' | 'quiz' | 'form' | 'success'>('info')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([])
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)

  const BackArrow = dir === 'rtl' ? ArrowRight : ArrowLeft
  const ForwardArrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  const treatments = [
    {
      id: 'sauna',
      name: t.treatments.sauna.name,
      description: t.treatments.sauna.description,
      icon: ThermometerSun,
      image: '/images/clinic-sauna.png',
      benefits: t.treatments.sauna.benefits,
    },
    {
      id: 'vibration',
      name: t.treatments.vibration.name,
      description: t.treatments.vibration.description,
      icon: Vibrate,
      image: '/images/clinic-vibration.png',
      benefits: t.treatments.vibration.benefits,
    },
  ]

  const quizQuestions = [
    {
      id: 'diagnosed',
      question: t.quiz.diagnosed.question,
      options: t.quiz.diagnosed.options,
    },
    {
      id: 'symptoms',
      question: t.quiz.symptoms.question,
      options: t.quiz.symptoms.options,
    },
    {
      id: 'goals',
      question: t.quiz.goals.question,
      options: t.quiz.goals.options,
    },
  ]

  const handleQuizAnswer = (answer: string) => {
    const question = quizQuestions[currentQuestion]
    setQuizAnswers({ ...quizAnswers, [question.id]: answer })

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setStep('form')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Sanitize and validate form data
    const sanitizedData: LeadFormData = sanitizeFormData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      treatment_interest: selectedTreatments,
      quiz_answers: quizAnswers,
    })

    const validation: FormValidation = validateLeadForm(sanitizedData)

    if (!validation.isValid) {
      setFormErrors(validation.errors)
      setLoading(false)
      return
    }

    // Clear any previous errors
    setFormErrors({})

    try {
      // For now, just log the submission (can be connected to a form service later)
      console.log('Lead submission:', sanitizedData)

      // Track successful lead submission
      try {
        await trackLeadSubmit(undefined, {
          source: 'clinic-page',
          treatments_selected: sanitizedData.treatment_interest,
          quiz_completed: Object.keys(quizAnswers).length > 0,
          phone_provided: !!sanitizedData.phone,
        })
      } catch (analyticsError) {
        console.error('Analytics tracking error:', analyticsError)
      }

      setStep('success')
    } catch (error) {
      console.error('Submission error:', error)
      setFormErrors({ general: 'שגיאה בשליחת הטופס. אנא נסו שוב.' })
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (fieldName: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [fieldName]: value })

    // Clear field error when user starts typing
    if (formErrors[fieldName]) {
      setFormErrors({ ...formErrors, [fieldName]: '' })
    }
  }

  const handleFieldBlur = (fieldName: keyof typeof formData, value: string) => {
    setFieldTouched({ ...fieldTouched, [fieldName]: true })

    // Validate field on blur
    const isRequired = fieldName === 'name' || fieldName === 'email'
    const error = validateField(fieldName as keyof LeadFormData, value, isRequired)

    if (error) {
      setFormErrors({ ...formErrors, [fieldName]: error })
    }
  }

  const toggleTreatment = (id: string) => {
    setSelectedTreatments(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-dusty-rose-50">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-clinic-header.png"
            alt="קליניקה מוארת ומרגיעה"
            fill
            className="object-cover opacity-60"
            quality={90}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/50 to-sage-50/80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Sparkles className="w-10 h-10 text-sage-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-sage-900 mb-4">
            {t.clinic.title}
          </h1>
          <p className="text-lg text-sage-800 max-w-2xl mx-auto font-medium">
            {t.clinic.description}
          </p>
        </div>
      </section>

      {/* Treatments */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">{t.clinic.futureTreatments}</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {treatments.map((treatment) => {
              const Icon = treatment.icon
              const isSelected = selectedTreatments.includes(treatment.id)
              return (
                <button
                  key={treatment.id}
                  onClick={() => toggleTreatment(treatment.id)}
                  className={`card text-start transition-all overflow-hidden p-0 ${isSelected ? 'ring-2 ring-sage-500 shadow-lg' : 'hover:shadow-md'
                    }`}
                >
                  <div className="relative w-full h-48 bg-sage-50">
                    <Image
                      src={treatment.image}
                      alt={treatment.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm backdrop-blur-sm">
                      <Icon className="w-5 h-5 text-sage-600" />
                    </div>
                  </div>

                  <div className={`p-8 ${isSelected ? 'bg-sage-50' : ''}`}>
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-semibold text-sage-800 mb-2">
                        {treatment.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{treatment.description}</p>
                      <ul className="grid grid-cols-1 gap-2">
                        {treatment.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-center gap-2 text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-sage-500 shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {isSelected && (
                      <div className="mt-4 text-sage-700 text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {t.clinic.selected}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quiz / Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 'info' && (
            <div className="text-center">
              <h2 className="section-title mb-4">{t.clinic.joinWaitlist}</h2>
              <p className="text-gray-600 mb-8">
                {t.clinic.quizIntro}
              </p>
              <button
                onClick={() => setStep('quiz')}
                className="btn-primary inline-flex items-center gap-2"
              >
                {t.clinic.startQuiz}
                <ForwardArrow className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'quiz' && (
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-gray-500">
                  {t.clinic.questionOf
                    .replace('{current}', String(currentQuestion + 1))
                    .replace('{total}', String(quizQuestions.length))}
                </span>
                <div className="flex gap-1">
                  {quizQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-1 rounded-full ${i <= currentQuestion ? 'bg-sage-500' : 'bg-sage-200'
                        }`}
                    />
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-display font-semibold text-sage-800 mb-6">
                {quizQuestions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleQuizAnswer(option)}
                    className="w-full p-4 text-start border border-sage-200 rounded-xl hover:border-sage-500 hover:bg-sage-50 transition-all"
                  >
                    {option}
                  </button>
                ))}
              </div>
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="mt-6 text-gray-500 hover:text-sage-700 flex items-center gap-2"
                >
                  <BackArrow className="w-4 h-4" />
                  {t.clinic.back}
                </button>
              )}
            </div>
          )}

          {step === 'form' && (
            <div className="card p-8">
              <h3 className="text-2xl font-display font-semibold text-sage-800 mb-2">
                {t.clinic.almostDone}
              </h3>
              <p className="text-gray-600 mb-6">
                {t.clinic.leaveDetails}
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {formErrors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {formErrors.general}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.clinic.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={(e) => handleFieldBlur('name', e.target.value)}
                    className={`input-field ${formErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.clinic.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={(e) => handleFieldBlur('email', e.target.value)}
                    className={`input-field ${formErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="email@example.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.clinic.phone}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    onBlur={(e) => handleFieldBlur('phone', e.target.value)}
                    className={`input-field ${formErrors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="050-000-0000"
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? t.clinic.submitting : t.clinic.submit}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="card p-8 text-center">
              <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-sage-600" />
              </div>
              <h3 className="text-2xl font-display font-semibold text-sage-800 mb-2">
                {t.clinic.thankYou}
              </h3>
              <p className="text-gray-600">
                {t.clinic.thankYouMessage}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
