import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { jobsAPI, applicationsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiUsers,
  FiArrowLeft, FiSend, FiCalendar, FiCheck, FiBookmark,
  FiShare2, FiExternalLink
} from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import ShareModal from '../../components/shared/ShareModal'

const typeColors = {
  'Full-time': 'badge-green', 'Part-time': 'badge-yellow',
  'Remote': 'badge-blue', 'Contract': 'badge-purple', 'Internship': 'badge-cyan'
}

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
  const [showShare, setShowShare] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    jobsAPI.getById(id)
      .then(res => {
        console.log('Job data:', res.data);
        console.log('Employer field:', res.data.employer);
        console.log('Employer type:', typeof res.data.employer);
        setJob(res.data);
      })
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
    <div className="fixed inset-0 pt-16 bg-slate-50 dark:bg-[#060912] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!job) return null

  const employerId = typeof job.employer === 'object' ? job.employer._id : job.employer;

  return (
    <div className="fixed inset-0 pt-16 bg-slate-50 dark:bg-[#060912]">
      <div className="h-full max-w-7xl mx-auto px-6 py-4 flex flex-col">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors mb-3"
        >
          <FiArrowLeft size={16} /> Back to jobs
        </button>

        {/* Single Professional Container */}
        <div className="card flex-1 overflow-hidden p-6">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Job Details (2/3) */}
            <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
              
              {/* Job Header */}
              <div className="flex items-start gap-4 pb-4 border-b border-slate-200 dark:border-[#1e2d3d] flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
                  {job.companyLogo
                    ? <img src={job.companyLogo} alt="" className="w-full h-full object-cover" />
                    : <span className="text-white font-bold text-2xl">{job.companyName?.[0]}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 truncate">{job.title}</h1>
                      <Link 
                        to={`/company/${employerId}`}
                        className="text-orange-600 dark:text-blue-400 hover:text-orange-700 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1.5 transition-colors"
                      >
                        {job.companyName}
                        <FiExternalLink size={14} />
                      </Link>
                    </div>
                    <span className={`badge ${typeColors[job.type] || 'badge-blue'} flex-shrink-0`}>{job.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5"><FiMapPin size={14} />{job.location}</span>
                    {job.salary && <span className="flex items-center gap-1.5"><FiDollarSign size={14} />{job.salary}</span>}
                    {job.experience && <span className="flex items-center gap-1.5"><FiBriefcase size={14} />{job.experience}</span>}
                    <span className="flex items-center gap-1.5"><FiUsers size={14} />{job.applicantsCount || 0} applicants</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {job.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 py-3 border-b border-slate-200 dark:border-[#1e2d3d] flex-shrink-0">
                  {job.skills.slice(0, 8).map(s => (
                    <span key={s} className="px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-[#1e2d3d]">
                      {s}
                    </span>
                  ))}
                  {job.skills.length > 8 && <span className="text-sm text-slate-500">+{job.skills.length - 8} more</span>}
                </div>
              )}

              {/* Job Description & Requirements - NO SCROLLING */}
              <div className="flex-1 py-4 space-y-4 min-h-0">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Job Description</h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">{job.description}</p>
                </div>

                {job.requirements?.length > 0 && (
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Requirements</h2>
                    <ul className="space-y-1.5">
                      {job.requirements.slice(0, 4).map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <FiCheck size={16} className="text-orange-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{r}</span>
                        </li>
                      ))}
                      {job.requirements.length > 4 && (
                        <li className="text-sm text-slate-500 dark:text-slate-500 ml-6">+{job.requirements.length - 4} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Apply Button - Always Visible */}
              <div className="pt-4 border-t border-slate-200 dark:border-[#1e2d3d] flex-shrink-0">
                {applied ? (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                    <FiCheck size={18} />
                    Application submitted successfully
                  </div>
                ) : user?.role === 'user' ? (
                  !showApply ? (
                    <button onClick={() => setShowApply(true)} className="btn-primary gap-2">
                      <FiSend size={16} /> Apply Now
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        rows={2}
                        placeholder="Cover letter (optional)..."
                        className="input-field resize-none text-sm"
                        value={coverLetter}
                        onChange={e => setCoverLetter(e.target.value)}
                      />
                      <div className="flex gap-3">
                        <button onClick={handleApply} disabled={applying} className="btn-primary gap-2">
                          {applying ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSend size={16} />}
                          {applying ? 'Submitting...' : 'Submit Application'}
                        </button>
                        <button onClick={() => setShowApply(false)} className="btn-secondary">Cancel</button>
                      </div>
                    </div>
                  )
                ) : !user ? (
                  <button onClick={() => navigate('/login')} className="btn-primary gap-2">
                    Sign in to Apply
                  </button>
                ) : null}
              </div>
            </div>

            {/* Right Column - Sidebar (1/3) - NO SCROLLING */}
            <div className="flex flex-col gap-4 h-full">
              
              {/* Job Overview */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-[#1e2d3d]">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Job Overview</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Job Type', value: job.type, icon: FiBriefcase },
                    { label: 'Location', value: job.location, icon: FiMapPin },
                    { label: 'Salary', value: job.salary || 'Not specified', icon: FiDollarSign },
                    { label: 'Experience', value: job.experience || 'Not specified', icon: FiUsers },
                    { label: 'Category', value: job.category || 'General', icon: FiBriefcase },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-[#1e2d3d] last:border-0">
                      <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Icon size={14} className="text-slate-400" />
                        {label}
                      </span>
                      <span className="text-sm text-slate-900 dark:text-slate-200 font-medium truncate ml-2">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-blue-500/5 dark:to-blue-600/5 border border-orange-200 dark:border-blue-500/20">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">About Company</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
                    {job.companyLogo
                      ? <img src={job.companyLogo} alt="" className="w-full h-full object-cover" />
                      : <span className="text-white font-bold text-xl">{job.companyName?.[0]}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-slate-900 dark:text-white truncate">{job.companyName}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 truncate">{job.location}</div>
                  </div>
                </div>
                <Link 
                  to={`/company/${employerId}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  <FiExternalLink size={16} />
                  View Company Profile
                </Link>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setBookmarked(b => !b); toast.success(bookmarked ? 'Removed from saved' : 'Job saved!') }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border ${
                    bookmarked
                      ? 'bg-orange-50 dark:bg-blue-500/15 text-orange-600 dark:text-blue-400 border-orange-200 dark:border-blue-500/30'
                      : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1e2d3d] hover:border-orange-300 dark:hover:border-blue-500/40'
                  }`}
                >
                  <FiBookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
                  {bookmarked ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={() => setShowShare(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1e2d3d] hover:border-orange-300 dark:hover:border-blue-500/40 transition-all"
                >
                  <FiShare2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} job={job} />
    </div>
  )
}




