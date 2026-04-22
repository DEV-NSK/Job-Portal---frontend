import { useState } from 'react'
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiUsers, FiShare2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import ShareModal from './ShareModal'

const typeColors = {
  'Full-time': 'badge-green',
  'Part-time': 'badge-yellow',
  'Remote': 'badge-blue',
  'Contract': 'badge-purple',
  'Internship': 'badge-cyan',
}

export default function JobCard({ job, index = 0 }) {
  const [showShare, setShowShare] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4 }}
      >
        <Link to={`/jobs/${job._id}`} className="card card-hover group block">

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/15 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:border-indigo-500/30 transition-colors">
                {job.companyLogo
                  ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                  : <span className="text-indigo-500 dark:text-indigo-400 font-bold text-[16px]">{job.companyName?.[0]}</span>}
              </div>
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate leading-snug">
                  {job.title}
                </h3>
                <p className="text-[13px] text-slate-500 mt-0.5">{job.companyName}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`badge ${typeColors[job.type] || 'badge-blue'}`}>{job.type}</span>
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all opacity-0 group-hover:opacity-100"
                onClick={e => { e.preventDefault(); e.stopPropagation(); setShowShare(true) }}
                title="Share this job"
              >
                <FiShare2 size={13} />
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 text-[12.5px] text-slate-500 dark:text-slate-600 mb-4">
            <span className="flex items-center gap-1.5"><FiMapPin size={12} className="text-slate-400 dark:text-slate-700" /> {job.location}</span>
            {job.salary && <span className="flex items-center gap-1.5"><FiDollarSign size={12} className="text-slate-400 dark:text-slate-700" /> {job.salary}</span>}
            {job.experience && <span className="flex items-center gap-1.5"><FiBriefcase size={12} className="text-slate-400 dark:text-slate-700" /> {job.experience}</span>}
          </div>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.skills.slice(0, 4).map(s => (
                <span key={s} className="px-2.5 py-1 text-[11.5px] font-medium text-slate-600 dark:text-slate-500 rounded-lg bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-[#1e2d3d]">
                  {s}
                </span>
              ))}
              {job.skills.length > 4 && <span className="px-2.5 py-1 text-[11.5px] text-slate-400 dark:text-slate-700">+{job.skills.length - 4}</span>}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#1e2d3d]">
            <span className="flex items-center gap-1.5 text-[12px] text-slate-400 dark:text-slate-700">
              <FiUsers size={11} /> {job.applicantsCount || 0} applicants
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-slate-400 dark:text-slate-700">
              <FiClock size={11} /> {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </span>
          </div>
        </Link>
      </motion.div>

      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} job={job} />
    </>
  )
}
