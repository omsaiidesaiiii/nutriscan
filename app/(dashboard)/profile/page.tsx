'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

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

    if (conditionInput.trim()) {
      addCondition(conditionInput)
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

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
          health_conditions: formData.health_conditions,
        }),
      })

      if (!calcResponse.ok) {
        const errData = await calcResponse.json()
        throw new Error(errData.error || 'Failed to calculate targets')
      }

      const targets = await calcResponse.json()

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

      toast.success('Profile updated successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingProfile) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-3">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        <p className="text-sm text-zinc-400">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in">
      {/* Header */}
      <div className="space-y-1 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Profile</h1>
        <p className="text-sm text-zinc-500">Update your health metrics to calibrate AI recommendations.</p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-zinc-100 shadow-sm rounded-[2rem] overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
          {/* Core Biometrics */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-zinc-900">Body Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'weight', label: 'Weight (kg)', value: formData.weight, placeholder: '75.0' },
                { id: 'height', label: 'Height (cm)', value: formData.height, placeholder: '180' },
                { id: 'age', label: 'Age', value: formData.age, placeholder: '25' }
              ].map((input) => (
                <div key={input.id}>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">{input.label}</label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder={input.placeholder}
                    value={input.value}
                    onChange={(e) => setFormData({ ...formData, [input.id]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-zinc-900">Goals & Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Gender</label>
                <select
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all appearance-none"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Goal</label>
                <select
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all appearance-none"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                >
                  <option value="cut">Weight Loss (Cut)</option>
                  <option value="maintain">Maintain</option>
                  <option value="bulk">Gain Weight (Bulk)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Activity Level</label>
                <select
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all appearance-none"
                  value={formData.activity_level}
                  onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
                >
                  <option value="low">Sedentary</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">Very Active</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health Conditions */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-zinc-900">Health Conditions</h3>
            
            <div className="space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {formData.health_conditions.length === 0 ? (
                  <div className="px-4 py-3 border border-dashed border-zinc-200 rounded-xl w-full text-center">
                    <span className="text-sm text-zinc-400">No health conditions added</span>
                  </div>
                ) : (
                  formData.health_conditions.map((condition, index) => (
                    <div 
                      key={index} 
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100"
                    >
                      <span>{condition}</span>
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="text-emerald-400 hover:text-emerald-700 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <input
                type="text"
                className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="Type a condition and press Enter..."
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                onKeyUp={handleKeyUp}
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
