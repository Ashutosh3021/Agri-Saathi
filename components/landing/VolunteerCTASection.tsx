"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
]

interface FormData {
  name: string
  phone: string
  email: string
  district: string
  state: string
  motivation: string
}

interface FormErrors {
  name?: string
  phone?: string
  email?: string
  district?: string
  state?: string
}

export default function VolunteerCTASection() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    district: "",
    state: "",
    motivation: ""
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    // Name validation (2-50 chars, letters and spaces only)
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
      isValid = false
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.name.trim())) {
      newErrors.name = "Name must be 2-50 characters and contain only letters and spaces"
      isValid = false
    }

    // Phone validation (exactly 10 digits)
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      isValid = false
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone must be exactly 10 digits"
      isValid = false
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    // District validation
    if (!formData.district.trim()) {
      newErrors.district = "District is required"
      isValid = false
    } else if (formData.district.trim().length < 2) {
      newErrors.district = "District must be at least 2 characters"
      isValid = false
    }

    // State validation
    if (!formData.state) {
      newErrors.state = "State is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent duplicate submissions
    if (loading) return
    
    setError(null)
    setWarning(null)

    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await fetch("/api/volunteer/apply", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error codes
        if (data.code === 'MISSING_FUNCTION') {
          throw new Error("System setup incomplete. Please contact support.")
        }
        throw new Error(data.error || data.details || "Something went wrong")
      }

      // Check if there was a warning (email failed but account created)
      if (data.warning) {
        setWarning(data.message || data.error)
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Prevent input if loading
    if (loading) return
    
    setFormData(prev => ({ ...prev, [field]: value }))
    const errorField = field as keyof FormErrors
    if (errors[errorField]) {
      setErrors(prev => ({ ...prev, [errorField]: undefined }))
    }
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  return (
    <section id="volunteer-signup" className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-[#14532d] rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-5 gap-8 p-8 lg:p-12">
            <div className="lg:col-span-3">
              <span className="inline-block bg-[#d97706] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                🤝 Join Our Network
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Turn Your Time Into Income. Help Farmers Near You.
              </h2>
              <p className="text-green-100 mb-8 text-lg">
                Join thousands of volunteers across India who earn coins for every crop scan and soil test they complete. Coins convert to real cash.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="text-white">
                  <p className="text-2xl font-bold">₹500+</p>
                  <p className="text-sm text-green-200">Earned per active week</p>
                </div>
                <div className="text-white">
                  <p className="text-2xl font-bold">10 coins</p>
                  <p className="text-sm text-green-200">Per completed scan</p>
                </div>
                <div className="text-white">
                  <p className="text-2xl font-bold">4.8★</p>
                  <p className="text-sm text-green-200">Average volunteer rating</p>
                </div>
              </div>
              <button
                onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl px-6 py-3 font-semibold transition-colors"
              >
                Join as Volunteer →
              </button>
            </div>

            <div className="hidden lg:block lg:col-span-2 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-4 text-white transform -rotate-3"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">R</div>
                  <div>
                    <p className="font-medium">Ravi Kumar</p>
                    <p className="text-xs text-green-200">Pune, Maharashtra</p>
                  </div>
                </div>
                <p className="text-sm text-yellow-300 mb-2">🏆 Top Volunteer this month</p>
                <p className="text-xs text-green-100">342 scans • 4.9★ • ₹3,420 earned</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-4 text-white"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">P</div>
                  <div>
                    <p className="font-medium">Priya Devi</p>
                    <p className="text-xs text-green-200">Ludhiana, Punjab</p>
                  </div>
                </div>
                <p className="text-sm text-yellow-300 mb-2">🥈 #2 in Punjab</p>
                <p className="text-xs text-green-100">289 scans • 4.8★ • ₹2,890 earned</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-4 text-white transform rotate-3"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">S</div>
                  <div>
                    <p className="font-medium">Suresh Patil</p>
                    <p className="text-xs text-green-200">Nashik, Maharashtra</p>
                  </div>
                </div>
                <p className="text-sm text-yellow-300 mb-2">⭐ 50 scans this week</p>
                <p className="text-xs text-green-100">198 scans • 5.0★ • ₹1,980 earned</p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Earning in 3 Steps</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <span className="text-3xl">📝</span>
                <div>
                  <p className="font-semibold">Fill the form</p>
                  <p className="text-sm text-gray-500">2 minutes</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <span className="text-3xl">✅</span>
                <div>
                  <p className="font-semibold">Get verified</p>
                  <p className="text-sm text-gray-500">24 hours</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                <span className="text-3xl">💰</span>
                <div>
                  <p className="font-semibold">Start earning</p>
                  <p className="text-sm text-gray-500">Immediately after first scan</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div id="signup-form" className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Received! 🎉</h3>
                {warning ? (
                  <>
                    <p className="text-amber-600 mb-2">{warning}</p>
                    <p className="text-sm text-gray-500 mb-6">
                      Your account was created successfully. Please contact support if you don&apos;t receive the verification email within a few minutes.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 mb-2">Check your email ({formData.email}) for a verification link.</p>
                    <p className="text-sm text-gray-500 mb-6">Click it to access your volunteer dashboard. Link expires in 24 hours.</p>
                  </>
                )}
                <button
                  onClick={() => window.location.href = '/Volunteers'}
                  className="bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl px-6 py-3 font-semibold transition-colors"
                >
                  Go to Login Page →
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="10 digit number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter your district"
                    />
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a state</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to volunteer?</label>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    disabled={loading}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Tell us why you'd like to join..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#16a34a] hover:bg-[#15803d] disabled:bg-[#16a34a]/70 text-white rounded-xl px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application →"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
