import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { FiAward, FiTrendingUp, FiArrowUp, FiInfo } from 'react-icons/fi'
import { mockProfileDimensions, mockImprovements, mockScoreHistory } from '../../data/mockData'
import { LineChart, Line } from 'recharts'

const BADGE_TIERS = [
  { label: 'Bronze', min: 0, max: 40, color: 'from-orange-700 to-orange-500', text: 'text-orange-400', emoji: '🥉' },
  { label: 'Silver', min: 41, max: 70, color: 'from-slate-500 to-slate-400', text: 'text-slate-300', emoji: '🥈' },
  { label: 'Gold', min: 71, max: 85, color: 'from-yellow-600 to-yellow-400', text: 'text-yellow-400', emoji: '🥇' },
  { label: 'Platinum', min: 86, max: 100, color: 'from-cyan-500 to-blue-400', text: 'text-cyan-400', emoji: '💎' }
]

const getBadge = (score) => BADGE_TIERS.find(b => score >= b.min && score <= b.max) || BADGE_TIERS[0]

const computeScore = (dims) => Math.round(dims.reduce((acc, d) => acc + (d.score / 100) * d.weight, 0))

export default function ProfileScore() {
  const [dims, setDims] = useState(mockProfileDimensions)
  const [animScore, setAnimScore] = useState(0)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const score = computeScore(dims)
  const badge = getBadge(score)

  useEffect(() => {
    const timer = setTimeout(() => setAnimScore(score), 300)
    return () => clearTimeout(timer)
  }, [score])

  const circumference = 2 * Math.PI * 60
  const dashOffset = circumference - (animScore / 100) * circumference

  const radarData = dims.map(d => ({ subject: d.name.split(' ')[0], value: d.score, fullMark: 100 }))

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
            <FiAward className="text-yellow-400" size={28} /> Profile Strength Score
          </h1>
          <p className="dark:text-gray-400 text-gray-500 mt-1">See how you rank against other candidates in your target role</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Score Hero */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card text-center">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} text-white font-bold text-sm mb-4`}>
                {badge.emoji} {badge.label}
              </div>

              {/* Score Ring */}
              <div className="relative inline-block mb-4">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="60" fill="none" stroke="currentColor" strokeWidth="12" className="text-gray-200 dark:text-gray-700" />
                  <circle cx="80" cy="80" r="60" fill="none" stroke="url(#scoreGrad)" strokeWidth="12"
                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
                    transform="rotate(-90 80 80)" style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-extrabold text-gradient">{animScore}</span>
                  <span className="text-sm dark:text-gray-400 text-gray-500">/ 100</span>
                </div>
              </div>

              <p className="dark:text-gray-300 text-gray-700 font-medium">
                Top <span className="text-primary-400 font-bold">28%</span> among Frontend Engineers
              </p>
              <p className="text-sm dark:text-gray-500 text-gray-400 mt-1">vs 4,200 active candidates</p>

              {/* 30-day history */}
              <div className="mt-4 h-14">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockScoreHistory}>
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs dark:text-gray-500 text-gray-400">30-day trend</p>
            </motion.div>

            {/* Improvement Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
              <h3 className="font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-green-400" size={16} /> Top Actions
              </h3>
              <div className="space-y-3">
                {mockImprovements.map((item, i) => (
                  <div key={i} className="p-3 dark:bg-gray-800/50 bg-slate-50 rounded-xl">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm dark:text-gray-200 text-gray-700 flex-1">{item.action}</p>
                      <span className="badge badge-green flex-shrink-0 flex items-center gap-1">
                        <FiArrowUp size={10} />+{item.gain} pts
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.effort === 'Low' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {item.effort} effort
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Radar Chart + Dimensions */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold dark:text-white text-gray-900">Skill Dimensions</h3>
                <button onClick={() => setShowBreakdown(!showBreakdown)}
                  className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                  <FiInfo size={12} /> {showBreakdown ? 'Hide' : 'Show'} weights
                </button>
              </div>

              {/* Radar */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
                      formatter={(v) => [`${v}/100`, 'Score']} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Dimension bars */}
              <div className="space-y-3 mt-4">
                {dims.map((dim, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm dark:text-gray-300 text-gray-700">{dim.name}</span>
                      <div className="flex items-center gap-2">
                        {showBreakdown && <span className="text-xs dark:text-gray-500 text-gray-400">weight: {dim.weight}%</span>}
                        <span className="text-sm font-semibold dark:text-white text-gray-900">{dim.score}/100</span>
                      </div>
                    </div>
                    <div className="h-2 dark:bg-gray-700 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${dim.score}%` }} transition={{ delay: i * 0.05 + 0.3, duration: 0.6 }}
                        className={`h-full rounded-full ${dim.score >= 70 ? 'bg-green-500' : dim.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Peer Comparison */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
              <h3 className="font-bold dark:text-white text-gray-900 mb-4">Peer Comparison</h3>
              <p className="text-sm dark:text-gray-400 text-gray-500 mb-4">
                Candidates who moved from your score band (70–80) to 80+ did these 3 things:
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { action: 'Added 3+ projects', pct: 78 },
                  { action: 'Completed 2 assessments', pct: 65 },
                  { action: 'Connected GitHub', pct: 91 }
                ].map((item, i) => (
                  <div key={i} className="p-4 dark:bg-gray-800/50 bg-slate-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-primary-400 mb-1">{item.pct}%</div>
                    <p className="text-xs dark:text-gray-400 text-gray-500">{item.action}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
