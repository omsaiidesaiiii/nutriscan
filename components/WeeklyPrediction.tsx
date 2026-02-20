'use client'

import { useState } from 'react'
import { TrendingUp, Sparkles, Loader2, BrainCircuit, ChevronRight } from 'lucide-react'
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
      // 1. Get weekly stats via Server Action
      const stats = await getWeeklyAveragesAction()
      
      if (!stats) {
        throw new Error('Could not fetch weekly stats')
      }

      // 2. Call AI Prediction API
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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Weekly AI Prediction</h2>
              <p className="text-purple-100 text-xs font-medium uppercase tracking-wider">Trend Analysis</p>
            </div>
          </div>
          <Sparkles className="h-6 w-6 text-purple-200 animate-pulse" />
        </div>
      </div>

      <div className="p-8">
        {!prediction && !isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-6 font-medium">
              Ready to see if your current eating habits align with your <span className="text-indigo-600 font-bold">{profile.goal}</span> goal?
            </p>
            <button
              onClick={handleAnalyze}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center group"
            >
              Analyze My Week
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-25"></div>
              <div className="relative bg-indigo-50 p-4 rounded-full">
                <BrainCircuit className="h-10 w-10 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-indigo-600 font-bold animate-pulse">Consulting AI Nutritionist...</p>
            <p className="text-gray-400 text-xs mt-1">Analyzing your 7-day nutritional trends</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BrainCircuit className="h-24 w-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">Prediction</span>
                </div>
                <p className="text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
                  {prediction}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleAnalyze}
              className="w-full mt-6 py-3 border-2 border-indigo-100 text-indigo-600 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center"
            >
              <Loader2 className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : 'hidden'}`} />
              Refresh Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
