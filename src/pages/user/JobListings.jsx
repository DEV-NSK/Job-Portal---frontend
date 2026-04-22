import { useState, useEffect } from 'react'
import { jobsAPI } from '../../services/api'
import JobCard from '../../components/shared/JobCard'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { FiSearch, FiMapPin, FiFilter, FiX } from 'react-icons/fi'

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship']

export default function JobListings() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [filters, setFilters] = useState({ search: '', location: '', type: '' })
  const [applied, setApplied] = useState({ ...filters })

  const fetchJobs = async (params) => {
    setLoading(true)
    try {
      const { data } = await jobsAPI.getAll({ ...params, page, limit: 9 })
      setJobs(data.jobs)
      setTotal(data.total)
      setPages(data.pages)
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { fetchJobs(applied) }, [applied, page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setApplied({ ...filters })
  }

  const clearFilters = () => {
    setFilters({ search: '', location: '', type: '' })
    setApplied({ search: '', location: '', type: '' })
    setPage(1)
  }

  const hasFilters = applied.search || applied.location || applied.type

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="py-10 text-center">
          <h1 className="text-4xl font-bold dark:text-white text-gray-900 mb-2">Find Your Next Role</h1>
          <p className="dark:text-gray-400 text-gray-500">{total} jobs available</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="card mb-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-500 text-slate-400" size={16} />
            <input className="input-field pl-10" placeholder="Job title, company, or keyword..."
              value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
          </div>
          <div className="relative flex-1">
            <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-gray-500 text-slate-400" size={16} />
            <input className="input-field pl-10" placeholder="Location..."
              value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
          </div>
          <select className="input-field md:w-44"
            value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All Types</option>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <FiFilter size={16} /> Search
          </button>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="btn-secondary flex items-center gap-2 whitespace-nowrap">
              <FiX size={16} /> Clear
            </button>
          )}
        </form>

        {/* Results */}
        {loading ? <LoadingSkeleton count={6} /> : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">No jobs found</h3>
            <p className="dark:text-gray-400 text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map(job => <JobCard key={job._id} job={job} />)}
            </div>
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${
                      p === page
                        ? 'bg-primary-600 text-white'
                        : 'dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 bg-white text-gray-600 hover:bg-slate-100 border border-slate-200'
                    }`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
