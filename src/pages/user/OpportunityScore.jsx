import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { FiZap, FiSun, FiBookmark, FiBell, FiFilter } from 'react-icons/fi'
import { mockOpportunityJobs } from '../../data/mockData'

const URGENCY_CONFIG = {
  hot: { label: 'Hot', icon: FiZap, color: 'text-red-400', bg: 'dark:bg-red-900/20 bg-red-50', border: 'border-red-500/30', badge: 'badge-red' },
  warm: { label: 'Warm', icon: FiSun, color: 'text-yellow-400', bg: 'dark:bg-yellow-900/20 bg-yellow-50', border: 'border-yellow-500/30', badge: 'badge-yellow' },
  cool: { label: 'Cool', icon: () => <span>❄️</span>, color: 'text-blue-400', bg: 'dark:bg-blue-900/20 bg-blue-50', border: 'border-blue-500/30', badge: 'badge-blue' }
}

const ScoreBadge = ({ score, urgency }) => {
  const cfg = URGENCY_CONFIG[urgency]
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${cfg.bg} ${cfg.border}`}>
      <cfg.icon size={14} className={cfg.color} />
      <span className={`font-bold text-sm ${cfg.color}`}>{score}</span>
    </div>
  )
}

const FactorTooltip = ({ factors }) => (
  <div className="space-y-2">
    {Object.entries(factors).map(([key, val]) => (
      <div key={key} className="flex items-center gap-2">
        <span className="text-xs dark:text-gray-400 text-gray-500 capitalize w-28">{key.replace('_', ' ')}</span>
        <div className="flex-1 h-1.5 dark:bg-gray-700 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${val}%` }} />
        </div>
        <span className="text-xs font-semibold dark:text-white text-gray-900 w-6 text-right">{val}</span>
      </div>
    ))}
  </div>
)

export default function OpportunityScore() {
  const [sortBy, setSortBy] = useState('opportunity')
  const [filterUrgency, setFilterUrgency] = useState('all')
  const [bookmarked, setBookmarked] = useState(new Set())
  const [expandedJob, setExpandedJob] = useState(null)

  const sorted = [...mockOpportunityJobs]
    .filter(j => filterUrgency === 'all' || j.urgency === filterUrgency)
    .sort((a, b) => sortBy === 'opportunity' ? b.opportunityScore - a.opportunityScore : b.matchPct - a.matchPct)

  const toggleBookmark = (id) => {
    setBookmarked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
            <FiZap className="text-red-400" size={28} /> Opportunity Score
          </h1>
          <p className="dark:text-gray-400 text-gray-500 mt-1">Prioritise where to invest your application effort</p>
        </div>

        {/* Legend */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {Object.entries(URGENCY_CONFIG).map(([key, cfg]) => (
            <div key={key} className={`card ${cfg.bg} border ${cfg.border} flex items-center gap-3`}>
              <cfg.icon size={20} className={cfg.color} />
              <div>
                <p className={`font-bold ${cfg.color}`}>{cfg.label}</p>
                <p className="text-xs dark:text-gray-400 text-gray-500">
                  {key === 'hot' ? 'Score 80+' : key === 'warm' ? 'Score 50–79' : 'Score <50'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-1 dark:bg-gray-800 bg-white border dark:border-gray-700 border-slate-200 rounded-xl p-1">
            {['all', 'hot', 'warm', 'cool'].map(f => (
              <button key={f} onClick={() => setFilterUrgency(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filterUrgency === f ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white' : 'dark:text-gray-400 text-gray-500'}`}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 dark:bg-gray-800 bg-white border dark:border-gray-700 border-slate-200 rounded-xl p-1">
            <span className="text-xs dark:text-gray-400 text-gray-500 px-2">Sort:</span>
            {[['opportunity', 'Opportunity Score'], ['match', 'Match %']].map(([val, label]) => (
              <button key={val} onClick={() => setSortBy(val)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortBy === val ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white' : 'dark:text-gray-400 text-gray-500'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Job cards */}
        <div className="space-y-4">
          {sorted.map((job, i) => {
            const cfg = URGENCY_CONFIG[job.urgency]
            const isExpanded = expandedJob === job.id
            return (
              <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`card border-l-4 ${job.urgency === 'hot' ? 'border-l-red-500' : job.urgency === 'warm' ? 'border-l-yellow-500' : 'border-l-blue-500'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="font-bold dark:text-white text-gray-900">{job.title}</h3>
                      <ScoreBadge score={job.opportunityScore} urgency={job.urgency} />
                    </div>
                    <p className="text-sm dark:text-gray-400 text-gray-500">{job.company} · {job.location} · {job.salary}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="badge badge-green">{job.matchPct}% match</span>
                      <span className="text-xs dark:text-gray-400 text-gray-500">{job.applicants} applicants</span>
                      <span className="text-xs dark:text-gray-400 text-gray-500">Posted {job.posted}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => toggleBookmark(job.id)}
                      className={`p-2 rounded-lg transition-colors ${bookmarked.has(job.id) ? 'text-yellow-400 dark:bg-yellow-900/20 bg-yellow-50' : 'dark:text-gray-400 text-gray-500 dark:hover:bg-gray-800 hover:bg-slate-100'}`}>
                      <FiBell size={16} />
                    </button>
                    <button onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                      className="text-xs text-primary-400 hover:text-primary-300">
                      {isExpanded ? 'Hide' : 'Why this score?'}
                    </button>
                    <button className="btn-primary text-sm py-2">Apply Now</button>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t dark:border-gray-700 border-slate-200">
                    <p className="text-sm font-semibold dark:text-white text-gray-900 mb-3">Score Breakdown</p>
                    <FactorTooltip factors={job.factors} />
                    <div className="mt-4 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={Object.entries(job.factors).map(([k, v]) => ({ name: k.replace('_', ' '), value: v }))}>
                          <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} />
                          <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                          <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }} />
                          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
