import { useState, useEffect } from 'react'
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiUsers, FiShare2, FiBookmark, FiExternalLink } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { jobsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import ShareModal from './ShareModal'

const typeColors = {
  'Full-time': 'badge-green',
  'Part-time': 'badge-yellow',
  'Remote': 'badge-blue',
  'Contract': 'badge-purple',
  'Internship': 'badge-cyan',
}

export default function JobCard({ job, index = 0, viewMode = 'grid' }) {
  const { user } = useAuth()
  const [showShare, setShowShare] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  useEffect(() => {
    setIsBookmarked(job.isBookmarked || false)
  }, [job.isBookmarked])

  const handleBookmark = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      toast.error('Please login to bookmark jobs')
      return
    }

    setBookmarkLoading(true)
    try {
      if (isBookmarked) {
        await jobsAPI.unbookmark(job._id)
        setIsBookmarked(false)
        toast.success('Job removed from bookmarks')
      } else {
        await jobsAPI.bookmark(job._id)
        setIsBookmarked(true)
        toast.success('Job bookmarked successfully')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update bookmark')
    } finally {
      setBookmarkLoading(false)
    }
  }

  if (viewMode === 'list') {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
          className="group"
        >
          <Link to={`/jobs/${job._id}`} className="card card-hover block p-6">
            <div className="flex items-center gap-6">
              {/* Company Logo */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 dark:from-blue-500/10 dark:to-blue-600/10 border border-orange-200 dark:border-blue-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:border-orange-300 dark:group-hover:border-blue-400 transition-colors">
                {job.companyLogo
                  ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                  : <span className="text-orange-600 dark:text-blue-400 font-bold text-xl">{job.companyName?.[0]}</span>}
              </div>

              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h3>
                    <Link 
                      to={`/company/${typeof job.employer === 'object' ? job.employer._id : job.employer}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-600 dark:text-slate-400 font-medium hover:text-orange-600 dark:hover:text-blue-400 transition-colors inline-block"
                    >
                      {job.companyName}
                    </Link>
                  </div>
                  <span className={`badge ${typeColors[job.type] || 'badge-blue'} flex-shrink-0`}>{job.type}</span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5"><FiMapPin size={14} /> {job.location}</span>
                  {job.salary && <span className="flex items-center gap-1.5"><FiDollarSign size={14} /> {job.salary}</span>}
                  {job.experience && <span className="flex items-center gap-1.5"><FiBriefcase size={14} /> {job.experience}</span>}
                </div>

                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.slice(0, 6).map(s => (
                      <span key={s} className="px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        {s}
                      </span>
                    ))}
                    {job.skills.length > 6 && <span className="px-3 py-1 text-xs text-slate-400">+{job.skills.length - 6}</span>}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><FiUsers size={12} /> {job.applicantsCount || 0} applicants</span>
                    <span className="flex items-center gap-1"><FiClock size={12} /> {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBookmark}
                      disabled={bookmarkLoading}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isBookmarked 
                          ? 'text-orange-600 dark:text-blue-400 bg-orange-50 dark:bg-blue-500/10' 
                          : 'text-slate-400 hover:text-orange-600 dark:hover:text-blue-400 hover:bg-orange-50 dark:hover:bg-blue-500/10'
                      } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {bookmarkLoading ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiBookmark size={14} className={isBookmarked ? 'fill-current' : ''} />
                      )}
                    </button>
                    <button
                      onClick={e => { e.preventDefault(); e.stopPropagation(); setShowShare(true) }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-orange-600 dark:hover:text-blue-400 hover:bg-orange-50 dark:hover:bg-blue-500/10 transition-all"
                    >
                      <FiShare2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
        <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} job={job} />
      </>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.5 }}
        className="h-full"
      >
        <Link to={`/jobs/${job._id}`} className="card card-hover group block h-full">
          <div className="flex flex-col h-full p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 dark:from-blue-500/10 dark:to-blue-600/10 border border-orange-200 dark:border-blue-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:border-orange-300 dark:group-hover:border-blue-400 transition-all duration-300 group-hover:scale-105">
                  {job.companyLogo
                    ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                    : <span className="text-orange-600 dark:text-blue-400 font-bold text-lg">{job.companyName?.[0]}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight mb-1">
                    {job.title}
                  </h3>
                  <Link 
                    to={`/company/${typeof job.employer === 'object' ? job.employer._id : job.employer}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-slate-600 dark:text-slate-400 font-medium truncate hover:text-orange-600 dark:hover:text-blue-400 transition-colors inline-block"
                  >
                    {job.companyName}
                  </Link>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`badge ${typeColors[job.type] || 'badge-blue'} text-xs`}>{job.type}</span>
                <button
                  onClick={handleBookmark}
                  disabled={bookmarkLoading}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isBookmarked 
                      ? 'text-orange-600 dark:text-blue-400 bg-orange-50 dark:bg-blue-500/10' 
                      : 'text-slate-400 hover:text-orange-600 dark:hover:text-blue-400 hover:bg-orange-50 dark:hover:bg-blue-500/10 opacity-0 group-hover:opacity-100'
                  } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {bookmarkLoading ? (
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiBookmark size={14} className={isBookmarked ? 'fill-current' : ''} />
                  )}
                </button>
              </div>
            </div>

            {/* Job Details - Fixed height section */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Meta Information */}
              <div className="grid grid-cols-1 gap-2 text-sm text-slate-500 dark:text-slate-500 mb-4">
                <div className="flex items-center gap-2">
                  <FiMapPin size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <FiDollarSign size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{job.salary}</span>
                  </div>
                )}
                {job.experience && (
                  <div className="flex items-center gap-2">
                    <FiBriefcase size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{job.experience}</span>
                  </div>
                )}
              </div>

              {/* Skills - Fixed height with overflow handling */}
              <div className="mb-4 h-16 overflow-hidden">
                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 4).map(s => (
                      <span key={s} className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 truncate">
                        {s}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="px-2.5 py-1 text-xs text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
                        +{job.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Footer - Always at bottom */}
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiUsers size={11} /> {job.applicantsCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock size={11} /> {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={e => { e.preventDefault(); e.stopPropagation(); setShowShare(true) }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-orange-600 dark:hover:text-blue-400 hover:bg-orange-50 dark:hover:bg-blue-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <FiShare2 size={12} />
                    </button>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-orange-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                      <FiExternalLink size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} job={job} />
    </>
  )
}
