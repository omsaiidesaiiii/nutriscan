import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Utensils, History, Star, Search, Filter, ArrowUpRight, Camera, Barcode, Flame } from 'lucide-react'
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
    { name: 'Pure Greek Yogurt', cal: 320, p: 12, icon: '🥣' },
    { name: 'Grilled Atlantic Salmon', cal: 450, p: 35, icon: '🐟' },
    { name: 'Isolate Protein Stack', cal: 180, p: 25, icon: '🥤' }
  ]

  return (
    <div className="space-y-10 pb-12 animate-in">
      {/* Culinary Header */}
      <div className="relative overflow-hidden rounded-[3rem] bg-emerald-950 p-10 md:p-14 text-white shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1543353071-10c8ba85a902?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          alt="Gourmet Food"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 text-emerald-400 font-black text-xs uppercase tracking-[0.3em] mb-6">
              <Utensils className="h-4 w-4" />
              <span>Bio-Log Journal</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
              Culinary <span className="text-emerald-400 italic">Tracking.</span>
            </h1>
            <p className="text-xl text-emerald-100/70 font-medium leading-relaxed">
              Precision documentation of your physiological fuel intake. Every calorie is data.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden">
            <div className="px-10 py-6 text-center border-b sm:border-b-0 sm:border-r border-white/10">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Archived</p>
              <p className="text-3xl font-black italic tracking-tighter text-white">{meals?.length || 0}</p>
              <p className="text-[10px] font-bold text-emerald-100/40 uppercase">Logs</p>
            </div>
            <div className="px-10 py-6 text-center">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Rolling Avg</p>
              <p className="text-3xl font-black italic tracking-tighter text-white">2.4k</p>
              <p className="text-[10px] font-bold text-emerald-100/40 uppercase">kcal / day</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        {/* Main Entry Engine */}
        <div className="xl:col-span-2 space-y-10">
          <div className="premium-card p-10 bg-white">
             <AddMealForm />
          </div>

          <div className="premium-card bg-white overflow-hidden border-emerald-100">
            <div className="px-10 py-8 border-b border-emerald-50 flex items-center justify-between bg-emerald-50/20">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-emerald-50">
                  <History className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-emerald-950 tracking-tight uppercase italic">Historical Matrix</h2>
              </div>
              <div className="hidden lg:flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                  <input 
                    type="text" 
                    placeholder="Search past logs..." 
                    className="pl-12 pr-6 py-3 bg-emerald-50/50 border-none rounded-[1.25rem] text-xs font-black uppercase tracking-wider focus:ring-4 focus:ring-emerald-500/5 w-60 text-emerald-950 placeholder-emerald-900/30"
                  />
                </div>
                <button className="p-3 bg-white border border-emerald-50 rounded-xl hover:bg-emerald-50 transition-all shadow-sm">
                  <Filter className="h-5 w-5 text-emerald-600" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-emerald-50">
              {meals?.map((meal) => (
                <div key={meal.id} className="px-10 py-8 hover:bg-emerald-50/30 transition-all flex items-center justify-between group">
                  <div className="flex items-center space-x-8">
                    <div className="hidden sm:flex flex-col items-center justify-center h-16 w-16 rounded-[1.5rem] bg-emerald-50 border border-emerald-100/50 text-emerald-900/40 font-black text-[10px] shadow-inner transform -rotate-3 group-hover:rotate-0 transition-transform">
                      <span className="uppercase">{new Date(meal.created_at).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-emerald-950 text-2xl leading-none mt-1 tracking-tighter">{new Date(meal.created_at).getDate()}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-emerald-950 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{meal.food_name}</h3>
                      <div className="flex items-center space-x-6 mt-3 text-[10px] font-black uppercase tracking-[0.15em]">
                        <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-950 text-emerald-400 rounded-lg shadow-xl shadow-emerald-950/10">
                           <Flame className="h-3 w-3" />
                           <span>{meal.calories} kcal</span>
                        </div>
                        <div className="flex items-center space-x-4 text-emerald-900/30">
                          <span className="group-hover:text-emerald-500 transition-colors italic">P: {meal.protein}g</span>
                          <span className="group-hover:text-emerald-500 transition-colors italic">C: {meal.carbs}g</span>
                          <span className="group-hover:text-emerald-500 transition-colors italic">F: {meal.fat}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="p-3 text-emerald-100 hover:text-amber-400 hover:bg-amber-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-transparent hover:border-amber-100">
                      <Star className="h-5 w-5" />
                    </button>
                    <DeleteMealButton id={meal.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          <div className="bg-emerald-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tight italic">Fast Logging</h3>
              <div className="p-2.5 bg-emerald-500 rounded-xl">
                 <Star className="h-5 w-5 text-emerald-950 fill-emerald-950" />
              </div>
            </div>
            <div className="space-y-5 relative z-10">
              {favorites.map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:translate-x-1 transition-all text-left group/btn">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover/btn:scale-110 transition-transform">{item.icon}</div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tight leading-none mb-2">{item.name}</p>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{item.cal} KCAL • {item.p}G PROTEIN</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-emerald-900 group-hover/btn:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Camera className="h-32 w-32 transform -rotate-12" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-3 tracking-tight italic">Omni-Vision</h3>
              <p className="text-emerald-50/70 text-sm font-medium mb-10 leading-relaxed uppercase tracking-tight">
                Instantly parse handwritten logs or blurry sensor data.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button className="h-14 bg-white/10 hover:bg-white border border-white/20 hover:text-emerald-950 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center transition-all">
                  <Camera className="h-4 w-4 mr-2" /> Camera
                </button>
                <button className="h-14 bg-white/10 hover:bg-white border border-white/20 hover:text-emerald-950 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center transition-all">
                  <Barcode className="h-4 w-4 mr-2" /> Scanner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
