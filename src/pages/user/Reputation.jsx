import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { FiGithub, FiCode, FiZap, FiStar, FiAward, FiShare2, FiLink, FiTrendingUp } from 'react-icons/fi'
import { mockReputationData } from '../../data/mockData'

const TIER_CONFIG = {
  Bronze: { color: 'from-orange-700 to-orange-500', text: 'text-orange-400', emoji: '🥉', min: 0, max: 250 },
  Silver: { color: 'from-slate-500 to-slate-400', text: 'text-slate-300', emoji: '🥈', min: 251, max: 500 },
  Gold: { color: 'from-yellow-600 to-yellow-400', text: 'text-yellow-400', emoji: '🥇', min: 501, max: 750 },
  Platinum: { color: 'from-cyan-500 to-blue-400', text: 'text-cyan-400', emoji: '💎', min: 751, max: 1000 }
}

const SIGNAL_ICONS = { 'GitHub Activity': FiGithub, 'LeetCode Rank': FiCode, 'Platform XP': FiZap, 'Peer Ratings': FiStar, 'Employer Endorsements': FiAward }

export default function Reputation() {
  const [activeTab, setActiveTab] = useState('overview')
  const [githubConnected, setGithubConnected] = useState(false)
  const [leetcodeConnected, setLeetcodeConnected] = useState(false)
  const [leetcodeUsername, setLeetcodeUsername] = useState('')
  const [copied, setCopied] = useState(false)

  const { score, tier, percentile, signals, history } = mockReputationData
  const tierCfg = TIER_CONFIG[tier]
  const nextTier = Object.entries(TIER_CONFIG).find(([, v]) => v.min > score)
  const progressToNext = nextTier ? Math.round(((score - tierCfg.min) / (nextTier[1].min - tierCfg.min)) * 100) : 100

  const copyLink = () => {
    navigator.clipboard.writeText('https://platform.com/u/arjun-mehta/reputation')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const circumference = 2 * Math.PI * 70
  const dashOffset = circumference - (score / 1000) * circumference

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="py-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
              <FiAward className="text-yellow-400" size={28} /> Reputation System
            </h1>
            <p className="dark:text-gray-400 text-gray-500 mt-1">Your portable, verifiable professional credibility score</p>
          </div>
          <div className="flex gap-2">
            <button onClick={copyLink} className="btn-secondary flex items-center gap-2 text-sm">
              <FiLink size={14} /> {copied ? 'Copied!' : 'Copy Profile Link'}
            </button>
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <FiShare2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['overview', 'signals', 'history', 'connect'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-400 text-gray-500'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Score ring */}
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${tierCfg.color} text-white font-bold text-sm mb-4`}>
                  {tierCfg.emoji} {tier}
                </div>

                <div className="relative inline-block mb-4">
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    {/* Milestone markers */}
                    {[250, 500, 750].map(m => {
                      const angle = (m / 1000) * 360 - 90
                      const rad = (angle * Math.PI) / 180
                      const x = 90 + 70 * Math.cos(rad)
                      const y = 90 + 70 * Math.sin(rad)
                      return <circle key={m} cx={x} cy={y} r={4} fill="#374151" />
                    })}
                    <circle cx="90" cy="90" r="70" fill="none" stroke="#374151" strokeWidth="12" />
                    <circle cx="90" cy="90" r="70" fill="none" stroke="url(#repGrad)" strokeWidth="12"
                      strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
                      transform="rotate(-90 90 90)" style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                    <defs>
                      <linearGradient id="repGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6b7280" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-extrabold text-gradient">{score}</span>
                    <span className="text-sm dark:text-gray-400 text-gray-500">/ 1000</span>
                  </div>
                </div>

                <p className="dark:text-gray-300 text-gray-700 font-medium">
                  Top <span className="text-primary-400 font-bold">{100 - percentile}%</span> on the platform
                </p>

                {nextTier && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs dark:text-gray-400 text-gray-500 mb-1">
                      <span>{tier}</span>
                      <span>{nextTier[0]}</span>
                    </div>
                    <div className="h-2 dark:bg-gray-700 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all"
                        style={{ width: `${progressToNext}%` }} />
                    </div>
                    <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">{nextTier[1].min - score} pts to {nextTier[0]}</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Signal bars */}
            <div className="lg:col-span-2 space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                <h3 className="font-bold dark:text-white text-gray-900 mb-4">Signal Breakdown</h3>
                <div className="space-y-4">
                  {signals.map((sig, i) => {
                    const Icon = SIGNAL_ICONS[sig.name]
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Icon size={14} className="text-primary-400" />
                            <span className="text-sm dark:text-gray-300 text-gray-700">{sig.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${sig.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {sig.trend > 0 ? '+' : ''}{sig.trend}
                            </span>
                            <span className="text-sm font-semibold dark:text-white text-gray-900">{sig.score}/{sig.max}</span>
                          </div>
                        </div>
                        <div className="h-2 dark:bg-gray-700 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(sig.score / sig.max) * 100}%` }}
                            transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Public profile preview */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="card dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 border dark:border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">A</div>
                  <div>
                    <p className="font-bold dark:text-white text-gray-900">Arjun Mehta</p>
                    <p className="text-sm dark:text-gray-400 text-gray-500">platform.com/u/arjun-mehta/reputation</p>
                  </div>
                  <div className={`ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${tierCfg.color} text-white font-bold text-sm`}>
                    {tierCfg.emoji} {score}
                  </div>
                </div>
                <p className="text-xs dark:text-gray-400 text-gray-500">This is how your public reputation profile appears to recruiters</p>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card">
            <h3 className="font-bold dark:text-white text-gray-900 mb-4">Score History (Last 6 Months)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis domain={[500, 800]} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [v, 'Reputation Score']} />
                  <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="grid md:grid-cols-2 gap-4">
            {signals.map((sig, i) => {
              const Icon = SIGNAL_ICONS[sig.name]
              return (
                <div key={i} className="card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                      <Icon className="text-primary-400" size={18} />
                    </div>
                    <div>
                      <p className="font-bold dark:text-white text-gray-900">{sig.name}</p>
                      <p className="text-xs dark:text-gray-400 text-gray-500">20% weight</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-2xl font-extrabold text-gradient">{sig.score}</p>
                      <p className="text-xs dark:text-gray-400 text-gray-500">/ {sig.max}</p>
                    </div>
                  </div>
                  <div className="h-2 dark:bg-gray-700 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                      style={{ width: `${(sig.score / sig.max) * 100}%` }} />
                  </div>
                  <p className={`text-xs mt-2 ${sig.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <FiTrendingUp className="inline mr-1" size={10} />{sig.trend > 0 ? '+' : ''}{sig.trend} this month
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'connect' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* GitHub */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl dark:bg-gray-800 bg-slate-100 flex items-center justify-center">
                  <FiGithub size={24} className="dark:text-white text-gray-900" />
                </div>
                <div>
                  <p className="font-bold dark:text-white text-gray-900">GitHub</p>
                  <p className="text-sm dark:text-gray-400 text-gray-500">Commits, PRs, stars, streak</p>
                </div>
                {githubConnected && <span className="ml-auto badge badge-green">Connected</span>}
              </div>
              {githubConnected ? (
                <div className="space-y-2 text-sm dark:text-gray-300 text-gray-600">
                  <p>✅ 847 commits in last 12 months</p>
                  <p>✅ 23 PRs merged</p>
                  <p>✅ 156 repo stars</p>
                  <p>✅ 31-day contribution streak</p>
                </div>
              ) : (
                <button onClick={() => setGithubConnected(true)} className="btn-primary w-full flex items-center justify-center gap-2">
                  <FiGithub size={16} /> Connect GitHub
                </button>
              )}
            </div>

            {/* LeetCode */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl dark:bg-gray-800 bg-slate-100 flex items-center justify-center">
                  <FiCode size={24} className="text-yellow-400" />
                </div>
                <div>
                  <p className="font-bold dark:text-white text-gray-900">LeetCode</p>
                  <p className="text-sm dark:text-gray-400 text-gray-500">Problems solved, contest rating</p>
                </div>
                {leetcodeConnected && <span className="ml-auto badge badge-green">Connected</span>}
              </div>
              {leetcodeConnected ? (
                <div className="space-y-2 text-sm dark:text-gray-300 text-gray-600">
                  <p>✅ 312 problems solved</p>
                  <p>✅ Contest rating: 1,847</p>
                  <p>✅ Global top 15%</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <input className="input-field text-sm" placeholder="Your LeetCode username"
                    value={leetcodeUsername} onChange={e => setLeetcodeUsername(e.target.value)} />
                  <button onClick={() => leetcodeUsername && setLeetcodeConnected(true)}
                    disabled={!leetcodeUsername} className="btn-primary w-full disabled:opacity-50">
                    Connect LeetCode
                  </button>
                </div>
              )}
            </div>

            {/* Employer Endorsements */}
            <div className="card md:col-span-2">
              <h3 className="font-bold dark:text-white text-gray-900 mb-3 flex items-center gap-2">
                <FiAward className="text-yellow-400" size={16} /> Employer Endorsements
              </h3>
              <p className="text-sm dark:text-gray-400 text-gray-500 mb-4">
                Request verified endorsements from employers you've worked with. Each verified endorsement boosts your score with a weighted multiplier.
              </p>
              <div className="flex gap-3">
                <input className="input-field text-sm flex-1" placeholder="Employer email address" />
                <button className="btn-primary text-sm py-2 px-4">Request Endorsement</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
