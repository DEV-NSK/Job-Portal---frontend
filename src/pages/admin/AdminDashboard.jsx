import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { FiUsers, FiBriefcase, FiFileText, FiActivity, FiTrendingUp } from 'react-icons/fi'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getStats().then(res => setStats(res.data)).finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { label: 'Job Seekers', value: stats.users, icon: FiUsers, color: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-400', link: '/admin/users' },
    { label: 'Employers', value: stats.employers, icon: FiBriefcase, color: 'from-purple-600/20 to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-400', link: '/admin/users' },
    { label: 'Job Posts', value: stats.jobs, icon: FiFileText, color: 'from-green-600/20 to-green-600/5', border: 'border-green-500/20', text: 'text-green-400', link: '/admin/jobs' },
    { label: 'Applications', value: stats.applications, icon: FiActivity, color: 'from-yellow-600/20 to-yellow-600/5', border: 'border-yellow-500/20', text: 'text-yellow-400', link: '/admin/jobs' },
    { label: 'Social Posts', value: stats.posts, icon: FiTrendingUp, color: 'from-red-600/20 to-red-600/5', border: 'border-red-500/20', text: 'text-red-400', link: '/admin/posts' },
  ] : []

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">Admin Dashboard</h1>
          <p className="dark:text-gray-400 text-gray-500 mt-1">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
          ) : cards.map(({ label, value, icon: Icon, color, border, text, link }) => (
            <Link key={label} to={link}
              className={`card bg-gradient-to-br ${color} border ${border} hover:scale-105 transition-all`}>
              <div className={`w-10 h-10 rounded-xl bg-gray-900/50 flex items-center justify-center ${text} mb-3`}>
                <Icon size={18} />
              </div>
              <div className="text-3xl font-bold text-white">{value?.toLocaleString()}</div>
              <div className="text-gray-400 text-sm mt-1">{label}</div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'Manage Users', desc: 'View, search and remove users', link: '/admin/users', icon: FiUsers, color: 'text-blue-400' },
            { title: 'Manage Jobs', desc: 'Monitor and remove job listings', link: '/admin/jobs', icon: FiBriefcase, color: 'text-green-400' },
            { title: 'Manage Posts', desc: 'Moderate social feed content', link: '/admin/posts', icon: FiFileText, color: 'text-purple-400' },
          ].map(({ title, desc, link, icon: Icon, color }) => (
            <Link key={title} to={link} className="card hover:scale-[1.02] hover:border-gray-600 transition-all group">
              <div className={`w-12 h-12 rounded-xl dark:bg-gray-800 bg-slate-100 flex items-center justify-center ${color} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
              <h3 className="font-semibold dark:text-white text-gray-900 mb-1">{title}</h3>
              <p className="dark:text-gray-400 text-gray-500 text-sm">{desc}</p>
              <span className="text-primary-400 text-sm mt-3 inline-block group-hover:translate-x-1 transition-transform">Go →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
