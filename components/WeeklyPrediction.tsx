'use client'

import { useState } from 'react'
import { TrendingUp, Sparkles, Loader2, BrainCircuit } from 'lucide-react'
import { getWeeklyAveragesAction } from '@/app/(dashboard)/dashboard/actions'
import toast from 'react-hot-toast'

interface WeeklyPredictionProps {
  profile: {
    weight: number
    target_calories: number
    target_protein: number
    goal: string
  }
}

export default function WeeklyPrediction({ profile }: WeeklyPredictionProps) {
  const [prediction, setPrediction] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async () => {
    setIsLoading(true)
    setPrediction(null)
    
    try {
      const stats = await getWeeklyAveragesAction()
      
      if (!stats) {
        throw new Error('Could not fetch weekly stats')
      }

      const response = await fetch('/api/weekly-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avg_calories: stats.avg_calories,
          avg_protein: stats.avg_protein,
          target_calories: profile.target_calories,
          target_protein: profile.target_protein,
          goal: profile.goal,
          weight: profile.weight
        })
      })

      if (!response.ok) throw new Error('AI analysis failed')
      
      const data = await response.json()
      setPrediction(data.prediction)
      toast.success('Weekly analysis complete!')
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <h2 className="text-base font-semibold text-zinc-900">AI Weekly Prediction</h2>
        </div>
        <Sparkles className="h-4 w-4 text-zinc-300" />
      </div>

      <div className="p-6">
        {!prediction && !isLoading ? (
          <div className="text-center py-4">
            <p className="text-sm text-zinc-500 mb-5">
              See if your current eating aligns with your <span className="text-emerald-600 font-medium capitalize">{profile.goal}</span> goal.
            </p>
            <button
              onClick={handleAnalyze}
              className="w-full flex justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]"
            >
              Analyze My Week
            </button>
          </div>
        ) : isLoading ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            <p className="mt-4 text-sm font-medium text-zinc-900">Analyzing your week...</p>
            <p className="text-xs text-zinc-400 mt-1">Reviewing your 7-day nutritional trends</p>
          </div>
        ) : (
          <div className="animate-in">
            <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-5">
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">Prediction</span>
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {prediction}
              </p>
            </div>
            
            <button
              onClick={handleAnalyze}
              className="w-full mt-4 py-2.5 border border-zinc-200 text-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-all active:scale-[0.98]"
            >
              Refresh Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
