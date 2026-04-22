import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiZap, FiTarget, FiAward, FiTrendingUp } from 'react-icons/fi'
import { mockActivityData } from '../../data/mockData'

const INTENSITY_COLORS_DARK = ['#1f2937', '#064e3b', '#065f46', '#047857', '#10b981']
const INTENSITY_COLORS_LIGHT = ['#f1f5f9', '#bbf7d0', '#86efac', '#4ade80', '#16a34a']

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const BADGES = [
  { days: 7, label: '7-Day Streak', emoji: '🔥', earned: true },
  { days: 30, label: '30-Day Streak', emoji: '⚡', earned: true },
  { days: 90, label: '90-Day Streak', emoji: '💎', earned: false },
  { days: 365, label: '365-Day Streak', emoji: '👑', earned: false }
]

const CONTRIBUTION_TYPES = [
  { label: 'Coding Problems', count: 42, color: 'bg-green-500' },
  { label: 'Mock Interviews', count: 8, color: 'bg-blue-500' },
  { label: 'Courses Progressed', count: 15, color: 'bg-purple-500' },
  { label: 'Jobs Applied', count: 12, color: 'bg-yellow-500' },
  { label: 'Profile Updates', count: 6, color: 'bg-orange-500' },
  { label: 'Peer Reviews', count: 3, color: 'bg-pink-500' }
]

export default function ConsistencyTracker() {
  const [hoveredDay, setHoveredDay] = useState(null)
  const [dailyGoal, setDailyGoal] = useState(2)
  const [editGoal, setEditGoal] = useState(false)
  const isDark = document.documentElement.classList.contains('dark')
  const colors = isDark ? INTENSITY_COLORS_DARK : INTENSITY_COLORS_LIGHT

  const currentStreak = 31
  const longestStreak = 45
  const weeklyAvg = 3.2
  const totalContributions = mockActivityData.flat().reduce((a, d) => a + d.count, 0)
  const todayCount = 2

  // Get month labels for the heatmap
  const getMonthLabel = (weekIdx) => {
    const week = mockActivityData[weekIdx]
    if (!week || !week[0]) return null
    const date = new Date(week[0].date)
    if (date.getDate() <= 7) return MONTHS[date.getMonth()]
    return null
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
            <FiZap className="text-orange-400" size={28} /> Consistency Tracker
          </h1>
          <p className="dark:text-gray-400 text-gray-500 mt-1">Build the habit that separates top candidates</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Current Streak', value: `${currentStreak} days`, icon: FiZap, color: 'text-orange-400', bg: 'from-orange-600/20 to-orange-600/5', border: 'border-orange-500/20' },
            { label: 'Longest Streak', value: `${longestStreak} days`, icon: FiAward, color: 'text-yellow-400', bg: 'from-yellow-600/20 to-yellow-600/5', border: 'border-yellow-500/20' },
            { label: 'Weekly Average', value: `${weeklyAvg} / day`, icon: FiTrendingUp, color: 'text-green-400', bg: 'from-green-600/20 to-green-600/5', border: 'border-green-500/20' },
            { label: 'Total Contributions', value: totalContributions, icon: FiTarget, color: 'text-primary-400', bg: 'from-primary-600/20 to-primary-600/5', border: 'border-primary-500/20' }
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={`card bg-gradient-to-br ${bg} border ${border}`}>
              <Icon className={color} size={20} />
              <p className="text-2xl font-bold dark:text-white text-gray-900 mt-2">{value}</p>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Heatmap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold dark:text-white text-gray-900">Activity Heatmap</h3>
            <span className="text-sm dark:text-gray-400 text-gray-500">{totalContributions} contributions in the last year</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Month labels */}
              <div className="flex mb-1 ml-8">
                {mockActivityData.map((_, wi) => {
                  const label = getMonthLabel(wi)
                  return (
                    <div key={wi} className="w-3.5 mr-0.5 text-xs dark:text-gray-500 text-gray-400" style={{ minWidth: 14 }}>
                      {label || ''}
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-0.5">
                {/* Day labels */}
                <div className="flex flex-col gap-0.5 mr-1">
                  {DAYS.map((d, i) => (
                    <div key={d} className="h-3.5 text-xs dark:text-gray-500 text-gray-400 flex items-center" style={{ fontSize: 9 }}>
                      {i % 2 === 1 ? d.slice(0, 3) : ''}
                    </div>
                  ))}
                </div>

                {/* Weeks */}
                {mockActivityData.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-0.5">
                    {week.map((day, di) => {
                      const intensity = Math.min(4, day.count)
                      return (
                        <div key={di} className="w-3.5 h-3.5 rounded-sm cursor-pointer transition-transform hover:scale-125 relative group"
                          style={{ backgroundColor: colors[intensity] }}
                          onMouseEnter={() => setHoveredDay(day)} onMouseLeave={() => setHoveredDay(null)}>
                          {hoveredDay?.date === day.date && (
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap pointer-events-none shadow-lg">
                              {day.count} contribution{day.count !== 1 ? 's' : ''} on {day.date}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 mt-3 justify-end">
                <span className="text-xs dark:text-gray-500 text-gray-400">Less</span>
                {colors.map((c, i) => (
                  <div key={i} className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c }} />
                ))}
                <span className="text-xs dark:text-gray-500 text-gray-400">More</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Daily Goal */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold dark:text-white text-gray-900 flex items-center gap-2">
                <FiTarget className="text-primary-400" size={16} /> Daily Goal
              </h3>
              <button onClick={() => setEditGoal(!editGoal)} className="text-xs text-primary-400 hover:text-primary-300">
                {editGoal ? 'Done' : 'Edit'}
              </button>
            </div>
            {editGoal ? (
              <div className="space-y-3">
                <p className="text-sm dark:text-gray-400 text-gray-500">Contributions per day</p>
                <input type="range" min={1} max={10} value={dailyGoal} onChange={e => setDailyGoal(+e.target.value)}
                  className="w-full accent-primary-500" />
                <p className="text-center text-2xl font-bold text-primary-400">{dailyGoal}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm dark:text-gray-400 text-gray-500">Today's progress</span>
                  <span className="text-sm font-bold dark:text-white text-gray-900">{todayCount} / {dailyGoal}</span>
                </div>
                <div className="h-3 dark:bg-gray-700 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
                    style={{ width: `${Math.min(100, (todayCount / dailyGoal) * 100)}%` }} />
                </div>
                <p className="text-xs dark:text-gray-500 text-gray-400 mt-2">
                  {todayCount >= dailyGoal ? '🎉 Goal reached!' : `${dailyGoal - todayCount} more to hit your goal`}
                </p>
              </>
            )}
          </motion.div>

          {/* Contribution Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
            <h3 className="font-bold dark:text-white text-gray-900 mb-4">Contribution Types</h3>
            <div className="space-y-3">
              {CONTRIBUTION_TYPES.map(ct => (
                <div key={ct.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${ct.color}`} />
                  <span className="text-sm dark:text-gray-300 text-gray-600 flex-1">{ct.label}</span>
                  <span className="text-sm font-semibold dark:text-white text-gray-900">{ct.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card">
            <h3 className="font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
              <FiAward className="text-yellow-400" size={16} /> Streak Badges
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {BADGES.map(b => (
                <div key={b.days} className={`p-3 rounded-xl text-center transition-all ${b.earned
                  ? 'dark:bg-yellow-900/20 bg-yellow-50 border dark:border-yellow-500/30 border-yellow-200'
                  : 'dark:bg-gray-800/50 bg-slate-100 opacity-50'}`}>
                  <div className="text-2xl mb-1">{b.emoji}</div>
                  <p className="text-xs font-semibold dark:text-white text-gray-900">{b.label}</p>
                  {b.earned && <p className="text-xs text-green-400 mt-0.5">Earned ✓</p>}
                  {!b.earned && <p className="text-xs dark:text-gray-500 text-gray-400 mt-0.5">{b.days - currentStreak} days to go</p>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Percentile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card mt-6 dark:bg-gradient-to-r dark:from-primary-900/20 dark:to-accent-900/20 border dark:border-primary-500/20">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-extrabold text-gradient">78%</div>
            <div>
              <p className="font-bold dark:text-white text-gray-900">Consistency Percentile</p>
              <p className="text-sm dark:text-gray-400 text-gray-500">More consistent than 78% of Frontend Engineers on the platform</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
