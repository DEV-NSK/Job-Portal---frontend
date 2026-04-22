import { useState, useEffect } from 'react'
import { userAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiEdit2, FiSave, FiUpload, FiMapPin, FiPhone,
  FiLinkedin, FiGithub, FiX, FiFileText, FiUser,
  FiCheck, FiExternalLink
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
      setProfile(res.data.user)
      setForm(res.data.user)
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
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) fd.append(k, v.join(','))
        else if (v !== undefined && v !== null) fd.append(k, v)
      })
      if (avatarFile) fd.append('avatar', avatarFile)
      const res = await userAPI.updateProfile(fd)
      setProfile(res.data)
      updateUser({ ...user, ...res.data })
      setEditing(false)
      setAvatarFile(null)
      setAvatarPreview(null)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update profile') }
    finally { setSaving(false) }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('resume', file)
    try {
      const res = await userAPI.uploadResume(fd)
      setProfile(prev => ({ ...prev, resume: res.data.resume }))
      toast.success('Resume uploaded!')
    } catch { toast.error('Failed to upload resume') }
  }

  if (!profile) return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-slate-50 dark:bg-[#060912]">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const avatarSrc = avatarPreview || profile.avatar

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-[12px] font-semibold text-indigo-400 uppercase tracking-widest mb-1">Account</div>
            <h1 className="text-[26px] font-bold text-slate-900 dark:text-white">My Profile</h1>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-secondary gap-2">
              <FiEdit2 size={14} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary gap-2">
                {saving
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <FiSave size={14} />}
                Save changes
              </button>
              <button onClick={() => { setEditing(false); setAvatarPreview(null); setAvatarFile(null) }} className="btn-secondary">
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* ── Profile card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-5"
        >
          <div className="flex items-start gap-6 flex-wrap">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden text-2xl font-bold text-white">
                {avatarSrc
                  ? <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                  : profile.name?.[0]?.toUpperCase()}
              </div>
              {editing && (
                <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg">
                  <FiUpload size={12} className="text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Full Name</label>
                    <input className="input-field" placeholder="Full Name" value={form.name || ''}
                      onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Location</label>
                    <input className="input-field" placeholder="City, Country" value={form.location || ''}
                      onChange={e => setForm({ ...form, location: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Phone</label>
                    <input className="input-field" placeholder="+1 (555) 000-0000" value={form.phone || ''}
                      onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1.5">LinkedIn</label>
                    <input className="input-field" placeholder="linkedin.com/in/..." value={form.linkedin || ''}
                      onChange={e => setForm({ ...form, linkedin: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-400 mb-1.5">GitHub</label>
                    <input className="input-field" placeholder="github.com/..." value={form.github || ''}
                      onChange={e => setForm({ ...form, github: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[12px] font-medium text-slate-400 mb-1.5">Bio</label>
                    <textarea rows={3} className="input-field resize-none" placeholder="Tell us about yourself..."
                      value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-[22px] font-bold text-white mb-1">{profile.name}</h2>
                  <p className="text-[14px] text-slate-400 mb-4 leading-relaxed">{profile.bio || 'No bio added yet.'}</p>
                  <div className="flex flex-wrap gap-4 text-[13px] text-slate-500">
                    {profile.location && (
                      <span className="flex items-center gap-1.5">
                        <FiMapPin size={13} className="text-slate-600" /> {profile.location}
                      </span>
                    )}
                    {profile.phone && (
                      <span className="flex items-center gap-1.5">
                        <FiPhone size={13} className="text-slate-600" /> {profile.phone}
                      </span>
                    )}
                    {profile.linkedin && (
                      <a href={profile.linkedin} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors">
                        <FiLinkedin size={13} /> LinkedIn <FiExternalLink size={11} />
                      </a>
                    )}
                    {profile.github && (
                      <a href={profile.github} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors">
                        <FiGithub size={13} /> GitHub <FiExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Skills ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-5"
        >
          <h3 className="text-[15px] font-semibold text-white mb-4">Skills</h3>
          {editing ? (
            <div>
              <input
                className="input-field"
                placeholder="React, Node.js, Python, TypeScript..."
                value={Array.isArray(form.skills) ? form.skills.join(', ') : form.skills || ''}
                onChange={e => setForm({ ...form, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              />
              <p className="text-[12px] text-slate-600 mt-2">Separate skills with commas</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills?.length > 0
                ? profile.skills.map(s => (
                    <span key={s} className="px-3 py-1.5 text-[13px] font-medium text-slate-700 dark:text-slate-300 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-[#1e2d3d]">
                      {s}
                    </span>
                  ))
                : <p className="text-[13px] text-slate-600">No skills added yet.</p>
              }
            </div>
          )}
        </motion.div>

        {/* ── Resume ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-slate-800 dark:text-white">Resume</h3>
            <label className="btn-secondary text-[13px] py-2 px-4 cursor-pointer gap-2">
              <FiUpload size={13} /> Upload
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
            </label>
          </div>

          {profile.resume ? (
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl transition-all group border border-slate-200 dark:border-[#1e2d3d] bg-slate-50 dark:bg-white/[0.02] hover:border-indigo-300 dark:hover:border-indigo-500/30"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <FiFileText size={18} className="text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-slate-200 group-hover:text-indigo-400 transition-colors">Resume.pdf</p>
                <p className="text-[12px] text-slate-600">Click to view</p>
              </div>
              <FiExternalLink size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
            </a>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-[#1e2d3d]">
              <FiFileText size={24} className="text-slate-700 mb-3" />
              <p className="text-[14px] font-medium text-slate-500 mb-1">No resume uploaded</p>
              <p className="text-[12px] text-slate-700">Upload a PDF or Word document</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}



