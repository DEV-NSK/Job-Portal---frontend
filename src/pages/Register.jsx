import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBriefcase, FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

const benefits = [
  'AI-powered job matching',
  'Profile strength scoring',
  'Mock interview practice',
  'Real-time application tracking',
]

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', companyName: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, getAndClearRedirectPath } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const getRedirectTarget = (userRole) => {
    const urlRedirect = searchParams.get('redirect')
    if (urlRedirect) return decodeURIComponent(urlRedirect)
    const savedPath = getAndClearRedirectPath()
    if (savedPath) return savedPath
    if (userRole === 'employer') return '/employer/dashboard'
    return '/jobs'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const { data } = await authAPI.register(form)
      login(data.token, data.user)
      toast.success('Account created! Welcome aboard 🎉')
      navigate(getRedirectTarget(data.user.role), { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#060912]">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden
                      bg-slate-50 dark:bg-[#0a0f1e] border-r border-slate-200 dark:border-[#1e2d3d]">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <FiBriefcase className="text-white" size={16} />
          </div>
          <span className="text-[16px] font-bold text-gradient">JobPortal</span>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
            Start your journey<br /><span className="text-gradient">today.</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed mb-8">
            Create your free account and get access to all the tools you need to land your next role.
          </p>
          <div className="space-y-3">
            {benefits.map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <FiCheck size={10} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-[14px] text-slate-700 dark:text-slate-300">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-4">
          {[{ v: '50K+', l: 'Professionals hired' }, { v: '2.5K+', l: 'Partner companies' }].map(s => (
            <div key={s.l} className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{s.v}</div>
              <div className="text-[12px] text-slate-400 dark:text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto bg-white dark:bg-[#060912]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md py-8">

          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <FiBriefcase className="text-white" size={14} />
            </div>
            <span className="text-[15px] font-bold text-gradient">JobPortal</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-slate-900 dark:text-white mb-2">Create your account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-[14px]">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
            </p>
          </div>

          {/* Role toggle */}
          <div className="flex p-1 rounded-xl mb-6 bg-slate-100 dark:bg-[#0d1117] border border-slate-200 dark:border-[#1e2d3d]">
            {[{ value: 'user', label: '👤 Job Seeker' }, { value: 'employer', label: '🏢 Employer' }].map(r => (
              <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                className={`flex-1 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all ${
                  form.role === r.value
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}>
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-2">Full name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input type="text" placeholder="John Doe" required className="input-field pl-10"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>

            <AnimatePresence>
              {form.role === 'employer' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                  <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-2">Company name</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input type="text" placeholder="Acme Corp" required className="input-field pl-10"
                      value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-2">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input type="email" placeholder="you@company.com" required className="input-field pl-10"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" required
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
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</span>
                : <span className="flex items-center gap-2">Create account <FiArrowRight size={16} /></span>}
            </button>
          </form>

          <p className="mt-5 text-[12px] text-slate-400 dark:text-slate-600 text-center">
            By creating an account, you agree to our{' '}
            <span className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
            {' '}and{' '}
            <span className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
