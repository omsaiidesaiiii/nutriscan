'use client'

import { useState } from 'react'
import { Sparkles, Loader2, BrainCircuit, RefreshCw } from 'lucide-react'

interface AIFeedbackProps {
  totals: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export default function AIFeedback({ totals }: AIFeedbackProps) {
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
        body: JSON.stringify(totals),
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
    <div className="mb-8">
      {!feedback && !isLoading ? (
        <button
          onClick={getFeedback}
          className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all active:scale-[0.98] group"
        >
          <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
          <span>Get AI Nutrition Insights</span>
        </button>
      ) : (
        <div className="bg-white p-8 rounded-[2rem] border border-indigo-50 shadow-xl relative overflow-hidden group">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BrainCircuit className="h-32 w-32 text-indigo-600" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-600/20 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">AI Personal Coach</h2>
              </div>
              
              <button 
                onClick={getFeedback}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                title="Refresh Suggestion"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {isLoading ? (
              <div className="py-10 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                  <Sparkles className="h-4 w-4 text-purple-600 absolute bottom-0 right-0 animate-bounce" />
                </div>
                <p className="text-gray-500 font-medium animate-pulse">Consulting Gemini AI...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center space-x-3">
                <div className="bg-white p-1 rounded-lg">⚠️</div>
                <p className="font-semibold">{error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-gray-700 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                  {feedback}
                </div>
                <div className="pt-4 flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  <BrainCircuit className="h-4 w-4" />
                  <span>Powered by Gemini 2.0 Flash</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
