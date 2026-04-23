import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { skillJobAPI, jobsAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function SkillJobPosting() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState('')
  const [threshold, setThreshold] = useState(70)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    jobsAPI.getAll().then(res => setJobs(res.data?.jobs || res.data || [])).catch(() => {})
  }, [])

  const findMatches = async () => {
    if (!selectedJob) return toast.error('Select a job first')
    setLoading(true)
    try {
      const res = await skillJobAPI.findMatches({ jobId: selectedJob, minThreshold: threshold })
      setMatches(res.data.matches || [])
      toast.success(`Found ${res.data.total} matching candidates`)
    } catch { toast.error('Failed to find matches') }
    finally { setLoading(false) }
  }

  const filtered = matches.filter(m => m.matchPct >= threshold)

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Skill-Based Matching</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Find candidates by skill match — no resume required</p>

        <div className="card mb-6">
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">Select Job Posting</label>
              <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)} className="input-field">
                <option value="">Choose a job...</option>
                {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                Min Match: <span className="font-semibold text-slate-800 dark:text-slate-100">{threshold}%</span>
              </label>
              <input type="range" min="50" max="100" value={threshold}
                onChange={e => setThreshold(parseInt(e.target.value))}
                className="w-full accent-indigo-500" />
            </div>
            <button onClick={findMatches} disabled={loading} className="btn-primary disabled:opacity-50">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Searching...</>
                : '🔍 Find Matches'}
            </button>
          </div>
        </div>

        {filtered.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{filtered.length} Matched Candidates</h2>
              <span className="text-sm text-slate-500">Sorted by match %</span>
            </div>
            <div className="space-y-3">
              {filtered.map((m, i) => (
                <motion.div key={m.user._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="card flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                    {m.user.name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">{m.user.name}</div>
                    <div className="text-xs text-slate-500 mb-2">{m.user.location || 'Location not set'}</div>
                    <div className="flex flex-wrap gap-1">
                      {m.matchedSkills.map(s => (
                        <span key={s} className="badge badge-success">✓ {s}</span>
                      ))}
                      {m.missingSkills.slice(0, 2).map(s => (
                        <span key={s} className="badge badge-danger">✗ {s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className="text-2xl font-bold text-indigo-500">{m.matchPct}%</div>
                    <div className="text-xs text-slate-500">match</div>
                  </div>
                  <span className="badge badge-primary hidden md:inline-flex">Not applied</span>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {matches.length > 0 && filtered.length === 0 && (
          <div className="card text-center py-10 text-slate-500">No candidates meet the {threshold}% threshold</div>
        )}
      </div>
    </div>
  )
}
