import { useState, useEffect } from 'react'
import { jobsAPI } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiSearch, FiMapPin, FiX, FiFilter, FiGrid, FiList, FiChevronDown, 
  FiTrendingUp, FiStar, FiClock, FiUsers, FiDollarSign, FiBookmark,
  FiArrowRight, FiZap, FiTarget, FiAward, FiBell, FiUser
} from 'react-icons/fi'
import JobCard from '../../components/shared/JobCard'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'

const JOB_TYPES  = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship']
const EXPERIENCE = ['Entry Level', '1-3 years', '3-5 years', '5+ years']
const SALARY     = ['$0–50k', '$50k–100k', '$100k–150k', '$150k+']

// Featured companies data (you can make this dynamic later)
const FEATURED_COMPANIES = [
  { name: 'Google', logo: 'G', jobs: 45, color: 'from-blue-500 to-blue-600' },
  { name: 'Microsoft', logo: 'M', jobs: 32, color: 'from-green-500 to-green-600' },
  { name: 'Apple', logo: 'A', jobs: 28, color: 'from-gray-500 to-gray-600' },
  { name: 'Amazon', logo: 'A', jobs: 67, color: 'from-orange-500 to-orange-600' },
]

const TRENDING_SKILLS = ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'TypeScript']

function FilterSection({ title, options, selected, onChange }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-slate-100 dark:border-[#1e2d3d] pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-3">
        {title}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronDown size={14} className="text-slate-400 dark:text-slate-600" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
            {options.map(opt => (
              <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                <div onClick={() => onChange(opt)}
                  className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all cursor-pointer border ${
                    selected === opt
                      ? 'bg-orange-600 dark:bg-blue-600 border-orange-600 dark:border-blue-600'
                      : 'border-slate-300 dark:border-[#2d3f55] group-hover:border-orange-400 dark:group-hover:border-blue-500/50'
                  }`}>
                  {selected === opt && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className={`text-[13px] transition-colors ${selected === opt ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                  {opt}
                </span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function JobListings() {
  const [jobs, setJobs]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [pages, setPages]         = useState(1)
  const [viewMode, setViewMode]   = useState('grid')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [filters, setFilters]     = useState({ search: '', location: '', type: '', experience: '', salary: '' })
  const [applied, setApplied]     = useState({ ...filters })

  const fetchJobs = async (params) => {
    setLoading(true)
    try {
      const { data } = await jobsAPI.getAll({ ...params, page, limit: 12 })
      setJobs(data.jobs); setTotal(data.total); setPages(data.pages)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchJobs(applied) }, [applied, page])

  const handleSearch = (e) => { e.preventDefault(); setPage(1); setApplied({ ...filters }) }
  const clearAll = () => {
    const empty = { search: '', location: '', type: '', experience: '', salary: '' }
    setFilters(empty); setApplied(empty); setPage(1)
  }
  const activeCount = Object.values(applied).filter(Boolean).length

  const FilterPanel = () => (
    <div>
      <div className="flex items-center justify-between mb-5">
        <span className="text-[14px] font-semibold text-slate-800 dark:text-white">Filters</span>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-[12px] text-orange-600 dark:text-blue-400 hover:text-orange-700 dark:hover:text-blue-300 transition-colors">
            Clear all ({activeCount})
          </button>
        )}
      </div>
      <FilterSection title="Job Type"    options={JOB_TYPES}  selected={filters.type}
        onChange={v => setFilters(f => ({ ...f, type: f.type === v ? '' : v }))} />
      <FilterSection title="Experience"  options={EXPERIENCE}  selected={filters.experience}
        onChange={v => setFilters(f => ({ ...f, experience: f.experience === v ? '' : v }))} />
      <FilterSection title="Salary Range" options={SALARY}    selected={filters.salary}
        onChange={v => setFilters(f => ({ ...f, salary: f.salary === v ? '' : v }))} />
      <button onClick={() => { setPage(1); setApplied({ ...filters }); setShowMobileFilters(false) }}
        className="btn-primary w-full mt-4 py-2.5 text-[13px]">
        Apply Filters
      </button>
    </div>
  )

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#060912] dark:via-[#0a0f1c] dark:to-[#060912]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 dark:from-blue-500/10 dark:to-blue-600/10 border border-orange-200 dark:border-blue-500/20 mb-6"
          >
            <FiZap size={16} className="text-orange-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-blue-300">Find Your Dream Job</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
          >
            Discover Amazing
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent"> Opportunities</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto"
          >
            {loading ? 'Loading amazing opportunities...' : `${total.toLocaleString()} positions available from top companies worldwide`}
          </motion.p>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: FiUsers, label: 'Active Employers', value: '500+', color: 'text-blue-600' },
              { icon: FiTrendingUp, label: 'Jobs Posted', value: total.toLocaleString(), color: 'text-green-600' },
              { icon: FiStar, label: 'Success Rate', value: '94%', color: 'text-yellow-600' },
              { icon: FiAward, label: 'Happy Hires', value: '10k+', color: 'text-purple-600' }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
                <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced Search Bar */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSearch} 
          className="relative mb-8 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-[#0d1117] shadow-md border border-slate-200 dark:border-[#1e2d3d]">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                className="w-full pl-10 pr-3 py-2.5 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none"
                placeholder="Search jobs..."
                value={filters.search} 
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} 
              />
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-[#1e2d3d]" />
            <div className="relative w-40">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                className="w-full pl-10 pr-3 py-2.5 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none"
                placeholder="Location..."
                value={filters.location} 
                onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} 
              />
            </div>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-1.5"
            >
              <span>Search</span>
              <FiArrowRight size={14} />
            </button>
          </div>
          
          {/* Mobile Filters Button */}
          <button 
            type="button" 
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden absolute -bottom-14 right-0 btn-secondary gap-2"
          >
            <FiFilter size={14} /> Filters
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-orange-600 dark:bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">{activeCount}</span>
            )}
          </button>
        </motion.form>

        {/* Trending Skills */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <FiTrendingUp size={18} className="text-orange-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Trending Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SKILLS.map((skill, i) => (
              <motion.button
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilters(f => ({ ...f, search: skill }))}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:from-orange-100 hover:to-orange-200 dark:hover:from-blue-900/50 dark:hover:to-blue-800/50 hover:text-orange-700 dark:hover:text-blue-300 transition-all duration-200"
              >
                {skill}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Active Filters */}
        {activeCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {Object.entries(applied).map(([key, val]) => val && (
              <span key={key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium
                                         text-orange-700 dark:text-blue-300 bg-orange-50 dark:bg-blue-500/10 border border-orange-200 dark:border-blue-500/20">
                {val}
                <button onClick={() => { const n = { ...filters, [key]: '' }; setFilters(n); setApplied(n) }}>
                  <FiX size={11} />
                </button>
              </span>
            ))}
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Enhanced Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="space-y-6">
              {/* Filters */}
              <div className="card p-6">
                <FilterPanel />
              </div>

              {/* Featured Companies */}
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <FiStar size={16} className="text-orange-600 dark:text-blue-400" />
                  Featured Companies
                </h3>
                <div className="space-y-3">
                  {FEATURED_COMPANIES.map((company, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer group"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${company.color} flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform`}>
                        {company.logo}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-blue-400 transition-colors">{company.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">{company.jobs} open positions</div>
                      </div>
                      <FiArrowRight size={14} className="text-slate-400 group-hover:text-orange-600 dark:group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <FiTarget size={16} className="text-orange-600 dark:text-blue-400" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm text-slate-700 dark:text-slate-300">
                    <FiBookmark size={14} className="inline mr-2" />
                    Saved Jobs
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm text-slate-700 dark:text-slate-300">
                    <FiClock size={14} className="inline mr-2" />
                    Recent Applications
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm text-slate-700 dark:text-slate-300">
                    <FiDollarSign size={14} className="inline mr-2" />
                    Salary Insights
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {!loading && `${total.toLocaleString()} Jobs Found`}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Discover your next career opportunity
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#1e2d3d] shadow-sm">
                  {[{ mode: 'grid', Icon: FiGrid }, { mode: 'list', Icon: FiList }].map(({ mode, Icon }) => (
                    <button key={mode} onClick={() => setViewMode(mode)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                        viewMode === mode 
                          ? 'bg-orange-600 dark:bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
                      }`}>
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <LoadingSkeleton count={6} variant={viewMode} />
                </motion.div>
              ) : jobs.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 dark:from-blue-500/10 dark:to-blue-600/10 border border-orange-200 dark:border-blue-500/20 flex items-center justify-center text-orange-600 dark:text-blue-400 mb-6">
                    <FiSearch size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No jobs found</h3>
                  <p className="text-slate-500 dark:text-slate-500 mb-6 max-w-md">
                    We couldn't find any jobs matching your criteria. Try adjusting your search or filters.
                  </p>
                  <button onClick={clearAll} className="btn-primary">Clear all filters</button>
                </motion.div>
              ) : (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 auto-rows-fr' 
                    : 'space-y-4'
                  }>
                    {jobs.map((job, i) => (
                      <motion.div
                        key={job._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="h-full"
                      >
                        <JobCard job={job} index={i} viewMode={viewMode} />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Enhanced Pagination */}
                  {pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
                        <motion.button 
                          key={p} 
                          onClick={() => setPage(p)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                            p === page
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 dark:from-blue-500 dark:to-blue-600 text-white shadow-lg shadow-orange-500/25 dark:shadow-blue-500/25'
                              : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}>
                          {p}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-80 z-50 lg:hidden overflow-y-auto
                         bg-white dark:bg-[#0d1117] border-l border-slate-200 dark:border-[#1e2d3d] shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <FilterPanel />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Button for Quick Actions */}

    </div>
  )
}