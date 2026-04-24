import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { employerAPI, jobAPI } from '../services/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiArrowLeft, FiMapPin, FiGlobe, FiUsers, FiCalendar,
  FiBriefcase, FiExternalLink, FiAward, FiHeart
} from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function CompanyProfile() {
  const { employerId } = useParams()
  const navigate = useNavigate()
  const [employer, setEmployer] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs first (always works)
        const jobsRes = await jobAPI.getEmployerJobs(employerId);
        setJobs(jobsRes.data);

        // Try to fetch employer profile
        try {
          const empRes = await employerAPI.getEmployerProfile(employerId);
          setEmployer(empRes.data.employer);
        } catch (profileError) {
          // If profile fetch fails, create basic profile from jobs or show minimal info
          if (jobsRes.data.length > 0) {
            const firstJob = jobsRes.data[0];
            setEmployer({
              companyName: firstJob.companyName || 'Company',
              companyLogo: firstJob.companyLogo || '',
              location: firstJob.location || '',
              industry: firstJob.category || '',
              description: `${firstJob.companyName || 'This company'} is actively hiring. Check out their open positions below.`,
              website: '',
              companySize: '',
              culture: '',
              benefits: '',
              founded: ''
            });
          } else {
            // No jobs and no profile - show minimal company page
            setEmployer({
              companyName: 'Company Profile',
              companyLogo: '',
              location: '',
              industry: '',
              description: 'This company is setting up their profile. Check back soon for more information.',
              website: '',
              companySize: '',
              culture: '',
              benefits: '',
              founded: ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
        toast.error('Unable to load company profile');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employerId, navigate])

  if (loading) return (
    <div className="fixed inset-0 pt-16 bg-slate-50 dark:bg-[#060912] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!employer) return null

  return (
    <div className="fixed inset-0 pt-16 bg-slate-50 dark:bg-[#060912] overflow-hidden">
      <div className="h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors mb-4 flex-shrink-0">
          <FiArrowLeft size={16} /> Back
        </button>

        {/* Single Container Card */}
        <div className="card flex-1 min-h-0 overflow-hidden flex flex-col">
          
          {/* Company Header */}
          <div className="flex-shrink-0 pb-6 border-b border-slate-200 dark:border-[#1e2d3d]">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center overflow-hidden text-3xl font-bold text-white shadow-lg flex-shrink-0">
                {employer.companyLogo
                  ? <img src={employer.companyLogo} alt="" className="w-full h-full object-cover" />
                  : employer.companyName?.[0]?.toUpperCase()}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{employer.companyName}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  {employer.industry && (
                    <span className="text-orange-600 dark:text-blue-400 font-semibold">{employer.industry}</span>
                  )}
                  {employer.location && (
                    <span className="flex items-center gap-1.5">
                      <FiMapPin size={14} />
                      {employer.location}
                    </span>
                  )}
                  {employer.companySize && (
                    <span className="flex items-center gap-1.5">
                      <FiUsers size={14} />
                      {employer.companySize}
                    </span>
                  )}
                  {employer.founded && (
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={14} />
                      Founded {employer.founded}
                    </span>
                  )}
                  {employer.website && (
                    <a href={employer.website} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-orange-600 dark:text-blue-400 hover:text-orange-700 dark:hover:text-blue-300 transition-colors font-medium">
                      <FiGlobe size={14} />
                      Website
                      <FiExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section - Scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* About Section */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <FiBriefcase size={18} className="text-orange-600 dark:text-blue-400" />
                    About Company
                  </h3>
                  {employer.description ? (
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{employer.description}</p>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-500 italic">No description available</p>
                  )}
                </div>

                {/* Culture Section */}
                {employer.culture && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <FiHeart size={18} className="text-orange-600 dark:text-blue-400" />
                      Company Culture
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{employer.culture}</p>
                  </div>
                )}

                {/* Benefits Section */}
                {employer.benefits && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <FiAward size={18} className="text-orange-600 dark:text-blue-400" />
                      Benefits & Perks
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{employer.benefits}</p>
                  </div>
                )}
              </div>

              {/* Sidebar - Open Positions */}
              <div className="lg:col-span-1">
                <div className="sticky top-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Open Positions
                    </h3>
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-orange-100 dark:bg-blue-500/10 text-orange-700 dark:text-blue-400 border border-orange-200 dark:border-blue-500/20">
                      {jobs.length}
                    </span>
                  </div>
                  
                  {jobs.length > 0 ? (
                    <div className="space-y-3">
                      {jobs.map((job) => (
                        <div
                          key={job._id}
                          onClick={() => navigate(`/jobs/${job._id}`)}
                          className="p-4 rounded-lg border border-slate-200 dark:border-[#1e2d3d] bg-white dark:bg-white/[0.02] hover:border-orange-300 dark:hover:border-blue-500/40 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {job.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 mb-3">
                            <FiMapPin size={11} />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium px-2 py-1 rounded-md bg-orange-50 dark:bg-blue-500/10 text-orange-700 dark:text-blue-400 border border-orange-200 dark:border-blue-500/20">
                              {job.type}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-600">
                              {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4 rounded-lg border border-slate-200 dark:border-[#1e2d3d] bg-slate-50 dark:bg-white/[0.02]">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                        <FiBriefcase size={24} className="text-slate-400 dark:text-slate-600" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">No open positions</p>
                      <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Check back later for opportunities</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
