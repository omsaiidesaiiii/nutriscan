'use client'

import { useState } from 'react'
import { Sparkles, Loader2, RefreshCw } from 'lucide-react'

interface AIFeedbackProps {
  totals: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  targets: {
    target_calories: number
    target_protein: number
    target_carbs: number
    target_fat: number
  }
}

export default function AIFeedback({ totals, targets }: AIFeedbackProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getFeedback = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totals, targets }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI feedback')
      }

      setFeedback(data.feedback)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-6">
      {!feedback && !isLoading ? (
        <button
          onClick={getFeedback}
          className="w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]"
        >
          <Sparkles className="h-4 w-4" />
          <span>Get AI Nutrition Insights</span>
        </button>
      ) : (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                <Sparkles className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-base font-semibold text-zinc-900">AI Insights</h2>
            </div>
            
            <button 
              onClick={getFeedback}
              disabled={isLoading}
              className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
              <p className="text-sm text-zinc-400 mt-3">Analyzing your nutrition...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-zinc-50 text-zinc-700 rounded-xl border border-zinc-200 text-sm">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {feedback}
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
                <Sparkles className="h-3 w-3" />
                <span>Powered by Gemini</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
