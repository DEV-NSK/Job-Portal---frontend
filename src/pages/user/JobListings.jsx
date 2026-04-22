import { useState, useEffect } from 'react'
import { jobsAPI } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiMapPin, FiX, FiFilter, FiGrid, FiList, FiChevronDown } from 'react-icons/fi'
import JobCard from '../../components/shared/JobCard'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'

const JOB_TYPES  = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship']
const EXPERIENCE = ['Entry Level', '1-3 years', '3-5 years', '5+ years']
const SALARY     = ['$0–50k', '$50k–100k', '$100k–150k', '$150k+']

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
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'border-slate-300 dark:border-[#2d3f55] group-hover:border-indigo-400 dark:group-hover:border-indigo-500/50'
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
          <button onClick={clearAll} className="text-[12px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
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
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-[#060912]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Jobs</div>
          <h1 className="text-[26px] font-bold text-slate-900 dark:text-white mb-1">Find your next role</h1>
          <p className="text-[14px] text-slate-500 dark:text-slate-500">
            {loading ? 'Loading...' : `${total.toLocaleString()} positions available`}
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input className="input-field pl-10" placeholder="Job title, company, or keyword..."
              value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
          </div>
          <div className="relative sm:w-52">
            <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input className="input-field pl-10" placeholder="Location..."
              value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary px-6 flex-shrink-0">Search</button>
          <button type="button" onClick={() => setShowMobileFilters(true)}
            className="lg:hidden btn-secondary gap-2 flex-shrink-0">
            <FiFilter size={14} /> Filters
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">{activeCount}</span>
            )}
          </button>
        </form>

        {/* Active chips */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(applied).map(([key, val]) => val && (
              <span key={key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium
                                         text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
                {val}
                <button onClick={() => { const n = { ...filters, [key]: '' }; setFilters(n); setApplied(n) }}>
                  <FiX size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Layout */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="card sticky top-24"><FilterPanel /></div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[13px] text-slate-500 dark:text-slate-600">
                {!loading && `${total.toLocaleString()} jobs found`}
              </span>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#1e2d3d]">
                {[{ mode: 'grid', Icon: FiGrid }, { mode: 'list', Icon: FiList }].map(({ mode, Icon }) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                      viewMode === mode ? 'bg-indigo-600 text-white' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
                    }`}>
                    <Icon size={13} />
                  </button>
                ))}
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
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
                    <FiSearch size={24} />
                  </div>
                  <h3 className="text-[18px] font-semibold text-slate-900 dark:text-white mb-2">No jobs found</h3>
                  <p className="text-[14px] text-slate-500 mb-5">Try adjusting your search or filters</p>
                  <button onClick={clearAll} className="btn-secondary text-[13px]">Clear filters</button>
                </motion.div>
              ) : (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
                    {jobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
                  </div>
                  {pages > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-10">
                      {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-xl text-[13px] font-medium transition-all ${
                            p === page
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                              : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-72 z-50 lg:hidden overflow-y-auto
                         bg-white dark:bg-[#0d1117] border-l border-slate-200 dark:border-[#1e2d3d]">
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[15px] font-semibold text-slate-900 dark:text-white">Filters</span>
                  <button onClick={() => setShowMobileFilters(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                    <FiX size={16} />
                  </button>
                </div>
                <FilterPanel />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
