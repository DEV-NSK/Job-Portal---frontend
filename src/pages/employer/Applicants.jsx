import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { applicationsAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiMail, FiPhone, FiFileText, FiCheck, FiX, FiEye } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

const statusStyles = {
  pending: 'badge-yellow', reviewed: 'badge-blue',
  accepted: 'badge-green', rejected: 'badge-red'
}

export default function Applicants() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = jobId
      ? applicationsAPI.getJobApps(jobId)
      : import('../../services/api').then(m => m.employerAPI.getApplications())
    fetch.then(res => setApps(res.data)).finally(() => setLoading(false))
  }, [jobId])

  const updateStatus = async (appId, status) => {
    try {
      const res = await applicationsAPI.updateStatus({ applicationId: appId, status })
      setApps(prev => prev.map(a => a._id === appId ? { ...a, status: res.data.status } : a))
      toast.success(`Application ${status}`)
    } catch { toast.error('Failed to update status') }
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="py-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <FiArrowLeft size={16} /> Back
          </button>
          <h1 className="text-3xl font-bold text-white">Applicants</h1>
          <p className="text-gray-400 mt-1">{apps.length} application{apps.length !== 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
        ) : apps.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-white mb-2">No applicants yet</h3>
            <p className="text-gray-400">Applications will appear here once candidates apply</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map(app => (
              <div key={app._id} className="card animate-slide-up">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/30 to-accent-500/30 border border-primary-500/20 flex items-center justify-center font-bold text-lg overflow-hidden flex-shrink-0">
                      {app.applicant?.avatar
                        ? <img src={app.applicant.avatar} alt="" className="w-full h-full object-cover" />
                        : app.applicant?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{app.applicant?.name}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5"><FiMail size={12} />{app.applicant?.email}</span>
                        {app.applicant?.phone && <span className="flex items-center gap-1.5"><FiPhone size={12} />{app.applicant.phone}</span>}
                      </div>
                      {app.job?.title && (
                        <p className="text-xs text-primary-400 mt-1">Applied for: {app.job.title}</p>
                      )}
                      {app.applicant?.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {app.applicant.skills.slice(0, 4).map(s => (
                            <span key={s} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-md border border-gray-700">{s}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-600 mt-2">{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className={`badge text-xs ${statusStyles[app.status]}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <div className="flex items-center gap-2">
                      {app.applicant?.resume && (
                        <a href={app.applicant.resume} target="_blank" rel="noreferrer"
                          className="p-2 rounded-xl text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all" title="View Resume">
                          <FiFileText size={15} />
                        </a>
                      )}
                      {app.status !== 'accepted' && (
                        <button onClick={() => updateStatus(app._id, 'accepted')}
                          className="p-2 rounded-xl text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all" title="Accept">
                          <FiCheck size={15} />
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button onClick={() => updateStatus(app._id, 'rejected')}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Reject">
                          <FiX size={15} />
                        </button>
                      )}
                      {app.status === 'pending' && (
                        <button onClick={() => updateStatus(app._id, 'reviewed')}
                          className="p-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="Mark Reviewed">
                          <FiEye size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {app.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5"><FiFileText size={11} /> Cover Letter</p>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{app.coverLetter}</p>
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
