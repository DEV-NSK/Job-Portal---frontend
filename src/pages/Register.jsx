import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import { FiBriefcase, FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', companyName: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const { data } = await authAPI.register(form)
      login(data.token, data.user)
      toast.success('Account created successfully!')
      if (data.user.role === 'employer') navigate('/employer/dashboard')
      else navigate('/jobs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-grid">
      <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-primary-900/20 dark:via-gray-950 dark:to-accent-900/20 bg-gradient-to-br from-primary-50 via-slate-50 to-accent-50/30 pointer-events-none" />
      <div className="w-full max-w-md relative animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg shadow-primary-500/25">
            <FiBriefcase className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">Create account</h1>
          <p className="dark:text-gray-400 text-gray-500 mt-2">Join thousands of professionals</p>
        </div>

        <div className="card glow">
          {/* Role Toggle */}
          <div className="flex dark:bg-gray-800/50 bg-slate-100 rounded-xl p-1 mb-6">
            {['user', 'employer'].map(r => (
              <button key={r} type="button"
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${form.role === r ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg' : 'dark:text-gray-400 dark:hover:text-white text-gray-500 hover:text-gray-900'}`}>
                {r === 'user' ? '👤 Job Seeker' : '🏢 Employer'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-500 text-slate-400" size={16} />
                <input type="text" placeholder="John Doe" required
                  className="input-field pl-10"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            {form.role === 'employer' && (
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Company Name</label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-500 text-slate-400" size={16} />
                  <input type="text" placeholder="Acme Corp" required
                    className="input-field pl-10"
                    value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-500 text-slate-400" size={16} />
                <input type="email" placeholder="you@example.com" required
                  className="input-field pl-10"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-500 text-slate-400" size={16} />
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" required
                  className="input-field pl-10 pr-10"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-gray-500 dark:hover:text-gray-300 text-slate-400 hover:text-gray-600">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2 mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center dark:text-gray-400 text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
