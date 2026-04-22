import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { employerAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import {
  FiBriefcase, FiUsers, FiPlus, FiTrendingUp, FiClock,
  FiArrowRight, FiEye, FiEdit2, FiActivity
} from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }
}

const statusBadge = {
  pending: 'badge-yellow',
  reviewed: 'badge-blue',
  accepted: 'badge-green',
  rejected: 'badge-red',
}

export default function EmployerDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([employerAPI.getJobs(), employerAPI.getApplications()])
      .then(([j, a]) => { setJobs(j.data); setApps(a.data) })
      .finally(() => setLoading(false))
  }, [])

  const activeJobs = jobs.filter(j => j.isActive).length
  const pendingApps = apps.filter(a => a.status === 'pending').length
  const acceptedApps = apps.filter(a => a.status === 'accepted').length

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: FiBriefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', change: '+2 this week' },
    { label: 'Active Jobs', value: activeJobs, icon: FiActivity, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', change: 'Currently live' },
    { label: 'Applications', value: apps.length, icon: FiUsers, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', change: `${pendingApps} pending` },
    { label: 'Hired', value: acceptedApps, icon: FiTrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', change: 'Total accepted' },
  ]

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-[12px] font-semibold text-indigo-400 uppercase tracking-widest mb-2">Employer Dashboard</div>
            <h1 className="text-[28px] font-bold text-slate-900 dark:text-white">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 text-[14px] mt-1">Here's what's happening with your job posts today.</p>
          </div>
          <Link to="/employer/jobs/create" className="btn-primary gap-2">
            <FiPlus size={15} /> Post a Job
          </Link>
        </div>

        {/* ── Stats ── */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map(s => (
            <motion.div key={s.label} variants={stagger.item}>
              <div className="stat-card group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${s.bg} ${s.color}`}>
                    <s.icon size={18} />
                  </div>
                </div>
                <div className="text-[28px] font-bold text-white leading-none mb-1">
                  {loading ? <div className="skeleton h-7 w-12 rounded" /> : s.value}
                </div>
                <div className="text-[13px] text-slate-500 mb-1">{s.label}</div>
                <div className="text-[11px] text-slate-600">{s.change}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main content grid ── */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Recent Jobs — 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="card h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[16px] font-semibold text-slate-800 dark:text-white">Job Posts</h2>
                  <p className="text-[12px] text-slate-500 mt-0.5">{jobs.length} total positions</p>
                </div>
                <Link to="/employer/jobs" className="text-[13px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                  View all <FiArrowRight size={13} />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1,2,3,4].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
                </div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                    <FiBriefcase size={22} />
                  </div>
                  <p className="text-[15px] font-medium text-slate-300 mb-1">No jobs posted yet</p>
                  <p className="text-[13px] text-slate-600 mb-5">Create your first job listing to start receiving applications.</p>
                  <Link to="/employer/jobs/create" className="btn-primary text-[13px] py-2 px-5">Post First Job</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {jobs.slice(0, 6).map((job, i) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3.5 rounded-xl transition-all group border border-slate-100 dark:border-[#1e2d3d] bg-slate-50 dark:bg-white/[0.02] hover:border-slate-200 dark:hover:border-[#2d3f55]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-[13px] flex-shrink-0">
                          {job.title?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-medium text-slate-700 dark:text-slate-200 truncate">{job.title}</p>
                          <p className="text-[12px] text-slate-600">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span className="text-[12px] text-slate-500 flex items-center gap-1">
                          <FiUsers size={11} /> {job.applicantsCount || 0}
                        </span>
                        <span className={`badge ${job.isActive ? 'badge-green' : 'badge-red'}`}>
                          {job.isActive ? 'Active' : 'Closed'}
                        </span>
                        <Link to={`/employer/jobs/edit/${job._id}`}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100">
                          <FiEdit2 size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Applications — 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[16px] font-semibold text-slate-800 dark:text-white">Applications</h2>
                  <p className="text-[12px] text-slate-500 mt-0.5">{pendingApps} need review</p>
                </div>
                <Link to="/employer/applicants" className="text-[13px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                  View all <FiArrowRight size={13} />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1,2,3,4].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
                </div>
              ) : apps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                    <FiUsers size={22} />
                  </div>
                  <p className="text-[14px] font-medium text-slate-300 mb-1">No applications yet</p>
                  <p className="text-[12px] text-slate-600">Applications will appear here once candidates apply.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {apps.slice(0, 7).map((app, i) => (
                    <motion.div
                      key={app._id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-[#1e2d3d] bg-slate-50 dark:bg-white/[0.02]"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center text-[12px] font-bold text-indigo-300 overflow-hidden flex-shrink-0">
                        {app.applicant?.avatar
                          ? <img src={app.applicant.avatar} alt="" className="w-full h-full object-cover" />
                          : app.applicant?.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-slate-700 dark:text-slate-200 truncate">{app.applicant?.name}</p>
                        <p className="text-[11px] text-slate-600 truncate">{app.job?.title}</p>
                      </div>
                      <span className={`badge flex-shrink-0 ${statusBadge[app.status] || 'badge-yellow'}`}>
                        {app.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Quick actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { to: '/employer/jobs/create', icon: FiPlus, label: 'Post New Job', desc: 'Create a new job listing', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
            { to: '/employer/applicants', icon: FiEye, label: 'Review Applicants', desc: 'View and manage applications', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { to: '/employer/profile', icon: FiBriefcase, label: 'Company Profile', desc: 'Update your company info', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          ].map(a => (
            <Link key={a.to} to={a.to}
              className="card card-hover flex items-center gap-4 group">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${a.bg} ${a.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <a.icon size={18} />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">{a.label}</div>
                <div className="text-[12px] text-slate-600">{a.desc}</div>
              </div>
              <FiArrowRight size={14} className="text-slate-700 group-hover:text-slate-400 ml-auto transition-colors" />
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  )
}



