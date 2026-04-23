import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI, notificationsAPI } from '../../services/api'
import { motion } from 'framer-motion'
import { FiUsers, FiBriefcase, FiFileText, FiActivity, FiTrendingUp, FiArrowRight, FiShield, FiAlertCircle } from 'react-icons/fi'

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    adminAPI.getStats().then(res => setStats(res.data)).finally(() => setLoading(false))
    notificationsAPI.getPendingEmployers().then(res => setPendingCount(res.data.length)).catch(() => {})
  }, [])

  const cards = stats ? [
    { label: 'Job Seekers', value: stats.users, icon: FiUsers, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', link: '/admin/users', change: 'Registered users' },
    { label: 'Employers', value: stats.employers, icon: FiBriefcase, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', link: '/admin/users', change: 'Active companies' },
    { label: 'Job Posts', value: stats.jobs, icon: FiFileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', link: '/admin/jobs', change: 'Total listings' },
    { label: 'Applications', value: stats.applications, icon: FiActivity, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', link: '/admin/jobs', change: 'Submitted' },
    { label: 'Social Posts', value: stats.posts, icon: FiTrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', link: '/admin/posts', change: 'Community posts' },
  ] : []

  const actions = [
    { title: 'Manage Users', desc: 'View, search and moderate user accounts', link: '/admin/users', icon: FiUsers, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Manage Jobs', desc: 'Monitor and remove job listings', link: '/admin/jobs', icon: FiBriefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Manage Posts', desc: 'Moderate community feed content', link: '/admin/posts', icon: FiFileText, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { title: 'Employer Approvals', desc: 'Review and approve new employer registrations', link: '/admin/employers', icon: FiShield, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', badge: pendingCount },
  ]

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <FiShield size={20} className="text-white" />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-indigo-400 uppercase tracking-widest mb-1">Admin Panel</div>
            <h1 className="text-[26px] font-bold text-slate-900 dark:text-white">Platform Overview</h1>
          </div>
        </div>

        {/* Pending employer alert */}
        {pendingCount > 0 && (
          <Link to="/admin/employers" className="flex items-center gap-3 p-4 mb-8 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
            <FiAlertCircle size={18} className="text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[13.5px] font-semibold text-amber-800 dark:text-amber-400">
                {pendingCount} employer{pendingCount > 1 ? 's' : ''} awaiting approval
              </p>
              <p className="text-[12px] text-amber-600 dark:text-amber-500">Click to review and approve registrations</p>
            </div>
            <FiArrowRight size={15} className="text-amber-500" />
          </Link>
        )}

        {/* ── Stats ── */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-32 rounded-2xl" />
              ))
            : cards.map(c => (
                <motion.div key={c.label} variants={stagger.item}>
                  <Link to={c.link} className="stat-card block group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${c.bg} ${c.color} mb-4 group-hover:scale-110 transition-transform`}>
                      <c.icon size={18} />
                    </div>
                    <div className="text-[26px] font-bold text-slate-900 dark:text-white leading-none mb-1">
                      {c.value?.toLocaleString()}
                    </div>
                    <div className="text-[13px] text-slate-600 dark:text-slate-400 mb-0.5">{c.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-600">{c.change}</div>
                  </Link>
                </motion.div>
              ))
          }
        </motion.div>

        {/* ── Quick Actions ── */}
        <div className="mb-3">
          <h2 className="text-[16px] font-semibold text-white mb-1">Quick Actions</h2>
          <p className="text-[13px] text-slate-500">Manage platform content and users</p>
        </div>
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-4"
        >
          {actions.map(a => (
            <motion.div key={a.title} variants={stagger.item}>
              <Link to={a.link} className="card card-hover flex items-start gap-4 group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${a.bg} ${a.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <a.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-200 mb-1">{a.title}</h3>
                    {a.badge > 0 && (
                      <span className="mb-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">{a.badge}</span>
                    )}
                  </div>
                  <p className="text-[13px] text-slate-600 dark:text-slate-500 leading-relaxed">{a.desc}</p>
                  <div className="flex items-center gap-1 text-[13px] text-indigo-600 dark:text-indigo-400 mt-3 group-hover:gap-2 transition-all">
                    Manage <FiArrowRight size={13} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}



