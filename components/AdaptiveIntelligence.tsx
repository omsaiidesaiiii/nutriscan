'use client'

import { useEffect, useState } from 'react'
import { Flame, Trophy, TrendingDown, TrendingUp, AlertCircle, CheckCircle2, BrainCircuit, Loader2 } from 'lucide-react'
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

  return (
    <div className="space-y-6 animate-in">
      {/* Consistency Score */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-emerald-600" />
            <h3 className="text-base font-semibold text-zinc-900">Consistency Score</h3>
          </div>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
            {badge}
          </span>
        </div>

        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-4xl font-semibold text-zinc-900">{score_percentage}</span>
          <span className="text-lg text-zinc-400">%</span>
        </div>
        
        <div className="space-y-2">
          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-700 ease-out rounded-full"
              style={{ width: `${score_percentage}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400">{rating} status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Adaptive Advice */}
        <div className="card p-6 flex flex-col">
          <div className="flex items-center space-x-2 mb-5">
            <BrainCircuit className="h-4 w-4 text-emerald-600" />
            <h3 className="text-base font-semibold text-zinc-900">AI Advice</h3>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
            </div>
          ) : adjustment && (
            <div className={cn(
              "flex-1 p-4 rounded-xl border animate-in",
              adjustment.status === 'warning' 
                ? 'bg-zinc-50 border-zinc-200' 
                : 'bg-emerald-50/50 border-emerald-100'
            )}>
              <div className="flex items-start space-x-3">
                {adjustment.status === 'optimal' ? (
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-zinc-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-zinc-900 mb-1">
                    {adjustment.status === 'optimal' ? 'On Track' : 'Adjustment Needed'}
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {adjustment.explanation}
                  </p>
                </div>
              </div>
              
              {adjustment.suggested_calorie_change !== 0 && (
                <div className="mt-4 pt-3 border-t border-zinc-200/50 flex items-center justify-between">
                   <span className="text-xs text-zinc-400">Suggested change</span>
                   <div className="flex items-center text-sm font-semibold text-zinc-900">
                    {adjustment.suggested_calorie_change > 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1 text-zinc-500" />
                    )}
                    {Math.abs(adjustment.suggested_calorie_change)} kcal
                   </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Streak */}
        <div className="card p-6 flex flex-col">
          <div className="flex items-center space-x-2 mb-5">
            <Flame className="h-4 w-4 text-emerald-600" />
            <h3 className="text-base font-semibold text-zinc-900">Current Streak</h3>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-semibold text-zinc-900">{profile.current_streak || 0}</span>
                <span className="text-sm text-zinc-400">days</span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">Consecutive days of meal logging</p>
            </div>

            <div className="mt-5 flex space-x-2">
              {[1,2,3,4,5,6,7].map(i => (
                <div 
                  key={i} 
                  className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center border",
                    i <= (profile.current_streak || 0) 
                      ? "bg-emerald-50 border-emerald-200" 
                      : "bg-zinc-50 border-zinc-100"
                  )}
                >
                  <Flame className={cn(
                    "h-3.5 w-3.5", 
                    i <= (profile.current_streak || 0) ? "text-emerald-500" : "text-zinc-200"
                  )} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
