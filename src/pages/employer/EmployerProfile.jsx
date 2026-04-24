import { useState, useEffect } from 'react'
import { userAPI, employerAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiEdit2, FiSave, FiUpload, FiGlobe, FiMapPin, FiUsers, FiCalendar,
  FiBriefcase, FiAward, FiTrendingUp, FiMail, FiPhone, FiLinkedin,
  FiExternalLink, FiHome, FiTarget, FiHeart, FiStar, FiCheckCircle
} from 'react-icons/fi'

export default function EmployerProfile() {
  const { user, updateUser } = useAuth()
  const [data, setData] = useState(null)
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    totalHired: 0,
    averageRating: 0
  })
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Load profile data
    userAPI.getProfile().then(res => {
      setData(res.data)
      setForm({ ...res.data.user, ...(res.data.employer || {}) })
    })
    
    // Load real-time stats
    loadCompanyStats()
  }, [])

  const loadCompanyStats = async () => {
    try {
      // Get employer's jobs
      const jobsRes = await employerAPI.getJobs()
      const jobs = jobsRes.data || []
      
      // Get employer's applications
      const appsRes = await employerAPI.getApplications()
      const applications = appsRes.data || []
      
      // Calculate stats
      const activeJobs = jobs.filter(job => job.status === 'active' || job.status === 'open').length
      const totalApplications = applications.length
      const totalHired = applications.filter(app => app.status === 'hired' || app.status === 'accepted').length
      
      // Calculate average rating (placeholder - you can implement a rating system)
      const averageRating = totalHired > 0 ? Math.min(4.0 + (totalHired / totalApplications) * 1.0, 5.0) : 0
      
      setStats({
        activeJobs,
        totalApplications,
        totalHired,
        averageRating: averageRating.toFixed(1)
      })
    } catch (error) {
      console.error('Error loading company stats:', error)
      // Keep default values on error
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      
      // Add all form fields to FormData, handling different data types properly
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          // Convert objects to JSON strings, but for now we don't have complex objects
          if (typeof v === 'object' && !Array.isArray(v)) {
            fd.append(k, JSON.stringify(v))
          } else if (Array.isArray(v)) {
            fd.append(k, JSON.stringify(v))
          } else {
            fd.append(k, String(v))
          }
        }
      })
      
      if (logoFile) fd.append('avatar', logoFile)
      
      console.log('Sending form data:', Object.fromEntries(fd.entries()))
      
      const res = await userAPI.updateProfile(fd)
      setData(prev => ({ ...prev, user: res.data }))
      updateUser(res.data)
      setEditing(false)
      setLogoFile(null)
      setLogoPreview(null)
      toast.success('Profile updated!')
      
      // Reload the full profile data to get updated employer info
      const profileRes = await userAPI.getProfile()
      setData(profileRes.data)
      
    } catch (error) { 
      console.error('Profile update error:', error)
      toast.error('Failed to update profile') 
    }
    finally { setSaving(false) }
  }

  if (!data) return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-slate-50 dark:bg-[#060912]">
      <div className="w-8 h-8 border-2 border-orange-500 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const { user: profile, employer } = data
  const logoSrc = logoPreview || profile.avatar
  const profileCompletion = calculateCompanyProfileCompletion(employer, profile)

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

        {/* ── Mobile Header ── */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] font-semibold text-orange-600 dark:text-blue-400 uppercase tracking-widest mb-1">Company Profile</div>
              <h1 className="text-[22px] font-bold text-slate-900 dark:text-white">Company Showcase</h1>
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
                <button onClick={() => { setEditing(false); setLogoPreview(null); setLogoFile(null) }} className="btn-secondary text-sm py-2 px-3">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* ── LEFT SIDEBAR (Desktop) / TOP SECTION (Mobile) ── */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Company Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Company Profile</h2>
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
                    <button onClick={() => { setEditing(false); setLogoPreview(null); setLogoFile(null) }} className="btn-secondary text-sm py-2 px-3">
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Company Logo Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center overflow-hidden text-2xl lg:text-3xl font-bold text-white shadow-lg border-4 border-white dark:border-slate-800">
                    {employer?.companyName?.[0]?.toUpperCase() || profile.name?.[0]?.toUpperCase()}
                  </div>
                  {editing && (
                    <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 dark:bg-blue-500 hover:bg-orange-600 dark:hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg">
                      <FiUpload size={14} className="text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                    </label>
                  )}
                </div>
                
                {editing ? (
                  <div className="mt-4 space-y-3">
                    <input 
                      className="input-field text-center font-semibold" 
                      placeholder="Company Name" 
                      value={form.companyName || ''}
                      onChange={e => setForm({ ...form, companyName: e.target.value })} 
                    />
                    <input 
                      className="input-field text-center" 
                      placeholder="Industry (e.g., Technology, Healthcare)" 
                      value={form.industry || ''}
                      onChange={e => setForm({ ...form, industry: e.target.value })} 
                    />
                  </div>
                ) : (
                  <div className="mt-4">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {employer?.companyName || profile.name}
                    </h3>
                    {employer?.industry && (
                      <p className="text-orange-600 dark:text-blue-400 text-sm font-medium">{employer.industry}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Company Details */}
              <div className="space-y-3">
                {editing ? (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Location</label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input className="input-field pl-9" placeholder="City, Country" value={form.location || ''}
                          onChange={e => setForm({ ...form, location: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Company Size</label>
                      <div className="relative">
                        <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input className="input-field pl-9" placeholder="e.g., 50-200 employees" value={form.companySize || ''}
                          onChange={e => setForm({ ...form, companySize: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Website</label>
                      <div className="relative">
                        <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input className="input-field pl-9" placeholder="https://company.com" value={form.website || ''}
                          onChange={e => setForm({ ...form, website: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Founded Year</label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input className="input-field pl-9" placeholder="e.g., 2015" value={form.founded || ''}
                          onChange={e => setForm({ ...form, founded: e.target.value })} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {employer?.location && (
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <FiMapPin size={16} className="text-slate-500 dark:text-slate-500 flex-shrink-0" />
                        <span className="text-sm">{employer.location}</span>
                      </div>
                    )}
                    {employer?.companySize && (
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <FiUsers size={16} className="text-slate-500 dark:text-slate-500 flex-shrink-0" />
                        <span className="text-sm">{employer.companySize} employees</span>
                      </div>
                    )}
                    {employer?.website && (
                      <a href={employer.website} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 text-orange-600 dark:text-blue-400 hover:text-orange-700 dark:hover:text-blue-300 transition-colors group">
                        <FiGlobe size={16} className="flex-shrink-0" />
                        <span className="text-sm">Company Website</span>
                        <FiExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {employer?.founded && (
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <FiCalendar size={16} className="text-slate-500 dark:text-slate-500 flex-shrink-0" />
                        <span className="text-sm">Founded in {employer.founded}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            {/* Profile Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Profile Strength</h3>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-blue-500 dark:to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <div className="space-y-2">
                {getCompanyProfileTips(employer, profile).map((tip, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                    {tip}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Company Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-slate-700">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.activeJobs}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">Active Jobs</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-slate-700">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalApplications}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">Applications</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-slate-700">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalHired}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">Hired</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-slate-700">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.averageRating}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">Rating</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Company Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FiHome size={18} className="text-orange-600 dark:text-blue-400" />
                About Our Company
              </h3>
              {editing ? (
                <div>
                  <textarea 
                    rows={5} 
                    className="input-field resize-none" 
                    placeholder="Describe your company's mission, values, culture, and what makes it a great place to work. Include your company's history, achievements, and future goals..."
                    value={form.description || ''} 
                    onChange={e => setForm({ ...form, description: e.target.value })} 
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Tip: Highlight your company culture, mission, and what makes you unique as an employer.
                  </p>
                </div>
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {employer?.description ? (
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{employer.description}</p>
                  ) : (
                    <div className="text-center py-8 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-300 dark:border-slate-600">
                      <FiHome size={24} className="text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">No company description yet</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Add a compelling description to attract top talent</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Company Culture & Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FiHeart size={18} className="text-orange-600 dark:text-blue-400" />
                Culture & Values
              </h3>
              {editing ? (
                <div>
                  <textarea 
                    rows={4} 
                    className="input-field resize-none" 
                    placeholder="Describe your company culture, values, and what makes your workplace unique. Include information about team collaboration, innovation, growth opportunities, and work environment..."
                    value={form.culture || ''} 
                    onChange={e => setForm({ ...form, culture: e.target.value })} 
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Tip: Highlight what makes your company culture unique and attractive to potential employees.
                  </p>
                </div>
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {employer?.culture ? (
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{employer.culture}</p>
                  ) : (
                    <div className="text-center py-8 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-300 dark:border-slate-600">
                      <FiHeart size={24} className="text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">No culture description yet</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Add information about your company culture and values</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Benefits & Perks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FiStar size={18} className="text-orange-600 dark:text-blue-400" />
                Benefits & Perks
              </h3>
              {editing ? (
                <div>
                  <textarea 
                    rows={3} 
                    className="input-field resize-none" 
                    placeholder="List your company benefits and perks, separated by commas. For example: Health Insurance, Remote Work Options, Professional Development, Flexible Hours, Stock Options..."
                    value={form.benefits || ''} 
                    onChange={e => setForm({ ...form, benefits: e.target.value })} 
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Tip: Separate benefits with commas. Include both standard benefits and unique perks that set you apart.
                  </p>
                </div>
              ) : (
                <div>
                  {employer?.benefits ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {employer.benefits.split(',').map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-slate-700">
                          <FiCheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{benefit.trim()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-300 dark:border-slate-600">
                      <FiStar size={24} className="text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">No benefits listed yet</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Add your company benefits and perks to attract talent</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FiMail size={18} className="text-orange-600 dark:text-blue-400" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FiMail size={16} className="text-slate-500 dark:text-slate-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-3">
                      <FiPhone size={16} className="text-slate-500 dark:text-slate-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{profile.phone}</span>
                    </div>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-orange-600 dark:text-blue-400 hover:text-orange-700 dark:hover:text-blue-300 transition-colors">
                      <FiLinkedin size={16} />
                      <span className="text-sm">LinkedIn Company Page</span>
                      <FiExternalLink size={12} />
                    </a>
                  )}
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">HR Department</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    For job applications and career inquiries, please reach out to our HR team.
                  </p>
                  <button className="btn-primary text-xs py-2 px-3">
                    Contact HR
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function calculateCompanyProfileCompletion(employer, profile) {
  const fields = [
    employer?.companyName,
    employer?.description,
    employer?.industry,
    employer?.location,
    employer?.companySize,
    employer?.website,
    employer?.founded,
    profile?.avatar,
    profile?.email
  ]
  const completed = fields.filter(Boolean).length
  return Math.round((completed / fields.length) * 100)
}

function getCompanyProfileTips(employer, profile) {
  const tips = []
  if (!employer?.description) tips.push('Add company description')
  if (!employer?.industry) tips.push('Specify your industry')
  if (!employer?.companySize) tips.push('Add company size')
  if (!employer?.website) tips.push('Add company website')
  if (!profile?.avatar) tips.push('Upload company logo')
  if (!employer?.founded) tips.push('Add founding year')
  return tips.slice(0, 3) // Show max 3 tips
}