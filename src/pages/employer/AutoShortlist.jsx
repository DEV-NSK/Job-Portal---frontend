import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { autoShortlistAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AutoShortlist() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [n, setN] = useState(10)
  const [diversityMode, setDiversityMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shortlist, setShortlist] = useState([])
  const [decisions, setDecisions] = useState({})
  const [approving, setApproving] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await autoShortlistAPI.generate({ jobId, n, diversityMode })
      setShortlist(res.data.shortlist)
      const d = {}
      res.data.shortlist.forEach(c => { d[c.candidateId] = 'pending' })
      setDecisions(d)
    } catch { toast.error('Failed to generate shortlist') }
    finally { setLoading(false) }
  }

  const decide = (candidateId, action) => setDecisions(prev => ({ ...prev, [candidateId]: action }))

  const approveAll = async () => {
    setApproving(true)
    try {
      const decisionList = shortlist.map(c => ({
        candidateId: c.candidateId,
        action: decisions[c.candidateId] === 'pending' ? 'accepted' : decisions[c.candidateId],
        rationale: c.rationale
      }))
      await autoShortlistAPI.approve({ jobId, decisions: decisionList })
      toast.success('Shortlist approved!')
      navigate(-1)
    } catch { toast.error('Failed to approve') }
    finally { setApproving(false) }
  }

  const accepted = Object.values(decisions).filter(d => d === 'accepted').length
  const vetoed = Object.values(decisions).filter(d => d === 'vetoed').length

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4 transition-colors">← Back</button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">AI Auto Shortlist</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Let AI select the best candidates for your role</p>

        {shortlist.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">Configure Shortlisting</h2>
            <div className="flex flex-col items-center gap-5 max-w-sm mx-auto">
              <div className="w-full">
                <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                  Candidates to shortlist: <span className="font-bold text-slate-800 dark:text-slate-100">{n}</span>
                </label>
                <input type="range" min="5" max="50" value={n} onChange={e => setN(parseInt(e.target.value))}
                  className="w-full accent-indigo-500" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer w-full">
                <button onClick={() => setDiversityMode(!diversityMode)}
                  className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${diversityMode ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${diversityMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-300">Enable Diversity Balancing</span>
              </label>
              <button onClick={generate} disabled={loading}
                className="btn-primary w-full py-3 disabled:opacity-50">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
                  : `✨ Shortlist Top ${n}`}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="card mb-5 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-400">{accepted} accepted · {vetoed} vetoed</span>
                  <span className="text-slate-500 dark:text-slate-400">{shortlist.length} total</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(accepted / shortlist.length) * 100}%` }} />
                </div>
              </div>
              <button onClick={approveAll} disabled={approving || accepted < Math.ceil(shortlist.length / 2)}
                className="btn-primary disabled:opacity-50 whitespace-nowrap">
                {approving ? 'Approving...' : '✓ Approve All'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {shortlist.map(c => {
                const status = decisions[c.candidateId] || 'pending'
                return (
                  <motion.div key={c.candidateId} layout
                    className={`card transition-all ${
                      status === 'accepted' ? 'border-emerald-300 dark:border-emerald-500/40' :
                      status === 'vetoed' ? 'border-red-300 dark:border-red-500/40 opacity-60' : ''
                    }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                        {c.candidate?.name?.[0] || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 dark:text-slate-100 truncate">{c.candidate?.name}</div>
                        <div className="text-sm font-bold text-indigo-500">{c.score}/1000</div>
                      </div>
                      <div className="w-11 h-11 relative flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366f1" strokeWidth="3"
                            strokeDasharray={`${c.score / 10} 100`} />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">{Math.round(c.score/10)}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{c.rationale}</p>
                    <div className="flex gap-2">
                      {[
                        { action: 'accepted', label: '✓ Accept', active: 'bg-emerald-500 text-white border-emerald-500', inactive: 'btn-secondary' },
                        { action: 'swapped', label: '↔ Swap', active: 'bg-indigo-500 text-white border-indigo-500', inactive: 'btn-secondary' },
                        { action: 'vetoed', label: '✗ Veto', active: 'bg-red-500 text-white border-red-500', inactive: 'btn-secondary' }
                      ].map(btn => (
                        <button key={btn.action} onClick={() => decide(c.candidateId, btn.action)}
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${status === btn.action ? btn.active : btn.inactive}`}>
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
