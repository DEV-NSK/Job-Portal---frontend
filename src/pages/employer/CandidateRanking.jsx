import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { candidateRankingAPI } from '../../services/api'
import toast from 'react-hot-toast'

const FACTOR_LABELS = { skillMatch: 'Skill Match', codingScore: 'Coding Score', consistency: 'Consistency', profileStrength: 'Profile Strength', reputationScore: 'Reputation' }
const FACTOR_COLORS = { skillMatch: '#6366f1', codingScore: '#8b5cf6', consistency: '#10b981', profileStrength: '#f59e0b', reputationScore: '#ef4444' }

export default function CandidateRanking() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [weights, setWeights] = useState({ skillMatch: 30, codingScore: 25, consistency: 20, profileStrength: 15, reputationScore: 10 })
  const [expandedId, setExpandedId] = useState(null)
  const [sortBy, setSortBy] = useState('rank')

  useEffect(() => {
    candidateRankingAPI.getRanked(jobId)
      .then(res => setCandidates(res.data))
      .catch(() => toast.error('Failed to load rankings'))
      .finally(() => setLoading(false))
  }, [jobId])

  const recomputeScore = (factors) => {
    const total = Object.values(weights).reduce((a, b) => a + b, 0) || 100
    return Math.round(
      (factors.skillMatch * weights.skillMatch / total) +
      (factors.codingScore * weights.codingScore / total) +
      (factors.consistency * weights.consistency / total) +
      (factors.profileStrength * weights.profileStrength / total) +
      (factors.reputationScore * weights.reputationScore / total)
    )
  }

  const adjustWeight = (key, val) => {
    const newWeights = { ...weights, [key]: parseInt(val) }
    const total = Object.values(newWeights).reduce((a, b) => a + b, 0)
    if (total > 100) {
      const diff = total - 100
      const others = Object.keys(newWeights).filter(k => k !== key)
      others.forEach(k => { newWeights[k] = Math.max(0, newWeights[k] - Math.ceil(diff / others.length)) })
    }
    setWeights(newWeights)
  }

  const togglePin = async (c) => {
    try {
      if (c.isPinned) {
        await candidateRankingAPI.unpin(jobId, c.candidateId)
        toast.success('Unpinned')
      } else {
        await candidateRankingAPI.pin({ jobId, candidateId: c.candidateId })
        toast.success('Pinned')
      }
      setCandidates(prev => prev.map(x => x.candidateId === c.candidateId ? { ...x, isPinned: !x.isPinned } : x))
    } catch { toast.error('Failed') }
  }

  const sorted = [...candidates].sort((a, b) => {
    if (sortBy === 'rank') return recomputeScore(b.factors) - recomputeScore(a.factors)
    if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt)
    return b.factors.skillMatch - a.factors.skillMatch
  })
  const display = [...sorted.filter(c => c.isPinned), ...sorted.filter(c => !c.isPinned)]

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2 transition-colors">← Back</button>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Candidate Ranking</h1>
          </div>
          <div className="flex gap-2">
            {[['rank','By Rank'], ['date','By Date'], ['skill','By Skill']].map(([s, l]) => (
              <button key={s} onClick={() => setSortBy(s)}
                className={sortBy === s ? 'btn-primary text-sm py-2 px-3' : 'btn-secondary text-sm py-2 px-3'}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Weight Sliders */}
        <div className="card mb-5">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Ranking Weights — total: {Object.values(weights).reduce((a,b)=>a+b,0)}%
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(weights).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>{FACTOR_LABELS[key]}</span><span className="font-semibold">{val}%</span>
                </div>
                <input type="range" min="0" max="60" value={val}
                  onChange={e => adjustWeight(key, e.target.value)}
                  className="w-full accent-indigo-500" />
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : display.length === 0 ? (
          <div className="card text-center py-12 text-slate-500">No applicants yet</div>
        ) : (
          <div className="space-y-2">
            {display.map((c, i) => {
              const score = recomputeScore(c.factors)
              const isExpanded = expandedId === c.candidateId
              return (
                <motion.div key={c.candidateId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`card p-0 overflow-hidden ${c.isPinned ? 'border-amber-300 dark:border-amber-500/40' : ''}`}>
                  <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : c.candidateId)}>
                    {/* Rank Badge */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-white
                      ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-slate-600 dark:bg-slate-700'}`}>
                      {i + 1}
                    </div>
                    <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                      {c.candidate?.name?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{c.candidate?.name}</div>
                      <div className="text-xs text-slate-500 truncate">{c.candidate?.email}</div>
                    </div>
                    <div className="w-28 hidden md:block">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Score</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{score}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${score / 10}%` }} />
                      </div>
                    </div>
                    <span className="badge badge-primary hidden md:inline-flex">{c.funnelStage}</span>
                    <button onClick={e => { e.stopPropagation(); togglePin(c) }}
                      className={`text-lg transition-colors ${c.isPinned ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'}`}>
                      📌
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 dark:border-[#1e2d3d] pt-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium uppercase tracking-wider">Why this rank?</p>
                      <div className="space-y-2">
                        {Object.entries(c.factors).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 w-32">{FACTOR_LABELS[key]}</span>
                            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${val / 10}%`, backgroundColor: FACTOR_COLORS[key] }} />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-10 text-right">{val}</span>
                          </div>
                        ))}
                      </div>
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
