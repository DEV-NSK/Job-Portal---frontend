import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiTrash2, FiSearch, FiMapPin, FiUsers, FiCalendar } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function AdminManageJobs() {
  const [jobs, setJobs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    adminAPI.getJobs().then(res => { setJobs(res.data); setFiltered(res.data) }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!search) { setFiltered(jobs); return }
    setFiltered(jobs.filter(j =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName.toLowerCase().includes(search.toLowerCase())
    ))
  }, [search, jobs])

  const handleDelete = async (id) => {
    if (!confirm('Delete this job post?')) return
    try {
      const { jobsAPI } = await import('../../services/api')
      await jobsAPI.delete(id)
      setJobs(prev => prev.filter(j => j._id !== id))
      toast.success('Job deleted')
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-6xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Jobs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{filtered.length} of {jobs.length} jobs</p>
        </div>

        <div className="relative mb-6">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
          <input className="input-field pl-10" placeholder="Search jobs..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No jobs found</h3>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(job => (
              <div key={job._id} className="card flex items-start justify-between gap-4 flex-wrap hover:scale-[1.005] transition-all animate-slide-up">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/20 flex items-center justify-center font-bold flex-shrink-0 overflow-hidden">
                    {job.companyLogo ? <img src={job.companyLogo} alt="" className="w-full h-full object-cover" /> : job.companyName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{job.title}</p>
                      <span className={`badge text-xs ${job.isActive ? 'badge-green' : 'badge-red'}`}>{job.isActive ? 'Active' : 'Closed'}</span>
                      <span className="badge-blue text-xs">{job.type}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">{job.companyName}</p>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-500">
                      <span className="flex items-center gap-1"><FiMapPin size={11} />{job.location}</span>
                      <span className="flex items-center gap-1"><FiUsers size={11} />{job.applicantsCount} applicants</span>
                      <span className="flex items-center gap-1"><FiCalendar size={11} />{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                      {job.employer && <span className="text-slate-500 dark:text-slate-600">by {job.employer.name}</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(job._id)}
                  className="p-2.5 rounded-xl text-slate-500 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex-shrink-0">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
