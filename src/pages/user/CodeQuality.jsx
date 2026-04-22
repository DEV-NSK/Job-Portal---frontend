import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { FiZap, FiAlertTriangle, FiCheckCircle, FiDownload, FiTrendingUp } from 'react-icons/fi'

const SAMPLE_CODE = `function findDuplicates(arr) {
  var duplicates = [];
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        if (!duplicates.includes(arr[i])) {
          duplicates.push(arr[i]);
        }
      }
    }
  }
  return duplicates;
}`

const MOCK_ANALYSIS = {
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(n)',
  readabilityScore: 62,
  readabilityDimensions: [
    { name: 'Naming', score: 70 },
    { name: 'Fn Length', score: 80 },
    { name: 'Comments', score: 20 },
    { name: 'Nesting', score: 55 },
    { name: 'Complexity', score: 65 }
  ],
  edgeCases: [
    { case: 'Empty array input', severity: 'warning', suggestion: 'Add guard: if (!arr || arr.length === 0) return []' },
    { case: 'Non-array input', severity: 'warning', suggestion: 'Validate input type before processing' },
    { case: 'Array with null/undefined values', severity: 'info', suggestion: 'Consider filtering nullish values first' }
  ],
  annotations: [
    { line: 3, message: 'Nested loop creates O(n²) time complexity. Consider using a Set for O(n) solution.', type: 'error' },
    { line: 5, message: 'Array.includes() inside loop adds O(n) overhead. Use Set.has() instead.', type: 'warning' },
    { line: 1, message: 'Missing JSDoc comment for function parameters and return type.', type: 'info' }
  ],
  optimalComplexity: 'O(n)',
  communityAvg: 'O(n log n)',
  refactored: `function findDuplicates(arr) {
  if (!arr?.length) return [];
  const seen = new Set();
  const duplicates = new Set();
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return [...duplicates];
}`
}

const HISTORY = [
  { submission: 1, score: 45 }, { submission: 2, score: 52 }, { submission: 3, score: 58 },
  { submission: 4, score: 55 }, { submission: 5, score: 67 }, { submission: 6, score: 62 },
  { submission: 7, score: 71 }, { submission: 8, score: 68 }, { submission: 9, score: 75 }
]

const COMPLEXITY_CURVE = [
  { n: 10, yours: 100, optimal: 10 }, { n: 100, yours: 10000, optimal: 100 },
  { n: 1000, yours: 1000000, optimal: 1000 }, { n: 10000, yours: 100000000, optimal: 10000 }
]

export default function CodeQuality() {
  const [code, setCode] = useState(SAMPLE_CODE)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showRefactored, setShowRefactored] = useState(false)

  const analyze = async () => {
    setAnalyzing(true)
    await new Promise(r => setTimeout(r, 2000))
    setResults(MOCK_ANALYSIS)
    setAnalyzing(false)
  }

  const readabilityColor = (s) => s >= 70 ? 'text-green-400' : s >= 50 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="py-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
              <FiZap className="text-yellow-400" size={28} /> Code Quality Analyzer
            </h1>
            <p className="dark:text-gray-400 text-gray-500 mt-1">Big-O analysis, readability scoring, and edge case detection</p>
          </div>
          {results && (
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <FiDownload size={14} /> Export PDF Report
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <div className="card p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700 border-slate-200">
                <span className="text-sm font-medium dark:text-gray-300 text-gray-600">JavaScript</span>
                <button onClick={analyze} disabled={analyzing}
                  className="btn-primary text-sm py-1.5 flex items-center gap-2 disabled:opacity-60">
                  {analyzing ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiZap size={13} />}
                  {analyzing ? 'Analyzing...' : 'Analyze Code'}
                </button>
              </div>
              <Editor height="380px" language="javascript" value={code} onChange={v => setCode(v || '')}
                theme="vs-dark" options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12 }, automaticLayout: true }} />
            </div>

            {/* Annotations */}
            {results && (
              <div className="card">
                <h3 className="font-bold dark:text-white text-gray-900 mb-3">Line Annotations</h3>
                <div className="space-y-2">
                  {results.annotations.map((a, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl text-sm ${a.type === 'error' ? 'dark:bg-red-900/20 bg-red-50 border dark:border-red-500/20 border-red-200' : a.type === 'warning' ? 'dark:bg-yellow-900/20 bg-yellow-50 border dark:border-yellow-500/20 border-yellow-200' : 'dark:bg-blue-900/20 bg-blue-50 border dark:border-blue-500/20 border-blue-200'}`}>
                      <span className={`font-mono text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${a.type === 'error' ? 'bg-red-500/20 text-red-400' : a.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        L{a.line}
                      </span>
                      <p className={`${a.type === 'error' ? 'dark:text-red-300 text-red-700' : a.type === 'warning' ? 'dark:text-yellow-300 text-yellow-700' : 'dark:text-blue-300 text-blue-700'}`}>{a.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div>
            {!results && !analyzing && (
              <div className="card h-full flex items-center justify-center text-center">
                <div>
                  <FiZap className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="dark:text-gray-400 text-gray-500">Paste your code and click Analyze to get instant quality feedback</p>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="card h-full flex items-center justify-center text-center">
                <div>
                  <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="dark:text-gray-300 text-gray-600 font-medium">Analyzing code quality...</p>
                  <p className="text-sm dark:text-gray-500 text-gray-400 mt-1">Running AST analysis and Big-O detection</p>
                </div>
              </div>
            )}

            {results && (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="flex gap-2 flex-wrap">
                  {['overview', 'complexity', 'edge cases', 'history'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                        : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-400 text-gray-500'}`}>
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTab === 'overview' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="card text-center">
                        <p className="text-xs dark:text-gray-400 text-gray-500 mb-1">Time</p>
                        <p className="text-xl font-bold text-red-400 font-mono">{results.timeComplexity}</p>
                        <p className="text-xs dark:text-gray-500 text-gray-400">Optimal: {results.optimalComplexity}</p>
                      </div>
                      <div className="card text-center">
                        <p className="text-xs dark:text-gray-400 text-gray-500 mb-1">Space</p>
                        <p className="text-xl font-bold text-yellow-400 font-mono">{results.spaceComplexity}</p>
                      </div>
                      <div className="card text-center">
                        <p className="text-xs dark:text-gray-400 text-gray-500 mb-1">Readability</p>
                        <p className={`text-xl font-bold ${readabilityColor(results.readabilityScore)}`}>{results.readabilityScore}/100</p>
                      </div>
                    </div>

                    <div className="card">
                      <h3 className="font-bold dark:text-white text-gray-900 mb-3">Readability Breakdown</h3>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={results.readabilityDimensions} layout="vertical">
                            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                            <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={65} />
                            <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }} />
                            <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="card">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold dark:text-white text-gray-900">Refactored Solution</h3>
                        <button onClick={() => setShowRefactored(!showRefactored)} className="text-xs text-primary-400 hover:text-primary-300">
                          {showRefactored ? 'Hide' : 'Show'} O(n) solution
                        </button>
                      </div>
                      <AnimatePresence>
                        {showRefactored && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            <pre className="text-xs font-mono dark:bg-gray-800 bg-slate-100 p-4 rounded-xl overflow-x-auto dark:text-green-300 text-green-700">
                              {results.refactored}
                            </pre>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'complexity' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                    <h3 className="font-bold dark:text-white text-gray-900 mb-1">Complexity Comparison</h3>
                    <p className="text-sm dark:text-gray-400 text-gray-500 mb-4">Your O(n²) vs optimal O(n) — operations as n grows</p>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={COMPLEXITY_CURVE}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="n" tick={{ fill: '#6b7280', fontSize: 11 }} />
                          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                          <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }} />
                          <Line type="monotone" dataKey="yours" stroke="#ef4444" strokeWidth={2} name="Your O(n²)" dot={false} />
                          <Line type="monotone" dataKey="optimal" stroke="#10b981" strokeWidth={2} name="Optimal O(n)" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 inline-block" />Your solution (O(n²))</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-green-400 inline-block" />Optimal (O(n))</span>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'edge cases' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    {results.edgeCases.map((ec, i) => (
                      <div key={i} className={`card ${ec.severity === 'warning' ? 'border-l-4 border-l-yellow-500' : 'border-l-4 border-l-blue-500'}`}>
                        <div className="flex items-start gap-3">
                          <FiAlertTriangle className={ec.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'} size={16} />
                          <div>
                            <p className="font-medium dark:text-white text-gray-900 text-sm">{ec.case}</p>
                            <p className="text-sm dark:text-gray-400 text-gray-500 mt-1 font-mono">{ec.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                    <h3 className="font-bold dark:text-white text-gray-900 mb-4">Quality Score Trend</h3>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={HISTORY}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="submission" tick={{ fill: '#6b7280', fontSize: 11 }} label={{ value: 'Submission #', position: 'insideBottom', offset: -2, fill: '#6b7280', fontSize: 11 }} />
                          <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                          <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
                            formatter={(v) => [`${v}/100`, 'Quality Score']} />
                          <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
