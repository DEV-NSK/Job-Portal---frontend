import { useState, useEffect } from 'react'
import { userAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FiEdit2, FiSave, FiUpload, FiUser, FiMapPin, FiPhone, FiLinkedin, FiGithub } from 'react-icons/fi'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [avatarFile, setAvatarFile] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    userAPI.getProfile().then(res => {
      setProfile(res.data.user)
      setForm(res.data.user)
    })
  }, [])

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
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="py-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">My Profile</h1>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2">
              <FiEdit2 size={16} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave size={16} />}
                Save
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
            </div>
          )}
        </div>

        {/* Avatar & Basic Info */}
        <div className="card mb-6 animate-slide-up">
          <div className="flex items-start gap-6 flex-wrap">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center overflow-hidden text-3xl font-bold text-white">
                {profile.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : profile.name?.[0]?.toUpperCase()}
              </div>
              {editing && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-500 transition-colors">
                  <FiUpload size={14} className="text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={e => setAvatarFile(e.target.files[0])} />
                </label>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="input-field" placeholder="Full Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <input className="input-field" placeholder="Location" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} />
                  <input className="input-field" placeholder="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  <input className="input-field" placeholder="LinkedIn URL" value={form.linkedin || ''} onChange={e => setForm({ ...form, linkedin: e.target.value })} />
                  <input className="input-field sm:col-span-2" placeholder="GitHub URL" value={form.github || ''} onChange={e => setForm({ ...form, github: e.target.value })} />
                  <textarea rows={3} className="input-field sm:col-span-2 resize-none" placeholder="Bio" value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold dark:text-white text-gray-900">{profile.name}</h2>
                  <p className="dark:text-gray-400 text-gray-500 mt-1">{profile.bio || 'No bio added'}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm dark:text-gray-400 text-gray-500">
                    {profile.location && <span className="flex items-center gap-1.5"><FiMapPin size={13} />{profile.location}</span>}
                    {profile.phone && <span className="flex items-center gap-1.5"><FiPhone size={13} />{profile.phone}</span>}
                    {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300"><FiLinkedin size={13} />LinkedIn</a>}
                    {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300"><FiGithub size={13} />GitHub</a>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card mb-6">
          <h3 className="font-semibold dark:text-white text-gray-900 mb-4">Skills</h3>
          {editing ? (
            <input className="input-field" placeholder="Skills (comma separated)" value={Array.isArray(form.skills) ? form.skills.join(', ') : form.skills || ''}
              onChange={e => setForm({ ...form, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills?.length > 0
                ? profile.skills.map(s => <span key={s} className="px-3 py-1.5 dark:bg-gray-800 bg-slate-100 dark:text-gray-300 text-gray-700 text-sm rounded-lg dark:border-gray-700 border border-slate-200">{s}</span>)
                : <p className="dark:text-gray-500 text-gray-400 text-sm">No skills added</p>}
            </div>
          )}
        </div>

        {/* Resume */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold dark:text-white text-gray-900">Resume</h3>
            <label className="btn-secondary flex items-center gap-2 cursor-pointer text-sm py-2">
              <FiUpload size={14} /> Upload Resume
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
            </label>
          </div>
          {profile.resume ? (
            <a href={profile.resume} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 p-4 dark:bg-gray-800/50 bg-slate-50 rounded-xl dark:border-gray-700 border border-slate-200 dark:hover:border-primary-500/50 hover:border-primary-400 transition-all group">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-red-400 text-xs font-bold">PDF</span>
              </div>
              <div>
                <p className="dark:text-white text-gray-900 text-sm font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">View Resume</p>
                <p className="dark:text-gray-500 text-gray-400 text-xs">Click to open</p>
              </div>
            </a>
          ) : (
            <p className="dark:text-gray-500 text-gray-400 text-sm">No resume uploaded</p>
          )}
        </div>
      </div>
    </div>
  )
}
