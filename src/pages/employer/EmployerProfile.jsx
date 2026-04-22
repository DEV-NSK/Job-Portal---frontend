import { useState, useEffect } from 'react'
import { userAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FiEdit2, FiSave, FiUpload, FiGlobe, FiMapPin, FiUsers, FiCalendar } from 'react-icons/fi'

export default function EmployerProfile() {
  const { user, updateUser } = useAuth()
  const [data, setData] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [logoFile, setLogoFile] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    userAPI.getProfile().then(res => {
      setData(res.data)
      setForm({ ...res.data.user, ...(res.data.employer || {}) })
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null && typeof v !== 'object') fd.append(k, v)
      })
      if (logoFile) fd.append('avatar', logoFile)
      const res = await userAPI.updateProfile(fd)
      setData(prev => ({ ...prev, user: res.data }))
      updateUser({ ...user, ...res.data })
      setEditing(false)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update') }
    finally { setSaving(false) }
  }

  if (!data) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const { user: profile, employer } = data

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="py-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Company Profile</h1>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2">
              <FiEdit2 size={16} /> Edit
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

        <div className="card mb-6 animate-slide-up">
          <div className="flex items-start gap-6 flex-wrap">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center overflow-hidden text-3xl font-bold text-white border border-primary-500/30">
                {profile.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : employer?.companyName?.[0]?.toUpperCase() || profile.name?.[0]?.toUpperCase()}
              </div>
              {editing && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-500 transition-colors">
                  <FiUpload size={14} className="text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={e => setLogoFile(e.target.files[0])} />
                </label>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className="input-field" placeholder="Company Name" value={form.companyName || ''} onChange={e => setForm({ ...form, companyName: e.target.value })} />
                  <input className="input-field" placeholder="Industry" value={form.industry || ''} onChange={e => setForm({ ...form, industry: e.target.value })} />
                  <input className="input-field" placeholder="Company Size (e.g. 50-200)" value={form.companySize || ''} onChange={e => setForm({ ...form, companySize: e.target.value })} />
                  <input className="input-field" placeholder="Website URL" value={form.website || ''} onChange={e => setForm({ ...form, website: e.target.value })} />
                  <input className="input-field" placeholder="Location" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} />
                  <input className="input-field" placeholder="Founded Year" value={form.founded || ''} onChange={e => setForm({ ...form, founded: e.target.value })} />
                  <textarea rows={3} className="input-field sm:col-span-2 resize-none" placeholder="Company Description" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white">{employer?.companyName || profile.name}</h2>
                  {employer?.industry && <p className="text-primary-400 mt-1">{employer.industry}</p>}
                  {employer?.description && <p className="text-gray-400 mt-2 text-sm">{employer.description}</p>}
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                    {employer?.location && <span className="flex items-center gap-1.5"><FiMapPin size={13} />{employer.location}</span>}
                    {employer?.companySize && <span className="flex items-center gap-1.5"><FiUsers size={13} />{employer.companySize} employees</span>}
                    {employer?.website && <a href={employer.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300"><FiGlobe size={13} />Website</a>}
                    {employer?.founded && <span className="flex items-center gap-1.5"><FiCalendar size={13} />Founded {employer.founded}</span>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
