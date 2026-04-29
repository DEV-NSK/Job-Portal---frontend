import { useState, useEffect } from 'react'
import { userAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiEdit2, FiSave, FiUpload, FiMapPin, FiPhone, FiMail,
  FiLinkedin, FiGithub, FiX, FiFileText, FiUser,
  FiCheck, FiExternalLink, FiPlus, FiDownload, FiBriefcase,
  FiCalendar, FiBook, FiAward, FiStar
} from 'react-icons/fi'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    userAPI.getProfile().then(res => {
      const userData = res.data.user
      setProfile(userData)
      setForm({
        ...userData,
        experience: userData.experience || [],
        education: userData.education || [],
        skillsText: Array.isArray(userData.skills) ? userData.skills.join(', ') : ''
      })
    })
  }, [])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const fd = new FormData()

      // Only send editable fields — never send system/read-only fields
      const EDITABLE_FIELDS = ['name', 'bio', 'location', 'phone', 'linkedin', 'github']

      EDITABLE_FIELDS.forEach(k => {
        const v = form[k]
        if (v !== undefined && v !== null) fd.append(k, v)
      })

      // Skills: process from skillsText or skills array
      const skills = form.skillsText
        ? form.skillsText.split(',').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(form.skills) ? form.skills : [])
      fd.append('skills', skills.join(','))

      // JSON fields
      fd.append('experience', JSON.stringify(form.experience || []))
      fd.append('education', JSON.stringify(form.education || []))

      // Avatar file (only if a new one was selected)
      if (avatarFile) fd.append('avatar', avatarFile)

      const res = await userAPI.updateProfile(fd)

      setProfile(res.data)
      updateUser(res.data)
      setEditing(false)
      setAvatarFile(null)
      setAvatarPreview(null)

      setForm(prev => ({
        ...prev,
        skillsText: Array.isArray(res.data.skills) ? res.data.skills.join(', ') : ''
      }))

      toast.success('Profile updated!')
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const fd = new FormData()
    fd.append('resume', file)
    
    try {
      const res = await userAPI.uploadResume(fd)
      console.log('Resume upload response:', res.data) // Debug log
      
      // The backend returns the user object directly
      const updatedUser = res.data
      setProfile(updatedUser)
      updateUser(updatedUser)
      
      toast.success('Resume uploaded successfully!')
    } catch (error) { 
      console.error('Resume upload error:', error)
      toast.error('Failed to upload resume') 
    }
  }

  if (!profile) return (
    <div className="h-screen pt-16 flex items-center justify-center bg-slate-50 dark:bg-[#060912]">
      <div className="w-8 h-8 border-2 border-orange-500 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const avatarSrc = avatarPreview || profile.avatar
  const profileCompletion = calculateProfileCompletion(profile)

  const getResumeUrl = (resumePath) => {
    if (!resumePath) return null
    if (resumePath.startsWith('http://') || resumePath.startsWith('https://')) return resumePath
    const backendUrl = import.meta.env.VITE_BACKEND_URL || ''
    return `${backendUrl}${resumePath}`
  }

  return (
    <div className="h-screen pt-16 bg-slate-50 dark:bg-[#060912] overflow-hidden">
      <div className="h-full max-w-7xl mx-auto px-4 py-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-semibold text-orange-600 dark:text-blue-400 uppercase tracking-widest mb-1">My Profile</div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Professional Profile</h1>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-secondary gap-2 text-sm py-2 px-3">
              <FiEdit2 size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary gap-2 text-sm py-2 px-3">
                {saving ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave size={14} />}
                Save
              </button>
              <button onClick={() => { setEditing(false); setAvatarPreview(null); setAvatarFile(null) }} className="btn-secondary text-sm py-2 px-3">
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="h-[calc(100%-5rem)] grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-3 overflow-y-auto">
            
            {/* Profile Card */}
            <div className="card p-4">
              {/* Avatar */}
              <div className="text-center mb-4">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center overflow-hidden text-xl font-bold text-white shadow-lg">
                    {profile.name?.[0]?.toUpperCase()}
                  </div>
                  {editing && (
                    <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 dark:bg-blue-500 hover:bg-orange-600 dark:hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg">
                      <FiUpload size={12} className="text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  )}
                </div>
                
                {editing ? (
                  <input 
                    className="input-field text-center font-semibold text-sm mt-3" 
                    placeholder="Full Name" 
                    value={form.name || ''}
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                  />
                ) : (
                  <div className="mt-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{profile.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">{profile.email}</p>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                {editing ? (
                  <>
                    <input className="input-field text-xs" placeholder="Location" value={form.location || ''}
                      onChange={e => setForm({ ...form, location: e.target.value })} />
                    <input className="input-field text-xs" placeholder="Phone" value={form.phone || ''}
                      onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <input className="input-field text-xs" placeholder="LinkedIn URL" value={form.linkedin || ''}
                      onChange={e => setForm({ ...form, linkedin: e.target.value })} />
                    <input className="input-field text-xs" placeholder="GitHub URL" value={form.github || ''}
                      onChange={e => setForm({ ...form, github: e.target.value })} />
                  </>
                ) : (
                  <>
                    {profile.location && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <FiMapPin size={12} />
                        <span className="text-xs">{profile.location}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <FiPhone size={12} />
                        <span className="text-xs">{profile.phone}</span>
                      </div>
                    )}
                    {profile.linkedin && (
                      <a href={ensureHttps(profile.linkedin)} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-orange-600 dark:text-blue-400 hover:text-orange-700 dark:hover:text-blue-300 transition-colors">
                        <FiLinkedin size={12} />
                        <span className="text-xs">LinkedIn</span>
                      </a>
                    )}
                    {profile.github && (
                      <a href={ensureHttps(profile.github)} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-orange-600 dark:text-blue-400 hover:text-orange-700 dark:hover:text-blue-300 transition-colors">
                        <FiGithub size={12} />
                        <span className="text-xs">GitHub</span>
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="card p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Profile Strength</h3>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-blue-500 dark:to-blue-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>

            {/* Resume Section */}
            <div className="card p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Resume</h3>
                <label className="btn-secondary text-xs py-1 px-2 cursor-pointer gap-1">
                  <FiUpload size={10} /> Upload
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
                </label>
              </div>

              {profile.resume ? (
                <a
                  href={getResumeUrl(profile.resume)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg transition-all group border border-slate-200 dark:border-[#1e2d3d] bg-slate-50 dark:bg-white/[0.02] hover:border-orange-300 dark:hover:border-blue-500/40"
                >
                  <FiFileText size={12} className="text-red-600 dark:text-red-400" />
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-200 flex-1">Resume.pdf</span>
                  <FiExternalLink size={10} className="text-slate-400" />
                </a>
              ) : (
                <div className="text-center py-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-300 dark:border-slate-600">
                  <FiFileText size={14} className="text-slate-400 dark:text-slate-500 mx-auto mb-1" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">No resume uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-3 overflow-y-auto">
            
            {/* About Section */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <FiUser size={14} className="text-orange-600 dark:text-blue-400" />
                About Me
              </h3>
              {editing ? (
                <textarea 
                  rows={3} 
                  className="input-field resize-none text-xs" 
                  placeholder="Write a compelling professional summary..."
                  value={form.bio || ''} 
                  onChange={e => setForm({ ...form, bio: e.target.value })} 
                />
              ) : (
                profile.bio ? (
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{profile.bio}</p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-500 italic">No bio added yet</p>
                )
              )}
            </div>

            {/* Skills Section */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <FiAward size={14} className="text-orange-600 dark:text-blue-400" />
                Skills & Expertise
              </h3>
              {editing ? (
                <div>
                  <textarea
                    rows={2}
                    className="input-field resize-none text-xs"
                    placeholder="React, Node.js, Python, TypeScript..."
                    value={typeof form.skillsText === 'string' ? form.skillsText : (Array.isArray(form.skills) ? form.skills.join(', ') : form.skills || '')}
                    onChange={e => setForm({ ...form, skillsText: e.target.value })}
                    onBlur={e => {
                      const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      setForm({ ...form, skills: skillsArray, skillsText: e.target.value })
                    }}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Separate skills with commas. Press Tab or click outside to save.
                  </p>
                </div>
              ) : (
                profile.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 rounded bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-[#1e2d3d]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-500 italic">No skills added yet</p>
                )
              )}
            </div>

            {/* Experience & Education Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              
              {/* Experience Section */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <FiBriefcase size={14} className="text-orange-600 dark:text-blue-400" />
                    Work Experience
                  </h3>
                  {editing && (
                    <button
                      onClick={() => {
                        const newExp = { title: '', company: '', duration: '', description: '' }
                        setForm({ ...form, experience: [...(form.experience || []), newExp] })
                      }}
                      className="btn-secondary text-xs py-1 px-2 gap-1"
                    >
                      <FiPlus size={10} /> Add
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {(form.experience || []).map((exp, i) => (
                      <div key={i} className="p-2 rounded bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">#{i + 1}</span>
                          <button
                            onClick={() => {
                              const newExp = form.experience.filter((_, idx) => idx !== i)
                              setForm({ ...form, experience: newExp })
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                        <input
                          className="input-field text-xs"
                          placeholder="Job Title"
                          value={exp.title || ''}
                          onChange={e => {
                            const newExp = [...form.experience]
                            newExp[i] = { ...newExp[i], title: e.target.value }
                            setForm({ ...form, experience: newExp })
                          }}
                        />
                        <input
                          className="input-field text-xs"
                          placeholder="Company"
                          value={exp.company || ''}
                          onChange={e => {
                            const newExp = [...form.experience]
                            newExp[i] = { ...newExp[i], company: e.target.value }
                            setForm({ ...form, experience: newExp })
                          }}
                        />
                        <input
                          className="input-field text-xs"
                          placeholder="Duration"
                          value={exp.duration || ''}
                          onChange={e => {
                            const newExp = [...form.experience]
                            newExp[i] = { ...newExp[i], duration: e.target.value }
                            setForm({ ...form, experience: newExp })
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {profile.experience?.length > 0 ? (
                      profile.experience.map((exp, i) => (
                        <div key={i} className="border-l-2 border-orange-200 dark:border-blue-500/30 pl-2">
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{exp.title}</h4>
                          <p className="text-orange-600 dark:text-blue-400 text-xs">{exp.company}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">{exp.duration}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-500 italic">No experience added yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Education Section */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <FiBook size={14} className="text-orange-600 dark:text-blue-400" />
                    Education
                  </h3>
                  {editing && (
                    <button
                      onClick={() => {
                        const newEdu = { degree: '', institution: '', year: '' }
                        setForm({ ...form, education: [...(form.education || []), newEdu] })
                      }}
                      className="btn-secondary text-xs py-1 px-2 gap-1"
                    >
                      <FiPlus size={10} /> Add
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {(form.education || []).map((edu, i) => (
                      <div key={i} className="p-2 rounded bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">#{i + 1}</span>
                          <button
                            onClick={() => {
                              const newEdu = form.education.filter((_, idx) => idx !== i)
                              setForm({ ...form, education: newEdu })
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                        <input
                          className="input-field text-xs"
                          placeholder="Degree"
                          value={edu.degree || ''}
                          onChange={e => {
                            const newEdu = [...form.education]
                            newEdu[i] = { ...newEdu[i], degree: e.target.value }
                            setForm({ ...form, education: newEdu })
                          }}
                        />
                        <input
                          className="input-field text-xs"
                          placeholder="Institution"
                          value={edu.institution || ''}
                          onChange={e => {
                            const newEdu = [...form.education]
                            newEdu[i] = { ...newEdu[i], institution: e.target.value }
                            setForm({ ...form, education: newEdu })
                          }}
                        />
                        <input
                          className="input-field text-xs"
                          placeholder="Year"
                          value={edu.year || ''}
                          onChange={e => {
                            const newEdu = [...form.education]
                            newEdu[i] = { ...newEdu[i], year: e.target.value }
                            setForm({ ...form, education: newEdu })
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {profile.education?.length > 0 ? (
                      profile.education.map((edu, i) => (
                        <div key={i} className="border-l-2 border-orange-200 dark:border-blue-500/30 pl-2">
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{edu.degree}</h4>
                          <p className="text-orange-600 dark:text-blue-400 text-xs">{edu.institution}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">{edu.year}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-500 italic">No education added yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function ensureHttps(url) {
  if (!url) return ''
  // If URL already has a protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // Otherwise, add https://
  return `https://${url}`
}

function calculateProfileCompletion(profile) {
  const fields = [
    profile.name,
    profile.bio,
    profile.location,
    profile.phone,
    profile.skills?.length > 0,
    profile.resume,
    profile.linkedin || profile.github,
    profile.experience?.length > 0,
    profile.education?.length > 0
  ]
  const completed = fields.filter(Boolean).length
  return Math.round((completed / fields.length) * 100)
}

function getProfileTips(profile) {
  const tips = []
  if (!profile.bio) tips.push('Add a professional bio')
  if (!profile.skills?.length) tips.push('Add your skills')
  if (!profile.resume) tips.push('Upload your resume')
  if (!profile.location) tips.push('Add your location')
  if (!profile.linkedin && !profile.github) tips.push('Add social profiles')
  if (!profile.experience?.length) tips.push('Add work experience')
  return tips.slice(0, 3)
}