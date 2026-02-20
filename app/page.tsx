import Link from 'next/link'
import { LayoutDashboard, Sparkles, Zap, Shield, Target, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-zinc-100/50 blur-[100px] rounded-full" />
      </div>

      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-[1200px] mx-auto">
        <div className="flex items-center space-x-2.5">
          <div className="bg-emerald-600 p-1.5 rounded-xl">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            Nutri<span className="text-emerald-600">Scan</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
           <Link href="/login" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Sign in</Link>
           <Link href="/signup" className="flex items-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]">
             Get Started
           </Link>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center pt-20 pb-28 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-1.5 rounded-full text-xs font-medium text-emerald-700 border border-emerald-100 mb-8 animate-in">
           <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
           <span>AI-Powered Nutrition Tracking</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-zinc-900 mb-6 leading-[1.05]">
          Fuel your body with <span className="text-emerald-600">intelligence.</span>
        </h1>
        
        <p className="text-lg text-zinc-500 max-w-2xl mb-12 leading-relaxed">
          Track your macros, optimize your diet with AI, and achieve your health goals effortlessly. Powered by Gemini.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <Link
            href="/signup"
            className="flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98] group"
          >
            <span>Create free account</span>
             <ArrowRight className="ml-2 h-4 w-4 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center rounded-xl border border-zinc-200 px-8 py-3.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-all"
          >
            Sign in to account
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
           {[
             { icon: Zap, title: 'AI Estimation', desc: 'Real-time macro estimation powered by Gemini AI.' },
             { icon: Shield, title: 'Health Adaptive', desc: 'AI adjusts plans for diabetes, hypertension & more.' },
             { icon: Target, title: 'Smart Goals', desc: 'Adaptive targets that evolve with your progress.' }
           ].map((feature, i) => (
             <div key={i} className="card p-8 flex flex-col items-center text-center group hover:border-zinc-200 transition-all">
                <div className="p-3 bg-zinc-50 rounded-xl mb-4 border border-zinc-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                   <feature.icon className="h-5 w-5 text-zinc-500 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
             </div>
           ))}
        </div>
      </div>

      <footer className="relative z-10 border-t border-zinc-100 py-8 text-center text-xs text-zinc-400">
         © 2026 NutriScan · AI-powered nutrition tracking
      </footer>
    </div>
  )
}
