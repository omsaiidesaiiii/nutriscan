'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Activity, ArrowRight, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [fetchingProfile, setFetchingProfile] = useState(true)
  const [formData, setFormData] = useState<{
    weight: string;
    height: string;
    age: string;
    gender: string;
    goal: string;
    activity_level: string;
    health_conditions: string[];
  }>({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    goal: 'maintain',
    activity_level: 'moderate',
    health_conditions: [],
  })
  const [conditionInput, setConditionInput] = useState('')

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFormData({
          weight: profile.weight.toString(),
          height: profile.height.toString(),
          age: profile.age.toString(),
          gender: profile.gender,
          goal: profile.goal,
          activity_level: profile.activity_level,
          health_conditions: profile.health_conditions || [],
        })
      }
      setFetchingProfile(false)
    }

    checkUser()
  }, [supabase, router])

  const addCondition = (val: string) => {
    const trimmed = val.trim()
    if (trimmed && !formData.health_conditions.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        health_conditions: [...prev.health_conditions, trimmed]
      }))
    }
    setConditionInput('')
  }

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      health_conditions: prev.health_conditions.filter((_, i) => i !== index)
    }))
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addCondition(conditionInput.replace(',', ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Add any remaining input as a tag before submitting
    if (conditionInput.trim()) {
      addCondition(conditionInput)
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // 1. Calculate targets via API
      const calcResponse = await fetch('/api/calculate-targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: Number(formData.weight),
          height: Number(formData.height),
          age: Number(formData.age),
          gender: formData.gender,
          goal: formData.goal,
          activity_level: formData.activity_level,
        }),
      })

      if (!calcResponse.ok) {
        const errData = await calcResponse.json()
        throw new Error(errData.error || 'Failed to calculate targets')
      }

      const targets = await calcResponse.json()

      // 2. Save to Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          weight: Number(formData.weight),
          height: Number(formData.height),
          age: Number(formData.age),
          gender: formData.gender,
          goal: formData.goal,
          activity_level: formData.activity_level,
          health_conditions: formData.health_conditions,
          ...targets,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      toast.success('Profile and targets saved!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Health Profile</h1>
          <p className="mt-3 text-lg text-gray-600">
            Tell us about yourself to calculate your custom macro targets.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden text-black transition-all">
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  required
                  step="0.1"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="e.g. 75.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="e.g. 180"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="e.g. 25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Goal</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                >
                  <option value="cut">Weight Loss (Cut)</option>
                  <option value="maintain">Maintenance</option>
                  <option value="bulk">Muscle Gain (Bulk)</option>
                </select>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Level</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  value={formData.activity_level}
                  onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
                >
                  <option value="low">Low (Sedentary)</option>
                  <option value="moderate">Moderate (Active)</option>
                  <option value="high">High (Very Active)</option>
                </select>
              </div>
            </div>

            {/* Health Conditions Tag Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Health Conditions</label>
              
              {/* Tags Display */}
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {formData.health_conditions.length === 0 ? (
                  <span className="text-xs text-gray-400 italic">No conditions added yet...</span>
                ) : (
                  formData.health_conditions.map((condition, index) => (
                    <div 
                      key={index} 
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100 animate-in fade-in zoom-in duration-300 hover:bg-indigo-100/50 transition-colors group/tag"
                    >
                      <span>{condition}</span>
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="text-indigo-400 hover:text-indigo-900 transition-colors p-0.5 rounded-md hover:bg-indigo-200/50"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Actual Input Field */}
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="Type condition and press Enter or comma..."
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  onKeyUp={handleKeyUp}
                  onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-gray-100">Enter</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center space-x-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <span>Calculate & Save Profile</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
