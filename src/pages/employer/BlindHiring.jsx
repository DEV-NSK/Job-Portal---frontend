import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { blindHiringAPI, jobsAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function BlindHiring() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    jobsAPI.getById(jobId)
      .then(res => setJob(res.data))
      .catch(() => toast.error('Failed to load job'))
      .finally(() => setLoading(false))
  }, [jobId])

  const toggle = async () => {
    if (job?.blindModeLocked) return toast.error('Blind mode is locked after screening has begun')
    setToggling(true)
    try {
      const res = await blindHiringAPI.toggle(jobId, !job.blindMode)
      setJob(prev => ({ ...prev, blindMode: res.data.blindMode }))
      toast.success(res.data.blindMode ? 'Blind hiring enabled' : 'Blind hiring disabled')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle')
    } finally { setToggling(false) }
  }

  if (loading) return (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-[#060912] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4 transition-colors">← Back</button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Blind Hiring Mode</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Remove unconscious bias from your hiring process</p>

        {job?.blindMode && (
          <div className="mb-5 p-4 rounded-xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <div className="font-semibold text-amber-700 dark:text-amber-400">BLIND HIRING ACTIVE</div>
              <div className="text-sm text-amber-600 dark:text-amber-300/70">Candidate identities are anonymised for this job</div>
            </div>
          </div>
        )}

        <div className="card mb-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{job?.title}</h2>
              <p className="text-sm text-slate-500">{job?.companyName}</p>
            </div>
            <div className="flex items-center gap-3">
              {job?.blindModeLocked && <span className="badge badge-danger">Locked</span>}
              <button onClick={toggle} disabled={toggling || job?.blindModeLocked}
                className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 ${job?.blindMode ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${job?.blindMode ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { icon: '👤', title: 'Name Anonymisation', desc: 'Candidates shown as "Candidate #XXXX"' },
              { icon: '🎓', title: 'College Anonymisation', desc: 'Universities shown as "University Tier 1/2/3"' },
              { icon: '📷', title: 'Photo Removal', desc: 'Profile photos hidden from recruiter view' },
              { icon: '⚧', title: 'Gender Removal', desc: 'Gender indicators removed from all views' },
              { icon: '🤖', title: 'AI Rationale Filter', desc: 'AI shortlisting rationales contain no PII' }
            ].map(item => (
              <div key={item.title} className="surface flex items-center gap-4 p-3 rounded-xl">
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm text-slate-800 dark:text-slate-100">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${job?.blindMode ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-sm text-indigo-700 dark:text-indigo-300">
          <strong>Best Practice:</strong> Enable Blind Hiring before any candidates apply. Once screening begins, the toggle is locked to ensure consistency.
        </div>
      </div>
    </div>
  )
}
