import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { userAPI } from '../services/api'
import { motion } from 'framer-motion'
import {
  FiArrowLeft, FiMapPin, FiPhone, FiMail, FiLinkedin, FiGithub,
  FiFileText, FiUser, FiExternalLink, FiBriefcase, FiBook, FiAward
} from 'react-icons/fi'

export default function CandidateProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userAPI.getProfile(userId)
      .then(res => setProfile(res.data.user))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false))
  }, [userId, navigate])

  if (loading) return (
    <div className="h-screen pt-16 flex items-center justify-center bg-slate-50 dark:bg-[#060912]">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!profile) return null

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-6">
          <FiArrowLeft size={15} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Profile Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              {/* Avatar */}
              <div className="text-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden text-2xl font-bold text-white shadow-lg mx-auto">
                  {profile.name?.[0]?.toUpperCase()}
                </div>
                
                <div className="mt-4">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">{profile.name}</h1>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{profile.email}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-[#1e2d3d]">
                {profile.location && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <FiMapPin size={14} />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <FiPhone size={14} />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                    <FiLinkedin size={14} />
                    <span className="text-sm">LinkedIn Profile</span>
                    <FiExternalLink size={12} className="ml-auto" />
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                    <FiGithub size={14} />
                    <span className="text-sm">GitHub Profile</span>
                    <FiExternalLink size={12} className="ml-auto" />
                  </a>
                )}
              </div>
            </motion.div>

            {/* Resume Section */}
            {profile.resume && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-4"
              >
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Resume</h3>
                <a
                  href={profile.resume?.startsWith('http') ? profile.resume : `${import.meta.env.VITE_BACKEND_URL || ''}${profile.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg transition-all group border border-slate-200 dark:border-[#1e2d3d] bg-slate-50 dark:bg-white/[0.02] hover:border-indigo-300 dark:hover:border-indigo-500/40"
                >
                  <FiFileText size={16} className="text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-200 flex-1">View Resume</span>
                  <FiExternalLink size={14} className="text-slate-400" />
                </a>
              </motion.div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* About Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="card p-6"
            >
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FiUser size={16} className="text-indigo-600 dark:text-indigo-400" />
                About
              </h3>
              {profile.bio ? (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{profile.bio}</p>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-500 italic">No bio available</p>
              )}
            </motion.div>

            {/* Skills Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FiAward size={16} className="text-indigo-600 dark:text-indigo-400" />
                Skills & Expertise
              </h3>
              {profile.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-[#1e2d3d]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-500 italic">No skills listed</p>
              )}
            </motion.div>

            {/* Experience & Education Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Experience Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="card p-6"
              >
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiBriefcase size={16} className="text-indigo-600 dark:text-indigo-400" />
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {profile.experience?.length > 0 ? (
                    profile.experience.map((exp, i) => (
                      <div key={i} className="border-l-2 border-indigo-200 dark:border-indigo-500/30 pl-3">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{exp.title}</h4>
                        <p className="text-indigo-600 dark:text-indigo-400 text-sm">{exp.company}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">{exp.duration}</p>
                        {exp.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{exp.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-500 italic">No experience listed</p>
                  )}
                </div>
              </motion.div>

              {/* Education Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiBook size={16} className="text-indigo-600 dark:text-indigo-400" />
                  Education
                </h3>
                <div className="space-y-4">
                  {profile.education?.length > 0 ? (
                    profile.education.map((edu, i) => (
                      <div key={i} className="border-l-2 border-indigo-200 dark:border-indigo-500/30 pl-3">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{edu.degree}</h4>
                        <p className="text-indigo-600 dark:text-indigo-400 text-sm">{edu.institution}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">{edu.year}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-500 italic">No education listed</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
