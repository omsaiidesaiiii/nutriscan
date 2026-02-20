'use client'

import { useEffect, useState } from 'react'
import { Brain, Flame, Trophy, TrendingDown, TrendingUp, AlertCircle, CheckCircle2, Zap, Target, Sparkles, BrainCircuit } from 'lucide-react'
import { calculateConsistencyScore } from '@/lib/calculateConsistencyScore'
import { cn } from '@/lib/utils'

interface AdaptiveIntelligenceProps {
  profile: any
  weeklyStats: any[]
}

export default function AdaptiveIntelligence({ profile, weeklyStats }: AdaptiveIntelligenceProps) {
  const [adjustment, setAdjustment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { score_percentage, rating, badge } = calculateConsistencyScore(weeklyStats, {
    calories: profile.target_calories,
    protein: profile.target_protein
  })

  useEffect(() => {
    async function getAdjustment() {
      try {
        const avg_calories = weeklyStats.reduce((acc, day) => acc + day.calories, 0) / (weeklyStats.length || 7)
        const res = await fetch('/api/adaptive-adjustment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            avg_calories,
            weight: profile.weight,
            target_calories: profile.target_calories,
            goal: profile.goal
          })
        })
        const data = await res.json()
        setAdjustment(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    getAdjustment()
  }, [weeklyStats, profile])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'warning': return 'text-rose-500 bg-rose-50 border-rose-100'
      case 'mild_adjustment': return 'text-emerald-950 bg-emerald-50 border-emerald-100'
      default: return 'text-emerald-700 bg-emerald-50 border-emerald-100'
    }
  }

  const getBadgeColor = (percentage: number) => {
    if (percentage >= 90) return 'from-emerald-900 to-emerald-950'
    if (percentage >= 75) return 'from-emerald-600 to-emerald-800'
    if (percentage >= 50) return 'from-emerald-400 to-emerald-600'
    return 'from-slate-400 to-slate-600'
  }

  return (
    <div className="space-y-8 animate-in">
      {/* High Performance Score */}
      <div className={cn("p-10 rounded-[3rem] bg-gradient-to-br text-white shadow-2xl relative overflow-hidden group", getBadgeColor(score_percentage))}>
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700 rotate-12">
            <Trophy className="h-60 w-60" />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                 <Zap className="h-3.5 w-3.5 fill-emerald-400" />
                 <span>Synchronicity Vector</span>
              </div>
              <div className="text-6xl font-black italic tracking-tighter leading-none">{score_percentage}<span className="text-emerald-400">%</span></div>
            </div>
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl">
              <Trophy className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-[1500ms] ease-out shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                style={{ width: `${score_percentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/60 italic">{rating} Status</span>
              <div className="flex items-center space-x-2 bg-emerald-400 text-emerald-950 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-400/20">
                <Sparkles className="h-3 w-3 fill-emerald-950" />
                <span>{badge}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Adaptive Advice */}
        <div className="premium-card p-10 bg-white border-emerald-50 flex flex-col">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-emerald-950 rounded-2xl shadow-xl shadow-emerald-950/10">
              <BrainCircuit className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="font-black text-emerald-950 tracking-tight uppercase italic text-xl">Bio-Logic</h3>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-emerald-50 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : adjustment && (
            <div className={cn("flex-1 p-6 rounded-[2rem] border transition-all animate-in flex flex-col justify-between", getStatusStyle(adjustment.status))}>
              <div className="flex items-start space-x-4">
                {adjustment.status === 'optimal' ? (
                  <CheckCircle2 className="h-6 w-6 mt-1 flex-shrink-0 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-6 w-6 mt-1 flex-shrink-0 text-rose-500" />
                )}
                <div>
                  <p className="text-base font-black uppercase tracking-tight italic mb-2">
                    {adjustment.status === 'optimal' ? 'State: Optimal' : 'State: Correction Required'}
                  </p>
                  <p className="text-xs font-bold leading-relaxed uppercase opacity-40">
                    {adjustment.explanation}
                  </p>
                </div>
              </div>
              
              {adjustment.suggested_calorie_change !== 0 && (
                <div className="mt-8 pt-6 border-t border-emerald-950/5 flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Suggested Delta</span>
                   <div className="flex items-center font-black text-xl italic tracking-tighter">
                    {adjustment.suggested_calorie_change > 0 ? (
                      <TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 mr-2 text-rose-500" />
                    )}
                    {Math.abs(adjustment.suggested_calorie_change)} <span className="text-xs ml-1 uppercase not-italic opacity-40">kcal</span>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Momentum Engine */}
        <div className="bg-emerald-950 p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group border border-emerald-900">
           <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
            <Flame className="h-80 w-80" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
               <Zap className="h-3.5 w-3.5 fill-emerald-400" />
               <span>Momentum Vector</span>
            </div>
            <div className="flex items-baseline space-x-3">
              <span className="text-7xl font-black tracking-tighter italic leading-none">{profile.current_streak || 0}</span>
              <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">Day Sequence</span>
            </div>
          </div>

          <div className="mt-12 relative z-10 flex items-center justify-between">
            <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full bg-emerald-900 border-2 border-emerald-950 flex items-center justify-center shadow-2xl">
                     <Flame className={cn("h-5 w-5", i <= (profile.current_streak || 0) ? "text-emerald-400 fill-emerald-400" : "text-emerald-800")} />
                  </div>
               ))}
            </div>
            <div className="bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-xl group-hover:bg-emerald-500 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <Flame className="h-8 w-8 text-white fill-white group-hover:text-emerald-950 group-hover:fill-emerald-950 transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

