import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { candidateTimelineAPI } from '../../services/api'
import toast from 'react-hot-toast'

const EVENT_ICONS = {
  application_submitted: '📄', profile_viewed: '👁', assessment_assigned: '📝',
  assessment_completed: '💻', interview_scheduled: '📅', interview_completed: '🎙',
  feedback_given: '💬', offer_extended: '✉️', offer_accepted: '✅',
  offer_declined: '❌', hired: '🎉', rejected: '❌', recruiter_note: '📌', stage_changed: '🔄'
}

const EVENT_BORDER = {
  application_submitted: 'border-indigo-400', interview_scheduled: 'border-teal-400',
  interview_completed: 'border-teal-400', offer_extended: 'border-emerald-400',
  hired: 'border-emerald-400', rejected: 'border-red-400',
  recruiter_note: 'border-amber-400', stage_changed: 'border-purple-400'
}

export default function CandidateTimelineView() {
  const { appId } = useParams()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [filterType, setFilterType] = useState('all')

  const load = async () => {
    try {
      const res = await candidateTimelineAPI.getTimeline(appId)
      setEvents(res.data)
    } catch { toast.error('Failed to load timeline') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [appId])

  const addNote = async () => {
    if (!noteText.trim()) return
    try {
      await candidateTimelineAPI.addNote(appId, noteText)
      setNoteText('')
      setAddingNote(false)
      toast.success('Note added')
      load()
    } catch { toast.error('Failed to add note') }
  }

  const filtered = filterType === 'all' ? events : events.filter(e => e.eventType === filterType)

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4 transition-colors">← Back</button>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Candidate Timeline</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Complete hiring journey</p>
          </div>
          <div className="flex gap-2">
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input-field text-sm w-auto">
              <option value="all">All Events</option>
              <option value="interview_scheduled">Interviews</option>
              <option value="recruiter_note">Notes</option>
              <option value="stage_changed">Stage Changes</option>
            </select>
            <button onClick={() => setAddingNote(true)} className="btn-primary text-sm">+ Note</button>
          </div>
        </div>

        {addingNote && (
          <div className="card border-amber-300 dark:border-amber-500/40 mb-6">
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
              placeholder="Add a recruiter note..."
              className="input-field resize-none h-24 mb-3" />
            <div className="flex gap-2">
              <button onClick={addNote} className="btn-primary text-sm">Save Note</button>
              <button onClick={() => setAddingNote(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-12 text-slate-500">No events yet</div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 dark:bg-[#1e2d3d]" />
            <div className="space-y-4">
              {filtered.map((event, i) => (
                <motion.div key={event._id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-[#0d1117] border-2 border-slate-200 dark:border-[#1e2d3d] flex items-center justify-center text-lg flex-shrink-0 z-10">
                    {EVENT_ICONS[event.eventType] || '📋'}
                  </div>
                  <div className={`flex-1 card border-l-4 ${EVENT_BORDER[event.eventType] || 'border-slate-300 dark:border-slate-600'} rounded-l-none py-3 px-4`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 capitalize">
                        {event.eventType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-slate-400">{new Date(event.createdAt).toLocaleString()}</span>
                    </div>
                    {event.actor && (
                      <div className="text-xs text-slate-500 mb-1">by {event.actor.name} ({event.actorRole})</div>
                    )}
                    {event.details?.content && <p className="text-sm text-slate-600 dark:text-slate-300">{event.details.content}</p>}
                    {event.details?.from && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">{event.details.from} → {event.details.to}</p>
                    )}
                    {event.isRecruiterOnly && (
                      <span className="badge badge-warning mt-1">Recruiter Only</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
