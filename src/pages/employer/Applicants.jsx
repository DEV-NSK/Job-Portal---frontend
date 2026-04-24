import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { applicationsAPI } from '../../services/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiArrowLeft, FiMail, FiPhone, FiFileText,
  FiCheck, FiX, FiEye, FiUsers, FiUser
} from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

const statusConfig = {
  pending: { badge: 'badge-yellow', label: 'Pending' },
  reviewed: { badge: 'badge-blue', label: 'Reviewed' },
  accepted: { badge: 'badge-green', label: 'Accepted' },
  rejected: { badge: 'badge-red', label: 'Rejected' },
}

export default function Applicants() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetch = jobId
      ? applicationsAPI.getJobApps(jobId)
      : import('../../services/api').then(m => m.employerAPI.getApplications())
    fetch.then(res => setApps(res.data)).finally(() => setLoading(false))
  }, [jobId])

  const updateStatus = async (appId, status) => {
    try {
      const res = await applicationsAPI.updateStatus({ applicationId: appId, status })
      setApps(prev => prev.map(a => a._id === appId ? { ...a, status: res.data.status } : a))
      toast.success(`Marked as ${status}`)
    } catch { toast.error('Failed to update') }
  }

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)
  const counts = {
    all: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-4">
            <FiArrowLeft size={15} /> Back
          </button>
          <div className="text-[12px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Recruitment</div>
          <h1 className="text-[26px] font-bold text-slate-900 dark:text-white mb-1">Applicants</h1>
          <p className="text-[14px] text-slate-500 dark:text-slate-500">{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>
        </div>

        {/* ── Filter tabs ── */}
        {apps.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(counts).map(([key, count]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all capitalize ${
                  filter === key
                    ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/25'
                    : 'text-slate-600 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 border border-transparent hover:border-slate-200 dark:hover:border-[#1e2d3d]'
                }`}>
                {key} <span className="ml-1 text-[11px] opacity-70">({count})</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
          </div>
        ) : apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5">
              <FiUsers size={24} />
            </div>
            <h3 className="text-[18px] font-semibold text-slate-900 dark:text-white mb-2">No applicants yet</h3>
            <p className="text-[14px] text-slate-500 dark:text-slate-500">Applications will appear here once candidates apply.</p>
          </div>
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
                  className="card"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Applicant info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center font-bold text-[15px] text-indigo-600 dark:text-indigo-300 overflow-hidden flex-shrink-0">
                        {app.applicant?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-1">{app.applicant?.name}</h3>
                        <div className="flex flex-wrap gap-3 text-[13px] text-slate-500 dark:text-slate-500 mb-2">
                          <span className="flex items-center gap-1.5"><FiMail size={12} />{app.applicant?.email}</span>
                          {app.applicant?.phone && (
                            <span className="flex items-center gap-1.5"><FiPhone size={12} />{app.applicant.phone}</span>
                          )}
                        </div>
                        {app.job?.title && (
                          <p className="text-[12px] text-indigo-600 dark:text-indigo-400 mb-2">Applied for: {app.job.title}</p>
                        )}
                        {app.applicant?.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {app.applicant.skills.slice(0, 5).map(s => (
                              <span key={s} className="px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-400 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-[#1e2d3d]">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-[11px] text-slate-500 dark:text-slate-600 mt-2">
                          {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <span className={`badge ${status.badge}`}>{status.label}</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => navigate(`/candidate/${app.applicant._id}`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                          title="View Profile">
                          <FiUser size={14} />
                        </button>
                        {app.applicant?.resume && (
                          <a href={app.applicant.resume?.startsWith('http') ? app.applicant.resume : `${import.meta.env.VITE_BACKEND_URL || ''}${app.applicant.resume}`} target="_blank" rel="noreferrer"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                            title="View Resume">
                            <FiFileText size={14} />
                          </a>
                        )}
                        {app.status !== 'accepted' && (
                          <button onClick={() => updateStatus(app._id, 'accepted')}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
                            title="Accept">
                            <FiCheck size={14} />
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button onClick={() => updateStatus(app._id, 'rejected')}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                            title="Reject">
                            <FiX size={14} />
                          </button>
                        )}
                        {app.status === 'pending' && (
                          <button onClick={() => updateStatus(app._id, 'reviewed')}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                            title="Mark Reviewed">
                            <FiEye size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cover letter */}
                  {app.coverLetter && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#1e2d3d]">
                      <p className="text-[12px] text-slate-500 dark:text-slate-600 mb-2 flex items-center gap-1.5">
                        <FiFileText size={11} /> Cover Letter
                      </p>
                      <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">{app.coverLetter}</p>
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
