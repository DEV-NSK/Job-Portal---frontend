import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMessageSquare, FiAward, FiGitBranch, FiZap, FiActivity, FiCode, FiVideo, FiCpu, FiBriefcase, FiMic, FiBook, FiTrendingUp, FiUsers, FiStar } from 'react-icons/fi'
import { mockReadinessScore, mockReputationData } from '../../data/mockData'

const FEATURES = [
  { id: 1, title: 'AI Career Copilot', desc: 'Daily briefing, readiness score & AI chat', icon: FiMessageSquare, path: '/copilot', color: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-400', priority: 'P0', sprint: 'S1' },
  { id: 2, title: 'Profile Strength Score', desc: 'Percentile rank & improvement actions', icon: FiAward, path: '/profile-score', color: 'from-yellow-600/20 to-yellow-600/5', border: 'border-yellow-500/20', text: 'text-yellow-400', priority: 'P0', sprint: 'S1' },
  { id: 3, title: 'Skill Graph', desc: 'Interactive force-directed skill network', icon: FiGitBranch, path: '/skill-graph', color: 'from-green-600/20 to-green-600/5', border: 'border-green-500/20', text: 'text-green-400', priority: 'P1', sprint: 'S2' },
  { id: 4, title: 'Resume vs Job Match', desc: 'AI semantic resume analysis', icon: FiZap, path: '/resume-match', color: 'from-orange-600/20 to-orange-600/5', border: 'border-orange-500/20', text: 'text-orange-400', priority: 'P0', sprint: 'S1' },
  { id: 5, title: 'Consistency Tracker', desc: 'GitHub-style heatmap & streaks', icon: FiActivity, path: '/consistency', color: 'from-red-600/20 to-red-600/5', border: 'border-red-500/20', text: 'text-red-400', priority: 'P1', sprint: 'S2' },
  { id: 6, title: 'Daily Coding Practice', desc: 'Adaptive problems & leaderboard', icon: FiCode, path: '/coding', color: 'from-purple-600/20 to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-400', priority: 'P0', sprint: 'S1' },
  { id: 7, title: 'Interview Room', desc: 'Live WebRTC + collaborative editor', icon: FiVideo, path: '/interview-room', color: 'from-cyan-600/20 to-cyan-600/5', border: 'border-cyan-500/20', text: 'text-cyan-400', priority: 'P1', sprint: 'S3' },
  { id: 8, title: 'Code Quality Analyzer', desc: 'Big-O, readability & edge cases', icon: FiCpu, path: '/code-quality', color: 'from-pink-600/20 to-pink-600/5', border: 'border-pink-500/20', text: 'text-pink-400', priority: 'P1', sprint: 'S3' },
  { id: 9, title: 'Project-Based Hiring', desc: 'Real take-home projects from employers', icon: FiBriefcase, path: '/projects', color: 'from-indigo-600/20 to-indigo-600/5', border: 'border-indigo-500/20', text: 'text-indigo-400', priority: 'P1', sprint: 'S3' },
  { id: 10, title: 'AI Mock Interview Bot', desc: 'Voice-enabled AI interview practice', icon: FiMic, path: '/mock-interview', color: 'from-violet-600/20 to-violet-600/5', border: 'border-violet-500/20', text: 'text-violet-400', priority: 'P1', sprint: 'S3' },
  { id: 11, title: 'Learning Path', desc: 'Personalised 60-day roadmap', icon: FiBook, path: '/learning-path', color: 'from-teal-600/20 to-teal-600/5', border: 'border-teal-500/20', text: 'text-teal-400', priority: 'P1', sprint: 'S2' },
  { id: 12, title: 'Opportunity Score', desc: 'Job urgency & competition signals', icon: FiTrendingUp, path: '/opportunity', color: 'from-amber-600/20 to-amber-600/5', border: 'border-amber-500/20', text: 'text-amber-400', priority: 'P2', sprint: 'S5' },
  { id: 13, title: 'Peer Coding Rooms', desc: 'Multiplayer collaborative coding', icon: FiUsers, path: '/peer-coding', color: 'from-lime-600/20 to-lime-600/5', border: 'border-lime-500/20', text: 'text-lime-400', priority: 'P2', sprint: 'S5' },
  { id: 14, title: 'Reputation System', desc: 'Composite credibility score', icon: FiStar, path: '/reputation', color: 'from-rose-600/20 to-rose-600/5', border: 'border-rose-500/20', text: 'text-rose-400', priority: 'P1', sprint: 'S4' }
]

const PRIORITY_COLORS = { P0: 'badge-red', P1: 'badge-yellow', P2: 'badge-blue' }

export default function FeatureDashboard() {
  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-xl">🚀</span>
            </div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">AI Career Platform</h1>
          </div>
          <p className="dark:text-gray-400 text-gray-500">14 features to accelerate your career — all in one place</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Readiness Score', value: mockReadinessScore, suffix: '/100', color: 'text-green-400' },
            { label: 'Reputation Score', value: mockReputationData.score, suffix: '/1000', color: 'text-yellow-400' },
            { label: 'Current Streak', value: '31', suffix: ' days', color: 'text-orange-400' },
            { label: 'Features Active', value: '14', suffix: '/14', color: 'text-primary-400' }
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}<span className="text-base font-normal dark:text-gray-400 text-gray-500">{s.suffix}</span></p>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link to={f.path}
                className={`card bg-gradient-to-br ${f.color} border ${f.border} hover:scale-[1.03] transition-all block group`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl dark:bg-gray-900/50 bg-white/80 flex items-center justify-center ${f.text}`}>
                    <f.icon size={18} />
                  </div>
                  <div className="flex gap-1">
                    <span className={`badge ${PRIORITY_COLORS[f.priority]} text-xs py-0`}>{f.priority}</span>
                    <span className="badge badge-blue text-xs py-0">{f.sprint}</span>
                  </div>
                </div>
                <p className="font-bold dark:text-white text-gray-900 mb-1 group-hover:text-primary-400 transition-colors">{f.title}</p>
                <p className="text-sm dark:text-gray-400 text-gray-500">{f.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open feature →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
