import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiThumbsUp, FiThumbsDown, FiTarget, FiTrendingUp, FiZap, FiMessageSquare, FiX, FiChevronRight } from 'react-icons/fi'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { copilotAPI } from '../../services/api'

const scoreColor = (s) => s >= 71 ? 'text-green-400' : s >= 41 ? 'text-yellow-400' : 'text-red-400'
const scoreBg = (s) => s >= 71 ? 'from-green-500 to-emerald-600' : s >= 41 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-rose-600'
const scoreStroke = (s) => s >= 71 ? '#10b981' : s >= 41 ? '#f59e0b' : '#ef4444'

const MOCK_RESPONSES = [
  "Based on your profile, I recommend focusing on **System Design** this week. Your current score in that area is 45/100, and improving it could add +8 points to your readiness score.",
  "Your top matched job right now is **Senior Frontend Engineer at Stripe** with a 91% match. The main gap is GraphQL experience — I'd suggest completing the GraphQL Fundamentals course on their docs.",
  "Looking at your activity this week, you've solved 4 coding problems. To maintain your streak and hit the Top 10% leaderboard, aim for 2 more problems today.",
  "The hiring market for React developers is very active right now — 23% more remote roles posted this month vs last. Your profile is well-positioned. Focus on adding 2 more projects to push your score above 80.",
]

export default function AICopilot() {
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: "Hi! I'm your AI Career Copilot. Ask me anything about your job search, skill gaps, or interview prep.", rated: null }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [goals, setGoals] = useState({ targetRole: 'Senior Frontend Engineer', timeline: '3 months', companyTier: 'FAANG' })
  const [showGoals, setShowGoals] = useState(false)
  const [animScore, setAnimScore] = useState(0)
  const [scoreData, setScoreData] = useState({ score: 0, delta: 0, percentile: 50 })
  const [briefing, setBriefing] = useState(null)
  const [scoreHistory, setScoreHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [readRes, briefRes, histRes, goalRes] = await Promise.all([
          copilotAPI.getReadinessScore().catch(() => ({ data: { score: 72, delta: 4, percentile: 28 } })),
          copilotAPI.getDailyBriefing().catch(() => ({ data: null })),
          copilotAPI.getScoreHistory ? copilotAPI.getScoreHistory().catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          copilotAPI.getGoals ? copilotAPI.getGoals().catch(() => ({ data: {} })) : Promise.resolve({ data: {} })
        ])
        setScoreData(readRes.data)
        if (briefRes.data) setBriefing(briefRes.data)
        if (histRes.data?.length) setScoreHistory(histRes.data)
        if (goalRes.data?.targetRole) setGoals(goalRes.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setAnimScore(scoreData.score || 72), 300)
    return () => clearTimeout(timer)
  }, [scoreData.score])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { id: Date.now(), role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    try {
      const res = await copilotAPI.chat(input)
      setMessages(prev => [...prev, { id: res.data.id || Date.now() + 1, role: 'assistant', text: res.data.text, rated: null }])
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: "I'm having trouble connecting right now. Please try again in a moment.", rated: null }])
    }
    setTyping(false)
  }

  const rateMessage = async (id, rating) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, rated: rating } : m))
    try { await copilotAPI.rateResponse(id, rating) } catch {}
  }

  const saveGoals = async () => {
    try { await copilotAPI.setGoals(goals) } catch {}
    setShowGoals(false)
  }

  const displayBriefing = briefing || {
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    delta: scoreData.delta || 0,
    topJobs: [{ title: 'Software Engineer', company: 'Top Company', match: 80, location: 'Remote' }],
    skillGaps: ['System Design', 'GraphQL'],
    recommendedAction: 'Complete your profile to improve your readiness score',
    insight: 'Remote engineering roles are up 18% this month — now is a great time to apply.'
  }

  const displayHistory = scoreHistory.length > 0
    ? scoreHistory
    : Array.from({ length: 30 }, (_, i) => ({ day: i + 1, score: Math.max(40, Math.min(100, 55 + Math.round(Math.sin(i / 3) * 10 + i * 0.5))) }))

  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference - (animScore / 100) * circumference

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
            <span className="text-2xl">🤖</span> AI Career Copilot
          </h1>
          <p className="dark:text-gray-400 text-gray-500 mt-1">Your personalised, always-on career advisor</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Score + Briefing */}
          <div className="lg:col-span-2 space-y-6">

            {/* Readiness Score Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* SVG Score Ring */}
                <div className="relative flex-shrink-0">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-gray-200 dark:text-gray-700" />
                    <circle cx="70" cy="70" r="54" fill="none" stroke={scoreStroke(animScore)} strokeWidth="10"
                      strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
                      transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-extrabold ${scoreColor(animScore)}`}>{animScore}</span>
                    <span className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">/ 100</span>
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                    <h2 className="text-xl font-bold dark:text-white text-gray-900">Career Readiness Score</h2>
                    <span className={`badge ${animScore >= 71 ? 'badge-green' : animScore >= 41 ? 'badge-yellow' : 'badge-red'}`}>
                      {animScore >= 71 ? 'Strong' : animScore >= 41 ? 'Developing' : 'Needs Work'}
                    </span>
                  </div>
                  <p className="dark:text-gray-400 text-gray-500 text-sm mb-4">
                    You're in the <strong className="text-primary-400">top {100 - (scoreData.percentile || 28)}%</strong> of Frontend Engineers on the platform
                  </p>
                  {/* 30-day sparkline */}
                  <div className="h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={displayHistory}>
                        <Line type="monotone" dataKey="score" stroke={scoreStroke(animScore)} strokeWidth={2} dot={false} />
                        <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
                          formatter={(v) => [`${v}`, 'Score']} labelFormatter={(l) => `Day ${l}`} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs dark:text-gray-500 text-gray-400 mt-1">30-day trend</p>
                </div>
              </div>
            </motion.div>

            {/* Daily Briefing Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className={`card border-l-4 ${(displayBriefing.delta || 0) >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold dark:text-white text-gray-900 text-lg">Daily Briefing</h3>
                  <p className="text-sm dark:text-gray-400 text-gray-500">{displayBriefing.date || new Date().toLocaleDateString()}</p>
                </div>
                <span className={`text-2xl font-bold ${(displayBriefing.delta || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(displayBriefing.delta || 0) >= 0 ? '+' : ''}{displayBriefing.delta || 0} pts
                </span>
              </div>

              {/* Top Jobs */}
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider dark:text-gray-400 text-gray-500 mb-2">Top Matches Today</p>
                <div className="space-y-2">
                  {(displayBriefing.topJobs || []).map((job, i) => (
                    <div key={i} className="flex items-center justify-between p-3 dark:bg-gray-800/50 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium dark:text-white text-gray-900 text-sm">{job.title}</p>
                        <p className="text-xs dark:text-gray-400 text-gray-500">{job.company} · {job.location}</p>
                      </div>
                      <span className="badge badge-green">{job.match}% match</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gaps */}
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider dark:text-gray-400 text-gray-500 mb-2">Skill Gaps to Address</p>
                <div className="flex gap-2 flex-wrap">
                  {(displayBriefing.skillGaps || []).map(s => (
                    <span key={s} className="badge badge-red">{s}</span>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3 dark:bg-primary-900/20 bg-primary-50 border dark:border-primary-500/20 border-primary-200 rounded-xl flex items-start gap-3">
                <FiZap className="text-primary-400 mt-0.5 flex-shrink-0" size={16} />
                <p className="text-sm dark:text-gray-300 text-gray-700">{displayBriefing.recommendedAction}</p>
              </div>
            </motion.div>

            {/* Insight of the Day */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="card dark:bg-gradient-to-br dark:from-accent-900/20 dark:to-primary-900/20 border dark:border-accent-500/20">
              <div className="flex items-start gap-3">
                <FiTrendingUp className="text-accent-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold dark:text-white text-gray-900 mb-1">Insight of the Day</p>
                  <p className="dark:text-gray-300 text-gray-600 text-sm">{displayBriefing.insight}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Goals + Chat CTA */}
          <div className="space-y-6">
            {/* Career Goals */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold dark:text-white text-gray-900 flex items-center gap-2">
                  <FiTarget size={16} className="text-primary-400" /> Career Goals
                </h3>
                <button onClick={() => setShowGoals(!showGoals)} className="text-xs text-primary-400 hover:text-primary-300">
                  {showGoals ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {showGoals ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs dark:text-gray-400 text-gray-500 mb-1 block">Target Role</label>
                    <input className="input-field text-sm" value={goals.targetRole}
                      onChange={e => setGoals(p => ({ ...p, targetRole: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs dark:text-gray-400 text-gray-500 mb-1 block">Timeline</label>
                    <select className="input-field text-sm" value={goals.timeline}
                      onChange={e => setGoals(p => ({ ...p, timeline: e.target.value }))}>
                      {['1 month', '3 months', '6 months', '1 year'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs dark:text-gray-400 text-gray-500 mb-1 block">Company Tier</label>
                    <select className="input-field text-sm" value={goals.companyTier}
                      onChange={e => setGoals(p => ({ ...p, companyTier: e.target.value }))}>
                      {['FAANG', 'Top Startup', 'Mid-size', 'Any'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <button onClick={saveGoals} className="btn-primary w-full text-sm py-2">Save Goals</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {[['Target Role', goals.targetRole], ['Timeline', goals.timeline], ['Company Tier', goals.companyTier]].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-400 text-gray-500">{k}</span>
                      <span className="text-sm font-medium dark:text-white text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Chat CTA */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="card dark:bg-gradient-to-br dark:from-primary-900/30 dark:to-accent-900/20 border dark:border-primary-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => setChatOpen(true)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <FiMessageSquare className="text-white" size={18} />
                </div>
                <div>
                  <p className="font-bold dark:text-white text-gray-900">Ask Your Copilot</p>
                  <p className="text-xs dark:text-gray-400 text-gray-500">Powered by GPT-4o</p>
                </div>
              </div>
              <div className="space-y-2">
                {['What should I focus on today?', 'How do I improve my score?', 'Which jobs should I apply to?'].map(q => (
                  <div key={q} className="flex items-center gap-2 text-sm dark:text-gray-300 text-gray-600 p-2 dark:bg-gray-800/40 bg-slate-100 rounded-lg">
                    <FiChevronRight size={12} className="text-primary-400 flex-shrink-0" />
                    {q}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Chat Drawer */}
      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40" onClick={() => setChatOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md dark:bg-gray-900 bg-white z-50 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <FiMessageSquare className="text-white" size={16} />
                  </div>
                  <div>
                    <p className="font-bold dark:text-white text-gray-900 text-sm">AI Career Copilot</p>
                    <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" />Online</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="p-2 dark:hover:bg-gray-800 hover:bg-slate-100 rounded-lg transition-colors">
                  <FiX size={18} className="dark:text-gray-400 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-primary-600 to-accent-600 text-white rounded-2xl rounded-tr-sm'
                      : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-100 text-gray-900 rounded-2xl rounded-tl-sm'} px-4 py-3 text-sm`}>
                      <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      {msg.role === 'assistant' && msg.rated === null && (
                        <div className="flex gap-2 mt-2 pt-2 border-t dark:border-gray-700 border-slate-200">
                          <button onClick={() => rateMessage(msg.id, 'up')} className="p-1 dark:hover:bg-gray-700 hover:bg-slate-200 rounded transition-colors">
                            <FiThumbsUp size={12} className="dark:text-gray-400 text-gray-500" />
                          </button>
                          <button onClick={() => rateMessage(msg.id, 'down')} className="p-1 dark:hover:bg-gray-700 hover:bg-slate-200 rounded transition-colors">
                            <FiThumbsDown size={12} className="dark:text-gray-400 text-gray-500" />
                          </button>
                        </div>
                      )}
                      {msg.rated && <p className="text-xs mt-1 opacity-60">{msg.rated === 'up' ? '👍 Thanks!' : '👎 Noted'}</p>}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="dark:bg-gray-800 bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t dark:border-gray-700 border-slate-200">
                <div className="flex gap-2">
                  <input className="input-field text-sm flex-1" placeholder="Ask your copilot anything..."
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                  <button onClick={sendMessage} disabled={!input.trim()}
                    className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiSend size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
