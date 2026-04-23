import { useState, useEffect } from 'react'
import { notificationsAPI } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck, FiX, FiClock, FiUsers, FiBriefcase, FiRefreshCw } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useNotifications } from '../../context/NotificationContext'

const statusBadge = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
}

export default function AdminEmployers() {
  const [employers, setEmployers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const { fetchNotifications } = useNotifications()

  const load = async () => {
    try {
      setLoading(true)
      const { data } = await notificationsAPI.getPendingEmployers()
      setEmployers(data)
    } catch {
      toast.error('Failed to load employers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAction = async (userId, action) => {
    setActionLoading(userId + action)
    try {
      await notificationsAPI.handleEmployerApproval({ userId, action })
      toast.success(action === 'approve' ? 'Employer approved ✅' : 'Employer rejected')
      setEmployers(prev => prev.filter(e => e._id !== userId))
      fetchNotifications()
    } catch {
      toast.error('Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060912] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employer Approvals</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Review and approve new employer registrations
            </p>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all border border-slate-200 dark:border-white/10">
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pending', value: employers.length, icon: FiClock, color: 'text-amber-500' },
            { label: 'Total Employers', value: '—', icon: FiBriefcase, color: 'text-indigo-500' },
            { label: 'Reviewed Today', value: '—', icon: FiUsers, color: 'text-emerald-500' }
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-[#0d1117] rounded-2xl p-4 border border-slate-200 dark:border-[#1e2d3d]">
              <s.icon size={18} className={s.color} />
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : employers.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0d1117] rounded-2xl border border-slate-200 dark:border-[#1e2d3d]">
            <FiCheck size={32} className="text-emerald-500 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">All caught up!</p>
            <p className="text-slate-400 dark:text-slate-600 text-sm mt-1">No pending employer approvals</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {employers.map((emp, i) => (
                <motion.div
                  key={emp._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-[#0d1117] rounded-2xl p-5 border border-slate-200 dark:border-[#1e2d3d] flex items-center gap-4"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {emp.name?.[0]?.toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">{emp.name}</span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusBadge[emp.approvalStatus]}`}>
                        {emp.approvalStatus}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">{emp.email}</p>
                    <p className="text-[11.5px] text-slate-400 dark:text-slate-600 mt-0.5">
                      Registered {new Date(emp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAction(emp._id, 'approve')}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all disabled:opacity-50"
                    >
                      {actionLoading === emp._id + 'approve'
                        ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <FiCheck size={13} />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(emp._id, 'reject')}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium bg-red-500 hover:bg-red-600 text-white transition-all disabled:opacity-50"
                    >
                      {actionLoading === emp._id + 'reject'
                        ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <FiX size={13} />}
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
