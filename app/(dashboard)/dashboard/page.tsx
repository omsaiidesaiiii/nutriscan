import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '../../(auth)/actions'
import AddMealForm from '@/components/AddMealForm'
import { Trash2, Utensils, Zap, Shield, Flame, Activity } from 'lucide-react'
import { deleteMeal, getWeeklyStats } from './actions'
import AIFeedback from '@/components/AIFeedback'
import WeeklyChart from '@/components/WeeklyChart'
import DeleteMealButton from '@/components/DeleteMealButton'

import WeeklyPrediction from '@/components/WeeklyPrediction'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // Get start and end of today in UTC
  const startOfDay = new Date()
  startOfDay.setUTCHours(0, 0, 0, 0)
  
  const endOfDay = new Date()
  endOfDay.setUTCHours(23, 59, 59, 999)

  // Parallel fetch for today's meals, weekly stats, and user profile
  const [mealsResponse, weeklyStats, profileResponse] = await Promise.all([
    supabase
      .from('meals')
      .select('*')
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())
      .order('created_at', { ascending: false }),
    getWeeklyStats(),
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
  ])

  const { data: profile } = profileResponse

  if (!profile) {
    redirect('/profile')
  }

  const { data: meals, error: mealsError } = mealsResponse

  if (mealsError) {
    console.error('Error fetching meals:', mealsError)
  }

  // Calculate totals
  const totals = (meals || []).reduce(
    (acc, meal) => ({
      calories: acc.calories + Number(meal.calories),
      protein: acc.protein + Number(meal.protein),
      carbs: acc.carbs + Number(meal.carbs),
      fat: acc.fat + Number(meal.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const ProgressBar = ({ current, target, colorClass }: { current: number, target: number, colorClass: string }) => {
    const percentage = Math.min((current / target) * 100, 100)
    return (
      <div className="mt-4">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
          <span className="text-gray-400">Progress</span>
          <span className={percentage >= 100 ? 'text-emerald-500' : 'text-gray-500'}>
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colorClass} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                SmartNutrition
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-900">{user.email?.split('@')[0]}</span>
                <span className="text-xs text-gray-400">{user.email}</span>
              </div>
              <a href="/profile" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Profile</a>
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Daily Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Calories</span>
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold text-gray-900">{totals.calories}</span>
              <span className="text-sm text-gray-400 font-medium whitespace-nowrap">/ {profile.target_calories} kcal</span>
            </div>
            <ProgressBar current={totals.calories} target={profile.target_calories} colorClass="bg-orange-500" />
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Protein</span>
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold text-gray-900">{totals.protein}</span>
              <span className="text-sm text-gray-400 font-medium whitespace-nowrap">/ {profile.target_protein} g</span>
            </div>
            <ProgressBar current={totals.protein} target={profile.target_protein} colorClass="bg-blue-500" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Carbs</span>
              <Shield className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold text-gray-900">{totals.carbs}</span>
              <span className="text-sm text-gray-400 font-medium whitespace-nowrap">/ {profile.target_carbs} g</span>
            </div>
            <ProgressBar current={totals.carbs} target={profile.target_carbs} colorClass="bg-emerald-500" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Fat</span>
              <Utensils className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold text-gray-900">{totals.fat}</span>
              <span className="text-sm text-gray-400 font-medium whitespace-nowrap">/ {profile.target_fat} g</span>
            </div>
            <ProgressBar current={totals.fat} target={profile.target_fat} colorClass="bg-purple-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <WeeklyChart data={weeklyStats} />
            <AddMealForm />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <WeeklyPrediction profile={profile} />
            <AIFeedback totals={totals} targets={profile} />
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Today's Meals</h2>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {meals?.length || 0} items
                </span>
              </div>

              {(!meals || meals.length === 0) ? (
                <div className="py-20 text-center">
                  <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Utensils className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No meals logged for today yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Start by adding your first meal above.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                  {meals.map((meal) => (
                    <div key={meal.id} className="px-8 py-5 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{meal.food_name}</h3>
                        <div className="flex items-center space-x-4 text-sm font-medium">
                          <span className="text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-lg">{meal.calories} kcal</span>
                          <div className="flex items-center space-x-3 text-gray-500">
                            <span>P: {meal.protein}g</span>
                            <span>C: {meal.carbs}g</span>
                            <span>F: {meal.fat}g</span>
                          </div>
                        </div>
                      </div>
                      <DeleteMealButton id={meal.id} />
                    </div>
                  ))}

                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
