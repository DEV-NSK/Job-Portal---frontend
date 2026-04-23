import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobsAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi'

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship']

export default function CreateJob() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', location: '', type: 'Full-time',
    salary: '', experience: '', category: '', deadline: '',
    skills: [], requirements: []
  })
  const [skillInput, setSkillInput] = useState('')
  const [reqInput, setReqInput] = useState('')
  const [loading, setLoading] = useState(false)

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm(f => ({ ...f, skills: [...f.skills, skillInput.trim()] }))
      setSkillInput('')
    }
  }

  const addReq = () => {
    if (reqInput.trim()) {
      setForm(f => ({ ...f, requirements: [...f.requirements, reqInput.trim()] }))
      setReqInput('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await jobsAPI.create(form)
      toast.success('Job posted successfully!')
      navigate('/employer/jobs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job')
    } finally { setLoading(false) }
  }

  const f = (field) => ({ value: form[field], onChange: e => setForm({ ...form, [field]: e.target.value }) })

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-3xl mx-auto">
        <div className="py-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors mb-4">
            <FiArrowLeft size={16} /> Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Post a New Job</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Basic Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Title *</label>
                <input className="input-field" placeholder="e.g. Senior React Developer" required {...f('title')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location *</label>
                <input className="input-field" placeholder="e.g. New York, NY" required {...f('location')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Type</label>
                <select className="input-field" {...f('type')}>
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Salary Range</label>
                <input className="input-field" placeholder="e.g. $80k - $120k" {...f('salary')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Experience Required</label>
                <input className="input-field" placeholder="e.g. 3-5 years" {...f('experience')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <input className="input-field" placeholder="e.g. Technology" {...f('category')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Application Deadline</label>
                <input type="date" className="input-field" {...f('deadline')} />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Job Description</h2>
            <textarea rows={6} className="input-field resize-none" placeholder="Describe the role, responsibilities, and what you're looking for..." required {...f('description')} />
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Skills</h2>
            <div className="flex gap-2">
              <input className="input-field" placeholder="Add a skill..." value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <button type="button" onClick={addSkill} className="btn-secondary flex items-center gap-1 whitespace-nowrap">
                <FiPlus size={16} /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills.map(s => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-lg border border-slate-200 dark:border-slate-700">
                  {s}
                  <button type="button" onClick={() => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))}
                    className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    <FiX size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Requirements</h2>
            <div className="flex gap-2">
              <input className="input-field" placeholder="Add a requirement..." value={reqInput}
                onChange={e => setReqInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addReq())} />
              <button type="button" onClick={addReq} className="btn-secondary flex items-center gap-1 whitespace-nowrap">
                <FiPlus size={16} /> Add
              </button>
            </div>
            <ul className="space-y-2">
              {form.requirements.map((r, i) => (
                <li key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{r}</span>
                  <button type="button" onClick={() => setForm(f => ({ ...f, requirements: f.requirements.filter((_, j) => j !== i) }))}
                    className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    <FiX size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {loading ? 'Posting...' : 'Post Job'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
