import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { FiPlay, FiCheck, FiClock, FiAward, FiChevronRight, FiX } from 'react-icons/fi'
import { mockCodingProblems, mockLeaderboard } from '../../data/mockData'

const DIFF_COLORS = { Easy: 'badge-green', Medium: 'badge-yellow', Hard: 'badge-red' }
const LANGUAGES = ['javascript', 'python', 'java', 'cpp', 'go']

const MOCK_TEST_RESULTS = [
  { input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', output: '[0,1]', passed: true },
  { input: 'nums = [3,2,4], target = 6', expected: '[1,2]', output: '[1,2]', passed: true },
  { input: 'nums = [3,3], target = 6', expected: '[0,1]', output: '[0,1]', passed: true }
]

export default function DailyCoding() {
  const [selectedProblem, setSelectedProblem] = useState(mockCodingProblems[0])
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(mockCodingProblems[0].starterCode.javascript)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [xp, setXp] = useState(75)
  const [solved, setSolved] = useState(new Set([2]))

  useEffect(() => {
    let interval
    if (timerActive) interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [timerActive])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const selectProblem = (p) => {
    setSelectedProblem(p)
    setCode(p.starterCode[language] || p.starterCode.javascript)
    setResults(null)
    setTimer(0)
    setTimerActive(false)
  }

  const runCode = async () => {
    setRunning(true)
    setTimerActive(true)
    await new Promise(r => setTimeout(r, 1500))
    setResults(MOCK_TEST_RESULTS)
    setRunning(false)
    const allPassed = MOCK_TEST_RESULTS.every(r => r.passed)
    if (allPassed && !solved.has(selectedProblem.id)) {
      setSolved(prev => new Set([...prev, selectedProblem.id]))
      setXp(prev => prev + selectedProblem.xp)
      setTimerActive(false)
    }
  }

  const allPassed = results?.every(r => r.passed)

  return (
    <div className="min-h-screen pt-16 flex flex-col" style={{ height: '100vh' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 dark:bg-gray-900 bg-white border-b dark:border-gray-700 border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="font-bold dark:text-white text-gray-900 flex items-center gap-2">
            <span>⚡</span> Daily Coding
          </h1>
          <div className="flex gap-1">
            {mockCodingProblems.map((p, i) => (
              <button key={p.id} onClick={() => selectProblem(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${selectedProblem.id === p.id
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                  : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-400 text-gray-500'}`}>
                {solved.has(p.id) && <FiCheck size={10} className="text-green-400" />}
                {i + 1}. {p.title.split(' ').slice(0, 2).join(' ')}
                <span className={`badge ${DIFF_COLORS[p.difficulty]} text-xs py-0 px-1.5`}>{p.difficulty}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 dark:bg-gray-800 bg-slate-100 px-3 py-1.5 rounded-lg">
            <FiClock size={13} className="dark:text-gray-400 text-gray-500" />
            <span className="text-sm font-mono dark:text-white text-gray-900">{formatTime(timer)}</span>
          </div>
          <div className="flex items-center gap-1.5 dark:bg-yellow-900/30 bg-yellow-50 border dark:border-yellow-500/30 border-yellow-200 px-3 py-1.5 rounded-lg">
            <FiAward size={13} className="text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">{xp} XP</span>
          </div>
          <button onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="btn-secondary text-xs py-1.5 flex items-center gap-1">
            🏆 Leaderboard
          </button>
        </div>
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Problem Panel */}
        <div className="w-2/5 overflow-y-auto p-6 dark:bg-gray-950 bg-slate-50 border-r dark:border-gray-700 border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold dark:text-white text-gray-900">{selectedProblem.title}</h2>
            <span className={`badge ${DIFF_COLORS[selectedProblem.difficulty]}`}>{selectedProblem.difficulty}</span>
            <span className="badge badge-blue">{selectedProblem.topic}</span>
          </div>
          <div className="flex items-center gap-3 mb-4 text-sm dark:text-gray-400 text-gray-500">
            <span>🏢 {selectedProblem.company}</span>
            <span>⚡ +{selectedProblem.xp} XP</span>
          </div>

          <p className="dark:text-gray-300 text-gray-700 text-sm leading-relaxed mb-6 whitespace-pre-line">{selectedProblem.description}</p>

          <div className="space-y-3 mb-6">
            {selectedProblem.examples.map((ex, i) => (
              <div key={i} className="dark:bg-gray-800/50 bg-white border dark:border-gray-700 border-slate-200 rounded-xl p-4">
                <p className="text-xs font-semibold dark:text-gray-400 text-gray-500 mb-2">Example {i + 1}</p>
                <p className="text-sm font-mono dark:text-gray-200 text-gray-700"><strong>Input:</strong> {ex.input}</p>
                <p className="text-sm font-mono dark:text-gray-200 text-gray-700"><strong>Output:</strong> {ex.output}</p>
                {ex.explanation && <p className="text-sm dark:text-gray-400 text-gray-500 mt-1"><strong>Explanation:</strong> {ex.explanation}</p>}
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider dark:text-gray-400 text-gray-500 mb-2">Constraints</p>
            <ul className="space-y-1">
              {selectedProblem.constraints.map((c, i) => (
                <li key={i} className="text-sm font-mono dark:text-gray-300 text-gray-600 flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>{c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Editor + Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-2 dark:bg-gray-900 bg-white border-b dark:border-gray-700 border-slate-200 flex-shrink-0">
            <select value={language} onChange={e => { setLanguage(e.target.value); setCode(selectedProblem.starterCode[e.target.value] || selectedProblem.starterCode.javascript) }}
              className="dark:bg-gray-800 bg-slate-100 dark:text-gray-200 text-gray-700 text-sm rounded-lg px-3 py-1.5 border dark:border-gray-600 border-slate-300 focus:outline-none">
              {LANGUAGES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
            </select>
            <button onClick={runCode} disabled={running}
              className="btn-primary flex items-center gap-2 text-sm py-2 disabled:opacity-60">
              {running ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiPlay size={14} />}
              {running ? 'Running...' : 'Run Code'}
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor height="100%" language={language} value={code} onChange={v => setCode(v || '')}
              theme="vs-dark"
              options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 16 }, lineNumbers: 'on', automaticLayout: true }} />
          </div>

          {/* Test Results */}
          <AnimatePresence>
            {results && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="border-t dark:border-gray-700 border-slate-200 dark:bg-gray-900 bg-white flex-shrink-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {allPassed
                        ? <><FiCheck className="text-green-400" size={16} /><span className="font-semibold text-green-400">All tests passed!</span></>
                        : <><FiX className="text-red-400" size={16} /><span className="font-semibold text-red-400">Some tests failed</span></>}
                    </div>
                    {allPassed && !solved.has(selectedProblem.id) && (
                      <span className="badge badge-yellow flex items-center gap-1">
                        <FiAward size={10} />+{selectedProblem.xp} XP earned!
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {results.map((r, i) => (
                      <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl text-sm ${r.passed
                        ? 'dark:bg-green-900/20 bg-green-50 border dark:border-green-500/20 border-green-200'
                        : 'dark:bg-red-900/20 bg-red-50 border dark:border-red-500/20 border-red-200'}`}>
                        {r.passed ? <FiCheck className="text-green-400 flex-shrink-0" size={14} /> : <FiX className="text-red-400 flex-shrink-0" size={14} />}
                        <span className="font-mono dark:text-gray-300 text-gray-600 text-xs flex-1 truncate">Input: {r.input}</span>
                        <span className="font-mono text-xs dark:text-gray-400 text-gray-500">→ {r.output}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Leaderboard Panel */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 260, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden border-l dark:border-gray-700 border-slate-200 dark:bg-gray-900 bg-white flex-shrink-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold dark:text-white text-gray-900 text-sm">Today's Leaderboard</h3>
                  <button onClick={() => setShowLeaderboard(false)} className="p-1 dark:hover:bg-gray-800 hover:bg-slate-100 rounded">
                    <FiX size={14} className="dark:text-gray-400 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-2">
                  {mockLeaderboard.map(entry => (
                    <div key={entry.rank} className={`flex items-center gap-3 p-2.5 rounded-xl ${entry.isYou
                      ? 'dark:bg-primary-900/30 bg-primary-50 border dark:border-primary-500/30 border-primary-200'
                      : 'dark:bg-gray-800/50 bg-slate-50'}`}>
                      <span className={`text-sm font-bold w-5 text-center ${entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-slate-300' : entry.rank === 3 ? 'text-orange-400' : 'dark:text-gray-400 text-gray-500'}`}>
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {entry.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${entry.isYou ? 'text-primary-400' : 'dark:text-white text-gray-900'}`}>
                          {entry.name} {entry.isYou && '(You)'}
                        </p>
                        <p className="text-xs dark:text-gray-400 text-gray-500">{entry.solved} solved · {entry.xp} XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
