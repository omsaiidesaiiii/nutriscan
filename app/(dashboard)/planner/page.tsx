import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar as CalendarIcon, Sparkles, Clock, CheckCircle2, ShoppingBag } from 'lucide-react'
import MealPlanner from '@/components/MealPlanner'
import { cn } from '@/lib/utils'

export default async function PlannerPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/profile')

  return (
    <div className="space-y-8 pb-8 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Meal Planner</h1>
          <p className="text-sm text-zinc-500">
            AI-generated meal plans based on your {profile.target_calories} kcal target.
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-zinc-500">
          <div className="flex items-center space-x-1.5">
            <span className="font-medium text-zinc-900">{profile.target_calories}</span>
            <span>kcal/day</span>
          </div>
          <div className="h-4 w-px bg-zinc-200"></div>
          <div className="flex items-center space-x-1.5">
            <span className="font-medium text-zinc-900 capitalize">{profile.goal}</span>
            <span>mode</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Main Component */}
        <div className="xl:col-span-2 space-y-6">
          <MealPlanner profile={profile} />
          
          {/* Weekly View */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-zinc-900">This Week</h2>
              <div className="flex items-center space-x-1.5 text-sm text-zinc-400">
                <CalendarIcon className="h-4 w-4" />
                <span>Feb 20 – Feb 26</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center gap-2 overflow-x-auto pb-2">
              {[ 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu' ].map((day, i) => (
                <div 
                  key={day} 
                  className={cn(
                    "flex flex-col items-center min-w-[72px] p-4 rounded-2xl border transition-all cursor-pointer",
                    i === 1 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200'
                  )}
                >
                  <span className="text-xs font-medium mb-1">{day}</span>
                  <span className="text-lg font-semibold text-zinc-900">{20 + i}</span>
                  {i === 1 && <div className="mt-1.5 h-1.5 w-1.5 bg-emerald-500 rounded-full" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shopping List */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4 text-zinc-500" />
                <h3 className="text-base font-semibold text-zinc-900">Shopping List</h3>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mb-5">
              Auto-generated based on tomorrow's meal plan.
            </p>
            <div className="space-y-2">
              {[ 
                { item: 'Greek Yogurt', qty: '500g', check: true },
                { item: 'Chicken Breast', qty: '400g', check: false },
                { item: 'Avocado', qty: '2 units', check: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "h-5 w-5 rounded-lg border flex items-center justify-center",
                      item.check ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-300 bg-white'
                    )}>
                      {item.check && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <span className={cn("text-sm font-medium", item.check ? 'text-zinc-400 line-through' : 'text-zinc-700')}>{item.item}</span>
                  </div>
                  <span className="text-xs text-zinc-400">{item.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Timing */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-5">
              <Clock className="h-4 w-4 text-zinc-500" />
              <h3 className="text-base font-semibold text-zinc-900">Meal Timing</h3>
            </div>
            <div className="space-y-6 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-100" />
              
              <div className="relative pl-7">
                <div className="absolute left-0 top-0.5 h-3.5 w-3.5 rounded-full bg-white border-[3px] border-emerald-500" />
                <p className="text-xs text-emerald-600 font-medium">08:00 AM</p>
                <p className="text-sm font-medium text-zinc-900 mt-0.5">Breakfast</p>
                <p className="text-xs text-zinc-400 mt-1">High protein to start the day.</p>
              </div>

              <div className="relative pl-7">
                <div className="absolute left-0 top-0.5 h-3.5 w-3.5 rounded-full bg-white border-[3px] border-zinc-200" />
                <p className="text-xs text-zinc-400 font-medium">02:00 PM</p>
                <p className="text-sm font-medium text-zinc-900 mt-0.5">Lunch</p>
                <p className="text-xs text-zinc-400 mt-1">Balanced carbs and protein.</p>
              </div>

              <div className="relative pl-7">
                <div className="absolute left-0 top-0.5 h-3.5 w-3.5 rounded-full bg-white border-[3px] border-zinc-200" />
                <p className="text-xs text-zinc-400 font-medium">07:00 PM</p>
                <p className="text-sm font-medium text-zinc-900 mt-0.5">Dinner</p>
                <p className="text-xs text-zinc-400 mt-1">Light and nutrient-dense.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
