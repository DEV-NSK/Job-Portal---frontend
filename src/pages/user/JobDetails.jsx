import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobsAPI, applicationsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiUsers, FiArrowLeft, FiSend, FiCalendar } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function JobDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [showApply, setShowApply] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    jobsAPI.getById(id)
      .then(res => setJob(res.data))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async () => {
    if (!user) return navigate('/login')
    setApplying(true)
    try {
      await applicationsAPI.apply({ jobId: id, coverLetter })
      setApplied(true)
      setShowApply(false)
      toast.success('Application submitted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply')
    } finally { setApplying(false) }
  }

  if (loading) return (
    <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </div>
  )

  if (!job) return null

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mt-6 mb-6">
          <FiArrowLeft size={16} /> Back to Jobs
        </button>

        <div className="card mb-6 animate-slide-up">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600/30 to-accent-600/30 border border-primary-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {job.companyLogo
                  ? <img src={job.companyLogo} alt="" className="w-full h-full object-cover" />
                  : <span className="text-primary-400 font-bold text-2xl">{job.companyName?.[0]}</span>}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                <p className="text-primary-400 font-medium mt-1">{job.companyName}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5"><FiMapPin size={13} />{job.location}</span>
                  {job.salary && <span className="flex items-center gap-1.5"><FiDollarSign size={13} />{job.salary}</span>}
                  {job.experience && <span className="flex items-center gap-1.5"><FiBriefcase size={13} />{job.experience}</span>}
                  <span className="flex items-center gap-1.5"><FiUsers size={13} />{job.applicantsCount} applicants</span>
                  <span className="flex items-center gap-1.5"><FiClock size={13} />{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span className="badge-blue">{job.type}</span>
              {job.deadline && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <FiCalendar size={12} /> Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {job.skills?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {job.skills.map(s => (
                <span key={s} className="px-3 py-1.5 bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700">{s}</span>
              ))}
            </div>
          )}

          <div className="mt-6">
            {applied ? (
              <div className="flex items-center gap-2 text-green-400 font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full" /> Application Submitted
              </div>
            ) : user?.role === 'user' ? (
              !showApply ? (
                <button onClick={() => setShowApply(true)} className="btn-primary flex items-center gap-2">
                  <FiSend size={16} /> Apply Now
                </button>
              ) : (
                <div className="space-y-3 animate-slide-up">
                  <textarea rows={4} placeholder="Write a cover letter (optional)..."
                    className="input-field resize-none"
                    value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
                  <div className="flex gap-3">
                    <button onClick={handleApply} disabled={applying} className="btn-primary flex items-center gap-2">
                      {applying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSend size={16} />}
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button onClick={() => setShowApply(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              )
            ) : !user ? (
              <button onClick={() => navigate('/login')} className="btn-primary">Login to Apply</button>
            ) : null}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-4">Job Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
            {job.requirements?.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <span className="text-primary-400 mt-1">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-white mb-3">Job Overview</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Job Type', value: job.type },
                  { label: 'Location', value: job.location },
                  { label: 'Salary', value: job.salary || 'Not specified' },
                  { label: 'Experience', value: job.experience || 'Not specified' },
                  { label: 'Category', value: job.category || 'General' }
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-gray-300 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
