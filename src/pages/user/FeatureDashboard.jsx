import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMessageSquare, FiAward, FiGitBranch, FiZap, FiActivity, FiCode, FiVideo, FiCpu, FiBriefcase, FiMic, FiBook, FiTrendingUp, FiUsers, FiStar, FiArrowRight } from 'react-icons/fi'
import { mockReadinessScore, mockReputationData } from '../../data/mockData'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const FEATURES = [
  { 
    id: 1, 
    title: 'AI Career Copilot', 
    desc: 'Daily briefing, readiness score & AI chat', 
    icon: FiMessageSquare, 
    path: '/copilot', 
    gradient: 'from-blue-500/20 to-blue-600/5', 
    iconColor: 'text-blue-500 dark:text-blue-400',
    priority: 'P0', 
    sprint: 'S1' 
  },
  { 
    id: 2, 
    title: 'Profile Strength Score', 
    desc: 'Percentile rank & improvement actions', 
    icon: FiAward, 
    path: '/profile-score', 
    gradient: 'from-amber-500/20 to-amber-600/5', 
    iconColor: 'text-amber-500 dark:text-amber-400',
    priority: 'P0', 
    sprint: 'S1' 
  },
  { 
    id: 3, 
    title: 'Skill Graph', 
    desc: 'Interactive force-directed skill network', 
    icon: FiGitBranch, 
    path: '/skill-graph', 
    gradient: 'from-emerald-500/20 to-emerald-600/5', 
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    priority: 'P1', 
    sprint: 'S2' 
  },
  { 
    id: 4, 
    title: 'Resume vs Job Match', 
    desc: 'AI semantic resume analysis', 
    icon: FiZap, 
    path: '/resume-match', 
    gradient: 'from-orange-500/20 to-orange-600/5', 
    iconColor: 'text-orange-500 dark:text-orange-400',
    priority: 'P0', 
    sprint: 'S1' 
  },
  { 
    id: 5, 
    title: 'Consistency Tracker', 
    desc: 'GitHub-style heatmap & streaks', 
    icon: FiActivity, 
    path: '/consistency', 
    gradient: 'from-red-500/20 to-red-600/5', 
    iconColor: 'text-red-500 dark:text-red-400',
    priority: 'P1', 
    sprint: 'S2' 
  },
  { 
    id: 6, 
    title: 'Daily Coding Practice', 
    desc: 'Adaptive problems & leaderboard', 
    icon: FiCode, 
    path: '/coding', 
    gradient: 'from-purple-500/20 to-purple-600/5', 
    iconColor: 'text-purple-500 dark:text-purple-400',
    priority: 'P0', 
    sprint: 'S1' 
  },
  { 
    id: 7, 
    title: 'Interview Room', 
    desc: 'Live WebRTC + collaborative editor', 
    icon: FiVideo, 
    path: '/interview-room', 
    gradient: 'from-cyan-500/20 to-cyan-600/5', 
    iconColor: 'text-cyan-500 dark:text-cyan-400',
    priority: 'P1', 
    sprint: 'S3' 
  },
  { 
    id: 8, 
    title: 'Code Quality Analyzer', 
    desc: 'Big-O, readability & edge cases', 
    icon: FiCpu, 
    path: '/code-quality', 
    gradient: 'from-pink-500/20 to-pink-600/5', 
    iconColor: 'text-pink-500 dark:text-pink-400',
    priority: 'P1', 
    sprint: 'S3' 
  },
  { 
    id: 9, 
    title: 'Project-Based Hiring', 
    desc: 'Real take-home projects from employers', 
    icon: FiBriefcase, 
    path: '/projects', 
    gradient: 'from-indigo-500/20 to-indigo-600/5', 
    iconColor: 'text-indigo-500 dark:text-indigo-400',
    priority: 'P1', 
    sprint: 'S3' 
  },
  { 
    id: 10, 
    title: 'AI Mock Interview Bot', 
    desc: 'Voice-enabled AI interview practice', 
    icon: FiMic, 
    path: '/mock-interview', 
    gradient: 'from-violet-500/20 to-violet-600/5', 
    iconColor: 'text-violet-500 dark:text-violet-400',
    priority: 'P1', 
    sprint: 'S3' 
  },
  { 
    id: 11, 
    title: 'Learning Path', 
    desc: 'Personalised 60-day roadmap', 
    icon: FiBook, 
    path: '/learning-path', 
    gradient: 'from-teal-500/20 to-teal-600/5', 
    iconColor: 'text-teal-500 dark:text-teal-400',
    priority: 'P1', 
    sprint: 'S2' 
  },
  { 
    id: 12, 
    title: 'Opportunity Score', 
    desc: 'Job urgency & competition signals', 
    icon: FiTrendingUp, 
    path: '/opportunity', 
    gradient: 'from-lime-500/20 to-lime-600/5', 
    iconColor: 'text-lime-500 dark:text-lime-400',
    priority: 'P2', 
    sprint: 'S5' 
  },
  { 
    id: 13, 
    title: 'Peer Coding Rooms', 
    desc: 'Multiplayer collaborative coding', 
    icon: FiUsers, 
    path: '/peer-coding', 
    gradient: 'from-rose-500/20 to-rose-600/5', 
    iconColor: 'text-rose-500 dark:text-rose-400',
    priority: 'P2', 
    sprint: 'S5' 
  },
  { 
    id: 14, 
    title: 'Reputation System', 
    desc: 'Composite credibility score', 
    icon: FiStar, 
    path: '/reputation', 
    gradient: 'from-yellow-500/20 to-yellow-600/5', 
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    priority: 'P1', 
    sprint: 'S4' 
  }
]

const PRIORITY_COLORS = { 
  P0: 'danger', 
  P1: 'warning', 
  P2: 'primary' 
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

export default function FeatureDashboard() {
  return (
    <div className="min-h-screen pt-20 container-padding pb-12">
      <div className="content-width">
        {/* Header */}
        <motion.div 
          className="py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <span className="text-2xl">🚀</span>
            </motion.div>
            <div>
              <h1 className="heading-2 dark:text-slate-100 text-slate-900">
                AI Career Platform
              </h1>
              <p className="dark:text-slate-400 text-slate-600">
                14 features to accelerate your career — all in one place
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { 
              label: 'Readiness Score', 
              value: mockReadinessScore, 
              suffix: '/100', 
              color: 'text-emerald-500',
              bgColor: 'from-emerald-500/20 to-emerald-600/5'
            },
            { 
              label: 'Reputation Score', 
              value: mockReputationData.score, 
              suffix: '/1000', 
              color: 'text-amber-500',
              bgColor: 'from-amber-500/20 to-amber-600/5'
            },
            { 
              label: 'Current Streak', 
              value: '31', 
              suffix: ' days', 
              color: 'text-orange-500',
              bgColor: 'from-orange-500/20 to-orange-600/5'
            },
            { 
              label: 'Features Active', 
              value: '14', 
              suffix: '/14', 
              color: 'text-indigo-500',
              bgColor: 'from-indigo-500/20 to-indigo-600/5'
            }
          ].map((stat, index) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card hover className={`text-center bg-gradient-to-br ${stat.bgColor} border-0`}>
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                  <span className="text-base font-normal dark:text-slate-400 text-slate-500">
                    {stat.suffix}
                  </span>
                </div>
                <p className="text-sm dark:text-slate-400 text-slate-600 font-medium">
                  {stat.label}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {FEATURES.map((feature, index) => (
            <motion.div key={feature.id} variants={itemVariants}>
              <Card 
                hover 
                className={`bg-gradient-to-br ${feature.gradient} border-0 group relative overflow-hidden h-full`}
              >
                <Link to={feature.path} className="block h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div 
                      className={`w-12 h-12 rounded-2xl dark:bg-slate-900/50 bg-white/80 flex items-center justify-center ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 10 }}
                    >
                      <feature.icon size={20} />
                    </motion.div>
                    <div className="flex gap-1">
                      <Badge 
                        variant={PRIORITY_COLORS[feature.priority]} 
                        size="sm"
                      >
                        {feature.priority}
                      </Badge>
                      <Badge variant="primary" size="sm">
                        {feature.sprint}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2 mb-4">
                    <h3 className="font-bold dark:text-slate-100 text-slate-900 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>

                  {/* Footer */}
                  <motion.div 
                    className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <span>Open feature</span>
                    <FiArrowRight size={12} />
                  </motion.div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none glow-sm" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold dark:text-slate-100 text-slate-900 mb-3">
                Ready to accelerate your career?
              </h2>
              <p className="dark:text-slate-400 text-slate-600 mb-6">
                Explore all features and start building your professional profile today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  to="/profile" 
                  className="btn-primary flex items-center gap-2 justify-center"
                >
                  Complete Profile
                  <FiArrowRight size={16} />
                </Link>
                <Link 
                  to="/jobs" 
                  className="btn-secondary flex items-center gap-2 justify-center"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
