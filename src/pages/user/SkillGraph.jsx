import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiDownload, FiShare2, FiX, FiTrendingUp, FiBook, FiUsers } from 'react-icons/fi'
import { mockSkillNodes } from '../../data/mockData'

const STATUS_COLORS = { known: '#10b981', learning: '#f59e0b', gap: '#ef4444' }
const STATUS_LABELS = { known: 'Known', learning: 'Learning', gap: 'Gap' }

const SKILL_DETAILS = {
  react: { trend: '+18%', salaryImpact: '+$12k', resources: ['React Docs', 'Epic React by Kent C. Dodds', 'React Patterns'], users: 3420 },
  nodejs: { trend: '+12%', salaryImpact: '+$10k', resources: ['Node.js Docs', 'Node.js Design Patterns', 'The Complete Node.js Developer'], users: 2890 },
  typescript: { trend: '+31%', salaryImpact: '+$15k', resources: ['TypeScript Handbook', 'Total TypeScript', 'TypeScript Deep Dive'], users: 2100 },
  graphql: { trend: '+22%', salaryImpact: '+$8k', resources: ['GraphQL.org', 'How to GraphQL', 'Apollo Docs'], users: 980 },
  docker: { trend: '+19%', salaryImpact: '+$11k', resources: ['Docker Docs', 'Docker & Kubernetes: The Complete Guide', 'Play with Docker'], users: 1560 },
  aws: { trend: '+25%', salaryImpact: '+$18k', resources: ['AWS Free Tier', 'AWS Certified Solutions Architect', 'A Cloud Guru'], users: 1890 },
  python: { trend: '+15%', salaryImpact: '+$9k', resources: ['Python.org', 'Automate the Boring Stuff', 'Real Python'], users: 3100 },
  mongodb: { trend: '+8%', salaryImpact: '+$7k', resources: ['MongoDB University', 'MongoDB Docs', 'Mongoose Docs'], users: 1200 },
  redis: { trend: '+14%', salaryImpact: '+$9k', resources: ['Redis Docs', 'Redis University', 'Redis in Action'], users: 780 },
  kubernetes: { trend: '+28%', salaryImpact: '+$20k', resources: ['Kubernetes Docs', 'CKA Course', 'Kubernetes in Action'], users: 650 },
  nextjs: { trend: '+35%', salaryImpact: '+$13k', resources: ['Next.js Docs', 'Next.js by Vercel', 'Lee Robinson Blog'], users: 1780 },
  postgres: { trend: '+10%', salaryImpact: '+$8k', resources: ['PostgreSQL Docs', 'Use The Index, Luke', 'Postgres Weekly'], users: 1450 }
}

// Simple force-like layout using fixed positions with slight jitter
const EDGES = [
  ['react', 'typescript'], ['react', 'nextjs'], ['react', 'graphql'],
  ['nodejs', 'mongodb'], ['nodejs', 'redis'], ['nodejs', 'graphql'],
  ['docker', 'kubernetes'], ['docker', 'aws'], ['aws', 'redis'],
  ['python', 'mongodb'], ['typescript', 'nextjs'], ['postgres', 'nodejs']
]

export default function SkillGraph() {
  const [filter, setFilter] = useState('all')
  const [domainFilter, setDomainFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const svgRef = useRef(null)

  const visibleNodes = mockSkillNodes.filter(n => {
    if (filter !== 'all' && n.status !== filter) return false
    return true
  })

  const visibleIds = new Set(visibleNodes.map(n => n.id))
  const visibleEdges = EDGES.filter(([a, b]) => visibleIds.has(a) && visibleIds.has(b))

  const selectedDetail = selected ? SKILL_DETAILS[selected.id] : null

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">Skill Graph</h1>
            <p className="dark:text-gray-400 text-gray-500 mt-1">Your skills as an interactive network map</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2 text-sm py-2">
              <FiShare2 size={14} /> Share
            </button>
            <button className="btn-secondary flex items-center gap-2 text-sm py-2">
              <FiDownload size={14} /> Export PNG
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-1 dark:bg-gray-800 bg-white border dark:border-gray-700 border-slate-200 rounded-xl p-1">
            {['all', 'known', 'learning', 'gap'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${filter === f
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                  : 'dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-900'}`}>
                {f === 'all' ? 'All Skills' : STATUS_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* SVG Graph */}
          <div className="flex-1 card p-0 overflow-hidden relative" style={{ minHeight: 500 }}>
            <svg ref={svgRef} width="100%" height="500" className="dark:bg-gray-900/50 bg-slate-50 rounded-2xl">
              {/* Edges */}
              {visibleEdges.map(([a, b], i) => {
                const na = visibleNodes.find(n => n.id === a)
                const nb = visibleNodes.find(n => n.id === b)
                if (!na || !nb) return null
                return (
                  <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    stroke="#374151" strokeWidth={1.5} strokeDasharray={na.status === 'gap' || nb.status === 'gap' ? '5,4' : undefined}
                    opacity={0.5} />
                )
              })}

              {/* Nodes */}
              {visibleNodes.map(node => {
                const r = 8 + (node.demand / 100) * 14
                const isSelected = selected?.id === node.id
                const isHovered = hoveredNode === node.id
                return (
                  <g key={node.id} onClick={() => setSelected(isSelected ? null : node)}
                    onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'pointer' }}>
                    <circle cx={node.x} cy={node.y} r={r + (isSelected || isHovered ? 4 : 0)}
                      fill={STATUS_COLORS[node.status]} opacity={node.status === 'gap' ? 0.7 : 0.9}
                      stroke={isSelected ? '#fff' : 'transparent'} strokeWidth={2}
                      strokeDasharray={node.status === 'gap' ? '4,3' : undefined} />
                    <text x={node.x} y={node.y + r + 14} textAnchor="middle"
                      fill="#9ca3af" fontSize={11} fontWeight={isSelected ? 700 : 400}>
                      {node.label}
                    </text>
                    {(isHovered || isSelected) && (
                      <text x={node.x} y={node.y + 4} textAnchor="middle" fill="white" fontSize={10} fontWeight={700}>
                        {node.demand}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex gap-3">
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs dark:text-gray-400 text-gray-500 capitalize">{STATUS_LABELS[status]}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 border-t-2 border-dashed border-gray-500" />
                <span className="text-xs dark:text-gray-400 text-gray-500">Prerequisite</span>
              </div>
            </div>
          </div>

          {/* Skill Detail Panel */}
          <AnimatePresence>
            {selected && selectedDetail && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="w-72 card flex-shrink-0 self-start">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold dark:text-white text-gray-900 text-lg">{selected.label}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: STATUS_COLORS[selected.status] + '30', color: STATUS_COLORS[selected.status] }}>
                      {STATUS_LABELS[selected.status]}
                    </span>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 dark:hover:bg-gray-800 hover:bg-slate-100 rounded-lg">
                    <FiX size={16} className="dark:text-gray-400 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 dark:bg-gray-800/50 bg-slate-50 rounded-xl text-center">
                      <FiTrendingUp className="text-green-400 mx-auto mb-1" size={16} />
                      <p className="text-sm font-bold text-green-400">{selectedDetail.trend}</p>
                      <p className="text-xs dark:text-gray-400 text-gray-500">6-month demand</p>
                    </div>
                    <div className="p-3 dark:bg-gray-800/50 bg-slate-50 rounded-xl text-center">
                      <span className="text-lg">💰</span>
                      <p className="text-sm font-bold text-yellow-400">{selectedDetail.salaryImpact}</p>
                      <p className="text-xs dark:text-gray-400 text-gray-500">Salary impact</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider dark:text-gray-400 text-gray-500 mb-2 flex items-center gap-1">
                      <FiBook size={11} /> Top Resources
                    </p>
                    <div className="space-y-1.5">
                      {selectedDetail.resources.map((r, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm dark:text-gray-300 text-gray-600 p-2 dark:bg-gray-800/40 bg-slate-50 rounded-lg">
                          <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 dark:bg-gray-800/50 bg-slate-50 rounded-xl">
                    <FiUsers size={14} className="text-primary-400" />
                    <span className="text-sm dark:text-gray-300 text-gray-600">
                      <strong className="dark:text-white text-gray-900">{selectedDetail.users.toLocaleString()}</strong> platform users
                    </span>
                  </div>

                  <div className="mb-2">
                    <p className="text-xs dark:text-gray-400 text-gray-500 mb-1">Market Demand</p>
                    <div className="h-2 dark:bg-gray-700 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                        style={{ width: `${selected.demand}%` }} />
                    </div>
                    <p className="text-xs text-right dark:text-gray-400 text-gray-500 mt-0.5">{selected.demand}/100</p>
                  </div>

                  {selected.status === 'gap' && (
                    <button className="btn-primary w-full text-sm py-2">Add to Learning Path</button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Known Skills', count: mockSkillNodes.filter(n => n.status === 'known').length, color: 'text-green-400', bg: 'dark:bg-green-900/20 bg-green-50' },
            { label: 'Learning', count: mockSkillNodes.filter(n => n.status === 'learning').length, color: 'text-yellow-400', bg: 'dark:bg-yellow-900/20 bg-yellow-50' },
            { label: 'Skill Gaps', count: mockSkillNodes.filter(n => n.status === 'gap').length, color: 'text-red-400', bg: 'dark:bg-red-900/20 bg-red-50' }
          ].map(s => (
            <div key={s.label} className={`card ${s.bg} text-center`}>
              <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
