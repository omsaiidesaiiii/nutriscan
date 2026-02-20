import Link from 'next/link'
import { login } from '../actions'
import Image from 'next/image'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Left Side - Image/Branding (Hidden on smaller screens) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-zinc-900 lg:flex">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=1600&auto=format&fit=crop"
            alt="Healthy food background"
            fill
            priority
            className="object-cover"
          />
          {/* Green Overlay */}
          <div className="absolute inset-0 bg-black/30" />
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col p-12 h-full justify-between">
          <Link href="/" className="flex items-center gap-2 text-white transition-opacity hover:opacity-80">
            
            <span className="text-2xl font-bold tracking-tight text-white">Nutri
              <span className="text-emerald-300">Scan</span>
            </span>
          </Link>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white leading-tight">
              Fuel your body with <span className="text-emerald-300">intelligence.</span>
            </h1>
            <p className="text-emerald-100 text-lg max-w-md leading-relaxed">
              Track your macros, optimize your diet with AI, and achieve your health goals effortlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Please enter your details to sign in
            </p>
          </div>
          
          <div className="bg-white border border-white/40 shadow-xl shadow-zinc-200/40 rounded-[2rem] p-8 sm:p-10">
            <form className="space-y-6" action={login}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-600 border border-amber-200/50 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all active:scale-[0.98]"
                >
                  Sign in to account
                </button>
              </div>
            </form>
            
            <p className="mt-8 text-center text-sm text-zinc-500">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-emerald-600 hover:text-emerald-500 hover:underline transition-all">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
