import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { jobHealthAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function JobHealthDashboard() {
  const navigate = useNavigate()
  const [overview, setOverview] = useState([])
  const [loading, setLoading] = useState(true)
  const [overrideModal, setOverrideModal] = useState(null)
  const [overrideData, setOverrideData] = useState({ tier: 'standard', lockDays: 7 })

  useEffect(() => {
    jobHealthAPI.getOverview()
      .then(res => setOverview(res.data))
      .catch(() => toast.error('Failed to load health data'))
      .finally(() => setLoading(false))
  }, [])

  const applyOverride = async () => {
    try {
      await jobHealthAPI.overrideTier(overrideModal._id, overrideData)
      toast.success('Tier overridden')
      setOverrideModal(null)
      setOverview(prev => prev.map(item =>
        item.job._id === overrideModal._id
          ? { ...item, health: { ...item.health, tier: overrideData.tier } }
          : item
      ))
    } catch { toast.error('Failed to override') }
  }

  const tierStyles = {
    promoted: { badge: 'badge-danger', ring: '#ef4444', label: 'Promoted' },
    standard: { badge: 'badge-warning', ring: '#f59e0b', label: 'Standard' },
    high: { badge: 'badge-success', ring: '#22c55e', label: 'High Pool' }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Dynamic Job Posts</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Job health scores and visibility tiers</p>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}
          </div>
        ) : overview.length === 0 ? (
          <div className="card text-center py-12 text-slate-500">No active jobs</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overview.map(({ job, health }) => {
              const style = tierStyles[health?.tier] || tierStyles.standard
              return (
                <motion.div key={job._id} whileHover={{ y: -2 }} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{job.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{job.companyName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2 flex-shrink-0">
                      {health?.isUrgent && <span className="badge badge-danger">URGENT</span>}
                      {health?.isHot && <span className="badge badge-warning">🔥 HOT</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke={style.ring} strokeWidth="3"
                          strokeDasharray={`${health?.healthScore || 0} 100`} />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800 dark:text-slate-100">
                        {health?.healthScore || 0}
                      </span>
                    </div>
                    <div>
                      <span className={`badge ${style.badge}`}>{style.label}</span>
                      <div className="text-xs text-slate-500 mt-1">Health Score</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/employer/funnel/${job._id}`)}
                      className="flex-1 btn-secondary text-xs py-1.5">
                      Funnel
                    </button>
                    <button onClick={() => { setOverrideModal(job); setOverrideData({ tier: health?.tier || 'standard', lockDays: 7 }) }}
                      className="flex-1 btn-secondary text-xs py-1.5">
                      Override
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {overrideModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setOverrideModal(null)}>
          <div className="card w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Override Tier</h2>
            <p className="text-sm text-slate-500 mb-4">{overrideModal.title}</p>
            <select value={overrideData.tier} onChange={e => setOverrideData(p => ({ ...p, tier: e.target.value }))}
              className="input-field mb-3">
              <option value="promoted">Promoted (Struggling)</option>
              <option value="standard">Standard</option>
              <option value="high">High (Strong Pool)</option>
            </select>
            <div className="mb-4">
              <label className="text-sm text-slate-500 mb-1 block">Lock for {overrideData.lockDays} days</label>
              <input type="range" min="1" max="7" value={overrideData.lockDays}
                onChange={e => setOverrideData(p => ({ ...p, lockDays: parseInt(e.target.value) }))}
                className="w-full accent-indigo-500" />
            </div>
            <div className="flex gap-3">
              <button onClick={applyOverride} className="btn-primary flex-1">Apply</button>
              <button onClick={() => setOverrideModal(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
