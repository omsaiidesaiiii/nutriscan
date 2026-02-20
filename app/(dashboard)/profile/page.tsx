'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Activity, ArrowRight, X, Loader2, Target, Zap, Shield, Sparkles } from 'lucide-react'
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
          health_conditions: formData.health_conditions,
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

      toast.success('Biometric profile synchronized!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Synchronization failed')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingProfile) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        <p className="text-[10px] font-black uppercase text-emerald-900/30 tracking-widest">Accessing Secure Vault...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-10 animate-in">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[3rem] bg-emerald-950 p-10 md:p-14 text-white shadow-2xl mb-12 group">
        <img 
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000"
          alt="Biometrics"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/60 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="max-w-xl">
             <div className="flex items-center space-x-2 text-emerald-400 font-black text-xs uppercase tracking-[0.3em] mb-6">
                <Target className="h-4 w-4" />
                <span>Biometric Node 01</span>
             </div>
             <h1 className="text-5xl font-black tracking-tighter mb-4 italic uppercase">Health <span className="text-emerald-400">Architecture.</span></h1>
             <p className="text-emerald-100/60 text-lg font-medium leading-relaxed">
               Calibrate your physiological parameters to optimize Gemini's tactical output.
             </p>
           </div>
           
           <div className="hidden lg:flex flex-col items-end">
              <div className="h-20 w-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl flex items-center justify-center mb-4">
                 <Shield className="h-10 w-10 text-emerald-400" />
              </div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Encrypted Sync</span>
           </div>
        </div>
      </div>

      <div className="premium-card bg-white border-emerald-100/50 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-12">
          {/* Section 1: Core Physicality */}
          <div className="space-y-8">
             <div className="flex items-center space-x-3 mb-2">
                <div className="h-1 w-6 bg-emerald-500 rounded-full" />
                <h3 className="text-xs font-black text-emerald-900/30 uppercase tracking-[0.2em]">Core Biometrics</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { id: 'weight', label: 'Mass (kg)', value: formData.weight, placeholder: '75.0' },
                  { id: 'height', label: 'Height (cm)', value: formData.height, placeholder: '180' },
                  { id: 'age', label: 'Age (Cycles)', value: formData.age, placeholder: '25' }
                ].map((input) => (
                  <div key={input.id}>
                    <label className="block text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-3 px-1">{input.label}</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      className="w-full px-6 py-4 bg-emerald-50/30 border border-emerald-50 rounded-2xl text-base font-black italic tracking-tighter text-emerald-950 focus:bg-white focus:border-emerald-200 focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none"
                      placeholder={input.placeholder}
                      value={input.value}
                      onChange={(e) => setFormData({ ...formData, [input.id]: e.target.value })}
                    />
                  </div>
                ))}
             </div>
          </div>

          {/* Section 2: Strategy Parameters */}
          <div className="space-y-8">
             <div className="flex items-center space-x-3 mb-2">
                <div className="h-1 w-6 bg-emerald-900 rounded-full" />
                <h3 className="text-xs font-black text-emerald-900/30 uppercase tracking-[0.2em]">Strategy Parameters</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                   <label className="block text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-3 px-1">Gender Identity</label>
                   <select
                     className="w-full px-6 py-4 bg-emerald-50/30 border border-emerald-50 rounded-2xl text-sm font-bold text-emerald-950 focus:bg-white focus:border-emerald-200 focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none appearance-none"
                     value={formData.gender}
                     onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                   >
                     <option value="male">Male Vector</option>
                     <option value="female">Female Vector</option>
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-3 px-1">Primary Objective</label>
                   <select
                     className="w-full px-6 py-4 bg-emerald-50/30 border border-emerald-50 rounded-2xl text-sm font-bold text-emerald-950 focus:bg-white focus:border-emerald-200 focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none appearance-none"
                     value={formData.goal}
                     onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                   >
                     <option value="cut">Weight Attrition (Cut)</option>
                     <option value="maintain">Stability (Maintain)</option>
                     <option value="bulk">Hypertrophy (Bulk)</option>
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-3 px-1">Activity Tier</label>
                   <select
                     className="w-full px-6 py-4 bg-emerald-50/30 border border-emerald-50 rounded-2xl text-sm font-bold text-emerald-950 focus:bg-white focus:border-emerald-200 focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none appearance-none"
                     value={formData.activity_level}
                     onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
                   >
                     <option value="low">Tier 1 (Sedentary)</option>
                     <option value="moderate">Tier 2 (Tactical)</option>
                     <option value="high">Tier 3 (Elite)</option>
                   </select>
                </div>
             </div>
          </div>

          {/* Section 3: Metabolic Constraints */}
          <div className="space-y-8 bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-50">
             <div className="flex items-center space-x-3 mb-2">
                <div className="h-1 w-6 bg-rose-400 rounded-full shadow-[0_0_10px_rgba(251,113,133,0.5)]" />
                <h3 className="text-xs font-black text-emerald-950 uppercase tracking-[0.2em]">Metabolic Constraints</h3>
             </div>
             
             <div className="space-y-6">
                {/* Tags Display */}
                <div className="flex flex-wrap gap-3">
                  {formData.health_conditions.length === 0 ? (
                    <div className="px-6 py-4 border-2 border-dashed border-emerald-100 rounded-[1.5rem] w-full text-center">
                       <span className="text-[10px] font-black text-emerald-900/20 uppercase tracking-widest italic">No physiological constraints detected...</span>
                    </div>
                  ) : (
                    formData.health_conditions.map((condition, index) => (
                      <div 
                        key={index} 
                        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-950 text-emerald-400 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-950/20 animate-in group/tag"
                      >
                        <span>{condition}</span>
                        <button
                          type="button"
                          onClick={() => removeCondition(index)}
                          className="text-emerald-100/20 hover:text-rose-400 transition-colors p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="relative group/input">
                  <input
                    type="text"
                    className="w-full px-8 py-4.5 bg-white border border-emerald-100 rounded-[1.5rem] text-sm font-bold text-emerald-950 placeholder-emerald-900/20 focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none"
                    placeholder="Identify conditions (Hyper, Diabetes, etc)..."
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    onKeyUp={handleKeyUp}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                     <span className="text-[10px] font-black text-emerald-900/20 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">COMMIT (ENTER)</span>
                  </div>
                </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-6">
             <div className="flex items-center space-x-3 text-emerald-900/30">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Gemini Recalibration Logic Enabled</span>
             </div>
             
             <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto h-20 px-14 bg-emerald-950 text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-950/30 hover:bg-emerald-900 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex items-center justify-center space-x-4 group"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                ) : (
                  <>
                    <Zap className="h-5 w-5 text-emerald-400 fill-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Deploy Profile</span>
                  </>
                )}
              </button>
          </div>
        </form>
      </div>
    </div>
  )
}
