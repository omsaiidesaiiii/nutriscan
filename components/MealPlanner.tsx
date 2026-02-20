'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Coffee, UtensilsCrossed, Apple, Flame } from 'lucide-react'
import { logMealPlanAction } from '@/app/(dashboard)/dashboard/actions'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface MealPlan {
  breakfast: Meal
  lunch: Meal
  dinner: Meal
  snack: Meal
}

interface Meal {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface MealPlannerProps {
  profile: {
    target_calories: number
    target_protein: number
    target_carbs: number
    target_fat: number
    goal: string
    health_conditions: string[]
  }
  weeklyStats?: any[]
}

export default function MealPlanner({ profile, weeklyStats }: MealPlannerProps) {
  const [plan, setPlan] = useState<MealPlan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const generatePlan = async () => {
    setIsLoading(true)
    setPlan(null)
    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          weekly_trend: weeklyStats
        })
      })

      if (!response.ok) throw new Error('Failed to generate plan')
      const data = await response.json()
      setPlan(data)
      toast.success('Meal plan generated!')
    } catch (error) {
      toast.error('Plan generation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogPlan = async () => {
    if (!plan) return
    setIsSaving(true)
    try {
      const meals = [
        { ...plan.breakfast, type: 'Breakfast' },
        { ...plan.lunch, type: 'Lunch' },
        { ...plan.dinner, type: 'Dinner' },
        { ...plan.snack, type: 'Snack' }
      ]
      const result = await logMealPlanAction(meals)
      if (result.error) throw new Error(result.error)
      toast.success('Meals logged to your journal!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to log meals')
    } finally {
      setIsSaving(false)
    }
  }

  const MealCard = ({ meal, icon: Icon, label }: { meal: Meal, icon: any, label: string }) => (
    <div className="card p-5 group">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
          <Icon className="h-4 w-4 text-zinc-500 group-hover:text-emerald-600 transition-colors" />
        </div>
        <span className="text-xs font-medium text-zinc-400">{label}</span>
      </div>
      <h4 className="font-medium text-zinc-900 text-sm mb-3 line-clamp-2 min-h-[40px]">
        {meal.name}
      </h4>
      <div className="flex items-center space-x-3 text-xs">
        <span className="font-medium text-emerald-600">{meal.calories} kcal</span>
        <span className="text-zinc-400">{meal.protein}g protein</span>
      </div>
    </div>
  )

  const totalCalories = plan ? (plan.breakfast.calories + plan.lunch.calories + plan.dinner.calories + plan.snack.calories) : 0
  const totalProtein = plan ? (plan.breakfast.protein + plan.lunch.protein + plan.dinner.protein + plan.snack.protein) : 0
  const totalCarbs = plan ? (plan.breakfast.carbs + plan.lunch.carbs + plan.dinner.carbs + plan.snack.carbs) : 0
  const totalFat = plan ? (plan.breakfast.fat + plan.lunch.fat + plan.dinner.fat + plan.snack.fat) : 0

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 border-b border-zinc-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900">AI Meal Plan</h2>
            <p className="text-xs text-zinc-400">Powered by Gemini</p>
          </div>
        </div>
        
        {!plan && !isLoading && (
          <button
            onClick={generatePlan}
            className="flex items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Plan
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            <p className="text-sm font-medium text-zinc-900 mt-4">Generating your meal plan...</p>
            <p className="text-xs text-zinc-400 mt-1">Analyzing your goals and preferences</p>
          </div>
        ) : plan ? (
          <div className="animate-in space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MealCard meal={plan.breakfast} icon={Coffee} label="Breakfast" />
              <MealCard meal={plan.lunch} icon={UtensilsCrossed} label="Lunch" />
              <MealCard meal={plan.dinner} icon={UtensilsCrossed} label="Dinner" />
              <MealCard meal={plan.snack} icon={Apple} label="Snack" />
            </div>

            {/* Summary */}
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-xs text-zinc-400 mb-0.5">Total Calories</div>
                  <div className="text-xl font-semibold text-zinc-900">
                    {totalCalories} <span className="text-sm text-zinc-400 font-normal">/ {profile.target_calories}</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-zinc-200 hidden md:block"></div>
                <div className="flex items-center gap-5 text-sm">
                  <div>
                    <span className="text-zinc-400">P: </span>
                    <span className="font-medium text-zinc-700">{totalProtein}g</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">C: </span>
                    <span className="font-medium text-zinc-700">{totalCarbs}g</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">F: </span>
                    <span className="font-medium text-zinc-700">{totalFat}g</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={generatePlan}
                  className="flex-1 md:flex-none rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-white transition-all"
                >
                  Regenerate
                </button>
                <button
                  onClick={handleLogPlan}
                  disabled={isSaving}
                  className="flex-1 md:flex-none flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log All Meals'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-zinc-50 h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100">
              <Sparkles className="h-6 w-6 text-zinc-300" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">No plan generated</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
              Generate an AI-powered meal plan tailored to your {profile.target_calories} kcal target.
            </p>
            <button
              onClick={generatePlan}
              className="mt-5 flex items-center justify-center mx-auto rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Meal Plan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
