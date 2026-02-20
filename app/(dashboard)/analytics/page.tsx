import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BarChart3, TrendingUp, PieChart, Target, Flame, Info, AlertCircle } from 'lucide-react'
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
    <div className="space-y-8 pb-8 animate-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Analytics</h1>
        <p className="text-sm text-zinc-500">Your nutritional performance and weekly trends.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center space-x-2 text-zinc-500 mb-3">
            <Target className="h-4 w-4" />
            <span className="text-sm font-medium">Consistency Score</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-semibold text-zinc-900">92%</p>
            <div className="flex items-center text-emerald-600 text-xs font-medium space-x-0.5">
              <TrendingUp className="h-3 w-3" />
              <span>+4%</span>
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[92%] rounded-full" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-2 text-zinc-500 mb-3">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-medium">Health Adherence</span>
          </div>
          <p className="text-3xl font-semibold text-zinc-900">Peak</p>
          <p className="mt-2 text-sm text-zinc-400">Optimal bio-markers</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-2 text-zinc-500 mb-3">
            <Flame className="h-4 w-4" />
            <span className="text-sm font-medium">Daily Deficit</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <p className="text-3xl font-semibold text-zinc-900">340</p>
            <span className="text-sm text-zinc-400">kcal</span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">7-day average</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-6">
          <WeeklyChart data={weeklyStats} />
          
          {/* AI Insights */}
          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-zinc-900">AI Insights</h3>
              <div className="p-2 bg-zinc-50 rounded-xl">
                <Info className="h-4 w-4 text-zinc-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="w-fit p-2 bg-white rounded-xl mb-3 border border-zinc-100">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  Your weight follows a drop of <span className="text-emerald-600 font-semibold">0.4kg</span> for every 4 consecutive days exceeding the 150g protein threshold.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="w-fit p-2 bg-white rounded-xl mb-3 border border-zinc-100">
                  <AlertCircle className="h-4 w-4 text-zinc-500" />
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  Sodium spikes on Friday evenings correlate with a <span className="font-semibold text-zinc-900">1.2kg temporary water spike</span> on Saturday mornings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Macro Split */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-6">
              <PieChart className="h-4 w-4 text-zinc-500" />
              <h3 className="text-base font-semibold text-zinc-900">Macro Split</h3>
            </div>
            
            <div className="space-y-5">
              {[
                { label: 'Protein', val: 30, color: 'bg-emerald-600' },
                { label: 'Carbs', val: 45, color: 'bg-emerald-400' },
                { label: 'Fats', val: 25, color: 'bg-zinc-400' }
              ].map((macro) => (
                <div key={macro.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 font-medium">{macro.label}</span>
                    <span className="text-zinc-900 font-medium">{macro.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-700", macro.color)} style={{ width: `${macro.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weight Velocity */}
          <div className="card p-6">
            <h3 className="text-base font-semibold text-zinc-900 mb-4">Weight Trend</h3>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-semibold text-zinc-900">-0.8</span>
              <span className="text-sm text-zinc-400">kg / week</span>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <p className="text-sm text-zinc-600 leading-relaxed">
                At this rate, you'll reach your target in <span className="text-zinc-900 font-semibold">4.2 weeks</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
