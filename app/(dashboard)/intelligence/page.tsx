import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BrainCircuit, Sparkles, Activity, ShieldCheck, HeartPulse, Zap, AlertCircle, Quote } from 'lucide-react'
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
    { label: 'Diabetes-Aware', active: profile.low_gi_priority, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Hypertension-Safe', active: profile.sodium_warning, icon: ShieldCheck, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: 'Heart Healthy', active: profile.heart_healthy_mode, icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50' }
  ]

  return (
    <div className="space-y-10 pb-12 animate-in">
      {/* Header with Unsplash Background */}
      <div className="relative overflow-hidden rounded-[3rem] bg-emerald-950 p-10 md:p-14 text-white shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          alt="Science Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm uppercase tracking-widest mb-6">
            <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span>AI Cognition Core</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
            Adaptive <span className="text-emerald-400 italic">Precision.</span>
          </h1>
          <p className="text-xl text-emerald-100/70 font-medium leading-relaxed">
            Gemini 2.5 Flash is actively synchronizing your biometric data with metabolic history to engineer your optimal performance state.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-10">
          <AdaptiveIntelligence profile={profile} weeklyStats={weeklyStats} />

          {/* Forecast Card */}
          <div className="premium-card p-10 bg-emerald-950 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <Quote className="h-40 w-40 transform rotate-12" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-10 flex items-center tracking-tight">
                <BrainCircuit className="h-7 w-7 mr-4 text-emerald-400" />
                Metabolic Strategy Forecast
              </h3>
              
              <div className="space-y-10">
                <div className="flex items-start space-x-6">
                  <div className="h-12 w-12 shrink-0 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 text-emerald-300 font-black">
                    W1
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-emerald-400 uppercase tracking-widest text-[10px]">Upcoming Velocity</h4>
                    <p className="text-emerald-50/80 leading-relaxed font-medium text-lg">
                      Stabilization phase confirmed. AI suggests a <span className="text-white font-black underline decoration-emerald-500 decoration-2 underline-offset-4">micro-refeed (+200kcal)</span> this Saturday to optimize leptin levels.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="h-12 w-12 shrink-0 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                    <Zap className="h-6 w-6 text-amber-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-amber-400 uppercase tracking-widest text-[10px]">Biometric Insight</h4>
                    <p className="text-emerald-50/80 leading-relaxed font-medium text-lg">
                      Your glycemic response is 14% more stable when pre-workout intake includes exactly <span className="text-white font-black italic">45g of complex carbohydrates</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          <div className="premium-card p-8">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-emerald-950 tracking-tight">Active Shields</h3>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                Monitoring
              </div>
            </div>
            
            <div className="space-y-5">
              {healthIndicators.map((indicator, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-5 rounded-[2rem] border transition-all flex items-center justify-between group",
                    indicator.active 
                      ? 'bg-white border-emerald-100 shadow-sm' 
                      : 'bg-emerald-50/30 border-transparent opacity-40 grayscale pointer-events-none'
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <div className={cn("p-3 rounded-2xl shadow-inner", indicator.bg)}>
                      <indicator.icon className={cn("h-5 w-5", indicator.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-emerald-950 uppercase tracking-tight">{indicator.label}</p>
                      <p className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mt-0.5">
                        {indicator.active ? 'Precision Active' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  {indicator.active && (
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  )}
                </div>
              ))}
            </div>

            {!profile.low_gi_priority && !profile.sodium_warning && !profile.heart_healthy_mode && (
              <div className="mt-10 p-6 rounded-[2rem] bg-emerald-50/50 border border-dashed border-emerald-200 text-center">
                <AlertCircle className="h-6 w-6 text-emerald-300 mx-auto mb-3" />
                <p className="text-xs font-bold text-emerald-800/40 leading-relaxed uppercase tracking-widest px-4">
                  Define health parameters in your profile to enable AI shields.
                </p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            <h3 className="text-xl font-black mb-8 tracking-tight">Efficiency Index</h3>
            <div className="relative h-48 w-48 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="502.6" strokeDashoffset="90" className="text-white transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tracking-tighter">0.82</span>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Score</span>
              </div>
            </div>
            <p className="text-center text-xs font-bold text-emerald-50/60 leading-relaxed px-4">
              Your body is currently utilizing energy at <span className="text-white font-black">optimal efficiency</span> for muscle hypertrophy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
