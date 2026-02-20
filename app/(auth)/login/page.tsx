import Link from 'next/link'
import { login } from '../actions'
import Image from 'next/image'
import { Activity, Sparkles, BrainCircuit } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen bg-[#fbfdfc]">
      {/* Left Side - Image/Branding */}
      <div className="relative hidden w-[55%] flex-col bg-emerald-950 lg:flex overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=1600&auto=format&fit=crop"
            alt="Healthy food background"
            fill
            priority
            className="object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col p-20 h-full justify-between">
          <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80">
            <div className="bg-emerald-500 p-2 rounded-2xl shadow-xl shadow-emerald-500/20 transform -rotate-6">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white uppercase italic">
              Smart<span className="text-emerald-400">Log</span>
            </span>
          </Link>
          
          <div className="space-y-8 animate-in delay-200">
            <div className="flex items-center space-x-3 text-emerald-400 font-bold text-xs uppercase tracking-[0.3em]">
               <Sparkles className="h-4 w-4" />
               <span>Precision Performance</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white leading-[1.05]">
              Architect your body <br /> with <span className="text-emerald-400 italic">intelligence.</span>
            </h1>
            <p className="text-emerald-100/60 text-xl max-w-lg leading-relaxed font-medium">
              Join the elite ecosystem of bio-trackers using Gemini 2.5 Flash to engineer their nutritional destiny.
            </p>
            
            <div className="flex items-center space-x-6 pt-10">
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">99.8%</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Accuracy</span>
               </div>
               <div className="h-10 w-px bg-white/10" />
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">Instant</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">AI Insights</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-[45%] lg:p-20">
        <div className="w-full max-w-md space-y-10 animate-in">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight text-emerald-950 uppercase italic">
              Welcome Back
            </h2>
            <p className="text-emerald-900/40 font-bold uppercase tracking-widest text-xs">
              Resume your metabolic synchronization
            </p>
          </div>
          
          <div className="bg-white border border-emerald-50 shadow-2xl shadow-emerald-900/5 rounded-[3rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-focus-within:opacity-5 transition-opacity">
              <BrainCircuit className="h-40 w-40" />
            </div>
            
            <form className="space-y-8 relative z-10" action={login}>
              <div className="space-y-6">
                <div className="group/field">
                  <label htmlFor="email" className="block text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-2 px-1">
                    Secure Email ID
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-2xl border border-emerald-50 bg-emerald-50/30 px-6 py-4 text-sm font-bold text-emerald-950 placeholder-emerald-900/20 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-8 focus:ring-emerald-500/5 transition-all"
                    placeholder="operator@smartlog.ai"
                  />
                </div>
                <div className="group/field">
                  <label htmlFor="password" className="block text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-2 px-1">
                    Access Key
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-2xl border border-emerald-50 bg-emerald-50/30 px-6 py-4 text-sm font-bold text-emerald-950 placeholder-emerald-900/20 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-8 focus:ring-emerald-500/5 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl bg-rose-50 p-4 text-xs font-bold text-rose-500 border border-rose-100 flex items-center gap-3 animate-in">
                  <Activity className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full h-16 bg-emerald-950 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/20 hover:bg-emerald-900 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center space-x-3 group"
                >
                  <Sparkles className="h-4 w-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                  <span>Initiate Access</span>
                </button>
              </div>
            </form>
            
            <div className="mt-12 text-center pt-8 border-t border-emerald-50">
               <p className="text-[10px] font-black text-emerald-900/30 uppercase tracking-widest mb-4">
                  New Operator?
               </p>
               <Link href="/signup" className="inline-flex h-12 items-center px-8 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-all">
                  Create Master Account
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
