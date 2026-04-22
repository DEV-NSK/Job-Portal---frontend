import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiLink, FiCheckCircle, FiXCircle, FiAlertCircle, FiFileText, FiZap, FiSave } from 'react-icons/fi'

const MOCK_ANALYSIS = {
  matchScore: 84,
  atsProbability: 78,
  atsConfidence: '±6%',
  hardSkillsMissing: ['GraphQL', 'Redis', 'System Design'],
  softSkillsMissing: ['Cross-functional collaboration'],
  experienceDelta: 'You have 2 YoE; role requires 3–5 YoE',
  domainOverlap: 91,
  resumeSuggestions: [
    { original: 'Built React components for the dashboard', improved: 'Architected 15+ reusable React components reducing UI development time by 40%, serving 50k+ daily active users' },
    { original: 'Worked on API integrations', improved: 'Designed and implemented 8 RESTful API integrations with third-party services, improving data sync reliability to 99.9% uptime' },
    { original: 'Fixed bugs and improved performance', improved: 'Identified and resolved 30+ critical bugs; optimised bundle size by 35% through code splitting and lazy loading' },
    { original: 'Collaborated with the team', improved: 'Led cross-functional collaboration with 3 product teams to deliver 4 major features on schedule, reducing sprint carryover by 60%' },
    { original: 'Used Git for version control', improved: 'Maintained Git workflow with feature branching, code reviews, and CI/CD pipelines reducing deployment failures by 80%' }
  ],
  keywordMatches: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'REST API', 'Git', 'Agile'],
  keywordMissing: ['GraphQL', 'Redis', 'Docker', 'AWS', 'System Design', 'Microservices']
}

const ScoreArc = ({ score, size = 120 }) => {
  const r = size / 2 - 12
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#374151" strokeWidth={10} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={10}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x={size / 2} y={size / 2 + 6} textAnchor="middle" fill={color} fontSize={size / 5} fontWeight={700}>{score}%</text>
    </svg>
  )
}

export default function ResumeMatch() {
  const [step, setStep] = useState('input') // input | analyzing | results
  const [jdText, setJdText] = useState('')
  const [jdUrl, setJdUrl] = useState('')
  const [inputMode, setInputMode] = useState('paste')
  const [resumeFile, setResumeFile] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [savedAnalyses, setSavedAnalyses] = useState([
    { id: 1, job: 'Senior Frontend Engineer @ Stripe', score: 84, date: 'Apr 20, 2026' },
    { id: 2, job: 'Full Stack Developer @ Notion', score: 71, date: 'Apr 18, 2026' }
  ])

  const analyze = async () => {
    if (!jdText && !jdUrl) return
    setStep('analyzing')
    await new Promise(r => setTimeout(r, 2200))
    setStep('results')
  }

  const saveAnalysis = () => {
    setSavedAnalyses(prev => [{ id: Date.now(), job: 'Senior React Developer @ Linear', score: MOCK_ANALYSIS.matchScore, date: 'Apr 22, 2026' }, ...prev])
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="py-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
            <FiZap className="text-yellow-400" size={28} /> AI Resume vs Job Match
          </h1>
          <p className="dark:text-gray-400 text-gray-500 mt-1">Deep semantic analysis of your resume against any job description</p>
        </div>

        {step === 'input' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Resume Upload */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                <h3 className="font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
                  <FiFileText className="text-primary-400" size={16} /> Your Resume
                </h3>
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                  ${resumeFile ? 'dark:border-green-500/50 border-green-400 dark:bg-green-900/10 bg-green-50' : 'dark:border-gray-600 border-slate-300 dark:hover:border-primary-500 hover:border-primary-400'}`}
                  onClick={() => document.getElementById('resume-upload').click()}>
                  <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" className="hidden"
                    onChange={e => setResumeFile(e.target.files[0])} />
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FiCheckCircle className="text-green-400" size={24} />
                      <div className="text-left">
                        <p className="font-medium dark:text-white text-gray-900">{resumeFile.name}</p>
                        <p className="text-sm dark:text-gray-400 text-gray-500">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="mx-auto dark:text-gray-400 text-gray-400 mb-3" size={32} />
                      <p className="dark:text-gray-300 text-gray-600 font-medium">Drop your resume here or click to upload</p>
                      <p className="text-sm dark:text-gray-500 text-gray-400 mt-1">PDF, DOC, DOCX — or we'll use your profile resume</p>
                    </>
                  )}
                </div>
                {!resumeFile && (
                  <button className="mt-3 text-sm text-primary-400 hover:text-primary-300 w-full text-center">
                    Use resume from my profile instead →
                  </button>
                )}
              </motion.div>

              {/* JD Input */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
                <h3 className="font-bold dark:text-white text-gray-900 mb-4">Job Description</h3>
                <div className="flex gap-2 mb-4">
                  {[['paste', 'Paste Text'], ['url', 'From URL']].map(([mode, label]) => (
                    <button key={mode} onClick={() => setInputMode(mode)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${inputMode === mode
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                        : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-400 text-gray-500'}`}>
                      {mode === 'url' && <FiLink className="inline mr-1.5" size={12} />}{label}
                    </button>
                  ))}
                </div>
                {inputMode === 'paste' ? (
                  <textarea className="input-field min-h-[200px] resize-none text-sm" placeholder="Paste the full job description here..."
                    value={jdText} onChange={e => setJdText(e.target.value)} />
                ) : (
                  <input className="input-field" placeholder="https://jobs.stripe.com/..." value={jdUrl} onChange={e => setJdUrl(e.target.value)} />
                )}
                <button onClick={analyze} disabled={!jdText && !jdUrl}
                  className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50">
                  <FiZap size={16} /> Analyze Match
                </button>
              </motion.div>
            </div>

            {/* Saved Analyses */}
            <div className="space-y-4">
              <h3 className="font-bold dark:text-white text-gray-900">Job Tracker</h3>
              {savedAnalyses.map(a => (
                <div key={a.id} className="card hover:scale-[1.02] transition-transform cursor-pointer">
                  <p className="font-medium dark:text-white text-gray-900 text-sm mb-1">{a.job}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs dark:text-gray-400 text-gray-500">{a.date}</span>
                    <span className={`badge ${a.score >= 70 ? 'badge-green' : 'badge-yellow'}`}>{a.score}% match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6" />
            <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">Analyzing your match...</h3>
            <p className="dark:text-gray-400 text-gray-500">Running semantic embeddings and gap analysis</p>
          </div>
        )}

        {step === 'results' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {['overview', 'gaps', 'suggestions', 'keywords'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                    : 'dark:bg-gray-800 bg-slate-100 dark:text-gray-400 text-gray-500 dark:hover:bg-gray-700 hover:bg-slate-200'}`}>
                  {tab}
                </button>
              ))}
              <button onClick={() => setStep('input')} className="btn-secondary text-sm py-2 ml-auto">← New Analysis</button>
              <button onClick={saveAnalysis} className="btn-secondary text-sm py-2 flex items-center gap-1">
                <FiSave size={13} /> Save
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div className="card text-center">
                    <p className="text-sm dark:text-gray-400 text-gray-500 mb-2">Match Score</p>
                    <ScoreArc score={MOCK_ANALYSIS.matchScore} size={140} />
                    <p className="text-sm dark:text-gray-300 text-gray-600 mt-2">Strong match — apply with confidence</p>
                  </div>
                  <div className="card text-center">
                    <p className="text-sm dark:text-gray-400 text-gray-500 mb-2">ATS Pass Probability</p>
                    <ScoreArc score={MOCK_ANALYSIS.atsProbability} size={120} />
                    <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">Confidence: {MOCK_ANALYSIS.atsConfidence}</p>
                    <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">Based on 10k+ ATS outcomes</p>
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="card">
                    <h3 className="font-bold dark:text-white text-gray-900 mb-4">Quick Summary</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Domain Overlap', value: `${MOCK_ANALYSIS.domainOverlap}%`, color: 'text-green-400', icon: '✅' },
                        { label: 'Experience Delta', value: MOCK_ANALYSIS.experienceDelta, color: 'text-yellow-400', icon: '⚠️' },
                        { label: 'Hard Skills Missing', value: `${MOCK_ANALYSIS.hardSkillsMissing.length} skills`, color: 'text-red-400', icon: '❌' },
                        { label: 'Keyword Matches', value: `${MOCK_ANALYSIS.keywordMatches.length} found`, color: 'text-green-400', icon: '✅' }
                      ].map(item => (
                        <div key={item.label} className="p-4 dark:bg-gray-800/50 bg-slate-50 rounded-xl">
                          <p className="text-xs dark:text-gray-400 text-gray-500 mb-1">{item.icon} {item.label}</p>
                          <p className={`font-semibold ${item.color} text-sm`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card">
                    <h3 className="font-bold dark:text-white text-gray-900 mb-3">Missing Hard Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {MOCK_ANALYSIS.hardSkillsMissing.map(s => (
                        <span key={s} className="badge badge-red flex items-center gap-1"><FiXCircle size={10} />{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gaps' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
                    <FiXCircle className="text-red-400" size={16} /> Hard Skills Missing
                  </h3>
                  <div className="space-y-2">
                    {MOCK_ANALYSIS.hardSkillsMissing.map(s => (
                      <div key={s} className="flex items-center justify-between p-3 dark:bg-gray-800/50 bg-slate-50 rounded-xl">
                        <span className="dark:text-gray-200 text-gray-700 text-sm">{s}</span>
                        <button className="text-xs text-primary-400 hover:text-primary-300">Add to path →</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <h3 className="font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
                    <FiAlertCircle className="text-yellow-400" size={16} /> Soft Skills & Experience
                  </h3>
                  <div className="space-y-3">
                    {MOCK_ANALYSIS.softSkillsMissing.map(s => (
                      <div key={s} className="p-3 dark:bg-yellow-900/20 bg-yellow-50 border dark:border-yellow-500/20 border-yellow-200 rounded-xl">
                        <span className="text-sm dark:text-yellow-300 text-yellow-700">{s}</span>
                      </div>
                    ))}
                    <div className="p-3 dark:bg-yellow-900/20 bg-yellow-50 border dark:border-yellow-500/20 border-yellow-200 rounded-xl">
                      <span className="text-sm dark:text-yellow-300 text-yellow-700">{MOCK_ANALYSIS.experienceDelta}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-4">
                <p className="dark:text-gray-400 text-gray-500 text-sm">AI-generated rewrites for your 5 weakest resume bullets:</p>
                {MOCK_ANALYSIS.resumeSuggestions.map((s, i) => (
                  <div key={i} className="card">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-2">Original</p>
                        <p className="text-sm dark:text-gray-300 text-gray-600 p-3 dark:bg-red-900/10 bg-red-50 rounded-xl border dark:border-red-500/20 border-red-200">{s.original}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-green-400 mb-2">AI Improved</p>
                        <p className="text-sm dark:text-gray-200 text-gray-700 p-3 dark:bg-green-900/10 bg-green-50 rounded-xl border dark:border-green-500/20 border-green-200">{s.improved}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'keywords' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
                    <FiCheckCircle className="text-green-400" size={16} /> Keywords Found in Resume
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_ANALYSIS.keywordMatches.map(k => (
                      <span key={k} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-yellow-400/20 text-yellow-600 dark:text-yellow-300 border border-yellow-400/30">{k}</span>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <h3 className="font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
                    <FiXCircle className="text-red-400" size={16} /> JD Keywords Missing from Resume
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_ANALYSIS.keywordMissing.map(k => (
                      <span key={k} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-400/20 text-red-600 dark:text-red-300 border border-red-400/30">{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
