import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BarChart3, TrendingUp, PieChart, Target, Zap, Shield, Flame, Info, Calendar, AlertCircle } from 'lucide-react'
import WeeklyChart from '@/components/WeeklyChart'
import { getWeeklyStats } from '@/app/(dashboard)/dashboard/actions'
import { cn } from '@/lib/utils'

export default async function AnalyticsPage() {
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

  return (
    <div className="space-y-10 pb-12 animate-in">
      {/* Header with Background */}
      <div className="relative overflow-hidden rounded-[3rem] bg-emerald-900 p-10 md:p-14 text-white shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          alt="Analytics Background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/40 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm uppercase tracking-widest mb-6">
              <BarChart3 className="h-4 w-4" />
              <span>Performance Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              Metabolic <span className="text-emerald-400">Insights.</span>
            </h1>
            <p className="text-emerald-100/70 text-lg font-medium">
              Real-time analysis of your nutritional velocity and physiological response patterns.
            </p>
          </div>
          
          <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 self-start md:self-center">
            <button className="px-6 py-2.5 bg-white text-emerald-950 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl">7 Days</button>
            <button className="px-6 py-2.5 text-white/60 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">30 Days</button>
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="premium-card p-8">
          <div className="flex items-center space-x-3 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
            <Target className="h-4 w-4" />
            <span>Consistency Score</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-5xl font-black text-emerald-950">92%</p>
            <div className="flex items-center text-emerald-500 font-black text-xs space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>+4%</span>
            </div>
          </div>
          <div className="mt-6 h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[92%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
        </div>

        <div className="premium-card p-8">
          <div className="flex items-center space-x-3 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
            <Shield className="h-4 w-4" />
            <span>Health Adherence</span>
          </div>
          <p className="text-5xl font-black text-emerald-950 uppercase tracking-tighter">Peak</p>
          <p className="mt-4 text-emerald-900/40 text-sm font-bold uppercase tracking-widest">
            Optimal Bio-Markers
          </p>
        </div>

        <div className="premium-card p-8 bg-emerald-950 text-white border-none shadow-[0_20px_40px_rgba(6,78,59,0.15)]">
          <div className="flex items-center space-x-3 text-emerald-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
            <Flame className="h-4 w-4" />
            <span>Daily Deficit</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-5xl font-black italic">340</p>
            <span className="text-emerald-400/60 font-black text-xs uppercase tracking-widest">kcal</span>
          </div>
          <p className="mt-4 text-emerald-100/40 text-[10px] font-black uppercase tracking-[0.2em]">7-Day Average</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-10">
          <WeeklyChart data={weeklyStats} />
          
          <div className="premium-card p-10 bg-emerald-50/50 border-emerald-100">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-emerald-950 tracking-tight">AI Correlation Engine</h3>
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-emerald-100/50">
                <Info className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2rem] bg-white border border-emerald-100 shadow-sm transition-all hover:shadow-md group">
                <div className="w-fit p-2.5 bg-emerald-50 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-emerald-950 text-base font-medium leading-relaxed">
                  "Your weight follows a sharp drop of <span className="text-emerald-600 font-black underline decoration-2 underline-offset-4">0.4kg</span> for every 4 consecutive days you exceed the 150g protein threshold."
                </p>
              </div>
              <div className="p-8 rounded-[2rem] bg-white border border-emerald-100 shadow-sm transition-all hover:shadow-md group">
                <div className="w-fit p-2.5 bg-rose-50 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <AlertCircle className="h-5 w-5 text-rose-500" />
                </div>
                <p className="text-emerald-950 text-base font-medium leading-relaxed">
                  "Sodium spikes on Friday evenings consistently correlate with a <span className="text-rose-500 font-black">1.2kg temporary water spike</span> on Saturday mornings."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          <div className="premium-card p-10">
            <div className="flex items-center space-x-3 mb-10">
              <div className="p-3 bg-emerald-50 rounded-2xl shadow-inner">
                <PieChart className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-emerald-950 tracking-tight">Macro Split</h3>
            </div>
            
            <div className="space-y-8">
              {[
                { label: 'Protein', val: 30, color: 'bg-emerald-600' },
                { label: 'Carbs', val: 45, color: 'bg-emerald-400' },
                { label: 'Fats', val: 25, color: 'bg-emerald-800' }
              ].map((macro) => (
                <div key={macro.label} className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.15em] text-emerald-900/40">
                    <span>{macro.label}</span>
                    <span className="text-emerald-950">{macro.val}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-emerald-50 rounded-full overflow-hidden p-0.5 border border-emerald-100/50">
                    <div className={cn("h-full rounded-full transition-all duration-1000 shadow-sm", macro.color)} style={{ width: `${macro.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-32 w-32" />
            </div>
            <h3 className="text-lg font-black mb-6 tracking-tight text-emerald-400">Weight Velocity</h3>
            <div className="flex items-baseline space-x-3">
              <span className="text-6xl font-black italic tracking-tighter">-0.8</span>
              <span className="text-sm font-bold text-emerald-100/40 uppercase tracking-widest">kg / week</span>
            </div>
            <div className="mt-8 p-6 rounded-[2rem] bg-white/5 border border-white/5 text-sm font-medium text-emerald-50/70 leading-relaxed">
              At this current velocity, the AI predicts you reaching your target in <span className="text-white font-black underline decoration-emerald-500 underline-offset-4">4.2 weeks</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
