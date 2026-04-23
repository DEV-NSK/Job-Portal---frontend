import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { jobsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const FEATURES = [
  { icon: '📊', title: 'Hiring Funnel', desc: 'Real-time pipeline visualization', key: 'funnel', color: 'from-blue-500/20 to-blue-600/5', iconBg: 'bg-blue-500/10 border-blue-500/20', iconColor: 'text-blue-500' },
  { icon: '🏆', title: 'Candidate Ranking', desc: 'AI-powered applicant scoring', key: 'ranking', color: 'from-purple-500/20 to-purple-600/5', iconBg: 'bg-purple-500/10 border-purple-500/20', iconColor: 'text-purple-500' },
  { icon: '🤖', title: 'Auto Shortlist', desc: 'One-click AI shortlisting', key: 'shortlist', color: 'from-indigo-500/20 to-indigo-600/5', iconBg: 'bg-indigo-500/10 border-indigo-500/20', iconColor: 'text-indigo-500' },
  { icon: '📅', title: 'Candidate Timeline', desc: 'Full hiring journey view', key: 'timeline', color: 'from-teal-500/20 to-teal-600/5', iconBg: 'bg-teal-500/10 border-teal-500/20', iconColor: 'text-teal-500' },
  { icon: '🔒', title: 'Blind Hiring', desc: 'Remove unconscious bias', key: 'blind-hiring', color: 'from-orange-500/20 to-orange-600/5', iconBg: 'bg-orange-500/10 border-orange-500/20', iconColor: 'text-orange-500' },
  { icon: '🎯', title: 'Skill Matching', desc: 'Find candidates by skills', key: 'skill-match', color: 'from-green-500/20 to-green-600/5', iconBg: 'bg-green-500/10 border-green-500/20', iconColor: 'text-green-500', noJob: true },
  { icon: '⚡', title: 'Dynamic Jobs', desc: 'Job health & visibility tiers', key: 'job-health', color: 'from-yellow-500/20 to-yellow-600/5', iconBg: 'bg-yellow-500/10 border-yellow-500/20', iconColor: 'text-yellow-500', noJob: true },
  { icon: '🗂', title: 'Talent Pools', desc: 'Private candidate database', key: 'talent-pools', color: 'from-pink-500/20 to-pink-600/5', iconBg: 'bg-pink-500/10 border-pink-500/20', iconColor: 'text-pink-500', noJob: true }
]

export default function RecruiterDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFeature, setSelectedFeature] = useState(null)

  useEffect(() => {
    jobsAPI.getAll()
      .then(res => setJobs(res.data?.jobs || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    totalJobs: jobs.length,
    totalApplicants: jobs.reduce((s, j) => s + (j.applicantsCount || 0), 0),
    shortlisted: Math.floor(jobs.reduce((s, j) => s + (j.applicantsCount || 0), 0) * 0.15)
  }

  const handleFeatureClick = (feature) => {
    if (feature.noJob) {
      navigate(`/employer/${feature.key}`)
    } else {
      setSelectedFeature(feature)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2">Recruiter Super Dashboard</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Hiring Tools</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Active Jobs', value: stats.totalJobs, icon: '💼', color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
            { label: 'Total Applicants', value: stats.totalApplicants, icon: '👥', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Shortlisted', value: stats.shortlisted, icon: '⭐', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' }
          ].map(stat => (
            <div key={stat.label} className="stat-card">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.bg} text-xl mb-3`}>{stat.icon}</div>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">AI Recruiter Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }}
                onClick={() => handleFeatureClick(f)}
                className={`card card-hover bg-gradient-to-br ${f.color} border-0 cursor-pointer group`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${f.iconBg} text-xl mb-3 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">{f.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{f.desc}</div>
                {!f.noJob && (
                  <div className="text-xs text-indigo-500 dark:text-indigo-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Select a job →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Job Picker Modal (for job-specific features) */}
        {selectedFeature && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedFeature(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onClick={e => e.stopPropagation()}
              className="card w-full max-w-md max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedFeature.icon} {selectedFeature.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Select a job to continue</p>
                </div>
                <button onClick={() => setSelectedFeature(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none">×</button>
              </div>
              {loading ? (
                <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="mb-3">No jobs posted yet</p>
                  <Link to="/employer/jobs/create" className="btn-primary text-sm">Post a Job</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {jobs.map(job => (
                    <button key={job._id}
                      onClick={() => { navigate(`/employer/${selectedFeature.key}/${job._id}`); setSelectedFeature(null) }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-left border border-slate-200 dark:border-[#1e2d3d] hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold text-sm flex-shrink-0">
                        {job.title?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">{job.title}</div>
                        <div className="text-xs text-slate-500">{job.applicantsCount || 0} applicants · {job.isActive ? 'Active' : 'Closed'}</div>
                      </div>
                      <span className="text-slate-400 text-sm">→</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Recent Jobs Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Your Job Postings</h2>
              <p className="text-xs text-slate-500 mt-0.5">{jobs.length} total</p>
            </div>
            <Link to="/employer/jobs" className="text-sm text-indigo-500 hover:text-indigo-400 transition-colors">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <p className="mb-3">No jobs posted yet</p>
              <Link to="/employer/jobs/create" className="btn-primary text-sm">Post First Job</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.slice(0, 6).map(job => (
                <div key={job._id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-[#1e2d3d] bg-slate-50 dark:bg-white/[0.02] hover:border-slate-200 dark:hover:border-[#2d3f55] transition-all">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold text-sm flex-shrink-0">
                    {job.title?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{job.title}</div>
                    <div className="text-xs text-slate-500">{job.applicantsCount || 0} applicants</div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {['funnel', 'ranking', 'shortlist'].map(key => (
                      <button key={key} onClick={() => navigate(`/employer/${key}/${job._id}`)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#1e2d3d] text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all capitalize">
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
