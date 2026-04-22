import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { motion } from 'framer-motion'
import { FiBriefcase, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiShield, FiZap, FiUsers } from 'react-icons/fi'
import toast from 'react-hot-toast'

const perks = [
  { icon: FiZap,    text: 'AI-powered job matching' },
  { icon: FiUsers,  text: '50,000+ professionals hired' },
  { icon: FiShield, text: 'Enterprise-grade security' },
]

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, getAndClearRedirectPath } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Get redirect destination — from URL param or sessionStorage
  const getRedirectTarget = (userRole) => {
    // Check URL param first (set by ProtectedRoute)
    const urlRedirect = searchParams.get('redirect')
    if (urlRedirect) return decodeURIComponent(urlRedirect)

    // Then check sessionStorage
    const savedPath = getAndClearRedirectPath()
    if (savedPath) return savedPath

    // Default by role
    if (userRole === 'admin') return '/admin/dashboard'
    if (userRole === 'employer') return '/employer/dashboard'
    return '/jobs'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authAPI.login(form)
      login(data.token, data.user)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(getRedirectTarget(data.user.role), { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#060912]">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden
                      bg-slate-50 dark:bg-[#0a0f1e] border-r border-slate-200 dark:border-[#1e2d3d]">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <FiBriefcase className="text-white" size={16} />
          </div>
          <span className="text-[16px] font-bold text-gradient">JobPortal</span>
        </div>

        {/* Headline */}
        <div className="relative">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
            Your career,<br /><span className="text-gradient">accelerated.</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed mb-8">
            Join thousands of professionals who found their dream role using our AI-powered platform.
          </p>
          <div className="space-y-3">
            {perks.map(p => (
              <div key={p.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <p.icon size={14} />
                </div>
                <span className="text-[14px] text-slate-700 dark:text-slate-300">{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
          <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            "Found my dream job at a Series B startup within 2 weeks. The AI matching is genuinely impressive."
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">S</div>
            <div>
              <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">Sarah Chen</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500">Senior Engineer @ Vercel</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-[#060912]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <FiBriefcase className="text-white" size={14} />
            </div>
            <span className="text-[15px] font-bold text-gradient">JobPortal</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-slate-900 dark:text-white mb-2">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400 text-[14px]">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-2">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input type="email" placeholder="you@company.com" required className="input-field pl-10"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Password</label>
                <button type="button" className="text-[12px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input type={showPass ? 'text' : 'password'} placeholder="Enter your password" required
                  className="input-field pl-10 pr-10"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-[14px] mt-2">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span>
                : <span className="flex items-center gap-2">Sign in <FiArrowRight size={16} /></span>}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-slate-400 dark:text-slate-600">
            <FiShield size={12} />
            <span>Protected by enterprise-grade encryption</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
