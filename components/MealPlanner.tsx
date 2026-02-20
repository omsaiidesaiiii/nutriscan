'use client'

import { useState } from 'react'
import { Calendar, Sparkles, Loader2, Salad, Coffee, UtensilsCrossed, Apple, Check, Plus, ArrowRight, Zap, Target, Flame } from 'lucide-react'
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
      toast.success('Strategy blueprint generated!')
    } catch (error) {
      toast.error('Strategic engine failed. Retrying...')
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
      toast.success('Strategy deployed to timeline!')
    } catch (error: any) {
      toast.error(error.message || 'Deployment failed')
    } finally {
      setIsSaving(false)
    }
  }

  const MealCard = ({ meal, icon: Icon, label, color }: { meal: Meal, icon: any, label: string, color: string }) => (
    <div className="premium-card p-6 border-emerald-50 bg-white group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-2xl shadow-xl shadow-opacity-10", color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="text-[10px] font-black uppercase text-emerald-900/30 tracking-widest">{label}</div>
      </div>
      <h4 className="font-black text-emerald-950 text-base mb-4 group-hover:text-emerald-500 transition-colors line-clamp-2 min-h-[48px] uppercase tracking-tight italic">
        {meal.name}
      </h4>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-emerald-950 text-emerald-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center">
          <Flame className="h-3 w-3 mr-1.5 shrink-0" />
          {meal.calories}
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center">
          {meal.protein}G P
        </div>
      </div>
    </div>
  )

  const totalCalories = plan ? (plan.breakfast.calories + plan.lunch.calories + plan.dinner.calories + plan.snack.calories) : 0
  const totalProtein = plan ? (plan.breakfast.protein + plan.lunch.protein + plan.dinner.protein + plan.snack.protein) : 0
  const totalCarbs = plan ? (plan.breakfast.carbs + plan.lunch.carbs + plan.dinner.carbs + plan.snack.carbs) : 0
  const totalFat = plan ? (plan.breakfast.fat + plan.lunch.fat + plan.dinner.fat + plan.snack.fat) : 0

  return (
    <div className="premium-card bg-white border-emerald-100/50 overflow-hidden">
      <div className="bg-emerald-950 px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
            <Zap className="h-60 w-60 text-white" />
        </div>
        <div className="flex items-center space-x-5 relative z-10">
          <div className="bg-emerald-500 p-3.5 rounded-2xl shadow-2xl shadow-emerald-500/20 transform rotate-3">
            <Sparkles className="h-7 w-7 text-emerald-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] mb-1">
               <Zap className="h-3 w-3" />
               <span>Gemini 2.5 Strategic Engine</span>
            </div>
            <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">Optimal Blueprint</h2>
          </div>
        </div>
        
        {!plan && !isLoading && (
          <button
            onClick={generatePlan}
            className="bg-white text-emerald-950 px-8 h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all shadow-2xl active:scale-95 flex items-center relative z-10"
          >
            <Zap className="mr-2.5 h-4 w-4 fill-emerald-500 text-emerald-500" />
            Initialize Plan
          </button>
        )}
      </div>

      <div className="p-10">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="relative">
                <div className="h-24 w-24 border-8 border-emerald-50 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <BrainCircuit className="h-8 w-8 text-emerald-500 animate-pulse" />
                </div>
            </div>
            <p className="text-emerald-950 font-black text-2xl uppercase italic tracking-tighter mt-10 animate-pulse">Architecting Menu...</p>
            <p className="text-emerald-900/30 text-[10px] font-black uppercase tracking-widest mt-3">Synthesizing metabolic constraints</p>
          </div>
        ) : plan ? (
          <div className="animate-in space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MealCard meal={plan.breakfast} icon={Coffee} label="Opening" color="bg-orange-500" />
              <MealCard meal={plan.lunch} icon={Salad} label="Peak" color="bg-emerald-500" />
              <MealCard meal={plan.dinner} icon={UtensilsCrossed} label="Recovery" color="bg-rose-500" />
              <MealCard meal={plan.snack} icon={Apple} label="Auxiliary" color="bg-sky-500" />
            </div>

            <div className="bg-emerald-50/50 rounded-[2.5rem] p-10 flex flex-col xl:flex-row items-center justify-between gap-10 border border-emerald-50">
              <div className="flex flex-wrap items-center gap-10">
                <div>
                  <div className="text-[10px] font-black uppercase text-emerald-900/30 tracking-widest mb-2">Projected Ingestion</div>
                  <div className="text-3xl font-black text-emerald-950 italic tracking-tighter">
                    {totalCalories} <span className="text-xs font-bold text-emerald-900/20 italic tracking-normal uppercase">/ {profile.target_calories}</span>
                  </div>
                </div>
                <div className="h-12 w-px bg-emerald-100 hidden xl:block"></div>
                <div className="grid grid-cols-3 gap-8">
                    <div>
                        <div className="text-[10px] font-black uppercase text-emerald-900/30 tracking-widest mb-1">P</div>
                        <div className="text-lg font-black text-emerald-950 italic tracking-tighter">{totalProtein}G</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase text-emerald-900/30 tracking-widest mb-1">C</div>
                        <div className="text-lg font-black text-emerald-950 italic tracking-tighter">{totalCarbs}G</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase text-emerald-900/30 tracking-widest mb-1">F</div>
                        <div className="text-lg font-black text-emerald-950 italic tracking-tighter">{totalFat}G</div>
                    </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full xl:w-auto">
                <button
                  onClick={generatePlan}
                  className="flex-1 xl:flex-none h-14 px-8 border border-emerald-200 text-emerald-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all active:scale-[0.98]"
                >
                  Iterate
                </button>
                <button
                  onClick={handleLogPlan}
                  disabled={isSaving}
                  className="flex-1 xl:flex-none h-14 px-10 bg-emerald-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-950/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3 group"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-emerald-400" /> : <Target className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />}
                  <span>Commit Sequence</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-14">
            <div className="bg-emerald-50 h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transform rotate-6 border border-emerald-100 shadow-inner">
              <Salad className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-emerald-950 mb-3 tracking-tighter uppercase italic">Null Operational Plan</h3>
            <p className="text-emerald-900/40 max-w-sm mx-auto mb-10 text-xs font-bold leading-relaxed uppercase tracking-widest">
              Gemini awaiting signal to synthesize tomorrow's nutritional roadmap based on your velocity.
            </p>
            <button
              onClick={generatePlan}
              className="px-14 h-16 bg-emerald-950 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-950/20 active:scale-[0.98] flex items-center justify-center mx-auto space-x-3 group"
            >
              <Sparkles className="h-4 w-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>Initiate Strategic Forecast</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function BrainCircuit(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
      <path d="M18 22v-2a2 2 0 0 0-2-2h-2" />
      <path d="M8 22v-2a2 2 0 0 1 2-2h2" />
      <path d="M18 2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9V6" />
      <path d="M12 18v-3" />
      <path d="M9 12H6" />
      <path d="M18 12h-3" />
    </svg>
  )
}
