import { useState, useEffect } from 'react'
import { applicationsAPI } from '../../services/api'
import { motion } from 'framer-motion'
import { FiMapPin, FiBriefcase, FiClock, FiFileText, FiArrowRight, FiSearch } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'

const statusConfig = {
  pending: { label: 'Pending', badge: 'badge-yellow', dot: 'bg-amber-400' },
  reviewed: { label: 'Reviewed', badge: 'badge-blue', dot: 'bg-blue-400' },
  accepted: { label: 'Accepted', badge: 'badge-green', dot: 'bg-emerald-400' },
  rejected: { label: 'Rejected', badge: 'badge-red', dot: 'bg-red-400' },
}

export default function AppliedJobs() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    applicationsAPI.getUserApps()
      .then(res => setApps(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)

  const counts = {
    all: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    reviewed: apps.filter(a => a.status === 'reviewed').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  }

  if (loading) return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        {[1,2,3].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="text-[12px] font-semibold text-indigo-400 uppercase tracking-widest mb-1">Applications</div>
          <h1 className="text-[26px] font-bold text-white mb-1">My Applications</h1>
          <p className="text-[14px] text-slate-500 dark:text-slate-500">{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>
        </div>

        {/* ── Filter tabs ── */}
        {apps.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(counts).map(([key, count]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all capitalize ${
                  filter === key
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
                    : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-[#1e2d3d]'
                }`}
              >
                {key === 'all' ? 'All' : key} <span className="ml-1 text-[11px] opacity-70">({count})</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {apps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
              <FiSearch size={24} />
            </div>
            <h3 className="text-[18px] font-semibold text-white mb-2">No applications yet</h3>
            <p className="text-[14px] text-slate-500 mb-6 max-w-sm">Start applying to jobs and track all your applications in one place.</p>
            <Link to="/jobs" className="btn-primary gap-2">
              Browse Jobs <FiArrowRight size={15} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app, i) => {
              const status = statusConfig[app.status] || statusConfig.pending
              return (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card group"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      {/* Company logo */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {app.job?.companyLogo
                          ? <img src={app.job.companyLogo} alt="" className="w-full h-full object-cover" />
                          : <span className="text-indigo-400 font-bold text-[15px]">{app.job?.companyName?.[0]}</span>}
                      </div>

                      <div>
                        <Link
                          to={`/jobs/${app.job?._id}`}
                          className="text-[15px] font-semibold text-slate-200 hover:text-indigo-400 transition-colors"
                        >
                          {app.job?.title}
                        </Link>
                        <p className="text-[13px] text-slate-500 mt-0.5">{app.job?.companyName}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-[12px] text-slate-600">
                          {app.job?.location && (
                            <span className="flex items-center gap-1"><FiMapPin size={11} />{app.job.location}</span>
                          )}
                          {app.job?.type && (
                            <span className="flex items-center gap-1"><FiBriefcase size={11} />{app.job.type}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <FiClock size={11} />
                            {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <span className={`status-dot ${status.dot}`} />
                      <span className={`badge ${status.badge}`}>{status.label}</span>
                    </div>
                  </div>

                  {/* Cover letter preview */}
                  {app.coverLetter && (
                    <div className="mt-4 pt-4 border-t border-[#1e2d3d]">
                      <div className="flex items-center gap-1.5 text-[12px] text-slate-600 mb-2">
                        <FiFileText size={12} /> Cover Letter
                      </div>
                      <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">{app.coverLetter}</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}



