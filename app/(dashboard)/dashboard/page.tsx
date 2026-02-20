import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AddMealForm from '@/components/AddMealForm'
import { Utensils, Zap, Shield, Flame, TrendingUp, BrainCircuit, Calendar, ArrowRight } from 'lucide-react'
import DeleteMealButton from '@/components/DeleteMealButton'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  const startOfDay = new Date()
  startOfDay.setUTCHours(0, 0, 0, 0)
  
  const endOfDay = new Date()
  endOfDay.setUTCHours(23, 59, 59, 999)

  const [mealsResponse, profileResponse] = await Promise.all([
    supabase
      .from('meals')
      .select('*')
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())
      .order('created_at', { ascending: false }),
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

  const { data: meals } = mealsResponse

  const totals = (meals || []).reduce(
    (acc, meal) => ({
      calories: acc.calories + Number(meal.calories),
      protein: acc.protein + Number(meal.protein),
      carbs: acc.carbs + Number(meal.carbs),
      fat: acc.fat + Number(meal.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const MacroCard = ({ 
    label, 
    current, 
    target, 
    unit, 
    color 
  }: { 
    label: string, 
    current: number, 
    target: number, 
    unit: string, 
    color: string
  }) => {
    const percentage = Math.min((current / target) * 100, 100)
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-zinc-500">{label}</span>
          <span className="text-xs font-medium text-zinc-400">{Math.round(percentage)}%</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-semibold text-zinc-900">{Math.round(current)}</span>
            <span className="text-xs text-zinc-400">/ {target}{unit}</span>
          </div>
          
          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-700 ease-out rounded-full", color)}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8 animate-in">
      {/* Simple Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Good morning, {user.email?.split('@')[0]}
        </h1>
        <p className="text-sm text-zinc-500">
          You've consumed {totals.calories} of {profile.target_calories} kcal today.
        </p>
      </div>

      {/* Macro Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MacroCard label="Calories" current={totals.calories} target={profile.target_calories} unit=" kcal" color="bg-emerald-500" />
        <MacroCard label="Protein" current={totals.protein} target={profile.target_protein} unit="g" color="bg-emerald-600" />
        <MacroCard label="Carbs" current={totals.carbs} target={profile.target_carbs} unit="g" color="bg-emerald-400" />
        <MacroCard label="Fat" current={totals.fat} target={profile.target_fat} unit="g" color="bg-zinc-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Logging Section */}
        <div className="xl:col-span-2 space-y-6">
          <AddMealForm />

          {/* Quick Navigation */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { title: 'Planner', desc: 'AI meal plans', icon: Calendar, href: '/planner' },
              { title: 'Analytics', desc: 'Weekly trends', icon: TrendingUp, href: '/analytics' },
              { title: 'Intelligence', desc: 'AI insights', icon: BrainCircuit, href: '/intelligence' },
            ].map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="card p-5 flex flex-col items-center text-center hover:border-zinc-200 transition-all group"
              >
                <div className="p-2.5 bg-zinc-50 rounded-xl mb-3 group-hover:bg-emerald-50 transition-colors">
                  <item.icon className="h-5 w-5 text-zinc-500 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="text-sm font-medium text-zinc-900">{item.title}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Today's Meals */}
        <div className="card overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-zinc-50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900">Today's Meals</h2>
            <span className="text-xs text-zinc-400">{meals?.length || 0} logged</span>
          </div>

          <div className="flex-1">
            {(!meals || meals.length === 0) ? (
              <div className="py-16 text-center px-6">
                <div className="bg-zinc-50 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-7 w-7 text-zinc-300" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">No meals yet</h3>
                <p className="text-xs text-zinc-400 mt-1">Log your first meal to start tracking.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-50">
                {meals.map((meal) => (
                  <div key={meal.id} className="px-6 py-4 hover:bg-zinc-50/50 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-zinc-900 truncate">{meal.food_name}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs font-medium text-emerald-600">{meal.calories} kcal</span>
                        <span className="text-xs text-zinc-400">P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g</span>
                      </div>
                    </div>
                    <DeleteMealButton id={meal.id} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-zinc-50">
             <Link href="/meals" className="w-full py-2.5 border border-zinc-200 rounded-xl flex items-center justify-center space-x-2 hover:bg-zinc-50 transition-all text-sm font-medium text-zinc-700 group">
                <span>View all meals</span>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
