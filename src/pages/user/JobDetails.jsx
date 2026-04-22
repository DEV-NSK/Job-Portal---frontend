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
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <div className="skeleton h-8 w-32 rounded-lg" />
        <div className="skeleton h-48 rounded-2xl" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 skeleton h-64 rounded-2xl" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  )

  if (!job) return null

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Back ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-300 transition-colors mb-6"
        >
          <FiArrowLeft size={15} /> Back to jobs
        </button>

        {/* ── Job header card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Left: company + title */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {job.companyLogo
                  ? <img src={job.companyLogo} alt="" className="w-full h-full object-cover" />
                  : <span className="text-indigo-400 font-bold text-2xl">{job.companyName?.[0]}</span>}
              </div>
              <div>
                <h1 className="text-[22px] font-bold text-white mb-1">{job.title}</h1>
                <p className="text-indigo-400 font-medium text-[15px] mb-3">{job.companyName}</p>
                <div className="flex flex-wrap gap-4 text-[13px] text-slate-500">
                  <span className="flex items-center gap-1.5"><FiMapPin size={13} />{job.location}</span>
                  {job.salary && <span className="flex items-center gap-1.5"><FiDollarSign size={13} />{job.salary}</span>}
                  {job.experience && <span className="flex items-center gap-1.5"><FiBriefcase size={13} />{job.experience}</span>}
                  <span className="flex items-center gap-1.5"><FiUsers size={13} />{job.applicantsCount || 0} applicants</span>
                  <span className="flex items-center gap-1.5"><FiClock size={13} />{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Right: badge + actions */}
            <div className="flex flex-col items-end gap-3">
              <span className={`badge ${typeColors[job.type] || 'badge-blue'}`}>{job.type}</span>
              {job.deadline && (
                <span className="flex items-center gap-1.5 text-[12px] text-slate-600">
                  <FiCalendar size={12} /> Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>
              )}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => { setBookmarked(b => !b); toast.success(bookmarked ? 'Removed from saved' : 'Job saved!') }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
                    bookmarked
                      ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border-slate-200 dark:border-[#1e2d3d]'
                  }`}
                  title={bookmarked ? 'Remove bookmark' : 'Save job'}
                >
                  <FiBookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
                </motion.button>

                <motion.button
                  onClick={() => setShowShare(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-slate-200 dark:border-[#1e2d3d] hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all"
                  title="Share this job"
                >
                  <FiShare2 size={15} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="mt-5 pt-5 border-t border-[#1e2d3d] flex flex-wrap gap-2">
              {job.skills.map(s => (
                <span key={s} className="px-3 py-1.5 text-[13px] font-medium text-slate-700 dark:text-slate-300 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-[#1e2d3d]">
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Apply section */}
          <div className="mt-5 pt-5 border-t border-[#1e2d3d]">
            {applied ? (
              <div className="flex items-center gap-2 text-emerald-400 font-medium text-[14px]">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <FiCheck size={12} />
                </div>
                Application submitted successfully
              </div>
            ) : user?.role === 'user' ? (
              !showApply ? (
                <button onClick={() => setShowApply(true)} className="btn-primary gap-2">
                  <FiSend size={15} /> Apply Now
                </button>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-[13px] font-medium text-slate-300 mb-2">Cover Letter <span className="text-slate-600">(optional)</span></label>
                      <textarea
                        rows={4}
                        placeholder="Tell the employer why you're a great fit..."
                        className="input-field resize-none"
                        value={coverLetter}
                        onChange={e => setCoverLetter(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleApply} disabled={applying} className="btn-primary gap-2">
                        {applying
                          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <FiSend size={15} />}
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </button>
                      <button onClick={() => setShowApply(false)} className="btn-secondary">Cancel</button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )
            ) : !user ? (
              <button onClick={() => navigate('/login')} className="btn-primary gap-2">
                Sign in to Apply
              </button>
            ) : null}
          </div>
        </motion.div>

        {/* ── Content grid ── */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h2 className="text-[16px] font-semibold text-white mb-4">Job Description</h2>
              <p className="text-[14px] text-slate-400 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </motion.div>

            {job.requirements?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="card"
              >
                <h2 className="text-[16px] font-semibold text-white mb-4">Requirements</h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-slate-400">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FiCheck size={10} className="text-indigo-400" />
                      </div>
                      {r}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-5"
          >
            <div className="card">
              <h3 className="text-[15px] font-semibold text-white mb-4">Job Overview</h3>
              <div className="space-y-3">
                {[
                  { label: 'Job Type', value: job.type },
                  { label: 'Location', value: job.location },
                  { label: 'Salary', value: job.salary || 'Not specified' },
                  { label: 'Experience', value: job.experience || 'Not specified' },
                  { label: 'Category', value: job.category || 'General' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-[#1e2d3d] last:border-0">
                    <span className="text-[13px] text-slate-600">{label}</span>
                    <span className="text-[13px] text-slate-300 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Company card */}
            <div className="card">
              <h3 className="text-[15px] font-semibold text-white mb-4">About Company</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center overflow-hidden">
                  {job.companyLogo
                    ? <img src={job.companyLogo} alt="" className="w-full h-full object-cover" />
                    : <span className="text-indigo-400 font-bold">{job.companyName?.[0]}</span>}
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">{job.companyName}</div>
                  <div className="text-[12px] text-slate-600">{job.location}</div>
                </div>
              </div>
              <Link to={`/jobs?company=${job.companyName}`}
                className="flex items-center gap-1.5 text-[13px] text-indigo-400 hover:text-indigo-300 transition-colors">
                View all jobs <FiExternalLink size={12} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        job={job}
      />
    </div>
  )
}




