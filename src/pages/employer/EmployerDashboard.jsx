import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { employerAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { FiBriefcase, FiUsers, FiEye, FiPlus, FiTrendingUp, FiClock } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function EmployerDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([employerAPI.getJobs(), employerAPI.getApplications()])
      .then(([j, a]) => { setJobs(j.data); setApps(a.data) })
      .finally(() => setLoading(false))
  }, [])

  const activeJobs = jobs.filter(j => j.isActive).length
  const pendingApps = apps.filter(a => a.status === 'pending').length

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: FiBriefcase, color: 'from-primary-600/20 to-primary-600/10', border: 'border-primary-500/20', text: 'text-primary-400' },
    { label: 'Active Jobs', value: activeJobs, icon: FiTrendingUp, color: 'from-green-600/20 to-green-600/10', border: 'border-green-500/20', text: 'text-green-400' },
    { label: 'Applications', value: apps.length, icon: FiUsers, color: 'from-accent-600/20 to-accent-600/10', border: 'border-accent-500/20', text: 'text-accent-400' },
    { label: 'Pending Review', value: pendingApps, icon: FiClock, color: 'from-yellow-600/20 to-yellow-600/10', border: 'border-yellow-500/20', text: 'text-yellow-400' }
  ]

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="py-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Employer Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
          </div>
          <Link to="/employer/jobs/create" className="btn-primary flex items-center gap-2">
            <FiPlus size={16} /> Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, border, text }) => (
            <div key={label} className={`card bg-gradient-to-br ${color} border ${border} hover:scale-105 transition-all`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gray-900/50 flex items-center justify-center ${text}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{loading ? '—' : value}</div>
                  <div className="text-gray-400 text-xs">{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Recent Job Posts</h2>
              <Link to="/employer/jobs" className="text-primary-400 text-sm hover:text-primary-300">View all →</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No jobs posted yet</p>
                <Link to="/employer/jobs/create" className="btn-primary text-sm">Post First Job</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 5).map(job => (
                  <div key={job._id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all">
                    <div>
                      <p className="font-medium text-white text-sm">{job.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-gray-400"><FiUsers size={11} />{job.applicantsCount}</span>
                      <span className={`badge text-xs ${job.isActive ? 'badge-green' : 'badge-red'}`}>{job.isActive ? 'Active' : 'Closed'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Recent Applications</h2>
              <Link to="/employer/applicants" className="text-primary-400 text-sm hover:text-primary-300">View all →</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
            ) : apps.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {apps.slice(0, 5).map(app => (
                  <div key={app._id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/50 to-accent-500/50 flex items-center justify-center text-xs font-bold overflow-hidden">
                        {app.applicant?.avatar ? <img src={app.applicant.avatar} alt="" className="w-full h-full object-cover" /> : app.applicant?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{app.applicant?.name}</p>
                        <p className="text-gray-500 text-xs">{app.job?.title}</p>
                      </div>
                    </div>
                    <span className={`badge text-xs ${app.status === 'pending' ? 'badge-yellow' : app.status === 'accepted' ? 'badge-green' : app.status === 'rejected' ? 'badge-red' : 'badge-blue'}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
