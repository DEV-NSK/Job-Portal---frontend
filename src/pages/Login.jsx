import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import { FiBriefcase, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authAPI.login(form)
      login(data.token, data.user)
      toast.success(`Welcome back, ${data.user.name}!`)
      if (data.user.role === 'admin') navigate('/admin/dashboard')
      else if (data.user.role === 'employer') navigate('/employer/dashboard')
      else navigate('/jobs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-grid">
      <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-primary-900/20 dark:via-gray-950 dark:to-accent-900/20 bg-gradient-to-br from-primary-50 via-slate-50 to-accent-50/30 pointer-events-none" />
      <div className="w-full max-w-md relative animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg shadow-primary-500/25">
            <FiBriefcase className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">Welcome back</h1>
          <p className="dark:text-gray-400 text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <div className="card glow">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" required
                  className="input-field pl-10 pr-10"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 dark:text-gray-500 dark:hover:text-gray-300 text-slate-400 hover:text-gray-600">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center dark:text-gray-400 text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
