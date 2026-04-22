import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiBook, FiCheck, FiClock, FiCalendar, FiZap, FiChevronDown, FiChevronUp, FiExternalLink } from 'react-icons/fi'
import { mockLearningPath } from '../../data/mockData'

const RESOURCE_ICONS = { video: '🎥', course: '📚', docs: '📄', practice: '💻', reading: '📖' }
const PLATFORM_COLORS = {
  'Frontend Masters': 'badge-red', 'YouTube': 'badge-red', 'Wes Bos': 'badge-blue',
  'Kent C. Dodds': 'badge-purple', 'Udemy': 'badge-yellow', 'Official Docs': 'badge-blue',
  'GitHub': 'badge-green', 'Book': 'badge-yellow', 'Platform': 'badge-blue'
}

export default function LearningPath() {
  const [fastTrack, setFastTrack] = useState(false)
  const [expandedWeek, setExpandedWeek] = useState(3)
  const [resources, setResources] = useState(
    mockLearningPath.weeks.flatMap(w => w.resources.map(r => ({ ...r, weekTitle: w.title })))
  )

  const toggleResource = (weekTitle, title) => {
    setResources(prev => prev.map(r => r.weekTitle === weekTitle && r.title === title ? { ...r, done: !r.done } : r))
  }

  const getWeekResources = (weekTitle) => resources.filter(r => r.weekTitle === weekTitle)

  const totalResources = resources.length
  const completedResources = resources.filter(r => r.done).length
  const overallProgress = Math.round((completedResources / totalResources) * 100)

  const displayWeeks = fastTrack
    ? mockLearningPath.weeks.map((w, i) => ({ ...w, week: i + 1, title: `Fast Track: ${w.title}` }))
    : mockLearningPath.weeks

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="py-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
              <FiBook className="text-primary-400" size={28} /> Learning Path
            </h1>
            <p className="dark:text-gray-400 text-gray-500 mt-1">Your personalised {fastTrack ? '30' : '60'}-day roadmap to {mockLearningPath.targetRole}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm dark:text-gray-400 text-gray-500">Fast Track</span>
            <button onClick={() => setFastTrack(!fastTrack)}
              className={`relative w-12 h-6 rounded-full transition-colors ${fastTrack ? 'bg-primary-500' : 'dark:bg-gray-700 bg-slate-300'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${fastTrack ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Header stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="card text-center sm:col-span-2 dark:bg-gradient-to-br dark:from-primary-900/20 dark:to-accent-900/20 border dark:border-primary-500/20">
            <p className="text-sm dark:text-gray-400 text-gray-500 mb-1">Overall Progress</p>
            <p className="text-4xl font-extrabold text-gradient mb-2">{overallProgress}%</p>
            <div className="h-2 dark:bg-gray-700 bg-slate-200 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${overallProgress}%` }} transition={{ duration: 1 }}
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
            </div>
            <p className="text-xs dark:text-gray-400 text-gray-500 mt-2">{completedResources}/{totalResources} resources completed</p>
          </div>
          <div className="card text-center">
            <FiCalendar className="mx-auto text-green-400 mb-2" size={20} />
            <p className="font-bold dark:text-white text-gray-900">Day {mockLearningPath.currentDay}</p>
            <p className="text-xs dark:text-gray-400 text-gray-500">of {fastTrack ? 30 : 60}</p>
          </div>
          <div className="card text-center">
            <FiZap className="mx-auto text-yellow-400 mb-2" size={20} />
            <p className="font-bold dark:text-white text-gray-900 text-sm">{mockLearningPath.estimatedReadyDate}</p>
            <p className="text-xs dark:text-gray-400 text-gray-500">Interview ready</p>
          </div>
        </div>

        {/* Outcome badge */}
        <div className="card mb-6 dark:bg-gradient-to-r dark:from-green-900/20 dark:to-emerald-900/20 border dark:border-green-500/20 flex items-center gap-4">
          <span className="text-3xl">🎯</span>
          <div>
            <p className="font-bold dark:text-white text-gray-900">Estimated Outcome</p>
            <p className="text-sm dark:text-gray-300 text-gray-600">
              At this pace, you will be interview-ready for <strong>{mockLearningPath.targetRole}</strong> by <strong>{mockLearningPath.estimatedReadyDate}</strong>
            </p>
          </div>
        </div>

        {/* Week timeline */}
        <div className="space-y-4">
          {displayWeeks.map((week) => {
            const weekResources = getWeekResources(week.title.replace('Fast Track: ', ''))
            const weekCompleted = weekResources.filter(r => r.done).length
            const weekProgress = weekResources.length > 0 ? Math.round((weekCompleted / weekResources.length) * 100) : 0
            const isExpanded = expandedWeek === week.week

            return (
              <motion.div key={week.week} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: week.week * 0.05 }}
                className={`card ${week.current ? 'border-2 border-primary-500/50' : ''}`}>
                <button className="w-full flex items-center justify-between" onClick={() => setExpandedWeek(isExpanded ? null : week.week)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${week.completed ? 'bg-green-500/20' : week.current ? 'bg-primary-500/20' : 'dark:bg-gray-800 bg-slate-100'}`}>
                      {week.completed ? <FiCheck className="text-green-400" size={18} /> : <span className={`font-bold text-sm ${week.current ? 'text-primary-400' : 'dark:text-gray-400 text-gray-500'}`}>W{week.week}</span>}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-bold dark:text-white text-gray-900">{week.title}</p>
                        {week.current && <span className="badge badge-blue text-xs">Current</span>}
                        {week.completed && <span className="badge badge-green text-xs">Done</span>}
                      </div>
                      <p className="text-xs dark:text-gray-400 text-gray-500">{week.objectives.join(' · ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold dark:text-white text-gray-900">{weekProgress}%</p>
                      <p className="text-xs dark:text-gray-400 text-gray-500">{weekCompleted}/{weekResources.length} done</p>
                    </div>
                    {isExpanded ? <FiChevronUp className="dark:text-gray-400 text-gray-500" size={16} /> : <FiChevronDown className="dark:text-gray-400 text-gray-500" size={16} />}
                  </div>
                </button>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 dark:bg-gray-700 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${week.completed ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-accent-500'}`}
                    style={{ width: `${weekProgress}%` }} />
                </div>

                {/* Expanded resources */}
                {isExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-2">
                    {weekResources.map((resource, ri) => (
                      <div key={ri} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${resource.done ? 'dark:bg-green-900/10 bg-green-50 border dark:border-green-500/20 border-green-200' : 'dark:bg-gray-800/50 bg-slate-50'}`}>
                        <button onClick={() => toggleResource(week.title.replace('Fast Track: ', ''), resource.title)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${resource.done ? 'bg-green-500 border-green-500' : 'dark:border-gray-600 border-slate-300'}`}>
                          {resource.done && <FiCheck size={10} className="text-white" />}
                        </button>
                        <span className="text-lg flex-shrink-0">{RESOURCE_ICONS[resource.type]}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${resource.done ? 'line-through dark:text-gray-500 text-gray-400' : 'dark:text-white text-gray-900'}`}>{resource.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`badge ${PLATFORM_COLORS[resource.platform] || 'badge-blue'} text-xs py-0`}>{resource.platform}</span>
                            <span className="text-xs dark:text-gray-500 text-gray-400 flex items-center gap-0.5"><FiClock size={10} />{resource.time}</span>
                          </div>
                        </div>
                        <FiExternalLink size={14} className="dark:text-gray-500 text-gray-400 flex-shrink-0 cursor-pointer hover:text-primary-400 transition-colors" />
                      </div>
                    ))}

                    {/* Checkpoint */}
                    <div className="flex items-center gap-3 p-3 rounded-xl dark:bg-yellow-900/10 bg-yellow-50 border dark:border-yellow-500/20 border-yellow-200">
                      <span className="text-lg">🏁</span>
                      <div>
                        <p className="text-sm font-medium dark:text-white text-gray-900">Week {week.week} Checkpoint</p>
                        <p className="text-xs dark:text-gray-400 text-gray-500">Mini-assessment on {week.title} concepts</p>
                      </div>
                      <button className="ml-auto btn-primary text-xs py-1.5 px-3">Take Quiz</button>
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
