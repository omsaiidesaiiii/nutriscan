import Link from 'next/link'
import { Activity, Sparkles, Zap, Shield, Target, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbfdfc] overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-50/50 blur-[100px] rounded-full" />
      </div>

      <nav className="relative z-50 flex items-center justify-between px-10 py-8 max-w-[1400px] mx-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-2xl shadow-xl shadow-emerald-600/20 transform -rotate-3">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black text-emerald-950 tracking-tighter uppercase italic">
            Smart<span className="text-emerald-500">Log</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-8">
           <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-emerald-950 hover:text-emerald-600 transition-colors">Login</Link>
           <Link href="/signup" className="h-12 px-8 bg-emerald-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-950/20 hover:bg-emerald-900 transition-all flex items-center">Join Station</Link>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center pt-24 pb-32 px-4 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 border border-emerald-100 mb-10 animate-in">
           <Sparkles className="h-3.5 w-3.5 fill-emerald-600" />
           <span>Next-Gen Biometric Intelligence</span>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-emerald-950 mb-10 leading-[0.9]">
          Optimal <span className="text-emerald-500 italic">Human</span> <br className="hidden md:block" /> Engineering.
        </h1>
        
        <p className="text-xl text-emerald-900/40 max-w-2xl mb-14 font-medium leading-relaxed uppercase tracking-tight">
          The elite ecosystem for metabolic mastery. Track intake with Gemini 2.5 Vision and architect your nutritional destiny.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
          <Link
            href="/signup"
            className="h-20 px-14 bg-emerald-950 text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(6,31,23,0.3)] hover:bg-emerald-900 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center space-x-3 group"
          >
            <span>Initialize Identity</span>
             <ArrowRight className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="h-20 px-14 border-2 border-emerald-100 text-emerald-950 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all flex items-center justify-center"
          >
            Access Station
          </Link>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
           {[
             { icon: Zap, title: 'Instant Logic', desc: 'Real-time macro estimation via recursive AI modeling.' },
             { icon: Shield, title: 'Cipher Guard', desc: 'Secure biometric vaulting with industry-leading encryption.' },
             { icon: Target, title: 'Precision Flux', desc: 'Adaptive goals that adjust to your physical velocity.' }
           ].map((feature, i) => (
             <div key={i} className="premium-card p-10 bg-white border-emerald-50 flex flex-col items-center text-center group hover:bg-emerald-950 transition-colors duration-500">
                <div className="p-4 bg-emerald-50 rounded-2xl mb-6 group-hover:bg-white/10 transition-colors">
                   <feature.icon className="h-8 w-8 text-emerald-600 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="text-xl font-black text-emerald-950 group-hover:text-white transition-colors uppercase tracking-tight italic mb-3">{feature.title}</h3>
                <p className="text-sm font-medium text-emerald-900/30 group-hover:text-emerald-100/40 transition-colors leading-relaxed uppercase tracking-tight">{feature.desc}</p>
             </div>
           ))}
        </div>
      </div>

      <footer className="relative z-10 border-t border-emerald-50 py-12 text-center text-[10px] font-black text-emerald-900/20 uppercase tracking-[0.4em]">
         © 2026 SmartLog Neural Systems • Pure performance
      </footer>
    </div>
  )
}
