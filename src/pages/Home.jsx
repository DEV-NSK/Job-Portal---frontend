import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiSearch, FiBriefcase, FiUsers, FiTrendingUp, FiArrowRight, FiCheckCircle } from 'react-icons/fi'

const stats = [
  { label: 'Jobs Posted', value: '10,000+', icon: FiBriefcase },
  { label: 'Companies', value: '2,500+', icon: FiUsers },
  { label: 'Hired', value: '50,000+', icon: FiCheckCircle },
  { label: 'Success Rate', value: '94%', icon: FiTrendingUp }
]

const categories = [
  { name: 'Technology', icon: '💻', count: '2,400 jobs' },
  { name: 'Design', icon: '🎨', count: '890 jobs' },
  { name: 'Marketing', icon: '📈', count: '1,200 jobs' },
  { name: 'Finance', icon: '💰', count: '760 jobs' },
  { name: 'Healthcare', icon: '🏥', count: '1,100 jobs' },
  { name: 'Education', icon: '📚', count: '540 jobs' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-gray-950 to-accent-900/20 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-primary-400 mb-6 border border-primary-500/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            1,200+ new jobs this week
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Find Your{' '}
            <span className="text-gradient">Dream Job</span>
            <br />Today
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Connect with top companies and discover opportunities that match your skills and ambitions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 justify-center">
              <FiSearch size={18} /> Browse Jobs <FiArrowRight size={16} />
            </Link>
            {!user && (
              <Link to="/register" className="btn-secondary text-base px-8 py-3.5 flex items-center gap-2 justify-center">
                Post a Job <FiArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="stat-card">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600/20 to-accent-600/20 rounded-xl flex items-center justify-center border border-primary-500/20">
                <Icon className="text-primary-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-gray-400 text-sm">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Browse by Category</h2>
            <p className="text-gray-400">Explore opportunities across industries</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat.name} to={`/jobs?search=${cat.name}`}
                className="card text-center hover:scale-105 hover:border-primary-500/30 group">
                <div className="text-3xl mb-3">{cat.icon}</div>
                <div className="font-semibold text-white text-sm group-hover:text-primary-400 transition-colors">{cat.name}</div>
                <div className="text-gray-500 text-xs mt-1">{cat.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-accent-600 p-12 text-center">
              <div className="absolute inset-0 bg-grid opacity-20" />
              <h2 className="text-3xl font-bold text-white mb-4 relative">Ready to get started?</h2>
              <p className="text-primary-100 mb-8 relative">Join thousands of professionals finding their next opportunity.</p>
              <div className="flex gap-4 justify-center relative">
                <Link to="/register" className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-all hover:scale-105">
                  Get Started Free
                </Link>
                <Link to="/jobs" className="border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-all">
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
