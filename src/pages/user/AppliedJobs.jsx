import { useState, useEffect } from 'react'
import { applicationsAPI } from '../../services/api'
import { FiMapPin, FiBriefcase, FiClock, FiFileText } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'

const statusStyles = {
  pending: 'badge-yellow', reviewed: 'badge-blue',
  accepted: 'badge-green', rejected: 'badge-red'
}

export default function AppliedJobs() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    applicationsAPI.getUserApps()
      .then(res => setApps(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto space-y-4">
      {[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-white">Applied Jobs</h1>
          <p className="text-gray-400 mt-1">{apps.length} application{apps.length !== 1 ? 's' : ''}</p>
        </div>

        {apps.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
            <p className="text-gray-400 mb-6">Start applying to jobs to track them here</p>
            <Link to="/jobs" className="btn-primary inline-flex">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map(app => (
              <div key={app._id} className="card hover:scale-[1.01] transition-all animate-slide-up">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600/30 to-accent-600/30 border border-primary-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {app.job?.companyLogo
                        ? <img src={app.job.companyLogo} alt="" className="w-full h-full object-cover" />
                        : <span className="text-primary-400 font-bold">{app.job?.companyName?.[0]}</span>}
                    </div>
                    <div>
                      <Link to={`/jobs/${app.job?._id}`} className="font-semibold text-white hover:text-primary-400 transition-colors">
                        {app.job?.title}
                      </Link>
                      <p className="text-gray-400 text-sm">{app.job?.companyName}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><FiMapPin size={11} />{app.job?.location}</span>
                        <span className="flex items-center gap-1"><FiBriefcase size={11} />{app.job?.type}</span>
                        <span className="flex items-center gap-1"><FiClock size={11} />{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <span className={statusStyles[app.status] || 'badge-yellow'}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
                {app.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2"><FiFileText size={12} /> Cover Letter</div>
                    <p className="text-gray-400 text-sm line-clamp-2">{app.coverLetter}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
