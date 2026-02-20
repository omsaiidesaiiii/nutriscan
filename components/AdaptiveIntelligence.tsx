'use client'

import { useEffect, useState } from 'react'
import { Brain, Flame, Trophy, TrendingDown, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { calculateConsistencyScore } from '@/lib/calculateConsistencyScore'

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning': return 'text-rose-600 bg-rose-50 border-rose-100'
      case 'mild_adjustment': return 'text-amber-600 bg-amber-50 border-amber-100'
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-100'
    }
  }

  const getBadgeColor = (percentage: number) => {
    if (percentage >= 90) return 'from-indigo-600 to-purple-600'
    if (percentage >= 75) return 'from-emerald-500 to-teal-500'
    if (percentage >= 50) return 'from-amber-500 to-orange-500'
    return 'from-gray-400 to-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Consistency & Badge Section */}
      <div className={`p-6 rounded-3xl bg-gradient-to-br ${getBadgeColor(score_percentage)} text-white shadow-xl shadow-indigo-100`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Weekly Consistency</div>
            <div className="text-3xl font-black">{score_percentage}%</div>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <Trophy className="h-6 w-6" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000"
              style={{ width: `${score_percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider">{rating}</span>
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
              <span>{badge}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive Adjustment Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-indigo-50 p-2 rounded-xl">
            <Brain className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="font-bold text-gray-900">Adaptive Intelligence</h3>
        </div>

        {loading ? (
          <div className="h-24 flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : adjustment && (
          <div className={`p-4 rounded-2xl border ${getStatusColor(adjustment.status)}`}>
            <div className="flex items-start space-x-3">
              {adjustment.status === 'optimal' ? (
                <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-bold mb-1">
                  {adjustment.status === 'optimal' ? 'Energy Balance Optimal' : 'Adjustment Recommended'}
                </p>
                <p className="text-xs leading-relaxed opacity-90">
                  {adjustment.explanation}
                </p>
                {adjustment.suggested_calorie_change !== 0 && (
                  <div className="mt-3 flex items-center text-xs font-black uppercase">
                    {adjustment.suggested_calorie_change > 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(adjustment.suggested_calorie_change)} kcal Daily Adjustment
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Streak Counter */}
      <div className="bg-indigo-600 p-6 rounded-3xl text-white flex items-center justify-between shadow-lg shadow-indigo-200 overflow-hidden relative group">
        <div className="relative z-10">
          <div className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Daily Dedication</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black tracking-tighter">{profile.current_streak || 0}</span>
            <span className="text-sm font-bold text-indigo-100">Day Streak</span>
          </div>
        </div>
        <div className="relative z-10 bg-white/20 p-4 rounded-2xl backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
          <Flame className="h-8 w-8 text-white fill-white animate-pulse" />
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Flame className="h-32 w-32" />
        </div>
      </div>
    </div>
  )
}
