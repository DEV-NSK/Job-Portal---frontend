import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMic, FiMicOff, FiPlay, FiSquare, FiChevronRight, FiStar, FiMessageSquare } from 'react-icons/fi'
import { mockInterviewQuestions } from '../../data/mockData'

const ROLES = ['Frontend', 'Backend', 'Data Engineering', 'DevOps', 'Product Management']

const MOCK_SCORES = [
  { question: 'Tell me about yourself', clarity: 8, depth: 7, structure: 9, overall: 8 },
  { question: 'Describe a challenging project', clarity: 7, depth: 8, structure: 7, overall: 7.3 },
  { question: 'How do you handle tight deadlines?', clarity: 9, depth: 6, structure: 8, overall: 7.7 }
]

const MOCK_FEEDBACK = [
  { q: 'Tell me about yourself', feedback: 'Strong opening with clear structure. Consider quantifying your achievements more specifically — numbers make a stronger impression.', score: 8 },
  { q: 'Describe a challenging project', feedback: 'Good use of STAR method. The situation and task were clear. Strengthen the "Result" section with measurable outcomes.', score: 7.3 },
  { q: 'How do you handle tight deadlines?', feedback: 'Excellent clarity and confidence. Your example was relevant and specific. Could improve by mentioning how you communicate progress to stakeholders.', score: 7.7 }
]

export default function MockInterview() {
  const [view, setView] = useState('setup') // setup | interview | report
  const [mode, setMode] = useState('hr')
  const [role, setRole] = useState('Frontend')
  const [inputMode, setInputMode] = useState('voice')
  const [micOn, setMicOn] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [answers, setAnswers] = useState([])
  const [textAnswer, setTextAnswer] = useState('')
  const [waveform, setWaveform] = useState(Array(20).fill(4))
  const [thinking, setThinking] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')
  const waveInterval = useRef(null)

  const questions = mode === 'hr' ? mockInterviewQuestions.hr : mockInterviewQuestions.technical

  useEffect(() => {
    if (micOn) {
      waveInterval.current = setInterval(() => {
        setWaveform(Array(20).fill(0).map(() => Math.random() * 28 + 4))
      }, 100)
    } else {
      clearInterval(waveInterval.current)
      setWaveform(Array(20).fill(4))
    }
    return () => clearInterval(waveInterval.current)
  }, [micOn])

  const startInterview = () => {
    setView('interview')
    setCurrentQ(0)
    setAnswers([])
  }

  const submitAnswer = async () => {
    const answer = inputMode === 'voice' ? transcript || '[Voice answer recorded]' : textAnswer
    setAnswers(prev => [...prev, { question: questions[currentQ], answer }])
    setTranscript('')
    setTextAnswer('')
    setMicOn(false)
    setThinking(true)
    await new Promise(r => setTimeout(r, 1500))
    setThinking(false)
    if (currentQ + 1 >= questions.length) {
      setView('report')
    } else {
      setCurrentQ(prev => prev + 1)
    }
  }

  const overallScore = MOCK_SCORES.reduce((a, s) => a + s.overall, 0) / MOCK_SCORES.length

  if (view === 'setup') return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
            🤖 AI Mock Interview Bot
          </h1>
          <p className="dark:text-gray-400 text-gray-500 mt-1">Practice full interview rounds with AI feedback</p>
        </div>

        <div className="card space-y-6">
          <div>
            <p className="font-semibold dark:text-white text-gray-900 mb-3">Interview Mode</p>
            <div className="grid grid-cols-2 gap-3">
              {[['hr', '🤝 HR Round', 'Behavioural & situational questions'], ['technical', '💻 Technical Round', 'DSA + system design']].map(([m, label, desc]) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${mode === m ? 'border-primary-500 dark:bg-primary-900/20 bg-primary-50' : 'dark:border-gray-700 border-slate-200 dark:hover:border-gray-500 hover:border-slate-300'}`}>
                  <p className="font-semibold dark:text-white text-gray-900 text-sm">{label}</p>
                  <p className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold dark:text-white text-gray-900 mb-3">Target Role</p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map(r => (
                <button key={r} onClick={() => setRole(r)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${role === r ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white' : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-400 text-gray-500'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold dark:text-white text-gray-900 mb-3">Input Mode</p>
            <div className="grid grid-cols-2 gap-3">
              {[['voice', '🎤 Voice', 'Speak your answers (realistic)'], ['text', '⌨️ Text', 'Type your answers']].map(([m, label, desc]) => (
                <button key={m} onClick={() => setInputMode(m)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${inputMode === m ? 'border-primary-500 dark:bg-primary-900/20 bg-primary-50' : 'dark:border-gray-700 border-slate-200'}`}>
                  <p className="font-semibold dark:text-white text-gray-900 text-sm">{label}</p>
                  <p className="text-xs dark:text-gray-400 text-gray-500">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 dark:bg-gray-800/50 bg-slate-50 rounded-xl text-sm dark:text-gray-300 text-gray-600">
            <p className="font-semibold dark:text-white text-gray-900 mb-1">Session Info</p>
            <p>{mode === 'hr' ? `${mockInterviewQuestions.hr.length} behavioural questions` : `${mockInterviewQuestions.technical.length} technical questions + 1 system design`} · ~{mode === 'hr' ? '25' : '40'} minutes</p>
          </div>

          <button onClick={startInterview} className="btn-primary w-full flex items-center justify-center gap-2">
            <FiPlay size={16} /> Start Interview
          </button>
        </div>
      </div>
    </div>
  )

  if (view === 'interview') return (
    <div className="min-h-screen pt-20 px-4 pb-12 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <span className="text-sm dark:text-gray-400 text-gray-500">Question {currentQ + 1} of {questions.length}</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i < currentQ ? 'bg-green-500' : i === currentQ ? 'bg-primary-500' : 'dark:bg-gray-700 bg-slate-200'}`} />
            ))}
          </div>
        </div>

        {/* AI Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30">
            <span className="text-4xl">🤖</span>
          </div>
          {thinking ? (
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => <span key={i} className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          ) : (
            <div className="dark:bg-gray-800 bg-white border dark:border-gray-700 border-slate-200 rounded-2xl rounded-tl-sm px-6 py-4 max-w-lg text-center shadow-lg">
              <p className="dark:text-white text-gray-900 font-medium">{questions[currentQ]}</p>
            </div>
          )}
        </div>

        {/* Answer area */}
        {!thinking && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {inputMode === 'voice' ? (
              <div className="card text-center">
                {/* Waveform */}
                <div className="flex items-center justify-center gap-0.5 h-12 mb-4">
                  {waveform.map((h, i) => (
                    <div key={i} className={`w-1.5 rounded-full transition-all duration-75 ${micOn ? 'bg-primary-400' : 'dark:bg-gray-600 bg-slate-300'}`}
                      style={{ height: `${h}px` }} />
                  ))}
                </div>
                <button onClick={() => setMicOn(!micOn)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-all ${micOn ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/40' : 'bg-gradient-to-br from-primary-500 to-accent-500 hover:scale-105 shadow-lg shadow-primary-500/30'}`}>
                  {micOn ? <FiMicOff className="text-white" size={24} /> : <FiMic className="text-white" size={24} />}
                </button>
                <p className="text-sm dark:text-gray-400 text-gray-500">{micOn ? 'Recording... click to stop' : 'Click to start recording'}</p>
                {micOn && <p className="text-xs text-primary-400 mt-1 animate-pulse">Listening...</p>}
              </div>
            ) : (
              <textarea className="input-field min-h-[140px] resize-none text-sm" placeholder="Type your answer here..."
                value={textAnswer} onChange={e => setTextAnswer(e.target.value)} />
            )}

            <button onClick={submitAnswer} disabled={inputMode === 'text' && !textAnswer.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {currentQ + 1 >= questions.length ? 'Finish Interview' : 'Next Question'}
              <FiChevronRight size={16} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )

  // Report view
  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">Interview Report</h1>
          <p className="dark:text-gray-400 text-gray-500 mt-1">{mode === 'hr' ? 'HR Round' : 'Technical Round'} · {role}</p>
        </div>

        {/* Overall score */}
        <div className="card mb-6 text-center dark:bg-gradient-to-br dark:from-primary-900/20 dark:to-accent-900/20 border dark:border-primary-500/20">
          <p className="text-sm dark:text-gray-400 text-gray-500 mb-2">Overall Score</p>
          <p className="text-6xl font-extrabold text-gradient mb-2">{overallScore.toFixed(1)}</p>
          <p className="text-sm dark:text-gray-400 text-gray-500">out of 10</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['summary', 'transcript', 'scores', 'resources'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-400 text-gray-500'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'summary' && (
          <div className="space-y-4">
            {MOCK_FEEDBACK.map((f, i) => (
              <div key={i} className="card">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold dark:text-white text-gray-900 text-sm flex-1 mr-4">{f.q}</p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <FiStar className="text-yellow-400" size={14} />
                    <span className="font-bold dark:text-white text-gray-900">{f.score}</span>
                  </div>
                </div>
                <p className="text-sm dark:text-gray-400 text-gray-500">{f.feedback}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'scores' && (
          <div className="space-y-4">
            {MOCK_SCORES.map((s, i) => (
              <div key={i} className="card">
                <p className="font-semibold dark:text-white text-gray-900 mb-3 text-sm">{s.question}</p>
                <div className="grid grid-cols-4 gap-3">
                  {[['Clarity', s.clarity], ['Depth', s.depth], ['Structure', s.structure], ['Overall', s.overall]].map(([label, val]) => (
                    <div key={label} className="text-center">
                      <p className="text-xs dark:text-gray-400 text-gray-500 mb-1">{label}</p>
                      <p className={`text-xl font-bold ${val >= 8 ? 'text-green-400' : val >= 6 ? 'text-yellow-400' : 'text-red-400'}`}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'STAR Method Guide', type: 'Article', platform: 'Platform' },
              { title: 'Behavioural Interview Prep', type: 'Course', platform: 'Coursera' },
              { title: 'System Design Interview', type: 'Book', platform: 'Amazon' },
              { title: 'Mock Interview Practice', type: 'Practice', platform: 'Platform' }
            ].map((r, i) => (
              <div key={i} className="card flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <FiMessageSquare className="text-primary-400" size={16} />
                </div>
                <div>
                  <p className="font-medium dark:text-white text-gray-900 text-sm">{r.title}</p>
                  <p className="text-xs dark:text-gray-400 text-gray-500">{r.type} · {r.platform}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={() => setView('setup')} className="btn-primary">Practice Again</button>
          <button className="btn-secondary">Download Report</button>
        </div>
      </div>
    </div>
  )
}
