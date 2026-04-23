import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { employerAPI, jobsAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiEdit2, FiTrash2, FiUsers, FiPlus, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function ManageJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    employerAPI.getJobs().then(res => setJobs(res.data)).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return
    try {
      await jobsAPI.delete(id)
      setJobs(prev => prev.filter(j => j._id !== id))
      toast.success('Job deleted')
    } catch { toast.error('Failed to delete') }
  }

  const handleToggle = async (job) => {
    try {
      const res = await jobsAPI.update(job._id, { isActive: !job.isActive })
      setJobs(prev => prev.map(j => j._id === job._id ? res.data : j))
    } catch { toast.error('Failed to update') }
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-5xl mx-auto">
        <div className="py-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Jobs</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
          </div>
          <Link to="/employer/jobs/create" className="btn-primary flex items-center gap-2">
            <FiPlus size={16} /> Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No jobs posted</h3>
            <Link to="/employer/jobs/create" className="btn-primary inline-flex mt-4">Post Your First Job</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job._id} className="card hover:scale-[1.01] transition-all animate-slide-up">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                      <span className={`badge text-xs ${job.isActive ? 'badge-green' : 'badge-red'}`}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                      <span className="badge-blue text-xs">{job.type}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{job.location} {job.salary && `· ${job.salary}`}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-500">
                      <span className="flex items-center gap-1"><FiUsers size={11} />{job.applicantsCount} applicants</span>
                      <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggle(job)}
                      className={`p-2 rounded-xl transition-all ${job.isActive ? 'text-green-500 hover:bg-green-500/10' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                      title={job.isActive ? 'Deactivate' : 'Activate'}>
                      {job.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                    </button>
                    <Link to={`/employer/applicants/${job._id}`}
                      className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all" title="View Applicants">
                      <FiUsers size={16} />
                    </Link>
                    <Link to={`/employer/jobs/edit/${job._id}`}
                      className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all" title="Edit">
                      <FiEdit2 size={16} />
                    </Link>
                    <button onClick={() => handleDelete(job._id)}
                      className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all" title="Delete">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
