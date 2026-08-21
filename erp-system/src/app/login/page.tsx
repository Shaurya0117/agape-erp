"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Lock, Mail, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Invalid credentials. Please try again.")
      setIsLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Pane - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[url('/login-bg.jpg')] bg-cover bg-center relative overflow-hidden items-center justify-center">
        {/* Dark overlay to ensure text readability against the rich icon */}
        <div className="absolute inset-0 bg-black/60 z-0 backdrop-blur-[2px]"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent z-0"></div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black/90 to-transparent z-0"></div>

        <div className="relative z-10 p-12 text-center flex flex-col items-center">
          <div className="w-24 h-24 mx-auto bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 mb-8 shadow-2xl ring-1 ring-gold/20">
            <span className="text-4xl font-black text-amber-500 font-serif">ΙΧ</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 tracking-tight drop-shadow-md">Agape ERP</h1>
          <p className="text-amber-100/90 text-lg max-w-md mx-auto leading-relaxed drop-shadow">
            A comprehensive, double-entry financial management system built to handle donations, projects, and logistics seamlessly.
          </p>
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-slate-500">
              Sign in to your account to continue.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-none text-sm font-medium border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900"
                    placeholder="admin@erp.com"
                    defaultValue="admin@erp.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900"
                    placeholder="••••••••"
                    defaultValue="admin"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-none text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-6">
              Protected by NextAuth. Authorized personnel only.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}


