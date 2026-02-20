import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Utensils, History, Star, Search, Filter, Camera, Barcode } from 'lucide-react'
import AddMealForm from '@/components/AddMealForm'
import DeleteMealButton from '@/components/DeleteMealButton'
import { cn } from '@/lib/utils'

export default async function MealsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: meals } = await supabase
    .from('meals')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  const favorites = [
    { name: 'Greek Yogurt', cal: 320, p: 12, icon: '🥣' },
    { name: 'Grilled Salmon', cal: 450, p: 35, icon: '🐟' },
    { name: 'Protein Shake', cal: 180, p: 25, icon: '🥤' }
  ]

  return (
    <div className="space-y-8 pb-8 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Meal Journal</h1>
          <p className="text-sm text-zinc-500">{meals?.length || 0} meals logged · Track your daily nutrition.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Main Section */}
        <div className="xl:col-span-2 space-y-6">
          <AddMealForm />

          {/* Meal History */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="h-4 w-4 text-zinc-400" />
                <h2 className="text-base font-semibold text-zinc-900">Meal History</h2>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search meals..." 
                    className="pl-9 pr-4 py-2 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all w-48"
                  />
                </div>
              </div>
            </div>

            <div className="divide-y divide-zinc-50">
              {meals?.map((meal) => (
                <div key={meal.id} className="px-6 py-4 hover:bg-zinc-50/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex flex-col items-center justify-center h-11 w-11 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-400">
                      <span className="text-[10px] font-medium">{new Date(meal.created_at).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-sm font-semibold text-zinc-700 leading-none">{new Date(meal.created_at).getDate()}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900 group-hover:text-emerald-600 transition-colors">{meal.food_name}</h3>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-zinc-400">
                        <span className="font-medium text-emerald-600">{meal.calories} kcal</span>
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-2 text-zinc-200 hover:text-amber-400 hover:bg-amber-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                      <Star className="h-4 w-4" />
                    </button>
                    <DeleteMealButton id={meal.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Log Favorites */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-zinc-900">Quick Log</h3>
              <Star className="h-4 w-4 text-zinc-300" />
            </div>
            <div className="space-y-2">
              {favorites.map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100/50 transition-all text-left group">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 bg-white rounded-xl flex items-center justify-center text-lg border border-zinc-100">{item.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-zinc-700">{item.name}</p>
                      <p className="text-xs text-zinc-400">{item.cal} kcal · {item.p}g protein</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Capture Options */}
          <div className="card p-6">
            <h3 className="text-base font-semibold text-zinc-900 mb-2">Scan & Capture</h3>
            <p className="text-xs text-zinc-400 mb-5">
              Use your camera or scan a barcode to log meals instantly.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 flex items-center justify-center hover:bg-zinc-100 transition-all">
                <Camera className="h-4 w-4 mr-2 text-zinc-500" /> Camera
              </button>
              <button className="py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 flex items-center justify-center hover:bg-zinc-100 transition-all">
                <Barcode className="h-4 w-4 mr-2 text-zinc-500" /> Scanner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
