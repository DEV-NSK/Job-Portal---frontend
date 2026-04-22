import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiCode, FiAward, FiChevronRight, FiX, FiCheck, FiTerminal } from 'react-icons/fi'
import { mockProjects } from '../../data/mockData'
import Editor from '@monaco-editor/react'

const DIFF_COLORS = { Easy: 'badge-green', Medium: 'badge-yellow', Hard: 'badge-red' }

const SCORECARD = {
  testPassRate: 87,
  qualityScore: 74,
  timeUsed: '31h 22m',
  percentile: 78,
  feedback: 'Strong implementation with clean code structure. Consider adding error handling for edge cases in the API layer. The component architecture is well thought out.'
}

export default function ProjectHiring() {
  const [view, setView] = useState('marketplace') // marketplace | workspace | scorecard
  const [activeProject, setActiveProject] = useState(null)
  const [timeLeft, setTimeLeft] = useState({ h: 16, m: 38, s: 0 })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const acceptProject = (project) => {
    setActiveProject(project)
    setView('workspace')
  }

  const submitProject = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 2000))
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => setView('scorecard'), 3000)
  }

  if (view === 'scorecard') return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">Project Scorecard</h1>
          <p className="dark:text-gray-400 text-gray-500 mt-1">{activeProject?.title} — {activeProject?.company}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {[
            { label: 'Test Pass Rate', value: SCORECARD.testPassRate, suffix: '%', color: 'text-green-400' },
            { label: 'Code Quality Score', value: SCORECARD.qualityScore, suffix: '/100', color: 'text-primary-400' },
            { label: 'Time Used', value: SCORECARD.timeUsed, suffix: '', color: 'text-yellow-400' },
            { label: 'Percentile Rank', value: `Top ${100 - SCORECARD.percentile}%`, suffix: '', color: 'text-accent-400' }
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className="text-sm dark:text-gray-400 text-gray-500 mb-2">{s.label}</p>
              <p className={`text-4xl font-extrabold ${s.color}`}>{s.value}{s.suffix}</p>
            </div>
          ))}
        </div>
        <div className="card mb-4">
          <h3 className="font-bold dark:text-white text-gray-900 mb-3">Employer Feedback</h3>
          <p className="dark:text-gray-300 text-gray-600 text-sm leading-relaxed">{SCORECARD.feedback}</p>
        </div>
        <button onClick={() => setView('marketplace')} className="btn-primary">← Back to Marketplace</button>
      </div>
    </div>
  )

  if (view === 'workspace') return (
    <div className="h-screen flex flex-col pt-16 dark:bg-gray-950 bg-slate-100">
      {/* Workspace toolbar */}
      <div className="flex items-center justify-between px-4 py-2 dark:bg-gray-900 bg-white border-b dark:border-gray-700 border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold dark:text-white text-gray-900 text-sm">{activeProject?.title}</span>
          <span className="badge badge-blue">{activeProject?.company}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-bold ${timeLeft.h < 1 ? 'bg-red-500/20 text-red-400' : 'dark:bg-gray-800 bg-slate-100 dark:text-white text-gray-900'}`}>
            <FiClock size={13} />
            {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')} left
          </div>
          {submitted ? (
            <div className="flex items-center gap-1.5 text-green-400 text-sm font-semibold">
              <FiCheck size={14} /> Submitted! Evaluating...
            </div>
          ) : (
            <button onClick={submitProject} disabled={submitting}
              className="btn-primary text-sm py-2 flex items-center gap-1.5 disabled:opacity-60">
              {submitting ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCheck size={13} />}
              {submitting ? 'Submitting...' : 'Submit Project'}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File tree */}
        <div className="w-48 dark:bg-gray-900 bg-white border-r dark:border-gray-700 border-slate-200 p-3 flex-shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wider dark:text-gray-400 text-gray-500 mb-2">Files</p>
          {['src/', '  App.jsx', '  components/', '    Chat.jsx', '    Message.jsx', '  hooks/', '    useSocket.js', 'package.json', 'README.md'].map((f, i) => (
            <div key={i} className={`text-xs py-1 px-2 rounded cursor-pointer dark:hover:bg-gray-800 hover:bg-slate-100 ${f === '  App.jsx' ? 'dark:bg-gray-800 bg-slate-100 dark:text-white text-gray-900' : 'dark:text-gray-400 text-gray-500'}`}>
              {f}
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Editor height="70%" language="javascript" theme="vs-dark"
            defaultValue={`import { useState, useEffect } from 'react';\nimport { io } from 'socket.io-client';\n\nexport default function App() {\n  const [messages, setMessages] = useState([]);\n  const [socket, setSocket] = useState(null);\n\n  useEffect(() => {\n    const s = io('http://localhost:3001');\n    setSocket(s);\n    s.on('message', (msg) => setMessages(prev => [...prev, msg]));\n    return () => s.disconnect();\n  }, []);\n\n  // TODO: Implement send message\n  // TODO: Add typing indicators\n  // TODO: Add room support\n}`}
            options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12 }, automaticLayout: true }} />
          {/* Terminal */}
          <div className="h-[30%] dark:bg-gray-950 bg-slate-900 border-t dark:border-gray-700 border-slate-700 p-3 font-mono text-xs overflow-y-auto">
            <div className="flex items-center gap-2 mb-2 dark:text-gray-400 text-gray-400">
              <FiTerminal size={12} /> Terminal
            </div>
            <p className="text-green-400">$ npm install</p>
            <p className="dark:text-gray-300 text-gray-300">added 847 packages in 12s</p>
            <p className="text-green-400 mt-1">$ npm run dev</p>
            <p className="dark:text-gray-300 text-gray-300">  VITE v5.0.8  ready in 312 ms</p>
            <p className="dark:text-gray-300 text-gray-300">  ➜  Local:   http://localhost:5173/</p>
            <p className="text-green-400 mt-1">$ <span className="animate-pulse">_</span></p>
          </div>
        </div>

        {/* README */}
        <div className="w-72 dark:bg-gray-900 bg-white border-l dark:border-gray-700 border-slate-200 p-4 overflow-y-auto flex-shrink-0">
          <h3 className="font-bold dark:text-white text-gray-900 mb-3">📋 README</h3>
          <div className="text-sm dark:text-gray-300 text-gray-600 space-y-3">
            <p><strong className="dark:text-white text-gray-900">Task:</strong> {activeProject?.description}</p>
            <div>
              <p className="font-semibold dark:text-white text-gray-900 mb-1">Requirements:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Real-time message delivery</li>
                <li>Multiple chat rooms</li>
                <li>Typing indicators</li>
                <li>Message history persistence</li>
                <li>User authentication</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold dark:text-white text-gray-900 mb-1">Tech Stack:</p>
              <div className="flex flex-wrap gap-1">
                {activeProject?.techStack.map(t => <span key={t} className="badge badge-blue">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
            <FiCode className="text-primary-400" size={28} /> Project-Based Hiring
          </h1>
          <p className="dark:text-gray-400 text-gray-500 mt-1">Build real projects, get hired based on what you can actually do</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="card hover:scale-[1.02] transition-transform flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{project.companyLogo}</span>
                  <div>
                    <p className="font-bold dark:text-white text-gray-900 text-sm">{project.company}</p>
                    <span className={`badge ${DIFF_COLORS[project.difficulty]}`}>{project.difficulty}</span>
                  </div>
                </div>
                <span className="badge badge-green">{project.reward}</span>
              </div>

              <h3 className="font-bold dark:text-white text-gray-900 mb-2">{project.title}</h3>
              <p className="text-sm dark:text-gray-400 text-gray-500 mb-4 flex-1">{project.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {project.techStack.map(t => <span key={t} className="badge badge-blue">{t}</span>)}
              </div>

              <div className="flex items-center justify-between text-sm dark:text-gray-400 text-gray-500 mb-4">
                <span className="flex items-center gap-1"><FiClock size={12} />{project.duration}</span>
                <span className="flex items-center gap-1"><FiCode size={12} />{project.applicants} submissions</span>
              </div>

              <button onClick={() => acceptProject(project)} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                Accept Project <FiChevronRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
