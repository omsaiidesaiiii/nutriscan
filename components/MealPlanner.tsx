'use client'

import { useState } from 'react'
import { Calendar, Sparkles, Loader2, Salad, Coffee, UtensilsCrossed, Apple, Check, Plus, ArrowRight } from 'lucide-react'
import { logMealPlanAction } from '@/app/(dashboard)/dashboard/actions'
import toast from 'react-hot-toast'

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
      toast.success('Tomorrow\'s plan is ready!')
    } catch (error) {
      toast.error('AI could not generate plan. Please try again.')
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
      toast.success('Meal plan scheduled for tomorrow!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to log plan')
    } finally {
      setIsSaving(false)
    }
  }

  const MealCard = ({ meal, icon: Icon, label, color }: { meal: Meal, icon: any, label: string, color: string }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{label}</div>
      </div>
      <h4 className="font-bold text-gray-900 text-sm mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[40px]">
        {meal.name}
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-orange-50 px-2 py-1 rounded-lg text-[10px] font-bold text-orange-700">
          {meal.calories} kcal
        </div>
        <div className="bg-blue-50 px-2 py-1 rounded-lg text-[10px] font-bold text-blue-700">
          {meal.protein}g P
        </div>
      </div>
    </div>
  )

  const totalCalories = plan ? (plan.breakfast.calories + plan.lunch.calories + plan.dinner.calories + plan.snack.calories) : 0
  const totalProtein = plan ? (plan.breakfast.protein + plan.lunch.protein + plan.dinner.protein + plan.snack.protein) : 0
  const totalCarbs = plan ? (plan.breakfast.carbs + plan.lunch.carbs + plan.dinner.carbs + plan.snack.carbs) : 0
  const totalFat = plan ? (plan.breakfast.fat + plan.lunch.fat + plan.dinner.fat + plan.snack.fat) : 0

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Tomorrow's AI Planner</h2>
            <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider">Smart Recommendations</p>
          </div>
        </div>
        {!plan && !isLoading && (
          <button
            onClick={generatePlan}
            className="bg-white text-emerald-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all shadow-lg active:scale-95 flex items-center"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Plan Tomorrow
          </button>
        )}
      </div>

      <div className="p-8">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
            <p className="text-emerald-600 font-bold text-lg animate-pulse">Designing your perfect menu...</p>
            <p className="text-gray-400 text-sm mt-1">Balancing macros and health constraints</p>
          </div>
        ) : plan ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MealCard meal={plan.breakfast} icon={Coffee} label="Breakfast" color="bg-orange-500" />
              <MealCard meal={plan.lunch} icon={Salad} label="Lunch" color="bg-emerald-500" />
              <MealCard meal={plan.dinner} icon={UtensilsCrossed} label="Dinner" color="bg-indigo-500" />
              <MealCard meal={plan.snack} icon={Apple} label="Snack" color="bg-rose-500" />
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Calories</div>
                  <div className="text-xl font-black text-gray-900">{totalCalories} <span className="text-[10px] font-medium text-gray-400">/ {profile.target_calories}</span></div>
                </div>
                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Protein</div>
                  <div className="text-xl font-black text-gray-900">{totalProtein}g <span className="text-[10px] font-medium text-gray-400">/ {profile.target_protein}g</span></div>
                </div>
                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Carbs</div>
                  <div className="text-xl font-black text-gray-900">{totalCarbs}g <span className="text-[10px] font-medium text-gray-400">/ {profile.target_carbs}g</span></div>
                </div>
                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Fat</div>
                  <div className="text-xl font-black text-gray-900">{totalFat}g <span className="text-[10px] font-medium text-gray-400">/ {profile.target_fat}g</span></div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={generatePlan}
                  className="flex-1 sm:flex-none px-6 py-3 border-2 border-emerald-100 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all active:scale-95"
                >
                  Regenerate
                </button>
                <button
                  onClick={handleLogPlan}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Log Plan
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-emerald-50 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <Salad className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No plan for tomorrow yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium leading-relaxed">
              Get an AI-curated meal plan personalized to your goals and health conditions.
            </p>
            <button
              onClick={generatePlan}
              className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 flex items-center justify-center mx-auto"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Tomorrow's Plan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
