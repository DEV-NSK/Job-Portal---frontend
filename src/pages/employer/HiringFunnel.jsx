import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { hiringFunnelAPI } from '../../services/api'
import toast from 'react-hot-toast'

const STAGES = [
  { key: 'applied', label: 'Applied', color: '#6366f1' },
  { key: 'screened', label: 'Screened', color: '#8b5cf6' },
  { key: 'shortlisted', label: 'Shortlisted', color: '#06b6d4' },
  { key: 'interview_scheduled', label: 'Interview Scheduled', color: '#10b981' },
  { key: 'interview_done', label: 'Interview Done', color: '#f59e0b' },
  { key: 'offer_extended', label: 'Offer Extended', color: '#f97316' },
  { key: 'selected', label: 'Selected', color: '#22c55e' },
  { key: 'rejected', label: 'Rejected', color: '#ef4444' }
]

export default function HiringFunnel() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [funnel, setFunnel] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStage, setSelectedStage] = useState(null)
  const [stageCandidates, setStageCandidates] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const loadFunnel = async () => {
    try {
      setLoading(true)
      const params = {}
      if (dateFrom) params.from = dateFrom
      if (dateTo) params.to = dateTo
      const res = await hiringFunnelAPI.getFunnel(jobId, params)
      setFunnel(res.data.stages || [])
    } catch {
      toast.error('Failed to load funnel')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadFunnel() }, [jobId, dateFrom, dateTo])

  const openStage = async (stage) => {
    setSelectedStage(stage)
    setDrawerOpen(true)
    try {
      const res = await hiringFunnelAPI.getStageCandidates(jobId, stage.key)
      setStageCandidates(res.data)
    } catch { setStageCandidates([]) }
  }

  const moveCandidate = async (appId, newStage) => {
    try {
      await hiringFunnelAPI.updateStage(appId, newStage)
      toast.success(`Moved to ${newStage}`)
      loadFunnel()
      if (selectedStage) openStage(selectedStage)
    } catch { toast.error('Failed to update stage') }
  }

  const maxCount = Math.max(...funnel.map(s => s.count), 1)

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2 flex items-center gap-1 transition-colors">
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Hiring Funnel</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time candidate pipeline</p>
          </div>
          <div className="flex gap-3">
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="input-field text-sm w-auto" />
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="input-field text-sm w-auto" />
            <button onClick={() => hiringFunnelAPI.exportFunnel(jobId)} className="btn-secondary text-sm">
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-4">
            {/* Bar Chart */}
            <div className="card">
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Pipeline Overview</h2>
              <div className="flex items-end gap-3 justify-center" style={{ minHeight: 200 }}>
                {funnel.filter(s => s.name !== 'rejected').map((stage) => {
                  const stageInfo = STAGES.find(s => s.key === stage.name)
                  const height = Math.max(32, (stage.count / maxCount) * 180)
                  return (
                    <motion.div key={stage.name} initial={{ height: 0 }} animate={{ height: 'auto' }}
                      className="flex flex-col items-center cursor-pointer group" style={{ width: 90 }}
                      onClick={() => openStage({ key: stage.name, label: stageInfo?.label })}>
                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">{stage.count}</div>
                      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.1 }}
                        className="w-full rounded-t-lg group-hover:opacity-80 transition-opacity origin-bottom"
                        style={{ height, backgroundColor: stageInfo?.color || '#6366f1' }} />
                      <div className="text-xs text-center mt-2 text-slate-500 dark:text-slate-400 leading-tight">{stageInfo?.label}</div>
                      {stage.conversionRate !== undefined && (
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stage.conversionRate}%</div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Stage Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {funnel.map(stage => {
                const stageInfo = STAGES.find(s => s.key === stage.name)
                return (
                  <motion.div key={stage.name} whileHover={{ y: -2 }}
                    className="card card-hover cursor-pointer border-l-4"
                    style={{ borderLeftColor: stageInfo?.color }}
                    onClick={() => openStage({ key: stage.name, label: stageInfo?.label })}>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{stageInfo?.label}</div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stage.count}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">~{stage.avgDaysInStage}d avg</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Side Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40" onClick={() => setDrawerOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white dark:bg-[#0d1117] border-l border-slate-200 dark:border-[#1e2d3d] shadow-2xl z-50 overflow-y-auto">
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedStage?.label}</h2>
                  <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none">×</button>
                </div>
                {stageCandidates.length === 0 ? (
                  <p className="text-slate-500 text-center py-10">No candidates at this stage</p>
                ) : (
                  <div className="space-y-3">
                    {stageCandidates.map(app => (
                      <div key={app._id} className="surface p-4 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                            {app.applicant?.name?.[0] || '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">{app.applicant?.name}</div>
                            <div className="text-xs text-slate-500">{app.applicant?.email}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {app.applicant?.skills?.slice(0, 3).map(s => (
                            <span key={s} className="badge badge-primary">{s}</span>
                          ))}
                        </div>
                        <select onChange={e => moveCandidate(app._id, e.target.value)}
                          defaultValue={app.funnelStage}
                          className="input-field text-sm">
                          {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
