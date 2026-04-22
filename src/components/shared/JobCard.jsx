import { FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiUsers } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

const typeColors = {
  'Full-time': 'badge-green', 'Part-time': 'badge-yellow',
  'Remote': 'badge-blue', 'Contract': 'badge-purple', 'Internship': 'badge-red'
}

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`}
      className="card group hover:scale-[1.02] hover:glow block animate-slide-up">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600/30 to-accent-600/30 border border-primary-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {job.companyLogo
              ? <img src={job.companyLogo} alt="" className="w-full h-full object-cover rounded-xl" />
              : <span className="text-primary-400 font-bold text-lg">{job.companyName?.[0]}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">{job.title}</h3>
            <p className="text-gray-400 text-sm mt-0.5">{job.companyName}</p>
          </div>
        </div>
        <span className={typeColors[job.type] || 'badge-blue'}>{job.type}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-400">
        <span className="flex items-center gap-1.5"><FiMapPin size={13} />{job.location}</span>
        {job.salary && <span className="flex items-center gap-1.5"><FiDollarSign size={13} />{job.salary}</span>}
        {job.experience && <span className="flex items-center gap-1.5"><FiBriefcase size={13} />{job.experience}</span>}
        <span className="flex items-center gap-1.5 ml-auto"><FiClock size={13} />{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map(s => (
            <span key={s} className="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg border border-gray-700">{s}</span>
          ))}
          {job.skills.length > 4 && <span className="px-2.5 py-1 text-gray-500 text-xs">+{job.skills.length - 4}</span>}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><FiUsers size={12} />{job.applicantsCount} applicants</span>
        <span className="text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">View Details →</span>
      </div>
    </Link>
  )
}
