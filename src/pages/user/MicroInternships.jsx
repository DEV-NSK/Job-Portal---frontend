import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { microInternshipAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function MicroInternships() {
  const { user } = useAuth()
  const [internships, setInternships] = useState([])
  const [mySubmissions, setMySubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('browse')
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deliverable, setDeliverable] = useState('')
  const [filterSkill, setFilterSkill] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newInternship, setNewInternship] = useState({
    title: '', description: '', skills: '', durationDays: 3,
    compensation: '', maxCandidates: 5, deliverable: '', rubric: ''
  })

  const load = async () => {
    try {
      const [mktRes, myRes] = await Promise.all([
        microInternshipAPI.getMarketplace(),
        microInternshipAPI.getMy()
      ])
      setInternships(mktRes.data.internships || [])
      setMySubmissions(myRes.data || [])
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const apply = async (id) => {
    try {
      await microInternshipAPI.apply(id)
      toast.success('Applied successfully!')
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to apply') }
  }

  const submitWork = async () => {
    if (!deliverable.trim()) return toast.error('Please enter your deliverable')
    setSubmitting(true)
    try {
      await microInternshipAPI.submit(selected._id, { deliverableText: deliverable })
      toast.success('Work submitted!')
      setSelected(null)
      setDeliverable('')
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit') }
    finally { setSubmitting(false) }
  }

  const createInternship = async () => {
    try {
      await microInternshipAPI.create({
        ...newInternship,
        skills: newInternship.skills.split(',').map(s => s.trim()).filter(Boolean)
      })
      toast.success('Micro-internship posted!')
      setShowCreate(false)
      load()
    } catch { toast.error('Failed to create') }
  }

  const filtered = internships.filter(i =>
    !filterSkill || i.skills?.some(s => s.toLowerCase().includes(filterSkill.toLowerCase()))
  )

  const evalStyles = {
    excellent: 'badge-success', good: 'badge-primary',
    below_expectation: 'badge-danger', pending: 'badge-warning'
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Micro-Internships</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Short tasks to prove your skills and get hired</p>
          </div>
          {user?.role === 'employer' && (
            <button onClick={() => setShowCreate(true)} className="btn-primary">+ Post Task</button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[['browse', '🔍 Browse Tasks'], ['my-tasks', '📋 My Submissions']].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)}
              className={tab === t ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>
              {l}
            </button>
          ))}
        </div>

        {tab === 'browse' && (
          <>
            <input value={filterSkill} onChange={e => setFilterSkill(e.target.value)}
              placeholder="Filter by skill..."
              className="input-field max-w-xs mb-6" />

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-52 rounded-2xl" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="card text-center py-16 text-slate-500">
                <div className="text-4xl mb-3">📋</div>
                <p>No tasks available</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((internship, i) => (
                  <motion.div key={internship._id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }} whileHover={{ y: -2 }}
                    className="card flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{internship.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{internship.recruiter?.name}</p>
                      </div>
                      <span className="badge badge-primary ml-2 flex-shrink-0">{internship.durationDays}d</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex-1 line-clamp-2">{internship.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {internship.skills?.slice(0, 3).map(s => (
                        <span key={s} className="badge badge-primary">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {internship.compensation || 'Unpaid'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {internship.accepted?.length || 0}/{internship.maxCandidates} spots
                      </span>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => setSelected(internship)} className="btn-secondary flex-1 text-sm py-2">
                        Details
                      </button>
                      <button onClick={() => apply(internship._id)} className="btn-primary flex-1 text-sm py-2">
                        Apply
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'my-tasks' && (
          <div className="space-y-3">
            {mySubmissions.length === 0 ? (
              <div className="card text-center py-16 text-slate-500">
                <div className="text-4xl mb-3">📭</div>
                <p>No submissions yet</p>
              </div>
            ) : mySubmissions.map(sub => (
              <div key={sub._id} className="card flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 dark:text-slate-100">{sub.internship?.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {sub.submittedAt ? `Submitted ${new Date(sub.submittedAt).toLocaleDateString()}` : 'Not submitted yet'}
                  </div>
                </div>
                <span className={`badge ${evalStyles[sub.evaluation] || 'badge-warning'}`}>
                  {sub.evaluation === 'pending' ? 'Pending Review' : sub.evaluation?.replace('_', ' ')}
                </span>
                {sub.score > 0 && (
                  <span className="text-sm font-bold text-indigo-500">{sub.score}/100</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="card w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selected.title}</h2>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none">×</button>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">{selected.description}</p>
              {selected.deliverable && (
                <div className="surface p-4 rounded-xl mb-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Deliverable Required</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{selected.deliverable}</p>
                </div>
              )}
              {selected.rubric && (
                <div className="surface p-4 rounded-xl mb-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Evaluation Rubric</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{selected.rubric}</p>
                </div>
              )}
              <div className="mb-4">
                <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">Your Submission</label>
                <textarea value={deliverable} onChange={e => setDeliverable(e.target.value)}
                  placeholder="Paste your code, write your solution, or describe your work..."
                  className="input-field resize-none h-36" />
              </div>
              <div className="flex gap-3">
                <button onClick={submitWork} disabled={submitting} className="btn-primary flex-1 disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Work'}
                </button>
                <button onClick={() => setSelected(null)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Internship Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="card w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Post Micro-Internship</h2>
              <div className="space-y-3">
                <input value={newInternship.title} onChange={e => setNewInternship(p => ({ ...p, title: e.target.value }))}
                  placeholder="Task title" className="input-field" />
                <textarea value={newInternship.description} onChange={e => setNewInternship(p => ({ ...p, description: e.target.value }))}
                  placeholder="Task description" className="input-field h-20 resize-none" />
                <input value={newInternship.skills} onChange={e => setNewInternship(p => ({ ...p, skills: e.target.value }))}
                  placeholder="Required skills (comma-separated)" className="input-field" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Duration: {newInternship.durationDays} days</label>
                    <input type="range" min="1" max="7" value={newInternship.durationDays}
                      onChange={e => setNewInternship(p => ({ ...p, durationDays: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Max Candidates: {newInternship.maxCandidates}</label>
                    <input type="range" min="1" max="10" value={newInternship.maxCandidates}
                      onChange={e => setNewInternship(p => ({ ...p, maxCandidates: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-500" />
                  </div>
                </div>
                <input value={newInternship.compensation} onChange={e => setNewInternship(p => ({ ...p, compensation: e.target.value }))}
                  placeholder="Compensation (e.g. $200, or leave blank for unpaid)" className="input-field" />
                <textarea value={newInternship.deliverable} onChange={e => setNewInternship(p => ({ ...p, deliverable: e.target.value }))}
                  placeholder="Deliverable description" className="input-field h-16 resize-none" />
                <textarea value={newInternship.rubric} onChange={e => setNewInternship(p => ({ ...p, rubric: e.target.value }))}
                  placeholder="Evaluation rubric" className="input-field h-16 resize-none" />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={createInternship} className="btn-primary flex-1">Post Task</button>
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
