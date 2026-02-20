import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BrainCircuit, Sparkles, Activity, ShieldCheck, HeartPulse, AlertCircle } from 'lucide-react'
import AdaptiveIntelligence from '@/components/AdaptiveIntelligence'
import { getWeeklyStats } from '@/app/(dashboard)/dashboard/actions'
import { cn } from '@/lib/utils'

export default async function IntelligencePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/profile')

  const weeklyStats = await getWeeklyStats()

  const healthIndicators = [
    { label: 'Diabetes-Aware', active: profile.low_gi_priority, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Hypertension-Safe', active: profile.sodium_warning, icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Heart Healthy', active: profile.heart_healthy_mode, icon: HeartPulse, color: 'text-zinc-600', bg: 'bg-zinc-50' }
  ]

  return (
    <div className="space-y-8 pb-8 animate-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">AI Intelligence</h1>
        <p className="text-sm text-zinc-500">Adaptive insights powered by Gemini, based on your biometric data and meal history.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-6">
          <AdaptiveIntelligence profile={profile} weeklyStats={weeklyStats} />

          {/* Strategy Forecast */}
          <div className="card p-8">
            <h3 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center">
              <BrainCircuit className="h-5 w-5 mr-2 text-emerald-600" />
              Strategy Forecast
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-start space-x-4">
                <div className="h-9 w-9 shrink-0 bg-emerald-50 rounded-xl flex items-center justify-center text-xs font-semibold text-emerald-700 border border-emerald-100">
                  W1
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-900 mb-1">Upcoming Week</h4>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Stabilization phase confirmed. Consider a <span className="text-zinc-900 font-semibold">micro-refeed (+200kcal)</span> this Saturday to optimize leptin levels.
                  </p>
                </div>
              </div>

              <div className="h-px bg-zinc-100"></div>

              <div className="flex items-start space-x-4">
                <div className="h-9 w-9 shrink-0 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                  <Sparkles className="h-4 w-4 text-zinc-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-900 mb-1">Insight</h4>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Your glycemic response is 14% more stable when pre-workout intake includes <span className="text-zinc-900 font-semibold">45g of complex carbohydrates</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Health Shields */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-zinc-900">Health Shields</h3>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">Active</span>
            </div>
            
            <div className="space-y-2">
              {healthIndicators.map((indicator, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-4 rounded-xl border transition-all flex items-center justify-between",
                    indicator.active 
                      ? 'bg-white border-zinc-100' 
                      : 'bg-zinc-50/50 border-transparent opacity-40'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn("p-2 rounded-xl", indicator.bg)}>
                      <indicator.icon className={cn("h-4 w-4", indicator.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{indicator.label}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {indicator.active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  {indicator.active && (
                    <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                  )}
                </div>
              ))}
            </div>

            {!profile.low_gi_priority && !profile.sodium_warning && !profile.heart_healthy_mode && (
              <div className="mt-5 p-4 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 text-center">
                <AlertCircle className="h-5 w-5 text-zinc-300 mx-auto mb-2" />
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Add health conditions in your profile to enable AI shields.
                </p>
              </div>
            )}
          </div>

          {/* Efficiency Score */}
          <div className="card p-6">
            <h3 className="text-base font-semibold text-zinc-900 mb-5">Efficiency Score</h3>
            <div className="relative h-36 w-36 mx-auto mb-5">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-zinc-100" />
                <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="376.8" strokeDashoffset="68" className="text-emerald-500 transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold text-zinc-900">0.82</span>
                <span className="text-xs text-zinc-400 mt-0.5">Score</span>
              </div>
            </div>
            <p className="text-center text-xs text-zinc-500 leading-relaxed">
              Your body is utilizing energy at <span className="text-zinc-900 font-medium">optimal efficiency</span> for your current goal.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
