import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AddMealForm from '@/components/AddMealForm'
import { Utensils, Zap, Shield, Flame, Activity, ArrowRight, TrendingUp, BrainCircuit, Calendar, Sparkles } from 'lucide-react'
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
    icon: Icon, 
    accentColor 
  }: { 
    label: string, 
    current: number, 
    target: number, 
    unit: string, 
    icon: any, 
    accentColor: string
  }) => {
    const percentage = Math.min((current / target) * 100, 100)
    return (
      <div className="premium-card p-8 group relative overflow-hidden">
        <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-5 translate-x-8 -translate-y-8 transition-transform group-hover:scale-110", accentColor)}>
          <Icon className="w-full h-full" />
        </div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className={cn("p-3 rounded-2xl shadow-inner", accentColor.replace('text-', 'bg-').replace('600', '100'))}>
            <Icon className={cn("h-6 w-6", accentColor)} />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950/30">{label}</span>
            <span className={cn("text-sm font-black mt-1", accentColor)}>{Math.round(percentage)}%</span>
          </div>
        </div>
        
        <div className="space-y-3 relative z-10">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-4xl font-black text-emerald-950 tracking-tighter">{Math.round(current)}</span>
            <span className="text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">/ {target}{unit}</span>
          </div>
          
          <div className="h-2 w-full bg-emerald-50 rounded-full overflow-hidden p-0.5 border border-emerald-100/50">
            <div 
              className={cn("h-full transition-all duration-1000 ease-out rounded-full shadow-sm", accentColor.replace('text-', 'bg-'))}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  const QuickNavCard = ({ title, desc, icon: Icon, href }: { title: string, desc: string, icon: any, href: string }) => (
    <Link href={href} className="group premium-card p-6 flex flex-col items-center text-center hover:bg-emerald-950 hover:border-emerald-950 transition-all duration-500">
      <div className="p-4 bg-emerald-50 rounded-[1.5rem] group-hover:bg-emerald-500 group-hover:rotate-6 transition-all duration-500">
        <Icon className="h-6 w-6 text-emerald-600 group-hover:text-white" />
      </div>
      <div className="mt-4">
        <h3 className="font-black text-emerald-950 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-xs text-emerald-900/40 mt-1 font-bold group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{desc}</p>
      </div>
    </Link>
  )

  return (
    <div className="space-y-12 pb-12 animate-in">
      {/* Premium Cockpit Header */}
      <div className="relative overflow-hidden rounded-[3rem] bg-emerald-950 p-10 md:p-14 text-white shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          alt="Fresh Food"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="max-w-xl">
            <div className="flex items-center space-x-2 text-emerald-400 font-black text-xs uppercase tracking-[0.3em] mb-6">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" />
              <span>Live System Status</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
              Good morning, <span className="text-emerald-400 italic">{user.email?.split('@')[0]}</span>
            </h1>
            <p className="text-xl text-emerald-100/70 font-medium leading-relaxed">
              Your metabolism is operating at <span className="text-white font-black underline decoration-emerald-500 underline-offset-4">optimal velocity</span>. You are 78% of the way to your daily milestone.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 flex items-center space-x-6 min-w-[240px]">
            <div className="text-right">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Current Weight</p>
              <div className="flex items-baseline justify-end space-x-1">
                <p className="text-4xl font-black text-white italic tracking-tighter">{profile.weight}</p>
                <span className="text-xs font-black text-emerald-400 uppercase italic">kg</span>
              </div>
            </div>
            <div className="h-14 w-14 bg-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-400/20 rotate-3">
              <TrendingUp className="h-7 w-7 text-emerald-950" />
            </div>
          </div>
        </div>
      </div>

      {/* Macro Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        <MacroCard label="Energy" current={totals.calories} target={profile.target_calories} unit="kcal" icon={Flame} accentColor="text-emerald-600" />
        <MacroCard label="Build" current={totals.protein} target={profile.target_protein} unit="g" icon={Zap} accentColor="text-sky-500" />
        <MacroCard label="Fuel" current={totals.carbs} target={profile.target_carbs} unit="g" icon={Shield} accentColor="text-emerald-500" />
        <MacroCard label="Core" current={totals.fat} target={profile.target_fat} unit="g" icon={Utensils} accentColor="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        {/* Logging Engine */}
        <div className="xl:col-span-2 space-y-10">
          <div className="premium-card p-10 bg-white">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-3">
                 <div className="p-3 bg-emerald-50 rounded-2xl">
                    <Sparkles className="h-6 w-6 text-emerald-600" />
                 </div>
                 <h2 className="text-2xl font-black text-emerald-950 tracking-tight">Intelligence Journal</h2>
              </div>
              <div className="hidden sm:flex bg-emerald-950 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] items-center space-x-2 shadow-xl shadow-emerald-900/10">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span>AI Vision Active</span>
              </div>
            </div>
            <AddMealForm />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickNavCard title="Planner" desc="Horizon View" icon={Calendar} href="/planner" />
            <QuickNavCard title="Analytics" desc="Velocity Data" icon={TrendingUp} href="/analytics" />
            <QuickNavCard title="Brain" desc="Gemini Model" icon={BrainCircuit} href="/intelligence" />
            <div className="premium-card p-6 bg-emerald-950 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-emerald-900 transition-colors">
              <Sparkles className="h-6 w-6 text-emerald-400 mb-2 group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">More Tools</span>
            </div>
          </div>
        </div>

        {/* History Blade */}
        <div className="premium-card bg-white overflow-hidden flex flex-col h-full border-emerald-100">
          <div className="px-10 py-8 border-b border-emerald-50 flex items-center justify-between bg-emerald-50/20">
            <h2 className="text-xl font-black text-emerald-950 tracking-tight uppercase">Daily Timeline</h2>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">{meals?.length || 0} Logs</span>
            </div>
          </div>

          <div className="flex-1">
            {(!meals || meals.length === 0) ? (
              <div className="py-24 text-center px-10">
                <div className="bg-emerald-50 h-24 w-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transform -rotate-6 transition-transform hover:rotate-0">
                  <Utensils className="h-12 w-12 text-emerald-200" />
                </div>
                <h3 className="text-xl font-black text-emerald-950 tracking-tight">Log your first fuel</h3>
                <p className="text-emerald-900/40 mt-3 text-sm font-bold leading-relaxed px-4">AI needs data to start predicting your performance metrics.</p>
              </div>
            ) : (
              <div className="divide-y divide-emerald-50">
                {meals.map((meal) => (
                  <div key={meal.id} className="px-10 py-7 hover:bg-emerald-50/50 transition-all flex items-center justify-between group cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-black text-emerald-950 truncate group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{meal.food_name}</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-950 rounded-lg text-white">
                           <Flame className="h-3 w-3 text-emerald-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest leading-none">{meal.calories}</span>
                        </div>
                        <div className="h-1 w-1 bg-emerald-100 rounded-full" />
                        <div className="flex items-center space-x-3 text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.15em]">
                          <span className="group-hover:text-emerald-500 transition-colors italic">P: {meal.protein}g</span>
                          <span className="group-hover:text-emerald-500 transition-colors italic">C: {meal.carbs}g</span>
                          <span className="group-hover:text-emerald-500 transition-colors italic">F: {meal.fat}g</span>
                        </div>
                      </div>
                    </div>
                    <DeleteMealButton id={meal.id} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-8 bg-emerald-50/30 border-t border-emerald-50 mt-auto">
             <Link href="/meals" className="w-full h-14 bg-white border border-emerald-100 rounded-[1.25rem] flex items-center justify-center space-x-3 hover:bg-emerald-50 transition-all group shadow-sm">
                <span className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.2em]">Open Full Archive</span>
                <ArrowRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
