import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar as CalendarIcon, Sparkles, TrendingUp, ShoppingBag, Info, Clock, CheckCircle2 } from 'lucide-react'
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
    <div className="space-y-10 pb-12 animate-in">
      {/* Strategy Hero */}
      <div className="relative overflow-hidden rounded-[3rem] bg-emerald-950 p-10 md:p-14 text-white shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          alt="Meal Planning"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/40 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="max-w-xl">
            <div className="flex items-center space-x-2 text-emerald-400 font-black text-xs uppercase tracking-[0.3em] mb-6">
              <Sparkles className="h-4 w-4" />
              <span>AI Strategic Architecture</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
              Fueling <span className="text-emerald-400 italic">Tomorrow.</span>
            </h1>
            <p className="text-xl text-emerald-100/70 font-medium leading-relaxed">
              Let the Gemini Engine architect your nutritional roadmap for the next 24 hours based on your metabolic velocity.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 grid grid-cols-2 gap-8 divide-x divide-white/10">
            <div className="px-4 text-center">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Target</p>
              <p className="text-3xl font-black italic tracking-tighter">{profile.target_calories}</p>
              <p className="text-[10px] font-bold text-emerald-100/40 uppercase">kcal / day</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Mode</p>
              <p className="text-3xl font-black uppercase tracking-tighter italic">{profile.goal}</p>
              <p className="text-[10px] font-bold text-emerald-100/40 uppercase">optimized</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        {/* Main Component */}
        <div className="xl:col-span-2 space-y-10">
          <MealPlanner profile={profile} />
          
          <div className="premium-card p-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-emerald-950 tracking-tight uppercase">Weekly Horizon</h2>
              <div className="flex items-center space-x-2 text-emerald-900/40 font-black text-xs uppercase tracking-widest">
                <CalendarIcon className="h-4 w-4" />
                <span>Feb 20 - Feb 26</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center gap-4 overflow-x-auto pb-4 px-2">
              {[ 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu' ].map((day, i) => (
                <div 
                  key={day} 
                  className={cn(
                    "flex flex-col items-center min-w-[85px] p-6 rounded-[2rem] border transition-all duration-300 group cursor-pointer",
                    i === 1 
                      ? 'bg-emerald-950 border-emerald-950 text-white shadow-2xl scale-110 shadow-emerald-900/20' 
                      : 'bg-white border-emerald-50 text-emerald-900/30 hover:border-emerald-200 hover:shadow-lg'
                  )}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest mb-2">{day}</span>
                  <span className="text-2xl font-black italic tracking-tighter">{20 + i}</span>
                  {i === 1 && <div className="mt-3 h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />}
                  {i > 1 && <div className="mt-3 text-[10px] font-bold text-emerald-500 opacity-0 group-hover:opacity-100">PROJ</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tactical Sidebar */}
        <div className="space-y-10">
          <div className="bg-emerald-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-40 w-40" />
             </div>
            <div className="flex items-center space-x-4 mb-8 relative z-10">
              <div className="p-3 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/20">
                <ShoppingBag className="h-6 w-6 text-emerald-950" />
              </div>
              <h3 className="text-xl font-black tracking-tight italic">Procurement</h3>
            </div>
            <p className="text-emerald-100/40 text-xs font-bold leading-relaxed mb-8 uppercase tracking-widest relative z-10">
              Auto-generated inventory for tomorrow's performance stack.
            </p>
            <div className="space-y-4 relative z-10">
              {[ 
                { item: 'Greek Yogurt', qty: '500g', check: true },
                { item: 'Chicken Breast', qty: '400g', check: false },
                { item: 'Avocado', qty: '2 units', check: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "h-6 w-6 rounded-lg border flex items-center justify-center transition-colors",
                      item.check ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
                    )}>
                      {item.check && <CheckCircle2 className="h-4 w-4 text-emerald-950" />}
                    </div>
                    <span className={cn("text-sm font-bold uppercase tracking-tight", item.check ? 'text-white/30 truncate line-through' : 'text-white')}>{item.item}</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{item.qty}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 h-14 bg-emerald-500 text-emerald-950 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/10 hover:bg-emerald-400 transition-all hover:-translate-y-1 active:translate-y-0">
              Sync to Reminders
            </button>
          </div>

          <div className="premium-card p-10">
            <div className="flex items-center space-x-4 mb-10">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <Clock className="h-6 w-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-emerald-950 tracking-tight">Window Strategy</h3>
            </div>
            <div className="space-y-10 relative">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-emerald-50" />
              
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-white border-4 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.15em]">Opening (08:00)</p>
                <p className="text-base font-black text-emerald-950 mt-1 uppercase tracking-tight italic">Anabolic Spike</p>
                <p className="text-xs text-emerald-900/40 font-bold mt-2 leading-relaxed uppercase tracking-tight">Break fast with 40g+ protein to initiate muscle synthesis.</p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-white border-4 border-emerald-100" />
                <p className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.15em]">Session+ (14:00)</p>
                <p className="text-base font-black text-emerald-950 mt-1 uppercase tracking-tight italic">Glycogen Refill</p>
                <p className="text-xs text-emerald-900/40 font-bold mt-2 leading-relaxed uppercase tracking-tight">Strategic carbohydrate loading period optimized for hypertrophy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
